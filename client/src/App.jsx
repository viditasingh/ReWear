import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import AuthProvider from './context/AuthProvider';
import AuthGuard from './components/auth/AuthGuard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ItemListing from './pages/ItemListing';
import ItemDetail from './pages/items/ItemDetail';

// Protected Pages
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import Profile from './pages/user/Profile';
import MyItems from './pages/user/MyItems';
import MySwaps from './pages/user/MySwaps';
import Settings from './pages/user/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Error Pages
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <AuthGuard>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/items" element={<ItemListing />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                
                {/* Auth Routes - Only accessible when NOT authenticated */}
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Signup />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected Routes - Require authentication */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-item" 
                  element={
                    <ProtectedRoute>
                      <AddItem />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-items" 
                  element={
                    <ProtectedRoute>
                      <MyItems />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-swaps" 
                  element={
                    <ProtectedRoute>
                      <MySwaps />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Routes - Require admin privileges */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </ProtectedRoute>
                  } 
                />

                {/* Error Routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Layout>
          </AuthGuard>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#14213d',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(20, 33, 61, 0.08)',
                border: '1px solid #e5e5e5',
              },
              success: {
                style: {
                  borderLeft: '4px solid #fca311',
                },
              },
              error: {
                style: {
                  borderLeft: '4px solid #ef4444',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;
