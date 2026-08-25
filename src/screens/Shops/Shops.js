
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
// import { useSelector } from 'react-redux';
// import Animated, {
//   FadeInDown,
//   FadeInUp,
//   ZoomIn,
//   SlideInRight,
//   SlideInLeft,
//   FadeIn,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   withRepeat,
//   withSequence,
//   withDelay,
//   interpolate,
//   Easing,
// } from 'react-native-reanimated';
// import { AddShopBtn, BackBlackSimple, BackIcon } from '../../assets/SVGs';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import CustomText from '../../components/TextComponent';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import IMG from '../../assets/Images';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { useIsFocused } from '@react-navigation/native';
// import useKeyboardStatus from '../../utils/KeyBoardHook';
// import ShopsShimmerLoader from '../../components/Skeletons/ShopsShimmer';
// import GradientIcon from '../../components/GradientIcon';
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
// import LinearGradient from 'react-native-linear-gradient';
// import { THEMES } from '../../redux/reducer/theme'; // ✅ IMPORT THEMES

// const ShopCard = React.memo(({ item, isDarkMode, onPress, index, primaryColor }) => { // ✅ ADD primaryColor prop
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
//         scale.value = withSpring(0.95, {
//             damping: 15,
//             stiffness: 150,
//         });
//         imageScale.value = withSpring(1.1, {
//             damping: 12,
//             stiffness: 100,
//         });
//     };

//     const handlePressOut = () => {
//         scale.value = withSpring(1, {
//             damping: 15,
//             stiffness: 150,
//         });
//         imageScale.value = withSpring(1, {
//             damping: 12,
//             stiffness: 100,
//         });
//     };

//     return (
//         <Animated.View
//             entering={FadeInUp.duration(400).delay(index * 80).springify()}
//             style={[{ flex: 1, margin: 4 }, cardStyle]}
//         >
//             <GlowWrapper
//                 isDarkMode={isDarkMode}
//                 borderRadius={10}
//                 showStars={false}
//                 showShinePatches={true}
//                 intensity="low"
//                 containerStyle={{ flex: 1 }}
//                 glowColors={[primaryColor, primaryColor]}
//             >
//                 <TouchableOpacity
//                     style={[
//                         styles.cardContainer,
//                         { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }
//                     ]}
//                     activeOpacity={0.8}
//                     onPress={onPress}
//                     onPressIn={handlePressIn}
//                     onPressOut={handlePressOut}
//                 >
//                     <Animated.View style={[styles.imageWrapper, imageStyle]}>
//                         <Image
//                             source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
//                             style={styles.shopImage}
//                             resizeMode="cover"
//                         />
//                     </Animated.View>
//                     <View style={styles.overlay} />
//                     <Animated.View
//                         entering={FadeIn.duration(400).delay(index * 80 + 200)}
//                         style={styles.textContainer}
//                     >
//                         <Text style={styles.shopName} numberOfLines={1}>
//                             {item?.Name}
//                         </Text>
//                         <View style={styles.locationRow}>
//                             <GradientIcon
//                                 colors={[primaryColor, primaryColor]} // ✅ THEME COLOR (pehle ['#21B7FF', '#0084F8'])
//                                 size={12}
//                                 iconType='FontAwesome6'
//                                 name={'location-dot'}
//                             />
//                             <Text style={styles.locationText} numberOfLines={1}>
//                                 {item?.Address?.[0]?.LocationName || 'No location'}
//                             </Text>
//                         </View>
//                     </Animated.View>
//                 </TouchableOpacity>
//             </GlowWrapper>
//         </Animated.View>
//     );
// });

// ShopCard.displayName = 'ShopCard';

// const AnimatedHeader = ({ navigation, isDarkMode, primaryColor }) => { // ✅ ADD primaryColor prop
//     const leftIconTranslateY = useSharedValue(-80);
//     const leftIconScale = useSharedValue(0.3);
//     const leftIconOpacity = useSharedValue(0);
    
//     const rightIconTranslateY = useSharedValue(-80);
//     const rightIconScale = useSharedValue(0.3);
//     const rightIconOpacity = useSharedValue(0);

