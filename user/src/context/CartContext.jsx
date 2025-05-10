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
  // Initialize state from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (event, tickets) => {
    console.log('Current cart items:', cartItems); // Debug log
    console.log('Adding new event:', event); // Debug log
    console.log('Adding new tickets:', tickets); // Debug log

    setCartItems(prevItems => {
      // Create a new array to avoid mutating the previous state
      const newItems = [...prevItems];
      
      // Check if the event already exists in the cart
      const existingEventIndex = newItems.findIndex(item => item.eventId === event.id);
      
      if (existingEventIndex === -1) {
        // Event not in cart, add new event with tickets
        const newEvent = {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.fromDateTime,
          eventVenue: event.venue,
          eventImage: event.image,
          eventCategory: event.category,
          eventRegion: event.region,
          tickets: { ...tickets }  // Create a new object to avoid reference issues
        };
        console.log('Adding new event to cart:', newEvent); // Debug log
        return [...newItems, newEvent]; // Return new array with added event
      } else {
        // Event exists, update tickets
        const updatedItems = newItems.map((item, index) => {
          if (index === existingEventIndex) {
            const updatedTickets = { ...item.tickets };
            
            // Update each ticket type
            Object.entries(tickets).forEach(([type, newTicket]) => {
              if (updatedTickets[type]) {
                // If ticket type exists, update quantity
                updatedTickets[type] = {
                  ...updatedTickets[type],
                  quantity: updatedTickets[type].quantity + newTicket.quantity
                };
              } else {
                // If ticket type doesn't exist, add it
                updatedTickets[type] = { ...newTicket };
              }
            });
            
            return {
              ...item,
              tickets: updatedTickets
            };
          }
          return item;
        });
        
        console.log('Updated cart items:', updatedItems); // Debug log
        return updatedItems;
      }
    });
  };

  const updateTicketQuantity = (eventId, ticketType, newQuantity) => {
    if (newQuantity < 1) {
      removeTicket(eventId, ticketType);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.eventId === eventId && item.tickets[ticketType]) {
          return {
            ...item,
            tickets: {
              ...item.tickets,
              [ticketType]: {
                ...item.tickets[ticketType],
                quantity: newQuantity
              }
            }
          };
        }
        return item;
      });
    });
  };

  const removeTicket = (eventId, ticketType) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.eventId === eventId) {
          const updatedTickets = { ...item.tickets };
          delete updatedTickets[ticketType];
          
          // If no tickets left, remove the entire event
          if (Object.keys(updatedTickets).length === 0) {
            return null;
          }
          
          return {
            ...item,
            tickets: updatedTickets
          };
        }
        return item;
      }).filter(Boolean); // Remove null items
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
      const itemTotal = Object.values(item.tickets).reduce((ticketTotal, ticket) => {
        return ticketTotal + (ticket.price * ticket.quantity);
      }, 0);
      return total + itemTotal;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => {
      return count + Object.values(item.tickets).reduce((ticketCount, ticket) => {
        return ticketCount + ticket.quantity;
      }, 0);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateTicketQuantity,
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