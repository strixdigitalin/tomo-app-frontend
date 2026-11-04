import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MusicAudio from './MusicAudio';
import { FONTS_FAMILY } from '../assets/Fonts';
import { getClipRange, setMusicMuted, useMusicMuted } from '../utils/musicStore';

// Music attached to a post or story (fields come from the API: item.Music = track document,
// item.MusicStart, item.MusicDuration).  Renders a small "♪ song · artist" pill with a mute
// button, and plays the chosen clip while `active` is true.
//   loop = true  → post feed / post detail: clip repeats while the post is on screen
//   loop = false → story: plays once, then onEnd
// Mute is one switch per scope: all posts share the 'feed' switch, stories use the 'story' one.
const PostMusic = ({ item, active, loop = true, onEnd, style, hidePill = false, scope = 'feed' }) => {
  const muted = useMusicMuted(scope);
  const music = item?.Music?.File ? item.Music : null;
  if (!music) return null;

  const { start, end } = getClipRange(music, item.MusicStart, item.MusicDuration);

  return (
    <>
      <MusicAudio
        uri={music.File}
        start={start}
        end={end}
        playing={!!active}
        muted={muted}
        loop={loop}
        onEnd={onEnd}
      />
      {!hidePill && (
        <View pointerEvents="box-none" style={[styles.wrap, style]}>
          <View style={styles.pill}>
            {music.Image ? <Image source={{ uri: music.Image }} style={styles.cover} /> : <Feather name="music" size={13} color="#fff" />}
            <Text numberOfLines={1} style={styles.text}>
              {music.Name}{music.ArtistName ? ` · ${music.ArtistName}` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => setMusicMuted(!muted, scope)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={muted ? 'Unmute music' : 'Mute music'}>
              <Feather name={muted ? 'volume-x' : 'volume-2'} size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 10, bottom: 10, right: 54, zIndex: 5 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', maxWidth: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 18,
  },
  cover: { width: 20, height: 20, borderRadius: 10 },
  text: { color: '#fff', fontSize: 12, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, flexShrink: 1 },
});

export default PostMusic;
