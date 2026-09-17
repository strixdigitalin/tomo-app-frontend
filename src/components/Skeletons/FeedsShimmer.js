import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Single shared animation value for ALL shimmer items ───────────────────
// Instead of N separate useSharedValue() per placeholder, ONE Animated.Value
// drives the opacity for all of them via interpolation.
// This is the lightest possible shimmer — zero Reanimated overhead.

const ShimmerItem = ({ isDarkMode, animatedOpacity }) => {
  const bg = isDarkMode ? '#2a2a2a' : '#E8E8E8';
  const highlightBg = isDarkMode ? '#3a3a3a' : '#F5F5F5';

  const Box = ({ w, h, radius = 10, style }) => (
    <Animated.View
      style={[
        {
          width: w,
          height: h,
          borderRadius: radius,
          backgroundColor: bg,
          opacity: animatedOpacity,
        },
        style,
      ]}
    />
  );

  return (
    // Matches FeedCard: margin:10, borderRadius:30, same bg
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? 'rgba(22,28,28,0.8)' : 'rgba(228,237,238,0.8)',
          borderColor: isDarkMode ? '#333' : '#E0E0E0',
        },
      ]}
    >
      {/* ── Header row — matches FeedCard header ── */}
      <View style={styles.header}>
        {/* Avatar */}
        <Box w={42} h={42} radius={21} />

        {/* Name + caption lines */}
        <View style={styles.headerText}>
          <Box w={130} h={14} radius={7} />
          <Box w={190} h={12} radius={6} style={{ marginTop: 7 }} />
        </View>
      </View>

      {/* ── Media placeholder — matches postImage height:350 ── */}
      <Box w="100%" h={350} radius={20} />

      {/* ── Bottom action bar — matches bottomActionsBar ── */}
      <View style={styles.actionsBar}>
        <View style={styles.leftActions}>
          <Box w={60} h={28} radius={16} />
          <Box w={60} h={28} radius={16} />
          <Box w={60} h={28} radius={16} />
        </View>
        <Box w={28} h={28} radius={14} />
      </View>
    </View>
  );
};

const FeedShimmerLoader = ({ isDarkMode, count = 3 }) => {
  const isFocused = useIsFocused();
  // ONE single Animated.Value for ALL items — lightest possible
  const shimmer = useRef(new Animated.Value(0.4)).current;
  const animRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      animRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(shimmer, {
            toValue: 0.4,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      );
      animRef.current.start();
    } else {
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
    }

    return () => {
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
    };
  }, [isFocused]);

  return (
    <View style={{ paddingBottom: 90 }}>
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerItem
          key={i}
          isDarkMode={isDarkMode}
          animatedOpacity={shimmer}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 0,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default FeedShimmerLoader;