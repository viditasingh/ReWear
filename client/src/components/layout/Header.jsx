import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, User, Menu, Search, Plus, X } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import NotificationCenter from '../NotificationCenter';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { notifications } = useSelector(state => state.swap);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="glass sticky top-0 z-50 backdrop-blur-lg border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-gentle group-hover:shadow-strong transition-all duration-300">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-gradient">ReWear</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/items" className="link-modern text-secondary-700 hover:text-primary-600 font-medium">
              Browse Items
            </Link>
            <Link to="/categories" className="link-modern text-secondary-700 hover:text-primary-600 font-medium">
              Categories
            </Link>
            <Link to="/how-it-works" className="link-modern text-secondary-700 hover:text-primary-600 font-medium">
              How It Works
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern w-full pl-12 pr-4 py-3 rounded-xl shadow-subtle focus:shadow-gentle"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Add Item Button */}
                <Link
                  to="/add-item"
                  className="btn-modern gradient-primary text-white px-6 py-3 rounded-xl shadow-gentle hover:shadow-strong transition-all duration-300 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-semibold">Add Item</span>
                </Link>

                {/* Notifications */}
                <NotificationCenter />

                {/* User Menu */}
                <Dropdown
                  trigger={
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <User className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <span className="text-gray-700">{user?.name}</span>
                    </div>
                  }
                >
                  <DropdownItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/my-items')}>
                    My Items
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/my-swaps')}>
                    My Swaps
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownItem>
                  {user?.role === 'admin' && (
                    <DropdownItem onClick={() => navigate('/admin')}>
                      Admin Panel
                    </DropdownItem>
                  )}
                  <hr className="my-2" />
                  <DropdownItem onClick={handleLogout}>
                    Sign Out
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link 
                  to="/items" 
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Items
                </Link>
                <Link 
                  to="/categories" 
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
              </nav>

              {/* Mobile Auth/User Menu */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link 
                    to="/dashboard" 
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/my-items" 
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Items
                  </Link>
                  <Link 
                    to="/my-swaps" 
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Swaps
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link 
                    to="/login" 
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
