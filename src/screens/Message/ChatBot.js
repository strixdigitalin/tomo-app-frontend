// import React, { useEffect, useRef, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     Image,
//     StyleSheet,
//     StatusBar,
//     Animated,
//     Keyboard,
//     KeyboardAvoidingView,
//     Platform,
//     Alert,
// } from "react-native";
// import Icon from 'react-native-vector-icons/Feather';
// import { useSelector } from "react-redux";
// import moment from "moment";

// // AI Bot Profile
// const AI_BOT = {
//     FullName: "AI Assistant",
//     Image: "https://via.placeholder.com/100/4F52FE/FFFFFF?text=AI",
//     status: "Always Online"
// };

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

// const AIChatBot = ({ navigation }) => {
//     const [ChatMessages, setChatMessages] = useState([
//         {
//             _id: '1',
//             sender: 'bot',
//             message: '👋 Hello! I\'m your AI assistant. How can I help you today?',
//             timestamp: new Date(),
//             isRead: true,
//             isSent: true
//         }
//     ]);
//     const [currentUserId] = useState('user123');
//     const { isDarkMode } = useSelector(state => state.theme || { isDarkMode: false });
    
//     // Sticker feature states
//     const [showStickerPicker, setShowStickerPicker] = useState(false);
//     const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
//     const stickerHeight = useRef(new Animated.Value(0)).current;
//     const inputRef = useRef(null);
//     const [cursorPosition, setCursorPosition] = useState(0);

//     const [inputText, setInputText] = useState("");
//     const [isTyping, setIsTyping] = useState(false);

//     // Your Gemini API Key here
//     const GEMINI_API_KEY = "AIzaSyBY5bw_PxCOiR94Qud_es2C5fSU5i1ngn8"; // Replace with your key

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

//     // Send message to AI
//     const sendMessageToAI = async (userMessage) => {
//         try {
//             const response = await fetch(
//                 `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//                 {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         contents: [{
//                             parts: [{ text: userMessage }]
//                         }]
//                     }),
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error('API key invalid or expired');
//             }

//             const data = await response.json();
//             const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

//             if (!aiText) throw new Error('No response from AI');

//             return aiText;
//         } catch (error) {
//             console.error('AI Error:', error);
//             return "Sorry, I'm having trouble connecting right now. Please check your API key or try again later! 😊";
//         }
//     };

//     const handleSendMessage = async () => {
//         if (!inputText.trim()) return;

//         const userMessage = {
//             _id: Date.now().toString(),
//             sender: currentUserId,
//             message: inputText,
//             timestamp: new Date(),
//             isSent: true,
//             isRead: false,
//         };

//         setChatMessages(prev => [userMessage, ...prev]);
//         const messageText = inputText;
//         setInputText("");
//         setIsTyping(true);

//         // Simulate AI typing delay
//         setTimeout(async () => {
//             try {
//                 const aiResponse = await sendMessageToAI(messageText);

//                 const botMessage = {
//                     _id: (Date.now() + 1).toString(),
//                     sender: 'bot',
//                     message: aiResponse,
//                     timestamp: new Date(),
//                     isSent: true,
//                     isRead: true,
//                 };

//                 setChatMessages(prev => [botMessage, ...prev]);
//             } catch (error) {
//                 console.error('Error:', error);
//             } finally {
//                 setIsTyping(false);
//             }
//         }, 1000);
//     };

//     const handleEmojiSelect = (emoji) => {
//         const newText = 
//             inputText.slice(0, cursorPosition) + 
//             emoji + 
//             inputText.slice(cursorPosition);
        
//         setInputText(newText);
        
//         const newCursorPosition = cursorPosition + emoji.length;
//         setCursorPosition(newCursorPosition);
        
//         setTimeout(() => {
//             inputRef.current?.setNativeProps({
//                 selection: { start: newCursorPosition, end: newCursorPosition }
//             });
//         }, 0);
//     };

//     const renderMessage = ({ item }) => {
//         const isMyMessage = item.sender === currentUserId;

