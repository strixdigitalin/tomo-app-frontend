import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// The one button used by every form. variants: primary (filled theme colour),
// outline, danger. Shows a spinner while `loading` and ignores taps while busy/disabled.
const FormButton = ({ label, onPress, loading = false, disabled = false, variant = 'primary', icon, style }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const filled = variant !== 'outline';
  const bg = variant === 'danger' ? c.danger : accent;
  const fg = filled ? '#FFFFFF' : accent;
  const inactive = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={inactive ? undefined : onPress}
      disabled={inactive}
      style={[
        styles.btn,
        filled
          ? { backgroundColor: bg, shadowColor: bg }
          : { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: accent },
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {!!icon && <Feather name={icon} size={18} color={fg} style={{ marginRight: 8 }} />}
          <Text style={[styles.text, { color: fg }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
    alignSelf: 'stretch', elevation: 3, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8,
  },
  text: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
});

export default FormButton;
