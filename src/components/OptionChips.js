import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Pick-one (or clear) from a short list, shown as chips — replaces popup dropdowns for
// short lists (drivetrain, transmission, fuel, condition...).
const OptionChips = ({ label, required, options, value, onChange, error, allowClear = true }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  return (
    <View style={styles.wrap}>
      {!!label && (
        <Text style={[styles.label, { color: c.muted }]}>
          {label}{required ? <Text style={{ color: c.danger }}> *</Text> : null}
        </Text>
      )}
      <View style={styles.row}>
        {options.map(opt => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              activeOpacity={0.8}
              onPress={() => onChange(active && allowClear ? '' : opt)}
              style={[styles.chip, { backgroundColor: active ? accent : c.chip, borderColor: active ? accent : error ? c.danger : c.divider }]}>
              <Text style={[styles.text, { color: active ? '#fff' : c.text }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14, alignSelf: 'stretch' },
  label: { fontSize: 13, marginBottom: 8, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, borderWidth: 1.5 },
  text: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  error: { fontSize: 12, marginTop: 5, marginLeft: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default OptionChips;
