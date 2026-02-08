import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiX } from "react-icons/fi";

export const NameInputModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Check if name contains "Auri Official" (reserved name)
  const containsAuriOfficial = (nameToCheck) => {
    const normalizedName = nameToCheck.toLowerCase().trim();
    return normalizedName === "auri official";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (trimmedName.length > 150) {
      setError("Name must be less than 150 characters");
      return;
    }

    // Check for reserved name "Auri Official"
    if (containsAuriOfficial(trimmedName)) {
      setError('"Auri Official" is a reserved name and cannot be used');
      return;
    }

    onSave(trimmedName);
    setName("");
    setError("");
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="name-modal-overlay">
        <motion.div
          className="name-modal-container"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 500 }}
        >
          <div className="name-modal-header">
            <h3>Welcome to Auri Community!</h3>
            <button
              className="close-btn"
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="name-modal-content">
            <div className="name-modal-icon">
              <FiUser size={32} />
            </div>
            <p>
              Welcome to Auri Community! This is your peaceful space to connect, share, and discover. 
              Drop a message (even a simple "hi"), try our beautiful emojis, and see how Auri and 
              the community create meaningful conversations together. Every interaction helps shape 
              a calm digital space where authentic connections can grow. 💫
            </p>
            <p className="name-modal-hint">
              To join our community conversation, please tell us your name. 
              This helps other members know who's sharing their thoughts.
            </p>

            <form onSubmit={handleSubmit} className="name-form">
              <div className="name-input-group">
                <label htmlFor="userName">Your Name</label>
                <input
                  id="userName"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your name..."
                  className="name-input"
                  maxLength={150}
                  autoFocus
                />
                {error && (
                  <motion.span
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {error}
                  </motion.span>
                )}
              </div>

              <div className="name-modal-actions">
                <motion.button
                  type="button"
                  className="cancel-btn"
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="save-btn"
                  disabled={!name.trim() || containsAuriOfficial(name)}
                  whileHover={{ scale: name.trim() && !containsAuriOfficial(name) ? 1.02 : 1 }}
                  whileTap={{ scale: name.trim() && !containsAuriOfficial(name) ? 0.98 : 1 }}
                >
                  Join Community
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

