import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Package, Clock, Eye } from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Confirmed':
        return '#3b82f6';
      case 'Preparing':
        return '#f59e0b';
      case 'Ready for Delivery':
        return '#8b5cf6';
      case 'Order Reached':
        return '#06b6d4';
      case 'Delivered':
        return '#10b981';
      case 'Cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="order-history-container">
        <div className="order-history-header">
          <h1>My Orders</h1>
          <p>Track and view all your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <Package size={80} color="#ccc" />
            <h2>No orders yet</h2>
            <p>Start ordering delicious food from our menu</p>
            <button onClick={() => navigate('/menu')} className="btn-primary">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">
                      <Clock size={14} />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div 
                    className="order-status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item-preview">
                      <img 
                        src={item.food?.image || 'https://via.placeholder.com/60'} 
                        alt={item.name}
                      />
                      <div className="item-preview-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  <div className="order-amount">
                    <span>Total Amount</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                  <div className="order-payment">
                    <span className="payment-method">{order.paymentMethod}</span>
                    <span 
                      className={`payment-status ${order.paymentStatus.toLowerCase()}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="view-order-btn"
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
