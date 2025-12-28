import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShield, FiUsers, FiZap, FiStar, FiDownload, FiPlay } from 'react-icons/fi';
import '../styles/Download.css';
import DownloadModal from './DownloadModal';

export const Download = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    rating: 0,
    downloads: 0
  });

  const media = [
    { type: 'image', src: '/share_your_world.jpg' },
    { type: 'video', src: '/vid_1.mp4' },
    { type: 'image', src: '/stories_memories.jpg' },
    { type: 'video', src: '/vid_2.mp4' },
    { type: 'image', src: '/meme_1.jpg' },
    { type: 'image', src: '/your_circle.jpg' },
    { type: 'video', src: '/vid_3.mp4' },
    { type: 'image', src: '/meme_2.jpg' },
  ];

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const mediaVariants = {
    enter: { opacity: 0, scale: 0.95, y: 20 },
    center: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.05, y: -20 },
  };

  const currentMedia = media[currentMediaIndex];

  // Animate statistics on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        users: 50000,
        rating: 4.8,
        downloads: 100000
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="download-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="download-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="hero-title">Experience Auri</h1>
          <p className="hero-subtitle">
            Join us and others who have discovered a calmer way to share their world. 
            Download Auri today and be part of a community that values meaningful connections.
          </p>
        </motion.div>
      </section>

      <div className="download-section">
        <div className="download-content">

          {/* Enhanced Carousel */}
          <motion.div 
            className="image-carousel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {currentMedia.type === 'image' ? (
                <motion.img
                  key={currentMediaIndex}
                  src={currentMedia.src}
                  alt={`App Feature ${currentMediaIndex + 1}`}
                  className="carousel-image-main"
                  variants={mediaVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.video
                  key={currentMediaIndex}
                  src={currentMedia.src}
                  className="carousel-video-main"
                  variants={mediaVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
            </AnimatePresence>

            <div className="carousel-indicators">
              {media.map((_, index) => (
                <motion.button
                  key={index}
                  className={`indicator ${index === currentMediaIndex ? 'active' : ''}`}
                  onClick={() => setCurrentMediaIndex(index)}
                  animate={{ 
                    scale: index === currentMediaIndex ? 1.2 : 1,
                    opacity: index === currentMediaIndex ? 1 : 0.7
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <div className="carousel-controls">
              <motion.button 
                className="carousel-btn prev-btn"
                onClick={prevMedia}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ‹ Previous
              </motion.button>
              <motion.button 
                className="carousel-btn next-btn"
                onClick={nextMedia}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next ›
              </motion.button>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div 
            className="final-cta"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <h2 className="cta-title">Ready to Join the Auri Community?</h2>
            <p className="cta-subtitle">
              Download now and experience a calmer, more positive way to share your world.
            </p>
            <motion.button
              className="download-btn-large"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
              style={{ marginTop: '20px' }}
            >
              <FiDownload style={{ marginRight: '8px' }} />
              Get Auri Now
            </motion.button>
          </motion.div>
        </div>
      </div>

      <DownloadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        downloadUrl="https://i.apponthego.com/c9ef2"
      />
    </motion.div>
  );
};

export default Download;
