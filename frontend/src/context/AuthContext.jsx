import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      authService.getUserProfile(storedToken)
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login for:', email);
      const data = await authService.login(email, password);
      console.log('AuthContext: Login response:', data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const profile = await authService.getUserProfile(data.token);
        setUser(profile);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.errors || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = async (profileData, token) => {
    try {
      const response = await authService.updateUserProfile(profileData, token);
      // Update the user state with the new profile data
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
