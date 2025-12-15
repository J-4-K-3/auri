import React, { useState } from 'react';

const Onboard = ({ onComplete, onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/home-portrait.png',
      title: 'Welcome to Auri',
      subtitle: 'Your personal social companion'
    },
    {
      image: '/share_your_world.jpg', 
      title: 'Share Your World',
      subtitle: 'Express yourself with moments and memories'
    },
    {
      image: '/your_circle.jpg',
      title: 'Connect & Chat',
      subtitle: 'Stay connected with your circle'
    }
  ];


  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Start signup flow
      onNavigate('SignupCreds');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const current = slides[currentSlide];

  return (
    <div className="preview-slide" style={{ backgroundImage: `url(${current.image})` }}>
      <div className="preview-slide-overlay"></div>
      <div className="preview-slide-content">
        <div className="preview-slide-copy">
          <h2>{current.title}</h2>
          <p>{current.subtitle}</p>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
          <button 
            className="preview-btn secondary"
            onClick={() => onNavigate('Login')}
          >
            Login
          </button>
          <button 
            className="preview-btn"
            onClick={nextSlide}
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
