import React, { useEffect, useRef } from 'react';
import Video from 'react-native-video';

// Invisible audio player for a clip of a song (react-native-video is already in the app, so no
// new native module). Plays from `start` to `end` seconds:
//   loop      → jumps back to `start` when the clip ends (post feed / trim preview)
//   !loop     → calls onEnd (story, list preview)
//   seekOnPlay→ every time `playing` turns on, restart from `start` (trim preview)
const MusicAudio = ({ uri, start = 0, end = null, playing, muted = false, loop = false, seekOnPlay = false, onEnd, onError }) => {
  const ref = useRef(null);
  const ready = useRef(false);

  useEffect(() => { ready.current = false; }, [uri]);

  // clip moved (user dragged the trim window / picked another length)
  useEffect(() => {
    if (ready.current) ref.current?.seek(start);
  }, [start, end]);

  useEffect(() => {
    if (playing && seekOnPlay && ready.current) ref.current?.seek(start);
  }, [playing]);

  if (!uri) return null;

  return (
    <Video
      key={uri}
      ref={ref}
      source={{ uri }}
      paused={!playing}
      muted={muted}
      audioOnly
      repeat={false}
      playInBackground={false}
      playWhenInactive={false}
      ignoreSilentSwitch="ignore"
      progressUpdateInterval={120}
      style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      onLoad={() => {
        ready.current = true;
        if (start > 0) ref.current?.seek(start);
      }}
      onProgress={({ currentTime }) => {
        if (end != null && currentTime >= end) {
          if (loop) ref.current?.seek(start);
          else onEnd && onEnd();
        }
      }}
      onEnd={() => {
        if (loop) ref.current?.seek(start);
        else onEnd && onEnd();
      }}
      onError={() => onError && onError()}
    />
  );
};

export default MusicAudio;
