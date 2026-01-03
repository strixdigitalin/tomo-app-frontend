// import * as React from 'react';
// import { Keyboard } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { verticalScale } from 'react-native-size-matters';
// import { white } from '../../common/Colors/colors';
// import Home from '../../screens/Home/Home';

// import { TouchableOpacity, View } from 'react-native';

// import { ActiveHome, ActiveHomeNew, ActiveMessage, ActiveSearch, BottomTabLinenew, DeActiveHomeWhite, DeActiveSearch, DeactiveWhiteMsg, DeActiveWhiteSearch, MarkeActive, MarketDeactive, MarketDeactiveForLite, MarketplaceActiveTabNew, MessageActiveTabNew, SearchActiveTabNew, TabBottomLine } from '../../assets/SVGs';
// import { MidIcon } from '../../assets/SVGs';
// import { DeActiveMsg } from '../../assets/SVGs';
// import { DeActiveLast } from '../../assets/SVGs';
// import { DeActiveHome } from '../../assets/SVGs';
// import SearchScreen from '../../screens/Search/SearchFeed';
// import MessageList from '../../screens/Message/MessageList';
// import Followers from '../../screens/Followers/Followers';
// import OptionModal from '../AddPostModel';
// import UserDetail from '../../screens/UserDetail/UserDetail';
// import { useSelector } from 'react-redux';
// import MarketPlace from '../../MarketPlace/MarketPlace';
// import Shops from '../../screens/Shops/Shops';

// const Tab = createBottomTabNavigator();
// function TabNavigation() {
//   // const [modalVisible, setModalVisible] = React.useState(false);
//   const { isDarkMode } = useSelector(state => state.theme);
//   const [keyboardVisible, setKeyboardVisible] = React.useState(false);

//   let selector = useSelector(state => state?.user?.userData);
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector);
//   }

//   console.log("selector in +++++++++++tab navigation", selector);

//   React.useEffect(() => {
//     const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardVisible(true);
//     });
//     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardVisible(false);
//     });

//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);
//   return (
//     <>
//       <Tab.Navigator
//         initialRouteName="Home"
//         screenOptions={{
//           headerShown: false,
//           tabBarStyle: keyboardVisible ? { display: 'none' } : {
//             position: 'absolute',
//             height: verticalScale(60),
//             justifyContent: 'center',
//             alignItems: 'center',
//             elevation: 20,
//             shadowColor: '#000',
//             backgroundColor: isDarkMode ? '#252525' : white,
//             // borderTopRightRadius: 20,
//             // borderTopLeftRadius: 20,
//             alignSelf: 'center',
//             elevation: 1
//           },

//           // tabBarStyle: {
//           //   position: 'absolute',
//           //   // bottom: verticalScale(20),
//           //   height: verticalScale(80),
//           //   justifyContent: 'center',
//           //   alignItems: 'center',
//           //   elevation: 20,
//           //   shadowColor: '#000',
//           //   backgroundColor: isDarkMode ? '#252525' : white,
//           //   borderTopRightRadius: 20,
//           //   borderTopLeftRadius: 20,
//           //   // borderRadius: 16,
//           //   alignSelf: 'center',
//           //   borderTopLeftRadius: 20,
//           //   borderTopRightRadius: 20,
//           //   elevation: 1
//           // },
//         }}>
//         <Tab.Screen
//           name="Home"
//           component={Home}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) =>
//               focused ? (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   <ActiveHomeNew />
//                   <BottomTabLinenew style={{ top: 15 }} />
//                 </View>
//               ) : (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   {isDarkMode ? <DeActiveHomeWhite /> : <DeActiveHome />}
//                 </View>
//               ),
//           }}
//         />
        
//         {
//         // selector?.
//         //   SellerStatus == 'Approved' && 
//           <Tab.Screen
//             name="MarketPlace"
//             // component={MarketPlace}
//             component={Shops}
//             options={{
//               tabBarLabel: () => null,
//               tabBarIcon: ({ focused }) =>
//                 focused ? (
//                   <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                     <MarketplaceActiveTabNew />
//                   <BottomTabLinenew style={{ top: 15 }} />
                 

