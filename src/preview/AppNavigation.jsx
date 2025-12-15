
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiPlayCircle, FiSun, FiMessageCircle, FiUser } from 'react-icons/fi';

// Import screen components
import Onboard from './Onboard.jsx';
import HomeScreen from './HomeScreen.jsx';
import ReelsScreen from './ReelsScreen.jsx';
import MomentsScreen from './MomentsScreen.jsx';
import ChatsScreen from './ChatsScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import SearchScreen from './SearchScreen.jsx';
import CreateScreen from './CreateScreen.jsx';
import EditProfileScreen from './EditProfileScreen.jsx';
import SignupCredsScreen from './SignupCredsScreen.jsx';
import SignupProfileScreen from './SignupProfileScreen.jsx';
import LoginScreen from './LoginScreen.jsx';

import './AppPreview.css';

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/>
    <path d="M12 19l-7-7 7-7"/>
  </svg>
);

export const AppNavigation = () => {
  // App state
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [user, setUser] = useState({
    id: '1',
    name: 'Demo User',
    username: 'demo_user',
    avatar: '/profile-portrait.png',
    bio: 'Welcome to Auri! This is a preview of the social experience.',
    location: 'San Francisco, CA',
    followers: 1234,
    following: 567,
    posts: 89
  });
  const [credentials, setCredentials] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: '1',
      image: '/meme_1.jpg',
      author: {
        name: 'Sarah Chen',
        avatar: '/profile-portrait.png'
      },
      content: 'Just discovered this amazing coffee shop! ☕ The atmosphere is perfect for working.',
      timestamp: '2h',
      likes: 24,
      comments: 5,
      liked: false,
      saved: false
    },
    {
      id: '2', 
      image: '/stories_memories.jpg',
      author: {
        name: 'Mike Rodriguez',
        avatar: '/profile-portrait.png'
      },
      content: 'Weekend vibes with friends! Nothing beats good company and great memories.',
      timestamp: '5h',
      likes: 67,
      comments: 12,
      liked: true,
      saved: false
    },
    {
      id: '3',
      content: 'Starting my day with some motivation! What\'s everyone else up to?',
      author: {
        name: 'Emma Wilson',
        avatar: '/profile-portrait.png'
      },
      timestamp: '1d',
      likes: 43,
      comments: 8,
      liked: false,
      saved: true
    }
  ]);
  const [stories, setStories] = useState([
    {
      id: '1',
      name: 'You',
      avatar: '/profile-portrait.png',
      isOwn: true,
      items: []
    }
  ]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('preview_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setCurrentScreen('Home');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Navigation handlers
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const handleOnboardComplete = () => {
    navigateTo('Home');
  };

  const handleLogout = () => {
    localStorage.removeItem('preview_user');
    setUser(null);
    setCurrentScreen('Home');
  };

  const handleCreatePost = (postData) => {
    setPosts(prev => [postData, ...prev]);
  };

  const handleProfileSave = (updatedProfile) => {
    const updatedUser = {
      ...user,
      profile: updatedProfile
    };
    setUser(updatedUser);
    localStorage.setItem('preview_user', JSON.stringify(updatedUser));
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="preview-app">
        <div className="preview-screen-centered">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid rgba(255, 255, 255, 0.3)', 
              borderTop: '3px solid #ff8a65', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading Auri...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render screen content based on current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Onboard':
        return <Onboard onComplete={handleOnboardComplete} />;
      
      case 'SignupCreds':
        return <SignupCredsScreen onNavigate={navigateTo} />;
      
      case 'SignupProfile':
        return <SignupProfileScreen onNavigate={navigateTo} />;
      
      case 'Login':
        return <LoginScreen onNavigate={navigateTo} />;
      
      case 'Search':
        return (
          <SearchScreen 
            onClose={() => navigateTo('Home')}
          />
        );
      
      case 'Create':
        return (
          <CreateScreen 
            onClose={() => navigateTo('Home')}
            onPost={handleCreatePost}
          />
        );
      
      case 'EditProfile':
        return (
          <EditProfileScreen 
            user={user}
            onClose={() => navigateTo('Profile')}
            onSave={handleProfileSave}
          />
        );
      
      default:
        // Main app screens
        const mainScreens = {
          'Home': HomeScreen,
          'Reels': ReelsScreen,
          'Moments': MomentsScreen,
          'Chats': ChatsScreen,
          'Profile': ProfileScreen
        };

        const ScreenComponent = mainScreens[currentScreen];
        if (ScreenComponent) {
          return (
            <ScreenComponent 
              user={user}
              posts={posts}
              stories={stories}
              onNavigate={navigateTo}
              onCreatePost={handleCreatePost}
              onLogout={handleLogout}
            />
          );
        }
        
        // Default to Home
        return (
          <HomeScreen 
            user={user}
            posts={posts}
            stories={stories}
            onNavigate={navigateTo}
            onCreatePost={handleCreatePost}
            onLogout={handleLogout}
          />
        );
    }
  };

  // Show bottom navigation for main app screens only
  const showBottomNav = ['Home', 'Reels', 'Moments', 'Chats', 'Profile'].includes(currentScreen);

  return (
    <div className="preview-app">
      {/* Header with back button for sub-screens */}
      {(currentScreen === 'Search' || currentScreen === 'Create' || currentScreen === 'EditProfile' || currentScreen === 'SignupCreds' || currentScreen === 'SignupProfile' || currentScreen === 'Login') && (
        <div className="preview-app-header">
          <button
            onClick={() => {
              if (currentScreen === 'Search' || currentScreen === 'Create') {
                navigateTo('Home');
              } else if (currentScreen === 'EditProfile') {
                navigateTo('Profile');
              } else if (currentScreen === 'SignupCreds') {
                navigateTo('Onboard');
              } else if (currentScreen === 'SignupProfile') {
                navigateTo('SignupCreds');
              } else if (currentScreen === 'Login') {
                navigateTo('Onboard');
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              marginRight: '12px'
            }}
          >
            <BackIcon />
          </button>
        </div>
      )}

      {/* Header for main screens */}
      {showBottomNav && currentScreen !== 'Home' && (
        <div className="preview-app-header">
          <h1 className="preview-app-title">
            {currentScreen === 'Home' && 'Auri'}
            {currentScreen === 'Reels' && 'Reels'}
            {currentScreen === 'Moments' && 'Moments'}
            {currentScreen === 'Chats' && 'Chats'}
            {currentScreen === 'Profile' && 'Profile'}
          </h1>
        </div>
      )}

      {/* Main content area */}
      <div className="preview-app-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Bottom navigation for main screens */}
      {showBottomNav && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 8px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 100
        }}>
          <button
            onClick={() => navigateTo('Home')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: currentScreen === 'Home' ? '#ff8a65' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '8px 12px'
            }}
          >
            <FiHome size={28} />
            <span style={{ fontSize: '12px', fontWeight: '600' }}>Home</span>
          </button>
          
          <button
            onClick={() => navigateTo('Reels')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: currentScreen === 'Reels' ? '#ff8a65' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '8px 12px'
            }}
          >
            <FiPlayCircle size={28} />
            <span style={{ fontSize: '12px', fontWeight: '600' }}>Reels</span>
          </button>
          
          <button
            onClick={() => navigateTo('Moments')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: currentScreen === 'Moments' ? '#ff8a65' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '8px 12px'
            }}
          >
            <FiSun size={28} />
            <span style={{ fontSize: '12px', fontWeight: '600' }}>Moments</span>
          </button>
          
          <button
            onClick={() => navigateTo('Chats')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: currentScreen === 'Chats' ? '#ff8a65' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '8px 12px'
            }}
          >
            <FiMessageCircle size={28} />
            <span style={{ fontSize: '12px', fontWeight: '600' }}>Chats</span>
          </button>
          
          <button
            onClick={() => navigateTo('Profile')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: currentScreen === 'Profile' ? '#ff8a65' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '8px 12px'
            }}
          >
            <FiUser size={28} />
            <span style={{ fontSize: '12px', fontWeight: '600' }}>Profile</span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

