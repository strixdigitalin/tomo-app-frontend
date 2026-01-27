// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
// import { Editsq, Mic, PrimaryBackArrow, PrimaryBackWhite, Search } from '../../assets/SVGs';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import CustomText from '../../components/TextComponent';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import IMG from '../../assets/Images';
// import LinearGradient from "react-native-linear-gradient";
// import { useSelector } from 'react-redux';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import useLoader from '../../utils/LoaderHook';
// import MessageListShimmer from '../../components/Skeletons/MessageListShimmer';
// import GradientIcon from '../../components/GradientIcon';

// const MessageList = ({ navigation }) => {

//     const { isDarkMode } = useSelector(state => state.theme);
//     const [allUser, setAllUsers] = useState([])
//     const { showLoader, hideLoader } = useLoader()
//     const [loading, setLoading] = useState(false)

//     useEffect(() => {
//         fetchData()
//     }, [])



//     const fetchData = async () => {
//         setLoading(true)
//         const res = await apiGet(urls.getAllChattedUsers)
//         console.log("-----------------", res.data);
//         setAllUsers(res?.data)
//         setLoading(false)
//     }

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? 'black' : '#fff',
//         },
//         Ftcontainer: {
//             flex: 1
//         },
//         searchContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
//             borderRadius: 30,
//             margin: 10,
//             padding: 4,
//             marginTop: 30,
//             paddingHorizontal: 15
//         },
//         icon: {
//             marginRight: 10,
//         },
//         searchInput: {
//             flex: 1,
//             fontSize: 16,
//         },
//         imageWrapper: {
//             flex: 1,
//             margin: 1,
//         },
//         largeItem: {
//             flex: 2,
//         },
//         image: {
//             width: '100%',
//             height: 120,
//             resizeMode: 'cover',
//         },

//         // Mesg card

//         card: {
//             flexDirection: "row",
//             alignItems: "center",
//             paddingVertical: 12,
//             borderBottomWidth: 1,
//             borderBottomColor: "#EEE",
//             padding: 16,
//             paddingVertical: 15
//         },
//         profileContainer: {
//             position: "relative",
//             marginRight: 12,
//         },
//         avatar: {
//             width: 44,
//             height: 44,
//             borderRadius: 22,
//         },
//         onlineDot: {
//             width: 12,
//             height: 12,
//             backgroundColor: "#4CAF50", // Green dot for online status
//             borderRadius: 6,
//             position: "absolute",
//             bottom: 0,
//             right: 0,
//             borderWidth: 2,
//             borderColor: "#FFF",
//         },
//         detailsContainer: {
//             flex: 1,
//         },
//         row: {
//             flexDirection: "row",
//             gap: 10,
//             // justifyContent: "space-between",
//             marginBottom: 2,
//         },
//         name: {
//             fontSize: 16,
//             color: isDarkMode ? 'white' : "#000",
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold
//         },
//         time: {
//             fontSize: 13,
//             color: "#999",
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold

//         },
//         message: {
//             fontSize: 14,
//             color: "rgba(79, 82, 254, 1)", // Blue for message text
//             fontWeight: "600",
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold

//         },
//         unreadCount: {
//             width: 24,
//             height: 24,
//             borderRadius: 12,
//             alignItems: "center",
//             justifyContent: "center",
//         },
//         unreadText: {
//             color: "#FFF",
//             fontWeight: "bold",
//             fontSize: 12,
//         },
//     });

//     const renderHeader = () => {
//         return (
//             <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20 }}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}

//                 </TouchableOpacity>
//                 <CustomText style={{ fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>Message</CustomText>
//                 <TouchableOpacity
//                     style={{
//                         // marginHorizontal:10
//                     }}
//                 >
//                     {/* <Editsq /> */}
//                     <GradientIcon
//                         // colors={['#4F52FE', '#FC14CB']}
//                         colors={['#21B7FF', '#0084F8']}
//                         size={20}
//                         iconType='Feather'
//                         name={'edit'}
//                     />
//                 </TouchableOpacity>
//             </SpaceBetweenRow>
//         )
//     }

//     const MessageCard = ({ item }) => {
//         return (
//             <TouchableOpacity style={styles.card}
//                 onPress={() => navigation.navigate('Chat', { userId: item?._id, userForChat: item })}
//             >
//                 {/* Profile Image */}
//                 <View style={styles.profileContainer}>
//                     <Image source={item?.Image ? { uri: item?.Image } : IMG.MessageProfile} style={styles.avatar} />
//                     {/* {item.isOnline && <View style={styles.onlineDot} />} */}
//                 </View>