//         return (
//             <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
//                 <View style={[
//                     styles.messageBubble,
//                     { backgroundColor: isDarkMode ? '#2a2a2a' : '#F1F1F1' },
//                     isMyMessage && styles.myMessageBubble,
//                 ]}>
//                     {item.message && (
//                         <Text style={{ 
//                             ...styles.messageText, 
//                             color: isMyMessage ? 'white' : (isDarkMode ? '#fff' : 'black') 
//                         }}>
//                             {item.message}
//                         </Text>
//                     )}
//                     <View style={styles.metaContainer}>
//                         <Text style={[
//                             styles.timestamp, 
//                             { color: isMyMessage ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray') }
//                         ]}>
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
//                 <View style={styles.headerContent}>
//                     <View style={styles.headerLeft}>
//                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                             <Icon name="arrow-left" size={24} color={textColor} />
//                         </TouchableOpacity>
//                         <Image 
//                             source={{ uri: AI_BOT.Image }} 
//                             style={styles.profileImage} 
//                         />
//                         <View style={styles.headerText}>
//                             <Text style={[styles.profileName, { color: textColor }]}>
//                                 {AI_BOT.FullName}
//                             </Text>
//                             <View style={styles.statusContainer}>
//                                 <View style={styles.onlineDot} />
//                                 <Text style={[styles.userstatus, { color: '#10b981' }]}>
//                                     {AI_BOT.status}
//                                 </Text>
//                             </View>
//                         </View>
//                     </View>
//                     <TouchableOpacity 
//                         onPress={() => Alert.alert('AI Assistant', 'This is your AI chatbot assistant powered by Google Gemini!')}
//                         style={styles.moreButton}
//                     >
//                         <Icon name="info" size={24} color={textColor} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Chat Messages */}
//             <KeyboardAvoidingView 
//                 style={styles.chatWrapper}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//                 <FlatList
//                     data={ChatMessages}
//                     keyExtractor={(item) => item._id}
//                     renderItem={renderMessage}
//                     style={styles.chatContainer}
//                     contentContainerStyle={styles.chatContent}
//                     inverted
//                 />

//                 {/* Typing Indicator */}
//                 {isTyping && (
//                     <View style={styles.typingContainer}>
//                         <View style={[styles.typingBubble, { backgroundColor: isDarkMode ? '#2a2a2a' : '#F1F1F1' }]}>
//                             <View style={styles.typingDots}>
//                                 <View style={[styles.typingDot, { backgroundColor: isDarkMode ? '#666' : '#999' }]} />
//                                 <View style={[styles.typingDot, { backgroundColor: isDarkMode ? '#666' : '#999' }]} />
//                                 <View style={[styles.typingDot, { backgroundColor: isDarkMode ? '#666' : '#999' }]} />
//                             </View>
//                         </View>
//                     </View>
//                 )}

//                 {/* Sticker Picker */}
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
//                         placeholder="Ask me anything..."
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
//         flexDirection: 'row',
//         justifyContent: 'space-between',
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
//     },
//     statusContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 4,
//         marginTop: 2,
//     },
//     onlineDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: '#10b981',
//     },
//     userstatus: {
//         fontSize: 12,
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
//     typingContainer: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//     },
//     typingBubble: {
//         alignSelf: 'flex-start',
//         padding: 12,
//         borderRadius: 16,
//         minWidth: 60,
//     },
//     typingDots: {
//         flexDirection: 'row',
//         gap: 4,
//     },
//     typingDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//     },
//     inputContainer: {
//         flexDirection: "row",
//         alignItems: "flex-end",
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderTopWidth: 1,
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

// export default AIChatBot;


import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    StatusBar,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from "react-redux";
import moment from "moment";

// AI Bot Profile
const AI_BOT = {
    FullName: "AI Assistant",
    Image: "https://via.placeholder.com/100/4F52FE/FFFFFF?text=AI",
    status: "Always Online"
};

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

