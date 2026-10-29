import React, { useCallback, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import IMG from '../assets/Images';
import { isShopPromotion, timeAgo } from '../utils/promotions';

const SCREEN_W = Dimensions.get('window').width;
const SIDE = 16;                       // peek space on each side
const GAP = 12;
const CARD_W = SCREEN_W - SIDE * 2;    // one full card per page
const STEP = CARD_W + GAP;
const MAX_DOTS = 8;

const isVideoUrl = post => post?.type === 'video' || /\.(mp4|mov|avi)(\?|$)/i.test(post?.media || '');

// "Promoted" carousel at the top of home. One complete card per page (cover, owner, title,
// tags); the user swipes sideways — it never auto-scrolls. Dots below show the position.
// Same data as web's RightPanel: post promotions and shop promotions.
const PromotedSection = ({ promos, isDarkMode, accent, onPress }) => {
  const [active, setActive] = useState(0);

  const onScroll = useCallback(e => {
    const i = Math.round(e.nativeEvent.contentOffset.x / STEP);
    setActive(prev => (prev === i ? prev : Math.max(0, i)));
  }, []);

  if (!promos?.length) return null;

  const text = isDarkMode ? '#F3F4F6' : '#0F172A';
  const muted = isDarkMode ? '#94A3B8' : '#64748B';
  const card = isDarkMode ? '#131B2B' : '#FFFFFF';
  const border = accent + (isDarkMode ? '55' : '40');
  const shopTag = { bg: '#F59E0B1A', fg: '#D97706' };

  const renderItem = ({ item: promo }) => {
    const isShop = isShopPromotion(promo);
    const shop = promo?.SellerShop;
    const seller = promo?.Seller;
    const post = promo?.Post;
    const user = post?.User || promo?.User;

    const name = isShop ? (shop?.Name?.trim() || seller?.StoreName || 'Promoted shop') : user?.UserName;
    const sub = isShop ? shop?.Address?.[0]?.LocationName : timeAgo(post?.createdAt);
    const title = isShop
      ? shop?.Services || promo?.Goal || 'Promoted shop'
      : post?.caption || promo?.Goal || 'Promoted post';
    const cover = isShop ? (shop?.Image || seller?.CoverImage || seller?.ProfileImage) : post?.media;
    const avatar = isShop ? (seller?.ProfileImage || shop?.Image) : user?.Image;
    const video = !isShop && isVideoUrl(post);
    const tag = isShop ? shopTag : { bg: accent + '1A', fg: accent };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress(promo)}
        style={[styles.card, { width: CARD_W, backgroundColor: card, borderColor: border, shadowColor: accent }]}>
        {/* Cover */}
        <View style={styles.cover}>
          {video || !cover ? (
            <View style={[StyleSheet.absoluteFill, styles.coverFallback]}>
              <Icon name={video ? 'play-circle' : 'image'} size={46} color="rgba(255,255,255,0.85)" />
            </View>
          ) : (
            <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          )}
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
              <Icon name={isShop ? 'shopping-bag' : 'file-text'} size={11} color="#fff" />
              <Text style={styles.badgeText}>{isShop ? 'Shop' : 'Post'}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: accent }]}>
              <Text style={styles.badgeText}>Promoted</Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.ownerRow}>
            <Image source={avatar ? { uri: avatar } : IMG.MessageProfile} style={[styles.avatar, { borderColor: accent }]} />
            <Text numberOfLines={1} style={[styles.name, { color: text, flexShrink: 1 }]}>{name}</Text>
            {!!sub && (
              <>
                <Text style={{ color: muted, marginHorizontal: 6 }}>·</Text>
                {isShop && <Icon name="map-pin" size={11} color={muted} />}
                <Text numberOfLines={1} style={[styles.sub, { color: muted, flexShrink: 1 }]}>{sub}</Text>
              </>
            )}
          </View>

          <Text numberOfLines={2} style={[styles.title, { color: text }]}>{title}</Text>

          <View style={styles.footer}>
            <View style={[styles.tag, { backgroundColor: tag.bg }]}>
              <Icon name={isShop ? 'shopping-bag' : 'file-text'} size={11} color={tag.fg} />
              <Text style={[styles.tagText, { color: tag.fg }]}>{isShop ? 'Shop' : 'Post'}</Text>
            </View>
            {!!promo?.Goal && (
              <View style={[styles.tag, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                <Text style={[styles.tagText, { color: muted }]}>{promo.Goal}</Text>
              </View>
            )}
            <View style={{ flex: 1 }} />
            <Text style={[styles.view, { color: accent }]}>View</Text>
            <Icon name="arrow-right" size={14} color={accent} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.heading, { color: text }]}>Promoted</Text>

      <FlatList
        data={promos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(p, i) => p?._id || String(i)}
        contentContainerStyle={{ paddingHorizontal: SIDE, paddingBottom: 8 }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        snapToInterval={STEP}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialNumToRender={2}
        windowSize={3}
        renderItem={renderItem}
      />

      {promos.length > 1 && (
        <View style={styles.dots}>
          {promos.length <= MAX_DOTS ? (
            promos.map((p, i) => (
              <View
                key={p?._id || i}
                style={[
                  styles.dot,
                  i === active
                    ? { width: 20, backgroundColor: accent }
                    : { width: 7, backgroundColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />
            ))
          ) : (
            <View style={[styles.counter, { backgroundColor: accent + '1A' }]}>
              <Text style={[styles.counterText, { color: accent }]}>{Math.min(active + 1, promos.length)} / {promos.length}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingTop: 4, paddingBottom: 4 },
  heading: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold, paddingHorizontal: 16, marginBottom: 10 },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  cover: { height: 170, backgroundColor: '#1F2937' },
  coverFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' },
  badges: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textTransform: 'uppercase' },
  body: { padding: 14 },
  ownerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, marginRight: 8 },
  name: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  sub: { fontSize: 12, marginLeft: 3, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  title: { fontSize: 16, lineHeight: 22, marginTop: 8, fontFamily: FONTS_FAMILY.SourceSans3_Bold, minHeight: 44 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  tagText: { fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textTransform: 'uppercase' },
  view: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginRight: 2 },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 2, marginBottom: 6 },
  dot: { height: 7, borderRadius: 4 },
  counter: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  counterText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default PromotedSection;
