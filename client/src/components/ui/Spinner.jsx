import React from 'react';
import { clsx } from 'clsx';

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  return (
    <div 
      className={clsx(
        'animate-spin rounded-full border-2 border-gray-300 border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{
        borderTopColor: 'currentColor',
      }}
    />
  );
};

export default Spinner;
