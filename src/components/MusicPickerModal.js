import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal, View, Text, Image, FlatList, TextInput, TouchableOpacity, ScrollView, PanResponder,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MusicAudio from './MusicAudio';
import FormButton from './FormButton';
import { FONTS_FAMILY } from '../assets/Fonts';
import { apiGet } from '../utils/Apis';
import { ToastMsg } from '../utils/helperFunctions';
import { formatTime } from '../utils/musicStore';
import { THEMES } from '../redux/reducer/theme';
import { profilePalette } from '../screens/UserDetail/profileTheme';

// Song picker for posts and stories — port of web's MusicPickerModal.jsx
//   step 1 "list": search + genre / language filters, tap ▶ to preview a song, tap a row to pick it
//   step 2 "trim": choose which part of the song plays (start + 5/10/15 s, plus the video's own length when adding music to a long video story) over a waveform
//   → onSelect({ music, start, duration })   (music = the track document from the API)
const DURATION_OPTIONS = [5, 10, 15];
const DEFAULT_DURATION = 15;
const BAR_COUNT = 60;
const WAVE_H = 90;

// `extra` = the story video's length, so one song can cover every 15 s story it is split into
const durationOptions = (total, extra = null) => {
  const opts = DURATION_OPTIONS.filter(d => d <= total);
  const e = extra ? Math.min(Math.floor(extra), Math.floor(total)) : null;
  if (e && e >= 1 && !opts.includes(e)) opts.push(e);
  opts.sort((a, b) => a - b);
  return opts.length ? opts : [Math.max(1, Math.floor(total))];
};

const ABS = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

