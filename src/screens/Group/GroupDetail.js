import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, TextInput,
    KeyboardAvoidingView, Platform, ActivityIndicator, Linking,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { io } from 'socket.io-client';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import CustomText from '../../components/TextComponent';
import { ActionMenu, ConfirmDialog } from '../../components/ActionMenu';
import InviteLinkModal from './InviteLinkModal';
import GroupMembersModal from './GroupMembersModal';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { GROUP_BASE_URL, groupApiGet, groupApiDelete } from '../../utils/GroupApi';
import { uploadChatImage } from '../../utils/uploadHelpers';
import { ToastMsg } from '../../utils/helperFunctions';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// Group chat room — web's Pages/Chat/Group/GroupDetail.jsx:
// live messages over socket.io (same backend as REST), reply, edit, delete,
// typing indicators, seen receipts, photo/video attachments, channel (admin-only) mode.
const GroupDetail = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
    const c = profilePalette(isDarkMode, accent);
    const groupId = route?.params?.groupId;

    const rawUser = useSelector(state => state?.user?.userData);
    const selector = useMemo(() => {
        if (rawUser && Object.keys(rawUser).length !== 0) {
            try { return JSON.parse(rawUser); } catch { return {}; }
        }
        return {};
    }, [rawUser]);
    const currentUserId = selector?._id;

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]); // newest first (list is inverted)
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [editing, setEditing] = useState(null);
    const [typingUsers, setTypingUsers] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [msgMenu, setMsgMenu] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [membersVisible, setMembersVisible] = useState(false);
    const [inviteVisible, setInviteVisible] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmLeave, setConfirmLeave] = useState(false);
    const socket = useRef(null);
    const typingTimer = useRef(null);

    const isOwner = !!(group?.CreatedBy && currentUserId && String(group.CreatedBy) === String(currentUserId));
    // Admin = creator or any member promoted via Make Admin (same as web's currentUserIsAdmin)
    const isAdmin = isOwner || members.some(m => m?.User?._id === currentUserId && m?.Role === 'admin');
    // Channels: only admins can post
    const canSend = !group?.IsChannel || isAdmin;

    const me = useMemo(() => ({ _id: currentUserId, FullName: selector?.FullName || selector?.UserName || 'Someone' }), [currentUserId, selector]);

    const loadAll = async () => {
        try {
            const [g, msgs, mem] = await Promise.all([
                groupApiGet(`/api/user/GetGroupDetail/${groupId}`),
                groupApiGet(`/api/user/GetGroupAllMessages/${groupId}`),
                groupApiGet(`/api/user/GetAllMembers/${groupId}`),
            ]);
            setGroup(g?.data || null);
            setMessages((msgs?.data || []).slice().reverse());
            setMembers(mem?.data || []);
        } catch (error) {
            console.log('GroupDetail load error', error);
            ToastMsg(error?.message || 'Could not load the group');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { if (groupId) loadAll(); }, [groupId]));

    // ── Socket (same host as REST / web) ───────────────────────────────────────
    useEffect(() => {
        if (!groupId || !currentUserId) return;

        const s = io(GROUP_BASE_URL, { transports: ['websocket'] });
        socket.current = s;
        s.emit('joinGroup', { groupId });

        s.on('receiveGroupMessage', msg => {
            setMessages(prev => (prev.some(m => m?._id === msg?._id) ? prev : [msg, ...prev]));
        });
        const patch = updated => setMessages(prev => prev.map(m => (m?._id === updated?._id ? { ...m, ...updated } : m)));
        s.on('groupMessageEdited', patch);
        s.on('groupMessageDeleted', patch);

        s.on('groupUserTyping', user => {
            if (!user || user._id === currentUserId) return;
            setTypingUsers(prev => (prev.some(u => u._id === user._id) ? prev : [...prev, user]));
        });
        s.on('groupUserStopTyping', user => {
            if (user) setTypingUsers(prev => prev.filter(u => u._id !== user._id));
        });
        s.on('groupMessageSeen', ({ messageId, userId }) => {
            setMessages(prev => prev.map(m => (
                m?._id === messageId ? { ...m, SeenBy: Array.from(new Set([...(m.SeenBy || []), userId])) } : m
            )));
        });

        return () => {
            s.emit('leaveGroup', { groupId });
            s.disconnect();
            if (typingTimer.current) clearTimeout(typingTimer.current);
        };
    }, [groupId, currentUserId]);

    // mark the newest incoming message as seen
    useEffect(() => {
        const last = messages[0];
        const senderId = last?.Sender?._id || last?.Sender;
        if (last && senderId !== currentUserId && !last?.SeenBy?.includes(currentUserId)) {
            socket.current?.emit('groupMessageSeen', { messageId: last._id, userId: currentUserId });
        }
    }, [messages, currentUserId]);

    // ── Composer ───────────────────────────────────────────────────────────────
    const onChangeText = useCallback(text => {
        setInputText(text);
        if (!socket.current) return;
        socket.current.emit('groupTyping', { groupId, user: me });
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => socket.current?.emit('groupStopTyping', { groupId, user: me }), 1500);
    }, [groupId, me]);

    const resetComposer = useCallback(() => { setInputText(''); setReplyTo(null); setEditing(null); }, []);

    const handleSend = useCallback(() => {
        const text = inputText.trim();
        if (!canSend || !text || !groupId || !currentUserId || !socket.current) return;

        if (editing) {
            socket.current.emit('editGroupMessage', { messageId: editing._id, content: text });
        } else {
            socket.current.emit('sendGroupMessage', {
                groupId,
                sender: currentUserId,
                content: text,
                type: 'text',
                attachments: '',
                replyTo: replyTo?._id || '',
            });
        }
        socket.current.emit('groupStopTyping', { groupId, user: me });
        resetComposer();
    }, [inputText, canSend, groupId, currentUserId, editing, replyTo, me, resetComposer]);

    const handleAttach = useCallback(() => {
        if (!canSend || uploading) return;
        launchImageLibrary({ mediaType: 'mixed', selectionLimit: 1 }, async response => {
            const asset = response?.assets?.[0];
            if (response?.didCancel || !asset?.uri) return;
            try {
                setUploading(true);
                const url = await uploadChatImage(asset);
                const isVideo = (asset.type || '').startsWith('video');
                socket.current?.emit('sendGroupMessage', {
                    groupId,
                    sender: currentUserId,
                    message: '',
                    type: isVideo ? 'video' : 'image',
                    mediaUrl: url,
                    fileName: asset.fileName,
                    fileSize: asset.fileSize,
                    isSent: true,
                    isRead: false,
                    timestamp: new Date(),
                });
            } catch (e) {
                ToastMsg(e?.message || 'Upload failed');
            } finally {
                setUploading(false);
            }
        });
    }, [canSend, uploading, groupId, currentUserId]);

    const startEdit = useCallback(msg => { setEditing(msg); setReplyTo(null); setInputText(msg?.Content || ''); }, []);
    const startReply = useCallback(msg => { setReplyTo(msg); setEditing(null); }, []);
    const deleteMessage = useCallback(msg => socket.current?.emit('deleteGroupMessage', { messageId: msg._id }), []);

    const messageMenuOptions = useMemo(() => {
        const m = msgMenu;
        if (!m || m.IsDeleted) return [];
        const mine = (m?.Sender?._id || m?.Sender) === currentUserId;
        return [
            ...(canSend ? [{ label: 'Reply', icon: 'corner-up-left', onPress: () => startReply(m) }] : []),
            ...(mine && (m.type === 'text' || !m.type) ? [{ label: 'Edit', icon: 'edit-2', onPress: () => startEdit(m) }] : []),
            ...(mine ? [{ label: 'Delete', icon: 'trash-2', destructive: true, onPress: () => deleteMessage(m) }] : []),
        ];
    }, [msgMenu, currentUserId, canSend, startReply, startEdit, deleteMessage]);

    // ── Group actions ──────────────────────────────────────────────────────────
    const menuOptions = useMemo(() => {
        const base = [{ label: 'View Members', icon: 'users', onPress: () => setMembersVisible(true) }];
        if (isAdmin) {
            return [
                ...base,
                { label: 'Edit Group', icon: 'edit-2', onPress: () => navigation.navigate('AddGroup', { group }) },
                { label: 'Generate Invite Link', icon: 'link', onPress: () => setInviteVisible(true) },
                ...(isOwner
                    ? [{ label: 'Delete Group', icon: 'trash-2', destructive: true, onPress: () => setConfirmDelete(true) }]
                    : [{ label: 'Leave Group', icon: 'log-out', destructive: true, onPress: () => setConfirmLeave(true) }]),
            ];
        }
        return [...base, { label: 'Leave Group', icon: 'log-out', destructive: true, onPress: () => setConfirmLeave(true) }];
    }, [isAdmin, isOwner, group, navigation]);

    const deleteGroup = async () => {
        try {
            const res = await groupApiDelete(`/api/user/DeleteGroup/${groupId}`);
            ToastMsg(res?.message || 'Group deleted');
            navigation.goBack();
        } catch (error) {
            ToastMsg(error?.message || 'Failed to delete group');
        }
    };

    const leaveGroup = async () => {
        try {
            const res = await groupApiDelete(`/api/user/LeaveGroup/${groupId}`);
            if (res?.statusCode === 200) {
                ToastMsg(res?.message || 'You left the group');
                navigation.goBack();
            } else {
                ToastMsg(res?.message || 'Failed to leave group');
            }
        } catch (error) {
            ToastMsg(error?.message || 'Failed to leave group');
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    const findMessage = useCallback(id => messages.find(m => m?._id === (id?._id || id)), [messages]);
    const lastOwnId = useMemo(
        () => messages.find(m => (m?.Sender?._id || m?.Sender) === currentUserId && !m?.IsDeleted)?._id,
        [messages, currentUserId],
    );

    const renderBody = (item, mine) => {
        if (item?.IsDeleted) return <CustomText style={[styles.msgText, { color: mine ? '#fff' : c.muted, fontStyle: 'italic', opacity: 0.8 }]}>This message was deleted</CustomText>;
        if (item?.type === 'image' && item?.mediaUrl) {
            return <Image source={{ uri: item.mediaUrl }} style={styles.media} resizeMode="cover" />;
        }
        if (item?.type === 'video' && item?.mediaUrl) {
            return (
                <TouchableOpacity style={[styles.media, styles.videoBox]} onPress={() => Linking.openURL(item.mediaUrl).catch(() => {})}>
                    <Icon name="play-circle" size={40} color="#fff" />
                </TouchableOpacity>
            );
        }
        if (item?.mediaUrl) {
            return (
                <TouchableOpacity onPress={() => Linking.openURL(item.mediaUrl).catch(() => {})} style={styles.fileRow}>
                    <Icon name="file-text" size={18} color={mine ? '#fff' : accent} />
                    <CustomText style={[styles.msgText, { color: mine ? '#fff' : c.text, marginLeft: 8 }]} numberOfLines={1}>{item?.fileName || 'Attachment'}</CustomText>
                </TouchableOpacity>
            );
        }
        return <CustomText style={[styles.msgText, { color: mine ? '#fff' : c.text }]}>{item?.Content}</CustomText>;
    };

    const renderItem = ({ item }) => {
        const senderId = item?.Sender?._id || item?.Sender;
        const mine = senderId === currentUserId;
        const replied = item?.ReplyTo ? findMessage(item.ReplyTo) : null;
        return (
            <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
                {!mine && (
                    <Image
                        source={item?.Sender?.Image ? { uri: item.Sender.Image } : IMG.MessageProfile}
                        style={styles.senderAvatar}
                    />
                )}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={() => !item?.IsDeleted && setMsgMenu(item)}
                    style={{ maxWidth: '78%' }}>
                    {!mine && (
                        <CustomText style={[styles.senderName, { color: accent }]}>
                            {item?.Sender?.FullName || item?.Sender?.UserName}
                        </CustomText>
                    )}
                    <View style={[
                        styles.bubble,
                        mine
                            ? { backgroundColor: accent, borderBottomRightRadius: 6 }
                            : { backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderBottomLeftRadius: 6 },
                    ]}>
                        {!!replied && !item?.IsDeleted && (
                            <View style={[styles.quote, { backgroundColor: mine ? 'rgba(255,255,255,0.18)' : c.chip, borderLeftColor: mine ? '#fff' : accent }]}>
                                <CustomText style={[styles.quoteName, { color: mine ? '#fff' : accent }]} numberOfLines={1}>
                                    {replied?.Sender?.FullName || 'Message'}
                                </CustomText>
                                <CustomText style={[styles.quoteText, { color: mine ? '#fff' : c.muted }]} numberOfLines={1}>
                                    {replied?.IsDeleted ? 'This message was deleted' : (replied?.Content || replied?.fileName || 'Attachment')}
                                </CustomText>
                            </View>
                        )}
                        {renderBody(item, mine)}
                        <View style={styles.metaRow}>
                            {item?.IsEdited && !item?.IsDeleted && <CustomText style={[styles.meta, { color: mine ? 'rgba(255,255,255,0.8)' : c.muted }]}>edited · </CustomText>}
                            <CustomText style={[styles.meta, { color: mine ? 'rgba(255,255,255,0.8)' : c.muted }]}>
                                {moment(item?.createdAt).format('hh:mm A')}
                            </CustomText>
                        </View>
                    </View>
                    {mine && item?._id === lastOwnId && (
                        <CustomText style={[styles.seen, { color: c.muted }]}>
                            {item?.SeenBy?.length > 0 ? `Seen by ${item.SeenBy.length}` : 'Sent'}
                        </CustomText>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: c.screen }]}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
                <View style={styles.center}><ActivityIndicator color={accent} size="large" /></View>
            </View>
        );
    }

    const typingLabel = typingUsers.length
        ? `${typingUsers.slice(0, 2).map(u => u.FullName).join(', ')}${typingUsers.length > 2 ? ' and others' : ''} typing…`
        : null;

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: c.screen }]} behavior="padding">
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: c.card, borderBottomColor: c.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: c.chip }]}>
                    <Icon name="arrow-left" size={20} color={c.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMembersVisible(true)} style={styles.headerInfo} activeOpacity={0.8}>
                    {group?.Avatar ? (
                        <Image source={{ uri: group.Avatar }} style={[styles.avatar, { borderColor: accent }]} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarFallback, { borderColor: accent, backgroundColor: accent + '22' }]}>
                            <CustomText style={{ color: accent, fontFamily: FONTS_FAMILY.SourceSans3_Bold, fontSize: 16 }}>
                                {(group?.Name || '?').charAt(0).toUpperCase()}
                            </CustomText>
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        <CustomText numberOfLines={1} style={[styles.groupName, { color: c.text }]}>{group?.Name}</CustomText>
                        <CustomText numberOfLines={1} style={[styles.sub, { color: typingLabel ? accent : c.muted }]}>
                            {typingLabel || `${members?.length || group?.MembersCount || 0} members${group?.IsChannel ? ' · Channel' : ''}`}
                        </CustomText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: c.chip }]} onPress={() => setMenuVisible(true)}>
                    <Icon name="more-vertical" size={20} color={c.text} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item, index) => item?._id || String(index)}
                inverted
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 14 }}
                ListEmptyComponent={
                    <View style={[styles.empty, { transform: [{ scaleY: -1 }] }]}>
                        <Icon name="message-circle" size={34} color={c.muted} />
                        <CustomText style={{ color: c.muted, marginTop: 10 }}>No messages yet — say hi!</CustomText>
                    </View>
                }
            />

            {/* Composer */}
            {canSend ? (
                <View style={[styles.composer, { backgroundColor: c.card, borderTopColor: c.border, paddingBottom: Math.max(insets.bottom, 10) }]}>
                    {(replyTo || editing) && (
                        <View style={[styles.banner, { backgroundColor: c.chip, borderLeftColor: accent }]}>
                            <View style={{ flex: 1 }}>
                                <CustomText style={[styles.bannerTitle, { color: accent }]}>
                                    {editing ? 'Editing message' : `Replying to ${replyTo?.Sender?.FullName || ''}`}
                                </CustomText>
                                <CustomText numberOfLines={1} style={{ color: c.muted, fontSize: 12 }}>
                                    {(editing || replyTo)?.Content || (editing || replyTo)?.fileName || 'Attachment'}
                                </CustomText>
                            </View>
                            <TouchableOpacity onPress={resetComposer} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <Icon name="x" size={18} color={c.muted} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.inputRow}>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: c.chip }]} onPress={handleAttach} disabled={uploading}>
                            {uploading ? <ActivityIndicator size="small" color={accent} /> : <Icon name="paperclip" size={18} color={c.text} />}
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, { backgroundColor: c.chip, color: c.text }]}
                            placeholder="Write a message..."
                            placeholderTextColor={c.muted}
                            value={inputText}
                            onChangeText={onChangeText}
                            onSubmitEditing={handleSend}
                            multiline
                        />
                        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: accent, opacity: inputText.trim() ? 1 : 0.5 }]} onPress={handleSend} disabled={!inputText.trim()}>
                            <Icon name={editing ? 'check' : 'send'} size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={[styles.composer, { backgroundColor: c.card, borderTopColor: c.border, paddingBottom: Math.max(insets.bottom, 12), paddingTop: 12 }]}>
                    <CustomText style={{ textAlign: 'center', color: c.muted }}>Only admins can send messages in this channel</CustomText>
                </View>
            )}

            <ActionMenu visible={!!msgMenu} onClose={() => setMsgMenu(null)} title="Message" options={messageMenuOptions} />
            <ActionMenu visible={menuVisible} onClose={() => setMenuVisible(false)} title={group?.Name} options={menuOptions} />
            <GroupMembersModal
                visible={membersVisible}
                onClose={() => setMembersVisible(false)}
                groupId={groupId}
                members={members}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
                onMemberRemoved={removed => setMembers(prev => prev.filter(m => m?._id !== removed?._id))}
                onMemberPromoted={promoted => setMembers(prev => prev.map(m => (m?._id === promoted?._id ? { ...m, Role: 'admin' } : m)))}
            />
            <InviteLinkModal visible={inviteVisible} onClose={() => setInviteVisible(false)} groupId={groupId} />
            <ConfirmDialog
                visible={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                title="Delete Group"
                message="This deletes the group, all messages, and all members. This cannot be undone."
                onConfirm={deleteGroup}
            />
            <ConfirmDialog
                visible={confirmLeave}
                onClose={() => setConfirmLeave(false)}
                title="Leave Group"
                message="Are you sure you want to leave this group?"
                onConfirm={leaveGroup}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
    iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5 },
    avatarFallback: { alignItems: 'center', justifyContent: 'center' },
    groupName: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    sub: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 1 },
    row: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 10, alignItems: 'flex-end' },
    rowMine: { justifyContent: 'flex-end' },
    rowTheirs: { justifyContent: 'flex-start' },
    senderAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8, marginBottom: 4 },
    senderName: { fontSize: 12, marginBottom: 3, marginLeft: 4, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
    bubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
    msgText: { fontSize: 15, lineHeight: 21, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    metaRow: { flexDirection: 'row', alignSelf: 'flex-end', marginTop: 3 },
    meta: { fontSize: 10 },
    seen: { fontSize: 11, alignSelf: 'flex-end', marginTop: 2, marginRight: 4 },
    media: { width: 220, height: 220, borderRadius: 12 },
    videoBox: { backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
    fileRow: { flexDirection: 'row', alignItems: 'center', maxWidth: 200 },
    quote: { borderLeftWidth: 3, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginBottom: 6 },
    quoteName: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    quoteText: { fontSize: 12 },
    empty: { alignItems: 'center', marginTop: 60 },
    composer: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingTop: 10 },
    banner: { flexDirection: 'row', alignItems: 'center', borderLeftWidth: 3, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 8 },
    bannerTitle: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
    input: { flex: 1, minHeight: 40, maxHeight: 110, borderRadius: 20, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
    sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});

export default GroupDetail;
