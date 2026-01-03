// // import React, { useState, useEffect, useCallback } from 'react';
// // import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text, Animated } from 'react-native';
// // import { PrimaryBackArrow, PrimaryBackWhite, Search } from '../../assets/SVGs';
// // import Row from '../../components/wrapper/row';
// // import { FONTS_FAMILY } from '../../assets/Fonts';
// // import IMG from '../../assets/Images';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { white } from '../../common/Colors/colors';
// // import { apiGet, apiPost } from '../../utils/Apis';
// // import urls from '../../config/urls';
// // import useLoader from '../../utils/LoaderHook';
// // import { setUser } from '../../redux/reducer/user';
// // import { ToastMsg } from '../../utils/helperFunctions';
// // import ActivityShimmer from '../../components/Skeletons/ActivityShimmer';

// // const Activity = ({ navigation }) => {
// //     const [data, setData] = useState(DATA);
// //     const [searchText, setSearchText] = useState('');
// //     const [animatedValue] = useState(new Animated.Value(0));
// //     const { isDarkMode } = useSelector(state => state.theme);
// //     const { showLoader, hideLoader } = useLoader()
// //     const dispatch = useDispatch()

// //     const [loading, setLoading] = useState(false)
// //     const [allNotifications, setAllNotifications] = useState([])

// //     let selector = useSelector(state => state?.user?.userData);
// //     if (Object.keys(selector).length != 0) {
// //         selector = JSON.parse(selector);
// //     }

// //     // console.log('____Selector____', selector);


// //     useEffect(() => {
// //         // Animation for fade in effect
// //         Animated.timing(animatedValue, {
// //             toValue: 1,
// //             duration: 400,
// //             useNativeDriver: true,
// //         }).start();
// //     }, []);

// //     useEffect(() => {
// //         fetchData()
// //     }, [])

// //     const onAcceptReq = async (userId) => {
// //         try {
// //             showLoader()
// //             const res = await apiPost(`${urls?.acceptFollowReq}/${userId}`)
// //             console.log(res);
            
// //             const getUserProfile = apiGet(urls?.userProfile)
// //             dispatch(setUser(JSON.stringify(getUserProfile?.data)));
// //             ToastMsg('Follow Req Accepted')
// //             hideLoader()

// //         } catch (error) {
// //             console.log('Something went Wrong');
// //            ToastMsg(error?.message);
            
// //             hideLoader()
// //         }

// //     }



// //     const fetchData = async () => {
// //         setLoading(true)
// //         const res = await apiGet(urls.getAllNotifications)
// //         setAllNotifications(res?.data)
// //         setLoading(false)
// //         setLoading(false)

// //     }


  

// //     // Render header
// //     const renderHeader = () => (
// //         <Row style={styles.header}>
// //             <TouchableOpacity onPress={() => navigation.goBack()}>
// //                 {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
// //             </TouchableOpacity>
// //             <Text style={styles.headerText}>
// //                 Activity <Text style={styles.highlightedText}>({allNotifications.length})</Text>
// //             </Text>
// //         </Row>
// //     );


// //     const styles = StyleSheet.create({
// //         container: {
// //             flex: 1,
// //             backgroundColor: isDarkMode ? 'black' : '#fff',
// //         },
// //         header: {
// //             paddingTop: 50,
// //             paddingHorizontal: 20,
// //             gap: 90,
// //         },
// //         headerText: {
// //             fontSize: 20,
// //             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //             color: isDarkMode ? white : 'black'
// //         },
// //         highlightedText: {
// //             color: isDarkMode ? 'white' : 'rgba(79, 82, 254, 1)',
// //         },

