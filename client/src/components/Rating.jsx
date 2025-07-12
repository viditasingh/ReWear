import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ 
  value = 0, 
  onChange, 
  readonly = false, 
  size = 'md',
  showValue = false,
  showCount = false,
  count = 0,
  precision = 1,
  className = ''
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const renderStar = (index) => {
    const currentValue = hoverValue || value;
    const starValue = index + 1;
    
    let fillPercentage = 0;
    if (currentValue >= starValue) {
      fillPercentage = 100;
    } else if (currentValue > starValue - 1) {
      fillPercentage = (currentValue - (starValue - 1)) * 100;
    }

    const isInteractive = !readonly && onChange;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        className={`relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded ${
          isInteractive ? 'cursor-pointer' : 'cursor-default'
        } ${sizes[size]}`}
        disabled={readonly}
      >
        {/* Background star */}
        <Star 
          className={`absolute inset-0 ${sizes[size]} text-gray-300`}
          fill="currentColor"
        />
        
        {/* Filled star */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star 
            className={`${sizes[size]} text-yellow-400`}
            fill="currentColor"
          />
        </div>
        
        {/* Hover effect */}
        {isInteractive && (
          <Star 
            className={`absolute inset-0 ${sizes[size]} text-yellow-400 opacity-0 hover:opacity-50 transition-opacity`}
            fill="currentColor"
          />
        )}
      </button>
    );
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          {value.toFixed(1)}
        </span>
      )}
      
      {showCount && count > 0 && (
        <span className="text-sm text-gray-500 ml-1">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

// Compact rating display
export const CompactRating = ({ value, count, className = '' }) => (
  <div className={`flex items-center space-x-1 ${className}`}>
    <Star className="w-4 h-4 text-yellow-400 fill-current" />
    <span className="text-sm font-medium text-gray-900">{value.toFixed(1)}</span>
    {count > 0 && (
      <span className="text-sm text-gray-500">({count})</span>
    )}
  </div>
);

// Rating breakdown component
export const RatingBreakdown = ({ ratings, className = '' }) => {
  const total = ratings.reduce((sum, rating) => sum + rating.count, 0);
  const average = total > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating * rating.count, 0) / total 
    : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold text-gray-900">{average.toFixed(1)}</div>
        <div>
          <Rating value={average} readonly size="lg" />
          <p className="text-sm text-gray-600 mt-1">
            Based on {total.toLocaleString()} reviews
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 w-12">
              <span className="text-sm text-gray-600">{rating.rating}</span>
              <Star className="w-3 h-3 text-gray-400 fill-current" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${total > 0 ? (rating.count / total) * 100 : 0}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 w-12 text-right">
              {rating.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Rating input with labels
export const RatingInput = ({ 
  value, 
  onChange, 
  labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  className = ''
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const currentLabel = labels[(hoverValue || value) - 1] || '';

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Rating 
          value={value}
          onChange={onChange}
          hoverValue={hoverValue}
          onHoverChange={setHoverValue}
          size="lg"
        />
        {currentLabel && (
          <span className="text-sm font-medium text-gray-700">
            {currentLabel}
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        Click to rate
      </div>
    </div>
  );
};

// Review card component
export const ReviewCard = ({ 
  review, 
  showUserInfo = true,
  showDate = true,
  className = ''
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {showUserInfo && (
          <div className="flex-shrink-0">
            {review.user?.avatar ? (
              <img 
                src={review.user.avatar} 
                alt={review.user.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {review.user?.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              {showUserInfo && (
                <h4 className="font-medium text-gray-900">{review.user?.name}</h4>
              )}
              <Rating value={review.rating} readonly size="sm" />
            </div>
            {showDate && (
              <span className="text-sm text-gray-500">
                {formatDate(review.created_at)}
              </span>
            )}
          </div>
          
          {review.title && (
            <h5 className="font-medium text-gray-900 mt-2">{review.title}</h5>
          )}
          
          <p className="text-gray-700 mt-2 leading-relaxed">
            {review.comment}
          </p>
          
          {review.helpful_count > 0 && (
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
              <button className="hover:text-gray-900 transition-colors">
                Helpful ({review.helpful_count})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rating;