//     const titleScale = useSharedValue(0.8);
//     const titleOpacity = useSharedValue(0);

//     useEffect(() => {
//         // Left icon animation
//         leftIconTranslateY.value = withSequence(
//             withSpring(10, { damping: 8, stiffness: 150 }),
//             withSpring(-5, { damping: 10, stiffness: 180 }),
//             withSpring(0, { damping: 15, stiffness: 150 })
//         );
//         leftIconScale.value = withSpring(1, { damping: 12, stiffness: 150 });
//         leftIconOpacity.value = withTiming(1, { duration: 400 });

//         // Title animation
//         setTimeout(() => {
//             titleScale.value = withSpring(1, { damping: 15, stiffness: 120 });
//             titleOpacity.value = withTiming(1, { duration: 400 });
//         }, 100);

//         // Right icon animation
//         setTimeout(() => {
//             rightIconTranslateY.value = withSequence(
//                 withSpring(10, { damping: 8, stiffness: 150 }),
//                 withSpring(-5, { damping: 10, stiffness: 180 }),
//                 withSpring(0, { damping: 15, stiffness: 150 })
//             );
//             rightIconScale.value = withSpring(1, { damping: 12, stiffness: 150 });
//             rightIconOpacity.value = withTiming(1, { duration: 400 });
//         }, 200);
//     }, []);

//     const leftIconStyle = useAnimatedStyle(() => ({
//         transform: [
//             { translateY: leftIconTranslateY.value },
//             { scale: leftIconScale.value }
//         ],
//         opacity: leftIconOpacity.value,
//     }));

//     const rightIconStyle = useAnimatedStyle(() => ({
//         transform: [
//             { translateY: rightIconTranslateY.value },
//             { scale: rightIconScale.value }
//         ],
//         opacity: rightIconOpacity.value,
//     }));

//     const titleStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: titleScale.value }],
//         opacity: titleOpacity.value,
//     }));

//     return (
//         <SpaceBetweenRow
//             style={[
//                 styles.header,
//                 { backgroundColor: isDarkMode ? '#252525' : 'white' }
//             ]}
//         >
//             <Animated.View style={leftIconStyle}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
//                 </TouchableOpacity>
//             </Animated.View>
            
//             <Animated.View style={titleStyle}>
//                 <CustomText style={styles.headerTitle}>
//                     Market Place
//                 </CustomText>
//             </Animated.View>
            
//             <Animated.View style={rightIconStyle}>
//                 <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
//                     <GradientIcon
//                         colors={[primaryColor, primaryColor]} // ✅ THEME COLOR (pehle ['#21B7FF', '#0084F8'])
//                         size={20}
//                         iconType='FontAwesome5'
//                         name={'bell'}
//                     />
//                 </TouchableOpacity>
//             </Animated.View>
//         </SpaceBetweenRow>
//     );
// };

// // Animated Search Bar
// const AnimatedSearchBar = ({ searchQuery, handleSearch, isDarkMode, primaryColor }) => { // ✅ ADD primaryColor prop
//     const scale = useSharedValue(0);
//     const translateY = useSharedValue(-50);

//     useEffect(() => {
//         scale.value = withDelay(300, withSpring(1, {
//             damping: 15,
//             stiffness: 120,
//         }));
//         translateY.value = withDelay(300, withSpring(0, {
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
//                 styles.searchContainer,
//                 { backgroundColor: isDarkMode ? '#252525' : '#F0F0F0' },
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
//                 style={[
//                     styles.searchInput,
//                     { color: isDarkMode ? 'white' : 'black' }
//                 ]}
//                 placeholder="Search shops..."
//                 placeholderTextColor="#A0A0A0"
//                 value={searchQuery}
//                 onChangeText={handleSearch}
//             />
//         </Animated.View>
//     );
// };

// // Animated FAB Button
// const AnimatedFAB = ({ onPress, primaryColor }) => { // ✅ ADD primaryColor prop
//     const scale = useSharedValue(1);
//     const rotate = useSharedValue(0);