//                   </View>
//                 ) : (
//                   <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                     {isDarkMode ? <MarketDeactive /> : <MarketDeactiveForLite />}
//                   </View>
//                 ),
//             }}
//           />}

//         <Tab.Screen
//           name="Search"
//           component={SearchScreen}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) =>
//               focused ? (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   <SearchActiveTabNew />
//                   <BottomTabLinenew style={{ top: 15 }} />
               

//                 </View>
//               ) : (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   {isDarkMode ? <DeActiveWhiteSearch /> : <DeActiveSearch />}
//                 </View>
//               ),
//           }}
//         />

//         {/* <Tab.Screen
//           name="Mid"
//           component={Home}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) =>
//               focused ? (
//                 <TouchableOpacity style={{ alignItems: 'center', top: 0, width: 100 }}
//                   onPress={() => setModalVisible(true)}
//                 >
//                   <MidIcon />
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity style={{ alignItems: 'center', top: 0, width: 100 }}
//                   onPress={() => setModalVisible(true)}
//                 >
//                   <MidIcon />
//                 </TouchableOpacity>
//               ),
//           }}
//         /> */}
//         <Tab.Screen
//           name="Msg"
//           component={MessageList}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) =>
//               focused ? (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   <MessageActiveTabNew />
//                   <BottomTabLinenew style={{ top: 15 }} />
               

//                 </View>
//               ) : (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   {isDarkMode ? <DeactiveWhiteMsg /> : <DeActiveMsg />}
//                 </View>
//               ),
//           }}
//         />

//         <Tab.Screen
//           name="last"
//           // component={Followers}
//           component={UserDetail}

//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) =>
//               focused ? (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   <DeActiveLast />
//                   <BottomTabLinenew style={{ top: 15 }} />
               

//                 </View>
//               ) : (
//                 <View style={{ alignItems: 'center', top: 16, width: 100 }}>
//                   <DeActiveLast />
//                 </View>
//               ),
//           }}
//         />
//       </Tab.Navigator>
//       {/* <OptionModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       /> */}
//     </>
//   );
// }

// export default TabNavigation;





// import * as React from 'react';
// import { Keyboard, StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { verticalScale } from 'react-native-size-matters';
// import { white } from '../../common/Colors/colors';
// import Home from '../../screens/Home/Home';
// import { TouchableOpacity, View } from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withTiming,
//   withRepeat,
//   withSequence,
//   withDelay,
//   interpolate,
//   Extrapolate,
//   Easing,
//   runOnJS,
// } from 'react-native-reanimated';
// import { LinearGradient } from 'react-native-linear-gradient';

// import {
//   ActiveHome,
//   ActiveHomeNew,
//   ActiveMessage,
//   ActiveSearch,
//   BottomTabLinenew,
//   DeActiveHomeWhite,
//   DeActiveSearch,
//   DeactiveWhiteMsg,
//   DeActiveWhiteSearch,
//   MarkeActive,
//   MarketDeactive,
//   MarketDeactiveForLite,
//   MarketplaceActiveTabNew,
//   MessageActiveTabNew,
//   SearchActiveTabNew,
//   TabBottomLine,
// } from '../../assets/SVGs';
// import { MidIcon } from '../../assets/SVGs';
// import { DeActiveMsg } from '../../assets/SVGs';
// import { DeActiveLast } from '../../assets/SVGs';
// import { DeActiveHome } from '../../assets/SVGs';
// import SearchScreen from '../../screens/Search/SearchFeed';
// import MessageList from '../../screens/Message/MessageList';
// import Followers from '../../screens/Followers/Followers';
// import OptionModal from '../AddPostModel';
// import UserDetail from '../../screens/UserDetail/UserDetail';
// import { useSelector } from 'react-redux';
// import MarketPlace from '../../MarketPlace/MarketPlace';
// import Shops from '../../screens/Shops/Shops';

