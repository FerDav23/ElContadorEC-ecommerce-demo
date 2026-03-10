import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import fullLogoImage from '../assets/el contador logo-05.png';
import './DemoLanding.css';

/**
 * Demo entry: choose to sign in as Manager or Client. Shown only when IS_DEMO_MODE and not authenticated.
 */
const DemoLanding = () => {
  const navigate = useNavigate();
  const { loginDemo, isAuthenticated } = useAuth();

  const handleRole = (role) => {
    loginDemo(role);
    // Full reload so RootRoute and all useAuth() instances see localStorage; then we land on home.
    window.location.replace('/');
  };

  if (isAuthenticated()) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <main className="demo-landing">
      <div className="demo-landing-card">
        <img src={fullLogoImage} alt="El Contador EC" className="demo-landing-logo" />
        <h1 className="demo-landing-title">Demo</h1>
        <p className="demo-landing-desc">
          This is a <strong>demo</strong> of the application. No real backend or payments are used. All data is mock.
        </p>
        <div className="demo-landing-badge">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>Choose a role to explore the app</span>
        </div>
        <div className="demo-landing-actions">
          <button type="button" className="demo-btn demo-btn-manager" onClick={() => handleRole('manager')}>
            <FontAwesomeIcon icon={faUserTie} />
            <span>Sign in as Manager</span>
            <small>Access admin panel and manage categories, services, and items</small>
          </button>
          <button type="button" className="demo-btn demo-btn-client" onClick={() => handleRole('client')}>
            <FontAwesomeIcon icon={faUser} />
            <span>Sign in as Client</span>
            <small>Browse services, add to cart, and view profile</small>
          </button>
        </div>
      </div>
    </main>
  );
};

export default DemoLanding;
