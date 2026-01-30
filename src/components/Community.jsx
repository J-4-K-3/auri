import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiSmile,
  FiHeart,
  FiMessageCircle,
  FiUser,
  FiPlus,
  FiLoader,
  FiWifi,
  FiWifiOff,
  FiX,
} from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { EmojiPopup } from "./EmojiPopup";
import { MessageTextRenderer } from "./EmojiRenderer";
import { NameInputModal } from "./NameInputModal";
import { ReactionDetailsModal } from "./ReactionDetailsModal";
import "../styles/Community.css";
import "../styles/NameInputModal.css";
import {
  fetchCommunityMessages,
  createCommunityMessage,
  addMessageReaction,
  fetchMessageReplies,
  addMessageReply,
  subscribeToCommunityMessages,
  subscribeToReplies,
  getStoredUserName,
  saveUserName,
  getCurrentUser,
} from "../lib/Appwrite";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

export const Community = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState('standard');
  const [activeReplies, setActiveReplies] = useState({});
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [replies, setReplies] = useState({}); // Store replies per messageId
  const [reactionUpdates, setReactionUpdates] = useState({}); // Track pending reaction updates for immediate UI feedback

  // Modal and user management
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState("");
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
  const repliesSubscriptionRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Reaction emojis for WhatsApp-style reactions using Auri custom PNG emojis
  const reactionEmojis = [
    { emoji: "/smiling_face_with_heart-eyes_3d.png", name: "heart_eyes" },
    { emoji: "/hot_face_3d.png", name: "hot_face" },
    { emoji: "/smiling_face_with_sunglasses_3d.png", name: "cool_face" },
    { emoji: "/upside-down_face_3d.png", name: "upside_down" },
    { emoji: "/face_holding_back_tears_3d.png", name: "tears_joy" },
  ];

  // Initialize component
  useEffect(() => {
    initializeComponent();
    return () => {
      // Cleanup subscriptions on unmount
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (repliesSubscriptionRef.current) {
        repliesSubscriptionRef.current.unsubscribe();
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
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
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

          console.log(
            `Polling update: ${fetchedMessages.length} messages found`
          );
        }
      } catch (error) {
        console.error("Polling error:", error);
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
      console.error("Error initializing community:", error);
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
      console.error("Error loading messages:", error);
      setIsConnected(false);
    }
  };

  const setupRealtimeSubscription = () => {
    try {
      subscriptionRef.current = subscribeToCommunityMessages((response) => {
        console.log("Real-time update received:", response);
        setIsConnected(true);
        setLastUpdate(new Date());

        if (response.events.includes("databases.documents.create")) {
          // New message created
          const newMessage = response.payload;
          setMessages((prev) => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some((msg) => msg.$id === newMessage.$id);
            if (!exists) {
              const updatedMessages = [...prev, newMessage].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              // Update last message count for polling
              lastMessageCountRef.current = updatedMessages.length;
              return updatedMessages;
            }
            return prev;
          });
        } else if (response.events.includes("databases.documents.update")) {
          // Message updated (e.g., reactions, replies)
          const updatedMessage = response.payload;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.$id === updatedMessage.$id ? updatedMessage : msg
            )
          );
        }
      });

      // Setup replies subscription for real-time updates
      setupRepliesSubscription();
    } catch (error) {
      console.error("Error setting up real-time subscription:", error);
      setIsConnected(false);
    }
  };

  const setupRepliesSubscription = () => {
    try {
      repliesSubscriptionRef.current = subscribeToReplies((response) => {
        console.log("Replies real-time update received:", response);
        setIsConnected(true);

        if (response.events.includes("databases.documents.create")) {
          // New reply created
          const newReply = response.payload;
          const parentMessageId =
            newReply.replyTo && newReply.replyTo.length > 0
              ? newReply.replyTo[0]
              : null;

          if (parentMessageId) {
            // Add reply to replies state
            setReplies((prev) => ({
              ...prev,
              [parentMessageId]: [...(prev[parentMessageId] || []), newReply],
            }));

            // Also add the new reply to messages array for future reference
            setMessages((prev) => [...prev, newReply]);
          }
        }
      });
    } catch (error) {
      console.error("Error setting up replies subscription:", error);
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
        authorId: currentUser?.$id || "",
        message: newMessage.trim(),
        reactions: [],
        replyTo: [],
      };

      await createCommunityMessage(messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setIsConnected(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleReplySend = async (messageId) => {
    const replyText = replyTexts[messageId];
    if (!replyText?.trim() || !userName) return;

    try {
      const replyData = {
        author: userName,
        authorId: currentUser?.$id || "",
        message: replyText.trim(),
      };

      console.log("Sending reply:", { messageId, replyData });
      const replyResponse = await addMessageReply(messageId, replyData);
      console.log("Reply sent successfully:", replyResponse);

      // Add the new reply message to the messages array
      setMessages((prev) => {
        // Create the new reply message object
        const newReplyMessage = {
          ...replyResponse,
          $id: replyResponse.$id,
          replyTo: [messageId], // Reply references its parent
          createdAt: replyResponse.createdAt || new Date().toISOString(),
        };

        // Add the new reply to messages (it won't show in main feed since it has replyTo)
        return [...prev, newReplyMessage];
      });

      // Also add the new reply to the replies state for immediate display
      setReplies((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), replyResponse],
      }));

      // Clear reply text and close reply section
      setReplyTexts((prev) => ({ ...prev, [messageId]: "" }));
      setActiveReplies((prev) => ({ ...prev, [messageId]: false }));
    } catch (error) {
      console.error("Error sending reply:", error);
      setIsConnected(false);
    }
  };

  // Enhanced touch handler for mobile compatibility
  const handleTouchReaction = (messageId, emoji, event) => {
    // Prevent default behavior but don't stop propagation to allow proper event handling
    if (event) {
      event.preventDefault();
      // Don't stopPropagation() as it can interfere with mobile touch events
    }
    
    // Add touch-specific logging
    console.log("Mobile: Touch reaction event:", {
      messageId,
      emojiName: emoji.name,
      userName: userName || "Anonymous",
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      touchCount: event?.touches?.length || 0,
      timestamp: Date.now()
    });

    // Add a small delay to ensure proper touch event handling
    setTimeout(() => {
      handleReaction(messageId, emoji);
    }, 50);
  };

  // Mobile-friendly reaction handler that works with both click and touch
  const handleReactionMobile = (messageId, emoji, event) => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      handleTouchReaction(messageId, emoji, event);
    } else {
      // Desktop click handler
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      handleReaction(messageId, emoji);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    if (isSending) return;

    try {
      // Enhanced logging for mobile debugging
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log("Frontend: Adding reaction:", {
        messageId,
        emojiName: emoji.name,
        userName: userName || "Anonymous",
        isMobile,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });

      // Ensure we have a valid user name
      let effectiveUserName = userName;
      if (!effectiveUserName || !effectiveUserName.trim()) {
        console.warn("Frontend: No user name found, attempting to get stored name");
        effectiveUserName = getStoredUserName();
        if (!effectiveUserName || !effectiveUserName.trim()) {
          console.error("Frontend: Still no valid user name available");
          effectiveUserName = "Anonymous";
        }
      }

      // Use normalized user name for consistency
      const normalizedUserName = effectiveUserName.trim();
      console.log("Frontend: Using normalized user name:", normalizedUserName);

      const updatedMessage = await addMessageReaction(
        messageId,
        emoji.name,
        normalizedUserName
      );

      console.log(
        "Frontend: Reaction added successfully, updated message:",
        updatedMessage
      );

      // Immediately update message in state with the server response
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.$id === messageId) {
            console.log(
              "Frontend: Updating message reactions:",
              updatedMessage.reactions
            );
            return updatedMessage;
          }
          return msg;
        })
      );

      setShowReactionPicker(null);
    } catch (error) {
      console.error("Frontend: Error adding reaction:", error);
      setIsConnected(false);
      
      // Additional mobile-specific error logging
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        console.error("Mobile-specific error details:", {
          message: error.message,
          stack: error.stack,
          userAgent: navigator.userAgent,
          userName: userName || "Anonymous",
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  // Helper function to parse reactions from JSON strings
  const parseReactions = (reactionsArray) => {
    if (!Array.isArray(reactionsArray)) return [];

    return reactionsArray.map((reaction) => {
      try {
        return JSON.parse(reaction);
      } catch (e) {
        // Handle legacy string format "userName:emojiName"
        const [user, emoji] = reaction.split(":");
        return { emojiName: emoji, count: 1, users: [user] };
      }
    });
  };

  // Helper function to get the correct image path for an emoji
  const getEmojiImagePath = (emojiName) => {
    const emojiMap = {
      heart_eyes: "/smiling_face_with_heart-eyes_3d.png",
      hot_face: "/hot_face_3d.png",
      cool_face: "/smiling_face_with_sunglasses_3d.png",
      upside_down: "/upside-down_face_3d.png",
      tears_joy: "/face_holding_back_tears_3d.png",
    };
    return emojiMap[emojiName] || `/${emojiName}_3d.png`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReplyKeyPress = (e, messageId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReplySend(messageId);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const toggleReplies = async (messageId) => {
    const isCurrentlyActive = activeReplies[messageId];

    if (!isCurrentlyActive) {
      // Loading replies for the first time
      try {
        console.log("Loading replies for message:", messageId);
        const messageReplies = await fetchMessageReplies(messageId);
        console.log("Loaded replies:", messageReplies);
        setReplies((prev) => ({
          ...prev,
          [messageId]: messageReplies,
        }));
      } catch (error) {
        console.error("Error loading replies:", error);
        setIsConnected(false);
      }
    }

    setActiveReplies((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const formatTime = (timestamp) => {
    return dayjs(timestamp).fromNow();
  };

  const formatMessageTime = (timestamp) => {
    return dayjs(timestamp).format("HH:mm");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getReplies = (messageId) => {
    return messages.filter(
      (msg) => Array.isArray(msg.replyTo) && msg.replyTo.includes(messageId)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="chat-loading-container">
        <div className="chat-loading-content">
          <FiLoader className="spinner" size={32} />
          <p>Loading community messages...</p>
        </div>
      </div>
    );
  }

  // Helper to check if message is from current user
  const isCurrentUser = (author) => {
    return author === userName;
  };

  // Helper to get parent message for a reply
  const getParentMessage = (replyTo) => {
    if (!replyTo || replyTo.length === 0) return null;
    return messages.find(msg => msg.$id === replyTo[0]);
  };

  return (
    <motion.div
      className="chat-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Chat Header 
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-info">
            <h2>Auri Community</h2>
            <div className="connection-status">
              {isConnected ? (
                <FiWifi className="connected" size={14} />
              ) : (
                <FiWifiOff className="disconnected" size={14} />
              )}
              <span className="status-text">
                {isConnected ? "Connected" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>*/}

      {/* Messages Area */}
      <div className="chat-messages-area">
        <AnimatePresence>
          {messages
            .filter(
              (message) => !message.replyTo || message.replyTo.length === 0
            ) // Only show parent messages
            .map((message, index) => {
              const messageReplies = getReplies(message.$id);
              const isLastMessage = index === messages.filter(
                (m) => !m.replyTo || m.replyTo.length === 0
              ).length - 1;
              
              return (
                <motion.div
                  key={message.$id}
                  className={`chat-message-wrapper ${
                    isCurrentUser(message.author) ? "own-message" : ""
                  }`}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  {/* Main Message Bubble */}
                  <div className={`chat-bubble ${
                    message.author === "Auri" || message.author === "Auri Official" 
                      ? "auri-bubble" 
                      : isCurrentUser(message.author) 
                        ? "own-bubble" 
                        : "other-bubble"
                  }`}>
                    {/* Name for other users */}
                    {!isCurrentUser(message.author) && (
                      <div className="bubble-author">
                        {message.author === "Auri Official" ? (
                          <img 
                            src="/auri_logo.png" 
                            alt={message.author} 
                            className="bubble-author-img"
                          />
                        ) : (
                          <div className="bubble-author-avatar">
                            <FiUser size={12} />
                          </div>
                        )}
                        <span className={`bubble-author-name ${
                          message.author === "Auri" || message.author === "Auri Official"
                            ? "auri-author-name"
                            : ""
                        }`}>
                          {message.author}
                        </span>
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="bubble-content">
                      <MessageTextRenderer text={message.message} />
                    </div>

                    {/* Time and Reactions Row */}
                    <div className="bubble-meta">
                      <span className="bubble-time">
                        {formatMessageTime(message.createdAt)}
                      </span>
                      
                      {/* Reactions Display */}
                      {message.reactions && Array.isArray(message.reactions) && message.reactions.length > 0 && (
                        <div className="bubble-reactions">
                          {parseReactions(message.reactions).map((reaction) => {
                            if (reaction.count === 0) return null;
                            return (
                              <div
                                key={reaction.emojiName}
                                className="reaction-pill"
                                title={`${reaction.emojiName.replace("_", " ")} - Click to see who reacted`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedReaction({
                                    ...reaction,
                                    messageId: message.$id,
                                    messageAuthor: message.author,
                                    messageText: message.message,
                                  });
                                  setShowReactionDetails(true);
                                }}
                              >
                                <img
                                  src={getEmojiImagePath(reaction.emojiName)}
                                  alt={reaction.emojiName}
                                  className="reaction-pill-emoji"
                                />
                                <span className="reaction-pill-count">
                                  {reaction.count}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Reaction Button */}
                    <button
                      className="bubble-reaction-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowReactionPicker(
                          message.$id === showReactionPicker ? null : message.$id
                        );
                      }}
                    >
                      <FiSmile size={16} />
                    </button>

                    {/* Reaction Popup */}
                    <AnimatePresence>
                      {showReactionPicker === message.$id && (
                        <motion.div
                          className="reaction-popup"
                          initial={{ opacity: 0, scale: 0.8, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 5 }}
                          transition={{ duration: 0.15 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {reactionEmojis.map((emoji) => (
                            <motion.button
                              key={emoji.name}
                              className="reaction-popup-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReaction(message.$id, emoji);
                              }}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              title={emoji.name.replace("_", " ")}
                            >
                              <img
                                src={emoji.emoji}
                                alt={emoji.name}
                                className="reaction-popup-emoji"
                              />
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Thread/Reply Button */}
                  <button
                    className="thread-reply-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleReplies(message.$id);
                    }}
                  >
                    <FiMessageCircle size={14} />
                    {messageReplies.length > 0 && (
                      <span className="reply-count">{messageReplies.length}</span>
                    )}
                  </button>

                  {/* Threaded Replies - WhatsApp Style */}
                  <AnimatePresence>
                    {activeReplies[message.$id] && (
                      <motion.div
                        className="thread-replies"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Thread connector line */}
                        <div className="thread-connector"></div>

                        {/* Replies */}
                        {replies[message.$id] && replies[message.$id].length > 0 ? (
                          replies[message.$id].map((reply) => (
                            <motion.div
                              key={reply.$id}
                              className={`thread-bubble ${
                                isCurrentUser(reply.author) ? "own-bubble" : "other-bubble"
                              }`}
                              initial={{ opacity: 0, x: isCurrentUser(reply.author) ? 10 : -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              {!isCurrentUser(reply.author) && (
                                <div className="thread-author">
                                  {reply.author === "Auri" || reply.author === "Auri Official" ? (
                                    <img 
                                      src="/auri_logo.png" 
                                      alt={reply.author} 
                                      className="thread-author-img"
                                    />
                                  ) : (
                                    <div className="thread-author-avatar">
                                      <FiUser size={10} />
                                    </div>
                                  )}
                                  <span className="thread-author-name">
                                    {reply.author}
                                  </span>
                                </div>
                              )}
                              
                              <div className="thread-bubble-content">
                                <MessageTextRenderer text={reply.message} />
                              </div>
                              
                              <div className="thread-bubble-meta">
                                <span className="thread-bubble-time">
                                  {formatMessageTime(reply.createdAt)}
                                </span>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="no-replies-indicator">
                            <span>No replies yet. Be the first!</span>
                          </div>
                        )}

                        {/* Reply Input in Thread */}
                        <div className="thread-input">
                          <input
                            type="text"
                            placeholder="Reply..."
                            className="thread-input-field"
                            value={replyTexts[message.$id] || ""}
                            onChange={(e) =>
                              setReplyTexts((prev) => ({
                                ...prev,
                                [message.$id]: e.target.value,
                              }))
                            }
                            onKeyPress={(e) => handleReplyKeyPress(e, message.$id)}
                          />
                          <button
                            className="thread-send-btn"
                            onClick={() => handleReplySend(message.$id)}
                            disabled={!replyTexts[message.$id]?.trim()}
                          >
                            <FiSend size={14} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isLastMessage && <div ref={messagesEndRef} />}
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <button
            className="emoji-toggle-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FiSmile size={22} />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              userName
                ? "Type a message..."
                : "Enter your name to chat..."
            }
            className="chat-input-field"
            disabled={!userName || isSending}
          />
          
          <motion.button
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !userName || isSending}
            whileHover={{
              scale: newMessage.trim() && userName && !isSending ? 1.05 : 1,
            }}
            whileTap={{
              scale: newMessage.trim() && userName && !isSending ? 0.95 : 1,
            }}
          >
            {isSending ? (
              <FiLoader className="spinner" size={18} />
            ) : (
              <FiSend size={18} />
            )}
          </motion.button>
        </div>
        
        {/* Emoji Popup - Actual Floating Popup */}
        <AnimatePresence>
          {showEmojiPicker && (
            <>
              {/* Backdrop */}
              <motion.div
                className="emoji-picker-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEmojiPicker(false)}
              />
              
              {/* Floating Emoji Picker Popup */}
              <motion.div
                className="emoji-picker-popup"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2, type: 'spring', stiffness: 500 }}
              >
                <div className="emoji-picker-header">
                  <span className="emoji-picker-title">Emoji</span>
                  <button
                    className="emoji-picker-close"
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    <FiX size={16} />
                  </button>
                </div>
                
                {/*<div className="emoji-picker-categories">
                  {Object.entries({
                    standard: '😀',
                    love: '😍',
                    playful: '😋',
                    neutral: '😐',
                    smirks: '😏',
                    cool: '😎',
                    hearts: '❤️'
                  }).map(([key, icon]) => (
                    <button
                      key={key}
                      className={`emoji-category-tab ${activeCategory === key ? 'active' : ''}`}
                      onClick={() => setActiveCategory(key)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>*/}
                
                <div className="emoji-picker-grid">
                  {[
                    { name: 'grinning_face', image: '/emojis/grinning_face_3d.png', display: '😀' },
                    { name: 'grinning_face_big_eyes', image: '/emojis/grinning_face_with_big_eyes_3d.png', display: '😃' },
                    { name: 'grinning_face_smiling_eyes', image: '/emojis/grinning_face_with_smiling_eyes_3d.png', display: '😄' },
                    { name: 'beaming_face_smiling_eyes', image: '/emojis/beaming_face_with_smiling_eyes_3d.png', display: '😁' },
                    { name: 'grinning_squinting_face', image: '/emojis/grinning_squinting_face_3d.png', display: '😆' },
                    { name: 'grinning_face_sweat', image: '/emojis/grinning_face_with_sweat_3d.png', display: '😅' },
                    { name: 'face_tears_joy', image: '/emojis/face_with_tears_of_joy_3d.png', display: '😂' },
                    { name: 'rolling_floor_laughing', image: '/emojis/rolling_on_the_floor_laughing_3d (1).png', display: '🤣' },
                    { name: 'slightly_smiling_face', image: '/emojis/slightly_smiling_face_3d.png', display: '🙂' },
                    { name: 'upside_down_face', image: '/emojis/upside-down_face_3d (1).png', display: '🙃' },
                    { name: 'winking_face', image: '/emojis/winking_face_3d.png', display: '😉' },
                    { name: 'smiling_face_smiling_eyes', image: '/emojis/smiling_face_with_smiling_eyes_3d.png', display: '😊' },
                    { name: 'smiling_face_hearts', image: '/emojis/smiling_face_with_hearts_3d.png', display: '🥰' },
                    { name: 'smiling_face_heart_eyes', image: '/emojis/smiling_face_with_heart-eyes_3d (1).png', display: '😍' },
                    { name: 'star_struck', image: '/emojis/star-struck_3d.png', display: '🤩' },
                    { name: 'face_blowing_kiss', image: '/emojis/face_blowing_a_kiss_3d.png', display: '😘' },
                    { name: 'smiling_face_sunglasses', image: '/emojis/smiling_face_with_sunglasses_3d (1).png', display: '😎' },
                    { name: 'face_savoring_food', image: '/emojis/face_savoring_food_3d.png', display: '😋' },
                    { name: 'face_with_tongue', image: '/emojis/face_with_tongue_3d.png', display: '😛' },
                    { name: 'winking_face_tongue', image: '/emojis/winking_face_with_tongue_3d.png', display: '😜' },
                    { name: 'zany_face', image: '/emojis/zany_face_3d.png', display: '🤪' },
                    { name: 'squinting_face_tongue', image: '/emojis/squinting_face_with_tongue_3d.png', display: '😝' },
                    { name: 'nerd_face', image: '/emojis/nerd_face_3d.png', display: '🤓' },
                    { name: 'smirking_face', image: '/emojis/smirking_face_3d.png', display: '😏' },
                    { name: 'thinking_face', image: '/emojis/thinking_face_3d.png', display: '🤔' },
                    { name: 'neutral_face', image: '/emojis/neutral_face_3d.png', display: '😐' },
                    { name: 'expressionless_face', image: '/emojis/expressionless_face_3d.png', display: '😑' },
                    { name: 'face_rolling_eyes', image: '/emojis/face_with_rolling_eyes_3d.png', display: '🙄' },
                    { name: 'relieved_face', image: '/emojis/relieved_face_3d.png', display: '😌' },
                    { name: 'pensive_face', image: '/emojis/pensive_face_3d.png', display: '😔' },
                    { name: 'sleepy_face', image: '/emojis/sleepy_face_3d.png', display: '😪' },
                    { name: 'worried_face', image: '/emojis/worried_face_3d.png', display: '😟' },
                    { name: 'slightly_frowning_face', image: '/emojis/slightly_frowning_face_3d.png', display: '🙁' },
                    { name: 'frowning_face', image: '/emojis/frowning_face_3d.png', display: '☹️' },
                    { name: 'pleading_face', image: '/emojis/pleading_face_3d.png', display: '🥺' },
                    { name: 'face_open_mouth', image: '/emojis/face_with_open_mouth_3d.png', display: '😮' },
                    { name: 'astonished_face', image: '/emojis/astonished_face_3d.png', display: '😲' },
                    { name: 'flushed_face', image: '/emojis/flushed_face_3d.png', display: '😳' },
                    { name: 'fearful_face', image: '/emojis/fearful_face_3d.png', display: '😨' },
                    { name: 'crying_face', image: '/emojis/crying_face_3d.png', display: '😢' },
                    { name: 'loudly_crying_face', image: '/emojis/loudly_crying_face_3d.png', display: '😭' },
                    { name: 'angry_face', image: '/emojis/angry_face_3d.png', display: '😠' },
                    { name: 'pouting_face', image: '/emojis/pouting_face_3d.png', display: '😡' },
                    { name: 'face_steam_nose', image: '/emojis/face_with_steam_from_nose_3d.png', display: '😤' },
                    { name: 'tired_face', image: '/emojis/tired_face_3d.png', display: '😫' },
                    { name: 'yawning_face', image: '/emojis/yawning_face_3d.png', display: '🥱' },
                    { name: 'sleeping_face', image: '/emojis/sleeping_face_3d.png', display: '😴' },
                    { name: 'hugging_face', image: '/emojis/hugging_face_3d.png', display: '🤗' },
                    { name: 'partying_face', image: '/emojis/partying_face_3d.png', display: '🥳' },
                    { name: 'smiling_face', image: '/emojis/smiling_face_3d.png', display: '☺️' },
                    { name: 'kissing_face', image: '/emojis/kissing_face_3d.png', display: '😗' },
                    { name: 'kissing_face_closed_eyes', image: '/emojis/kissing_face_with_closed_eyes_3d.png', display: '😚' },
                    { name: 'kissing_face_smiling_eyes', image: '/emojis/kissing_face_with_smiling_eyes_3d.png', display: '😙' },
                    { name: 'red_heart', image: '/emojis/red_heart_3d.png', display: '❤️' },
                    { name: 'broken_heart', image: '/emojis/broken_heart_3d.png', display: '💔' },
                    { name: 'beating_heart', image: '/emojis/beating_heart_3d.png', display: '💓' },
                    { name: 'heart_fire', image: '/emojis/heart_on_fire_3d.png', display: '❤️‍🔥' },
                    { name: 'fire', image: '/emojis/fire_3d.png', display: '🔥' },
                    { name: 'eye', image: '/emojis/eye_3d.png', display: '👁️' },
                    { name: 'eyes', image: '/emojis/eyes_3d.png', display: '👀' },
                    { name: 'tongue', image: '/emojis/tongue_3d.png', display: '👅' },
                  ].map((emoji) => (
                    <motion.button
                      key={emoji.name}
                      className="emoji-picker-item"
                      onClick={() => {
                        setNewMessage((prev) => prev + emoji.display);
                        setShowEmojiPicker(false);
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      title={emoji.name.replace(/_/g, ' ')}
                    >
                      <img src={emoji.image} alt={emoji.name} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
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

