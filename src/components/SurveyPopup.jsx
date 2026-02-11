import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/SurveyPopup.css';
import { 
  submitSurveyResponse, 
  getOrCreateSessionId,
  isSurveyCompleted,
  markSurveyCompleted
} from '../lib/Appwrite';

export const SurveyPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      const id = await getOrCreateSessionId();
      setSessionId(id);
      console.log('Survey session ID:', id);
    };
    if (isOpen) {
      initSession();
    }
  }, [isOpen]);

  // Reset survey when popup closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setCurrentQuestion(0);
        setAnswers({});
        setSubmitted(false);
        setError(null);
        setDebugInfo('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Survey questions with logic flow, sub-questions, and navigation
  const questions = [
    {
      id: 'been_here_before',
      question: "Hey there! 👋 First time here?",
      type: 'choice',
      options: [
        { value: 'yes', label: 'Yes, first time!', emoji: '🎉' },
        { value: 'no', label: 'No, I\'ve been here', emoji: '😊' }
      ],
      required: true
    },
    {
      id: 'created_account',
      question: "Awesome! 🌟 Have you created your Auri account yet?",
      type: 'choice',
      options: [
        { value: 'yes', label: 'Yes, I have!', emoji: '✅' },
        { value: 'no', label: 'Not yet', emoji: '⏳' },
        { value: 'n/a', label: 'Just browsing', emoji: '👀' }
      ],
      required: true,
      condition: (answers) => answers.been_here_before === 'no'
    },
    {
      id: 'not_ready_reason',
      question: "No worries! 🌸 What's holding you back from joining us?",
      type: 'choice',
      options: [
        { value: 'still_browsing', label: 'Still browsing around', emoji: '🔍' },
        { value: 'unsafe', label: 'Looked unsafe/unsure', emoji: '🤔' },
        { value: 'other', label: 'Something else', emoji: '💭' }
      ],
      required: true,
      condition: (answers) => answers.created_account === 'no'
    },
    {
      id: 'send_hi',
      question: "Would you like to say hi to the community? 👋",
      subtitle: "Let people know you're here!",
      type: 'choice',
      options: [
        { value: 'yes', label: 'Yes, say hi!', emoji: '👋' },
        { value: 'next_time', label: 'Next time', emoji: '⏰' }
      ],
      required: true
    },
    {
      id: 'daily_use',
      question: "Will you use Auri daily? 📱",
      subtitle: "We'd love to have you around every day!",
      type: 'choice',
      options: [
        { value: 'yes', label: 'Yes, absolutely!', emoji: '💯' },
        { value: 'no', label: 'Probably not', emoji: '🤷' }
      ],
      required: true
    },
    {
      id: 'best_include',
      question: "What would make Auri better for you? 💡",
      subtitle: "Your feedback helps us improve!",
      type: 'text',
      placeholder: 'Tell us what we should include...',
      required: false,
      condition: (answers) => answers.daily_use === 'yes'
    },
    {
      id: 'why_not_daily',
      question: "Aww, we'll miss you! 😢 What's the reason?",
      type: 'choice',
      options: [
        { value: 'not_interested', label: 'Not interested in this type of app', emoji: '🙃' },
        { value: 'features', label: 'Missing features I need', emoji: '🔧' },
        { value: 'prefer_other', label: 'Prefer other apps', emoji: '📱' },
        { value: 'other', label: 'Something else', emoji: '💭' }
      ],
      required: true,
      condition: (answers) => answers.daily_use === 'no'
    },
    {
      id: 'community_belong',
      question: "Would you like to belong to the Auri community? 💙",
      subtitle: "Join our growing family of genuine connections!",
      type: 'choice',
      options: [
        { value: 'yes', label: 'Yes, absolutely!', emoji: '💙' },
        { value: 'no', label: 'Maybe later', emoji: '👋' }
      ],
      required: true
    },
    {
      id: 'community_specific',
      question: "Great! 🌟 What brings you to the community?",
      type: 'choice',
      options: [
        { value: 'make_friends', label: 'Make new friends', emoji: '🤝' },
        { value: 'share_content', label: 'Share my content', emoji: '📸' },
        { value: 'discover', label: 'Discover content', emoji: '🔍' },
        { value: 'just_hang', label: 'Just hang out', emoji: '🪴' }
      ],
      required: false,
      condition: (answers) => answers.community_belong === 'yes'
    },
    {
      id: 'leave_review',
      question: "Would you leave a review for us? ⭐",
      subtitle: 'Your review helps others discover Auri!',
      type: 'choice',
      options: [
        { value: 'yes', label: 'Yes, of course!', emoji: '⭐' },
        { value: 'no', label: 'Maybe later', emoji: '👋' }
      ],
      required: true
    },
    {
      id: 'review_rating',
      question: "How would you rate your experience so far? 😊",
      subtitle: 'Just a quick rating - no pressure!',
      type: 'rating',
      maxRating: 5,
      required: true,
      condition: (answers) => answers.leave_review === 'yes'
    },
    {
      id: 'review_feedback',
      question: "What did you like most? 💭",
      subtitle: 'Help us improve!',
      type: 'text',
      placeholder: 'Share your thoughts...',
      required: false,
      condition: (answers) => answers.leave_review === 'yes'
    },
    {
      id: 'overall_rating',
      question: "Rate your experience so far! 😊",
      subtitle: 'Just a quick rating - no pressure!',
      type: 'rating',
      maxRating: 5,
      required: true,
      condition: (answers) => !answers.leave_review || answers.leave_review !== 'yes'
    }
  ];

  // Get visible questions based on conditions
  const getVisibleQuestions = useCallback(() => {
    return questions.filter(q => !q.condition || q.condition(answers));
  }, [answers]);

  const visibleQuestions = getVisibleQuestions();
  const totalQuestions = visibleQuestions.length;

  const handleAnswer = (value) => {
    const currentQ = visibleQuestions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('Starting submission...');

    try {
      // Check if already completed
      if (isSurveyCompleted()) {
        setDebugInfo('Already completed, showing thank you...');
        setSubmitted(true);
        setLoading(false);
        return;
      }

      // Prepare survey data - only include fields that exist in tracker collection
      const surveyData = {
        sessionId: sessionId || await getOrCreateSessionId(),
        os: navigator.platform || 'Unknown',
        been_here_before: answers.been_here_before || '',
        created_account: answers.created_account || '',
        not_ready_reason: answers.not_ready_reason || '',
        send_hi: answers.send_hi || '',
        daily_use: answers.daily_use || '',
        best_include: answers.best_include || '',
        why_not_daily: answers.why_not_daily || '',
        community_belong: answers.community_belong || '',
        leave_review: answers.leave_review || '',
        overall_rating: answers.overall_rating || answers.review_rating || null,
        survey_completed: true,
        survey_started_at: new Date().toISOString(),
      };

      setDebugInfo('Submitting to Appwrite...');

      // Submit to Appwrite when Submit button is clicked
      const result = await submitSurveyResponse(surveyData);
      console.log('Survey submitted successfully:', result);
      setDebugInfo('Submission successful!');

      // Mark as completed locally
      markSurveyCompleted();
      setSubmitted(true);
      setLoading(false);
      
    } catch (err) {
      console.error('Survey submission error:', err);
      setError('Something went wrong. Your answers are saved locally.');
      setDebugInfo('Error: ' + err.message);
      setLoading(false);
    }
  };

  const skipSurvey = () => {
    localStorage.setItem('auri_survey_seen', 'true');
    onClose();
  };

  const resetSurvey = () => {
    localStorage.removeItem('auri_survey_completed');
    localStorage.removeItem('auri_survey_seen');
    localStorage.removeItem('auri_survey_response');
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setError(null);
    setDebugInfo('');
    onClose();
  };

  const goToCommunity = () => {
    onClose();
    navigate('/community');
  };

  const goToReviews = () => {
    onClose();
    navigate('/reviews');
  };

  // Don't show if not open
  if (!isOpen) return null;

  // Check if already completed
  const alreadyCompleted = isSurveyCompleted();

  return (
    <div className="survey-modal-overlay" onClick={onClose}>
      <motion.div 
        className="survey-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        {/* Header */}
        <div className="survey-header">
          <div className="survey-progress">
            <div 
              className="survey-progress-bar"
              style={{ 
                width: alreadyCompleted || submitted ? '100%' : 
                  `${((currentQuestion + 1) / totalQuestions) * 100}%` 
              }}
            />
          </div>
          {!alreadyCompleted && !submitted && (
            <button className="survey-close" onClick={skipSurvey}>
              ×
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {submitted || alreadyCompleted ? (
            // Thank you screen
            <motion.div
              key="thank-you"
              className="survey-thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="thank-you-icon">🎉</div>
              <h2>Thank You!</h2>
              <p className="thank-you-message">
                Your feedback means the world to us! 💙
              </p>
              <p className="thank-you-sub">
                Welcome to the Auri community! We're so happy to have you here. 🌟
              </p>
              
              {answers.been_here_before === 'yes' && (
                <div className="welcome-badge">
                  <span className="badge-emoji">🌟</span>
                  <span className="badge-text">New Member</span>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="survey-actions">
                {answers.send_hi === 'yes' && (
                  <motion.button
                    className="survey-btn primary go-to-btn"
                    onClick={goToCommunity}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>👋</span>
                    <span>Say Hi to Community</span>
                  </motion.button>
                )}
                
                {answers.community_belong === 'yes' && (
                  <motion.button
                    className="survey-btn primary go-to-btn"
                    onClick={goToCommunity}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>💙</span>
                    <span>Join Community</span>
                  </motion.button>
                )}
                
                {answers.leave_review === 'yes' && (
                  <motion.button
                    className="survey-btn primary go-to-btn"
                    onClick={goToReviews}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>⭐</span>
                    <span>Leave a Review</span>
                  </motion.button>
                )}
                
                <motion.button
                  className="survey-btn secondary"
                  onClick={resetSurvey}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Take Survey Again
                </motion.button>
                
                <motion.button
                  className="survey-btn secondary"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Exploring
                </motion.button>
              </div>
              
              {/* Debug info - remove in production */}
              {debugInfo && process.env.NODE_ENV === 'development' && (
                <p className="debug-info">Debug: {debugInfo}</p>
              )}
            </motion.div>
          ) : (
            // Question screen
            <motion.div
              key={visibleQuestions[currentQuestion].id}
              className="survey-question-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="survey-question-number">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
              
              <h3 className="survey-question">
                {visibleQuestions[currentQuestion].question}
              </h3>
              
              {visibleQuestions[currentQuestion].subtitle && (
                <p className="survey-question-subtitle">
                  {visibleQuestions[currentQuestion].subtitle}
                </p>
              )}
              
              <div className="survey-content">
                {/* Choice type */}
                {visibleQuestions[currentQuestion].type === 'choice' && (
                  <div className="survey-choice-group">
                    {visibleQuestions[currentQuestion].options.map((option) => (
                      <motion.button
                        key={option.value}
                        className={`survey-choice-btn ${
                          answers[visibleQuestions[currentQuestion].id] === option.value 
                            ? 'selected' 
                            : ''
                        }`}
                        onClick={() => handleAnswer(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="choice-emoji">{option.emoji}</span>
                        <span className="choice-label">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
                
                {/* Text type */}
                {visibleQuestions[currentQuestion].type === 'text' && (
                  <textarea
                    className="survey-textarea"
                    placeholder={visibleQuestions[currentQuestion].placeholder}
                    value={answers[visibleQuestions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    rows={3}
                  />
                )}
                
                {/* Rating type */}
                {visibleQuestions[currentQuestion].type === 'rating' && (
                  <div className="survey-rating-group">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        className={`survey-rating-btn ${
                          answers[visibleQuestions[currentQuestion].id] === rating 
                            ? 'selected' 
                            : ''
                        }`}
                        onClick={() => handleAnswer(rating)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {answers[visibleQuestions[currentQuestion].id] >= rating ? '⭐' : '☆'}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Error message */}
              {error && (
                <motion.p 
                  className="survey-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}
              
              {/* Navigation buttons */}
              <div className="survey-footer">
                <button
                  className="survey-btn prev"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  ← Previous
                </button>
                <button 
                  className="survey-btn next" 
                  onClick={nextQuestion}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Saving...
                    </>
                  ) : currentQuestion === totalQuestions - 1 ? (
                    'Submit 🎉'
                  ) : (
                    'Next →'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SurveyPopup;

