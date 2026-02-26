import React from 'react';
import { Link } from 'react-router-dom';
import { FaTiktok, FaEnvelope, FaHeart } from "react-icons/fa";
import '../styles/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <img src="/auri_logo.png" alt="Auri Logo" className="footer-logo" />
          <p className="footer-tagline">A calm place to share your world</p>
          <p className="footer-mission">Building peaceful social connections</p>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <div className="footer-nav-links">
            <p>Innoxation Tech Inc</p>
            <p>Version 2.0</p>
            <p>&copy; {currentYear}</p>
          </div>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://www.tiktok.com/@auri_platform_" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTiktok /> TikTok
            </a>
            <a href="mailto:innoxation.tech@gmail.com" className="social-link">
              <FaEnvelope /> Email Us
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Menu</h4>
          <div className="footer-nav-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/community" className="footer-link">Community</Link>
            <Link to="/support" className="footer-link">Support</Link>
            <Link to="/reviews" className="footer-link">Reviews</Link>
            <Link to="/terms" className="footer-link">Legal</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Made with <FaHeart className="heart-icon" /> for peaceful connections</p>
        <div className="footer-bottom-links">
          <Link to="/terms">Privacy</Link>
          <span style={{ margin: '0 8px' }}>•</span>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
};
