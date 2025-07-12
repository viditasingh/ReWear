import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, clearError } from '../store/slices/authSlice';
import { useLogoutMutation } from '../store/api/authApi';
import { ROUTES, canAccessRoute } from '../utils/routes';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();
  
  const { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    error 
  } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || isAdmin;

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isAdmin,
    isModerator,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};

// Custom hook for route protection
export const useRouteProtection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { 
        state: { from: location },
        replace: true 
      });
      return false;
    }
    callback?.();
    return true;
  };

  const requireAdmin = (callback) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { 
        state: { from: location },
        replace: true 
      });
      return false;
    }
    if (user?.role !== 'admin') {
      navigate(ROUTES.UNAUTHORIZED, { replace: true });
      return false;
    }
    callback?.();
    return true;
  };

  const redirectIfAuthenticated = (fallbackRoute = ROUTES.DASHBOARD) => {
    if (isAuthenticated) {
      const redirectTo = user?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : fallbackRoute;
      navigate(redirectTo, { replace: true });
      return true;
    }
    return false;
  };

  return {
    requireAuth,
    requireAdmin,
    redirectIfAuthenticated,
    canAccess: (route) => canAccessRoute(route, user),
  };
};

// Custom hook for navigation with authentication checks
export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const navigateWithAuth = (route, options = {}) => {
    if (!canAccessRoute(route, user)) {
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN, { 
          state: { from: { pathname: route } },
          replace: true 
        });
      } else {
        navigate(ROUTES.UNAUTHORIZED, { replace: true });
      }
      return false;
    }
    
    navigate(route, options);
    return true;
  };

  return {
    navigateWithAuth,
    navigateToLogin: (from) => navigate(ROUTES.LOGIN, { state: { from } }),
    navigateToHome: () => navigate(ROUTES.HOME),
    navigateToDashboard: () => {
      const route = user?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD;
      navigate(route);
    },
  };
};
