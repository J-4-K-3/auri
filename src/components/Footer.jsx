import React from 'react';
import { Link } from 'react-router-dom';
import { FaTiktok, FaEnvelope, FaHeart, FaDiscord } from "react-icons/fa";
import '../styles/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo and Brand Section */}
        <div className="footer-section footer-brand">
          <img src="/auri_logo.png" alt="Auri Logo" className="footer-logo" />
          <p className="footer-tagline">A calm place to share your world</p>
          <p className="footer-mission">Building peaceful social connections</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-section footer-nav">
          <h4>Navigation</h4>
          <nav className="footer-nav-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/community" className="footer-link">Community</Link>
            <Link to="/download" className="footer-link">Download</Link>
            <Link to="/reviews" className="footer-link">Reviews</Link>
            <Link to="/terms" className="footer-link">Terms</Link>
          </nav>
        </div>

        {/* Company Info */}
        <div className="footer-section footer-company">
          <h4>Company</h4>
          <div className="company-info">
            <p className="company-name">Innoxation Tech Inc</p>
            <p className="copyright">&copy; {currentYear} All rights reserved.</p>
            <p className="footer-meta">Version 1.0</p>
            <p className="footer-support">
              Support: <a className="footer-support-link" href="mailto:innoxation.tech@gmail.com">innoxation.tech@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Social Media & Community */}
        <div className="footer-section footer-social">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="https://tiktok.com/@auri_plat_form" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTiktok size={20} />
              <span>TikTok</span>
            </a>
            <a href="https://apkpure.com/p/com.jake285.Auri#google_vignette" target="_blank" rel="noopener noreferrer" className="social-link">
              <img src="/auri_logo.png" alt="Auri Logo" width="20" height="20" style={{ borderRadius: 10 }} />
              <span>Auri</span>
            </a>
            <a target="_blank" rel="noopener noreferrer" className="social-link" style={{ opacity: 0.5 }}>
              <FaDiscord size={20} />
              <span>Discord - coming soon</span>
            </a>
            <a href="mailto:innoxation.tech@gmail.com" className="social-link">
              <FaEnvelope size={20} />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-made-with">
            Made with <FaHeart className="heart-icon" /> for peaceful connections
          </p>
          <div className="footer-bottom-links">
            <Link to="/terms" className="footer-bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
            <span className="footer-bottom-separator">•</span>
            <span className="footer-build-info">Built for calm communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
