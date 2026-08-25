
// import React, { useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Share,
//   Pressable,
//   StatusBar,
// } from 'react-native'
// import Animated, {
//   SlideInRight,
//   FadeIn,
//   FadeInDown,
//   FadeOut,
// } from 'react-native-reanimated'
// import { FONTS_FAMILY } from '../assets/Fonts'
// import SpaceBetweenRow from './wrapper/spacebetween'
// import { clearAsyncStorage } from '../utils/Apis'
// import { showError } from '../utils/helperFunctions'
// import IMG from '../assets/Images'
// import { useSelector } from 'react-redux'

// const SettingsDrawerScreen = ({ navigation }) => {
//   const { isDarkMode } = useSelector(state => state.theme)

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Do you really want to logout?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Yes',
//           onPress: async () => {
//             try {
//               await clearAsyncStorage()
//               navigation?.replace('Login')
//             } catch (error) {
//               showError('Error while logging out')
//             }
//           },
//         },
//       ],
//       { cancelable: true },
//     )
//   }

//   const handleOperation = async label => {
//     const closeDrawer = () => {
//       navigation.goBack()
//     }

//     switch (label) {
//       case 'Log Out':
//         handleLogout()
//         break
//       case 'Terms & Conditions':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('TermsAndConditions'), 300)
//         break
//       case 'Feedback':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('FeedBack'), 300)
//         break
//       case 'Help Center':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('ContactUs'), 300)
//         break

//       case 'AI chat Bot':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('ReactNativeChatbot'), 300)
//         break
        
//       case 'Promotions (New)*':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('MyPromotions'), 300)
//         break
//       case 'Privacy Policy':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('PrivacyPolicy'), 300)
//         break
//       case 'FAQ':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('FAQs'), 300)
//         break
//       case 'Followers':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('Followers'), 300)
//         break
//       case 'Request to become Seller':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('RequestBecomSeller'), 300)
//         break
//       case 'Saved Posts':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('SavedPosts'), 300)
//         break
//       case 'All Shops':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('Tab', { screen: 'MarketPlace' }), 300)
//         break
//       case 'Settings':
//         closeDrawer()
//         setTimeout(() => navigation.navigate('Settings'), 300)
//         break
//       case 'Invite a Freind':
//         handleInvite()
//         break
//       default:
//         break
//     }
//   }

//   const handleInvite = async () => {
//     const inviteLink = 'https://www.example.com/invite'

//     try {
//       const result = await Share.share({
//         message: `Hey! Check out this amazing app: ${inviteLink}`,
//         url: inviteLink,
//         title: 'Invite a Friend',
//       })

//       if (result.action === Share.sharedAction) {
//         // console.log('Shared successfully')
//         navigation.goBack()
//       } else if (result.action === Share.dismissedAction) {
//         // console.log('Share dismissed')
//       }
//     } catch (error) {
//       console.error('Error sharing invite:', error.message)
//     }
//   }

//   const OptionItem = ({ label, index }) => (
//     <Animated.View entering={FadeInDown.delay(index * 30).duration(300)}>
//       <TouchableOpacity
//         style={styles.optionItem}
//         onPress={() => handleOperation(label)}
//         activeOpacity={0.7}>
//         <View
//           style={{
//             backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
//             borderRadius: 10,
//             width: '100%',
//             padding: 12,
//           }}>
//           <Text
//             style={{
//               color: isDarkMode ? 'white' : 'black',
//               fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//               fontSize: 15,
//             }}>
//             {label}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   )

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       flexDirection: 'row',
//       backgroundColor: 'transparent',
//     },
//     backdrop: {
//       flex: 1,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     drawerContainer: {
//       width: '80%',
//       height: '100%',
//       backgroundColor: isDarkMode ? '#000000' : '#f8f8f8',
//       paddingHorizontal: 15,
//     },
//     logoContainer: {
//       alignItems: 'center',
//       marginVertical: 20,
//       top: 20
//     },
//     logo: {
//       height: 100,
//       width: 100,
//       borderRadius: 20,
//     },
//     options: {
//       marginTop: 20,
//       gap: 8,
//     },
//     optionItem: {
//       paddingVertical: 4,
//     },
//     divider: {
//       height: 0.5,
//       backgroundColor: isDarkMode ? '#333' : '#ddd',
//       width: '90%',
//       marginVertical: 15,
//       alignSelf: 'center',
//     },
//   })

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         backgroundColor="rgba(0,0,0,0.5)"
//         barStyle="light-content"
//         translucent
//       />

//       {/* Backdrop - tap to close */}
//       <Pressable
//         style={styles.backdrop}
//         onPress={() => navigation.goBack()}
//       />

//       {/* Drawer Content */}
//       <Animated.View
//         entering={SlideInRight.duration(300)}
//         exiting={FadeOut.duration(200)}
//         style={styles.drawerContainer}
//       >
//         {/* Logo */}
//         <Animated.View
//           entering={FadeIn.delay(100)}
//           style={styles.logoContainer}
//         >
//           <Image
//             source={IMG.TomoLogo}
//             style={styles.logo}
//           />
//         </Animated.View>

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 40 }}
//         >
//           {/* Options */}
//           <View style={styles.options}>
//             <OptionItem label='Followers' index={0} />

//             {selector?.SellerStatus !== 'Approved' && (
//               <OptionItem label='Request to become Seller' index={1} />
//             )}

//             {selector?.SellerStatus === 'Approved' && (
//               <OptionItem label='All Shops' index={1} />
//             )}

//             <OptionItem label='Saved Posts' index={2} />
//             <OptionItem label='Promotions (New)*' index={3} />
//             <OptionItem label='Privacy Policy' index={4} />
//             <OptionItem label='Terms & Conditions' index={5} />
//             <OptionItem label='Invite a Freind' index={6} />
//             <OptionItem label='Feedback' index={7} />
//             <OptionItem label='FAQ' index={8} />
//             <OptionItem label='AI chat Bot' index={9} />
//             <OptionItem label='Settings' index={10} />
//             <OptionItem label='Log Out' index={11} />

//             <View style={styles.divider} />
//           </View>
//         </ScrollView>
//       </Animated.View>
//     </View>
//   )
// }

// export default SettingsDrawerScreen




// import React, { useCallback, useMemo } from 'react'
// import {
//   View, Text, Image, TouchableOpacity, StyleSheet,
//   Alert, ScrollView, Share, Pressable, StatusBar,
// } from 'react-native'
// import Animated, {
//   SlideInRight, FadeIn, FadeInDown, FadeOut,
//   useSharedValue, useAnimatedStyle, withSpring,
// } from 'react-native-reanimated'
// import LinearGradient from 'react-native-linear-gradient'
// import { FONTS_FAMILY } from '../assets/Fonts'
// import { clearAsyncStorage } from '../utils/Apis'
// import { showError } from '../utils/helperFunctions'
// import IMG from '../assets/Images'
// import { useSelector } from 'react-redux'
// import { THEMES } from '../redux/reducer/theme'
// import Feather from 'react-native-vector-icons/Feather'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import AntDesign from 'react-native-vector-icons/AntDesign'

// // ─── Menu config — grouped, with icons ───────────────────────────────────────
// const MENU_GROUPS = [
//   {
//     title: 'Social',
//     items: [
//       { label: 'Followers',        icon: 'people',           iconType: 'Ionicons',    nav: 'Followers' },
//       { label: 'Saved Posts',      icon: 'bookmark',         iconType: 'Feather',     nav: 'SavedPosts' },
//       { label: 'Invite a Friend',  icon: 'user-plus',        iconType: 'Feather',     nav: 'invite' },
//     ],
//   },
//   {
//     title: 'Business',
//     items: [
//       { label: 'All Shops',        icon: 'shopping-bag',     iconType: 'Feather',     nav: 'AllShops',    sellerOnly: true },
//       { label: 'Become a Seller',  icon: 'briefcase',        iconType: 'Feather',     nav: 'RequestBecomSeller', nonSellerOnly: true },
//       { label: 'Promotions',       icon: 'trending-up',      iconType: 'Feather',     nav: 'MyPromotions', badge: 'NEW' },
//     ],
//   },
//   {
//     title: 'Tools',
//     items: [
//       { label: 'AI Chat Bot',      icon: 'robot',            iconType: 'MaterialCommunityIcons', nav: 'ReactNativeChatbot' },
//       { label: 'Settings',         icon: 'settings',         iconType: 'Feather',     nav: 'Settings' },
//       { label: 'Help Center',      icon: 'help-circle',      iconType: 'Feather',     nav: 'ContactUs' },
//       { label: 'Feedback',         icon: 'message-square',   iconType: 'Feather',     nav: 'FeedBack' },
//     ],
//   },
//   {
//     title: 'Legal',
//     items: [
//       { label: 'Privacy Policy',   icon: 'shield',           iconType: 'Feather',     nav: 'PrivacyPolicy' },
//       { label: 'Terms & Conditions',icon: 'file-text',       iconType: 'Feather',     nav: 'TermsAndConditions' },
//       { label: 'FAQ',              icon: 'help-circle',      iconType: 'AntDesign',   nav: 'FAQs' },
//     ],
//   },
// ]

