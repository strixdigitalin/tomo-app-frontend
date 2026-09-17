import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const ProfileShimmer = () => {
  const { isDarkMode } = useSelector(state => state.theme);
  const shimmerAnimatedValue = useSharedValue(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      shimmerAnimatedValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1, // infinite
        false
      );
    } else {
      shimmerAnimatedValue.value = 0;
    }
  }, [isFocused]);

  const ShimmerBox = ({ style }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        shimmerAnimatedValue.value,
        [0, 0.5, 1],
        [0.3, 0.6, 0.3]
      );

      return {
        opacity,
      };
    });

    return (
      <View
        style={[
          styles.shimmerBox,
          { backgroundColor: isDarkMode ? '#2a2a2a' : '#e0e0e0' },
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              backgroundColor: isDarkMode ? '#3a3a3a' : '#f0f0f0',
            },
            animatedStyle,
          ]}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
    },
    shimmerBox: {
      overflow: 'hidden',
    },
    shimmerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    // Header shimmer
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    headerText: {
      width: 150,
      height: 24,
      borderRadius: 12,
    },
    // Cover photo shimmer
    coverPhoto: {
      width: '100%',
      height: 200,
    },
    // Profile card shimmer
    profileCard: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      marginTop: -50,
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignSelf: 'center',
      marginBottom: 15,
    },
    profileName: {
      width: 180,
      height: 28,
      borderRadius: 14,
      alignSelf: 'center',
      marginBottom: 8,
    },
    profileTitle: {
      width: 120,
      height: 18,
      borderRadius: 9,
      alignSelf: 'center',
      marginBottom: 8,
    },
    profileLocation: {
      width: 140,
      height: 16,
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: 20,
    },
    // Action buttons shimmer
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 20,
    },
    actionButton: {
      width: 80,
      height: 40,
      borderRadius: 20,
    },
    // Stats shimmer
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      width: 40,
      height: 20,
      borderRadius: 10,
      marginBottom: 5,
    },
    statLabel: {
      width: 60,
      height: 14,
      borderRadius: 7,
    },
    // About section shimmer
    aboutSection: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      padding: 20,
    },
    sectionTitle: {
      width: 80,
      height: 20,
      borderRadius: 10,
      marginBottom: 12,
    },
    aboutText: {
      width: '100%',
      height: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    aboutTextShort: {
      width: '70%',
      height: 16,
      borderRadius: 8,
    },
    // Posts section shimmer
    postsSection: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 100,
      borderRadius: 12,
      padding: 20,
    },
    postsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    postImage: {
      width: '31%',
      height: 100,
      marginBottom: 8,
      borderRadius: 8,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header Shimmer */}
      <View style={styles.header}>
        <ShimmerBox style={styles.headerButton} />
        <ShimmerBox style={styles.headerText} />
        <ShimmerBox style={styles.headerButton} />
      </View>

      {/* Cover Photo Shimmer */}
      <ShimmerBox style={styles.coverPhoto} />

      {/* Profile Card Shimmer */}
      <View style={styles.profileCard}>
        <ShimmerBox style={styles.profileImage} />
        <ShimmerBox style={styles.profileName} />
        <ShimmerBox style={styles.profileTitle} />
        <ShimmerBox style={styles.profileLocation} />

        {/* Action Buttons Shimmer */}
        <View style={styles.actionButtons}>
          <ShimmerBox style={styles.actionButton} />
          <ShimmerBox style={styles.actionButton} />
          <ShimmerBox style={styles.actionButton} />
        </View>

        {/* Stats Shimmer */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ShimmerBox style={styles.statNumber} />
            <ShimmerBox style={styles.statLabel} />
          </View>
          <View style={styles.statItem}>
            <ShimmerBox style={styles.statNumber} />
            <ShimmerBox style={styles.statLabel} />
          </View>
        </View>
      </View>

      {/* About Section Shimmer */}
      <View style={styles.aboutSection}>
        <ShimmerBox style={styles.sectionTitle} />
        <ShimmerBox style={styles.aboutText} />
        <ShimmerBox style={styles.aboutText} />
        <ShimmerBox style={styles.aboutText} />
        <ShimmerBox style={styles.aboutTextShort} />
      </View>

      {/* Posts Section Shimmer */}
      <View style={styles.postsSection}>
        <ShimmerBox style={styles.sectionTitle} />
        <View style={styles.postsGrid}>
          {[...Array(6)].map((_, index) => (
            <ShimmerBox key={index} style={styles.postImage} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProfileShimmer;