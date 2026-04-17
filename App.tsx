


// import React, { useEffect } from 'react';
// import { ActivityIndicator, BackHandler, Platform, SafeAreaView, StatusBar } from 'react-native';
// import StackNavigation from './src/routes/StackNavigation/route';
// import color from './src/common/Colors/colors';
// import FlashMessage from 'react-native-flash-message';
// import Loader from './src/components/Loader';
// import { Provider, useSelector } from 'react-redux';
// import store from './src/redux/store';
// import { PaperProvider } from 'react-native-paper';
// // import ScreenshotPrevent from 'react-native-screenshot-prevent'

// // import RNScreenshotPrevent from 'react-native-screenshot-prevent'




// const MainApp = () => {
//   const loaderVisible = useSelector(state => state?.loader?.loader);
//     const screenshotProtection = useSelector(state => state?.theme?.screenshotProtection)
//   // useEffect(() => {
//   //   // Screenshot prevention enable karo
//   //   if (Platform.OS === 'android') {
//   //     RNScreenshotPrevent.enabled(true)
//   //     console.log('Screenshot prevention enabled for Android')
//   //   } else if (Platform.OS === 'ios') {
//   //     RNScreenshotPrevent.enableSecureView()
//   //     console.log('Secure view enabled for iOS')
//   //   }

//   //   // Cleanup function
//   //   return () => {
//   //     if (Platform.OS === 'android') {
//   //       RNScreenshotPrevent.enabled(false)
//   //     } else if (Platform.OS === 'ios') {
//   //       RNScreenshotPrevent.disableSecureView()
//   //     }
//   //   }
//   // }, [])
// // // useEffect mein:
// // useEffect(() => {
// //   if (Platform.OS === 'android') {
// //     enabled(screenshotProtection)
// //   } else if (Platform.OS === 'ios') {
// //     if (screenshotProtection) {
// //       enableSecureView()
// //     } else {
// //       disableSecureView()
// //     }
// //   }
// // }, [screenshotProtection])
//   // Check for existence
//  useEffect(()=>{
//    if (!BackHandler.removeEventListener) {
//     BackHandler.removeEventListener = () => { };
//   }
//  },[])
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
//       <StatusBar
//         barStyle={'dark-content'}
//         backgroundColor={color.white}
//       />
//       <StackNavigation />
//       <FlashMessage position="top" />
//       <Loader visible={loaderVisible} />
//       {/* { loaderVisible &&<ActivityIndicator size={'large'} color={'white'}/>} */}
//     </SafeAreaView>
//   );
// };

// const App = () => {

//   return (
//     <PaperProvider>
//       <Provider store={store}>
//         <MainApp />
//       </Provider>
//     </PaperProvider>
//   );
// };

// export default App;



import React, { useEffect } from 'react';
import { ActivityIndicator, BackHandler, NativeModules, Platform, SafeAreaView, StatusBar } from 'react-native';
import StackNavigation from './src/routes/StackNavigation/route';
import color from './src/common/Colors/colors';
import FlashMessage from 'react-native-flash-message';
import Loader from './src/components/Loader';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import { PaperProvider } from 'react-native-paper';

const { ScreenshotModule } = NativeModules

const MainApp = () => {
  const loaderVisible        = useSelector(state => state?.loader?.loader);
  const screenshotProtection = useSelector(state => state?.theme?.screenshotProtection)

  // ── Screenshot Protection ──────────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'android' || !ScreenshotModule) return

    if (screenshotProtection) {
      ScreenshotModule.forbid()
        .then(() => console.log('Screenshot blocked ✅'))
        .catch((e: any) => console.log('forbid error:', e))
    } else {
      ScreenshotModule.allow()
        .then(() => console.log('Screenshot allowed ✅'))
        .catch((e: any) => console.log('allow error:', e))
    }
  }, [screenshotProtection])

  // ── BackHandler fix ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!BackHandler.removeEventListener) {
      BackHandler.removeEventListener = () => { };
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={color.white}
      />
      <StackNavigation />
      <FlashMessage position="top" />
      <Loader visible={loaderVisible} />
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <PaperProvider>
      <Provider store={store}>
        <MainApp />
      </Provider>
    </PaperProvider>
  );
};

export default App;