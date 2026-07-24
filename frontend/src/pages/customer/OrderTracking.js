import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useSocket } from '../../context/SocketContext';
import { CheckCircle, Clock, Package, Truck, Home, ArrowLeft } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (socket) {
      socket.on('order-status-update', (data) => {
        if (data.orderId === orderId) {
          setOrder(prev => ({ ...prev, status: data.status }));
        }
      });

      return () => {
        socket.off('order-status-update');
      };
    }
  }, [socket, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: 'Order Confirmed', icon: CheckCircle, label: 'Order Confirmed' },
      { status: 'Preparing', icon: Clock, label: 'Preparing' },
      { status: 'Ready for Delivery', icon: Package, label: 'Ready for Delivery' },
      { status: 'Order Reached', icon: Truck, label: 'Out for Delivery' }
    ];

    const statusIndex = steps.findIndex(step => step.status === order?.status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      active: index === statusIndex
    }));
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
        <div className="loading-container">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h2>Order not found</h2>
          <button onClick={() => navigate('/orders')} className="btn-primary">
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div>
      <Navbar />
      
      <div className="tracking-container">
        <div className="tracking-header">
          <button onClick={() => navigate('/orders')} className="back-button">
            <ArrowLeft size={20} />
            Back to Orders
          </button>
        </div>

        {/* Success Banner */}
        <div className="success-banner">
          <CheckCircle size={48} color="#10b981" />
          <div>
            <h1>Order Confirmed Successfully!</h1>
            <p>Your order has been placed and is being processed</p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="order-details-card">
          <div className="order-info-row">
            <div className="info-item">
              <span className="info-label">Order ID</span>
              <span className="info-value">{order.orderNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Order Time</span>
              <span className="info-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Method</span>
              <span className="info-value">{order.paymentMethod}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Amount</span>
              <span className="info-value highlight">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Time Info */}
        <div className="delivery-estimate">
          <Clock size={24} color="#8B4513" />
          <div>
            <h3>Estimated Delivery Time</h3>
            <p className="delivery-time">{formatDate(order.estimatedDeliveryTime)}</p>
            <p className="delivery-note">Delivery expected within approximately 15 minutes</p>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="tracking-timeline">
          <h2>Order Status</h2>
          <div className="timeline">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.status} 
                  className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}
                >
                  <div className="step-icon">
                    <Icon size={24} />
                  </div>
                  <div className="step-content">
                    <h3>{step.label}</h3>
                    {step.active && (
                      <p className="step-active-badge">Current Status</p>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`step-line ${step.completed ? 'completed' : ''}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="info-section">
          <h2>Delivery Address</h2>
          <div className="address-card">
            <Home size={24} color="#8B4513" />
            <div className="address-details">
              <p className="address-name">{order.deliveryAddress.name}</p>
              <p className="address-mobile">{order.deliveryAddress.mobile}</p>
              <p className="address-text">{order.deliveryAddress.address}</p>
              {order.deliveryAddress.landmark && (
                <p className="address-landmark">Landmark: {order.deliveryAddress.landmark}</p>
              )}
              <p className="address-pincode">Pincode: {order.deliveryAddress.pincode}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="info-section">
          <h2>Order Summary</h2>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img 
                  src={item.food?.image || 'https://via.placeholder.com/80'} 
                  alt={item.name}
                />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">
                  ₹{item.subtotal}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>₹{order.deliveryCharge}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {order.specialInstructions && (
            <div className="special-instructions">
              <strong>Special Instructions:</strong>
              <p>{order.specialInstructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
