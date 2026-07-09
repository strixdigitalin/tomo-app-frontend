

// import { useIsFocused } from '@react-navigation/native';
// import React, { useEffect } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import { useSelector } from 'react-redux';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withSequence,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');

// const SearchShimmerLoader = () => {
//   const { isDarkMode } = useSelector(state => state.theme);
//   const shimmerAnimatedValue = useSharedValue(0);
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {
//       shimmerAnimatedValue.value = withRepeat(
//         withSequence(
//           withTiming(1, { duration: 1000 }),
//           withTiming(0, { duration: 1000 })
//         ),
//         -1, // infinite
//         false
//       );
//     } else {
//       shimmerAnimatedValue.value = 0;
//     }
//   }, [isFocused]);

//   const ShimmerBox = ({ style }) => {
//     const animatedStyle = useAnimatedStyle(() => {
//       const opacity = interpolate(
//         shimmerAnimatedValue.value,
//         [0, 1],
//         [0.3, 0.7]
//       );

//       const translateX = interpolate(
//         shimmerAnimatedValue.value,
//         [0, 1],
//         [-width, width]
//       );

//       return {
//         opacity,
//         transform: [{ translateX }],
//       };
//     });

//     return (
//       <View style={[styles.shimmerContainer, style]}>
//         <View
//           style={[
//             styles.shimmerBase,
//             { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' },
//           ]}
//         >
//           <Animated.View
//             style={[
//               styles.shimmerOverlay,
//               {
//                 backgroundColor: isDarkMode ? '#333' : '#fff',
//               },
//               animatedStyle,
//             ]}
//           />
//         </View>
//       </View>
//     );
//   };

//   const UserCardShimmer = () => (
//     <View
//       style={[
//         styles.userCardContainer,
//         { backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9' },
//       ]}
//     >
//       <ShimmerBox style={styles.userImage} />
//       <View style={styles.userInfo}>
//         <ShimmerBox style={styles.username} />
//       </View>
//     </View>
//   );

//   const renderShimmerGrid = () => {
//     const shimmerItems = Array.from({ length: 9 }, (_, index) => (
//       <UserCardShimmer key={index} />
//     ));

//     return <View style={styles.gridContainer}>{shimmerItems}</View>;
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#000' : '#fff',
//     },
//     searchContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f1f1',
//       borderRadius: 12,
//       margin: 16,
//       padding: 12,
//       marginTop: 60,
//       height: 48,
      
//     },
//     searchIcon: {
//       marginRight: 10,
//     },
//     searchInput: {
//       flex: 1,
//       height: 20,
//       borderRadius: 4,
//     },
//     micIcon: {
//       marginLeft: 8,
//     },
//     sectionTitle: {
//       height: 20,
//       width: 150,
//       borderRadius: 4,
//       marginBottom: 12,
//       marginHorizontal: 16,
//     },
//     gridContainer: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       paddingHorizontal: 11,
//       marginBottom: 100,
//     },
//     userCardContainer: {
//       width: (width - 16) / 3 - 4,
//       margin: 1,
//       borderRadius: 8,
//       overflow: 'hidden',
//       alignSelf:'center'
//     },
//     userImage: {
//       width: '100%',
//       height: 120,
//     },
//     userInfo: {
//       padding: 8,
//       alignItems: 'center',
//     },
//     username: {
//       width: '80%',
//       height: 14,
//       borderRadius: 4,
//     },
//     shimmerContainer: {
//       overflow: 'hidden',
//     },
//     shimmerBase: {
//       width: '100%',
//       height: '100%',
//       borderRadius: 4,
//     },
//     shimmerOverlay: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       width: '50%',
//     },
//     iconShimmer: {
//       width: 20,
//       height: 20,
//       borderRadius: 10,
//     },
//   });

//   return (
//     <View style={styles.container}>
//       {/* Search Bar Shimmer */}
//       <View style={styles.searchContainer}>
//         <ShimmerBox style={[styles.iconShimmer, styles.searchIcon]} />
//         <ShimmerBox style={styles.searchInput} />
//         <ShimmerBox style={[styles.iconShimmer, styles.micIcon]} />
//       </View>

//       {/* Section Title Shimmer */}
//       <ShimmerBox style={styles.sectionTitle} />

//       {/* Grid Shimmer */}
//       {renderShimmerGrid()}
//     </View>
//   );
// };

// export default SearchShimmerLoader;


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