//                 {/* Message Details */}
//                 <View style={styles.detailsContainer}>
//                     <View style={styles.row}>
//                         <Text style={styles.name}>{item.FullName}</Text>
//                         {/* <Text style={styles.time}>{item.time}</Text> */}
//                     </View>
//                     {/* <Text style={styles.message}>{item.message}</Text> */}
//                 </View>

//                 {/* Unread Count */}
//                 {/* {item.unreadCount > 0 && (
//                     <LinearGradient
//                         colors={["#4A90E2", "#0039A6"]}
//                         style={styles.unreadCount}
//                     >
//                         <Text style={styles.unreadText}>{item.unreadCount}</Text>
//                     </LinearGradient>
//                 )} */}
//             </TouchableOpacity>
//         );
//     };

//     if (loading) {
//         return <MessageListShimmer />;

//     }
//     return (
//         <View style={styles.container}>
//             {/* Search Bar */}
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />
//             {renderHeader()}
//             <View style={styles.searchContainer}>
//                 {/* <Search /> */}
//                 <GradientIcon
//                     // colors={['#4F52FE', '#FC14CB']}
//                     colors={['#21B7FF', '#0084F8']}
//                     size={18}
//                     iconType='FontAwesome5'
//                     name={'search'}
//                 />
//                 <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#A0A0A0" />
//             </View>

//             <View style={styles.Ftcontainer}>
//                 <FlatList
//                     data={allUser}
//                     keyExtractor={(item) => item.id}
//                     renderItem={({ item }) => <MessageCard item={item} />}
//                     style={{ flex: 1 }}
//                 />
//                 <View style={{ height: 100 }} />
//             </View>


//         </View>
//     );
// };



// export default MessageList;


import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
import { Editsq, Mic, PrimaryBackArrow, PrimaryBackWhite, Search } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from 'react-redux';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import useLoader from '../../utils/LoaderHook';
import MessageListShimmer from '../../components/Skeletons/MessageListShimmer';
import GradientIcon from '../../components/GradientIcon';
import { useFocusEffect } from '@react-navigation/native';
import Row from '../../components/wrapper/row';

