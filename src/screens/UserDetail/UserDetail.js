import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View, Text, FlatList, StatusBar, TouchableOpacity, Modal, TextInput,
  ActivityIndicator, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { apiGet, apiPost, apiDelete, getItem, BASE_URL } from '../../utils/Apis'
import urls from '../../config/urls'
import { ConfirmDialog } from '../../components/ActionMenu'
import { ToastMsg } from '../../utils/helperFunctions'
import { formatInstagramDate } from '../../utils/DateFormat'
import { FONTS_FAMILY } from '../../assets/Fonts'
import { THEMES } from '../../redux/reducer/theme'
import useLoader from '../../utils/LoaderHook'
import LocationManager from '../../utils/LocationManager'
import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
import CarRatingModal from './CarRatingModal'
import ProfileHeader from './ProfileHeader'
import CarCard from './CarCard'
import { PostTile, ProductCard } from './ProfileTiles'
import { profilePalette } from './profileTheme'
import FormField from '../../components/FormField'
import FormButton from '../../components/FormButton'
import useForm from '../../utils/useForm'
import { compose, required, maxLength, username as usernameRule } from '../../utils/validators'

const EDIT_SCHEMA = {
  FullName: compose(required('Full name'), maxLength(60, 'Full name')),
  UserName: compose(required('Username'), usernameRule),
  Bio: maxLength(200, 'Bio'),
}

const IMG_PICKER_OPTIONS = { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000, quality: 0.8 }

// Web tabs: Current Car · Gallery · Saved · Tagged · Products (Saved/Tagged are private to the owner)
const ALL_TABS = [
  { key: 'car', label: 'Car', icon: 'car-sports', mci: true, page: 4, cols: 1 },
  { key: 'gallery', label: 'Gallery', icon: 'grid', page: 18, cols: 3 },
  { key: 'saved', label: 'Saved', icon: 'bookmark', page: 18, cols: 3, ownOnly: true },
  { key: 'tagged', label: 'Tagged', icon: 'user', page: 18, cols: 3, ownOnly: true },
  { key: 'products', label: 'Products', icon: 'shopping-bag', page: 8, cols: 2 },
]

const EMPTY = {
  car: ['No car added yet', 'Add your ride to show it off to the community.'],
  gallery: ['No posts yet', 'Posts will show up here.'],
  saved: ['Nothing saved', 'Posts you save will be kept here.'],
  tagged: ['No tagged posts', 'Posts you are tagged in will show up here.'],
  products: ['No products', 'Listings will show up here.'],
}

// The add/edit vehicle screen wants the car in its own flat shape
const toVehicleData = c => ({
  _id: c._id,
  vehicleName: c.VehicleInfo?.vehicleName,
  make: c.VehicleInfo?.make,
  model: c.VehicleInfo?.model,
  year: c.VehicleInfo?.year,
  bodyType: c.VehicleInfo?.bodyType,
  engine: c.Power?.engine,
  horsepower: c.Power?.horsepower,
  torque: c.Power?.torque,
  drivetrain: c.Power?.drivetrain,
  transmission: c.Power?.transmission,
  performance: c.Modifications?.performance || [],
  suspension: c.Modifications?.suspension || [],
  brakes: c.Modifications?.brakes || [],
  paintWrap: c.Style?.paintWrap,
  exteriorMods: c.Style?.exteriorMods || [],
  interiorMods: c.Style?.interiorMods || [],
  mileage: c.Status?.mileage,
  buildStage: c.Status?.buildStage,
  ownerNote: c.OwnerNote,
  zeroToSixty: c.PerformanceStats?.zeroToSixty,
  quarterMile: c.PerformanceStats?.quarterMile,
  currentPrice: c.CurrentPrice,
  PrimaryCar: c.PrimaryCar,
  images: c.Image ? [c.Image] : [],
})

const timeSince = date => {
  if (!date) return null
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d < 7) return `${d}d ago`
  return `${Math.floor(d / 7)}w ago`
}

