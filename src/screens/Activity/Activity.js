


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
  const [data, setData] = useState([]);
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
    
    // Dummy profile visit data - API format me
    const dummyVisits = [
      {
        _id: 'dummy1',
        type: 'ProfileVisit',
        content: 'Alkesh Patidar visited your profile',
        sender: 'dummy_user_1',
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        user: { 
          name: 'Alkesh Patidar',
          time: '2m',
          image: IMG.MessageProfile 
        }
      },
      {
        _id: 'dummy2',
        type: 'ProfileVisit',
        content: 'Rahul Sharma visited your profile',
        sender: 'dummy_user_2',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user: { 
          name: 'Rahul Sharma',
          time: '15m',
          image: IMG.MessageProfile 
        }
      },
      {
        _id: 'dummy3',
        type: 'ProfileVisit',
        content: 'Priya Singh visited your profile',
        sender: 'dummy_user_3',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        user: { 
          name: 'Priya Singh',
          time: '1h',
          image: IMG.MessageProfile 
        }
      },
      {
        _id: 'dummy4',
        type: 'ProfileVisit',
        content: 'Rohan Verma visited your profile',
        sender: 'dummy_user_4',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        user: { 
          name: 'Rohan Verma',
          time: '3h',
          image: IMG.MessageProfile 
        }
      },
      {
        _id: 'dummy5',
        type: 'ProfileVisit',
        content: 'Neha Gupta visited your profile',
        sender: 'dummy_user_5',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        user: { 
          name: 'Neha Gupta',
          time: '5h',
          image: IMG.MessageProfile 
        }
      },
    ];
    
    // API data ke saath dummy visits merge kar do
    const mergedData = [ ...(res?.data || [])];
    setAllNotifications(mergedData);
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
      <View style={styles.cardContent}>
        <View style={styles.profileImageContainer}>
          <Image source={IMG.MessageProfile} style={styles.profileImage} />
          {item?.type == 'ProfileVisit' && (
            <View style={styles.visitBadge}>
              <Text style={styles.visitBadgeText}>👁️</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => navigation.navigate('UserDetail')}
        >
          <View style={styles.contentWrapper}>
            <Text style={styles.action} numberOfLines={2}>
              {item?.content}
            </Text>
            <Text style={styles.time}>{item?.user?.time}</Text>
          </View>
        </TouchableOpacity>

        {item?.type == 'FollowRequest' && (
          <TouchableOpacity
            disabled={selector?.Follower?.includes(item?.sender)}
            onPress={() => onAcceptReq(item?.sender)}
            style={styles.buttonWrapper}
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
      </View>
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
      marginHorizontal: 12,
      marginVertical: 6,
      borderRadius: 16,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FAFAFA',
      shadowColor: isDarkMode ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
    },
    profileImageContainer: {
      position: 'relative',
      marginRight: 12,
    },
    profileImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: isDarkMode ? '#2A2A2A' : '#E5E5E5',
    },
    visitBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      backgroundColor: '#21B7FF',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDarkMode ? '#1A1A1A' : '#FAFAFA',
    },
    visitBadgeText: {
      fontSize: 10,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    contentWrapper: {
      flexDirection: 'column',
      gap: 4,
    },
    name: {
      fontSize: 15,
      color: isDarkMode ? 'white' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      marginBottom: 2,
    },
    action: {
      fontSize: 14,
      color: isDarkMode ? '#E0E0E0' : '#333',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      lineHeight: 20,
    },
    time: {
      fontSize: 12,
      color: isDarkMode ? '#888' : '#999',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      marginTop: 2,
    },
    buttonWrapper: {
      marginLeft: 8,
      minWidth: 92,
      flexShrink: 0,
    },
    followButton: {
      width: '100%',
      minHeight: 34,
      // paddingVertical: 8,
      // paddingHorizontal: 20,
      borderRadius: 10,
      minWidth: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    followText: {
      fontSize: 13,
      fontWeight: '600',
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
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
      <Animated.View
        style={[
          contentStyle,
          {
            backgroundColor: isDarkMode ? '#000' : '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        ]}
      >
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

export default Activity;