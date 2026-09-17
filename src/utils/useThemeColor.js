import { useSelector } from 'react-redux';
import { THEMES } from '../redux/reducer/theme';

// The app's user-selected accent color (Settings → Theme), not the static
// App_Primary_color constant — buttons/accents should follow whatever the
// user picked, everywhere.
const useThemeColor = () => {
    const { isDarkMode, selectedColorTheme } = useSelector(state => state.theme);
    const currentTheme = THEMES[selectedColorTheme] || THEMES.default;
    return { isDarkMode, primaryColor: currentTheme.primary, secondaryColor: currentTheme.secondary, currentTheme };
};

export default useThemeColor;
