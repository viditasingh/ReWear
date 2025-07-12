// Route configuration for better organization and maintenance
export const ROUTES = {
  // Public routes
  HOME: '/',
  ITEMS: '/items',
  ITEM_DETAIL: '/items/:id',
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  ADD_ITEM: '/add-item',
  PROFILE: '/profile',
  MY_ITEMS: '/my-items',
  MY_SWAPS: '/my-swaps',
  SETTINGS: '/settings',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_BASE: '/admin',
  
  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
};

// Route access levels
export const ACCESS_LEVELS = {
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated',
  ADMIN: 'admin',
};

// Route configurations with access control
export const ROUTE_CONFIG = {
  [ROUTES.HOME]: { access: ACCESS_LEVELS.PUBLIC, title: 'Home' },
  [ROUTES.ITEMS]: { access: ACCESS_LEVELS.PUBLIC, title: 'Browse Items' },
  [ROUTES.ITEM_DETAIL]: { access: ACCESS_LEVELS.PUBLIC, title: 'Item Detail' },
  [ROUTES.LOGIN]: { access: ACCESS_LEVELS.PUBLIC, title: 'Login', authRequired: false },
  [ROUTES.SIGNUP]: { access: ACCESS_LEVELS.PUBLIC, title: 'Sign Up', authRequired: false },
  
  [ROUTES.DASHBOARD]: { access: ACCESS_LEVELS.AUTHENTICATED, title: 'Dashboard' },
  [ROUTES.ADD_ITEM]: { access: ACCESS_LEVELS.AUTHENTICATED, title: 'Add Item' },
  [ROUTES.PROFILE]: { access: ACCESS_LEVELS.AUTHENTICATED, title: 'Profile' },
  [ROUTES.MY_ITEMS]: { access: ACCESS_LEVELS.AUTHENTICATED, title: 'My Items' },
  [ROUTES.MY_SWAPS]: { access: ACCESS_LEVELS.AUTHENTICATED, title: 'My Swaps' },
  [ROUTES.SETTINGS]: { access: ACCESS_LEVELS.AUTHENTICATED, title: 'Settings' },
  
  [ROUTES.ADMIN_DASHBOARD]: { access: ACCESS_LEVELS.ADMIN, title: 'Admin Dashboard' },
  
  [ROUTES.NOT_FOUND]: { access: ACCESS_LEVELS.PUBLIC, title: 'Not Found' },
  [ROUTES.UNAUTHORIZED]: { access: ACCESS_LEVELS.PUBLIC, title: 'Unauthorized' },
};

// Helper function to check if user can access route
export const canAccessRoute = (route, user) => {
  const config = ROUTE_CONFIG[route];
  if (!config) return true;
  
  switch (config.access) {
    case ACCESS_LEVELS.PUBLIC:
      return true;
    case ACCESS_LEVELS.AUTHENTICATED:
      return !!user;
    case ACCESS_LEVELS.ADMIN:
      return user && user.role === 'admin';
    default:
      return false;
  }
};

// Helper function to get redirect route based on user status
export const getRedirectRoute = (user) => {
  if (!user) return ROUTES.LOGIN;
  if (user.role === 'admin') return ROUTES.ADMIN_DASHBOARD;
  return ROUTES.DASHBOARD;
};
