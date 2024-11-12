var mongoose = require('mongoose');

// MongoDB Atlas connection URI
const uri = "mongodb+srv://kbedi03:Kbaylake@wpproject.gljys.mongodb.net/RentalCarManagement?retryWrites=true&w=majority";

// Database connection (MongoDB Atlas or local MongoDB)
mongoose.connect(uri)
  .then(() => {
      console.log('Connected to the MongoDB Atlas database: RentalCarManagement'); // Log successful connection
  })
  .catch((error) => {
      console.log('Connection failed!', error); // Log any connection errors
  });

// Define the customer schema
var customerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true, // Username is mandatory
        unique: true // Ensure usernames are unique
    },
    password: {
        type: String,
        required: true // Password is mandatory
    },
    email: {
        type: String,
        required: true, // Email is mandatory
        unique: true // Ensure emails are unique
    },
    feedback: [ // Array to store feedback objects
        {
            feedbackText: { type: String, required: false },  // Optional feedback text
            rating: { type: Number, required: false, min: 1, max: 5 },  // Optional rating with constraints
            date: { type: Date, default: Date.now } // Date of feedback, defaults to current date
        }
    ]
});

// Create the model from the schema
var Customer = mongoose.model("Customer", customerSchema);

// Export the Customer model for use in other modules
module.exports = Customer;
