
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
// } from "react-native";
// import ImagePicker from "react-native-image-picker";
// import IMG from "../../assets/Images";
// import { Back, More } from "../../assets/SVGs";
// import SpaceBetweenRow from "../../components/wrapper/spacebetween";
// import Row from "../../components/wrapper/row";
// import { FONTS_FAMILY } from "../../assets/Fonts";
// import CustomText from "../../components/TextComponent";
// import urls from "../../config/urls";
// import { ToastMsg } from "../../utils/helperFunctions";
// import { apiGet, apiPut, getItem } from "../../utils/Apis";
// import { io } from "socket.io-client";
// import moment from "moment";
// // import MenuModal from "../../components/Modals/BottomSlider/MenuModel";
// // import { ThemeContext } from "../../utils/ThemeContext";
// import Icon from 'react-native-vector-icons/Feather';
// import { useSelector } from "react-redux";


// const ChatScreen = ({ route, navigation }) => {
//     const { userId, userForChat } = route.params;
//     // const { theme } = useContext(ThemeContext);
//     const [Userdata, setUserdata] = useState({});
//     const [ChatMessages, setChatMessages] = useState([]);
//     const [currentUserId, setCurrentUserId] = useState(null);
//     const socket = useRef(null);
//     const [menuVisible, setMenuVisible] = useState(false);
//     const [haveIBlockedThem, setHaveIBlockedThem] = useState(false);
//     const [isBlockedByThem, setIsBlockedByThem] = useState(false);
//       const { isDarkMode } = useSelector(state => state.theme);
    

//        let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length != 0) {
//         selector = JSON.parse(selector);
//     }

//     const GetUserId = async () => {
//         try {
//             setCurrentUserId(selector?._id);
//         } catch (error) {
//             ToastMsg("Failed to get user ID");
//         }
//     };

//     useEffect(() => {
//         GetUserId();
//     }, []);


//     const GetChatHistory = async () => {
//         try {
//             const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
//             setChatMessages(Chat?.data)
//         } catch (error) {
//             ToastMsg('Error fetching user data:')
//             console.log('Error fetching user data:', error);
//         }
//     }

//     // const GetUserData = async () => {
//     //     try {
//     //         const user = await apiGet(`${urls.GetAUserdata}/${userId}`);
//     //         setUserdata(user?.data)
//     //         const blockedByThem = user?.data?.blockedUsers?.includes(currentUserId);
//     //         const iBlockedThem = user?.data?.blockedBy?.includes(currentUserId);
//     //         setIsBlockedByThem(blockedByThem);
//     //         setHaveIBlockedThem(iBlockedThem);

//     //     } catch (error) {
//     //         ToastMsg('Error fetching user data:')
//     //         console.log('Error fetching user data:', error);
//     //     }
//     // }


//     // const BlockUser = async () => {
//     //     try {
//     //         const response = await apiPut(`${urls.BlockAUser}/${userId}`);
//     //         if (response?.statusCode === 200) {
//     //             GetUserData();
//     //             ToastMsg(response?.message)
//     //         }
//     //     } catch (error) {
//     //         ToastMsg('Error fetching user data:')
//     //         console.log('Error fetching user data:', error);
//     //     }
//     // }

//     // const UnBlockUser = async () => {
//     //     try {
//     //         const response = await apiPut(`${urls.UnBlockAUser}/${userId}`);
//     //         if (response?.statusCode === 200) {
//     //             GetUserData();
//     //             ToastMsg(response?.message)
//     //         }
//     //     } catch (error) {
//     //         ToastMsg('Error fetching user data:')
//     //         console.log('Error fetching user data:', error);
//     //     }
//     // }

//     useEffect(() => {
//         if (currentUserId !== null) {
//             // GetUserData();
//             GetChatHistory();
//         }
//     }, [userId, currentUserId]);




//     useEffect(() => {
//         socket.current = io('http://192.168.158.149:8080');

//         socket.current.emit("joinRoom", { userId: currentUserId });

//         socket.current.on("receiveMessage", (msg) => {
//             setChatMessages(prev => [msg, ...prev]);
//             socket.current.emit("markAsRead", {
//                 messageId: msg._id
//             });
//         });

//         return () => {
//             socket.current.disconnect();
//         };
//     }, []);

//     console.log('++++++++++++++++', socket);
    

//     const [inputText, setInputText] = useState("");
//     const [selectedImage, setSelectedImage] = useState(null);

//     const handleSendMessage = () => {
//         if (!inputText.trim()) return;

//         const messageData = {
//             sender: currentUserId,
//             receiver: userId,
//             message: inputText,
//             type: "text",
//             isSent: true,
//             isRead: false,
//             timestamp: new Date(),
//         };

//         socket.current.emit("sendMessage", messageData);

//         setChatMessages(prev => [
//             {
//                 ...messageData,
//                 sender: { _id: currentUserId },
//             },
//             ...prev,
//         ]);

//         setInputText("");
//     };


//     const handlePickImage = () => {
//         ImagePicker.showImagePicker(
//             {
//                 title: "Select Image",
//                 mediaType: "photo",
//                 quality: 0.7,
//             },
//             (response) => {
//                 if (!response.didCancel && !response.error) {
//                     setSelectedImage(response.uri);
//                 }
//             }
//         );
//     };

