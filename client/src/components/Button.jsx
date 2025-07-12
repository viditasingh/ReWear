import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  href, 
  to, 
  disabled = false, 
  loading = false,
  ...props 
}) => {
  const baseClasses = 'btn-modern inline-flex items-center justify-center font-medium rounded-lg transition-modern focus-modern disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'gradient-primary text-white hover:shadow-lg focus:ring-primary-500 shadow-subtle',
    secondary: 'gradient-secondary text-white hover:shadow-lg focus:ring-secondary-500 shadow-subtle',
    outline: 'border-2 border-primary-500 bg-white text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-secondary-600 hover:bg-neutral-100 focus:ring-primary-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-subtle',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-subtle',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm font-medium',
    md: 'px-6 py-3 text-sm font-semibold',
    lg: 'px-8 py-4 text-base font-semibold',
    xl: 'px-10 py-5 text-lg font-bold',
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {loading ? <span className="loading-spinner mr-2" /> : null}
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {loading ? <span className="loading-spinner mr-2" /> : null}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? <span className="loading-spinner mr-2" /> : null}
      {children}
    </button>
  );
};

export default Button;