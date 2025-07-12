import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowRight, ArrowLeft, Clock, CheckCircle, XCircle, Eye, MessageCircle } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';

const MySwaps = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data - replace with actual API call
  const swaps = [
    {
      id: 1,
      status: 'pending',
      type: 'outgoing',
      my_item: {
        id: 1,
        title: 'Vintage Denim Jacket',
        images: ['/api/placeholder/200/200'],
        brand: 'Levi\'s'
      },
      their_item: {
        id: 2,
        title: 'Casual Summer Dress',
        images: ['/api/placeholder/200/200'],
        brand: 'Zara'
      },
      other_user: {
        id: 2,
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40'
      },
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      status: 'accepted',
      type: 'incoming',
      my_item: {
        id: 3,
        title: 'Running Sneakers',
        images: ['/api/placeholder/200/200'],
        brand: 'Nike'
      },
      their_item: {
        id: 4,
        title: 'Leather Handbag',
        images: ['/api/placeholder/200/200'],
        brand: 'Coach'
      },
      other_user: {
        id: 3,
        name: 'Mike Chen',
        avatar: '/api/placeholder/40/40'
      },
      created_at: '2024-01-12T14:20:00Z',
      updated_at: '2024-01-16T09:15:00Z'
    },
    {
      id: 3,
      status: 'completed',
      type: 'outgoing',
      my_item: {
        id: 5,
        title: 'Wool Sweater',
        images: ['/api/placeholder/200/200'],
        brand: 'Uniqlo'
      },
      their_item: {
        id: 6,
        title: 'Denim Skirt',
        images: ['/api/placeholder/200/200'],
        brand: 'H&M'
      },
      other_user: {
        id: 4,
        name: 'Emma Wilson',
        avatar: '/api/placeholder/40/40'
      },
      created_at: '2024-01-08T11:45:00Z',
      updated_at: '2024-01-14T16:30:00Z',
      completed_at: '2024-01-14T16:30:00Z'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredSwaps = swaps.filter(swap => {
    switch (activeTab) {
      case 'active':
        return ['pending', 'accepted'].includes(swap.status);
      case 'completed':
        return swap.status === 'completed';
      case 'rejected':
        return swap.status === 'rejected';
      default:
        return true;
    }
  });

  const handleSwapAction = (swapId, action) => {
    console.log(`${action} swap:`, swapId);
    // Handle swap action (accept, reject, complete)
  };

  const showSwapDetails = (swap) => {
    setSelectedSwap(swap);
    setShowDetailsModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Swaps</h1>
        <p className="text-gray-600 mt-1">Track your clothing exchanges</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Swaps</p>
              <p className="text-2xl font-bold text-gray-900">
                {swaps.filter(s => ['pending', 'accepted'].includes(s.status)).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {swaps.filter(s => s.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <ArrowRight className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Outgoing</p>
              <p className="text-2xl font-bold text-gray-900">
                {swaps.filter(s => s.type === 'outgoing').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <ArrowLeft className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Incoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {swaps.filter(s => s.type === 'incoming').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'active', label: 'Active', count: swaps.filter(s => ['pending', 'accepted'].includes(s.status)).length },
          { id: 'completed', label: 'Completed', count: swaps.filter(s => s.status === 'completed').length },
          { id: 'rejected', label: 'Rejected', count: swaps.filter(s => s.status === 'rejected').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Swaps List */}
      <div className="space-y-4">
        {filteredSwaps.map((swap) => (
          <Card key={swap.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Swap Direction Indicator */}
                <div className="flex items-center space-x-2">
                  {swap.type === 'outgoing' ? (
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-purple-600" />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {swap.type === 'outgoing' ? 'Outgoing' : 'Incoming'}
                  </span>
                </div>

                {/* Items */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={swap.my_item.images[0]}
                      alt={swap.my_item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{swap.my_item.title}</h3>
                      <p className="text-sm text-gray-600">{swap.my_item.brand}</p>
                      <p className="text-xs text-gray-500">Your item</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600">↔</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img
                      src={swap.their_item.images[0]}
                      alt={swap.their_item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{swap.their_item.title}</h3>
                      <p className="text-sm text-gray-600">{swap.their_item.brand}</p>
                      <p className="text-xs text-gray-500">Their item</p>
                    </div>
                  </div>
                </div>

                {/* Other User */}
                <div className="flex items-center space-x-3">
                  <img
                    src={swap.other_user.avatar}
                    alt={swap.other_user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{swap.other_user.name}</p>
                    <p className="text-sm text-gray-600">
                      {swap.type === 'outgoing' ? 'Swap partner' : 'Requested by'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swap.status)}`}>
                    {getStatusIcon(swap.status)}
                    <span className="ml-1 capitalize">{swap.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(swap.updated_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showSwapDetails(swap)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Message user:', swap.other_user.id)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>

                  {swap.status === 'pending' && swap.type === 'incoming' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSwapAction(swap.id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleSwapAction(swap.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {swap.status === 'accepted' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSwapAction(swap.id, 'complete')}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSwaps.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps found</h3>
          <p className="text-gray-600">
            {activeTab === 'active' && 'You don\'t have any active swaps at the moment.'}
            {activeTab === 'completed' && 'You haven\'t completed any swaps yet.'}
            {activeTab === 'rejected' && 'No rejected swaps found.'}
          </p>
        </div>
      )}

      {/* Swap Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        {selectedSwap && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Swap Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Swap ID:</span>
                <span className="font-medium">#{selectedSwap.id}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSwap.status)}`}>
                  {selectedSwap.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="font-medium capitalize">{selectedSwap.type}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="font-medium">{new Date(selectedSwap.created_at).toLocaleDateString()}</span>
              </div>
              
              {selectedSwap.completed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="font-medium">{new Date(selectedSwap.completed_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MySwaps;