// // ─── Single menu item with press scale ───────────────────────────────────────
// const MenuItem = React.memo(({ item, index, isDarkMode, primaryColor, onPress }) => {
//   const scale = useSharedValue(1)
//   const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

//   const handlePressIn = useCallback(() => { scale.value = withSpring(0.96, { damping: 15 }) }, [])
//   const handlePressOut = useCallback(() => { scale.value = withSpring(1, { damping: 15 }) }, [])

//   const IconComponent =
//     item.iconType === 'Ionicons' ? Ionicons :
//     item.iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
//     item.iconType === 'AntDesign' ? AntDesign : Feather

//   return (
//     <Animated.View
//       entering={FadeInDown.duration(280).delay(index * 35)}
//       style={animStyle}
//     >
//       <TouchableOpacity
//         style={[S.menuItem, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
//         onPress={onPress}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         activeOpacity={1}
//       >
//         {/* Icon pill */}
//         <View style={[S.iconPill, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
//           <IconComponent name={item.icon} size={17} color={primaryColor} />
//         </View>

//         <Text style={[S.menuLabel, { color: isDarkMode ? '#e8e8e8' : '#1a1a1a' }]}>
//           {item.label}
//         </Text>

//         {item.badge && (
//           <View style={[S.badge, { backgroundColor: primaryColor }]}>
//             <Text style={S.badgeText}>{item.badge}</Text>
//           </View>
//         )}

//         <Feather name="chevron-right" size={15} color={isDarkMode ? '#555' : '#ccc'} style={{ marginLeft: 'auto' }} />
//       </TouchableOpacity>
//     </Animated.View>
//   )
// })
// MenuItem.displayName = 'MenuItem'

// // ─── Main Component ───────────────────────────────────────────────────────────
// const SettingsDrawerScreen = ({ navigation }) => {
//   const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme)
//   const currentTheme = THEMES[selectedColorTheme] || THEMES.default
//   const primaryColor = currentTheme.primary
//   const secondaryColor = currentTheme.secondary

//   // ✅ Parse selector once
//   const rawSelector = useSelector(state => state?.user?.userData)
//   const selector = useMemo(() => {
//     if (rawSelector && Object.keys(rawSelector).length !== 0) {
//       try { return JSON.parse(rawSelector) } catch { return {} }
//     }
//     return {}
//   }, [rawSelector])

//   const glowColors = useMemo(() => [primaryColor, secondaryColor], [primaryColor, secondaryColor])

//   const close = useCallback(() => navigation.goBack(), [navigation])

//   const navigate = useCallback((screen) => {
//     close()
//     setTimeout(() => {
//       if (screen === 'AllShops') navigation.navigate('Tab', { screen: 'MarketPlace' })
//       else navigation.navigate(screen)
//     }, 250)
//   }, [close, navigation])

//   const handleLogout = useCallback(() => {
//     Alert.alert('Logout', 'Do you really want to logout?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Yes', style: 'destructive',
//         onPress: async () => {
//           try { await clearAsyncStorage(); navigation?.replace('Login') }
//           catch { showError('Error while logging out') }
//         },
//       },
//     ])
//   }, [navigation])

//   const handleInvite = useCallback(async () => {
//     try {
//       const result = await Share.share({
//         message: `Hey! Check out this amazing app: https://www.example.com/invite`,
//         title: 'Invite a Friend',
//       })
//       if (result.action === Share.sharedAction) close()
//     } catch (e) { console.error('Invite error:', e) }
//   }, [close])

//   const handleItemPress = useCallback((item) => {
//     if (item.nav === 'invite') return handleInvite()
//     navigate(item.nav)
//   }, [navigate, handleInvite])

//   const isSeller = selector?.SellerStatus === 'Approved'

//   // ✅ Filter items based on seller status
//   const filteredGroups = useMemo(() => {
//     return MENU_GROUPS.map(group => ({
//       ...group,
//       items: group.items.filter(item => {
//         if (item.sellerOnly && !isSeller) return false
//         if (item.nonSellerOnly && isSeller) return false
//         return true
//       }),
//     })).filter(group => group.items.length > 0)
//   }, [isSeller])

//   let globalIndex = 0

//   return (
//     <View style={S.container}>
//       <StatusBar backgroundColor="rgba(0,0,0,0.6)" barStyle="light-content" translucent />

//       {/* Backdrop */}
//       <Pressable style={S.backdrop} onPress={close} />

//       {/* Drawer */}
//       <Animated.View
//         entering={SlideInRight.duration(320).springify().damping(18)}
//         exiting={FadeOut.duration(180)}
//         style={[S.drawer, { backgroundColor: isDarkMode ? '#0d0d0d' : '#f5f5f5' }]}
//       >
//         {/* Top gradient accent line */}
//         <LinearGradient
//           colors={glowColors}
//           start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//           style={S.accentLine}
//         />

//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

//           {/* ── User profile card ── */}
//           <Animated.View entering={FadeIn.duration(400).delay(50)} style={S.profileCardWrapper}>
//             <LinearGradient
//               colors={isDarkMode ? ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)'] : ['rgba(0,0,0,0.03)', 'rgba(0,0,0,0.01)']}
//               style={[S.profileCard, { borderColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}
//             >
//               {/* Avatar with gradient ring */}
//               <LinearGradient colors={glowColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.avatarRing}>
//                 <View style={[S.avatarInner, { borderColor: isDarkMode ? '#0d0d0d' : '#f5f5f5' }]}>
//                   <Image
//                     source={selector?.Image ? { uri: selector.Image } : IMG.TomoLogo}
//                     style={S.avatar}
//                   />
//                 </View>
//               </LinearGradient>

//               {/* Name & username */}
//               <View style={S.profileText}>
//                 <Text style={[S.profileName, { color: isDarkMode ? '#fff' : '#111' }]} numberOfLines={1}>
//                   {selector?.FullName || 'Tomo User'}
//                 </Text>
//                 <Text style={[S.profileUsername, { color: isDarkMode ? '#666' : '#888' }]} numberOfLines={1}>
//                   @{selector?.UserName || 'username'}
//                 </Text>
//               </View>

//               {/* Seller badge */}
//               {isSeller && (
//                 <View style={[S.sellerBadge, { backgroundColor: primaryColor + '22', borderColor: primaryColor + '44' }]}>
//                   <Text style={[S.sellerBadgeText, { color: primaryColor }]}>Seller</Text>
//                 </View>
//               )}
//             </LinearGradient>
//           </Animated.View>

//           {/* ── Menu groups ── */}
//           {filteredGroups.map((group) => (
//             <View key={group.title} style={S.group}>
//               <Text style={[S.groupTitle, { color: isDarkMode ? '#444' : '#bbb' }]}>
//                 {group.title.toUpperCase()}
//               </Text>
//               <View style={[S.groupBox, { borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
//                 {group.items.map((item) => {
//                   const idx = globalIndex++
//                   return (
//                     <MenuItem
//                       key={item.label}
//                       item={item}
//                       index={idx}
//                       isDarkMode={isDarkMode}
//                       primaryColor={primaryColor}
//                       onPress={() => handleItemPress(item)}
//                     />
//                   )
//                 })}
//               </View>
//             </View>
//           ))}

//           {/* ── Logout — special red treatment ── */}
//           <Animated.View entering={FadeInDown.duration(280).delay(globalIndex * 35)} style={S.logoutWrapper}>
//             <TouchableOpacity
//               style={S.logoutBtn}
//               onPress={handleLogout}
//               activeOpacity={0.8}
//             >
//               <LinearGradient
//                 colors={['#ff3b3b22', '#ff000011']}
//                 style={S.logoutGradient}
//               >
//                 <Feather name="log-out" size={17} color="#ff4444" />
//                 <Text style={S.logoutText}>Log Out</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           {/* Version */}
//           <Text style={[S.version, { color: isDarkMode ? '#333' : '#ccc' }]}>v1.0.0 • Tomo</Text>
//         </ScrollView>
//       </Animated.View>
//     </View>
//   )
// }

// // ─── Static styles ────────────────────────────────────────────────────────────
// const S = StyleSheet.create({
//   container: { flex: 1, flexDirection: 'row', backgroundColor: 'transparent' },
//   backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
//   drawer: {
//     width: '82%', height: '100%',
//     shadowColor: '#000', shadowOffset: { width: -4, height: 0 },
//     shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
//   },
//   accentLine: { height: 3, width: '100%' },

//   // Profile card
//   profileCardWrapper: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },
//   profileCard: {
//     marginTop: 10, overflow: 'hidden',
//     borderRadius: 16, borderWidth: 1,
//     padding: 5, flexDirection: 'row', alignItems: 'center', gap: 14,
//   },
//   avatarRing: { width: 48, height: 48, borderRadius: 29, padding: 2.5, alignItems: 'center', justifyContent: 'center' },
//   avatarInner: { width: '100%', height: '100%', borderRadius: 27, borderWidth: 2.5, overflow: 'hidden' },
//   avatar: { width: '100%', height: '100%' },
//   profileText: { flex: 1 },
//   profileName: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 2 },
//   profileUsername: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
//   sellerBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
//   sellerBadgeText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Bold },

//   // Groups
//   group: { paddingHorizontal: 16, marginTop: 8 },
//   groupTitle: {
//     fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     letterSpacing: 1.4, marginBottom: 8, marginLeft: 4,
//   },
//   groupBox: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', gap: 1 },

