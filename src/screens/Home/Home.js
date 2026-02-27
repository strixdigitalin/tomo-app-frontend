
// import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
// import {
//   FlatList,
//   Image,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   TouchableWithoutFeedback,
//   TextInput,
//   BackHandler,
//   Alert,
//   Platform,
//   PermissionsAndroid,
//   Linking,
//   Dimensions,
// } from 'react-native'
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withSequence,
//   withTiming,
//   withSpring,
//   withDelay,
//   FadeIn,
//   FadeInDown,
//   FadeInUp,
//   SlideInRight,
//   SlideInLeft,
//   ZoomIn,
//   ZoomOut,
//   interpolate,
//   Extrapolate,
//   runOnJS,
//   useAnimatedScrollHandler,
//   FadeOut,
// } from 'react-native-reanimated'
// import CustomText from '../../components/TextComponent'
// import IMG from '../../assets/Images'
// import LocationManager from '../../utils/LocationManager'
// import {
//   AddPostBtn,
//   AddStoryIcon,
// } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import SpaceBetweenRow from '../../components/wrapper/spacebetween'
// import { useDispatch, useSelector } from 'react-redux'
// import Video from 'react-native-video'
// import { apiDelete, apiGet, apiPost, apiPut, getItem } from '../../utils/Apis'
// import urls from '../../config/urls'
// import AntDesign from 'react-native-vector-icons/AntDesign'
// import Feather from 'react-native-vector-icons/Feather'
// import useLoader from '../../utils/LoaderHook'
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import FeedShimmerLoader from '../../components/Skeletons/FeedsShimmer'
// import messaging from '@react-native-firebase/messaging'
// import { setUser } from '../../redux/reducer/user'
// import GradientIcon from '../../components/GradientIcon'
// import LinearGradient from 'react-native-linear-gradient'
// import { formatInstagramDate } from '../../utils/DateFormat'
// import FeedCard from './FeedsCards'
// import Tts from 'react-native-tts'
// import { THEMES } from '../../redux/reducer/theme'
// import { App_Primary_color } from '../../common/Colors/colors'

// const Home = ({ navigation }) => {
//   // const { isDarkMode } = useSelector(state => state.theme)

//   const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme)

//   // ✅ GET CURRENT THEME COLORS
//   const currentTheme = THEMES[selectedColorTheme] || THEMES.default
//   const primaryColor = currentTheme.primary
//   const secondaryColor = currentTheme.secondary

//   const glowColors = [primaryColor, secondaryColor];



//   const dispatch = useDispatch()
//   const isFocused = useIsFocused()
//   const { showLoader, hideLoader } = useLoader()

//   // Enhanced Reanimated values with cool effects
//   const fabScale = useSharedValue(1)
//   const fabOpacity = useSharedValue(1)
//   const fabRotation = useSharedValue(0)

//   const headerScale = useSharedValue(0.8)
//   const headerOpacity = useSharedValue(0)

//   const scrollY = useSharedValue(0)
//   const lastScrollY = useSharedValue(0)

//   // Scroll animated values for collapsible components
//   const searchBarTranslateY = useSharedValue(0)
//   const storyTranslateY = useSharedValue(0)
//   const searchBarScale = useSharedValue(0)

//   const leftIconTranslateY = useSharedValue(-80)
//   const leftIconScale = useSharedValue(0.3)
//   const leftIconOpacity = useSharedValue(0)
//   const leftIconRotate = useSharedValue(-180)

//   const rightIconTranslateY = useSharedValue(-80)
//   const rightIconScale = useSharedValue(0.3)
//   const rightIconOpacity = useSharedValue(0)
//   const rightIconRotate = useSharedValue(180)

//   const storyScale = useSharedValue(0)
//   const storyOpacity = useSharedValue(0)

//   // Refs
//   const lastTapRef = useRef(null)
//   const searchTimeoutRef = useRef(null)
//   const backHandlerRef = useRef(null)
//   const flatListRef = useRef(null)

//   // State
//   const [loading, setLoading] = useState(false)
//   const [allPosts, setAllPosts] = useState([])
//   const [allStories, setAllStories] = useState([])
//   const [followedStories, setFollowedStories] = useState([])
//   const [doubleTapIndex, setDoubleTapIndex] = useState(null)
//   const [modalVisible, setModalVisible] = useState(false)
//   const [postId, setPostId] = useState(null)
//   const [commentText, setCommentText] = useState('')
//   const [comments, setComments] = useState([])
//   const [isMuted, setIsMuted] = useState(true)
//   const [visibleVideoIndex, setVisibleVideoIndex] = useState(0)
//   const [pausedVideos, setPausedVideos] = useState({})
//   const [searchText, setSearchText] = useState("")
//   const [suggestions, setSuggestions] = useState([])
//   const [tagLoading, setTagLoading] = useState(false)
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [selectedPost, setSelectedPost] = useState(null)
//   const [postDetailVisible, setPostDetailVisible] = useState(false)
//   const [locationStatus, setLocationStatus] = useState('idle')
//   const [selectedTab, setSelectedTab] = useState('home')
//   const [advertisements, setAdvertisements] = useState([])
//   const [currentAdImageIndex, setCurrentAdImageIndex] = useState({})
//   const [newsData, setNewsData] = useState([])
//   const [heartOpacity, setHeartOpacity] = useState(0)
//   const [heartScale, setHeartScale] = useState(0)

//   // TTS States
//   const [ttsLanguage, setTtsLanguage] = useState('en-US')
//   const [isTtsReading, setIsTtsReading] = useState(false)
//   const [ttsStatus, setTtsStatus] = useState('Ready - Tap button to speak')
//   const ttsInitialAnimScale = useSharedValue(0)

//   const { width: screenWidth } = Dimensions.get('window')

//   // States ke saath:
//   const bellIconRef = useRef(null)
//   const [bellIconPosition, setBellIconPosition] = useState({
//     x: screenWidth - 40,
//     y: 60
//   })

 

//   const handleBellPress = () => {
//     navigation.navigate('Activity', {
//       bellPosition: {
//         x: screenWidth - 32, // bell approx right side
//         y: 70               // statusbar + header height
//       }
//     })
//   }




//   // Memoized selector
//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   // Enhanced FAB Animation with rotation
//   useEffect(() => {
//     fabScale.value = withRepeat(
//       withSequence(
//         withTiming(1.2, { duration: 1000 }),
//         withTiming(1, { duration: 1000 })
//       ),
//       -1,
//       false
//     )

//     fabOpacity.value = withRepeat(
//       withSequence(
//         withTiming(0.6, { duration: 1000 }),
//         withTiming(1, { duration: 1000 })
//       ),
//       -1,
//       false
//     )

//     fabRotation.value = withRepeat(
//       withTiming(360, { duration: 3000 }),
//       -1,
//       false
//     )
//   }, [])

//   // Header entrance animation
//   useEffect(() => {
//     headerScale.value = withSpring(1, {
//       damping: 15,
//       stiffness: 150,
//     })
//     headerOpacity.value = withTiming(1, { duration: 600 })
//   }, [])

//   // Search bar animation
//   useEffect(() => {
//     if (selectedTab === 'home') {
//       searchBarScale.value = withSpring(1, {
//         damping: 12,
//         stiffness: 100,
//       })
//     }
//   }, [selectedTab])

//   // Story entrance animation
//   useEffect(() => {
//     storyScale.value = withDelay(200, withSpring(1, {
//       damping: 10,
//       stiffness: 100,
//     }))
//     storyOpacity.value = withDelay(200, withTiming(1, { duration: 400 }))
//   }, [])

//   // Enhanced icon animations
//   useEffect(() => {
//     // Left icon with bounce and rotation
//     leftIconTranslateY.value = withSequence(
//       withSpring(15, { damping: 5, stiffness: 150 }),
//       withSpring(-8, { damping: 6, stiffness: 180 }),
//       withSpring(4, { damping: 8, stiffness: 200 }),
//       withSpring(0, { damping: 12, stiffness: 150 })
//     )
//     leftIconScale.value = withSequence(
//       withSpring(0.5, { damping: 8 }),
//       withSpring(1.1, { damping: 10 }),
//       withSpring(1, { damping: 12 })
//     )
//     leftIconOpacity.value = withTiming(1, { duration: 400 })
//     leftIconRotate.value = withSpring(0, { damping: 15, stiffness: 100 })

//     // Right icon with delay
//     setTimeout(() => {
//       rightIconTranslateY.value = withSequence(
//         withSpring(15, { damping: 5, stiffness: 150 }),
//         withSpring(-8, { damping: 6, stiffness: 180 }),
//         withSpring(4, { damping: 8, stiffness: 200 }),
//         withSpring(0, { damping: 12, stiffness: 150 })
//       )
//       rightIconScale.value = withSequence(
//         withSpring(0.5, { damping: 8 }),
//         withSpring(1.1, { damping: 10 }),
//         withSpring(1, { damping: 12 })
//       )
//       rightIconOpacity.value = withTiming(1, { duration: 400 })
//       rightIconRotate.value = withSpring(0, { damping: 15, stiffness: 100 })
//     }, 100)
//   }, [])

//   // Animated styles
//   const fabAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { scale: fabScale.value },
//       { rotate: `${fabRotation.value}deg` }
//     ],
//     opacity: fabOpacity.value,
//   }))

//   const headerAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: headerScale.value }],
//     opacity: headerOpacity.value,
//   }))

//   const searchBarAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { scale: searchBarScale.value },
//       { translateY: searchBarTranslateY.value }
//     ],
//   }))

//   const leftIconStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateY: leftIconTranslateY.value },
//       { scale: leftIconScale.value },
//       { rotate: `${leftIconRotate.value}deg` }
//     ],
//     opacity: leftIconOpacity.value,
//   }))

//   const rightIconStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateY: rightIconTranslateY.value },
//       { scale: rightIconScale.value },
//       { rotate: `${rightIconRotate.value}deg` }
//     ],
//     opacity: rightIconOpacity.value,
//   }))

//   const storyAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { scale: storyScale.value },
//       { translateY: storyTranslateY.value }
//     ],
//     opacity: storyOpacity.value,
//   }))

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       const currentScrollY = event.contentOffset.y
//       scrollY.value = currentScrollY

//       const HEADER_HEIGHT = 100  // ⬅️ YEH header ki height hai
//       const TOTAL_STICKY_HEIGHT = 80 // ⬅️ YEH value kam/jyada kar search+story kitna upper jayega

//       if (currentScrollY <= TOTAL_STICKY_HEIGHT) {
//         searchBarTranslateY.value = -currentScrollY
//         headerOpacity.value = interpolate(
//           currentScrollY,
//           [0, HEADER_HEIGHT],
//           [1, 0],
//           Extrapolate.CLAMP
//         )
//       } else {
//         searchBarTranslateY.value = -TOTAL_STICKY_HEIGHT // ⬅️ YEH bhi wahi value honi chahiye
//         headerOpacity.value = 0
//       }

//       // FAB animation
//       if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
//         fabOpacity.value = withTiming(0, { duration: 200 })
//         fabScale.value = withTiming(0.5, { duration: 200 })
//       } else {
//         fabOpacity.value = withTiming(1, { duration: 200 })
//         fabScale.value = withTiming(1, { duration: 200 })
//       }

//       lastScrollY.value = currentScrollY
//     },
//   });

//   const mergeFeedWithAds = useCallback((posts, ads) => {
//     if (!ads || ads.length === 0) {
//       return posts.map(post => ({ type: 'post', data: post }))
//     }

//     const merged = []
//     const adInterval = 3
//     let adIndex = 0

//     posts.forEach((post, index) => {
//       merged.push({ type: 'post', data: post })
//       if ((index + 1) % adInterval === 0 && adIndex < ads.length) {
//         merged.push({ type: 'ad', data: ads[adIndex] })
//         adIndex = (adIndex + 1) % ads.length
//       }
//     })

//     return merged
//   }, [])

//   // Memoized merged feed data
//   const mergedFeedData = useMemo(() => {
//     let dataToMerge = []

//     if (selectedTab === 'News') {
//       dataToMerge = newsData
//     } else {
//       const filteredPosts = allPosts.filter(item => {
//         const hasImage = item?.media && !item?.media.toLowerCase().includes('.mp4')
//         const isTop25 = selectedTab === 'Top25' ? item?.TotalLikes > 25 : true
//         return hasImage && isTop25
//       })
//       dataToMerge = filteredPosts
//     }

