// API endpoints
const API_BASE_URL = 'http://localhost:3001/api';

// Save a new payment method
export const savePaymentMethod = async (cardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(cardData)
    });

    if (!response.ok) {
      throw new Error('Failed to save payment method');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error;
  }
};

// Update an existing payment method
export const updatePaymentMethod = async (cardId, cardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment-methods/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(cardData)
    });

    if (!response.ok) {
      throw new Error('Failed to update payment method');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (cardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment-methods/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete payment method');
    }

    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

// Get all payment methods for the current user
export const getPaymentMethods = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment-methods`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, '').split('').map(Number);
  const lastDigit = digits.pop();
  
  const sum = digits
    .reverse()
    .map((digit, index) => index % 2 === 0 ? digit * 2 : digit)
    .map(digit => digit > 9 ? digit - 9 : digit)
    .reduce((acc, digit) => acc + digit, 0);
  
  return (sum + lastDigit) % 10 === 0;
};

// Get card type based on number
export const getCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  if (/^6(?:011|5)/.test(number)) return 'discover';
  return 'unknown';
};

// Format card number for display
export const formatCardNumber = (cardNumber) => {
  return cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

// Mask card number for display
export const maskCardNumber = (cardNumber) => {
  const last4 = cardNumber.slice(-4);
  return `**** **** **** ${last4}`;
}; 