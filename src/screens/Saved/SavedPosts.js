import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  FlatList,
  StatusBar,
  Animated,
} from 'react-native'
import CustomText from '../../components/TextComponent'
import SpaceBetweenRow from '../../components/wrapper/spacebetween'
import { useSelector } from 'react-redux'
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/Apis'
import urls from '../../config/urls'
import { FONTS_FAMILY } from '../../assets/Fonts'
import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs'
import { TouchableOpacity, View } from 'react-native'
import useLoader from '../../utils/LoaderHook'
import CommentModal from '../Home/CommentModel'
import moment from 'moment'
import FeedShimmerLoader from '../../components/Skeletons/FeedsShimmer'
import FeedCard from '../Home/FeedsCards'
import useThemeColor from '../../utils/useThemeColor'

// Matches Home.js's feed cards exactly (same FeedCard component, same glow/
// theme colors, same like/dislike/comment/bookmark behavior) — previously
// this screen had its own bespoke, differently-styled card, and its bookmark
// icon was hardcoded to the outline variant in every branch (never showed
// filled, even though every post here is, by definition, already saved).
const SavedPosts = ({ navigation }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeColor()
  const glowColors = useMemo(() => [primaryColor, secondaryColor], [primaryColor, secondaryColor])

  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const heartOpacity = useRef(new Animated.Value(0)).current
  const heartScale = useRef(new Animated.Value(0)).current
  const [doubleTapIndex, setDoubleTapIndex] = useState(null)

  const [modalVisible, setModalVisible] = useState(false)
  const [postId, setPostId] = useState(null)

  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])

  const [isMuted, setIsMuted] = useState(false)
  const loaderVisible = useSelector(state => state?.loader?.loader)
  const [visibleVideoIndex, setVisibleVideoIndex] = useState(0)
  const [pausedVideos, setPausedVideos] = useState({})

  const { showLoader, hideLoader } = useLoader()

  let selector = useSelector(state => state?.user?.userData)
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector)
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleVideoIndex(viewableItems[0].index)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const res = await apiGet(urls.getAllSavedPosts)
    setAllPosts(res?.data || [])
    setLoading(false)
  }

  const fetchCommentDataOfaPost = async id => {
    const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
    setComments(res?.data)
  }

  const sendComments = async (id, text) => {
    const data = { Post: id, text: text }
    await apiPost(`${urls.sendCommentOnPost}`, data)
    fetchCommentDataOfaPost(id)
  }

  const editComments = async (id, text) => {
    const data = { text: text }
    await apiPut(`${urls.editComment}/${id}`, data)
    fetchCommentDataOfaPost(postId)
  }

  const onDeleteComments = async id => {
    try {
      showLoader()
      await apiDelete(`/api/user/DeleteComment/${id}`)
      fetchCommentDataOfaPost(postId)
    } catch (error) {
    } finally {
      hideLoader()
    }
  }

  const SavePost = async item => {
    setLoading(true)
    const endPoint = item?.Post?.SavedBy?.includes(selector?._id)
      ? `${urls.removeSavedPost}/${item?.Post?._id}`
      : `${urls.SavePost}/${item?.Post?._id}`
    await apiGet(endPoint)
    fetchData()
    setLoading(false)
  }

  const onLikeUnlike = async item => {
    const targetPostId = item?.Post?._id
    const userId = selector?._id

    setAllPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.Post?._id === targetPostId) {
          const alreadyLiked = post.Post?.likes.includes(userId)
          const updatedLikes = alreadyLiked
            ? post.Post.likes.filter(id => id !== userId)
            : [...post.Post.likes, userId]
          const updatedTotalLikes = alreadyLiked
            ? post.Post.TotalLikes - 1
            : post.Post.TotalLikes + 1
          return {
            ...post,
            Post: { ...post.Post, likes: updatedLikes, TotalLikes: updatedTotalLikes },
          }
        }
        return post
      }),
    )

    try {
      await apiGet(`${urls.likeUnlike}/${targetPostId}`)
    } catch (error) {
      setAllPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.Post?._id === targetPostId) {
            const originallyLiked = item.Post.likes.includes(userId)
            const revertedLikes = originallyLiked
              ? [...post.Post.likes, userId]
              : post.Post.likes.filter(id => id !== userId)
            const revertedTotalLikes = originallyLiked
              ? post.Post.TotalLikes + 1
              : post.Post.TotalLikes - 1
            return {
              ...post,
              Post: { ...post.Post, likes: revertedLikes, TotalLikes: revertedTotalLikes },
            }
          }
          return post
        }),
      )
    }
  }

  const onDisLikes = async item => {
    const targetPostId = item?.Post?._id
    const userId = selector?._id

    setAllPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.Post?._id === targetPostId) {
          const alreadyDisliked = post.Post?.Unlikes?.includes(userId)
          const updatedUnlikes = alreadyDisliked
            ? post.Post.Unlikes.filter(id => id !== userId)
            : [...(post.Post.Unlikes || []), userId]
          return {
            ...post,
            Post: {
              ...post.Post,
              Unlikes: updatedUnlikes,
              TotalUnLikes: alreadyDisliked ? post.Post.TotalUnLikes - 1 : post.Post.TotalUnLikes + 1,
            },
          }
        }
        return post
      }),
    )

    try {
      await apiGet(`${urls.disLikePost}/${targetPostId}`)
    } catch (error) {
      // silently ignore — matches Home.js's dislike error handling
    }
  }

  const renderHeader = () => (
    <SpaceBetweenRow
      style={{
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: isDarkMode ? '#252525' : 'white',
        paddingBottom: 15,
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <CustomText style={{ fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>
        Saved Posts
      </CustomText>
      <View style={{ width: 24 }} />
    </SpaceBetweenRow>
  )

  const formatInstagramDate = dateString => {
    const date = moment(dateString)
    const now = moment()
    const diffInSeconds = now.diff(date, 'seconds')
    const diffInMinutes = now.diff(date, 'minutes')
    const diffInHours = now.diff(date, 'hours')
    const diffInDays = now.diff(date, 'days')
    const diffInWeeks = now.diff(date, 'weeks')

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInDays < 7) return `${diffInDays}d`
    if (diffInWeeks < 4) return `${diffInWeeks}w`
    return date.year() === now.year() ? date.format('MMM D') : date.format('MMM D, YYYY')
  }

  const triggerHeartAnimation = index => {
    setDoubleTapIndex(index)
    heartOpacity.setValue(0)
    heartScale.setValue(0)

    Animated.parallel([
      Animated.sequence([
        Animated.timing(heartOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(heartOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1.2, duration: 300, useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start()
  }

  const lastTapRef = useRef(null)
  const handleDoubleTap = (item, index) => {
    const now = Date.now()
    const DOUBLE_PRESS_DELAY = 300
    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      triggerHeartAnimation(index)
      onLikeUnlike(item)
    } else {
      lastTapRef.current = now
    }
  }

  const handlePostClick = useCallback((post) => {
    navigation.navigate('PostDetail', {
      post,
      selector,
      isDarkMode,
      formatInstagramDate,
    })
  }, [navigation, selector, isDarkMode])

  const keyExtractor = useCallback((item) => item._id, [])

  const renderItem = useCallback(({ item, index }) => {
    const post = item?.Post
    const mediaUrl = post?.media
    const isVideo = typeof mediaUrl === 'string' && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov'))

    return (
      <FeedCard
        post={post}
        index={index}
        isDarkMode={isDarkMode}
        glowColors={glowColors}
        isVideo={isVideo}
        mediaUrl={mediaUrl}
        visibleVideoIndex={visibleVideoIndex}
        pausedVideos={pausedVideos}
        isMuted={isMuted}
        selector={selector}
        doubleTapIndex={doubleTapIndex}
        heartOpacity={heartOpacity}
        heartScale={heartScale}
        formatInstagramDate={formatInstagramDate}
        onPostPress={() => handlePostClick(post)}
        onUserPress={() => navigation.navigate('OtherUserDetail', { userId: post?.User?._id })}
        onMediaPress={() => handleDoubleTap(item, index)}
        onLikePress={() => onLikeUnlike(item)}
        onDislikePress={() => onDisLikes(item)}
        onCommentPress={() => {
          setModalVisible(true)
          fetchCommentDataOfaPost(post?._id)
          setPostId(post?._id)
        }}
        onBookmarkPress={() => SavePost(item)}
        onMuteToggle={() => setIsMuted(!isMuted)}
      />
    )
  }, [isDarkMode, glowColors, visibleVideoIndex, pausedVideos, isMuted, selector, doubleTapIndex, handlePostClick, navigation])

  const renderFeeds = () => (
    <FlatList
      data={allPosts}
      style={{ marginBottom: 30 }}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      renderItem={renderItem}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      initialNumToRender={3}
      ListEmptyComponent={
        !loaderVisible && (
          <CustomText
            style={{
              color: isDarkMode ? 'white' : 'black',
              alignSelf: 'center',
              marginTop: 50,
              fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            }}>
            No Post Found!
          </CustomText>
        )
      }
    />
  )

  const renderCommentModal = () => (
    <CommentModal
      isVisible={modalVisible}
      onClose={() => setModalVisible(false)}
      onBackButtonPress={() => setModalVisible(false)}
      comments={comments}
      isDarkMode={isDarkMode}
      commentText={commentText}
      onChangeText={setCommentText}
      onSendPress={() => {
        sendComments(postId, commentText)
        setCommentText('')
      }}
      onDeleteComments={id => onDeleteComments(id)}
      onEditComment={(id, text) => editComments(id, text)}
    />
  )

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}>
      <StatusBar
        translucent={true}
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {renderHeader()}
      {loading ? (
        <FeedShimmerLoader isDarkMode={isDarkMode} count={5} />
      ) : (
        renderFeeds()
      )}
      {renderCommentModal()}
    </View>
  )
}

export default SavedPosts
