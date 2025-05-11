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
    setCartItems(prevItems => {
      // Check if the event already exists in the cart
      const existingEvent = prevItems.find(item => item.eventId === event.id);

      if (!existingEvent) {
        // Event not in cart, add new event with tickets
        return [
          ...prevItems,
          {
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.fromDateTime,
            eventVenue: event.venue,
            eventImage: event.image,
            eventCategory: event.category,
            eventRegion: event.region,
            tickets: { ...tickets }
          }
        ];
      } else {
        // Event exists, update tickets for this event only
        return prevItems.map(item => {
          if (item.eventId !== event.id) return item;

          // Merge tickets: add new or update existing ticket types
          const updatedTickets = { ...item.tickets };
          Object.entries(tickets).forEach(([type, newTicket]) => {
            if (updatedTickets[type]) {
              updatedTickets[type] = {
                ...updatedTickets[type],
                quantity: updatedTickets[type].quantity + newTicket.quantity
              };
            } else {
              updatedTickets[type] = { ...newTicket };
            }
          });

          return {
            ...item,
            tickets: updatedTickets
          };
        });
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