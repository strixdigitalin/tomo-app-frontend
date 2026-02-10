// import { createSlice } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const THEME_STORAGE_KEY = '@app_theme';

// export const themeSlice = createSlice({
//   name: 'theme',
//   initialState: {
//     isDarkMode: false,
//     isSystemTheme: true, // Track if we're using system theme
//     themeLoaded: false, // Track if theme has been loaded from storage
//   },
//   reducers: {
//     setTheme(state, action) {
//       return {
//         ...state,
//         isDarkMode: action.payload,
//         isSystemTheme: false,
//         themeLoaded: true,
//       };
//     },
//     setSystemTheme(state, action) {
//       return {
//         ...state,
//         isDarkMode: action.payload,
//         isSystemTheme: true,
//         themeLoaded: true,
//       };
//     },
//     setThemeLoaded(state, action) {
//       return {
//         ...state,
//         themeLoaded: action.payload,
//       };
//     },
//   },
// });

// export const { setTheme, setSystemTheme, setThemeLoaded } = themeSlice.actions;

// export default themeSlice.reducer;


// redux/reducer/theme.js
import { createSlice } from '@reduxjs/toolkit';

// Predefined color themes
const PREDEFINED_THEMES = {
  default: { 
    id: 'default',
    name: 'Default', 
    primary: '#1877f2', 
    secondary: '#E8F5E9',
    accent: '#1877f2'
  },
  nature: { 
    id: 'nature',
    name: 'Nature', 
    primary: '#4CAF50', 
    secondary: '#C8E6C9',
    accent: '#4CAF50'
  },
  ocean: { 
    id: 'ocean',
    name: 'Ocean', 
    primary: '#03A9F4', 
    secondary: '#B3E5FC',
    accent: '#03A9F4'
  },
  sunset: { 
    id: 'sunset',
    name: 'Sunset', 
    primary: '#FF9800', 
    secondary: '#FFE0B2',
    accent: '#FF9800'
  },
  royal: { 
    id: 'royal',
    name: 'Royal', 
    primary: '#9C27B0', 
    secondary: '#E1BEE7',
    accent: '#9C27B0'
  },
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    // ✅ EXISTING - Dark Mode (DON'T TOUCH)
    isDarkMode: false,
    isSystemTheme: true,
    themeLoaded: false,
    
    // ✅ NEW - Color Theme (ONLY ADDITION)
    selectedColorTheme: 'default', // 'default', 'nature', 'ocean', etc.
    messageCornerRadius: 12, // 4-24
    feedListView: 'two-lines', // 'two-lines' or 'three-lines'
  },
  reducers: {
    // ✅ EXISTING REDUCERS - NO CHANGES
    setTheme(state, action) {
      return {
        ...state,
        isDarkMode: action.payload,
        isSystemTheme: false,
        themeLoaded: true,
      };
    },
    setSystemTheme(state, action) {
      return {
        ...state,
        isDarkMode: action.payload,
        isSystemTheme: true,
        themeLoaded: true,
      };
    },
    setThemeLoaded(state, action) {
      return {
        ...state,
        themeLoaded: action.payload,
      };
    },
    
    // ✅ NEW REDUCERS - FOR COLOR THEME
    setColorTheme(state, action) {
      state.selectedColorTheme = action.payload;
    },
    setMessageCornerRadius(state, action) {
      state.messageCornerRadius = action.payload;
    },
    setFeedListView(state, action) {
      state.feedListView = action.payload;
    },
  },
});

export const {
  setTheme,
  setSystemTheme,
  setThemeLoaded,
  setColorTheme,
  setMessageCornerRadius,
  setFeedListView,
} = themeSlice.actions;

export const THEMES = PREDEFINED_THEMES;

export default themeSlice.reducer;