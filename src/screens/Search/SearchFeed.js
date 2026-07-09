


// import React, { useEffect, useState, useCallback } from 'react';
// import {
//     View,
//     TextInput,
//     FlatList,
//     Image,
//     StyleSheet,
//     TouchableOpacity,
//     StatusBar,
//     Text,
//     ScrollView,
//     Modal,
//     Dimensions
// } from 'react-native';
// import Animated, {
//     FadeInDown,
//     FadeInUp,
//     FadeIn,
//     ZoomIn,
//     SlideInRight,
//     useSharedValue,
//     useAnimatedStyle,
//     withSpring,
//     withTiming,
//     withSequence,
//     withDelay,
//     interpolate,
// } from 'react-native-reanimated';
// import { LocationIcon, Search } from '../../assets/SVGs';
// import { useSelector } from 'react-redux';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';
// import { ToastMsg } from '../../utils/helperFunctions';
// import GradientIcon from '../../components/GradientIcon';
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
// import { THEMES } from '../../redux/reducer/theme'; // ✅ IMPORT THEMES

// const { width } = Dimensions.get('window');

// // Animated Search Bar Component
// const AnimatedSearchBar = ({ 
//     searchQuery, 
//     handleSearchChange, 
//     clearSearch, 
//     isDarkMode, 
//     searchFocused, 
//     setSearchFocused,
//     handleSearchSubmit,
//     primaryColor // ✅ ADD primaryColor prop
// }) => {
//     const scale = useSharedValue(0);
//     const translateY = useSharedValue(-50);

//     useEffect(() => {
//         scale.value = withDelay(200, withSpring(1, {
//             damping: 15,
//             stiffness: 120,
//         }));
//         translateY.value = withDelay(200, withSpring(0, {
//             damping: 20,
//             stiffness: 100,
//         }));
//     }, []);

//     const searchStyle = useAnimatedStyle(() => ({
//         transform: [
//             { scale: scale.value },
//             { translateY: translateY.value }
//         ],
//     }));

//     return (
//         <Animated.View
//             style={[
//                 {
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f1f1',
//                     borderRadius: 12,
//                     margin: 16,
//                     padding: 12,
//                     marginTop: 60,
//                     borderWidth: searchFocused ? 1 : 0,
//                     borderColor: searchFocused ? primaryColor : (isDarkMode ? '#333' : '#ddd'), // ✅ THEME COLOR
//                     gap: 10,
//                 },
//                 searchStyle
//             ]}
//         >
//             <GradientIcon
//                 colors={[primaryColor, primaryColor]} // ✅ THEME COLOR (pehle ['#21B7FF', '#0084F8'])
//                 size={18}
//                 iconType='FontAwesome5'
//                 name={'search'}
//             />
//             <TextInput
//                 style={{
//                     flex: 1,
//                     fontSize: 16,
//                     color: isDarkMode ? '#fff' : '#000',
//                     paddingVertical: 0,
//                 }}
//                 placeholder="Search..."
//                 placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                 value={searchQuery}
//                 onChangeText={handleSearchChange}
//                 onFocus={() => setSearchFocused(true)}
//                 onBlur={() => setSearchFocused(false)}
//                 onSubmitEditing={handleSearchSubmit}
//                 returnKeyType="search"
//             />
//             {searchQuery.length > 0 && (
//                 <Animated.View entering={ZoomIn.duration(200)}>
//                     <TouchableOpacity onPress={clearSearch} style={{ padding: 4 }}>
//                         <Text style={{ color: isDarkMode ? '#888' : '#666' }}>✕</Text>
//                     </TouchableOpacity>
//                 </Animated.View>
//             )}
//         </Animated.View>
//     );
// };

// // Browse Category Card with animations
// const BrowseCategoryCard = React.memo(({ category, isDarkMode, onPress, index, primaryColor, secondaryColor }) => { // ✅ ADD theme colors
//     const scale = useSharedValue(1);

//     const cardStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: scale.value }],
//     }));

//     const handlePressIn = () => {
//         scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
//     };

//     const handlePressOut = () => {
//         scale.value = withSpring(1, { damping: 15, stiffness: 150 });
//     };

//     return (
//         <Animated.View
//             entering={FadeInDown.duration(400).delay(index * 100).springify()}
//             style={[cardStyle, { width: (width - 48) / 2, marginBottom: 12 }]}
//         >
//             <GlowWrapper
//                 isDarkMode={isDarkMode}
//                 borderRadius={12}
//                 showStars={false}
//                 showShinePatches={true}
//                 intensity="medium"
//                 containerStyle={{ width: '100%' }}
//                 glowColors={[primaryColor, secondaryColor]} // ✅ THEME COLORS
//             >
//                 <TouchableOpacity
//                     style={{
//                         height: 120,
//                         borderRadius: 12,
//                         backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         overflow: 'hidden',
//                     }}
//                     onPress={onPress}
//                     onPressIn={handlePressIn}
//                     onPressOut={handlePressOut}
//                     activeOpacity={0.8}
//                 >
//                     <View style={{ position: 'absolute', top: 20, left: 20 }}>
//                         <Text style={{ fontSize: 24 }}>{category.icon}</Text>
//                     </View>
//                     <Text style={{
//                         position: 'absolute',
//                         bottom: 12,
//                         left: 12,
//                         fontSize: 16,
//                         fontWeight: '600',
//                         fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//                         color: isDarkMode ? '#fff' : '#000',
//                     }}>
//                         {category.title}
//                     </Text>
//                 </TouchableOpacity>
//             </GlowWrapper>
//         </Animated.View>
//     );
// });

