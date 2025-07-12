import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center">
          {/* Unauthorized Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-9xl font-bold text-gradient opacity-20 select-none">
                403
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center">
                  <Shield className="h-10 w-10 text-error-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Access Denied
            </h1>
            <p className="text-lg text-secondary-600 leading-relaxed">
              You don't have permission to access this page. Please check your credentials or contact an administrator.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-modern gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-gentle hover:shadow-strong transition-all duration-300 flex items-center justify-center group"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-modern border-2 border-secondary-300 text-secondary-700 px-6 py-3 rounded-xl font-semibold hover:bg-secondary-50 transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
