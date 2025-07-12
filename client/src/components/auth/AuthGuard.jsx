import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Check if token exists and is valid
    if (token) {
      try {
        // Decode token to check expiration (basic JWT check)
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenData.exp && tokenData.exp < currentTime) {
          // Token is expired, logout user
          dispatch(logout());
          navigate('/login', { replace: true });
        }
      } catch (error) {
        // Invalid token format, logout user
        dispatch(logout());
        navigate('/login', { replace: true });
      }
    }
  }, [token, dispatch, navigate]);

  return children;
};

export default AuthGuard;
