

// import React, { useEffect } from 'react';
// import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
// import { useSelector } from 'react-redux';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withSequence,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');

// const MessageListShimmer = () => {
//   const { isDarkMode } = useSelector(state => state.theme);
//   const shimmerAnimatedValue = useSharedValue(0);

//   useEffect(() => {
//     shimmerAnimatedValue.value = withRepeat(
//       withSequence(
//         withTiming(1, { duration: 1200 }),
//         withTiming(0, { duration: 1200 })
//       ),
//       -1, // infinite
//       false
//     );
//   }, []);

//   const ShimmerBox = ({ style }) => {
//     const shimmerStyle = useAnimatedStyle(() => {
//       const opacity = interpolate(
//         shimmerAnimatedValue.value,
//         [0, 1],
//         [0.3, 0.8]
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
//             styles.shimmerBox,
//             { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' },
//             style,
//           ]}
//         >
//           <Animated.View
//             style={[
//               styles.shimmerOverlay,
//               {
//                 backgroundColor: isDarkMode ? '#555' : '#f5f5f5',
//               },
//               shimmerStyle,
//             ]}
//           />
//         </View>
//       </View>
//     );
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? 'black' : '#fff',
//     },
//     shimmerContainer: {
//       overflow: 'hidden',
//     },
//     shimmerBox: {
//       overflow: 'hidden',
//     },
//     shimmerOverlay: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       width: '100%',
//       height: '100%',
//     },
//     // Header shimmer
//     header: {
//       paddingTop: 50,
//       paddingHorizontal: 20,
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: 10,
//     },
//     headerButton: {
//       width: 24,
//       height: 24,
//       borderRadius: 12,
//     },
//     headerTitle: {
//       width: 80,
//       height: 24,
//       borderRadius: 12,
//     },
//     // Search bar shimmer
//     searchContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
//       borderRadius: 30,
//       margin: 10,
//       padding: 4,
//       marginTop: 30,
//       paddingHorizontal: 15,
//       height: 50,
//     },
//     searchIcon: {
//       width: 20,
//       height: 20,
//       borderRadius: 10,
//       marginRight: 10,
//     },
//     searchInput: {
//       flex: 1,
//       height: 20,
//       borderRadius: 10,
//     },
//     // Message card shimmer
//     messageCard: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingVertical: 12,
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#333' : '#EEE',
//       padding: 16,
//       paddingVertical: 15,
//     },
//     profileContainer: {
//       marginRight: 12,
//     },
//     avatar: {
//       width: 44,
//       height: 44,
//       borderRadius: 22,
//     },
//     detailsContainer: {
//       flex: 1,
//     },
//     nameShimmer: {
//       width: '60%',
//       height: 16,
//       borderRadius: 8,
//       marginBottom: 8,
//     },
//     messageShimmer: {
//       width: '80%',
//       height: 14,
//       borderRadius: 7,
//     },
//     // List container
//     listContainer: {
//       flex: 1,
//       marginTop: 10,
//     },
//   });

//   // Generate shimmer message cards
//   const shimmerMessageCards = Array.from({ length: 10 }, (_, index) => (
//     <View key={index} style={styles.messageCard}>
//       {/* Profile Image */}
//       <View style={styles.profileContainer}>
//         <ShimmerBox style={styles.avatar} />
//       </View>

//       {/* Message Details */}
//       <View style={styles.detailsContainer}>
//         <ShimmerBox style={styles.nameShimmer} />
//         <ShimmerBox style={styles.messageShimmer} />
//       </View>
//     </View>
//   ));

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor="transparent"
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />

//       {/* Header Shimmer */}
//       <SpaceBetweenRow style={styles.header}>
//         <ShimmerBox style={styles.headerButton} />
//         <ShimmerBox style={styles.headerTitle} />
//         <ShimmerBox style={styles.headerButton} />
//       </SpaceBetweenRow>

//       {/* Search Bar Shimmer */}
//       <View style={styles.searchContainer}>
//         <ShimmerBox style={styles.searchIcon} />
//         <ShimmerBox style={styles.searchInput} />
//       </View>

//       {/* Messages List Shimmer */}
//       <View style={styles.listContainer}>{shimmerMessageCards}</View>
//     </View>
//   );
// };

// export default MessageListShimmer;



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