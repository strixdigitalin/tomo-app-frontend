
import React, { useEffect, useRef, useMemo, memo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

/**
 * GlowWrapper - Reusable animated glow effect component
 *
 * Props:
 * - children: Component to wrap
 * - isDarkMode: boolean for theme
 * - borderRadius: number (default: 30)
 * - showShinePatches: boolean (default: true)
 * - containerStyle: additional styles for container
 * - intensity: 'low' | 'medium' | 'high' (default: 'medium')
 * - disabled: boolean (default: false) - disable animations for performance
 * - glowColors: array of two colors (default: ['#21B7FF', '#0084F8'])
 */

const GlowWrapper = memo(({
  children,
  isDarkMode = false,
  borderRadius = 30,
  showShinePatches = true,
  containerStyle = {},
  intensity = 'medium',
  disabled = false,
  glowColors = ['#21B7FF', '#0084F8'], // Default blue gradient
}) => {
  // Animation refs
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shine1 = useRef(new Animated.Value(0)).current;
  const shine2 = useRef(new Animated.Value(0)).current;
  const shine3 = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);
  const animationsRef = useRef([]);

  // Convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Intensity configs
  const intensityConfig = useMemo(() => {
    const configs = {
      low: {
        glowDuration: 4000,
        shadowOpacity: [0.2, 0.4],
        starOpacity: 0.6,
        borderOpacity: [0.3, 1],
      },
      medium: {
        glowDuration: 3000,
        shadowOpacity: [0.3, 0.7],
        starOpacity: 0.8,
        borderOpacity: [0.4, 1],
      },
      high: {
        glowDuration: 2000,
        shadowOpacity: [0.4, 1],
        starOpacity: 1,
        borderOpacity: [0.5, 1],
      },
    };
    return configs[intensity] || configs.medium;
  }, [intensity]);

  useEffect(() => {
    isMounted.current = true;
    animationsRef.current = [];
    
    if (disabled) return;

    try {
      // Border glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: intensityConfig.glowDuration,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      animationsRef.current.push(glowAnimation);

      // Shine patches animations
      if (showShinePatches) {
        const shine1Animation = Animated.loop(
          Animated.sequence([
            Animated.timing(shine1, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(shine1, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        );

        const shine2Animation = Animated.loop(
          Animated.sequence([
            Animated.delay(1000),
            Animated.timing(shine2, {
              toValue: 1,
              duration: 3500,
              useNativeDriver: true,
            }),
            Animated.timing(shine2, {
              toValue: 0,
              duration: 3500,
              useNativeDriver: true,
            }),
          ])
        );

        const shine3Animation = Animated.loop(
          Animated.sequence([
            Animated.delay(2000),
            Animated.timing(shine3, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(shine3, {
              toValue: 0,
              duration: 4000,
              useNativeDriver: true,
            }),
          ])
        );

        animationsRef.current.push(shine1Animation, shine2Animation, shine3Animation);
      }

      // Start all animations if component is still mounted
      if (isMounted.current && animationsRef.current.length > 0) {
        animationsRef.current.forEach(anim => {
          try {
            anim.start();
          } catch (error) {
            console.warn('GlowWrapper: Error starting animation', error);
          }
        });
      }
    } catch (error) {
      console.warn('GlowWrapper: Animation setup error:', error);
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (animationsRef.current && animationsRef.current.length > 0) {
        animationsRef.current.forEach(anim => {
          try {
            if (anim && typeof anim.stop === 'function') {
              anim.stop();
            }
          } catch (error) {
            // Silently handle cleanup errors
          }
        });
      }
      animationsRef.current = [];
    };
  }, [showShinePatches, disabled, intensityConfig.glowDuration]);

  // Interpolations with custom colors
  const borderColor = useMemo(() => {
    const [color1, color2] = glowColors;
    
    if (disabled) {
      return hexToRgba(color1, isDarkMode ? 0.4 : 0.3);
    }
    
    try {
      return glowAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [
          hexToRgba(color1, isDarkMode ? intensityConfig.borderOpacity[0] : intensityConfig.borderOpacity[0] * 0.7),
          hexToRgba(color2, isDarkMode ? intensityConfig.borderOpacity[1] : intensityConfig.borderOpacity[1] * 0.8),
          hexToRgba(color1, isDarkMode ? intensityConfig.borderOpacity[0] : intensityConfig.borderOpacity[0] * 0.7),
        ],
      });
    } catch (error) {
      return hexToRgba(color1, isDarkMode ? 0.4 : 0.3);
    }
  }, [disabled, isDarkMode, glowAnim, intensityConfig.borderOpacity, glowColors]);

  const shadowOpacity = useMemo(() => {
    if (disabled) return 0.3;
    
    try {
      return glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: intensityConfig.shadowOpacity,
      });
    } catch (error) {
      return 0.3;
    }
  }, [disabled, glowAnim, intensityConfig.shadowOpacity]);

  const shadowColor = glowColors[0]; // Use first color for shadow

  return (
    <Animated.View
      style={[
        {
          borderRadius: borderRadius,
          borderWidth: 3,
          borderColor: borderColor,
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: shadowOpacity,
          shadowRadius: 15,
        //   elevation: Platform.OS === 'android' ? 5 : 0,
          backgroundColor: hexToRgba(glowColors[0], isDarkMode ? 0.05 : 0.03),
        },
        containerStyle,
      ]}
      removeClippedSubviews={true}
    >
      {/* Glass reflection overlay - Top gradient */}
      <View
        style={[
          styles.glassOverlay,
          {
            height: '40%',
            borderTopLeftRadius: Math.max(0, borderRadius - 2),
            borderTopRightRadius: Math.max(0, borderRadius - 2),
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.25)',
          }
        ]}
        pointerEvents="none"
      />
      
      {/* Glass border overlay */}
      <View
        style={[
          styles.glassBorder,
          {
            borderRadius: Math.max(0, borderRadius - 2),
            borderColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.3)',
          }
        ]}
        pointerEvents="none"
      />

      {/* Shine Patches with custom colors */}
      {showShinePatches && !disabled && (
        <>
          <Animated.View
            style={[
              styles.shinePatch,
              {
                top: 30,
                left: 20,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: hexToRgba(glowColors[0], isDarkMode ? 0.15 : 0.1),
                opacity: shine1,
              }
            ]}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              styles.shinePatch,
              {
                top: 80,
                right: 15,
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: hexToRgba(glowColors[1], isDarkMode ? 0.12 : 0.08),
                opacity: shine2,
              }
            ]}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              styles.shinePatch,
              {
                bottom: 40,
                left: '30%',
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: hexToRgba(glowColors[0], isDarkMode ? 0.1 : 0.06),
                opacity: shine3,
              }
            ]}
            pointerEvents="none"
          />
        </>
      )}

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    zIndex: 0,
  },
  shinePatch: {
    position: 'absolute',
    zIndex: 1,
  },
  content: {
    zIndex: 10,
  },
});

GlowWrapper.displayName = 'GlowWrapper';

// export default ;
export default React.memo(GlowWrapper);



