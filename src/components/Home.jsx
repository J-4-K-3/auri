import React from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";
import DownloadModal from "./DownloadModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../lib/Chatbot";
import { SurveyPopup } from "./SurveyPopup";
import { isSurveyCompleted } from "../lib/Appwrite";

export const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSurveyCompleted()) {
        setSurveyOpen(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container">
          <motion.div className="hero-content" variants={itemVariants}>
            <div className="hero-badge">✨ Welcome to Auri</div>
            <h1 className="hero-title">
              A Calm Place to <span className="gradient-text">Share Your World</span>
            </h1>
            <p className="hero-subtitle">
              Auri (pronounced "Ari") is a chill space where real connections happen. No endless scrolling, no drama, no algorithms. Just genuine people sharing moments.
            </p>
            <div className="hero-actions">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://auri-platform.vercel.app', '_blank')}
              >
                Launch App
              </motion.button>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = 'https://github.com/J-4-K-3/auri/releases/download/app/auri_v2.1.apk';
                  link.download = 'https://github.com/J-4-K-3/auri/releases/download/app/auri_v2.1.apk';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download APK
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div className="hero-visual" variants={itemVariants}>
             <div className="chatbot-wrapper glass-card">
               <Chatbot />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="section-container">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">Designed for <span className="gradient-text">Connection</span></h2>
            <p className="section-subtitle">Experience a social space that values your peace of mind.</p>
          </motion.div>
          <div className="gallery-grid">
            {['/splash-portrait.png', '/onboard-portrait.png', '/home-portrait.png', '/reels.png', '/profile-portrait.png'].map((src, i) => (
              <motion.div 
                key={src} 
                className="gallery-item glass-card"
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <img src={src} alt={`Auri Interface ${i + 1}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="features-section">
        <div className="section-container">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">Welcoming <span className="gradient-text">Soon</span></h2>
            <p className="section-subtitle">Exciting new ways to interact and grow within the community.</p>
          </motion.div>
          
          <div className="bento-grid">
            <motion.div className="bento-card glass-card span-2" variants={itemVariants}>
              <div className="card-content">
                <img src="/shopping_bags_3d.png" alt="" className="card-icon" />
                <h3>In-App Shop</h3>
                <p>Discover and purchase unique products directly within Auri. Support creators and find items you love!</p>
                <span className="badge">Opening Soon</span>
              </div>
            </motion.div>
            
            <motion.div className="bento-card glass-card" variants={itemVariants}>
              <div className="card-content">
                <img src="/department_store_3d.png" alt="" className="card-icon" />
                <h3>Seller Portal</h3>
                <p>Turn your passion into profit by reaching community members.</p>
                <span className="badge hot">Become a Seller</span>
              </div>
            </motion.div>

            <motion.div className="bento-card glass-card" variants={itemVariants}>
              <div className="card-content">
                <img src="/convenience_store_3d.png" alt="" className="card-icon" />
                <h3>Seller Mini</h3>
                <p>Sell digital goods and services at your own pace.</p>
              </div>
            </motion.div>

            <motion.div className="bento-card glass-card span-2" variants={itemVariants}>
              <div className="card-content">
                <img src="/artist_palette_3d.png" alt="" className="card-icon" />
                <h3>Enhanced Customization</h3>
                <p>More themes, layouts, and personalization options to make Auri truly yours!</p>
                <span className="badge">New Features</span>
              </div>
            </motion.div>

            <motion.div className="bento-card glass-card" variants={itemVariants}>
              <div className="card-content">
                <img src="/locked_3d.png" alt="" className="card-icon" />
                <h3>Privacy</h3>
                <p>Advanced controls over your data and visibility.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connections Section */}
      <section className="connections-section">
        <div className="section-container">
          <motion.div className="connections-wrapper glass-card" variants={itemVariants}>
            <div className="connections-info">
              <h2 className="section-title">Auri <span className="gradient-text">Connections</span></h2>
              <p className="section-subtitle">Your inner circle, all in one place.</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">🛒</div>
                  <div>
                    <h4>Borrow to Shop</h4>
                    <p>Need cash now? Ask friends or family for help safely.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔐</div>
                  <div>
                    <h4>Secure Verification</h4>
                    <p>Friends and family can vouch for you to recover access.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="connections-cta-box">
               <p>Link up with your closest friends and family for a cozy and safe space to meet! ❤️</p>
               <motion.button 
                 className="btn-primary"
                 onClick={() => navigate("/community")}
               >
                 Explore Community
               </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="rewards-section">
        <div className="section-container">
          <motion.div className="rewards-card glass-card" variants={itemVariants}>
             <div className="rewards-header">
               <span className="emoji">🎮</span>
               <h2>Fun Rewards</h2>
               <span className="emoji">🎁</span>
             </div>
             <p>Play mini-games for fun and earn small rewards as a thank you for being part of our community!</p>
             <div className="rewards-grid">
               <div className="reward-item">
                 <h3>Play for Fun</h3>
                 <p>Relaxing games for a quick break.</p>
               </div>
               <div className="reward-item">
                 <h3>Earn Rewards</h3>
                 <p>Small tokens of appreciation ($0.50 via PayPal).</p>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Giveaway Section */}
      <section className="giveaway-section">
        <div className="section-container">
          <motion.div className="giveaway-banner glass-card" variants={itemVariants}>
            <div className="giveaway-content">
              <h2>🎉 Exclusive Giveaway!</h2>
              <p>We're celebrating our community growth with special rewards.</p>
              <div className="giveaway-steps">
                <div className="step">
                  <span className="step-num">1</span>
                  <p>Download Auri</p>
                </div>
                <div className="step">
                  <span className="step-num">2</span>
                  <p>Join Community</p>
                </div>
                <div className="step">
                  <span className="step-num">3</span>
                  <p>Win Rewards</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {modalOpen && <DownloadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
      <SurveyPopup isOpen={surveyOpen} onClose={() => setSurveyOpen(false)} />
    </motion.div>
  );
};
