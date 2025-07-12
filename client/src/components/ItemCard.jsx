import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, User, Star, MessageCircle, Share2, Eye } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleItemLike, addToWishlist } from '../store/slices/itemsSlice';
import Button from './Button';

const ItemCard = ({ item, showActions = true, compact = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isLiked, setIsLiked] = useState(item.is_liked || false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login or show modal
      return;
    }

    try {
      await dispatch(toggleItemLike(item.id));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this ${item.title} on ReWear!`,
        url: `${window.location.origin}/items/${item.id}`
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/items/${item.id}`);
    }
  };

  const handleMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to messages or open chat
  };

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeDisplay = (size) => {
    if (typeof size === 'object' && size !== null) {
      return `${size.value} ${size.unit || ''}`.trim();
    }
    return size || 'N/A';
  };

  if (compact) {
    return (
      <Link to={`/items/${item.id}`} className="block">
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="relative w-16 h-16 flex-shrink-0">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse" />
            )}
            <img
              src={imageError ? '/api/placeholder/64/64' : item.images?.[0] || '/api/placeholder/64/64'}
              alt={item.title}
              className={`w-full h-full object-cover rounded-lg ${imageLoaded ? 'block' : 'hidden'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.brand} • {getSizeDisplay(item.size)}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
              <span className="text-sm font-medium text-primary-600">{item.eco_points} pts</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <Link to={`/items/${item.id}`} className="block">
        <div className="relative">
          {/* Image */}
          <div className="aspect-square relative overflow-hidden">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
            <img
              src={imageError ? '/api/placeholder/300/300' : item.images?.[0] || '/api/placeholder/300/300'}
              alt={item.title}
              className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {/* Overlay badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
              {item.featured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Featured
                </span>
              )}
            </div>

            {/* Action buttons */}
            {showActions && (
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-blue-500 backdrop-blur-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick view button */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-primary-600 backdrop-blur-sm transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.brand}</p>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{item.views || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>Size: {getSizeDisplay(item.size)}</span>
              <span className="font-medium text-primary-600">{item.eco_points} pts</span>
            </div>

            {/* Location and owner */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{item.location || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{item.owner?.name || 'Anonymous'}</span>
              </div>
            </div>

            {/* Rating */}
            {item.owner?.rating && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{item.owner.rating.toFixed(1)}</span>
                <span>({item.owner.review_count || 0} reviews)</span>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Action buttons */}
            {showActions && user && user.id !== item.owner?.id && (
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Navigate to swap page
                  }}
                >
                  Swap Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessage}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Posted time */}
            <p className="text-xs text-gray-400 mt-2">
              Posted {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;