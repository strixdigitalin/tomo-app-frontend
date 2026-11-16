import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Animated, Easing, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';
import { fmtMB } from '../utils/uploadWithProgress';

// Blocking progress card for big uploads (story / post video).
//   <UploadProgressModal {...useUpload().state} title="Uploading story" hint="..." onCancel={cancel} />
// Shows a percentage bar while bytes are sent, then "Processing…" while the server finishes
// (saving the video / cutting it into stories) — that part can take a while and has no percentage.
const UploadProgressModal = ({ visible, percent = 0, loaded = 0, total = 0, phase = 'uploading', title = 'Uploading', processingText = 'Processing on server…', hint, onCancel }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const width = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(width, { toValue: percent, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [percent, width]);
  useEffect(() => { if (visible && percent === 0) width.setValue(0); }, [visible, percent, width]);

  const processing = phase === 'processing';

  return (
    <Modal visible={!!visible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: accent + '1A' }]}>
            {processing ? <ActivityIndicator color={accent} /> : <Feather name="upload-cloud" size={24} color={accent} />}
          </View>
          <Text style={[styles.title, { color: c.text }]}>{processing ? processingText : title}</Text>

          <View style={[styles.track, { backgroundColor: c.chip }]}>
            {processing ? (
              <View style={[styles.fill, { width: '100%', backgroundColor: accent }]} />
            ) : (
              <Animated.View style={[styles.fill, { backgroundColor: accent, width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' }) }]} />
            )}
          </View>

          <View style={styles.row}>
            <Text style={[styles.percent, { color: accent }]}>{processing ? '100%' : `${percent}%`}</Text>
            {total > 0 && <Text style={[styles.size, { color: c.muted }]}>{fmtMB(loaded)} of {fmtMB(total)}</Text>}
          </View>

          <Text style={[styles.hint, { color: c.muted }]}>
            {processing ? 'Upload complete. Please keep the app open — this can take a moment for long videos.' : hint || 'Please keep the app open until the upload finishes.'}
          </Text>

          {!processing && !!onCancel && (
            <TouchableOpacity onPress={onCancel} style={[styles.cancel, { borderColor: c.divider }]} activeOpacity={0.8}>
              <Text style={[styles.cancelText, { color: c.danger }]}>Cancel upload</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.72)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 360, borderRadius: 24, borderWidth: 1, padding: 22, alignItems: 'center' },
  iconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 17, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  track: { alignSelf: 'stretch', height: 10, borderRadius: 5, overflow: 'hidden', marginTop: 18 },
  fill: { height: '100%', borderRadius: 5 },
  row: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  percent: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  size: { fontSize: 12.5, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  hint: { fontSize: 12.5, lineHeight: 18, textAlign: 'center', marginTop: 12, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  cancel: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 9, borderRadius: 14, borderWidth: 1 },
  cancelText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default UploadProgressModal;
