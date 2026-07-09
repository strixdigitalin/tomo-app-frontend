


// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Animated,
//   StyleSheet,
//   Dimensions
// } from 'react-native';
// import Video from 'react-native-video';
// import GradientIcon from '../../components/GradientIcon';
// import { SpeakerOff } from '../../assets/SVGs';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { useSelector } from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import IMG from '../../assets/Images';
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
// import { THEMES } from '../../redux/reducer/theme';

// const { width: screenWidth } = Dimensions.get('window');

// const FeedCard = ({
//   post,
//   index,
//   isNewsItem,
//   isVideo,
//   mediaUrl,
//   visibleVideoIndex,
//   pausedVideos,
//   isMuted,
//   selector,
//   doubleTapIndex,
//   heartOpacity,
//   heartScale,
  
//   onPostPress,
//   onUserPress,
//   onMediaPress,
//   onLikePress,
//   onDislikePress,
//   onCommentPress,
//   onBookmarkPress,
//   onMuteToggle,
//   formatInstagramDate
// }) => {
//   // const { isDarkMode } = useSelector(state => state.theme);

//    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme)
      
//       // ✅ GET CURRENT THEME COLORS
//       const currentTheme = THEMES[selectedColorTheme] || THEMES.default
//       const primaryColor = currentTheme.primary
//       const secondaryColor = currentTheme.secondary
  
//           const glowColors = [primaryColor, secondaryColor];

//   const styles = StyleSheet.create({
//     feedContainer: {
//       paddingBottom: 12,
//       backgroundColor: isDarkMode ? 'rgba(22, 28, 28, 0.8)' : 'rgba(228, 237, 238, 0.8)',
//       borderRadius: 30,
//       paddingHorizontal: 10,
//       position: 'relative',
//       overflow: 'hidden',
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
//   });

//   return (
//     <GlowWrapper
//       isDarkMode={isDarkMode}
//       borderRadius={30}
//       showStars={true}
//       starCount={100}
//       showShinePatches={true}
//       intensity="low"
//       glowColors={glowColors}
//       containerStyle={{
//         margin: 10,
//       }}
//     >
//       <TouchableOpacity
//         style={styles.feedContainer}
//         onPress={onPostPress}
//         activeOpacity={0.98}
//       >
//         {/* Header */}
//         <View style={styles.feedHeader}>
//           <View style={styles.feedUserInfo}>
//             <View style={styles.profileImageWrapper}>
//               <Image
//                 source={
//                   isNewsItem
//                     ? IMG.MessageProfile
//                     : post?.User?.Image
//                       ? { uri: post?.User?.Image }
//                       : IMG.MessageProfile
//                 }
//                 style={styles.profileImage}
//               />
//             </View>
            
//             <TouchableOpacity
//               onPress={onUserPress}
//               style={{ flex: 1 }}
//               activeOpacity={0.7}
//             >
//               <View style={styles.userNameRow}>
//                 <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>
//                   {isNewsItem ? post?.title : post?.User?.UserName}
//                 </Text>
//                 {!isNewsItem && (
//                   <Text style={styles.timeText}>
//                     • {formatInstagramDate(post?.createdAt)}
//                   </Text>
//                 )}
//               </View>
//               <Text 
//                 style={[styles.caption, { color: isDarkMode ? '#ccc' : '#666' }]} 
//                 numberOfLines={2}
//               >
//                 {isNewsItem
//                   ? post?.description?.replace(/<[^>]*>/g, '')
//                   : post?.caption}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Post Media */}
//         <TouchableWithoutFeedback onPress={onMediaPress}>
//           <View style={styles.mediaContainer}>
//             {isVideo ? (
//               <View style={styles.videoContainer}>
//                 <Video
//                   source={{ uri: mediaUrl }}
//                   style={styles.postImage}
//                   resizeMode='cover'
//                   repeat={true}
//                   muted={isMuted}
//                   paused={visibleVideoIndex !== index || pausedVideos[index]}
//                 />
//               </View>
//             ) : (
//               <Image
//                 source={{ uri: mediaUrl }}
//                 style={styles.postImage}
//                 resizeMode='cover'
//               />
//             )}

//             {/* Bottom Actions Bar */}
//             <View style={{
//               height: 40,
//               width: '100%',
//               backgroundColor: 'rgba(0, 0, 0, 0.2)',
//               position: 'absolute',
//               bottom: 0,
//               justifyContent: 'center',
//               borderBottomLeftRadius: 20,
//               borderBottomRightRadius: 20
//             }}>
//               {!isNewsItem && (
//                 <View style={styles.actions}>
//                   <View style={styles.leftActions}>
//                     {/* Like Button */}
//                     <TouchableOpacity 
//                       style={styles.actionButton}
//                       onPress={(e) => {
//                         e.stopPropagation();
//                         onLikePress();
//                       }}
//                       activeOpacity={0.7}
//                     >
//                       {post?.likes?.includes(selector?._id) ? (
//                         <GradientIcon
//                           // colors={['#21B7FF', '#0084F8']}
//                           colors={glowColors}

