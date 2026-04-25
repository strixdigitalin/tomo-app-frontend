import React from 'react';
import { StatusBar } from 'react-native';
import StackNavigation from './src/routes/StackNavigation/route';
import color from './src/common/Colors/colors';
import FlashMessage from 'react-native-flash-message';
import Loader from './src/components/Loader';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



const MainApp = () => {
  const loaderVisible = useSelector((state: any) => state?.loader?.loader);

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
    <SafeAreaProvider>
      <PaperProvider>
        <Provider store={store}>
          <MainApp />
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
