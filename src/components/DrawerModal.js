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
  { label: 'Events',             icon: 'calendar',        iconType: 'Feather',                nav: 'AllEvents',          badge: 'NEW',      sellerOnly: false, nonSellerOnly: false },
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