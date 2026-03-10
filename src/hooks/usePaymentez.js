import React, { useState } from 'react';
import { API_BASE_URL as BASE_URL } from '../config/api.js';
import { IS_DEMO_MODE } from '../config/demo.js';
import { MOCK_CARDS } from '../mock/data.js';

/**
 * Hook for payment cards; uses mock cards in demo mode.
 */
const usePaymentez = () => {
  const API_BASE_URL = `${BASE_URL}/cards`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);

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

  const getAllCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user } = loadUserToken();
      if (!user.id) throw new Error('Invalid user data');
      if (IS_DEMO_MODE) {
        const list = MOCK_CARDS[user.id] || [];
        const data = Array.isArray(list) ? list : list.cards || [];
        setCards(data);
        setLoading(false);
        return data;
      }
      const response = await fetch(`${API_BASE_URL}/all/${user.id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${loadUserToken().token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCards(Array.isArray(data) ? data : data.cards || []);
      return data;
    } catch (err) {
      setCards([]);
      setError(err.message || 'An error occurred while fetching cards');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardToken) => {
    if (IS_DEMO_MODE) {
      setCards((prev) => prev.filter((c) => c.token !== cardToken));
      return { success: true };
    }
    try {
      setLoading(true);
      setError(null);
      const { user, token } = loadUserToken();
      const response = await fetch(`${API_BASE_URL}/deleteCard`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardToken, userID: user.id })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the card');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const debitPaymentWithToken = async (order, card) => {
    if (IS_DEMO_MODE) {
      return { success: true, message: 'Demo payment simulated' };
    }
    try {
      setLoading(true);
      setError(null);
      const { user, token } = loadUserToken();
      const response = await fetch(`${API_BASE_URL}/debitWithToken`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, user, card })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (err) {
      setError(err.message || 'An error occurred submitting the payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  

  return {
    loading,
    error,
    getAllCards,
    deleteCard,
    debitPaymentWithToken
  };
};

export default usePaymentez; 