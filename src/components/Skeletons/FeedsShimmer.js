

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

// const FeedShimmerItem = ({ isDarkMode }) => {
//   const ShimmerComponent = isDarkMode ? ShimmerPlaceholderDark : ShimmerPlaceholder;
  
//   return (
//     <View style={[styles.feedContainer, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.userInfo}>
//           {/* Profile Image */}
//           <ShimmerComponent width={40} height={40} borderRadius={20} />
//           <View style={{ marginLeft: 10 }}>
//             {/* Username */}
//             <ShimmerComponent width={120} height={16} borderRadius={8} />
//             {/* Audio text placeholder */}
//             <ShimmerComponent width={80} height={12} borderRadius={6} style={{ marginTop: 4 }} />
//           </View>
//         </View>
//       </View>

//       {/* Post Image/Video */}
//       <ShimmerComponent width="100%" height={210} borderRadius={0} />

//       {/* Actions */}
//       <View style={styles.actions}>
//         <View style={styles.leftIcons}>
//           {/* Like, Comment, Share icons */}
//           <ShimmerComponent width={24} height={24} borderRadius={12} />
//           <ShimmerComponent width={24} height={24} borderRadius={12} />
//         </View>
//         <View style={styles.rightIcons}>
//           {/* Dislike and Save icons */}
//           <ShimmerComponent width={24} height={24} borderRadius={12} />
//           <ShimmerComponent width={24} height={24} borderRadius={12} style={{ marginLeft: 20 }} />
//         </View>
//       </View>

//       {/* Likes count */}
//       <View style={styles.likesContainer}>
//         <ShimmerComponent width={80} height={16} borderRadius={8} />
//       </View>

//       {/* Caption */}
//       <View style={styles.captionContainer}>
//         <ShimmerComponent width="90%" height={14} borderRadius={7} />
//         <ShimmerComponent width="70%" height={14} borderRadius={7} style={{ marginTop: 4 }} />
//       </View>

//       {/* Comments count */}
//       <View style={styles.commentsContainer}>
//         <ShimmerComponent width={100} height={14} borderRadius={7} />
//       </View>

//       {/* Time */}
//       <View style={styles.timeContainer}>
//         <ShimmerComponent width={60} height={12} borderRadius={6} />
//       </View>
//     </View>
//   );
// };

// const FeedShimmerLoader = ({ isDarkMode, count = 3 }) => {
//   return (
//     <View style={{ marginBottom: 90 }}>
//       {Array.from({ length: count }).map((_, index) => (
//         <FeedShimmerItem key={index} isDarkMode={isDarkMode} />
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   feedContainer: {
//     paddingBottom: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop: 8,
//     marginHorizontal: 10,
//   },
//   leftIcons: {
//     flexDirection: 'row',
//     gap: 15,
//   },
//   rightIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   likesContainer: {
//     paddingHorizontal: 10,
//     marginTop: 8,
//   },
//   captionContainer: {
//     paddingHorizontal: 10,
//     marginTop: 8,
//   },
//   commentsContainer: {
//     paddingHorizontal: 10,
//     marginTop: 8,
//   },
//   timeContainer: {
//     paddingHorizontal: 10,
//     marginTop: 5,
//   },
// });

// export default FeedShimmerLoader;


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