// //         icon: {
// //             marginRight: 10,
// //         },
// //         searchInput: {
// //             flex: 1,
// //             fontSize: 16,
// //         },
// //         sectionHeader: {
// //             fontSize: 16,
// //             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
// //             color: isDarkMode ? 'white' : '#000',
// //             paddingVertical: 8,
// //             paddingHorizontal: 16,
// //             // backgroundColor: '#f9f9f9',
// //         },
// //         cardContainer: {
// //             flexDirection: 'row',
// //             alignItems: 'center',
// //             padding: 12,
// //             // borderBottomWidth: 1,
// //             // borderBottomColor: '#e0e0e0',
// //         },
// //         profileImage: {
// //             width: 40,
// //             height: 40,
// //             borderRadius: 20,
// //             marginRight: 12,
// //         },
// //         textContainer: {
// //             flex: 1,
// //         },
// //         name: {
// //             fontSize: 14,
// //             color: isDarkMode ? 'white' : '#000',
// //             fontFamily: FONTS_FAMILY.SourceSans3_Bold
// //         },
// //         action: {
// //             fontSize: 13,
// //             color: '#555',
// //             marginVertical: 2,
// //         },
// //         time: {
// //             fontSize: 12,
// //             color: '#999',
// //         },
// //         followButton: {
// //             paddingVertical: 6,
// //             paddingHorizontal: 16,
// //             borderRadius: 8,
// //         },
// //         followText: {
// //             fontSize: 14,
// //             fontWeight: '600',
// //         },
// //     });

// //     // Render card
// //     const Card = ({ item }) => (
// //         <Animated.View style={[styles.cardContainer, { opacity: animatedValue }]}>

// //             <Image source={IMG.MessageProfile} style={styles.profileImage} />
// //             <TouchableOpacity style={styles.textContainer}
// //                 onPress={() => navigation.navigate('UserDetail')}
// //             >
// //                 {/* <Text style={styles.name}>{'Vikash Kohli'}</Text> */}
// //                 <Row>

// //                     <Text style={styles.action}>{item?.content}</Text>
// //                     <Text style={styles.time}>{item?.user?.time}</Text>
// //                 </Row>
// //             </TouchableOpacity>
// //             {item?.type == 'FollowRequest' && <TouchableOpacity
// //                 disabled={selector?.Follower?.includes(item?.sender)}
// //                 onPress={()=>onAcceptReq(item?.sender)}

// //             //  onPress={() => handleFollowToggle(item.id)}
// //             >
// //                 <LinearGradient
// //                     colors={item.isFollowing ? [isDarkMode ? '#252525' : '#e0e0e0', isDarkMode ? '#252525' : '#e0e0e0'] : ['#ff00ff', '#6a5acd']}
// //                     start={{ x: 1, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={{
// //                         ...styles.followButton,
// //                         opacity: selector?.Follower?.includes(item?.sender) ? 0.3 : 1,
// //                     }}

// //                 >
// //                     <Text style={[
// //                         styles.followText,
// //                         { color: item.isFollowing ? (isDarkMode ? '#fff' : '#000') : '#fff' }

// //                     ]}>
// //                         {'Accept'}
// //                     </Text>
// //                 </LinearGradient>
// //             </TouchableOpacity>}

// //         </Animated.View>
// //     );

// // if (loading) {
// //     return <ActivityShimmer/>;

// // }

// //     return (
// //         <View style={styles.container}>
// //             <StatusBar translucent={true} backgroundColor="transparent" barStyle={isDarkMode ? '"light-content" ' : "dark-content"} />
// //             {renderHeader()}
// //             <FlatList
// //                 style={{ marginTop: 20, paddingHorizontal: 10 }}
// //                 data={allNotifications}
// //                 keyExtractor={(item) => item.key}
// //                 renderItem={({ item }) =>
// //                     <Card item={item} />
// //                 }
// //                 contentContainerStyle={{ paddingBottom: 20 }}
// //             />

// //         </View>
// //     );
// // };

// // // ✅ Styling


// // const DATA = [
// //     // This month
// //     {
// //         id: '1',
// //         type: 'This month',
// //         user: {
// //             name: 'Lorem Ipsum',
// //             action: 'started following you.',
// //             time: '6 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: false,
// //     },
// //     {
// //         id: '5',
// //         type: 'This month',
// //         user: {
// //             name: 'John Doe',
// //             action: 'liked your post.',
// //             time: '2 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: true,
// //     },
// //     {
// //         id: '6',
// //         type: 'This month',
// //         user: {
// //             name: 'Jane Smith',
// //             action: 'commented on your photo.',
// //             time: '3 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: false,
// //     },

