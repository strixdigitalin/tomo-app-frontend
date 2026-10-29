import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Labelled on/off row used by every form toggle (primary car, paid group, channel, ...)
const FormSwitch = ({ label, hint, value, onChange }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  return (
    <View style={[styles.row, { backgroundColor: c.chip }]}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={[styles.label, { color: c.text }]}>{label}</Text>
        {!!hint && <Text style={[styles.hint, { color: c.muted }]}>{hint}</Text>}
      </View>
      <Switch value={!!value} onValueChange={onChange} trackColor={{ false: c.divider, true: accent }} thumbColor="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 14, alignSelf: 'stretch' },
  label: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  hint: { fontSize: 12, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default FormSwitch;
