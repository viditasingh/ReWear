import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Eye, Package, Grid, List } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/ui/Card';
import ItemCard from '../../components/ItemCard';
import Modal from '../../components/ui/Modal';

const MyItems = () => {
  const { user } = useSelector(state => state.auth);
  const [viewMode, setViewMode] = useState('grid');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data - replace with actual API call
  const myItems = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      brand: 'Levi\'s',
      size: 'M',
      condition: 'Good',
      category: 'Jackets',
      images: ['/api/placeholder/300/300'],
      eco_points: 25,
      status: 'active',
      views: 45,
      likes: 12,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Casual Summer Dress',
      brand: 'Zara',
      size: 'S',
      condition: 'Excellent',
      category: 'Dresses',
      images: ['/api/placeholder/300/300'],
      eco_points: 30,
      status: 'swapped',
      views: 78,
      likes: 23,
      created_at: '2024-01-10T14:20:00Z'
    },
    {
      id: 3,
      title: 'Running Sneakers',
      brand: 'Nike',
      size: '9',
      condition: 'Fair',
      category: 'Shoes',
      images: ['/api/placeholder/300/300'],
      eco_points: 20,
      status: 'pending',
      views: 23,
      likes: 8,
      created_at: '2024-01-12T09:15:00Z'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'swapped': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle item deletion
    console.log('Deleting item:', selectedItem.id);
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Items</h1>
          <p className="text-gray-600 mt-1">Manage your listed items</p>
        </div>
        <Button href="/add-item" className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{myItems.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {myItems.reduce((sum, item) => sum + item.views, 0)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {myItems.filter(item => item.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold">↔</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Swapped</p>
              <p className="text-2xl font-bold text-gray-900">
                {myItems.filter(item => item.status === 'swapped').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Items</option>
            <option>Active</option>
            <option>Swapped</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <div key={item.id} className="relative">
              <ItemCard item={item} />
              <div className="absolute top-2 right-2 flex space-x-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 bg-white/90 hover:bg-white"
                  onClick={() => window.open(`/items/${item.id}`, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 bg-white/90 hover:bg-white"
                  onClick={() => console.log('Edit item:', item.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteItem(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {myItems.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.brand} • {item.size} • {item.condition}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-sm text-gray-600">{item.views} views</span>
                    <span className="text-sm text-gray-600">{item.likes} likes</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/items/${item.id}`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Edit item:', item.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Item</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyItems;
