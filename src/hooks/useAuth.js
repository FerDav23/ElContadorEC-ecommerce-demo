import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.js';
import { IS_DEMO_MODE } from '../config/demo.js';
import { DEMO_USERS } from '../mock/data.js';

/**
 * Auth hook: real API or demo login (loginDemo) when IS_DEMO_MODE.
 */
const useAuth = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminStatus, setAdminStatus] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return false;
      const u = JSON.parse(stored);
      return IS_DEMO_MODE && u.token?.startsWith('demo-token-') ? !!u.isAdmin : false;
    } catch {
      return false;
    }
  });
  const [adminStatusVerified, setAdminStatusVerified] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return false;
      const u = JSON.parse(stored);
      return IS_DEMO_MODE && u.token?.startsWith('demo-token-');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (IS_DEMO_MODE && parsedUser.token && parsedUser.token.startsWith('demo-token-')) {
          setAdminStatus(parsedUser.isAdmin === true);
          setAdminStatusVerified(true);
        } else {
          verifyAdminStatus();
        }
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Verifica el estado de administrador con el servidor
   * @returns {Promise<boolean>} - true si el usuario es administrador según el servidor
   */
  const verifyAdminStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAdminStatus(false);
      setAdminStatusVerified(true);
      return false;
    }
    if (IS_DEMO_MODE && token.startsWith('demo-token-')) {
      const u = user || (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }})();
      const isAdmin = u && u.isAdmin === true;
      setAdminStatus(isAdmin);
      setAdminStatusVerified(true);
      return isAdmin;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setAdminStatus(false);
        setAdminStatusVerified(true);
        return false;
      }

      const data = await response.json();
      setAdminStatus(data.isAdmin === true);
      setAdminStatusVerified(true);
      return data.isAdmin === true;
    } catch (err) {
      console.error('Error verifying admin status:', err);
      setAdminStatus(false);
      setAdminStatusVerified(true);
      return false;
    }
  };

  /**
   * Iniciar sesión con correo y contraseña
   * @param {Object} credentials - Credenciales (correo y password)
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const login = async (credentials) => {
    if (IS_DEMO_MODE) {
      setError('Use "Sign in as Manager" or "Sign in as Client" on the demo home page.');
      return { success: false, error: 'Use demo role chooser.' };
    }
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y datos de usuario
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      // Verify admin status immediately after login
      await verifyAdminStatus();

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const register = async (userData) => {
    if (IS_DEMO_MODE) {
      setError('Registration is disabled in demo. Use "Sign in as Client" to explore.');
      return { success: false, error: 'Registration disabled in demo.' };
    }
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      // Guardar token y datos de usuario
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      // Verify admin status immediately after registration
      await verifyAdminStatus();

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setAdminStatus(false);
    setAdminStatusVerified(false);
  };

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} - true si hay un usuario autenticado
   */
  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  /**
   * Verificar si el usuario es administrador
   * @returns {Promise<boolean>} - true si el usuario es administrador
   */
  const isAdmin = async () => {
    // If not authenticated, not an admin
    if (!isAuthenticated()) {
      return false;
    }
    
    // If admin status hasn't been verified yet, verify it now
    if (!adminStatusVerified) {
      return await verifyAdminStatus();
    }
    
    // Return the verified admin status
    return adminStatus;
  };

  /**
   * Obtener el perfil del usuario
   * @returns {Promise<Object>} - Datos del perfil del usuario
   */
  const getUserProfile = async () => {
    if (IS_DEMO_MODE) {
      const u = user || (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }})();
      if (u) return { success: true, data: u };
      return { success: false, error: 'Not logged in' };
    }
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener perfil');
      }
      
      // Update admin status after profile fetch
      if (data.isAdmin !== undefined) {
        setAdminStatus(data.isAdmin === true);
        setAdminStatusVerified(true);
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Demo only: sign in as manager or client without backend.
   * @param {'manager' | 'client'} role
   */
  const loginDemo = (role) => {
    if (!IS_DEMO_MODE) return;
    const demoUser = role === 'manager' ? DEMO_USERS.manager : DEMO_USERS.client;
    const payload = { ...demoUser };
    localStorage.setItem('authToken', payload.token);
    localStorage.setItem('user', JSON.stringify(payload));
    setUser(payload);
    setAdminStatus(payload.isAdmin === true);
    setAdminStatusVerified(true);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    loginDemo,
    isAuthenticated,
    isAdmin,
    getUserProfile,
    refreshAdminStatus: verifyAdminStatus
  };
};

export default useAuth; 