// const Tab = createBottomTabNavigator();

// // Premium Animated Tab Icon Component
// const AnimatedTabIcon = ({ focused, children, index, isDarkMode }) => {
//   const scale = useSharedValue(0);
//   const translateY = useSharedValue(50);
//   const opacity = useSharedValue(0);
//   const rotation = useSharedValue(-180);
//   const glowOpacity = useSharedValue(0);
//   const pulseScale = useSharedValue(1);

//   React.useEffect(() => {
//     // Spectacular entrance animation
//     const delay = index * 150;
    
//     setTimeout(() => {
//       // Main entrance
//       scale.value = withSequence(
//         withSpring(1.3, { damping: 8, stiffness: 100 }),
//         withSpring(1, { damping: 12, stiffness: 150 })
//       );
      
//       translateY.value = withSpring(0, {
//         damping: 20,
//         stiffness: 90,
//         mass: 1,
//       });
      
//       opacity.value = withTiming(1, { duration: 600 });
      
//       rotation.value = withSequence(
//         withTiming(10, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
//         withSpring(0, { damping: 15 })
//       );
//     }, delay);
//   }, []);

//   React.useEffect(() => {
//     if (focused) {
//       // Epic focus animation
//       scale.value = withSequence(
//         withSpring(1.35, { damping: 8, stiffness: 100 }),
//         withSpring(1.15, { damping: 10, stiffness: 120 })
//       );
      
//       // Continuous pulse
//       pulseScale.value = withRepeat(
//         withSequence(
//           withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
//           withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
//         ),
//         -1,
//         true
//       );
      
//       // Glow effect
//       glowOpacity.value = withRepeat(
//         withSequence(
//           withTiming(0.8, { duration: 1000 }),
//           withTiming(0.3, { duration: 1000 })
//         ),
//         -1,
//         true
//       );
      
//       // 3D rotation
//       rotation.value = withSequence(
//         withTiming(-8, { duration: 150 }),
//         withTiming(8, { duration: 150 }),
//         withTiming(-5, { duration: 150 }),
//         withSpring(0, { damping: 12 })
//       );
//     } else {
//       scale.value = withSpring(0.85, { damping: 15 });
//       pulseScale.value = withTiming(1, { duration: 300 });
//       glowOpacity.value = withTiming(0, { duration: 300 });
//       rotation.value = withSpring(0, { damping: 15 });
//     }
//   }, [focused]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { scale: scale.value * pulseScale.value },
//         { translateY: translateY.value },
//         { perspective: 1000 },
//         { rotateZ: `${rotation.value}deg` },
//         { rotateY: `${interpolate(rotation.value, [-10, 10], [-15, 15])}deg` },
//       ],
//       opacity: opacity.value,
//     };
//   });

//   const glowStyle = useAnimatedStyle(() => {
//     return {
//       opacity: glowOpacity.value,
//       transform: [{ scale: interpolate(glowOpacity.value, [0, 1], [0.8, 1.3]) }],
//     };
//   });

//   return (
//     <Animated.View style={[styles.iconContainer, animatedStyle]}>
//       {focused && (
//         <Animated.View style={[styles.glowContainer, glowStyle]}>
//           <LinearGradient
//             colors={['rgba(33, 183, 255, 0.4)', 'rgba(0, 132, 248, 0.6)', 'rgba(33, 183, 255, 0.4)']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.glowGradient}
//           />
//         </Animated.View>
//       )}
//       {children}
//     </Animated.View>
//   );
// };

// // Premium Animated Bottom Line
// const AnimatedBottomLine = () => {
//   const scaleX = useSharedValue(0);
//   const translateX = useSharedValue(-50);
//   const shimmer = useSharedValue(0);

//   React.useEffect(() => {
//     scaleX.value = withSpring(1, {
//       damping: 15,
//       stiffness: 120,
//     });
    
//     translateX.value = withSpring(0, {
//       damping: 15,
//       stiffness: 120,
//     });