//     return mergeFeedWithAds(dataToMerge, advertisements)
//   }, [allPosts, advertisements, selectedTab, newsData, mergeFeedWithAds])

//   // Cleanup function
//   useEffect(() => {
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current)
//       }

//       LocationManager.stopLocationTracking()
//       LocationManager.setLocationUpdateCallback(null)

//       if (backHandlerRef.current) {
//         backHandlerRef.current.remove()
//       }
//     }
//   }, [])

//   // Optimized search function with debounce
//   const SearchTags = useCallback(async (tag) => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current)
//     }

//     if (!tag.trim()) {
//       setSuggestions([])
//       setShowSuggestions(false)
//       return
//     }

//     searchTimeoutRef.current = setTimeout(async () => {
//       try {
//         setTagLoading(true)
//         const response = await apiGet(`/api/admin/SearchHashtags?query=${tag}`)
//         setSuggestions(response?.data || [])
//         setShowSuggestions(true)
//       } catch (error) {
//         console.error("Error fetching tags:", error)
//       } finally {
//         setTagLoading(false)
//       }
//     }, 300)
//   }, [])

//   // Optimized animation function
//   const triggerHeartAnimation = useCallback((index) => {
//     setDoubleTapIndex(index)
//     setHeartOpacity(1)
//     setHeartScale(1.5)

//     setTimeout(() => {
//       setHeartOpacity(0)
//       setHeartScale(0)
//     }, 1000)
//   }, [])

//   // Optimized viewable items callback
//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems?.length > 0) {
//       setVisibleVideoIndex(viewableItems[0].index)
//     }
//   }).current

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 50,
//   }).current

//   // Back handler
//   useFocusEffect(
//     useCallback(() => {
//       const backAction = () => {
//         Alert.alert('Exit App', 'Are you sure you want to exit the app?', [
//           {
//             text: 'Cancel',
//             onPress: () => null,
//             style: 'cancel',
//           },
//           {
//             text: 'EXIT',
//             onPress: () => BackHandler.exitApp(),
//           },
//         ])
//         return true
//       }

//       backHandlerRef.current = BackHandler.addEventListener(
//         'hardwareBackPress',
//         backAction,
//       )

//       return () => {
//         if (backHandlerRef.current) {
//           backHandlerRef.current.remove()
//         }
//       }
//     }, [])
//   )

//   // Initialize Firebase
//   useEffect(() => {
//     initializeFirebase()
//     initializeTts()
//   }, [])

//   // Auto-speak greeting when screen comes into focus
//   useEffect(() => {
//     if (isFocused && selectedTab === 'home') {
//       console.log('Home screen focused - speaking greeting')
//       setTimeout(() => {
//         speakGreeting()
//       }, 500)
//     }
//   }, [isFocused, selectedTab])

//   const initializeFirebase = async () => {
//     try {
//       await requestNotificationPermission()
//     } catch (error) {
//       console.error('Firebase initialization error:', error)
//     }
//   }

//   const requestNotificationPermission = async () => {
//     try {
//       let hasPermission = false

//       if (Platform.OS === 'android') {
//         if (Platform.Version >= 33) {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//           )
//           hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED
//         } else {
//           hasPermission = true
//         }
//       } else {
//         const authStatus = await messaging().requestPermission()
//         hasPermission =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL
//       }

//       if (hasPermission) {
//         await getFCMToken()
//       }
//     } catch (error) {
//       console.error('Permission error:', error)
//     }
//   }

//   const getFCMToken = async () => {
//     try {
//       if (!messaging().isDeviceRegisteredForRemoteMessages) {
//         await messaging().registerDeviceForRemoteMessages()
//       }
//       const fcmToken = await messaging().getToken()
//       if (fcmToken) {
//         console.log('FCM Token:', fcmToken)
//       }
//     } catch (error) {
//       console.error('FCM Token Error:', error)
//     }
//   }

//   // TTS Initialization
//   // TTS Initialization - Simple Pattern
//   useEffect(() => {
//     initializeTts()
//   }, [])

//   const initializeTts = async () => {
//     try {
//       console.log('TTS: Initializing')
//       await Tts.setDefaultLanguage('en-US')
//       await Tts.setDefaultRate(0.5)
//       await Tts.setDefaultPitch(1.0)

//       setTtsStatus('Ready')
//     } catch (error) {
//       console.error('TTS Init Error:', error)
//     }
//   }



//   const speakGreeting = () => {
//     const userName = selector?.FullName || selector?.UserName || 'Friend'
//     const greeting = `Welcome ${userName} on Tomo. Happy to see you here!`

//     console.log('TTS: Speaking welcome:', greeting)
//     Tts.stop()
//     Tts.speak(greeting)
//   }









//   // Fetch functions
//   const fetchAdvertisements = useCallback(async () => {
//     try {
//       const res = await apiGet('/api/admin/GetAllActiveAdvertisement')
//       if (res?.data) {
//         setAdvertisements(res.data)
//         const initialAdImageIndex = {}
//         res.data.forEach(ad => {
//           initialAdImageIndex[ad._id] = 0
//         })
//         setCurrentAdImageIndex(initialAdImageIndex)
//       }
//     } catch (error) {
//       console.error('Error fetching advertisements:', error)
//     }
//   }, [])

//   const fetchNewsData = useCallback(async () => {
//     try {
//       const res = await apiGet('/api/admin/GetAllPublishedNews')
//       if (res?.data) {
//         setNewsData(res.data)
//       }
//     } catch (error) {
//       console.error('Error fetching news:', error)
//     }
//   }, [])

//   const fetchData = useCallback(async () => {
//     setLoading(true)
//     try {
//       const endpoint = searchText.trim()
//         ? `/api/user/SearchPostsByHashtag?tag=${searchText}`
//         : urls.getAllPost
//       const res = await apiGet(endpoint)
//       setAllPosts(res?.data || [])
//     } catch (error) {
//       console.error('Error fetching posts:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [searchText])

//   const getCurrentStories = useCallback(async () => {
//     try {
//       const res = await apiGet(urls.getCurrentStories)
//       setAllStories(res?.data || [])
//     } catch (error) {
//       console.error('Error fetching stories:', error)
//     }
//   }, [])

//   const getFollwedStories = useCallback(async () => {
//     try {
//       const res = await apiGet(urls.followedUserStories)
//       setFollowedStories(res?.data || [])
//     } catch (error) {
//       console.error('Error fetching stories:', error)
//     }
//   }, [])

//   const fetchCommentDataOfaPost = useCallback(async (id) => {
//     try {
//       const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
//       setComments(res?.data || [])
//     } catch (error) {
//       console.error('Error fetching comments:', error)
//     }
//   }, [])

//   // Initial data fetch
//   useEffect(() => {
//     fetchData()
//     getCurrentStories()
//     getFollwedStories()
//     initializeLocation()
//     fetchAdvertisements()
//     fetchNewsData()
//   }, [])

//   // Search effect
//   useEffect(() => {
//     fetchData()
//   }, [searchText, fetchData])

//   // Location management
//   const initializeLocation = useCallback(async () => {
//     try {
//       setLocationStatus('updating')
//       await LocationManager.initializeLocationTracking()
//       setLocationStatus('updated')
//       setTimeout(() => setLocationStatus('idle'), 2000)
//     } catch (error) {
//       console.log('Location initialization failed:', error)
//       setLocationStatus('error')
//       setTimeout(() => setLocationStatus('idle'), 3000)
//     }
//   }, [])

//   const updateLocationOnFocus = useCallback(async () => {
//     try {
//       await LocationManager.checkAndUpdateLocation()
//     } catch (error) {
//       console.log('Foreground location update failed:', error)
//     }
//   }, [])

//   // User data fetch
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = await getItem('token')
//       setLoading(true)

//       try {
//         if (token) {
//           const getUserDetails = await apiGet(urls.userProfile)
//           dispatch(setUser(JSON.stringify(getUserDetails?.data)))
//         } else {
//           navigation.replace('Onboarding')
//         }
//       } catch (error) {
//         console.log('Fetch data error:', error)
//         navigation.replace('Onboarding')
//       } finally {
//         setLoading(false)
//       }
//     }

//     LocationManager.setLocationUpdateCallback(fetchUserData)
//     LocationManager.initializeLocationTracking()

//     return () => {
//       LocationManager.setLocationUpdateCallback(null)
//       LocationManager.stopLocationTracking()
//     }
//   }, [dispatch, navigation])

//   // Focus effect for location update
//   useEffect(() => {
//     if (isFocused) {
//       updateLocationOnFocus()
//       getCurrentStories()
//       getFollwedStories()
//     }
//   }, [isFocused, updateLocationOnFocus, getCurrentStories, getFollwedStories])

//   // Refresh handler
//   const onRefresh = useCallback(async () => {
//     setLoading(true)
//     await Promise.all([
//       fetchData(),
//       getCurrentStories(),
//       getFollwedStories(),
//       fetchAdvertisements(),
//       fetchNewsData()
//     ])
//     setLoading(false)
//   }, [fetchData, getCurrentStories, getFollwedStories, fetchAdvertisements, fetchNewsData])

//   // Post actions
//   const SavePost = useCallback(async (item) => {
//     const postId = item._id
//     const userId = selector?._id

//     setAllPosts(prevPosts =>
//       prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadySaved = post.SavedBy.includes(userId)
//           const updatedSavedBy = alreadySaved
//             ? post.SavedBy.filter(id => id !== userId)
//             : [...post.SavedBy, userId]

//           return { ...post, SavedBy: updatedSavedBy }
//         }
//         return post
//       })
//     )

//     try {
//       const endPoint = item?.SavedBy?.includes(userId)
//         ? `${urls.removeSavedPost}/${postId}`
//         : `${urls.SavePost}/${postId}`
//       await apiGet(endPoint)
//     } catch (error) {
//       console.log('Save Post Error:', error)
//       setAllPosts(prevPosts =>
//         prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasSaved = item.SavedBy.includes(userId)
//             const revertedSavedBy = wasSaved
//               ? [...post.SavedBy, userId]
//               : post.SavedBy.filter(id => id !== userId)
//             return { ...post, SavedBy: revertedSavedBy }
//           }
//           return post
//         })
//       )
//     }
//   }, [selector])

//   const onLikeUnlike = useCallback(async (item) => {
//     const postId = item._id
//     const userId = selector?._id

//     setAllPosts(prevPosts =>
//       prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadyLiked = post.likes.includes(userId)
//           const updatedLikes = alreadyLiked
//             ? post.likes.filter(id => id !== userId)
//             : [...post.likes, userId]

//           return {
//             ...post,
//             likes: updatedLikes,
//             TotalLikes: alreadyLiked ? post.TotalLikes - 1 : post.TotalLikes + 1,
//           }
//         }
//         return post
//       })
//     )

//     try {
//       await apiGet(`${urls.likeUnlike}/${postId}`)
//     } catch (error) {
//       console.log('Error in like/unlike', error)
//       setAllPosts(prevPosts =>
//         prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasLiked = item.likes.includes(userId)
//             const revertedLikes = wasLiked
//               ? [...post.likes, userId]
//               : post.likes.filter(id => id !== userId)

//             return {
//               ...post,
//               likes: revertedLikes,
//               TotalLikes: wasLiked ? post.TotalLikes + 1 : post.TotalLikes - 1,
//             }
//           }
//           return post
//         })
//       )
//     }
//   }, [selector])

//   const onDisLikes = useCallback(async (item) => {
//     const postId = item._id
//     const userId = selector?._id

//     setAllPosts(prevPosts =>
//       prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadyLiked = post.Unlikes.includes(userId)
//           const updatedLikes = alreadyLiked
//             ? post.Unlikes.filter(id => id !== userId)
//             : [...post.Unlikes, userId]

//           return {
//             ...post,
//             Unlikes: updatedLikes,
//             TotalUnLikes: alreadyLiked ? post.TotalUnLikes - 1 : post.TotalUnLikes + 1,
//           }
//         }
//         return post
//       })
//     )

//     try {
//       await apiGet(`${urls.disLikePost}/${postId}`)
//     } catch (error) {
//       console.log('Error in dislike', error)
//       setAllPosts(prevPosts =>
//         prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasLiked = item.Unlikes.includes(userId)
//             const revertedLikes = wasLiked
//               ? [...post.Unlikes, userId]
//               : post.Unlikes.filter(id => id !== userId)