// //     // Earlier
// //     {
// //         id: '2',
// //         type: 'Earlier',
// //         user: {
// //             name: 'Lorenzo_matterh',
// //             action: 'is on Instagram.',
// //             time: '10 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: false,
// //     },
// //     {
// //         id: '7',
// //         type: 'Earlier',
// //         user: {
// //             name: 'Alice Johnson',
// //             action: 'tagged you in a story.',
// //             time: '8 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: false,
// //     },
// //     {
// //         id: '8',
// //         type: 'Earlier',
// //         user: {
// //             name: 'David Lee',
// //             action: 'started following you.',
// //             time: '12 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: true,
// //     },

// //     // Suggested for you
// //     {
// //         id: '3',
// //         type: 'Suggested for you',
// //         user: {
// //             name: 'Lorem_aa',
// //             action: 'is on Instagram.',
// //             time: '11 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: true,
// //     },
// //     {
// //         id: '4',
// //         type: 'Suggested for you',
// //         user: {
// //             name: 'Lorem_bb',
// //             action: 'is on Instagram.',
// //             time: '9 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: false,
// //     },
// //     {
// //         id: '9',
// //         type: 'Suggested for you',
// //         user: {
// //             name: 'Chris Evans',
// //             action: 'started following you.',
// //             time: '4 w',
// //             image: IMG.MessageProfile,
// //         },
// //         isFollowing: false,
// //     },
// // ];



// // export default Activity;


// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, 
//   TextInput, 
//   FlatList, 
//   Image, 
//   StyleSheet, 
//   TouchableOpacity, 
//   StatusBar, 
//   Text, 
//   Animated as RNAnimated,
//   Dimensions,
// } from 'react-native';
// import { PrimaryBackArrow, PrimaryBackWhite, Search } from '../../assets/SVGs';
// import Row from '../../components/wrapper/row';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import IMG from '../../assets/Images';
// import LinearGradient from 'react-native-linear-gradient';
// import { useDispatch, useSelector } from 'react-redux';
// import { white } from '../../common/Colors/colors';
// import { apiGet, apiPost } from '../../utils/Apis';
// import urls from '../../config/urls';
// import useLoader from '../../utils/LoaderHook';
// import { setUser } from '../../redux/reducer/user';
// import { ToastMsg } from '../../utils/helperFunctions';
// import ActivityShimmer from '../../components/Skeletons/ActivityShimmer';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSpring,
//   Easing,
// } from 'react-native-reanimated';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const Activity = ({ navigation, route }) => {
//   const [data, setData] = useState(DATA);
//   const [searchText, setSearchText] = useState('');
//   const [animatedValue] = useState(new RNAnimated.Value(0));
//   const { isDarkMode } = useSelector(state => state.theme);
//   const { showLoader, hideLoader } = useLoader();
//   const dispatch = useDispatch();
  
//   // Bell expand animation values
//   const { bellPosition } = route.params || { 
//     bellPosition: { x: screenWidth - 40, y: 60 } 
//   };

//    console.log('Bell Position in Activity:', bellPosition) 

//   const circleScale = useSharedValue(0);
//   const circleOpacity = useSharedValue(1);
//   const contentOpacity = useSharedValue(0);
//   const contentTranslateY = useSharedValue(50);

//   const [loading, setLoading] = useState(false);
//   const [allNotifications, setAllNotifications] = useState([]);

//   let selector = useSelector(state => state?.user?.userData);
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector);
//   }

//   // Bell expand effect
//   useEffect(() => {
//     // Expand animation from bell icon
//     circleScale.value = withTiming(15, {
//       duration: 600,
//       easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//     });
    
//     circleOpacity.value = withTiming(0, {
//       duration: 500,
//     });

//     // Content fade in with delay
//     setTimeout(() => {
//       contentOpacity.value = withSpring(1, {
//         damping: 15,
//         stiffness: 100,
//       });
//       contentTranslateY.value = withSpring(0, {
//         damping: 15,
//         stiffness: 100,
//       });
//     }, 300);
//   }, []);

//   // Old card fade animation
//   useEffect(() => {
//     RNAnimated.timing(animatedValue, {
//       toValue: 1,
//       duration: 400,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, []);

