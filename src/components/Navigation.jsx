import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiUsers, FiFileText, FiStar, FiSun, FiGift, FiPlus } from 'react-icons/fi';
import '../styles/Navigation.css';
import ThemeSwitcherPopup from './ThemeSwitcherPopup';

export const Navigation = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showThemePopup, setShowThemePopup] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY.current;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (scrollDelta > 5 && !isCollapsed && currentScrollY > 50) {
      setIsCollapsed(true);
    } else if (scrollDelta < -5 && isCollapsed) {
      setIsCollapsed(false);
    } else if (currentScrollY < 50 && isCollapsed) {
      setIsCollapsed(false);
    }

    lastScrollY.current = currentScrollY;

    scrollTimeoutRef.current = setTimeout(() => {
    }, 150);
  }, [isCollapsed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/community', label: 'Community', icon: FiUsers },
    { path: '/support', label: 'Support', icon: FiGift },
    { path: '/terms', label: 'Legal', icon: FiFileText },
    { path: '/reviews', label: 'Reviews', icon: FiStar },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-wordmark">
          Auri
        </Link>
        <button
          className="theme-toggle-btn"
          onClick={() => setShowThemePopup(true)}
          aria-label="Switch theme"
        >
          <FiSun size={20} color="#FF8A65" />
        </button>
        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <div className="nav-menu">
          {navItems.map((item) => (
            <motion.div key={item.path} className="nav-item-wrapper">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
              {isActive(item.path) && (
                <motion.div
                  className="nav-underline"
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mobile-nav-inner">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link mobile ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`bottom-nav ${isCollapsed ? 'collapsed' : 'expanded'}`}
        onClick={() => {
          if (isCollapsed) setIsCollapsed(false);
        }}
        initial={false}
        animate={{
          width: isCollapsed ? 56 : 'auto',
          height: isCollapsed ? 56 : 'auto',
          borderRadius: isCollapsed ? 50 : 16,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <motion.button
          className="fab-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(false);
          }}
        >
          <FiPlus size={24} />
        </motion.button>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon size={26} />
            </Link>
          );
        })}
      </motion.div>

      <ThemeSwitcherPopup
        isVisible={showThemePopup}
        onClose={() => setShowThemePopup(false)}
      />
    </nav>
  );
};

