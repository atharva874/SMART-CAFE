import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Coffee, ShoppingCart, User, LogOut, History } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Coffee size={32} />
          <span>Premium Cafe</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/orders" className="nav-link">
            <History size={18} />
            Orders
          </Link>
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <div className="user-menu">
            <button className="user-button">
              <User size={20} />
              <span>{user?.name}</span>
            </button>
            <div className="user-dropdown">
              <button onClick={handleLogout} className="dropdown-item">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
