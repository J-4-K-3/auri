import React from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";
import DownloadModal from "./DownloadModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
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
          {/* Hero Section */}
          <div className="hero-layout">
            <motion.div className="hero-text" variants={itemVariants}>
              <h2>Welcome to Auri</h2>
              <p className="tagline">A calm place to share your world.</p>
              <p className="description">
                Escape the chaos of traditional social media and discover a
                peaceful sanctuary where meaningful connections flourish. Share
                authentic moments, connect with like-minded people, and build
                genuine relationships in a space designed for calm, mindful
                interaction.
              </p>
              <div className="hero-buttons">
                <motion.button
                  className="community-btn"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/community")}
                >
                  Check out the Community
                </motion.button>
                <motion.button
                  className="preview-btn"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreviewModalOpen(true)}
                >
                  Preview Real App
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="phone-mockups" variants={itemVariants}>
              <img
                src="/home-portrait.png"
                alt="Auri Home Screen 2"
                className="phone-mockup"
              />
              <img
                src="/profile-portrait.png"
                alt="Auri Profile Screen"
                className="phone-mockup"
              />
            </motion.div>
          </div>

          {/* Features Grid Section */}
          <motion.div className="features-section" variants={itemVariants}>
            <h2>Why People Choose Auri</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3>Peaceful Feeds</h3>
                <p>
                  Share and discover content at your own pace - no comparison
                </p>
              </div>
              <div className="feature-item">
                <h3>Authentic Reels</h3>
                <p>Enjoy short, genuine videos from everyone, everywhere</p>
              </div>
              <div className="feature-item">
                <h3>Auri Shop</h3>
                <p>
                  Support independent creators and find unique products you need
                  or want
                </p>
              </div>
              <div className="feature-item">
                <h3>Private Messages</h3>
                <p>Connect deeply with friends without public performance</p>
              </div>
              <div className="feature-item">
                <h3>True Profiles</h3>
                <p>Express your real self without filters or other personas</p>
              </div>
              <div className="feature-item">
                <h3>Meaningful Donations</h3>
                <p>Support causes that matter to you and your community</p>
              </div>
              <div className="feature-item">
                <h3>Like-Minded Groups</h3>
                <p>Find your tribe and build lasting relationships</p>
              </div>
              <div className="feature-item">
                <h3>Creator Marketplace</h3>
                <p>
                  Join fellow creators and sell your unique products in Auri
                  Shop's community-driven marketplace
                </p>
              </div>
              <div className="feature-item">
                <h3>Personalized Experience</h3>
                <p>
                  Crafted settings and preferences that adapt to your entire
                  Auri journey for seamless customization
                </p>
              </div>
            </div>
          </motion.div>

          {/* What is Auri Section */}
          <motion.div className="about-section" variants={itemVariants}>
            <h2>What is Auri?</h2>
            <p>
              Auri (pronounced "Ari") is your escape from the chaos of modern
              social media. Imagine a peaceful digital sanctuary where
              meaningful connections flourish without the endless scroll, toxic
              arguments, or algorithmic pressure to perform. Here, you share
              authentically, connect deeply, and rediscover the joy of genuine
              human interaction.
            </p>
          </motion.div>

          {/* Community Thresholds Section */}
          <motion.div className="thresholds-section" variants={itemVariants}>
            <h2>Unlock Auri's Full Experience</h2>
            <p className="thresholds-intro">
              Each feature unlocks when Auri reaches the number of active
              community members shown below. Join us to help grow the community
              and unlock even more features to come
            </p>
            <div className="thresholds-grid">
              <div className="threshold-item">
                <div className="threshold-number">50</div>
                <div className="threshold-feature">Auri Shop</div>
                <div className="threshold-desc">
                  Support creators & discover unique products
                </div>
              </div>
              <div className="threshold-item">
                <div className="threshold-number">150</div>
                <div className="threshold-feature">Private Messages</div>
                <div className="threshold-desc">
                  Deep, meaningful conversations
                </div>
              </div>
              <div className="threshold-item">
                <div className="threshold-number">150</div>
                <div className="threshold-feature">New Emoji Collection</div>
                <div className="threshold-desc">
                  Express yourself with Auri's emoji packs
                </div>
              </div>
              <div className="threshold-item">
                <div className="threshold-number">200</div>
                <div className="threshold-feature">Advanced Camera Tools</div>
                <div className="threshold-desc">
                  Built-in editing & creative photography features
                </div>
              </div>
              <div className="threshold-item">
                <div className="threshold-number">250</div>
                <div className="threshold-feature">Video Calling</div>
                <div className="threshold-desc">Face-to-face connections</div>
              </div>
              <div className="threshold-item">
                <div className="threshold-number">300</div>
                <div className="threshold-feature">Live Streaming</div>
                <div className="threshold-desc">Share moments in real-time</div>
              </div>
            </div>
            <p className="thresholds-cta">
              Join our growing community and be part of unlocking these
              features!
            </p>
          </motion.div>

          {/* Our Mission Section */}
          <motion.div className="mission-section" variants={itemVariants}>
            <h2>Our Mission</h2>
            <p>
              We're not just another social app – we're rebuilding social media
              from the ground up. Auri eliminates the clutter that drains your
              energy and replaces it with spaces for growth, creativity, and
              real human connection. Join thousands who've already discovered
              that social media can be calm, meaningful, and truly social again.
            </p>
          </motion.div>

          {/* Download Section */}
          <motion.div className="download-section" variants={itemVariants}>
            <div className="button-group">
              <motion.button
                className="download-btn"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
              >
                Download APK
              </motion.button>
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
            downloadUrl="https://i.apponthego.com/c9ef2"
          />

          {/* Preview Modal */}
          {previewModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewModalOpen(false)}
            >
              <motion.div
                className="preview-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="preview-modal-header">
                  <h3>Preview Real App</h3>
                  <button
                    className="modal-close"
                    onClick={() => setPreviewModalOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="preview-modal-content">
                  <p className="preview-warning" style={{ marginBottom: 20 }}>
                    This web preview shows the real Auri app in action. Some
                    features are limited on the web and require an APK download.
                    This preview is temporary and will be removed after 24
                    hours. Account creation is disabled, you can only log in
                    using the details provided below. Feel free to come back and
                    drop a message in the Community Chat or leave us a review
                    we’d love to hear from you.
                  </p>

                  <div className="preview-credentials">
                    <div
                      className="credential-item"
                      style={{ marginBottom: 10 }}
                    >
                      <label>Email: </label>
                      <span>preview@auri.app</span>
                    </div>
                    <div
                      className="credential-item"
                      style={{ marginBottom: 15 }}
                    >
                      <label>Password: </label>
                      <span>Preview2024!</span>
                    </div>
                  </div>

                  <motion.button
                    className="understood-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreviewModalOpen(false)}
                  >
                    Understood
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
