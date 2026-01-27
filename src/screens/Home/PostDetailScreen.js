// // PostDetailScreen.js - New file banao
// import React, { useState, useRef, useEffect } from 'react'
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Dimensions,
//   StatusBar,
//   TextInput,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
// } from 'react-native'
// import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import Video from 'react-native-video'
// import IMG from '../../assets/Images'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import GradientIcon from '../../components/GradientIcon'
// import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/Apis'
// import urls from '../../config/urls'
// import useLoader from '../../utils/LoaderHook'

// const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

// const PostDetailScreen = ({ route, navigation }) => {
//   const { post: initialPost, selector, isDarkMode, formatInstagramDate } = route.params
  
//   const [post, setPost] = useState(initialPost)
//   const [comment, setComment] = useState('')
//   const [comments, setComments] = useState([])
//   const [isMuted, setIsMuted] = useState(true)
//   const [imageModalVisible, setImageModalVisible] = useState(false)
//   const scrollViewRef = useRef(null)
//   const { showLoader, hideLoader } = useLoader()

//   console.log('Post::::::::::::::::::::::::::::::::::::>>>>>>>', JSON.stringify(post));
  

//   useEffect(() => {
//     if (post?._id) {
//       fetchComments(post._id)
//     }
//   }, [post?._id])

//   const fetchComments = async (postId) => {
//     try {
//       const res = await apiGet(`${urls.getAllCommentofaPost}/${postId}`)
//       setComments(res?.data || [])
//     } catch (error) {
//       console.error('Error fetching comments:', error)
//     }
//   }

//   const handleAddComment = async () => {
//     if (comment.trim() && post?._id) {
//       try {
//         const data = { Post: post._id, text: comment.trim() }
//         await apiPost(urls.sendCommentOnPost, data)
//         setComment('')
//         fetchComments(post._id)
//       } catch (error) {
//         console.error('Error adding comment:', error)
//       }
//     }
//   }

//   const handleLikeUnlike = async () => {
//     const postId = post._id
//     const userId = selector?._id
    
//     setPost(prevPost => {
//       if (!prevPost) return prevPost

//       const alreadyLiked = prevPost.likes.includes(userId)
//       const updatedLikes = alreadyLiked
//         ? prevPost.likes.filter(id => id !== userId)
//         : [...prevPost.likes, userId]

//       return {
//         ...prevPost,
//         likes: updatedLikes,
//         TotalLikes: alreadyLiked
//           ? prevPost.TotalLikes - 1
//           : prevPost.TotalLikes + 1,
//       }
//     })

//     try {
//       await apiGet(`${urls.likeUnlike}/${postId}`)
//     } catch (error) {
//       console.log('Error in like/unlike', error)
//     }
//   }

//   const handleDislike = async () => {
//     const postId = post._id
//     const userId = selector?._id
    
//     setPost(prevPost => {
//       if (!prevPost) return prevPost

//       const alreadyDisliked = prevPost.Unlikes.includes(userId)
//       const updatedUnlikes = alreadyDisliked
//         ? prevPost.Unlikes.filter(id => id !== userId)
//         : [...prevPost.Unlikes, userId]

//       return {
//         ...prevPost,
//         Unlikes: updatedUnlikes,
//         TotalUnLikes: alreadyDisliked
//           ? prevPost.TotalUnLikes - 1
//           : prevPost.TotalUnLikes + 1,
//       }
//     })

//     try {
//       await apiGet(`${urls.disLikePost}/${postId}`)
//     } catch (error) {
//       console.log('Error in dislike', error)
//     }
//   }

//   const handleInputFocus = () => {
//     setTimeout(() => {
//       scrollViewRef.current?.scrollToEnd({ animated: true })
//     }, 100)
//   }

//   if (!post) {
//     navigation.goBack()
//     return null
//   }

//   const mediaUrl = post?.media
//   const isVideo =
//     typeof mediaUrl === 'string' &&
//     (mediaUrl.includes('.mp4') ||
//       mediaUrl.includes('.mov') ||
//       mediaUrl.includes('video') ||
//       mediaUrl.includes('.avi'))

