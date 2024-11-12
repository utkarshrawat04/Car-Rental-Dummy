const Customer = require('../models/customers-models');



const addCustomerFeedback = async (req, res) => {
  const { username, feedbackText, rating } = req.body;

  try {
    // Find the customer by their username
    const customer = await Customer.findOne({ username: username });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found', code: 404 });
    }

    // Add new feedback if provided
    if (feedbackText || rating) {
      customer.feedback.push({
        feedbackText: feedbackText || '',
        rating: rating || undefined,
        date: new Date(),
      });
    }

    // Save the updated customer document
    await customer.save();

    res.status(200).json({
      message: 'Feedback added successfully',
      customer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding feedback', error: error.message, code: 500 });
  }
};


const getHighRatingFeedback = async (req, res) => {
  try {
    // Find all customers that have feedback with a rating of 4 or higher
    const customers = await Customer.find({
      'feedback.rating': { $gte: 4 }
    });

    // Collect feedback data with username, feedback text, and rating
    const highRatingFeedback = customers.reduce((acc, customer) => {
      const validFeedback = customer.feedback.filter(fb => fb.rating >= 4);
      validFeedback.forEach(fb => acc.push({
        username: customer.username,
        feedbackText: fb.feedbackText,
        rating: fb.rating
      }));
      return acc;
    }, []);

    res.status(200).json({ feedback: highRatingFeedback });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

// Export the controller functions for use in routes
module.exports = {
  addCustomerFeedback,
  getHighRatingFeedback // Export the new method
};
