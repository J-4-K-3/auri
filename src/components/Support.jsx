import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Support.css';

export const Support = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const infrastructureItems = [
    { icon: '🏗️', title: 'Infrastructure', description: 'Servers and hosting that keep Auri running smoothly 24/7' },
    { icon: '🛒', title: 'Auri Shop', description: 'Building and maintaining our marketplace for creators' },
    { icon: '🎨', title: 'UI/UX Designs', description: 'Creating beautiful, intuitive interfaces you love' },
    { icon: '✨', title: 'Features', description: 'Developing new tools and capabilities for you' },
    { icon: '🔬', title: 'Researches', description: 'Improving Auri through user feedback and testing' },
    { icon: '🛠️', title: 'Developer Tools', description: 'Tools that help us build faster and better' },
    { icon: '☁️', title: 'Cloud CDN', description: 'Fast, reliable content delivery around the world' }
  ];

  const fasterFeatures = [
    { icon: '🎮', title: 'Mini Games' },
    { icon: '📸', title: 'Show and Tell' },
    { icon: '💬', title: 'Chat Messages' },
    { icon: '💰', title: 'Wallet Transfers' },
    { icon: '🏪', title: 'In-App Shop' },
    { icon: '🏬', title: 'Seller Portal' },
    { icon: '📱', title: 'Mobile App' },
    { icon: '🌐', title: 'Web Experience' },
    { icon: '🎥', title: 'Live Streaming' }
  ];

  return (
    <motion.div
      className="support-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="support-content">
        <motion.div className="support-header" variants={itemVariants}>
          <h1 className="support-title">Support <span className="gradient-text">Auri</span></h1>
          <p className="support-subtitle">Two ways to help Auri grow — your review or a contribution</p>
        </motion.div>

        <div className="support-grid">
          <motion.div className="support-card glass-card" variants={itemVariants}>
            <div className="section-icon">⭐</div>
            <h2 className="section-title">Leave a Review</h2>
            <p className="section-description">
              Reviews are free and incredibly meaningful. They motivate our team to keep improving and releasing new features.
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/reviews'}
            >
              Share Your Review
            </motion.button>
          </motion.div>

          <motion.div className="support-card glass-card" variants={itemVariants}>
            <div className="section-icon">💝</div>
            <h2 className="section-title">Support Auri</h2>
            <p className="section-description">
              A contribution helps us maintain servers and grow the platform for everyone.
            </p>
            <motion.a
              href="https://www.paypal.me/aurisupport/10"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Contribute via PayPal
            </motion.a>
          </motion.div>
        </div>

        <motion.div className="benefits-section" variants={itemVariants}>
          <h3 className="section-title" style={{ textAlign: 'center' }}>What Your Support Funds</h3>
          <div className="benefits-grid">
            {infrastructureItems.map((item, i) => (
              <div key={i} className="benefit-item glass-card">
                <span className="benefit-icon">{item.icon}</span>
                <div className="benefit-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="benefits-section" variants={itemVariants}>
          <h3 className="section-title" style={{ textAlign: 'center' }}>Accelerating New Features</h3>
          <div className="faster-features-grid">
            {fasterFeatures.map((f, i) => (
              <div key={i} className="faster-feature-item glass-card">
                <span>{f.icon}</span>
                <span>{f.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="support-footer" variants={itemVariants}>
          <p className="footer-text">Thank you for being part of Auri! 💙</p>
          <p className="footer-subtext">Whether you leave a review or contribute, you're helping build something special.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
