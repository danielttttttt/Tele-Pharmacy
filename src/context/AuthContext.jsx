// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/profileService';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Check for existing user in localStorage on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is stored in localStorage (for mock authentication persistence)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Get the latest user profile
          const userProfile = await getUserProfile(userData.uid);
          if (userProfile) {
            setUser(userProfile);
          } else {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Login function to set user
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function to clear user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Context value
  const contextValue = {
    user,
    loading,
    authInitialized,
    isAuthenticated,
    hasRole,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};