//  const circleStyle = useAnimatedStyle(() => {
//     console.log('Circle animating at:', bellPosition) // ✅ Debug
//     return {
//       width: 80,
//       height: 80,
//       borderRadius: 40,
//       backgroundColor: '#21B7FF',
//       position: 'absolute',
//       left: bellPosition.x - 40,
//       top: bellPosition.y - 40,
//       transform: [{ scale: circleScale.value }],
//       opacity: circleOpacity.value,
//       zIndex: 1000,
//     }
//   })

//   const contentStyle = useAnimatedStyle(() => ({
//     flex: 1,
//     opacity: contentOpacity.value,
//     transform: [{ translateY: contentTranslateY.value }],
//   }));

//   const onAcceptReq = async (userId) => {
//     try {
//       showLoader();
//       const res = await apiPost(`${urls?.acceptFollowReq}/${userId}`);
//       console.log(res);

//       const getUserProfile = await apiGet(urls?.userProfile);
//       dispatch(setUser(JSON.stringify(getUserProfile?.data)));
//       ToastMsg('Follow Req Accepted');
//       hideLoader();
//     } catch (error) {
//       console.log('Something went Wrong');
//       ToastMsg(error?.message);
//       hideLoader();
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     const res = await apiGet(urls.getAllNotifications);
//     setAllNotifications(res?.data);
//     setLoading(false);
//   };

//   const renderHeader = () => (
//     <Row style={styles.header}>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//       </TouchableOpacity>
//       <Text style={styles.headerText}>
//         Activity <Text style={styles.highlightedText}>({allNotifications.length})</Text>
//       </Text>
//     </Row>
//   );

//   const Card = ({ item }) => (
//     <RNAnimated.View style={[styles.cardContainer, { opacity: animatedValue }]}>
//       <Image source={IMG.MessageProfile} style={styles.profileImage} />
//       <TouchableOpacity 
//         style={styles.textContainer}
//         onPress={() => navigation.navigate('UserDetail')}
//       >
//         <Row>
//           <Text style={styles.action}>{item?.content}</Text>
//           <Text style={styles.time}>{item?.user?.time}</Text>
//         </Row>
//       </TouchableOpacity>
      
//       {item?.type == 'FollowRequest' && (
//         <TouchableOpacity
//           disabled={selector?.Follower?.includes(item?.sender)}
//           onPress={() => onAcceptReq(item?.sender)}
//         >
//           <LinearGradient
//             colors={item.isFollowing ? [isDarkMode ? '#252525' : '#e0e0e0', isDarkMode ? '#252525' : '#e0e0e0'] : ['#21B7FF', '#0084F8']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={{
//               ...styles.followButton,
//               opacity: selector?.Follower?.includes(item?.sender) ? 0.3 : 1,
//             }}
//           >
//             <Text style={[
//               styles.followText,
//               { color: item.isFollowing ? (isDarkMode ? '#fff' : '#000') : '#fff' }
//             ]}>
//               {'Accept'}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       )}
//     </RNAnimated.View>
//   );

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? 'black' : '#fff',
//     },
//     header: {
//       paddingTop: 50,
//       paddingHorizontal: 20,
//       gap: 90,
//     },
//     headerText: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? white : 'black'
//     },
//     highlightedText: {
//       color: isDarkMode ? 'white' : 'rgba(79, 82, 254, 1)',
//     },
//     cardContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       padding: 12,
//     },
//     profileImage: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       marginRight: 12,
//     },
//     textContainer: {
//       flex: 1,
//     },
//     name: {
//       fontSize: 14,
//       color: isDarkMode ? 'white' : '#000',
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold
//     },
//     action: {
//       fontSize: 13,
//       color: isDarkMode ? '#ccc' : '#555',
//       marginVertical: 2,
//     },
//     time: {
//       fontSize: 12,
//       color: '#999',
//     },
//     followButton: {
//       paddingVertical: 6,
//       paddingHorizontal: 16,
//       borderRadius: 8,
//     },
//     followText: {
//       fontSize: 14,
//       fontWeight: '600',
//     },
//   });

//   if (loading) {
//     return <ActivityShimmer />;
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar 
//         translucent={true} 
//         backgroundColor="transparent" 
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
//       />
      
//       {/* Expanding Circle from Bell */}
//       <Animated.View style={circleStyle} />
      
