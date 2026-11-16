import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import SellerScreen, { EmptyState, ErrorState, useSellerPalette } from '../../components/SellerScreen';
import ServiceRecordCard from '../../components/ServiceRecordCard';
import ConfirmModal from '../../components/ConfirmModal';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiGet, apiDelete } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import { listFrom } from '../../utils/serviceRecords';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

// Records the seller added to customer vehicles (web: Seller/Vehicle/MyServiceRecords.jsx)
const SellerServiceRecords = ({ navigation }) => {
  const { c, accent } = useSellerPalette();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError('');
      const res = await apiGet(urls.sellerMyServiceRecords);
      setRecords(listFrom(res));
    } catch (e) {
      setError(e?.message || 'Failed to load service records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(records.length > 0); }, [load])); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => {
    const k = { all: records.length, pending: 0, approved: 0, rejected: 0 };
    records.forEach(r => { if (k[r.Status] !== undefined) k[r.Status] += 1; });
    return k;
  }, [records]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter(r => {
      if (tab !== 'all' && r.Status !== tab) return false;
      if (!q) return true;
      const i = r.Car?.VehicleInfo || {};
      return [r.Title, r.WorkType, r.Description, i.vehicleName, i.make, i.model]
        .filter(Boolean).some(s => String(s).toLowerCase().includes(q));
    });
  }, [records, tab, search]);

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    try {
      setDeleting(true);
      const res = await apiDelete(`${urls.sellerDeleteServiceRecord}/${deleteTarget._id}`);
      ToastMsg(res?.message || 'Record deleted');
      setDeleteTarget(null);
      load(true);
    } catch (e) {
      ToastMsg(e?.message || 'Failed to delete record');
    } finally {
      setDeleting(false);
    }
  };

  const header = (
    <View style={{ padding: 12, paddingBottom: 4 }}>
      <View style={[styles.search, { backgroundColor: c.card, borderColor: c.border }]}>
        <Feather name="search" size={16} color={c.muted} />
        <TextInput
          value={search} onChangeText={setSearch} placeholder="Search by title, work type or vehicle"
          placeholderTextColor={c.muted} style={[styles.input, { color: c.text }]}
        />
        {!!search && <TouchableOpacity onPress={() => setSearch('')}><Feather name="x" size={16} color={c.muted} /></TouchableOpacity>}
      </View>
      <View style={styles.tabs}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <TouchableOpacity key={t.key} onPress={() => setTab(t.key)} activeOpacity={0.85}
              style={[styles.tab, { backgroundColor: active ? accent : c.card, borderColor: active ? accent : c.border }]}>
              <Text style={[styles.tabText, { color: active ? '#fff' : c.text }]}>{t.label} ({counts[t.key]})</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SellerScreen title="Service Records" subtitle="Work you added to customer vehicles" onBack={() => navigation.goBack()}>
      {loading && records.length === 0 ? (
        <View style={{ paddingTop: 80 }}><ActivityIndicator color={accent} size="large" /></View>
      ) : error && records.length === 0 ? (
        <ErrorState message={error} onRetry={() => load()} c={c} accent={accent} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={r => r._id}
          renderItem={({ item }) => (
            <ServiceRecordCard
              record={item} showCar
              onEdit={r => navigation.navigate('ServiceRecordForm', { record: r })}
              onDelete={setDeleteTarget}
            />
          )}
          ListHeaderComponent={header}
          ListEmptyComponent={<EmptyState icon="tool" c={c} text={records.length === 0 ? 'No service records yet. Scan a vehicle to add one.' : 'No records match your filters.'} />}
          contentContainerStyle={{ paddingBottom: 130 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          windowSize={7}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor={accent} colors={[accent]} />}
        />
      )}

      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete record?"
        message={`"${deleteTarget?.Title || ''}" will be permanently deleted. This cannot be undone.`}
        icon="trash-2"
        confirmLabel="Delete"
        loading={deleting}
      />
    </SellerScreen>
  );
};

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, height: 46 },
  input: { flex: 1, fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Regular, paddingVertical: 0 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 8 },
  tab: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 16, borderWidth: 1 },
  tabText: { fontSize: 12.5, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
});

export default SellerServiceRecords;
