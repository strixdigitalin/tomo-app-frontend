

// import { useIsFocused } from '@react-navigation/native';
// import React, { useEffect } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withSequence,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');

// const ShimmerPlaceholder = ({ width, height, borderRadius = 4, style }) => {
//   const shimmerValue = useSharedValue(0);
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {
//       shimmerValue.value = withRepeat(
//         withSequence(
//           withTiming(1, { duration: 1000 }),
//           withTiming(0, { duration: 1000 })
//         ),
//         -1, // infinite
//         false
//       );
//     } else {
//       shimmerValue.value = 0;
//     }
//   }, [isFocused]);

//   const animatedStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(shimmerValue.value, [0, 1], [0.3, 0.7]);

//     return {
//       opacity,
//     };
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           width,
//           height,
//           borderRadius,
//           backgroundColor: '#E0E0E0',
//         },
//         style,
//         animatedStyle,
//       ]}
//     />
//   );
// };

// const ShimmerPlaceholderDark = ({ width, height, borderRadius = 4, style }) => {
//   const shimmerValue = useSharedValue(0);
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {
//       shimmerValue.value = withRepeat(
//         withSequence(
//           withTiming(1, { duration: 1000 }),
//           withTiming(0, { duration: 1000 })
//         ),
//         -1,
//         false
//       );
//     } else {
//       shimmerValue.value = 0;
//     }
//   }, [isFocused]);

//   const animatedStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(shimmerValue.value, [0, 1], [0.1, 0.3]);

//     return {
//       opacity,
//     };
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           width,
//           height,
//           borderRadius,
//           backgroundColor: 'lightgray',
//         },
//         style,
//         animatedStyle,
//       ]}
//     />
//   );
// };

// const ShopCardShimmer = ({ isDarkMode }) => {
//   const ShimmerComponent = isDarkMode ? ShimmerPlaceholderDark : ShimmerPlaceholder;

//   return (
//     <View
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor: isDarkMode ? '#252525' : '#fff',
//           borderColor: isDarkMode ? 'gray' : '#E4E4E4',
//         },
//       ]}
//     >
//       {/* Shop Image */}
//       <ShimmerComponent width="100%" height={100} borderRadius={10} />

//       {/* Shop Details */}
//       <View style={{ marginTop: 6 }}>
//         {/* Shop Name */}
//         <ShimmerComponent
//           width="80%"
//           height={16}
//           borderRadius={8}
//           style={{ marginBottom: 8 }}
//         />

//         {/* Location Row */}
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
//           {/* Location Icon */}
//           <ShimmerComponent width={12} height={12} borderRadius={6} />
//           {/* Location Text */}
//           <ShimmerComponent width="60%" height={10} borderRadius={5} />
//         </View>
//       </View>
//     </View>
//   );
// };

// const SearchBarShimmer = ({ isDarkMode }) => {
//   const ShimmerComponent = isDarkMode ? ShimmerPlaceholderDark : ShimmerPlaceholder;

//   return (
//     <View
//       style={[
//         styles.searchContainer,
//         {
//           backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
//         },
//       ]}
//     >
//       {/* Search Icon */}
//       <ShimmerComponent width={20} height={20} borderRadius={10} />

//       {/* Search Input Area */}
//       <View style={{ flex: 1 }}>
//         <ShimmerComponent width="70%" height={16} borderRadius={8} />
//       </View>
//     </View>
//   );
// };

// const ShopsShimmerLoader = ({ isDarkMode, shopCount = 8 }) => {
//   // Create pairs of shop cards for the grid (2 columns)
//   const shopPairs = [];
//   for (let i = 0; i < shopCount; i += 2) {
//     shopPairs.push([i, i + 1]);
//   }

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           backgroundColor: isDarkMode ? 'black' : '#fff',
//         },
//       ]}
//     >
//       {/* Search Bar Shimmer */}
//       <SearchBarShimmer isDarkMode={isDarkMode} />

//       {/* Shop Grid Shimmer */}
//       <View style={styles.gridContainer}>
//         {shopPairs.map((pair, index) => (
//           <View key={index} style={styles.rowContainer}>
//             <ShopCardShimmer isDarkMode={isDarkMode} />
//             {pair[1] < shopCount && <ShopCardShimmer isDarkMode={isDarkMode} />}
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 30,
//     margin: 10,
//     padding: 4,
//     marginTop: 10,
//     paddingHorizontal: 15,
//     gap: 10,
//     height: 50,
//   },
//   gridContainer: {
//     paddingHorizontal: 10,
//     flex: 1,
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   cardContainer: {
//     borderRadius: 10,
//     margin: 8,
//     flex: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     borderWidth: 1,
//     padding: 7,
//     maxWidth: (width - 52) / 2, // Accounting for margins and padding
//   },
// });

// export default ShopsShimmerLoader;


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