//                           size={20}
//                           iconType='Ionicons'
//                           name={'triangle'}
//                         />
//                       ) : (
//                         <GradientIcon
//                           colors={['#999', '#999']}
//                           size={16}
//                           iconType='Feather'
//                           name={'triangle'}
//                         />
//                       )}
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalLikes}
//                       </Text>
//                     </TouchableOpacity>

//                     {/* Dislike Button */}
//                     <TouchableOpacity 
//                       style={styles.actionButton}
//                       onPress={(e) => {
//                         e.stopPropagation();
//                         onDislikePress();
//                       }}
//                       activeOpacity={0.7}
//                     >
//                       <GradientIcon
//                         colors={post?.Unlikes?.includes(selector?._id) 
//                           ?
//                           //  ['#21B7FF', '#0084F8']
//                           glowColors
//                           : ['#999', '#999']}
//                         size={16}
//                         iconType='Feather'
//                         name={'triangle'}
//                         style={{ transform: [{ rotate: '180deg' }] }}
//                       />
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalUnLikes}
//                       </Text>
//                     </TouchableOpacity>

//                     {/* Comment Button */}
//                     <TouchableOpacity 
//                       style={styles.actionButton}
//                       onPress={(e) => {
//                         e.stopPropagation();
//                         onCommentPress();
//                       }}
//                       activeOpacity={0.7}
//                     >
//                       <GradientIcon
//                         // colors={['#21B7FF', '#0084F8']}
//                         colors={glowColors}

//                         size={16}
//                         iconType='FontAwesome'
//                         name={'comment-o'}
//                       />
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalComents}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Bookmark Button */}
//                   <TouchableOpacity 
//                     onPress={(e) => {
//                       e.stopPropagation();
//                       onBookmarkPress();
//                     }}
//                     activeOpacity={0.7}
//                   >
//                     {post?.SavedBy?.includes(selector?._id) ? (
//                       <GradientIcon
//                         colors={['#21B7FF', '#0084F8']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark'}
//                       />
//                     ) : (
//                       <GradientIcon
//                         colors={['#999', '#999']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark-o'}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Heart Animation */}
//             {!isNewsItem && (
//               <Animated.View pointerEvents='none' style={styles.heartAnimation}>
//                 <Animated.View
//                   style={{
//                     opacity: doubleTapIndex === index ? heartOpacity : 0,
//                     transform: [{ scale: heartScale }],
//                   }}
//                 >
//                   <MaterialIcons name='favorite' size={100} color='#FF1493' />
//                 </Animated.View>
//               </Animated.View>
//             )}

//             {/* Mute/Unmute Button */}
//             {isVideo && (
//               <TouchableOpacity
//                 style={styles.soundButton}
//                 onPress={onMuteToggle}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.soundButtonInner}>
//                   {isMuted ? (
//                     <SpeakerOff />
//                   ) : (
//                     <AntDesign name={'sound'} color='white' size={16} />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>
//         </TouchableWithoutFeedback>
//       </TouchableOpacity>
//     </GlowWrapper>
//   );
// };

// export default FeedCard;



import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import GradientIcon from '../../components/GradientIcon';
import { SpeakerOff } from '../../assets/SVGs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';

