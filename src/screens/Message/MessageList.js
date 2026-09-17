


// import React, { useEffect, useState, useCallback } from 'react';
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
// import { useFocusEffect } from '@react-navigation/native';
// import Row from '../../components/wrapper/row';

// const MessageList = ({ navigation }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const [allUser, setAllUsers] = useState([]);
//     const [followedStories, setFollowedStories] = useState([]);
//     const { showLoader, hideLoader } = useLoader();
//     const [loading, setLoading] = useState(false);
//     const [searchText, setSearchText] = useState('');

//     let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length != 0) {
//         selector = JSON.parse(selector);
//     }

//     useFocusEffect(
//         useCallback(() => {
//             fetchData();
//             getFollowedStories();
//         }, [])
//     );

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const res = await apiGet(urls.getAllChattedUsers);
//             setAllUsers(res?.data || []);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getFollowedStories = useCallback(async () => {
//         try {
//             const res = await apiGet(urls.followedUserStories);
//             setFollowedStories(res?.data || []);
//         } catch (error) {
//             console.error('Error fetching stories:', error);
//         }
//     }, []);

//     // ✅ CHECK IF USER HAS STORY
//     const hasStory = (userId) => {
//         return followedStories.some(
//             story => story?.User?._id === userId && story?.User?.Stories?.length > 0
//         );
//     };

//     // ✅ GET USER STORY DATA
//     const getUserStoryData = (userId) => {
//         return followedStories.find(story => story?.User?._id === userId);
//     };

//     // ✅ NAVIGATE TO STORY
//     const navigateToStory = (userId) => {
//         const userStoryData = getUserStoryData(userId);
//         if (userStoryData && userStoryData?.User?.Stories?.length > 0) {
//             const userIndex = followedStories.findIndex(story => story?.User?._id === userId);
//             navigation.navigate('StoryScreen', {
//                 storyImage: userStoryData.User?.Stories,
//                 User: userStoryData?.User,
//                 allUsersStories: followedStories,
//                 initialUserIndex: userIndex,
//             });
//         }
//     };

//     // ✅ FILTER USERS BASED ON SEARCH
//     const filteredUsers = searchText.trim()
//         ? allUser.filter(user =>
//             user?.FullName?.toLowerCase().includes(searchText.toLowerCase()) ||
//             user?.UserName?.toLowerCase().includes(searchText.toLowerCase())
//         )
//         : allUser;

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? '#000' : '#fff',
//         },
//         Ftcontainer: {
//             flex: 1
//         },
//         searchContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
//             borderRadius: 12,
//             marginHorizontal: 16,
//             marginTop: 16,
//             marginBottom: 8,
//             paddingHorizontal: 16,
//             paddingVertical: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.05,
//             shadowRadius: 8,
//             elevation: 2,
//         },
//         icon: {
//             marginRight: 10,
//         },
//         searchInput: {
//             flex: 1,
//             fontSize: 15,
//             paddingVertical: 12,
//             paddingLeft: 8,
//             color: isDarkMode ? '#fff' : '#000',
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//         },
//         card: {
//             flexDirection: "row",
//             alignItems: "center",
//             paddingVertical: 14,
//             paddingHorizontal: 16,
//             borderBottomWidth: 0.5,
//             borderBottomColor: isDarkMode ? '#1a1a1a' : "#F0F0F0",
//         },
//         profileContainer: {
//             position: "relative",
//             marginRight: 12,
//         },
//         // ✅ STORY RING STYLES
//         storyRingContainer: {
//             padding: 2,
//             borderRadius: 28,
//         },
//         avatar: {
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             borderWidth: 3,
//             borderColor: isDarkMode ? '#000' : '#fff',
//         },
//         avatarNoStory: {
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             borderWidth: 2,
//             borderColor: isDarkMode ? '#1a1a1a' : '#E0E0E0',
//         },
//         onlineDot: {
//             width: 14,
//             height: 14,
//             backgroundColor: "#4CAF50",
//             borderRadius: 7,
//             position: "absolute",
//             bottom: 2,
//             right: 2,
//             borderWidth: 2.5,
//             borderColor: isDarkMode ? '#000' : '#FFF',
//         },
//         detailsContainer: {
//             flex: 1,
//             justifyContent: 'center',
//         },
//         row: {
//             flexDirection: "row",
//             alignItems: 'center',
//             justifyContent: "space-between",
//             marginBottom: 4,
//         },
//         name: {
//             fontSize: 16,
//             color: isDarkMode ? '#fff' : "#000",
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//         },
//         time: {
//             fontSize: 12,
//             color: isDarkMode ? '#666' : "#999",
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//         },
//         message: {
//             fontSize: 14,
//             color: isDarkMode ? '#999' : "#666",
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//         },
//         messageUnread: {
//             fontSize: 14,
//             color: "#4F52FE",
//             fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//         },
//         unreadCount: {
//             width: 22,
//             height: 22,
//             borderRadius: 11,
//             alignItems: "center",
//             justifyContent: "center",
//             marginLeft: 8,
//         },
//         unreadText: {
//             color: "#FFF",
//             fontWeight: "bold",
//             fontSize: 11,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         },
//         emptyContainer: {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             paddingVertical: 60,
//         },
//         emptyText: {
//             fontSize: 16,
//             color: isDarkMode ? '#666' : '#999',
//             fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//         },
//     });

