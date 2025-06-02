import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserData(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // If user data can't be fetched, clear the stored data
        logout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', userData.userId || userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 