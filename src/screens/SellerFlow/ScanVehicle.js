import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Linking,
  PermissionsAndroid, Platform, StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SellerScreen, { useSellerPalette } from '../../components/SellerScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { launchImageLibrary } from 'react-native-image-picker';
import { decodeQrFromImage } from '../../utils/decodeQrImage';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';
import { extractCarId, fmtMoney } from '../../utils/serviceRecords';

// Loaded defensively: on a build made before react-native-camera-kit was added the native
// module is missing, and a plain import would crash the screen. Manual ID entry keeps working.
let CameraKit = null;
try {
  CameraKit = require('react-native-camera-kit');
} catch (e) {
  CameraKit = null;
}
const Camera = CameraKit?.Camera;
const CameraType = CameraKit?.CameraType;

const Section = ({ title, children, c }) => (
  <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
    <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
    {children}
  </View>
);

const Row = ({ label, value, suffix = '', c }) =>
  value === undefined || value === null || value === '' ? null : (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: c.muted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: c.text }]}>{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}</Text>
    </View>
  );

const Chips = ({ label, items, accent }) =>
  items?.length ? (
    <View style={{ marginTop: 6 }}>
      <Text style={styles.chipLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {items.map((it, i) => (
          <View key={`${it}-${i}`} style={[styles.chip, { backgroundColor: accent + '1A' }]}>
            <Text style={[styles.chipText, { color: accent }]}>{it}</Text>
          </View>
        ))}
      </View>
    </View>
  ) : null;

const Stars = ({ value = 0 }) => {
  const filled = Math.round(value);
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => <Feather key={n} name="star" size={14} color={n <= filled ? '#FBBF24' : '#CBD5E1'} />)}
    </View>
  );
};

// Pick a photo of a QR code and read the vehicle id out of it (web: "Upload QR image").
// Calls onId(id) on success; returns false when nothing usable was found.
const pickQrImage = async onId => {
  const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
  const uri = res?.assets?.[0]?.uri;
  if (res?.didCancel || !uri) return;
  try {
    const text = await decodeQrFromImage(uri);
    if (!text) return ToastMsg('No QR code found in this image');
    const id = extractCarId(text);
    if (!id) return ToastMsg('This QR code does not contain a vehicle ID');
    onId(id);
  } catch (e) {
    ToastMsg('Could not read this image');
  }
};

