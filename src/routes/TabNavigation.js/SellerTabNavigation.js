import * as React from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { verticalScale } from 'react-native-size-matters';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import {
  ActiveHomeNew,
  BottomTabLinenew,
  DeActiveHome,
  DeActiveHomeWhite,
  DeActiveLast,
  DeActiveMsg,
  DeactiveWhiteMsg,
  MarketDeactive,
  MarketDeactiveForLite,
  MarketplaceActiveTabNew,
  MessageActiveTabNew,
} from '../../assets/SVGs';
import { THEMES } from '../../redux/reducer/theme';

import SellerHome from '../../screens/SellerFlow/SellerHome';
import SellerProduct from '../../screens/SellerFlow/SellerProduct';
import SellerChatList from '../../screens/SellerFlow/SellerChatList';
import SellerProfile from '../../screens/SellerFlow/SellerProfile';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Same animated icon treatment as the buyer TabNavigation, kept local so the
// seller flow stays a self-contained module.
const AnimatedTabIcon = ({ focused, children, index, glowColors }) => {
  const scale = useSharedValue(0.3);
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(-15);
  const glowOpacity = useSharedValue(0);

  React.useEffect(() => {
    const delay = index * 60;
    opacity.value = withDelay(delay, withTiming(1, { duration: 220 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 120 }));
    rotate.value = withDelay(delay, withTiming(0, { duration: 140 }));
  }, [index]);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.05 : 0.9, { damping: 18, stiffness: 130 });
    translateY.value = withSpring(focused ? -6 : 0, { damping: 18, stiffness: 130 });
    rotate.value = withTiming(0, { duration: 120 });
    glowOpacity.value = withTiming(focused ? 0.35 : 0, { duration: 180 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: glowOpacity.value * 0.3,
    transform: [{ scale: 1.5 }],
    zIndex: -1,
  }));

  return (
    <Animated.View style={[{ alignItems: 'center', top: 16, width: 100 }, animatedStyle]}>
      {focused && (
        <Animated.View style={glowStyle}>
          <LinearGradient
            colors={glowColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: '100%', height: '100%', borderRadius: 30 }}
          />
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );
};

const AnimatedBottomLine = () => {
  const scaleX = useSharedValue(0);
  const translateY = useSharedValue(10);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scaleX.value = withSequence(
      withSpring(0.3, { damping: 15, stiffness: 100 }),
      withSpring(1.2, { damping: 10, stiffness: 120 }),
      withSpring(1, { damping: 20, stiffness: 100 })
    );
    translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
    top: 15,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <BottomTabLinenew />
    </Animated.View>
  );
};

const AnimatedTabBarBackground = ({ isDarkMode, tabBarAnimatedStyle }) => {
  const gradientShift = useSharedValue(0);

  React.useEffect(() => {
    gradientShift.value = withSequence(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
    );
  }, []);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(gradientShift.value, [0, 1], [0.95, 1]),
  }));

  return (
    <Animated.View style={[{ flex: 1 }, tabBarAnimatedStyle, backgroundStyle]}>
      <LinearGradient
        colors={isDarkMode ? ['#2a2a2a', '#252525', '#1a1a1a'] : ['#ffffff', '#fafafa', '#f5f5f5']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

function SellerTabNavigation() {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);

  const tabBarTranslateY = useSharedValue(100);
  const tabBarOpacity = useSharedValue(0);
  const tabBarScale = useSharedValue(0.9);

  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const glowColors = [currentTheme.primary, currentTheme.secondary];

  React.useEffect(() => {
    tabBarTranslateY.value = withDelay(
      300,
      withSequence(
        withSpring(-10, { damping: 15, stiffness: 100 }),
        withSpring(0, { damping: 25, stiffness: 90 })
      )
    );
    tabBarOpacity.value = withDelay(200, withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
    tabBarScale.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 90 }));
  }, []);

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateY.value }, { scale: tabBarScale.value }],
    opacity: tabBarOpacity.value,
  }));

  return (
    <Tab.Navigator
      initialRouteName="SellerHome"
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        tabBarHideOnKeyboard: false,
        tabBarStyle: {
          position: 'absolute',
          height: verticalScale(60),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDarkMode ? 0.4 : 0.15,
          shadowRadius: 15,
        },
        tabBarBackground: () => (
          <AnimatedTabBarBackground isDarkMode={isDarkMode} tabBarAnimatedStyle={tabBarAnimatedStyle} />
        ),
      }}
    >
      <Tab.Screen
        name="SellerHome"
        component={SellerHome}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={0} glowColors={glowColors}>
              {focused ? (
                <>
                  <ActiveHomeNew />
                  <AnimatedBottomLine />
                </>
              ) : (
                <>{isDarkMode ? <DeActiveHomeWhite /> : <DeActiveHome />}</>
              )}
            </AnimatedTabIcon>
          ),
        }}
      />

      <Tab.Screen
        name="SellerProduct"
        component={SellerProduct}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={1} glowColors={glowColors}>
              {focused ? (
                <>
                  <MarketplaceActiveTabNew />
                  <AnimatedBottomLine />
                </>
              ) : (
                <>{isDarkMode ? <MarketDeactive /> : <MarketDeactiveForLite />}</>
              )}
            </AnimatedTabIcon>
          ),
        }}
      />

      <Tab.Screen
        name="SellerChatList"
        component={SellerChatList}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={2} glowColors={glowColors}>
              {focused ? (
                <>
                  <MessageActiveTabNew />
                  <AnimatedBottomLine />
                </>
              ) : (
                <>{isDarkMode ? <DeactiveWhiteMsg /> : <DeActiveMsg />}</>
              )}
            </AnimatedTabIcon>
          ),
        }}
      />

      <Tab.Screen
        name="SellerProfile"
        component={SellerProfile}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={3} glowColors={glowColors}>
              <DeActiveLast />
              {focused && <AnimatedBottomLine />}
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default SellerTabNavigation;
