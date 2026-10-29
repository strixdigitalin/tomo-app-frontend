import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';
import { ToastMsg } from '../utils/helperFunctions';
import { MEDIA_RULES } from '../utils/uploadHelpers';

// Single-image picker with preview / change / remove and an inline error.
//   image: { uri, type?, name?, isExisting? } | null
const ImageUploadBox = ({ label, required, image, onChange, error, hint = 'Tap to upload (JPG, PNG, WebP)', height = 170 }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const pick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.9, selectionLimit: 1 }, response => {
      if (response?.didCancel) return;
      if (response?.errorMessage) return ToastMsg('Error picking image');
      const a = response?.assets?.[0];
      if (!a?.uri) return;
      if (a.fileSize && a.fileSize > MEDIA_RULES.postImageMaxBytes) {
        return ToastMsg(`File too large. Max ${MEDIA_RULES.postImageMaxBytes / 1024 / 1024} MB`);
      }
      onChange({ uri: a.uri, type: a.type, name: a.fileName || `image_${Date.now()}.jpg`, isExisting: false });
    });
  };

  return (
    <View style={styles.wrap}>
      {!!label && (
        <Text style={[styles.label, { color: c.muted }]}>
          {label}{required ? <Text style={{ color: c.danger }}> *</Text> : null}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={pick}
        style={[styles.box, { height, backgroundColor: c.chip, borderColor: error ? c.danger : accent + '88' }]}>
        {image?.uri ? (
          <>
            <Image source={{ uri: image.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <View style={styles.actions}>
              <View style={[styles.pill, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                <Feather name="camera" size={13} color="#fff" />
                <Text style={styles.pillText}>Change</Text>
              </View>
              <TouchableOpacity onPress={() => onChange(null)} style={[styles.pill, { backgroundColor: 'rgba(239,68,68,0.9)' }]}>
                <Feather name="trash-2" size={13} color="#fff" />
                <Text style={styles.pillText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <View style={[styles.iconWrap, { backgroundColor: accent + '1A' }]}>
              <Feather name="upload-cloud" size={24} color={accent} />
            </View>
            <Text style={[styles.hint, { color: c.muted }]}>{hint}</Text>
          </View>
        )}
      </TouchableOpacity>
      {!!error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14, alignSelf: 'stretch' },
  label: { fontSize: 13, marginBottom: 6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  box: { borderRadius: 18, borderWidth: 1.5, borderStyle: 'dashed', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', gap: 8 },
  iconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  actions: { position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  pillText: { color: '#fff', fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  error: { fontSize: 12, marginTop: 5, marginLeft: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default ImageUploadBox;