// QR scanner sheet. Android needs the CAMERA runtime permission; iOS asks by itself.
const ScanModal = ({ visible, onClose, onResult, c, accent }) => {
  const [perm, setPerm] = useState('checking'); // checking | granted | denied | blocked
  const handled = useRef(false);

  const ask = useCallback(async () => {
    setPerm('checking');
    if (Platform.OS !== 'android') return setPerm('granted');
    try {
      const r = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      setPerm(r === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : r === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? 'blocked' : 'denied');
    } catch {
      setPerm('denied');
    }
  }, []);

  useEffect(() => {
    if (visible) { handled.current = false; ask(); }
  }, [visible, ask]);

  const onRead = e => {
    if (handled.current) return;
    const id = extractCarId(e?.nativeEvent?.codeStringValue);
    if (!id) return ToastMsg('This QR code does not contain a vehicle ID');
    handled.current = true;
    onResult(id);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.scanWrap}>
        {!Camera ? (
          <View style={styles.permBox}>
            <Feather name="camera-off" size={36} color="#fff" />
            <Text style={styles.permText}>The QR scanner is not available in this build yet. Please rebuild / update the app, or enter the vehicle ID manually.</Text>
          </View>
        ) : perm === 'granted' ? (
          <Camera
            style={StyleSheet.absoluteFill}
            cameraType={CameraType?.Back}
            scanBarcode
            showFrame
            laserColor={accent}
            frameColor="#FFFFFF"
            onReadCode={onRead}
          />
        ) : (
          <View style={styles.permBox}>
            {perm === 'checking' ? <ActivityIndicator color="#fff" /> : (
              <>
                <Feather name="camera-off" size={36} color="#fff" />
                <Text style={styles.permText}>Camera access is needed to scan the vehicle QR code. You can also enter the vehicle ID manually.</Text>
                <TouchableOpacity style={[styles.permBtn, { backgroundColor: accent }]} onPress={perm === 'blocked' ? () => Linking.openSettings() : ask}>
                  <Text style={styles.permBtnText}>{perm === 'blocked' ? 'Open settings' : 'Allow camera'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        <View style={styles.scanTop}>
          <Text style={styles.scanTitle}>Scan QR Code</Text>
          <TouchableOpacity onPress={onClose} style={styles.scanClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="x" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        {perm === 'granted' && <Text style={styles.scanHint}>Point the camera at the vehicle QR code</Text>}
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickQrImage(onResult)} activeOpacity={0.85}>
          <Feather name="image" size={18} color="#fff" />
          <Text style={styles.permBtnText}>Upload QR image</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Scan a customer's vehicle QR (or type the id) and see its details
// (web: Seller/Vehicle/ScanVehicle.jsx → GET api/seller/ScanAUserVehicle/:id)
const ScanVehicle = ({ navigation }) => {
  const { c, accent } = useSellerPalette();
  const [scanOpen, setScanOpen] = useState(false);
  const [manualId, setManualId] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scannedId, setScannedId] = useState('');

  const fetchVehicle = async id => {
    try {
      setLoading(true);
      setError('');
      setVehicle(null);
      setScannedId(id);
      const res = await apiGet(`${urls.sellerScanVehicle}/${id}`);
      if (res?.statusCode === 200 && res?.data) setVehicle(res.data);
      else setError(res?.message || 'Vehicle not found');
    } catch (e) {
      setError(e?.message || 'Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const onScanned = id => { setScanOpen(false); setManualId(id); fetchVehicle(id); };
  const onManual = () => {
    const id = extractCarId(manualId);
    if (!id) return ToastMsg('Enter a valid vehicle ID');
    fetchVehicle(id);
  };
  const reset = () => { setVehicle(null); setError(''); setManualId(''); setScannedId(''); };

  const v = vehicle;
  const info = v?.VehicleInfo || {};
  const power = v?.Power || {};
  const mods = v?.Modifications || {};
  const style = v?.Style || {};
  const status = v?.Status || {};
  const perf = v?.PerformanceStats || {};
  const title = [info.make, info.model].filter(Boolean).join(' ') || info.vehicleName || 'Vehicle';

  return (
    <SellerScreen
      title="Scan Vehicle"
      subtitle="Scan a vehicle QR or enter its ID"
      right={
        <TouchableOpacity onPress={() => navigation.navigate('SellerServiceRecords')} style={[styles.recBtn, { backgroundColor: accent + '1A' }]}>
          <Feather name="clipboard" size={16} color={accent} />
          <Text style={[styles.chipText, { color: accent }]}>Records</Text>
        </TouchableOpacity>
      }>
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 130 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {!v && !loading && (
          <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.hint, { color: c.muted }]}>Scan the vehicle QR code or enter the vehicle ID to see its details.</Text>
            <FormButton label="Scan QR Code" icon="camera" onPress={() => setScanOpen(true)} style={{ marginTop: 14 }} />
            <FormButton label="Upload QR image" icon="image" variant="outline" onPress={() => pickQrImage(onScanned)} style={{ marginTop: 10 }} />
            <View style={styles.or}>
              <View style={[styles.line, { backgroundColor: c.divider }]} />
              <Text style={[styles.orText, { color: c.muted }]}>OR</Text>
              <View style={[styles.line, { backgroundColor: c.divider }]} />
            </View>
            <FormField value={manualId} onChangeText={setManualId} placeholder="Enter vehicle ID" />
            <FormButton label="Search" icon="search" variant="outline" onPress={onManual} />
          </View>
        )}

        {loading && <View style={{ paddingTop: 60 }}><ActivityIndicator color={accent} size="large" /></View>}

        {!loading && !!error && (
          <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border, alignItems: 'center' }]}>
            <Feather name="alert-circle" size={32} color={c.danger} />
            <Text style={[styles.hint, { color: c.muted, textAlign: 'center', marginTop: 8 }]}>{error}</Text>
            {!!scannedId && <Text style={[styles.idText, { color: c.muted }]}>ID: {scannedId}</Text>}
            <FormButton label="Try again" icon="refresh-cw" variant="outline" onPress={reset} style={{ marginTop: 12, alignSelf: 'stretch' }} />
          </View>
        )}

        {!loading && !!v && (
          <View>
            <View style={[styles.hero, { backgroundColor: c.card, borderColor: c.border }]}>
              {!!v.Image && <Image source={{ uri: v.Image }} style={styles.heroImg} />}
              <View style={{ padding: 14 }}>
                <View style={styles.heroTitleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.heroTitle, { color: c.text }]} numberOfLines={2}>{title}{info.year ? ` · ${info.year}` : ''}</Text>
                    {!!info.vehicleName && info.vehicleName !== title && <Text style={[styles.hint, { color: c.muted }]}>{info.vehicleName}</Text>}
                  </View>
                  {!!v.PrimaryCar && (
                    <View style={[styles.chip, { backgroundColor: accent + '1A' }]}><Text style={[styles.chipText, { color: accent }]}>Primary</Text></View>
                  )}
                </View>
                <View style={styles.priceRow}>
                  {v.CurrentPrice > 0 && <Text style={[styles.price, { color: accent }]}>{fmtMoney(v.CurrentPrice)}</Text>}
                  <Stars value={v.avgRating} />
                  <Text style={[styles.hint, { color: c.muted }]}>{Number(v.avgRating || 0).toFixed(1)} ({v.reviewCount ?? 0} reviews)</Text>
                </View>
                <FormButton label="Add service record" icon="plus" style={{ marginTop: 14 }}
                  onPress={() => navigation.navigate('ServiceRecordForm', { carId: v._id })} />
              </View>
            </View>

            <Section title="Vehicle Info" c={c}>
              <Row c={c} label="Name" value={info.vehicleName} />
              <Row c={c} label="Make" value={info.make} />
              <Row c={c} label="Model" value={info.model} />
              <Row c={c} label="Year" value={info.year} />
              <Row c={c} label="Body type" value={info.bodyType} />
            </Section>
            <Section title="Power" c={c}>
              <Row c={c} label="Engine" value={power.engine} />
              <Row c={c} label="Horsepower" value={power.horsepower} suffix=" hp" />
              <Row c={c} label="Torque" value={power.torque} suffix=" Nm" />
              <Row c={c} label="Drivetrain" value={power.drivetrain} />
              <Row c={c} label="Transmission" value={power.transmission} />
            </Section>
            <Section title="Status" c={c}>
              <Row c={c} label="Mileage" value={status.mileage} suffix=" km" />
              <Row c={c} label="Build stage" value={status.buildStage} />
            </Section>
            <Section title="Performance" c={c}>
              <Row c={c} label="0 - 60" value={perf.zeroToSixty} />
              <Row c={c} label="Quarter mile" value={perf.quarterMile} />
            </Section>

            {(mods.performance?.length || mods.suspension?.length || mods.brakes?.length) > 0 && (
              <Section title="Modifications" c={c}>
                <Chips label="Performance" items={mods.performance} accent={accent} />
                <Chips label="Suspension" items={mods.suspension} accent={accent} />
                <Chips label="Brakes" items={mods.brakes} accent={accent} />
              </Section>
            )}
            {!!(style.paintWrap || style.exteriorMods?.length || style.interiorMods?.length) && (
              <Section title="Style" c={c}>
                <Row c={c} label="Paint / Wrap" value={style.paintWrap} />
                <Chips label="Exterior" items={style.exteriorMods} accent={accent} />
                <Chips label="Interior" items={style.interiorMods} accent={accent} />
              </Section>
            )}
            {!!v.OwnerNote && (
              <Section title="Owner's Note" c={c}>
                <Text style={[styles.hint, { color: c.text }]}>{v.OwnerNote}</Text>
              </Section>
            )}

            <FormButton label="Scan another vehicle" icon="refresh-cw" variant="outline" onPress={reset} style={{ marginTop: 14 }} />
          </View>
        )}
      </ScrollView>

      <ScanModal visible={scanOpen} onClose={() => setScanOpen(false)} onResult={onScanned} c={c} accent={accent} />
    </SellerScreen>
  );
};

const styles = StyleSheet.create({
  section: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold, marginBottom: 6 },
  hint: { fontSize: 14, lineHeight: 20, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  idText: { fontSize: 12, marginTop: 6, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  line: { flex: 1, height: 1 },
  orText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 14, paddingVertical: 5 },
  rowLabel: { fontSize: 13.5, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  rowValue: { flex: 1, textAlign: 'right', fontSize: 13.5, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  hero: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  heroImg: { width: '100%', height: 200 },
  heroTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  heroTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  priceRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 8 },
  price: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  recBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  chipText: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  chipLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94A3B8', marginBottom: 5, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scanWrap: { flex: 1, backgroundColor: '#000' },
  scanTop: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 18, paddingBottom: 14, backgroundColor: 'rgba(0,0,0,0.45)' },
  scanTitle: { color: '#fff', fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  scanClose: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  scanHint: { position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  uploadBtn: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 16, paddingBottom: 34, backgroundColor: 'rgba(0,0,0,0.55)' },
  permBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, gap: 14 },
  permText: { color: '#fff', textAlign: 'center', fontSize: 14.5, lineHeight: 21, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  permBtn: { paddingHorizontal: 22, paddingVertical: 11, borderRadius: 14 },
  permBtnText: { color: '#fff', fontSize: 14.5, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default ScanVehicle;
