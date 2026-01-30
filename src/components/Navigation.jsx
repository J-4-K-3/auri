import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiUsers, FiFileText, FiStar } from 'react-icons/fi';
import '../styles/Navigation.css';

export const Navigation = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide bottom nav
        setShowBottomNav(false);
      } else {
        // Scrolling up - show bottom nav
        setShowBottomNav(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/community', label: 'Community', icon: FiUsers },
    { path: '/support', label: 'Support', icon: FiFileText },
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

      <AnimatePresence>
        {showBottomNav && (
          <motion.div
            className="bottom-nav"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`bottom-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
