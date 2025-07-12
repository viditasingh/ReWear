import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Plus, 
  Package, 
  ArrowRightLeft, 
  Coins, 
  TrendingUp, 
  Clock,
  Check,
  X,
  Eye
} from 'lucide-react';
import { useGetMyItemsQuery } from '../store/api/itemsApi';
import { 
  useGetPointsQuery,
  useGetNotificationsQuery 
} from '../store/api/userApi';
import Card from '../components/ui/Card';
import ItemCard from '../components/ItemCard';
import { getRelativeTime, formatNumber } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  // API queries
  const { data: myItems = [], isLoading: itemsLoading } = useGetMyItemsQuery();
  const { data: pointsData, isLoading: pointsLoading } = useGetPointsQuery();
  const { data: notifications = [] } = useGetNotificationsQuery();

  // Mock data for swaps (replace with actual API calls)
  const mockSwaps = [
    {
      id: 1,
      type: 'incoming',
      item: { title: 'Vintage Denim Jacket', image: '/api/placeholder/150/150' },
      otherUser: 'Sarah Johnson',
      status: 'pending',
      createdAt: '2025-01-10T10:00:00Z',
      pointsOffered: 50
    },
    {
      id: 2,
      type: 'outgoing',
      item: { title: 'Designer Handbag', image: '/api/placeholder/150/150' },
      otherUser: 'Mike Chen',
      status: 'accepted',
      createdAt: '2025-01-09T15:30:00Z',
      pointsOffered: 100
    },
    {
      id: 3,
      type: 'incoming',
      item: { title: 'Silk Scarf', image: '/api/placeholder/150/150' },
      otherUser: 'Emma Davis',
      status: 'completed',
      createdAt: '2025-01-08T09:15:00Z',
      pointsOffered: 30
    }
  ];

  const stats = [
    {
      title: 'Total Points',
      value: formatNumber(pointsData?.total || 0),
      icon: <Coins className="h-6 w-6 text-secondary-600" />,
      color: 'bg-secondary-50 border-secondary-200'
    },
    {
      title: 'Listed Items',
      value: myItems.length,
      icon: <Package className="h-6 w-6 text-primary-600" />,
      color: 'bg-primary-50 border-primary-200'
    },
    {
      title: 'Active Swaps',
      value: mockSwaps.filter(swap => swap.status === 'pending' || swap.status === 'accepted').length,
      icon: <ArrowRightLeft className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Completed Swaps',
      value: mockSwaps.filter(swap => swap.status === 'completed').length,
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    }
  ];

  const recentItems = myItems.slice(0, 4);
  const recentSwaps = mockSwaps.slice(0, 3);
  const recentNotifications = notifications.slice(0, 5);

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
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <Check className="h-4 w-4" />;
      case 'completed': return <Check className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your ReWear account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`border-2 ${stat.color}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/add-item"
              className="flex items-center p-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-6 w-6 mr-3" />
              <span className="font-semibold">Add New Item</span>
            </Link>
            <Link
              to="/items"
              className="flex items-center p-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-6 w-6 mr-3" />
              <span className="font-semibold">Browse Items</span>
            </Link>
            <Link
              to="/my-swaps"
              className="flex items-center p-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowRightLeft className="h-6 w-6 mr-3" />
              <span className="font-semibold">View Swaps</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Items */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Recent Items</h3>
              <Link
                to="/my-items"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {itemsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse flex space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentItems.length > 0 ? (
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.images?.[0] || '/api/placeholder/64/64'}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.pointsValue} points</p>
                      <p className="text-xs text-gray-500">{getRelativeTime(item.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No items yet</p>
                <Link
                  to="/add-item"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Add your first item
                </Link>
              </div>
            )}
          </Card>

          {/* Recent Swaps */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Swaps</h3>
              <Link
                to="/my-swaps"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {recentSwaps.length > 0 ? (
              <div className="space-y-4">
                {recentSwaps.map((swap) => (
                  <div key={swap.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={swap.item.image}
                      alt={swap.item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{swap.item.title}</h4>
                      <p className="text-sm text-gray-600">
                        {swap.type === 'incoming' ? 'From' : 'To'} {swap.otherUser}
                      </p>
                      <p className="text-xs text-gray-500">{getRelativeTime(swap.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(swap.status)}`}>
                        {getStatusIcon(swap.status)}
                        <span className="ml-1 capitalize">{swap.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No swaps yet</p>
                <Link
                  to="/items"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Start browsing items
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Notifications */}
        <Card className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
            <Link
              to="/notifications"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-primary-600'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500">{getRelativeTime(notification.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No notifications</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;