//     const renderMessage = ({ item }) => {

//         const isMyMessage = item.sender?._id === currentUserId || item.sender === currentUserId;


//         return (
//             <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
//                 {/* {!isMyMessage && userForChat?.image && (
//                     <Image source={{ uri: userForChat?.image }} style={styles.avatar} />
//                 )} */}
//                 <View style={[styles.messageBubble,{backgroundColor:'white'}, isMyMessage && styles.myMessageBubble]}>
//                     {item.message && (
//                         <Text style={{ ...styles.messageText, color: isMyMessage ? 'white' : 'black' }}>
//                             {item.message}
//                         </Text>
//                     )}
//                     <View style={styles.metaContainer}>
//                         <Text style={styles.timestamp}>
//                             {moment(item.timestamp).format("hh:mm A")}
//                         </Text>
//                         {isMyMessage && (
//                             <Text style={styles.status}>
//                                 {item.isRead ? "✓✓" : "✓"}
//                             </Text>
//                         )}
//                     </View>
//                 </View>
//             </View>
//         );
//     };


//     return (
//         <View style={[styles.container, { backgroundColor:isDarkMode?'#252525': 'white' }]}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle="dark-content"
//             />
//             <SpaceBetweenRow style={{
//                 paddingHorizontal: 20,
//                 alignItems: 'center'
//             }}>
//                 <View style={[styles.header, { 
//                     // backgroundColor: 'white'
//                     backgroundColor:isDarkMode?'#252525': 'white'
//                      }]}>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                          <Icon name="arrow-left" size={24} color={isDarkMode? 'white': 'black' } />
//                     </TouchableOpacity>
//                     <Image source={userForChat?.Image ? { uri: userForChat?.Image} : IMG.ProfileImagePost} style={styles.profileImage} />
//                     <View style={styles.headerText}>
//                         <Text style={[styles.profileName, { color: isDarkMode? 'white': 'black' }]}>{userForChat?.FullName}</Text>
//                         <Text style={[styles.userstatus, { color: isDarkMode? 'white': 'black'  }]}>Active today</Text>
//                     </View>
//                 </View>
//                 <Row style={{ gap: 10, top: 19 }}>
//                     <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
//                         <Icon name="more-vertical" size={24} color={isDarkMode? 'white': 'black'} />
//                     </TouchableOpacity>
//                 </Row>

//             </SpaceBetweenRow>

//             <FlatList
//                 data={ChatMessages}
//                 keyExtractor={(item, index) => index}
//                 renderItem={renderMessage}
//                 style={styles.chatContainer}
//                 inverted
//             />
//             <View style={styles.inputContainer}>
//                 {/* {haveIBlockedThem ? (
//                     <View style={styles.blockedInfoContainer}>
//                         <CustomText style={[styles.blockedText, { color: 'red' }]}>You blocked this user</CustomText>
//                         <TouchableOpacity
//                             onPress={() => UnBlockUser()}
//                             style={styles.unblockButton}
//                         >
//                             <CustomText style={styles.unblockText}>Unblock</CustomText>
//                         </TouchableOpacity>
//                     </View>
//                 ) : isBlockedByThem ? (
//                     <CustomText style={[styles.blockedText, { color: 'red' }]}>You can't message this user</CustomText>
//                 ) : ( */}
//                     <>
//                         <TextInput
//                             style={[styles.input, { color: isDarkMode? 'white': 'black' , }]}
//                             value={inputText}
//                             onChangeText={setInputText}
//                             placeholder="Message"
//                             placeholderTextColor={isDarkMode? 'white': 'black' }
//                         />
//                         <TouchableOpacity
//                             onPress={handleSendMessage}
//                             style={styles.sendButton}
//                         >
//                             <CustomText style={{ color: 'white' }}>Send</CustomText>
//                         </TouchableOpacity>
//                     </>
//                 {/* )} */}
//             </View>

