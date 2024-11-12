import React, { useState, useEffect } from 'react';
import '../css/AboutPage.css';


const AboutPage = () => {


  const [feedback, setFeedback] = useState([]);


  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);


  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/customer/feedback/highRatings');
        const data = await response.json();
        setFeedback(data.feedback);
      } catch (error) {
        console.error('Error fetching high-rating feedback:', error);
      }
    };

    fetchFeedback();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prevIndex) => (prevIndex + 1) % feedback.length);

      const testimonialElement = document.querySelector('.testimonial');
      if (testimonialElement) {
        testimonialElement.classList.remove('active');
        setTimeout(() => {
          testimonialElement.classList.add('active');
        }, 10); 
      }
    }, 5000);

    return () => clearInterval(interval);  
  }, [feedback]);

  return (
    <>
      <div className="about-page">
        <h1>About Us</h1>
        <p>This was created by I028 Himanish Goel, I069 Utkarsh Rawat, I074 Karan Bedi</p>
        <a href="#learn-more">Learn More</a>

        <h2>Why Choose Us</h2>
        <ul>
        <li>A diverse fleet of vehicles to choose from</li>
    <li>Customizable rental plans to suit your needs</li>
    <li>Affordable rates for every budget</li>
    <li>Round-the-clock assistance</li>
    <li>A simple and hassle-free booking experience</li>
        </ul>

        {feedback.length > 0 && (
          <div className="testimonial active">
            <h3>{feedback[currentFeedbackIndex].name}</h3>
            <p>Rating: {feedback[currentFeedbackIndex].rating}/5</p>
            <p>Suggestion: {feedback[currentFeedbackIndex].feedbackText}</p>
          </div>
        )}

        {feedback.length === 0 && (
          <p>No feedback available with a rating of 4 or higher.</p>
        )}
      </div>
      <footer>
        <p>&copy; 2024 Bedi Rentals.</p>
      </footer>
    </>
  );
};

export default AboutPage;
