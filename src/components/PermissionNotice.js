import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FormButton from './FormButton';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Shown when a permission was refused. "Allow access" asks again; if the user picked
// "Don't ask again" the only way back is the system Settings screen, so we offer that instead.
const PermissionNotice = ({ message, blocked, onRetry }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  return (
    <View style={styles.wrap}>
      <View style={[styles.icon, { backgroundColor: accent + '1A' }]}>
        <Feather name="image" size={30} color={accent} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>Gallery access needed</Text>
      <Text style={[styles.msg, { color: c.muted }]}>{message}</Text>
      {blocked && (
        <Text style={[styles.msg, { color: c.muted, marginTop: 6 }]}>
          Permission was turned off. Open Settings → Permissions → Photos and videos, and allow it.
        </Text>
      )}
      <FormButton
        label={blocked ? 'Open Settings' : 'Allow access'}
        icon={blocked ? 'settings' : 'unlock'}
        onPress={() => (blocked ? Linking.openSettings() : onRetry())}
        style={{ marginTop: 20, alignSelf: 'center', paddingHorizontal: 28 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 50 },
  icon: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontSize: 18, textAlign: 'center', fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  msg: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 6, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default PermissionNotice;