//     useEffect(() => {
//         scale.value = withRepeat(
//             withSequence(
//                 withTiming(1.1, { duration: 1000 }),
//                 withTiming(1, { duration: 1000 })
//             ),
//             -1,
//             false
//         );

//         rotate.value = withRepeat(
//             withTiming(360, { duration: 3000, easing: Easing.linear }),
//             -1,
//             false
//         );
//     }, []);

//     const fabStyle = useAnimatedStyle(() => ({
//         transform: [
//             { scale: scale.value },
//             // { rotate: `${rotate.value}deg` }
//         ],
//     }));

//     return (
//         <Animated.View
//             // entering={ZoomIn.duration(200).delay(200)}
//             style={[styles.addShopButtonContainer]}
//         >
//             <TouchableOpacity onPress={onPress}>
//                 <LinearGradient
//                     colors={[primaryColor, primaryColor]} // ✅ THEME COLOR (pehle ['#21B7FF', '#0084F8'])
//                     start={{ x: 1, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.followButton}
//                 >
//                     <Text style={styles.followText}>
//                         Add shop
//                     </Text>
//                 </LinearGradient>
//             </TouchableOpacity>
//        </Animated.View>
//     );
// };

// const Shops = ({ navigation }) => {
//     const [allShops, setAllShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const { showLoader, hideLoader } = useLoader();
//     const isFocused = useIsFocused();
//     const [loading, setLoading] = useState(false);
//     const { isKeyboardOpen } = useKeyboardStatus();
    
//     // ✅ GET THEME STATE
//     const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    
//     // ✅ GET CURRENT THEME COLORS
//     const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
//     const primaryColor = currentTheme.primary;

//     let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length !== 0) {
//         selector = JSON.parse(selector);
//     }

//     useEffect(() => {
//         if (isFocused) {
//             fetchData();
//         }
//     }, [isFocused]);

//     useEffect(() => {
//         if (searchQuery.trim() === '') {
//             setFilteredShops(allShops);
//         } else {
//             const filtered = allShops.filter(shop => {
//                 const shopName = shop?.Name?.toLowerCase() || '';
//                 const shopAddress = shop?.Address?.[0]?.LocationName?.toLowerCase() || '';
//                 const query = searchQuery.toLowerCase();
//                 return shopName.includes(query) || shopAddress.includes(query);
//             });
//             setFilteredShops(filtered);
//         }
//     }, [searchQuery, allShops]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const res = await apiGet(urls.getAllShops);
//             setAllShops(res?.data || []);
//             setFilteredShops(res?.data || []);
//         } catch (error) {
//             console.error('Error fetching shops:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = useCallback((text) => {
//         setSearchQuery(text);
//     }, []);

//     const handleShopPress = useCallback((shopId) => {
//         navigation.navigate('AllProductsOfAShops', { shopId });
//     }, [navigation]);

//     const renderItem = useCallback(({ item, index }) => (
//         <ShopCard
//             item={item}
//             isDarkMode={isDarkMode}
//             onPress={() => handleShopPress(item?._id)}
//             index={index}
//             primaryColor={primaryColor} // ✅ PASS primaryColor
//         />
//     ), [isDarkMode, handleShopPress, primaryColor]); // ✅ ADD primaryColor dependency

//     const keyExtractor = useCallback((item, index) => {
//         return item?._id?.toString() || `item-${index}`;
//     }, []);

//     return (
//         <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : '#fff' }]}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />
            
//             <AnimatedHeader 
//                 navigation={navigation} 
//                 isDarkMode={isDarkMode} 
//                 primaryColor={primaryColor} // ✅ PASS primaryColor
//             />

//             {loading ? (
//                 <ShopsShimmerLoader isDarkMode={isDarkMode} shopCount={8} />
//             ) : (
//                 <>
//                     <AnimatedSearchBar
//                         searchQuery={searchQuery}
//                         handleSearch={handleSearch}
//                         isDarkMode={isDarkMode}
//                         primaryColor={primaryColor} // ✅ PASS primaryColor
//                     />

