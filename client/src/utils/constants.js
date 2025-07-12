// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
};

// Authentication
export const AUTH_CONFIG = {
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET,
  JWT_EXPIRES_IN: import.meta.env.VITE_JWT_EXPIRES_IN || '7d',
  TOKEN_KEY: 'rewear_token',
  USER_KEY: 'rewear_user',
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: (import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  MAX_FILES: 5,
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'ReWear',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Community Clothing Exchange Platform',
};

// Categories
export const CATEGORIES = [
  { id: 'tops', name: 'Tops', icon: '👕' },
  { id: 'bottoms', name: 'Bottoms', icon: '👖' },
  { id: 'dresses', name: 'Dresses', icon: '👗' },
  { id: 'outerwear', name: 'Outerwear', icon: '🧥' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'accessories', name: 'Accessories', icon: '👜' },
  { id: 'activewear', name: 'Activewear', icon: '🏃‍♀️' },
  { id: 'formal', name: 'Formal', icon: '🤵' },
];

// Sizes
export const SIZES = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  shoes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
  accessories: ['One Size', 'Small', 'Medium', 'Large'],
};

// Conditions
export const CONDITIONS = [
  { id: 'new', name: 'New with Tags', value: 100 },
  { id: 'excellent', name: 'Excellent', value: 90 },
  { id: 'good', name: 'Good', value: 75 },
  { id: 'fair', name: 'Fair', value: 50 },
  { id: 'poor', name: 'Poor', value: 25 },
];

// Swap Status
export const SWAP_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Points System
export const POINTS_SYSTEM = {
  ITEM_UPLOAD: 10,
  SUCCESSFUL_SWAP: 25,
  ITEM_REVIEW: 5,
  REFERRAL: 50,
  PROFILE_COMPLETE: 20,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
};

// Date Formats
export const DATE_FORMATS = {
  FULL: 'MMMM d, yyyy',
  SHORT: 'MMM d',
  TIME: 'h:mm a',
  DATETIME: 'MMM d, yyyy h:mm a',
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
