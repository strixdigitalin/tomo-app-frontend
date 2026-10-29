import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

const pad = n => String(n).padStart(2, '0');
export const toDateStr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const toTimeStr = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Date or time input that looks like every other field. Value is kept as a string:
// 'YYYY-MM-DD' for dates, 'HH:mm' (24h) for times — the formats the backend already stores.
const DateTimeField = ({ label, required, mode = 'date', value, onChange, error, placeholder, minimumDate }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  const [open, setOpen] = useState(false);

  const current = (() => {
    if (!value) return new Date();
    if (mode === 'date') return new Date(value);
    const [h, m] = String(value).split(':').map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  })();

  return (
    <View style={styles.wrap}>
      {!!label && (
        <Text style={[styles.label, { color: c.muted }]}>
          {label}{required ? <Text style={{ color: c.danger }}> *</Text> : null}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={[styles.box, { backgroundColor: c.chip, borderColor: error ? c.danger : open ? accent : c.divider }]}>
        <Feather name={mode === 'date' ? 'calendar' : 'clock'} size={17} color={value ? accent : c.muted} style={{ marginRight: 10 }} />
        <Text style={[styles.value, { color: value ? c.text : c.muted }]} numberOfLines={1}>
          {value || placeholder || (mode === 'date' ? 'Select date' : 'Select time')}
        </Text>
      </TouchableOpacity>
      {!!error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}

      {open && (
        <DateTimePicker
          value={current}
          mode={mode}
          is24Hour
          display="default"
          minimumDate={minimumDate}
          onChange={(event, selected) => {
            setOpen(false);
            if (event?.type === 'dismissed' || !selected) return;
            onChange(mode === 'date' ? toDateStr(selected) : toTimeStr(selected));
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14, alignSelf: 'stretch' },
  label: { fontSize: 13, marginBottom: 6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, minHeight: 50 },
  value: { flex: 1, fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  error: { fontSize: 12, marginTop: 5, marginLeft: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default DateTimeField;