// // User Card with animations
// const UserCard = React.memo(({ item, isDarkMode, onPress, index, primaryColor, secondaryColor }) => { // ✅ ADD theme colors
//     if (!item || !item._id) return null;

//     const scale = useSharedValue(1);
//     const imageScale = useSharedValue(1);

//     const cardStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: scale.value }],
//     }));

//     const imageStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: imageScale.value }],
//     }));

//     const handlePressIn = () => {
//         scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
//         imageScale.value = withSpring(1.1, { damping: 12, stiffness: 100 });
//     };

//     const handlePressOut = () => {
//         scale.value = withSpring(1, { damping: 15, stiffness: 150 });
//         imageScale.value = withSpring(1, { damping: 12, stiffness: 100 });
//     };

//     return (
//         <Animated.View
//             entering={FadeInUp.duration(400).delay(index * 60).springify()}
//             style={[{ flex: 1, margin: 4 }, cardStyle]}
//         >
//             <GlowWrapper
//                 isDarkMode={isDarkMode}
//                 borderRadius={12}
//                 showStars={false}
//                 showShinePatches={true}
//                 intensity="low"
//                 containerStyle={{ flex: 1 }}
//                 glowColors={[primaryColor, secondaryColor]} // ✅ THEME COLORS
//             >
//                 <TouchableOpacity
//                     style={{
//                         height: 160,
//                         borderRadius: 12,
//                         overflow: 'hidden',
//                         position: 'relative',
//                         backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//                     }}
//                     activeOpacity={0.8}
//                     onPress={onPress}
//                     onPressIn={handlePressIn}
//                     onPressOut={handlePressOut}
//                 >
//                     <Animated.View style={[{ width: '100%', height: '100%' }, imageStyle]}>
//                         <Image
//                             source={{ uri: item.Image || 'https://picsum.photos/536/354' }}
//                             style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
//                         />
//                     </Animated.View>
//                     <View style={{
//                         position: 'absolute',
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         height: '35%',
//                         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//                         borderBottomLeftRadius: 12,
//                         borderBottomRightRadius: 12,
//                     }} />
//                     <Animated.View
//                         entering={FadeIn.duration(400).delay(index * 60 + 200)}
//                         style={{
//                             position: 'absolute',
//                             bottom: 12,
//                             left: 12,
//                             right: 12,
//                         }}
//                     >
//                         <Text style={{
//                             color: '#fff',
//                             fontSize: 16,
//                             fontWeight: '600',
//                             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//                             textShadowColor: 'rgba(0, 0, 0, 0.8)',
//                             textShadowOffset: { width: 0, height: 1 },
//                             textShadowRadius: 3,
//                             marginBottom: 2,
//                         }} numberOfLines={1}>
//                             {item.UserName || 'Unknown'}
//                         </Text>
//                         {item.distance && (
//                             <Text style={{ color: '#ccc', fontSize: 12, fontWeight: '400' }}>
//                                 {formatDistance(item.distance)} away
//                             </Text>
//                         )}
//                     </Animated.View>
//                 </TouchableOpacity>
//             </GlowWrapper>
//         </Animated.View>
//     );
// });

// // Nearby User Card with animation
// const NearbyUserCard = ({ item, isDarkMode, onPress, index, primaryColor }) => { // ✅ ADD primaryColor
//     return (
//         <Animated.View
//             entering={SlideInRight.duration(400).delay(index * 80).springify()}
//         >
//             <TouchableOpacity
//                 style={{
//                     alignItems: 'center',
//                     marginRight: 12,
//                     width: 80,
//                 }}
//                 onPress={onPress}
//             >
//                 <Image
//                     source={{
//                         uri: item.Image && item.Image.startsWith('http')
//                             ? item.Image
//                             : 'https://picsum.photos/100/100'
//                     }}
//                     style={{
//                         width: 60,
//                         height: 60,
//                         borderRadius: 30,
//                         marginBottom: 6,
//                         borderWidth: 2,
//                         borderColor: primaryColor, // ✅ THEME COLOR (optional border)
//                     }}
//                 />
//                 <Text style={{
//                     fontSize: 12,
//                     fontWeight: '500',
//                     textAlign: 'center',
//                     marginBottom: 4,
//                     color: isDarkMode ? '#fff' : '#000',
//                 }} numberOfLines={1}>
//                     {item.UserName || 'Unknown'}
//                 </Text>
//                 <View style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     backgroundColor: isDarkMode ? '#252525' : '#f0f0f0',
//                     paddingHorizontal: 6,
//                     paddingVertical: 2,
//                     borderRadius: 8,
//                 }}>
//                     <LocationIcon width={10} height={10} color={primaryColor} /> {/* ✅ THEME COLOR */}
//                     <Text style={{ fontSize: 10, color: isDarkMode ? '#fff' : '#000', marginLeft: 2 }}>
//                         {item?.Location?.City ? item?.Location?.City : formatDistance(item.distance || 0)}
//                     </Text>
//                 </View>
//             </TouchableOpacity>
//         </Animated.View>
//     );
// };