//             return {
//               ...post,
//               Unlikes: revertedLikes,
//               TotalUnLikes: wasLiked ? post.TotalUnLikes + 1 : post.TotalUnLikes - 1,
//             }
//           }
//           return post
//         })
//       )
//     }
//   }, [selector])

//   // Comment actions
//   const sendComments = useCallback(async (id, text) => {
//     const data = { Post: id, text: text }
//     try {
//       await apiPost(`${urls.sendCommentOnPost}`, data)
//       fetchCommentDataOfaPost(id)
//     } catch (error) {
//       console.error('Error sending comment:', error)
//     }
//   }, [fetchCommentDataOfaPost])

//   const editComments = useCallback(async (id, text) => {
//     const data = { text: text }
//     try {
//       await apiPut(`${urls.editComment}/${id}`, data)
//       fetchCommentDataOfaPost(postId)
//     } catch (error) {
//       console.error('Error editing comment:', error)
//     }
//   }, [postId, fetchCommentDataOfaPost])

//   const onDeleteComments = useCallback(async (id) => {
//     try {
//       showLoader()
//       await apiDelete(`/api/user/DeleteComment/${id}`)
//       fetchCommentDataOfaPost(postId)
//     } catch (error) {
//       console.log('DeleteComment Error:', error?.response?.data || error.message)
//     } finally {
//       hideLoader()
//     }
//   }, [postId, showLoader, hideLoader, fetchCommentDataOfaPost])

//   // Ad handlers
//   const handleAdImageNext = useCallback((adId, totalImages) => {
//     setCurrentAdImageIndex(prev => ({
//       ...prev,
//       [adId]: (prev[adId] + 1) % totalImages
//     }))
//   }, [])

//   const handleAdImagePrev = useCallback((adId, totalImages) => {
//     setCurrentAdImageIndex(prev => ({
//       ...prev,
//       [adId]: prev[adId] === 0 ? totalImages - 1 : prev[adId] - 1
//     }))
//   }, [])

//   const handleAdClick = useCallback((ad) => {
//     if (ad.url) {
//       Linking.openURL(ad.url).catch(err =>
//         console.error('Failed to open URL:', err)
//       )
//     }
//   }, [])

//   const handlePostClick = useCallback((item) => {
//     navigation.navigate('PostDetail', {
//       post: item,
//       selector: selector,
//       isDarkMode: isDarkMode,
//       formatInstagramDate: formatInstagramDate,
//     })
//   }, [navigation, selector, isDarkMode])

//   // Render functions
//   // const renderHeader = useCallback(() => {
//   //   return (
//   //     <Animated.View 
//   //       style={[headerAnimatedStyle, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}
//   //     >
//   //       <SpaceBetweenRow
//   //         style={{
//   //           paddingTop: 50,
//   //           paddingHorizontal: 20,
//   //           paddingBottom: selectedTab === 'home' ? 0 : 12,
//   //         }}>
//   //         <Animated.View style={leftIconStyle}>
//   //           <TouchableOpacity
//   //             onPress={() => navigation.navigate('GalleryForAddPost')}
//   //             style={styles.headerIconContainer}>
//   //             <GradientIcon
//   //               colors={['#21B7FF', '#0084F8']}
//   //               size={20}
//   //               iconType='FontAwesome5'
//   //               name={'sliders-h'}
//   //             />
//   //           </TouchableOpacity>
//   //         </Animated.View>

//   //         <View style={styles.tabsContainer}>
//   //           {['home', 'Top25', 'News'].map((tab, index) => (
//   //             <Animated.View
//   //               key={tab}
//   //               entering={FadeInDown.duration(400).delay(index * 100)}>
//   //               <TouchableOpacity
//   //                 style={styles.tabButton}
//   //                 onPress={() => setSelectedTab(tab)}
//   //                 activeOpacity={0.7}>
//   //                 <CustomText
//   //                   style={[
//   //                     styles.tabText,
//   //                     selectedTab === tab && styles.tabTextActive
//   //                   ]}>
//   //                   {tab === 'home' ? 'Home' : tab}
//   //                 </CustomText>
//   //                 {selectedTab === tab && (
//   //                   <Animated.View entering={ZoomIn.duration(300)}>
//   //                     <LinearGradient
//   //                       colors={['#21B7FF', '#0084F8']}
//   //                       start={{ x: 0, y: 0 }}
//   //                       end={{ x: 1, y: 0 }}
//   //                       style={styles.tabIndicator}
//   //                     />
//   //                   </Animated.View>
//   //                 )}
//   //               </TouchableOpacity>
//   //             </Animated.View>
//   //           ))}
//   //         </View>

//   //         <Animated.View style={rightIconStyle}>
//   //           <TouchableOpacity 
//   //             onPress={() => navigation.navigate('Activity')}
//   //             style={styles.headerIconContainer}>
//   //             <GradientIcon
//   //               colors={['#21B7FF', '#0084F8']}
//   //               size={20}
//   //               iconType='FontAwesome5'
//   //               name={'bell'}
//   //             />
//   //           </TouchableOpacity>
//   //         </Animated.View>
//   //       </SpaceBetweenRow>
//   //     </Animated.View>
//   //   )
//   // }, [isDarkMode, selectedTab, navigation, headerAnimatedStyle, leftIconStyle, rightIconStyle])

//   const renderHeader = useCallback(() => {
//     return (
//       <Animated.View
//         style={[headerAnimatedStyle, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}
//       >
//         <SpaceBetweenRow
//           style={{
//             paddingTop: 50,
//             paddingHorizontal: 20,
//             paddingBottom: selectedTab === 'home' ? 0 : 12,
//           }}>
//           <Animated.View style={leftIconStyle}>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('GalleryForAddPost')}
//               style={styles.headerIconContainer}>
//               <GradientIcon
//                 // colors={['#21B7FF', '#0084F8']}
//                 colors={glowColors}

//                 size={20}
//                 iconType='FontAwesome5'
//                 name={'sliders-h'}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <View style={styles.tabsContainer}>
//             {['home', 'Top25', 'News'].map((tab, index) => (
//               <Animated.View
//                 key={tab}
//                 entering={FadeInDown.duration(400).delay(index * 100)}>
//                 <TouchableOpacity
//                   style={styles.tabButton}
//                   onPress={() => setSelectedTab(tab)}
//                   activeOpacity={0.7}>
//                   <CustomText
//                     style={[
//                       styles.tabText,
//                       selectedTab === tab && styles.tabTextActive
//                     ]}>
//                     {tab === 'home' ? 'Home' : tab}
//                   </CustomText>
//                   {selectedTab === tab && (
//                     <Animated.View entering={ZoomIn.duration(300)}>
//                       <LinearGradient
//                         // colors={['#21B7FF', '#0084F8']}
//                         colors={glowColors}

//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 0 }}
//                         style={styles.tabIndicator}
//                       />
//                     </Animated.View>
//                   )}
//                 </TouchableOpacity>
//               </Animated.View>
//             ))}
//           </View>

//           <Animated.View style={rightIconStyle}>
//             <View ref={bellIconRef} collapsable={false}>
//               <TouchableOpacity
//                 onPress={handleBellPress}
//                 style={styles.headerIconContainer}
//               >
//                 <GradientIcon
//                   // colors={['#21B7FF', '#0084F8']}
//                   colors={[primaryColor, secondaryColor]}

//                   size={20}
//                   iconType="FontAwesome5"
//                   name="bell"
//                 />
//               </TouchableOpacity>
//             </View>
//           </Animated.View>

//         </SpaceBetweenRow>
//       </Animated.View>
//     )
//   }, [isDarkMode, selectedTab, navigation, headerAnimatedStyle, leftIconStyle, rightIconStyle, bellIconPosition])

//   const renderSearchBar = useCallback(() => {
//     return (
//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputWrapper}>
//           <Feather
//             name="search"
//             size={18}
//             color={isDarkMode ? '#666' : '#999'}
//             style={styles.searchIcon}
//           />
//           <TextInput
//             style={[
//               styles.searchInput,
//               {
//                 color: isDarkMode ? '#fff' : '#000',
//                 backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'
//               }
//             ]}
//             placeholder="Search posts, hashtags..."
//             placeholderTextColor={isDarkMode ? '#666' : '#999'}
//             value={searchText}
//             onChangeText={(text) => {
//               setSearchText(text)
//               SearchTags(text)
//             }}
//             onFocus={() => searchText && setShowSuggestions(true)}
//           />
//           {searchText !== '' && (
//             <Animated.View entering={ZoomIn.duration(200)}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setSearchText('')
//                   setSuggestions([])
//                   setShowSuggestions(false)
//                 }}
//                 style={styles.clearButton}>
//                 <AntDesign name="closecircle" size={16} color={isDarkMode ? '#666' : '#999'} />
//               </TouchableOpacity>
//             </Animated.View>
//           )}
//         </View>

//         {showSuggestions && suggestions?.length > 0 && (
//           <Animated.View
//             entering={FadeInDown.duration(300)}
//             exiting={FadeOut.duration(200)}
//             style={[
//               styles.suggestionsContainer,
//               { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
//             ]}>
//             {tagLoading ? (
//               <View style={styles.suggestionItem}>
//                 <Text style={[styles.suggestionText, { color: isDarkMode ? '#666' : '#999' }]}>
//                   Loading...
//                 </Text>
//               </View>
//             ) : (
//               suggestions.map((item, index) => (
//                 <Animated.View
//                   key={`suggestion-${index}`}
//                   entering={FadeInDown.duration(300).delay(index * 50)}>
//                   <TouchableOpacity
//                     style={styles.suggestionItem}
//                     onPress={() => {
//                       setSearchText(item.Tag)
//                       setShowSuggestions(false)
//                       setSuggestions([])
//                     }}
//                     activeOpacity={0.7}>
//                     <Feather name="hash" size={14} color="#4B6BFF" />
//                     <Text style={[
//                       styles.suggestionText,
//                       { color: isDarkMode ? '#fff' : '#000' }
//                     ]}>
//                       {item.Tag}
//                     </Text>
//                   </TouchableOpacity>
//                 </Animated.View>
//               ))
//             )}
//           </Animated.View>
//         )}
//       </View>
//     )
//   }, [isDarkMode, searchText, showSuggestions, suggestions, tagLoading, SearchTags])

//   // const renderStories = useCallback(() => {
//   //   return (
//   //     <View
//   //       style={{
//   //         borderBottomWidth: 0.5,
//   //         borderBottomColor: isDarkMode ? '#333' : '#E5E5E5',
//   //       }}>
//   //       <View
//   //         style={{
//   //           paddingVertical: 5,
//   //           backgroundColor: isDarkMode ? '#000' : '#fff',
//   //         }}>
//   //         <ScrollView
//   //           horizontal
//   //           showsHorizontalScrollIndicator={false}
//   //           contentContainerStyle={{ paddingHorizontal: 16 }}>

//   //           <Animated.View
//   //             entering={ZoomIn.duration(400).delay(100)}
//   //             style={styles.storyContainer}>
//   //             <TouchableOpacity
//   //               style={styles.yourStoryWrapper}
//   //               onPress={() =>
//   //                 navigation.navigate('StoryScreen', {
//   //                   storyImage: allStories,
//   //                   User: selector,
//   //                 })
//   //               }
//   //               activeOpacity={0.8}>
//   //               <LinearGradient
//   //                 colors={allStories[0]?.media ?
//   //                   ['#21B7FF', '#0084F8'] : ['#E5E5E5', '#E5E5E5']}
//   //                 start={{ x: 0, y: 0 }}
//   //                 end={{ x: 1, y: 1 }}
//   //                 style={styles.storyGradientBorder}>
//   //                 <View style={styles.storyImageContainer}>
//   //                   <Image
//   //                     source={
//   //                       allStories[0]?.media
//   //                         ? { uri: allStories[0]?.media }
//   //                         : IMG.TomoLogo
//   //                     }
//   //                     style={styles.storyImage}
//   //                   />
//   //                 </View>
//   //               </LinearGradient>
//   //               <TouchableOpacity
//   //                 style={styles.addStoryButton}
//   //                 onPress={() => navigation.navigate('GalleryPickerScreen')}
//   //                 activeOpacity={0.9}>
//   //                 <LinearGradient
//   //                   colors={['#21B7FF', '#0084F8']}
//   //                   start={{ x: 0, y: 0 }}
//   //                   end={{ x: 1, y: 0 }}
//   //                   style={styles.addStoryGradient}>
//   //                   <AddStoryIcon />
//   //                 </LinearGradient>
//   //               </TouchableOpacity>
//   //             </TouchableOpacity>
//   //             <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//   //               Your Story
//   //             </Text>
//   //           </Animated.View>