//     // Shimmer effect
//     shimmer.value = withRepeat(
//       withSequence(
//         withTiming(1, { duration: 1500 }),
//         withTiming(0, { duration: 0 })
//       ),
//       -1,
//       false
//     );
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { scaleX: scaleX.value },
//         { translateX: translateX.value },
//       ],
//       top: 15,
//     };
//   });

//   const shimmerStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { 
//           translateX: interpolate(
//             shimmer.value,
//             [0, 1],
//             [-100, 100]
//           ) 
//         }
//       ],
//     };
//   });

//   return (
//     <Animated.View style={animatedStyle}>
//       <View style={{ position: 'relative', overflow: 'hidden' }}>
//         <BottomTabLinenew />
//         <Animated.View 
//           style={[
//             {
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: 'rgba(255, 255, 255, 0.5)',
//               width: 30,
//             },
//             shimmerStyle
//           ]} 
//         />
//       </View>
//     </Animated.View>
//   );
// };

// // Floating Particles for Tab Bar
// const FloatingParticle = ({ index, isDarkMode }) => {
//   const translateY = useSharedValue(0);
//   const translateX = useSharedValue(0);
//   const opacity = useSharedValue(0);
//   const scale = useSharedValue(0.5);

//   React.useEffect(() => {
//     const delay = index * 200;
    
//     setTimeout(() => {
//       translateY.value = withRepeat(
//         withSequence(
//           withTiming(-10, { duration: 2000 + index * 300, easing: Easing.inOut(Easing.ease) }),
//           withTiming(0, { duration: 2000 + index * 300, easing: Easing.inOut(Easing.ease) })
//         ),
//         -1,
//         true
//       );
      
//       translateX.value = withRepeat(
//         withSequence(
//           withTiming(Math.random() * 10 - 5, { duration: 1500 + index * 200 }),
//           withTiming(0, { duration: 1500 + index * 200 })
//         ),
//         -1,
//         true
//       );
      
//       opacity.value = withRepeat(
//         withSequence(
//           withTiming(0.6, { duration: 1000 }),
//           withTiming(0.2, { duration: 1000 })
//         ),
//         -1,
//         true
//       );
      
//       scale.value = withRepeat(
//         withSequence(
//           withTiming(1, { duration: 1500 }),
//           withTiming(0.5, { duration: 1500 })
//         ),
//         -1,
//         true
//       );
//     }, delay);
//   }, []);

//   const particleStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateY: translateY.value },
//         { translateX: translateX.value },
//         { scale: scale.value },
//       ],
//       opacity: opacity.value,
//     };
//   });

//   return (
//     <Animated.View 
//       style={[
//         {
//           position: 'absolute',
//           width: 4,
//           height: 4,
//           borderRadius: 2,
//           backgroundColor: isDarkMode ? '#21B7FF' : '#0084F8',
//           left: `${(index + 1) * 16}%`,
//           bottom: 10,
//         },
//         particleStyle
//       ]} 
//     />
//   );
// };

// function TabNavigation() {
//   const { isDarkMode } = useSelector(state => state.theme);
//   const [keyboardVisible, setKeyboardVisible] = React.useState(false);

//   // Tab bar animations
//   const tabBarTranslateY = useSharedValue(150);
//   const tabBarOpacity = useSharedValue(0);
//   const tabBarScale = useSharedValue(0.8);

//   let selector = useSelector(state => state?.user?.userData);
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector);
//   }

//   React.useEffect(() => {
//     // Epic tab bar entrance
//     tabBarTranslateY.value = withDelay(
//       300,
//       withSpring(0, {
//         damping: 25,
//         stiffness: 100,
//         mass: 1.2,
//       })
//     );
    
//     tabBarOpacity.value = withDelay(
//       300,
//       withTiming(1, { duration: 800 })
//     );
    
//     tabBarScale.value = withDelay(
//       300,
//       withSequence(
//         withSpring(1.1, { damping: 10 }),
//         withSpring(1, { damping: 15 })
//       )
//     );
//   }, []);

