



// // // import React, { useContext, useEffect, useRef, useState } from "react";
// // // import {
// // //     View,
// // //     Text,
// // //     TextInput,
// // //     TouchableOpacity,
// // //     FlatList,
// // //     Image,
// // //     StyleSheet,
// // //     StatusBar,
// // //     TouchableWithoutFeedback,
// // //     Animated,
// // //     Keyboard,
// // //     KeyboardAvoidingView,
// // //     Platform,
// // //     Modal,
// // //     Alert,
// // // } from "react-native";
// // // import ImagePicker from "react-native-image-picker";
// // // import IMG from "../../assets/Images";
// // // import { Back, More } from "../../assets/SVGs";
// // // import SpaceBetweenRow from "../../components/wrapper/spacebetween";
// // // import Row from "../../components/wrapper/row";
// // // import { FONTS_FAMILY } from "../../assets/Fonts";
// // // import CustomText from "../../components/TextComponent";
// // // import urls from "../../config/urls";
// // // import { ToastMsg } from "../../utils/helperFunctions";
// // // import { apiGet, apiPut, getItem } from "../../utils/Apis";
// // // import { io } from "socket.io-client";
// // // import moment from "moment";
// // // import Icon from 'react-native-vector-icons/Feather';
// // // import { useSelector } from "react-redux";

// // // // Sticker packs
// // // const STICKER_PACKS = {
// // //     emojis: [
// // //         '😀', '😂', '🤣', '😊', '😍', '🥰', '😎', '🤗',
// // //         '🤔', '😴', '🥳', '😇', '🤩', '😋', '😜', '🤪',
// // //         '😱', '😭', '😤', '🤯', '😷', '🤧', '🥴', '😵'
// // //     ],
// // //     hearts: [
// // //         '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
// // //         '💖', '💗', '💓', '💞', '💕', '💘', '💝', '💟',
// // //         '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '💋', '💌', '💏', '💑'
// // //     ],
// // //     hands: [
// // //         '👍', '👎', '👏', '🙌', '💪', '🤝', '🙏', '✌️',
// // //         '🤞', '👌', '🤙', '🤘', '🤟', '✊', '👊', '🫶',
// // //         '👋', '🤚', '🖐️', '✋', '🖖', '👆', '👇', '☝️'
// // //     ]
// // // };

// // // const ChatScreen = ({ route, navigation }) => {
// // //     const { userId, userForChat } = route.params;
// // //     const [Userdata, setUserdata] = useState({});
// // //     const [ChatMessages, setChatMessages] = useState([]);
// // //     const [currentUserId, setCurrentUserId] = useState(null);
// // //     const socket = useRef(null);
// // //     const [menuVisible, setMenuVisible] = useState(false);
// // //     const [haveIBlockedThem, setHaveIBlockedThem] = useState(false);
// // //     const [isBlockedByThem, setIsBlockedByThem] = useState(false);
// // //     // const { isDarkMode } = useSelector(state => state.theme);

// // //       const { 
// // //         isDarkMode, 
// // //         selectedColorTheme, 
// // //         messageCornerRadius, 
// // //         feedListView 
// // //       } = useSelector(state => state.theme);
    
// // //     // Sticker feature states
// // //     const [showStickerPicker, setShowStickerPicker] = useState(false);
// // //     const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
// // //     const stickerHeight = useRef(new Animated.Value(0)).current;
// // //     const inputRef = useRef(null);
// // //     const emojiSelectionTimerRef = useRef(null);
// // //     const editFocusTimerRef = useRef(null);
// // //     const [cursorPosition, setCursorPosition] = useState(0);

// // //     // Edit & Delete states
// // //     const [selectedMessage, setSelectedMessage] = useState(null);
// // //     const [showMessageOptions, setShowMessageOptions] = useState(false);
// // //     const [editingMessage, setEditingMessage] = useState(null);

// // //     let selector = useSelector(state => state?.user?.userData);
// // //     if (Object.keys(selector).length != 0) {
// // //         selector = JSON.parse(selector);
// // //     }

// // //     const GetUserId = async () => {
// // //         try {
// // //             setCurrentUserId(selector?._id);
// // //         } catch (error) {
// // //             ToastMsg("Failed to get user ID");
// // //         }
// // //     };

// // //     // console.log('messageCornerRadius===================>>>>>', messageCornerRadius);
    

// // //     useEffect(() => {
// // //         GetUserId();
// // //     }, []);

// // //     const GetChatHistory = async () => {
// // //         try {
// // //             const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
// // //             setChatMessages(Chat?.data)
// // //         } catch (error) {
// // //             ToastMsg('Error fetching user data:')
// // //             console.log('Error fetching user data:', error);
// // //         }
// // //     }

// // //     useEffect(() => {
// // //         if (currentUserId !== null) {
// // //             GetChatHistory();
// // //         }
// // //     }, [userId, currentUserId]);

// // //     useEffect(() => {
// // //         socket.current = io('http://192.168.158.149:8080');

// // //         socket.current.emit("joinRoom", { userId: currentUserId });

// // //         socket.current.on("receiveMessage", (msg) => {
// // //             setChatMessages(prev => [msg, ...prev]);
// // //             socket.current.emit("markAsRead", {
// // //                 messageId: msg._id
// // //             });
// // //         });

// // //         // Listen for message updates
// // //         socket.current.on("messageUpdated", (updatedMsg) => {
// // //             setChatMessages(prev => 
// // //                 prev.map(msg => msg._id === updatedMsg._id ? updatedMsg : msg)
// // //             );
// // //         });

// // //         // Listen for message deletion
// // //         socket.current.on("messageDeleted", (deletedMsgId) => {
// // //             setChatMessages(prev => 
// // //                 prev.filter(msg => msg._id !== deletedMsgId)
// // //             );
// // //         });

// // //         return () => {
// // //             socket.current.disconnect();
// // //         };
// // //     }, []);

// // //     // Keyboard listeners
// // //     useEffect(() => {
// // //         const keyboardWillShow = Keyboard.addListener(
// // //             Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
// // //             () => {
// // //                 setShowStickerPicker(false);
// // //             }
// // //         );

// // //         return () => {
// // //             keyboardWillShow.remove();
// // //         };
// // //     }, []);

// // //     // Animate sticker picker
// // //     useEffect(() => {
// // //         Animated.timing(stickerHeight, {
// // //             toValue: showStickerPicker ? 280 : 0,
// // //             duration: 250,
// // //             useNativeDriver: false,
// // //         }).start();
// // //     }, [showStickerPicker]);

// // //     useEffect(() => {
// // //         return () => {
// // //             if (emojiSelectionTimerRef.current) {
// // //                 clearTimeout(emojiSelectionTimerRef.current);
// // //             }
// // //             if (editFocusTimerRef.current) {
// // //                 clearTimeout(editFocusTimerRef.current);
// // //             }
// // //         };
// // //     }, []);

// // //     const [inputText, setInputText] = useState("");
// // //     const [selectedImage, setSelectedImage] = useState(null);

// // //     const handleSendMessage = () => {
// // //         if (!inputText.trim()) return;

// // //         if (editingMessage) {
// // //             // Edit message
// // //             const updatedMessage = {
// // //                 ...editingMessage,
// // //                 message: inputText,
// // //                 edited: true,
// // //                 editedAt: new Date(),
// // //             };

// // //             socket.current.emit("editMessage", {
// // //                 messageId: editingMessage._id,
// // //                 newMessage: inputText
// // //             });

// // //             setChatMessages(prev =>
// // //                 prev.map(msg => msg._id === editingMessage._id ? updatedMessage : msg)
// // //             );

// // //             setEditingMessage(null);
// // //             setInputText("");
// // //             ToastMsg("Message edited");
// // //         } else {
// // //             // Send new message
// // //             const messageData = {
// // //                 sender: currentUserId,
// // //                 receiver: userId,
// // //                 message: inputText,
// // //                 type: "text",
// // //                 isSent: true,
// // //                 isRead: false,
// // //                 timestamp: new Date(),
// // //             };

// // //             socket.current.emit("sendMessage", messageData);

// // //             setChatMessages(prev => [
// // //                 {
// // //                     ...messageData,
// // //                     _id: Date.now().toString(),
// // //                     sender: { _id: currentUserId },
// // //                 },
// // //                 ...prev,
// // //             ]);

// // //             setInputText("");
// // //         }
// // //     };

// // //     const handleEmojiSelect = (emoji) => {
// // //         // Insert emoji at cursor position
// // //         const newText = 
// // //             inputText.slice(0, cursorPosition) + 
// // //             emoji + 
// // //             inputText.slice(cursorPosition);
        
// // //         setInputText(newText);
        
// // //         // Update cursor position
// // //         const newCursorPosition = cursorPosition + emoji.length;
// // //         setCursorPosition(newCursorPosition);
        
// // //         // Focus input and set selection
// // //         if (emojiSelectionTimerRef.current) {
// // //             clearTimeout(emojiSelectionTimerRef.current);
// // //         }

// // //         emojiSelectionTimerRef.current = setTimeout(() => {
// // //             // inputRef.current?.focus();
// // //             inputRef.current?.setNativeProps({
// // //                 selection: { start: newCursorPosition, end: newCursorPosition }
// // //             });
// // //         }, 0);
// // //     };

// // //     const handleLongPress = (item) => {
// // //         const isMyMessage = item.sender?._id === currentUserId || item.sender === currentUserId;
// // //         if (isMyMessage) {
// // //             setSelectedMessage(item);
// // //             setShowMessageOptions(true);
// // //         }
// // //     };

// // //     const handleEditMessage = () => {
// // //         setEditingMessage(selectedMessage);
// // //         setInputText(selectedMessage.message);
// // //         setShowMessageOptions(false);
// // //         if (editFocusTimerRef.current) {
// // //             clearTimeout(editFocusTimerRef.current);
// // //         }

// // //         editFocusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 100);
// // //     };

// // //     const handleDeleteMessage = () => {
// // //         Alert.alert(
// // //             "Delete Message",
// // //             "Are you sure you want to delete this message?",
// // //             [
// // //                 {
// // //                     text: "Cancel",
// // //                     style: "cancel"
// // //                 },
// // //                 {
// // //                     text: "Delete",
// // //                     style: "destructive",
// // //                     onPress: () => {
// // //                         socket.current.emit("deleteMessage", {
// // //                             messageId: selectedMessage._id
// // //                         });

// // //                         setChatMessages(prev =>
// // //                             prev.filter(msg => msg._id !== selectedMessage._id)
// // //                         );

// // //                         setShowMessageOptions(false);
// // //                         ToastMsg("Message deleted");
// // //                     }
// // //                 }
// // //             ]
// // //         );
// // //     };

// // //     const cancelEdit = () => {
// // //         setEditingMessage(null);
// // //         setInputText("");
// // //     };

// // //     const handlePickImage = () => {
// // //         ImagePicker.showImagePicker(
// // //             {
// // //                 title: "Select Image",
// // //                 mediaType: "photo",
// // //                 quality: 0.7,
// // //             },
// // //             (response) => {
// // //                 if (!response.didCancel && !response.error) {
// // //                     setSelectedImage(response.uri);
// // //                 }
// // //             }
// // //         );
// // //     };

// // //     const renderMessage = ({ item }) => {
// // //         const isMyMessage = item.sender?._id === currentUserId || item.sender === currentUserId;

// // //         return (
// // //             <TouchableOpacity
// // //                 onLongPress={() => handleLongPress(item)}
// // //                 activeOpacity={0.9}
// // //                 delayLongPress={500}
// // //             >
// // //                 <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
// // //                     <View style={[
// // //                         styles.messageBubble,
// // //                         { backgroundColor: isDarkMode ? '#2a2a2a' : '#F1F1F1' },
// // //                         isMyMessage && styles.myMessageBubble,
// // //                     ]}>
// // //                         {item.message && (
// // //                             <Text style={{ ...styles.messageText, color: isMyMessage ? 'white' : (isDarkMode ? '#fff' : 'black') }}>
// // //                                 {item.message}
// // //                             </Text>
// // //                         )}
// // //                         <View style={styles.metaContainer}>
// // //                             {item.edited && (
// // //                                 <Text style={[styles.editedText, { color: isMyMessage ? 'rgba(255,255,255,0.6)' : (isDarkMode ? '#666' : '#999') }]}>
// // //                                     edited
// // //                                 </Text>
// // //                             )}
// // //                             <Text style={[styles.timestamp, { color: isMyMessage ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray') }]}>
// // //                                 {moment(item.timestamp).format("hh:mm A")}
// // //                             </Text>
// // //                             {isMyMessage && (
// // //                                 <Text style={styles.status}>
// // //                                     {item.isRead ? "✓✓" : "✓"}
// // //                                 </Text>
// // //                             )}
// // //                         </View>
// // //                     </View>
// // //                 </View>
// // //             </TouchableOpacity>
// // //         );
// // //     };

// // //     const backgroundColor = isDarkMode ? '#1a1a1a' : '#F5F5F5';
// // //     const headerBg = isDarkMode ? '#252525' : 'white';
// // //     const textColor = isDarkMode ? '#fff' : '#000';
// // //     const inputBg = isDarkMode ? '#2a2a2a' : '#F1F1F1';
// // //     const borderColor = isDarkMode ? '#333' : '#EEE';
// // //     const stickerTabBg = isDarkMode ? '#2a2a2a' : '#F8F8F8';


// // //     const styles = StyleSheet.create({
// // //     container: {
// // //         flex: 1,
// // //     },
// // //     headerWrapper: {
// // //         paddingTop: 50,
// // //         paddingBottom: 10,
// // //         borderBottomWidth: 1,
// // //     },
// // //     headerContent: {
// // //         paddingHorizontal: 16,
// // //         alignItems: 'center',
// // //     },
// // //     headerLeft: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         gap: 12,
// // //     },
// // //     backButton: {
// // //         padding: 4,
// // //     },
// // //     profileImage: {
// // //         width: 40,
// // //         height: 40,
// // //         borderRadius: 20,
// // //     },
// // //     headerText: {
// // //         marginLeft: 4,
// // //     },
// // //     profileName: {
// // //         fontSize: 16,
// // //         fontWeight: "600",
// // //         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// // //     },
// // //     userstatus: {
// // //         fontSize: 12,
// // //         marginTop: 2,
// // //     },
// // //     moreButton: {
// // //         padding: 4,
// // //     },
// // //     chatWrapper: {
// // //         flex: 1,
// // //     },
// // //     chatContainer: {
// // //         flex: 1,
// // //     },
// // //     chatContent: {
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 8,
// // //     },
// // //     messageContainer: {
// // //         flexDirection: "row",
// // //         marginVertical: 3,
// // //         alignItems: "flex-end",
// // //     },
// // //     myMessage: {
// // //         justifyContent: "flex-end",
// // //     },
// // //     messageBubble: {
// // //         padding: 12,
// // //         borderRadius: messageCornerRadius,
// // //         maxWidth: "75%",
// // //         minWidth: 60,
// // //     },
// // //     myMessageBubble: {
// // //         backgroundColor: "#4F52FE",
// // //     },
// // //     messageText: {
// // //         fontSize: 15,
// // //         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// // //         lineHeight: 20,
// // //     },
// // //     metaContainer: {
// // //         flexDirection: "row",
// // //         justifyContent: "flex-end",
// // //         alignItems: "center",
// // //         marginTop: 4,
// // //         gap: 4,
// // //     },
// // //     editedText: {
// // //         fontSize: 9,
// // //         fontStyle: 'italic',
// // //         marginRight: 4,
// // //     },
// // //     timestamp: {
// // //         fontSize: 10,
// // //     },
// // //     status: {
// // //         fontSize: 12,
// // //         color: "rgba(255,255,255,0.8)",
// // //     },
// // //     editingBar: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         justifyContent: 'space-between',
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 10,
// // //         borderTopWidth: 1,
// // //     },
// // //     editingContent: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         gap: 10,
// // //         flex: 1,
// // //     },
// // //     editingTextContainer: {
// // //         flex: 1,
// // //     },
// // //     editingLabel: {
// // //         fontSize: 12,
// // //         fontWeight: '600',
// // //         marginBottom: 2,
// // //     },
// // //     editingPreview: {
// // //         fontSize: 13,
// // //     },
// // //     cancelEdit: {
// // //         padding: 4,
// // //     },
// // //     inputContainer: {
// // //         flexDirection: "row",
// // //         alignItems: "flex-end",
// // //         paddingHorizontal: 12,
// // //         paddingVertical: 8,
// // //         borderTopWidth: 1,
// // //     },
// // //     iconButton: {
// // //         padding: 8,
// // //         paddingBottom: 12,
// // //     },
// // //     input: {
// // //         flex: 1,
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 10,
// // //         borderRadius: 24,
// // //         marginHorizontal: 8,
// // //         fontSize: 15,
// // //         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// // //         maxHeight: 100,
// // //     },
// // //     sendButton: {
// // //         backgroundColor: '#4F52FE',
// // //         width: 40,
// // //         height: 40,
// // //         borderRadius: 20,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         marginBottom: 4,
// // //     },
// // //     sendButtonDisabled: {
// // //         opacity: 0.5,
// // //     },
// // //     // Sticker Picker Styles
// // //     stickerPickerContainer: {
// // //         overflow: 'hidden',
// // //         borderTopWidth: 1,
// // //     },
// // //     stickerTabs: {
// // //         flexDirection: 'row',
// // //         paddingHorizontal: 12,
// // //         paddingVertical: 8,
// // //         borderBottomWidth: 1,
// // //     },
// // //     stickerTab: {
// // //         paddingVertical: 8,
// // //         paddingHorizontal: 16,
// // //         marginRight: 4,
// // //         borderRadius: 16,
// // //     },
// // //     stickerTabActive: {
// // //         backgroundColor: '#4F52FE',
// // //     },
// // //     stickerTabText: {
// // //         fontSize: 13,
// // //         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// // //     },
// // //     stickerTabTextActive: {
// // //         color: 'white',
// // //         fontWeight: '600',
// // //     },
// // //     stickerGrid: {
// // //         paddingHorizontal: 8,
// // //         paddingTop: 12,
// // //         paddingBottom: 8,
// // //     },
// // //     stickerItem: {
// // //         width: '16.666%',
// // //         aspectRatio: 1,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },
// // //     stickerEmoji: {
// // //         fontSize: 32,
// // //     },
// // //     // Modal Styles
// // //     modalOverlay: {
// // //         flex: 1,
// // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },
// // //     optionsContainer: {
// // //         width: '80%',
// // //         borderRadius: 16,
// // //         overflow: 'hidden',
// // //         shadowColor: "#000",
// // //         shadowOffset: {
// // //             width: 0,
// // //             height: 2,
// // //         },
// // //         shadowOpacity: 0.25,
// // //         shadowRadius: 3.84,
// // //         elevation: 5,
// // //     },
// // //     optionButton: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         paddingVertical: 16,
// // //         paddingHorizontal: 20,
// // //         gap: 12,
// // //     },
// // //     optionText: {
// // //         fontSize: 16,
// // //         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
// // //     },
// // //     optionDivider: {
// // //         height: 0.5,
// // //         marginHorizontal: 20,
// // //     },
// // // });

// // //     return (
// // //         <View style={[styles.container, { backgroundColor }]}>
// // //             <StatusBar
// // //                 translucent={true}
// // //                 backgroundColor="transparent"
// // //                 barStyle={isDarkMode ? "light-content" : "dark-content"}
// // //             />
            
// // //             {/* Header */}
// // //             <View style={[styles.headerWrapper, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
// // //                 <SpaceBetweenRow style={styles.headerContent}>
// // //                     <View style={styles.headerLeft}>
// // //                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //                             <Icon name="arrow-left" size={24} color={textColor} />
// // //                         </TouchableOpacity>
// // //                         <Image 
// // //                             source={userForChat?.Image ? { uri: userForChat?.Image } : IMG.ProfileImagePost} 
// // //                             style={styles.profileImage} 
// // //                         />
// // //                         <View style={styles.headerText}>
// // //                             <Text style={[styles.profileName, { color: textColor }]}>
// // //                                 {userForChat?.FullName}
// // //                             </Text>
// // //                             <Text style={[styles.userstatus, { color: isDarkMode ? '#888' : '#666' }]}>
// // //                                 Active today
// // //                             </Text>
// // //                         </View>
// // //                     </View>
// // //                     <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.moreButton}>
// // //                         <Icon name="more-vertical" size={24} color={textColor} />
// // //                     </TouchableOpacity>
// // //                 </SpaceBetweenRow>
// // //             </View>

// // //             {/* Chat Messages */}
// // //             <KeyboardAvoidingView 
// // //                 style={styles.chatWrapper}
// // //                 behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
// // //                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
// // //             >
// // //                 <FlatList
// // //                     data={ChatMessages}
// // //                     keyExtractor={(item, index) => index.toString()}
// // //                     renderItem={renderMessage}
// // //                     style={styles.chatContainer}
// // //                     contentContainerStyle={styles.chatContent}
// // //                     inverted
// // //                 />

// // //                 {/* Editing Indicator */}
// // //                 {editingMessage && (
// // //                     <View style={[styles.editingBar, { backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0', borderTopColor: borderColor }]}>
// // //                         <View style={styles.editingContent}>
// // //                             <Icon name="edit-2" size={16} color="#4F52FE" />
// // //                             <View style={styles.editingTextContainer}>
// // //                                 <Text style={[styles.editingLabel, { color: '#4F52FE' }]}>
// // //                                     Editing message
// // //                                 </Text>
// // //                                 <Text style={[styles.editingPreview, { color: isDarkMode ? '#ccc' : '#666' }]} numberOfLines={1}>
// // //                                     {editingMessage.message}
// // //                                 </Text>
// // //                             </View>
// // //                         </View>
// // //                         <TouchableOpacity onPress={cancelEdit} style={styles.cancelEdit}>
// // //                             <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
// // //                         </TouchableOpacity>
// // //                     </View>
// // //                 )}

// // //                 {/* Sticker Picker - Attached to Input */}
// // //                 <Animated.View style={[
// // //                     styles.stickerPickerContainer,
// // //                     { 
// // //                         height: stickerHeight,
// // //                         backgroundColor: headerBg,
// // //                         borderTopColor: borderColor
// // //                     }
// // //                 ]}>
// // //                     {showStickerPicker && (
// // //                         <>
// // //                             {/* Sticker Pack Tabs */}
// // //                             <View style={[styles.stickerTabs, { backgroundColor: stickerTabBg, borderBottomColor: borderColor }]}>
// // //                                 {Object.keys(STICKER_PACKS).map(pack => (
// // //                                     <TouchableOpacity
// // //                                         key={pack}
// // //                                         style={[
// // //                                             styles.stickerTab,
// // //                                             selectedStickerPack === pack && styles.stickerTabActive
// // //                                         ]}
// // //                                         onPress={() => setSelectedStickerPack(pack)}
// // //                                     >
// // //                                         <Text style={[
// // //                                             styles.stickerTabText,
// // //                                             { color: textColor },
// // //                                             selectedStickerPack === pack && styles.stickerTabTextActive
// // //                                         ]}>
// // //                                             {pack.charAt(0).toUpperCase() + pack.slice(1)}
// // //                                         </Text>
// // //                                     </TouchableOpacity>
// // //                                 ))}
// // //                             </View>

// // //                             {/* Sticker Grid */}
// // //                             <FlatList
// // //                                 data={STICKER_PACKS[selectedStickerPack]}
// // //                                 numColumns={6}
// // //                                 keyExtractor={(item, index) => index.toString()}
// // //                                 renderItem={({ item }) => (
// // //                                     <TouchableOpacity
// // //                                         style={styles.stickerItem}
// // //                                         onPress={() => handleEmojiSelect(item)}
// // //                                     >
// // //                                         <Text style={styles.stickerEmoji}>{item}</Text>
// // //                                     </TouchableOpacity>
// // //                                 )}
// // //                                 contentContainerStyle={styles.stickerGrid}
// // //                                 showsVerticalScrollIndicator={false}
// // //                             />
// // //                         </>
// // //                     )}
// // //                 </Animated.View>

// // //                 {/* Input Container */}
// // //                 <View style={[styles.inputContainer, { backgroundColor: headerBg, borderTopColor: borderColor }]}>
// // //                     <TouchableOpacity
// // //                         onPress={() => {
// // //                             Keyboard.dismiss();
// // //                             setShowStickerPicker(!showStickerPicker);
// // //                         }}
// // //                         style={styles.iconButton}
// // //                     >
// // //                         <Icon 
// // //                             name={showStickerPicker ? "x" : "smile"} 
// // //                             size={24} 
// // //                             color={showStickerPicker ? '#4F52FE' : (isDarkMode ? '#888' : '#666')} 
// // //                         />
// // //                     </TouchableOpacity>

// // //                     <TextInput
// // //                         ref={inputRef}
// // //                         style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
// // //                         value={inputText}
// // //                         onChangeText={setInputText}
// // //                         onSelectionChange={(event) => {
// // //                             setCursorPosition(event.nativeEvent.selection.start);
// // //                         }}
// // //                         onFocus={() => setShowStickerPicker(false)}
// // //                         placeholder="Message"
// // //                         placeholderTextColor={isDarkMode ? '#666' : '#999'}
// // //                         multiline
// // //                     />

// // //                     <TouchableOpacity
// // //                         onPress={handleSendMessage}
// // //                         style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
// // //                         disabled={!inputText.trim()}
// // //                     >
// // //                         <Icon name={editingMessage ? "check" : "send"} size={18} color="white" />
// // //                     </TouchableOpacity>
// // //                 </View>
// // //             </KeyboardAvoidingView>

// // //             {/* Message Options Modal */}
// // //             <Modal
// // //                 visible={showMessageOptions}
// // //                 transparent={true}
// // //                 animationType="fade"
// // //                 onRequestClose={() => setShowMessageOptions(false)}
// // //             >
// // //                 <TouchableWithoutFeedback onPress={() => setShowMessageOptions(false)}>
// // //                     <View style={styles.modalOverlay}>
// // //                         <TouchableWithoutFeedback>
// // //                             <View style={[styles.optionsContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : 'white' }]}>
// // //                                 <TouchableOpacity 
// // //                                     style={styles.optionButton}
// // //                                     onPress={handleEditMessage}
// // //                                 >
// // //                                     <Icon name="edit-2" size={20} color={isDarkMode ? '#fff' : '#000'} />
// // //                                     <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#000' }]}>
// // //                                         Edit Message
// // //                                     </Text>
// // //                                 </TouchableOpacity>

// // //                                 <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />

// // //                                 <TouchableOpacity 
// // //                                     style={styles.optionButton}
// // //                                     onPress={handleDeleteMessage}
// // //                                 >
// // //                                     <Icon name="trash-2" size={20} color="#FF3B30" />
// // //                                     <Text style={[styles.optionText, { color: '#FF3B30' }]}>
// // //                                         Delete Message
// // //                                     </Text>
// // //                                 </TouchableOpacity>

// // //                                 <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />

// // //                                 <TouchableOpacity 
// // //                                     style={styles.optionButton}
// // //                                     onPress={() => setShowMessageOptions(false)}
// // //                                 >
// // //                                     <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
// // //                                     <Text style={[styles.optionText, { color: isDarkMode ? '#888' : '#666' }]}>
// // //                                         Cancel
// // //                                     </Text>
// // //                                 </TouchableOpacity>
// // //                             </View>
// // //                         </TouchableWithoutFeedback>
// // //                     </View>
// // //                 </TouchableWithoutFeedback>
// // //             </Modal>
// // //         </View>
// // //     );
// // // };



// // // export default ChatScreen;



// // import React, { useContext, useEffect, useRef, useState } from "react";
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     TouchableOpacity,
// //     FlatList,
// //     Image,
// //     StyleSheet,
// //     StatusBar,
// //     TouchableWithoutFeedback,
// //     Animated,
// //     Keyboard,
// //     KeyboardAvoidingView,
// //     Platform,
// //     Modal,
// //     Alert,
// //     ScrollView,
// //     ImageBackground,
// // } from "react-native";
// // import LinearGradient from 'react-native-linear-gradient';
// // import ImagePicker from "react-native-image-picker";
// // import IMG from "../../assets/Images";
// // import SpaceBetweenRow from "../../components/wrapper/spacebetween";
// // import { FONTS_FAMILY } from "../../assets/Fonts";
// // import urls from "../../config/urls";
// // import { ToastMsg } from "../../utils/helperFunctions";
// // import { apiGet, apiPut, getItem } from "../../utils/Apis";
// // import { io } from "socket.io-client";
// // import moment from "moment";
// // import Icon from 'react-native-vector-icons/Feather';
// // import { useSelector } from "react-redux";

// // // ─── Sticker Packs ────────────────────────────────────────────────────────────
// // const STICKER_PACKS = {
// //     emojis: [
// //         '😀','😂','🤣','😊','😍','🥰','😎','🤗',
// //         '🤔','😴','🥳','😇','🤩','😋','😜','🤪',
// //         '😱','😭','😤','🤯','😷','🤧','🥴','😵'
// //     ],
// //     hearts: [
// //         '❤️','🧡','💛','💚','💙','💜','🖤','🤍',
// //         '💖','💗','💓','💞','💕','💘','💝','💟',
// //         '❣️','💔','❤️‍🔥','❤️‍🩹','💋','💌','💏','💑'
// //     ],
// //     hands: [
// //         '👍','👎','👏','🙌','💪','🤝','🙏','✌️',
// //         '🤞','👌','🤙','🤘','🤟','✊','👊','🫶',
// //         '👋','🤚','🖐️','✋','🖖','👆','👇','☝️'
// //     ],
// // };

// // // ─── Chat Themes ──────────────────────────────────────────────────────────────
// // const CHAT_THEMES = {
// //     default: { name: 'Default Blue',    bubbleColor: '#4F52FE', bubbleTextColor: 'white' },
// //     pink:    { name: 'Pink Vibes',       bubbleColor: '#FF1493', bubbleTextColor: 'white' },
// //     green:   { name: 'Green Energy',     bubbleColor: '#00B050', bubbleTextColor: 'white' },
// //     purple:  { name: 'Purple Dream',     bubbleColor: '#9D4EDD', bubbleTextColor: 'white' },
// //     orange:  { name: 'Sunset Orange',    bubbleColor: '#FF8C42', bubbleTextColor: 'white' },
// //     cyan:    { name: 'Cyan Cool',        bubbleColor: '#00D4FF', bubbleTextColor: 'black' },
// // };

// // // ─── Chat Backgrounds ─────────────────────────────────────────────────────────
// // const CHAT_BACKGROUNDS = {
// //     default:   { name: 'Light White',     light: '#F5F5F5',  dark: '#1a1a1a' },
// //     gradient1: { name: 'Soft Gradient',   gradientLight: ['#F0F7FF','#E6F3FF'],   gradientDark: ['#0a1a2a','#1a2a3a'] },
// //     gradient2: { name: 'Warm Gradient',   gradientLight: ['#FFF5E6','#FFE6CC'],   gradientDark: ['#2a1a0a','#3a2a0a'] },
// //     gradient3: { name: 'Cool Mint',       gradientLight: ['#E6F9F5','#CCF3EB'],   gradientDark: ['#0a2a2a','#0a3a3a'] },
// //     gradient4: { name: 'Lavender',        gradientLight: ['#F5E6FF','#ECC8FF'],   gradientDark: ['#2a1a3a','#3a1a4a'] },
// //     rose:      { name: 'Romantic Rose',   gradientLight: ['#FFE6F0','#FFCCDD'],   gradientDark: ['#2a0a1a','#3a0a2a'] },
// //     sunset:    { name: 'Sunset Blaze',    gradientLight: ['#FFE6CC','#FFD4A3'],   gradientDark: ['#3a1a00','#4a2a00'] },
// //     img1:      { name: 'Ocean Waves',     type: 'image', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1080&h=1920&fit=crop' },
// //     img2:      { name: 'Mountain View',   type: 'image', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop' },
// //     img3:      { name: 'Forest Green',    type: 'image', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1920&fit=crop' },
// //     img4:      { name: 'Sunset Sky',      type: 'image', image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1080&h=1920&fit=crop' },
// //     img5:      { name: 'Starry Night',    type: 'image', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1080&h=1920&fit=crop' },
// //     img6:      { name: 'Tropical Beach',  type: 'image', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1920&fit=crop' },
// // };

// // // ─── Bubble Styles ────────────────────────────────────────────────────────────
// // const BUBBLE_STYLES = {
// //     solid:   { name: 'Solid',         opacity: 1,    blur: 0  },
// //     glassy:  { name: 'Glassy',        opacity: 0.75, blur: 15 },
// //     premium: { name: 'Premium Glass', opacity: 0.85, blur: 20 },
// // };

// // // ─── Helper: hex color → rgba string ─────────────────────────────────────────
// // const hexToRgba = (hex, alpha) => {
// //     const r = parseInt(hex.slice(1, 3), 16);
// //     const g = parseInt(hex.slice(3, 5), 16);
// //     const b = parseInt(hex.slice(5, 7), 16);
// //     return `rgba(${r},${g},${b},${alpha})`;
// // };

// // // ─── Helper: get background gradient colors ───────────────────────────────────
// // const getBgGradient = (bgKey, isDark) => {
// //     const bg = CHAT_BACKGROUNDS[bgKey];
// //     if (!bg || bg.type === 'image') return isDark ? ['#1a1a1a','#1a1a1a'] : ['#F5F5F5','#F5F5F5'];
// //     if (bg.gradientLight) return isDark ? bg.gradientDark : bg.gradientLight;
// //     return [isDark ? bg.dark : bg.light, isDark ? bg.dark : bg.light];
// // };

// // // ─── ChatScreen ───────────────────────────────────────────────────────────────
// // const ChatScreen = ({ route, navigation }) => {
// //     const { userId, userForChat } = route.params;