//             {/* {menuVisible && (
//                 <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
//                     <View style={StyleSheet.absoluteFill}>
//                         <MenuModal
//                             closeMenu={() => setMenuVisible(false)}
//                             userId={userId}
//                             BlockUser={BlockUser}
//                         />
//                     </View>
//                 </TouchableWithoutFeedback>
//             )} */}

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#FFFF",
//     },
//     header: {
//         // padding: 16,
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         paddingTop: 50,
//         gap: 10,
//     },
//     profileImage: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//     },
//     headerText: {
//         marginLeft: 10,
//     },
//     profileName: {
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "#000",
//     },
//     userstatus: {
//         fontSize: 14,
//         color: "#000",
//     },
//     chatContainer: {
//         flex: 1,
//         paddingHorizontal: 16,
//     },
//     messageContainer: {
//         flexDirection: "row",
//         marginVertical: 4,
//         alignItems: "flex-end",
//     },
//     myMessage: {
//         justifyContent: "flex-end",
//     },
//     avatar: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         marginRight: 8,
//     },
//     messageBubble: {
//         padding: 16,
//         borderRadius: 20,
//         backgroundColor: "#F1F1F1",
//         maxWidth: "75%",
//     },
//     myMessageBubble: {
//         backgroundColor: "#4F52FE",
//     },
//     messageText: {
//         color: "#000",
//         fontSize: 14,
//         fontFamily: FONTS_FAMILY.SourceSans3_Medium
//     },
//     messageImage: {
//         width: 150,
//         height: 150,
//         borderRadius: 8,
//         marginTop: 5,
//     },
//     inputContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderTopWidth: 1,
//         borderTopColor: "#EEE",
//     },
//     input: {
//         flex: 1,
//         paddingHorizontal: 12,
//         backgroundColor: "#F1F1F1",
//         borderRadius: 20,
//         marginHorizontal: 8,
//         fontSize: 14,
//         color: 'black',
//         fontFamily: FONTS_FAMILY.SourceSans3_Medium
//     },
//     metaContainer: {
//         flexDirection: "row",
//         justifyContent: "flex-end",
//         alignItems: "center",
//         marginTop: 4,
//     },
//     timestamp: {
//         fontSize: 10,
//         color: "gray",
//         marginRight: 6,
//     },
//     status: {
//         fontSize: 12,
//         color: "white",
//     },
//     sendButton: {
//         backgroundColor: '#4F52FE',
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         borderRadius: 20,
//     },
//     blockedInfoContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     blockedText: {
//         color: 'gray',
//         fontSize: 14,
//     },
//     unblockButton: {
//         paddingHorizontal: 14,
//         paddingVertical: 6,
//         backgroundColor: '#4F52FE',
//         borderRadius: 20,
//     },
//     unblockText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '500',
//     },

// });



// export default ChatScreen;

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
// } from "react-native";
// import ImagePicker from "react-native-image-picker";
// import IMG from "../../assets/Images";
// import { Back, More } from "../../assets/SVGs";
// import SpaceBetweenRow from "../../components/wrapper/spacebetween";
// import Row from "../../components/wrapper/row";
// import { FONTS_FAMILY } from "../../assets/Fonts";
// import CustomText from "../../components/TextComponent";
// import urls from "../../config/urls";
// import { ToastMsg } from "../../utils/helperFunctions";
// import { apiGet, apiPut, getItem } from "../../utils/Apis";
// import { io } from "socket.io-client";
// import moment from "moment";
// import Icon from 'react-native-vector-icons/Feather';
// import { useSelector } from "react-redux";

// // Sticker packs
// const STICKER_PACKS = {
//     emojis: [
//         '😀', '😂', '🤣', '😊', '😍', '🥰', '😎', '🤗',
//         '🤔', '😴', '🥳', '😇', '🤩', '😋', '😜', '🤪',
//         '😱', '😭', '😤', '🤯', '😷', '🤧', '🥴', '😵'
//     ],
//     hearts: [
//         '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
//         '💖', '💗', '💓', '💞', '💕', '💘', '💝', '💟',
//         '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '💋', '💌', '💏', '💑'
//     ],
//     hands: [
//         '👍', '👎', '👏', '🙌', '💪', '🤝', '🙏', '✌️',
//         '🤞', '👌', '🤙', '🤘', '🤟', '✊', '👊', '🫶',
//         '👋', '🤚', '🖐️', '✋', '🖖', '👆', '👇', '☝️'
//     ]
// };

// const ChatScreen = ({ route, navigation }) => {
//     const { userId, userForChat } = route.params;
//     const [Userdata, setUserdata] = useState({});
//     const [ChatMessages, setChatMessages] = useState([]);
//     const [currentUserId, setCurrentUserId] = useState(null);
//     const socket = useRef(null);
//     const [menuVisible, setMenuVisible] = useState(false);
//     const [haveIBlockedThem, setHaveIBlockedThem] = useState(false);
//     const [isBlockedByThem, setIsBlockedByThem] = useState(false);
//     const { isDarkMode } = useSelector(state => state.theme);
    
//     // Sticker feature states
//     const [showStickerPicker, setShowStickerPicker] = useState(false);
//     const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
//     const stickerHeight = useRef(new Animated.Value(0)).current;
//     const inputRef = useRef(null);
//     const [cursorPosition, setCursorPosition] = useState(0);

//     let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length != 0) {
//         selector = JSON.parse(selector);
//     }

//     const GetUserId = async () => {
//         try {
//             setCurrentUserId(selector?._id);
//         } catch (error) {
//             ToastMsg("Failed to get user ID");
//         }
//     };

//     useEffect(() => {
//         GetUserId();
//     }, []);

//     const GetChatHistory = async () => {
//         try {
//             const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
//             setChatMessages(Chat?.data)
//         } catch (error) {
//             ToastMsg('Error fetching user data:')
//             console.log('Error fetching user data:', error);
//         }
//     }

//     useEffect(() => {
//         if (currentUserId !== null) {
//             GetChatHistory();
//         }
//     }, [userId, currentUserId]);

//     useEffect(() => {
//         socket.current = io('http://192.168.158.149:8080');

//         socket.current.emit("joinRoom", { userId: currentUserId });

//         socket.current.on("receiveMessage", (msg) => {
//             setChatMessages(prev => [msg, ...prev]);
//             socket.current.emit("markAsRead", {
//                 messageId: msg._id
//             });
//         });

