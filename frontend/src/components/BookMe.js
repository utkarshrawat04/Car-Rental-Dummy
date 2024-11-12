import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../css/BookMe.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';  
import moment from 'moment';  

const BookMe = ({ username }) => {
  const { carId } = useParams();
  const location = useLocation();
  const { carName } = location.state || {};  // Get carName from state


  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    fromDate: null,  
    toDate: null,    
    paymentDate: '',
    rentalDays: 1,        
    amount: 0,            
    currency: 'ILS',      
  });

 
  const [carDetails, setCarDetails] = useState({ price: 0, oldPrice: null });


  const [rentalHistory, setRentalHistory] = useState([]);


  const [availabilityMessage, setAvailabilityMessage] = useState('');

  const navigate = useNavigate();


  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/carId/${carId}`);
        setCarDetails(response.data);

        // Fetch rental history of the car
        if (response.data.rentalHistory) {
          setRentalHistory(response.data.rentalHistory);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);


  const isDateInRentalHistory = (date) => {
    const selectedDate = moment(date);


    return rentalHistory.some((rental) => {
      const rentalFromDate = moment(rental.fromDate);
      const rentalToDate = moment(rental.toDate);
      return selectedDate.isBetween(rentalFromDate, rentalToDate, null, '[]');
    });
  };


  const filterUnavailableDates = (date) => {
    return !isDateInRentalHistory(date);
  };

  const handleFromDateChange = (date) => {
    if (isDateInRentalHistory(date)) {
      setAvailabilityMessage('The car is not available for the selected dates.');
      setFormData((prevState) => ({
        ...prevState,
        fromDate: null,
      }));
    } else {
      setAvailabilityMessage('');
      const minToDate = moment(date).add(1, 'days');  // Add 1 day to the selected "From Date"
      setFormData((prevState) => ({
        ...prevState,
        fromDate: date,
        toDate: prevState.toDate && moment(prevState.toDate).isBefore(minToDate) ? null : prevState.toDate,
        rentalDays: calculateRentalDays(date, formData.toDate),  // Calculate rental days
      }));
    }
  };


  const handleToDateChange = (date) => {
    if (isDateInRentalHistory(date)) {
      setAvailabilityMessage('The car is not available for the selected dates.');
      setFormData((prevState) => ({
        ...prevState,
        toDate: null,
      }));
    } else {
      setAvailabilityMessage('');
      setFormData((prevState) => ({
        ...prevState,
        toDate: date,
        rentalDays: calculateRentalDays(formData.fromDate, date),  // Calculate rental days
      }));
    }
  };


  const calculateRentalDays = (fromDate, toDate) => {
    if (fromDate && toDate) {
      const from = moment(fromDate);
      const to = moment(toDate);
      const diffDays = to.diff(from, 'days');
      return diffDays > 0 ? diffDays : 1;  // Default to 1 if dates are not set correctly
    }
    return 1;  // Default to 1 if dates are not set
  };


  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = cleanedValue.replace(/(.{4})/g, '$1 ').trim(); // Add space after every 4 digits
    return formattedValue;
  };


  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatCardNumber(value);
    setFormData((prevState) => ({
      ...prevState,
      cardNumber: formattedValue,
    }));
  };


  const calculateAmount = () => {
    const rentalDays = formData.rentalDays;
    const carPrice = carDetails.oldPrice || carDetails.price;  
    let amount = rentalDays * carPrice;


    return amount;
  };


  useEffect(() => {
    const newAmount = calculateAmount();
    setFormData((prevState) => ({
      ...prevState,
      amount: isNaN(newAmount) ? 0 : newAmount,  
    }));
  }, [formData.rentalDays, formData.currency, carDetails]);


  const restrictInput = (e, maxLength, max) => {
    const value = e.target.value;


    if (value.length > maxLength || parseInt(value, 10) > max) {
      e.target.value = value.slice(0, -1);  
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const maskedCardNumber = '**** **** **** ' + formData.cardNumber.slice(-4);


    try {
      const response = await axios.post('http://localhost:5000/api/cars/checkAvailabilityAndBook', {
        carId,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
      });

      if (response.status === 200) {

        navigate('/invoice', {
          state: {
            username: username,
            carName: carName,
            cardNumber: maskedCardNumber,
            cardName: formData.cardName,  
            rentalDays: formData.rentalDays,
            amount: formData.amount,
            paymentDate: formData.paymentDate,
            fromDate: formData.fromDate,  
            toDate: formData.toDate,     
          },
        });
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setAvailabilityMessage('Car is not available for the selected dates.');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="payment-container">
      <div className="payment-background">
        <form className="payment-form" onSubmit={handleSubmit}>
          <h2 className="payment-title">Secure Payment for {carName}</h2>

          <label>Name on Card</label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            placeholder="Karan Bedi"
            required
          />

          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 1234 5678"
            maxLength="19"  
            required
          />

          <div className="expiry-cvv">
            <div className="expiry">
              <label>Expire Month</label>
              <input
                type="number"
                name="expiryMonth"
                value={formData.expiryMonth}
                onInput={(e) => restrictInput(e, 2, 12)}  // Restrict to 1-12
                onChange={handleInputChange}
                placeholder="MM"
                min="1"
                max="12"  // Restrict month to 1-12
                required
              />
              <label>Expire Year</label>
              <input
                type="number"
                name="expiryYear"
                value={formData.expiryYear}
                onInput={(e) => restrictInput(e, 2, 99)}  // Restrict to 24-99
                onChange={handleInputChange}
                placeholder="YY"
                min="24"
                max="99"  // Restrict year to 24-99
                required
              />
            </div>

            <div className="cvv">
              <label>CVV</label>
              <input
                type="number"
                name="cvv"
                value={formData.cvv}
                onInput={(e) => restrictInput(e, 3, 999)}  // Restrict to 1-999
                onChange={handleInputChange}
                placeholder="123"
                max="999"  // Restrict CVV to a max of 999
                required
              />
            </div>
          </div>

          <label>From Date</label>
          <DatePicker
            selected={formData.fromDate}
            onChange={handleFromDateChange}
            minDate={new Date()}  // Disable past dates
            filterDate={filterUnavailableDates}  // Disable unavailable dates
            placeholderText="Select a from date"
            dateFormat="dd/MM/yyyy"
            required
          />

          <label>To Date</label>
          <DatePicker
            selected={formData.toDate}
            onChange={handleToDateChange}
            minDate={formData.fromDate ? moment(formData.fromDate).add(1, 'days').toDate() : null}  // Disable dates before the fromDate
            filterDate={filterUnavailableDates}  // Disable unavailable dates
            placeholderText="Select a to date"
            dateFormat="dd/MM/yyyy"
            required
          />

          <label>Rental Days</label>
          <input
            type="number"
            name="rentalDays"
            value={formData.rentalDays || 1}  // Default to 1 if undefined
            readOnly
          />

          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount || 0}  // Default to 0 if undefined
            readOnly
          />

          

          {availabilityMessage && <p className="error-message">{availabilityMessage}</p>}

          <button type="submit" className="payment-button" disabled={!!availabilityMessage}>
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookMe;
