import React, { useCallback, useState } from 'react';
import { Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Video from 'react-native-video';
import Feather from 'react-native-vector-icons/Feather';
import { pick, types, keepLocalCopy, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import FormScreen, { FormSection } from '../../components/FormScreen';
import FormField from '../../components/FormField';
import FormButton from '../../components/FormButton';
import OptionChips from '../../components/OptionChips';
import ChipInput from '../../components/ChipInput';
import ImageUploadBox from '../../components/ImageUploadBox';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { BASE_URL, getItem } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import { formatTime } from '../../utils/musicStore';
import useForm from '../../utils/useForm';
import { compose, required, maxLength } from '../../utils/validators';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// Upload your own song for others to use in posts / stories — web's Pages/TomoSound/TomoSound.jsx
// (api/admin/UserCreateMusic; an admin approves it before it shows up in the music picker).
const GENRES = ['Pop', 'Rock', 'Hip Hop', 'Rap', 'Romantic', 'Classical', 'Devotional', 'Folk', 'EDM', 'Lo-fi', 'Sufi', 'Bollywood', 'Other'];
const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Instrumental', 'Other'];
const MAX_IMAGE_MB = 5;
const MAX_AUDIO_MB = 20;

const SCHEMA = {
  Name: compose(required('Song name'), maxLength(80, 'Song name')),
  ArtistName: compose(required('Artist name'), maxLength(80, 'Artist name')),
  Genre: required('Genre'),
  Language: required('Language'),
  Detail: maxLength(300, 'Detail'),
  Lyrics: maxLength(5000, 'Lyrics'),
};

const TomoSound = ({ navigation }) => {
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const form = useForm({ Name: '', ArtistName: '', Genre: '', Language: '', Detail: '', Lyrics: '' }, SCHEMA);
  const { values: v, errors: e } = form;

  const [cover, setCover] = useState(null);
  const [coverError, setCoverError] = useState(null);
  const [audio, setAudio] = useState(null); // { uri, name, size, type }
  const [audioError, setAudioError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);

  const pickAudio = useCallback(async () => {
    try {
      const [file] = await pick({ type: [types.audio], allowMultiSelection: false });
      if (!file) return;
      if (file.size && file.size > MAX_AUDIO_MB * 1024 * 1024) {
        return ToastMsg(`Audio file must be under ${MAX_AUDIO_MB}MB`);
      }
      // copy to the app cache so the upload gets a plain file:// path (content:// uris are flaky)
      const [copy] = await keepLocalCopy({
        files: [{ uri: file.uri, fileName: file.name || `sound_${Date.now()}.mp3` }],
        destination: 'cachesDirectory',
      });
      if (copy?.status !== 'success') return ToastMsg('Could not read this file');
      setDuration(0);
      setAudio({ uri: copy.localUri, name: file.name || 'sound.mp3', size: file.size, type: file.type || 'audio/mpeg' });
      setAudioError(null);
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) return;
      ToastMsg('Please select a valid audio file');
    }
  }, []);

  const onSubmit = useCallback(async () => {
    const { ok, firstError } = form.validateAll();
    if (!cover) setCoverError('Please upload a cover image');
    if (!audio) setAudioError('Please upload an audio file');
    if (!ok) return ToastMsg(firstError);
    if (!cover) return ToastMsg('Please upload a cover image');
    if (!audio) return ToastMsg('Please upload an audio file');

    try {
      setSaving(true);
      const token = await getItem('token');
      const fd = new FormData();
      fd.append('Name', v.Name.trim());
      fd.append('Detail', v.Detail.trim());
      fd.append('ArtistName', v.ArtistName.trim());
      fd.append('Genre', v.Genre);
      fd.append('Language', v.Language);
      fd.append('Tags', tags.join(','));
      fd.append('Lyrics', v.Lyrics);
      fd.append('Duration', String(duration || 0));
      fd.append('Image', {
        uri: Platform.OS === 'android' ? cover.uri : cover.uri.replace('file://', ''),
        type: cover.type || 'image/jpeg',
        name: cover.name || 'cover.jpg',
      });
      fd.append('File', {
        uri: Platform.OS === 'android' ? audio.uri : audio.uri.replace('file://', ''),
        type: audio.type || 'audio/mpeg',
        name: audio.name || 'sound.mp3',
      });

      const res = await fetch(`${BASE_URL}/api/admin/UserCreateMusic`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const result = await res.json();
      if (result?.statusCode === 200 || result?.statusCode === 201) {
        ToastMsg(result?.message || 'Sound uploaded! Waiting for admin approval.');
        navigation.goBack();
      } else {
        ToastMsg(result?.message || 'Failed to upload sound');
      }
    } catch (err) {
      console.log('TomoSound submit error', err);
      ToastMsg('Something went wrong, please try again');
    } finally {
      setSaving(false);
    }
  }, [form, cover, audio, tags, duration, v, navigation]);

  const text = name => ({
    value: v[name], error: e[name],
    onChangeText: t => form.set(name, t), onBlur: () => form.blur(name),
  });

  return (
    <FormScreen
      title="Upload Tomo Sound"
      subtitle="Share a song others can use in posts & stories"
      onBack={() => navigation.goBack()}
      footer={<FormButton label="Upload Sound" icon="upload" onPress={onSubmit} loading={saving} />}>

      {/* reads the length of the picked song */}
      {!!audio && (
        <Video
          source={{ uri: audio.uri }}
          paused
          audioOnly
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
          onLoad={d => setDuration(Math.round(d?.duration || 0))}
        />
      )}

      <FormSection title="Cover & audio">
        <ImageUploadBox
          label="Cover image" required image={cover} error={coverError} height={150}
          maxBytes={MAX_IMAGE_MB * 1024 * 1024} hint={`JPG, PNG up to ${MAX_IMAGE_MB}MB`}
          onChange={img => { setCover(img); setCoverError(null); }}
        />

        <Text style={[styles.label, { color: c.muted }]}>
          Audio file <Text style={{ color: c.danger }}>*</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={pickAudio}
          style={[styles.audioBox, { backgroundColor: c.chip, borderColor: audioError ? c.danger : accent + '88' }]}>
          <View style={[styles.audioIcon, { backgroundColor: accent + '1A' }]}>
            <Feather name={audio ? 'music' : 'upload-cloud'} size={22} color={accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={[styles.audioName, { color: c.text }]}>
              {audio ? audio.name : 'Tap to choose an audio file'}
            </Text>
            <Text style={[styles.audioMeta, { color: c.muted }]}>
              {audio
                ? `${((audio.size || 0) / (1024 * 1024)).toFixed(2)} MB${duration > 0 ? ` • ${formatTime(duration)}` : ''}`
                : `MP3, WAV, AAC up to ${MAX_AUDIO_MB}MB`}
            </Text>
          </View>
          {!!audio && (
            <TouchableOpacity onPress={() => { setAudio(null); setDuration(0); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={18} color={c.muted} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {!!audioError && <Text style={[styles.error, { color: c.danger }]}>{audioError}</Text>}
      </FormSection>

      <FormSection title="Song details">
        <FormField label="Song name" required placeholder="e.g. Midnight Drive" autoCapitalize="words" maxLength={80} {...text('Name')} />
        <FormField label="Artist name" required placeholder="e.g. DJ Tomo" autoCapitalize="words" maxLength={80} {...text('ArtistName')} />
        <FormField label="Detail" placeholder="Anything about this song (optional)" multiline maxLength={300} showCounter autoCapitalize="sentences" {...text('Detail')} />
        <OptionChips label="Genre" required options={GENRES} value={v.Genre} error={e.Genre} allowClear={false} onChange={val => { form.set('Genre', val); form.blur('Genre'); }} />
        <OptionChips label="Language" required options={LANGUAGES} value={v.Language} error={e.Language} allowClear={false} onChange={val => { form.set('Language', val); form.blur('Language'); }} />
        <ChipInput label="Tags" items={tags} onChange={setTags} placeholder="e.g. love, romantic, hindi" />
        <FormField label="Lyrics" placeholder="Paste the lyrics (optional)" multiline maxLength={5000} autoCapitalize="sentences" {...text('Lyrics')} />
      </FormSection>

      <Text style={[styles.note, { color: c.muted }]}>
        After you upload, an admin reviews your sound. Once approved it appears in the music list.
      </Text>
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 13, marginBottom: 6, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold },
  audioBox: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed' },
  audioIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  audioName: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  audioMeta: { fontSize: 12, marginTop: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  error: { fontSize: 12, marginTop: 5, marginLeft: 2, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  note: { fontSize: 12, textAlign: 'center', paddingHorizontal: 20, marginBottom: 10, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
});

export default TomoSound;