//   const renderComment = ({ item, index }) => (
//     <Animated.View
//       entering={FadeInUp.delay(index * 50).duration(300)}
//       style={[
//         styles.commentItem,
//         { borderBottomColor: isDarkMode ? '#333' : '#eee' },
//       ]}>
//       <Image
//         source={
//           item?.User?.Image ? { uri: item?.User?.Image } : IMG.ProfileImagePost
//         }
//         style={styles.commentProfileImage}
//       />
//       <View style={styles.commentContent}>
//         <View style={styles.commentHeader}>
//           <Text
//             style={[
//               styles.commentUsername,
//               { color: isDarkMode ? 'white' : 'black' },
//             ]}>
//             {item?.User?.UserName || 'User'}
//           </Text>
//           <Text
//             style={[styles.commentTime, { color: isDarkMode ? '#888' : '#666' }]}>
//             {formatInstagramDate(item?.createdAt)}
//           </Text>
//         </View>
//         <Text
//           style={[styles.commentText, { color: isDarkMode ? '#ddd' : '#333' }]}>
//           {item?.text || item?.comment || ''}
//         </Text>
//       </View>
//       <TouchableOpacity style={styles.commentLikeBtn}>
//         <MaterialIcons
//           name='favorite-border'
//           size={16}
//           color={isDarkMode ? '#888' : '#666'}
//         />
//       </TouchableOpacity>
//     </Animated.View>
//   )

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#000000' : '#ffffff',
//     },
//     header: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//       paddingTop: 50,
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#333' : '#eee',
//     },
//     closeButton: {
//       padding: 4,
//     },
//     headerTitle: {
//       fontSize: 18,
//       fontWeight: '600',
//       color: isDarkMode ? 'white' : 'black',
//     },
//     moreButton: {
//       padding: 4,
//     },
//     keyboardContainer: {
//       flex: 1,
//     },
//     scrollContainer: {
//       flex: 1,
//     },
//     userSection: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//     },
//     userAvatar: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//     },
//     userInfo: {
//       marginLeft: 12,
//       flexDirection: 'row',
//       gap: 10
//     },
//     userName: {
//       fontSize: 16,
//       fontWeight: '600',
//       color: isDarkMode ? 'white' : 'black',
//     },
//     postTime: {
//       fontSize: 12,
//       marginTop: 2,
//       color: isDarkMode ? '#888' : '#666',
//     },
//     mediaContainer: {
//       marginVertical: 0,
//     },
//     videoWrapper: {
//       position: 'relative',
//     },
//     media: {
//       width: screenWidth,
//       height: 300,
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//     },
//     soundButton: {
//       position: 'absolute',
//       top: 12,
//       right: 12,
//       backgroundColor: 'rgba(0,0,0,0.6)',
//       borderRadius: 20,
//       padding: 8,
//     },
//     captionSection: {
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//     },
//     caption: {
//       fontSize: 14,
//       lineHeight: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       color: isDarkMode ? '#ddd' : '#333',
//     },
//     actionsSection: {
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//     },
//     actionRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 16,
//     },
//     actionButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 6,
//       borderWidth: 0.5,
//       borderRadius: 18,
//       paddingHorizontal: 12,
//       paddingVertical: 6,
//       borderColor: isDarkMode ? '#333' : '#ddd',
//     },
//     actionText: {
//       fontSize: 14,
//       fontWeight: '500',
//       color: isDarkMode ? 'white' : 'black',
//     },
//     commentsSection: {
//       paddingHorizontal: 16,
//       paddingTop: 16,
//       paddingBottom: 16,
//     },
//     commentsTitle: {
//       fontSize: 16,
//       fontWeight: '600',
//       marginBottom: 12,
//       color: isDarkMode ? 'white' : 'black',
//     },
//     commentItem: {
//       flexDirection: 'row',
//       paddingVertical: 12,
//       borderBottomWidth: 1,
//     },
//     commentProfileImage: {
//       width: 32,
//       height: 32,
//       borderRadius: 16,
//     },
//     commentContent: {
//       flex: 1,
//       marginLeft: 12,
//     },
//     commentHeader: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 8,
//       marginBottom: 4,
//     },
//     commentUsername: {
//       fontSize: 14,
//       fontWeight: '600',
//     },
//     commentTime: {
//       fontSize: 12,
//     },
//     commentText: {
//       fontSize: 14,
//       lineHeight: 18,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     commentLikeBtn: {
//       paddingLeft: 8,
//     },
//     commentInputContainer: {
//       flexDirection: 'row',
//       alignItems: 'flex-end',
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//       borderTopWidth: 1,
//       borderTopColor: isDarkMode ? '#333' : '#eee',
//       backgroundColor: isDarkMode ? '#000000' : 'white',
//       gap: 12,
//     },
//     inputProfileImage: {
//       width: 32,
//       height: 32,
//       borderRadius: 16,
//     },
//     commentInput: {
//       flex: 1,
//       borderRadius: 20,
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//       maxHeight: 80,
//       fontSize: 14,
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//       color: isDarkMode ? 'white' : 'black',
//     },
//     sendButton: {
//       borderRadius: 20,
//       padding: 8,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//   })

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />
      
