import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, ShoppingBag, Menu as MenuIcon, Users, LogOut } from 'lucide-react';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-brand">
          <Shield size={32} />
          <span>Admin Panel</span>
        </div>

        <div className="admin-menu">
          <Link to="/admin/dashboard" className={`admin-nav-link ${isActive('/admin/dashboard')}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
            <ShoppingBag size={20} />
            Orders
          </Link>
          <Link to="/admin/menu" className={`admin-nav-link ${isActive('/admin/menu')}`}>
            <MenuIcon size={20} />
            Menu
          </Link>
          <Link to="/admin/customers" className={`admin-nav-link ${isActive('/admin/customers')}`}>
            <Users size={20} />
            Customers
          </Link>
        </div>

        <div className="admin-actions">
          <div className="admin-user-info">
            <span>{user?.name}</span>
            <span className="admin-badge">Admin</span>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
