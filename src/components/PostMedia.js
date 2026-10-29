import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, ActivityIndicator, Text, Dimensions, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

const { width: SCREEN_W } = Dimensions.get('window');
const MIN_RATIO = 1.0; // 4:5 portrait is the tallest image ratio before we letterbox
const MAX_RATIO = 1.78; // 16:9 landscape is the widest

// Post media, modelled on web's PostMedia.jsx: images are shown whole (contain)
// over a blurred copy of themselves, videos play on black with a loader.
// If the native player errors, the video falls back to an HTML5 <video> in a WebView.
const PostMedia = ({
  uri,
  isVideo,
  width = SCREEN_W,
  paused = false,
  muted = true,
  controls = false,
  repeat = true,
  maxHeightRatio = 0.85, // feed cards stay compact; anything taller is letterboxed over the blur
}) => {
  const [ratio, setRatio] = useState(1); // width / height
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [useWebView, setUseWebView] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setUseWebView(false);
    if (!isVideo && uri) {
      Image.getSize(uri, (w, h) => h && setRatio(w / h), () => {});
    }
  }, [uri, isVideo]);

  const height = useMemo(() => {
    const r = Math.min(Math.max(ratio, MIN_RATIO), MAX_RATIO);
    return Math.min(width / r, width * maxHeightRatio);
  }, [ratio, width, maxHeightRatio]);

  if (!uri) return null;

  if (failed) {
    return (
      <View style={[styles.box, { width, height: width * 0.6 }]}>
        <Text style={styles.err}>Failed to load media</Text>
      </View>
    );
  }

  if (!isVideo) {
    return (
      <View style={[styles.box, { width, height }]}>
        <Image source={{ uri }} style={StyleSheet.absoluteFill} blurRadius={24} resizeMode="cover" />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.25)' }]} />
        <Image
          source={{ uri }}
          style={{ width, height }}
          resizeMode="contain"
          fadeDuration={200}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
        {!loaded && <ActivityIndicator style={StyleSheet.absoluteFill} color="#fff" />}
      </View>
    );
  }

  if (useWebView) {
    const html = `<html><head><meta name="viewport" content="width=device-width,initial-scale=1"/>
      <style>html,body{margin:0;background:#000;height:100%}video{width:100%;height:100%;object-fit:contain}</style></head>
      <body><video src="${uri}" controls playsinline preload="metadata" ${muted ? 'muted' : ''}></video></body></html>`;
    return (
      <View style={[styles.box, { width, height, backgroundColor: '#000' }]}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          scrollEnabled={false}
          style={{ backgroundColor: '#000' }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.box, { width, height, backgroundColor: '#000' }]}>
      <Video
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
        repeat={repeat}
        muted={muted}
        paused={paused}
        controls={controls}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        onLoad={e => {
          const n = e?.naturalSize;
          if (n?.width && n?.height) setRatio(n.width / n.height);
        }}
        onReadyForDisplay={() => setLoaded(true)}
        onError={() => setUseWebView(true)}
      />
      {!loaded && <ActivityIndicator style={StyleSheet.absoluteFill} color="#fff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  box: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1F2937' },
  err: { color: '#9CA3AF', fontSize: 13 },
});

export default PostMedia;
