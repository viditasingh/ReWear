import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

const Dropdown = ({ 
  trigger, 
  children, 
  placement = 'bottom-start',
  className = '',
  dropdownClassName = '',
  disabled = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
    'left-start': 'right-full top-0 mr-2',
    'right-start': 'left-full top-0 ml-2',
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={clsx('relative inline-block', className)} ref={dropdownRef} {...props}>
      <div onClick={toggleDropdown} className={disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={clsx(
            'absolute z-50 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2',
            placementClasses[placement],
            dropdownClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ 
  children, 
  onClick, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={clsx(
        'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Dropdown;