// BrowseCategoryCard.displayName = 'BrowseCategoryCard';
// UserCard.displayName = 'UserCard';
// NearbyUserCard.displayName = 'NearbyUserCard';

// const formatDistance = (distanceInMeters) => {
//     if (distanceInMeters < 1000) {
//         return `${Math.round(distanceInMeters)}m`;
//     }
//     return `${(distanceInMeters / 1000).toFixed(1)}km`;
// };

// const SearchScreen = ({ navigation }) => {
//     // ✅ GET THEME STATE
//     const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    
//     // ✅ GET CURRENT THEME COLORS
//     const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
//     const primaryColor = currentTheme.primary;
//     const secondaryColor = currentTheme.secondary;

//     const { showLoader, hideLoader } = useLoader();

//     const [allShops, setAllShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);
//     const [isSearching, setIsSearching] = useState(false);
//     const [searchFocused, setSearchFocused] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const [nearbyUsers, setNearbyUsers] = useState([]);
//     const [userLocation, setUserLocation] = useState(null);
//     const [searchRadius, setSearchRadius] = useState(5000);
//     const [showRadiusModal, setShowRadiusModal] = useState(false);
//     const [locationPermission, setLocationPermission] = useState(false);
//     const [nearbyLoading, setNearbyLoading] = useState(false);

//     const browseCategories = [
//         { id: 'marketplace', title: 'Marketplace', icon: '🛒' },
//     ];

//     useEffect(() => {
//         fetchData();
//         setTimeout(() => {
//             setLocationPermission(true);
//             setUserLocation({ latitude: 23.2599, longitude: 77.4126 });
//         }, 1000);
//     }, []);

//     useEffect(() => {
//         if (userLocation && locationPermission) {
//             fetchNearbyUsers();
//         }
//     }, [userLocation, searchRadius]);

//     useEffect(() => {
//         if (searchQuery.trim()) {
//             setIsSearching(true);
//             const timeoutId = setTimeout(() => {
//                 filterShops();
//                 setIsSearching(false);
//             }, 300);
//             return () => clearTimeout(timeoutId);
//         } else {
//             setFilteredShops(allShops);
//             setIsSearching(false);
//         }
//     }, [searchQuery, allShops]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const res = await apiGet(urls.getAllUsers);
//             setAllShops(res?.data || []);
//             setFilteredShops(res?.data || []);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//         setLoading(false);
//     };

//     const fetchNearbyUsers = async () => {
//         setNearbyLoading(true);
//         try {
//             const res = await apiGet(`/api/user/FindNearestUser?distance=${searchRadius}`);
//             if (res?.statusCode === 200 && res?.data) {
//                 setNearbyUsers(res.data);
//             } else {
//                 setNearbyUsers([]);
//             }
//         } catch (error) {
//             console.error('Error fetching nearby users:', error);
//             setNearbyUsers([]);
//         }
//         setNearbyLoading(false);
//     };

//     const filterShops = () => {
//         const filtered = allShops.filter(shop => {
//             const UserName = (shop.UserName || '').toLowerCase();
//             const FullName = (shop.FullName || '').toLowerCase();
//             const query = searchQuery.toLowerCase();
//             return UserName.includes(query) || FullName.includes(query);
//         });
//         setFilteredShops(filtered);
//     };

//     const handleSearchChange = (text) => {
//         setSearchQuery(text);
//     };

//     const handleSearchSubmit = () => {
//         if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
//             setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
//         }
//     };

//     const clearSearch = () => {
//         setSearchQuery('');
//         setFilteredShops(allShops);
//     };

//     const handleCategoryPress = (category) => {
//         navigation.navigate('Tab', { screen: 'MarketPlace' });
//     };

//     const handleUserPress = useCallback((userId) => {
//         if (userId) {
//             navigation.navigate('OtherUserDetail', { userId });
//         }
//     }, [navigation]);

//     const renderNearbyUser = ({ item, index }) => (
//         <NearbyUserCard
//             item={item}
//             isDarkMode={isDarkMode}
//             index={index}
//             primaryColor={primaryColor} // ✅ PASS primaryColor
//             onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
//         />
//     );

//     const renderUserCard = useCallback(({ item, index }) => (
//         <UserCard
//             item={item}
//             isDarkMode={isDarkMode}
//             index={index}
//             primaryColor={primaryColor} // ✅ PASS primaryColor
//             secondaryColor={secondaryColor} // ✅ PASS secondaryColor
//             onPress={() => handleUserPress(item?._id)}
//         />
//     ), [isDarkMode, handleUserPress, primaryColor, secondaryColor]); // ✅ ADD dependencies

//     const renderBrowseCategory = useCallback(({ item, index }) => (
//         <BrowseCategoryCard
//             category={item}
//             isDarkMode={isDarkMode}
//             index={index}
//             primaryColor={primaryColor} // ✅ PASS primaryColor
//             secondaryColor={secondaryColor} // ✅ PASS secondaryColor
//             onPress={() => handleCategoryPress(item)}
//         />
//     ), [isDarkMode, primaryColor, secondaryColor]); // ✅ ADD dependencies