const OtherUserDetail = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme)
  const theme = THEMES[selectedColorTheme] || THEMES.default
  const accent = theme.primary
  const c = profilePalette(isDarkMode, accent)
  const { showLoader, hideLoader } = useLoader()

  const rawSelector = useSelector(state => state?.user?.userData)
  const selector = useMemo(() => {
    if (rawSelector && Object.keys(rawSelector).length !== 0) {
      try { return JSON.parse(rawSelector) } catch { return {} }
    }
    return {}
  }, [rawSelector])

  const isOther = !!route?.params?.userId
  const userId = route?.params?.userId || selector?._id
  const myId = selector?._id

  // A preview of the user can be passed from lists/search so the profile shows instantly
  // and still has something to show if the profile request fails.
  const preview = route?.params?.user || null
  const [user, setUser] = useState(preview)
  const [loading, setLoading] = useState(!preview)
  const [cars, setCars] = useState([])
  const [posts, setPosts] = useState([])
  const [saved, setSaved] = useState([])
  const [tagged, setTagged] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('car')
  const [visible, setVisible] = useState(4)

  const [editOpen, setEditOpen] = useState(false)
  const form = useForm({ FullName: '', UserName: '', Bio: '' }, EDIT_SCHEMA)
  const [ratingCar, setRatingCar] = useState(null)
  const [deleteCar, setDeleteCar] = useState(null)
  const [justRequested, setJustRequested] = useState(false)

  const fetchedFor = useRef(null)
  const allowedRef = useRef(true)
  const [loadError, setLoadError] = useState(false)

  // ── Data ────────────────────────────────────────────────────────────────────
  const fetchUser = useCallback(async () => {
    const endpoint = isOther ? `${urls.getUserById}/${userId}` : urls.userProfile
    // The server records a profile view (and may 500 on the very first view of a user);
    // the view is already saved by then, so one retry normally succeeds.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await apiGet(endpoint)
        setUser(res?.data || null)
        return res?.data || null
      } catch (e) {
        console.log(`fetchUser ${endpoint} (attempt ${attempt + 1}):`, JSON.stringify(e))
        if (attempt === 0) await new Promise(r => setTimeout(r, 400))
      }
    }
    if (!preview) ToastMsg('Could not load profile. Pull back and try again.')
    return null
  }, [isOther, userId, preview])

  const fetchCars = useCallback(async () => {
    try {
      const res = await apiGet(isOther ? `/api/user/GetAUserCurrentCar/${userId}` : '/api/user/GetUserCurrentCar')
      setCars(res?.data || [])
    } catch (e) { setCars([]) }
  }, [isOther, userId])

  const fetchRest = useCallback(async () => {
    const safe = async (fn, set) => { try { const r = await fn(); set(r?.data || []) } catch (e) { set([]) } }
    await Promise.all([
      safe(() => apiGet(`${urls.getAllPostsOfAUser}/${userId}`), setPosts),
      safe(() => apiGet(isOther ? `/api/admin/GetAllProductsOfAUser/${userId}` : '/api/user/GetAllProductsOfUser'), setProducts),
      ...(isOther ? [] : [
        safe(() => apiGet(urls.getAllSavedPosts), r => setSaved((r || []).map(i => i?.Post).filter(Boolean))),
        safe(() => apiGet('/api/user/GetAllMyTaggedPosts'), setTagged),
      ]),
    ])
  }, [isOther, userId])

  // Load the profile first, then — only if the viewer is allowed — its posts / cars / products.
  // Fail closed: if the profile request fails we do NOT know whether it is private, so we show a
  // retry state instead of guessing "public" (search results don't carry the privacy flag).
  const loadAll = useCallback(async () => {
    setLoadError(false)
    setLoading(true)
    try {
      const u = await fetchUser()
      if (!u && isOther) {
        allowedRef.current = false
        setPosts([]); setCars([])
        setLoadError(true)
        return
      }
      const profile = u || preview
      const allowed = !isOther || !profile?.PrivateProfile || (!!myId && !!profile?.Follower?.includes(myId))
      allowedRef.current = allowed
      if (!allowed) { setPosts([]); setCars([]); return }
      await Promise.all([fetchCars(), fetchRest()])
    } finally {
      setLoading(false)
    }
  }, [fetchUser, fetchCars, fetchRest, isOther, myId, preview])

  useFocusEffect(
    useCallback(() => {
      if (fetchedFor.current === userId) {
        // cars can change after Add/Update on another screen, so refresh them (when allowed)
        if (allowedRef.current) fetchCars()
        return
      }
      fetchedFor.current = userId
      loadAll()
    }, [userId, fetchCars, loadAll]),
  )

  // reset pagination whenever the tab changes
  const tabs = useMemo(() => ALL_TABS.filter(t => !(t.ownOnly && isOther)), [isOther])
  const activeTab = tabs.find(t => t.key === tab) || tabs[0]
  useEffect(() => { setVisible(activeTab.page) }, [activeTab.key])

  const data = useMemo(
    () => ({ car: cars, gallery: posts, saved, tagged, products }[activeTab.key] || []),
    [activeTab.key, cars, posts, saved, tagged, products],
  )
  const shown = useMemo(() => data.slice(0, visible), [data, visible])
  const hasMore = data.length > visible
  const loadMore = useCallback(() => { if (hasMore) setVisible(v => v + activeTab.page) }, [hasMore, activeTab.page])

  // ── Follow state / privacy ─────────────────────────────────────────────────
  const isFollowing = !!myId && !!user?.Follower?.includes(myId)
  const isRequested = justRequested || (!!myId && !!user?.RequestedFollower?.includes(myId))
  const followState = isFollowing ? 'following' : isRequested ? 'requested' : 'follow'
  const canView = !loadError && (!isOther || !user?.PrivateProfile || isFollowing)

  const sendFollow = useCallback(async () => {
    try {
      const res = await apiPost(`${urls.sendFollowRequest}/${userId}`)
      if (res?.statusCode === 200) {
        setJustRequested(true)
        ToastMsg(res?.message || 'Follow request sent')
      }
    } catch (e) {
      // e.g. 400 "already requested" — show the server's reason and reflect it in the button
      ToastMsg(e?.message || 'Failed to send request')
      if (/already|request/i.test(e?.message || '')) setJustRequested(true)
    }
  }, [userId])

  // ── Profile editing ────────────────────────────────────────────────────────
  const saveProfile = useCallback(async fields => {
    try {
      showLoader()
      const fd = new FormData()
      Object.entries(fields).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        if (typeof v === 'object') fd.append(k, v)
        else fd.append(k, String(v))
      })
      const token = await getItem('token')
      const res = await fetch(`${BASE_URL}/api/user/UpdateUser`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        body: fd,
      })
      if (res.ok) { ToastMsg('Profile updated successfully!'); await fetchUser() }
      else ToastMsg('Failed to update profile')
    } catch { ToastMsg('Failed to update profile') }
    finally { hideLoader() }
  }, [showLoader, hideLoader, fetchUser])

  const pickImage = useCallback(field => {
    launchImageLibrary(IMG_PICKER_OPTIONS, r => {
      const a = !r.didCancel && r.assets?.[0]
      if (a) saveProfile({ [field]: { uri: a.uri, type: a.type || 'image/jpeg', name: `${field.toLowerCase()}.jpg` } })
    })
  }, [saveProfile])

  const openEdit = useCallback(() => {
    form.reset({ FullName: user?.FullName || '', UserName: user?.UserName || '', Bio: user?.Bio || '' })
    setEditOpen(true)
  }, [user, form])

  const submitEdit = useCallback(() => {
    const { ok, firstError } = form.validateAll()
    if (!ok) return ToastMsg(firstError)
    setEditOpen(false)
    saveProfile({ FullName: form.values.FullName.trim(), UserName: form.values.UserName.trim(), Bio: form.values.Bio })
  }, [form, saveProfile])

  const updateLocation = useCallback(async () => {
    try {
      showLoader()
      await LocationManager.checkAndUpdateLocation(true)
      await fetchUser()
      ToastMsg('Location updated')
    } catch { ToastMsg('Unable to update location') }
    finally { hideLoader() }
  }, [showLoader, hideLoader, fetchUser])

  // ── Cars ───────────────────────────────────────────────────────────────────
  const confirmDeleteCar = useCallback(async () => {
    const car = deleteCar
    setDeleteCar(null)
    try {
      const res = await apiDelete(`/api/user/DeleteUserCurrentCar/${car?._id}`)
      if (res?.statusCode === 200) {
        setCars(prev => prev.filter(x => x._id !== car._id))
        ToastMsg(res?.message || 'Vehicle deleted')
      } else ToastMsg(res?.message || 'Failed to delete vehicle')
    } catch { ToastMsg('Failed to delete vehicle') }
  }, [deleteCar])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const openPost = useCallback(post => {
    navigation.navigate('PostDetail', { post, selector, isDarkMode, formatInstagramDate })
  }, [navigation, selector, isDarkMode])

  const openProduct = useCallback(p => {
    navigation.navigate(isOther ? 'ProductDetail' : 'ListingProductDetail', { productId: p?._id })
  }, [navigation, isOther])

  // ── Render ─────────────────────────────────────────────────────────────────
  const renderItem = useCallback(({ item }) => {
    switch (activeTab.key) {
      case 'car':
        return (
          <CarCard
            car={item} isOther={isOther} isDark={isDarkMode} accent={accent}
            onEdit={car => navigation.navigate('AddVehicleSpecs', { vehicleData: toVehicleData(car) })}
            onDelete={setDeleteCar}
            onRate={setRatingCar}
          />
        )
      case 'products':
        return <ProductCard product={item} isDark={isDarkMode} accent={accent} onPress={() => openProduct(item)} />
      default:
        return <PostTile post={item} isDark={isDarkMode} accent={accent} onPress={() => openPost(item)} />
    }
  }, [activeTab.key, isOther, isDarkMode, accent, navigation, openPost, openProduct])

  const header = (
    <View>
      <ProfileHeader
        user={user} isOther={isOther} isDark={isDarkMode} accent={accent} secondary={theme.secondary}
        postsCount={canView ? posts.length : null} followState={followState}
        joined={canView && user?.ShowJoinedDate ? new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null}
        activity={canView && user?.ShowLastActive ? timeSince(user?.LastActiveAt) : null}
        location={canView && user?.ShowAddress !== false ? user?.Location?.Address : null}
        topInset={insets.top + 6}
        onBack={isOther ? () => navigation.goBack() : undefined}
        onSettings={() => navigation.navigate('SettingsDrawer')}
        onEditCover={() => pickImage('CoverImage')}
        onEditAvatar={() => pickImage('Image')}
        onEditProfile={openEdit}
        onUpdateLocation={updateLocation}
        onFollow={sendFollow}
        onMessage={canView ? () => navigation.navigate('Chat', { userId: user?._id, userForChat: user }) : undefined}
        onFollowers={isOther ? undefined : () => navigation.navigate('Followers')}
        onFollowing={isOther ? undefined : () => navigation.navigate('Followings')}
      />

      {canView ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {tabs.map(t => {
              const active = t.key === activeTab.key
              const Icon = t.mci ? MaterialCommunityIcons : Feather
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setTab(t.key)}
                  activeOpacity={0.8}
                  style={[styles.tab, { backgroundColor: active ? accent : c.card, borderColor: active ? accent : c.border }]}>
                  <Icon name={t.icon} size={15} color={active ? '#fff' : c.muted} />
                  <Text style={[styles.tabText, { color: active ? '#fff' : c.text }]}>{t.label}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          {activeTab.key === 'car' && !isOther && (
            <TouchableOpacity
              style={[styles.addCar, { borderColor: accent, backgroundColor: accent + '12' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddVehicleSpecs')}>
              <Feather name="plus" size={16} color={accent} />
              <Text style={[styles.addCarText, { color: accent }]}>{cars.length ? 'Add more car' : 'Add your first car'}</Text>
            </TouchableOpacity>
          )}
        </>
      ) : null}
    </View>
  )

  if (loading && !user) return <ProfileShimmer />

  return (
    <View style={[styles.screen, { backgroundColor: c.screen }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        key={canView ? activeTab.key : 'private'}
        data={canView ? shown : []}
        numColumns={canView ? activeTab.cols : 1}
        columnWrapperStyle={canView && activeTab.cols > 1 ? styles.columns : undefined}
        keyExtractor={(item, i) => item?._id?.toString() || String(i)}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={
          loadError ? (
            <View style={styles.empty}>
              <View style={[styles.lockCircle, { backgroundColor: c.danger + '1F' }]}>
                <Feather name="wifi-off" size={26} color={c.danger} />
              </View>
              <Text style={[styles.emptyTitle, { color: c.text }]}>Couldn't load this profile</Text>
              <Text style={[styles.emptySub, { color: c.muted }]}>Check your connection and try again.</Text>
              <TouchableOpacity style={[styles.retryBtn, { backgroundColor: accent }]} onPress={loadAll} activeOpacity={0.85}>
                <Feather name="refresh-cw" size={15} color="#fff" />
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : !canView ? (
            <View style={styles.empty}>
              <View style={[styles.lockCircle, { backgroundColor: accent + '1F' }]}>
                <Feather name="lock" size={28} color={accent} />
              </View>
              <Text style={[styles.emptyTitle, { color: c.text }]}>This profile is private</Text>
              <Text style={[styles.emptySub, { color: c.muted }]}>
                Follow {user?.UserName || 'this user'} to see their posts, cars and products.
              </Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Feather name="inbox" size={34} color={c.muted} />
              <Text style={[styles.emptyTitle, { color: c.text }]}>{EMPTY[activeTab.key][0]}</Text>
              <Text style={[styles.emptySub, { color: c.muted }]}>{EMPTY[activeTab.key][1]}</Text>
            </View>
          )
        }
        ListFooterComponent={canView && hasMore ? <ActivityIndicator style={{ marginVertical: 18 }} color={accent} /> : <View style={{ height: 110 }} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        initialNumToRender={9}
        maxToRenderPerBatch={9}
        windowSize={7}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={canView && activeTab.cols > 1 ? () => <View style={{ height: 6 }} /> : undefined}
      />

      {/* Edit profile */}
      <Modal visible={editOpen} transparent animationType="slide" onRequestClose={() => setEditOpen(false)}>
        <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setEditOpen(false)} />
          <View style={[styles.sheet, { backgroundColor: c.card, borderColor: c.border, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
            <View style={[styles.grabber, { backgroundColor: c.divider }]} />
            <Text style={[styles.sheetTitle, { color: c.text }]}>Edit profile</Text>

            <View style={{ marginTop: 14 }}>
              <FormField
                label="Full name" required leftIcon="user" autoCapitalize="words" maxLength={60}
                value={form.values.FullName} error={form.errors.FullName}
                onChangeText={t => form.set('FullName', t)} onBlur={() => form.blur('FullName')}
              />
              <FormField
                label="Username" required leftIcon="at-sign" maxLength={30}
                value={form.values.UserName} error={form.errors.UserName}
                onChangeText={t => form.set('UserName', t)} onBlur={() => form.blur('UserName')}
              />
              <FormField
                label="Bio" multiline maxLength={200} showCounter autoCapitalize="sentences"
                placeholder="Write something about yourself..."
                value={form.values.Bio} error={form.errors.Bio}
                onChangeText={t => form.set('Bio', t)} onBlur={() => form.blur('Bio')}
              />
            </View>

            <View style={styles.sheetBtns}>
              <FormButton label="Cancel" variant="outline" onPress={() => setEditOpen(false)} style={{ flex: 1 }} />
              <FormButton label="Save" onPress={submitEdit} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmDialog
        visible={!!deleteCar}
        onClose={() => setDeleteCar(null)}
        title="Delete vehicle"
        message="Are you sure you want to delete this vehicle?"
        onConfirm={confirmDeleteCar}
      />

      <CarRatingModal
        visible={!!ratingCar}
        onClose={() => setRatingCar(null)}
        carId={ratingCar?._id}
        onSubmitted={fetchCars}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  tabsRow: { paddingHorizontal: 12, paddingVertical: 16, gap: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  columns: { gap: 6, paddingHorizontal: 12 },
  addCar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 12, marginBottom: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed' },
  addCarText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  empty: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 30 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, paddingHorizontal: 24, paddingVertical: 11, borderRadius: 16 },
  retryText: { color: '#fff', fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  lockCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, marginTop: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  emptySub: { fontSize: 13, marginTop: 4, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 10 },
  grabber: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { fontSize: 18, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  label: { fontSize: 12, marginBottom: 6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  sheetBtns: { flexDirection: 'row', gap: 12, marginTop: 18 },
  sheetBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  sheetBtnText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
})

export default OtherUserDetail
