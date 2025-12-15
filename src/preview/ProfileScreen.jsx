import React, { useState } from 'react';
import { FiEdit3, FiSettings, FiUserPlus, FiCheck, FiGift, FiMessageCircle, FiGrid, FiFilm, FiBookmark, FiUsers, FiMoreHorizontal } from 'react-icons/fi';

const ProfileScreen = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('media');
  const [isOwnProfile] = useState(true);
  const [isFollowing] = useState(false);

  const userData = {
    name: user?.name || 'Demo User',
    avatarUri: '/profile-portrait.png',
    bio: 'Welcome to Auri! This is a preview of the social experience.',
    location: 'San Francisco, CA',
    status: 'Living my best life ✨',
    followers: 0,
    following: 0,
    posts: 1,
    interests: ['Photography', 'Travel', 'Coffee', 'Music', 'Art']
  };

  const tabs = [
    { key: 'media', label: 'Media', icon: FiGrid },
    { key: 'reels', label: 'Reels', icon: FiFilm },
    { key: 'saved', label: 'Saved', icon: FiBookmark },
    { key: 'connections', label: 'Connections', icon: FiUsers }
  ];

  const posts = [
    { id: 1, image: '/meme_1.jpg' },
    { id: 2, image: '/meme_2.jpg' },
    { id: 3, image: '/stories_memories.jpg' },
    { id: 4, image: '/share_your_world.jpg' },
    { id: 5, image: '/your_circle.jpg' },
    { id: 6, image: '/home-portrait.png' }
  ];

  const formatCount = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return String(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <div className="preview-profile-grid">
            <div className="preview-profile-placeholder">
              <FiBookmark size={36} />
              <p>Saved posts will appear here</p>
            </div>
          </div>
        );
      case 'reels':
        return (
          <div className="preview-profile-grid">
            <div className="preview-profile-placeholder">
              <FiFilm size={36} />
              <p>Reels will appear here</p>
            </div>
          </div>
        );
      case 'connections':
        return (
          <div className="preview-profile-grid">
            <div className="preview-profile-placeholder">
              <FiUsers size={36} />
              <p>Connections will appear here</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="preview-profile-grid">
            {posts.map((post) => (
              <div key={post.id} className="preview-profile-grid-item">
                <img 
                  src={post.image} 
                  alt="Post"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px'
                  }}
                />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="preview-profile">
      <div className="preview-profile-container">
        <div className="preview-profile-banner"></div>
        
        <div className="preview-profile-header">
          <div className="preview-profile-avatar">
            <img 
              src={userData.avatarUri} 
              alt={userData.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                objectFit: 'cover',
                border: '4px solid white',
                marginTop: '-60px'
              }}
            />
          </div>
          
          <div className="preview-profile-info">
            <h1 className="preview-profile-name">{userData.name}</h1>
            {userData.location && (
              <p className="preview-profile-location">{userData.location}</p>
            )}
            {userData.status && (
              <p className="preview-profile-status">{userData.status}</p>
            )}
            {userData.bio && (
              <p className="preview-profile-bio">{userData.bio}</p>
            )}
          </div>
        </div>

        <div className="preview-profile-stats">
          <div className="preview-profile-stat">
            <div className="preview-profile-stat-value">{formatCount(userData.posts)}</div>
            <div className="preview-profile-stat-label">Posts</div>
          </div>
          <div className="preview-profile-stat">
            <div className="preview-profile-stat-value">{formatCount(userData.followers)}</div>
            <div className="preview-profile-stat-label">Followers</div>
          </div>
          <div className="preview-profile-stat">
            <div className="preview-profile-stat-value">{formatCount(userData.following)}</div>
            <div className="preview-profile-stat-label">Following</div>
          </div>
        </div>

        <div className="preview-profile-buttons">
          {isOwnProfile ? (
            <>
              <button className="preview-profile-btn primary">
                <FiEdit3 size={18} />
                <span>Edit Profile</span>
              </button>
              <button className="preview-profile-btn secondary">
                <FiSettings size={18} />
                <span>Settings</span>
              </button>
            </>
          ) : (
            <>
              <button className={`preview-profile-btn ${isFollowing ? 'secondary' : 'primary'}`}>
                {isFollowing ? <FiCheck size={18} /> : <FiUserPlus size={18} />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>
              <button className="preview-profile-btn primary">
                <FiGift size={18} />
                <span>Donate</span>
              </button>
              <button className="preview-profile-btn secondary">
                <FiMessageCircle size={18} />
                <span>Message</span>
              </button>
            </>
          )}
        </div>

        {userData.interests && userData.interests.length > 0 && (
          <div className="preview-profile-interests">
            {userData.interests.map((interest, index) => (
              <span key={index} className="preview-profile-interest">
                {interest}
              </span>
            ))}
          </div>
        )}

        <div className="preview-profile-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`preview-profile-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="preview-profile-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