// "All genres ▾" / "All languages ▾" select (web uses <select>): tap → list of options in a sheet
const Dropdown = ({ allLabel, options, value, onChange, c, accent }) => {
  const [open, setOpen] = useState(false);
  const items = ['', ...options];
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={[styles.select, { backgroundColor: c.card, borderColor: value ? accent : c.border }]}>
        <Text numberOfLines={1} style={[styles.selectText, { color: value ? c.text : c.muted }]}>{value || allLabel}</Text>
        <Feather name="chevron-down" size={16} color={c.muted} />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.sheetTitle, { color: c.text }]}>{allLabel.replace('All ', 'Select ').replace(/s$/, '')}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {items.map(o => {
                const active = o === value;
                return (
                  <TouchableOpacity
                    key={o || 'all'}
                    onPress={() => { onChange(o); setOpen(false); }}
                    style={[styles.option, { backgroundColor: active ? accent + '1A' : 'transparent' }]}>
                    <Text style={[styles.optionText, { color: active ? accent : c.text }]}>{o || allLabel}</Text>
                    {active && <Feather name="check" size={18} color={accent} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const MusicPickerModal = ({ visible, onClose, onSelect, initial = null, suggestedDuration = null }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const [step, setStep] = useState('list');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [track, setTrack] = useState(null);
  const [start, setStart] = useState(0);        // shown on the waveform while dragging
  const [audioStart, setAudioStart] = useState(0); // where the clip actually plays from (set on release)
  const [duration, setDuration] = useState(DEFAULT_DURATION);

  const [previewTrack, setPreviewTrack] = useState(null);
  const [playing, setPlaying] = useState(false);

  const [barWidth, setBarWidth] = useState(0);
  const barWidthRef = useRef(0);

  const total = Math.max(1, Math.floor(track?.Duration || 1));
  const totalRef = useRef(total);
  const durationRef = useRef(duration);
  totalRef.current = total;
  durationRef.current = duration;

  // ── open / close ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      setPlaying(false);
      setPreviewTrack(null);
      setStep('list');
      setTrack(null);
      setSearch('');
      setDebounced('');
      setGenre('');
      setLanguage('');
      return;
    }
    if (initial?.music) {
      setTrack(initial.music);
      setStart(initial.start || 0);
      setAudioStart(initial.start || 0);
      setDuration(initial.duration || DEFAULT_DURATION);
      setStep('trim');
      setPlaying(true);
    } else {
      setStep('list');
    }
  }, [visible]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── load songs ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || step !== 'list') return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const params = [];
        if (debounced) params.push(`search=${encodeURIComponent(debounced)}`);
        if (genre) params.push(`Genre=${encodeURIComponent(genre)}`);
        if (language) params.push(`Language=${encodeURIComponent(language)}`);
        const res = await apiGet(`/api/admin/GetPublicMusic${params.length ? `?${params.join('&')}` : ''}`);
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
        setTracks(list);
        setGenres(p => Array.from(new Set([...p, ...list.map(m => m.Genre).filter(Boolean)])));
        setLanguages(p => Array.from(new Set([...p, ...list.map(m => m.Language).filter(Boolean)])));
      } catch (e) {
        if (!cancelled) ToastMsg('Failed to load music');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [visible, step, debounced, genre, language]);

  // ── list preview ───────────────────────────────────────────────────────────
  const togglePreview = useCallback(t => {
    if (previewTrack?._id === t._id && playing) {
      setPlaying(false);
    } else {
      setPreviewTrack(t);
      setPlaying(true);
    }
  }, [previewTrack, playing]);

  // ── trim step ──────────────────────────────────────────────────────────────
  const openTrim = t => {
    const wanted = suggestedDuration || DEFAULT_DURATION;
    const d = Math.min(wanted, Math.max(1, Math.floor(t.Duration || wanted)));
    setPreviewTrack(null);
    setTrack(t);
    setStart(0);
    setAudioStart(0);
    setDuration(d);
    setStep('trim');
    setPlaying(true);
  };

  const backToList = () => {
    setPlaying(false);
    setStep('list');
  };

  const bars = useMemo(() => {
    if (!track?._id) return [];
    let seed = 0;
    for (const ch of String(track._id)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    return Array.from({ length: BAR_COUNT }, () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return 25 + (seed % 75);
    });
  }, [track]);

  const calcStart = x => {
    const w = barWidthRef.current || 1;
    const ratio = Math.min(1, Math.max(0, x / w));
    const s = Math.round(ratio * totalRef.current - durationRef.current / 2);
    return Math.min(Math.max(0, s), Math.max(0, totalRef.current - durationRef.current));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e => setStart(calcStart(e.nativeEvent.locationX)),
      onPanResponderMove: e => setStart(calcStart(e.nativeEvent.locationX)),
      onPanResponderRelease: e => {
        const s = calcStart(e.nativeEvent.locationX);
        setStart(s);
        setAudioStart(s);
        setPlaying(true);
      },
    }),
  ).current;

  const changeDuration = d => {
    const s = Math.min(start, Math.max(0, total - d));
    setDuration(d);
    setStart(s);
    setAudioStart(s);
    setPlaying(true);
  };

  const handleDone = () => {
    setPlaying(false);
    onSelect({ music: track, start, duration });
    onClose();
  };

  const handleClose = () => {
    setPlaying(false);
    onClose();
  };

  // what the hidden player should play right now
  const inTrim = step === 'trim' && !!track;
  const audioUri = inTrim ? track?.File : previewTrack?.File;
  const clipStart = inTrim ? audioStart : 0;
  const clipEnd = inTrim ? audioStart + duration : 30; // list preview plays the first 30 s (web: playClip(t, 0, 30))

  const winLeft = (start / total) * 100;
  const winWidth = Math.min(100 - winLeft, (duration / total) * 100);

  // ── render ─────────────────────────────────────────────────────────────────
  const renderTrack = ({ item: t }) => {
    const isPlaying = previewTrack?._id === t._id && playing;
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => openTrim(t)} style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]}>
        <TouchableOpacity onPress={() => togglePreview(t)} style={styles.coverWrap} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          {t.Image ? <Image source={{ uri: t.Image }} style={styles.cover} /> : <View style={[styles.cover, { backgroundColor: c.chip }]} />}
          <View style={styles.playOverlay}>
            <Feather name={isPlaying ? 'pause' : 'play'} size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[styles.name, { color: c.text }]}>{t.Name}</Text>
          <Text numberOfLines={1} style={[styles.artist, { color: c.muted }]}>
            {[t.ArtistName, t.Language, t.Duration ? formatTime(t.Duration) : null].filter(Boolean).join(' · ')}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={c.muted} />
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
      <View style={[styles.screen, { backgroundColor: c.screen, paddingTop: insets.top }]}>
        <MusicAudio
          uri={audioUri}
          start={clipStart}
          end={clipEnd}
          playing={playing}
          loop={inTrim}
          seekOnPlay={inTrim}
          onEnd={() => setPlaying(false)}
          onError={() => { setPlaying(false); ToastMsg('Could not play this song'); }}
        />

        {/* header */}
        <View style={[styles.header, { backgroundColor: c.card, borderBottomColor: c.border }]}>
          <TouchableOpacity
            onPress={step === 'trim' && !initial ? backToList : handleClose}
            style={[styles.iconBtn, { backgroundColor: c.chip }]}>
            <Feather name={step === 'trim' && !initial ? 'arrow-left' : 'x'} size={20} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: c.text }]}>{step === 'trim' ? 'Pick the part you want' : 'Music'}</Text>
          <View style={{ width: 38 }} />
        </View>

        {step === 'list' ? (
          <>
            <View style={[styles.search, { backgroundColor: c.card, borderColor: accent + '55' }]}>
              <Feather name="search" size={17} color={c.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search songs or artists"
                placeholderTextColor={c.muted}
                autoCapitalize="none"
                style={[styles.searchInput, { color: c.text }]}
              />
              {!!search && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Feather name="x-circle" size={16} color={c.muted} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.filters}>
              <Dropdown allLabel="All genres" options={genres} value={genre} onChange={setGenre} c={c} accent={accent} />
              <Dropdown allLabel="All languages" options={languages} value={language} onChange={setLanguage} c={c} accent={accent} />
            </View>

            {loading && tracks.length === 0 ? (
              <ActivityIndicator style={{ marginTop: 40 }} color={accent} />
            ) : (
              <FlatList
                data={tracks}
                keyExtractor={(t, i) => t?._id || String(i)}
                renderItem={renderTrack}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 24 }}
                ListEmptyComponent={
                  <View style={styles.empty}>
                    <Feather name="music" size={34} color={c.muted} />
                    <Text style={[styles.emptyTitle, { color: c.text }]}>No songs found</Text>
                    <Text style={[styles.emptySub, { color: c.muted }]}>Try a different search or filter.</Text>
                  </View>
                }
              />
            )}
          </>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}>
            <View style={[styles.trackCard, { backgroundColor: c.card, borderColor: c.border }]}>
              {track?.Image ? <Image source={{ uri: track.Image }} style={styles.bigCover} /> : <View style={[styles.bigCover, { backgroundColor: c.chip }]} />}
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={[styles.bigName, { color: c.text }]}>{track?.Name}</Text>
                <Text numberOfLines={1} style={[styles.artist, { color: c.muted }]}>{track?.ArtistName}</Text>
              </View>
              <TouchableOpacity onPress={() => setPlaying(p => !p)} style={[styles.bigPlay, { backgroundColor: accent }]}>
                <Feather name={playing ? 'pause' : 'play'} size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionLabel, { color: c.muted }]}>Drag to choose the part that plays</Text>
            <View
              style={styles.waveWrap}
              onLayout={e => { barWidthRef.current = e.nativeEvent.layout.width; setBarWidth(e.nativeEvent.layout.width); }}
              {...pan.panHandlers}>
              <View pointerEvents="none" style={styles.bars}>
                {bars.map((h, i) => {
                  const pos = ((i + 0.5) / BAR_COUNT) * total;
                  const inside = pos >= start && pos <= start + duration;
                  return (
                    <View
                      key={i}
                      style={{ flex: 1, marginHorizontal: 0.5, height: Math.max(6, Math.round((WAVE_H * h) / 100)), borderRadius: 2, backgroundColor: inside ? accent : c.divider }}
                    />
                  );
                })}
              </View>
              <View
                pointerEvents="none"
                style={[styles.window, { left: `${winLeft}%`, width: `${winWidth}%`, borderColor: accent, backgroundColor: accent + '22' }]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={[styles.time, { color: c.muted }]}>{formatTime(start)}</Text>
              <Text style={[styles.time, { color: accent }]}>{formatTime(start)} – {formatTime(start + duration)}</Text>
              <Text style={[styles.time, { color: c.muted }]}>{formatTime(total)}</Text>
            </View>

            <Text style={[styles.sectionLabel, { color: c.muted, marginTop: 18 }]}>Length</Text>
            <View style={styles.durRow}>
              {durationOptions(total, suggestedDuration).map(d => (
                <TouchableOpacity
                  key={d}
                  onPress={() => changeDuration(d)}
                  style={[styles.durChip, { backgroundColor: duration === d ? accent : c.chip, borderColor: duration === d ? accent : c.divider }]}>
                  <Text style={[styles.durText, { color: duration === d ? '#fff' : c.text }]}>{d}s</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {step === 'trim' && (
          <View style={[styles.footer, { backgroundColor: c.card, borderTopColor: c.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
            <FormButton label="Use this music" icon="check" onPress={handleDone} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, marginBottom: 6, paddingHorizontal: 14, height: 46, borderRadius: 16, borderWidth: 1.5 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  filters: { flexDirection: 'row', gap: 10, paddingHorizontal: 12, paddingBottom: 6 },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, height: 44, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5 },
  selectText: { flex: 1, fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.55)', justifyContent: 'center', padding: 28 },
  sheet: { maxHeight: '65%', borderRadius: 22, borderWidth: 1, padding: 12 },
  sheetTitle: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Bold, textAlign: 'center', paddingVertical: 8 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13, borderRadius: 12 },
  optionText: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18, borderWidth: 1, marginBottom: 10 },
  coverWrap: { width: 54, height: 54 },
  cover: { width: 54, height: 54, borderRadius: 14 },
  playOverlay: { ...ABS, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  artist: { fontSize: 12, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, marginTop: 12, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  emptySub: { fontSize: 13, marginTop: 4, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  trackCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20, borderWidth: 1 },
  bigCover: { width: 72, height: 72, borderRadius: 18 },
  bigName: { fontSize: 17, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  bigPlay: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 13, marginTop: 20, marginBottom: 10, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  waveWrap: { height: WAVE_H, justifyContent: 'center' },
  bars: { ...ABS, flexDirection: 'row', alignItems: 'center' },
  window: { position: 'absolute', top: 0, bottom: 0, borderWidth: 2, borderRadius: 10 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  time: { fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  durRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  durChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16, borderWidth: 1.5 },
  durText: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
});

export default MusicPickerModal;