//       {/* Content with fade animation */}
//       <Animated.View style={contentStyle}>
//         {renderHeader()}
//         <FlatList
//           style={{ marginTop: 20, paddingHorizontal: 10 }}
//           data={allNotifications}
//           keyExtractor={(item, index) => item._id || index.toString()}
//           renderItem={({ item }) => <Card item={item} />}
//           contentContainerStyle={{ paddingBottom: 20 }}
//         />
//       </Animated.View>
//     </View>
//   );
// };

// const DATA = [
//   {
//     id: '1',
//     type: 'This month',
//     user: {
//       name: 'Lorem Ipsum',
//       action: 'started following you.',
//       time: '6 w',
//       image: IMG.MessageProfile,
//     },
//     isFollowing: false,
//   },
//   {
//     id: '5',
//     type: 'This month',
//     user: {
//       name: 'John Doe',
//       action: 'liked your post.',
//       time: '2 w',
//       image: IMG.MessageProfile,
//     },
//     isFollowing: true,
//   },
//   {
//     id: '6',
//     type: 'This month',
//     user: {
//       name: 'Jane Smith',
//       action: 'commented on your photo.',
//       time: '3 w',
//       image: IMG.MessageProfile,
//     },
//     isFollowing: false,
//   },
//   {
//     id: '2',
//     type: 'Earlier',
//     user: {
//       name: 'Lorenzo_matterh',
//       action: 'is on Instagram.',
//       time: '10 w',
//       image: IMG.MessageProfile,
//     },
//     isFollowing: false,
//   },
//   {
//     id: '7',
//     type: 'Earlier',
//     user: {
//       name: 'Alice Johnson',
//       action: 'tagged you in a story.',
//       time: '8 w',
//       image: IMG.MessageProfile,
//     },
//     isFollowing: false,
//   },
// ];

// export default Activity;


