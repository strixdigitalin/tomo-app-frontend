import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_WIDTH - 36) / 2; // matches grid: paddingHorizontal:8 + margin:4 each side

// ONE shared Animated.Value drives ALL placeholders — zero Reanimated overhead
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

// Matches actual ShopCard: height:160, image full bleed, overlay, text at bottom
const ShopCardShimmer = ({ isDarkMode, opacity }) => (
  <View
    style={[
      shimmerStyles.card,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' },
    ]}
  >
    {/* Full image area */}
    <Box w="100%" h="100%" radius={10} opacity={opacity} isDarkMode={isDarkMode} />

    {/* Overlay text area — bottom of card */}
    <View style={shimmerStyles.textArea}>
      <Box w="70%" h={13} radius={6} opacity={opacity} isDarkMode={isDarkMode} />
      <View style={shimmerStyles.locationRow}>
        <Box w={10} h={10} radius={5} opacity={opacity} isDarkMode={isDarkMode} />
        <Box w="50%" h={10} radius={5} opacity={opacity} isDarkMode={isDarkMode} />
      </View>
    </View>
  </View>
);

const ShopsShimmerLoader = ({ isDarkMode, shopCount = 6 }) => {
  const isFocused = useIsFocused();
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

  // Build pairs for 2-col grid
  const pairs = [];
  for (let i = 0; i < shopCount; i += 2) pairs.push(i);

  return (
    <View style={[shimmerStyles.container, { backgroundColor: isDarkMode ? 'black' : '#fff' }]}>
      {/* Search bar skeleton */}
      <View style={[shimmerStyles.searchBar, { backgroundColor: isDarkMode ? '#252525' : '#F0F0F0' }]}>
        <Box w={20} h={20} radius={10} opacity={shimmer} isDarkMode={isDarkMode} />
        <Box w="55%" h={14} radius={7} opacity={shimmer} isDarkMode={isDarkMode} />
      </View>

      {/* Grid */}
      <View style={shimmerStyles.grid}>
        {pairs.map((i) => (
          <View key={i} style={shimmerStyles.row}>
            <ShopCardShimmer isDarkMode={isDarkMode} opacity={shimmer} />
            {i + 1 < shopCount && (
              <ShopCardShimmer isDarkMode={isDarkMode} opacity={shimmer} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const shimmerStyles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    margin: 10,
    marginTop: 10,
    height: 50,
    paddingHorizontal: 15,
    gap: 10,
  },
  grid: { paddingHorizontal: 8 },
  row: { flexDirection: 'row', marginBottom: 4 },
  card: {
    width: CARD_SIZE,
    height: 160,
    borderRadius: 10,
    margin: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  textArea: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    gap: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default ShopsShimmerLoader;