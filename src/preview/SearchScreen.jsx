
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiUser, FiMapPin, FiClock, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';

const DEFAULT_AVATAR = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";

const exploreCategories = [
  { id: "1", title: "Bedroom", image: "https://picsum.photos/200/200?1", icon: "home" },
  { id: "2", title: "Campers", image: "https://picsum.photos/200/200?2", icon: "truck" },
  { id: "3", title: "Cars", image: "https://picsum.photos/200/200?3", icon: "car" },
  { id: "4", title: "Comic Books", image: "https://picsum.photos/200/200?4", icon: "book" },
  { id: "5", title: "Desserts", image: "https://picsum.photos/200/200?5", icon: "coffee" },
  { id: "6", title: "Funny Animals", image: "https://picsum.photos/200/200?6", icon: "smile" },
  { id: "7", title: "Quotes", image: "https://picsum.photos/200/200?7", icon: "type" },
  { id: "8", title: "Living Room", image: "https://picsum.photos/200/200?8", icon: "grid" },
  { id: "9", title: "Tattoos", image: "https://picsum.photos/200/200?9", icon: "star" },
];

const curatedTopics = [
  { id: "10", title: "Nature", image: "https://picsum.photos/300/200?10" },
  { id: "11", title: "Architecture", image: "https://picsum.photos/300/200?11" },
  { id: "12", title: "Street Art", image: "https://picsum.photos/300/200?12" },
];


const SearchScreen = ({ onNavigate }) => {
  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const fadeAnim = useRef(null);
  const lastRequestRef = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setLoading(false);
      setUserResults([]);
      setSearchError(null);
      return;
    }

    setLoading(true);
    setSearchError(null);
    const requestId = Date.now();
    lastRequestRef.current = requestId;

    const timeout = setTimeout(async () => {
      try {
        // Mock search functionality
        const mockResults = [
          {
            id: "1",
            name: "Auri Friend",
            location: "New York, NY",
            avatarUri: DEFAULT_AVATAR
          },
          {
            id: "2", 
            name: "John Doe",
            location: "Los Angeles, CA",
            avatarUri: DEFAULT_AVATAR
          }
        ].filter(user => 
          user.name.toLowerCase().includes(trimmed.toLowerCase()) ||
          user.location.toLowerCase().includes(trimmed.toLowerCase())
        );

        if (lastRequestRef.current !== requestId) {
          return;
        }
        setUserResults(mockResults);
        setLoading(false);
      } catch (error) {
        if (lastRequestRef.current !== requestId) {
          return;
        }
        console.warn("User search failed", error);
        setSearchError("Unable to search right now.");
        setUserResults([]);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleUserPress = useCallback((user) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
      setSearchHistory(prev => [trimmedQuery, ...prev.slice(0, 9)]);
    }
    setQuery("");
    setUserResults([]);
    // Navigate to user profile (placeholder)
    alert(`Navigate to user profile: ${user.name}`);
  }, [query, searchHistory]);


  const handleBackPress = useCallback(() => {
    if (onNavigate) {
      onNavigate('Home');
    }
  }, [onNavigate]);

  const handleHistoryPress = useCallback((historyQuery) => {
    setQuery(historyQuery);
  }, []);

  const renderCategory = useCallback((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="preview-moment-card"
      onClick={() => alert(`Navigate to ${item.title} category`)}
    >
      <div className="preview-moment-content">
        <img 
          src={item.image} 
          alt={item.title}
          className="preview-moment-image"
        />
      </div>
      <div className="preview-moment-footer">
        <div className="preview-moment-meta">
          <h4>{item.title}</h4>
          <p>Explore</p>
        </div>
        <div className="preview-moment-stats">
          <FiUser size={12} />
        </div>
      </div>
    </motion.div>
  ), []);

  const renderCurated = useCallback((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="preview-moment-card"
      onClick={() => alert(`Navigate to ${item.title} curated`)}
    >
      <div className="preview-moment-content">
        <img 
          src={item.image} 
          alt={item.title}
          className="preview-moment-image"
        />
      </div>
      <div className="preview-moment-footer">
        <div className="preview-moment-meta">
          <h4>{item.title}</h4>
          <p>Curated</p>
        </div>
      </div>
    </motion.div>
  ), []);

  return (
    <div className="preview-screen">
      {/* Header */}
      <div className="preview-moments-header">
        <div className="preview-header-row">
          <button 
            className="preview-back-btn"
            onClick={handleBackPress}
          >
            <FiArrowLeft size={18} />
          </button>
          <h2 className="preview-wordmark">Search</h2>
          <div style={{ width: 32 }} />
        </div>
        
        {/* Search Bar */}
        <div className="preview-input-group">
          <div className="preview-input" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
            padding: '12px 16px'
          }}>
            <FiSearch size={18} color="rgba(255, 255, 255, 0.6)" />
            <input
              type="text"
              placeholder="Search Auri..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', paddingBottom: '80px' }}>
        {query.trim().length > 0 ? (
          <>
            {loading ? (
              <div className="preview-search-section">
                <div className="preview-loading-spinner"></div>
                <span className="preview-search-text">Searching Auri...</span>
              </div>
            ) : searchError ? (
              <div className="preview-search-section">
                <FiAlertTriangle size={16} color="rgba(255, 255, 255, 0.6)" />
                <span className="preview-search-text">{searchError}</span>
              </div>
            ) : userResults.length ? (
              userResults.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="preview-chat-item"
                  onClick={() => handleUserPress(user)}
                >
                  <div className="preview-chat-avatar">
                    <img 
                      src={user.avatarUri || DEFAULT_AVATAR} 
                      alt={user.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '16px',
                        objectFit: 'cover',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>
                  <div className="preview-chat-info">
                    <div className="preview-chat-header">
                      <h4>{user.name}</h4>
                    </div>
                    {user.location && (
                      <p className="preview-chat-last-message">{user.location}</p>
                    )}
                  </div>
                  <FiChevronRight size={16} color="rgba(255, 255, 255, 0.6)" />
                </motion.div>
              ))
            ) : (
              <div className="preview-search-section">
                <FiSearch size={16} color="rgba(255, 255, 255, 0.6)" />
                <span className="preview-search-text">No users found for "{query}"</span>
              </div>
            )}
          </>
        ) : searchHistory.length > 0 ? (
          <>
            <h3 className="preview-section-title">Recent Searches</h3>
            {searchHistory.map((historyQuery, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="preview-chat-item"
                onClick={() => handleHistoryPress(historyQuery)}
              >
                <FiClock size={16} color="rgba(255, 255, 255, 0.6)" />
                <span className="preview-chat-last-message">{historyQuery}</span>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            <h3 className="preview-section-title">Explore Categories</h3>
            <div className="preview-moments-grid">
              {exploreCategories.map(renderCategory)}
            </div>

            <h3 className="preview-section-title" style={{ marginTop: '24px' }}>Curated Topics</h3>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {curatedTopics.map(renderCurated)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
