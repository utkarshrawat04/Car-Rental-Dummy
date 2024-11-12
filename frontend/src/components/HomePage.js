import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import '../css/HomePage.css';

/**
 * HomePage component handles the display of cars on sale, filtering of available cars,
 * and booking functionality. It includes a search form for users to find cars by location,
 * category, budget, and date range, as well as showcasing featured cars on sale.
 *
 * @param {boolean} isLoggedIn - Indicates if the user is logged in.
 * @returns {JSX.Element} - The rendered HomePage component.
 */
const HomePage = ({ isLoggedIn }) => {
  const [onSaleCars, setOnSaleCars] = useState([]);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [locations, setLocations] = useState([]); // To store all available locations
  const [selectedLocation, setSelectedLocation] = useState(''); // Store selected location
  const [categories, setCategories] = useState([]); // Store available categories for the selected location
  const [selectedCategory, setSelectedCategory] = useState(''); // Store selected category
  const [budget, setBudget] = useState(''); // Store the budget entered by the user
  const [filteredCars, setFilteredCars] = useState([]); // Store filtered cars
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation(); // Use to pass the original location

  /**
   * Fetches the list of cars on sale from the backend when the component mounts.
   * Filters the cars that have an old price (indicating they are on sale).
   *
   * @async
   * @function fetchOnSaleCars
   * @returns {void}
   */
  useEffect(() => {
    const fetchOnSaleCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars');
        const carsOnSale = response.data.filter(car => car.oldPrice); // Filter cars on sale
        setOnSaleCars(carsOnSale);
      } catch (error) {
        console.error('Error fetching cars on sale:', error);
      }
    };

    fetchOnSaleCars();
  }, []);

  /**
   * Sets up an interval to rotate through the featured cars on sale every 5 seconds.
   * This changes the displayed car in the "Cars on Sale" section.
   *
   * @returns {void}
   */
  useEffect(() => {
    if (onSaleCars.length > 0) {
      const interval = setInterval(() => {
        setCurrentCarIndex((prevIndex) => (prevIndex + 1) % onSaleCars.length);
      }, 5000); // Change car every 5 seconds

      return () => clearInterval(interval); // Clean up on component unmount
    }
  }, [onSaleCars]);

  /**
   * Fetches available locations from the backend for the search form.
   *
   * @async
   * @function fetchLocations
   * @returns {void}
   */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  /**
   * Fetches available categories for the selected location.
   * This is triggered when the user selects a location in the search form.
   *
   * @async
   * @function fetchCategories
   * @param {string} selectedLocation - The location selected by the user.
   * @returns {void}
   */
  useEffect(() => {
    if (selectedLocation) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/cars/categories?location=${selectedLocation}`);
          setCategories(response.data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      fetchCategories();
    }
  }, [selectedLocation]);

  /**
   * Handles the change of location selection in the search form.
   * Updates the selected location state.
   *
   * @param {Object} e - The event object from the location select dropdown.
   */
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  /**
   * Handles the change of category selection in the search form.
   * Updates the selected category state.
   *
   * @param {Object} e - The event object from the category select dropdown.
   */
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  /**
   * Handles the "Book Now" button click. If the user is logged in, they are navigated to the BookMe page.
   * If not logged in, the user is redirected to the SignIn page with the current car details passed as state.
   *
   * @param {string} carId - The ID of the car to be booked.
   * @param {string} carName - The name of the car to be booked.
   */
  const handleBookNow = (carId, carName) => {
    if (isLoggedIn) {
      navigate(`/book/${carId}`, { state: { carName } });  // Navigate to BookMe page with carName
    } else {
      navigate('/signin', { state: { from: location.pathname, carId, carName } });  // Redirect to SignIn page
    }
  };

  /**
   * Handles the "More Details" button click. Navigates to the CarDetailsPage for the selected car.
   *
   * @param {string} carId - The ID of the car to view more details.
   */
  const handleMoreDetails = (carId) => {
    navigate(`/car-details/${carId}`); // Navigate to the CarDetailsPage
  };

  /**
   * Handles the change of the "From Date" field and updates the state.
   * It also sets the minimum allowed value for the "To Date" based on the selected "From Date".
   *
   * @param {Object} e - The event object from the date input field.
   */
  // Setting min for 'fromDate' and dynamically updating 'toDate' based on selected 'fromDate'
useEffect(() => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
  const fromDateInput = document.getElementById('fromDate');
  if (fromDateInput) {
    fromDateInput.setAttribute('min', today); // Set 'min' attribute to today's date for 'fromDate'
  }
}, []);

const handleFromDateChange = (e) => {
  // Update the 'fromDate' state with the selected date
  setFromDate(e.target.value);

  // Get the 'To Date' input element
  const toDateInput = document.getElementById('toDate');

  // Parse the selected 'From Date' and add one day to it
  const newToDate = new Date(e.target.value);
  newToDate.setDate(newToDate.getDate() + 1); // Add 1 day to ensure 'To Date' is at least 1 day after 'From Date'

  // Convert the new 'To Date' to the ISO format 'YYYY-MM-DD'
  const minToDate = newToDate.toISOString().split('T')[0];

  // Set the 'min' attribute of the 'To Date' input to the calculated new minimum date
  if (toDateInput) {
    toDateInput.value = ''; // Clear the current 'To Date' value if it's before the new 'min' value
    toDateInput.setAttribute('min', minToDate); // Set the new minimum for 'To Date'
  }
};

  

  /**
   * Handles the change of the "To Date" field and updates the state.
   *
   * @param {Object} e - The event object from the date input field.
   */
  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  /**
   * Handles the search form submission. Sends a request to the backend to fetch
   * cars that match the user's search criteria, including location, category, budget, and dates.
   *
   * @async
   * @function handleSearch
   * @param {Object} e - The form submit event.
   * @returns {void}
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !selectedLocation || !selectedCategory || !budget) {
      alert('Please fill out all fields.');
      return;
    }

    // Calculate the number of rental days
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const rentalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24));

    try {
      // Send a request to the backend to get filtered cars
      const response = await axios.get(`http://localhost:5000/api/cars/filter`, {
        params: {
          location: selectedLocation,
          category: selectedCategory,
          budget,
          rentalDays,
          fromDate, // Pass the selected from date
          toDate // Pass the selected to date
        }
      });

      setFilteredCars(response.data);
    } catch (error) {
      console.error('Error searching cars:', error);
    }
  };

  return (
    <div className="homepage">
      <main>
        <section className="welcome-section">
          <h1>Bedi Rentals</h1>
          <p>Bedi Rentals empowers you to explore with ease and elegance. Select from our extensive vehicle collection for your upcoming journey.</p>
          <a href="#explore">Our Options</a>
        </section>

        <section className="featured-car">
          <h2>Cars on Sale</h2>
          {onSaleCars.length > 0 ? (
            <div key={onSaleCars[currentCarIndex]._id} className="car-item">
              <img src={`http://localhost:5000${onSaleCars[currentCarIndex].imageUrl}`} alt={onSaleCars[currentCarIndex].name} className="car-image" />
              <div className="car-details">
                <h2>{onSaleCars[currentCarIndex].name}</h2>
                <p>Car Year: {onSaleCars[currentCarIndex].year}</p>
                <p className="price">Price: ₹{onSaleCars[currentCarIndex].price}</p>
                <button onClick={() => handleBookNow(onSaleCars[currentCarIndex]._id, onSaleCars[currentCarIndex].name)}>Book Now</button> {/* Book Now button */}
                <button onClick={() => handleMoreDetails(onSaleCars[currentCarIndex]._id)}>More Details</button> {/* More Details button */}
              </div>
            </div>
          ) : (
            <p>No cars on sale at the moment.</p>
          )}
        </section>

        <section className="search-car">
          <h2>Search for a Car</h2>
          <form onSubmit={handleSearch}>
            {/* Location dropdown */}
            <div className="form-group">
              <label htmlFor="location">Pick up location</label>
              <select id="location" value={selectedLocation} onChange={handleLocationChange}>
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Category dropdown */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fromDate">From Date</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={handleFromDateChange}
                placeholder="From Date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="toDate">To Date</label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={handleToDateChange}
                placeholder="To Date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget</label>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Budget"
              />
            </div>

            {/* Centered Search button */}
            <div className="center-button">
              <button type="submit" className="search-button">Search</button>
            </div>
          </form>
        </section>

        {/* Display filtered cars */}
        {filteredCars.length > 0 && (
          <section className="filtered-results">
            <h2>Available Cars</h2>
            <div className="car-list">
              {filteredCars.map((car) => (
                <div key={car._id} className="car-item">
                  <img src={`http://localhost:5000${car.imageUrl}`} alt={car.name} className="car-image" />
                  <div className="car-details">
                    <h3>{car.name}</h3>
                    
                    <p>Location: {car.location}</p>
                    <button onClick={() => handleBookNow(car._id, car.name)}>Book Now</button> {/* Book Now button */}
                    <button onClick={() => handleMoreDetails(car._id)}>More Details</button> {/* More Details button */}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2024 Bedi Rentals.</p>
      </footer>
    </div>
  );
};

export default HomePage;
