import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_W = (width - 36) / 2; // 2-col grid matching UserCard

// ─── Single Box — receives shared Animated.Value directly ────────────────────
const Box = ({ w, h, radius = 8, style, opacity, isDarkMode }) => (
  <Animated.View
    style={[
      {
        width: w,
        height: h,
        borderRadius: radius,
        backgroundColor: isDarkMode ? '#2a2a2a' : '#E8E8E8',
        opacity,
      },
      style,
    ]}
  />
);

// Matches actual UserCard: 2-col, height 160, image full bleed, text overlay
const UserCardShimmer = ({ isDarkMode, opacity }) => (
  <View style={[S.card, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }]}>
    {/* Full image */}
    <Box w="100%" h="100%" radius={12} opacity={opacity} isDarkMode={isDarkMode} />
    {/* Bottom overlay text */}
    <View style={S.cardText}>
      <Box w="65%" h={13} radius={6} opacity={opacity} isDarkMode={isDarkMode} />
      <Box w="40%" h={11} radius={5} opacity={opacity} isDarkMode={isDarkMode} style={{ marginTop: 4 }} />
    </View>
  </View>
);

// Nearby horizontal pill
const NearbyShimmer = ({ isDarkMode, opacity }) => (
  <View style={S.nearbyItem}>
    <Box w={60} h={60} radius={30} opacity={opacity} isDarkMode={isDarkMode} />
    <Box w={50} h={11} radius={5} opacity={opacity} isDarkMode={isDarkMode} style={{ marginTop: 6 }} />
    <Box w={44} h={18} radius={8} opacity={opacity} isDarkMode={isDarkMode} style={{ marginTop: 4 }} />
  </View>
);

const SearchShimmerLoader = () => {
  const { isDarkMode } = useSelector(state => state.theme);
  const isFocused = useIsFocused();

  // ✅ ONE Animated.Value for everything — useNativeDriver = GPU only
  const shimmer = useRef(new Animated.Value(0.4)).current;
  const animRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      animRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, { toValue: 1, duration: 850, useNativeDriver: true }),
          Animated.timing(shimmer, { toValue: 0.4, duration: 850, useNativeDriver: true }),
        ])
      );
      animRef.current.start();
    } else {
      animRef.current?.stop();
      animRef.current = null;
    }
    return () => {
      animRef.current?.stop();
      animRef.current = null;
    };
  }, [isFocused]);

  const bg = { backgroundColor: isDarkMode ? '#000' : '#fff' };
  const sectionBg = { backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f1f1' };

  return (
    <View style={[S.container, bg]}>

      {/* Search bar skeleton — matches AnimatedSearchBar */}
      <View style={[S.searchBar, sectionBg]}>
        <Box w={20} h={20} radius={10} opacity={shimmer} isDarkMode={isDarkMode} />
        <Box w="55%" h={14} radius={7} opacity={shimmer} isDarkMode={isDarkMode} />
      </View>

      {/* "People near you" section title */}
      <Box w={140} h={16} radius={8} opacity={shimmer} isDarkMode={isDarkMode}
        style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 12 }} />

      {/* Nearby users row */}
      <View style={S.nearbyRow}>
        {[0, 1, 2, 3].map(i => (
          <NearbyShimmer key={i} isDarkMode={isDarkMode} opacity={shimmer} />
        ))}
      </View>

      {/* "Browse" section title */}
      <Box w={80} h={16} radius={8} opacity={shimmer} isDarkMode={isDarkMode}
        style={{ marginHorizontal: 16, marginTop: 20, marginBottom: 12 }} />

      {/* Browse category card */}
      <View style={S.browseRow}>
        <Box w={CARD_W} h={120} radius={12} opacity={shimmer} isDarkMode={isDarkMode} />
        <Box w={CARD_W} h={120} radius={12} opacity={shimmer} isDarkMode={isDarkMode} />
      </View>

      {/* "Discover People" title */}
      <Box w={160} h={16} radius={8} opacity={shimmer} isDarkMode={isDarkMode}
        style={{ marginHorizontal: 16, marginTop: 20, marginBottom: 12 }} />

      {/* User cards 2-col grid */}
      <View style={S.grid}>
        {[0, 1, 2, 3].map(i => (
          <UserCardShimmer key={i} isDarkMode={isDarkMode} opacity={shimmer} />
        ))}
      </View>

    </View>
  );
};

const S = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
    marginTop: 60,
    height: 48,
    paddingHorizontal: 14,
    gap: 12,
  },
  nearbyRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  nearbyItem: {
    alignItems: 'center',
    width: 70,
  },
  browseRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 8,
  },
  card: {
    width: CARD_W,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cardText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
});

export default SearchShimmerLoader;