//         return () => {
//             socket.current.disconnect();
//         };
//     }, []);

//     // Keyboard listeners
//     useEffect(() => {
//         const keyboardWillShow = Keyboard.addListener(
//             Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
//             () => {
//                 setShowStickerPicker(false);
//             }
//         );

//         return () => {
//             keyboardWillShow.remove();
//         };
//     }, []);

//     // Animate sticker picker
//     useEffect(() => {
//         Animated.timing(stickerHeight, {
//             toValue: showStickerPicker ? 280 : 0,
//             duration: 250,
//             useNativeDriver: false,
//         }).start();
//     }, [showStickerPicker]);

//     const [inputText, setInputText] = useState("");
//     const [selectedImage, setSelectedImage] = useState(null);

//     const handleSendMessage = () => {
//         if (!inputText.trim()) return;

//         const messageData = {
//             sender: currentUserId,
//             receiver: userId,
//             message: inputText,
//             type: "text",
//             isSent: true,
//             isRead: false,
//             timestamp: new Date(),
//         };

//         socket.current.emit("sendMessage", messageData);

//         setChatMessages(prev => [
//             {
//                 ...messageData,
//                 sender: { _id: currentUserId },
//             },
//             ...prev,
//         ]);

//         setInputText("");
//     };

//     const handleEmojiSelect = (emoji) => {
//         // Insert emoji at cursor position
//         const newText = 
//             inputText.slice(0, cursorPosition) + 
//             emoji + 
//             inputText.slice(cursorPosition);
        
//         setInputText(newText);
        
//         // Update cursor position
//         const newCursorPosition = cursorPosition + emoji.length;
//         setCursorPosition(newCursorPosition);
        
//         // Focus input and set selection
//         setTimeout(() => {
//             // inputRef.current?.focus();
//             inputRef.current?.setNativeProps({
//                 selection: { start: newCursorPosition, end: newCursorPosition }
//             });
//         }, 0);
//     };

//     const handlePickImage = () => {
//         ImagePicker.showImagePicker(
//             {
//                 title: "Select Image",
//                 mediaType: "photo",
//                 quality: 0.7,
//             },
//             (response) => {
//                 if (!response.didCancel && !response.error) {
//                     setSelectedImage(response.uri);
//                 }
//             }
//         );
//     };

//     const renderMessage = ({ item }) => {
//         const isMyMessage = item.sender?._id === currentUserId || item.sender === currentUserId;

//         return (
//             <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
//                 <View style={[
//                     styles.messageBubble,
//                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F1F1F1' },
//                     isMyMessage && styles.myMessageBubble,
//                 ]}>
//                     {item.message && (
//                         <Text style={{ ...styles.messageText, color: isMyMessage ? 'white' : (isDarkMode ? '#fff' : 'black') }}>
//                             {item.message}
//                         </Text>
//                     )}
//                     <View style={styles.metaContainer}>
//                         <Text style={[styles.timestamp, { color: isMyMessage ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray') }]}>
//                             {moment(item.timestamp).format("hh:mm A")}
//                         </Text>
//                         {isMyMessage && (
//                             <Text style={styles.status}>
//                                 {item.isRead ? "✓✓" : "✓"}
//                             </Text>
//                         )}
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     const backgroundColor = isDarkMode ? '#1a1a1a' : '#F5F5F5';
//     const headerBg = isDarkMode ? '#252525' : 'white';
//     const textColor = isDarkMode ? '#fff' : '#000';
//     const inputBg = isDarkMode ? '#2a2a2a' : '#F1F1F1';
//     const borderColor = isDarkMode ? '#333' : '#EEE';
//     const stickerTabBg = isDarkMode ? '#2a2a2a' : '#F8F8F8';

//     return (
//         <View style={[styles.container, { backgroundColor }]}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />
            
//             {/* Header */}
//             <View style={[styles.headerWrapper, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
//                 <SpaceBetweenRow style={styles.headerContent}>
//                     <View style={styles.headerLeft}>
//                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                             <Icon name="arrow-left" size={24} color={textColor} />
//                         </TouchableOpacity>
//                         <Image 
//                             source={userForChat?.Image ? { uri: userForChat?.Image } : IMG.ProfileImagePost} 
//                             style={styles.profileImage} 
//                         />
//                         <View style={styles.headerText}>
//                             <Text style={[styles.profileName, { color: textColor }]}>
//                                 {userForChat?.FullName}
//                             </Text>
//                             <Text style={[styles.userstatus, { color: isDarkMode ? '#888' : '#666' }]}>
//                                 Active today
//                             </Text>
//                         </View>
//                     </View>
//                     <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.moreButton}>
//                         <Icon name="more-vertical" size={24} color={textColor} />
//                     </TouchableOpacity>
//                 </SpaceBetweenRow>
//             </View>

//             {/* Chat Messages */}
//             <KeyboardAvoidingView 
//                 style={styles.chatWrapper}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//                 <FlatList
//                     data={ChatMessages}
//                     keyExtractor={(item, index) => index.toString()}
//                     renderItem={renderMessage}
//                     style={styles.chatContainer}
//                     contentContainerStyle={styles.chatContent}
//                     inverted
//                 />

