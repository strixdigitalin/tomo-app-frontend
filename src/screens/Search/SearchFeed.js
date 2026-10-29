import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, Image, FlatList, TextInput, TouchableOpacity, StatusBar, Keyboard,
  ActivityIndicator, ScrollView, RefreshControl, StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { apiGet, apiPost } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import LocationManager from '../../utils/LocationManager';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

const PAGE = 20;
// Nearby search radius is fixed at 5 km
const RADIUS = 5000;

// Search = web's Pages/AllUsers/Peoples.jsx:
//   · People near you (FindNearestUser, update location)
//   · Browse people (SearchUser, debounced) with Follow / Requested / Following on every card
const SearchScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const rawSelector = useSelector(state => state?.user?.userData);
  const myId = useMemo(() => {
    try { return rawSelector && Object.keys(rawSelector).length ? JSON.parse(rawSelector)?._id : null; } catch { return null; }
  }, [rawSelector]);

  const [query, setQuery] = useState('');
  const [people, setPeople] = useState([]);
  const [searching, setSearching] = useState(true);
  const [visible, setVisible] = useState(PAGE);
  const [nearby, setNearby] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [requested, setRequested] = useState({}); // ids followed during this session
  const [refreshing, setRefreshing] = useState(false);
  const reqId = useRef(0);

  // ── Browse / search people (debounced, server side like web) ───────────────
  const fetchPeople = useCallback(async text => {
    const id = ++reqId.current;
    setSearching(true);
    try {
      const res = await apiGet(`/api/user/SearchUser?search=${encodeURIComponent(text.trim())}`);
      if (id === reqId.current) setPeople((res?.data || []).filter(u => u?._id !== myId));
    } catch (e) {
      if (id === reqId.current) setPeople([]);
    } finally {
      if (id === reqId.current) setSearching(false);
    }
  }, [myId]);

  useEffect(() => {
    setVisible(PAGE);
    const t = setTimeout(() => fetchPeople(query), query ? 350 : 0);
    return () => clearTimeout(t);
  }, [query, fetchPeople]);

  // ── People near you ────────────────────────────────────────────────────────
  const fetchNearby = useCallback(async () => {
    setNearbyLoading(true);
    try {
      const res = await apiGet(`/api/user/FindNearestUser?distance=${RADIUS}`);
      setNearby(res?.statusCode === 200 ? (res.data || []).filter(u => u?._id !== myId) : []);
    } catch (e) {
      setNearby([]);
    } finally {
      setNearbyLoading(false);
    }
  }, [myId]);

  useEffect(() => { if (isFocused) fetchNearby(); }, [isFocused, fetchNearby]);

  useEffect(() => {
    const unsub = navigation.addListener('blur', () => Keyboard.dismiss());
    return unsub;
  }, [navigation]);

  const updateLocation = useCallback(async () => {
    try {
      await LocationManager.checkAndUpdateLocation(true);
      ToastMsg('Location updated');
      fetchNearby();
    } catch (e) {
      ToastMsg('Unable to fetch location');
    }
  }, [fetchNearby]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchPeople(query), fetchNearby()]);
    setRefreshing(false);
  }, [fetchPeople, fetchNearby, query]);

  // ── Follow ─────────────────────────────────────────────────────────────────
  const follow = useCallback(async id => {
    try {
      const res = await apiPost(`${urls.sendFollowRequest}/${id}`);
      if (res?.statusCode === 200) {
        setRequested(prev => ({ ...prev, [id]: true }));
        ToastMsg(res?.message || 'Follow request sent');
      } else {
        ToastMsg(res?.message || 'Failed to send request');
      }
    } catch (e) {
      ToastMsg(e?.message || 'Failed to send request');
      if (/already|request/i.test(e?.message || '')) setRequested(prev => ({ ...prev, [id]: true }));
    }
  }, []);

  const followState = useCallback(user => {
    if (myId && user?.Follower?.includes(myId)) return 'following';
    if (requested[user?._id] || (myId && user?.RequestedFollower?.includes(myId))) return 'requested';
    return 'follow';
  }, [myId, requested]);

  const followButton = (user, compact) => {
    const state = followState(user);
    const isFollow = state === 'follow';
    return (
      <TouchableOpacity
        disabled={!isFollow}
        onPress={() => follow(user._id)}
        activeOpacity={0.85}
        style={[
          styles.followBtn,
          compact && { alignSelf: 'stretch', justifyContent: 'center' },
          { backgroundColor: isFollow ? accent : c.chip },
        ]}>
        <Feather
          name={state === 'following' ? 'check' : state === 'requested' ? 'clock' : 'user-plus'}
          size={13}
          color={isFollow ? '#fff' : c.text}
        />
        <Text style={[styles.followText, { color: isFollow ? '#fff' : c.text }]}>
          {state === 'following' ? 'Following' : state === 'requested' ? 'Requested' : 'Follow'}
        </Text>
      </TouchableOpacity>
    );
  };

  const openUser = useCallback(user => navigation.navigate('OtherUserDetail', { userId: user._id, user }), [navigation]);

  // ── Renderers ──────────────────────────────────────────────────────────────
  const renderNearby = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => openUser(item)}
      style={[styles.nearCard, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      <Image source={item?.Image ? { uri: item.Image } : IMG.MessageProfile} style={[styles.nearAvatar, { borderColor: accent }]} />
      <Text style={[styles.nearName, { color: c.text }]} numberOfLines={1}>{item?.FullName || item?.UserName}</Text>
      <View style={styles.cityRow}>
        <Feather name="map-pin" size={10} color={c.muted} />
        <Text style={[styles.city, { color: c.muted }]} numberOfLines={1}>{item?.Location?.City || 'Nearby'}</Text>
      </View>
      {followButton(item, true)}
    </TouchableOpacity>
  );

  const renderPerson = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => openUser(item)}
      style={[styles.row, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      <Image source={item?.Image ? { uri: item.Image } : IMG.MessageProfile} style={[styles.avatar, { borderColor: accent }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{item?.FullName || item?.UserName}</Text>
        <Text style={[styles.user, { color: c.muted }]} numberOfLines={1}>@{item?.UserName}</Text>
      </View>
      {followButton(item)}
    </TouchableOpacity>
  );

  const searchingNow = query.trim().length > 0;
  const shown = people.slice(0, visible);
  const hasMore = people.length > visible;

  const header = (
    <View>
      {!searchingNow && (
        <View style={{ marginBottom: 6 }}>
          <View style={styles.sectionRow}>
            <Text style={[styles.section, { color: c.text }]}>People near you</Text>
            <TouchableOpacity onPress={updateLocation} style={styles.locBtn} activeOpacity={0.7}>
              <Feather name="navigation" size={12} color={accent} />
              <Text style={[styles.locText, { color: accent }]}>Update location</Text>
            </TouchableOpacity>
          </View>


          {nearbyLoading ? (
            <ActivityIndicator style={{ marginVertical: 24 }} color={accent} />
          ) : nearby.length === 0 ? (
            <View style={[styles.nearEmpty, { backgroundColor: c.card, borderColor: c.border }]}>
              <Feather name="map-pin" size={22} color={c.muted} />
              <Text style={[styles.nearEmptyText, { color: c.muted }]}>
                No one within 5 km. Try updating your location.
              </Text>
            </View>
          ) : (
            <FlatList
              data={nearby}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={u => `nearby-${u._id}`}
              renderItem={renderNearby}
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
              initialNumToRender={4}
            />
          )}
        </View>
      )}

      <Text style={[styles.section, { color: c.text, marginTop: searchingNow ? 4 : 14, paddingHorizontal: 16, marginBottom: 10 }]}>
        {searchingNow ? 'Results' : 'Browse people'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: c.screen }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.top, { paddingTop: insets.top + 10, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <Text style={[styles.title, { color: c.text }]}>Search</Text>
        <View style={[styles.search, { backgroundColor: c.chip }]}>
          <Feather name="search" size={17} color={c.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search people..."
            placeholderTextColor={c.muted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.searchInput, { color: c.text }]}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={17} color={c.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={searching && people.length === 0 ? [] : shown}
        keyExtractor={(u, i) => u?._id || String(i)}
        renderItem={renderPerson}
        ListHeaderComponent={header}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} colors={[accent]} />}
        onEndReached={() => hasMore && setVisible(v => v + PAGE)}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 120 }}
        ListEmptyComponent={
          searching ? (
            <ActivityIndicator style={{ marginTop: 30 }} color={accent} />
          ) : (
            <View style={styles.empty}>
              <Feather name="users" size={34} color={c.muted} />
              <Text style={[styles.emptyTitle, { color: c.text }]}>{searchingNow ? 'No users found' : 'No people yet'}</Text>
              <Text style={[styles.emptySub, { color: c.muted }]}>
                {searchingNow ? `Nobody matches "${query}".` : 'Check back later.'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={hasMore ? <ActivityIndicator style={{ marginVertical: 16 }} color={accent} /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  top: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 24, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingHorizontal: 14, height: 44, borderRadius: 22 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 14 },
  section: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  locBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 4 },
  locText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  nearCard: { width: 138, alignItems: 'center', padding: 12, marginRight: 10, marginBottom: 6, borderRadius: 20, borderWidth: 1, elevation: 2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 },
  nearAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2 },
  nearName: { fontSize: 14, marginTop: 8, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, marginBottom: 10 },
  city: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular, maxWidth: 100 },
  nearEmpty: { marginHorizontal: 12, padding: 18, borderRadius: 18, borderWidth: 1, alignItems: 'center', gap: 8 },
  nearEmptyText: { fontSize: 13, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10, borderRadius: 18, borderWidth: 1, elevation: 2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 1.5 },
  name: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  user: { fontSize: 13, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  followBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  followText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  empty: { alignItems: 'center', paddingTop: 50, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 16, marginTop: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  emptySub: { fontSize: 13, marginTop: 4, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default SearchScreen;
