import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MusicPickerModal from './MusicPickerModal';
import MusicAudio from './MusicAudio';
import { FONTS_FAMILY } from '../assets/Fonts';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// "Add music" row for the create-post / create-story screens (web: the Music button + chip in
// AddPost.jsx / AddStoryModel.jsx).  value = { music, start, duration } | null
const MusicSelector = ({ value, onChange, style }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const m = value?.music;

  return (
    <View style={style}>
      {!m ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpen(true)}
          style={[styles.add, { borderColor: accent, backgroundColor: accent + '12' }]}>
          <Feather name="music" size={18} color={accent} />
          <Text style={[styles.addText, { color: accent }]}>Add music</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <MusicAudio
            uri={m.File}
            start={value.start}
            end={value.start + value.duration}
            playing={playing}
            loop
            seekOnPlay
            onError={() => setPlaying(false)}
          />
          <TouchableOpacity onPress={() => setPlaying(p => !p)} style={styles.coverWrap}>
            {m.Image ? <Image source={{ uri: m.Image }} style={styles.cover} /> : <View style={[styles.cover, { backgroundColor: c.chip }]} />}
            <View style={styles.overlay}>
              <Feather name={playing ? 'pause' : 'play'} size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setPlaying(false); setOpen(true); }} activeOpacity={0.8}>
            <Text numberOfLines={1} style={[styles.name, { color: c.text }]}>♪ {m.Name}{m.ArtistName ? ` · ${m.ArtistName}` : ''}</Text>
            <Text style={[styles.range, { color: c.muted }]}>{value.start}s – {value.start + value.duration}s · tap to change</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setPlaying(false); onChange(null); }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.remove, { backgroundColor: c.chip }]}>
            <Feather name="x" size={16} color={c.muted} />
          </TouchableOpacity>
        </View>
      )}

      <MusicPickerModal
        visible={open}
        onClose={() => setOpen(false)}
        initial={value}
        onSelect={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  add: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed' },
  addText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18, borderWidth: 1 },
  coverWrap: { width: 48, height: 48 },
  cover: { width: 48, height: 48, borderRadius: 12 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  range: { fontSize: 11, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  remove: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});

export default MusicSelector;
