import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import GradientIcon from '../../components/GradientIcon';
import PostMedia from '../../components/PostMedia';
import { SpeakerOff } from '../../assets/SVGs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';

const CARD_MARGIN = 12;
const MEDIA_WIDTH = Dimensions.get('window').width - CARD_MARGIN * 2;

// Enterprise palette: neutral slate surfaces, hairline borders, one accent (the theme colour).
// Cards sit on a tinted screen (light: #EEF1F6, dark: #0B1220) so they read as raised surfaces;
// the border and shadow take the selected theme colour.
const palette = (isDark, accent) => ({
  card: isDark ? '#131B2B' : '#FFFFFF',
  border: accent + (isDark ? '55' : '40'),
  text: isDark ? '#F3F4F6' : '#0F172A',
  muted: isDark ? '#94A3B8' : '#64748B',
  idle: isDark ? '#64748B' : '#94A3B8',
  divider: isDark ? '#1E293B' : '#F1F5F9',
  chip: isDark ? '#1B2538' : '#F8FAFC',
});

const staticStyles = StyleSheet.create({
  card: {
    marginHorizontal: CARD_MARGIN,
    marginVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarRing: { padding: 2, borderRadius: 24, borderWidth: 1.5, marginRight: 10 },
  name: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  time: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  caption: { fontSize: 14, lineHeight: 20, fontFamily: FONTS_FAMILY.SourceSans3_Regular, paddingHorizontal: 14, paddingBottom: 8 },
  readMore: { fontSize: 13, textDecorationLine: 'underline', paddingHorizontal: 14, paddingBottom: 10 },
  mediaWrap: { alignItems: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  actionText: { fontSize: 13, marginLeft: 6, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  heart: { position: 'absolute', alignSelf: 'center', top: '35%' },
  sound: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
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
  heartOpacity,
  heartScale,
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
  onMorePress,
  formatInstagramDate,
}) {
  const accent = glowColors?.[0] || '#1877f2';
  const c = palette(isDarkMode, accent);

  const isLiked = post?.likes?.includes(selector?._id);
  const isDisliked = post?.Unlikes?.includes(selector?._id);
  const isSaved = post?.SavedBy?.includes(selector?._id);

  const avatar = isNewsItem
    ? IMG.MessageProfile
    : post?.User?.Image
      ? { uri: post.User.Image }
      : IMG.MessageProfile;

  return (
    <View style={[staticStyles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      <TouchableOpacity style={staticStyles.header} onPress={onUserPress} activeOpacity={0.7}>
        <View style={[staticStyles.avatarRing, { borderColor: accent }]}>
          <Image source={avatar} style={staticStyles.avatar} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[staticStyles.name, { color: c.text }]} numberOfLines={1}>
            {isNewsItem ? post?.title : post?.User?.UserName}
          </Text>
          {!isNewsItem && (
            <Text style={[staticStyles.time, { color: c.muted }]}>{formatInstagramDate(post?.createdAt)}</Text>
          )}
        </View>
        {!isNewsItem && (
          <TouchableOpacity onPress={onMorePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="more-vert" size={22} color={c.muted} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.9} onPress={onPostPress}>
        <Text style={[staticStyles.caption, { color: c.text }]} numberOfLines={2}>
          {isNewsItem ? post?.description?.replace(/<[^>]*>/g, '') : post?.caption}
        </Text>
      </TouchableOpacity>
      {isNewsItem && !!post?.Link && (
        <TouchableOpacity onPress={() => Linking.openURL(post.Link).catch(() => {})}>
          <Text style={[staticStyles.readMore, { color: accent }]}>Read More</Text>
        </TouchableOpacity>
      )}

      <TouchableWithoutFeedback onPress={onMediaPress}>
        <View style={staticStyles.mediaWrap}>
          <PostMedia
            uri={mediaUrl}
            isVideo={isVideo}
            width={MEDIA_WIDTH}
            paused={visibleVideoIndex !== index || !!pausedVideos[index]}
            muted={isMuted}
          />

          {!isNewsItem && doubleTapIndex === index && (
            <Animated.View
              pointerEvents="none"
              style={[staticStyles.heart, { opacity: heartOpacity, transform: [{ scale: heartScale }] }]}
            >
              <MaterialIcons name="favorite" size={100} color="#FF1493" />
            </Animated.View>
          )}

          {isVideo && (
            <TouchableOpacity
              style={staticStyles.sound}
              onPress={onMuteToggle}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isMuted ? <SpeakerOff /> : <AntDesign name="sound" color="white" size={16} />}
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>

      {!isNewsItem && (
        <View style={[staticStyles.actions, { borderTopColor: c.divider }]}>
          <TouchableOpacity style={[staticStyles.actionBtn, { backgroundColor: c.chip }]} onPress={onLikePress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <GradientIcon
              colors={isLiked ? glowColors : [c.idle, c.idle]}
              size={isLiked ? 20 : 17}
              iconType="Ionicons"
              name="triangle"
            />
            <Text style={[staticStyles.actionText, { color: c.muted }]}>{post?.TotalLikes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[staticStyles.actionBtn, { backgroundColor: c.chip }]} onPress={onDislikePress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <GradientIcon
              colors={isDisliked ? glowColors : [c.idle, c.idle]}
              size={17}
              iconType="Feather"
              name="triangle"
              style={{ transform: [{ rotate: '180deg' }] }}
            />
            <Text style={[staticStyles.actionText, { color: c.muted }]}>{post?.TotalUnLikes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[staticStyles.actionBtn, { backgroundColor: c.chip }]} onPress={onCommentPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <GradientIcon colors={[c.idle, c.idle]} size={17} iconType="FontAwesome" name="comment-o" />
            <Text style={[staticStyles.actionText, { color: c.muted }]}>{post?.TotalComents}</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity onPress={onBookmarkPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <GradientIcon
              colors={isSaved ? glowColors : [c.idle, c.idle]}
              size={22}
              iconType="FontAwesome"
              name={isSaved ? 'bookmark' : 'bookmark-o'}
            />
          </TouchableOpacity>
        </View>
      )}
      {isNewsItem && <View style={{ height: 12 }} />}
    </View>
  );
}

export default memo(FeedCard);
