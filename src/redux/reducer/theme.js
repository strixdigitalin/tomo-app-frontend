import { createSlice } from '@reduxjs/toolkit';

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
  pink: {
    id: 'pink',
    name: 'Pink',
    primary: '#EC4899',
    secondary: '#F9A8D4',
    accent: '#EC4899'
  },
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    // ── Existing ──────────────────────────────
    isDarkMode: false,
    isSystemTheme: true,
    themeLoaded: false,
    selectedColorTheme: 'default',
    messageCornerRadius: 12,
    feedListView: 'two-lines',

    // ── New ───────────────────────────────────
    screenshotProtection: false,
  },
  reducers: {
    // ── Existing reducers (untouched) ─────────
    setTheme(state, action) {
      return { ...state, isDarkMode: action.payload, isSystemTheme: false, themeLoaded: true };
    },
    setSystemTheme(state, action) {
      return { ...state, isDarkMode: action.payload, isSystemTheme: true, themeLoaded: true };
    },
    setThemeLoaded(state, action) {
      return { ...state, themeLoaded: action.payload };
    },
    setColorTheme(state, action) {
      state.selectedColorTheme = action.payload;
    },
    setMessageCornerRadius(state, action) {
      state.messageCornerRadius = action.payload;
    },
    setFeedListView(state, action) {
      state.feedListView = action.payload;
    },

    // ── New reducer ───────────────────────────
    setScreenshotProtection(state, action) {
      state.screenshotProtection = action.payload;
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
  setScreenshotProtection,   // ← new export
} = themeSlice.actions;

export const THEMES = PREDEFINED_THEMES;

export default themeSlice.reducer;