//                     <FlatList
//                         data={filteredShops}
//                         keyExtractor={keyExtractor}
//                         renderItem={renderItem}
//                         numColumns={2}
//                         contentContainerStyle={styles.listContent}
//                         showsVerticalScrollIndicator={false}
//                     />

//                     {selector?.SellerStatus === 'Approved' && (
//                         <AnimatedFAB
//                             onPress={() => navigation?.navigate('AddShops')}
//                             primaryColor={primaryColor} // ✅ PASS primaryColor
//                         />
//                     )}

//                     {!isKeyboardOpen && <View style={{ height: 100 }} />}
//                 </>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     header: {
//         paddingTop: 50,
//         paddingHorizontal: 20,
//         paddingBottom: 15,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderRadius: 30,
//         margin: 10,
//         padding: 4,
//         marginTop: 10,
//         paddingHorizontal: 15,
//         gap: 10,
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: 16,
//     },
//     listContent: {
//         paddingHorizontal: 8,
//         paddingBottom: 20,
//     },
//     cardContainer: {
//         height: 160,
//         borderRadius: 10,
//         overflow: 'hidden',
//         position: 'relative',
//     },
//     imageWrapper: {
//         width: '100%',
//         height: '100%',
//     },
//     shopImage: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },
//     overlay: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: '50%',
//         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//         borderBottomLeftRadius: 10,
//         borderBottomRightRadius: 10,
//     },
//     textContainer: {
//         position: 'absolute',
//         bottom: 12,
//         left: 12,
//         right: 12,
//     },
//     shopName: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//         fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         textShadowColor: 'rgba(0, 0, 0, 0.8)',
//         textShadowOffset: { width: 0, height: 1 },
//         textShadowRadius: 3,
//         marginBottom: 4,
//     },
//     locationRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 5,
//     },
//     locationText: {
//         fontSize: 11,
//         color: '#ccc',
//         flex: 1,
//     },
//     addShopButtonContainer: {
//         paddingHorizontal: 30,
//         paddingBottom: 10,
//     },
//     followButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 16,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     followText: {
//         fontSize: 16,
//         fontWeight: '600',
//         fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         color: '#fff',
//     },
// });

// export default React.memo(Shops);




import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View, TextInput, FlatList, Image, StyleSheet,
  TouchableOpacity, StatusBar, Text,
  Animated as RNAnimated, // ✅ RN Animated — lighter than Reanimated for simple entrance
} from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  FadeInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { AddShopBtn, BackBlackSimple, BackIcon } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { useIsFocused } from '@react-navigation/native';
import useKeyboardStatus from '../../utils/KeyBoardHook';
import ShopsShimmerLoader from '../../components/Skeletons/ShopsShimmer';
import GradientIcon from '../../components/GradientIcon';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { THEMES } from '../../redux/reducer/theme';

