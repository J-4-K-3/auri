import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTiktok, FaEnvelope, FaHeart, FaDiscord } from "react-icons/fa";
import { SurveyPopup } from './SurveyPopup';
import '../styles/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [surveyOpen, setSurveyOpen] = useState(false);

  return (
    <footer className="footer">
      {/* Survey Section 
      <div className="survey-section">
        <div className="survey-container">
          <p className="survey-text">
            Help us improve Auri! Spend just 1 minute answering 5 quick questions and get $2 transferred to your PayPal as a thank you.
          </p>
          <button className="survey-button" onClick={() => setSurveyOpen(true)}>
            Take Survey & Earn $2
          </button>
        </div>
      </div>*/}
      <div className="footer-content">
        {/* Logo and Brand Section */}
        <div className="footer-section footer-brand">
          <img src="/auri_logo.png" alt="Auri Logo" className="footer-logo" />
          <p className="footer-tagline">A calm place to share your world</p>
          <p className="footer-mission">Building peaceful social connections</p>
        </div>

        {/* Company Info */}
        <div className="footer-section footer-company">
          <h4>Company</h4>
          <div className="company-info">
            <p className="company-name">Innoxation Tech Inc</p>
            <p className="copyright">&copy; {currentYear} All rights reserved.</p>
            <p className="footer-meta">Version 2.0</p>
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

        {/* Resources 
        <div className="footer-section footer-resources">
          <h4>Resources</h4>
          <div className="footer-resources-links">
            <Link to="/" className="footer-link">Help Center</Link>
            <Link to="/terms" className="footer-link">FAQ</Link>
            <Link to="/community" className="footer-link">Community Guidelines</Link>
            <Link to="/reviews" className="footer-link">User Feedback</Link>
          </div>
        </div>*/}
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
      <SurveyPopup isOpen={surveyOpen} onClose={() => setSurveyOpen(false)} />
    </footer>
  );
};
