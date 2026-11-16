import React, { useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Share, Linking, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSellerPalette } from '../../components/SellerScreen';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { ToastMsg } from '../../utils/helperFunctions';
import { carName } from '../../utils/serviceRecords';

// The car's QR (it holds the car id) — a seller scans it to open the vehicle and add service
// records. Same actions as web's Profile/Car/QrCodeModel.jsx: save image, copy ID, share
// (system sheet) and quick share to WhatsApp / Telegram / X / email.
const CarQrModal = ({ car, onClose }) => {
  const { c, accent } = useSellerPalette();
  const qrRef = useRef(null);
  const [busy, setBusy] = useState(null); // 'save' | 'share'

  const id = car?._id ? String(car._id) : '';
  const text = `Scan this QR code to open my vehicle "${carName(car)}" on Tomo`;
  const message = `${text} - ID: ${id}`;

  // QR → PNG file in the cache folder (base64 from the SVG renderer)
  const toFile = () =>
    new Promise((resolve, reject) => {
      if (!qrRef.current?.toDataURL) return reject(new Error('QR not ready'));
      qrRef.current.toDataURL(async b64 => {
        try {
          const path = `${RNFS.CachesDirectoryPath}/qr-${id}.png`;
          await RNFS.writeFile(path, b64, 'base64');
          resolve(path);
        } catch (e) {
          reject(e);
        }
      });
    });

  const save = async () => {
    if (busy) return;
    try {
      setBusy('save');
      const path = await toFile();
      await CameraRoll.saveAsset(path, { type: 'photo' });
      ToastMsg('QR saved to gallery');
    } catch (e) {
      ToastMsg('Could not save — check gallery permission');
    } finally {
      setBusy(null);
    }
  };

  const copy = () => {
    Clipboard.setString(id);
    ToastMsg('ID copied');
  };

  const share = async () => {
    if (busy) return;
    try {
      setBusy('share');
      // iOS can attach the image; Android's built-in share sheet only takes text
      if (Platform.OS === 'ios') {
        const path = await toFile();
        await Share.share({ message, url: `file://${path}` });
      } else {
        await Share.share({ message });
      }
    } catch (e) {
      ToastMsg('Could not open share options');
    } finally {
      setBusy(null);
    }
  };

  const enc = encodeURIComponent;
  const open = async (url, fallback) => {
    try {
      await Linking.openURL(url);
    } catch {
      try {
        await Linking.openURL(fallback);
      } catch {
        ToastMsg('App not available');
      }
    }
  };
  const platforms = [
    { name: 'WhatsApp', icon: 'whatsapp', color: '#25D366', go: () => open(`whatsapp://send?text=${enc(message)}`, `https://wa.me/?text=${enc(message)}`) },
    { name: 'Telegram', icon: 'telegram-plane', color: '#229ED9', go: () => open(`tg://msg?text=${enc(message)}`, `https://t.me/share/url?url=${enc(id)}&text=${enc(text)}`) },
    { name: 'X', icon: 'twitter', color: '#1DA1F2', go: () => open(`https://twitter.com/intent/tweet?text=${enc(message)}`, `https://twitter.com/intent/tweet?text=${enc(message)}`) },
    { name: 'Email', icon: 'envelope', color: '#EA4335', go: () => open(`mailto:?subject=${enc('Vehicle QR code')}&body=${enc(message)}`, `mailto:?body=${enc(message)}`) },
  ];

  const Action = ({ icon, label, onPress, loading }) => (
    <TouchableOpacity style={[styles.action, { backgroundColor: accent + '14', borderColor: accent + '55' }]} onPress={onPress} activeOpacity={0.8}>
      {loading ? <ActivityIndicator size="small" color={accent} /> : <Feather name={icon} size={17} color={accent} />}
      <Text style={[styles.actionText, { color: accent }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={!!car} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <TouchableOpacity onPress={onClose} style={[styles.close, { backgroundColor: c.chip }]}>
            <Feather name="x" size={18} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: c.text }]}>Vehicle QR code</Text>
          <Text style={[styles.sub, { color: c.muted }]} numberOfLines={1}>{carName(car)}</Text>

          <View style={styles.qrBox}>
            {!!id && <QRCode value={id} size={190} quietZone={10} getRef={r => { qrRef.current = r; }} />}
          </View>

          <Text style={[styles.note, { color: c.muted }]}>Show this to a seller so they can scan it and add service records to your vehicle.</Text>
          <Text style={[styles.id, { color: accent }]} selectable>{id}</Text>

          <View style={styles.actions}>
            <Action icon="download" label="Save" onPress={save} loading={busy === 'save'} />
            <Action icon="copy" label="Copy ID" onPress={copy} />
            <Action icon="share-2" label="Share" onPress={share} loading={busy === 'share'} />
          </View>

          <Text style={[styles.shareLabel, { color: c.muted }]}>Share via</Text>
          <View style={styles.platforms}>
            {platforms.map(p => (
              <TouchableOpacity key={p.name} onPress={p.go} activeOpacity={0.8} style={styles.platform}>
                <View style={[styles.platformIcon, { backgroundColor: p.color }]}>
                  <FontAwesome5 name={p.icon} size={18} color="#fff" brand={p.name !== 'Email'} solid={p.name === 'Email'} />
                </View>
                <Text style={[styles.platformText, { color: c.muted }]}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.65)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  card: { width: '100%', maxWidth: 380, borderRadius: 24, borderWidth: 1, padding: 20, alignItems: 'center' },
  close: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  title: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  sub: { fontSize: 13.5, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  qrBox: { backgroundColor: '#fff', padding: 8, borderRadius: 16, marginVertical: 14 },
  note: { fontSize: 12.5, textAlign: 'center', lineHeight: 18, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  id: { fontSize: 11, marginTop: 8, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  actions: { flexDirection: 'row', gap: 8, marginTop: 16, alignSelf: 'stretch' },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  actionText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  shareLabel: { fontSize: 11.5, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  platforms: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', marginTop: 10, paddingHorizontal: 6 },
  platform: { alignItems: 'center', gap: 5 },
  platformIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  platformText: { fontSize: 11, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
});

export default CarQrModal;
