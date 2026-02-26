import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiStar, FiGift } from 'react-icons/fi';
import '../styles/Navigation.css';

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/community', label: 'Community', icon: FiUsers },
    { path: '/support', label: 'Support', icon: FiGift },
    { path: '/reviews', label: 'Reviews', icon: FiStar },
    { path: '/terms', label: 'Legal', icon: FiFileText },
  ];

  return (
    <>
      <nav className="navigation">
        <div className="nav-container">
          <Link to="/" className="nav-wordmark">
            Auri
          </Link>

          <div className="nav-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </div>
    </>
  );
};
