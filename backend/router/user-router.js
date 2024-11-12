const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer-controller.js');
const employeeController = require('../controllers/employee-controller.js');
const authController = require('../controllers/auth-controller.js');
const feedbackController = require('../controllers/feedback-controller.js');
const emailController = require('../controllers/email-controller');

// Handle customer registration
router.post('/customerRegister', customerController.postCustomer);//http://localhost:3000/signin/customerRegister

// Handle admin registration (if needed)
router.post('/adminRegister', employeeController.postAdmin);//http://localhost:3000/signin/adminRegister

/// Customer login
router.post('/customerLogin', authController.loginCustomer);//http://localhost:3000/signin/customerSignIn

// Admin login
router.post('/adminLogin', authController.loginAdmin);//http://localhost:3000/signin/adminSignIn

// Route to add feedback for a customer
router.post('/feedback', feedbackController.addCustomerFeedback);

//Route to get the highest feedback
router.get('/feedback/highRatings', feedbackController.getHighRatingFeedback);

// POST route to send invoice email based on username
router.post('/sendInvoiceEmail', emailController.sendInvoiceEmail);

module.exports = router;
