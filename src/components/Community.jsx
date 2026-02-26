import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiSmile,
  FiUser,
  FiLoader,
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
  subscribeToCommunityMessages,
  getStoredUserName,
  saveUserName,
  getCurrentUser,
} from "../lib/Appwrite";

dayjs.extend(relativeTime);

const DEVELOPER_NAMES = ["Jacob Mon", "Alec Cy"];

const formatAuthorName = (name) => {
  if (DEVELOPER_NAMES.includes(name)) {
    return `${name} - Developer`;
  }
  return name;
};

export const Community = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    initializeComponent();
  }, []);

  // Handle Real-time Subscriptions
  useEffect(() => {
    if (!userName) return;

    const subscription = subscribeToCommunityMessages((response) => {
      if (response.events.some((e) => e.includes(".create"))) {
        const msg = response.payload;
        setMessages((prev) => {
          if (prev.some((m) => m.$id === msg.$id)) return prev;
          return [...prev, msg].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
      }
    });

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [userName]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const initializeComponent = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      const storedName = getStoredUserName();
      if (storedName) {
        setUserName(storedName);
        await loadMessages();
      } else {
        setShowNameModal(true);
      }
    } catch (error) {
      console.error("Error initializing community:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const fetchedMessages = await fetchCommunityMessages();
      const sortedMessages = fetchedMessages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(sortedMessages);
      lastMessageCountRef.current = fetchedMessages.length;
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleNameSave = (name) => {
    const savedName = saveUserName(name);
    setUserName(savedName);
    setShowNameModal(false);
    loadMessages();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userName || isSending) return;
    try {
      setIsSending(true);
      await createCommunityMessage({
        author: userName,
        authorId: currentUser?.$id || "",
        message: newMessage.trim(),
        reactions: [],
        replyTo: [],
      });
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isCurrentUser = (author) => author === userName;

  const formatMessageTime = (timestamp) => dayjs(timestamp).format("HH:mm");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="chat-loading-container">
        <FiLoader className="spinner" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      className="chat-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="chat-messages-area">
        <AnimatePresence>
          {messages
            .filter((m) => !m.replyTo || m.replyTo.length === 0)
            .map((message) => (
              <motion.div
                key={message.$id}
                className={`chat-message-wrapper ${isCurrentUser(message.author) ? "own-message" : ""}`}
                variants={itemVariants}
                layout
              >
                <div className={`chat-bubble ${isCurrentUser(message.author) ? "own-bubble" : "other-bubble"}`}>
                  {!isCurrentUser(message.author) && (
                    <div className="bubble-author">
                      <span className={DEVELOPER_NAMES.includes(message.author) ? "developer-author-name" : ""}>
                        {formatAuthorName(message.author)}
                      </span>
                    </div>
                  )}
                  <div className="bubble-content">
                    <MessageTextRenderer text={message.message} />
                  </div>
                  <div className="bubble-meta">
                    <span className="bubble-time">{formatMessageTime(message.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            className="chat-input-field"
            placeholder="Share a thought..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="chat-input-actions">
          <button className="action-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <FiSmile size={22} />
          </button>
          <button 
            className="action-btn send-btn" 
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? 'sending...' : 'send'}
          </button>
          {/* 
          {isSending ? <FiLoader className="spinner" size={20} /> : <FiSend size={30} />}
          */}
        </div>
        <AnimatePresence>
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPopup 
                isOpen={true}
                onEmojiSelect={(emoji) => {
                  setNewMessage(prev => prev + emoji.display);
                  setShowEmojiPicker(false);
                }} 
                onClose={() => setShowEmojiPicker(false)} 
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {showNameModal && <NameInputModal isOpen={showNameModal} onSave={handleNameSave} onClose={() => setShowNameModal(false)} />}
    </motion.div>
  );
};
