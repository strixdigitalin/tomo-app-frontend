



import * as React from 'react';
import { StyleSheet, Dimensions, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { verticalScale } from 'react-native-size-matters';
import { white } from '../../common/Colors/colors';
import Home from '../../screens/Home/Home';
import { View } from 'react-native';
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

import {
  ActiveHomeNew,
  BottomTabLinenew,
  DeActiveHomeWhite,
  DeActiveSearch,
  DeactiveWhiteMsg,
  DeActiveWhiteSearch,
  MarketDeactive,
  MarketDeactiveForLite,
  MarketplaceActiveTabNew,
  MessageActiveTabNew,
  SearchActiveTabNew,
} from '../../assets/SVGs';
import { DeActiveMsg } from '../../assets/SVGs';
import { DeActiveLast } from '../../assets/SVGs';
import { DeActiveHome } from '../../assets/SVGs';
import SearchScreen from '../../screens/Search/SearchFeed';
import MessageList from '../../screens/Message/MessageList';
import UserDetail from '../../screens/UserDetail/UserDetail';
import { useSelector } from 'react-redux';
import Shops from '../../screens/Shops/Shops';
import { THEMES } from '../../redux/reducer/theme';
import IMG from '../../assets/Images';

import StoreScreen from '../../screens/E-commerce/EcoomerceProducts';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Ultra Smooth Tab Icon with Bounce and Glow Effect
const AnimatedTabIcon = ({ focused, children, index, glowColors }) => {
  const scale = useSharedValue(0.3);
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(-15);
  const glowOpacity = useSharedValue(0);

  React.useEffect(() => {
    const delay = index * 60;
    opacity.value = withDelay(delay, withTiming(1, { duration: 220 }));
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 20,
        stiffness: 120,
      }),
    );
    rotate.value = withDelay(delay, withTiming(0, { duration: 140 }));
  }, [index]);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.05 : 0.9, {
      damping: 18,
      stiffness: 130,
    });

    translateY.value = withSpring(focused ? -6 : 0, {
      damping: 18,
      stiffness: 130,
    });

    rotate.value = withTiming(0, { duration: 120 });
    glowOpacity.value = withTiming(focused ? 0.35 : 0, { duration: 180 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      opacity: glowOpacity.value * 0.3,
      transform: [{ scale: 1.5 }],
      zIndex: -1,
    };
  });

  return (
    <Animated.View style={[{ alignItems: 'center', top: 16, width: 100 }, animatedStyle]}>
      {focused && (
        <Animated.View style={glowStyle}>
          <LinearGradient
            colors={glowColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 30,
            }}
          />
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );
};

// Sexy Bottom Line with Wave Effect
const AnimatedBottomLine = () => {
  const scaleX = useSharedValue(0);
  const translateY = useSharedValue(10);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scaleX.value = withSequence(
      withSpring(0.3, {
        damping: 15,
        stiffness: 100,
      }),
      withSpring(1.2, {
        damping: 10,
        stiffness: 120,
      }),
      withSpring(1, {
        damping: 20,
        stiffness: 100,
      })
    );

    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
    });

    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: scaleX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
      top: 15,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <BottomTabLinenew />
    </Animated.View>
  );
};

// Animated Background with Gradient Shift
const AnimatedTabBarBackground = ({ isDarkMode, tabBarAnimatedStyle }) => {
  const gradientShift = useSharedValue(0);

  React.useEffect(() => {
    gradientShift.value = withSequence(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
    );
  }, []);

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(gradientShift.value, [0, 1], [0.95, 1]),
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, tabBarAnimatedStyle, backgroundStyle]}>
      <LinearGradient
        colors={
          isDarkMode
            ? ['#2a2a2a', '#252525', '#1a1a1a']
            : ['#ffffff', '#fafafa', '#f5f5f5']
        }
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

function TabNavigation() {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);

  const tabBarTranslateY = useSharedValue(100);
  const tabBarOpacity = useSharedValue(0);
  const tabBarScale = useSharedValue(0.9);

  // ✅ GET CURRENT THEME COLORS
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const primaryColor = currentTheme.primary;
  const secondaryColor = currentTheme.secondary;
  const glowColors = [primaryColor, secondaryColor];

  let selector = useSelector(state => state?.user?.userData);
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector);
  }

  React.useEffect(() => {
    // Sexy slide up with bounce
    tabBarTranslateY.value = withDelay(
      300,
      withSequence(
        withSpring(-10, {
          damping: 15,
          stiffness: 100,
        }),
        withSpring(0, {
          damping: 25,
          stiffness: 90,
        })
      )
    );

    tabBarOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    tabBarScale.value = withDelay(
      200,
      withSpring(1, {
        damping: 20,
        stiffness: 90,
      })
    );
  }, []);

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: tabBarTranslateY.value },
        { scale: tabBarScale.value },
      ],
      opacity: tabBarOpacity.value,
    };
  });

  return (
    <Tab.Navigator
      initialRouteName="Home"
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
          shadowColor: isDarkMode ? '#000' : '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDarkMode ? 0.4 : 0.15,
          shadowRadius: 15,
        },
        tabBarBackground: () => (
          <AnimatedTabBarBackground
            isDarkMode={isDarkMode}
            tabBarAnimatedStyle={tabBarAnimatedStyle}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
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
        name="MarketPlace"
        component={Shops}
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
        name="E-Commerce"
        component={StoreScreen}
        options={{
          unmountOnBlur: true,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={2} glowColors={glowColors}>
              {focused ? (
                <>
                  {/* <SearchActiveTabNew /> */}
                  <Image source={IMG.ecomerce} style={{ width: 24, height: 24 , tintColor:isDarkMode? white : 'black' }} />
                  <AnimatedBottomLine />
                </>
              ) : (
                <>{isDarkMode ? <Image source={IMG.ecomerce} style={{ width: 24, height: 24, tintColor:white }} /> : <Image source={IMG.ecomerce} style={{ width: 24, height: 24, tintColor:'black' }} />}</>
              )}
            </AnimatedTabIcon>
          ),
        }}
      />


      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          unmountOnBlur: true,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={2} glowColors={glowColors}>
              {focused ? (
                <>
                  <SearchActiveTabNew />
                  <AnimatedBottomLine />
                </>
              ) : (
                <>{isDarkMode ? <DeActiveWhiteSearch /> : <DeActiveSearch />}</>
              )}
            </AnimatedTabIcon>
          ),
        }}
      />

      <Tab.Screen
        name="Msg"
        component={MessageList}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={3} glowColors={glowColors}>
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
        name="last"
        component={UserDetail}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={4} glowColors={glowColors}>
              <DeActiveLast />
              {focused && <AnimatedBottomLine />}
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigation;