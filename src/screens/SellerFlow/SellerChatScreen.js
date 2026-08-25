import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import moment from 'moment';
import CustomText from '../../components/TextComponent';
import Row from '../../components/wrapper/row';
import { Back, BackOuterWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { App_Primary_color, white } from '../../common/Colors/colors';
import { apiGet, BASE_URL } from '../../utils/Apis';
import urls from '../../config/urls';
import Icon from 'react-native-vector-icons/Feather';
import IMG from '../../assets/Images';

const SellerChatScreen = ({ navigation, route }) => {
    const { userForChat } = route.params || {};
    const { isDarkMode } = useSelector(state => state.theme);

    let seller = useSelector(state => state?.user?.userData);
    if (Object.keys(seller || {}).length !== 0) {
        try { seller = JSON.parse(seller); } catch (e) { }
    }
    const currentSellerId = seller?._id;

    const [chat, setChat] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = useRef(null);

    const fetchHistory = async () => {
        try {
            const res = await apiGet(`${urls.sellerChatHistory}/${userForChat?._id}`);
            const history = res?.data || [];
            setChat([...history].reverse());
        } catch (error) {
            console.log('SellerChatScreen fetchHistory error', error);
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
            (senderId === userForChat?._id && receiverId === currentSellerId) ||
            (receiverId === userForChat?._id && senderId === currentSellerId)
        );
    };

    useEffect(() => {
        if (!currentSellerId) return;

        socket.current = io(BASE_URL, { transports: ['websocket'] });

        socket.current.emit('joinUserSellerRoom', {
            userType: 'Seller',
            userId: currentSellerId,
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
    }, [currentSellerId, userForChat?._id]);

    const handleSend = () => {
        if (!inputText.trim() || !userForChat?._id || !currentSellerId || !socket.current) return;

        const messageData = {
            sender: currentSellerId,
            senderType: 'Seller',
            receiver: userForChat._id,
            receiverType: 'User',
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
                sender: { _id: currentSellerId },
                receiver: { _id: userForChat._id },
                isSent: true,
                isDelivered: false,
                isRead: false,
                createdAt: new Date(),
            },
            ...prev,
        ]);

        setInputText('');
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
        bubbleRow: { paddingHorizontal: 16, marginBottom: 10 },
        bubble: {
            maxWidth: '78%',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 16,
        },
        myBubble: {
            backgroundColor: App_Primary_color,
            alignSelf: 'flex-end',
            borderBottomRightRadius: 4,
        },
        theirBubble: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F1F1F1',
            alignSelf: 'flex-start',
            borderBottomLeftRadius: 4,
        },
        msgText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
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
            backgroundColor: App_Primary_color,
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
                <CustomText style={styles.userName}>{userForChat?.UserName || userForChat?.FullName}</CustomText>
            </Row>

            <FlatList
                data={chat}
                keyExtractor={(item, index) => item?._id || String(index)}
                inverted
                contentContainerStyle={{ paddingVertical: 16 }}
                renderItem={({ item }) => {
                    const senderId = item?.sender?._id || item?.sender;
                    const isMine = senderId === currentSellerId;
                    return (
                        <View style={styles.bubbleRow}>
                            <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                                <CustomText style={[styles.msgText, { color: isMine ? white : (isDarkMode ? '#fff' : '#111827') }]}>
                                    {item?.message}
                                </CustomText>
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
        </KeyboardAvoidingView>
    );
};

export default SellerChatScreen;
