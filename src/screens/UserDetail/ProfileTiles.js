import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { profilePalette } from './profileTheme';
import { productTitle } from '../../utils/productFields';

const W = Dimensions.get('window').width;
const GAP = 6;
const PAD = 12;
export const GRID_TILE = (W - PAD * 2 - GAP * 2) / 3;
export const PRODUCT_W = (W - PAD * 2 - GAP) / 2;

const isVideoUrl = url => /\.(mp4|mov|avi)(\?|$)/i.test(url || '');

// Square gallery tile (3 per row) — posts, saved and tagged all use it.
export const PostTile = React.memo(({ post, isDark, accent, onPress }) => {
  const c = profilePalette(isDark, accent);
  const video = post?.type === 'video' || isVideoUrl(post?.media);
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.tile, { backgroundColor: c.chip, borderColor: c.border }]}>
      {video ? (
        <View style={[StyleSheet.absoluteFill, styles.videoBg]}>
          <Feather name="play-circle" size={30} color="rgba(255,255,255,0.9)" />
        </View>
      ) : (
        <Image source={{ uri: post?.media }} style={StyleSheet.absoluteFill} resizeMode="cover" fadeDuration={150} />
      )}
      <View style={styles.tileStats}>
        <Feather name="triangle" size={9} color="#fff" />
        <Text style={styles.tileStatText}>{post?.TotalLikes ?? 0}</Text>
      </View>
    </TouchableOpacity>
  );
});
PostTile.displayName = 'PostTile';

// Product card (2 per row)
export const ProductCard = React.memo(({ product, isDark, accent, onPress }) => {
  const c = profilePalette(isDark, accent);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.product, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      <Image source={{ uri: product?.Image || product?.Images?.[0] }} style={styles.productImg} resizeMode="cover" />
      <View style={{ padding: 10 }}>
        <Text style={[styles.productTitle, { color: c.text }]} numberOfLines={1}>{productTitle(product)}</Text>
        {!!product?.Price && <Text style={[styles.productPrice, { color: accent }]}>₹{Number(product.Price).toLocaleString('en-IN')}</Text>}
      </View>
    </TouchableOpacity>
  );
});
ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  tile: { width: GRID_TILE, height: GRID_TILE, borderRadius: 14, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  videoBg: { backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  tileStats: { position: 'absolute', left: 6, bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 9 },
  tileStatText: { color: '#fff', fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  product: { width: PRODUCT_W, borderRadius: 18, borderWidth: 1, overflow: 'hidden', elevation: 2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 },
  productImg: { width: '100%', height: PRODUCT_W * 0.8, backgroundColor: '#1F2937' },
  productTitle: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  productPrice: { fontSize: 14, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});
