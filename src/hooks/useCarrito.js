import React, { useState } from 'react';

// URL base de la API


const useCarrito = () => {
  const API_BASE_URL = '/api/cartItems';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const loadUserToken = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User not found in localStorage');
      }
      return { user: JSON.parse(userStr), token };
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to handle in getAllCards
    }
  };

  const getAllCartItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = loadUserToken();
      
      if (!user.id) {
        throw new Error('Invalid user data');
      }

      const response = await fetch(`${API_BASE_URL}/getAll/${user.cartID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setCartItems(data);
      return data;
    } catch (error) {
      // Error loading cards - handle silently or with proper error state
      setCartItems([]);
      setError(error.message || 'An error occurred while fetching cart items');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (cartItemID) => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = loadUserToken();

      const response = await fetch(`${API_BASE_URL}/deleteCartItem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItemID: cartItemID })
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCartItem = async (itemID, quantity, discountPercentage) => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = loadUserToken();

      const response = await fetch(`${API_BASE_URL}/addItem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartID: user.cartID, itemID: itemID, quantity: quantity, discountPercentage: discountPercentage })
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred adding the cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findCartItemID = async (itemID) => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = loadUserToken();

      const response = await fetch(`${API_BASE_URL}/findCartItemID/${user.cartID}/${itemID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred finding the cart item ID');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const increaseItemQuantity = async (cartItemID, quantity) => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = loadUserToken();

      const response = await fetch(`${API_BASE_URL}/increaseItemQuantity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItemID: cartItemID, quantity: quantity })
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred updating the cart item quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const decreaseItemQuantity = async (cartItemID) => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = loadUserToken();

      const response = await fetch(`${API_BASE_URL}/decreaseItemQuantity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItemID: cartItemID})
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred updating the cart item quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return {
    loading,
    error,
    getAllCartItems,
    deleteCartItem,
    addCartItem,
    findCartItemID,
    increaseItemQuantity,
    decreaseItemQuantity
  };
};

export default useCarrito; 