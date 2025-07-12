import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, token, error } = useSelector(state => state.auth);

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Check if token is expired
          const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (tokenData.exp && tokenData.exp > currentTime) {
            // Token is still valid
            dispatch(loginSuccess({
              user: userData,
              token: storedToken,
            }));
          } else {
            // Token is expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch(logout());
          }
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch(logout());
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Store user data in localStorage when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user]);

  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    error,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator' || user?.role === 'admin',
    isUser: user?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