// //     const {
// //         isDarkMode,
// //         selectedColorTheme,
// //         messageCornerRadius = 16,
// //         feedListView,
// //     } = useSelector(state => state.theme);

// //     let selector = useSelector(state => state?.user?.userData);
// //     if (Object.keys(selector).length !== 0) selector = JSON.parse(selector);

// //     // ── Core state ──────────────────────────────────────────────────────────
// //     const [currentUserId, setCurrentUserId] = useState(null);
// //     const [ChatMessages, setChatMessages]   = useState([]);
// //     const [inputText, setInputText]         = useState('');
// //     const [cursorPosition, setCursorPosition] = useState(0);
// //     const [selectedImage, setSelectedImage]  = useState(null);

// //     // ── Socket ───────────────────────────────────────────────────────────────
// //     const socket = useRef(null);

// //     // ── Sticker ──────────────────────────────────────────────────────────────
// //     const [showStickerPicker, setShowStickerPicker]     = useState(false);
// //     const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
// //     const stickerHeight = useRef(new Animated.Value(0)).current;

// //     // ── Edit / Delete ─────────────────────────────────────────────────────────
// //     const [selectedMessage, setSelectedMessage]     = useState(null);
// //     const [showMessageOptions, setShowMessageOptions] = useState(false);
// //     const [editingMessage, setEditingMessage]        = useState(null);

// //     // ── LIVE applied theme states ─────────────────────────────────────────────
// //     const [chatTheme,      setChatTheme]      = useState('default');
// //     const [chatBackground, setChatBackground] = useState('default');
// //     const [bubbleStyle,    setBubbleStyle]    = useState('glassy');

// //     // ── PENDING theme states (inside modal only) ──────────────────────────────
// //     const [showThemeModal,        setShowThemeModal]        = useState(false);
// //     const [pendingChatTheme,      setPendingChatTheme]      = useState('default');
// //     const [pendingChatBackground, setPendingChatBackground] = useState('default');
// //     const [pendingBubbleStyle,    setPendingBubbleStyle]    = useState('glassy');

// //     // ── Refs ─────────────────────────────────────────────────────────────────
// //     const inputRef             = useRef(null);
// //     const emojiSelectionTimer  = useRef(null);
// //     const editFocusTimer       = useRef(null);

// //     // ── Dynamic colors ────────────────────────────────────────────────────────
// //     const textColor  = isDarkMode ? '#fff'     : '#000';
// //     const headerBg   = isDarkMode ? '#252525'  : '#fff';
// //     const inputBg    = isDarkMode ? '#2a2a2a'  : '#F1F1F1';
// //     const borderColor = isDarkMode ? '#333'    : '#EEE';
// //     const stickerTabBg = isDarkMode ? '#2a2a2a' : '#F8F8F8';

// //     // ── Init ──────────────────────────────────────────────────────────────────
// //     useEffect(() => {
// //         setCurrentUserId(selector?._id);
// //     }, []);

// //     const GetChatHistory = async () => {
// //         try {
// //             const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
// //             setChatMessages(Chat?.data);
// //         } catch (error) {
// //             ToastMsg('Error fetching chat history');
// //         }
// //     };

// //     useEffect(() => {
// //         if (currentUserId) GetChatHistory();
// //     }, [userId, currentUserId]);

// //     // ── Socket setup ──────────────────────────────────────────────────────────
// //     useEffect(() => {
// //         socket.current = io('http://192.168.158.149:8080');
// //         socket.current.emit('joinRoom', { userId: currentUserId });

// //         socket.current.on('receiveMessage', (msg) => {
// //             setChatMessages(prev => [msg, ...prev]);
// //             socket.current.emit('markAsRead', { messageId: msg._id });
// //         });
// //         socket.current.on('messageUpdated', (updatedMsg) => {
// //             setChatMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
// //         });
// //         socket.current.on('messageDeleted', (deletedId) => {
// //             setChatMessages(prev => prev.filter(m => m._id !== deletedId));
// //         });

// //         return () => socket.current.disconnect();
// //     }, []);

// //     // ── Keyboard → close sticker ──────────────────────────────────────────────
// //     useEffect(() => {
// //         const sub = Keyboard.addListener(
// //             Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
// //             () => setShowStickerPicker(false),
// //         );
// //         return () => sub.remove();
// //     }, []);

// //     // ── Animate sticker panel ─────────────────────────────────────────────────
// //     useEffect(() => {
// //         Animated.timing(stickerHeight, {
// //             toValue: showStickerPicker ? 280 : 0,
// //             duration: 250,
// //             useNativeDriver: false,
// //         }).start();
// //     }, [showStickerPicker]);

// //     // ── Timer cleanup ─────────────────────────────────────────────────────────
// //     useEffect(() => {
// //         return () => {
// //             emojiSelectionTimer.current && clearTimeout(emojiSelectionTimer.current);
// //             editFocusTimer.current && clearTimeout(editFocusTimer.current);
// //         };
// //     }, []);

// //     // ── Open theme modal: snapshot current → pending ──────────────────────────
// //     const openThemeModal = () => {
// //         setPendingChatTheme(chatTheme);
// //         setPendingChatBackground(chatBackground);
// //         setPendingBubbleStyle(bubbleStyle);
// //         setShowThemeModal(true);
// //     };

// //     // ── Apply pending → live ──────────────────────────────────────────────────
// //     const applyTheme = () => {
// //         setChatTheme(pendingChatTheme);
// //         setChatBackground(pendingChatBackground);
// //         setBubbleStyle(pendingBubbleStyle);
// //         setShowThemeModal(false);
// //     };

// //     // ── Discard pending ───────────────────────────────────────────────────────
// //     const discardTheme = () => {
// //         setShowThemeModal(false);
// //         // pending states will be reset on next open via openThemeModal
// //     };

// //     // ── Message actions ───────────────────────────────────────────────────────
// //     const handleSendMessage = () => {
// //         if (!inputText.trim()) return;

// //         if (editingMessage) {
// //             socket.current.emit('editMessage', { messageId: editingMessage._id, newMessage: inputText });
// //             setChatMessages(prev =>
// //                 prev.map(m => m._id === editingMessage._id
// //                     ? { ...m, message: inputText, edited: true, editedAt: new Date() }
// //                     : m)
// //             );
// //             setEditingMessage(null);
// //             setInputText('');
// //             ToastMsg('Message edited');
// //         } else {
// //             const messageData = {
// //                 sender: currentUserId,
// //                 receiver: userId,
// //                 message: inputText,
// //                 type: 'text',
// //                 isSent: true,
// //                 isRead: false,
// //                 timestamp: new Date(),
// //             };
// //             socket.current.emit('sendMessage', messageData);
// //             setChatMessages(prev => [
// //                 { ...messageData, _id: Date.now().toString(), sender: { _id: currentUserId } },
// //                 ...prev,
// //             ]);
// //             setInputText('');
// //         }
// //     };

// //     const handleEmojiSelect = (emoji) => {
// //         const newText = inputText.slice(0, cursorPosition) + emoji + inputText.slice(cursorPosition);
// //         setInputText(newText);
// //         const newPos = cursorPosition + emoji.length;
// //         setCursorPosition(newPos);
// //         emojiSelectionTimer.current && clearTimeout(emojiSelectionTimer.current);
// //         emojiSelectionTimer.current = setTimeout(() => {
// //             inputRef.current?.setNativeProps({ selection: { start: newPos, end: newPos } });
// //         }, 0);
// //     };

// //     const handleLongPress = (item) => {
// //         const isMine = item.sender?._id === currentUserId || item.sender === currentUserId;
// //         if (isMine) { setSelectedMessage(item); setShowMessageOptions(true); }
// //     };

// //     const handleEditMessage = () => {
// //         setEditingMessage(selectedMessage);
// //         setInputText(selectedMessage.message);
// //         setShowMessageOptions(false);
// //         editFocusTimer.current && clearTimeout(editFocusTimer.current);
// //         editFocusTimer.current = setTimeout(() => inputRef.current?.focus(), 100);
// //     };

// //     const handleDeleteMessage = () => {
// //         Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
// //             { text: 'Cancel', style: 'cancel' },
// //             {
// //                 text: 'Delete', style: 'destructive',
// //                 onPress: () => {
// //                     socket.current.emit('deleteMessage', { messageId: selectedMessage._id });
// //                     setChatMessages(prev => prev.filter(m => m._id !== selectedMessage._id));
// //                     setShowMessageOptions(false);
// //                     ToastMsg('Message deleted');
// //                 },
// //             },
// //         ]);
// //     };

// //     const cancelEdit = () => { setEditingMessage(null); setInputText(''); };

// //     // ── Render message ────────────────────────────────────────────────────────
// //     const renderMessage = ({ item }) => {
// //         const isMine = item.sender?._id === currentUserId || item.sender === currentUserId;
// //         const bubbleCfg = BUBBLE_STYLES[bubbleStyle] || BUBBLE_STYLES.glassy;
// //         const themeCfg  = CHAT_THEMES[chatTheme]    || CHAT_THEMES.default;
// //         const isGlass   = bubbleStyle !== 'solid';

// //         const myBgColor = isGlass
// //             ? hexToRgba(themeCfg.bubbleColor, bubbleCfg.opacity)
// //             : themeCfg.bubbleColor;

// //         const otherBgColor = isGlass
// //             ? (isDarkMode ? 'rgba(42,42,42,0.7)' : 'rgba(241,241,241,0.7)')
// //             : (isDarkMode ? '#2a2a2a' : '#F1F1F1');

// //         return (
// //             <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.9} delayLongPress={500}>
// //                 <View style={[styles.messageContainer, isMine && styles.myMessage]}>
// //                     <View style={[
// //                         styles.messageBubble,
// //                         { borderRadius: messageCornerRadius },
// //                         { backgroundColor: isMine ? myBgColor : otherBgColor },
// //                         isGlass && {
// //                             borderWidth: 0.5,
// //                             borderColor: isMine ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
// //                         },
// //                         {
// //                             shadowColor: '#000',
// //                             shadowOffset: { width: 0, height: isGlass ? 2 : 1 },
// //                             shadowOpacity: isGlass ? 0.2 : 0.1,
// //                             shadowRadius: isGlass ? 8 : 2,
// //                             elevation: isGlass ? 4 : 1,
// //                         },
// //                     ]}>
// //                         {item.message && (
// //                             <Text style={[
// //                                 styles.messageText,
// //                                 {
// //                                     color: isMine ? themeCfg.bubbleTextColor : (isDarkMode ? '#fff' : '#000'),
// //                                     fontWeight: isGlass ? '500' : '400',
// //                                 },
// //                             ]}>
// //                                 {item.message}
// //                             </Text>
// //                         )}
// //                         <View style={styles.metaContainer}>
// //                             {item.edited && (
// //                                 <Text style={[styles.editedText, {
// //                                     color: isMine ? 'rgba(255,255,255,0.6)' : (isDarkMode ? '#666' : '#999'),
// //                                 }]}>edited</Text>
// //                             )}
// //                             <Text style={[styles.timestamp, {
// //                                 color: isMine ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray'),
// //                             }]}>
// //                                 {moment(item.timestamp).format('hh:mm A')}
// //                             </Text>
// //                             {isMine && (
// //                                 <Text style={styles.status}>{item.isRead ? '✓✓' : '✓'}</Text>
// //                             )}
// //                         </View>
// //                     </View>
// //                 </View>
// //             </TouchableOpacity>
// //         );
// //     };

// //     // ── Background wrapper ────────────────────────────────────────────────────
// //     const bgConfig   = CHAT_BACKGROUNDS[chatBackground];
// //     const isImageBg  = bgConfig?.type === 'image';
// //     const gradColors = getBgGradient(chatBackground, isDarkMode);

// //     const BackgroundWrapper = ({ children }) => {
// //         if (isImageBg) {
// //             return (
// //                 <ImageBackground
// //                     source={{ uri: bgConfig?.image }}
// //                     style={styles.container}
// //                     imageStyle={{ opacity: isDarkMode ? 0.5 : 0.7 }}
// //                 >
// //                     <LinearGradient
// //                         colors={isDarkMode
// //                             ? ['rgba(26,26,26,0.8)', 'rgba(26,26,26,0.8)']
// //                             : ['rgba(245,245,245,0.2)', 'rgba(245,245,245,0.2)']}
// //                         start={{ x: 0, y: 0 }}
// //                         end={{ x: 1, y: 1 }}
// //                         style={styles.container}
// //                     >
// //                         {children}
// //                     </LinearGradient>
// //                 </ImageBackground>
// //             );
// //         }
// //         return (
// //             <LinearGradient
// //                 colors={gradColors}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.container}
// //             >
// //                 {children}
// //             </LinearGradient>
// //         );
// //     };

// //     // ── Preview bubble helper (used inside theme modal) ───────────────────────
// //     const PreviewBubble = ({ mine, text }) => {
// //         const themeCfg  = CHAT_THEMES[pendingChatTheme]  || CHAT_THEMES.default;
// //         const bubbleCfg = BUBBLE_STYLES[pendingBubbleStyle] || BUBBLE_STYLES.glassy;
// //         const isGlass   = pendingBubbleStyle !== 'solid';

// //         const myBg    = isGlass ? hexToRgba(themeCfg.bubbleColor, bubbleCfg.opacity) : themeCfg.bubbleColor;
// //         const otherBg = isGlass
// //             ? (isDarkMode ? 'rgba(42,42,42,0.7)' : 'rgba(241,241,241,0.7)')
// //             : (isDarkMode ? '#2a2a2a' : '#F1F1F1');

// //         return (
// //             <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
// //                 <View style={{
// //                     backgroundColor: mine ? myBg : otherBg,
// //                     borderRadius: messageCornerRadius,
// //                     paddingHorizontal: 12,
// //                     paddingVertical: 8,
// //                     maxWidth: '70%',
// //                     borderWidth: isGlass ? 0.5 : 0,
// //                     borderColor: isGlass
// //                         ? (mine ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)')
// //                         : 'transparent',
// //                     shadowColor: '#000',
// //                     shadowOffset: { width: 0, height: isGlass ? 2 : 1 },
// //                     shadowOpacity: isGlass ? 0.2 : 0.1,
// //                     shadowRadius: isGlass ? 8 : 2,
// //                     elevation: isGlass ? 4 : 1,
// //                 }}>
// //                     <Text style={{
// //                         color: mine ? themeCfg.bubbleTextColor : (isDarkMode ? '#fff' : '#000'),
// //                         fontSize: 14,
// //                         fontWeight: isGlass ? '500' : '400',
// //                     }}>{text}</Text>
// //                 </View>
// //             </View>
// //         );
// //     };

// //     // ─────────────────────────────────────────────────────────────────────────
// //     return (
// //         <BackgroundWrapper>
// //             <StatusBar
// //                 translucent
// //                 backgroundColor="transparent"
// //                 barStyle={isDarkMode ? 'light-content' : 'dark-content'}
// //             />

// //             {/* ── Header ── */}
// //             <View style={[styles.headerWrapper, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
// //                 <SpaceBetweenRow style={styles.headerContent}>
// //                     <View style={styles.headerLeft}>
// //                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //                             <Icon name="arrow-left" size={24} color={textColor} />
// //                         </TouchableOpacity>
// //                         <Image
// //                             source={userForChat?.Image ? { uri: userForChat.Image } : IMG.ProfileImagePost}
// //                             style={styles.profileImage}
// //                         />
// //                         <TouchableOpacity style={styles.headerText} onPress={openThemeModal}>
// //                             <Text style={[styles.profileName, { color: textColor }]}>{userForChat?.FullName}</Text>
// //                             <Text style={[styles.userStatus, { color: isDarkMode ? '#888' : '#666' }]}>Active today</Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                     <TouchableOpacity style={styles.moreButton}>
// //                         <Icon name="more-vertical" size={24} color={textColor} />
// //                     </TouchableOpacity>
// //                 </SpaceBetweenRow>
// //             </View>

// //             {/* ── Chat area ── */}
// //             <KeyboardAvoidingView
// //                 style={styles.chatWrapper}
// //                 behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
// //                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
// //             >
// //                 <FlatList
// //                     data={ChatMessages}
// //                     keyExtractor={(item, index) => item._id?.toString() || index.toString()}
// //                     renderItem={renderMessage}
// //                     style={styles.chatContainer}
// //                     contentContainerStyle={styles.chatContent}
// //                     inverted
// //                 />

// //                 {/* Editing bar */}
// //                 {editingMessage && (
// //                     <View style={[styles.editingBar, { backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0', borderTopColor: borderColor }]}>
// //                         <View style={styles.editingContent}>
// //                             <Icon name="edit-2" size={16} color="#4F52FE" />
// //                             <View style={styles.editingTextContainer}>
// //                                 <Text style={[styles.editingLabel, { color: '#4F52FE' }]}>Editing message</Text>
// //                                 <Text style={[styles.editingPreview, { color: isDarkMode ? '#ccc' : '#666' }]} numberOfLines={1}>
// //                                     {editingMessage.message}
// //                                 </Text>
// //                             </View>
// //                         </View>
// //                         <TouchableOpacity onPress={cancelEdit} style={styles.cancelEdit}>
// //                             <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
// //                         </TouchableOpacity>
// //                     </View>
// //                 )}