//   // Menu item
//   menuItem: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingVertical: 6, paddingHorizontal: 14, gap: 13,
//   },
//   iconPill: {
//     width: 34, height: 34, borderRadius: 10,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   menuLabel: { fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium, flex: 1 },
//   badge: {
//     paddingHorizontal: 7, paddingVertical: 2,
//     borderRadius: 8, marginRight: 4,
//   },
//   badgeText: { fontSize: 9, color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold, letterSpacing: 0.5 },

//   // Logout
//   logoutWrapper: { paddingHorizontal: 16, marginTop: 20 },
//   logoutBtn: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#ff444422' },
//   logoutGradient: {
//     flexDirection: 'row', alignItems: 'center',
//     gap: 13, paddingVertical: 14, paddingHorizontal: 14,
//   },
//   logoutText: {
//     fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     color: '#ff4444', flex: 1,
//   },

//   // Version
//   version: {
//     textAlign: 'center', fontSize: 11,
//     fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     marginTop: 28, marginBottom: 8,
//   },
// })

// export default React.memo(SettingsDrawerScreen)



// import React, { useCallback, useMemo, useRef, useEffect } from 'react'
// import {
//   View, Text, Image, TouchableOpacity, StyleSheet,
//   Alert, ScrollView, Share, Pressable, StatusBar,
//   Dimensions, Animated as RNAnimated,
// } from 'react-native'
// import Animated, {
//   SlideInRight, FadeIn, FadeInLeft, FadeOut,
//   useSharedValue, useAnimatedStyle, withSpring, withTiming,
//   interpolate, Extrapolation,
// } from 'react-native-reanimated'
// import LinearGradient from 'react-native-linear-gradient'
// import { FONTS_FAMILY } from '../assets/Fonts'
// import { clearAsyncStorage } from '../utils/Apis'
// import { showError } from '../utils/helperFunctions'
// import IMG from '../assets/Images'
// import { useSelector } from 'react-redux'
// import { THEMES } from '../redux/reducer/theme'
// import Feather from 'react-native-vector-icons/Feather'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import AntDesign from 'react-native-vector-icons/AntDesign'

// const { width: SW, height: SH } = Dimensions.get('window')

// // ─── Menu config ──────────────────────────────────────────────────────────────
// const MENU_ITEMS = [
//   { label: 'Followers',          icon: 'users',          iconType: 'Feather',                 nav: 'Followers',          sellerOnly: false, nonSellerOnly: false },
//   { label: 'Saved Posts',        icon: 'bookmark',       iconType: 'Feather',                 nav: 'SavedPosts',         sellerOnly: false, nonSellerOnly: false },
//   { label: 'Promotions',         icon: 'trending-up',    iconType: 'Feather',                 nav: 'MyPromotions',       badge: 'NEW',      sellerOnly: false, nonSellerOnly: false },
//   { label: 'All Shops',          icon: 'shopping-bag',   iconType: 'Feather',                 nav: 'AllShops',           sellerOnly: true,  nonSellerOnly: false },
//   { label: 'Become a Seller',    icon: 'briefcase',      iconType: 'Feather',                 nav: 'RequestBecomSeller', sellerOnly: false, nonSellerOnly: true },
//   { label: 'AI Chat Bot',        icon: 'robot',          iconType: 'MaterialCommunityIcons',  nav: 'ReactNativeChatbot', sellerOnly: false, nonSellerOnly: false },
//   { label: 'Settings',           icon: 'settings',       iconType: 'Feather',                 nav: 'Settings',           sellerOnly: false, nonSellerOnly: false },
//   { label: 'Help Center',        icon: 'help-circle',    iconType: 'Feather',                 nav: 'ContactUs',          sellerOnly: false, nonSellerOnly: false },
//   { label: 'Feedback',           icon: 'message-square', iconType: 'Feather',                 nav: 'FeedBack',           sellerOnly: false, nonSellerOnly: false },
//   { label: 'Privacy Policy',     icon: 'shield',         iconType: 'Feather',                 nav: 'PrivacyPolicy',      sellerOnly: false, nonSellerOnly: false },
//   { label: 'Terms & Conditions', icon: 'file-text',      iconType: 'Feather',                 nav: 'TermsAndConditions', sellerOnly: false, nonSellerOnly: false },
//   { label: 'FAQ',                icon: 'question-circle',iconType: 'AntDesign',               nav: 'FAQs',               sellerOnly: false, nonSellerOnly: false },
//   { label: 'Invite a Friend',    icon: 'user-plus',      iconType: 'Feather',                 nav: 'invite',             sellerOnly: false, nonSellerOnly: false },
// ]

// // ─── Animated row item ────────────────────────────────────────────────────────
// const MenuItem = React.memo(({ item, index, isDarkMode, primaryColor, secondaryColor, onPress }) => {
//   const scale = useSharedValue(1)
//   const bg = useSharedValue(0)

//   const rowStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//     backgroundColor: `rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${interpolate(bg.value, [0,1], [0, isDarkMode ? 0.08 : 0.04], Extrapolation.CLAMP)})`,
//   }))

//   const pressIn = useCallback(() => {
//     scale.value = withSpring(0.97, { damping: 18, stiffness: 200 })
//     bg.value = withTiming(1, { duration: 120 })
//   }, [])
//   const pressOut = useCallback(() => {
//     scale.value = withSpring(1, { damping: 18, stiffness: 200 })
//     bg.value = withTiming(0, { duration: 200 })
//   }, [])

//   const IconC = item.iconType === 'Ionicons' ? Ionicons
//     : item.iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons
//     : item.iconType === 'AntDesign' ? AntDesign : Feather

//   return (
//     <Animated.View
//       entering={FadeInLeft.duration(340).delay(80 + index * 42).springify().damping(16)}
//     >
//       <TouchableOpacity onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} activeOpacity={1}>
//         <Animated.View style={[S.row, rowStyle]}>
//           {/* Gradient icon box */}
//           <LinearGradient
//             colors={[primaryColor + '33', secondaryColor + '22']}
//             start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//             style={S.iconBox}
//           >
//             <IconC name={item.icon} size={18} color={primaryColor} />
//           </LinearGradient>

//           <Text style={[S.rowLabel, { color: isDarkMode ? '#e2e2e2' : '#151515' }]}>
//             {item.label}
//           </Text>

//           {item.badge && (
//             <LinearGradient colors={[primaryColor, secondaryColor]} style={S.badge}>
//               <Text style={S.badgeTxt}>{item.badge}</Text>
//             </LinearGradient>
//           )}

//           <Feather name="chevron-right" size={14} color={isDarkMode ? '#3a3a3a' : '#d0d0d0'} />
//         </Animated.View>
//       </TouchableOpacity>
//     </Animated.View>
//   )
// })
// MenuItem.displayName = 'MenuItem'

// // ─── Main ─────────────────────────────────────────────────────────────────────
// const SettingsDrawerScreen = ({ navigation }) => {
//   const { isDarkMode, selectedColorTheme } = useSelector(s => s.theme)
//   const currentTheme = THEMES[selectedColorTheme] || THEMES.default
//   const primaryColor = currentTheme.primary
//   const secondaryColor = currentTheme.secondary

//   const rawSelector = useSelector(s => s?.user?.userData)
//   const selector = useMemo(() => {
//     if (rawSelector && Object.keys(rawSelector).length) {
//       try { return JSON.parse(rawSelector) } catch { return {} }
//     }
//     return {}
//   }, [rawSelector])

//   const glowColors = useMemo(() => [primaryColor, secondaryColor], [primaryColor, secondaryColor])
//   const isSeller = selector?.SellerStatus === 'Approved'

//   const close = useCallback(() => navigation.goBack(), [navigation])

//   const navigate = useCallback((screen) => {
//     close()
//     setTimeout(() => {
//       if (screen === 'AllShops') navigation.navigate('Tab', { screen: 'MarketPlace' })
//       else navigation.navigate(screen)
//     }, 260)
//   }, [close, navigation])

//   const handleLogout = useCallback(() => {
//     Alert.alert('Log Out', 'Are you sure you want to log out?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Log Out', style: 'destructive',
//         onPress: async () => {
//           try { await clearAsyncStorage(); navigation?.replace('Login') }
//           catch { showError('Error while logging out') }
//         },
//       },
//     ])
//   }, [navigation])

//   const handleInvite = useCallback(async () => {
//     try {
//       const r = await Share.share({ message: 'Hey! Check out Tomo: https://www.example.com/invite' })
//       if (r.action === Share.sharedAction) close()
//     } catch {}
//   }, [close])

//   const handlePress = useCallback((item) => {
//     if (item.nav === 'invite') return handleInvite()
//     navigate(item.nav)
//   }, [navigate, handleInvite])

//   const filteredItems = useMemo(() =>
//     MENU_ITEMS.filter(item => {
//       if (item.sellerOnly && !isSeller) return false
//       if (item.nonSellerOnly && isSeller) return false
//       return true
//     }), [isSeller])

//   // pulse animation for avatar ring
//   const pulse = useRef(new RNAnimated.Value(1)).current
//   useEffect(() => {
//     RNAnimated.loop(
//       RNAnimated.sequence([
//         RNAnimated.timing(pulse, { toValue: 1.06, duration: 1600, useNativeDriver: true }),
//         RNAnimated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
//       ])
//     ).start()
//   }, [])

