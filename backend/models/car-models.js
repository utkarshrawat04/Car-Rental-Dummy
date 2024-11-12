const mongoose = require('mongoose');

// MongoDB Atlas connection URI
const uri = "mongodb+srv://kbedi03:Kbaylake@wpproject.gljys.mongodb.net/RentalCarManagement?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas'); // Log successful connection
})
.catch((error) => {
  console.error('Connection to MongoDB Atlas failed:', error); // Log any connection errors
});

// Define the schema for a car
const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // The car name is mandatory
  },
  category: {
    type: String,
    required: true // The category is mandatory
  },
  oldPrice: {
    type: Number,
    required: false // The old price is optional
  },
  price: {
    type: Number,
    required: true // The current price is mandatory
  },
  imageUrl: {
    type: String,
    required: true // The image URL is mandatory
  },
  location: {
    type: String,
    required: true // The location is mandatory
  },
  year: {
    type: Number, // Year of the car (could also be a string)
    required: true // Year is mandatory
  },
  fuelConsumption: String, // Optional field for fuel consumption
  safety: String, // Optional field for safety features
  lastMaintenance: Date, // Optional field for the date of last maintenance
  quality: String, // Optional field for quality description
  comfort: String, // Optional field for comfort description
  isSportCar: Boolean, // Indicates if the car is a sports model
  zeroToHundred: Number, // Optional field for acceleration (0-100 km/h)
  seats: Number, // Optional field for seating capacity
  kmPerDay: Number, // Optional field for kilometers driven per day
  warranty: String, // Optional field for warranty details
  insurance: String, // Optional field for insurance details
  rentalHistory: [ // Array of rental history objects
    {
      fromDate: Date, // Start date of rental
      toDate: Date,   // End date of rental
    }
  ]
});

// Create the Car model based on the defined schema
const Car = mongoose.model('Car', carSchema);

module.exports = Car; // Export the Car model for use in other modules
