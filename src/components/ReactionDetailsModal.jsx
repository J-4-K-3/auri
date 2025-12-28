import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser } from 'react-icons/fi';

export const ReactionDetailsModal = ({ 
  isOpen, 
  onClose, 
  emojiData, 
  emojiName 
}) => {
  if (!isOpen || !emojiData) return null;

  const { count, users = [] } = emojiData;

  return (
    <AnimatePresence>
      <motion.div
        className="reaction-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="reaction-modal-content"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="reaction-modal-header">
            <div className="reaction-modal-emoji">
              <img 
                src={`/${emojiName.replace('_', '-')}_3d.png`} 
                alt={emojiName} 
                className="reaction-emoji-large"
              />
            </div>
            <div className="reaction-modal-info">
              <h3 className="reaction-modal-title">
                {emojiName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <p className="reaction-modal-count">
                {count} {count === 1 ? 'person' : 'people'} reacted
              </p>
            </div>
            <motion.button
              className="reaction-modal-close"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={20} />
            </motion.button>
          </div>

          {/* Users List */}
          <div className="reaction-users-list">
            {users.length > 0 ? (
              <div className="reaction-users-grid">
                {users.map((user, index) => (
                  <motion.div
                    key={`${user}-${index}`}
                    className="reaction-user-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="reaction-user-avatar">
                      {user === 'Auri' ? (
                        <img src="/auri_logo.png" alt={user} className="reaction-user-img" />
                      ) : (
                        <div className="reaction-user-placeholder">
                          <FiUser size={14} />
                        </div>
                      )}
                    </div>
                    <span className="reaction-user-name">{user}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="reaction-no-users">
                <p>No users found for this reaction</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