//     const renderHeader = () => {
//         return (
//             <Row style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 8, gap:90 }}>
//                 <TouchableOpacity 
//                     onPress={() => navigation.goBack()}
//                     style={{ 
//                         width: 40, 
//                         height: 40, 
//                         justifyContent: 'center', 
//                         alignItems: 'center',
//                         borderRadius: 20,
//                         backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//                     }}
//                 >
//                     {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//                 </TouchableOpacity>
                
//                 <CustomText style={{ 
//                     fontSize: 20, 
//                     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//                     color: isDarkMode ? '#fff' : '#000',
//                 }}>
//                     Messages
//                 </CustomText>
                
//                 {/* <TouchableOpacity
//                     style={{
//                         width: 40,
//                         height: 40,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         borderRadius: 20,
//                         backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//                     }}
//                     onPress={() => {
//                         // Navigate to new message screen
//                     }}
//                 >
//                     <GradientIcon
//                         colors={['#21B7FF', '#0084F8']}
//                         size={20}
//                         iconType='Feather'
//                         name={'edit'}
//                     />
//                 </TouchableOpacity> */}
//             </Row>
//         );
//     };

//     const MessageCard = ({ item }) => {
//         const userHasStory = hasStory(item?._id);

//         return (
//             <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('Chat', { userId: item?._id, userForChat: item })}
//                 activeOpacity={0.7}
//             >
//                 {/* Profile Image with Story Ring */}
//                 <TouchableOpacity
//                     style={styles.profileContainer}
//                     onPress={() => {
//                         if (userHasStory) {
//                             navigateToStory(item?._id);
//                         } else {
//                             navigation.navigate('Chat', { userId: item?._id, userForChat: item });
//                         }
//                     }}
//                     activeOpacity={0.8}
//                 >
//                     {userHasStory ? (
//                         <LinearGradient
//                             colors={['#21B7FF', '#0084F8']}
//                             start={{ x: 0, y: 0 }}
//                             end={{ x: 1, y: 1 }}
//                             style={styles.storyRingContainer}
//                         >
//                             <Image 
//                                 source={item?.Image ? { uri: item?.Image } : IMG.MessageProfile} 
//                                 style={styles.avatar} 
//                             />
//                         </LinearGradient>
//                     ) : (
//                         <Image 
//                             source={item?.Image ? { uri: item?.Image } : IMG.MessageProfile} 
//                             style={styles.avatarNoStory} 
//                         />
//                     )}
//                     {/* Online Indicator - Optional */}
//                     {/* {item.isOnline && <View style={styles.onlineDot} />} */}
//                 </TouchableOpacity>

//                 {/* Message Details */}
//                 <View style={styles.detailsContainer}>
//                     <View style={styles.row}>
//                         <Text style={styles.name} numberOfLines={1}>
//                             {item.FullName || item.UserName}
//                         </Text>
//                         {/* <Text style={styles.time}>{item.time || '2m'}</Text> */}
//                     </View>
//                     <Text style={styles.message} numberOfLines={1}>
//                         Tap to chat
//                     </Text>
//                 </View>

//                 {/* Unread Count - Optional */}
//                 {/* {item.unreadCount > 0 && (
//                     <LinearGradient
//                         colors={["#21B7FF", "#0084F8"]}
//                         style={styles.unreadCount}
//                     >
//                         <Text style={styles.unreadText}>{item.unreadCount}</Text>
//                     </LinearGradient>
//                 )} */}
//             </TouchableOpacity>
//         );
//     };

