const jwt = require('jsonwebtoken');
const Customer = require('../models/customers-models.js');
const Employee = require('../models/employee-models.js');
require('dotenv').config(); // Load environment variables from .env file

const SECRET_KEY = process.env.SECRET_KEY; // Use the secret key from .env


const loginCustomer = async (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request for customer:', username);

  if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ data: 'All fields are required', code: 400 });
  }

  try {
      const user = await Customer.findOne({ username, password });

      if (!user) {
          console.log('Invalid username or password for customer:', username);
          return res.status(401).json({ data: 'Invalid username or password', code: 401 });
      }

      console.log('Customer found:', user);

      // Generate a JWT
      const token = jwt.sign({ id: user._id, type: 'customer' }, SECRET_KEY, { expiresIn: '1h' });

      console.log('Generated JWT for customer:', username);

      // Set the JWT as an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });

      // Send the user's name in the response
      return res.status(200).json({ message: `Welcome back, ${user.username}!`, code: 200 });
  } catch (error) {
      console.error('Error during customer login:', error);
      return res.status(500).json({ data: 'Error during login', error: error.message, code: 500 });
  }
};


const loginAdmin = async (req, res) => {
  const { username, password, employeeid } = req.body;

  console.log('Received login request for admin:', username);

  if (!username || !password || !employeeid) {
      console.log('Missing username, password, or employee ID');
      return res.status(400).json({ data: 'All fields are required', code: 400 });
  }

  try {
      const user = await Employee.findOne({ username, password, employeeid });

      if (!user) {
          console.log('Invalid username, password, or employee ID for admin:', username);
          return res.status(401).json({ data: 'Invalid username, password, or employee ID', code: 401 });
      }

      console.log('Admin found:', user);

      // Generate a JWT
      const token = jwt.sign({ id: user._id, type: 'admin' }, SECRET_KEY, { expiresIn: '1h' });

      console.log('Generated JWT for admin:', username);

      // Set the JWT as an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });

      // Send the user's name in the response
      return res.status(200).json({ message: `Welcome back admin, ${user.username}!`, code: 200 });
  } catch (error) {
      console.error('Error during admin login:', error);
      return res.status(500).json({ data: 'Error during login', error: error.message, code: 500 });
  }
};

module.exports = {
  loginCustomer,
  loginAdmin,
};
