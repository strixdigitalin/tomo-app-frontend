import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import SellerScreen, { EmptyState, ErrorState, useSellerPalette } from '../../components/SellerScreen';
import ServiceRecordCard from '../../components/ServiceRecordCard';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { apiGet, apiPut } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import { carName } from '../../utils/serviceRecords';

// Owner's view of the work shops added to their car; pending records can be approved
// (spec changes / mods get applied to the car) or rejected with a reason
// (web: Profile/Car/CurrentCarDetailModel.jsx "Service History" tab).
const CarServiceHistory = ({ navigation, route }) => {
  const car = route?.params?.car;
  const { c, accent } = useSellerPalette();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (silent = false) => {
    if (!car?._id) return;
    try {
      if (!silent) setLoading(true);
      setError('');
      const res = await apiGet(`${urls.carServiceHistory}/${car._id}`);
      setRecords(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load service history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [car?._id]);

  useEffect(() => { load(); }, [load]);

  const pending = useMemo(() => records.filter(r => r.Status === 'pending').length, [records]);

  const approve = async id => {
    if (busyId) return;
    try {
      setBusyId(id);
      const res = await apiPut(`${urls.approveServiceRecord}/${id}`, {});
      ToastMsg(res?.message || 'Record approved');
      setRecords(prev => prev.map(r => (r._id === id ? { ...r, Status: 'approved', ApprovedAt: new Date().toISOString(), RejectionReason: '' } : r)));
    } catch (e) {
      ToastMsg(e?.message || 'Failed to approve record');
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id, reason) => {
    if (busyId) return;
    try {
      setBusyId(id);
      const res = await apiPut(`${urls.rejectServiceRecord}/${id}`, { RejectionReason: reason });
      ToastMsg(res?.message || 'Record rejected');
      setRecords(prev => prev.map(r => (r._id === id ? { ...r, Status: 'rejected', RejectionReason: reason } : r)));
    } catch (e) {
      ToastMsg(e?.message || 'Failed to reject record');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SellerScreen
      title="Service History"
      subtitle={pending ? `${carName(car)} · ${pending} waiting for approval` : carName(car)}
      onBack={() => navigation.goBack()}>
      {loading && records.length === 0 ? (
        <View style={{ paddingTop: 80 }}><ActivityIndicator color={accent} size="large" /></View>
      ) : error && records.length === 0 ? (
        <ErrorState message={error} onRetry={() => load()} c={c} accent={accent} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={r => r._id}
          renderItem={({ item }) => (
            <ServiceRecordCard record={item} onApprove={approve} onReject={reject} busy={busyId === item._id} />
          )}
          ListHeaderComponent={<View style={{ height: 12 }} />}
          ListEmptyComponent={<EmptyState icon="tool" c={c} text="No service history yet." />}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor={accent} colors={[accent]} />}
        />
      )}
    </SellerScreen>
  );
};

export default CarServiceHistory;
