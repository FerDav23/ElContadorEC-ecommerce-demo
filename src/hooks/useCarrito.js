import React, { useState } from 'react';
import { IS_DEMO_MODE } from '../config/demo.js';
import { getMockCartItems, setMockCartItems } from '../mock/data.js';

const useCarrito = () => {
  const API_BASE_URL = '/api/cartItems';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const loadUserToken = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found in localStorage');
      return { user: JSON.parse(userStr), token };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getAllCartItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user } = loadUserToken();
      if (!user.id) throw new Error('Invalid user data');
      if (IS_DEMO_MODE) {
        const data = getMockCartItems(user.cartID) || [];
        setCartItems(data);
        setLoading(false);
        return data;
      }
      const response = await fetch(`${API_BASE_URL}/getAll/${user.cartID}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${loadUserToken().token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCartItems(data);
      return data;
    } catch (err) {
      setCartItems([]);
      setError(err.message || 'An error occurred while fetching cart items');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (cartItemID) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = loadUserToken();
      if (IS_DEMO_MODE) {
        const current = getMockCartItems(user.cartID) || [];
        const next = current.filter((i) => String(i.cartItemID || i.id) !== String(cartItemID));
        setMockCartItems(user.cartID, next);
        setCartItems(next);
        setLoading(false);
        return { success: true };
      }
      const response = await fetch(`${API_BASE_URL}/deleteCartItem`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${loadUserToken().token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemID })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      await getAllCartItems();
      return data;
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCartItem = async (itemID, quantity, discountPercentage) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = loadUserToken();
      if (IS_DEMO_MODE) {
        const current = getMockCartItems(user.cartID) || [];
        const newItem = { cartItemID: `demo-${Date.now()}`, itemID, quantity: quantity || 1, discountPercentage: discountPercentage || 0 };
        const next = [...current, newItem];
        setMockCartItems(user.cartID, next);
        setCartItems(next);
        setLoading(false);
        return { success: true, cartItemID: newItem.cartItemID };
      }
      const response = await fetch(`${API_BASE_URL}/addItem`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${loadUserToken().token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartID: user.cartID, itemID, quantity: quantity || 1, discountPercentage: discountPercentage || 0 })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || 'An error occurred adding the cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findCartItemID = async (itemID) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = loadUserToken();
      if (IS_DEMO_MODE) {
        const current = getMockCartItems(user.cartID) || [];
        const found = current.find((i) => String(i.itemID) === String(itemID));
        setLoading(false);
        return found ? { cartItemID: found.cartItemID || found.id } : null;
      }
      const response = await fetch(`${API_BASE_URL}/findCartItemID/${user.cartID}/${itemID}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${loadUserToken().token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || 'An error occurred finding the cart item ID');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const increaseItemQuantity = async (cartItemID, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = loadUserToken();
      if (IS_DEMO_MODE) {
        const current = getMockCartItems(user.cartID) || [];
        const next = current.map((i) =>
          String(i.cartItemID || i.id) === String(cartItemID) ? { ...i, quantity: (i.quantity || 1) + (quantity || 1) } : i
        );
        setMockCartItems(user.cartID, next);
        setCartItems(next);
        setLoading(false);
        return { success: true };
      }
      const response = await fetch(`${API_BASE_URL}/increaseItemQuantity`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${loadUserToken().token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemID, quantity })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred updating the cart item quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const decreaseItemQuantity = async (cartItemID) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = loadUserToken();
      if (IS_DEMO_MODE) {
        const current = getMockCartItems(user.cartID) || [];
        const next = current.map((i) => {
          if (String(i.cartItemID || i.id) !== String(cartItemID)) return i;
          const q = Math.max(0, (i.quantity || 1) - 1);
          return q === 0 ? null : { ...i, quantity: q };
        }).filter(Boolean);
        setMockCartItems(user.cartID, next);
        setCartItems(next);
        setLoading(false);
        return { success: true };
      }
      const response = await fetch(`${API_BASE_URL}/decreaseItemQuantity`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${loadUserToken().token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemID })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred updating the cart item quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return {
    cartItems,
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