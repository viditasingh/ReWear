import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
        error: {
          duration: 4000,
          theme: {
            primary: 'red',
            secondary: 'black',
          },
        },
      }}
    />
  );
};

// Helper functions for different toast types
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  promise: (promise, messages) => toast.promise(promise, messages),
  custom: (message, options) => toast(message, options),
};

export default Toast;
