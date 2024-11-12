import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/FeedbackPage.css';

const FeedbackPage = () => {
  const location = useLocation();
  const { username } = location.state || '';  // Get the username passed from InvoicePage

  
  const [feedback, setFeedback] = useState('');


  const [rating, setRating] = useState(0);


  const [successMessage, setSuccessMessage] = useState('');


  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      username,  // Pass the logged-in username
      feedbackText: feedback,
      rating,
    };

    try {
      const response = await fetch('http://localhost:5000/api/customer/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setSuccessMessage('Thank you for your feedback!');  // Show success message
        setFeedback('');  // Clear feedback field
        setRating(0);  // Reset rating
      } else {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.message || 'Error submitting feedback');  // Show error message
      }
    } catch (error) {
      setErrorMessage('Error submitting feedback. Please try again.');  // Handle submission error
    }
  };

  return (
    <>
      <div className="feedback-page">
        <h1>We Value Your Feedback</h1>
        {username && <p>Hello, {username}. Please share your feedback below!</p>} {/* Display the logged-in user's name */}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="feedback">Your Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="5"
              required
            />
          </div>
          <div className="form-group rating-group">
            <label htmlFor="rating">Rate Us:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((rate) => (
                <span
                  key={rate}
                  className={`star ${rating >= rate ? 'selected' : ''}`}
                  onClick={() => setRating(rate)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="submit-button">Submit Feedback</button>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
      <footer>
        <p>&copy; 2024 Bedi Rentals.</p>
      </footer>
    </>
  );
};

export default FeedbackPage;
