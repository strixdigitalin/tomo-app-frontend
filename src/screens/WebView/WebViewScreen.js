import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, BackHandler, Linking, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { THEMES } from '../../redux/reducer/theme';
import { profilePalette } from '../UserDetail/profileTheme';

// Opens a link inside the app (What's New news / tips / blog "Read More") with a back button.
//   navigation.navigate('WebViewScreen', { url, title })
// Back: the header arrow and the Android back button first go back inside the page (if it has
// history), then close the screen. The X always closes it.
export const normalizeUrl = (raw = '') => {
  const u = String(raw).trim();
  if (!u) return '';
  return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`;
};

const hostOf = url => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const WebViewScreen = ({ navigation, route }) => {
  const url = normalizeUrl(route?.params?.url);
  const insets = useSafeAreaInsets();
  const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
  const accent = (THEMES[selectedColorTheme] || THEMES.default).primary;
  const c = profilePalette(isDarkMode, accent);

  const ref = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [currentUrl, setCurrentUrl] = useState(url);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  const goBack = useCallback(() => {
    if (canGoBack) ref.current?.goBack();
    else navigation.goBack();
  }, [canGoBack, navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  const title = route?.params?.title || pageTitle || hostOf(currentUrl) || 'Link';
  const loading = progress < 1 && !failed;

  return (
    <View style={[styles.screen, { backgroundColor: c.screen }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: c.card, borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={goBack} style={[styles.btn, { backgroundColor: c.chip }]} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={20} color={c.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.host, { color: c.muted }]} numberOfLines={1}>{hostOf(currentUrl)}</Text>
        </View>
        <TouchableOpacity onPress={() => { setFailed(false); ref.current?.reload(); }} style={[styles.btn, { backgroundColor: c.chip }]}>
          <Feather name="refresh-cw" size={17} color={c.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(currentUrl).catch(() => {})} style={[styles.btn, { backgroundColor: c.chip }]}>
          <Feather name="external-link" size={17} color={c.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn, { backgroundColor: c.chip }]}>
          <Feather name="x" size={19} color={c.text} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={[styles.track, { backgroundColor: c.divider }]}>
          <View style={{ width: `${Math.max(progress, 0.05) * 100}%`, height: '100%', backgroundColor: accent }} />
        </View>
      )}

      {!url ? (
        <View style={styles.center}>
          <Feather name="link-2" size={34} color={c.muted} />
          <Text style={[styles.msg, { color: c.muted }]}>No link to open.</Text>
        </View>
      ) : failed ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={34} color={c.muted} />
          <Text style={[styles.msg, { color: c.muted }]}>Could not load this page.</Text>
          <TouchableOpacity style={[styles.retry, { borderColor: accent }]} onPress={() => { setFailed(false); setProgress(0); ref.current?.reload(); }}>
            <Feather name="refresh-cw" size={14} color={accent} />
            <Text style={{ color: accent, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(url).catch(() => {})}>
            <Text style={{ color: accent, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, marginTop: 10 }}>Open in browser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={ref}
          source={{ uri: url }}
          style={{ flex: 1, backgroundColor: c.screen }}
          startInLoadingState
          renderLoading={() => <View style={styles.center}><ActivityIndicator color={accent} size="large" /></View>}
          allowsBackForwardNavigationGestures
          allowsInlineMediaPlayback
          setSupportMultipleWindows={false}
          javaScriptEnabled
          domStorageEnabled
          onLoadProgress={e => setProgress(e.nativeEvent.progress)}
          onLoadEnd={() => setProgress(1)}
          onNavigationStateChange={s => {
            setCanGoBack(!!s.canGoBack);
            if (s.title && !/^https?:/i.test(s.title)) setPageTitle(s.title);
            if (s.url) setCurrentUrl(s.url);
          }}
          onError={() => setFailed(true)}
          onHttpError={e => { if (e.nativeEvent.statusCode >= 500) setFailed(true); }}
          // web links stay in the app; mailto:/tel:/app links go to the phone's own handler
          onShouldStartLoadWithRequest={req => {
            if (/^(https?:|about:|data:|blob:)/i.test(req.url)) return true;
            Linking.openURL(req.url).catch(() => {});
            return false;
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: 1 },
  btn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontFamily: FONTS_FAMILY.SourceSans3_Bold },
  host: { fontSize: 11.5, marginTop: 1, fontFamily: FONTS_FAMILY.SourceSans3_Regular },
  track: { height: 3 },
  center: { ...StyleSheet.absoluteFillObject, top: 0, alignItems: 'center', justifyContent: 'center', gap: 10 },
  msg: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Medium },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, marginTop: 4 },
});

export default WebViewScreen;