// Static styles — created ONCE at module level, never recreated on render
const staticStyles = StyleSheet.create({
  feedContainer: {
    paddingBottom: 12,
    borderRadius: 30,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  feedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageWrapper: { marginRight: 12 },
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
  timeText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 6,
    fontFamily: FONTS_FAMILY.SourceSans3_Regular,
  },
  caption: {
    fontSize: 14,
    fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    lineHeight: 18,
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
  videoContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  soundButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  soundButtonInner: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  bottomActionsBar: {
    height: 40,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  actionText: {
    fontSize: 14,
    fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    color: '#7078e2ff',
  },
});

function FeedCard({
  post,
  index,
  isNewsItem,
  isVideo,
  mediaUrl,
  visibleVideoIndex,
  pausedVideos,
  isMuted,
  selector,
  doubleTapIndex,
  heartOpacity,   // Animated.Value from parent
  heartScale,     // Animated.Value from parent
  isDarkMode,
  glowColors,
  onPostPress,
  onUserPress,
  onMediaPress,
  onLikePress,
  onDislikePress,
  onCommentPress,
  onBookmarkPress,
  onMuteToggle,
  formatInstagramDate,
}) {
  const containerBg = {
    backgroundColor: isDarkMode ? 'rgba(22,28,28,0.8)' : 'rgba(228,237,238,0.8)',
  };
  const borderColor = { borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' };
  const usernameColor = { color: isDarkMode ? '#fff' : '#000' };
  const captionColor = { color: isDarkMode ? '#ccc' : '#666' };

  const isLiked = post?.likes?.includes(selector?._id);
  const isDisliked = post?.Unlikes?.includes(selector?._id);
  const isSaved = post?.SavedBy?.includes(selector?._id);

  return (
    <GlowWrapper
      isDarkMode={isDarkMode}
      borderRadius={30}
      showStars
      starCount={60}
      showShinePatches
      intensity="low"
      glowColors={glowColors}
      containerStyle={{ margin: 10 }}
    >
      <TouchableOpacity
        style={[staticStyles.feedContainer, containerBg]}
        onPress={onPostPress}
        activeOpacity={0.98}
      >
        {/* Header */}
        <View style={staticStyles.feedHeader}>
          <View style={staticStyles.feedUserInfo}>
            <View style={staticStyles.profileImageWrapper}>
              <Image
                source={
                  isNewsItem
                    ? IMG.MessageProfile
                    : post?.User?.Image
                      ? { uri: post?.User?.Image }
                      : IMG.MessageProfile
                }
                style={[staticStyles.profileImage, borderColor]}
              />
            </View>

            <TouchableOpacity onPress={onUserPress} style={{ flex: 1 }} activeOpacity={0.7}>
              <View style={staticStyles.userNameRow}>
                <Text style={[staticStyles.username, usernameColor]}>
                  {isNewsItem ? post?.title : post?.User?.UserName}
                </Text>
                {!isNewsItem && (
                  <Text style={staticStyles.timeText}>
                    {'\u2022'} {formatInstagramDate(post?.createdAt)}
                  </Text>
                )}
              </View>
              <Text style={[staticStyles.caption, captionColor]} numberOfLines={2}>
                {isNewsItem
                  ? post?.description?.replace(/<[^>]*>/g, '')
                  : post?.caption}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Media */}
        <TouchableWithoutFeedback onPress={onMediaPress}>
          <View style={staticStyles.mediaContainer}>

            {isVideo ? (
              <View style={staticStyles.videoContainer}>
                <Video
                  source={{ uri: mediaUrl }}
                  style={staticStyles.postImage}
                  resizeMode="cover"
                  repeat
                  muted={isMuted}
                  paused={visibleVideoIndex !== index || !!pausedVideos[index]}
                  playInBackground={false}
                  playWhenInactive={false}
                  ignoreSilentSwitch="ignore"
                />
              </View>
            ) : (
              <Image
                source={{ uri: mediaUrl }}
                style={staticStyles.postImage}
                resizeMode="cover"
                progressiveRenderingEnabled
                fadeDuration={200}
              />
            )}

            {/* Bottom action bar */}
            <View style={staticStyles.bottomActionsBar}>
              {!isNewsItem && (
                <View style={staticStyles.actions}>
                  <View style={staticStyles.leftActions}>
                    {/* Like */}
                    <TouchableOpacity
                      style={staticStyles.actionButton}
                      onPress={onLikePress}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <GradientIcon
                        colors={isLiked ? glowColors : ['#999', '#999']}
                        size={isLiked ? 20 : 16}
                        iconType="Ionicons"
                        name="triangle"
                      />
                      <Text style={staticStyles.actionText}>{post?.TotalLikes}</Text>
                    </TouchableOpacity>

                    {/* Dislike */}
                    <TouchableOpacity
                      style={staticStyles.actionButton}
                      onPress={onDislikePress}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <GradientIcon
                        colors={isDisliked ? glowColors : ['#999', '#999']}
                        size={16}
                        iconType="Feather"
                        name="triangle"
                        style={{ transform: [{ rotate: '180deg' }] }}
                      />
                      <Text style={staticStyles.actionText}>{post?.TotalUnLikes}</Text>
                    </TouchableOpacity>

                    {/* Comment */}
                    <TouchableOpacity
                      style={staticStyles.actionButton}
                      onPress={onCommentPress}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <GradientIcon
                        colors={glowColors}
                        size={16}
                        iconType="FontAwesome"
                        name="comment-o"
                      />
                      <Text style={staticStyles.actionText}>{post?.TotalComents}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Bookmark */}
                  <TouchableOpacity
                    onPress={onBookmarkPress}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <GradientIcon
                      colors={isSaved ? ['#21B7FF', '#0084F8'] : ['#999', '#999']}
                      size={22}
                      iconType="FontAwesome"
                      name={isSaved ? 'bookmark' : 'bookmark-o'}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Heart animation — Animated.Value from parent, native driver = smooth */}
            {!isNewsItem && doubleTapIndex === index && (
              <Animated.View
                pointerEvents="none"
                style={[
                  staticStyles.heartAnimation,
                  { opacity: heartOpacity, transform: [{ scale: heartScale }] },
                ]}
              >
                <MaterialIcons name="favorite" size={100} color="#FF1493" />
              </Animated.View>
            )}

            {/* Mute button */}
            {isVideo && (
              <TouchableOpacity
                style={staticStyles.soundButton}
                onPress={onMuteToggle}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={staticStyles.soundButtonInner}>
                  {isMuted
                    ? <SpeakerOff />
                    : <AntDesign name="sound" color="white" size={16} />}
                </View>
              </TouchableOpacity>
            )}

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </GlowWrapper>
  );
}

export default memo(FeedCard);