//     if (loading) {
//         return <MessageListShimmer isDarkMode={isDarkMode} />;
//     }

//     return (
//         <View style={styles.container}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />
            
//             {renderHeader()}
            
//             {/* Search Bar */}
//             <View style={styles.searchContainer}>
//                 <GradientIcon
//                     colors={['#21B7FF', '#0084F8']}
//                     size={18}
//                     iconType='FontAwesome5'
//                     name={'search'}
//                 />
//                 <TextInput 
//                     style={styles.searchInput} 
//                     placeholder="Search messages" 
//                     placeholderTextColor={isDarkMode ? '#666' : '#A0A0A0'}
//                     value={searchText}
//                     onChangeText={setSearchText}
//                 />
//                 {searchText.length > 0 && (
//                     <TouchableOpacity onPress={() => setSearchText('')}>
//                         <GradientIcon
//                             colors={['#21B7FF', '#0084F8']}
//                             size={16}
//                             iconType='AntDesign'
//                             name={'closecircle'}
//                         />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             <View style={styles.Ftcontainer}>
//                 <FlatList
//                     data={filteredUsers}
//                     keyExtractor={(item, index) => item._id || `user-${index}`}
//                     renderItem={({ item }) => <MessageCard item={item} />}
//                     style={{ flex: 1 }}
//                     showsVerticalScrollIndicator={false}
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Text style={styles.emptyText}>
//                                 {searchText ? 'No results found' : 'No messages yet'}
//                             </Text>
//                         </View>
//                     }
//                 />
//                 <View style={{ height: 100 }} />
//             </View>
//         </View>
//     );
// };

// export default MessageList;


import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View, TextInput, FlatList, Image, StyleSheet,
  TouchableOpacity, StatusBar, Text, ActivityIndicator,
} from 'react-native';
import { Editsq, PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import MessageListShimmer from '../../components/Skeletons/MessageListShimmer';
import GradientIcon from '../../components/GradientIcon';
import Icon from 'react-native-vector-icons/Feather';
import SafeImage from '../../components/SafeImage';
import { useFocusEffect } from '@react-navigation/native';
import Row from '../../components/wrapper/row';
import { THEMES } from '../../redux/reducer/theme';
import { groupApiGet } from '../../utils/GroupApi';
import { ToastMsg } from '../../utils/helperFunctions';
import moment from 'moment';

// ─── Matches web's Pages/Chat/ChatedUsers.jsx helpers exactly — mobile was
// fetching the same GetAllChatedUser response but never rendering its
// lastMessage/unreadCount fields, only a static "Tap to chat" placeholder.
const getMessagePreview = (lastMessage) => {
  if (!lastMessage) return 'No messages yet';
  switch (lastMessage.type) {
    case 'image': return '📷 Photo';
    case 'video': return '🎥 Video';
    case 'audio': return '🎵 Audio';
    case 'document': return '📄 Document';
    case 'sticker': return '😊 Sticker';
    case 'gift': return '🎁 Gift';
    case 'location': return '📍 Location';
    default: return lastMessage.message || '';
  }
};

const formatChatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = moment(dateStr);
  const now = moment();
  if (date.isSame(now, 'day')) return date.format('hh:mm A');
  if (date.isSame(now.clone().subtract(1, 'day'), 'day')) return 'Yesterday';
  if (date.isSame(now, 'week')) return date.format('ddd');
  return date.format('DD/MM/YY');
};

