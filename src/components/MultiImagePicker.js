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

// Several images: `existing` are already-uploaded URLs (edit mode), `images` are newly picked files.
const MultiImagePicker = ({ label, required, existing = [], images = [], onChangeExisting, onChangeImages, error, max = 10 }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  const total = existing.length + images.length;

  const pick = () => {
    const remaining = max - total;
    if (remaining <= 0) return ToastMsg(`You can add up to ${max} images`);
    launchImageLibrary({ mediaType: 'photo', selectionLimit: remaining, quality: 0.9 }, response => {
      if (response?.didCancel) return;
      if (response?.errorMessage) return ToastMsg('Error picking image');
      const picked = (response?.assets || [])
        .filter(a => a?.uri)
        .filter(a => {
          if (a.fileSize && a.fileSize > MEDIA_RULES.postImageMaxBytes) {
            ToastMsg(`${a.fileName || 'Image'} is too large (max ${MEDIA_RULES.postImageMaxBytes / 1024 / 1024} MB)`);
            return false;
          }
          return true;
        })
        .map(a => ({ uri: a.uri, type: a.type, name: a.fileName || `image_${Date.now()}.jpg` }));
      if (picked.length) onChangeImages([...images, ...picked]);
    });
  };

  const Thumb = ({ uri, onRemove }) => (
    <View style={styles.thumbWrap}>
      <Image source={{ uri }} style={styles.thumb} />
      <TouchableOpacity style={styles.remove} onPress={onRemove} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <Feather name="x" size={12} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrap}>
      {!!label && (
        <Text style={[styles.label, { color: c.muted }]}>
          {label}{required ? <Text style={{ color: c.danger }}> *</Text> : null}
          <Text style={{ color: c.muted }}>  ({total}/{max})</Text>
        </Text>
      )}
      <View style={styles.grid}>
        {existing.map((uri, i) => (
          <Thumb key={`e-${uri}-${i}`} uri={uri} onRemove={() => onChangeExisting(existing.filter((_, idx) => idx !== i))} />
        ))}
        {images.map((img, i) => (
          <Thumb key={`n-${img.uri}-${i}`} uri={img.uri} onRemove={() => onChangeImages(images.filter((_, idx) => idx !== i))} />
        ))}
        {total < max && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pick}
            style={[styles.add, { backgroundColor: c.chip, borderColor: error ? c.danger : accent + '88' }]}>
            <Feather name="plus" size={22} color={accent} />
            <Text style={[styles.addText, { color: c.muted }]}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14, alignSelf: 'stretch' },
  label: { fontSize: 13, marginBottom: 8, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumbWrap: { width: 84, height: 84 },
  thumb: { width: 84, height: 84, borderRadius: 14 },
  remove: { position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  add: { width: 84, height: 84, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addText: { fontSize: 11, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  error: { fontSize: 12, marginTop: 6, marginLeft: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default MultiImagePicker;
