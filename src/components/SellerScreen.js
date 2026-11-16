import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Shell for the seller tab screens: tinted bg, title + subtitle, optional right action.
export const useSellerPalette = () => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  return { isDarkMode, accent, c: profilePalette(isDarkMode, accent) };
};

const SellerScreen = ({ title, subtitle, right, onBack, children }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, c } = useSellerPalette();
  return (
    <View style={[styles.screen, { backgroundColor: c.screen }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: c.card, borderBottomColor: c.border }]}>
        {!!onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.back, { backgroundColor: c.chip }]}>
            <Feather name="arrow-left" size={20} color={c.text} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{title}</Text>
          {!!subtitle && <Text style={[styles.sub, { color: c.muted }]} numberOfLines={1}>{subtitle}</Text>}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
};

export const EmptyState = ({ icon = 'inbox', text, c }) => (
  <View style={styles.empty}>
    <Feather name={icon} size={34} color={c.muted} />
    <Text style={[styles.emptyText, { color: c.muted }]}>{text}</Text>
  </View>
);

export const ErrorState = ({ message, onRetry, c, accent }) => (
  <View style={styles.empty}>
    <Feather name="alert-circle" size={34} color={c.danger} />
    <Text style={[styles.emptyText, { color: c.muted }]}>{message}</Text>
    <TouchableOpacity onPress={onRetry} style={[styles.retry, { borderColor: accent }]}>
      <Feather name="refresh-cw" size={14} color={accent} />
      <Text style={{ color: accent, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>Try again</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1 },
  back: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  sub: { fontSize: 13, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  empty: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 30, gap: 10 },
  emptyText: { fontSize: 14, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, marginTop: 6 },
});

export default SellerScreen;
