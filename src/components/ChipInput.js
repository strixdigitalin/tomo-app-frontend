import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Multi-value text input (web's ChipInput): type a value and press return / "+", it becomes a
// removable chip. Used for car modifications, hashtags etc.
const ChipInput = ({ label, items = [], onChange, placeholder = 'Type and press add', maxItems = 20 }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  const [text, setText] = useState('');

  const add = () => {
    // allow "a, b, c" in one go
    const parts = text.split(',').map(s => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...items];
    parts.forEach(p => {
      if (next.length < maxItems && !next.some(i => i.toLowerCase() === p.toLowerCase())) next.push(p);
    });
    onChange(next);
    setText('');
  };

  return (
    <View style={styles.wrap}>
      {!!label && <Text style={[styles.label, { color: c.muted }]}>{label}</Text>}
      {items.length > 0 && (
        <View style={styles.chips}>
          {items.map(item => (
            <View key={item} style={[styles.chip, { backgroundColor: accent + '1A', borderColor: accent + '55' }]}>
              <Text style={[styles.chipText, { color: accent }]} numberOfLines={1}>{item}</Text>
              <TouchableOpacity onPress={() => onChange(items.filter(i => i !== item))} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Feather name="x" size={14} color={accent} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <View style={[styles.box, { backgroundColor: c.chip, borderColor: c.divider }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={c.muted}
          onSubmitEditing={add}
          returnKeyType="done"
          blurOnSubmit={false}
          style={[styles.input, { color: c.text }]}
        />
        <TouchableOpacity onPress={add} style={[styles.addBtn, { backgroundColor: accent, opacity: text.trim() ? 1 : 0.4 }]} disabled={!text.trim()}>
          <Feather name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14, alignSelf: 'stretch' },
  label: { fontSize: 13, marginBottom: 6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1, maxWidth: '100%' },
  chipText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, flexShrink: 1 },
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingLeft: 14, paddingRight: 6, minHeight: 48 },
  input: { flex: 1, fontSize: 15, paddingVertical: 10, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  addBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});

export default ChipInput;
