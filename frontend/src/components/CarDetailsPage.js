import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import '../css/CarDetailsPage.css'; // You can add custom styling for this page


const CarDetailsPage = () => {
  const { carId } = useParams();  // Retrieve carId from the URL
  const [carDetails, setCarDetails] = useState(null);  // State to store car details
  const navigate = useNavigate();  // Initialize navigate for back navigation


  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/carId/${carId}`);
        setCarDetails(response.data);  // Store the car details in state
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    fetchCarDetails();
  }, [carId]);  // Dependency array to re-fetch if carId changes

  // Render a loading message while the car details are being fetched
  if (!carDetails) {
    return <div>Loading...</div>;
  }


  const handleBackClick = () => {
    navigate(-1);  // Navigate to the previous page
  };

  return (
    <div className="car-details-page">
      <h1>Car Details: {carDetails.name}</h1>

      {/* Display Car Image in a Card Format */}
      <div className="car-details-card">
        <img src={`http://localhost:5000${carDetails.imageUrl}`} alt={carDetails.name} />
        <h2>{carDetails.name}</h2>
        <p>Car Year: {carDetails.year}</p>
        <p>Price: {carDetails.price}₹</p>
        <p>Location: {carDetails.location}</p>
      </div>

      {/* Display Car Details in a Table */}
      <table className="car-details-table">
        <tbody>
          <tr>
            <td>Category:</td>
            <td>{carDetails.category}</td>
          </tr>
          <tr>
            <td>Price:</td>
            <td>₹{carDetails.price}</td>
          </tr>
          <tr>
            <td>Location:</td>
            <td>{carDetails.location}</td>
          </tr>
          <tr>
            <td>Fuel Consumption:</td>
            <td>{carDetails.fuelConsumption}</td>
          </tr>
          <tr>
            <td>Safety:</td>
            <td>{carDetails.safety}</td>
          </tr>
          <tr>
            <td>Last Maintenance:</td>
            <td>{carDetails.lastMaintenance}</td>
          </tr>
          <tr>
            <td>Quality:</td>
            <td>{carDetails.quality}</td>
          </tr>
          <tr>
            <td>Comfort:</td>
            <td>{carDetails.comfort}</td>
          </tr>
          <tr>
            <td>Seats:</td>
            <td>{carDetails.seats}</td>
          </tr>
          <tr>
            <td>KM Per Day:</td>
            <td>{carDetails.kmPerDay}</td>
          </tr>
          <tr>
            <td>Warranty:</td>
            <td>{carDetails.warranty}</td>
          </tr>
          <tr>
            <td>Insurance:</td>
            <td>{carDetails.insurance}</td>
          </tr>
          {carDetails.isSportCar && (
            <tr>
              <td>Acceleration (0-100 km/h):</td>
              <td>{carDetails.acceleration}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        Back
      </button>
    </div>
  );
};

export default CarDetailsPage;