import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Text, 
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import { PrimaryBackArrow, PrimaryBackWhite, Search } from '../../assets/SVGs';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { white } from '../../common/Colors/colors';
import { apiGet, apiPost } from '../../utils/Apis';
import urls from '../../config/urls';
import useLoader from '../../utils/LoaderHook';
import { setUser } from '../../redux/reducer/user';
import { ToastMsg } from '../../utils/helperFunctions';
import ActivityShimmer from '../../components/Skeletons/ActivityShimmer';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Activity = ({ navigation, route }) => {
  const [data, setData] = useState(DATA);
  const [searchText, setSearchText] = useState('');
  const [animatedValue] = useState(new RNAnimated.Value(0));
  const { isDarkMode } = useSelector(state => state.theme);
  const { showLoader, hideLoader } = useLoader();
  const dispatch = useDispatch();
  
const { bellPosition } = route.params
const circleOpacity = useSharedValue(1)

const circleScale = useSharedValue(0)
const contentOpacity = useSharedValue(0)
useEffect(() => {
  circleScale.value = withTiming(15, {
    duration: 650,
    easing: Easing.out(Easing.exp),
  })

  contentOpacity.value = withDelay(
    300,
    withTiming(1, { duration: 300 })
  )

  // 🔴 IMPORTANT: circle hide after animation
  circleOpacity.value = withDelay(
    600,
    withTiming(0, { duration: 150 })
  )
}, [])



  const [loading, setLoading] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);

  let selector = useSelector(state => state?.user?.userData);
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector);
  }



  // Old card fade animation
  useEffect(() => {
    RNAnimated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);



const circleStyle = useAnimatedStyle(() => ({
  position: 'absolute',
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#21B7FF',
  left: bellPosition.x - 40,
  top: bellPosition.y - 40,
  transform: [{ scale: circleScale.value }],
  opacity: circleOpacity.value,
  zIndex: 1,          // ⬅️ background
}))


const contentStyle = useAnimatedStyle(() => ({
  flex: 1,
  opacity: contentOpacity.value,
  zIndex: 2,          // ⬅️ content above
}))






  const onAcceptReq = async (userId) => {
    try {
      showLoader();
      const res = await apiPost(`${urls?.acceptFollowReq}/${userId}`);
      console.log(res);

      const getUserProfile = await apiGet(urls?.userProfile);
      dispatch(setUser(JSON.stringify(getUserProfile?.data)));
      ToastMsg('Follow Req Accepted');
      hideLoader();
    } catch (error) {
      console.log('Something went Wrong');
      ToastMsg(error?.message);
      hideLoader();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await apiGet(urls.getAllNotifications);
    setAllNotifications(res?.data);
    setLoading(false);
  };

  const renderHeader = () => (
    <Row style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <Text style={styles.headerText}>
        Activity <Text style={styles.highlightedText}>({allNotifications.length})</Text>
      </Text>
    </Row>
  );

  const Card = ({ item }) => (
    <RNAnimated.View style={[styles.cardContainer, { opacity: animatedValue }]}>
      <Image source={IMG.MessageProfile} style={styles.profileImage} />
      <TouchableOpacity 
        style={styles.textContainer}
        onPress={() => navigation.navigate('UserDetail')}
      >
        <Row>
          <Text style={styles.action}>{item?.content}</Text>
          <Text style={styles.time}>{item?.user?.time}</Text>
        </Row>
      </TouchableOpacity>
      
      {item?.type == 'FollowRequest' && (
        <TouchableOpacity
          disabled={selector?.Follower?.includes(item?.sender)}
          onPress={() => onAcceptReq(item?.sender)}
        >
          <LinearGradient
            colors={item.isFollowing ? [isDarkMode ? '#252525' : '#e0e0e0', isDarkMode ? '#252525' : '#e0e0e0'] : ['#21B7FF', '#0084F8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              ...styles.followButton,
              opacity: selector?.Follower?.includes(item?.sender) ? 0.3 : 1,
            }}
          >
            <Text style={[
              styles.followText,
              { color: item.isFollowing ? (isDarkMode ? '#fff' : '#000') : '#fff' }
            ]}>
              {'Accept'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </RNAnimated.View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? 'black' : '#fff',
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      gap: 90,
    },
    headerText: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? white : 'black'
    },
    highlightedText: {
      color: isDarkMode ? 'white' : 'rgba(79, 82, 254, 1)',
    },
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 14,
      color: isDarkMode ? 'white' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Bold
    },
    action: {
      fontSize: 13,
      color: isDarkMode ? '#ccc' : '#555',
      marginVertical: 2,
    },
    time: {
      fontSize: 12,
      color: '#999',
    },
    followButton: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    followText: {
      fontSize: 14,
      fontWeight: '600',
    },
  });

  if (loading) {
    return <ActivityShimmer />;
  }

  return (
    <View style={[styles.container]}>
      <StatusBar 
        translucent={true} 
        backgroundColor="transparent" 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
      />
      
      {/* Expanding Circle from Bell */}
          <Animated.View style={circleStyle} />
<Animated.View style={[contentStyle, { backgroundColor: '#000', borderTopLeftRadius: 24, borderTopRightRadius: 24 }]}>
      {/* Content with fade animation */}   
        {renderHeader()}
        <FlatList
          style={{ marginTop: 20, paddingHorizontal: 10 }}
          data={allNotifications}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => <Card item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        </Animated.View>
    </View>
  );
};

const DATA = [
  {
    id: '1',
    type: 'This month',
    user: {
      name: 'Lorem Ipsum',
      action: 'started following you.',
      time: '6 w',
      image: IMG.MessageProfile,
    },
    isFollowing: false,
  },
  {
    id: '5',
    type: 'This month',
    user: {
      name: 'John Doe',
      action: 'liked your post.',
      time: '2 w',
      image: IMG.MessageProfile,
    },
    isFollowing: true,
  },
  {
    id: '6',
    type: 'This month',
    user: {
      name: 'Jane Smith',
      action: 'commented on your photo.',
      time: '3 w',
      image: IMG.MessageProfile,
    },
    isFollowing: false,
  },
  {
    id: '2',
    type: 'Earlier',
    user: {
      name: 'Lorenzo_matterh',
      action: 'is on Instagram.',
      time: '10 w',
      image: IMG.MessageProfile,
    },
    isFollowing: false,
  },
  {
    id: '7',
    type: 'Earlier',
    user: {
      name: 'Alice Johnson',
      action: 'tagged you in a story.',
      time: '8 w',
      image: IMG.MessageProfile,
    },
    isFollowing: false,
  },
];

export default Activity;