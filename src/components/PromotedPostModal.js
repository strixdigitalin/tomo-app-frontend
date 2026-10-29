import React, { useEffect, useState } from 'react';
import { View, Text, Image, Modal, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PostMedia from './PostMedia';
import { FONTS_FAMILY } from '../assets/Fonts';
import IMG from '../assets/Images';
import { apiGet } from '../utils/Apis';
import { timeAgo } from '../utils/promotions';

// Post detail sheet for a promoted post (web: PostDetailModel.jsx).
// Loads api/admin/GetPostDetails/:id → { post, comments }.
const PromotedPostModal = ({ visible, promotion, onClose, isDarkMode, accent, width }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const postId = promotion?.Post?._id;
  useEffect(() => {
    if (!visible || !postId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(false);
        setDetail(null);
        const res = await apiGet(`/api/admin/GetPostDetails/${postId}`);
        if (!cancelled) setDetail(res?.data || null);
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [visible, postId]);

  const bg = isDarkMode ? '#131B2B' : '#FFFFFF';
  const text = isDarkMode ? '#F9FAFB' : '#111827';
  const muted = isDarkMode ? '#94A3B8' : '#64748B';
  const border = accent + '40';
  const chipBg = isDarkMode ? '#1F2937' : '#F3F4F6';

  const post = detail?.post;
  const comments = detail?.comments || [];
  const author = promotion?.Post?.User || promotion?.User || post?.User;
  const isVideo = post?.type ? post.type !== 'image' : /\.(mp4|mov|avi)(\?|$)/i.test(post?.media || '');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: bg }]}>
          <View style={[styles.header, { borderBottomColor: border }]}>
            <Image source={author?.Image ? { uri: author.Image } : IMG.MessageProfile} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={[styles.user, { color: text }]}>{author?.UserName || 'Sponsored post'}</Text>
              <View style={styles.subRow}>
                {!!post?.createdAt && <Text style={[styles.sub, { color: muted }]}>{timeAgo(post.createdAt)}</Text>}
                <View style={[styles.pill, { backgroundColor: accent + '1A' }]}>
                  <Text style={[styles.pillText, { color: accent }]}>Promoted</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={24} color={muted} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator style={{ margin: 40 }} color={accent} />
          ) : error || !post ? (
            <Text style={[styles.empty, { color: muted }]}>{error ? 'Failed to load post details.' : 'Post not found.'}</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ padding: 16 }}>
                {!!post.caption && <Text style={[styles.caption, { color: text }]}>{post.caption}</Text>}
                {post.Hashtags?.length > 0 && (
                  <View style={styles.tags}>
                    {post.Hashtags.map((t, i) => (
                      <Text key={`${t}-${i}`} style={[styles.tag, { color: accent }]}>
                        {String(t).startsWith('#') ? t : `#${t}`}
                      </Text>
                    ))}
                  </View>
                )}
              </View>

              {!!post.media && (
                <PostMedia uri={post.media} isVideo={isVideo} width={width} controls muted={false} repeat={false} maxHeightRatio={1.1} />
              )}

              <View style={[styles.statsRow, { borderBottomColor: border }]}>
                <View style={[styles.stat, { backgroundColor: chipBg }]}>
                  <Icon name="thumbs-up-outline" size={15} color={accent} />
                  <Text style={[styles.statText, { color: text }]}>{post.TotalLikes ?? 0}</Text>
                </View>
                <View style={[styles.stat, { backgroundColor: chipBg }]}>
                  <Icon name="thumbs-down-outline" size={15} color={muted} />
                  <Text style={[styles.statText, { color: text }]}>{post.TotalUnLikes ?? 0}</Text>
                </View>
                <View style={[styles.stat, { backgroundColor: chipBg }]}>
                  <Icon name="chatbubble-outline" size={15} color={accent} />
                  <Text style={[styles.statText, { color: text }]}>{post.TotalComents ?? comments.length}</Text>
                </View>
                {!!promotion?.Goal && <Text style={[styles.goal, { color: muted }]}>Goal: {promotion.Goal}</Text>}
              </View>

              <View style={{ padding: 16 }}>
                <Text style={[styles.commentsTitle, { color: text }]}>Comments ({comments.length})</Text>
                {comments.length === 0 ? (
                  <Text style={{ color: muted, fontSize: 13 }}>No comments yet.</Text>
                ) : (
                  comments.map(c => (
                    <View key={c?._id} style={styles.commentRow}>
                      <Image source={c?.User?.Image ? { uri: c.User.Image } : IMG.MessageProfile} style={styles.cAvatar} />
                      <View style={[styles.bubble, { backgroundColor: chipBg }]}>
                        <View style={styles.subRow}>
                          <Text style={[styles.cUser, { color: text }]}>{c?.User?.UserName || 'User'}</Text>
                          <Text style={[styles.sub, { color: muted }]}>{timeAgo(c?.createdAt)}</Text>
                        </View>
                        <Text style={{ color: text, fontSize: 14 }}>{c?.text || c?.Comment || c?.comment}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '92%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  user: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  subRow: { flexDirection: 'row', alignItems: 'center' },
  sub: { fontSize: 12, marginRight: 8 },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  pillText: { fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, textTransform: 'uppercase' },
  empty: { textAlign: 'center', padding: 40, fontSize: 14 },
  caption: { fontSize: 15, lineHeight: 21 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tag: { fontSize: 14, marginRight: 10, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  statsRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  stat: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  statText: { marginLeft: 6, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  goal: { marginLeft: 'auto', fontSize: 12 },
  commentsTitle: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 10 },
  commentRow: { flexDirection: 'row', marginBottom: 12 },
  cAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  bubble: { flex: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  cUser: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, marginRight: 8 },
});

export default PromotedPostModal;
