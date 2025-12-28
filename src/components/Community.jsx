import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSmile, FiHeart, FiMessageCircle, FiUser, FiPlus, FiLoader, FiWifi, FiWifiOff } from 'react-icons/fi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { EmojiPopup } from './EmojiPopup';
import { MessageTextRenderer } from './EmojiRenderer';
import { NameInputModal } from './NameInputModal';
import { ReactionDetailsModal } from './ReactionDetailsModal';
import '../styles/Community.css';
import '../styles/NameInputModal.css';
import {
  fetchCommunityMessages,
  createCommunityMessage,
  addMessageReaction,
  addMessageReply,
  subscribeToCommunityMessages,
  getStoredUserName,
  saveUserName,
  getCurrentUser
} from '../lib/Appwrite';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

export const Community = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReplies, setActiveReplies] = useState({});
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  
  // Modal and user management
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Reaction details modal state
  const [showReactionDetails, setShowReactionDetails] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  
  // Loading and connection states
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Reaction emojis for WhatsApp-style reactions using Auri custom PNG emojis
  const reactionEmojis = [
    { emoji: '/smiling_face_with_heart-eyes_3d.png', name: 'heart_eyes' },
    { emoji: '/hot_face_3d.png', name: 'hot_face' },
    { emoji: '/smiling_face_with_sunglasses_3d.png', name: 'cool_face' },
    { emoji: '/upside-down_face_3d.png', name: 'upside_down' },
    { emoji: '/face_holding_back_tears_3d.png', name: 'tears_joy' }
  ];

  // Initialize component
  useEffect(() => {
    initializeComponent();
    return () => {
      // Cleanup subscription on unmount
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // Check if user name is stored when component mounts
  useEffect(() => {
    if (!isLoading) {
      const storedName = getStoredUserName();
      if (storedName && !userName) {
        setUserName(storedName);
        // Load initial messages and setup subscription
        loadMessages();
        setupRealtimeSubscription();
      }
    }
  }, [isLoading]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowReactionPicker(null);
    };

    if (showReactionPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showReactionPicker]);

  // Setup polling mechanism for real-time message updates
  useEffect(() => {
    if (!userName || isLoading) return;

    const pollForMessages = async () => {
      try {
        const fetchedMessages = await fetchCommunityMessages();
        
        // Only update if we have new messages or message count changed
        if (fetchedMessages.length !== lastMessageCountRef.current) {
          setMessages(fetchedMessages);
          lastMessageCountRef.current = fetchedMessages.length;
          setLastUpdate(new Date());
          setIsConnected(true);
          
          console.log(`Polling update: ${fetchedMessages.length} messages found`);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setIsConnected(false);
      }
    };

    // Initial poll
    pollForMessages();

    // Set up polling interval
    pollingIntervalRef.current = setInterval(pollForMessages, 1500); // 1.5 seconds

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [userName, isLoading]);

  const initializeComponent = async () => {
    try {
      setIsLoading(true);
      
      // Get current user session
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      // Check for stored user name
      const storedName = getStoredUserName();
      if (storedName) {
        setUserName(storedName);
        // Load initial messages
        await loadMessages();
        // Setup real-time subscription
        setupRealtimeSubscription();
      } else {
        // Show name input modal
        setShowNameModal(true);
      }
    } catch (error) {
      console.error('Error initializing community:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const fetchedMessages = await fetchCommunityMessages();
      setMessages(fetchedMessages);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading messages:', error);
      setIsConnected(false);
    }
  };

  const setupRealtimeSubscription = () => {
    try {
      subscriptionRef.current = subscribeToCommunityMessages((response) => {
        console.log('Real-time update received:', response);
        setIsConnected(true);
        setLastUpdate(new Date());
        
        if (response.events.includes('databases.documents.create')) {
          // New message created
          const newMessage = response.payload;
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.$id === newMessage.$id);
            if (!exists) {
              return [...prev, newMessage].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              );
            }
            return prev;
          });
        } else if (response.events.includes('databases.documents.update')) {
          // Message updated (e.g., reactions, replies)
          const updatedMessage = response.payload;
          setMessages(prev => 
            prev.map(msg => 
              msg.$id === updatedMessage.$id ? updatedMessage : msg
            )
          );
        }
      });
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      setIsConnected(false);
    }
  };

  const handleNameSave = (name) => {
    const savedName = saveUserName(name);
    setUserName(savedName);
    setShowNameModal(false);
    // Load messages after name is saved
    loadMessages();
    setupRealtimeSubscription();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userName || isSending) return;

    try {
      setIsSending(true);
      
      const messageData = {
        author: userName,
        authorId: currentUser?.$id || '',
        message: newMessage.trim(),
        reactions: [],
        replyTo: []
      };

      await createCommunityMessage(messageData);
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsConnected(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleReplySend = async (messageId) => {
    const replyText = replyTexts[messageId];
    if (!replyText?.trim() || !userName || isSending) return;

    try {
      setIsSending(true);
      
      const replyData = {
        author: userName,
        authorId: currentUser?.$id || '',
        message: replyText.trim()
      };

      await addMessageReply(messageId, replyData);
      
      // Clear reply text and close reply section
      setReplyTexts(prev => ({ ...prev, [messageId]: '' }));
      setActiveReplies(prev => ({ ...prev, [messageId]: false }));
      
    } catch (error) {
      console.error('Error sending reply:', error);
      setIsConnected(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    if (isSending) return;

    try {
      console.log('Adding reaction:', { messageId, emojiName: emoji.name, userName: userName || 'Anonymous' });
      const result = await addMessageReaction(messageId, emoji.name, userName || 'Anonymous');
      console.log('Reaction added successfully:', result);
      setShowReactionPicker(null);
    } catch (error) {
      console.error('Error adding reaction:', error);
      setIsConnected(false);
    }
  };

  // Helper function to parse reactions from JSON strings
  const parseReactions = (reactionsArray) => {
    if (!Array.isArray(reactionsArray)) return [];

    return reactionsArray.map(reaction => {
      try {
        return JSON.parse(reaction);
      } catch (e) {
        // Handle legacy string format "userName:emojiName"
        const [user, emoji] = reaction.split(':');
        return { emojiName: emoji, count: 1, users: [user] };
      }
    });
  };

  // Helper function to get the correct image path for an emoji
  const getEmojiImagePath = (emojiName) => {
    const emojiMap = {
      'heart_eyes': '/smiling_face_with_heart-eyes_3d.png',
      'hot_face': '/hot_face_3d.png',
      'cool_face': '/smiling_face_with_sunglasses_3d.png',
      'upside_down': '/upside-down_face_3d.png',
      'tears_joy': '/face_holding_back_tears_3d.png'
    };
    return emojiMap[emojiName] || `/${emojiName}_3d.png`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReplyKeyPress = (e, messageId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplySend(messageId);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const toggleReplies = (messageId) => {
    setActiveReplies(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const formatTime = (timestamp) => {
    return dayjs(timestamp).fromNow();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getReplies = (messageId) => {
    return messages.filter(msg => 
      Array.isArray(msg.replyTo) && msg.replyTo.includes(messageId)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  // Loading state
  if (isLoading) {
    return (
      <div className="community-container">
        <div className="loading-container">
          <FiLoader className="spinner" size={32} />
          <p>Loading community messages...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="community-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="community-content">
        {/* Welcome Section */}
        <motion.div className="community-welcome" variants={itemVariants}>
          <div className="welcome-header">
            <h2>Welcome to Auri Community</h2>
            <div className="connection-status">
              {isConnected ? (
                <FiWifi className="connected" size={16} />
              ) : (
                <FiWifiOff className="disconnected" size={16} />
              )}
              {lastUpdate && (
                <span className="last-update">
                  Updated {formatTime(lastUpdate)}, refresh page to see new messages
                </span>
              )}
            </div>
          </div>
          <p>
            This is your peaceful space to connect, share, and discover. Drop a message (even a simple “hi”), try our beautiful emojis, and see how Auri and the community create meaningful conversations together. Every interaction helps shape a calm digital space where authentic connections can grow. 💫
          </p>
        </motion.div>

        {/* Messages Feed */}
        <motion.div className="messages-feed" variants={itemVariants}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.$id}
                className={`message-card ${message.author === 'Auri' ? 'auri-message' : ''}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                layout
              >
                <div className="message-header">
                  <div className="message-avatar">
                    {message.author === 'Auri' ? (
                      <img src="/auri_logo.png" alt={message.author} />
                    ) : (
                      <div className="avatar-placeholder">
                        <FiUser size={16} />
                      </div>
                    )}
                  </div>
                  <div className="message-meta">
                    <span className="message-author">{message.author}</span>
                    <span className="message-time">{formatTime(message.createdAt)}</span>
                  </div>
                </div>

                <div className="message-content">
                  <MessageTextRenderer text={message.message} />
                </div>

                <div className="message-actions">
                  <div className="reaction-buttons">
                    <motion.button
                      className="reaction-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowReactionPicker(message.$id === showReactionPicker ? null : message.$id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiSmile size={16} />
                      {message.reactions && Array.isArray(message.reactions) && message.reactions.length > 0 && (
                        <div className="reaction-counts">
                          {parseReactions(message.reactions).map((reaction) => {
                            if (reaction.count === 0) return null;

                            return (
                              <div
                                key={reaction.emojiName}
                                className="reaction-item clickable"
                                title={`${reaction.emojiName.replace('_', ' ')} - Click to see who reacted`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedReaction({
                                    ...reaction,
                                    messageId: message.$id,
                                    messageAuthor: message.author,
                                    messageText: message.message
                                  });
                                  setShowReactionDetails(true);
                                }}
                              >
                                <img
                                  src={getEmojiImagePath(reaction.emojiName)}
                                  alt={reaction.emojiName}
                                  className="reaction-emoji-mini"
                                />
                                <span className="reaction-count">{reaction.count}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.button>
                    
                    {/* Reaction Popup */}
                    <AnimatePresence>
                      {showReactionPicker === message.$id && (
                        <motion.div
                          className="reaction-popup"
                          initial={{ opacity: 0, scale: 0.8, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          transition={{ duration: 0.2, type: 'spring', stiffness: 500 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {reactionEmojis.map((emoji, index) => (
                            <motion.button
                              key={emoji.name}
                              className="reaction-popup-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReaction(message.$id, emoji);
                              }}
                              whileHover={{ scale: 1.3 }}
                              whileTap={{ scale: 0.9 }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              title={emoji.name.replace('_', ' ')}
                            >
                              <img src={emoji.emoji} alt={emoji.name} className="reaction-emoji-img" />
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <motion.button
                    className="comment-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleReplies(message.$id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMessageCircle size={16} />
                    <span>Reply</span>
                  </motion.button>
                </div>

                {/* Replies Section */}
                <AnimatePresence>
                  {activeReplies[message.$id] && (
                    <motion.div
                      className="replies-section"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Existing Replies */}
                      {getReplies(message.$id).map((reply) => (
                        <div key={reply.$id} className="reply-message">
                          <div className="reply-header">
                            <span className="reply-author">{reply.author}</span>
                            <span className="reply-time">{formatTime(reply.createdAt)}</span>
                          </div>
                          <div className="reply-content">
                            <MessageTextRenderer text={reply.message} />
                          </div>
                        </div>
                      ))}
                      
                      {/* Reply Input */}
                      <div className="reply-input">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="reply-text-input"
                          value={replyTexts[message.$id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({
                            ...prev,
                            [message.$id]: e.target.value
                          }))}
                          onKeyPress={(e) => handleReplyKeyPress(e, message.$id)}
                        />
                        <button 
                          className="reply-send-btn"
                          onClick={() => handleReplySend(message.$id)}
                          disabled={!replyTexts[message.$id]?.trim() || isSending}
                        >
                          <FiSend size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </motion.div>

        {/* Message Input */}
        <motion.div className="message-input-container" variants={itemVariants}>
          <div className="message-input-wrapper">
            <div className="input-section">
              <motion.button
                className="emoji-toggle"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiSmile size={20} />
              </motion.button>
              
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={userName ? "Share your thoughts with the community..." : "Enter your name to start chatting..."}
                className="message-input"
                rows={1}
                disabled={!userName || isSending}
              />
              
              <motion.button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !userName || isSending}
                whileHover={{ scale: (newMessage.trim() && userName && !isSending) ? 1.05 : 1 }}
                whileTap={{ scale: (newMessage.trim() && userName && !isSending) ? 0.95 : 1 }}
              >
                {isSending ? (
                  <FiLoader className="spinner" size={18} />
                ) : (
                  <FiSend size={18} />
                )}
              </motion.button>
            </div>

            <EmojiPopup
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelect={(emoji) => {
                setNewMessage(prev => prev + emoji.display);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Name Input Modal */}
      <NameInputModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSave={handleNameSave}
      />

      {/* Reaction Details Modal */}
      <ReactionDetailsModal
        isOpen={showReactionDetails}
        onClose={() => setShowReactionDetails(false)}
        reaction={selectedReaction}
      />
    </motion.div>
  );
};
