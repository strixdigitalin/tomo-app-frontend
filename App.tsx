


import React, { useEffect } from 'react';
import { ActivityIndicator, BackHandler, SafeAreaView, StatusBar } from 'react-native';
import StackNavigation from './src/routes/StackNavigation/route';
import color from './src/common/Colors/colors';
import FlashMessage from 'react-native-flash-message';
import Loader from './src/components/Loader';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import { PaperProvider } from 'react-native-paper';


const MainApp = () => {
  const loaderVisible = useSelector(state => state?.loader?.loader);
  // Check for existence
 useEffect(()=>{
   if (!BackHandler.removeEventListener) {
    BackHandler.removeEventListener = () => { };
  }
 },[])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={color.white}
      />
      <StackNavigation />
      <FlashMessage position="top" />
      <Loader visible={loaderVisible} />
      {/* { loaderVisible &&<ActivityIndicator size={'large'} color={'white'}/>} */}
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


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Tts from 'react-native-tts';

// const OnboardingVoiceDemo = () => {
//   const [step, setStep] = useState(0);

//   useEffect(() => {
//     Tts.setDefaultLanguage('en-US');
//     speakStep(0);
//   }, []);

//   const speakStep = (stepNumber) => {
//     let message = '';

//     switch (stepNumber) {
//       case 0:
//         message = 'Hi Gandmaree. Welcome to the app.';
//         break;
//       case 1:
//         message = 'Click here to upload your store.';
//         break;
//       case 2:
//         message = 'Click here to explore the marketplace.';
//         break;
//       case 3:
//         message = 'Click here to search users.';
//         break;
//       default:
//         message = 'You are all set. Enjoy using the app!';
//     }

//     Tts.stop();
//     Tts.speak(message);
//   };

//   const handleNext = () => {
//     const nextStep = step + 1;
//     setStep(nextStep);
//     speakStep(nextStep);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Voice Onboarding Demo</Text>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>📤 Upload Store</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>🛒 Marketplace</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>🔍 Search Users</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//         <Text style={styles.nextText}>Next Instruction 🔊</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default OnboardingVoiceDemo;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#101820',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 22,
//     marginBottom: 30,
//     fontWeight: 'bold',
//   },
//   button: {
//     backgroundColor: '#1f2933',
//     padding: 15,
//     borderRadius: 10,
//     width: '100%',
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   nextButton: {
//     marginTop: 30,
//     backgroundColor: '#4f46e5',
//     padding: 15,
//     borderRadius: 10,
//     width: '100%',
//   },
//   nextText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