//   //           {followedStories?.map((item, index) => {
//   //             const key = item?._id || `story-${index}`
//   //             if (item?.User?.Stories?.length > 0) {
//   //               return (
//   //                 <Animated.View
//   //                   key={key}
//   //                   entering={ZoomIn.duration(400).delay((index + 1) * 80)}
//   //                   style={styles.storyContainer}>
//   //                   <TouchableOpacity
//   //                     onPress={() =>
//   //                       navigation.navigate('StoryScreen', {
//   //                         storyImage: item.User?.Stories,
//   //                         User: item?.User,
//   //                       })
//   //                     }
//   //                     activeOpacity={0.8}>
//   //                     <LinearGradient
//   //                       colors={['#21B7FF', '#0084F8']}
//   //                       start={{ x: 0, y: 0 }}
//   //                       end={{ x: 1, y: 1 }}
//   //                       style={styles.storyGradientBorder}>
//   //                       <View style={styles.storyImageContainer}>
//   //                         <Image
//   //                           source={
//   //                             item.User?.Stories?.length > 0
//   //                               ? { uri: item.User?.Stories[0]?.media }
//   //                               : IMG.AddStoryImage
//   //                           }
//   //                           style={styles.storyImage}
//   //                         />
//   //                       </View>
//   //                     </LinearGradient>
//   //                   </TouchableOpacity>
//   //                   <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//   //                     {item?.User?.UserName}
//   //                   </Text>
//   //                 </Animated.View>
//   //               )
//   //             }
//   //             return null
//   //           })}
//   //         </ScrollView>
//   //       </View>
//   //     </View>
//   //   )
//   // }, [isDarkMode, allStories, followedStories, selector, navigation])

//   // ✅ Home.js me renderStories function ko update karo:

//   const renderStories = useCallback(() => {
//     return (
//       <View
//         style={{
//           borderBottomWidth: 0.5,
//           borderBottomColor: isDarkMode ? '#333' : '#E5E5E5',
//         }}>
//         <View
//           style={{
//             paddingVertical: 5,
//             backgroundColor: isDarkMode ? '#000' : '#fff',
//           }}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 16 }}>

//             {/* YOUR STORY */}
//             <Animated.View
//               entering={ZoomIn.duration(400).delay(100)}
//               style={styles.storyContainer}>
//               <TouchableOpacity
//                 style={styles.yourStoryWrapper}
//                 onPress={() =>
//                   navigation.navigate('StoryScreen', {
//                     storyImage: allStories,
//                     User: selector,
//                     allUsersStories: followedStories, // ✅ ALL USERS PASS KARO
//                     initialUserIndex: -1, // ✅ YOUR STORY = -1 (pehle aapki story)
//                   })
//                 }
//                 activeOpacity={0.8}>
//                 <LinearGradient
//                   colors={allStories[0]?.media ?
//                     ['#21B7FF', '#0084F8'] : ['#E5E5E5', '#E5E5E5']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.storyGradientBorder}>
//                   <View style={styles.storyImageContainer}>
//                     <Image
//                       source={
//                         allStories[0]?.media
//                           ? { uri: allStories[0]?.media }
//                           : IMG.TomoLogo
//                       }
//                       style={styles.storyImage}
//                     />
//                   </View>
//                 </LinearGradient>
//                 <TouchableOpacity
//                   style={styles.addStoryButton}
//                   onPress={() => navigation.navigate('GalleryPickerScreen')}
//                   activeOpacity={0.9}>
//                   <LinearGradient
//                     colors={['#21B7FF', '#0084F8']}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.addStoryGradient}>
//                     <AddStoryIcon />
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </TouchableOpacity>
//               <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//                 Your Story
//               </Text>
//             </Animated.View>

//             {/* OTHER USERS STORIES */}
//             {followedStories?.map((item, index) => {
//               const key = item?._id || `story-${index}`
//               if (item?.User?.Stories?.length > 0) {
//                 return (
//                   <Animated.View
//                     key={key}
//                     entering={ZoomIn.duration(400).delay((index + 1) * 80)}
//                     style={styles.storyContainer}>
//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('StoryScreen', {
//                           storyImage: item.User?.Stories, // ✅ Current user ki stories
//                           User: item?.User, // ✅ Current user
//                           allUsersStories: followedStories, // ✅ ALL users ki stories
//                           initialUserIndex: index, // ✅ Index pass karo
//                         })
//                       }
//                       activeOpacity={0.8}>
//                       <LinearGradient
//                         colors={['#21B7FF', '#0084F8']}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                         style={styles.storyGradientBorder}>
//                         <View style={styles.storyImageContainer}>
//                           <Image
//                             source={
//                               item.User?.Stories?.length > 0
//                                 ? { uri: item.User?.Stories[0]?.media }
//                                 : IMG.AddStoryImage
//                             }
//                             style={styles.storyImage}
//                           />
//                         </View>
//                       </LinearGradient>
//                     </TouchableOpacity>
//                     <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//                       {item?.User?.UserName}
//                     </Text>
//                   </Animated.View>
//                 )
//               }
//               return null
//             })}
//           </ScrollView>
//         </View>
//       </View>
//     )
//   }, [isDarkMode, allStories, followedStories, selector, navigation])

//   const renderAdvertisement = useCallback((ad, index) => {
//     const currentImageIndex = currentAdImageIndex[ad._id] || 0
//     const currentMedia = ad?.media[currentImageIndex]
//     const totalImages = ad?.media?.length

//     return (
//       <Animated.View
//         entering={FadeInUp.duration(400).delay(index * 100)}
//         style={styles.feedContainer}>
//         <TouchableOpacity
//           key={`ad-${ad._id}-${index}`}
//           onPress={() => handleAdClick(ad)}
//           activeOpacity={0.95}>
//           <View style={styles.feedHeader}>
//             <View style={styles.feedUserInfo}>
//               <View style={styles.adBadgeContainer}>
//                 <LinearGradient
//                   colors={['#21B7FF', '#0084F8']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.adBadgeGradient}>
//                   <CustomText style={styles.adBadge}>Sponsored</CustomText>
//                 </LinearGradient>
//               </View>
//               <View style={{ marginLeft: 8 }}>
//                 <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>{ad.name}</Text>
//                 <Text style={[styles.caption, { fontSize: 12, color: isDarkMode ? '#999' : '#666' }]}>{ad.location}</Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.mediaContainer}>
//             {currentMedia.type === 'image' ? (
//               <Image
//                 source={{ uri: currentMedia.url }}
//                 style={styles.postImage}
//                 resizeMode='cover'
//               />
//             ) : (
//               <Video
//                 source={{ uri: currentMedia.url }}
//                 style={styles.postImage}
//                 resizeMode='cover'
//                 repeat={true}
//                 muted={isMuted}
//               />
//             )}

//             {totalImages > 1 && (
//               <>
//                 <View style={styles.adDotsContainer}>
//                   {ad.media.map((_, idx) => (
//                     <Animated.View
//                       key={`dot-${idx}`}
//                       entering={ZoomIn.duration(200).delay(idx * 50)}
//                       style={[
//                         styles.adDot,
//                         currentImageIndex === idx && styles.adDotActive
//                       ]}
//                     />
//                   ))}
//                 </View>

//                 {currentImageIndex > 0 && (
//                   <Animated.View entering={SlideInLeft.duration(300)}>
//                     <TouchableOpacity
//                       style={[styles.adNavButton, styles.adNavButtonLeft]}
//                       onPress={() => handleAdImagePrev(ad._id, totalImages)}
//                       activeOpacity={0.8}>
//                       <AntDesign name="left" size={18} color="white" />
//                     </TouchableOpacity>
//                   </Animated.View>
//                 )}

//                 {currentImageIndex < totalImages - 1 && (
//                   <Animated.View entering={SlideInRight.duration(300)}>
//                     <TouchableOpacity
//                       style={[styles.adNavButton, styles.adNavButtonRight]}
//                       onPress={() => handleAdImageNext(ad._id, totalImages)}
//                       activeOpacity={0.8}>
//                       <AntDesign name="right" size={18} color="white" />
//                     </TouchableOpacity>
//                   </Animated.View>
//                 )}
//               </>
//             )}
//           </View>

//           <TouchableOpacity style={styles.adCtaContainer} activeOpacity={0.8}>
//             <LinearGradient
//               colors={['#21B7FF', '#0084F8']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.adCtaGradient}>
//               <CustomText style={styles.adCtaText}>Learn More →</CustomText>
//             </LinearGradient>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Animated.View>
//     )
//   }, [currentAdImageIndex, isMuted, isDarkMode, handleAdClick, handleAdImageNext, handleAdImagePrev])

//   const renderItem = useCallback(({ item, index }) => {
//     if (item.type === 'ad') {
//       return renderAdvertisement(item.data, index)
//     }

//     const post = item.data
//     const isNewsItem = selectedTab === 'News'
//     const mediaUrl = post.media
//     const isVideo = isNewsItem
//       ? post.mediatype === 'video'
//       : typeof mediaUrl === 'string' &&
//       (mediaUrl.includes('.mp4') ||
//         mediaUrl.includes('.mov') ||
//         mediaUrl.includes('video') ||
//         mediaUrl.includes('.avi'))

//     return (
//       <Animated.View entering={FadeInUp.duration(400).delay(index * 50)}>
//         <FeedCard
//           post={post}
//           index={index}
//           styles={styles}
//           isDarkMode={isDarkMode}
//           isNewsItem={isNewsItem}
//           isVideo={isVideo}
//           mediaUrl={mediaUrl}
//           visibleVideoIndex={visibleVideoIndex}
//           pausedVideos={pausedVideos}
//           isMuted={isMuted}
//           selector={selector}
//           doubleTapIndex={doubleTapIndex}
//           heartOpacity={heartOpacity}
//           heartScale={heartScale}
//           formatInstagramDate={formatInstagramDate}
//           onPostPress={() => !isNewsItem && handlePostClick(post)}
//           onUserPress={() => {
//             if (!isNewsItem) {
//               navigation.navigate('OtherUserDetail', {
//                 userId: post?.User?._id,
//               })
//             }
//           }}
//           onMediaPress={() => {
//             if (isNewsItem) return
//             const now = Date.now()
//             if (lastTapRef.current && now - lastTapRef.current < 300) {
//               triggerHeartAnimation(index)
//               onLikeUnlike(post)
//             } else {
//               lastTapRef.current = now
//               handlePostClick(post)
//             }
//           }}
//           onLikePress={() => onLikeUnlike(post)}
//           onDislikePress={() => onDisLikes(post)}
//           onCommentPress={() => {
//             navigation.navigate('Comments', {
//               postId: post?._id,
//               isDarkMode: isDarkMode,
//               selector: selector,
//             })
//           }}
//           onBookmarkPress={() => SavePost(post)}
//           onMuteToggle={() => setIsMuted(!isMuted)}
//         />
//       </Animated.View>
//     )
//   }, [
//     selectedTab,
//     isDarkMode,
//     visibleVideoIndex,
//     pausedVideos,
//     isMuted,
//     selector,
//     doubleTapIndex,
//     heartOpacity,
//     heartScale,
//     renderAdvertisement,
//     handlePostClick,
//     triggerHeartAnimation,
//     onLikeUnlike,
//     onDisLikes,
//     SavePost,
//     navigation,
//   ])

//   const keyExtractor = useCallback((item, index) => {
//     if (item.type === 'ad') {
//       return `ad-${item.data._id}-${index}`
//     }
//     return `post-${item.data._id || index}`
//   }, [])

//   const getItemLayout = useCallback((data, index) => ({
//     length: 500,
//     offset: 500 * index,
//     index,
//   }), [])

//   const renderFeeds = useCallback(() => {
//     return (
//       <Animated.FlatList
//         ref={flatListRef}
//         data={mergedFeedData}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         onScroll={scrollHandler}
//         scrollEventThrottle={16}
//         maxToRenderPerBatch={5}
//         windowSize={5}
//         removeClippedSubviews={true}
//         initialNumToRender={3}
//         updateCellsBatchingPeriod={50}
//         getItemLayout={getItemLayout}
//         onRefresh={onRefresh}
//         refreshing={loading}
//         ListEmptyComponent={
//           (
//             <Animated.View
//               entering={FadeIn.duration(400)}
//               style={styles.emptyContainer}>
//               <Text style={[styles.emptyText, { color: isDarkMode ? '#666' : '#999' }]}>
//                 No posts available
//               </Text>
//             </Animated.View>
//           )
//         }
//       />
//     )
//   }, [
//     mergedFeedData,
//     renderItem,
//     keyExtractor,
//     onViewableItemsChanged,
//     viewabilityConfig,
//     scrollHandler,
//     getItemLayout,
//     onRefresh,
//     loading,
//     isDarkMode,
//   ])