//   const bg = isDarkMode ? '#0a0a0a' : '#f7f7f7'
//   const cardBg = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
//   const dividerColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'

//   return (
//     <View style={S.root}>
//       <StatusBar backgroundColor="rgba(0,0,0,0.55)" barStyle="light-content" translucent />

//       {/* Blurred backdrop */}
//       <Pressable style={S.backdrop} onPress={close} />

//       {/* ── Drawer panel — full height ── */}
//       <Animated.View
//         entering={SlideInRight.duration(380).springify().damping(20).stiffness(120)}
//         exiting={FadeOut.duration(200)}
//         style={[S.panel, { backgroundColor: bg }]}
//       >
//         {/* Top gradient bar */}
//         <LinearGradient colors={glowColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.topBar} />

//         {/* ── Hero profile section ── */}
//         <Animated.View entering={FadeIn.duration(500).delay(80)} style={S.hero}>
//           <LinearGradient
//             colors={[primaryColor + '18', secondaryColor + '08', 'transparent']}
//             start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//             style={[S.heroBg, { borderColor: dividerColor }]}
//           >
//             {/* Decorative blobs */}
//             <View style={[S.blob, S.blob1, { backgroundColor: primaryColor + '18' }]} />
//             <View style={[S.blob, S.blob2, { backgroundColor: secondaryColor + '12' }]} />

//             {/* Avatar with pulsing ring */}
//             <RNAnimated.View style={[S.avatarRingOuter, { transform: [{ scale: pulse }] }]}>
//               <LinearGradient colors={glowColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.avatarGradRing}>
//                 <View style={[S.avatarBorder, { borderColor: bg }]}>
//                   <Image
//                     source={selector?.Image ? { uri: selector.Image } : IMG.TomoLogo}
//                     style={S.avatar}
//                   />
//                 </View>
//               </LinearGradient>
//             </RNAnimated.View>

//             {/* Name block */}
//             <View style={S.heroText}>
//               <Text style={[S.heroName, { color: isDarkMode ? '#fff' : '#0d0d0d' }]} numberOfLines={1}>
//                 {selector?.FullName || 'Tomo User'}
//               </Text>
//               <Text style={[S.heroHandle, { color: isDarkMode ? '#555' : '#aaa' }]} numberOfLines={1}>
//                 @{selector?.UserName || 'username'}
//               </Text>

//               {/* Stats pills */}
//               <View style={S.statRow}>
//                 <View style={[S.statPill, { backgroundColor: primaryColor + '1A' }]}>
//                   <Text style={[S.statNum, { color: primaryColor }]}>
//                     {selector?.Follower?.length || 0}
//                   </Text>
//                   <Text style={[S.statLabel, { color: isDarkMode ? '#555' : '#aaa' }]}>followers</Text>
//                 </View>
//                 <View style={[S.statPill, { backgroundColor: secondaryColor + '1A' }]}>
//                   <Text style={[S.statNum, { color: secondaryColor }]}>
//                     {selector?.Following?.length || 0}
//                   </Text>
//                   <Text style={[S.statLabel, { color: isDarkMode ? '#555' : '#aaa' }]}>following</Text>
//                 </View>
//                 {isSeller && (
//                   <LinearGradient colors={glowColors} style={S.sellerChip}>
//                     <Text style={S.sellerChipTxt}>✦ Seller</Text>
//                   </LinearGradient>
//                 )}
//               </View>
//             </View>
//           </LinearGradient>
//         </Animated.View>

//         {/* ── Scrollable menu ── */}
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={S.scrollContent}
//           style={{ flex: 1 }}
//         >
//           <View style={[S.menuCard, { backgroundColor: cardBg, borderColor: dividerColor }]}>
//             {filteredItems.map((item, i) => (
//               <React.Fragment key={item.label}>
//                 <MenuItem
//                   item={item} index={i}
//                   isDarkMode={isDarkMode}
//                   primaryColor={primaryColor}
//                   secondaryColor={secondaryColor}
//                   onPress={() => handlePress(item)}
//                 />
//                 {i < filteredItems.length - 1 && (
//                   <View style={[S.divider, { backgroundColor: dividerColor }]} />
//                 )}
//               </React.Fragment>
//             ))}
//           </View>

