import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  setTheme, 
  setSystemTheme, 
  setThemeLoaded,
  setColorTheme,
  setMessageCornerRadius,
  setFeedListView,
  setScreenshotProtection,   // ← new import
} from '../reducer/theme';
import store from '../store';

const { dispatch } = store;

const THEME_STORAGE_KEY       = '@app_theme';
const COLOR_THEME_STORAGE_KEY = '@app_color_theme';
const SCREENSHOT_STORAGE_KEY  = '@app_screenshot_protection'; // ← new key

// ── Existing: initializeTheme ────────────────────────────────────────────────
export const initializeTheme = async () => {
  try {
    // Dark mode
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

    // Color theme
    const savedColorTheme = await AsyncStorage.getItem(COLOR_THEME_STORAGE_KEY);
    if (savedColorTheme !== null) {
      const colorThemeData = JSON.parse(savedColorTheme);
      if (colorThemeData.selectedColorTheme) dispatch(setColorTheme(colorThemeData.selectedColorTheme));
      if (colorThemeData.messageCornerRadius !== undefined) dispatch(setMessageCornerRadius(colorThemeData.messageCornerRadius));
      if (colorThemeData.feedListView) dispatch(setFeedListView(colorThemeData.feedListView));
    }

    // ── New: Screenshot protection ───────────────────────────────────────────
    const savedScreenshot = await AsyncStorage.getItem(SCREENSHOT_STORAGE_KEY);
    if (savedScreenshot !== null) {
      const { enabled } = JSON.parse(savedScreenshot);
      dispatch(setScreenshotProtection(!!enabled));
    }

  } catch (error) {
    console.error('Error loading theme:', error);
    enableSystemTheme();
  }
};

// ── Existing functions (untouched) ───────────────────────────────────────────
export const toggleTheme = async () => {
  const currentState = store.getState().theme;
  const newIsDarkMode = !currentState.isDarkMode;
  dispatch(setTheme(newIsDarkMode));
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ isDarkMode: newIsDarkMode, isSystemTheme: false }));
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const enableSystemTheme = async () => {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  dispatch(setSystemTheme(isDarkMode));
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ isDarkMode, isSystemTheme: true }));
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
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ isDarkMode, isSystemTheme: false }));
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

const saveColorThemeToStorage = async () => {
  const currentState = store.getState().theme;
  try {
    await AsyncStorage.setItem(COLOR_THEME_STORAGE_KEY, JSON.stringify({
      selectedColorTheme:  currentState.selectedColorTheme,
      messageCornerRadius: currentState.messageCornerRadius,
      feedListView:        currentState.feedListView,
    }));
  } catch (error) {
    console.error('Error saving color theme:', error);
  }
};

export const updateColorTheme          = async (themeId) => { dispatch(setColorTheme(themeId));           await saveColorThemeToStorage(); };
export const updateMessageCornerRadius = async (radius)  => { dispatch(setMessageCornerRadius(radius));   await saveColorThemeToStorage(); };
export const updateFeedListView        = async (viewType)=> { dispatch(setFeedListView(viewType));        await saveColorThemeToStorage(); };

// ── New: update screenshot protection + persist ──────────────────────────────
export const updateScreenshotProtection = async (enabled) => {
  dispatch(setScreenshotProtection(enabled));
  try {
    await AsyncStorage.setItem(SCREENSHOT_STORAGE_KEY, JSON.stringify({ enabled }));
  } catch (error) {
    console.error('Error saving screenshot protection:', error);
  }
};