//       {/* Header */}
//       <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.closeButton}>
//           <MaterialIcons
//             name='arrow-back'
//             size={24}
//             color={isDarkMode ? 'white' : 'black'}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Post</Text>
//         <TouchableOpacity style={styles.moreButton}>
//           <MaterialIcons
//             name='more-vert'
//             size={24}
//             color={isDarkMode ? 'white' : 'black'}
//           />
//         </TouchableOpacity>
//       </Animated.View>

//       <KeyboardAvoidingView
//         style={styles.keyboardContainer}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={0}>

//         <ScrollView
//           ref={scrollViewRef}
//           style={styles.scrollContainer}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 20 }}>

//           {/* User Info */}
//           <Animated.View entering={FadeIn.delay(100)} style={styles.userSection}>
//             <Image
//               source={
//                 post?.User?.Image
//                   ? { uri: post?.User?.Image }
//                   : IMG.ProfileImagePost
//               }
//               style={styles.userAvatar}
//             />
//             <View style={styles.userInfo}>
//               <Text style={styles.userName}>{post?.User?.UserName}</Text>
//               <Text style={styles.postTime}>
//                 {formatInstagramDate(post?.createdAt)}
//               </Text>
//             </View>
//           </Animated.View>

//           {/* Media */}
//           <View style={styles.mediaContainer}>
//             {isVideo ? (
//               <View style={styles.videoWrapper}>
//                 <Video
//                   source={{ uri: mediaUrl }}
//                   style={styles.media}
//                   resizeMode='cover'
//                   repeat={true}
//                   muted={isMuted}
//                   paused={false}
//                 />
//                 <TouchableOpacity
//                   style={styles.soundButton}
//                   onPress={() => setIsMuted(!isMuted)}>
//                   {isMuted ? (
//                     <MaterialIcons name='volume-off' size={20} color='white' />
//                   ) : (
//                     <MaterialIcons name='volume-up' size={20} color='white' />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <Image
//                 source={{ uri: mediaUrl }}
//                 style={styles.media}
//                 resizeMode='cover'
//               />
//             )}
//           </View>

//           {/* Caption */}
//           <View style={styles.captionSection}>
//             <Text style={styles.caption}>
//               {post?.caption || 'No Caption Added'}
//             </Text>
//           </View>

//           {/* Actions */}
//           <View style={styles.actionsSection}>
//             <View style={styles.actionRow}>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={handleLikeUnlike}>
//                 {post?.likes?.includes(selector?._id) ? (
//                   <GradientIcon
//                     colors={['#21B7FF', '#0084F8']}
//                     size={18}
//                     iconType='Ionicons'
//                     name={'triangle'}
//                   />
//                 ) : (
//                   <GradientIcon
//                     colors={['#21B7FF', '#0084F8']}
//                     size={18}
//                     iconType='Feather'
//                     name={'triangle'}
//                   />
//                 )}
//                 <Text style={styles.actionText}>{post?.TotalLikes || 0}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={handleDislike}>
//                 <GradientIcon
//                   colors={['#21B7FF', '#0084F8']}
//                   size={18}
//                   iconType='Feather'
//                   name={'triangle'}
//                   style={{ transform: [{ rotate: '180deg' }] }}
//                 />
//                 <Text style={styles.actionText}>{post?.TotalUnLikes || 0}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.actionButton}>
//                 <GradientIcon
//                   colors={['#21B7FF', '#0084F8']}
//                   size={18}
//                   iconType='FontAwesome'
//                   name={'comment-o'}
//                 />
//                 <Text style={styles.actionText}>{comments.length}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Comments Section */}
//           <View style={styles.commentsSection}>
//             <Text style={styles.commentsTitle}>
//               Comments ({comments.length})
//             </Text>

