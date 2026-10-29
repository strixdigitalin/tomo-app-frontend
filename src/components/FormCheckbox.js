import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Checkbox row (e.g. "I agree to Terms & Privacy"). `children` is the label content,
// so parts of it can be tappable links.
const FormCheckbox = ({ checked, onChange, error, children }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  return (
    <View style={styles.wrap}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => onChange(!checked)} style={styles.row}>
        <View style={[styles.box, { borderColor: error ? c.danger : checked ? accent : c.muted, backgroundColor: checked ? accent : 'transparent' }]}>
          {checked && <Feather name="check" size={14} color="#fff" />}
        </View>
        <Text style={[styles.label, { color: c.text }]}>{children}</Text>
      </TouchableOpacity>
      {!!error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14, alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 1 },
  label: { flex: 1, fontSize: 14, lineHeight: 20, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  error: { fontSize: 12, marginTop: 4, marginLeft: 32, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default FormCheckbox;
