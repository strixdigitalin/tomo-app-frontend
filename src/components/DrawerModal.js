// import React, { useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Linking,
//   Alert,
//   ScrollView,
//   Share,
// } from 'react-native'
// import Modal from 'react-native-modal'
// import { Forward } from '../assets/SVGs/index'
// import Row from './wrapper/row'
// import { FONTS_FAMILY } from '../assets/Fonts'
// import CustomText from './TextComponent'
// import SpaceBetweenRow from './wrapper/spacebetween'
// import { clearAsyncStorage } from '../utils/Apis'
// import { showError } from '../utils/helperFunctions'
// import { navigationRef } from '../routes/StackNavigation/route'
// import IMG from '../assets/Images'
// import ThemeToggle from './ThemeToggle'
// import { useSelector } from 'react-redux'
// import FingerPrintToggle from './FingerPrintToggle'
// import ReactNativeBiometrics from 'react-native-biometrics'

// const CustomDrawer = ({ isVisible, onClose, navigation }) => {
//   const [biometricAvailable, setBiometricAvailable] = useState(false)

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }
//   const rnBiometrics = new ReactNativeBiometrics()

//   useEffect(() => {
//     checkBiometricStatus()
//   }, [])

//   const checkBiometricStatus = async () => {
//     try {
//       const { available, biometryType } = await rnBiometrics.isSensorAvailable()

//       setBiometricAvailable(available)
//     } catch (error) {
//       console.log('Biometric check error:', error)
//     }
//   }
//   const handleLogout = async () => {
//     // console.log("navigationRef", navigationRef);

//     Alert.alert(
//       'Logout', // Title
//       'Do you really want to logout?', // Message
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel', // Cancel button style
//         },
//         {
//           text: 'Yes',
//           onPress: async () => {
//             try {
//               await clearAsyncStorage()
//               navigation?.replace('Login')
//               // na.getParent()?.navigate('Login');
//             } catch (error) {
//               showError('Error while logging out')
//             }
//           },
//         },
//       ],
//       { cancelable: true }, // Dismiss by tapping outside
//     )
//   }

//   const handleOperation = async label => {
//     if (label == 'Log Out') {
//       handleLogout()
//       onClose()
//     }
//     if (label == 'Terms & Conditions') {
//       navigation.navigate('TermsAndConditions')
//       onClose()
//     }

//     if (label == 'Feedback') {
//       navigation.navigate('FeedBack')
//       onClose()
//     }

//     if (label == 'Help Center') {
//       navigation.navigate('ContactUs')
//       onClose()
//     }


//       if (label == 'Promotions (New)*') {
//       navigation.navigate('MyPromotions')
//       onClose()
//     }


//     if (label == 'Privacy Policy') {
//       navigation.navigate('PrivacyPolicy')
//       onClose()
//     }
//     if (label == 'FAQ') {
//       navigation.navigate('FAQs')
//       onClose()
//     }
//     if (label == 'Followers') {
//       navigation.navigate('Followers')
//       onClose()
//     }

//     if (label == 'Request to become Seller') {
//       navigation.navigate('RequestBecomSeller')
//       onClose()
//     }

//     if (label == 'Saved Posts') {
//       navigation.navigate('SavedPosts')
//       onClose()
//     }

//     if (label == 'All Shops') {
//       navigation.navigate('Tab', { screen: 'MarketPlace' })
//       onClose()
//     }

//     if (label == 'Invite a Freind') {
//       const inviteLink = 'https://www.example.com/invite'

//       try {
//         const result = await Share.share({
//           message: `Hey! Check out this amazing app: ${inviteLink}`,
//           url: inviteLink,
//           title: 'Invite a Friend',
//         })

//         if (result.action === Share.sharedAction) {
//           if (result.activityType) {
//             console.log('Shared with activity type:', result.activityType)
//           } else {
//             console.log('Shared successfully')
//             onClose()
//           }
//         } else if (result.action === Share.dismissedAction) {
//           console.log('Share dismissed')
//           onClose()
//         }
//       } catch (error) {
//         console.error('Error sharing invite:', error.message)
//       }
//     }
//   }
//   const { isDarkMode } = useSelector(state => state.theme)

