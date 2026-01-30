import { createContext, useContext, useState, useEffect } from 'react';
import { themeModeMap } from './tokens';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('auri-theme');
    if (savedTheme && themeModeMap[savedTheme]) {
      return savedTheme;
    }
    // Default to dark theme if no saved preference
    return 'dark';
  });

  const [hasSeenThemePopup, setHasSeenThemePopup] = useState(() => {
    const seen = localStorage.getItem('auri-theme-popup-seen');
    return seen === 'true';
  });

  const currentThemeData = themeModeMap[theme] || themeModeMap.dark;

  useEffect(() => {
    // Apply CSS custom properties
    const root = document.documentElement;
    
    // Apply colors
    root.style.setProperty('--theme-background', currentThemeData.background);
    root.style.setProperty('--theme-card', currentThemeData.card);
    root.style.setProperty('--theme-text', currentThemeData.text);
    root.style.setProperty('--theme-subText', currentThemeData.subText);
    root.style.setProperty('--theme-border', currentThemeData.border);
    root.style.setProperty('--theme-navBar', currentThemeData.navBar);
    
    // Apply fixed color values (not theme-dependent)
    root.style.setProperty('--blush', '#F76E8E');
    
    // Update status bar color via meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', currentThemeData.background);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'theme-color';
      newMeta.content = currentThemeData.background;
      document.head.appendChild(newMeta);
    }
    
    // Save to localStorage
    localStorage.setItem('auri-theme', theme);
  }, [theme, currentThemeData]);

  const switchTheme = (newTheme) => {
    if (themeModeMap[newTheme]) {
      setTheme(newTheme);
    }
  };

  const markThemePopupSeen = () => {
    setHasSeenThemePopup(true);
    localStorage.setItem('auri-theme-popup-seen', 'true');
  };

  const resetThemePopup = () => {
    setHasSeenThemePopup(false);
    localStorage.removeItem('auri-theme-popup-seen');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeData: currentThemeData,
        switchTheme,
        hasSeenThemePopup,
        markThemePopupSeen,
        resetThemePopup,
        availableThemes: Object.keys(themeModeMap),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

