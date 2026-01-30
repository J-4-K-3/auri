import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Support.css';

export const Support = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const infrastructureItems = [
    {
      icon: '🏗️',
      title: 'Infrastructure',
      description: 'Servers and hosting that keep Auri running smoothly 24/7'
    },
    {
      icon: '🛒',
      title: 'Auri Shop',
      description: 'Building and maintaining our marketplace for creators'
    },
    {
      icon: '🎨',
      title: 'UI/UX Designs',
      description: 'Creating beautiful, intuitive interfaces you love'
    },
    {
      icon: '✨',
      title: 'Features',
      description: 'Developing new tools and capabilities for you'
    },
    {
      icon: '🔬',
      title: 'Researches',
      description: 'Improving Auri through user feedback and testing'
    },
    {
      icon: '🛠️',
      title: 'Developer Tools',
      description: 'Tools that help us build faster and better'
    },
    {
      icon: '☁️',
      title: 'Cloud CDN',
      description: 'Fast, reliable content delivery around the world'
    }
  ];

  const fasterFeatures = [
    {
      icon: '🎮',
      title: 'Mini Games',
      description: 'Fun rewards and entertainment for the community'
    },
    {
      icon: '📸',
      title: 'Show and Tell',
      description: 'Share your moments in creative ways'
    },
    {
      icon: '💬',
      title: 'Chat Messages',
      description: 'Enhanced messaging experience'
    },
    {
      icon: '💰',
      title: 'Wallet Transfers',
      description: 'Secure payments and transactions'
    },
    {
      icon: '🏪',
      title: 'In-App Shop',
      description: 'Discover and purchase within Auri'
    },
    {
      icon: '🏬',
      title: 'Seller Portal',
      description: 'Start your shop and reach thousands'
    },
    {
      icon: '📱',
      title: 'Mobile App',
      description: 'Auri on the go, anywhere you are'
    },
    {
      icon: '🌐',
      title: 'Web Experience',
      description: 'Full Auri on desktop browsers'
    },
    {
      icon: '🎥',
      title: 'Live Streaming',
      description: 'Share moments in real-time'
    }
  ];

  return (
    <motion.div
      className="support-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="support-content" variants={containerVariants}>
        
        {/* Header Section */}
        <motion.div className="support-header" variants={itemVariants}>
          <h1 className="support-title">Support Auri</h1>
          <p className="support-subtitle">
            Two ways to help Auri grow — your review or a $10 contribution
          </p>
        </motion.div>

        {/* Reviews Section */}
        <motion.div className="support-section reviews-section" variants={itemVariants}>
          <div className="section-card reviews-card">
            <div className="section-icon reviews-icon">⭐</div>
            <h2 className="section-title">Leave a Review</h2>
            <p className="section-description">
              Reviews are free and incredibly meaningful to us. They show that people care 
              about Auri and motivate our team to keep improving and releasing new features.
            </p>
            
            <div className="review-impact">
              <div className="impact-item">
                <span className="impact-emoji">🎯</span>
                <p><strong>Your review = More releases</strong></p>
              </div>
              <p className="impact-text">
                When you share your thoughts, it fuels our passion to create. 
                Auri Version 2 happened because of community feedback like yours!
              </p>
            </div>

            <motion.button
              className="support-btn review-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = '/reviews'}
            >
              Share Your Review
            </motion.button>
            
            <p className="review-note">
              💙 No money needed — just your honest thoughts
            </p>
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div className="support-section support-main-section" variants={itemVariants}>
          <div className="section-card support-card">
            <div className="section-icon support-icon">💝</div>
            <h2 className="section-title">Support Auri</h2>
            <p className="section-description">
              A $10 contribution helps us maintain and grow Auri. Every bit goes directly 
              toward making the platform better for everyone.
            </p>

            {/* Infrastructure & Maintenance */}
            <div className="benefits-category">
              <h3 className="category-title">What Your Support Funds</h3>
              <div className="benefits-grid">
                {infrastructureItems.map((item, index) => (
                  <div key={index} className="benefit-item">
                    <span className="benefit-icon">{item.icon}</span>
                    <div className="benefit-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faster Features */}
            <div className="benefits-category">
              <h3 className="category-title">Accelerating New Features</h3>
              <p className="category-subtitle">
                Your support helps us ship these features faster:
              </p>
              <div className="faster-features-grid">
                {fasterFeatures.map((feature, index) => (
                  <div key={index} className="faster-feature-item">
                    <span className="faster-feature-icon">{feature.icon}</span>
                    <span className="faster-feature-title">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PayPal Button */}
            <div className="support-cta">
              <motion.a
                href="https://www.paypal.me/aurisupport/10"
                target="_blank"
                rel="noopener noreferrer"
                className="support-btn paypal-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Contribute $10 via PayPal
              </motion.a>
              <p className="support-note">
                Secure payment through PayPal
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div className="support-footer" variants={itemVariants}>
          <p className="footer-text">
            Thank you for being part of the Auri community! 💙
          </p>
          <p className="footer-subtext">
            Whether you leave a review or contribute, you're helping build something special.
          </p>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