//                 {/* Sticker Picker - Attached to Input */}
//                 <Animated.View style={[
//                     styles.stickerPickerContainer,
//                     { 
//                         height: stickerHeight,
//                         backgroundColor: headerBg,
//                         borderTopColor: borderColor
//                     }
//                 ]}>
//                     {showStickerPicker && (
//                         <>
//                             {/* Sticker Pack Tabs */}
//                             <View style={[styles.stickerTabs, { backgroundColor: stickerTabBg, borderBottomColor: borderColor }]}>
//                                 {Object.keys(STICKER_PACKS).map(pack => (
//                                     <TouchableOpacity
//                                         key={pack}
//                                         style={[
//                                             styles.stickerTab,
//                                             selectedStickerPack === pack && styles.stickerTabActive
//                                         ]}
//                                         onPress={() => setSelectedStickerPack(pack)}
//                                     >
//                                         <Text style={[
//                                             styles.stickerTabText,
//                                             { color: textColor },
//                                             selectedStickerPack === pack && styles.stickerTabTextActive
//                                         ]}>
//                                             {pack.charAt(0).toUpperCase() + pack.slice(1)}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>

//                             {/* Sticker Grid */}
//                             <FlatList
//                                 data={STICKER_PACKS[selectedStickerPack]}
//                                 numColumns={6}
//                                 keyExtractor={(item, index) => index.toString()}
//                                 renderItem={({ item }) => (
//                                     <TouchableOpacity
//                                         style={styles.stickerItem}
//                                         onPress={() => handleEmojiSelect(item)}
//                                     >
//                                         <Text style={styles.stickerEmoji}>{item}</Text>
//                                     </TouchableOpacity>
//                                 )}
//                                 contentContainerStyle={styles.stickerGrid}
//                                 showsVerticalScrollIndicator={false}
//                             />
//                         </>
//                     )}
//                 </Animated.View>

//                 {/* Input Container */}
//                 <View style={[styles.inputContainer, { backgroundColor: headerBg, borderTopColor: borderColor }]}>
//                     <TouchableOpacity
//                         onPress={() => {
//                             Keyboard.dismiss();
//                             setShowStickerPicker(!showStickerPicker);
//                         }}
//                         style={styles.iconButton}
//                     >
//                         <Icon 
//                             name={showStickerPicker ? "x" : "smile"} 
//                             size={24} 
//                             color={showStickerPicker ? '#4F52FE' : (isDarkMode ? '#888' : '#666')} 
//                         />
//                     </TouchableOpacity>

//                     <TextInput
//                         ref={inputRef}
//                         style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
//                         value={inputText}
//                         onChangeText={setInputText}
//                         onSelectionChange={(event) => {
//                             setCursorPosition(event.nativeEvent.selection.start);
//                         }}
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
//                         <Icon name="send" size={18} color="white" />
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     headerWrapper: {
//         paddingTop: 50,
//         paddingBottom: 10,
//         borderBottomWidth: 1,
//     },
//     headerContent: {
//         paddingHorizontal: 16,
//         alignItems: 'center',
//     },
//     headerLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//     },
//     backButton: {
//         padding: 4,
//     },
//     profileImage: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//     },
//     headerText: {
//         marginLeft: 4,
//     },
//     profileName: {
//         fontSize: 16,
//         fontWeight: "600",
//         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     },
//     userstatus: {
//         fontSize: 12,
//         marginTop: 2,
//     },
//     moreButton: {
//         padding: 4,
//     },
//     chatWrapper: {
//         flex: 1,
//     },
//     chatContainer: {
//         flex: 1,
//     },
//     chatContent: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//     },
//     messageContainer: {
//         flexDirection: "row",
//         marginVertical: 3,
//         alignItems: "flex-end",
//     },
//     myMessage: {
//         justifyContent: "flex-end",
//     },
//     messageBubble: {
//         padding: 12,
//         borderRadius: 16,
//         maxWidth: "75%",
//         minWidth: 60,
//     },
//     myMessageBubble: {
//         backgroundColor: "#4F52FE",
//     },
//     messageText: {
//         fontSize: 15,
//         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//         lineHeight: 20,
//     },
//     metaContainer: {
//         flexDirection: "row",
//         justifyContent: "flex-end",
//         alignItems: "center",
//         marginTop: 4,
//         gap: 4,
//     },
//     timestamp: {
//         fontSize: 10,
//     },
//     status: {
//         fontSize: 12,
//         color: "rgba(255,255,255,0.8)",
//     },
//     inputContainer: {
//         flexDirection: "row",
//         alignItems: "flex-end",
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderTopWidth: 1,
//         // position:'absolute',
//         // bottom:0,
//         // bottom:300
//     },
//     iconButton: {
//         padding: 8,
//         paddingBottom: 12,
//     },
//     input: {
//         flex: 1,
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderRadius: 24,
//         marginHorizontal: 8,
//         fontSize: 15,
//         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//         maxHeight: 100,
//     },
//     sendButton: {
//         backgroundColor: '#4F52FE',
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 4,
//     },
//     sendButtonDisabled: {
//         opacity: 0.5,
//     },
//     // Sticker Picker Styles
//     stickerPickerContainer: {
//         overflow: 'hidden',
//         borderTopWidth: 1,
//     },
//     stickerTabs: {
//         flexDirection: 'row',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//     },
//     stickerTab: {
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         marginRight: 4,
//         borderRadius: 16,
//     },
//     stickerTabActive: {
//         backgroundColor: '#4F52FE',
//     },
//     stickerTabText: {
//         fontSize: 13,
//         fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     },
//     stickerTabTextActive: {
//         color: 'white',
//         fontWeight: '600',
//     },
//     stickerGrid: {
//         paddingHorizontal: 8,
//         paddingTop: 12,
//         paddingBottom: 8,
//     },
//     stickerItem: {
//         width: '16.666%',
//         aspectRatio: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     stickerEmoji: {
//         fontSize: 32,
//     },
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
} from "react-native";
import ImagePicker from "react-native-image-picker";
import IMG from "../../assets/Images";
import { Back, More } from "../../assets/SVGs";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import Row from "../../components/wrapper/row";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomText from "../../components/TextComponent";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { apiGet, apiPut, getItem } from "../../utils/Apis";
import { io } from "socket.io-client";
import moment from "moment";
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from "react-redux";

