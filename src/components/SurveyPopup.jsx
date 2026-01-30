import React, { useState } from 'react';
import '../styles/SurveyPopup.css'; // We'll create this CSS

export const SurveyPopup = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 'hear-about',
      question: 'How did you hear about Auri?',
      type: 'select',
      options: ['Social Media', 'Friend/Family', 'Search Engine', 'App Store', 'Other']
    },
    {
      id: 'favorite-feature',
      question: 'What feature do you like most about Auri?',
      type: 'text',
      placeholder: 'Your answer here...'
    },
    {
      id: 'improvements',
      question: 'What improvements would you suggest?',
      type: 'textarea',
      placeholder: 'Share your thoughts...'
    },
    {
      id: 'rating',
      question: 'Rate your overall experience (1-5)',
      type: 'radio',
      options: ['1', '2', '3', '4', '5']
    },
    {
      id: 'recommend',
      question: 'Would you recommend Auri to friends?',
      type: 'radio',
      options: ['Yes', 'Maybe', 'No']
    }
  ];

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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

  const handleSubmit = () => {
    // Here you could send answers to server
    console.log('Survey answers:', answers);
    setSubmitted(true);
  };

  const resetSurvey = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="survey-modal-overlay" onClick={onClose}>
      <div className="survey-modal" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="survey-thank-you">
            <h2>Thank You! 🎉</h2>
            <p>Your feedback means a lot to us!</p>
            <p>As a token of appreciation, we'll send you $2 via PayPal.</p>
            <p>Please provide your PayPal email in the next step or contact us at innoxation.tech@gmail.com</p>
            <button className="survey-close-btn" onClick={resetSurvey}>Close</button>
          </div>
        ) : (
          <>
            <div className="survey-header">
              <h2>Quick Survey</h2>
              <span>{currentQuestion + 1} of {questions.length}</span>
              <button className="survey-close" onClick={onClose}>×</button>
            </div>
            <div className="survey-content">
              <h3>{questions[currentQuestion].question}</h3>
              {questions[currentQuestion].type === 'text' && (
                <input
                  type="text"
                  placeholder={questions[currentQuestion].placeholder}
                  value={answers[questions[currentQuestion].id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="survey-input"
                />
              )}
              {questions[currentQuestion].type === 'textarea' && (
                <textarea
                  placeholder={questions[currentQuestion].placeholder}
                  value={answers[questions[currentQuestion].id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="survey-textarea"
                />
              )}
              {questions[currentQuestion].type === 'select' && (
                <select
                  value={answers[questions[currentQuestion].id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="survey-select"
                >
                  <option value="">Select an option</option>
                  {questions[currentQuestion].options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {questions[currentQuestion].type === 'radio' && (
                <div className="survey-radio-group">
                  {questions[currentQuestion].options.map(option => (
                    <label key={option} className="survey-radio-label">
                      <input
                        type="radio"
                        name={questions[currentQuestion].id}
                        value={option}
                        checked={answers[questions[currentQuestion].id] === option}
                        onChange={(e) => handleAnswer(e.target.value)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="survey-footer">
              <button
                className="survey-btn prev"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button className="survey-btn next" onClick={nextQuestion}>
                {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};