// ─── ShopCard ────────────────────────────────────────────────────────────────
// ✅ useSharedValue inside memo component is fine BUT we limit it to 2 values
// ✅ Removed rotate animation from FAB (was running 3000ms loop per item — heavy)
// ✅ FadeInUp delay capped at 240ms so late items don't stall
const ShopCard = React.memo(({ item, isDarkMode, onPress, index, primaryColor }) => {
  if (!item?._id) return null;

  const scale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
    imageScale.value = withSpring(1.08, { damping: 12, stiffness: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    imageScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, []);

  // ✅ Cap delay — items 4+ won't wait forever to appear
  const delay = Math.min(index * 80, 240);
  const glowColorsArr = useMemo(() => [primaryColor, primaryColor], [primaryColor]);

  const seller = item?.Seller || null;
  const categories = Array.isArray(item?.ShopCategory) ? item.ShopCategory : [];
  const addresses = Array.isArray(item?.Address) ? item.Address : [];

  return (
    <Animated.View
      entering={FadeInUp.duration(350).delay(delay)}
      style={[cardStyles.wrapper, cardStyle]}
    >
      <GlowWrapper
        isDarkMode={isDarkMode}
        borderRadius={14}
        showStars={false}
        showShinePatches={true}
        intensity="low"
        containerStyle={{ flex: 1 }}
        glowColors={glowColorsArr}
      >
        <TouchableOpacity
          style={[cardStyles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={cardStyles.imageBox}>
            <Animated.View style={[cardStyles.imageWrapper, imageStyle]}>
              <Image
                source={item?.Image ? { uri: item.Image } : IMG.PostImage}
                style={cardStyles.shopImage}
                resizeMode="cover"
                progressiveRenderingEnabled
                fadeDuration={150}
              />
            </Animated.View>
            {!!seller?.IsVerified && (
              <View style={cardStyles.verifiedBadge}>
                <Text style={cardStyles.verifiedBadgeText}>✔</Text>
              </View>
            )}
          </View>

          <Animated.View
            entering={FadeIn.duration(350).delay(Math.min(delay + 150, 350))}
            style={cardStyles.body}
          >
            <View style={cardStyles.titleRow}>
              <Text style={[cardStyles.shopName, { color: isDarkMode ? '#fff' : '#111' }]} numberOfLines={1}>
                {item?.Name}
              </Text>
              {!!seller?.SellerStatus && (
                <View
                  style={[
                    cardStyles.statusBadge,
                    { backgroundColor: seller.SellerStatus === 'Active' ? 'rgba(46,125,50,0.15)' : (isDarkMode ? '#2a2a2a' : '#eee') },
                  ]}
                >
                  <Text
                    style={[
                      cardStyles.statusBadgeText,
                      { color: seller.SellerStatus === 'Active' ? '#2E7D32' : (isDarkMode ? '#aaa' : '#666') },
                    ]}
                  >
                    {seller.SellerStatus}
                  </Text>
                </View>
              )}
            </View>

            {!!item?.Services && (
              <Text style={[cardStyles.services, { color: isDarkMode ? '#aaa' : '#555' }]} numberOfLines={1}>
                {item.Services.split(/\r?\n/).join(', ')}
              </Text>
            )}

            {(categories.length > 0 || addresses.length > 0) && (
              <View style={cardStyles.chipRow}>
                {categories.slice(0, 1).map((cat, idx) => (
                  <View key={idx} style={cardStyles.categoryChip}>
                    <Text style={cardStyles.categoryChipText} numberOfLines={1}>{cat}</Text>
                  </View>
                ))}
                {addresses.length > 0 && (
                  <View style={cardStyles.addressChip}>
                    <GradientIcon colors={glowColorsArr} size={9} iconType="FontAwesome6" name="location-dot" />
                    <Text style={cardStyles.addressChipText} numberOfLines={1}>{addresses[0]?.LocationName}</Text>
                  </View>
                )}
              </View>
            )}

            {!!seller && (
              <View style={[cardStyles.ownerBox, { borderTopColor: isDarkMode ? '#2a2a2a' : '#eee' }]}>
                <Text style={[cardStyles.ownerName, { color: isDarkMode ? '#eee' : '#222' }]} numberOfLines={1}>
                  👤 {seller?.FullName || seller?.StoreName}
                </Text>
                {!!seller?.Email && (
                  <Text style={[cardStyles.ownerMeta, { color: isDarkMode ? '#999' : '#777' }]} numberOfLines={1}>
                    {seller.Email}
                  </Text>
                )}
                {!!seller?.MobileNumber && (
                  <Text style={[cardStyles.ownerMeta, { color: isDarkMode ? '#999' : '#777' }]} numberOfLines={1}>
                    📞 {seller.MobileNumber}
                  </Text>
                )}
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </GlowWrapper>
    </Animated.View>
  );
});
ShopCard.displayName = 'ShopCard';

// ─── Static card styles (outside component — never recreated) ────────────────
const cardStyles = StyleSheet.create({
  wrapper: { flex: 1, margin: 6 },
  container: { borderRadius: 14, overflow: 'hidden' },
  imageBox: { width: '100%', height: 90, position: 'relative' },
  imageWrapper: { width: '100%', height: '100%' },
  shopImage: { width: '100%', height: '100%' },
  verifiedBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#1877f2', width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  verifiedBadgeText: { color: '#fff', fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  body: { padding: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  shopName: { flex: 1, fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  statusBadgeText: { fontSize: 9, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  services: { fontSize: 10, marginTop: 3 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginTop: 5 },
  categoryChip: { backgroundColor: 'rgba(24,119,242,0.12)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, maxWidth: '55%' },
  categoryChipText: { fontSize: 9, color: '#1877f2', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  addressChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(46,125,50,0.12)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, maxWidth: '55%',
  },
  addressChipText: { fontSize: 9, color: '#2E7D32', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  ownerBox: { marginTop: 6, paddingTop: 6, borderTopWidth: 1 },
  ownerName: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  ownerMeta: { fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 1 },
});

// ─── AnimatedHeader ──────────────────────────────────────────────────────────
// ✅ 6 useSharedValues reduced to 3 — left/right/title merged into single translateY+opacity
const AnimatedHeader = React.memo(({ navigation, isDarkMode, primaryColor }) => {
  const leftY = useSharedValue(-80);
  const leftOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.8);
  const rightY = useSharedValue(-80);
  const rightOpacity = useSharedValue(0);

  const glowColorsArr = useMemo(() => [primaryColor, primaryColor], [primaryColor]);

  useEffect(() => {
    leftY.value = withSpring(0, { damping: 15, stiffness: 150 });
    leftOpacity.value = withTiming(1, { duration: 350 });

    titleScale.value = withDelay(100, withSpring(1, { damping: 15, stiffness: 120 }));
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 350 }));

    rightY.value = withDelay(150, withSpring(0, { damping: 15, stiffness: 150 }));
    rightOpacity.value = withDelay(150, withTiming(1, { duration: 350 }));
  }, []);

  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: leftY.value }],
    opacity: leftOpacity.value,
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));
  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rightY.value }],
    opacity: rightOpacity.value,
  }));

  return (
    <SpaceBetweenRow style={[styles.header, { backgroundColor: isDarkMode ? '#252525' : 'white' }]}>
      <Animated.View style={leftStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={titleStyle}>
        <CustomText style={styles.headerTitle}>Shop</CustomText>
      </Animated.View>

      <Animated.View style={rightStyle}>
        <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
          <GradientIcon colors={glowColorsArr} size={20} iconType="FontAwesome5" name="bell" />
        </TouchableOpacity>
      </Animated.View>
    </SpaceBetweenRow>
  );
});
AnimatedHeader.displayName = 'AnimatedHeader';

