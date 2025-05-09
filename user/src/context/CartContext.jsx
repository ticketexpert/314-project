import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (event, tickets) => {
    setCartItems(prevItems => {
      const existingEventIndex = prevItems.findIndex(item => item.eventId === event.id);
      
      if (existingEventIndex > -1) {
        // Update existing event's tickets
        const updatedItems = [...prevItems];
        updatedItems[existingEventIndex].tickets = {
          ...updatedItems[existingEventIndex].tickets,
          ...tickets
        };
        return updatedItems;
      } else {
        // Add new event with tickets
        return [...prevItems, {
          eventId: event.id,
          eventTitle: event.title,
          eventImage: event.image,
          eventDate: event.fromDateTime,
          eventVenue: event.venue,
          tickets
        }];
      }
    });
  };

  const removeFromCart = (eventId) => {
    setCartItems(prevItems => prevItems.filter(item => item.eventId !== eventId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = Object.entries(item.tickets).reduce((sum, [type, ticket]) => {
        return sum + (ticket.quantity * ticket.price);
      }, 0);
      return total + itemTotal;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => {
      return count + Object.values(item.tickets).reduce((sum, ticket) => sum + ticket.quantity, 0);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 