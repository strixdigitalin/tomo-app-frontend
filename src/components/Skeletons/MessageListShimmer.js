import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// ─── Single Box — ONE shared Animated.Value ───────────────────────────────────
const Box = ({ w, h, radius = 8, style, opacity, isDarkMode }) => (
  <Animated.View
    style={[
      {
        width: w, height: h, borderRadius: radius,
        backgroundColor: isDarkMode ? '#2a2a2a' : '#E8E8E8',
        opacity,
      },
      style,
    ]}
  />
);

// Matches actual MessageCard layout
const MessageCardShimmer = ({ opacity, isDarkMode }) => (
  <View style={S.card}>
    {/* Avatar */}
    <Box w={56} h={56} radius={28} opacity={opacity} isDarkMode={isDarkMode} style={{ marginRight: 12 }} />
    {/* Name + message lines */}
    <View style={{ flex: 1, gap: 8 }}>
      <Box w="55%" h={15} radius={7} opacity={opacity} isDarkMode={isDarkMode} />
      <Box w="75%" h={13} radius={6} opacity={opacity} isDarkMode={isDarkMode} />
    </View>
  </View>
);

const MessageListShimmer = ({ isDarkMode: propDarkMode }) => {
  // ✅ Accept as prop OR read from redux — works both ways
  const { isDarkMode: reduxDark } = useSelector(state => state.theme);
  const isDarkMode = propDarkMode ?? reduxDark;

  const isFocused = useIsFocused();
  const shimmer = useRef(new Animated.Value(0.4)).current;
  const animRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      animRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(shimmer, { toValue: 0.4, duration: 900, useNativeDriver: true }),
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
  const searchBg = { backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' };

  return (
    <View style={[S.container, bg]}>
      <StatusBar translucent backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header — back btn + title (matches MessageList header) */}
      <View style={S.header}>
        <Box w={40} h={40} radius={20} opacity={shimmer} isDarkMode={isDarkMode} />
        <Box w={100} h={22} radius={10} opacity={shimmer} isDarkMode={isDarkMode} />
        <Box w={40} h={40} radius={20} opacity={shimmer} isDarkMode={isDarkMode} />
      </View>

      {/* Search bar */}
      <View style={[S.search, searchBg]}>
        <Box w={20} h={20} radius={10} opacity={shimmer} isDarkMode={isDarkMode} />
        <Box w="60%" h={14} radius={7} opacity={shimmer} isDarkMode={isDarkMode} />
      </View>

      {/* Message rows */}
      {Array.from({ length: 10 }).map((_, i) => (
        <MessageCardShimmer key={i} opacity={shimmer} isDarkMode={isDarkMode} />
      ))}
    </View>
  );
};

const S = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
});

export default MessageListShimmer;