// //                 {/* Sticker picker */}
// //                 <Animated.View style={[
// //                     styles.stickerPickerContainer,
// //                     { height: stickerHeight, backgroundColor: headerBg, borderTopColor: borderColor },
// //                 ]}>
// //                     {showStickerPicker && (
// //                         <>
// //                             <View style={[styles.stickerTabs, { backgroundColor: stickerTabBg, borderBottomColor: borderColor }]}>
// //                                 {Object.keys(STICKER_PACKS).map(pack => (
// //                                     <TouchableOpacity
// //                                         key={pack}
// //                                         style={[styles.stickerTab, selectedStickerPack === pack && styles.stickerTabActive]}
// //                                         onPress={() => setSelectedStickerPack(pack)}
// //                                     >
// //                                         <Text style={[
// //                                             styles.stickerTabText,
// //                                             { color: textColor },
// //                                             selectedStickerPack === pack && styles.stickerTabTextActive,
// //                                         ]}>
// //                                             {pack.charAt(0).toUpperCase() + pack.slice(1)}
// //                                         </Text>
// //                                     </TouchableOpacity>
// //                                 ))}
// //                             </View>
// //                             <FlatList
// //                                 data={STICKER_PACKS[selectedStickerPack]}
// //                                 numColumns={6}
// //                                 keyExtractor={(item, i) => i.toString()}
// //                                 renderItem={({ item }) => (
// //                                     <TouchableOpacity style={styles.stickerItem} onPress={() => handleEmojiSelect(item)}>
// //                                         <Text style={styles.stickerEmoji}>{item}</Text>
// //                                     </TouchableOpacity>
// //                                 )}
// //                                 contentContainerStyle={styles.stickerGrid}
// //                                 showsVerticalScrollIndicator={false}
// //                             />
// //                         </>
// //                     )}
// //                 </Animated.View>

// //                 {/* Input bar */}
// //                 <View style={[styles.inputContainer, { backgroundColor: headerBg, borderTopColor: borderColor }]}>
// //                     <TouchableOpacity
// //                         onPress={() => { Keyboard.dismiss(); setShowStickerPicker(prev => !prev); }}
// //                         style={styles.iconButton}
// //                     >
// //                         <Icon
// //                             name={showStickerPicker ? 'x' : 'smile'}
// //                             size={24}
// //                             color={showStickerPicker ? '#4F52FE' : (isDarkMode ? '#888' : '#666')}
// //                         />
// //                     </TouchableOpacity>

// //                     <TextInput
// //                         ref={inputRef}
// //                         style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
// //                         value={inputText}
// //                         onChangeText={setInputText}
// //                         onSelectionChange={e => setCursorPosition(e.nativeEvent.selection.start)}
// //                         onFocus={() => setShowStickerPicker(false)}
// //                         placeholder="Message"
// //                         placeholderTextColor={isDarkMode ? '#666' : '#999'}
// //                         multiline
// //                     />

// //                     <TouchableOpacity
// //                         onPress={handleSendMessage}
// //                         style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
// //                         disabled={!inputText.trim()}
// //                     >
// //                         <Icon name={editingMessage ? 'check' : 'send'} size={18} color="white" />
// //                     </TouchableOpacity>
// //                 </View>
// //             </KeyboardAvoidingView>

// //             {/* ── Message options modal ── */}
// //             <Modal
// //                 visible={showMessageOptions}
// //                 transparent
// //                 animationType="fade"
// //                 onRequestClose={() => setShowMessageOptions(false)}
// //             >
// //                 <TouchableWithoutFeedback onPress={() => setShowMessageOptions(false)}>
// //                     <View style={styles.modalOverlay}>
// //                         <TouchableWithoutFeedback>
// //                             <View style={[styles.optionsContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : 'white' }]}>
// //                                 <TouchableOpacity style={styles.optionButton} onPress={handleEditMessage}>
// //                                     <Icon name="edit-2" size={20} color={textColor} />
// //                                     <Text style={[styles.optionText, { color: textColor }]}>Edit Message</Text>
// //                                 </TouchableOpacity>
// //                                 <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />
// //                                 <TouchableOpacity style={styles.optionButton} onPress={handleDeleteMessage}>
// //                                     <Icon name="trash-2" size={20} color="#FF3B30" />
// //                                     <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete Message</Text>
// //                                 </TouchableOpacity>
// //                                 <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />
// //                                 <TouchableOpacity style={styles.optionButton} onPress={() => setShowMessageOptions(false)}>
// //                                     <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
// //                                     <Text style={[styles.optionText, { color: isDarkMode ? '#888' : '#666' }]}>Cancel</Text>
// //                                 </TouchableOpacity>
// //                             </View>
// //                         </TouchableWithoutFeedback>
// //                     </View>
// //                 </TouchableWithoutFeedback>
// //             </Modal>

// //             {/* ── Chat Theme modal ── */}
// //             <Modal
// //                 visible={showThemeModal}
// //                 transparent
// //                 animationType="slide"
// //                 onRequestClose={discardTheme}
// //             >
// //                 <View style={styles.themeModalOverlay}>
// //                     <View style={[styles.themeModalContent, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>

// //                         {/* Header */}
// //                         <View style={[styles.themeModalHeader, { borderBottomColor: borderColor }]}>
// //                             <Text style={[styles.themeModalTitle, { color: textColor }]}>Customize Chat</Text>
// //                             <TouchableOpacity onPress={discardTheme}>
// //                                 <Icon name="x" size={24} color={textColor} />
// //                             </TouchableOpacity>
// //                         </View>

// //                         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

// //                             {/* ── Bubble Theme ── */}
// //                             <View style={styles.themeSection}>
// //                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Chat Bubble Theme</Text>
// //                                 <View style={styles.themeGrid}>
// //                                     {Object.entries(CHAT_THEMES).map(([key, theme]) => {
// //                                         const isSelected = pendingChatTheme === key;
// //                                         return (
// //                                             <TouchableOpacity
// //                                                 key={key}
// //                                                 style={[
// //                                                     styles.themeCard,
// //                                                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
// //                                                     isSelected && styles.themeCardSelected,
// //                                                 ]}
// //                                                 onPress={() => setPendingChatTheme(key)}
// //                                                 activeOpacity={0.7}
// //                                             >
// //                                                 <View style={[styles.themeColorPreview, { backgroundColor: theme.bubbleColor }]} />
// //                                                 {isSelected && (
// //                                                     <View style={styles.checkIcon}>
// //                                                         <Icon name="check-circle" size={20} color="#4F52FE" />
// //                                                     </View>
// //                                                 )}
// //                                                 <Text style={[styles.themeCardText, { color: textColor }]}>{theme.name}</Text>
// //                                             </TouchableOpacity>
// //                                         );
// //                                     })}
// //                                 </View>
// //                             </View>

// //                             {/* ── Background ── */}
// //                             <View style={styles.themeSection}>
// //                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Chat Background</Text>
// //                                 <View style={styles.themeGrid}>
// //                                     {Object.entries(CHAT_BACKGROUNDS).map(([key, bg]) => {
// //                                         const isSelected = pendingChatBackground === key;
// //                                         const previewColor = bg.type === 'image'
// //                                             ? null
// //                                             : (bg.gradientLight
// //                                                 ? (isDarkMode ? bg.gradientDark[0] : bg.gradientLight[0])
// //                                                 : (isDarkMode ? bg.dark : bg.light));
// //                                         return (
// //                                             <TouchableOpacity
// //                                                 key={key}
// //                                                 style={[
// //                                                     styles.themeCard,
// //                                                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
// //                                                     isSelected && styles.themeCardSelected,
// //                                                 ]}
// //                                                 onPress={() => setPendingChatBackground(key)}
// //                                                 activeOpacity={0.7}
// //                                             >
// //                                                 {bg.type === 'image' ? (
// //                                                     <Image
// //                                                         source={{ uri: bg.image }}
// //                                                         style={[styles.themeColorPreview, { borderRadius: 8 }]}
// //                                                     />
// //                                                 ) : (
// //                                                     <View style={[styles.themeColorPreview, { backgroundColor: previewColor }]} />
// //                                                 )}
// //                                                 {isSelected && (
// //                                                     <View style={styles.checkIcon}>
// //                                                         <Icon name="check-circle" size={20} color="#4F52FE" />
// //                                                     </View>
// //                                                 )}
// //                                                 <Text style={[styles.themeCardText, { color: textColor }]}>{bg.name}</Text>
// //                                             </TouchableOpacity>
// //                                         );
// //                                     })}
// //                                 </View>
// //                             </View>

// //                             {/* ── Bubble Style ── */}
// //                             <View style={styles.themeSection}>
// //                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Message Bubble Style</Text>
// //                                 <View style={styles.themeGrid}>
// //                                     {Object.entries(BUBBLE_STYLES).map(([key, bStyle]) => {
// //                                         const isSelected = pendingBubbleStyle === key;   // ✅ fixed: was using live state
// //                                         const themeCfg   = CHAT_THEMES[pendingChatTheme] || CHAT_THEMES.default;
// //                                         const previewBg  = key === 'solid'
// //                                             ? themeCfg.bubbleColor
// //                                             : hexToRgba(themeCfg.bubbleColor, bStyle.opacity);
// //                                         return (
// //                                             <TouchableOpacity
// //                                                 key={key}
// //                                                 style={[
// //                                                     styles.themeCard,
// //                                                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
// //                                                     isSelected && styles.themeCardSelected,
// //                                                 ]}
// //                                                 onPress={() => setPendingBubbleStyle(key)}
// //                                                 activeOpacity={0.7}
// //                                             >
// //                                                 <View style={[
// //                                                     styles.themeColorPreview,
// //                                                     {
// //                                                         backgroundColor: previewBg,
// //                                                         borderWidth: key !== 'solid' ? 0.5 : 0,
// //                                                         borderColor: 'rgba(255,255,255,0.3)',
// //                                                     },
// //                                                 ]} />
// //                                                 {isSelected && (
// //                                                     <View style={styles.checkIcon}>
// //                                                         <Icon name="check-circle" size={20} color="#4F52FE" />
// //                                                     </View>
// //                                                 )}
// //                                                 <Text style={[styles.themeCardText, { color: textColor }]}>{bStyle.name}</Text>
// //                                             </TouchableOpacity>
// //                                         );
// //                                     })}
// //                                 </View>
// //                             </View>

// //                             {/* ── Live Preview ── */}
// //                             <View style={styles.themeSection}>
// //                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Preview</Text>
// //                                 <View style={{
// //                                     backgroundColor: (() => {
// //                                         const bg = CHAT_BACKGROUNDS[pendingChatBackground];
// //                                         if (!bg || bg.type === 'image') return isDarkMode ? '#1a1a1a' : '#F5F5F5';
// //                                         if (bg.gradientLight) return isDarkMode ? bg.gradientDark[0] : bg.gradientLight[0];
// //                                         return isDarkMode ? bg.dark : bg.light;
// //                                     })(),
// //                                     borderRadius: 12,
// //                                     padding: 16,
// //                                     minHeight: 140,
// //                                 }}>
// //                                     <PreviewBubble mine text="Hey! How are you? 👋" />
// //                                     <PreviewBubble mine={false} text="I'm doing great! 😊" />
// //                                     <PreviewBubble mine text="Let's catch up soon!" />
// //                                 </View>
// //                             </View>
// //                         </ScrollView>

// //                         {/* ── Sticky Apply / Cancel footer ── */}
// //                         <View style={[styles.themeFooter, {
// //                             backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
// //                             borderTopColor: borderColor,
// //                         }]}>
// //                             <TouchableOpacity
// //                                 style={[styles.footerBtn, styles.footerBtnCancel, { borderColor }]}
// //                                 onPress={discardTheme}
// //                             >
// //                                 <Text style={[styles.footerBtnText, { color: isDarkMode ? '#ccc' : '#555' }]}>Cancel</Text>
// //                             </TouchableOpacity>
// //                             <TouchableOpacity
// //                                 style={[styles.footerBtn, styles.footerBtnApply]}
// //                                 onPress={applyTheme}
// //                             >
// //                                 <Text style={[styles.footerBtnText, { color: '#fff' }]}>Apply</Text>
// //                             </TouchableOpacity>
// //                         </View>

// //                     </View>
// //                 </View>
// //             </Modal>
// //         </BackgroundWrapper>
// //     );
// // };

// // // ─── Static Styles (outside component to avoid recreation on render) ──────────
// // const styles = StyleSheet.create({
// //     container:      { flex: 1 },
// //     chatWrapper:    { flex: 1 },
// //     chatContainer:  { flex: 1 },
// //     chatContent:    { paddingHorizontal: 16, paddingVertical: 8 },

// //     // Header
// //     headerWrapper: {
// //         paddingTop: 50,
// //         paddingBottom: 10,
// //         borderBottomWidth: 1,
// //     },
// //     headerContent:  { paddingHorizontal: 16, alignItems: 'center' },
// //     headerLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
// //     backButton:     { padding: 4 },
// //     profileImage:   { width: 40, height: 40, borderRadius: 20 },
// //     headerText:     { marginLeft: 4 },
// //     profileName:    { fontSize: 16, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// //     userStatus:     { fontSize: 12, marginTop: 2 },
// //     moreButton:     { padding: 4 },

// //     // Messages
// //     messageContainer: { flexDirection: 'row', marginVertical: 3, alignItems: 'flex-end' },
// //     myMessage:        { justifyContent: 'flex-end' },
// //     messageBubble:    { padding: 12, maxWidth: '75%', minWidth: 60 },
// //     messageText:      { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium, lineHeight: 20 },
// //     metaContainer:    { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, gap: 4 },
// //     editedText:       { fontSize: 9, fontStyle: 'italic' },
// //     timestamp:        { fontSize: 10 },
// //     status:           { fontSize: 12, color: 'rgba(255,255,255,0.8)' },

// //     // Editing bar
// //     editingBar:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
// //     editingContent:       { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
// //     editingTextContainer: { flex: 1 },
// //     editingLabel:         { fontSize: 12, fontWeight: '600', marginBottom: 2 },
// //     editingPreview:       { fontSize: 13 },
// //     cancelEdit:           { padding: 4 },

// //     // Input
// //     inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1 },
// //     iconButton:     { padding: 8, paddingBottom: 12 },
// //     input:          { flex: 1, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginHorizontal: 8, fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium, maxHeight: 100 },
// //     sendButton:     { backgroundColor: '#4F52FE', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
// //     sendButtonDisabled: { opacity: 0.5 },

// //     // Sticker
// //     stickerPickerContainer: { overflow: 'hidden', borderTopWidth: 1 },
// //     stickerTabs:            { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1 },
// //     stickerTab:             { paddingVertical: 8, paddingHorizontal: 16, marginRight: 4, borderRadius: 16 },
// //     stickerTabActive:       { backgroundColor: '#4F52FE' },
// //     stickerTabText:         { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// //     stickerTabTextActive:   { color: 'white', fontWeight: '600' },
// //     stickerGrid:            { paddingHorizontal: 8, paddingTop: 12, paddingBottom: 8 },
// //     stickerItem:            { width: '16.666%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
// //     stickerEmoji:           { fontSize: 32 },

// //     // Message options modal
// //     modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
// //     optionsContainer: { width: '80%', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
// //     optionButton:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, gap: 12 },
// //     optionText:       { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// //     optionDivider:    { height: 0.5, marginHorizontal: 20 },

// //     // Theme modal
// //     themeModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
// //     themeModalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '92%' },
// //     themeModalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
// //     themeModalTitle:   { fontSize: 18, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// //     themeSection:      { paddingHorizontal: 16, paddingVertical: 12 },
// //     themeSectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// //     themeGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
// //     themeCard:         { width: '47%', borderRadius: 12, padding: 12, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'transparent' },
// //     themeCardSelected: { borderColor: '#4F52FE' },
// //     themeColorPreview: { width: 60, height: 60, borderRadius: 8 },
// //     themeCardText:     { fontSize: 12, fontWeight: '500', textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// //     checkIcon:         { position: 'absolute', top: 8, right: 8 },

// //     // Theme footer
// //     themeFooter: {
// //         flexDirection: 'row',
// //         gap: 12,
// //         paddingHorizontal: 16,
// //         paddingVertical: 14,
// //         borderTopWidth: 1,
// //     },
// //     footerBtn: {
// //         flex: 1,
// //         paddingVertical: 14,
// //         borderRadius: 14,
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //     },
// //     footerBtnCancel: { borderWidth: 1 },
// //     footerBtnApply:  { backgroundColor: '#4F52FE' },
// //     footerBtnText:   { fontSize: 15, fontWeight: '700', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// // });

// // export default ChatScreen;



