import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';

// Customer Pages
import CustomerLogin from './pages/customer/Login';
import CustomerRegister from './pages/customer/Register';
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderTracking from './pages/customer/OrderTracking';
import OrderHistory from './pages/customer/OrderHistory';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import OrderManagement from './pages/admin/OrderManagement';
import MenuManagement from './pages/admin/MenuManagement';
import CustomerManagement from './pages/admin/CustomerManagement';

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SocketProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/register" element={<CustomerRegister />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Customer Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
                <Route path="/admin/menu" element={<AdminRoute><MenuManagement /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><CustomerManagement /></AdminRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </SocketProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
