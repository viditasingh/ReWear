import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'subtle',
  rounded = 'lg',
  hover = false,
  glass = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const shadowClasses = {
    none: '',
    subtle: 'shadow-subtle',
    gentle: 'shadow-gentle',
    strong: 'shadow-strong',
    intense: 'shadow-intense',
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const classes = clsx(
    glass ? 'glass' : 'bg-white border border-neutral-200',
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    {
      'card-modern': !glass,
      'hover:shadow-gentle transition-modern': hover,
    },
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
