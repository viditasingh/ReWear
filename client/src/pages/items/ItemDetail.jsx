import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Heart, 
  Share2, 
  Flag, 
  MapPin, 
  Clock, 
  Star, 
  User, 
  ArrowLeft,
  MessageCircle,
  Coins
} from 'lucide-react';
import { useGetItemQuery, useGetSimilarItemsQuery } from '../../store/api/itemsApi';
import { useGetProfileQuery } from '../../store/api/userApi';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import ItemCard from '../../components/ItemCard';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import { CONDITIONS } from '../../utils/constants';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: item, isLoading, error } = useGetItemQuery(id);
  const { data: similarItems } = useGetSimilarItemsQuery(id);
  const { data: ownerProfile } = useGetProfileQuery(item?.ownerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <p className="text-gray-600 mb-8">The item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/items')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Items
          </button>
        </div>
      </div>
    );
  }

  const condition = CONDITIONS.find(c => c.id === item.condition);
  const isOwner = user?.id === item.ownerId;

  const handleSwapRequest = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowSwapModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index 
                        ? 'border-primary-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location || 'Location not specified'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {getRelativeTime(item.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Flag className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-semibold capitalize">{item.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Size</span>
                <p className="font-semibold">{item.size}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Condition</span>
                <div className="flex items-center">
                  <span className="font-semibold">{condition?.name}</span>
                  <div className="flex ml-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < condition?.value / 20 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Brand</span>
                <p className="font-semibold">{item.brand || 'Not specified'}</p>
              </div>
            </div>

            {/* Points Value */}
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Coins className="h-6 w-6 text-secondary-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Points Value</h3>
                  <p className="text-2xl font-bold text-secondary-600">{item.pointsValue} points</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {item.tags_list && item.tags_list.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags_list.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!isOwner && (
                <>
                  <button
                    onClick={handleSwapRequest}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    Request Swap
                  </button>
                  <button
                    onClick={handleSwapRequest}
                    className="flex-1 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors font-semibold flex items-center justify-center"
                  >
                    <Coins className="h-5 w-5 mr-2" />
                    Redeem with Points
                  </button>
                </>
              )}
              {isOwner && (
                <button
                  onClick={() => navigate(`/edit-item/${item.id}`)}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Edit Item
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <Card className="mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              {ownerProfile?.avatar ? (
                <img
                  src={ownerProfile.avatar}
                  alt={ownerProfile.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <User className="h-8 w-8 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {ownerProfile?.name || 'Anonymous User'}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                  {ownerProfile?.rating || 'No rating'}
                </span>
                <span>{ownerProfile?.totalSwaps || 0} successful swaps</span>
                <span>Member since {formatDate(ownerProfile?.createdAt)}</span>
              </div>
            </div>
            {!isOwner && (
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </button>
            )}
          </div>
        </Card>

        {/* Similar Items */}
        {similarItems && similarItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarItems.slice(0, 4).map((similarItem) => (
                <ItemCard key={similarItem.id} item={similarItem} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swap Modal */}
      <Modal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        title="Request Swap"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600">{item.pointsValue} points</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Offer Item Exchange
            </button>
            <button className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors">
              Use Points ({item.pointsValue})
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Item"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please select a reason for reporting this item:
          </p>
          <div className="space-y-2">
            {['Inappropriate content', 'Fake item', 'Spam', 'Other'].map((reason) => (
              <button
                key={reason}
                className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetail;