// ─── Static styles — module level, never recreated ──────────────────────────
const S = StyleSheet.create({
  container: { flex: 1 },
  ftContainer: { flex: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  profileContainer: { position: 'relative', marginRight: 12 },
  storyRingContainer: { padding: 2, borderRadius: 28 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 3 },
  avatarNoStory: { width: 56, height: 56, borderRadius: 28, borderWidth: 2 },
  onlineDot: {
    width: 14, height: 14, backgroundColor: '#4CAF50',
    borderRadius: 7, position: 'absolute', bottom: 2, right: 2,
    borderWidth: 2.5,
  },
  detailsContainer: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  message: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, marginHorizontal: 16, marginTop: 16, marginBottom: 8,
    paddingHorizontal: 16, paddingVertical: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  searchInput: {
    flex: 1, fontSize: 15, paddingVertical: 12, paddingLeft: 8,
    fontFamily: FONTS_FAMILY.SourceSans3_Regular,
  },
  backBtn: {
    width: 40, height: 40, justifyContent: 'center',
    alignItems: 'center', borderRadius: 20,
  },
  headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  gradColors: ['#21B7FF', '#0084F8'],
  tabBar: { flexDirection: 'row', marginHorizontal: 16, marginTop: 14, borderRadius: 14, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  tabBtnText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  groupActionsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 14, marginBottom: 4 },
  groupActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 14,
  },
  groupActionText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  groupRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  groupAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  groupName: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  groupMeta: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 2 },
  adminPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  adminPillText: { fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: '#fff' },
  timeText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular, flexShrink: 0, marginLeft: 8 },
  messageUnread: { fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  unreadBadge: {
    minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5, marginLeft: 8,
  },
  unreadBadgeText: { color: '#fff', fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

const GRADIENT_COLORS = ['#21B7FF', '#0084F8'];

// ─── MessageCard — extracted as proper component (not inline function) ────────
// ✅ Was defined inside MessageList body — caused remount on every render
const MessageCard = React.memo(({ item, isDarkMode, primaryColor, onPress, onAvatarPress, userHasStory }) => {
  const borderColor = isDarkMode ? '#000' : '#fff';
  const noBorderColor = isDarkMode ? '#1a1a1a' : '#E0E0E0';
  const cardBorder = { borderBottomColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' };
  const nameColor = { color: isDarkMode ? '#fff' : '#000' };
  const msgColor = { color: isDarkMode ? '#999' : '#666' };

  const hasUnread = (item?.unreadCount || 0) > 0;

  return (
    <TouchableOpacity style={[S.card, cardBorder]} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar with optional story ring */}
      <TouchableOpacity style={S.profileContainer} onPress={onAvatarPress} activeOpacity={0.8}>
        {userHasStory ? (
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={S.storyRingContainer}
          >
            <Image
              source={item?.Image ? { uri: item.Image } : IMG.MessageProfile}
              style={[S.avatar, { borderColor }]}
              progressiveRenderingEnabled
              fadeDuration={150}
            />
          </LinearGradient>
        ) : (
          <Image
            source={item?.Image ? { uri: item.Image } : IMG.MessageProfile}
            style={[S.avatarNoStory, { borderColor: hasUnread ? primaryColor : noBorderColor }]}
            progressiveRenderingEnabled
            fadeDuration={150}
          />
        )}
      </TouchableOpacity>

      {/* Details */}
      <View style={S.detailsContainer}>
        <View style={S.nameRow}>
          <Text style={[S.name, nameColor, hasUnread && S.messageUnread]} numberOfLines={1}>
            {item.FullName || item.UserName}
          </Text>
          <Text style={[S.timeText, { color: hasUnread ? primaryColor : (isDarkMode ? '#666' : '#999') }]}>
            {formatChatTime(item?.lastMessage?.createdAt)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[S.message, hasUnread ? [S.messageUnread, { color: isDarkMode ? '#fff' : '#000' }] : msgColor, { flex: 1 }]}
            numberOfLines={1}
          >
            {getMessagePreview(item?.lastMessage)}
          </Text>
          {hasUnread && (
            <View style={[S.unreadBadge, { backgroundColor: primaryColor }]}>
              <Text style={S.unreadBadgeText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});
MessageCard.displayName = 'MessageCard';

// ─── GroupCard — the Groups tab's row ──────────────────────────────────────
const GroupCard = React.memo(({ item, isDarkMode, primaryColor, onPress }) => {
  const g = item?.Group || {};
  const cardBorder = { borderBottomColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' };
  const nameColor = { color: isDarkMode ? '#fff' : '#000' };
  const metaColor = { color: isDarkMode ? '#999' : '#666' };

  return (
    <TouchableOpacity style={[S.groupRow, cardBorder]} onPress={onPress} activeOpacity={0.7}>
      <SafeImage uri={g?.Avatar} style={S.groupAvatar} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[S.groupName, nameColor]} numberOfLines={1}>{g?.Name}</Text>
          {item?.Role === 'admin' && (
            <View style={[S.adminPill, { backgroundColor: primaryColor }]}>
              <Text style={S.adminPillText}>Admin</Text>
            </View>
          )}
        </View>
        <Text style={[S.groupMeta, metaColor]} numberOfLines={1}>
          {g?.MembersCount ?? 0} members · {g?.Type}
        </Text>
      </View>
      <Icon name="chevron-right" size={18} color={isDarkMode ? '#666' : '#bbb'} />
    </TouchableOpacity>
  );
});
GroupCard.displayName = 'GroupCard';

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MessageList = ({ navigation }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const primaryColor = currentTheme.primary;

  // ✅ Parse selector once with useMemo
  const rawSelector = useSelector(state => state?.user?.userData);
  const selector = useMemo(() => {
    if (rawSelector && Object.keys(rawSelector).length !== 0) {
      try { return JSON.parse(rawSelector); } catch { return {}; }
    }
    return {};
  }, [rawSelector]);

  const [allUsers, setAllUsers] = useState([]);
  const [followedStories, setFollowedStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // ✅ Groups tab — lives inside this same screen (not a separate Drawer
  // destination), talks to the local dev backend since group chat isn't
  // live in production yet (see GroupApi.js).
  const [activeTab, setActiveTab] = useState('chats');
  const [myGroups, setMyGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const groupsLoadedRef = useRef(false);

  const fetchGroups = useCallback(async () => {
    try {
      setGroupsLoading(true);
      const res = await groupApiGet('/api/user/GetAllMyGroups');
      setMyGroups(res?.data || []);
    } catch (error) {
      console.log('MessageList fetchGroups error', error);
      ToastMsg(error?.message || 'Could not reach local group backend — is it running?');
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  const onSelectGroupsTab = useCallback(() => {
    setActiveTab('groups');
    if (!groupsLoadedRef.current) {
      groupsLoadedRef.current = true;
      fetchGroups();
    }
  }, [fetchGroups]);

  // ✅ useFocusEffect with stable callback
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
    } catch (e) {
      console.error('MessageList fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getFollowedStories = async () => {
    try {
      const res = await apiGet(urls.followedUserStories);
      setFollowedStories(res?.data || []);
    } catch (e) {
      console.error('Stories fetch error:', e);
    }
  };

  // ✅ storyMap — O(1) lookup instead of .some() on every card render
  const storyMap = useMemo(() => {
    const map = {};
    followedStories.forEach((story, index) => {
      const uid = story?.User?._id;
      if (uid && story?.User?.Stories?.length > 0) {
        map[uid] = { storyData: story, index };
      }
    });
    return map;
  }, [followedStories]);

  const navigateToStory = useCallback((userId) => {
    const entry = storyMap[userId];
    if (entry) {
      navigation.navigate('StoryScreen', {
        storyImage: entry.storyData.User?.Stories,
        User: entry.storyData?.User,
        allUsersStories: followedStories,
        initialUserIndex: entry.index,
      });
    }
  }, [storyMap, followedStories, navigation]);

  // ✅ filteredUsers via useMemo — no extra state, no extra renders
  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return allUsers;
    const q = searchText.toLowerCase();
    return allUsers.filter(u =>
      u?.FullName?.toLowerCase().includes(q) ||
      u?.UserName?.toLowerCase().includes(q)
    );
  }, [searchText, allUsers]);

  // ✅ Stable keyExtractor
  const keyExtractor = useCallback((item, index) =>
    item._id || `user-${index}`, []);

  // ✅ renderItem with all deps memoized
  const renderItem = useCallback(({ item }) => {
    const userHasStory = !!storyMap[item?._id];
    return (
      <MessageCard
        item={item}
        isDarkMode={isDarkMode}
        primaryColor={primaryColor}
        userHasStory={userHasStory}
        onPress={() => navigation.navigate('Chat', { userId: item?._id, userForChat: item })}
        onAvatarPress={() =>
          userHasStory
            ? navigateToStory(item?._id)
            : navigation.navigate('Chat', { userId: item?._id, userForChat: item })
        }
      />
    );
  }, [isDarkMode, primaryColor, storyMap, navigation, navigateToStory]);

  const groupKeyExtractor = useCallback((item, index) => item?._id || String(index), []);
  const renderGroupItem = useCallback(({ item }) => (
    <GroupCard
      item={item}
      isDarkMode={isDarkMode}
      primaryColor={primaryColor}
      onPress={() => navigation.navigate('GroupDetail', { groupId: item?.Group?._id })}
    />
  ), [isDarkMode, primaryColor, navigation]);

  // ✅ Dynamic colors memoized
  const dynStyles = useMemo(() => ({
    containerBg: { backgroundColor: isDarkMode ? '#000' : '#fff' },
    searchBg: { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' },
    searchColor: { color: isDarkMode ? '#fff' : '#000' },
    backBtnBg: { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
    titleColor: { color: isDarkMode ? '#fff' : '#000' },
    emptyColor: { color: isDarkMode ? '#666' : '#999' },
    onlineDotBorder: { borderColor: isDarkMode ? '#000' : '#FFF' },
  }), [isDarkMode]);

  const glowColors = useMemo(() => [primaryColor, primaryColor], [primaryColor]);

  if (loading) return <MessageListShimmer isDarkMode={isDarkMode} />;

  return (
    <View style={[S.container, dynStyles.containerBg]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {/* Header */}
      <Row style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 8, gap: 90 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[S.backBtn, dynStyles.backBtnBg]}
        >
          {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
        </TouchableOpacity>
        <CustomText style={[S.headerTitle, dynStyles.titleColor]}>Messages</CustomText>
      </Row>

      {/* Chats / Groups tab switch */}
      <View style={[S.tabBar, dynStyles.searchBg]}>
        <TouchableOpacity
          style={[S.tabBtn, activeTab === 'chats' && { backgroundColor: primaryColor }]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[S.tabBtnText, { color: activeTab === 'chats' ? '#fff' : (isDarkMode ? '#aaa' : '#666') }]}>
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[S.tabBtn, activeTab === 'groups' && { backgroundColor: primaryColor }]}
          onPress={onSelectGroupsTab}
        >
          <Text style={[S.tabBtnText, { color: activeTab === 'groups' ? '#fff' : (isDarkMode ? '#aaa' : '#666') }]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chats' ? (
        <>
          {/* Search */}
          <View style={[S.searchContainer, dynStyles.searchBg]}>
            <GradientIcon colors={glowColors} size={18} iconType="FontAwesome5" name="search" />
            <TextInput
              style={[S.searchInput, dynStyles.searchColor]}
              placeholder="Search messages"
              placeholderTextColor={isDarkMode ? '#666' : '#A0A0A0'}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <GradientIcon colors={glowColors} size={16} iconType="AntDesign" name="closecircle" />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <View style={S.ftContainer}>
            <FlatList
              data={filteredUsers}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              maxToRenderPerBatch={10}
              initialNumToRender={12}
              windowSize={7}
              removeClippedSubviews={true}
              ListEmptyComponent={
                <View style={S.emptyContainer}>
                  <Text style={[S.emptyText, dynStyles.emptyColor]}>
                    {searchText ? 'No results found' : 'No messages yet'}
                  </Text>
                </View>
              }
            />
            <View style={{ height: 100 }} />
          </View>
        </>
      ) : (
        <>
          {/* Create / Join group */}
          <View style={S.groupActionsRow}>
            <TouchableOpacity
              style={[S.groupActionBtn, { backgroundColor: primaryColor }]}
              onPress={() => navigation.navigate('AddGroup')}
            >
              <Icon name="plus" size={15} color="#fff" />
              <Text style={[S.groupActionText, { color: '#fff' }]}>Create Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.groupActionBtn, { borderWidth: 1.5, borderColor: primaryColor }]}
              onPress={() => navigation.navigate('JoinGroup')}
            >
              <Icon name="log-in" size={15} color={primaryColor} />
              <Text style={[S.groupActionText, { color: primaryColor }]}>Join Group</Text>
            </TouchableOpacity>
          </View>

          <View style={S.ftContainer}>
            {groupsLoading ? (
              <View style={S.emptyContainer}>
                <ActivityIndicator color={primaryColor} size="large" />
              </View>
            ) : (
              <FlatList
                data={myGroups}
                keyExtractor={groupKeyExtractor}
                renderItem={renderGroupItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={S.emptyContainer}>
                    <Text style={[S.emptyText, dynStyles.emptyColor]}>No groups yet</Text>
                  </View>
                }
              />
            )}
            <View style={{ height: 100 }} />
          </View>
        </>
      )}
    </View>
  );
};

export default React.memo(MessageList);