const AIChatBot = ({ navigation }) => {
    const [ChatMessages, setChatMessages] = useState([
        {
            _id: '1',
            sender: 'bot',
            message: '👋 Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date(),
            isRead: true,
            isSent: true
        }
    ]);
    const [currentUserId] = useState('user123');
    const { isDarkMode } = useSelector(state => state.theme || { isDarkMode: false });
    
    // Sticker feature states
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [selectedStickerPack, setSelectedStickerPack] = useState('emojis');
    const stickerHeight = useRef(new Animated.Value(0)).current;
    const inputRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState(0);

    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Your Gemini API Key here
    const GEMINI_API_KEY = "AIzaSyBY5bw_PxCOiR94Qud_es2C5fSU5i1ngn8"; // Replace with your key

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

    // Send message to AI - WORKING VERSION
    const sendMessageToAI = async (userMessage) => {
        try {
            console.log('🔄 Sending to AI:', userMessage);
            console.log('🔑 Using API Key');
            
            // Try multiple API endpoints until one works
            const endpoints = [
                // Latest stable endpoint
                {
                    url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                    name: 'v1/gemini-pro'
                },
                // Alternative endpoint
                {
                    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                    name: 'v1beta/gemini-pro'
                }
            ];

            let lastError = null;

            for (const endpoint of endpoints) {
                try {
                    console.log(`🔄 Trying: ${endpoint.name}`);
                    
                    const response = await fetch(endpoint.url, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: userMessage }]
                            }],
                            generationConfig: {
                                temperature: 0.9,
                                topK: 1,
                                topP: 1,
                                maxOutputTokens: 2048,
                            }
                        }),
                    });

                    console.log(`📡 ${endpoint.name} Status:`, response.status);

                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Success with:', endpoint.name);
                        
                        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        
                        if (aiText) {
                            console.log('✅ AI Response:', aiText.substring(0, 50) + '...');
                            return aiText;
                        }
                    } else {
                        const errorData = await response.json();
                        console.log(`❌ ${endpoint.name} failed:`, errorData.error?.message);
                        lastError = errorData;
                    }
                } catch (err) {
                    console.log(`❌ ${endpoint.name} error:`, err.message);
                    lastError = err;
                }
            }

            // All endpoints failed
            if (lastError) {
                console.error('💥 All endpoints failed. Last error:', lastError);
                
                if (lastError.error?.code === 400) {
                    return "❌ Invalid API Key!\n\nPlease:\n1. Go to ai.google.dev\n2. Get new API key\n3. Enable 'Generative Language API'";
                }
                
                return "❌ API Error!\n\nPlease check:\n1. API key is correct\n2. 'Generative Language API' is enabled at console.cloud.google.com\n3. Internet connection";
            }

            return "🤔 Couldn't get response. Please try again!";
            
        } catch (error) {
            console.error('💥 Fatal Error:', error);
            return "📵 Connection error! Please check your internet.";
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            _id: Date.now().toString(),
            sender: currentUserId,
            message: inputText,
            timestamp: new Date(),
            isSent: true,
            isRead: false,
        };

        setChatMessages(prev => [userMessage, ...prev]);
        const messageText = inputText;
        setInputText("");
        setIsTyping(true);

        // Simulate AI typing delay
        setTimeout(async () => {
            try {
                const aiResponse = await sendMessageToAI(messageText);

                const botMessage = {
                    _id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    message: aiResponse,
                    timestamp: new Date(),
                    isSent: true,
                    isRead: true,
                };

                setChatMessages(prev => [botMessage, ...prev]);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsTyping(false);
            }
        }, 1000);
    };

    const handleEmojiSelect = (emoji) => {
        const newText = 
            inputText.slice(0, cursorPosition) + 
            emoji + 
            inputText.slice(cursorPosition);
        
        setInputText(newText);
        
        const newCursorPosition = cursorPosition + emoji.length;
        setCursorPosition(newCursorPosition);
        
        setTimeout(() => {
            inputRef.current?.setNativeProps({
                selection: { start: newCursorPosition, end: newCursorPosition }
            });
        }, 0);
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === currentUserId;

        return (
            <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
                <View style={[
                    styles.messageBubble,
                    { backgroundColor: isDarkMode ? '#2a2a2a' : '#F1F1F1' },
                    isMyMessage && styles.myMessageBubble,
                ]}>
                    {item.message && (
                        <Text style={{ 
                            ...styles.messageText, 
                            color: isMyMessage ? 'white' : (isDarkMode ? '#fff' : 'black') 
                        }}>
                            {item.message}
                        </Text>
                    )}
                    <View style={styles.metaContainer}>
                        <Text style={[
                            styles.timestamp, 
                            { color: isMyMessage ? 'rgba(255,255,255,0.7)' : (isDarkMode ? '#888' : 'gray') }
                        ]}>
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
        );
    };

    const backgroundColor = isDarkMode ? '#1a1a1a' : '#F5F5F5';
    const headerBg = isDarkMode ? '#252525' : 'white';
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBg = isDarkMode ? '#2a2a2a' : '#F1F1F1';
    const borderColor = isDarkMode ? '#333' : '#EEE';
    const stickerTabBg = isDarkMode ? '#2a2a2a' : '#F8F8F8';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            
            {/* Header */}
            <View style={[styles.headerWrapper, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="arrow-left" size={24} color={textColor} />
                        </TouchableOpacity>
                        <Image 
                            source={{ uri: AI_BOT.Image }} 
                            style={styles.profileImage} 
                        />
                        <View style={styles.headerText}>
                            <Text style={[styles.profileName, { color: textColor }]}>
                                {AI_BOT.FullName}
                            </Text>
                            <View style={styles.statusContainer}>
                                <View style={styles.onlineDot} />
                                <Text style={[styles.userstatus, { color: '#10b981' }]}>
                                    {AI_BOT.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity 
                        onPress={() => Alert.alert('AI Assistant', 'This is your AI chatbot assistant powered by Google Gemini!')}
                        style={styles.moreButton}
                    >
                        <Icon name="info" size={24} color={textColor} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat Messages */}
            <KeyboardAvoidingView 
                style={styles.chatWrapper}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    data={ChatMessages}
                    keyExtractor={(item) => item._id}
                    renderItem={renderMessage}
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                    inverted
                />

                {/* Typing Indicator */}
                {isTyping && (
                    <View style={styles.typingContainer}>
                        <View style={[styles.typingBubble, { backgroundColor: isDarkMode ? '#2a2a2a' : '#F1F1F1' }]}>
                            <View style={styles.typingDots}>
                                <View style={[styles.typingDot, { backgroundColor: isDarkMode ? '#666' : '#999' }]} />
                                <View style={[styles.typingDot, { backgroundColor: isDarkMode ? '#666' : '#999' }]} />
                                <View style={[styles.typingDot, { backgroundColor: isDarkMode ? '#666' : '#999' }]} />
                            </View>
                        </View>
                    </View>
                )}

                {/* Sticker Picker */}
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
                        placeholder="Ask me anything..."
                        placeholderTextColor={isDarkMode ? '#666' : '#999'}
                        multiline
                    />

                    <TouchableOpacity
                        onPress={handleSendMessage}
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        disabled={!inputText.trim()}
                    >
                        <Icon name="send" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
    },
    userstatus: {
        fontSize: 12,
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
        borderRadius: 16,
        maxWidth: "75%",
        minWidth: 60,
    },
    myMessageBubble: {
        backgroundColor: "#4F52FE",
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    metaContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 4,
        gap: 4,
    },
    timestamp: {
        fontSize: 10,
    },
    status: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
    },
    typingContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    typingBubble: {
        alignSelf: 'flex-start',
        padding: 12,
        borderRadius: 16,
        minWidth: 60,
    },
    typingDots: {
        flexDirection: 'row',
        gap: 4,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
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
});

export default AIChatBot;