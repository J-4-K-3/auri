import React from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";
import DownloadModal from "./DownloadModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../lib/Chatbot";

export const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Critical styles to ensure buttons work correctly
  const criticalStyles = `
    .review-btn {
      background: linear-gradient(135deg, #667eea, #764ba2) !important;
      color: white !important;
      border: none !important;
      padding: 14px 32px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      cursor: pointer !important;
      position: relative !important;
      overflow: hidden !important;
      display: inline-block !important;
      text-decoration: none !important;
      outline: none !important;
    }
    
    .review-btn:hover {
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
      transform: translateY(-2px) !important;
      background: linear-gradient(135deg, #7c8df5, #8a5bc0) !important;
    }
    
    .review-btn:active {
      transform: translateY(0px) !important;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
    }

    /* Ensure modal styles work */
    .modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(0, 0, 0, 0.8) !important;
      backdrop-filter: blur(8px) !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      z-index: 1000 !important;
      padding: 20px !important;
      animation: fadeIn 0.3s ease-out !important;
    }

    .preview-modal {
      background: linear-gradient(135deg, #1a1f35 0%, #2d3748 50%, #1e293b 100%) !important;
      border-radius: 20px !important;
      padding: 0 !important;
      max-width: 500px !important;
      width: 100% !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      position: relative !important;
      overflow: hidden !important;
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }

    .preview-modal-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 28px 28px 20px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      margin-bottom: 0 !important;
      position: relative !important;
    }

    .preview-modal-content {
      padding: 24px 28px 28px !important;
    }

    .modal-close {
      background: rgba(255, 255, 255, 0.08) !important;
      border: none !important;
      color: rgba(255, 255, 255, 0.7) !important;
      font-size: 24px !important;
      cursor: pointer !important;
      padding: 8px !important;
      width: 40px !important;
      height: 40px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 12px !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .understood-btn {
      background: linear-gradient(135deg, #4ECDC4, #44A08D) !important;
      color: white !important;
      border: none !important;
      padding: 16px 32px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      border-radius: 12px !important;
      width: 100% !important;
      cursor: pointer !important;
      box-shadow: 0 4px 16px rgba(78, 205, 196, 0.3) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      position: relative !important;
      overflow: hidden !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }
  `;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
      <motion.div
        className="home-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="home-content" variants={itemVariants}>
          {/* Chatbot Section */}
          <motion.div className="chatbot-section" variants={itemVariants} style={{ minHeight: '100vh', position: 'relative' }}>
            <Chatbot />
          </motion.div>

          {/* Intro Section - Hero */}
          <motion.div className="intro-section" variants={itemVariants}>
            <h2 className="intro-title">Welcome to Auri 🌟</h2>
            <p className="intro-text">
              A calm space for real connections.
            </p>
            <p className="intro-description">
              Auri is a friendly space where you can share moments and connect with people who get you. No drama, no stress - just genuine interactions with friends old and new.
            </p>
            <p className="intro-description">
              Auri (pronounced "Ari") is a chill space where real connections happen. No endless scrolling, no drama, no algorithms pushing content you don't care about. Just genuine people sharing moments and building friendships. Think of it as your happy place online.
              </p>
            <div className="intro-buttons">
              <motion.button
                className="intro-btn community-btn"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/community")}
              >
                Visit Community
              </motion.button>
              <motion.button
                className="intro-btn primary-btn"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://auri-platform.vercel.app', '_blank')}
              >
                Visit Auri
              </motion.button>
              <motion.button
                className="intro-btn download-btn"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
              >
                Download APK
              </motion.button>
            </div>
            <p className="button-explanations">
              Check out our Community to see what people are sharing. Explore Auri for the full experience. Or download our app to stay connected wherever you go.
            </p>
          </motion.div>

          {/* Image Gallery Section */}
          <motion.div className="gallery-section" variants={itemVariants}>
            <div className="gallery-images">
              <img src="/splash-portrait.png" alt="Auri member" className="gallery-image" />
              <img src="/onboard-portrait.png" alt="Auri member" className="gallery-image" />
              <img src="/home-portrait.png" alt="Auri member" className="gallery-image" />
              <img src="/reels.png" alt="Auri member" className="gallery-image" />
              <img src="/profile-portrait.png" alt="Auri member" className="gallery-image" />
            </div>
            <p className="intro-description" style={{ marginTop: 15 }}>
              Beautiful UI that's not just about looking pretty. It's about creating connections that make you feel like you're in a safe, warm place.
            </p>
          </motion.div>

          {/* Coming Soon - New Features Section */}
          <motion.div className="coming-soon-section" variants={itemVariants}>
            <div className="coming-soon-header">
              <h2 className="coming-soon-title">WELCOMING SOON</h2>
            </div>
            <p className="coming-soon-subtitle">
              Cool new features are coming soon! Here's what's in the works:
            </p>
            <div className="coming-soon-grid">
              <div className="coming-soon-card">
                <img src="/shopping_bags_3d.png" alt="In-App Shop" className="coming-soon-card-icon" />
                <h3>In-App Shop</h3>
                <p>Discover and purchase unique products directly within Auri. Support creators and find items you love!</p>
                <div className="coming-soon-badge hot">OPENING SOON</div>
              </div>
              <div className="coming-soon-card featured">
                <img src="/department_store_3d.png" alt="Seller Portal" className="coming-soon-card-icon" />
                <h3>Seller Portal</h3>
                <p>Start your own shop within Auri! Reach thousands of community members and turn your passion into profit.</p>
                <div className="coming-soon-badge hot">BECOME A SELLER</div>
              </div>
              <div className="coming-soon-card featured">
                <img src="/convenience_store_3d.png" alt="Seller Mini" className="coming-soon-card-icon" />
                <h3>Seller Mini</h3>
                <p>Turn your digital goods and services into income. Sell at your own pace and unlock new opportunities for yourself and others!</p>
                <div className="coming-soon-badge hot">BE A MINI</div>
              </div>
              <div className="coming-soon-card featured">
                <img src="/artist_palette_3d.png" alt="Enhanced Customization" className="coming-soon-card-icon" />
                <h3>Enhanced Customization</h3>
                <p>More themes, layouts, and personalization options to make Auri truly yours!</p>
                <div className="coming-soon-badge hot">NEW FEATURES</div>
              </div>
              <div className="coming-soon-card">
                <img src="/locked_3d.png" alt="Enhanced Privacy" className="coming-soon-card-icon" />
                <h3>Enhanced Privacy</h3>
                <p>New privacy controls to give you more control over your data and who sees your content.</p>
                <div className="coming-soon-badge">SECURE</div>
              </div>
              <div className="coming-soon-card">
                <img src="/camera_3d.png" alt="In-App Camera" className="coming-soon-card-icon" />
                <h3>In-App Camera</h3>
                <p>Take photos and videos right within Auri! Built-in camera for capturing moments instantly.</p>
                <div className="coming-soon-badge">NEW CAMERA</div>
              </div>
              <div className="coming-soon-card featured">
                <img src="/globe_with_meridians_3d.png" alt="Web Experience" className="coming-soon-card-icon" />
                <h3>Web Experience</h3>
                <p>Full Auri experience coming to desktop browsers - access Auri from anywhere!</p>
                <div className="coming-soon-badge">GO TO AURI</div>
              </div>
            </div>
          </motion.div>

          {/* Mini Games Section - Coming Soon */}
          <motion.div className="mini-games-section" variants={itemVariants}>
            <div className="mini-games-header">
              <span className="mini-games-emoji">🎮</span>
              <h2 className="mini-games-title">FUN REWARDS</h2>
              <span className="mini-games-emoji">🎁</span>
            </div>
            <p className="mini-games-subtitle">
              Play mini-games for fun and earn small rewards as a thank you for being part of our growing community!
            </p>
            <div className="mini-games-grid">
              <div className="mini-games-card">
                <div className="mini-games-card-icon">🎲</div>
                <h3>Play for Fun</h3>
                <p>Enjoy simple, relaxing mini-games designed for entertainment and a quick break from the day.</p>
                <div className="mini-games-badge hot">JUST FOR FUN</div>
              </div>
              <div className="mini-games-card">
                <div className="mini-games-card-icon">💝</div>
                <h3>Earn Small Rewards</h3>
                <p>As a token of appreciation, earn $0.50 via PayPal for your time and participation.</p>
                <div className="mini-games-badge">THANK YOU GIFTS</div>
              </div>
              <div className="mini-games-card">
                <div className="mini-games-card-icon">🌱</div>
                <h3>Grow Together</h3>
                <p>The more our community grows, the more rewards and features we'll be able to share with you!</p>
                <div className="mini-games-badge">BUILDING TOGETHER</div>
              </div>
            </div>
            <p className="mini-games-note">
              🎯 This is our way of saying thanks for being here. No promises, just genuine appreciation for our Auri community! 💙
            </p>
          </motion.div>

          {/* Auri Connections Section - Available Now */}
          <motion.div className="connections-section" variants={itemVariants}>
            <div className="connections-card">
              <h2>Auri Connections</h2>
              <p className="connections-intro">
                Your inner circle, all in one place.
              </p>
              <div className="connections-features">
                <div className="connection-feature">
                  <span className="connection-feature-icon">🛒</span>
                  <div className="connection-feature-text">
                    <h4>Borrow to Shop</h4>
                    <p>Need cash now? Ask friends or family for help, then pay them back when you can.</p>
                  </div>
                </div>
                <div className="connection-feature">
                  <span className="connection-feature-icon">🔐</span>
                  <div className="connection-feature-text">
                    <h4>Secure Verification</h4>
                    <p>Forgot your password? Friends and family can vouch for you so you can get back in.</p>
                  </div>
                </div>
                <div className="connection-feature">
                  <span className="connection-feature-icon">💬</span>
                  <div className="connection-feature-text">
                    <h4>Stay Connected</h4>
                    <p>Share moments, send invites, and keep up with the people you care about.</p>
                  </div>
                </div>
              </div>
              <p className="connections-cta">
                Link up with your closest friends and family for a cozy and safe space to meet! ❤️
              </p>
            </div>
          </motion.div>
          
          {/* Giveaway Celebration Section */}
          <motion.div className="giveaway-section" variants={itemVariants}>
            <div className="giveaway-header">
              <span className="giveaway-emoji">🎉</span>
              <h2 className="giveaway-title">EXCLUSIVE GIVEAWAY!</h2>
              <span className="giveaway-emoji">🎉</span>
            </div>
            <p className="giveaway-subtitle">
              🎁 Celebrate with us! As a token of appreciation for joining our community, we're excited to reward our members with exclusive perks.
            </p>
            <div className="giveaway-grid">
              <div className="giveaway-card featured">
                <div className="giveaway-card-icon">🎰</div>
                <h3>Random Selection</h3>
                <p>Selected participants will receive unique rewards and benefits. Purely our way of showing gratitude!</p>
                <div className="giveaway-badge hot">NO CATCH!</div>
              </div>
              <div className="giveaway-card">
                <div className="giveaway-card-icon">🎭</div>
                <h3>Community Talent Show</h3>
                <p>Showcase your talents and shine within our community. Let your unique skills take center stage.</p>
                <div className="giveaway-badge">SHOW YOUR TALENT</div>
              </div>
            </div>
            <p className="giveaway-note">
              ⏰ This exclusive opportunity is time-limited. Secure your chance before it ends around 8 months from now.
            </p>
            <div className="giveaway-cta">
              <p>Become part of our thriving community and join the celebration! 🎊</p>
            </div>
          </motion.div>

          {/* Community Thresholds Section */}
          <motion.div className="thresholds-section" variants={itemVariants}>
            <div className="thresholds-header">
              <h2>Unlock Auri's Full Experience</h2>
            </div>
            <p className="thresholds-intro">
              New features unlock as our community grows! Join us and help reach these goals together.
            </p>
            <div className="thresholds-grid">
              <div className="threshold-item">
                <div className="threshold-number">150</div>
                <div className="threshold-feature">New Emoji Collection</div>
                <div className="threshold-desc">
                  Express yourself with Auri's emoji packs
                </div>
                <div className="threshold-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>
                  <span className="progress-text">number of community needed</span>
                </div>
              </div>
              <div className="threshold-item">
                <div className="threshold-number">200</div>
                <div className="threshold-feature">In-app Camera Tools</div>
                <div className="threshold-desc">
                  Built-in editing & creative photography features
                </div>
                <div className="threshold-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '34%' }}></div>
                  </div>
                  <span className="progress-text">number of community needed</span>
                </div>
              </div>
              <div className="threshold-item">
                <div className="threshold-number">300</div>
                <div className="threshold-feature">Live Streaming</div>
                <div className="threshold-desc">Share moments in real-time</div>
                <div className="threshold-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '23%' }}></div>
                  </div>
                  <span className="progress-text">number of community needed</span>
                </div>
              </div>
            </div>
            <p className="thresholds-cta">
              Be part of our community and help us unlock these exciting features together! 💙
            </p>
          </motion.div>

          {/* Download Section */}
          <motion.div className="download-section" variants={itemVariants}>
            <div className="button-group">
              <motion.button
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  padding: "14px 32px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  display: "inline-block",
                  textDecoration: "none",
                  outline: "none",
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/reviews")}
              >
                Add your review
              </motion.button>
            </div>
          </motion.div>

          {/* Final Tagline */}
          <motion.div className="home-tagline" variants={itemVariants}>
            <p>
              <em>"A calm place to share your world."</em>
            </p>
          </motion.div>

          <DownloadModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            downloadUrl="https://i.apponthego.com/1e8f9"
          />
        </motion.div>
      </motion.div>
    </>
  );
};
