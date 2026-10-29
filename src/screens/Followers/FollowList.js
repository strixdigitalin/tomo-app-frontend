import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, StatusBar, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { apiGet, apiPost } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

const PAGE = 20;

// Shared by Followers and Following (web: Pages/Follow/AllFollowers + AllFollowing).
//   mode 'followers' → Followers | Requests (accept)
//   mode 'following' → Following | Requested
const CONFIG = {
  followers: {
    title: 'Followers',
    listUrl: urls.getAllFollowers,
    requestUrl: '/api/user/GetAllrequestedfollowers',
    tabs: ['Followers', 'Requests'],
    empty: ['No followers yet', 'People who follow you will show up here.'],
    emptyReq: ['No pending requests', 'Follow requests will show up here.'],
  },
  following: {
    title: 'Following',
    listUrl: urls.getAllFollowings,
    requestUrl: '/api/user/GetAllrequestedFollowing',
    tabs: ['Following', 'Requested'],
    empty: ['Not following anyone', 'People you follow will show up here.'],
    emptyReq: ['No sent requests', 'Requests you have sent will show up here.'],
  },
};

const FollowList = ({ navigation, route, mode }) => {
  const cfg = CONFIG[mode];
  const insets = useSafeAreaInsets();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const [tab, setTab] = useState(route?.params?.tab === 'requests' ? 1 : 0);
  const [list, setList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([apiGet(cfg.listUrl), apiGet(cfg.requestUrl)]);
      setList(a?.data || []);
      setRequests(b?.data || []);
    } catch (e) {
      console.log('FollowList load error', e);
    }
  }, [cfg.listUrl, cfg.requestUrl]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);
  useEffect(() => { setVisible(PAGE); }, [tab, query]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const accept = useCallback(async id => {
    try {
      setBusyId(id);
      const res = await apiPost(`${urls.acceptFollowReq}/${id}`);
      ToastMsg(res?.message || 'Request accepted');
      await load();
    } finally {
      setBusyId(null);
    }
  }, [load]);

  const showingRequests = tab === 1;
  const source = showingRequests ? requests : list;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(u => `${u?.UserName || ''} ${u?.FullName || ''}`.toLowerCase().includes(q));
  }, [source, query]);
  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id, user: item })}
      style={[styles.row, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      <Image source={item?.Image ? { uri: item.Image } : IMG.MessageProfile} style={[styles.avatar, { borderColor: accent }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{item?.FullName || item?.UserName}</Text>
        <Text style={[styles.user, { color: c.muted }]} numberOfLines={1}>@{item?.UserName}</Text>
      </View>
      {mode === 'followers' && showingRequests ? (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: accent, opacity: busyId === item?._id ? 0.6 : 1 }]}
          disabled={busyId === item?._id}
          onPress={() => accept(item?._id)}>
          {busyId === item?._id ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.btnText}>Accept</Text>}
        </TouchableOpacity>
      ) : showingRequests ? (
        <View style={[styles.pill, { backgroundColor: c.chip }]}>
          <Feather name="clock" size={12} color={c.muted} />
          <Text style={[styles.pillText, { color: c.muted }]}>Pending</Text>
        </View>
      ) : (
        <Feather name="chevron-right" size={20} color={c.muted} />
      )}
    </TouchableOpacity>
  );

  const [emptyTitle, emptySub] = showingRequests ? cfg.emptyReq : cfg.empty;

  return (
    <View style={[styles.screen, { backgroundColor: c.screen }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.back, { backgroundColor: c.chip }]} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="arrow-left" size={20} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: c.text }]}>{cfg.title}</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={[styles.search, { backgroundColor: c.chip }]}>
          <Feather name="search" size={16} color={c.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search people"
            placeholderTextColor={c.muted}
            style={[styles.searchInput, { color: c.text }]}
            autoCapitalize="none"
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={16} color={c.muted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabs}>
          {cfg.tabs.map((label, i) => {
            const active = tab === i;
            const count = i === 0 ? list.length : requests.length;
            return (
              <TouchableOpacity
                key={label}
                onPress={() => setTab(i)}
                activeOpacity={0.8}
                style={[styles.tab, { backgroundColor: active ? accent : c.chip }]}>
                <Text style={[styles.tabText, { color: active ? '#fff' : c.text }]}>{label}</Text>
                <View style={[styles.badge, { backgroundColor: active ? 'rgba(255,255,255,0.25)' : accent + '1A' }]}>
                  <Text style={[styles.badgeText, { color: active ? '#fff' : accent }]}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={accent} />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(item, i) => item?._id || String(i)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 24, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} colors={[accent]} />}
          onEndReached={() => hasMore && setVisible(v => v + PAGE)}
          onEndReachedThreshold={0.4}
          ListFooterComponent={hasMore ? <ActivityIndicator style={{ marginVertical: 16 }} color={accent} /> : null}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name={query ? 'search' : 'users'} size={34} color={c.muted} />
              <Text style={[styles.emptyTitle, { color: c.text }]}>{query ? 'No matches' : emptyTitle}</Text>
              <Text style={[styles.emptySub, { color: c.muted }]}>{query ? `Nobody matches "${query}".` : emptySub}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, paddingHorizontal: 14, height: 42, borderRadius: 21 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  tabText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  badge: { minWidth: 20, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10, alignItems: 'center' },
  badgeText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10, borderRadius: 18, borderWidth: 1, elevation: 2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 1.5 },
  name: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  user: { fontSize: 13, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  btn: { minWidth: 76, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  pillText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  empty: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 16, marginTop: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  emptySub: { fontSize: 13, marginTop: 4, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default FollowList;