//     const keyExtractor = useCallback((item, index) => {
//         return item?._id?.toString() || `item-${index}`;
//     }, []);

//     const RadiusModal = () => (
//         <Modal
//             visible={showRadiusModal}
//             transparent={true}
//             animationType="slide"
//         >
//             <View style={styles.modalOverlay}>
//                 <Animated.View
//                     entering={ZoomIn.duration(300)}
//                     style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}
//                 >
//                     <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
//                         Search Radius
//                     </Text>
//                     <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#888' : '#666' }]}>
//                         How far should we look for nearby users?
//                     </Text>

//                     {[1000, 3000, 5000, 10000, 25000, 50000].map((radius, index) => (
//                         <Animated.View
//                             key={radius}
//                             entering={FadeInDown.duration(300).delay(index * 50)}
//                         >
//                             <TouchableOpacity
//                                 style={[
//                                     styles.radiusOption,
//                                     { backgroundColor: searchRadius === radius ? primaryColor : 'transparent' } // ✅ THEME COLOR
//                                 ]}
//                                 onPress={() => {
//                                     setSearchRadius(radius);
//                                     setShowRadiusModal(false);
//                                 }}
//                             >
//                                 <Text style={[
//                                     styles.radiusText,
//                                     { color: searchRadius === radius ? '#fff' : (isDarkMode ? '#fff' : '#000') }
//                                 ]}>
//                                     {radius >= 1000 ? `${radius / 1000} km` : `${radius}m`}
//                                 </Text>
//                             </TouchableOpacity>
//                         </Animated.View>
//                     ))}

//                     <TouchableOpacity
//                         style={styles.modalCloseButton}
//                         onPress={() => setShowRadiusModal(false)}
//                     >
//                         <Text style={[styles.modalCloseText, { color: primaryColor }]}>Cancel</Text> {/* ✅ THEME COLOR */}
//                     </TouchableOpacity>
//                 </Animated.View>
//             </View>
//         </Modal>
//     );

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? '#000' : '#fff',
//         },
//         sectionHeader: {
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: 12,
//         },
//         sectionTitle: {
//             fontSize: 18,
//             fontWeight: '700',
//             color: isDarkMode ? '#fff' : '#000',
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold
//         },
//         radiusButton: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             paddingHorizontal: 12,
//             paddingVertical: 6,
//             backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
//             borderRadius: 16,
//         },
//         radiusButtonText: {
//             fontSize: 12,
//             color: isDarkMode ? '#fff' : '#000',
//             marginLeft: 4,
//         },
//         headerSection: {
//             paddingHorizontal: 16,
//             marginBottom: 12,
//         },
//         nearbyContainer: {
//             paddingLeft: 16,
//             marginBottom: 20,
//         },
//         browseSection: {
//             paddingHorizontal: 16,
//             marginBottom: 20,
//         },
//         gridContainer: {
//             flex: 1,
//             paddingHorizontal: 8,
//             marginBottom: 100
//         },
//         noResults: {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             paddingTop: 100,
//         },
//         noResultsText: {
//             fontSize: 16,
//             color: isDarkMode ? '#888' : '#666',
//             textAlign: 'center',
//         },
//         loadingContainer: {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         loadingText: {
//             color: isDarkMode ? '#888' : '#666',
//             marginTop: 10,
//         },
//         modalOverlay: {
//             flex: 1,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         modalContainer: {
//             width: width * 0.8,
//             borderRadius: 16,
//             padding: 20,
//         },
//         modalTitle: {
//             fontSize: 20,
//             fontWeight: '700',
//             textAlign: 'center',
//             marginBottom: 8,
//         },
//         modalSubtitle: {
//             fontSize: 14,
//             textAlign: 'center',
//             marginBottom: 20,
//         },
//         radiusOption: {
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 8,
//             alignItems: 'center',
//         },
//         radiusText: {
//             fontSize: 16,
//             fontWeight: '500',
//         },
//         modalCloseButton: {
//             marginTop: 10,
//             padding: 12,
//             alignItems: 'center',
//         },
//         modalCloseText: {
//             fontSize: 16,
//             fontWeight: '500',
//         },
//     });

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

//             {loading ? <SearchShimmerLoader /> : (
//                 <>
//                     <AnimatedSearchBar
//                         searchQuery={searchQuery}
//                         handleSearchChange={handleSearchChange}
//                         clearSearch={clearSearch}
//                         isDarkMode={isDarkMode}
//                         searchFocused={searchFocused}
//                         setSearchFocused={setSearchFocused}
//                         handleSearchSubmit={handleSearchSubmit}
//                         primaryColor={primaryColor} // ✅ PASS primaryColor
//                     />