//             <FlatList
//               data={comments}
//               keyExtractor={(item, index) => item._id || index.toString()}
//               renderItem={renderComment}
//               scrollEnabled={false}
//               removeClippedSubviews={false}
//               ListEmptyComponent={
//                 <Text
//                   style={[
//                     styles.commentText,
//                     { textAlign: 'center', marginTop: 20, color: isDarkMode ? '#666' : '#999' },
//                   ]}>
//                   No Comments Yet!
//                 </Text>
//               }
//             />
//           </View>
//         </ScrollView>

//         {/* Comment Input */}
//         <View style={styles.commentInputContainer}>
//           <Image
//             source={
//               selector?.Image
//                 ? { uri: selector?.Image }
//                 : IMG.ProfileImagePost
//             }
//             style={styles.inputProfileImage}
//           />
//           <TextInput
//             style={styles.commentInput}
//             placeholder='Add a comment...'
//             placeholderTextColor={isDarkMode ? '#888' : '#666'}
//             value={comment}
//             onChangeText={setComment}
//             onFocus={handleInputFocus}
//             multiline
//           />
//           <TouchableOpacity
//             onPress={handleAddComment}
//             style={[
//               styles.sendButton,
//               {
//                 backgroundColor: comment.trim()
//                   ? '#007AFF'
//                   : isDarkMode
//                     ? '#333'
//                     : '#ddd',
//               },
//             ]}
//             disabled={!comment.trim()}>
//             <MaterialIcons
//               name='send'
//               size={18}
//               color={
//                 comment.trim() ? 'white' : isDarkMode ? '#666' : '#999'
//               }
//             />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   )
// }

// export default PostDetailScreen



// PostDetailScreen.js - Updated with Report Menu
import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Video from 'react-native-video'
import IMG from '../../assets/Images'
import { FONTS_FAMILY } from '../../assets/Fonts'
import GradientIcon from '../../components/GradientIcon'
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/Apis'
import urls from '../../config/urls'
import useLoader from '../../utils/LoaderHook'

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