const MessageList = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const [allUser, setAllUsers] = useState([]);
    const [followedStories, setFollowedStories] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
            getFollowedStories();
        }, [])
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await apiGet(urls.getAllChattedUsers);
            setAllUsers(res?.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFollowedStories = useCallback(async () => {
        try {
            const res = await apiGet(urls.followedUserStories);
            setFollowedStories(res?.data || []);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    }, []);

    // ✅ CHECK IF USER HAS STORY
    const hasStory = (userId) => {
        return followedStories.some(
            story => story?.User?._id === userId && story?.User?.Stories?.length > 0
        );
    };

    // ✅ GET USER STORY DATA
    const getUserStoryData = (userId) => {
        return followedStories.find(story => story?.User?._id === userId);
    };

    // ✅ NAVIGATE TO STORY
    const navigateToStory = (userId) => {
        const userStoryData = getUserStoryData(userId);
        if (userStoryData && userStoryData?.User?.Stories?.length > 0) {
            const userIndex = followedStories.findIndex(story => story?.User?._id === userId);
            navigation.navigate('StoryScreen', {
                storyImage: userStoryData.User?.Stories,
                User: userStoryData?.User,
                allUsersStories: followedStories,
                initialUserIndex: userIndex,
            });
        }
    };

    // ✅ FILTER USERS BASED ON SEARCH
    const filteredUsers = searchText.trim()
        ? allUser.filter(user =>
            user?.FullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            user?.UserName?.toLowerCase().includes(searchText.toLowerCase())
        )
        : allUser;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#000' : '#fff',
        },
        Ftcontainer: {
            flex: 1
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
            borderRadius: 12,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 8,
            paddingHorizontal: 16,
            paddingVertical: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        icon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 15,
            paddingVertical: 12,
            paddingLeft: 8,
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        card: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: isDarkMode ? '#1a1a1a' : "#F0F0F0",
        },
        profileContainer: {
            position: "relative",
            marginRight: 12,
        },
        // ✅ STORY RING STYLES
        storyRingContainer: {
            padding: 2,
            borderRadius: 28,
        },
        avatar: {
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 3,
            borderColor: isDarkMode ? '#000' : '#fff',
        },
        avatarNoStory: {
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 2,
            borderColor: isDarkMode ? '#1a1a1a' : '#E0E0E0',
        },
        onlineDot: {
            width: 14,
            height: 14,
            backgroundColor: "#4CAF50",
            borderRadius: 7,
            position: "absolute",
            bottom: 2,
            right: 2,
            borderWidth: 2.5,
            borderColor: isDarkMode ? '#000' : '#FFF',
        },
        detailsContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        row: {
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "space-between",
            marginBottom: 4,
        },
        name: {
            fontSize: 16,
            color: isDarkMode ? '#fff' : "#000",
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        time: {
            fontSize: 12,
            color: isDarkMode ? '#666' : "#999",
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        message: {
            fontSize: 14,
            color: isDarkMode ? '#999' : "#666",
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        messageUnread: {
            fontSize: 14,
            color: "#4F52FE",
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
        },
        unreadCount: {
            width: 22,
            height: 22,
            borderRadius: 11,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
        },
        unreadText: {
            color: "#FFF",
            fontWeight: "bold",
            fontSize: 11,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 16,
            color: isDarkMode ? '#666' : '#999',
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        },
    });

    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 8, gap:90 }}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={{ 
                        width: 40, 
                        height: 40, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        borderRadius: 20,
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    }}
                >
                    {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
                </TouchableOpacity>
                
                <CustomText style={{ 
                    fontSize: 20, 
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                    color: isDarkMode ? '#fff' : '#000',
                }}>
                    Messages
                </CustomText>
                
                {/* <TouchableOpacity
                    style={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    }}
                    onPress={() => {
                        // Navigate to new message screen
                    }}
                >
                    <GradientIcon
                        colors={['#21B7FF', '#0084F8']}
                        size={20}
                        iconType='Feather'
                        name={'edit'}
                    />
                </TouchableOpacity> */}
            </Row>
        );
    };

    const MessageCard = ({ item }) => {
        const userHasStory = hasStory(item?._id);

        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('Chat', { userId: item?._id, userForChat: item })}
                activeOpacity={0.7}
            >
                {/* Profile Image with Story Ring */}
                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => {
                        if (userHasStory) {
                            navigateToStory(item?._id);
                        } else {
                            navigation.navigate('Chat', { userId: item?._id, userForChat: item });
                        }
                    }}
                    activeOpacity={0.8}
                >
                    {userHasStory ? (
                        <LinearGradient
                            colors={['#21B7FF', '#0084F8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.storyRingContainer}
                        >
                            <Image 
                                source={item?.Image ? { uri: item?.Image } : IMG.MessageProfile} 
                                style={styles.avatar} 
                            />
                        </LinearGradient>
                    ) : (
                        <Image 
                            source={item?.Image ? { uri: item?.Image } : IMG.MessageProfile} 
                            style={styles.avatarNoStory} 
                        />
                    )}
                    {/* Online Indicator - Optional */}
                    {/* {item.isOnline && <View style={styles.onlineDot} />} */}
                </TouchableOpacity>

                {/* Message Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                        <Text style={styles.name} numberOfLines={1}>
                            {item.FullName || item.UserName}
                        </Text>
                        {/* <Text style={styles.time}>{item.time || '2m'}</Text> */}
                    </View>
                    <Text style={styles.message} numberOfLines={1}>
                        Tap to chat
                    </Text>
                </View>

                {/* Unread Count - Optional */}
                {/* {item.unreadCount > 0 && (
                    <LinearGradient
                        colors={["#21B7FF", "#0084F8"]}
                        style={styles.unreadCount}
                    >
                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </LinearGradient>
                )} */}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <MessageListShimmer isDarkMode={isDarkMode} />;
    }

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            
            {renderHeader()}
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <GradientIcon
                    colors={['#21B7FF', '#0084F8']}
                    size={18}
                    iconType='FontAwesome5'
                    name={'search'}
                />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search messages" 
                    placeholderTextColor={isDarkMode ? '#666' : '#A0A0A0'}
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={16}
                            iconType='AntDesign'
                            name={'closecircle'}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.Ftcontainer}>
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item, index) => item._id || `user-${index}`}
                    renderItem={({ item }) => <MessageCard item={item} />}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchText ? 'No results found' : 'No messages yet'}
                            </Text>
                        </View>
                    }
                />
                <View style={{ height: 100 }} />
            </View>
        </View>
    );
};

export default MessageList;