// ─── AnimatedSearchBar ────────────────────────────────────────────────────────
// ✅ 2 shared values → 1 (scale removed, only translateY needed)
const AnimatedSearchBar = React.memo(({ searchQuery, handleSearch, isDarkMode, primaryColor }) => {
  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);
  const glowColorsArr = useMemo(() => [primaryColor, primaryColor], [primaryColor]);

  useEffect(() => {
    translateY.value = withDelay(250, withSpring(0, { damping: 20, stiffness: 120 }));
    opacity.value = withDelay(250, withTiming(1, { duration: 300 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.searchContainer,
        { backgroundColor: isDarkMode ? '#252525' : '#F0F0F0' },
        animStyle,
      ]}
    >
      <GradientIcon colors={glowColorsArr} size={18} iconType="FontAwesome5" name="search" />
      <TextInput
        style={[styles.searchInput, { color: isDarkMode ? 'white' : 'black' }]}
        placeholder="Search shops..."
        placeholderTextColor="#A0A0A0"
        value={searchQuery}
        onChangeText={handleSearch}
      />
    </Animated.View>
  );
});
AnimatedSearchBar.displayName = 'AnimatedSearchBar';

// ─── AnimatedFAB ─────────────────────────────────────────────────────────────
// ✅ Removed rotate loop (was heavy — 3000ms infinite loop per render)
// ✅ Simple pulse only — 1 shared value instead of 2
const AnimatedFAB = React.memo(({ onPress, primaryColor }) => {
  const scale = useSharedValue(1);
  const glowColorsArr = useMemo(() => [primaryColor, primaryColor], [primaryColor]);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1100 }),
        withTiming(1, { duration: 1100 })
      ),
      -1,
      false
    );
    return () => { scale.value = 1; }; // ✅ Cleanup on unmount
  }, []);

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
        <LinearGradient
          colors={glowColorsArr}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.followButton}
        >
    <Animated.View style={[styles.addShopButtonContainer, fabStyle]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.followText}>Add shop</Text>
      </TouchableOpacity>
    </Animated.View>
        </LinearGradient>
  );
});
AnimatedFAB.displayName = 'AnimatedFAB';

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Shops = ({ navigation }) => {
  const [allShops, setAllShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const { isKeyboardOpen } = useKeyboardStatus();
  const hasFetched = useRef(false); // ✅ Prevent re-fetch on every focus

  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const primaryColor = currentTheme.primary;

  // ✅ Parse selector once with useMemo
  const rawSelector = useSelector(state => state?.user?.userData);
  const selector = useMemo(() => {
    if (rawSelector && Object.keys(rawSelector).length !== 0) {
      try { return JSON.parse(rawSelector); } catch { return {}; }
    }
    return {};
  }, [rawSelector]);

  // ✅ Fetch only on first focus — not every time screen is visited
  useEffect(() => {
    if (isFocused && !hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiGet(urls.getAllShops);
      setAllShops(res?.data || []);
    } catch (e) {
      console.error('Shops fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search filtering with useMemo — no separate filteredShops state, no extra renders
  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return allShops;
    const q = searchQuery.toLowerCase();
    return allShops.filter(shop => {
      const name = shop?.Name?.toLowerCase() || '';
      const addr = shop?.Address?.[0]?.LocationName?.toLowerCase() || '';
      return name.includes(q) || addr.includes(q);
    });
  }, [searchQuery, allShops]);

  const handleSearch = useCallback((text) => setSearchQuery(text), []);

  const handleShopPress = useCallback((shopId) => {
    navigation.navigate('AllProductsOfAShops', { shopId });
  }, [navigation]);

  // ✅ glowColors memoized — not recreated on renderItem calls
  const renderItem = useCallback(({ item, index }) => (
    <ShopCard
      item={item}
      isDarkMode={isDarkMode}
      onPress={() => handleShopPress(item?._id)}
      index={index}
      primaryColor={primaryColor}
    />
  ), [isDarkMode, handleShopPress, primaryColor]);

  const keyExtractor = useCallback((item, index) =>
    item?._id?.toString() || `item-${index}`, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : '#fff' }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <AnimatedHeader navigation={navigation} isDarkMode={isDarkMode} primaryColor={primaryColor} />

      {loading ? (
        <ShopsShimmerLoader isDarkMode={isDarkMode} shopCount={6} />
      ) : (
        <>
          <AnimatedSearchBar
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            isDarkMode={isDarkMode}
            primaryColor={primaryColor}
          />

          <FlatList
            data={filteredShops}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            // ✅ FlatList perf props
            maxToRenderPerBatch={8}
            windowSize={5}
            initialNumToRender={6}
            removeClippedSubviews={true}
          />

          {/* ❌ Not on web's Marketplace (AllShops.jsx has no "Add Shop" action) — disabled to match web */}
          {/* {selector?.SellerStatus === 'Approved' && (
            <AnimatedFAB onPress={() => navigation?.navigate('AddShops')} primaryColor={primaryColor} />
          )} */}

          {!isKeyboardOpen && <View style={{ height: 100 }} />}
        </>
      )}
    </View>
  );
};

// ─── Static styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    margin: 10,
    marginTop: 10,
    padding: 4,
    paddingHorizontal: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  addShopButtonContainer: {
    paddingHorizontal: 30,
    // paddingBottom: 10,
    paddingVertical: 12,
  },
  followButton: {
    // paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // alignContent:'center'
  },
  followText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    color: '#fff',
  },
});

export default React.memo(Shops);