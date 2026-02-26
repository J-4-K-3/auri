import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchReviews,
  submitReview,
  loginUser,
  saveReviewsCache,
  getReviewsCache,
} from '../lib/Appwrite';
import LoginModal from './LoginModal';
import '../styles/Reviews.css';

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', rating: 5, message: '' });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoadingReviews(true);
      try {
        let loadedReviews = [];
        if (isOnline) {
          try {
            loadedReviews = await fetchReviews();
            saveReviewsCache(loadedReviews);
          } catch (error) {
            loadedReviews = getReviewsCache();
          }
        } else {
          loadedReviews = getReviewsCache();
        }
        setReviews(loadedReviews);
      } catch (error) {
        console.error('Error initializing reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    init();
  }, [isOnline]);

  const handleAddReview = () => setIsFormOpen(true);
  const handleSubmitClick = () => setIsLoginModalOpen(true);

  const handleLoginAttempt = async (username, password) => {
    try {
      const user = await loginUser(username, password);
      setIsLoginModalOpen(false);
      setFormData((prev) => ({ ...prev, username: user.name || user.email || username }));
      setTimeout(() => submitReviewToAppwrite(user.$id), 100);
    } catch (error) {
      throw error;
    }
  };

  const handleSubmitAnyway = () => {
    setIsLoginModalOpen(false);
    submitReviewToAppwrite(null);
  };

  const submitReviewToAppwrite = async (userId = null) => {
    if (!formData.username.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in your name and review message');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitReview({
        username: formData.username,
        rating: formData.rating,
        message: formData.message,
        userId: userId || '',
      });
      if (isOnline) {
        const updatedReviews = await fetchReviews();
        saveReviewsCache(updatedReviews);
        setReviews(updatedReviews);
      }
      setFormData({ username: '', rating: 5, message: '' });
      setIsFormOpen(false);
    } catch (error) {
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>★</span>
    ));
  };

  return (
    <motion.div
      className="reviews-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="reviews-content">
        <h1>User Reviews</h1>

        <div className="reviews-stats">
          <div className="avg-rating">
            <h2>
              {reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : 5.0}
            </h2>
            <div className="avg-stars">
              {renderStars(
                reviews.length > 0
                  ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
                  : 5
              )}
            </div>
            <p>{reviews.length} reviews</p>
          </div>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              className="review-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h3>Share Your Review</h3>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="form-input"
              />
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="form-select"
              >
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Good</option>
                <option value="3">★★★☆☆ Average</option>
                <option value="2">★★☆☆☆ Fair</option>
                <option value="1">★☆☆☆☆ Poor</option>
              </select>
              <textarea
                placeholder="Share your thoughts..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
              />
              {submitError && <p className="form-error">{submitError}</p>}
              <div className="form-buttons">
                <button className="btn-submit" onClick={handleSubmitClick} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button className="btn-cancel" onClick={() => setIsFormOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isFormOpen && (
          <button className="btn-add-review" onClick={handleAddReview}>+ Add Your Review</button>
        )}

        <div className="reviews-list">
          {isLoadingReviews ? (
            <div className="reviews-loading">Loading reviews...</div>
          ) : (
            reviews.map((review) => (
              <div key={review.$id} className="review-card">
                <div className="review-header">
                  <div className="review-info">
                    <h4>{review.username}</h4>
                    {review.verified && <span className="verified-badge">✓ Verified User</span>}
                  </div>
                  <div className="review-stars">{renderStars(review.rating)}</div>
                </div>
                <p className="review-text">{review.message}</p>
                <div className="review-meta">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginAttempt}
          onSubmitAnyway={handleSubmitAnyway}
        />
      </div>
    </motion.div>
  );
};
