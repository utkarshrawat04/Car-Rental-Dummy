import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";
import ServicesPage from "./components/ServicesPage"; 
import BookMe from './components/BookMe'; 
import FeedbackPage from './components/FeedbackPage';
import InvoicePage from "./components/InvoicePage"; 
import CarDetailsPage from './components/CarDetailsPage';
import NoPage from "./components/NoPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if the user is logged in
  const [userRole, setUserRole] = useState(null);  // Track the user's role (e.g., 'admin', 'customer')
  const [username, setUsername] = useState('');  // Store the user's username

  // Determine if the user is an admin based on userRole
  const isAdmin = userRole === 'admin';  // Update this line

  return (
    <BrowserRouter>
      <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="signin" element={<SignInPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setUsername={setUsername} />} />
        <Route path="/signin/customerSignIn" element={<SignInPage signInType="customer" isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setUsername={setUsername} />} />
        <Route path="/signin/adminSignIn" element={<SignInPage signInType="admin" isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setUsername={setUsername} />} />
        <Route path="/signin/customerRegister" element={<RegisterPage registerType="customer" />} />
        <Route path="/signin/adminRegister" element={<RegisterPage registerType="admin" />} />
        <Route path="/services" element={<ServicesPage isAdmin={isAdmin} />} />  {/* Pass isAdmin based on userRole */}
        <Route path="/book/:carId" element={<BookMe username={username} />} />  {/* Pass username to BookMe */}
        {/* <Route path="/feedback" element={<FeedbackPage username={username} />} />  Pass username to FeedbackPage */}
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/car-details/:carId" element={<CarDetailsPage />} /> {/* Add this route */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