//           {/* ── Logout ── */}
//           <Animated.View entering={FadeInLeft.duration(340).delay(80 + filteredItems.length * 42 + 40)}>
//             <TouchableOpacity onPress={handleLogout} activeOpacity={0.8} style={S.logoutBtn}>
//               <LinearGradient
//                 colors={['#ff3a3a22', '#cc000011']}
//                 start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                 style={[S.logoutInner, { borderColor: '#ff333322' }]}
//               >
//                 <View style={[S.iconBox, { backgroundColor: '#ff333318' }]}>
//                   <Feather name="log-out" size={18} color="#ff4444" />
//                 </View>
//                 <Text style={S.logoutTxt}>Log Out</Text>
//                 <Feather name="chevron-right" size={14} color="#ff444466" />
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           <Text style={[S.version, { color: isDarkMode ? '#2a2a2a' : '#d8d8d8' }]}>
//             Tomo · v1.0.0
//           </Text>
//         </ScrollView>
//       </Animated.View>
//     </View>
//   )
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const S = StyleSheet.create({
//   root: { flex: 1, flexDirection: 'row' },
//   backdrop: { flex: 0.22, backgroundColor: 'rgba(0,0,0,0.6)' },
//   panel: {
//     flex: 1, height: '100%',
//     shadowColor: '#000', shadowOffset: { width: -6, height: 0 },
//     shadowOpacity: 0.4, shadowRadius: 24, elevation: 24,
//   },
//   topBar: { height: 3.5 },

//   // Hero
//   hero: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 6 },
//   heroBg: {
//     borderRadius: 20, borderWidth: 1,
//     padding: 18, overflow: 'hidden',
//     flexDirection: 'row', alignItems: 'center', gap: 16,
//     minHeight: 110,
//   },
//   blob: { position: 'absolute', borderRadius: 100 },
//   blob1: { width: 120, height: 120, top: -40, right: -20 },
//   blob2: { width: 80, height: 80, bottom: -30, right: 40 },

//   // Avatar
//   avatarRingOuter: { alignItems: 'center', justifyContent: 'center' },
//   avatarGradRing: {
//     width: 72, height: 72, borderRadius: 36,
//     alignItems: 'center', justifyContent: 'center', padding: 3,
//   },
//   avatarBorder: { width: '100%', height: '100%', borderRadius: 33, borderWidth: 3, overflow: 'hidden' },
//   avatar: { width: '100%', height: '100%' },

//   // Hero text
//   heroText: { flex: 1, gap: 2 },
//   heroName: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold, letterSpacing: -0.3 },
//   heroHandle: { fontSize: 12.5, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginBottom: 10 },
//   statRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
//   statPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, alignItems: 'center', flexDirection: 'row', gap: 4 },
//   statNum: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   statLabel: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
//   sellerChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
//   sellerChipTxt: { fontSize: 11, color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold },

//   // Scroll
//   scrollContent: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 50 },

//   // Menu card
//   menuCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
//   row: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingVertical: 11, paddingHorizontal: 14, gap: 14,
//     borderRadius: 0,
//   },
//   iconBox: {
//     width: 36, height: 36, borderRadius: 11,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   rowLabel: { flex: 1, fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 4 },
//   badgeTxt: { fontSize: 9, color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold, letterSpacing: 0.6 },
//   divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },

//   // Logout
//   logoutBtn: { borderRadius: 18, overflow: 'hidden', marginBottom: 20 },
//   logoutInner: {
//     flexDirection: 'row', alignItems: 'center',
//     gap: 14, paddingVertical: 12, paddingHorizontal: 14,
//     borderWidth: 1, borderRadius: 18,
//   },
//   logoutTxt: { flex: 1, fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: '#ff4444' },

//   // Version
//   version: {
//     textAlign: 'center', fontSize: 11,
//     fontFamily: FONTS_FAMILY.SourceSans3_Regular, letterSpacing: 0.5,
//   },
// })

// export default React.memo(SettingsDrawerScreen)



// import React, { useCallback, useMemo, useRef, useEffect } from 'react'
// import {
//   View, Text, Image, TouchableOpacity, StyleSheet,
//   Alert, ScrollView, Share, StatusBar,
//   Dimensions, Animated as RNAnimated,
// } from 'react-native'
// import Animated, {
//   FadeIn, FadeInLeft,
//   useSharedValue, useAnimatedStyle, withSpring, withTiming,
//   interpolate, Extrapolation,
// } from 'react-native-reanimated'
// import LinearGradient from 'react-native-linear-gradient'
// import { FONTS_FAMILY } from '../assets/Fonts'
// import { clearAsyncStorage } from '../utils/Apis'
// import { showError } from '../utils/helperFunctions'
// import IMG from '../assets/Images'
// import { useSelector } from 'react-redux'
// import { THEMES } from '../redux/reducer/theme'
// import Feather from 'react-native-vector-icons/Feather'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import AntDesign from 'react-native-vector-icons/AntDesign'

// const { width: SW } = Dimensions.get('window')

// // ─── Menu config ──────────────────────────────────────────────────────────────
// const MENU_ITEMS = [
//   { label: 'Followers',          icon: 'users',           iconType: 'Feather',                nav: 'Followers',          sellerOnly: false, nonSellerOnly: false },
//   { label: 'Saved Posts',        icon: 'bookmark',        iconType: 'Feather',                nav: 'SavedPosts',         sellerOnly: false, nonSellerOnly: false },
//   { label: 'Promotions',         icon: 'trending-up',     iconType: 'Feather',                nav: 'MyPromotions',       badge: 'NEW',      sellerOnly: false, nonSellerOnly: false },
//   { label: 'All Shops',          icon: 'shopping-bag',    iconType: 'Feather',                nav: 'AllShops',           sellerOnly: true,  nonSellerOnly: false },
//   { label: 'Become a Seller',    icon: 'briefcase',       iconType: 'Feather',                nav: 'RequestBecomSeller', sellerOnly: false, nonSellerOnly: true },
//   { label: 'AI Chat Bot',        icon: 'robot',           iconType: 'MaterialCommunityIcons', nav: 'ReactNativeChatbot', sellerOnly: false, nonSellerOnly: false },
//   { label: 'Settings',           icon: 'settings',        iconType: 'Feather',                nav: 'Settings',           sellerOnly: false, nonSellerOnly: false },
//   { label: 'Help Center',        icon: 'help-circle',     iconType: 'Feather',                nav: 'ContactUs',          sellerOnly: false, nonSellerOnly: false },
//   { label: 'Feedback',           icon: 'message-square',  iconType: 'Feather',                nav: 'FeedBack',           sellerOnly: false, nonSellerOnly: false },
//   { label: 'Privacy Policy',     icon: 'shield',          iconType: 'Feather',                nav: 'PrivacyPolicy',      sellerOnly: false, nonSellerOnly: false },
//   { label: 'Terms & Conditions', icon: 'file-text',       iconType: 'Feather',                nav: 'TermsAndConditions', sellerOnly: false, nonSellerOnly: false },
//   { label: 'FAQ',                icon: 'question-circle', iconType: 'AntDesign',              nav: 'FAQs',               sellerOnly: false, nonSellerOnly: false },
//   { label: 'Invite a Friend',    icon: 'user-plus',       iconType: 'Feather',                nav: 'invite',             sellerOnly: false, nonSellerOnly: false },
// ]

// // ─── ALL colour decisions in one place ───────────────────────────────────────
// const getTokens = (isDark, primary, secondary) => ({
//   // Page background
//   pageBg:          isDark ? ['#080810', '#0d0d1a', '#0a0a14']              : ['#eef2ff', '#f5f0ff', '#edf8ff'],
//   blob1:           isDark ? primary + '28'                                 : primary + '20',
//   blob2:           isDark ? secondary + '18'                               : secondary + '15',

//   // Status bar
//   barStyle:        isDark ? 'light-content'                                : 'dark-content',

//   // Close button
//   closeBg:         isDark ? ['rgba(255,255,255,0.12)','rgba(255,255,255,0.04)'] : ['rgba(0,0,0,0.07)','rgba(0,0,0,0.03)'],
//   closeBorder:     isDark ? 'rgba(255,255,255,0.14)'                       : 'rgba(0,0,0,0.10)',
//   closeIcon:       isDark ? '#ffffff'                                      : '#111122',

//   // Hero text
//   heroAvatarBorder:isDark ? '#0a0a14'                                      : '#eef2ff',
//   heroName:        isDark ? '#ffffff'                                      : '#0e0e2a',
//   heroHandle:      isDark ? 'rgba(255,255,255,0.36)'                       : 'rgba(0,0,0,0.40)',

//   // Stat pill
//   statPillBg:      isDark ? 'rgba(255,255,255,0.05)'                       : 'rgba(255,255,255,0.75)',
//   statPillBorder:  isDark ? 'rgba(255,255,255,0.08)'                       : 'rgba(0,0,0,0.08)',
//   statLabel:       isDark ? 'rgba(255,255,255,0.36)'                       : 'rgba(0,0,0,0.40)',
//   statDivider:     isDark ? 'rgba(255,255,255,0.10)'                       : 'rgba(0,0,0,0.10)',

//   // Menu card
//   menuCardBg:      isDark ? 'rgba(255,255,255,0.04)'                       : 'rgba(255,255,255,0.82)',
//   menuCardBorder:  isDark ? 'rgba(255,255,255,0.07)'                       : 'rgba(0,0,0,0.07)',
//   rowLabel:        isDark ? 'rgba(255,255,255,0.86)'                       : '#16162e',
//   rowPressBg:      isDark ? '255,255,255'                                  : '0,0,0',
//   divider:         isDark ? 'rgba(255,255,255,0.06)'                       : 'rgba(0,0,0,0.06)',
//   chevron:         isDark ? 'rgba(255,255,255,0.25)'                       : 'rgba(0,0,0,0.22)',

//   // Logout
//   logoutBg:        isDark ? ['rgba(255,50,50,0.18)','rgba(180,0,0,0.10)'] : ['rgba(255,50,50,0.10)','rgba(200,0,0,0.05)'],
//   logoutBorder:    isDark ? 'rgba(255,50,50,0.16)'                         : 'rgba(255,50,50,0.20)',
//   logoutIconBg:    isDark ? 'rgba(255,50,50,0.18)'                         : 'rgba(255,50,50,0.12)',

//   // Version
//   version:         isDark ? 'rgba(255,255,255,0.12)'                       : 'rgba(0,0,0,0.20)',
// })

// // ─── Animated menu row ────────────────────────────────────────────────────────
// const MenuItem = React.memo(({ item, index, T, primaryColor, secondaryColor, onPress }) => {
//   const scale   = useSharedValue(1)
//   const bgAnim  = useSharedValue(0)

//   const rowStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//     backgroundColor: `rgba(${T.rowPressBg},${interpolate(bgAnim.value, [0, 1], [0, 0.06], Extrapolation.CLAMP)})`,
//   }))

//   const pressIn  = useCallback(() => {
//     scale.value  = withSpring(0.97, { damping: 18, stiffness: 200 })
//     bgAnim.value = withTiming(1, { duration: 120 })
//   }, [])
//   const pressOut = useCallback(() => {
//     scale.value  = withSpring(1,    { damping: 18, stiffness: 200 })
//     bgAnim.value = withTiming(0,    { duration: 200 })
//   }, [])

//   const IconC =
//     item.iconType === 'Ionicons'                ? Ionicons
//     : item.iconType === 'MaterialCommunityIcons'? MaterialCommunityIcons
//     : item.iconType === 'AntDesign'             ? AntDesign
//     : Feather

//   return (
//     <Animated.View entering={FadeInLeft.duration(340).delay(80 + index * 42).springify().damping(16)}>
//       <TouchableOpacity onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} activeOpacity={1}>
//         <Animated.View style={[S.row, rowStyle]}>
//           <LinearGradient
//             colors={[primaryColor + '40', secondaryColor + '28']}
//             start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//             style={S.iconBox}
//           >
//             <IconC name={item.icon} size={17} color="#fff" />
//           </LinearGradient>

//           <Text style={[S.rowLabel, { color: T.rowLabel }]}>{item.label}</Text>

//           {item.badge && (
//             <LinearGradient colors={[primaryColor, secondaryColor]} style={S.badge}>
//               <Text style={S.badgeTxt}>{item.badge}</Text>
//             </LinearGradient>
//           )}

//           <Feather name="chevron-right" size={13} color={T.chevron} />
//         </Animated.View>
//       </TouchableOpacity>
//     </Animated.View>
//   )
// })
// MenuItem.displayName = 'MenuItem'

// // ─── Main component ───────────────────────────────────────────────────────────
// const SettingsDrawerScreen = ({ navigation }) => {
//   const { isDarkMode, selectedColorTheme } = useSelector(s => s.theme)
//   const currentTheme   = THEMES[selectedColorTheme] || THEMES.default
//   const primaryColor   = currentTheme.primary
//   const secondaryColor = currentTheme.secondary

//   const rawSelector = useSelector(s => s?.user?.userData)
//   const selector    = useMemo(() => {
//     if (rawSelector && Object.keys(rawSelector).length) {
//       try { return JSON.parse(rawSelector) } catch { return {} }
//     }
//     return {}
//   }, [rawSelector])

//   // All theme tokens derived from isDarkMode
//   const T          = useMemo(() => getTokens(isDarkMode, primaryColor, secondaryColor), [isDarkMode, primaryColor, secondaryColor])
//   const glowColors = useMemo(() => [primaryColor, secondaryColor], [primaryColor, secondaryColor])
//   const isSeller   = selector?.SellerStatus === 'Approved'

//   const close    = useCallback(() => navigation.goBack(), [navigation])
//   const navigate = useCallback((screen) => {
//     close()
//     setTimeout(() => {
//       if (screen === 'AllShops') navigation.navigate('Tab', { screen: 'MarketPlace' })
//       else navigation.navigate(screen)
//     }, 260)
//   }, [close, navigation])

//   const handleLogout = useCallback(() => {
//     Alert.alert('Log Out', 'Are you sure you want to log out?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Log Out', style: 'destructive',
//         onPress: async () => {
//           try { await clearAsyncStorage(); navigation?.replace('Login') }
//           catch { showError('Error while logging out') }
//         },
//       },
//     ])
//   }, [navigation])

//   const handleInvite = useCallback(async () => {
//     try {
//       const r = await Share.share({ message: 'Hey! Check out Tomo: https://www.example.com/invite' })
//       if (r.action === Share.sharedAction) close()
//     } catch {}
//   }, [close])

//   const handlePress = useCallback((item) => {
//     if (item.nav === 'invite') return handleInvite()
//     navigate(item.nav)
//   }, [navigate, handleInvite])

//   const filteredItems = useMemo(() =>
//     MENU_ITEMS.filter(item => {
//       if (item.sellerOnly    && !isSeller) return false
//       if (item.nonSellerOnly &&  isSeller) return false
//       return true
//     }), [isSeller])

//   // Pulsing avatar ring
//   const pulse = useRef(new RNAnimated.Value(1)).current
//   useEffect(() => {
//     RNAnimated.loop(
//       RNAnimated.sequence([
//         RNAnimated.timing(pulse, { toValue: 1.06, duration: 1600, useNativeDriver: true }),
//         RNAnimated.timing(pulse, { toValue: 1,    duration: 1600, useNativeDriver: true }),
//       ])
//     ).start()
//   }, [])

//   // X button spin-in on mount
//   const crossRotate = useRef(new RNAnimated.Value(0)).current
//   useEffect(() => {
//     RNAnimated.timing(crossRotate, { toValue: 1, duration: 420, useNativeDriver: true }).start()
//   }, [])
//   const crossSpin = crossRotate.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] })

//   return (
//     <View style={S.root}>
//       <StatusBar backgroundColor="transparent" barStyle={T.barStyle} translucent />

//       {/* Full-screen adaptive background */}
//       <LinearGradient colors={T.pageBg} style={StyleSheet.absoluteFill} />

//       {/* Ambient blobs */}
//       <View style={[S.blob1, { backgroundColor: T.blob1 }]} />
//       <View style={[S.blob2, { backgroundColor: T.blob2 }]} />

//       <Animated.View entering={FadeIn.duration(320)} style={S.panel}>

//         {/* ── Close (X) ── */}
//         <Animated.View entering={FadeIn.duration(400).delay(200)} style={S.closeWrap}>
//           <RNAnimated.View style={{ transform: [{ rotate: crossSpin }] }}>
//             <TouchableOpacity onPress={close} activeOpacity={0.75}>
//               <LinearGradient colors={T.closeBg} style={[S.closeBtnInner, { borderColor: T.closeBorder }]}>
//                 <Feather name="x" size={21} color={T.closeIcon} />
//               </LinearGradient>
//             </TouchableOpacity>
//           </RNAnimated.View>
//         </Animated.View>

//         {/* ── Hero ── */}
//         <Animated.View entering={FadeIn.duration(500).delay(100)} style={S.hero}>
//           <RNAnimated.View style={[S.avatarRingOuter, { transform: [{ scale: pulse }] }]}>
//             <LinearGradient colors={glowColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.avatarGradRing}>
//               <View style={[S.avatarBorder, { borderColor: T.heroAvatarBorder }]}>
//                 <Image source={selector?.Image ? { uri: selector.Image } : IMG.TomoLogo} style={S.avatar} />
//               </View>
//             </LinearGradient>
//           </RNAnimated.View>

//           <Text style={[S.heroName,   { color: T.heroName   }]} numberOfLines={1}>{selector?.FullName  || 'Tomo User'}</Text>
//           <Text style={[S.heroHandle, { color: T.heroHandle }]} numberOfLines={1}>@{selector?.UserName || 'username'}</Text>

//           <View style={[S.statRow, { backgroundColor: T.statPillBg, borderColor: T.statPillBorder }]}>
//             <View style={S.statPill}>
//               <Text style={[S.statNum, { color: primaryColor   }]}>{selector?.Follower?.length  || 0}</Text>
//               <Text style={[S.statLbl, { color: T.statLabel    }]}>followers</Text>
//             </View>
//             <View style={[S.statDiv, { backgroundColor: T.statDivider }]} />
//             <View style={S.statPill}>
//               <Text style={[S.statNum, { color: secondaryColor }]}>{selector?.Following?.length || 0}</Text>
//               <Text style={[S.statLbl, { color: T.statLabel    }]}>following</Text>
//             </View>
//             {isSeller && (
//               <>
//                 <View style={[S.statDiv, { backgroundColor: T.statDivider }]} />
//                 <LinearGradient colors={glowColors} style={S.sellerChip}>
//                   <Text style={S.sellerChipTxt}>✦ Seller</Text>
//                 </LinearGradient>
//               </>
//             )}
//           </View>

//           <LinearGradient
//             colors={['transparent', primaryColor, secondaryColor, 'transparent']}
//             start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//             style={S.heroDivider}
//           />
//         </Animated.View>

//         {/* ── Menu list ── */}
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.scrollContent} style={{ flex: 1 }}>
//           <View style={[S.menuCard, { backgroundColor: T.menuCardBg, borderColor: T.menuCardBorder }]}>
//             {filteredItems.map((item, i) => (
//               <React.Fragment key={item.label}>
//                 <MenuItem
//                   item={item} index={i} T={T}
//                   primaryColor={primaryColor} secondaryColor={secondaryColor}
//                   onPress={() => handlePress(item)}
//                 />
//                 {i < filteredItems.length - 1 && <View style={[S.divider, { backgroundColor: T.divider }]} />}
//               </React.Fragment>
//             ))}
//           </View>

//           {/* Logout */}
//           <Animated.View entering={FadeInLeft.duration(340).delay(80 + filteredItems.length * 42 + 40)}>
//             <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
//               <LinearGradient
//                 colors={T.logoutBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                 style={[S.logoutInner, { borderColor: T.logoutBorder }]}
//               >
//                 <View style={[S.iconBox, { backgroundColor: T.logoutIconBg }]}>
//                   <Feather name="log-out" size={17} color="#ff5555" />
//                 </View>
//                 <Text style={S.logoutTxt}>Log Out</Text>
//                 <Feather name="chevron-right" size={13} color="rgba(255,80,80,0.45)" />
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           <Text style={[S.version, { color: T.version }]}>Tomo · v1.0.0</Text>
//         </ScrollView>
//       </Animated.View>
//     </View>
//   )
// }

// // ─── Styles (layout only — zero hardcoded colours) ────────────────────────────
// const S = StyleSheet.create({
//   root: { flex: 1 },

//   blob1: {
//     position: 'absolute', width: SW * 0.85, height: SW * 0.85,
//     borderRadius: SW * 0.425, top: -SW * 0.2, right: -SW * 0.2,
//   },
//   blob2: {
//     position: 'absolute', width: SW * 0.7, height: SW * 0.7,
//     borderRadius: SW * 0.35, bottom: SW * 0.1, left: -SW * 0.25,
//   },

//   panel: {
//     flex: 1,
//     paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 54,
//   },

//   closeWrap: {
//     position: 'absolute',
//     top: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 56,
//     right: 20, zIndex: 10,
//   },
//   closeBtnInner: {
//     width: 44, height: 44, borderRadius: 22,
//     alignItems: 'center', justifyContent: 'center', borderWidth: 1,
//   },

//   hero: { alignItems: 'center', paddingTop: 10, paddingBottom: 24, paddingHorizontal: 24 },
//   avatarRingOuter: { marginBottom: 14, alignItems: 'center', justifyContent: 'center' },
//   avatarGradRing: {
//     width: 90, height: 90, borderRadius: 45,
//     alignItems: 'center', justifyContent: 'center', padding: 3,
//   },
//   avatarBorder: { width: '100%', height: '100%', borderRadius: 42, borderWidth: 3, overflow: 'hidden' },
//   avatar:       { width: '100%', height: '100%' },

//   heroName: {
//     fontSize: 22, letterSpacing: -0.3, marginBottom: 3,
//     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//   },
//   heroHandle: {
//     fontSize: 13, marginBottom: 18,
//     fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//   },

//   statRow:    { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 16, borderWidth: 1 },
//   statPill:   { alignItems: 'center' },
//   statNum:    { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
//   statLbl:    { fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 1 },
//   statDiv:    { width: 1, height: 28 },
//   sellerChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
//   sellerChipTxt: { fontSize: 11, color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold },

//   heroDivider: { height: 1.5, width: '85%', borderRadius: 1, opacity: 0.6 },

//   scrollContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 50 },

//   menuCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 14 },
//   row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, gap: 13 },
//   iconBox:  { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   rowLabel: { flex: 1, fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
//   badge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 4 },
//   badgeTxt: { fontSize: 9, color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold, letterSpacing: 0.6 },
//   divider:  { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },

//   logoutInner: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 14, borderWidth: 1, borderRadius: 20 },
//   logoutTxt:   { flex: 1, fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: '#ff5555' },

//   version: { textAlign: 'center', fontSize: 11, marginTop: 20, fontFamily: FONTS_FAMILY.SourceSans3_Regular, letterSpacing: 0.5 },
// })

// export default React.memo(SettingsDrawerScreen)




import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  Alert, ScrollView, Share, StatusBar,
  Dimensions, Animated as RNAnimated,
} from 'react-native'
import Animated, {
  FadeIn, FadeInLeft,
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  interpolate, Extrapolation,
} from 'react-native-reanimated'
import LinearGradient from 'react-native-linear-gradient'
import { FONTS_FAMILY } from '../assets/Fonts'
import { clearAsyncStorage, apiDelete } from '../utils/Apis'
import { showError } from '../utils/helperFunctions'
import IMG from '../assets/Images'
import { useSelector } from 'react-redux'
import { THEMES } from '../redux/reducer/theme'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

