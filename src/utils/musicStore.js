import { useSyncExternalStore } from 'react';

// Mute switches for post / story music (web: globalMute in PostMedia.jsx). There is one per
// scope — 'feed' (posts) and 'story' — so muting stories does not mute the feed and vice versa.
// Muting on one post keeps every other post muted until the user unmutes.
const muted = { feed: false, story: false };
const subs = new Set();

const subscribe = fn => {
  subs.add(fn);
  return () => subs.delete(fn);
};

export const getMusicMuted = (scope = 'feed') => muted[scope];
export const setMusicMuted = (value, scope = 'feed') => {
  if (muted[scope] === value) return;
  muted[scope] = value;
  subs.forEach(fn => fn());
};
export const useMusicMuted = (scope = 'feed') =>
  useSyncExternalStore(subscribe, () => muted[scope], () => muted[scope]);

// The part of a track that should play: start + min(selected duration, what is left of the song)
// (same maths as web's getRange / getStoryDuration)
export const getClipRange = (music, startRaw, durationRaw) => {
  const start = Number(startRaw) || 0;
  const wanted = Number(durationRaw) || 15;
  const available = music?.Duration ? Math.max(1, music.Duration - start) : wanted;
  const length = Math.max(1, Math.min(wanted, available));
  return { start, end: start + length, length };
};

export const formatTime = (s = 0) => {
  const total = Math.max(0, Math.floor(s));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};
