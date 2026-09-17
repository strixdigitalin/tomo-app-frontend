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
import { io } from 'socket.io-client';
import moment from 'moment';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomText from '../../components/TextComponent';
import Row from '../../components/wrapper/row';
import MediaViewerModal from '../../components/MediaViewerModal';
import { Back, BackOuterWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { white } from '../../common/Colors/colors';
import useThemeColor from '../../utils/useThemeColor';
import { apiGet, BASE_URL } from '../../utils/Apis';
import { uploadChatImage } from '../../utils/uploadHelpers';
import { ToastMsg } from '../../utils/helperFunctions';
import urls from '../../config/urls';
import Icon from 'react-native-vector-icons/Feather';
import IMG from '../../assets/Images';

// Buyer side of the dedicated buyer<->seller chat channel — mirrors
// SellerFlow/SellerChatScreen.js (the seller side) with roles reversed.
// Matches web's Pages/MarketPlace/SellerChat/SellerChat.jsx.
const BuyerSellerChatScreen = ({ navigation, route }) => {
    const { userForChat } = route.params || {};
    const { isDarkMode, primaryColor } = useThemeColor();

    const rawUser = useSelector(state => state?.user?.userData);
    const selector = useMemo(() => {
        if (rawUser && Object.keys(rawUser).length !== 0) {
            try { return JSON.parse(rawUser) } catch { return {} }
        }
        return {}
    }, [rawUser])
    const currentUserId = selector?._id;

    const [chat, setChat] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [viewerUri, setViewerUri] = useState(null);
    const socket = useRef(null);

    const fetchHistory = async () => {
        try {
            const res = await apiGet(`${urls.userSellerChatHistory}/${userForChat?._id}`);
            const history = res?.data || [];
            setChat([...history].reverse());
        } catch (error) {
            console.log('BuyerSellerChatScreen fetchHistory error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userForChat?._id) {
            fetchHistory();
        }
    }, [userForChat?._id]);

    const belongsToOpenConversation = (msg) => {
        const senderId = msg?.sender?._id || msg?.sender;
        const receiverId = msg?.receiver?._id || msg?.receiver;
        return (
            (senderId === userForChat?._id && receiverId === currentUserId) ||
            (receiverId === userForChat?._id && senderId === currentUserId)
        );
    };

    useEffect(() => {
        if (!currentUserId) return;

        socket.current = io(BASE_URL, { transports: ['websocket'] });

        socket.current.emit('joinUserSellerRoom', {
            userType: 'User',
            userId: currentUserId,
        });

        socket.current.on('receiveUserSellerMessage', (msg) => {
            if (belongsToOpenConversation(msg)) {
                setChat((prev) => [msg, ...prev]);
            }
        });

        socket.current.on('userSellerMessageDelivered', (updatedMsg) => {
            setChat((prev) => prev.map((m) => (m?._id === updatedMsg?._id ? { ...m, isDelivered: true } : m)));
        });

        socket.current.on('userSellerMessageRead', (updatedMsg) => {
            setChat((prev) => prev.map((m) => (m?._id === updatedMsg?._id ? { ...m, isRead: true, isDelivered: true } : m)));
        });

        return () => {
            socket.current?.disconnect();
        };
    }, [currentUserId, userForChat?._id]);

    const handleSend = useCallback(() => {
        if (!inputText.trim() || !userForChat?._id || !currentUserId || !socket.current) return;

        const messageData = {
            sender: currentUserId,
            senderType: 'User',
            receiver: userForChat._id,
            receiverType: 'Seller',
            message: inputText,
            type: 'text',
            mediaUrl: null,
            stickerUrl: null,
            giftDetails: null,
        };

        socket.current.emit('sendUserSellerMessage', messageData);

        setChat((prev) => [
            {
                ...messageData,
                sender: { _id: currentUserId },
                receiver: { _id: userForChat._id },
                isSent: true,
                isDelivered: false,
                isRead: false,
                createdAt: new Date(),
            },
            ...prev,
        ]);

        setInputText('');
    }, [inputText, userForChat, currentUserId]);

    const handlePickImage = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 }, async (response) => {
            if (response.didCancel || response.errorMessage) return;
            const asset = response.assets?.[0];
            if (!asset?.uri || !userForChat?._id || !currentUserId || !socket.current) return;

            try {
                setUploadingImage(true);
                const mediaUrl = await uploadChatImage(asset);

                const messageData = {
                    sender: currentUserId,
                    senderType: 'User',
                    receiver: userForChat._id,
                    receiverType: 'Seller',
                    message: '',
                    type: 'image',
                    mediaUrl,
                    fileName: asset.fileName || null,
                    fileSize: asset.fileSize || 0,
                    stickerUrl: null,
                    giftDetails: null,
                };

                socket.current.emit('sendUserSellerMessage', messageData);

                setChat((prev) => [
                    {
                        ...messageData,
                        sender: { _id: currentUserId },
                        receiver: { _id: userForChat._id },
                        isSent: true,
                        isDelivered: false,
                        isRead: false,
                        createdAt: new Date(),
                    },
                    ...prev,
                ]);
            } catch (error) {
                ToastMsg(error?.message || 'Failed to send photo');
            } finally {
                setUploadingImage(false);
            }
        });
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#fff' },
        header: {
            paddingTop: 50,
            paddingHorizontal: 16,
            paddingBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#2A2A2A' : '#F0F0F0',
        },
        avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 12, marginRight: 10 },
        userName: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
        sellerTag: { fontSize: 11, color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        bubbleRow: { paddingHorizontal: 16, marginBottom: 10 },
        bubble: {
            maxWidth: '78%',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 16,
        },
        myBubble: {
            backgroundColor: primaryColor,
            alignSelf: 'flex-end',
            borderBottomRightRadius: 4,
        },
        theirBubble: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F1F1F1',
            alignSelf: 'flex-start',
            borderBottomLeftRadius: 4,
        },
        msgText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
        imageBubble: { width: 200, height: 200, borderRadius: 12 },
        msgMeta: { fontSize: 10, marginTop: 4, opacity: 0.7, alignSelf: 'flex-end' },
        inputBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? '#2A2A2A' : '#F0F0F0',
        },
        input: {
            flex: 1,
            height: 44,
            borderRadius: 22,
            paddingHorizontal: 16,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F3F4F6',
            color: isDarkMode ? '#fff' : '#111827',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            marginRight: 10,
        },
        sendBtn: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: primaryColor,
        },
    });

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            <Row style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <BackOuterWhite /> : <Back />}
                </TouchableOpacity>
                <Image source={userForChat?.Image ? { uri: userForChat.Image } : IMG.MessageProfile} style={styles.avatar} />
                <View>
                    <CustomText style={styles.userName}>{userForChat?.UserName || userForChat?.FullName}</CustomText>
                    <CustomText style={styles.sellerTag}>Seller</CustomText>
                </View>
            </Row>

            <FlatList
                data={chat}
                keyExtractor={(item, index) => item?._id || String(index)}
                inverted
                contentContainerStyle={{ paddingVertical: 16 }}
                renderItem={({ item }) => {
                    const senderId = item?.sender?._id || item?.sender;
                    const isMine = senderId === currentUserId;
                    return (
                        <View style={styles.bubbleRow}>
                            <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                                {item?.type === 'image' && item?.mediaUrl ? (
                                    <TouchableOpacity onPress={() => setViewerUri(item.mediaUrl)} activeOpacity={0.85}>
                                        <Image source={{ uri: item.mediaUrl }} style={styles.imageBubble} resizeMode="cover" />
                                    </TouchableOpacity>
                                ) : (
                                    <CustomText style={[styles.msgText, { color: isMine ? white : (isDarkMode ? '#fff' : '#111827') }]}>
                                        {item?.message}
                                    </CustomText>
                                )}
                                <Row style={{ justifyContent: 'flex-end', gap: 4 }}>
                                    <CustomText style={[styles.msgMeta, { color: isMine ? white : (isDarkMode ? '#9CA3AF' : '#6B7280') }]}>
                                        {moment(item?.timestamp || item?.createdAt).format('hh:mm A')}
                                    </CustomText>
                                    {isMine && (
                                        <Icon
                                            name="check"
                                            size={12}
                                            color={item?.isRead ? '#38BDF8' : white}
                                            style={{ marginLeft: -6 }}
                                        />
                                    )}
                                </Row>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    !loading && (
                        <View style={{ alignItems: 'center', marginTop: 60 }}>
                            <CustomText style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>No messages yet</CustomText>
                        </View>
                    )
                }
            />

            <View style={styles.inputBar}>
                <TouchableOpacity
                    onPress={handlePickImage}
                    style={{ padding: 8, marginRight: 4 }}
                    disabled={uploadingImage}
                >
                    {uploadingImage ? (
                        <ActivityIndicator size="small" color={primaryColor} />
                    ) : (
                        <Icon name="image" size={22} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    )}
                </TouchableOpacity>
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

            <MediaViewerModal
                visible={!!viewerUri}
                uri={viewerUri}
                onClose={() => setViewerUri(null)}
            />
        </KeyboardAvoidingView>
    );
};

export default BuyerSellerChatScreen;
