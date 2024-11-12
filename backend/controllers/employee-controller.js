const Employee = require('../models/employee-models');


const postAdmin = async (req, res) => {
  console.log('Received data:', req.body); // Log the received data
  const { username, email, password, employeeid } = req.body;

  // Validate that all required fields are provided
  if (!username || !email || !password || !employeeid) {
    return res.status(400).json({ data: 'All fields are required', code: 400 });
  }

  try {
    // Create a new Employee instance
    const newEmployee = new Employee({
      username,
      email,
      password,
      employeeid
    });

    // Save the new employee to the database
    await newEmployee.save();
    return res.status(201).json({ data: 'Employee registered successfully!', code: 201 });
  } catch (error) {
    // Handle any errors during the registration process
    return res.status(500).json({ data: 'Error registering customer', error: error.message, code: 500 });
  }
};

// Export the postAdmin function for use in routes
module.exports = {
    postAdmin,
};
