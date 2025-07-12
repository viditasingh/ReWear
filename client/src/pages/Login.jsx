import React from 'react';
import LoginForm from '../components/forms/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back to ReWear
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Continue your sustainable fashion journey
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;