import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, Package, ArrowUpDown, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Eye, Flag 
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [dateRange, setDateRange] = useState('7d');

  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalItems: 3456,
    activeItems: 2134,
    totalSwaps: 567,
    pendingSwaps: 45,
    reportsCount: 12,
    flaggedItems: 8
  };

  const userGrowthData = [
    { month: 'Jan', users: 100 },
    { month: 'Feb', users: 185 },
    { month: 'Mar', users: 320 },
    { month: 'Apr', users: 450 },
    { month: 'May', users: 620 },
    { month: 'Jun', users: 890 },
    { month: 'Jul', users: 1247 }
  ];

  const itemCategoriesData = [
    { name: 'Clothing', value: 1234, color: '#3B82F6' },
    { name: 'Shoes', value: 567, color: '#10B981' },
    { name: 'Accessories', value: 456, color: '#F59E0B' },
    { name: 'Bags', value: 234, color: '#EF4444' },
    { name: 'Others', value: 123, color: '#8B5CF6' }
  ];

  const swapActivityData = [
    { day: 'Mon', swaps: 23 },
    { day: 'Tue', swaps: 34 },
    { day: 'Wed', swaps: 28 },
    { day: 'Thu', swaps: 41 },
    { day: 'Fri', swaps: 52 },
    { day: 'Sat', swaps: 38 },
    { day: 'Sun', swaps: 29 }
  ];

  const recentActivity = [
    { id: 1, type: 'user_join', message: 'New user Sarah Johnson joined', time: '2 minutes ago' },
    { id: 2, type: 'item_added', message: 'Item "Vintage Jacket" was added', time: '5 minutes ago' },
    { id: 3, type: 'swap_completed', message: 'Swap between Mike and Emma completed', time: '12 minutes ago' },
    { id: 4, type: 'report', message: 'Item reported for inappropriate content', time: '1 hour ago' },
    { id: 5, type: 'user_banned', message: 'User "spammer123" was banned', time: '2 hours ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_join': return <Users className="w-4 h-4 text-green-600" />;
      case 'item_added': return <Package className="w-4 h-4 text-blue-600" />;
      case 'swap_completed': return <ArrowUpDown className="w-4 h-4 text-purple-600" />;
      case 'report': return <Flag className="w-4 h-4 text-red-600" />;
      case 'user_banned': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and management</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeItems.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps.toLocaleString()}</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="w-3 h-3 mr-1" />
                -3% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <ArrowUpDown className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reportsCount}</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Needs attention
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Item Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={itemCategoriesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {itemCategoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Swap Activity */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Swap Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={swapActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="swaps" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View All Activity
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Button>
          <Button className="flex items-center justify-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Review Items</span>
          </Button>
          <Button className="flex items-center justify-center space-x-2">
            <Flag className="w-4 h-4" />
            <span>Handle Reports</span>
          </Button>
          <Button className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>View Analytics</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