// import React, { useContext, useEffect, useRef, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     Image,
//     StyleSheet,
//     StatusBar,
//     TouchableWithoutFeedback,
//     Animated,
//     Keyboard,
//     KeyboardAvoidingView,
//     Platform,
//     Modal,
//     Alert,
//     ScrollView,
//     ImageBackground,
// } from "react-native";
// import LinearGradient from 'react-native-linear-gradient';
// import ImagePicker from "react-native-image-picker";
// import IMG from "../../assets/Images";
// import SpaceBetweenRow from "../../components/wrapper/spacebetween";
// import { FONTS_FAMILY } from "../../assets/Fonts";
// import urls from "../../config/urls";
// import { ToastMsg } from "../../utils/helperFunctions";
// import { apiGet, apiPut, getItem } from "../../utils/Apis";
// import { io } from "socket.io-client";
// import moment from "moment";
// import Icon from 'react-native-vector-icons/Feather';
// import { useSelector } from "react-redux";

// // ─── Sticker Packs ────────────────────────────────────────────────────────────
// const STICKER_PACKS = {
//     emojis: [
//         '😀','😂','🤣','😊','😍','🥰','😎','🤗',
//         '🤔','😴','🥳','😇','🤩','😋','😜','🤪',
//         '😱','😭','😤','🤯','😷','🤧','🥴','😵'
//     ],
//     hearts: [
//         '❤️','🧡','💛','💚','💙','💜','🖤','🤍',
//         '💖','💗','💓','💞','💕','💘','💝','💟',
//         '❣️','💔','❤️‍🔥','❤️‍🩹','💋','💌','💏','💑'
//     ],
//     hands: [
//         '👍','👎','👏','🙌','💪','🤝','🙏','✌️',
//         '🤞','👌','🤙','🤘','🤟','✊','👊','🫶',
//         '👋','🤚','🖐️','✋','🖖','👆','👇','☝️'
//     ],
// };

// // ─── Chat Themes ──────────────────────────────────────────────────────────────
// const CHAT_THEMES = {
//     default: { name: 'Default Blue',    bubbleColor: '#4F52FE', bubbleTextColor: 'white' },
//     pink:    { name: 'Pink Vibes',       bubbleColor: '#FF1493', bubbleTextColor: 'white' },
//     green:   { name: 'Green Energy',     bubbleColor: '#00B050', bubbleTextColor: 'white' },
//     purple:  { name: 'Purple Dream',     bubbleColor: '#9D4EDD', bubbleTextColor: 'white' },
//     orange:  { name: 'Sunset Orange',    bubbleColor: '#FF8C42', bubbleTextColor: 'white' },
//     cyan:    { name: 'Cyan Cool',        bubbleColor: '#00D4FF', bubbleTextColor: 'black' },
// };

// // ─── Chat Backgrounds ─────────────────────────────────────────────────────────
// const CHAT_BACKGROUNDS = {
//     default:   { name: 'Light White',     light: '#F5F5F5',  dark: '#1a1a1a' },
//     gradient1: { name: 'Soft Gradient',   gradientLight: ['#F0F7FF','#E6F3FF'],   gradientDark: ['#0a1a2a','#1a2a3a'] },
//     gradient2: { name: 'Warm Gradient',   gradientLight: ['#FFF5E6','#FFE6CC'],   gradientDark: ['#2a1a0a','#3a2a0a'] },
//     gradient3: { name: 'Cool Mint',       gradientLight: ['#E6F9F5','#CCF3EB'],   gradientDark: ['#0a2a2a','#0a3a3a'] },
//     gradient4: { name: 'Lavender',        gradientLight: ['#F5E6FF','#ECC8FF'],   gradientDark: ['#2a1a3a','#3a1a4a'] },
//     rose:      { name: 'Romantic Rose',   gradientLight: ['#FFE6F0','#FFCCDD'],   gradientDark: ['#2a0a1a','#3a0a2a'] },
//     sunset:    { name: 'Sunset Blaze',    gradientLight: ['#FFE6CC','#FFD4A3'],   gradientDark: ['#3a1a00','#4a2a00'] },
//     img1:      { name: 'Ocean Waves',     type: 'image', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1080&h=1920&fit=crop' },
//     img2:      { name: 'Mountain View',   type: 'image', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop' },
//     img3:      { name: 'Forest Green',    type: 'image', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1920&fit=crop' },
//     img4:      { name: 'Sunset Sky',      type: 'image', image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1080&h=1920&fit=crop' },
//     img5:      { name: 'Starry Night',    type: 'image', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1080&h=1920&fit=crop' },
//     img6:      { name: 'Tropical Beach',  type: 'image', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1920&fit=crop' },
// };

// // ─── Bubble Styles ────────────────────────────────────────────────────────────
// const BUBBLE_STYLES = {
//     solid:   { name: 'Solid',         opacity: 1,    blur: 0  },
//     glassy:  { name: 'Glassy',        opacity: 0.75, blur: 15 },
//     premium: { name: 'Premium Glass', opacity: 0.85, blur: 20 },
// };

// // ─── Helper: hex color → rgba string ─────────────────────────────────────────
// const hexToRgba = (hex, alpha) => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);
//     return `rgba(${r},${g},${b},${alpha})`;
// };

// // ─── Helper: get background gradient colors ───────────────────────────────────
// const getBgGradient = (bgKey, isDark) => {
//     const bg = CHAT_BACKGROUNDS[bgKey];
//     if (!bg || bg.type === 'image') return isDark ? ['#1a1a1a','#1a1a1a'] : ['#F5F5F5','#F5F5F5'];
//     if (bg.gradientLight) return isDark ? bg.gradientDark : bg.gradientLight;
//     return [isDark ? bg.dark : bg.light, isDark ? bg.dark : bg.light];
// };

// // ─── ChatScreen ───────────────────────────────────────────────────────────────
// const ChatScreen = ({ route, navigation }) => {
//     const { userId, userForChat } = route.params;

//     const {
//         isDarkMode,
//         selectedColorTheme,
//         messageCornerRadius = 16,
//         feedListView,
//     } = useSelector(state => state.theme);

//     let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length !== 0) selector = JSON.parse(selector);

//     // ── Core state ──────────────────────────────────────────────────────────
//     const [currentUserId, setCurrentUserId] = useState(null);
//     const [ChatMessages, setChatMessages]   = useState([]);
//     const [inputText, setInputText]         = useState('');
//     const [cursorPosition, setCursorPosition] = useState(0);
//     const [selectedImage, setSelectedImage]  = useState(null);

//     // ── Socket ───────────────────────────────────────────────────────────────
//     const socket = useRef(null);

//     // ── Sticker ──────────────────────────────────────────────────────────────
//     const [showStickerPicker, setShowStickerPicker]     = useState(false);
//     const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
//     const stickerHeight = useRef(new Animated.Value(0)).current;

//     // ── Edit / Delete ─────────────────────────────────────────────────────────
//     const [selectedMessage, setSelectedMessage]     = useState(null);
//     const [showMessageOptions, setShowMessageOptions] = useState(false);
//     const [editingMessage, setEditingMessage]        = useState(null);

//     // ── LIVE applied theme states ─────────────────────────────────────────────
//     const [chatTheme,      setChatTheme]      = useState('default');
//     const [chatBackground, setChatBackground] = useState('default');
//     const [bubbleStyle,    setBubbleStyle]    = useState('glassy');

//     // ── PENDING theme states (inside modal only) ──────────────────────────────
//     const [showThemeModal,        setShowThemeModal]        = useState(false);
//     const [pendingChatTheme,      setPendingChatTheme]      = useState('default');
//     const [pendingChatBackground, setPendingChatBackground] = useState('default');
//     const [pendingBubbleStyle,    setPendingBubbleStyle]    = useState('glassy');

//     // ── Refs ─────────────────────────────────────────────────────────────────
//     const inputRef             = useRef(null);
//     const emojiSelectionTimer  = useRef(null);
//     const editFocusTimer       = useRef(null);

//     // ── Dynamic colors ────────────────────────────────────────────────────────
//     const textColor  = isDarkMode ? '#fff'     : '#000';
//     const headerBg   = isDarkMode ? '#252525'  : '#fff';
//     const inputBg    = isDarkMode ? '#2a2a2a'  : '#F1F1F1';
//     const borderColor = isDarkMode ? '#333'    : '#EEE';
//     const stickerTabBg = isDarkMode ? '#2a2a2a' : '#F8F8F8';

//     // ── Init ──────────────────────────────────────────────────────────────────
//     useEffect(() => {
//         setCurrentUserId(selector?._id);
//     }, []);

//     const GetChatHistory = async () => {
//         try {
//             const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
//             setChatMessages(Chat?.data);
//         } catch (error) {
//             ToastMsg('Error fetching chat history');
//         }
//     };

//     useEffect(() => {
//         if (currentUserId) GetChatHistory();
//     }, [userId, currentUserId]);

//     // ── Socket setup ──────────────────────────────────────────────────────────
//     useEffect(() => {
//         socket.current = io('http://192.168.158.149:8080');
//         socket.current.emit('joinRoom', { userId: currentUserId });

//         socket.current.on('receiveMessage', (msg) => {
//             setChatMessages(prev => [msg, ...prev]);
//             socket.current.emit('markAsRead', { messageId: msg._id });
//         });
//         socket.current.on('messageUpdated', (updatedMsg) => {
//             setChatMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
//         });
//         socket.current.on('messageDeleted', (deletedId) => {
//             setChatMessages(prev => prev.filter(m => m._id !== deletedId));
//         });

//         return () => socket.current.disconnect();
//     }, []);

//     // ── Keyboard → close sticker ──────────────────────────────────────────────
//     useEffect(() => {
//         const sub = Keyboard.addListener(
//             Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
//             () => setShowStickerPicker(false),
//         );
//         return () => sub.remove();
//     }, []);

//     // ── Animate sticker panel ─────────────────────────────────────────────────
//     useEffect(() => {
//         Animated.timing(stickerHeight, {
//             toValue: showStickerPicker ? 280 : 0,
//             duration: 250,
//             useNativeDriver: false,
//         }).start();
//     }, [showStickerPicker]);

//     // ── Timer cleanup ─────────────────────────────────────────────────────────
//     useEffect(() => {
//         return () => {
//             emojiSelectionTimer.current && clearTimeout(emojiSelectionTimer.current);
//             editFocusTimer.current && clearTimeout(editFocusTimer.current);
//         };
//     }, []);

//     // ── Open theme modal: snapshot current → pending ──────────────────────────
//     const openThemeModal = () => {
//         setPendingChatTheme(chatTheme);
//         setPendingChatBackground(chatBackground);
//         setPendingBubbleStyle(bubbleStyle);
//         setShowThemeModal(true);
//     };

//     // ── Apply pending → live ──────────────────────────────────────────────────
//     const applyTheme = () => {
//         setChatTheme(pendingChatTheme);
//         setChatBackground(pendingChatBackground);
//         setBubbleStyle(pendingBubbleStyle);
//         setShowThemeModal(false);
//     };

//     // ── Discard pending ───────────────────────────────────────────────────────
//     const discardTheme = () => {
//         setShowThemeModal(false);
//         // pending states will be reset on next open via openThemeModal
//     };

//     // ── Message actions ───────────────────────────────────────────────────────
//     const handleSendMessage = () => {
//         if (!inputText.trim()) return;

//         if (editingMessage) {
//             socket.current.emit('editMessage', { messageId: editingMessage._id, newMessage: inputText });
//             setChatMessages(prev =>
//                 prev.map(m => m._id === editingMessage._id
//                     ? { ...m, message: inputText, edited: true, editedAt: new Date() }
//                     : m)
//             );
//             setEditingMessage(null);
//             setInputText('');
//             ToastMsg('Message edited');
//         } else {
//             const messageData = {
//                 sender: currentUserId,
//                 receiver: userId,
//                 message: inputText,
//                 type: 'text',
//                 isSent: true,
//                 isRead: false,
//                 timestamp: new Date(),
//             };
//             socket.current.emit('sendMessage', messageData);
//             setChatMessages(prev => [
//                 { ...messageData, _id: Date.now().toString(), sender: { _id: currentUserId } },
//                 ...prev,
//             ]);
//             setInputText('');
//         }
//     };

//     const handleEmojiSelect = (emoji) => {
//         const newText = inputText.slice(0, cursorPosition) + emoji + inputText.slice(cursorPosition);
//         setInputText(newText);
//         const newPos = cursorPosition + emoji.length;
//         setCursorPosition(newPos);
//         emojiSelectionTimer.current && clearTimeout(emojiSelectionTimer.current);
//         emojiSelectionTimer.current = setTimeout(() => {
//             inputRef.current?.setNativeProps({ selection: { start: newPos, end: newPos } });
//         }, 0);
//     };

//     const handleLongPress = (item) => {
//         const isMine = item.sender?._id === currentUserId || item.sender === currentUserId;
//         if (isMine) { setSelectedMessage(item); setShowMessageOptions(true); }
//     };

//     const handleEditMessage = () => {
//         setEditingMessage(selectedMessage);
//         setInputText(selectedMessage.message);
//         setShowMessageOptions(false);
//         editFocusTimer.current && clearTimeout(editFocusTimer.current);
//         editFocusTimer.current = setTimeout(() => inputRef.current?.focus(), 100);
//     };

//     const handleDeleteMessage = () => {
//         Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
//             { text: 'Cancel', style: 'cancel' },
//             {
//                 text: 'Delete', style: 'destructive',
//                 onPress: () => {
//                     socket.current.emit('deleteMessage', { messageId: selectedMessage._id });
//                     setChatMessages(prev => prev.filter(m => m._id !== selectedMessage._id));
//                     setShowMessageOptions(false);
//                     ToastMsg('Message deleted');
//                 },
//             },
//         ]);
//     };

//     const cancelEdit = () => { setEditingMessage(null); setInputText(''); };

//     // ── Render message ────────────────────────────────────────────────────────
//     const renderMessage = ({ item }) => {
//         const isMine = item.sender?._id === currentUserId || item.sender === currentUserId;
//         const bubbleCfg = BUBBLE_STYLES[bubbleStyle] || BUBBLE_STYLES.glassy;
//         const themeCfg  = CHAT_THEMES[chatTheme]    || CHAT_THEMES.default;
//         const isGlass   = bubbleStyle !== 'solid';

//         const myBgColor = isGlass
//             ? hexToRgba(themeCfg.bubbleColor, bubbleCfg.opacity)
//             : themeCfg.bubbleColor;

//         const otherBgColor = isGlass
//             ? (isDarkMode ? 'rgba(42,42,42,0.7)' : 'rgba(241,241,241,0.7)')
//             : (isDarkMode ? '#2a2a2a' : '#F1F1F1');

//         return (
//             <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.9} delayLongPress={500}>
//                 <View style={[styles.messageContainer, isMine && styles.myMessage]}>
//                     <View style={[
//                         styles.messageBubble,
//                         { borderRadius: messageCornerRadius },
//                         { backgroundColor: isMine ? myBgColor : otherBgColor },
//                         isGlass && {
//                             borderWidth: 0.5,
//                             borderColor: isMine ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
//                         },
//                         {
//                             shadowColor: '#000',
//                             shadowOffset: { width: 0, height: isGlass ? 2 : 1 },
//                             shadowOpacity: isGlass ? 0.2 : 0.1,
//                             shadowRadius: isGlass ? 8 : 2,
//                             elevation: isGlass ? 4 : 1,
//                         },
//                     ]}>
//                         {item.message && (
//                             <Text style={[
//                                 styles.messageText,
//                                 {
//                                     color: isMine ? themeCfg.bubbleTextColor : (isDarkMode ? '#fff' : '#000'),
//                                     fontWeight: isGlass ? '500' : '400',
//                                 },
//                             ]}>
//                                 {item.message}
//                             </Text>
//                         )}
//                         <View style={styles.metaContainer}>
//                             {item.edited && (
//                                 <Text style={[styles.editedText, {
//                                     color: isMine ? 'rgba(255,255,255,0.6)' : (isDarkMode ? '#666' : '#999'),
//                                 }]}>edited</Text>
//                             )}
//                             <Text style={[styles.timestamp, {
//                                 color: isMine ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray'),
//                             }]}>
//                                 {moment(item.timestamp).format('hh:mm A')}
//                             </Text>
//                             {isMine && (
//                                 <Text style={styles.status}>{item.isRead ? '✓✓' : '✓'}</Text>
//                             )}
//                         </View>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     // ── Background wrapper ────────────────────────────────────────────────────
//     const bgConfig   = CHAT_BACKGROUNDS[chatBackground];
//     const isImageBg  = bgConfig?.type === 'image';
//     const gradColors = getBgGradient(chatBackground, isDarkMode);

//     const BackgroundWrapper = ({ children }) => {
//         if (isImageBg) {
//             return (
//                 <ImageBackground
//                     source={{ uri: bgConfig?.image }}
//                     style={styles.container}
//                     // imageStyle={{ opacity: isDarkMode ? 0.5 : 0.7 }}
//                 >
//                     <LinearGradient
//                         colors={isDarkMode
//                             ? ['rgba(221, 216, 216, 0.8)', 'rgba(96, 95, 95, 0.8)']
//                             : ['rgba(245,245,245,0.2)', 'rgba(245,245,245,0.2)']}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                         style={styles.container}
//                     >
//                         {children}
//                     </LinearGradient>
//                 </ImageBackground>
//             );
//         }
//         return (
//             <LinearGradient
//                 colors={gradColors}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.container}
//             >
//                 {children}
//             </LinearGradient>
//         );
//     };

