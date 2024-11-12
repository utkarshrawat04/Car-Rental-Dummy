import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/SignInPage.css';


const SignInPage = ({ isLoggedIn, setIsLoggedIn, setUserRole, setUsername }) => {  
    const location = useLocation(); // Used to access the current location and any passed state.
    const navigate = useNavigate(); // Used to navigate between routes.
    
    const [signInType, setSignInType] = useState('customer'); // Tracks whether the user is signing in as customer or admin.
    const [username, setLocalUsername] = useState('');  // Stores the entered username locally in this component.
    const [password, setPassword] = useState('');  // Stores the entered password.
    const [employeeId, setEmployeeId] = useState('');  // Stores the entered employee ID for admin sign-in.
    const [error, setError] = useState('');  // Stores error messages.
    const [success, setSuccess] = useState('');  // Stores success messages.

    const { from, carId } = location.state || { from: '/' }; // Retrieves the page the user was on or defaults to home.

    // Updates the sign-in type based on the URL path.
    useEffect(() => {
        if (location.pathname === '/signin/customerSignIn') {
            setSignInType('customer');
        } else if (location.pathname === '/signin/adminSignIn') {
            setSignInType('admin');
        }
    }, [location.pathname]);

    /**
     * Handles the switch between customer and admin sign-in.
     * Navigates to the respective route when the sign-in type changes.
     *
     * @param {string} type - The type of sign-in ('customer' or 'admin').
     */
    const handleSignInTypeChange = (type) => {
        setSignInType(type);
        if (type === 'customer') {
            navigate('/signin/customerSignIn');
        } else if (type === 'admin') {
            navigate('/signin/adminSignIn');
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
    
        // Set the appropriate endpoint based on the sign-in type.
        const endpoint = signInType === 'customer' 
          ? 'http://localhost:5000/api/customer/customerLogin' 
          : 'http://localhost:5000/api/customer/adminLogin';
    
        // Construct the request body.
        const body = signInType === 'customer' 
          ? { username: username, password }  // For customer login
          : { username: username, password, employeeid: employeeId };  // For admin login
    
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setSuccess(data.message);  // Display success message.
    
            // Update global login state and set the username.
            setIsLoggedIn(true);
            setUserRole(signInType);
            setUsername(username);  // Update the username globally.
    
            // Redirect to the BookMe page with car ID, or fallback to the previous or home page.
            if (carId) {
                navigate(`/book/${carId}`);
            } else {
                navigate(from);
            }
        } catch (error) {
            setError(`Error during sign-in: ${error.message}`);  // Display error message.
        }
    };

    const handleRegister = () => {
        if (signInType === 'customer') {
            navigate('/signin/customerRegister');
        } else if (signInType === 'admin') {
            navigate('/signin/adminRegister');
        }
    };


    const handleLogout = () => {
        setIsLoggedIn(false);  // Set user as logged out.
        setUserRole(null);  // Clear the user role.
        navigate('/');  // Navigate to the home page.
    };

    return (
        <>
        <div className="signin-page">
            <h1>Sign In</h1>
            <div className="signin-options">
                <button
                    onClick={() => handleSignInTypeChange('customer')}
                    className={signInType === 'customer' ? 'active' : ''}
                >
                    Customer Sign-In
                </button>
                <button
                    onClick={() => handleSignInTypeChange('admin')}
                    className={signInType === 'admin' ? 'active' : ''}
                >
                    Admin Sign-In
                </button>
            </div>

            {/* Sign-In Form */}
            <form className="signin-form" onSubmit={handleSignIn}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        name="username"
                        value={username}  // Bind the input to the local username state.
                        onChange={(e) => setLocalUsername(e.target.value)}  // Update the local username state.
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  // Update the password state.
                        required
                    />
                </div>
                {signInType === 'admin' && (
                    <div>
                        <label>Employee ID:</label>
                        <input 
                            type="text" 
                            name="employeeId"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}  // Update the employee ID state for admin sign-in.
                            required
                        />
                    </div>
                )}
                <button type="submit">Sign In</button>
            </form>

            {/* Registration Link */}
            <div className="register-link">
                <p>Don't have an account?</p>
                <button onClick={handleRegister}>Register</button>
            </div>

            {/* Display error or success message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Welcome back, {username}!</p>}

            {/* Logout button, shown only when logged in */}
            {isLoggedIn && (
                <div className="logout-button">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>

        <footer>
            <p>&copy; 2024 Bedi Rentals.</p>
        </footer>
      </>
    );
};

export default SignInPage;
