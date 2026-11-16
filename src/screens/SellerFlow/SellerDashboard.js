import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import SellerScreen, { EmptyState, ErrorState, useSellerPalette } from '../../components/SellerScreen';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import {
  fmtDate, fmtMoney, capitalize, carName, STATUS_COLORS,
} from '../../utils/serviceRecords';

const WORK_TYPE_LABELS = { modification: 'Modification', repair: 'Repair', service: 'Service', inspection: 'Inspection' };

const Stat = ({ icon, label, value, sub, color, c }) => (
  <View style={[styles.stat, { backgroundColor: c.card, borderColor: c.border }]}>
    <View style={[styles.statIcon, { backgroundColor: color + '1F' }]}>
      <Feather name={icon} size={14} color={color} />
    </View>
    <Text style={[styles.statValue, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    <Text style={[styles.statLabel, { color: c.muted }]} numberOfLines={1}>{label}</Text>
    {!!sub && <Text style={[styles.statSub, { color: c.muted }]} numberOfLines={1}>{sub}</Text>}
  </View>
);

const Card = ({ title, subtitle, children, c }) => (
  <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
    <Text style={[styles.cardTitle, { color: c.text }]}>{title}</Text>
    {!!subtitle && <Text style={[styles.cardSub, { color: c.muted }]}>{subtitle}</Text>}
    <View style={{ marginTop: 12 }}>{children}</View>
  </View>
);

// Seller dashboard (web: Seller/Dashboard/Dashboard.jsx) — one call: api/seller/GetSellerDashboard
const SellerDashboard = ({ navigation }) => {
  const { c, accent } = useSellerPalette();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [seller, setSeller] = useState(null);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError('');
      // seller name + photo for the header (a failure here must not break the dashboard)
      apiGet(urls.sellerProfile).then(p => p?.data && setSeller(p.data)).catch(() => {});
      const res = await apiGet(urls.sellerDashboard);
      if (!res?.data) throw new Error('Invalid dashboard response');
      setData(res.data);
    } catch (e) {
      setError(e?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(!!data); }, [load])); // eslint-disable-line react-hooks/exhaustive-deps

  const overview = data?.overview || {};
  const records = data?.serviceRecords || {};
  const revenue = data?.revenue || {};
  const shops = data?.shops || [];
  const recent = data?.recentRecords || [];
  const workTotal = Object.keys(WORK_TYPE_LABELS).reduce((s, k) => s + (records?.byWorkType?.[k] || 0), 0);

  return (
    <SellerScreen
      title={seller?.StoreName || seller?.FullName || 'Dashboard'}
      subtitle={seller?.FullName && seller?.StoreName ? `Welcome back, ${seller.FullName}` : 'Your shops, products and service work'}
      right={
        <Image
          source={seller?.Image ? { uri: seller.Image } : IMG.ProfileImagePost}
          style={[styles.avatar, { borderColor: accent }]}
        />
      }>
      {loading && !data ? (
        <View style={{ paddingTop: 80 }}><ActivityIndicator color={accent} size="large" /></View>
      ) : error && !data ? (
        <ErrorState message={error} onRetry={() => load()} c={c} accent={accent} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 12, paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor={accent} colors={[accent]} />}>

          <View style={styles.grid}>
            <Stat c={c} icon="shopping-bag" label="Shops" value={overview.totalShops ?? 0} color={accent} />
            <Stat c={c} icon="box" label="Products" value={overview.totalProducts ?? 0} color="#8B5CF6" />
            <Stat c={c} icon="tag" label="Promotions" value={overview.totalPromotions ?? 0} color="#EC4899" />
            <Stat c={c} icon="tool" label="Service records" value={records.total ?? 0} sub={`${records.pending ?? 0} pending`} color="#F59E0B" />
            <Stat c={c} icon="trending-up" label="Total revenue" value={fmtMoney(revenue.total)} sub={`${revenue.completedJobs ?? 0} completed jobs`} color="#22C55E" />
            <Stat c={c} icon="calendar" label="This month" value={fmtMoney(revenue.thisMonth)} sub={`${revenue.thisMonthJobs ?? 0} jobs · avg ${fmtMoney(revenue.averagePerJob)}`} color="#0EA5E9" />
          </View>

          <View style={styles.quickRow}>
            <TouchableOpacity style={[styles.quick, { backgroundColor: accent }]} onPress={() => navigation.navigate('SellerScan')} activeOpacity={0.85}>
              <Feather name="maximize" size={18} color="#fff" />
              <Text style={styles.quickText}>Scan vehicle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quick, { backgroundColor: c.card, borderColor: accent, borderWidth: 1.5 }]} onPress={() => navigation.navigate('SellerServiceRecords')} activeOpacity={0.85}>
              <Feather name="clipboard" size={18} color={accent} />
              <Text style={[styles.quickText, { color: accent }]}>Service records</Text>
            </TouchableOpacity>
          </View>

          <Card c={c} title="Work type" subtitle="Jobs by category">
            {Object.entries(WORK_TYPE_LABELS).map(([k, label]) => {
              const v = records?.byWorkType?.[k] || 0;
              const pct = workTotal > 0 ? (v / workTotal) * 100 : 0;
              return (
                <View key={k} style={{ marginBottom: 12 }}>
                  <View style={styles.barTop}>
                    <Text style={[styles.barLabel, { color: c.text }]}>{label}</Text>
                    <Text style={[styles.barLabel, { color: c.text, fontFamily: FONTS_FAMILY.SourceSans3_Bold }]}>{v}</Text>
                  </View>
                  <View style={[styles.track, { backgroundColor: c.chip }]}>
                    <View style={{ width: `${pct}%`, height: '100%', borderRadius: 4, backgroundColor: accent }} />
                  </View>
                </View>
              );
            })}
          </Card>

          <Card c={c} title="My shops" subtitle={`${shops.length} total`}>
            {shops.length === 0 ? <EmptyState icon="shopping-bag" text="No shops added yet." c={c} /> : shops.map(s => (
              <View key={s._id} style={[styles.shopRow, { borderBottomColor: c.divider }]}>
                {s.Image ? <Image source={{ uri: s.Image }} style={styles.shopImg} /> : (
                  <View style={[styles.shopImg, styles.center, { backgroundColor: c.chip }]}><Feather name="shopping-bag" size={18} color={c.muted} /></View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.shopName, { color: c.text }]} numberOfLines={1}>{s.Name?.trim()}</Text>
                  <Text style={[styles.shopSub, { color: c.muted }]} numberOfLines={1}>
                    {s.Address?.[0]?.LocationName || 'No location'}{s.Services ? ` · ${s.Services}` : ''}
                  </Text>
                  {s.ShopCategory?.length > 0 && (
                    <View style={styles.tags}>
                      {s.ShopCategory.map((t, i) => (
                        <View key={`${t}-${i}`} style={[styles.tag, { backgroundColor: accent + '1A' }]}><Text style={[styles.tagText, { color: accent }]}>{t}</Text></View>
                      ))}
                    </View>
                  )}
                </View>
                <View style={[styles.count, { backgroundColor: c.chip }]}><Text style={[styles.countText, { color: c.text }]}>{s.ProductCount ?? 0} products</Text></View>
              </View>
            ))}
          </Card>

          <Card c={c} title="Recent service records" subtitle="Latest work you added">
            {recent.length === 0 ? <EmptyState icon="tool" text="No service records yet." c={c} /> : recent.map(r => {
              const tone = STATUS_COLORS[r.Status] || c.muted;
              return (
                <View key={r._id} style={[styles.shopRow, { borderBottomColor: c.divider }]}>
                  {r.Car?.Image ? <Image source={{ uri: r.Car.Image }} style={styles.shopImg} /> : (
                    <View style={[styles.shopImg, styles.center, { backgroundColor: c.chip }]}><Feather name="tool" size={18} color={c.muted} /></View>
                  )}
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.shopName, { color: c.text, flexShrink: 1 }]} numberOfLines={1}>{r.Title}</Text>
                      <View style={[styles.status, { backgroundColor: tone + '22' }]}><Text style={[styles.statusText, { color: tone }]}>{r.Status}</Text></View>
                    </View>
                    <Text style={[styles.shopSub, { color: c.muted }]} numberOfLines={1}>
                      {carName(r.Car)}{r.Car?.VehicleInfo?.year ? ` · ${r.Car.VehicleInfo.year}` : ''}
                    </Text>
                    <Text style={[styles.shopSub, { color: c.muted }]}>
                      {capitalize(r.WorkType)} · {fmtDate(r.WorkDate)} · <Text style={{ color: c.text, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>{fmtMoney(r.Cost)}</Text>
                      {r.MileageAtWork > 0 ? ` · ${Number(r.MileageAtWork).toLocaleString('en-IN')} km` : ''}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </ScrollView>
      )}
    </SellerScreen>
  );
};

const styles = StyleSheet.create({
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { width: '31.6%', flexGrow: 1, borderRadius: 14, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 9 },
  statIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 17, marginTop: 6, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  statLabel: { fontSize: 10.5, marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.3, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  statSub: { fontSize: 10, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  quickRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  quick: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 16 },
  quickText: { color: '#fff', fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  card: { marginTop: 12, borderRadius: 20, borderWidth: 1, padding: 14 },
  cardTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  cardSub: { fontSize: 12, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  barTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  barLabel: { fontSize: 13.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  shopRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  shopImg: { width: 54, height: 54, borderRadius: 14 },
  center: { alignItems: 'center', justifyContent: 'center' },
  shopName: { fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  shopSub: { fontSize: 12.5, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 5 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9 },
  tagText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  count: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 11.5, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  status: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 10, textTransform: 'uppercase', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default SellerDashboard;