//   React.useEffect(() => {
//     const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardVisible(true);
//     });
//     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardVisible(false);
//     });

//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);

//   const tabBarAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateY: tabBarTranslateY.value },
//         { scale: tabBarScale.value },
//       ],
//       opacity: tabBarOpacity.value,
//     };
//   });

//   return (
//     <>
//       <Tab.Navigator
//         initialRouteName="Home"
//         screenOptions={{
//           headerShown: false,
//           tabBarStyle: keyboardVisible
//             ? { display: 'none' }
//             : {
//                 position: 'absolute',
//                 height: verticalScale(60),
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 elevation: 20,
//                 shadowColor: isDarkMode ? '#21B7FF' : '#0084F8',
//                 shadowOffset: { width: 0, height: -4 },
//                 shadowOpacity: 0.3,
//                 shadowRadius: 15,
//                 backgroundColor: isDarkMode ? '#252525' : white,
//                 alignSelf: 'center',
//                 borderTopWidth: 0.5,
//                 borderTopColor: isDarkMode ? 'rgba(33, 183, 255, 0.2)' : 'rgba(0, 132, 248, 0.1)',
//               },
//           tabBarBackground: () => (
//             <Animated.View style={[{ flex: 1 }, tabBarAnimatedStyle]}>
//               <LinearGradient
//                 colors={
//                   isDarkMode 
//                     ? ['#252525', '#1a1a1a'] 
//                     : [white, '#f8f9fa']
//                 }
//                 style={{ flex: 1 }}
//               />
//               {/* Floating Particles */}
//               {[0, 1, 2, 3, 4, 5].map((i) => (
//                 <FloatingParticle key={i} index={i} isDarkMode={isDarkMode} />
//               ))}
//             </Animated.View>
//           ),
//         }}
//       >
//         <Tab.Screen
//           name="Home"
//           component={Home}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) => (
//               <AnimatedTabIcon focused={focused} index={0} isDarkMode={isDarkMode}>
//                 {focused ? (
//                   <>
//                     <ActiveHomeNew />
//                     <AnimatedBottomLine />
//                   </>
//                 ) : (
//                   <>
//                     {isDarkMode ? <DeActiveHomeWhite /> : <DeActiveHome />}
//                   </>
//                 )}
//               </AnimatedTabIcon>
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="MarketPlace"
//           component={Shops}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) => (
//               <AnimatedTabIcon focused={focused} index={1} isDarkMode={isDarkMode}>
//                 {focused ? (
//                   <>
//                     <MarketplaceActiveTabNew />
//                     <AnimatedBottomLine />
//                   </>
//                 ) : (
//                   <>
//                     {isDarkMode ? <MarketDeactive /> : <MarketDeactiveForLite />}
//                   </>
//                 )}
//               </AnimatedTabIcon>
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="Search"
//           component={SearchScreen}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) => (
//               <AnimatedTabIcon focused={focused} index={2} isDarkMode={isDarkMode}>
//                 {focused ? (
//                   <>
//                     <SearchActiveTabNew />
//                     <AnimatedBottomLine />
//                   </>
//                 ) : (
//                   <>
//                     {isDarkMode ? <DeActiveWhiteSearch /> : <DeActiveSearch />}
//                   </>
//                 )}
//               </AnimatedTabIcon>
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="Msg"
//           component={MessageList}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) => (
//               <AnimatedTabIcon focused={focused} index={3} isDarkMode={isDarkMode}>
//                 {focused ? (
//                   <>
//                     <MessageActiveTabNew />
//                     <AnimatedBottomLine />
//                   </>
//                 ) : (
//                   <>
//                     {isDarkMode ? <DeactiveWhiteMsg /> : <DeActiveMsg />}
//                   </>
//                 )}
//               </AnimatedTabIcon>
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="last"
//           component={UserDetail}
//           options={{
//             tabBarLabel: () => null,
//             tabBarIcon: ({ focused }) => (
//               <AnimatedTabIcon focused={focused} index={4} isDarkMode={isDarkMode}>
//                 <DeActiveLast />
//                 {focused && <AnimatedBottomLine />}
//               </AnimatedTabIcon>
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   iconContainer: {
//     alignItems: 'center',
//     top: 16,
//     width: 100,
//   },
//   glowContainer: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     top: -10,
//   },
//   glowGradient: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 30,
//   },
// });

// export default TabNavigation;


import * as React from 'react';
import { Keyboard, StyleSheet, Dimensions } from 'react-native';
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
  runOnJS,
  useDerivedValue,
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

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Ultra Smooth Tab Icon with Bounce and Glow Effect
const AnimatedTabIcon = ({ focused, children, index }) => {
  const scale = useSharedValue(0.3);
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(-15);
  const glowOpacity = useSharedValue(0);

  React.useEffect(() => {
    // Sexy cascade entrance with bounce
    const delay = index * 100;
    
    setTimeout(() => {
      // Main entrance animation
      scale.value = withSequence(
        withSpring(focused ? 1.2 : 1, {
          damping: 8,
          stiffness: 100,
        }),
        withSpring(focused ? 1 : 0.85, {
          damping: 15,
          stiffness: 90,
        })
      );

      translateY.value = withSequence(
        withSpring(-10, {
          damping: 10,
          stiffness: 120,
        }),
        withSpring(0, {
          damping: 20,
          stiffness: 90,
        })
      );

      rotate.value = withSpring(0, {
        damping: 15,
        stiffness: 80,
      });

      opacity.value = withTiming(1, { 
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, delay);
  }, []);

  React.useEffect(() => {
    if (focused) {
      // Active state with sexy bounce
      scale.value = withSequence(
        withSpring(1.3, {
          damping: 10,
          stiffness: 150,
        }),
        withSpring(1.1, {
          damping: 15,
          stiffness: 100,
        })
      );

      translateY.value = withSequence(
        withSpring(-15, {
          damping: 8,
          stiffness: 120,
        }),
        withSpring(-8, {
          damping: 12,
          stiffness: 100,
        })
      );

      rotate.value = withSequence(
        withSpring(8, {
          damping: 10,
          stiffness: 100,
        }),
        withSpring(0, {
          damping: 15,
          stiffness: 80,
        })
      );

      // Glow effect
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0.4, { duration: 300 })
      );
    } else {
      // Inactive state with smooth transition
      scale.value = withSpring(0.85, {
        damping: 20,
        stiffness: 90,
      });

      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });

      rotate.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });

      glowOpacity.value = withTiming(0, { duration: 200 });
    }
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
      backgroundColor: '#21B7FF',
      opacity: glowOpacity.value * 0.3,
      transform: [{ scale: 1.5 }],
      zIndex: -1,
    };
  });

  return (
    <Animated.View style={[{ alignItems: 'center', top: 16, width: 100 }, animatedStyle]}>
      {focused && <Animated.View style={glowStyle} />}
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
  const { isDarkMode } = useSelector(state => state.theme);
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  
  const tabBarTranslateY = useSharedValue(100);
  const tabBarOpacity = useSharedValue(0);
  const tabBarScale = useSharedValue(0.9);

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

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      // Smooth hide animation
      tabBarTranslateY.value = withSpring(100, {
        damping: 20,
        stiffness: 90,
      });
      tabBarOpacity.value = withTiming(0, { duration: 200 });
    });
    
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      // Smooth show animation
      tabBarTranslateY.value = withSpring(0, {
        damping: 25,
        stiffness: 90,
      });
      tabBarOpacity.value = withTiming(1, { duration: 300 });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
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
        tabBarStyle: keyboardVisible
          ? { display: 'none' }
          : {
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
            <AnimatedTabIcon focused={focused} index={0}>
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
            <AnimatedTabIcon focused={focused} index={1}>
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
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} index={2}>
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
            <AnimatedTabIcon focused={focused} index={3}>
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
            <AnimatedTabIcon focused={focused} index={4}>
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