const { width: SW } = Dimensions.get('window')

// ─── Menu config ──────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { label: 'Followers',          icon: 'users',           iconType: 'Feather',                nav: 'Followers',          sellerOnly: false, nonSellerOnly: false },
  { label: 'Saved Posts',        icon: 'bookmark',        iconType: 'Feather',                nav: 'SavedPosts',         sellerOnly: false, nonSellerOnly: false },
  { label: 'Promotions',         icon: 'trending-up',     iconType: 'Feather',                nav: 'MyPostPromotions',   badge: 'NEW',      sellerOnly: false, nonSellerOnly: false },
  { label: 'All Shops',          icon: 'shopping-bag',    iconType: 'Feather',                nav: 'AllShops',           sellerOnly: true,  nonSellerOnly: false },
  { label: 'Become a Seller',    icon: 'briefcase',       iconType: 'Feather',                nav: 'RequestBecomSeller', sellerOnly: false, nonSellerOnly: true },
  { label: 'AI Chat Bot',        icon: 'robot',           iconType: 'MaterialCommunityIcons', nav: 'ReactNativeChatbot', sellerOnly: false, nonSellerOnly: false },
  { label: 'Settings',           icon: 'settings',        iconType: 'Feather',                nav: 'Settings',           sellerOnly: false, nonSellerOnly: false },
  { label: 'Help Center',        icon: 'help-circle',     iconType: 'Feather',                nav: 'ContactUs',          sellerOnly: false, nonSellerOnly: false },
  { label: 'Feedback',           icon: 'message-square',  iconType: 'Feather',                nav: 'FeedBack',           sellerOnly: false, nonSellerOnly: false },
  { label: 'Privacy Policy',     icon: 'shield',          iconType: 'Feather',                nav: 'PrivacyPolicy',      sellerOnly: false, nonSellerOnly: false },
  { label: 'Terms & Conditions', icon: 'file-text',       iconType: 'Feather',                nav: 'TermsAndConditions', sellerOnly: false, nonSellerOnly: false },
  { label: 'FAQ',                icon: 'question-circle', iconType: 'AntDesign',              nav: 'FAQs',               sellerOnly: false, nonSellerOnly: false },
  { label: 'Invite a Friend',    icon: 'user-plus',       iconType: 'Feather',                nav: 'invite',             sellerOnly: false, nonSellerOnly: false },
  { label: 'Delete Account',     icon: 'trash-2',         iconType: 'Feather',                nav: '__deleteAccount__',  sellerOnly: false, nonSellerOnly: false, danger: true },
]

