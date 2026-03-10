// API Configuration
import { IS_DEMO_MODE } from './demo.js';

// 🔧 MANUAL SWITCH: Change this line to switch environments
// Options: 'development' | 'production'
const MANUAL_ENVIRONMENT = 'production'; // 👈 Change this to 'production' to use EC2 backend

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || MANUAL_ENVIRONMENT;

// Backend server configurations
const BACKEND_SERVERS = {
  development: {
    BASE_URL: '/api',
    BACKEND_URL: 'http://localhost:5000'
  },
  production: {
    BASE_URL: '/api',
    BACKEND_URL: 'https://api.elcontadorec.store'
  },
};

export const API_CONFIG = {
  ENVIRONMENT,
  ...BACKEND_SERVERS[ENVIRONMENT],
  getCurrentEnvironment: () => ({
    environment: ENVIRONMENT,
    isProduction: ENVIRONMENT === 'production',
    isDevelopment: ENVIRONMENT === 'development'
  })
};

// In demo mode we do not call the real backend; this is only for non-demo fallback
export const API_BASE_URL = IS_DEMO_MODE
  ? ''
  : `${API_CONFIG.BACKEND_URL}${API_CONFIG.BASE_URL}`;

if (!IS_DEMO_MODE) {
  console.log(`🔧 API Config - Environment: ${ENVIRONMENT}`, {
    BASE_URL: API_CONFIG.BASE_URL,
    BACKEND_URL: API_CONFIG.BACKEND_URL
  });
} 