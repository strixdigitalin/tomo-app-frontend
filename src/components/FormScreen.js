import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Page shell for every add / edit form: tinted background, header (back + title),
// keyboard-aware scrolling and a fixed footer for the submit button.
export const FormScreen = ({ title, subtitle, onBack, children, footer, scrollRef }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: c.screen }]} behavior="padding">
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={onBack} style={[styles.back, { backgroundColor: c.chip }]} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={20} color={c.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{title}</Text>
          {!!subtitle && <Text style={[styles.subtitle, { color: c.muted }]} numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 14, paddingBottom: footer ? 20 : insets.bottom + 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

      {!!footer && (
        <View style={[styles.footer, { backgroundColor: c.card, borderTopColor: c.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

// Titled card that groups related fields
export const FormSection = ({ title, hint, children }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  return (
    <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border, shadowColor: accent }]}>
      {!!title && <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>}
      {!!hint && <Text style={[styles.sectionHint, { color: c.muted }]}>{hint}</Text>}
      <View style={{ marginTop: title ? 12 : 0 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  back: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 19, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  subtitle: { fontSize: 12, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  section: {
    borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 14,
    elevation: 2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  sectionHint: { fontSize: 12, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default FormScreen;