//   const styles = useMemo(() => StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#000' : '#fff',
//     },
//     headerIconContainer: {
//       width: 40,
//       height: 40,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: 20,
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//     },
//     tabsContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 24,
//       flex: 1,
//       justifyContent: 'center',
//     },
//     tabButton: {
//       alignItems: 'center',
//       gap: 6,
//     },
//     tabText: {
//       fontSize: 15,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? '#666' : '#999',
//     },
//     tabTextActive: {
//       color: isDarkMode ? '#fff' : '#000',
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//     },
//     tabIndicator: {
//       height: 3,
//       width: 50,
//       borderRadius: 2,
//     },
//     searchContainer: {
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//       backgroundColor: isDarkMode ? '#000' : '#fff',
//       position: 'relative',
//       zIndex: 1000,
//     },
//     searchInputWrapper: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       borderRadius: 12,
//       paddingHorizontal: 12,
//       position: 'relative',
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'
//     },
//     searchIcon: {
//       marginRight: 8,
//     },
//     searchInput: {
//       flex: 1,
//       height: 44,
//       fontSize: 15,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       paddingVertical: 10,
//       borderRadius: 12,
//       paddingLeft: 36,
//     },
//     clearButton: {
//       right: 0,
//       padding: 0,
//       bottom: 2
//     },
//     suggestionsContainer: {
//       marginTop: 8,
//       borderRadius: 12,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 8,
//       elevation: 5,
//       maxHeight: 240,
//     },
//     suggestionItem: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingVertical: 12,
//       paddingHorizontal: 16,
//       gap: 10,
//       borderBottomWidth: 0.5,
//       borderBottomColor: isDarkMode ? '#333' : '#f0f0f0',
//     },
//     suggestionText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     storyContainer: {
//       alignItems: 'center',
//       marginRight: 16,
//       width: 70,
//     },
//     yourStoryWrapper: {
//       position: 'relative',
//     },
//     storyGradientBorder: {
//       width: 62,
//       height: 62,
//       borderRadius: 36,
//       padding: 3,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     storyImageContainer: {
//       width: 56,
//       height: 56,
//       borderRadius: 33,
//       overflow: 'hidden',
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//     },
//     storyImage: {
//       width: '100%',
//       height: '100%',
//     },
//     addStoryButton: {
//       position: 'absolute',
//       bottom: 0,
//       right: 0,
//     },
//     addStoryGradient: {
//       width: 24,
//       height: 24,
//       borderRadius: 12,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#000' : '#fff',
//     },
//     storyText: {
//       fontSize: 12,
//       marginTop: 6,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       textAlign: 'center',
//     },
//     feedContainer: {
//       paddingBottom: 12,
//       backgroundColor: isDarkMode ? '#161C1C' : '#e4edeeff',
//       margin: 10,
//       borderRadius: 30,
//       borderWidth: 1,
//       marginBottom: 10,
//       borderColor: isDarkMode ? '#333' : '#E0E0E0',
//       paddingHorizontal: 10
//     },
//     feedHeader: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       paddingHorizontal: 0,
//       paddingVertical: 12,
//     },
//     feedUserInfo: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     },
//     profileImageWrapper: {
//       marginRight: 12,
//     },
//     profileImage: {
//       width: 42,
//       height: 42,
//       borderRadius: 21,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//     },
//     userNameRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 2,
//     },
//     username: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       fontSize: 15,
//     },
//     timeText: {
//       color: '#999',
//       fontSize: 12,
//       marginLeft: 6,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     caption: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       lineHeight: 18,
//       color: isDarkMode ? '#252525' : 'white'
//     },
//     mediaContainer: {
//       position: 'relative',
//       marginTop: 8,
//     },
//     postImage: {
//       width: '100%',
//       height: 350,
//       borderRadius: 20
//     },
//     videoContainer: {
//       borderRadius: 0,
//       overflow: 'hidden',
//     },
//     heartAnimation: {
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: [{ translateX: -50 }, { translateY: -50 }],
//     },
//     soundButton: {
//       position: 'absolute',
//       bottom: 16,
//       right: 16,
//     },
//     soundButtonInner: {
//       backgroundColor: 'rgba(0, 0, 0, 0.6)',
//       padding: 8,
//       borderRadius: 20,
//       backdropFilter: 'blur(10px)',
//     },
//     actions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       paddingHorizontal: 16,
//     },
//     leftActions: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 16,
//     },
//     actionButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 6,
//       paddingVertical: 4,
//       paddingHorizontal: 8,
//       borderRadius: 16,
//       backgroundColor: '#E0E0E0',
//     },
//     actionText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     },
//     adBadgeContainer: {
//       marginRight: 12,
//     },
//     adBadgeGradient: {
//       paddingHorizontal: 10,
//       paddingVertical: 5,
//       borderRadius: 6,
//     },
//     adBadge: {
//       fontSize: 11,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: '#fff',
//       letterSpacing: 0.5,
//     },
//     adDotsContainer: {
//       position: 'absolute',
//       bottom: 12,
//       left: 0,
//       right: 0,
//       flexDirection: 'row',
//       justifyContent: 'center',
//       alignItems: 'center',
//       gap: 6,
//     },
//     adDot: {
//       width: 6,
//       height: 6,
//       borderRadius: 3,
//       backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     },
//     adDotActive: {
//       backgroundColor: '#fff',
//       width: 20,
//       height: 6,
//       borderRadius: 3,
//     },
//     adNavButton: {
//       position: 'absolute',
//       top: '50%',
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       justifyContent: 'center',
//       alignItems: 'center',
//       transform: [{ translateY: -18 }],
//       backdropFilter: 'blur(10px)',
//     },
//     adNavButtonLeft: {
//       left: 12,
//     },
//     adNavButtonRight: {
//       right: 12,
//     },
//     adCtaContainer: {
//       marginHorizontal: 16,
//       marginTop: 12,
//       borderRadius: 12,
//       overflow: 'hidden',
//     },
//     adCtaGradient: {
//       padding: 14,
//       alignItems: 'center',
//     },
//     adCtaText: {
//       color: '#fff',
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       fontSize: 15,
//       letterSpacing: 0.5,
//     },
//     emptyContainer: {
//       alignItems: 'center',
//       justifyContent: 'center',
//       paddingVertical: 60,
//     },
//     emptyText: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       fontSize: 16,
//     },
//     ttsContainer: {
//       position: 'absolute',
//       bottom: 160,
//       right: 20,
//       zIndex: 999,
//       alignItems: 'flex-end',
//     },
//     ttsStatusText: {
//       fontSize: 11,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       marginBottom: 8,
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//       paddingHorizontal: 12,
//       paddingVertical: 6,
//       borderRadius: 8,
//       borderWidth: 1,
//       borderColor: '#21B7FF',
//       maxWidth: 150,
//       textAlign: 'center',
//     },
//     ttsButton: {
//       width: 56,
//       height: 56,
//       borderRadius: 28,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
//       borderWidth: 2,
//       borderColor: '#21B7FF',
//       shadowColor: '#21B7FF',
//       shadowOffset: { width: 0, height: 0 },
//       shadowOpacity: 0.8,
//       shadowRadius: 8,
//       elevation: 10,
//     },
//     ttsButtonReading: {
//       borderColor: '#FF5252',
//       shadowColor: '#FF5252',
//     },
//     ttsButtonText: {
//       fontSize: 10,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       marginTop: 4,
//     },
//     // Tour Styles
//     tourOverlay: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.7)',
//       zIndex: 9999,
//     },
//     tourHighlight: {
//       position: 'absolute',
//       borderRadius: 16,
//       borderWidth: 3,
//       borderColor: '#21B7FF',
//       shadowColor: '#21B7FF',
//       shadowOffset: { width: 0, height: 0 },
//       shadowOpacity: 1,
//       shadowRadius: 20,
//       elevation: 20,
//     },
//     tourTooltip: {
//       position: 'absolute',
//       backgroundColor: '#21B7FF',
//       paddingHorizontal: 20,
//       paddingVertical: 16,
//       borderRadius: 16,
//       maxWidth: 300,
//       zIndex: 10000,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.3,
//       shadowRadius: 8,
//       elevation: 8,
//     },
//     tourTooltipTitle: {
//       fontSize: 16,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: '#fff',
//       marginBottom: 8,
//     },
//     tourTooltipText: {
//       fontSize: 13,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: '#fff',
//       lineHeight: 18,
//       marginBottom: 12,
//     },
//     tourButtonContainer: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       gap: 8,
//     },
//     tourButton: {
//       flex: 1,
//       paddingVertical: 10,
//       paddingHorizontal: 12,
//       borderRadius: 8,
//       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//       alignItems: 'center',
//     },
//     tourButtonText: {
//       color: '#fff',
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       fontSize: 12,
//     },
//     tourStartButton: {
//       position: 'absolute',
//       top: 60,
//       left: 20,
//       backgroundColor: '#21B7FF',
//       paddingHorizontal: 12,
//       paddingVertical: 8,
//       borderRadius: 8,
//       zIndex: 100,
//     },
//     tourStartButtonText: {
//       color: '#fff',
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       fontSize: 12,
//     },
//   }), [isDarkMode])

//   return (
//     <View style={styles.container}>

//       <StatusBar
//         // translucent={true}
//         backgroundColor={isDarkMode ? '#000' : '#fff'}
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />

//       {/* Header - Scroll pe hide hoga */}
//       <Animated.View
//         style={[
//           {
//             // position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: 1001,
//             backgroundColor: isDarkMode ? '#000' : '#fff',
//             // width:'100%'
//           },
//           { opacity: headerOpacity }
//         ]}>
//         {renderHeader()}
//       </Animated.View>

//       {/* Search Bar + Stories - Scroll pe header ki jagah jayega aur stick hoga */}
//       {selectedTab === 'home' && (
//         <Animated.View
//           style={[
//             searchBarAnimatedStyle,
//             {
//               position: 'absolute',
//               top: 100,
//               left: 0,
//               right: 0,
//               zIndex: 1000,
//               backgroundColor: isDarkMode ? '#000' : '#fff',
//               // height:100
//               // paddingTop:300
//             }
//           ]}>
//           {renderSearchBar()}
//           {renderStories()}
//         </Animated.View>
//       )}


//       {loading ? (
//         <View style={{ flex: 1, paddingTop: selectedTab === 'home' ? 100 : 100 }}>
//           <FeedShimmerLoader isDarkMode={isDarkMode} count={5} />
//         </View>
//       ) : (
//         <Animated.FlatList
//           ref={flatListRef}
//           data={mergedFeedData}
//           renderItem={renderItem}
//           keyExtractor={keyExtractor}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//           onScroll={scrollHandler}
//           scrollEventThrottle={16}
//           contentContainerStyle={{ paddingTop: selectedTab === 'home' ? 180 : 100 }}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//           removeClippedSubviews={true}
//           initialNumToRender={3}
//           updateCellsBatchingPeriod={50}
//           getItemLayout={getItemLayout}
//           onRefresh={onRefresh}
//           refreshing={loading}
//           ListEmptyComponent={
//             <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
//               <Text style={{ fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontSize: 16, color: isDarkMode ? '#666' : '#999' }}>
//                 No posts available
//               </Text>
//             </View>
//           }
//         />
//       )}

//       {/* Floating Action Button */}
//       <Animated.View style={[additionalStyles.fabContainer, fabAnimatedStyle]}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('GalleryForAddPost')}
//           activeOpacity={0.9}>
//           <AddPostBtn />
//         </TouchableOpacity>
//       </Animated.View>


//       {/* Content removed - Simple welcome greeting only */}
//     </View>
//   )

// }

// const additionalStyles = {
//   fabContainer: {
//     position: 'absolute',
//     bottom: 100,
//     right: 20,
//   },
// }

// export default React.memo(Home)