//   const styles = StyleSheet.create({
//     modal: {
//       margin: 0,
//       justifyContent: 'flex-end',
//     },
//     drawerContainer: {
//       width: '80%',
//       height: '100%',
//       backgroundColor: isDarkMode ? '#252525' : 'rgba(248, 248, 248, 1)',
//       // paddingVertical: 10,
//       paddingHorizontal: 15,
//       alignSelf: 'flex-end',
//     },
//     header: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       // marginBottom: 20,
//       marginTop: 20,
//     },
//     closeButton: {
//       // padding: 10,
//       position: 'absolute',
//       right: -30,
//     },
//     closeText: {
//       fontSize: 24,
//       color: '#000',
//     },
//     shopOwnerButton: {
//       backgroundColor: 'white',
//       paddingVertical: 6,
//       paddingHorizontal: 12,
//       borderRadius: 6,
//       borderWidth: 0.5,
//       borderColor: 'rgba(226, 113, 39, 1)',
//       flexDirection: 'row',
//       gap: 5,
//     },
//     shopOwnerText: {
//       color: 'rgba(226, 113, 39, 1)',
//       fontFamily: FONTS_FAMILY.Inter_Regular,
//       fontSize: 12,
//     },
//     profileSection: {
//       alignItems: 'center',
//       flexDirection: 'row',
//       borderWidth: 1,
//       padding: 10,
//       justifyContent: 'space-between',
//       borderRadius: 8,
//       borderColor: 'rgba(221, 221, 221, 1)',
//     },
//     profileImage: {
//       width: 50,
//       height: 50,
//       borderRadius: 40,
//       // marginBottom: 10,
//     },
//     profileName: {
//       fontSize: 17,
//       fontFamily: FONTS_FAMILY.Inter_SemiBold,
//       color: 'black',
//     },
//     accountType: {
//       fontSize: 12,
//       color: 'gray',
//       fontFamily: FONTS_FAMILY.Inter_Regular,
//     },
//     options: {
//       marginTop: 20,
//     },
//     optionItem: {
//       paddingVertical: 6,
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       // borderBottomWidth: 1,
//       borderBottomColor: '#e0e0e0',
//       // backgroundColor:'white'
//     },
//     optionText: {
//       fontSize: 14,
//       color: '#000',
//       fontFamily: FONTS_FAMILY.Inter_SemiBold,
//     },
//     logoutButton: {
//       marginTop: 30,
//       alignSelf: 'center',
//     },
//     logoutText: {
//       fontSize: 16,
//       color: 'red',
//       fontWeight: 'bold',
//     },
//     qrCode: {
//       width: 140,
//       height: 140,
//       alignSelf: 'center',
//       marginTop: 20,
//     },
//   })

//   const OptionItem = ({ label, icon, tc }) => (
//     <TouchableOpacity
//       style={styles.optionItem}
//       onPress={() => handleOperation(label)}>
//       <SpaceBetweenRow
//         style={{
//           backgroundColor: isDarkMode ? 'black' : 'white',
//           borderRadius: 10,
//           width: '100%',
//           padding: 8,
//         }}>
//         <Row style={{ gap: 18 }}>
//           {icon}
//           <Text
//             style={{
//               ...styles.optionText,
//               color: isDarkMode ? 'white' : 'black',
//               fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//               fontSize: 14,
//             }}>
//             {label}
//           </Text>
//         </Row>
//         {/* <Forward /> */}
//       </SpaceBetweenRow>
//     </TouchableOpacity>
//   )

//   return (
//     <Modal
//       isVisible={isVisible}
//       onBackdropPress={onClose}
//       animationIn='slideInRight'
//       animationOut='slideOutRight'
//       style={styles.modal}>
//       <View style={styles.drawerContainer}>
//         {/* Options */}
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {/* <Image
//             source={IMG.Applogo}
//             style={{
//               height: 100,
//               width: 100,
//               alignSelf: 'center',
//               marginVertical: 20,
//             }}
//           /> */}
//           <Image
//             source={IMG.TomoLogo}
//             style={{
//               height: 120,
//               width: 120,
//               alignSelf: 'center',
//               marginVertical: 20,
//               borderRadius: 20
//             }}
//           />
//           <ThemeToggle />
//           {biometricAvailable && <FingerPrintToggle />}

//           <View style={styles.options}>
//             <OptionItem label='Followers' nav={'Followers'} />
//             {selector?.SellerStatus !== 'Approved' && (
//               <OptionItem label='Request to become Seller' />
//             )}
//             {selector?.SellerStatus == 'Approved' && (
//               <OptionItem label='All Shops' />
//             )}
//             <OptionItem label='Saved Posts' />
//             <OptionItem label='Promotions (New)*' />
//             <OptionItem label='Privacy Policy' />
//             <OptionItem label='Terms & Conditions' />
//             {/* <OptionItem label="Help Center" /> */}
//             <OptionItem label='Invite a Freind' />
//             <OptionItem label='Feedback' />
//             <OptionItem label='FAQ' />

