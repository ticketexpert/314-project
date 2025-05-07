// Initial cards data
export const initialCards = [
  {
    id: 1,
    cardNumber: "4123123412344567",
    cardHolder: "MATTHEW GALE",
    expiryDate: "12/25",
    cvv: "123",
    cardType: "visa"
  },
  {
    id: 2,
    cardNumber: "5123123412348910",
    cardHolder: "MATTHEW GALE",
    expiryDate: "03/26",
    cvv: "456",
    cardType: "mastercard"
  }
];

// Get cards from localStorage or use initial data
export const getCards = () => {
  const storedCards = localStorage.getItem('cards');
  if (storedCards) {
    return JSON.parse(storedCards);
  }
  // If no cards in localStorage, save initial cards and return them
  localStorage.setItem('cards', JSON.stringify(initialCards));
  return initialCards;
};

// Save card
export const saveCard = (cardData) => {
  const cards = getCards();
  const newCard = {
    ...cardData,
    id: cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1
  };
  const updatedCards = [...cards, newCard];
  localStorage.setItem('cards', JSON.stringify(updatedCards));
  return newCard;
};

// Update card
export const updateCard = (cardData) => {
  const cards = getCards();
  const updatedCards = cards.map(card => 
    card.id === cardData.id ? cardData : card
  );
  localStorage.setItem('cards', JSON.stringify(updatedCards));
  return cardData;
};

// Delete card
export const deleteCard = (cardId) => {
  const cards = getCards();
  const updatedCards = cards.filter(card => card.id !== cardId);
  localStorage.setItem('cards', JSON.stringify(updatedCards));
  return true;
};

// Card validation utilities
export const validateCardNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, '').split('').map(Number);
  if (digits.length < 15 || digits.length > 16) return false;
  
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
  return 'unknown';
};

// Format card number for display
export const formatCardNumber = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  const cardType = getCardType(number);
  
  // Format based on card type
  if (cardType === 'amex') {
    // AMEX: XXXX XXXXXX XXXXX
    return number.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  } else {
    // Visa/Mastercard: XXXX XXXX XXXX XXXX
    return number.replace(/(\d{4})/g, '$1 ').trim();
  }
};

// Mask card number for display
export const maskCardNumber = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  const cardType = getCardType(number);
  
  if (cardType === 'amex') {
    const last5 = number.slice(-5);
    return `**** ****** ${last5}`;
  } else {
    const last4 = number.slice(-4);
    return `**** **** **** ${last4}`;
  }
}; 