//     // ── Preview bubble helper (used inside theme modal) ───────────────────────
//     const PreviewBubble = ({ mine, text }) => {
//         const themeCfg  = CHAT_THEMES[pendingChatTheme]  || CHAT_THEMES.default;
//         const bubbleCfg = BUBBLE_STYLES[pendingBubbleStyle] || BUBBLE_STYLES.glassy;
//         const isGlass   = pendingBubbleStyle !== 'solid';

//         const myBg    = isGlass ? hexToRgba(themeCfg.bubbleColor, bubbleCfg.opacity) : themeCfg.bubbleColor;
//         const otherBg = isGlass
//             ? (isDarkMode ? 'rgba(42,42,42,0.7)' : 'rgba(241,241,241,0.7)')
//             : (isDarkMode ? '#2a2a2a' : '#F1F1F1');

//         return (
//             <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
//                 <View style={{
//                     backgroundColor: mine ? myBg : otherBg,
//                     borderRadius: messageCornerRadius,
//                     paddingHorizontal: 12,
//                     paddingVertical: 8,
//                     maxWidth: '70%',
//                     borderWidth: isGlass ? 0.5 : 0,
//                     borderColor: isGlass
//                         ? (mine ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)')
//                         : 'transparent',
//                     shadowColor: '#000',
//                     shadowOffset: { width: 0, height: isGlass ? 2 : 1 },
//                     shadowOpacity: isGlass ? 0.2 : 0.1,
//                     shadowRadius: isGlass ? 8 : 2,
//                     elevation: isGlass ? 4 : 1,
//                 }}>
//                     <Text style={{
//                         color: mine ? themeCfg.bubbleTextColor : (isDarkMode ? '#fff' : '#000'),
//                         fontSize: 14,
//                         fontWeight: isGlass ? '500' : '400',
//                     }}>{text}</Text>
//                 </View>
//             </View>
//         );
//     };

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <BackgroundWrapper>
//             <StatusBar
//                 translucent
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//             />

//             {/* ── Header ── */}
//             <View style={[styles.headerWrapper, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
//                 <SpaceBetweenRow style={styles.headerContent}>
//                     <View style={styles.headerLeft}>
//                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                             <Icon name="arrow-left" size={24} color={textColor} />
//                         </TouchableOpacity>
//                         <Image
//                             source={userForChat?.Image ? { uri: userForChat.Image } : IMG.ProfileImagePost}
//                             style={styles.profileImage}
//                         />
//                         <TouchableOpacity style={styles.headerText} onPress={openThemeModal}>
//                             <Text style={[styles.profileName, { color: textColor }]}>{userForChat?.FullName}</Text>
//                             <Text style={[styles.userStatus, { color: isDarkMode ? '#888' : '#666' }]}>Active today</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <TouchableOpacity style={styles.moreButton}>
//                         <Icon name="more-vertical" size={24} color={textColor} />
//                     </TouchableOpacity>
//                 </SpaceBetweenRow>
//             </View>

//             {/* ── Chat area ── */}
//             <KeyboardAvoidingView
//                 style={styles.chatWrapper}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//                 <FlatList
//                     data={ChatMessages}
//                     keyExtractor={(item, index) => item._id?.toString() || index.toString()}
//                     renderItem={renderMessage}
//                     style={styles.chatContainer}
//                     contentContainerStyle={styles.chatContent}
//                     inverted
//                 />

//                 {/* Editing bar */}
//                 {editingMessage && (
//                     <View style={[styles.editingBar, { backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0', borderTopColor: borderColor }]}>
//                         <View style={styles.editingContent}>
//                             <Icon name="edit-2" size={16} color="#4F52FE" />
//                             <View style={styles.editingTextContainer}>
//                                 <Text style={[styles.editingLabel, { color: '#4F52FE' }]}>Editing message</Text>
//                                 <Text style={[styles.editingPreview, { color: isDarkMode ? '#ccc' : '#666' }]} numberOfLines={1}>
//                                     {editingMessage.message}
//                                 </Text>
//                             </View>
//                         </View>
//                         <TouchableOpacity onPress={cancelEdit} style={styles.cancelEdit}>
//                             <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
//                         </TouchableOpacity>
//                     </View>
//                 )}

//                 {/* Sticker picker */}
//                 <Animated.View style={[
//                     styles.stickerPickerContainer,
//                     { height: stickerHeight, backgroundColor: headerBg, borderTopColor: borderColor },
//                 ]}>
//                     {showStickerPicker && (
//                         <>
//                             <View style={[styles.stickerTabs, { backgroundColor: stickerTabBg, borderBottomColor: borderColor }]}>
//                                 {Object.keys(STICKER_PACKS).map(pack => (
//                                     <TouchableOpacity
//                                         key={pack}
//                                         style={[styles.stickerTab, selectedStickerPack === pack && styles.stickerTabActive]}
//                                         onPress={() => setSelectedStickerPack(pack)}
//                                     >
//                                         <Text style={[
//                                             styles.stickerTabText,
//                                             { color: textColor },
//                                             selectedStickerPack === pack && styles.stickerTabTextActive,
//                                         ]}>
//                                             {pack.charAt(0).toUpperCase() + pack.slice(1)}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                             <FlatList
//                                 data={STICKER_PACKS[selectedStickerPack]}
//                                 numColumns={6}
//                                 keyExtractor={(item, i) => i.toString()}
//                                 renderItem={({ item }) => (
//                                     <TouchableOpacity style={styles.stickerItem} onPress={() => handleEmojiSelect(item)}>
//                                         <Text style={styles.stickerEmoji}>{item}</Text>
//                                     </TouchableOpacity>
//                                 )}
//                                 contentContainerStyle={styles.stickerGrid}
//                                 showsVerticalScrollIndicator={false}
//                             />
//                         </>
//                     )}
//                 </Animated.View>

//                 {/* Input bar */}
//                 <View style={[styles.inputContainer, { backgroundColor: headerBg, borderTopColor: borderColor }]}>
//                     <TouchableOpacity
//                         onPress={() => { Keyboard.dismiss(); setShowStickerPicker(prev => !prev); }}
//                         style={styles.iconButton}
//                     >
//                         <Icon
//                             name={showStickerPicker ? 'x' : 'smile'}
//                             size={24}
//                             color={showStickerPicker ? '#4F52FE' : (isDarkMode ? '#888' : '#666')}
//                         />
//                     </TouchableOpacity>

//                     <TextInput
//                         ref={inputRef}
//                         style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
//                         value={inputText}
//                         onChangeText={setInputText}
//                         onSelectionChange={e => setCursorPosition(e.nativeEvent.selection.start)}
//                         onFocus={() => setShowStickerPicker(false)}
//                         placeholder="Message"
//                         placeholderTextColor={isDarkMode ? '#666' : '#999'}
//                         multiline
//                     />

//                     <TouchableOpacity
//                         onPress={handleSendMessage}
//                         style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
//                         disabled={!inputText.trim()}
//                     >
//                         <Icon name={editingMessage ? 'check' : 'send'} size={18} color="white" />
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>

//             {/* ── Message options modal ── */}
//             <Modal
//                 visible={showMessageOptions}
//                 transparent
//                 animationType="fade"
//                 onRequestClose={() => setShowMessageOptions(false)}
//             >
//                 <TouchableWithoutFeedback onPress={() => setShowMessageOptions(false)}>
//                     <View style={styles.modalOverlay}>
//                         <TouchableWithoutFeedback>
//                             <View style={[styles.optionsContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : 'white' }]}>
//                                 <TouchableOpacity style={styles.optionButton} onPress={handleEditMessage}>
//                                     <Icon name="edit-2" size={20} color={textColor} />
//                                     <Text style={[styles.optionText, { color: textColor }]}>Edit Message</Text>
//                                 </TouchableOpacity>
//                                 <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />
//                                 <TouchableOpacity style={styles.optionButton} onPress={handleDeleteMessage}>
//                                     <Icon name="trash-2" size={20} color="#FF3B30" />
//                                     <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete Message</Text>
//                                 </TouchableOpacity>
//                                 <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />
//                                 <TouchableOpacity style={styles.optionButton} onPress={() => setShowMessageOptions(false)}>
//                                     <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
//                                     <Text style={[styles.optionText, { color: isDarkMode ? '#888' : '#666' }]}>Cancel</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </TouchableWithoutFeedback>
//                     </View>
//                 </TouchableWithoutFeedback>
//             </Modal>

//             {/* ── Chat Theme modal ── */}
//             <Modal
//                 visible={showThemeModal}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={discardTheme}
//             >
//                 <View style={styles.themeModalOverlay}>
//                     <View style={[styles.themeModalContent, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>

//                         {/* Header */}
//                         <View style={[styles.themeModalHeader, { borderBottomColor: borderColor }]}>
//                             <Text style={[styles.themeModalTitle, { color: textColor }]}>Customize Chat</Text>
//                             <TouchableOpacity onPress={discardTheme}>
//                                 <Icon name="x" size={24} color={textColor} />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

//                             {/* ── Bubble Theme ── */}
//                             <View style={styles.themeSection}>
//                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Chat Bubble Theme</Text>
//                                 <View style={styles.themeGrid}>
//                                     {Object.entries(CHAT_THEMES).map(([key, theme]) => {
//                                         const isSelected = pendingChatTheme === key;
//                                         return (
//                                             <TouchableOpacity
//                                                 key={key}
//                                                 style={[
//                                                     styles.themeCard,
//                                                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
//                                                     isSelected && styles.themeCardSelected,
//                                                 ]}
//                                                 onPress={() => setPendingChatTheme(key)}
//                                                 activeOpacity={0.7}
//                                             >
//                                                 <View style={[styles.themeColorPreview, { backgroundColor: theme.bubbleColor }]} />
//                                                 {isSelected && (
//                                                     <View style={styles.checkIcon}>
//                                                         <Icon name="check-circle" size={20} color="#4F52FE" />
//                                                     </View>
//                                                 )}
//                                                 <Text style={[styles.themeCardText, { color: textColor }]}>{theme.name}</Text>
//                                             </TouchableOpacity>
//                                         );
//                                     })}
//                                 </View>
//                             </View>

//                             {/* ── Background ── */}
//                             <View style={styles.themeSection}>
//                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Chat Background</Text>
//                                 <View style={styles.themeGrid}>
//                                     {Object.entries(CHAT_BACKGROUNDS).map(([key, bg]) => {
//                                         const isSelected = pendingChatBackground === key;
//                                         const previewColor = bg.type === 'image'
//                                             ? null
//                                             : (bg.gradientLight
//                                                 ? (isDarkMode ? bg.gradientDark[0] : bg.gradientLight[0])
//                                                 : (isDarkMode ? bg.dark : bg.light));
//                                         return (
//                                             <TouchableOpacity
//                                                 key={key}
//                                                 style={[
//                                                     styles.themeCard,
//                                                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
//                                                     isSelected && styles.themeCardSelected,
//                                                 ]}
//                                                 onPress={() => setPendingChatBackground(key)}
//                                                 activeOpacity={0.7}
//                                             >
//                                                 {bg.type === 'image' ? (
//                                                     <Image
//                                                         source={{ uri: bg.image }}
//                                                         style={[styles.themeColorPreview, { borderRadius: 8 }]}
//                                                     />
//                                                 ) : (
//                                                     <View style={[styles.themeColorPreview, { backgroundColor: previewColor }]} />
//                                                 )}
//                                                 {isSelected && (
//                                                     <View style={styles.checkIcon}>
//                                                         <Icon name="check-circle" size={20} color="#4F52FE" />
//                                                     </View>
//                                                 )}
//                                                 <Text style={[styles.themeCardText, { color: textColor }]}>{bg.name}</Text>
//                                             </TouchableOpacity>
//                                         );
//                                     })}
//                                 </View>
//                             </View>

//                             {/* ── Bubble Style ── */}
//                             <View style={styles.themeSection}>
//                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Message Bubble Style</Text>
//                                 <View style={styles.themeGrid}>
//                                     {Object.entries(BUBBLE_STYLES).map(([key, bStyle]) => {
//                                         const isSelected = pendingBubbleStyle === key;   // ✅ fixed: was using live state
//                                         const themeCfg   = CHAT_THEMES[pendingChatTheme] || CHAT_THEMES.default;
//                                         const previewBg  = key === 'solid'
//                                             ? themeCfg.bubbleColor
//                                             : hexToRgba(themeCfg.bubbleColor, bStyle.opacity);
//                                         return (
//                                             <TouchableOpacity
//                                                 key={key}
//                                                 style={[
//                                                     styles.themeCard,
//                                                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
//                                                     isSelected && styles.themeCardSelected,
//                                                 ]}
//                                                 onPress={() => setPendingBubbleStyle(key)}
//                                                 activeOpacity={0.7}
//                                             >
//                                                 <View style={[
//                                                     styles.themeColorPreview,
//                                                     {
//                                                         backgroundColor: previewBg,
//                                                         borderWidth: key !== 'solid' ? 0.5 : 0,
//                                                         borderColor: 'rgba(255,255,255,0.3)',
//                                                     },
//                                                 ]} />
//                                                 {isSelected && (
//                                                     <View style={styles.checkIcon}>
//                                                         <Icon name="check-circle" size={20} color="#4F52FE" />
//                                                     </View>
//                                                 )}
//                                                 <Text style={[styles.themeCardText, { color: textColor }]}>{bStyle.name}</Text>
//                                             </TouchableOpacity>
//                                         );
//                                     })}
//                                 </View>
//                             </View>

//                             {/* ── Live Preview ── */}
//                             <View style={styles.themeSection}>
//                                 <Text style={[styles.themeSectionTitle, { color: textColor }]}>Preview</Text>
//                                 <View style={{
//                                     backgroundColor: (() => {
//                                         const bg = CHAT_BACKGROUNDS[pendingChatBackground];
//                                         if (!bg || bg.type === 'image') return isDarkMode ? '#1a1a1a' : '#F5F5F5';
//                                         if (bg.gradientLight) return isDarkMode ? bg.gradientDark[0] : bg.gradientLight[0];
//                                         return isDarkMode ? bg.dark : bg.light;
//                                     })(),
//                                     borderRadius: 12,
//                                     padding: 16,
//                                     minHeight: 140,
//                                 }}>
//                                     <PreviewBubble mine text="Hey! How are you? 👋" />
//                                     <PreviewBubble mine={false} text="I'm doing great! 😊" />
//                                     <PreviewBubble mine text="Let's catch up soon!" />
//                                 </View>
//                             </View>
//                         </ScrollView>

//                         {/* ── Sticky Apply / Cancel footer ── */}
//                         <View style={[styles.themeFooter, {
//                             backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
//                             borderTopColor: borderColor,
//                         }]}>
//                             <TouchableOpacity
//                                 style={[styles.footerBtn, styles.footerBtnCancel, { borderColor }]}
//                                 onPress={discardTheme}
//                             >
//                                 <Text style={[styles.footerBtnText, { color: isDarkMode ? '#ccc' : '#555' }]}>Cancel</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={[styles.footerBtn, styles.footerBtnApply]}
//                                 onPress={applyTheme}
//                             >
//                                 <Text style={[styles.footerBtnText, { color: '#fff' }]}>Apply</Text>
//                             </TouchableOpacity>
//                         </View>

//                     </View>
//                 </View>
//             </Modal>
//         </BackgroundWrapper>
//     );
// };

// // ─── Static Styles (outside component to avoid recreation on render) ──────────
// const styles = StyleSheet.create({
//     container:      { flex: 1 },
//     chatWrapper:    { flex: 1 },
//     chatContainer:  { flex: 1 },
//     chatContent:    { paddingHorizontal: 16, paddingVertical: 8 },

//     // Header
//     headerWrapper: {
//         paddingTop: 50,
//         paddingBottom: 10,
//         borderBottomWidth: 1,
//     },
//     headerContent:  { paddingHorizontal: 16, alignItems: 'center' },
//     headerLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
//     backButton:     { padding: 4 },
//     profileImage:   { width: 40, height: 40, borderRadius: 20 },
//     headerText:     { marginLeft: 4 },
//     profileName:    { fontSize: 16, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//     userStatus:     { fontSize: 12, marginTop: 2 },
//     moreButton:     { padding: 4 },

//     // Messages
//     messageContainer: { flexDirection: 'row', marginVertical: 3, alignItems: 'flex-end' },
//     myMessage:        { justifyContent: 'flex-end' },
//     messageBubble:    { padding: 12, maxWidth: '75%', minWidth: 60 },
//     messageText:      { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium, lineHeight: 20 },
//     metaContainer:    { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, gap: 4 },
//     editedText:       { fontSize: 9, fontStyle: 'italic' },
//     timestamp:        { fontSize: 10 },
//     status:           { fontSize: 12, color: 'rgba(255,255,255,0.8)' },

