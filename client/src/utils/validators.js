import { z } from 'zod';

// Authentication validators
export const loginValidator = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordValidator = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordValidator = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile validators
export const profileValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const changePasswordValidator = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Item validators
export const itemValidator = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  category: z.string().min(1, 'Category is required'),
  size: z.string().min(1, 'Size is required'),
  condition: z.string().min(1, 'Condition is required'),
  color: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  availableForSwap: z.boolean().default(true),
  pointsValue: z.number().min(0, 'Points value must be positive').optional(),
});

export const itemUpdateValidator = itemValidator.partial();

// Swap validators
export const swapRequestValidator = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  offeredItemId: z.string().min(1, 'Offered item ID is required').optional(),
  pointsOffered: z.number().min(0, 'Points must be positive').optional(),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
}).refine((data) => data.offeredItemId || data.pointsOffered, {
  message: "Either an item or points must be offered",
  path: ["offeredItemId"],
});

export const swapResponseValidator = z.object({
  swapId: z.string().min(1, 'Swap ID is required'),
  action: z.enum(['accept', 'reject']),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

// Search validators
export const searchValidator = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  size: z.string().optional(),
  condition: z.string().optional(),
  minPoints: z.number().min(0).optional(),
  maxPoints: z.number().min(0).optional(),
  sortBy: z.enum(['createdAt', 'title', 'points', 'condition']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Contact validators
export const contactValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Report validators
export const reportValidator = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  reason: z.enum(['inappropriate', 'spam', 'fake', 'other']),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

// Admin validators
export const adminItemModerationValidator = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  action: z.enum(['approve', 'reject']),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

export const adminUserModerationValidator = z.object({
  userId: z.string().min(1, 'User ID is required'),
  action: z.enum(['ban', 'unban', 'warn']),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

// Validation helper functions
export const validateField = (schema, field, value) => {
  try {
    schema.shape[field].parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.issues[0].message };
  }
};

export const validateForm = (schema, data) => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { isValid: false, errors };
  }
};

// File validation
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Maximum size is 5MB.' };
  }

  return { isValid: true, error: null };
};

export const validateMultipleFiles = (files) => {
  const maxFiles = 5;
  
  if (files.length > maxFiles) {
    return { isValid: false, error: `Maximum ${maxFiles} files allowed.` };
  }

  for (const file of files) {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true, error: null };
};