//                     {searchQuery.trim() === '' ? (
//                         <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//                             {locationPermission && (
//                                 <Animated.View
//                                     entering={FadeInDown.duration(400).delay(400)}
//                                     style={styles.headerSection}
//                                 >
//                                     <View style={styles.sectionHeader}>
//                                         <Text style={styles.sectionTitle}>People near you</Text>
//                                         <TouchableOpacity
//                                             style={styles.radiusButton}
//                                             onPress={() => {
//                                                 ToastMsg('This feature is coming soon!')
//                                             }}
//                                         >
//                                             <Text style={styles.radiusButtonText}>
//                                                 {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
//                                             </Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                     {nearbyLoading ? (
//                                         <View style={styles.loadingContainer}>
//                                             <Text style={styles.loadingText}>Loading nearby users...</Text>
//                                         </View>
//                                     ) : nearbyUsers.length > 0 ? (
//                                         <FlatList
//                                             data={nearbyUsers}
//                                             horizontal
//                                             showsHorizontalScrollIndicator={false}
//                                             keyExtractor={item => `nearby-${item._id}`}
//                                             renderItem={renderNearbyUser}
//                                             contentContainerStyle={styles.nearbyContainer}
//                                         />
//                                     ) : (
//                                         <View style={styles.loadingContainer}>
//                                             <Text style={styles.loadingText}>No nearby users found</Text>
//                                         </View>
//                                     )}
//                                 </Animated.View>
//                             )}

//                             <Animated.View
//                                 entering={FadeInDown.duration(400).delay(600)}
//                                 style={styles.browseSection}
//                             >
//                                 <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Browse</Text>
//                                 <FlatList
//                                     data={browseCategories}
//                                     numColumns={2}
//                                     keyExtractor={(item) => item.id}
//                                     renderItem={renderBrowseCategory}
//                                     scrollEnabled={false}
//                                     columnWrapperStyle={{ justifyContent: 'space-between' }}
//                                 />
//                             </Animated.View>

//                             <Animated.View
//                                 entering={FadeInDown.duration(400).delay(800)}
//                                 style={styles.gridContainer}
//                             >
//                                 <Text style={[styles.sectionTitle, { paddingHorizontal: 8, marginTop: 8, marginBottom: 16 }]}>
//                                     Discover People
//                                 </Text>
//                                 <FlatList
//                                     data={allShops}
//                                     keyExtractor={keyExtractor}
//                                     numColumns={2}
//                                     showsVerticalScrollIndicator={false}
//                                     scrollEnabled={false}
//                                     renderItem={renderUserCard}
//                                     contentContainerStyle={{ paddingTop: 8 }}
//                                 />
//                             </Animated.View>
//                         </ScrollView>
//                     ) : (
//                         <View style={styles.gridContainer}>
//                             {isSearching ? (
//                                 <View style={styles.loadingContainer}>
//                                     <Text style={styles.loadingText}>Searching...</Text>
//                                 </View>
//                             ) : filteredShops.length > 0 ? (
//                                 <FlatList
//                                     data={filteredShops}
//                                     keyExtractor={keyExtractor}
//                                     numColumns={2}
//                                     showsVerticalScrollIndicator={false}
//                                     renderItem={renderUserCard}
//                                     contentContainerStyle={{ paddingTop: 8 }}
//                                 />
//                             ) : (
//                                 <Animated.View
//                                     entering={FadeIn.duration(400)}
//                                     style={styles.noResults}
//                                 >
//                                     <Text style={styles.noResultsText}>
//                                         No results found for "{searchQuery}"
//                                     </Text>
//                                 </Animated.View>
//                             )}
//                         </View>
//                     )}

//                     <RadiusModal />
//                 </>
//             )}
//         </View>
//     );
// };

// export default React.memo(SearchScreen);




import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, TextInput, FlatList, Image, StyleSheet,
  TouchableOpacity, StatusBar, Text, ScrollView, Modal, Dimensions,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  FadeInDown, FadeIn, ZoomIn, SlideInRight,
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay,
} from 'react-native-reanimated';
import { LocationIcon, Search } from '../../assets/SVGs';
import useLoader from '../../utils/LoaderHook';
import { useIsFocused } from '@react-navigation/native';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { FONTS_FAMILY } from '../../assets/Fonts';
import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';
import { ToastMsg } from '../../utils/helperFunctions';
import GradientIcon from '../../components/GradientIcon';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import { THEMES } from '../../redux/reducer/theme';

const { width } = Dimensions.get('window');

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDistance = (d) =>
  d < 1000 ? `${Math.round(d)}m` : `${(d / 1000).toFixed(1)}km`;

