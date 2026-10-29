import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Centered confirmation card for risky actions (log out, delete account...).
//   requireText="DELETE" → the confirm button stays disabled until the user types that word
//   exactly (case-sensitive), as a guard against accidental deletion.
const ConfirmModal = ({
  visible, onClose, onConfirm, title, message, icon = 'alert-triangle',
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', destructive = true, requireText, loading = false,
}) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  const tone = destructive ? c.danger : accent;
  const [typed, setTyped] = useState('');

  useEffect(() => { if (!visible) setTyped(''); }, [visible]);

  const matches = !requireText || typed === requireText;
  const canConfirm = matches && !loading;
  const wrong = !!requireText && typed.length > 0 && !requireText.startsWith(typed);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={loading ? undefined : onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: tone + '55' }]}>
          <View style={[styles.iconWrap, { backgroundColor: tone + '1A' }]}>
            <Feather name={icon} size={28} color={tone} />
          </View>

          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
          {!!message && <Text style={[styles.message, { color: c.muted }]}>{message}</Text>}

          {!!requireText && (
            <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
              <Text style={[styles.hint, { color: c.muted }]}>
                Type <Text style={{ color: tone, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>{requireText}</Text> to confirm
              </Text>
              <TextInput
                value={typed}
                onChangeText={setTyped}
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="off"
                placeholder={requireText}
                placeholderTextColor={c.muted}
                editable={!loading}
                style={[
                  styles.input,
                  {
                    color: c.text,
                    backgroundColor: c.chip,
                    borderColor: wrong ? c.danger : matches && typed ? '#16A34A' : c.divider,
                  },
                ]}
              />
              {wrong && <Text style={[styles.error, { color: c.danger }]}>Doesn't match — type it exactly: {requireText}</Text>}
            </View>
          )}

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.chip }]}
              onPress={onClose}
              disabled={loading}
              activeOpacity={0.8}>
              <Text style={[styles.btnText, { color: c.text }]}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: tone, opacity: canConfirm ? 1 : 0.4 }]}
              onPress={canConfirm ? onConfirm : undefined}
              disabled={!canConfirm}
              activeOpacity={0.85}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.btnText, { color: '#fff' }]}>{confirmLabel}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.65)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, borderRadius: 26, borderWidth: 1, padding: 22, alignItems: 'center' },
  iconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontSize: 20, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  message: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  hint: { fontSize: 13, marginBottom: 8, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  input: { borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, letterSpacing: 2, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  error: { fontSize: 12, marginTop: 6, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  row: { flexDirection: 'row', gap: 12, marginTop: 22, alignSelf: 'stretch' },
  btn: { flex: 1, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default ConfirmModal;