// ─── ALL colour decisions in one place ───────────────────────────────────────
const getTokens = (isDark, primary, secondary) => ({
  // Page background
  pageBg:          isDark ? ['#080810', '#0d0d1a', '#0a0a14']              : ['#eef2ff', '#f5f0ff', '#edf8ff'],
  blob1:           isDark ? primary + '28'                                 : primary + '20',
  blob2:           isDark ? secondary + '18'                               : secondary + '15',

  // Status bar
  barStyle:        isDark ? 'light-content'                                : 'dark-content',

  // Close button
  closeBg:         isDark ? ['rgba(255,255,255,0.12)','rgba(255,255,255,0.04)'] : ['rgba(0,0,0,0.07)','rgba(0,0,0,0.03)'],
  closeBorder:     isDark ? 'rgba(255,255,255,0.14)'                       : 'rgba(0,0,0,0.10)',
  closeIcon:       isDark ? '#ffffff'                                      : '#111122',

  // Hero text
  heroAvatarBorder:isDark ? '#0a0a14'                                      : '#eef2ff',
  heroName:        isDark ? '#ffffff'                                      : '#0e0e2a',
  heroHandle:      isDark ? 'rgba(255,255,255,0.36)'                       : 'rgba(0,0,0,0.40)',

  // Stat pill
  statPillBg:      isDark ? 'rgba(255,255,255,0.05)'                       : 'rgba(255,255,255,0.75)',
  statPillBorder:  isDark ? 'rgba(255,255,255,0.08)'                       : 'rgba(0,0,0,0.08)',
  statLabel:       isDark ? 'rgba(255,255,255,0.36)'                       : 'rgba(0,0,0,0.40)',
  statDivider:     isDark ? 'rgba(255,255,255,0.10)'                       : 'rgba(0,0,0,0.10)',

  // Menu card
  menuCardBg:      isDark ? 'rgba(255,255,255,0.04)'                       : 'rgba(255,255,255,0.82)',
  menuCardBorder:  isDark ? 'rgba(255,255,255,0.07)'                       : 'rgba(0,0,0,0.07)',
  rowLabel:        isDark ? 'rgba(255,255,255,0.86)'                       : '#16162e',
  rowPressBg:      isDark ? '255,255,255'                                  : '0,0,0',
  divider:         isDark ? 'rgba(255,255,255,0.06)'                       : 'rgba(0,0,0,0.06)',
  chevron:         isDark ? 'rgba(255,255,255,0.25)'                       : 'rgba(0,0,0,0.22)',

  // Logout
  logoutBg:        isDark ? ['rgba(255,50,50,0.18)','rgba(180,0,0,0.10)'] : ['rgba(255,50,50,0.10)','rgba(200,0,0,0.05)'],
  logoutBorder:    isDark ? 'rgba(255,50,50,0.16)'                         : 'rgba(255,50,50,0.20)',
  logoutIconBg:    isDark ? 'rgba(255,50,50,0.18)'                         : 'rgba(255,50,50,0.12)',

  // Version
  version:         isDark ? 'rgba(255,255,255,0.12)'                       : 'rgba(0,0,0,0.20)',
})