//     // Editing bar
//     editingBar:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
//     editingContent:       { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
//     editingTextContainer: { flex: 1 },
//     editingLabel:         { fontSize: 12, fontWeight: '600', marginBottom: 2 },
//     editingPreview:       { fontSize: 13 },
//     cancelEdit:           { padding: 4 },

//     // Input
//     inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1 },
//     iconButton:     { padding: 8, paddingBottom: 12 },
//     input:          { flex: 1, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginHorizontal: 8, fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium, maxHeight: 100 },
//     sendButton:     { backgroundColor: '#4F52FE', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
//     sendButtonDisabled: { opacity: 0.5 },

//     // Sticker
//     stickerPickerContainer: { overflow: 'hidden', borderTopWidth: 1 },
//     stickerTabs:            { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1 },
//     stickerTab:             { paddingVertical: 8, paddingHorizontal: 16, marginRight: 4, borderRadius: 16 },
//     stickerTabActive:       { backgroundColor: '#4F52FE' },
//     stickerTabText:         { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//     stickerTabTextActive:   { color: 'white', fontWeight: '600' },
//     stickerGrid:            { paddingHorizontal: 8, paddingTop: 12, paddingBottom: 8 },
//     stickerItem:            { width: '16.666%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
//     stickerEmoji:           { fontSize: 32 },

//     // Message options modal
//     modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
//     optionsContainer: { width: '80%', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
//     optionButton:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, gap: 12 },
//     optionText:       { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//     optionDivider:    { height: 0.5, marginHorizontal: 20 },

//     // Theme modal
//     themeModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//     themeModalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '92%' },
//     themeModalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
//     themeModalTitle:   { fontSize: 18, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//     themeSection:      { paddingHorizontal: 16, paddingVertical: 12 },
//     themeSectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//     themeGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
//     themeCard:         { width: '47%', borderRadius: 12, padding: 12, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'transparent' },
//     themeCardSelected: { borderColor: '#4F52FE' },
//     themeColorPreview: { width: 60, height: 60, borderRadius: 8 },
//     themeCardText:     { fontSize: 12, fontWeight: '500', textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//     checkIcon:         { position: 'absolute', top: 8, right: 8 },

//     // Theme footer
//     themeFooter: {
//         flexDirection: 'row',
//         gap: 12,
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//         borderTopWidth: 1,
//     },
//     footerBtn: {
//         flex: 1,
//         paddingVertical: 14,
//         borderRadius: 14,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     footerBtnCancel: { borderWidth: 1 },
//     footerBtnApply:  { backgroundColor: '#4F52FE' },
//     footerBtnText:   { fontSize: 15, fontWeight: '700', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
// });

// export default ChatScreen;