//             <OptionItem label='Log Out' />

//             <View
//               style={{
//                 height: 0.5,
//                 backgroundColor: 'rgba(221, 221, 221, 1)',
//                 width: '90%',
//                 marginVertical: 10,
//               }}
//             />
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   )
// }

// export default CustomDrawer



// SettingsDrawerScreen.js - New file
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Share,
  Pressable,
  StatusBar,
} from 'react-native'
import Animated, {
  SlideInRight,
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated'
import { FONTS_FAMILY } from '../assets/Fonts'
import SpaceBetweenRow from './wrapper/spacebetween'
import { clearAsyncStorage } from '../utils/Apis'
import { showError } from '../utils/helperFunctions'
import IMG from '../assets/Images'
import ThemeToggle from './ThemeToggle'
import { useSelector } from 'react-redux'
import FingerPrintToggle from './FingerPrintToggle'
import ReactNativeBiometrics from 'react-native-biometrics'
import LastActiveToggle from './LastActiveToggle'

const SettingsDrawerScreen = ({ navigation }) => {
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const { isDarkMode } = useSelector(state => state.theme)

  let selector = useSelector(state => state?.user?.userData)
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector)
  }

  const rnBiometrics = new ReactNativeBiometrics()

  useEffect(() => {
    checkBiometricStatus()
  }, [])

  const checkBiometricStatus = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable()
      setBiometricAvailable(available)
    } catch (error) {
      console.log('Biometric check error:', error)
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Do you really want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await clearAsyncStorage()
              navigation?.replace('Login')
            } catch (error) {
              showError('Error while logging out')
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  // const handleOperation = async label => {
  //   const closeDrawer = () => navigation.goBack()

  //   switch (label) {
  //     case 'Log Out':
  //       handleLogout()
  //       // closeDrawer()
  //       break
  //     case 'Terms & Conditions':
  //       navigation.navigate('TermsAndConditions')
  //       // closeDrawer()
  //       break
  //     case 'Feedback':
  //       navigation.navigate('FeedBack')
  //       // closeDrawer()
  //       break
  //     case 'Help Center':
  //       navigation.navigate('ContactUs')
  //       // closeDrawer()
  //       break
  //     case 'Promotions (New)*':
  //       navigation.navigate('MyPromotions')
  //       // closeDrawer()
  //       break
  //     case 'Privacy Policy':
  //       navigation.navigate('PrivacyPolicy')
  //       // closeDrawer()
  //       break
  //     case 'FAQ':
  //       navigation.navigate('FAQs')
  //       // closeDrawer()
  //       break
  //     case 'Followers':
  //       navigation.navigate('Followers')
  //       // closeDrawer()
  //       break
  //     case 'Request to become Seller':
  //       navigation.navigate('RequestBecomSeller')
  //       // closeDrawer()
  //       break
  //     case 'Saved Posts':
  //       navigation.navigate('SavedPosts')
  //       // closeDrawer()
  //       break
  //     case 'All Shops':
  //       navigation.navigate('Tab', { screen: 'MarketPlace' })
  //       // closeDrawer()
  //       break
  //     case 'Invite a Freind':
  //       handleInvite()
  //       break
  //     default:
  //       break
  //   }
  // }

  const handleOperation = async label => {
    const closeDrawer = () => {
      navigation.goBack()
    }

    switch (label) {
      case 'Log Out':
        handleLogout()
        break
      case 'Terms & Conditions':
        closeDrawer()
        setTimeout(() => navigation.navigate('TermsAndConditions'), 300)
        break
      case 'Feedback':
        closeDrawer()
        setTimeout(() => navigation.navigate('FeedBack'), 300)
        break
      case 'Help Center':
        closeDrawer()
        setTimeout(() => navigation.navigate('ContactUs'), 300)
        break

          case 'AI chat Bot':
        closeDrawer()
        setTimeout(() => navigation.navigate('ReactNativeChatbot'), 300)
        break
        
      case 'Promotions (New)*':
        closeDrawer()
        setTimeout(() => navigation.navigate('MyPromotions'), 300)
        break
      case 'Privacy Policy':
        closeDrawer()
        setTimeout(() => navigation.navigate('PrivacyPolicy'), 300)
        break
      case 'FAQ':
        closeDrawer()
        setTimeout(() => navigation.navigate('FAQs'), 300)
        break
      case 'Followers':
        closeDrawer()
        setTimeout(() => navigation.navigate('Followers'), 300)
        break
      case 'Request to become Seller':
        closeDrawer()
        setTimeout(() => navigation.navigate('RequestBecomSeller'), 300)
        break
      case 'Saved Posts':
        closeDrawer()
        setTimeout(() => navigation.navigate('SavedPosts'), 300)
        break
      case 'All Shops':
        closeDrawer()
        setTimeout(() => navigation.navigate('Tab', { screen: 'MarketPlace' }), 300)
        break
          case 'Settings':
        closeDrawer()
        setTimeout(() => navigation.navigate('Settings'), 300)
        break
      case 'Invite a Freind':
        handleInvite()
        break
      default:
        break
    }
  }

  const handleInvite = async () => {
    const inviteLink = 'https://www.example.com/invite'

    try {
      const result = await Share.share({
        message: `Hey! Check out this amazing app: ${inviteLink}`,
        url: inviteLink,
        title: 'Invite a Friend',
      })

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully')
        navigation.goBack()
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed')
      }
    } catch (error) {
      console.error('Error sharing invite:', error.message)
    }
  }

  const OptionItem = ({ label, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 30).duration(300)}>
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleOperation(label)}
        activeOpacity={0.7}>
        <View
          style={{
            backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
            borderRadius: 10,
            width: '100%',
            padding: 12,
          }}>
          <Text
            style={{
              color: isDarkMode ? 'white' : 'black',
              fontFamily: FONTS_FAMILY.SourceSans3_Medium,
              fontSize: 15,
            }}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawerContainer: {
      width: '80%',
      height: '100%',
      backgroundColor: isDarkMode ? '#000000' : '#f8f8f8',
      paddingHorizontal: 15,
    },
    logoContainer: {
      alignItems: 'center',
      marginVertical: 20,
      top: 20
    },
    logo: {
      height: 100,
      width: 100,
      borderRadius: 20,
    },
    options: {
      marginTop: 20,
      gap: 8,
    },
    optionItem: {
      paddingVertical: 4,
    },
    divider: {
      height: 0.5,
      backgroundColor: isDarkMode ? '#333' : '#ddd',
      width: '90%',
      marginVertical: 15,
      alignSelf: 'center',
    },
  })

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="rgba(0,0,0,0.5)"
        barStyle="light-content"
        translucent
      />

      {/* Backdrop - tap to close */}
      <Pressable
        style={styles.backdrop}
        onPress={() => navigation.goBack()}
      />

      {/* Drawer Content */}
      <Animated.View
        entering={SlideInRight.duration(300)}
        exiting={FadeOut.duration(200)}
        style={styles.drawerContainer}
      >
        <Animated.View
          entering={FadeIn.delay(100)}
          style={styles.logoContainer}
        >
          <Image
            source={IMG.TomoLogo}
            style={styles.logo}
          />
        </Animated.View>
        {/* Theme Toggle */}
        <Animated.View entering={FadeInDown.delay(150)}>
          <ThemeToggle />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)}>
         <LastActiveToggle />
        </Animated.View>

        {/* Fingerprint Toggle */}
        {biometricAvailable && (
          <Animated.View entering={FadeInDown.delay(200)}>
            <FingerPrintToggle />
          </Animated.View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Logo */}




          {/* Options */}
          <View style={styles.options}>
            <OptionItem label='Followers' index={0} />

            {selector?.SellerStatus !== 'Approved' && (
              <OptionItem label='Request to become Seller' index={1} />
            )}

            {selector?.SellerStatus === 'Approved' && (
              <OptionItem label='All Shops' index={1} />
            )}

            <OptionItem label='Saved Posts' index={2} />
            <OptionItem label='Promotions (New)*' index={3} />
            <OptionItem label='Privacy Policy' index={4} />
            <OptionItem label='Terms & Conditions' index={5} />
            <OptionItem label='Invite a Freind' index={6} />
            <OptionItem label='Feedback' index={7} />
            <OptionItem label='FAQ' index={8} />
            <OptionItem label='AI chat Bot' index={8} />
             {/* <OptionItem label='Settings' index={8} /> */}
            <OptionItem label='Log Out' index={9} />

            <View style={styles.divider} />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

export default SettingsDrawerScreen