// ─── Animated menu row ────────────────────────────────────────────────────────
const MenuItem = React.memo(({ item, index, T, primaryColor, secondaryColor, onPress }) => {
  const scale   = useSharedValue(1)
  const bgAnim  = useSharedValue(0)

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(${T.rowPressBg},${interpolate(bgAnim.value, [0, 1], [0, 0.06], Extrapolation.CLAMP)})`,
  }))

  const pressIn  = useCallback(() => {
    scale.value  = withSpring(0.97, { damping: 18, stiffness: 200 })
    bgAnim.value = withTiming(1, { duration: 120 })
  }, [])
  const pressOut = useCallback(() => {
    scale.value  = withSpring(1,    { damping: 18, stiffness: 200 })
    bgAnim.value = withTiming(0,    { duration: 200 })
  }, [])

  const IconC =
    item.iconType === 'Ionicons'                ? Ionicons
    : item.iconType === 'MaterialCommunityIcons'? MaterialCommunityIcons
    : item.iconType === 'AntDesign'             ? AntDesign
    : Feather

  // Danger items (Delete Account) get a red icon box
  const iconColors = item.danger
    ? ['rgba(255,50,50,0.55)', 'rgba(180,0,0,0.40)']
    : [primaryColor + '40', secondaryColor + '28']

  return (
    <Animated.View entering={FadeInLeft.duration(340).delay(80 + index * 42).springify().damping(16)}>
      <TouchableOpacity onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} activeOpacity={1}>
        <Animated.View style={[S.row, rowStyle]}>
          <LinearGradient
            colors={iconColors}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={S.iconBox}
          >
            <IconC name={item.icon} size={17} color={item.danger ? '#ff5555' : '#fff'} />
          </LinearGradient>

          <Text style={[S.rowLabel, { color: item.danger ? '#ff5555' : T.rowLabel }]}>{item.label}</Text>

          {item.badge && (
            <LinearGradient colors={[primaryColor, secondaryColor]} style={S.badge}>
              <Text style={S.badgeTxt}>{item.badge}</Text>
            </LinearGradient>
          )}

          <Feather name="chevron-right" size={13} color={item.danger ? 'rgba(255,80,80,0.45)' : T.chevron} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  )
})
MenuItem.displayName = 'MenuItem'

// ─── Main component ───────────────────────────────────────────────────────────
const SettingsDrawerScreen = ({ navigation }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(s => s.theme)
  const currentTheme   = THEMES[selectedColorTheme] || THEMES.default
  const primaryColor   = currentTheme.primary
  const secondaryColor = currentTheme.secondary

  const rawSelector = useSelector(s => s?.user?.userData)
  const selector    = useMemo(() => {
    if (rawSelector && Object.keys(rawSelector).length) {
      try { return JSON.parse(rawSelector) } catch { return {} }
    }
    return {}
  }, [rawSelector])

  const T          = useMemo(() => getTokens(isDarkMode, primaryColor, secondaryColor), [isDarkMode, primaryColor, secondaryColor])
  const glowColors = useMemo(() => [primaryColor, secondaryColor], [primaryColor, secondaryColor])
  const isSeller   = selector?.SellerStatus === 'Approved'

  const close    = useCallback(() => navigation.goBack(), [navigation])
  const navigate = useCallback((screen) => {
    close()
    setTimeout(() => {
      if (screen === 'AllShops') navigation.navigate('Tab', { screen: 'MarketPlace' })
      else navigation.navigate(screen)
    }, 260)
  }, [close, navigation])

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          try { await clearAsyncStorage(); navigation?.replace('Login') }
          catch { showError('Error while logging out') }
        },
      },
    ])
  }, [navigation])

  // ── Delete Account ────────────────────────────────────────────────────────
  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await apiDelete(`/api/admin/DeleteUser/${selector?._id}`)
              await clearAsyncStorage()
              navigation?.replace('Login')
            } catch (err) {
              showError('Failed to delete account. Please try again.')
            }
          },
        },
      ],
      { cancelable: true }
    )
  }, [selector?._id, navigation])
  // ─────────────────────────────────────────────────────────────────────────

  const handleInvite = useCallback(async () => {
    try {
      const r = await Share.share({ message: 'Hey! Check out Tomo: https://www.example.com/invite' })
      if (r.action === Share.sharedAction) close()
    } catch {}
  }, [close])

  const handlePress = useCallback((item) => {
    if (item.nav === 'invite')             return handleInvite()
    if (item.nav === '__deleteAccount__')  return handleDeleteAccount()
    navigate(item.nav)
  }, [navigate, handleInvite, handleDeleteAccount])

  const filteredItems = useMemo(() =>
    MENU_ITEMS.filter(item => {
      if (item.sellerOnly    && !isSeller) return false
      if (item.nonSellerOnly &&  isSeller) return false
      return true
    }), [isSeller])

  // Pulsing avatar ring
  const pulse = useRef(new RNAnimated.Value(1)).current
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulse, { toValue: 1.06, duration: 1600, useNativeDriver: true }),
        RNAnimated.timing(pulse, { toValue: 1,    duration: 1600, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  // X button spin-in on mount
  const crossRotate = useRef(new RNAnimated.Value(0)).current
  useEffect(() => {
    RNAnimated.timing(crossRotate, { toValue: 1, duration: 420, useNativeDriver: true }).start()
  }, [])
  const crossSpin = crossRotate.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] })

  return (
    <View style={S.root}>
      <StatusBar backgroundColor="transparent" barStyle={T.barStyle} translucent />

      {/* Full-screen adaptive background */}
      <LinearGradient colors={T.pageBg} style={StyleSheet.absoluteFill} />

      {/* Ambient blobs */}
      <View style={[S.blob1, { backgroundColor: T.blob1 }]} />
      <View style={[S.blob2, { backgroundColor: T.blob2 }]} />

      <Animated.View entering={FadeIn.duration(320)} style={S.panel}>

        {/* ── Close (X) ── */}
        <Animated.View entering={FadeIn.duration(400).delay(200)} style={S.closeWrap}>
          <RNAnimated.View style={{ transform: [{ rotate: crossSpin }] }}>
            <TouchableOpacity onPress={close} activeOpacity={0.75}>
              <LinearGradient colors={T.closeBg} style={[S.closeBtnInner, { borderColor: T.closeBorder }]}>
                <Feather name="x" size={21} color={T.closeIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </RNAnimated.View>
        </Animated.View>

        {/* ── Hero ── */}
        <Animated.View entering={FadeIn.duration(500).delay(100)} style={S.hero}>
          <RNAnimated.View style={[S.avatarRingOuter, { transform: [{ scale: pulse }] }]}>
            <LinearGradient colors={glowColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.avatarGradRing}>
              <View style={[S.avatarBorder, { borderColor: T.heroAvatarBorder }]}>
                <Image source={selector?.Image ? { uri: selector.Image } : IMG.TomoLogo} style={S.avatar} />
              </View>
            </LinearGradient>
          </RNAnimated.View>

          <Text style={[S.heroName,   { color: T.heroName   }]} numberOfLines={1}>{selector?.FullName  || 'Tomo User'}</Text>
          <Text style={[S.heroHandle, { color: T.heroHandle }]} numberOfLines={1}>@{selector?.UserName || 'username'}</Text>

          <View style={[S.statRow, { backgroundColor: T.statPillBg, borderColor: T.statPillBorder }]}>
            <View style={S.statPill}>
              <Text style={[S.statNum, { color: primaryColor   }]}>{selector?.Follower?.length  || 0}</Text>
              <Text style={[S.statLbl, { color: T.statLabel    }]}>followers</Text>
            </View>
            <View style={[S.statDiv, { backgroundColor: T.statDivider }]} />
            <View style={S.statPill}>
              <Text style={[S.statNum, { color: secondaryColor }]}>{selector?.Following?.length || 0}</Text>
              <Text style={[S.statLbl, { color: T.statLabel    }]}>following</Text>
            </View>
            {isSeller && (
              <>
                <View style={[S.statDiv, { backgroundColor: T.statDivider }]} />
                <LinearGradient colors={glowColors} style={S.sellerChip}>
                  <Text style={S.sellerChipTxt}>✦ Seller</Text>
                </LinearGradient>
              </>
            )}
          </View>

          <LinearGradient
            colors={['transparent', primaryColor, secondaryColor, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={S.heroDivider}
          />
        </Animated.View>

        {/* ── Menu list ── */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.scrollContent} style={{ flex: 1 }}>
          <View style={[S.menuCard, { backgroundColor: T.menuCardBg, borderColor: T.menuCardBorder }]}>
            {filteredItems.map((item, i) => (
              <React.Fragment key={item.label}>
                <MenuItem
                  item={item} index={i} T={T}
                  primaryColor={primaryColor} secondaryColor={secondaryColor}
                  onPress={() => handlePress(item)}
                />
                {i < filteredItems.length - 1 && <View style={[S.divider, { backgroundColor: T.divider }]} />}
              </React.Fragment>
            ))}
          </View>

          {/* Logout */}
          <Animated.View entering={FadeInLeft.duration(340).delay(80 + filteredItems.length * 42 + 40)}>
            <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
              <LinearGradient
                colors={T.logoutBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[S.logoutInner, { borderColor: T.logoutBorder }]}
              >
                <View style={[S.iconBox, { backgroundColor: T.logoutIconBg }]}>
                  <Feather name="log-out" size={17} color="#ff5555" />
                </View>
                <Text style={S.logoutTxt}>Log Out</Text>
                <Feather name="chevron-right" size={13} color="rgba(255,80,80,0.45)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={[S.version, { color: T.version }]}>Tomo · v1.0.0</Text>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

// ─── Styles (layout only — zero hardcoded colours) ────────────────────────────
const S = StyleSheet.create({
  root: { flex: 1 },

  blob1: {
    position: 'absolute', width: SW * 0.85, height: SW * 0.85,
    borderRadius: SW * 0.425, top: -SW * 0.2, right: -SW * 0.2,
  },
  blob2: {
    position: 'absolute', width: SW * 0.7, height: SW * 0.7,
    borderRadius: SW * 0.35, bottom: SW * 0.1, left: -SW * 0.25,
  },

  panel: {
    flex: 1,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 54,
  },

  closeWrap: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 56,
    right: 20, zIndex: 10,
  },
  closeBtnInner: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },

  hero: { alignItems: 'center', paddingTop: 10, paddingBottom: 24, paddingHorizontal: 24 },
  avatarRingOuter: { marginBottom: 14, alignItems: 'center', justifyContent: 'center' },
  avatarGradRing: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center', padding: 3,
  },
  avatarBorder: { width: '100%', height: '100%', borderRadius: 42, borderWidth: 3, overflow: 'hidden' },
  avatar:       { width: '100%', height: '100%' },

  heroName: {
    fontSize: 22, letterSpacing: -0.3, marginBottom: 3,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
  },
  heroHandle: {
    fontSize: 13, marginBottom: 18,
    fontFamily: FONTS_FAMILY.SourceSans3_Regular,
  },

  statRow:    { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 16, borderWidth: 1 },
  statPill:   { alignItems: 'center' },
  statNum:    { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  statLbl:    { fontSize: 10, fontFamily: FONTS_FAMILY.SourceSans3_Regular, marginTop: 1 },
  statDiv:    { width: 1, height: 28 },
  sellerChip: {  height: 24, borderRadius: 10 , alignItems: 'center', justifyContent: 'center', width:50},
  sellerChipTxt: { fontSize: 11, color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold },

  heroDivider: { height: 1.5, width: '85%', borderRadius: 1, opacity: 0.6 },

  scrollContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 50 },

  menuCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 14 },
  row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, gap: 13 },
  iconBox:  { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  badge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 4 },
  badgeTxt: { fontSize: 9, color: '#fff', fontFamily: FONTS_FAMILY.SourceSans3_Bold, letterSpacing: 0.6 },
  divider:  { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },

  logoutInner: { flexDirection: 'row', height:50, alignItems: 'center', gap: 13,   borderWidth: 1, borderRadius: 20 },
  logoutTxt:   { flex: 1, fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium, color: '#ff5555' },

  version: { textAlign: 'center', fontSize: 11, marginTop: 20, fontFamily: FONTS_FAMILY.SourceSans3_Regular, letterSpacing: 0.5 },
})

export default React.memo(SettingsDrawerScreen)