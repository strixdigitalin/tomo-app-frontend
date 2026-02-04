import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';

import { useSelector } from 'react-redux';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import ThemeToggle from '../../components/ThemeToggle';
import FingerPrintToggle from '../../components/FingerPrintToggle';
import LastActiveToggle from '../../components/LastActiveToggle';
import ReactNativeBiometrics from 'react-native-biometrics';

const Settings = ({ navigation }) => {
  const { isDarkMode } = useSelector(state => state.theme);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      setBiometricAvailable(available);
    } catch (error) {
      console.log('Biometric check error:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
    },
    headerContainer: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingTop: 50,
      paddingBottom: 15,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginLeft: 10,
    },

    // Section Styles
    section: {
      marginTop: 9,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? '#1877f2' : '#1877f2',
      marginBottom: 12,
      paddingHorizontal: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Setting Card Styles
    settingCard: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingVertical: 10,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingIcon: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingText: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
      color: isDarkMode ? 'white' : 'black',
    },
    settingSubText: {
      fontSize: 13,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#b0b3b8' : '#65676b',
      marginTop: 2,
    },
    arrowIcon: {
      fontSize: 20,
      color: isDarkMode ? '#b0b3b8' : '#65676b',
    },

    // Toggle Card (for components)
    toggleCard: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingVertical: 0,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
    },

    // Divider
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
      marginVertical: 20,
      marginHorizontal: 16,
    },
  });

  const renderHeader = () => {
    return (
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
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false}>
      


        {/* Appearance Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Appearance</CustomText>

          {/* Dark Mode Toggle */}
          <View style={styles.toggleCard}>
            <ThemeToggle />
          </View>

          {/* Theme Settings - Navigation to Theme Settings Screen */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              navigation.navigate('ThemeSettings');
            }}
          >
            <View style={styles.settingIcon}>
              <CustomText style={{ fontSize:14 }}>🎨</CustomText>
            </View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>
                Theme Settings
              </CustomText>
              <CustomText style={styles.settingSubText}>
                Customize colors, wallpaper & more
              </CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            Privacy & Security
          </CustomText>

          {/* Fingerprint Toggle */}
          {biometricAvailable && (
            <View style={styles.toggleCard}>
              <FingerPrintToggle />
            </View>
          )}

          {/* Last Active Toggle */}
          <View style={styles.toggleCard}>
            <LastActiveToggle />
          </View>

       
        </View>


      

      

        {/* Support & Legal Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Support & Legal</CustomText>

          {/* Help Center */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              navigation.navigate('ContactUs');
            }}
          >
            <View style={styles.settingIcon}>
              <CustomText style={{ fontSize:14 }}>❓</CustomText>
            </View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>Help Center</CustomText>
              <CustomText style={styles.settingSubText}>
                Get support and answers
              </CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              navigation.navigate('TermsAndConditions');
            }}
          >
            <View style={styles.settingIcon}>
              <CustomText style={{ fontSize:14 }}>📄</CustomText>
            </View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>
                Terms & Conditions
              </CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              navigation.navigate('PrivacyPolicy');
            }}
          >
            <View style={styles.settingIcon}>
              <CustomText style={{ fontSize:14 }}>🔒</CustomText>
            </View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>
                Privacy Policy
              </CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => {
              // Show About/Version Info
              console.log('About App');
            }}
          >
            <View style={styles.settingIcon}>
              <CustomText style={{ fontSize:14 }}>ℹ️</CustomText>
            </View>
            <View style={styles.settingTextContainer}>
              <CustomText style={styles.settingText}>About</CustomText>
              <CustomText style={styles.settingSubText}>
                Version 1.0.0
              </CustomText>
            </View>
            <CustomText style={styles.arrowIcon}>→</CustomText>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default Settings;