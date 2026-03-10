import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [allowRedirect, setAllowRedirect] = useState(true);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.correo) {
      errors.correo = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setLoginError('');
      setLoginSuccess('');
      
      try {
        const result = await login(formData);
        
        if (!result.success) {
          setLoginError(result.error || 'Sign in failed. Please check your credentials.');
        } else {
          // Block redirect until we're ready
          setAllowRedirect(false);
          
          // Show success message
          setLoginSuccess(`Welcome back, ${result.data.nombres?.split(' ')[0] || 'User'}!`);
          
          // Refresh the page to update user info everywhere
          setTimeout(() => {
            window.location.href = '/';
          }, 1200);
        }
      } catch (error) {
        setLoginError('Error connecting to the server. Please try again.');
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Sign In</h2>
          <p>Enter your credentials to continue</p>
        </div>
        
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}
        
        {loginSuccess && (
          <div className="success-message">
            <FontAwesomeIcon icon={faCheckCircle} /> {loginSuccess}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="correo">
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="email@example.com"
              className={formErrors.correo ? 'error' : ''}
              autoComplete="email"
            />
            {formErrors.correo && <div className="field-error">{formErrors.correo}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              className={formErrors.password ? 'error' : ''}
              autoComplete="current-password"
            />
            {formErrors.password && <div className="field-error">{formErrors.password}</div>}
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Signing in...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} /> Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don&apos;t have an account? <Link to="/register">Register now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 