import React from 'react';
import clsx from 'clsx';

const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text', 
  placeholder,
  required = false,
  ...props 
}) => {
  const inputClasses = clsx(
    'input-modern',
    {
      'border-error-300 focus:ring-error-500': error,
    },
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-secondary-700">
          {label}
          {required && <span className="text-primary-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;