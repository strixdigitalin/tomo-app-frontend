import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { io } from 'socket.io-client';
import moment from 'moment';
import CustomText from '../../components/TextComponent';
import SafeImage from '../../components/SafeImage';
import Row from '../../components/wrapper/row';
import { ActionMenu, ConfirmDialog } from '../../components/ActionMenu';
import InviteLinkModal from './InviteLinkModal';
import GroupMembersModal from './GroupMembersModal';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { white } from '../../common/Colors/colors';
import { GROUP_BASE_URL, groupApiGet, groupApiDelete } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import useThemeColor from '../../utils/useThemeColor';
import Icon from 'react-native-vector-icons/Feather';

// The group chat room — matches web's Pages/Chat/Group/GroupDetail.jsx.
// Connects to the local dev backend (not yet live in production), same as
// the rest of this module (see GroupApi.js). Message edit/delete and typing
// indicators exist on the backend but are skipped here to ship the core
// create/join/chat/manage flow fast — safe to add later without touching
// anything else, since they're additive socket listeners.
const GroupDetail = ({ navigation, route }) => {
    const { isDarkMode, primaryColor } = useThemeColor();
    const groupId = route?.params?.groupId;

    const rawUser = useSelector(state => state?.user?.userData);
    const selector = useMemo(() => {
        if (rawUser && Object.keys(rawUser).length !== 0) {
            try { return JSON.parse(rawUser) } catch { return {} }
        }
        return {}
    }, [rawUser]);
    const currentUserId = selector?._id;

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [membersVisible, setMembersVisible] = useState(false);
    const [inviteVisible, setInviteVisible] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmLeave, setConfirmLeave] = useState(false);
    const socket = useRef(null);

    const isAdmin = group?.CreatedBy && currentUserId && String(group.CreatedBy) === String(currentUserId);

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
            ToastMsg(error?.message || 'Could not reach local group backend — is it running?');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (groupId) loadAll();
        }, [groupId])
    );

    useEffect(() => {
        if (!groupId) return;

        socket.current = io(GROUP_BASE_URL, { transports: ['websocket'] });
        socket.current.emit('joinGroup', { groupId });

        socket.current.on('receiveGroupMessage', (msg) => {
            setMessages((prev) => {
                if (prev.some((m) => m?._id === msg?._id)) return prev;
                return [msg, ...prev];
            });
        });

        socket.current.on('groupMessageDeleted', (msg) => {
            setMessages((prev) => prev.map((m) => (m?._id === msg?._id ? msg : m)));
        });

        socket.current.on('groupMessageEdited', (msg) => {
            setMessages((prev) => prev.map((m) => (m?._id === msg?._id ? msg : m)));
        });

        return () => {
            socket.current?.emit('leaveGroup', { groupId });
            socket.current?.disconnect();
        };
    }, [groupId]);

    const handleSend = useCallback(() => {
        if (!inputText.trim() || !groupId || !currentUserId || !socket.current) return;

        socket.current.emit('sendGroupMessage', {
            groupId,
            sender: currentUserId,
            content: inputText.trim(),
            type: 'text',
        });

        setInputText('');
    }, [inputText, groupId, currentUserId]);

    const menuOptions = useMemo(() => {
        const base = [{ label: 'View Members', icon: 'users', onPress: () => setMembersVisible(true) }];
        if (isAdmin) {
            return [
                ...base,
                { label: 'Generate Invite Link', icon: 'link', onPress: () => setInviteVisible(true) },
                { label: 'Delete Group', icon: 'trash-2', destructive: true, onPress: () => setConfirmDelete(true) },
            ];
        }
        return [...base, { label: 'Leave Group', icon: 'log-out', destructive: true, onPress: () => setConfirmLeave(true) }];
    }, [isAdmin]);

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

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff' },
        header: {
            paddingTop: 50, paddingHorizontal: 16, paddingBottom: 14,
            flexDirection: 'row', alignItems: 'center',
            borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#2A2A2A' : '#F0F0F0',
        },
        avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 12, marginRight: 10 },
        groupName: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        memberCount: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280' },
        menuBtn: { marginLeft: 'auto', padding: 6 },
        centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
        bubbleRow: { paddingHorizontal: 16, marginBottom: 10 },
        senderName: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: primaryColor, marginBottom: 3, marginLeft: 4 },
        bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
        myBubble: { backgroundColor: primaryColor, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
        theirBubble: { backgroundColor: isDarkMode ? '#1E1E1E' : '#F1F1F1', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
        msgText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        deletedText: { fontStyle: 'italic', opacity: 0.6 },
        msgMeta: { fontSize: 10, marginTop: 4, opacity: 0.7, alignSelf: 'flex-end' },
        inputBar: {
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
            borderTopWidth: 1, borderTopColor: isDarkMode ? '#2A2A2A' : '#F0F0F0',
        },
        input: {
            flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F3F4F6', color: isDarkMode ? '#fff' : '#111827',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginRight: 10,
        },
        sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: primaryColor },
    });

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
                <View style={styles.centerWrap}>
                    <ActivityIndicator color={primaryColor} size="large" />
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={22} color={isDarkMode ? white : '#111'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMembersVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image
                        source={group?.Avatar ? { uri: group.Avatar } : undefined}
                        style={[styles.avatar, { backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E7EB' }]}
                    />
                    <View>
                        <CustomText numberOfLines={1} style={styles.groupName}>{group?.Name}</CustomText>
                        <CustomText style={styles.memberCount}>{members?.length || group?.MembersCount || 0} members</CustomText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
                    <Icon name="more-vertical" size={20} color={isDarkMode ? white : '#111'} />
                </TouchableOpacity>
            </Row>

            <FlatList
                data={messages}
                keyExtractor={(item, index) => item?._id || String(index)}
                inverted
                contentContainerStyle={{ paddingVertical: 16 }}
                renderItem={({ item }) => {
                    const senderId = item?.Sender?._id || item?.Sender;
                    const isMine = senderId === currentUserId;
                    return (
                        <View style={styles.bubbleRow}>
                            {!isMine && (
                                <CustomText style={styles.senderName}>
                                    {item?.Sender?.FullName || item?.Sender?.UserName}
                                </CustomText>
                            )}
                            <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                                <CustomText
                                    style={[
                                        styles.msgText,
                                        item?.IsDeleted && styles.deletedText,
                                        { color: isMine ? white : (isDarkMode ? '#fff' : '#111827') },
                                    ]}
                                >
                                    {item?.IsDeleted ? 'This message was deleted' : item?.Content}
                                </CustomText>
                                <CustomText style={[styles.msgMeta, { color: isMine ? white : (isDarkMode ? '#9CA3AF' : '#6B7280') }]}>
                                    {moment(item?.createdAt).format('hh:mm A')}
                                </CustomText>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 60 }}>
                        <CustomText style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>No messages yet — say hi!</CustomText>
                    </View>
                }
            />

            <View style={styles.inputBar}>
                <TextInput
                    style={styles.input}
                    placeholder="Write a message..."
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Icon name="send" size={18} color={white} />
                </TouchableOpacity>
            </View>

            <ActionMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                title={group?.Name}
                options={menuOptions}
            />
            <GroupMembersModal
                visible={membersVisible}
                onClose={() => setMembersVisible(false)}
                groupId={groupId}
                members={members}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
                onMemberRemoved={(removed) => setMembers((prev) => prev.filter((m) => m?._id !== removed?._id))}
            />
            <InviteLinkModal
                visible={inviteVisible}
                onClose={() => setInviteVisible(false)}
                groupId={groupId}
            />
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

export default GroupDetail;