import React, { useContext, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    StatusBar,
    TouchableWithoutFeedback,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Alert,
    ScrollView,
    ImageBackground,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from "react-native-image-picker";
import IMG from "../../assets/Images";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import { FONTS_FAMILY } from "../../assets/Fonts";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { apiGet, apiPut, getItem } from "../../utils/Apis";
import { io } from "socket.io-client";
import moment from "moment";
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from "react-redux";

// ─── Sticker Packs ────────────────────────────────────────────────────────────
const STICKER_PACKS = {
    emojis: [
        '😀','😂','🤣','😊','😍','🥰','😎','🤗',
        '🤔','😴','🥳','😇','🤩','😋','😜','🤪',
        '😱','😭','😤','🤯','😷','🤧','🥴','😵'
    ],
    hearts: [
        '❤️','🧡','💛','💚','💙','💜','🖤','🤍',
        '💖','💗','💓','💞','💕','💘','💝','💟',
        '❣️','💔','❤️‍🔥','❤️‍🩹','💋','💌','💏','💑'
    ],
    hands: [
        '👍','👎','👏','🙌','💪','🤝','🙏','✌️',
        '🤞','👌','🤙','🤘','🤟','✊','👊','🫶',
        '👋','🤚','🖐️','✋','🖖','👆','👇','☝️'
    ],
};

// ─── Chat Themes ──────────────────────────────────────────────────────────────
const CHAT_THEMES = {
    default: { name: 'Default Blue',    bubbleColor: '#4F52FE', bubbleTextColor: 'white' },
    pink:    { name: 'Pink Vibes',       bubbleColor: '#FF1493', bubbleTextColor: 'white' },
    green:   { name: 'Green Energy',     bubbleColor: '#00B050', bubbleTextColor: 'white' },
    purple:  { name: 'Purple Dream',     bubbleColor: '#9D4EDD', bubbleTextColor: 'white' },
    orange:  { name: 'Sunset Orange',    bubbleColor: '#FF8C42', bubbleTextColor: 'white' },
    cyan:    { name: 'Cyan Cool',        bubbleColor: '#00D4FF', bubbleTextColor: 'black' },
};

// ─── Chat Backgrounds ─────────────────────────────────────────────────────────
const CHAT_BACKGROUNDS = {
    default:   { name: 'Light White',     light: '#F5F5F5',  dark: '#1a1a1a' },
    gradient1: { name: 'Soft Gradient',   gradientLight: ['#F0F7FF','#E6F3FF'],   gradientDark: ['#0a1a2a','#1a2a3a'] },
    gradient2: { name: 'Warm Gradient',   gradientLight: ['#FFF5E6','#FFE6CC'],   gradientDark: ['#2a1a0a','#3a2a0a'] },
    gradient3: { name: 'Cool Mint',       gradientLight: ['#E6F9F5','#CCF3EB'],   gradientDark: ['#0a2a2a','#0a3a3a'] },
    gradient4: { name: 'Lavender',        gradientLight: ['#F5E6FF','#ECC8FF'],   gradientDark: ['#2a1a3a','#3a1a4a'] },
    rose:      { name: 'Romantic Rose',   gradientLight: ['#FFE6F0','#FFCCDD'],   gradientDark: ['#2a0a1a','#3a0a2a'] },
    sunset:    { name: 'Sunset Blaze',    gradientLight: ['#FFE6CC','#FFD4A3'],   gradientDark: ['#3a1a00','#4a2a00'] },
    img1:      { name: 'Ocean Waves',     type: 'image', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1080&h=1920&fit=crop' },
    img2:      { name: 'Mountain View',   type: 'image', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop' },
    img3:      { name: 'Forest Green',    type: 'image', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1920&fit=crop' },
    img4:      { name: 'Sunset Sky',      type: 'image', image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1080&h=1920&fit=crop' },
    img5:      { name: 'Starry Night',    type: 'image', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1080&h=1920&fit=crop' },
    img6:      { name: 'Tropical Beach',  type: 'image', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1920&fit=crop' },
};

// ─── Bubble Styles ────────────────────────────────────────────────────────────
const BUBBLE_STYLES = {
    solid:   { name: 'Solid',         opacity: 1,    blur: 0  },
    glassy:  { name: 'Glassy',        opacity: 0.75, blur: 15 },
    premium: { name: 'Premium Glass', opacity: 0.85, blur: 20 },
};

// ─── Helper: hex color → rgba string ─────────────────────────────────────────
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
};

// ─── Helper: get background gradient colors ───────────────────────────────────
const getBgGradient = (bgKey, isDark) => {
    const bg = CHAT_BACKGROUNDS[bgKey];
    if (!bg || bg.type === 'image') return isDark ? ['#1a1a1a','#1a1a1a'] : ['#F5F5F5','#F5F5F5'];
    if (bg.gradientLight) return isDark ? bg.gradientDark : bg.gradientLight;
    return [isDark ? bg.dark : bg.light, isDark ? bg.dark : bg.light];
};

// ─── ChatScreen ───────────────────────────────────────────────────────────────
const ChatScreen = ({ route, navigation }) => {
    const { userId, userForChat } = route.params;

    const {
        isDarkMode,
        selectedColorTheme,
        messageCornerRadius = 16,
        feedListView,
    } = useSelector(state => state.theme);

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length !== 0) selector = JSON.parse(selector);

    // ── Core state ──────────────────────────────────────────────────────────
    const [currentUserId, setCurrentUserId] = useState(null);
    const [ChatMessages, setChatMessages]   = useState([]);
    const [inputText, setInputText]         = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [selectedImage, setSelectedImage]  = useState(null);

    // ── Socket ───────────────────────────────────────────────────────────────
    const socket = useRef(null);

    // ── Sticker ──────────────────────────────────────────────────────────────
    const [showStickerPicker, setShowStickerPicker]     = useState(false);
    const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
    const stickerHeight = useRef(new Animated.Value(0)).current;

    // ── Edit / Delete ─────────────────────────────────────────────────────────
    const [selectedMessage, setSelectedMessage]     = useState(null);
    const [showMessageOptions, setShowMessageOptions] = useState(false);
    const [editingMessage, setEditingMessage]        = useState(null);

    // ── LIVE applied theme states ─────────────────────────────────────────────
    const [chatTheme,      setChatTheme]      = useState('default');
    const [chatBackground, setChatBackground] = useState('default');
    const [bubbleStyle,    setBubbleStyle]    = useState('glassy');

    // ── PENDING theme states (inside modal only) ──────────────────────────────
    const [showThemeModal,        setShowThemeModal]        = useState(false);
    const [pendingChatTheme,      setPendingChatTheme]      = useState('default');
    const [pendingChatBackground, setPendingChatBackground] = useState('default');
    const [pendingBubbleStyle,    setPendingBubbleStyle]    = useState('glassy');

    // ── Refs ─────────────────────────────────────────────────────────────────
    const inputRef             = useRef(null);
    const emojiSelectionTimer  = useRef(null);
    const editFocusTimer       = useRef(null);

    // ── Dynamic colors ────────────────────────────────────────────────────────
    const textColor  = isDarkMode ? '#fff'     : '#000';
    const headerBg   = isDarkMode ? '#252525'  : '#fff';
    const inputBg    = isDarkMode ? '#2a2a2a'  : '#F1F1F1';
    const borderColor = isDarkMode ? '#333'    : '#EEE';
    const stickerTabBg = isDarkMode ? '#2a2a2a' : '#F8F8F8';

    // ── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        setCurrentUserId(selector?._id);
    }, []);

    const GetChatHistory = async () => {
        try {
            const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
            setChatMessages(Chat?.data);
        } catch (error) {
            ToastMsg('Error fetching chat history');
        }
    };

    useEffect(() => {
        if (currentUserId) GetChatHistory();
    }, [userId, currentUserId]);

    // ── Socket setup ──────────────────────────────────────────────────────────
    useEffect(() => {
        socket.current = io('http://192.168.158.149:8080');
        socket.current.emit('joinRoom', { userId: currentUserId });

        socket.current.on('receiveMessage', (msg) => {
            setChatMessages(prev => [msg, ...prev]);
            socket.current.emit('markAsRead', { messageId: msg._id });
        });
        socket.current.on('messageUpdated', (updatedMsg) => {
            setChatMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
        });
        socket.current.on('messageDeleted', (deletedId) => {
            setChatMessages(prev => prev.filter(m => m._id !== deletedId));
        });

        return () => socket.current.disconnect();
    }, []);

    // ── Keyboard → close sticker ──────────────────────────────────────────────
    useEffect(() => {
        const sub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setShowStickerPicker(false),
        );
        return () => sub.remove();
    }, []);

    // ── Animate sticker panel ─────────────────────────────────────────────────
    useEffect(() => {
        Animated.timing(stickerHeight, {
            toValue: showStickerPicker ? 280 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [showStickerPicker]);

    // ── Timer cleanup ─────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            emojiSelectionTimer.current && clearTimeout(emojiSelectionTimer.current);
            editFocusTimer.current && clearTimeout(editFocusTimer.current);
        };
    }, []);

    // ── Open theme modal: snapshot current → pending ──────────────────────────
    const openThemeModal = () => {
        setPendingChatTheme(chatTheme);
        setPendingChatBackground(chatBackground);
        setPendingBubbleStyle(bubbleStyle);
        setShowThemeModal(true);
    };

    // ── Apply pending → live ──────────────────────────────────────────────────
    const applyTheme = () => {
        setChatTheme(pendingChatTheme);
        setChatBackground(pendingChatBackground);
        setBubbleStyle(pendingBubbleStyle);
        setShowThemeModal(false);
    };

    // ── Discard pending ───────────────────────────────────────────────────────
    const discardTheme = () => {
        setShowThemeModal(false);
        // pending states will be reset on next open via openThemeModal
    };

    // ── Message actions ───────────────────────────────────────────────────────
    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        if (editingMessage) {
            socket.current.emit('editMessage', { messageId: editingMessage._id, newMessage: inputText });
            setChatMessages(prev =>
                prev.map(m => m._id === editingMessage._id
                    ? { ...m, message: inputText, edited: true, editedAt: new Date() }
                    : m)
            );
            setEditingMessage(null);
            setInputText('');
            ToastMsg('Message edited');
        } else {
            const messageData = {
                sender: currentUserId,
                receiver: userId,
                message: inputText,
                type: 'text',
                isSent: true,
                isRead: false,
                timestamp: new Date(),
            };
            socket.current.emit('sendMessage', messageData);
            setChatMessages(prev => [
                { ...messageData, _id: Date.now().toString(), sender: { _id: currentUserId } },
                ...prev,
            ]);
            setInputText('');
        }
    };

    const handleEmojiSelect = (emoji) => {
        const newText = inputText.slice(0, cursorPosition) + emoji + inputText.slice(cursorPosition);
        setInputText(newText);
        const newPos = cursorPosition + emoji.length;
        setCursorPosition(newPos);
        emojiSelectionTimer.current && clearTimeout(emojiSelectionTimer.current);
        emojiSelectionTimer.current = setTimeout(() => {
            inputRef.current?.setNativeProps({ selection: { start: newPos, end: newPos } });
        }, 0);
    };

    const handleLongPress = (item) => {
        const isMine = item.sender?._id === currentUserId || item.sender === currentUserId;
        if (isMine) { setSelectedMessage(item); setShowMessageOptions(true); }
    };

    const handleEditMessage = () => {
        setEditingMessage(selectedMessage);
        setInputText(selectedMessage.message);
        setShowMessageOptions(false);
        editFocusTimer.current && clearTimeout(editFocusTimer.current);
        editFocusTimer.current = setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleDeleteMessage = () => {
        Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive',
                onPress: () => {
                    socket.current.emit('deleteMessage', { messageId: selectedMessage._id });
                    setChatMessages(prev => prev.filter(m => m._id !== selectedMessage._id));
                    setShowMessageOptions(false);
                    ToastMsg('Message deleted');
                },
            },
        ]);
    };

    const cancelEdit = () => { setEditingMessage(null); setInputText(''); };

    // ── Render message ────────────────────────────────────────────────────────
    const renderMessage = ({ item }) => {
        const isMine = item.sender?._id === currentUserId || item.sender === currentUserId;
        const bubbleCfg = BUBBLE_STYLES[bubbleStyle] || BUBBLE_STYLES.glassy;
        const themeCfg  = CHAT_THEMES[chatTheme]    || CHAT_THEMES.default;
        const isGlass   = bubbleStyle !== 'solid';

        const myBgColor = isGlass
            ? hexToRgba(themeCfg.bubbleColor, bubbleCfg.opacity)
            : themeCfg.bubbleColor;

        const otherBgColor = isGlass
            ? (isDarkMode ? 'rgba(42,42,42,0.7)' : 'rgba(241,241,241,0.7)')
            : (isDarkMode ? '#2a2a2a' : '#F1F1F1');

        return (
            <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.9} delayLongPress={500}>
                <View style={[styles.messageContainer, isMine && styles.myMessage]}>
                    <View style={[
                        styles.messageBubble,
                        { borderRadius: messageCornerRadius },
                        { backgroundColor: isMine ? myBgColor : otherBgColor },
                        isGlass && {
                            borderWidth: 0.5,
                            borderColor: isMine ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                        },
                        {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: isGlass ? 2 : 1 },
                            shadowOpacity: isGlass ? 0.2 : 0.1,
                            shadowRadius: isGlass ? 8 : 2,
                            elevation: isGlass ? 4 : 1,
                        },
                    ]}>
                        {item.message && (
                            <Text style={[
                                styles.messageText,
                                {
                                    color: isMine ? themeCfg.bubbleTextColor : (isDarkMode ? '#fff' : '#000'),
                                    fontWeight: isGlass ? '500' : '400',
                                },
                            ]}>
                                {item.message}
                            </Text>
                        )}
                        <View style={styles.metaContainer}>
                            {item.edited && (
                                <Text style={[styles.editedText, {
                                    color: isMine ? 'rgba(255,255,255,0.6)' : (isDarkMode ? '#666' : '#999'),
                                }]}>edited</Text>
                            )}
                            <Text style={[styles.timestamp, {
                                color: isMine ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray'),
                            }]}>
                                {moment(item.timestamp).format('hh:mm A')}
                            </Text>
                            {isMine && (
                                <Text style={styles.status}>{item.isRead ? '✓✓' : '✓'}</Text>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // ── Background wrapper ────────────────────────────────────────────────────
    const bgConfig   = CHAT_BACKGROUNDS[chatBackground];
    const isImageBg  = bgConfig?.type === 'image';
    const gradColors = getBgGradient(chatBackground, isDarkMode);

    const BackgroundWrapper = ({ children }) => {
        if (isImageBg) {
            return (
                <ImageBackground
                    source={{ uri: bgConfig?.image }}
                    style={styles.container}
                    imageStyle={{ opacity: isDarkMode ? 0.5 : 0.7 }}
                >
                    <LinearGradient
                        colors={isDarkMode
                            ? ['rgba(26,26,26,0.8)', 'rgba(26,26,26,0.8)']
                            : ['rgba(245,245,245,0.2)', 'rgba(245,245,245,0.2)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.container}
                    >
                        {children}
                    </LinearGradient>
                </ImageBackground>
            );
        }
        return (
            <LinearGradient
                colors={gradColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                {children}
            </LinearGradient>
        );
    };

    // ── Preview bubble helper (used inside theme modal) ───────────────────────
    const PreviewBubble = ({ mine, text }) => {
        const themeCfg  = CHAT_THEMES[pendingChatTheme]  || CHAT_THEMES.default;
        const bubbleCfg = BUBBLE_STYLES[pendingBubbleStyle] || BUBBLE_STYLES.glassy;
        const isGlass   = pendingBubbleStyle !== 'solid';

        const myBg    = isGlass ? hexToRgba(themeCfg.bubbleColor, bubbleCfg.opacity) : themeCfg.bubbleColor;
        const otherBg = isGlass
            ? (isDarkMode ? 'rgba(42,42,42,0.7)' : 'rgba(241,241,241,0.7)')
            : (isDarkMode ? '#2a2a2a' : '#F1F1F1');

        return (
            <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <View style={{
                    backgroundColor: mine ? myBg : otherBg,
                    borderRadius: messageCornerRadius,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    maxWidth: '70%',
                    borderWidth: isGlass ? 0.5 : 0,
                    borderColor: isGlass
                        ? (mine ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)')
                        : 'transparent',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: isGlass ? 2 : 1 },
                    shadowOpacity: isGlass ? 0.2 : 0.1,
                    shadowRadius: isGlass ? 8 : 2,
                    elevation: isGlass ? 4 : 1,
                }}>
                    <Text style={{
                        color: mine ? themeCfg.bubbleTextColor : (isDarkMode ? '#fff' : '#000'),
                        fontSize: 14,
                        fontWeight: isGlass ? '500' : '400',
                    }}>{text}</Text>
                </View>
            </View>
        );
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <BackgroundWrapper>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            {/* ── Header ── */}
            <View style={[styles.headerWrapper, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
                <SpaceBetweenRow style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="arrow-left" size={24} color={textColor} />
                        </TouchableOpacity>
                        <Image
                            source={userForChat?.Image ? { uri: userForChat.Image } : IMG.ProfileImagePost}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.headerText} onPress={openThemeModal}>
                            <Text style={[styles.profileName, { color: textColor }]}>{userForChat?.FullName}</Text>
                            <Text style={[styles.userStatus, { color: isDarkMode ? '#888' : '#666' }]}>Active today</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                        <Icon name="more-vertical" size={24} color={textColor} />
                    </TouchableOpacity>
                </SpaceBetweenRow>
            </View>

            {/* ── Chat area ── */}
            <KeyboardAvoidingView
                style={styles.chatWrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    data={ChatMessages}
                    keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                    renderItem={renderMessage}
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                    inverted
                />

                {/* Editing bar */}
                {editingMessage && (
                    <View style={[styles.editingBar, { backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0', borderTopColor: borderColor }]}>
                        <View style={styles.editingContent}>
                            <Icon name="edit-2" size={16} color="#4F52FE" />
                            <View style={styles.editingTextContainer}>
                                <Text style={[styles.editingLabel, { color: '#4F52FE' }]}>Editing message</Text>
                                <Text style={[styles.editingPreview, { color: isDarkMode ? '#ccc' : '#666' }]} numberOfLines={1}>
                                    {editingMessage.message}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={cancelEdit} style={styles.cancelEdit}>
                            <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Sticker picker */}
                <Animated.View style={[
                    styles.stickerPickerContainer,
                    { height: stickerHeight, backgroundColor: headerBg, borderTopColor: borderColor },
                ]}>
                    {showStickerPicker && (
                        <>
                            <View style={[styles.stickerTabs, { backgroundColor: stickerTabBg, borderBottomColor: borderColor }]}>
                                {Object.keys(STICKER_PACKS).map(pack => (
                                    <TouchableOpacity
                                        key={pack}
                                        style={[styles.stickerTab, selectedStickerPack === pack && styles.stickerTabActive]}
                                        onPress={() => setSelectedStickerPack(pack)}
                                    >
                                        <Text style={[
                                            styles.stickerTabText,
                                            { color: textColor },
                                            selectedStickerPack === pack && styles.stickerTabTextActive,
                                        ]}>
                                            {pack.charAt(0).toUpperCase() + pack.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <FlatList
                                data={STICKER_PACKS[selectedStickerPack]}
                                numColumns={6}
                                keyExtractor={(item, i) => i.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.stickerItem} onPress={() => handleEmojiSelect(item)}>
                                        <Text style={styles.stickerEmoji}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.stickerGrid}
                                showsVerticalScrollIndicator={false}
                            />
                        </>
                    )}
                </Animated.View>

                {/* Input bar */}
                <View style={[styles.inputContainer, { backgroundColor: headerBg, borderTopColor: borderColor }]}>
                    <TouchableOpacity
                        onPress={() => { Keyboard.dismiss(); setShowStickerPicker(prev => !prev); }}
                        style={styles.iconButton}
                    >
                        <Icon
                            name={showStickerPicker ? 'x' : 'smile'}
                            size={24}
                            color={showStickerPicker ? '#4F52FE' : (isDarkMode ? '#888' : '#666')}
                        />
                    </TouchableOpacity>

                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                        value={inputText}
                        onChangeText={setInputText}
                        onSelectionChange={e => setCursorPosition(e.nativeEvent.selection.start)}
                        onFocus={() => setShowStickerPicker(false)}
                        placeholder="Message"
                        placeholderTextColor={isDarkMode ? '#666' : '#999'}
                        multiline
                    />

                    <TouchableOpacity
                        onPress={handleSendMessage}
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        disabled={!inputText.trim()}
                    >
                        <Icon name={editingMessage ? 'check' : 'send'} size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* ── Message options modal ── */}
            <Modal
                visible={showMessageOptions}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMessageOptions(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowMessageOptions(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.optionsContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : 'white' }]}>
                                <TouchableOpacity style={styles.optionButton} onPress={handleEditMessage}>
                                    <Icon name="edit-2" size={20} color={textColor} />
                                    <Text style={[styles.optionText, { color: textColor }]}>Edit Message</Text>
                                </TouchableOpacity>
                                <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />
                                <TouchableOpacity style={styles.optionButton} onPress={handleDeleteMessage}>
                                    <Icon name="trash-2" size={20} color="#FF3B30" />
                                    <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete Message</Text>
                                </TouchableOpacity>
                                <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />
                                <TouchableOpacity style={styles.optionButton} onPress={() => setShowMessageOptions(false)}>
                                    <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
                                    <Text style={[styles.optionText, { color: isDarkMode ? '#888' : '#666' }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* ── Chat Theme modal ── */}
            <Modal
                visible={showThemeModal}
                transparent
                animationType="slide"
                onRequestClose={discardTheme}
            >
                <View style={styles.themeModalOverlay}>
                    <View style={[styles.themeModalContent, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>

                        {/* Header */}
                        <View style={[styles.themeModalHeader, { borderBottomColor: borderColor }]}>
                            <Text style={[styles.themeModalTitle, { color: textColor }]}>Customize Chat</Text>
                            <TouchableOpacity onPress={discardTheme}>
                                <Icon name="x" size={24} color={textColor} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                            {/* ── Bubble Theme ── */}
                            <View style={styles.themeSection}>
                                <Text style={[styles.themeSectionTitle, { color: textColor }]}>Chat Bubble Theme</Text>
                                <View style={styles.themeGrid}>
                                    {Object.entries(CHAT_THEMES).map(([key, theme]) => {
                                        const isSelected = pendingChatTheme === key;
                                        return (
                                            <TouchableOpacity
                                                key={key}
                                                style={[
                                                    styles.themeCard,
                                                    { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
                                                    isSelected && styles.themeCardSelected,
                                                ]}
                                                onPress={() => setPendingChatTheme(key)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={[styles.themeColorPreview, { backgroundColor: theme.bubbleColor }]} />
                                                {isSelected && (
                                                    <View style={styles.checkIcon}>
                                                        <Icon name="check-circle" size={20} color="#4F52FE" />
                                                    </View>
                                                )}
                                                <Text style={[styles.themeCardText, { color: textColor }]}>{theme.name}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* ── Background ── */}
                            <View style={styles.themeSection}>
                                <Text style={[styles.themeSectionTitle, { color: textColor }]}>Chat Background</Text>
                                <View style={styles.themeGrid}>
                                    {Object.entries(CHAT_BACKGROUNDS).map(([key, bg]) => {
                                        const isSelected = pendingChatBackground === key;
                                        const previewColor = bg.type === 'image'
                                            ? null
                                            : (bg.gradientLight
                                                ? (isDarkMode ? bg.gradientDark[0] : bg.gradientLight[0])
                                                : (isDarkMode ? bg.dark : bg.light));
                                        return (
                                            <TouchableOpacity
                                                key={key}
                                                style={[
                                                    styles.themeCard,
                                                    { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
                                                    isSelected && styles.themeCardSelected,
                                                ]}
                                                onPress={() => setPendingChatBackground(key)}
                                                activeOpacity={0.7}
                                            >
                                                {bg.type === 'image' ? (
                                                    <Image
                                                        source={{ uri: bg.image }}
                                                        style={[styles.themeColorPreview, { borderRadius: 8 }]}
                                                    />
                                                ) : (
                                                    <View style={[styles.themeColorPreview, { backgroundColor: previewColor }]} />
                                                )}
                                                {isSelected && (
                                                    <View style={styles.checkIcon}>
                                                        <Icon name="check-circle" size={20} color="#4F52FE" />
                                                    </View>
                                                )}
                                                <Text style={[styles.themeCardText, { color: textColor }]}>{bg.name}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* ── Bubble Style ── */}
                            <View style={styles.themeSection}>
                                <Text style={[styles.themeSectionTitle, { color: textColor }]}>Message Bubble Style</Text>
                                <View style={styles.themeGrid}>
                                    {Object.entries(BUBBLE_STYLES).map(([key, bStyle]) => {
                                        const isSelected = pendingBubbleStyle === key;   // ✅ fixed: was using live state
                                        const themeCfg   = CHAT_THEMES[pendingChatTheme] || CHAT_THEMES.default;
                                        const previewBg  = key === 'solid'
                                            ? themeCfg.bubbleColor
                                            : hexToRgba(themeCfg.bubbleColor, bStyle.opacity);
                                        return (
                                            <TouchableOpacity
                                                key={key}
                                                style={[
                                                    styles.themeCard,
                                                    { backgroundColor: isDarkMode ? '#2a2a2a' : '#F5F5F5' },
                                                    isSelected && styles.themeCardSelected,
                                                ]}
                                                onPress={() => setPendingBubbleStyle(key)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={[
                                                    styles.themeColorPreview,
                                                    {
                                                        backgroundColor: previewBg,
                                                        borderWidth: key !== 'solid' ? 0.5 : 0,
                                                        borderColor: 'rgba(255,255,255,0.3)',
                                                    },
                                                ]} />
                                                {isSelected && (
                                                    <View style={styles.checkIcon}>
                                                        <Icon name="check-circle" size={20} color="#4F52FE" />
                                                    </View>
                                                )}
                                                <Text style={[styles.themeCardText, { color: textColor }]}>{bStyle.name}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* ── Live Preview ── */}
                            <View style={styles.themeSection}>
                                <Text style={[styles.themeSectionTitle, { color: textColor }]}>Preview</Text>
                                <View style={{
                                    backgroundColor: (() => {
                                        const bg = CHAT_BACKGROUNDS[pendingChatBackground];
                                        if (!bg || bg.type === 'image') return isDarkMode ? '#1a1a1a' : '#F5F5F5';
                                        if (bg.gradientLight) return isDarkMode ? bg.gradientDark[0] : bg.gradientLight[0];
                                        return isDarkMode ? bg.dark : bg.light;
                                    })(),
                                    borderRadius: 12,
                                    padding: 16,
                                    minHeight: 140,
                                }}>
                                    <PreviewBubble mine text="Hey! How are you? 👋" />
                                    <PreviewBubble mine={false} text="I'm doing great! 😊" />
                                    <PreviewBubble mine text="Let's catch up soon!" />
                                </View>
                            </View>
                        </ScrollView>

                        {/* ── Sticky Apply / Cancel footer ── */}
                        <View style={[styles.themeFooter, {
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                            borderTopColor: borderColor,
                        }]}>
                            <TouchableOpacity
                                style={[styles.footerBtn, styles.footerBtnCancel, { borderColor }]}
                                onPress={discardTheme}
                            >
                                <Text style={[styles.footerBtnText, { color: isDarkMode ? '#ccc' : '#555' }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.footerBtn, styles.footerBtnApply]}
                                onPress={applyTheme}
                            >
                                <Text style={[styles.footerBtnText, { color: '#fff' }]}>Apply</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </BackgroundWrapper>
    );
};

// ─── Static Styles (outside component to avoid recreation on render) ──────────
const styles = StyleSheet.create({
    container:      { flex: 1 },
    chatWrapper:    { flex: 1 },
    chatContainer:  { flex: 1 },
    chatContent:    { paddingHorizontal: 16, paddingVertical: 8 },

    // Header
    headerWrapper: {
        paddingTop: 50,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    headerContent:  { paddingHorizontal: 16, alignItems: 'center' },
    headerLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
    backButton:     { padding: 4 },
    profileImage:   { width: 40, height: 40, borderRadius: 20 },
    headerText:     { marginLeft: 4 },
    profileName:    { fontSize: 16, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
    userStatus:     { fontSize: 12, marginTop: 2 },
    moreButton:     { padding: 4 },

    // Messages
    messageContainer: { flexDirection: 'row', marginVertical: 3, alignItems: 'flex-end' },
    myMessage:        { justifyContent: 'flex-end' },
    messageBubble:    { padding: 12, maxWidth: '75%', minWidth: 60 },
    messageText:      { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium, lineHeight: 20 },
    metaContainer:    { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, gap: 4 },
    editedText:       { fontSize: 9, fontStyle: 'italic' },
    timestamp:        { fontSize: 10 },
    status:           { fontSize: 12, color: 'rgba(255,255,255,0.8)' },

    // Editing bar
    editingBar:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
    editingContent:       { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    editingTextContainer: { flex: 1 },
    editingLabel:         { fontSize: 12, fontWeight: '600', marginBottom: 2 },
    editingPreview:       { fontSize: 13 },
    cancelEdit:           { padding: 4 },

    // Input
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1 },
    iconButton:     { padding: 8, paddingBottom: 12 },
    input:          { flex: 1, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginHorizontal: 8, fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Medium, maxHeight: 100 },
    sendButton:     { backgroundColor: '#4F52FE', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
    sendButtonDisabled: { opacity: 0.5 },

    // Sticker
    stickerPickerContainer: { overflow: 'hidden', borderTopWidth: 1 },
    stickerTabs:            { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1 },
    stickerTab:             { paddingVertical: 8, paddingHorizontal: 16, marginRight: 4, borderRadius: 16 },
    stickerTabActive:       { backgroundColor: '#4F52FE' },
    stickerTabText:         { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
    stickerTabTextActive:   { color: 'white', fontWeight: '600' },
    stickerGrid:            { paddingHorizontal: 8, paddingTop: 12, paddingBottom: 8 },
    stickerItem:            { width: '16.666%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
    stickerEmoji:           { fontSize: 32 },

    // Message options modal
    modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    optionsContainer: { width: '80%', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    optionButton:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, gap: 12 },
    optionText:       { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
    optionDivider:    { height: 0.5, marginHorizontal: 20 },

    // Theme modal
    themeModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    themeModalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '92%' },
    themeModalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
    themeModalTitle:   { fontSize: 18, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
    themeSection:      { paddingHorizontal: 16, paddingVertical: 12 },
    themeSectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
    themeGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    themeCard:         { width: '47%', borderRadius: 12, padding: 12, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'transparent' },
    themeCardSelected: { borderColor: '#4F52FE' },
    themeColorPreview: { width: 60, height: 60, borderRadius: 8 },
    themeCardText:     { fontSize: 12, fontWeight: '500', textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
    checkIcon:         { position: 'absolute', top: 8, right: 8 },

    // Theme footer
    themeFooter: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
    },
    footerBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerBtnCancel: { borderWidth: 1 },
    footerBtnApply:  { backgroundColor: '#4F52FE' },
    footerBtnText:   { fontSize: 15, fontWeight: '700', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
});

export default ChatScreen;