const PostDetailScreen = ({ route, navigation }) => {
  const { post: initialPost, selector, isDarkMode, formatInstagramDate } = route.params
  
  const [post, setPost] = useState(initialPost)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isMuted, setIsMuted] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const scrollViewRef = useRef(null)
  const { showLoader, hideLoader } = useLoader()

  // ✅ CHECK IF POST IS MINE
  const isMyPost = post?.User?._id === selector?._id

  console.log('✅ Post User ID:', post?.User?._id)
  console.log('✅ Selector ID:', selector?._id)
  console.log('✅ Is My Post?', isMyPost)

  useEffect(() => {
    if (post?._id) {
      fetchComments(post._id)
    }
  }, [post?._id])

  const fetchComments = async (postId) => {
    try {
      const res = await apiGet(`${urls.getAllCommentofaPost}/${postId}`)
      setComments(res?.data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleAddComment = async () => {
    if (comment.trim() && post?._id) {
      try {
        const data = { Post: post._id, text: comment.trim() }
        await apiPost(urls.sendCommentOnPost, data)
        setComment('')
        fetchComments(post._id)
      } catch (error) {
        console.error('Error adding comment:', error)
      }
    }
  }

  const handleLikeUnlike = async () => {
    const postId = post._id
    const userId = selector?._id
    
    setPost(prevPost => {
      if (!prevPost) return prevPost

      const alreadyLiked = prevPost.likes.includes(userId)
      const updatedLikes = alreadyLiked
        ? prevPost.likes.filter(id => id !== userId)
        : [...prevPost.likes, userId]

      return {
        ...prevPost,
        likes: updatedLikes,
        TotalLikes: alreadyLiked
          ? prevPost.TotalLikes - 1
          : prevPost.TotalLikes + 1,
      }
    })

    try {
      await apiGet(`${urls.likeUnlike}/${postId}`)
    } catch (error) {
      console.log('Error in like/unlike', error)
    }
  }

  const handleDislike = async () => {
    const postId = post._id
    const userId = selector?._id
    
    setPost(prevPost => {
      if (!prevPost) return prevPost

      const alreadyDisliked = prevPost.Unlikes.includes(userId)
      const updatedUnlikes = alreadyDisliked
        ? prevPost.Unlikes.filter(id => id !== userId)
        : [...prevPost.Unlikes, userId]

      return {
        ...prevPost,
        Unlikes: updatedUnlikes,
        TotalUnLikes: alreadyDisliked
          ? prevPost.TotalUnLikes - 1
          : prevPost.TotalUnLikes + 1,
      }
    })

    try {
      await apiGet(`${urls.disLikePost}/${postId}`)
    } catch (error) {
      console.log('Error in dislike', error)
    }
  }

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  // ✅ REPORT POST FUNCTION
  const handleReport = () => {
    setShowReportModal(false)
    // TODO: Navigate to Report Screen
    navigation.navigate('ReportScreen', {
      postId: post._id,
      postUserId: post?.User?._id,
      postType: 'post'
    })
  }

  if (!post) {
    navigation.goBack()
    return null
  }

  const mediaUrl = post?.media
  const isVideo =
    typeof mediaUrl === 'string' &&
    (mediaUrl.includes('.mp4') ||
      mediaUrl.includes('.mov') ||
      mediaUrl.includes('video') ||
      mediaUrl.includes('.avi'))

  const renderComment = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 50).duration(300)}
      style={[
        styles.commentItem,
        { borderBottomColor: isDarkMode ? '#333' : '#eee' },
      ]}>
      <Image
        source={
          item?.User?.Image ? { uri: item?.User?.Image } : IMG.ProfileImagePost
        }
        style={styles.commentProfileImage}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text
            style={[
              styles.commentUsername,
              { color: isDarkMode ? 'white' : 'black' },
            ]}>
            {item?.User?.UserName || 'User'}
          </Text>
          <Text
            style={[styles.commentTime, { color: isDarkMode ? '#888' : '#666' }]}>
            {formatInstagramDate(item?.createdAt)}
          </Text>
        </View>
        <Text
          style={[styles.commentText, { color: isDarkMode ? '#ddd' : '#333' }]}>
          {item?.text || item?.comment || ''}
        </Text>
      </View>
      <TouchableOpacity style={styles.commentLikeBtn}>
        <MaterialIcons
          name='favorite-border'
          size={16}
          color={isDarkMode ? '#888' : '#666'}
        />
      </TouchableOpacity>
    </Animated.View>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingTop: 50,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#eee',
    },
    closeButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? 'white' : 'black',
    },
    moreButton: {
      padding: 4,
    },
    keyboardContainer: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    userInfo: {
      marginLeft: 12,
      flexDirection: 'row',
      gap: 10
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? 'white' : 'black',
    },
    postTime: {
      fontSize: 12,
      marginTop: 2,
      color: isDarkMode ? '#888' : '#666',
    },
    mediaContainer: {
      marginVertical: 0,
    },
    videoWrapper: {
      position: 'relative',
    },
    media: {
      width: screenWidth,
      height: 300,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    },
    soundButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 20,
      padding: 8,
    },
    captionSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#ddd' : '#333',
    },
    actionsSection: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 0.5,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderColor: isDarkMode ? '#333' : '#ddd',
    },
    actionText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDarkMode ? 'white' : 'black',
    },
    commentsSection: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
    },
    commentsTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      color: isDarkMode ? 'white' : 'black',
    },
    commentItem: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    commentProfileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    commentContent: {
      flex: 1,
      marginLeft: 12,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    commentUsername: {
      fontSize: 14,
      fontWeight: '600',
    },
    commentTime: {
      fontSize: 12,
    },
    commentText: {
      fontSize: 14,
      lineHeight: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    commentLikeBtn: {
      paddingLeft: 8,
    },
    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#eee',
      backgroundColor: isDarkMode ? '#000000' : 'white',
      gap: 12,
    },
    inputProfileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    commentInput: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      maxHeight: 80,
      fontSize: 14,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
      color: isDarkMode ? 'white' : 'black',
    },
    sendButton: {
      borderRadius: 20,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // ✅ Report Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    reportModalContainer: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30,
    },
    reportModalHeader: {
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#eee',
    },
    reportModalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    reportOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 16,
    },
    reportOptionText: {
      fontSize: 15,
      color: isDarkMode ? '#fff' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    },
    cancelButton: {
      marginHorizontal: 16,
      marginTop: 8,
      paddingVertical: 14,
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5',
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
  })

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          <MaterialIcons
            name='arrow-back'
            size={24}
            color={isDarkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        
        {/* ✅ CONDITIONAL MENU ICON - Only show if NOT my post */}
        {!isMyPost ? (
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowReportModal(true)}
          >
            <MaterialIcons
              name='more-vert'
              size={24}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>

          {/* User Info */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.userSection}>
            <Image
              source={
                post?.User?.Image
                  ? { uri: post?.User?.Image }
                  : IMG.ProfileImagePost
              }
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{post?.User?.UserName}</Text>
              <Text style={styles.postTime}>
                {formatInstagramDate(post?.createdAt)}
              </Text>
            </View>
          </Animated.View>

          {/* Media */}
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <View style={styles.videoWrapper}>
                <Video
                  source={{ uri: mediaUrl }}
                  style={styles.media}
                  resizeMode='cover'
                  repeat={true}
                  muted={isMuted}
                  paused={false}
                />
                <TouchableOpacity
                  style={styles.soundButton}
                  onPress={() => setIsMuted(!isMuted)}>
                  {isMuted ? (
                    <MaterialIcons name='volume-off' size={20} color='white' />
                  ) : (
                    <MaterialIcons name='volume-up' size={20} color='white' />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <Image
                source={{ uri: mediaUrl }}
                style={styles.media}
                resizeMode='cover'
              />
            )}
          </View>

          {/* Caption */}
          <View style={styles.captionSection}>
            <Text style={styles.caption}>
              {post?.caption || 'No Caption Added'}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLikeUnlike}>
                {post?.likes?.includes(selector?._id) ? (
                  <GradientIcon
                    colors={['#21B7FF', '#0084F8']}
                    size={18}
                    iconType='Ionicons'
                    name={'triangle'}
                  />
                ) : (
                  <GradientIcon
                    colors={['#21B7FF', '#0084F8']}
                    size={18}
                    iconType='Feather'
                    name={'triangle'}
                  />
                )}
                <Text style={styles.actionText}>{post?.TotalLikes || 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDislike}>
                <GradientIcon
                  colors={['#21B7FF', '#0084F8']}
                  size={18}
                  iconType='Feather'
                  name={'triangle'}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
                <Text style={styles.actionText}>{post?.TotalUnLikes || 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <GradientIcon
                  colors={['#21B7FF', '#0084F8']}
                  size={18}
                  iconType='FontAwesome'
                  name={'comment-o'}
                />
                <Text style={styles.actionText}>{comments.length}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comments ({comments.length})
            </Text>

            <FlatList
              data={comments}
              keyExtractor={(item, index) => item._id || index.toString()}
              renderItem={renderComment}
              scrollEnabled={false}
              removeClippedSubviews={false}
              ListEmptyComponent={
                <Text
                  style={[
                    styles.commentText,
                    { textAlign: 'center', marginTop: 20, color: isDarkMode ? '#666' : '#999' },
                  ]}>
                  No Comments Yet!
                </Text>
              }
            />
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <Image
            source={
              selector?.Image
                ? { uri: selector?.Image }
                : IMG.ProfileImagePost
            }
            style={styles.inputProfileImage}
          />
          <TextInput
            style={styles.commentInput}
            placeholder='Add a comment...'
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
            value={comment}
            onChangeText={setComment}
            onFocus={handleInputFocus}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            style={[
              styles.sendButton,
              {
                backgroundColor: comment.trim()
                  ? '#007AFF'
                  : isDarkMode
                    ? '#333'
                    : '#ddd',
              },
            ]}
            disabled={!comment.trim()}>
            <MaterialIcons
              name='send'
              size={18}
              color={
                comment.trim() ? 'white' : isDarkMode ? '#666' : '#999'
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ✅ REPORT MODAL */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowReportModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowReportModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                entering={SlideInDown.duration(300)}
                style={styles.reportModalContainer}
              >
                <View style={styles.reportModalHeader}>
                  <Text style={styles.reportModalTitle}>Report Post</Text>
                </View>

                <TouchableOpacity 
                  style={styles.reportOption}
                  onPress={handleReport}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="report" 
                    size={24} 
                    color={isDarkMode ? '#fff' : '#000'} 
                  />
                  <Text style={styles.reportOptionText}>
                    Report this post
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowReportModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default PostDetailScreen