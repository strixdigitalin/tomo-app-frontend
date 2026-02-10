// import { Appearance } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setTheme, setSystemTheme, setThemeLoaded } from '../reducer/theme';
// import store from '../store';

// const { dispatch } = store;

// const THEME_STORAGE_KEY = '@app_theme';

// // Initialize theme
// export const initializeTheme = async () => {
//   try {
//     const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    
//     if (savedTheme !== null) {
//       const themeData = JSON.parse(savedTheme);
      
//       if (themeData.isSystemTheme) {
//         enableSystemTheme();
//       } else {
//         dispatch(setTheme(themeData.isDarkMode));
//       }
//     } else {
//       // If no saved theme, default to system theme
//       enableSystemTheme();
//     }
//   } catch (error) {
//     console.error('Error loading theme:', error);
//     enableSystemTheme(); // Fallback to system theme
//   }
// };

// // Toggle between light and dark mode
// export const toggleTheme = async () => {
//   const currentState = store.getState().theme;
//   const newIsDarkMode = !currentState.isDarkMode;
  
//   dispatch(setTheme(newIsDarkMode));
  
//   // Save to AsyncStorage
//   try {
//     await AsyncStorage.setItem(
//       THEME_STORAGE_KEY,
//       JSON.stringify({
//         isDarkMode: newIsDarkMode,
//         isSystemTheme: false,
//       })
//     );
//   } catch (error) {
//     console.error('Error saving theme:', error);
//   }
// };

// // Enable system theme
// export const enableSystemTheme = async () => {
//   const colorScheme = Appearance.getColorScheme();
//   const isDarkMode = colorScheme === 'dark';
  
//   dispatch(setSystemTheme(isDarkMode));
  
//   // Save to AsyncStorage
//   try {
//     await AsyncStorage.setItem(
//       THEME_STORAGE_KEY,
//       JSON.stringify({
//         isDarkMode,
//         isSystemTheme: true,
//       })
//     );
//   } catch (error) {
//     console.error('Error saving theme:', error);
//   }
  
//   // Set up listener for system theme changes
//   Appearance.addChangeListener(({ colorScheme }) => {
//     if (store.getState().theme.isSystemTheme) {
//       dispatch(setSystemTheme(colorScheme === 'dark'));
//     }
//   });
// };

// // Set specific theme
// export const setSpecificTheme = async (isDarkMode) => {
//   dispatch(setTheme(isDarkMode));
  
//   // Save to AsyncStorage
//   try {
//     await AsyncStorage.setItem(
//       THEME_STORAGE_KEY,
//       JSON.stringify({
//         isDarkMode,
//         isSystemTheme: false,
//       })
//     );
//   } catch (error) {
//     console.error('Error saving theme:', error);
//   }
// };






// redux/actions/themeActions.js
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  setTheme, 
  setSystemTheme, 
  setThemeLoaded,
  setColorTheme,
  setMessageCornerRadius,
  setFeedListView,
} from '../reducer/theme';
import store from '../store';

const { dispatch } = store;

const THEME_STORAGE_KEY = '@app_theme';
const COLOR_THEME_STORAGE_KEY = '@app_color_theme'; // Separate storage for color theme

// ✅ EXISTING FUNCTION - NO CHANGES
export const initializeTheme = async () => {
  try {
    // Load dark mode settings
    const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    
    if (savedTheme !== null) {
      const themeData = JSON.parse(savedTheme);
      
      if (themeData.isSystemTheme) {
        enableSystemTheme();
      } else {
        dispatch(setTheme(themeData.isDarkMode));
      }
    } else {
      enableSystemTheme();
    }
    
    // ✅ NEW - Load color theme settings (separate)
    const savedColorTheme = await AsyncStorage.getItem(COLOR_THEME_STORAGE_KEY);
    if (savedColorTheme !== null) {
      const colorThemeData = JSON.parse(savedColorTheme);
      
      if (colorThemeData.selectedColorTheme) {
        dispatch(setColorTheme(colorThemeData.selectedColorTheme));
      }
      if (colorThemeData.messageCornerRadius !== undefined) {
        dispatch(setMessageCornerRadius(colorThemeData.messageCornerRadius));
      }
      if (colorThemeData.feedListView) {
        dispatch(setFeedListView(colorThemeData.feedListView));
      }
    }
  } catch (error) {
    console.error('Error loading theme:', error);
    enableSystemTheme();
  }
};

// ✅ EXISTING FUNCTIONS - NO CHANGES
export const toggleTheme = async () => {
  const currentState = store.getState().theme;
  const newIsDarkMode = !currentState.isDarkMode;
  
  dispatch(setTheme(newIsDarkMode));
  
  try {
    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        isDarkMode: newIsDarkMode,
        isSystemTheme: false,
      })
    );
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const enableSystemTheme = async () => {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  dispatch(setSystemTheme(isDarkMode));
  
  try {
    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        isDarkMode,
        isSystemTheme: true,
      })
    );
  } catch (error) {
    console.error('Error saving theme:', error);
  }
  
  Appearance.addChangeListener(({ colorScheme }) => {
    if (store.getState().theme.isSystemTheme) {
      dispatch(setSystemTheme(colorScheme === 'dark'));
    }
  });
};

export const setSpecificTheme = async (isDarkMode) => {
  dispatch(setTheme(isDarkMode));
  
  try {
    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        isDarkMode,
        isSystemTheme: false,
      })
    );
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

// ✅ NEW FUNCTIONS - For Color Theme
const saveColorThemeToStorage = async () => {
  const currentState = store.getState().theme;
  
  try {
    await AsyncStorage.setItem(
      COLOR_THEME_STORAGE_KEY,
      JSON.stringify({
        selectedColorTheme: currentState.selectedColorTheme,
        messageCornerRadius: currentState.messageCornerRadius,
        feedListView: currentState.feedListView,
      })
    );
  } catch (error) {
    console.error('Error saving color theme:', error);
  }
};

export const updateColorTheme = async (themeId) => {
  dispatch(setColorTheme(themeId));
  await saveColorThemeToStorage();
};

export const updateMessageCornerRadius = async (radius) => {
  dispatch(setMessageCornerRadius(radius));
  await saveColorThemeToStorage();
};

export const updateFeedListView = async (viewType) => {
  dispatch(setFeedListView(viewType));
  await saveColorThemeToStorage();
};