// Sticker packs
const STICKER_PACKS = {
    emojis: [
        '😀', '😂', '🤣', '😊', '😍', '🥰', '😎', '🤗',
        '🤔', '😴', '🥳', '😇', '🤩', '😋', '😜', '🤪',
        '😱', '😭', '😤', '🤯', '😷', '🤧', '🥴', '😵'
    ],
    hearts: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
        '💖', '💗', '💓', '💞', '💕', '💘', '💝', '💟',
        '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '💋', '💌', '💏', '💑'
    ],
    hands: [
        '👍', '👎', '👏', '🙌', '💪', '🤝', '🙏', '✌️',
        '🤞', '👌', '🤙', '🤘', '🤟', '✊', '👊', '🫶',
        '👋', '🤚', '🖐️', '✋', '🖖', '👆', '👇', '☝️'
    ]
};

const ChatScreen = ({ route, navigation }) => {
    const { userId, userForChat } = route.params;
    const [Userdata, setUserdata] = useState({});
    const [ChatMessages, setChatMessages] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const socket = useRef(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [haveIBlockedThem, setHaveIBlockedThem] = useState(false);
    const [isBlockedByThem, setIsBlockedByThem] = useState(false);
    // const { isDarkMode } = useSelector(state => state.theme);

      const { 
        isDarkMode, 
        selectedColorTheme, 
        messageCornerRadius, 
        feedListView 
      } = useSelector(state => state.theme);
    
    // Sticker feature states
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
    const stickerHeight = useRef(new Animated.Value(0)).current;
    const inputRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState(0);

    // Edit & Delete states
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showMessageOptions, setShowMessageOptions] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

    const GetUserId = async () => {
        try {
            setCurrentUserId(selector?._id);
        } catch (error) {
            ToastMsg("Failed to get user ID");
        }
    };

    // console.log('messageCornerRadius===================>>>>>', messageCornerRadius);
    

    useEffect(() => {
        GetUserId();
    }, []);

    const GetChatHistory = async () => {
        try {
            const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
            setChatMessages(Chat?.data)
        } catch (error) {
            ToastMsg('Error fetching user data:')
            console.log('Error fetching user data:', error);
        }
    }

    useEffect(() => {
        if (currentUserId !== null) {
            GetChatHistory();
        }
    }, [userId, currentUserId]);

    useEffect(() => {
        socket.current = io('http://192.168.158.149:8080');

        socket.current.emit("joinRoom", { userId: currentUserId });

        socket.current.on("receiveMessage", (msg) => {
            setChatMessages(prev => [msg, ...prev]);
            socket.current.emit("markAsRead", {
                messageId: msg._id
            });
        });

        // Listen for message updates
        socket.current.on("messageUpdated", (updatedMsg) => {
            setChatMessages(prev => 
                prev.map(msg => msg._id === updatedMsg._id ? updatedMsg : msg)
            );
        });

        // Listen for message deletion
        socket.current.on("messageDeleted", (deletedMsgId) => {
            setChatMessages(prev => 
                prev.filter(msg => msg._id !== deletedMsgId)
            );
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    // Keyboard listeners
    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                setShowStickerPicker(false);
            }
        );

        return () => {
            keyboardWillShow.remove();
        };
    }, []);

    // Animate sticker picker
    useEffect(() => {
        Animated.timing(stickerHeight, {
            toValue: showStickerPicker ? 280 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [showStickerPicker]);

    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        if (editingMessage) {
            // Edit message
            const updatedMessage = {
                ...editingMessage,
                message: inputText,
                edited: true,
                editedAt: new Date(),
            };

            socket.current.emit("editMessage", {
                messageId: editingMessage._id,
                newMessage: inputText
            });

            setChatMessages(prev =>
                prev.map(msg => msg._id === editingMessage._id ? updatedMessage : msg)
            );

            setEditingMessage(null);
            setInputText("");
            ToastMsg("Message edited");
        } else {
            // Send new message
            const messageData = {
                sender: currentUserId,
                receiver: userId,
                message: inputText,
                type: "text",
                isSent: true,
                isRead: false,
                timestamp: new Date(),
            };

            socket.current.emit("sendMessage", messageData);

            setChatMessages(prev => [
                {
                    ...messageData,
                    _id: Date.now().toString(),
                    sender: { _id: currentUserId },
                },
                ...prev,
            ]);

            setInputText("");
        }
    };

    const handleEmojiSelect = (emoji) => {
        // Insert emoji at cursor position
        const newText = 
            inputText.slice(0, cursorPosition) + 
            emoji + 
            inputText.slice(cursorPosition);
        
        setInputText(newText);
        
        // Update cursor position
        const newCursorPosition = cursorPosition + emoji.length;
        setCursorPosition(newCursorPosition);
        
        // Focus input and set selection
        setTimeout(() => {
            // inputRef.current?.focus();
            inputRef.current?.setNativeProps({
                selection: { start: newCursorPosition, end: newCursorPosition }
            });
        }, 0);
    };

    const handleLongPress = (item) => {
        const isMyMessage = item.sender?._id === currentUserId || item.sender === currentUserId;
        if (isMyMessage) {
            setSelectedMessage(item);
            setShowMessageOptions(true);
        }
    };

    const handleEditMessage = () => {
        setEditingMessage(selectedMessage);
        setInputText(selectedMessage.message);
        setShowMessageOptions(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleDeleteMessage = () => {
        Alert.alert(
            "Delete Message",
            "Are you sure you want to delete this message?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        socket.current.emit("deleteMessage", {
                            messageId: selectedMessage._id
                        });

                        setChatMessages(prev =>
                            prev.filter(msg => msg._id !== selectedMessage._id)
                        );

                        setShowMessageOptions(false);
                        ToastMsg("Message deleted");
                    }
                }
            ]
        );
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setInputText("");
    };

    const handlePickImage = () => {
        ImagePicker.showImagePicker(
            {
                title: "Select Image",
                mediaType: "photo",
                quality: 0.7,
            },
            (response) => {
                if (!response.didCancel && !response.error) {
                    setSelectedImage(response.uri);
                }
            }
        );
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender?._id === currentUserId || item.sender === currentUserId;

        return (
            <TouchableOpacity
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.9}
                delayLongPress={500}
            >
                <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
                    <View style={[
                        styles.messageBubble,
                        { backgroundColor: isDarkMode ? '#2a2a2a' : '#F1F1F1' },
                        isMyMessage && styles.myMessageBubble,
                    ]}>
                        {item.message && (
                            <Text style={{ ...styles.messageText, color: isMyMessage ? 'white' : (isDarkMode ? '#fff' : 'black') }}>
                                {item.message}
                            </Text>
                        )}
                        <View style={styles.metaContainer}>
                            {item.edited && (
                                <Text style={[styles.editedText, { color: isMyMessage ? 'rgba(255,255,255,0.6)' : (isDarkMode ? '#666' : '#999') }]}>
                                    edited
                                </Text>
                            )}
                            <Text style={[styles.timestamp, { color: isMyMessage ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray') }]}>
                                {moment(item.timestamp).format("hh:mm A")}
                            </Text>
                            {isMyMessage && (
                                <Text style={styles.status}>
                                    {item.isRead ? "✓✓" : "✓"}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const backgroundColor = isDarkMode ? '#1a1a1a' : '#F5F5F5';
    const headerBg = isDarkMode ? '#252525' : 'white';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBg = isDarkMode ? '#2a2a2a' : '#F1F1F1';
    const borderColor = isDarkMode ? '#333' : '#EEE';
    const stickerTabBg = isDarkMode ? '#2a2a2a' : '#F8F8F8';


    const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrapper: {
        paddingTop: 50,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    headerContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerText: {
        marginLeft: 4,
    },
    profileName: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    },
    userstatus: {
        fontSize: 12,
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    chatWrapper: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageContainer: {
        flexDirection: "row",
        marginVertical: 3,
        alignItems: "flex-end",
    },
    myMessage: {
        justifyContent: "flex-end",
    },
    messageBubble: {
        padding: 12,
        borderRadius: messageCornerRadius,
        maxWidth: "75%",
        minWidth: 60,
    },
    myMessageBubble: {
        backgroundColor: "#4F52FE",
    },
    messageText: {
        fontSize: 15,
        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        lineHeight: 20,
    },
    metaContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 4,
        gap: 4,
    },
    editedText: {
        fontSize: 9,
        fontStyle: 'italic',
        marginRight: 4,
    },
    timestamp: {
        fontSize: 10,
    },
    status: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
    },
    editingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    editingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    editingTextContainer: {
        flex: 1,
    },
    editingLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    editingPreview: {
        fontSize: 13,
    },
    cancelEdit: {
        padding: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
    },
    iconButton: {
        padding: 8,
        paddingBottom: 12,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        marginHorizontal: 8,
        fontSize: 15,
        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#4F52FE',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    // Sticker Picker Styles
    stickerPickerContainer: {
        overflow: 'hidden',
        borderTopWidth: 1,
    },
    stickerTabs: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    stickerTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 4,
        borderRadius: 16,
    },
    stickerTabActive: {
        backgroundColor: '#4F52FE',
    },
    stickerTabText: {
        fontSize: 13,
        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    },
    stickerTabTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    stickerGrid: {
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 8,
    },
    stickerItem: {
        width: '16.666%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stickerEmoji: {
        fontSize: 32,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsContainer: {
        width: '80%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 12,
    },
    optionText: {
        fontSize: 16,
        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    },
    optionDivider: {
        height: 0.5,
        marginHorizontal: 20,
    },
});

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            
            {/* Header */}
            <View style={[styles.headerWrapper, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
                <SpaceBetweenRow style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="arrow-left" size={24} color={textColor} />
                        </TouchableOpacity>
                        <Image 
                            source={userForChat?.Image ? { uri: userForChat?.Image } : IMG.ProfileImagePost} 
                            style={styles.profileImage} 
                        />
                        <View style={styles.headerText}>
                            <Text style={[styles.profileName, { color: textColor }]}>
                                {userForChat?.FullName}
                            </Text>
                            <Text style={[styles.userstatus, { color: isDarkMode ? '#888' : '#666' }]}>
                                Active today
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.moreButton}>
                        <Icon name="more-vertical" size={24} color={textColor} />
                    </TouchableOpacity>
                </SpaceBetweenRow>
            </View>

            {/* Chat Messages */}
            <KeyboardAvoidingView 
                style={styles.chatWrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    data={ChatMessages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderMessage}
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                    inverted
                />

                {/* Editing Indicator */}
                {editingMessage && (
                    <View style={[styles.editingBar, { backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0', borderTopColor: borderColor }]}>
                        <View style={styles.editingContent}>
                            <Icon name="edit-2" size={16} color="#4F52FE" />
                            <View style={styles.editingTextContainer}>
                                <Text style={[styles.editingLabel, { color: '#4F52FE' }]}>
                                    Editing message
                                </Text>
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

                {/* Sticker Picker - Attached to Input */}
                <Animated.View style={[
                    styles.stickerPickerContainer,
                    { 
                        height: stickerHeight,
                        backgroundColor: headerBg,
                        borderTopColor: borderColor
                    }
                ]}>
                    {showStickerPicker && (
                        <>
                            {/* Sticker Pack Tabs */}
                            <View style={[styles.stickerTabs, { backgroundColor: stickerTabBg, borderBottomColor: borderColor }]}>
                                {Object.keys(STICKER_PACKS).map(pack => (
                                    <TouchableOpacity
                                        key={pack}
                                        style={[
                                            styles.stickerTab,
                                            selectedStickerPack === pack && styles.stickerTabActive
                                        ]}
                                        onPress={() => setSelectedStickerPack(pack)}
                                    >
                                        <Text style={[
                                            styles.stickerTabText,
                                            { color: textColor },
                                            selectedStickerPack === pack && styles.stickerTabTextActive
                                        ]}>
                                            {pack.charAt(0).toUpperCase() + pack.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Sticker Grid */}
                            <FlatList
                                data={STICKER_PACKS[selectedStickerPack]}
                                numColumns={6}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.stickerItem}
                                        onPress={() => handleEmojiSelect(item)}
                                    >
                                        <Text style={styles.stickerEmoji}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.stickerGrid}
                                showsVerticalScrollIndicator={false}
                            />
                        </>
                    )}
                </Animated.View>

                {/* Input Container */}
                <View style={[styles.inputContainer, { backgroundColor: headerBg, borderTopColor: borderColor }]}>
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                            setShowStickerPicker(!showStickerPicker);
                        }}
                        style={styles.iconButton}
                    >
                        <Icon 
                            name={showStickerPicker ? "x" : "smile"} 
                            size={24} 
                            color={showStickerPicker ? '#4F52FE' : (isDarkMode ? '#888' : '#666')} 
                        />
                    </TouchableOpacity>

                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                        value={inputText}
                        onChangeText={setInputText}
                        onSelectionChange={(event) => {
                            setCursorPosition(event.nativeEvent.selection.start);
                        }}
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
                        <Icon name={editingMessage ? "check" : "send"} size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Message Options Modal */}
            <Modal
                visible={showMessageOptions}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMessageOptions(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowMessageOptions(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.optionsContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : 'white' }]}>
                                <TouchableOpacity 
                                    style={styles.optionButton}
                                    onPress={handleEditMessage}
                                >
                                    <Icon name="edit-2" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                    <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#000' }]}>
                                        Edit Message
                                    </Text>
                                </TouchableOpacity>

                                <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />

                                <TouchableOpacity 
                                    style={styles.optionButton}
                                    onPress={handleDeleteMessage}
                                >
                                    <Icon name="trash-2" size={20} color="#FF3B30" />
                                    <Text style={[styles.optionText, { color: '#FF3B30' }]}>
                                        Delete Message
                                    </Text>
                                </TouchableOpacity>

                                <View style={[styles.optionDivider, { backgroundColor: borderColor }]} />

                                <TouchableOpacity 
                                    style={styles.optionButton}
                                    onPress={() => setShowMessageOptions(false)}
                                >
                                    <Icon name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
                                    <Text style={[styles.optionText, { color: isDarkMode ? '#888' : '#666' }]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};



export default ChatScreen;