import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  TextInput,
  BackHandler,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
  Dimensions,
  Animated as RNAnimated, // ✅ FIX 1: Use RN Animated for heart (lighter than Reanimated for simple opacity/scale)
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideInLeft,
  ZoomIn,
  ZoomOut,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedScrollHandler,
  FadeOut,
} from 'react-native-reanimated'
import CustomText from '../../components/TextComponent'
import IMG from '../../assets/Images'
import LocationManager from '../../utils/LocationManager'
import {
  AddPostBtn,
  AddStoryIcon,
} from '../../assets/SVGs'
import { FONTS_FAMILY } from '../../assets/Fonts'
import SpaceBetweenRow from '../../components/wrapper/spacebetween'
import { useDispatch, useSelector } from 'react-redux'
import Video from 'react-native-video'
import { apiDelete, apiGet, apiPost, apiPut, getItem } from '../../utils/Apis'
import urls from '../../config/urls'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import useLoader from '../../utils/LoaderHook'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import FeedShimmerLoader from '../../components/Skeletons/FeedsShimmer'
import messaging from '@react-native-firebase/messaging'
import { setUser } from '../../redux/reducer/user'
import GradientIcon from '../../components/GradientIcon'
import LinearGradient from 'react-native-linear-gradient'
import { formatInstagramDate } from '../../utils/DateFormat'
import FeedCard from './FeedsCards'
import Tts from 'react-native-tts'
import { THEMES } from '../../redux/reducer/theme'
import TutorialOverlay, { useTutorial } from './TutorialOverlay'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width: screenWidth } = Dimensions.get('window')

// ✅ FIX 2: ALL STATIC STYLES OUTSIDE COMPONENT — never recreated on render
// Only dynamic (isDarkMode-dependent) styles stay inside useMemo
const staticStyles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flex: 1,
    justifyContent: 'center',
  },
  tabButton: {
    alignItems: 'center',
    gap: 6,
  },
  tabIndicator: {
    height: 3,
    width: 50,
    borderRadius: 2,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    position: 'relative',
  },
  searchIcon: {
    marginRight: 8,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  yourStoryWrapper: {
    position: 'relative',
  },
  storyGradientBorder: {
    width: 62,
    height: 62,
    borderRadius: 36,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 33,
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  addStoryGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  storyText: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    textAlign: 'center',
  },
  adBadgeContainer: {
    marginRight: 12,
  },
  adBadgeGradient: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  adBadge: {
    fontSize: 11,
    fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
    color: '#fff',
    letterSpacing: 0.5,
  },
  adDotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  adDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  adDotActive: {
    backgroundColor: '#fff',
    width: 20,
    height: 6,
    borderRadius: 3,
  },
  adNavButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -18 }],
  },
  adNavButtonLeft: { left: 12 },
  adNavButtonRight: { right: 12 },
  adCtaContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  adCtaGradient: {
    padding: 14,
    alignItems: 'center',
  },
  adCtaText: {
    color: '#fff',
    fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  feedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageWrapper: {
    marginRight: 12,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    fontSize: 15,
  },
  mediaContainer: {
    position: 'relative',
    marginTop: 8,
  },
  postImage: {
    width: '100%',
    height: 350,
    borderRadius: 20,
  },
})

// ✅ FIX 3: Regex compiled once, not inside render
const HTML_TAG_REGEX = /<[^>]*>/g

