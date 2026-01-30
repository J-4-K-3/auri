import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';
import { themeModeMap } from '../theme/tokens';
import './ThemeSwitcher.css';

const themeInfo = {
  light: {
    name: 'Light',
    description: 'Clean and bright',
  },
  dark: {
    name: 'Dark',
    description: 'Easy on the eyes',
  },
  amoled: {
    name: 'AMOLED',
    description: 'Pure black efficiency',
  },
  blush: {
    name: 'Blush',
    description: 'Soft and warm',
  },
  purple: {
    name: 'Purple',
    description: 'Mystical vibes',
  },
};

export const ThemeSwitcherPopup = ({ isVisible: externalIsVisible, onClose: externalOnClose }) => {
  const {
    hasSeenThemePopup,
    markThemePopupSeen,
    switchTheme,
    availableThemes,
    theme
  } = useTheme();

  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [internalIsVisible, setInternalIsVisible] = useState(!hasSeenThemePopup);

  // Use external visibility if provided, otherwise use internal
  const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible;
  const onClose = externalOnClose || (() => setInternalIsVisible(false));

  const handleChooseTheme = (themeName) => {
    switchTheme(themeName);
    onClose();
    if (!externalOnClose) markThemePopupSeen();
  };

  const handleClose = () => {
    onClose();
    if (!externalOnClose) markThemePopupSeen();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="theme-popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="theme-popup-container"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="theme-popup-header">
            <h2 className="theme-popup-title">Choose a Theme</h2>
            <p className="theme-popup-subtitle">
              Pick a look that matches your vibe
            </p>
          </div>

          <div className="theme-grid">
            {availableThemes.map((themeName) => {
              const themeData = themeModeMap[themeName];
              const info = themeInfo[themeName];
              const isSelected = selectedTheme === themeName;

              return (
                <motion.div
                  key={themeName}
                  className={`theme-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedTheme(themeName)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="theme-preview"
                    style={{
                      background: themeData.previewColor || themeData.background,
                    }}
                  >
                    <div
                      className="theme-preview-card"
                      style={{
                        background: themeData.card,
                        border: `1px solid ${themeData.border}`,
                      }}
                    >
                      <div
                        className="theme-preview-text"
                        style={{ color: themeData.text }}
                      >
                        Aa
                      </div>
                    </div>
                    <div
                      className="theme-preview-accent"
                      style={{
                        background: themeData.text,
                      }}
                    />
                  </div>
                  <div className="theme-info">
                    <h3 className="theme-name">{info.name}</h3>
                    <p className="theme-description">{info.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="theme-popup-actions">
            <motion.button
              className="theme-choose-btn"
              onClick={() => handleChooseTheme(selectedTheme)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Choose {themeInfo[selectedTheme]?.name}
            </motion.button>
            <button
              className="theme-skip-btn"
              onClick={handleClose}
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeSwitcherPopup;