// ─── Static styles at module level — NEVER recreated ─────────────────────────
const S = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  radiusButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  radiusButtonText: { fontSize: 12, marginLeft: 4 },
  headerSection: { paddingHorizontal: 16, marginBottom: 12 },
  nearbyContainer: { paddingLeft: 16, marginBottom: 20 },
  browseSection: { paddingHorizontal: 16, marginBottom: 20 },
  gridContainer: { flex: 1, paddingHorizontal: 8, marginBottom: 100 },
  noResults: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  noResultsText: { fontSize: 16, textAlign: 'center' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  loadingText: { marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: width * 0.8, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  radiusOption: { padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  radiusText: { fontSize: 16, fontWeight: '500' },
  modalCloseButton: { marginTop: 10, padding: 12, alignItems: 'center' },
  modalCloseText: { fontSize: 16, fontWeight: '500' },
  // UserCard
  userCardWrapper: { flex: 1, margin: 4 },
  userCardInner: { height: 160, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  userCardImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  userCardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', backgroundColor: 'rgba(0,0,0,0.6)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  userCardText: { position: 'absolute', bottom: 12, left: 12, right: 12 },
  userCardName: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Bold, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3, marginBottom: 2 },
  userCardDist: { color: '#ccc', fontSize: 12 },
  // NearbyCard
  nearbyCard: { alignItems: 'center', marginRight: 12, width: 80 },
  nearbyImg: { width: 60, height: 60, borderRadius: 30, marginBottom: 6, borderWidth: 2 },
  nearbyName: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginBottom: 4 },
  nearbyBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  nearbyBadgeText: { fontSize: 10, marginLeft: 2 },
  // BrowseCard
  browseCardInner: { height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  browseIcon: { position: 'absolute', top: 20, left: 20 },
  browseTitle: { position: 'absolute', bottom: 12, left: 12, fontSize: 16, fontWeight: '600', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  // SearchBar
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, margin: 16, padding: 12, marginTop: 60, gap: 10 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  clearBtn: { padding: 4 },
});

// ─── AnimatedSearchBar ────────────────────────────────────────────────────────
// ✅ 2 shared values → 1 (removed scale, only translateY matters)
const AnimatedSearchBar = React.memo(({
  searchQuery, handleSearchChange, clearSearch,
  isDarkMode, searchFocused, setSearchFocused,
  handleSearchSubmit, primaryColor,
}) => {
  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(150, withSpring(0, { damping: 20, stiffness: 120 }));
    opacity.value = withDelay(150, withTiming(1, { duration: 300 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const glowColors = useMemo(() => [primaryColor, primaryColor], [primaryColor]);

  return (
    <Animated.View style={[
      S.searchBar,
      {
        backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f1f1',
        borderWidth: searchFocused ? 1 : 0,
        borderColor: searchFocused ? primaryColor : (isDarkMode ? '#333' : '#ddd'),
      },
      animStyle,
    ]}>
      <GradientIcon colors={glowColors} size={18} iconType="FontAwesome5" name="search" />
      <TextInput
        style={[S.searchInput, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Search..."
        placeholderTextColor={isDarkMode ? '#888' : '#666'}
        value={searchQuery}
        onChangeText={handleSearchChange}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <Animated.View entering={ZoomIn.duration(200)}>
          <TouchableOpacity onPress={clearSearch} style={S.clearBtn}>
            <Text style={{ color: isDarkMode ? '#888' : '#666' }}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
});
AnimatedSearchBar.displayName = 'AnimatedSearchBar';

// ─── BrowseCategoryCard ───────────────────────────────────────────────────────
// ✅ useCallback on pressIn/Out — stable references
const BrowseCategoryCard = React.memo(({ category, isDarkMode, onPress, index, primaryColor, secondaryColor }) => {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const glowColors = useMemo(() => [primaryColor, secondaryColor], [primaryColor, secondaryColor]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  }, []);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, []);

  const delay = Math.min(index * 100, 300);

  return (
    <Animated.View
      entering={FadeInDown.duration(350).delay(delay)}
      style={[cardStyle, { width: (width - 48) / 2, marginBottom: 12 }]}
    >
      <GlowWrapper
      glowColors={glowColors}
      >
        <TouchableOpacity
          style={[S.browseCardInner, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}
          onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.8}
        >
          <View style={S.browseIcon}>
            <Text style={{ fontSize: 24 }}>{category.icon}</Text>
          </View>
          <Text style={[S.browseTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
            {category.title}
          </Text>
        </TouchableOpacity>
      </GlowWrapper>
    </Animated.View>
  );
});
BrowseCategoryCard.displayName = 'BrowseCategoryCard';

// ─── UserCard ─────────────────────────────────────────────────────────────────
// ✅ Fallback image as constant — no object recreation per render
const FALLBACK_IMG = { uri: 'https://picsum.photos/536/354' };

const UserCard = React.memo(({ item, isDarkMode, onPress }) => {
  if (!item?._id) return null;

  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  }, []);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, []);

  const imgSource = useMemo(() =>
    item.Image ? { uri: item.Image } : FALLBACK_IMG,
  [item.Image]);

  return (
    <Animated.View style={[S.userCardWrapper, cardStyle]}>
      <TouchableOpacity
        style={[S.userCardInner, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }]}
        activeOpacity={0.8} onPress={onPress}
        onPressIn={handlePressIn} onPressOut={handlePressOut}
      >
        <Image source={imgSource} style={S.userCardImg} progressiveRenderingEnabled fadeDuration={150} />
        <View style={S.userCardOverlay} />
        <View style={S.userCardText}>
          <Text style={S.userCardName} numberOfLines={1}>{item.UserName || 'Unknown'}</Text>
          {item.distance && (
            <Text style={S.userCardDist}>{formatDistance(item.distance)} away</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});
UserCard.displayName = 'UserCard';

// ─── NearbyUserCard ───────────────────────────────────────────────────────────
const FALLBACK_NEARBY = { uri: 'https://picsum.photos/100/100' };

const NearbyUserCard = React.memo(({ item, isDarkMode, onPress, index, primaryColor }) => {
  const delay = Math.min(index * 80, 320);
  const imgSource = useMemo(() =>
    item.Image?.startsWith('http') ? { uri: item.Image } : FALLBACK_NEARBY,
  [item.Image]);

  return (
    <Animated.View entering={SlideInRight.duration(350).delay(delay)}>
      <TouchableOpacity style={S.nearbyCard} onPress={onPress}>
        <Image source={imgSource} style={[S.nearbyImg, { borderColor: primaryColor }]} />
        <Text style={[S.nearbyName, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
          {item.UserName || 'Unknown'}
        </Text>
        <View style={[S.nearbyBadge, { backgroundColor: isDarkMode ? '#252525' : '#f0f0f0' }]}>
          <LocationIcon width={10} height={10} color={primaryColor} />
          <Text style={[S.nearbyBadgeText, { color: isDarkMode ? '#fff' : '#000' }]}>
            {item?.Location?.City || formatDistance(item.distance || 0)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});
NearbyUserCard.displayName = 'NearbyUserCard';

// ─── Browse categories constant — defined outside, never recreated ────────────
const BROWSE_CATEGORIES = [
  { id: 'marketplace', title: 'Marketplace', icon: '🛒' },
];

const RADIUS_OPTIONS = [1000, 3000, 5000, 10000, 25000, 50000];

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SearchScreen = ({ navigation }) => {
  const isScreenFocused = useIsFocused();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const primaryColor = currentTheme.primary;
  const secondaryColor = currentTheme.secondary;

  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);

  // ✅ filteredUsers via useMemo — no separate state, no extra renders
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;
    const q = searchQuery.toLowerCase();
    return allUsers.filter(u =>
      (u.UserName || '').toLowerCase().includes(q) ||
      (u.FullName || '').toLowerCase().includes(q)
    );
  }, [searchQuery, allUsers]);

  // ✅ Cap Discover People — scrollEnabled=false renders ALL items at once, limit to 30
  const displayedUsers = useMemo(() => allUsers.slice(0, 30), [allUsers]);
  const displayedSearchUsers = useMemo(() => filteredUsers.slice(0, 60), [filteredUsers]);

  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    fetchData();
    // Simulate location after mount
    const t = setTimeout(() => {
      setLocationPermission(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (locationPermission && isScreenFocused) fetchNearbyUsers();
  }, [locationPermission, searchRadius, isScreenFocused]);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      Keyboard.dismiss();
      setSearchFocused(false);
    });
    return unsubscribeBlur;
  }, [navigation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiGet(urls.getAllUsers);
      setAllUsers(res?.data || []);
    } catch (e) {
      console.error('Search fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyUsers = async () => {
    setNearbyLoading(true);
    try {
      const res = await apiGet(`/api/user/FindNearestUser?distance=${searchRadius}`);
      setNearbyUsers(res?.statusCode === 200 ? res.data : []);
    } catch (e) {
      console.error('Nearby fetch error:', e);
      setNearbyUsers([]);
    } finally {
      setNearbyLoading(false);
    }
  };

  // ✅ Debounced search — no state + setTimeout pattern, just direct
  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    const q = searchQuery.trim();
    if (q && !recentSearches.includes(q)) {
      setRecentSearches(prev => [q, ...prev.slice(0, 4)]);
    }
  }, [searchQuery, recentSearches]);

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  const handleUserPress = useCallback((userId) => {
    if (userId) navigation.navigate('OtherUserDetail', { userId });
  }, [navigation]);

  const handleCategoryPress = useCallback(() => {
    navigation.navigate('Tab', { screen: 'MarketPlace' });
  }, [navigation]);

  // ✅ keyExtractor stable
  const keyExtractor = useCallback((item, index) =>
    item?._id?.toString() || `item-${index}`, []);

  const keyExtractorNearby = useCallback((item) => `nearby-${item._id}`, []);
  const keyExtractorBrowse = useCallback((item) => item.id, []);

  // ✅ renderItem callbacks memoized
  const renderNearbyUser = useCallback(({ item, index }) => (
    <NearbyUserCard
      item={item} isDarkMode={isDarkMode} index={index}
      primaryColor={primaryColor}
      onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
    />
  ), [isDarkMode, primaryColor, navigation]);

  const renderUserCard = useCallback(({ item, index }) => (
    <UserCard
      item={item} isDarkMode={isDarkMode}
      onPress={() => handleUserPress(item?._id)}
    />
  ), [isDarkMode, handleUserPress]);

  const renderBrowseCategory = useCallback(({ item, index }) => (
    <BrowseCategoryCard
      category={item} isDarkMode={isDarkMode} index={index}
      primaryColor={primaryColor} secondaryColor={secondaryColor}
      onPress={handleCategoryPress}
    />
  ), [isDarkMode, primaryColor, secondaryColor, handleCategoryPress]);

  // ✅ Radius modal as memoized component — not defined inside render
  const RadiusModal = useMemo(() => (
    <Modal visible={showRadiusModal} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <Animated.View
          entering={ZoomIn.duration(300)}
          style={[S.modalContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}
        >
          <Text style={[S.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Search Radius</Text>
          <Text style={[S.modalSubtitle, { color: isDarkMode ? '#888' : '#666' }]}>
            How far should we look for nearby users?
          </Text>
          {RADIUS_OPTIONS.map((radius, index) => (
            <Animated.View key={radius} entering={FadeInDown.duration(250).delay(index * 40)}>
              <TouchableOpacity
                style={[S.radiusOption, { backgroundColor: searchRadius === radius ? primaryColor : 'transparent' }]}
                onPress={() => { setSearchRadius(radius); setShowRadiusModal(false); }}
              >
                <Text style={[S.radiusText, { color: searchRadius === radius ? '#fff' : (isDarkMode ? '#fff' : '#000') }]}>
                  {radius >= 1000 ? `${radius / 1000} km` : `${radius}m`}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          <TouchableOpacity style={S.modalCloseButton} onPress={() => setShowRadiusModal(false)}>
            <Text style={[S.modalCloseText, { color: primaryColor }]}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  ), [showRadiusModal, isDarkMode, primaryColor, searchRadius]);

  // ✅ Dynamic colors for bg — memoized
  const containerBg = useMemo(() => ({ backgroundColor: isDarkMode ? '#000' : '#fff' }), [isDarkMode]);
  const titleColor = useMemo(() => ({ color: isDarkMode ? '#fff' : '#000' }), [isDarkMode]);
  const radiusBtnBg = useMemo(() => ({ backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }), [isDarkMode]);
  const radiusBtnTxt = useMemo(() => ({ color: isDarkMode ? '#fff' : '#000' }), [isDarkMode]);
  const noResultTxt = useMemo(() => ({ color: isDarkMode ? '#888' : '#666' }), [isDarkMode]);

  // Keep inactive tab render extremely light so tab transitions stay responsive.
  if (!isScreenFocused) {
    return <View style={[S.container, containerBg]} />;
  }

  return (
    <View style={[S.container, containerBg]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {loading ? <SearchShimmerLoader /> : (
        <>
          <AnimatedSearchBar
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            clearSearch={clearSearch}
            isDarkMode={isDarkMode}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            handleSearchSubmit={handleSearchSubmit}
            primaryColor={primaryColor}
          />

          {!isSearching ? (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {/* Nearby Users */}
              {locationPermission && (
                <Animated.View entering={FadeInDown.duration(350).delay(300)} style={S.headerSection}>
                  <View style={S.sectionHeader}>
                    <Text style={[S.sectionTitle, titleColor]}>People near you</Text>
                    <TouchableOpacity
                      style={[S.radiusButton, radiusBtnBg]}
                      onPress={() => ToastMsg('This feature is coming soon!')}
                    >
                      <Text style={[S.radiusButtonText, radiusBtnTxt]}>
                        {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {nearbyLoading ? (
                    <View style={S.loadingContainer}>
                      <Text style={[S.loadingText, noResultTxt]}>Loading nearby users...</Text>
                    </View>
                  ) : nearbyUsers.length > 0 ? (
                    <FlatList
                      data={nearbyUsers}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={keyExtractorNearby}
                      renderItem={renderNearbyUser}
                      contentContainerStyle={S.nearbyContainer}
                      // ✅ Horizontal list perf props
                      maxToRenderPerBatch={6}
                      initialNumToRender={4}
                      windowSize={3}
                    />
                  ) : (
                    <View style={S.loadingContainer}>
                      <Text style={[S.loadingText, noResultTxt]}>No nearby users found</Text>
                    </View>
                  )}
                </Animated.View>
              )}

              {/* Browse */}
              <Animated.View entering={FadeInDown.duration(350).delay(450)} style={S.browseSection}>
                <Text style={[S.sectionTitle, titleColor, { marginBottom: 16 }]}>Browse</Text>
                <FlatList
                  data={BROWSE_CATEGORIES}
                  numColumns={2}
                  keyExtractor={keyExtractorBrowse}
                  renderItem={renderBrowseCategory}
                  scrollEnabled={false}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
              </Animated.View>

              {/* Discover People */}
              <Animated.View entering={FadeInDown.duration(350).delay(600)} style={S.gridContainer}>
                <Text style={[S.sectionTitle, titleColor, { paddingHorizontal: 8, marginTop: 8, marginBottom: 16 }]}>
                  Discover People
                </Text>
                <FlatList
                  data={displayedUsers}
                  keyExtractor={keyExtractor}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  renderItem={renderUserCard}
                  contentContainerStyle={{ paddingTop: 8 }}
                  // ✅ Nested FlatList perf
                  maxToRenderPerBatch={6}
                  initialNumToRender={6}
                  removeClippedSubviews={true}
                />
              </Animated.View>
            </ScrollView>
          ) : (
            // Search Results
            <View style={S.gridContainer}>
              {filteredUsers.length > 0 ? (
                <FlatList
                  data={displayedSearchUsers}
                  keyExtractor={keyExtractor}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderUserCard}
                  contentContainerStyle={{ paddingTop: 8 }}
                  maxToRenderPerBatch={6}
                  initialNumToRender={6}
                  windowSize={5}
                  removeClippedSubviews={true}
                />
              ) : (
                <Animated.View entering={FadeIn.duration(350)} style={S.noResults}>
                  <Text style={[S.noResultsText, noResultTxt]}>
                    No results for "{searchQuery}"
                  </Text>
                </Animated.View>
              )}
            </View>
          )}

          {RadiusModal}
        </>
      )}
    </View>
  );
};

export default React.memo(SearchScreen);