const Home = ({ navigation }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme)
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default
  const primaryColor = currentTheme.primary
  const secondaryColor = currentTheme.secondary
  const glowColors = useMemo(() => [primaryColor, secondaryColor], [primaryColor, secondaryColor])

  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const { showLoader, hideLoader } = useLoader()
  const { showTutorial, dismissTutorial } = useTutorial()

  // Reanimated shared values
  const fabScale = useSharedValue(1)
  const fabOpacity = useSharedValue(1)
  const fabRotation = useSharedValue(0)
  const headerScale = useSharedValue(0.8)
  const headerOpacity = useSharedValue(0)
  const scrollY = useSharedValue(0)
  const lastScrollY = useSharedValue(0)
  const searchBarTranslateY = useSharedValue(0)
  const searchBarScale = useSharedValue(0)
  const leftIconTranslateY = useSharedValue(-80)
  const leftIconScale = useSharedValue(0.3)
  const leftIconOpacity = useSharedValue(0)
  const leftIconRotate = useSharedValue(-180)
  const rightIconTranslateY = useSharedValue(-80)
  const rightIconScale = useSharedValue(0.3)
  const rightIconOpacity = useSharedValue(0)
  const rightIconRotate = useSharedValue(180)
  const storyScale = useSharedValue(0)
  const storyOpacity = useSharedValue(0)

  // ✅ FIX 4: Heart animation as RNAnimated.Value — much lighter than state
  const heartOpacityAnim = useRef(new RNAnimated.Value(0)).current
  const heartScaleAnim = useRef(new RNAnimated.Value(0)).current

  // Refs
  const lastTapRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const backHandlerRef = useRef(null)
  const flatListRef = useRef(null)
  const ttsInitialized = useRef(false) // ✅ FIX 5: Prevent double init

  // State
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [allStories, setAllStories] = useState([])
  const [followedStories, setFollowedStories] = useState([])
  const [doubleTapIndex, setDoubleTapIndex] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [visibleVideoIndex, setVisibleVideoIndex] = useState(0)
  const [pausedVideos] = useState({}) // ✅ FIX 6: No setter needed, saves renders
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [tagLoading, setTagLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedTab, setSelectedTab] = useState('home')
  const [advertisements, setAdvertisements] = useState([])
  const [currentAdImageIndex, setCurrentAdImageIndex] = useState({})
  const [newsData, setNewsData] = useState([])




  let selector = useSelector(state => state?.user?.userData)
  // ✅ FIX 7: useMemo for parsed selector — don't parse on every render
  const parsedSelector = useMemo(() => {
    if (selector && Object.keys(selector).length !== 0) {
      try { return JSON.parse(selector) } catch { return {} }
    }
    return {}
  }, [selector])

  // ✅ FIX 8: Animations — run once, no repeated useEffects
  useEffect(() => {
    // FAB pulse
    fabScale.value = withRepeat(withSequence(
      withTiming(1.15, { duration: 1200 }),
      withTiming(1, { duration: 1200 })
    ), -1, false)



    fabOpacity.value = withRepeat(withSequence(
      withTiming(0.7, { duration: 1200 }),
      withTiming(1, { duration: 1200 })
    ), -1, false)

    // Header entrance
    headerScale.value = withSpring(1, { damping: 15, stiffness: 150 })
    headerOpacity.value = withTiming(1, { duration: 500 })

    // Search bar
    searchBarScale.value = withSpring(1, { damping: 12, stiffness: 100 })

    // Stories
    storyScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 100 }))
    storyOpacity.value = withDelay(200, withTiming(1, { duration: 400 }))

    // Left icon
    leftIconTranslateY.value = withSequence(
      withSpring(15, { damping: 5 }),
      withSpring(-8, { damping: 6 }),
      withSpring(0, { damping: 12 })
    )
    leftIconScale.value = withSequence(withSpring(1.1, { damping: 10 }), withSpring(1, { damping: 12 }))
    leftIconOpacity.value = withTiming(1, { duration: 400 })
    leftIconRotate.value = withSpring(0, { damping: 15, stiffness: 100 })

    // Right icon (slight delay)
    const rightTimer = setTimeout(() => {
      rightIconTranslateY.value = withSequence(
        withSpring(15, { damping: 5 }),
        withSpring(-8, { damping: 6 }),
        withSpring(0, { damping: 12 })
      )
      rightIconScale.value = withSequence(withSpring(1.1, { damping: 10 }), withSpring(1, { damping: 12 }))
      rightIconOpacity.value = withTiming(1, { duration: 400 })
      rightIconRotate.value = withSpring(0, { damping: 15, stiffness: 100 })
    }, 100)

    return () => clearTimeout(rightTimer)
  }, []) // ✅ Empty deps — runs ONCE only

  // Animated styles
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
    opacity: fabOpacity.value,
  }))

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
    opacity: headerOpacity.value,
  }))

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: searchBarScale.value },
      { translateY: searchBarTranslateY.value },
    ],
  }))

  const leftIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: leftIconTranslateY.value },
      { scale: leftIconScale.value },
      { rotate: `${leftIconRotate.value}deg` },
    ],
    opacity: leftIconOpacity.value,
  }))

  const rightIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: rightIconTranslateY.value },
      { scale: rightIconScale.value },
      { rotate: `${rightIconRotate.value}deg` },
    ],
    opacity: rightIconOpacity.value,
  }))

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y
      scrollY.value = currentScrollY

      const TOTAL_STICKY_HEIGHT = 80

      if (currentScrollY <= TOTAL_STICKY_HEIGHT) {
        searchBarTranslateY.value = -currentScrollY
        headerOpacity.value = interpolate(
          currentScrollY, [0, 100], [1, 0], Extrapolate.CLAMP
        )
      } else {
        searchBarTranslateY.value = -TOTAL_STICKY_HEIGHT
        headerOpacity.value = 0
      }

      if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
        fabOpacity.value = withTiming(0, { duration: 200 })
        fabScale.value = withTiming(0.5, { duration: 200 })
      } else {
        fabOpacity.value = withTiming(1, { duration: 200 })
        fabScale.value = withTiming(1, { duration: 200 })
      }

      lastScrollY.value = currentScrollY
    },
  })

  const mergeFeedWithAds = useCallback((posts, ads) => {
    if (!ads || ads.length === 0) {
      return posts.map(post => ({ type: 'post', data: post }))
    }
    const merged = []
    const adInterval = 3
    let adIndex = 0
    posts.forEach((post, index) => {
      merged.push({ type: 'post', data: post })
      if ((index + 1) % adInterval === 0 && adIndex < ads.length) {
        merged.push({ type: 'ad', data: ads[adIndex] })
        adIndex = (adIndex + 1) % ads.length
      }
    })
    return merged
  }, [])

  const mergedFeedData = useMemo(() => {
    let dataToMerge = []
    if (selectedTab === 'News') {
      dataToMerge = newsData
    } else {
      const filteredPosts = allPosts.filter(item => {
        const hasImage = item?.media && !item?.media.toLowerCase().includes('.mp4')
        const isTop25 = selectedTab === 'Top25' ? item?.TotalLikes > 25 : true
        return hasImage && isTop25
      })
      dataToMerge = filteredPosts
    }
    return mergeFeedWithAds(dataToMerge, advertisements)
  }, [allPosts, advertisements, selectedTab, newsData, mergeFeedWithAds])

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      LocationManager.stopLocationTracking()
      LocationManager.setLocationUpdateCallback(null)
      if (backHandlerRef.current) backHandlerRef.current.remove()
      Tts.stop() // ✅ FIX 9: Stop TTS on unmount
    }
  }, [])

  const SearchTags = useCallback(async (tag) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (!tag.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setTagLoading(true)
        const response = await apiGet(`/api/admin/SearchHashtags?query=${tag}`)
        setSuggestions(response?.data || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setTagLoading(false)
      }
    }, 400) // ✅ FIX 10: Increased debounce 300→400ms, fewer API calls
  }, [])

  // ✅ FIX 11: Heart uses RNAnimated — no state re-renders, smooth 60fps
  const triggerHeartAnimation = useCallback((index) => {
    setDoubleTapIndex(index)
    heartOpacityAnim.setValue(1)
    heartScaleAnim.setValue(0.5)

    RNAnimated.parallel([
      RNAnimated.spring(heartScaleAnim, {
        toValue: 1.5,
        useNativeDriver: true,
        friction: 4,
      }),
      RNAnimated.sequence([
        RNAnimated.delay(700),
        RNAnimated.timing(heartOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => setDoubleTapIndex(null))
  }, [heartOpacityAnim, heartScaleAnim])

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setVisibleVideoIndex(viewableItems[0].index)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60, // ✅ FIX 12: 50→60, more accurate video trigger
  }).current

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'EXIT', onPress: () => BackHandler.exitApp() },
        ])
        return true
      }
      backHandlerRef.current = BackHandler.addEventListener('hardwareBackPress', backAction)
      return () => { if (backHandlerRef.current) backHandlerRef.current.remove() }
    }, [])
  )

  // ✅ FIX 13: Single Firebase init
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // ✅ FIX 14: TTS init ONCE, no double init
  useEffect(() => {
    if (ttsInitialized.current) return
    ttsInitialized.current = true
    const initTts = async () => {
      try {
        await Tts.setDefaultLanguage('en-US')
        await Tts.setDefaultRate(0.5)
        await Tts.setDefaultPitch(1.0)
      } catch (e) {
        console.error('TTS Init:', e)
      }
    }
    initTts()
  }, [])

  // ✅ FIX 15: Greeting only on FIRST focus, not every focus
  const hasGreeted = useRef(false)
  useEffect(() => {
    if (isFocused && !hasGreeted.current) {
      hasGreeted.current = true
      setTimeout(() => {
        const userName = parsedSelector?.FullName || parsedSelector?.UserName || 'Friend'
        Tts.stop()
        Tts.speak(`Welcome ${userName} on Tomo. Happy to see you here!`)
      }, 800)
    }
  }, [isFocused, parsedSelector])

  const requestNotificationPermission = async () => {
    try {
      let hasPermission = false
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED
        } else {
          hasPermission = true
        }
      } else {
        const authStatus = await messaging().requestPermission()
        hasPermission =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
      }
      if (hasPermission) {
        try {
          if (!messaging().isDeviceRegisteredForRemoteMessages) {
            await messaging().registerDeviceForRemoteMessages()
          }
          await messaging().getToken()
        } catch (e) { console.error('FCM Token:', e) }
      }
    } catch (e) { console.error('Permission:', e) }
  }

  // Fetch functions
  const fetchAdvertisements = useCallback(async () => {
    try {
      const res = await apiGet('/api/admin/GetAllActiveAdvertisement')
      if (res?.data) {
        setAdvertisements(res.data)
        const initialIdx = {}
        res.data.forEach(ad => { initialIdx[ad._id] = 0 })
        setCurrentAdImageIndex(initialIdx)
      }
    } catch (e) { console.error('Ads fetch:', e) }
  }, [])

  const fetchNewsData = useCallback(async () => {
    try {
      const res = await apiGet('/api/admin/GetAllPublishedNews')
      if (res?.data) setNewsData(res.data)
    } catch (e) { console.error('News fetch:', e) }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const endpoint = searchText.trim()
        ? `/api/user/SearchPostsByHashtag?tag=${searchText}`
        : urls.getAllPost
      const res = await apiGet(endpoint)
      setAllPosts(res?.data || [])
    } catch (e) { console.error('Posts fetch:', e) }
    finally { setLoading(false) }
  }, [searchText])

  const getCurrentStories = useCallback(async () => {
    try {
      const res = await apiGet(urls.getCurrentStories)
      setAllStories(res?.data || [])
    } catch (e) { console.error('Stories fetch:', e) }
  }, [])

  const getFollwedStories = useCallback(async () => {
    try {
      const res = await apiGet(urls.followedUserStories)
      setFollowedStories(res?.data || [])
    } catch (e) { console.error('Followed stories fetch:', e) }
  }, [])

  const fetchCommentDataOfaPost = useCallback(async (id) => {
    try {
      const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
      return res?.data || []
    } catch (e) { console.error('Comments fetch:', e) }
  }, [])

  // ✅ FIX 16: Single initial fetch with Promise.all — parallel, faster
  useEffect(() => {
    Promise.all([
      fetchData(),
      getCurrentStories(),
      getFollwedStories(),
      fetchAdvertisements(),
      fetchNewsData(),
      initializeLocation(),
    ])
  }, []) // eslint-disable-line

  useEffect(() => {
    fetchData()
  }, [searchText]) // ✅ Only refetch when search changes

  const initializeLocation = useCallback(async () => {
    try {
      await LocationManager.initializeLocationTracking()
    } catch (e) { console.log('Location init failed:', e) }
  }, [])

  const updateLocationOnFocus = useCallback(async () => {
    try {
      await LocationManager.checkAndUpdateLocation()
    } catch (e) { console.log('Location update failed:', e) }
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getItem('token')
      try {
        if (token) {
          const getUserDetails = await apiGet(urls.userProfile)
          dispatch(setUser(JSON.stringify(getUserDetails?.data)))
        } else {
          navigation.replace('Onboarding')
        }
      } catch (e) {
        console.log('User fetch error:', e)
        navigation.replace('Onboarding')
      }
    }
    LocationManager.setLocationUpdateCallback(fetchUserData)
    LocationManager.initializeLocationTracking()
    return () => {
      LocationManager.setLocationUpdateCallback(null)
      LocationManager.stopLocationTracking()
    }
  }, [dispatch, navigation])

  useEffect(() => {
    if (isFocused) {
      updateLocationOnFocus()
      getCurrentStories()
      getFollwedStories()
    }
  }, [isFocused])

  const onRefresh = useCallback(async () => {
    await Promise.all([
      fetchData(),
      getCurrentStories(),
      getFollwedStories(),
      fetchAdvertisements(),
      fetchNewsData(),
    ])
  }, [fetchData, getCurrentStories, getFollwedStories, fetchAdvertisements, fetchNewsData])

  // Post actions — optimistic updates
  const SavePost = useCallback(async (item) => {
    const postId = item._id
    const userId = parsedSelector?._id
    setAllPosts(prev => prev.map(post => {
      if (post._id !== postId) return post
      const alreadySaved = post.SavedBy.includes(userId)
      return { ...post, SavedBy: alreadySaved ? post.SavedBy.filter(id => id !== userId) : [...post.SavedBy, userId] }
    }))
    try {
      const endPoint = item?.SavedBy?.includes(userId)
        ? `${urls.removeSavedPost}/${postId}`
        : `${urls.SavePost}/${postId}`
      await apiGet(endPoint)
    } catch (e) {
      console.log('Save Post Error:', e)
      setAllPosts(prev => prev.map(post => {
        if (post._id !== postId) return post
        const wasSaved = item.SavedBy.includes(userId)
        return { ...post, SavedBy: wasSaved ? [...post.SavedBy, userId] : post.SavedBy.filter(id => id !== userId) }
      }))
    }
  }, [parsedSelector])

  const onLikeUnlike = useCallback(async (item) => {
    const postId = item._id
    const userId = parsedSelector?._id
    setAllPosts(prev => prev.map(post => {
      if (post._id !== postId) return post
      const alreadyLiked = post.likes.includes(userId)
      return {
        ...post,
        likes: alreadyLiked ? post.likes.filter(id => id !== userId) : [...post.likes, userId],
        TotalLikes: alreadyLiked ? post.TotalLikes - 1 : post.TotalLikes + 1,
      }
    }))
    try {
      await apiGet(`${urls.likeUnlike}/${postId}`)
    } catch (e) {
      console.log('Like error:', e)
      setAllPosts(prev => prev.map(post => {
        if (post._id !== postId) return post
        const wasLiked = item.likes.includes(userId)
        return {
          ...post,
          likes: wasLiked ? [...post.likes, userId] : post.likes.filter(id => id !== userId),
          TotalLikes: wasLiked ? post.TotalLikes + 1 : post.TotalLikes - 1,
        }
      }))
    }
  }, [parsedSelector])

  const onDisLikes = useCallback(async (item) => {
    const postId = item._id
    const userId = parsedSelector?._id
    setAllPosts(prev => prev.map(post => {
      if (post._id !== postId) return post
      const alreadyDisliked = post.Unlikes.includes(userId)
      return {
        ...post,
        Unlikes: alreadyDisliked ? post.Unlikes.filter(id => id !== userId) : [...post.Unlikes, userId],
        TotalUnLikes: alreadyDisliked ? post.TotalUnLikes - 1 : post.TotalUnLikes + 1,
      }
    }))
    try {
      await apiGet(`${urls.disLikePost}/${postId}`)
    } catch (e) { console.log('Dislike error:', e) }
  }, [parsedSelector])

  const handleAdImageNext = useCallback((adId, totalImages) => {
    setCurrentAdImageIndex(prev => ({ ...prev, [adId]: (prev[adId] + 1) % totalImages }))
  }, [])

  const handleAdImagePrev = useCallback((adId, totalImages) => {
    setCurrentAdImageIndex(prev => ({ ...prev, [adId]: prev[adId] === 0 ? totalImages - 1 : prev[adId] - 1 }))
  }, [])

  const handleAdClick = useCallback((ad) => {
    if (ad.url) Linking.openURL(ad.url).catch(e => console.error('URL open:', e))
  }, [])

  const handlePostClick = useCallback((item) => {
    navigation.navigate('PostDetail', {
      post: item,
      selector: parsedSelector,
      isDarkMode,
      formatInstagramDate,
    })
  }, [navigation, parsedSelector, isDarkMode])

  // ✅ Dynamic styles — only dark mode things
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#000' : '#fff' },
    headerIconContainer: {
      width: 40, height: 40,
      justifyContent: 'center', alignItems: 'center',
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    },
    tabText: {
      fontSize: 15,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? '#666' : '#999',
    },
    tabTextActive: {
      color: isDarkMode ? '#fff' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
    },
    searchContainer: {
      paddingHorizontal: 16, paddingVertical: 12,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      position: 'relative', zIndex: 1000,
    },
    searchInputWrapperBg: { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
    searchInput: {
      flex: 1, height: 44,
      fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      paddingVertical: 10, borderRadius: 12, paddingLeft: 36,
      color: isDarkMode ? '#fff' : '#000',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    },
    suggestionsContainer: {
      marginTop: 8, borderRadius: 12,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, maxHeight: 240,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
    },
    suggestionItem: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 12, paddingHorizontal: 16, gap: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: isDarkMode ? '#333' : '#f0f0f0',
    },
    suggestionText: {
      fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#fff' : '#000',
    },
    storyBorderColor: { borderBottomColor: isDarkMode ? '#333' : '#E5E5E5' },
    storyBg: { backgroundColor: isDarkMode ? '#000' : '#fff' },
    storyImageBg: { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
    addStoryBorderColor: { borderColor: isDarkMode ? '#000' : '#fff' },
    storyTextColor: { color: isDarkMode ? '#fff' : '#000' },
    feedContainer: {
      paddingBottom: 12,
      backgroundColor: isDarkMode ? '#161C1C' : '#e4edeeff',
      margin: 10, borderRadius: 30, borderWidth: 1, marginBottom: 10,
      borderColor: isDarkMode ? '#333' : '#E0E0E0',
      paddingHorizontal: 10,
    },
    usernameColor: { color: isDarkMode ? '#fff' : '#000' },
    captionColor: { color: isDarkMode ? '#252525' : '#666' },
    emptyText: {
      fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontSize: 16,
      color: isDarkMode ? '#666' : '#999',
    },
  }), [isDarkMode])

  // ---- RENDER FUNCTIONS ----
  const renderHeader = useCallback(() => (
    <Animated.View style={[headerAnimatedStyle, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: selectedTab === 'home' ? 0 : 12 }}>
        <Animated.View style={leftIconStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate('GalleryForAddPost')}
            style={dynamicStyles.headerIconContainer}>
            <GradientIcon colors={glowColors} size={20} iconType="FontAwesome5" name="sliders-h" />
          </TouchableOpacity>
        </Animated.View>

        <View style={staticStyles.tabsContainer}>
          {['home', 'Top25', 'News'].map((tab, index) => (
            <Animated.View key={tab} entering={FadeInDown.duration(400).delay(index * 100)}>
              <TouchableOpacity style={staticStyles.tabButton} onPress={() => setSelectedTab(tab)} activeOpacity={0.7}>
                <CustomText style={[dynamicStyles.tabText, selectedTab === tab && dynamicStyles.tabTextActive]}>
                  {tab === 'home' ? 'Home' : tab}
                </CustomText>
                {selectedTab === tab && (
                  <Animated.View entering={ZoomIn.duration(300)}>
                    <LinearGradient colors={glowColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={staticStyles.tabIndicator} />
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View style={rightIconStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Activity', { bellPosition: { x: screenWidth - 32, y: 70 } })}
            style={dynamicStyles.headerIconContainer}>
            <GradientIcon colors={glowColors} size={20} iconType="FontAwesome5" name="bell" />
          </TouchableOpacity>
        </Animated.View>
      </SpaceBetweenRow>
    </Animated.View>
  ), [isDarkMode, selectedTab, navigation, headerAnimatedStyle, leftIconStyle, rightIconStyle, dynamicStyles, glowColors])

  const renderSearchBar = useCallback(() => (
    <View style={dynamicStyles.searchContainer}>
      <View style={[staticStyles.searchInputWrapper, dynamicStyles.searchInputWrapperBg]}>
        <Feather name="search" size={18} color={isDarkMode ? '#666' : '#999'} style={staticStyles.searchIcon} />
        <TextInput
          style={dynamicStyles.searchInput}
          placeholder="Search posts, hashtags..."
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text)
            SearchTags(text)
          }}
          onFocus={() => searchText && setShowSuggestions(true)}
        />
        {searchText !== '' && (
          <Animated.View entering={ZoomIn.duration(200)}>
            <TouchableOpacity
              onPress={() => { setSearchText(''); setSuggestions([]); setShowSuggestions(false) }}
              style={{ padding: 4 }}>
              <AntDesign name="closecircle" size={16} color={isDarkMode ? '#666' : '#999'} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {showSuggestions && suggestions?.length > 0 && (
        <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOut.duration(200)} style={dynamicStyles.suggestionsContainer}>
          {tagLoading ? (
            <View style={dynamicStyles.suggestionItem}>
              <Text style={[dynamicStyles.suggestionText, { color: isDarkMode ? '#666' : '#999' }]}>Loading...</Text>
            </View>
          ) : (
            suggestions.map((item, index) => (
              <Animated.View key={`suggestion-${index}`} entering={FadeInDown.duration(300).delay(index * 50)}>
                <TouchableOpacity
                  style={dynamicStyles.suggestionItem}
                  onPress={() => { setSearchText(item.Tag); setShowSuggestions(false); setSuggestions([]) }}
                  activeOpacity={0.7}>
                  <Feather name="hash" size={14} color="#4B6BFF" />
                  <Text style={dynamicStyles.suggestionText}>{item.Tag}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </Animated.View>
      )}
    </View>
  ), [isDarkMode, searchText, showSuggestions, suggestions, tagLoading, SearchTags, dynamicStyles])

  const renderStories = useCallback(() => (
    <View style={[{ borderBottomWidth: 0.5 }, dynamicStyles.storyBorderColor]}>
      <View style={[{ paddingVertical: 5 }, dynamicStyles.storyBg]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <Animated.View entering={ZoomIn.duration(400).delay(100)} style={staticStyles.storyContainer}>
            <TouchableOpacity
              style={staticStyles.yourStoryWrapper}
              onPress={() => navigation.navigate('StoryScreen', {
                storyImage: allStories, User: parsedSelector,
                allUsersStories: followedStories, initialUserIndex: -1,
              })}
              activeOpacity={0.8}>
              <LinearGradient
                colors={allStories[0]?.media ? ['#21B7FF', '#0084F8'] : ['#E5E5E5', '#E5E5E5']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={staticStyles.storyGradientBorder}>
                <View style={[staticStyles.storyImageContainer, dynamicStyles.storyImageBg]}>
                  <Image source={allStories[0]?.media ? { uri: allStories[0]?.media } : IMG.TomoLogo} style={staticStyles.storyImage} />
                </View>
              </LinearGradient>
              <TouchableOpacity style={staticStyles.addStoryButton} onPress={() => navigation.navigate('GalleryPickerScreen')} activeOpacity={0.9}>
                <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[staticStyles.addStoryGradient, dynamicStyles.addStoryBorderColor]}>
                  <AddStoryIcon />
                </LinearGradient>
              </TouchableOpacity>
            </TouchableOpacity>
            <Text style={[staticStyles.storyText, dynamicStyles.storyTextColor]} numberOfLines={1}>Your Story</Text>
          </Animated.View>

          {followedStories?.map((item, index) => {
            if (!item?.User?.Stories?.length) return null
            const key = item?._id || `story-${index}`
            return (
              <Animated.View key={key} entering={ZoomIn.duration(400).delay((index + 1) * 80)} style={staticStyles.storyContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('StoryScreen', {
                    storyImage: item.User?.Stories, User: item?.User,
                    allUsersStories: followedStories, initialUserIndex: index,
                  })}
                  activeOpacity={0.8}>
                  <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={staticStyles.storyGradientBorder}>
                    <View style={[staticStyles.storyImageContainer, dynamicStyles.storyImageBg]}>
                      <Image
                        source={item.User?.Stories?.length > 0 ? { uri: item.User?.Stories[0]?.media } : IMG.AddStoryImage}
                        style={staticStyles.storyImage}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={[staticStyles.storyText, dynamicStyles.storyTextColor]} numberOfLines={1}>{item?.User?.UserName}</Text>
              </Animated.View>
            )
          })}
        </ScrollView>
      </View>
    </View>
  ), [isDarkMode, allStories, followedStories, parsedSelector, navigation, dynamicStyles])

  const renderAdvertisement = useCallback((ad, index) => {
    const currentImageIndex = currentAdImageIndex[ad._id] || 0
    const currentMedia = ad?.media[currentImageIndex]
    const totalImages = ad?.media?.length

    return (
      <Animated.View entering={FadeInUp.duration(400).delay(index * 100)} style={dynamicStyles.feedContainer}>
        <TouchableOpacity key={`ad-${ad._id}-${index}`} onPress={() => handleAdClick(ad)} activeOpacity={0.95}>
          <View style={staticStyles.feedHeader}>
            <View style={staticStyles.feedUserInfo}>
              <View style={staticStyles.adBadgeContainer}>
                <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={staticStyles.adBadgeGradient}>
                  <CustomText style={staticStyles.adBadge}>Sponsored</CustomText>
                </LinearGradient>
              </View>
              <View style={{ marginLeft: 8 }}>
                <Text style={[staticStyles.username, dynamicStyles.usernameColor]}>{ad.name}</Text>
                <Text style={{ fontSize: 12, color: isDarkMode ? '#999' : '#666' }}>{ad.location}</Text>
              </View>
            </View>
          </View>

          <View style={staticStyles.mediaContainer}>
            {currentMedia.type === 'image' ? (
              <Image source={{ uri: currentMedia.url }} style={staticStyles.postImage} resizeMode="cover" progressiveRenderingEnabled />
            ) : (
              <Video source={{ uri: currentMedia.url }} style={staticStyles.postImage} resizeMode="cover" repeat muted={isMuted} playInBackground={false} />
            )}
            {totalImages > 1 && (
              <>
                <View style={staticStyles.adDotsContainer}>
                  {ad.media.map((_, idx) => (
                    <View key={`dot-${idx}`} style={[staticStyles.adDot, currentImageIndex === idx && staticStyles.adDotActive]} />
                  ))}
                </View>
                {currentImageIndex > 0 && (
                  <TouchableOpacity style={[staticStyles.adNavButton, staticStyles.adNavButtonLeft]} onPress={() => handleAdImagePrev(ad._id, totalImages)} activeOpacity={0.8}>
                    <AntDesign name="left" size={18} color="white" />
                  </TouchableOpacity>
                )}
                {currentImageIndex < totalImages - 1 && (
                  <TouchableOpacity style={[staticStyles.adNavButton, staticStyles.adNavButtonRight]} onPress={() => handleAdImageNext(ad._id, totalImages)} activeOpacity={0.8}>
                    <AntDesign name="right" size={18} color="white" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <TouchableOpacity style={staticStyles.adCtaContainer} activeOpacity={0.8}>
            <LinearGradient colors={['#21B7FF', '#0084F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={staticStyles.adCtaGradient}>
              <CustomText style={staticStyles.adCtaText}>Learn More →</CustomText>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    )
  }, [currentAdImageIndex, isMuted, isDarkMode, handleAdClick, handleAdImageNext, handleAdImagePrev, dynamicStyles])

  const renderItem = useCallback(({ item, index }) => {
    if (item.type === 'ad') return renderAdvertisement(item.data, index)

    const post = item.data
    const isNewsItem = selectedTab === 'News'
    const mediaUrl = post.media
    const isVideo = isNewsItem
      ? post.mediatype === 'video'
      : typeof mediaUrl === 'string' && (
        mediaUrl.includes('.mp4') || mediaUrl.includes('.mov') ||
        mediaUrl.includes('video') || mediaUrl.includes('.avi')
      )

    return (
      <Animated.View entering={FadeInUp.duration(300).delay(Math.min(index * 40, 300))}>
        {/* ✅ FIX 17: Cap delay at 300ms so late items don't have huge delays */}
        <FeedCard
          post={post}
          index={index}
          isDarkMode={isDarkMode}
          glowColors={glowColors}
          isNewsItem={isNewsItem}
          isVideo={isVideo}
          mediaUrl={mediaUrl}
          visibleVideoIndex={visibleVideoIndex}
          pausedVideos={pausedVideos}
          isMuted={isMuted}
          selector={parsedSelector}
          doubleTapIndex={doubleTapIndex}
          heartOpacity={heartOpacityAnim}   // ✅ Pass Animated.Value directly
          heartScale={heartScaleAnim}       // ✅ Pass Animated.Value directly
          formatInstagramDate={formatInstagramDate}
          onPostPress={() => !isNewsItem && handlePostClick(post)}
          onUserPress={() => {
            if (!isNewsItem) {
              navigation.navigate('OtherUserDetail', { userId: post?.User?._id })
            }
          }}
          onMediaPress={() => {
            if (isNewsItem) return
            const now = Date.now()
            if (lastTapRef.current && now - lastTapRef.current < 300) {
              triggerHeartAnimation(index)
              onLikeUnlike(post)
            } else {
              lastTapRef.current = now
              handlePostClick(post)
            }
          }}
          onLikePress={() => onLikeUnlike(post)}
          onDislikePress={() => onDisLikes(post)}
          onCommentPress={() => navigation.navigate('Comments', {
            postId: post?._id, isDarkMode, selector: parsedSelector,
          })}
          onBookmarkPress={() => SavePost(post)}
          onMuteToggle={() => setIsMuted(prev => !prev)}
        />
      </Animated.View>
    )
  }, [
    selectedTab, isDarkMode, glowColors, visibleVideoIndex, pausedVideos, isMuted,
    parsedSelector, doubleTapIndex, heartOpacityAnim, heartScaleAnim,
    renderAdvertisement, handlePostClick, triggerHeartAnimation,
    onLikeUnlike, onDisLikes, SavePost, navigation,
  ])

  const keyExtractor = useCallback((item, index) => {
    if (item.type === 'ad') return `ad-${item.data._id}-${index}`
    return `post-${item.data._id || index}`
  }, [])

  // ✅ FIX 18: Remove getItemLayout if heights vary — it causes MORE jank with wrong heights
  // If all cards are exactly same height, keep it. Otherwise remove it.
  // Commenting it out is safer for variable-height content:
  // const getItemLayout = ...

  return (
    <View style={dynamicStyles.container}>
      <StatusBar
        backgroundColor={isDarkMode ? '#000' : '#fff'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />



      {/* Header */}
      <Animated.View style={[
        { top: 0, left: 0, right: 0, zIndex: 1001, backgroundColor: isDarkMode ? '#000' : '#fff' },
        { opacity: headerOpacity }
      ]}>
        {renderHeader()}
      </Animated.View>

      {/* Search Bar + Stories */}
      {selectedTab === 'home' && (
        <Animated.View style={[
          searchBarAnimatedStyle,
          { position: 'absolute', top: 100, left: 0, right: 0, zIndex: 1000, backgroundColor: isDarkMode ? '#000' : '#fff' }
        ]}>
          {renderSearchBar()}
          {renderStories()}
        </Animated.View>
      )}

      {loading ? (
        <View style={{ flex: 1, paddingTop: 100 }}>
          <FeedShimmerLoader isDarkMode={isDarkMode} count={3} /> 
        </View>
      ) : (
        <Animated.FlatList
          ref={flatListRef}
          data={mergedFeedData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: selectedTab === 'home' ? 180 : 100 }}
          // ✅ FIX 20: Optimized FlatList config
          maxToRenderPerBatch={4}
          windowSize={7}           // Render 7 screens worth (3 above, 1 current, 3 below)
          removeClippedSubviews={true}
          initialNumToRender={4}
          updateCellsBatchingPeriod={100}
          onRefresh={onRefresh}
          refreshing={loading}
          ListEmptyComponent={
            <Animated.View entering={FadeIn.duration(400)} style={staticStyles.emptyContainer}>
              <Text style={dynamicStyles.emptyText}>No posts available</Text>
            </Animated.View>
          }
        />
      )}

      {/* FAB */}
      <Animated.View style={[staticStyles.fabContainer, fabAnimatedStyle]}>
        <TouchableOpacity onPress={() => navigation.navigate('GalleryForAddPost')} activeOpacity={0.9}>
          <AddPostBtn />
        </TouchableOpacity>
      </Animated.View>
      {<TutorialOverlay visible={true} onDone={dismissTutorial} />}
    </View>
  )
}

export default React.memo(Home)