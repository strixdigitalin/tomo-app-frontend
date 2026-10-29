import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import { apiGet } from '../../utils/Apis';

// Shared screen for Terms & Conditions / Privacy Policy. The backend stores
// them as HTML (admin panel), same as the web app which renders it directly.
const LegalPage = ({ navigation, title, endpoint, field }) => {
  const { isDarkMode } = useSelector(state => state.theme);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet(endpoint);
        setHtml(res?.data?.[field] || '');
      } catch (e) {
        setHtml('');
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint, field]);

  const textColor = isDarkMode ? '#e4e6eb' : '#050505';
  const doc = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"/>
    <style>body{font-family:-apple-system,Roboto,sans-serif;color:${textColor};background:transparent;padding:8px 12px;line-height:1.6;font-size:16px}
    a{color:#1877f2}img{max-width:100%}</style></head><body>${html || '<p>Nothing to show right now.</p>'}</body></html>`;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#0B1220' : '#EEF1F6' },
    headerContainer: { backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF', paddingTop: 50, paddingBottom: 15 },
    backButton: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginLeft: 10,
    },
    content: { flex: 1, margin: 12, borderRadius: 18, overflow: 'hidden', backgroundColor: isDarkMode ? '#131B2B' : '#FFFFFF' },
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.headerContainer}>
        <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
          <View style={styles.backButton}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>{title}</CustomText>
          </View>
        </SpaceBetweenRow>
      </View>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          <WebView originWhitelist={['*']} source={{ html: doc }} style={{ backgroundColor: 'transparent' }} />
        )}
      </View>
    </View>
  );
};

export default LegalPage;
