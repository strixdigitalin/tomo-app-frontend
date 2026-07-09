



import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import ThemeToggle from '../../components/ThemeToggle';
import FingerPrintToggle from '../../components/FingerPrintToggle';
import LastActiveToggle from '../../components/LastActiveToggle';
import ReactNativeBiometrics from 'react-native-biometrics';
import { THEMES } from '../../redux/reducer/theme';
import { updateScreenshotProtection } from '../../redux/actions/themeActions';

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isDarkMode, selectedColorTheme, screenshotProtection } = useSelector(state => state.theme);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics();
  const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
  const primaryColor = currentTheme.primary;

  useEffect(() => { checkBiometricStatus(); }, []);

  const checkBiometricStatus = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      setBiometricAvailable(available);
    } catch (error) {
      console.log('Biometric check error:', error);
    }
  };

  const handleScreenshotToggle = (value) => {
    updateScreenshotProtection(value);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? 'black' : '#f0f2f5' },
    headerContainer: { backgroundColor: isDarkMode ? '#252525' : 'white', paddingTop: 50, paddingBottom: 15 },
    backButton: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: isDarkMode ? 'white' : 'black', marginLeft: 10 },
    section: { marginTop: 9, marginBottom: 8 },
    sectionTitle: { fontSize: 14, fontFamily: FONTS_FAMILY.SourceSans3_Bold, color: primaryColor, marginBottom: 12, paddingHorizontal: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
    settingCard: { backgroundColor: isDarkMode ? '#252525' : 'white', paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
    settingIcon: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    settingTextContainer: { flex: 1 },
    settingText: { fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_SemiBold, color: isDarkMode ? 'white' : 'black' },
    settingSubText: { fontSize: 13, fontFamily: FONTS_FAMILY.SourceSans3_Regular, color: isDarkMode ? '#b0b3b8' : '#65676b', marginTop: 2 },
    arrowIcon: { fontSize: 20, color: isDarkMode ? '#b0b3b8' : '#65676b' },
    toggleCard: { backgroundColor: isDarkMode ? '#252525' : 'white', paddingVertical: 0, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
    divider: { height: 1, backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb', marginVertical: 20, marginHorizontal: 16 },
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Settings</CustomText>
        </View>
      </SpaceBetweenRow>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Appearance</CustomText>
          <View style={styles.toggleCard}><ThemeToggle /></View>
          <TouchableOpacity style={styles.settingCard} onPress={() => navigation.navigate('ThemeSettings')}>
            <View style={styles.settingIcon}><CustomText style={{ fontSize: 14 }}>🎨</CustomText></View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>Theme Settings</CustomText>
              <CustomText style={styles.settingSubText}>Customize colors, wallpaper & more</CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Privacy & Security</CustomText>

          {biometricAvailable && <View style={styles.toggleCard}><FingerPrintToggle /></View>}

          <View style={styles.toggleCard}><LastActiveToggle /></View>

          {/* Screenshot Protection */}
          <View style={styles.settingCard}>
            <View style={styles.settingIcon}><CustomText style={{ fontSize: 14 }}>🛡️</CustomText></View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>Screenshot Protection</CustomText>
              <CustomText style={styles.settingSubText}>Block screenshots & screen recording</CustomText>
            </View>
            <Switch
              value={screenshotProtection}
              onValueChange={handleScreenshotToggle}
              trackColor={{ false: isDarkMode ? '#444' : '#ddd', true: primaryColor }}
              thumbColor={screenshotProtection ? 'white' : (isDarkMode ? '#aaa' : '#f4f3f4')}
            />
          </View>

            <View style={styles.settingCard}>
            <View style={styles.settingIcon}><CustomText style={{ fontSize: 14 }}>🛡️</CustomText></View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>Text-To-Speech</CustomText>
              {/* <CustomText style={styles.settingSubText}>Block screenshots & screen recording</CustomText> */}
            </View>
            <Switch
              value={isTextToSpeechEnabled}
              onValueChange={setIsTextToSpeechEnabled}
              trackColor={{ false: isDarkMode ? '#444' : '#ddd', true: primaryColor }}
              thumbColor={isTextToSpeechEnabled ? 'white' : (isDarkMode ? '#aaa' : '#f4f3f4')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Support & Legal</CustomText>
          <TouchableOpacity style={styles.settingCard} onPress={() => navigation.navigate('ContactUs')}>
            <View style={styles.settingIcon}><CustomText style={{ fontSize: 14 }}>❓</CustomText></View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>Help Center</CustomText>
              <CustomText style={styles.settingSubText}>Get support and answers</CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingCard} onPress={() => navigation.navigate('TermsAndConditions')}>
            <View style={styles.settingIcon}><CustomText style={{ fontSize: 14 }}>📄</CustomText></View>
            <View style={styles.settingTextContainer}><CustomText style={styles.settingText}>Terms & Conditions</CustomText></View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingCard} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <View style={styles.settingIcon}><CustomText style={{ fontSize: 14 }}>🔒</CustomText></View>
            <View style={styles.settingTextContainer}><CustomText style={styles.settingText}>Privacy Policy</CustomText></View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingCard} onPress={() => console.log('About App')}>
            <View style={styles.settingIcon}><CustomText style={{ fontSize: 14 }}>ℹ️</CustomText></View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>About</CustomText>
              <CustomText style={styles.settingSubText}>Version 1.0.0</CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default Settings;