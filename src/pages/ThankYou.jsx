import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import './Auth.css';

const ThankYou = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFromRegistration, setIsFromRegistration] = useState(false);

  // Get user data from location state if available
  const userData = location.state?.userData || {};
  
  // Check if we have data from registration process
  useEffect(() => {
    // If we have userData from state, mark this as coming from registration
    if (location.state?.userData) {
      setIsFromRegistration(true);
    } 
    // If not authenticated and not coming from registration, redirect to login
    else if (!isAuthenticated() && !isFromRegistration) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, location.state]);

  // Extract first name - prioritize data from useAuth, then navigation state
  const firstName = user?.nombres?.split(' ')[0] || userData?.nombres?.split(' ')[0] || 'User';

  return (
    <div className="auth-container">
      <div className="auth-card thank-you-card">
        <div className="thank-you-icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        
        <div className="auth-header">
          <h2>Registration successful!</h2>
          <p>Thank you for joining El Contador EC</p>
        </div>
        
        <div className="thank-you-message">
          <p>Hello <strong>{firstName}</strong>! Your account has been created successfully.</p>
          <p>You can now access all our accounting and tax services.</p>
        </div>
        
        <div className="thank-you-actions">
          <Link to="/" className="auth-button main-button">
            <FontAwesomeIcon icon={faHome} />
            <span>Go to home page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 