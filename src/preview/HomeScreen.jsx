import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomeScreen = ({ user, posts, stories, onNavigate, onCreatePost, onLogout }) => {
  const navigate = useNavigate();

  const handleEndPreview = () => {
    navigate('/');
  };

  const handleDownloadAPK = () => {
    window.open('https://apkpure.com/p/com.jake285.Auri', '_blank', 'noopener');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      position: 'relative',
      paddingBottom: '80px' // Add padding to account for fixed bottom nav
    }}>
      {/* Main content */}
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '48px',
          fontWeight: '800',
          margin: '0 0 40px 0',
          letterSpacing: '2px'
        }}>
          Auri
        </h1>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '280px',
          marginBottom: '40px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
            lineHeight: '1.4'
          }}>
            No feeds to display
          </p>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            fontWeight: '400',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Dicover something new or explore what Auri has to offer
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '280px'
        }}>
          <button
            onClick={handleDownloadAPK}
            style={{
              padding: '16px 24px',
              backgroundColor: '#ff8a65',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(255, 138, 101, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ff7043';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(255, 138, 101, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ff8a65';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 138, 101, 0.3)';
            }}
          >
            Download APK
          </button>

          <button
            onClick={handleEndPreview}
            style={{
              padding: '16px 24px',
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            End Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;

