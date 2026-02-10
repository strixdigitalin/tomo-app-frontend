// hooks/useTheme.js
import { useSelector } from 'react-redux';
import { THEMES } from '../redux/reducer/theme';

export const useTheme = () => {
  const theme = useSelector(state => state.theme);
  
  // Get current color theme
  const currentTheme = THEMES[theme.selectedColorTheme] || THEMES.default;
  
  // ✅ Returns both isDarkMode AND color theme
  return {
    // Dark Mode (existing)
    isDarkMode: theme.isDarkMode,
    isSystemTheme: theme.isSystemTheme,
    
    // Color Theme (new)
    selectedColorTheme: theme.selectedColorTheme,
    primaryColor: currentTheme.primary,
    secondaryColor: currentTheme.secondary,
    accentColor: currentTheme.accent,
    
    // UI Settings
    messageCornerRadius: theme.messageCornerRadius,
    feedListView: theme.feedListView,
    
    // Helper function to get background color
    getBackgroundColor: () => {
      return theme.isDarkMode ? 'black' : '#f0f2f5';
    },
    
    // Helper function to get card background
    getCardBackground: () => {
      return theme.isDarkMode ? '#252525' : 'white';
    },
    
    // Helper function to get text color
    getTextColor: () => {
      return theme.isDarkMode ? 'white' : 'black';
    },
    
    // Helper function to get secondary text color
    getSecondaryTextColor: () => {
      return theme.isDarkMode ? '#b0b3b8' : '#65676b';
    },
  };
};