

import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native'
import SpaceBetweenRow from '../../components/wrapper/spacebetween'
import {
  AddUserIcon,
  Menu,
  OtionsButtons,
  PrimaryBackArrow,
  PrimaryBackWhite,
  ThreeDotIcon,
} from '../../assets/SVGs'
import Row from '../../components/wrapper/row'
import { FONTS_FAMILY } from '../../assets/Fonts'
import CustomText from '../../components/TextComponent'
import LinearGradient from 'react-native-linear-gradient'
import CustomDrawer from '../../components/DrawerModal'
import { useSelector } from 'react-redux'
import IMG from '../../assets/Images'
import { apiGet, apiPost } from '../../utils/Apis'
import urls from '../../config/urls'
import { useFocusEffect } from '@react-navigation/native'
import useLoader from '../../utils/LoaderHook'
import { ToastMsg } from '../../utils/helperFunctions'
import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
import Feather from 'react-native-vector-icons/Feather'
import { white } from '../../common/Colors/colors'
import GradientIcon from '../../components/GradientIcon'

const OtherUserDetail = ({ navigation, route }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'saved' (for consistency)
  const { isDarkMode } = useSelector(state => state.theme)
  const [UserDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const { showLoader, hideLoader } = useLoader()

  const rawSelector = useSelector(state => state?.user?.userData)
  const selector = useMemo(() => {
    if (rawSelector && Object.keys(rawSelector).length !== 0) {
      try { return JSON.parse(rawSelector) } catch { return {} }
    }
    return {}
  }, [rawSelector])

  // Keep last valid userId so focus/tab transitions don't break data loading.
  const cachedUserIdRef = useRef(route?.params?.userId || null)
  if (route?.params?.userId) {
    cachedUserIdRef.current = route.params.userId
  }
  const targetUserId = route?.params?.userId || cachedUserIdRef.current

  const fetchData = useCallback(async () => {
    if (!targetUserId) return
    const endPoint = `${urls.getUserById}/${targetUserId}`
    const res = await apiGet(endPoint)
    setUserDetails(res?.data)
  }, [targetUserId])

  const fetchMyPost = useCallback(async () => {
    if (!targetUserId) return
    const res = await apiGet(
      `${urls.getAllPostsOfAUser}/${targetUserId}`,
    )
    setAllPosts(res?.data || [])
  }, [targetUserId])

  const loadScreenData = useCallback(async () => {
    if (!targetUserId) return
    setLoading(true)
    try {
      await Promise.allSettled([fetchData(), fetchMyPost()])
    } catch (error) {
      console.log('Error loading OtherUserDetail:', error)
    } finally {
      setLoading(false)
    }
  }, [targetUserId, fetchData, fetchMyPost])

  useFocusEffect(
    useCallback(() => {
      loadScreenData()
    }, [loadScreenData]),
  )

  const sendFollowRequest = async id => {
    console.log(id)
    showLoader()

    try {
      const res = await apiPost(
        `${urls.sendFollowRequest}/${route?.params?.userId}`,
      )
      console.log(res, '+++++++++++++++++res from follow request')

      if (res?.status === 200) {
        fetchData()
        ToastMsg('Follow request sent successfully')
      } else {
        ToastMsg(res?.data?.message || 'Something went wrong')
      }
    } catch (error) {
      console.log('Error in follow request:', error)

      if (error?.response?.status === 400) {
        ToastMsg(error?.message || 'Follow request already sent')
      } else if (error?.response) {
        console.log('+++++++++++++++++++++++++', error)
        ToastMsg(error?.message || 'Follow request Already sent')
      } else if (error?.request) {
        ToastMsg('Network error. Please check your connection.')
      } else {
        ToastMsg('Follow request Already sent')
      }
    } finally {
      hideLoader()
    }
  }

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      paddingBottom: 16,
    },
    headerText: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
    },
    // Cover Photo Section
    coverPhotoContainer: {
      height: 200,
      backgroundColor: isDarkMode ? '#333' : '#ddd',
      position: 'relative',
    },
    coverPhoto: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    // Profile Image Section
    profileImageContainer: {
      position: 'absolute',
      bottom: -50,
      left: 20,
      alignItems: 'center',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
    },
    // Profile Info Section
    profileInfoSection: {
      paddingHorizontal: 20,
      paddingTop: 60,
      //   paddingBottom: 20,
    },
    profileName: {
      fontSize: 24,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
      marginBottom: 5,
    },
    profileUsername: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
      marginBottom: 15,
    },
    // Stats Section
    statsContainer: {
      flexDirection: 'row',
      //   paddingHorizontal: 20,
      marginBottom: 20,
    },
    statItem: {
      marginRight: 10,
    },
    statNumber: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
    },
    statLabel: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    // Status Section
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //   paddingHorizontal: 20,
      marginBottom: 10,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00D4AA',
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    joinedText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
      marginLeft: 15,
    },
    // Action Buttons
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      //   paddingHorizontal: 20,
      marginBottom: 20,
    },
    followButton: {
      backgroundColor: '#0073b1',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 25,
      minWidth: 100,
      alignItems: 'center',
    },
    messageButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#0073b1',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 25,
      minWidth: 100,
      alignItems: 'center',
    },
    moreButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDarkMode ? '#666' : '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    followButtonText: {
      color: 'white',
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    messageButtonText: {
      color: '#0073b1',
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    // Tab Section
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
      //   marginHorizontal: 20,
      marginBottom: 20,
    },
    tabButton: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      marginRight: 30,
    },
    activeTabButton: {
      borderBottomWidth: 2,
      borderBottomColor: isDarkMode ? 'white' : '#000',
    },
    tabText: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    activeTabText: {
      color: isDarkMode ? 'white' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    // Posts Grid Section
    postsContainer: {
      paddingHorizontal: 16,
      //   paddingBottom: 100,
    },
    postItem: {
      width: '47%',
      height: 120,
      margin: '1%',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
    },
    postImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
    emptyStateText: {
      fontSize: 16,
      color: isDarkMode ? '#888' : '#666',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      textAlign: 'center',
    },
    // About Section (keeping for bio display)
    aboutSection: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
      marginBottom: 12,
    },
    aboutText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#ccc' : '#333',
      lineHeight: 20,
    },
  }), [isDarkMode])

  // ─── Memoized date calculations ─────────────────────────────────────────────
  const lastActiveText = useMemo(() => {
    if (!UserDetails?.ShowLastActive || !UserDetails?.LastActiveAt) return null;
    const now = new Date();
    const lastActive = new Date(UserDetails.LastActiveAt);
    const diffMs = now - lastActive;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  }, [UserDetails?.ShowLastActive, UserDetails?.LastActiveAt]);

  const joinedDateText = useMemo(() => {
    if (!UserDetails?.ShowJoinedDate) return null;
    const joinDate = new Date(UserDetails?.createdAt || '2025-08-05');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[joinDate.getMonth()]} ${joinDate.getDate()}, ${joinDate.getFullYear()}`;
  }, [UserDetails?.ShowJoinedDate, UserDetails?.createdAt]);

  const renderHeader = useCallback(() => (
    <SpaceBetweenRow style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
        {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <Text style={styles.headerText}>
        {UserDetails?.UserName || UserDetails?.FullName}
      </Text>
      <TouchableOpacity onPress={() => setDrawerVisible(true)}>
        {/* <Feather
          name={'settings'}
          size={24}
          color={isDarkMode ? white : '#000'}
        /> */}

        <GradientIcon
          colors={['#4F52FE', '#FC14CB']}
          size={18}
          iconType='Feather'
          name={'settings'}
        />

      </TouchableOpacity>
    </SpaceBetweenRow>
  ), [styles, navigation, isDarkMode, UserDetails])

  const renderCoverPhoto = useCallback(() => (
    <View style={styles.coverPhotoContainer}>
      <Image
        source={{
          uri:
            UserDetails?.CoverImage ||
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        }}
        style={styles.coverPhoto}
      />

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: UserDetails?.Image || 'https://picsum.photos/id/237/200/300',
          }}
          style={styles.profileImage}
        />
      </View>
    </View>
  ), [styles, UserDetails])

  const renderProfileInfo = useCallback(() => (
    <View style={styles.profileInfoSection}>
      <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
      <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => navigation.navigate('Followers')}>
          <Text style={styles.statNumber}>
            {UserDetails?.Follower?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => navigation.navigate('Followings')}>
          <Text style={styles.statNumber}>
            {UserDetails?.Following?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Status and Join Date */}
      {/* <View style={styles.statusContainer}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>just now</Text>
        <Text style={styles.joinedText}>📅 Joined Aug 5, 2025</Text>
      </View> */}

      {/* ✅ ACTIVITY STATUS & JOIN DATE WITH TOGGLES */}
<View style={styles.statusContainer}>
  {lastActiveText && (
    <>
      <View style={styles.statusDot} />
      <Text style={styles.statusText}>{lastActiveText}</Text>
    </>
  )}
  {joinedDateText && (
    <Text style={styles.joinedText}>📅 Joined {joinedDateText}</Text>
  )}
</View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={{
            ...styles.followButton,
            opacity: UserDetails?.Follower?.includes(selector?._id) ? 0.5 : 1,
          }}
          disabled={UserDetails?.Follower?.includes(selector?._id)}
          onPress={() => sendFollowRequest(route?.params?.userId)}>
          <Text style={styles.followButtonText}>
            {UserDetails?.Follower?.includes(selector?._id)
              ? 'Following'
              : 'Follow'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.messageButton}
        // onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [styles, UserDetails, navigation, selector, isDarkMode, sendFollowRequest, route, lastActiveText, joinedDateText])

  const renderTabs = useCallback(() => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'all' && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab('all')}>
        <Text
          style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
          All posts
        </Text>
      </TouchableOpacity>
      {/* Keeping tab structure for consistency, but only showing all posts */}
    </View>
  ), [styles, activeTab])

  const renderPost = useCallback(({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AllPostOfAUser', { userId: item?.User?._id })
      }
      style={styles.postItem}>
      <Image
        source={{ uri: item?.media }}
        style={styles.postImage}
        progressiveRenderingEnabled
        fadeDuration={150}
      />
    </TouchableOpacity>
  ), [navigation, styles.postItem, styles.postImage])

  const renderPostsGrid = useCallback(() => {
    if (allPosts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No posts yet</Text>
        </View>
      )
    }

    return (
      <FlatList
        // data={allPosts}
        data={allPosts.filter(
          item => item?.media && !item?.media.toLowerCase().includes('.mp4'),
        )}
        numColumns={2}
        renderItem={renderPost}
        keyExtractor={item => item?._id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    )
  }, [allPosts, renderPost, styles])

  if (loading) {
    return <ProfileShimmer />
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION */}
        {renderHeader()}

        {/* COVER PHOTO & PROFILE IMAGE */}
        {renderCoverPhoto()}

        {/* PROFILE INFO */}
        {renderProfileInfo()}

        {/* TABS */}
        {renderTabs()}

        {/* ABOUT SECTION (if bio exists) */}
        {UserDetails?.Bio && (
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{UserDetails?.Bio}</Text>
          </View>
        )}

        {/* POSTS GRID */}
        <View style={styles.postsContainer}>{renderPostsGrid()}</View>
      </ScrollView>

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      />
    </View>
  )
}

export default OtherUserDetail
