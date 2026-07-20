import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { useSocket } from '../../context/SocketContext';
import { Search, Filter, Eye, MapPin, Phone } from 'lucide-react';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  useEffect(() => {
    if (socket) {
      socket.on('new-order', () => {
        fetchOrders();
      });

      socket.on('order-status-update', () => {
        fetchOrders();
      });

      return () => {
        socket.off('new-order');
        socket.off('order-status-update');
      };
    }
  }, [socket]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const response = await axios.get(`/api/admin/orders?${params}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Confirmed': return '#3b82f6';
      case 'Preparing': return '#f59e0b';
      case 'Ready for Delivery': return '#8b5cf6';
      case 'Order Reached': return '#06b6d4';
      case 'Delivered': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
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
        <AdminNavbar />
        <div className="loading-container">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      
      <div className="order-management-container">
        <div className="order-management-header">
          <h1>Order Management</h1>
          <p>Manage and track all orders</p>
        </div>

        {/* Filters */}
        <div className="order-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            <button
              className={selectedStatus === 'all' ? 'active' : ''}
              onClick={() => setSelectedStatus('all')}
            >
              All Orders
            </button>
            <button
              className={selectedStatus === 'Order Confirmed' ? 'active' : ''}
              onClick={() => setSelectedStatus('Order Confirmed')}
            >
              Confirmed
            </button>
            <button
              className={selectedStatus === 'Preparing' ? 'active' : ''}
              onClick={() => setSelectedStatus('Preparing')}
            >
              Preparing
            </button>
            <button
              className={selectedStatus === 'Ready for Delivery' ? 'active' : ''}
              onClick={() => setSelectedStatus('Ready for Delivery')}
            >
              Ready
            </button>
            <button
              className={selectedStatus === 'Delivered' ? 'active' : ''}
              onClick={() => setSelectedStatus('Delivered')}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map(order => (
              <div key={order._id} className="order-card-admin">
                <div className="order-card-header-admin">
                  <div>
                    <h3>#{order.orderNumber}</h3>
                    <p className="order-time">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-customer-info">
                  <div className="customer-detail">
                    <strong>{order.customer?.name}</strong>
                    <span>
                      <Phone size={14} />
                      {order.customer?.mobile}
                    </span>
                  </div>
                </div>

                <div className="order-items-summary">
                  <strong>Items ({order.items.length}):</strong>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <span key={index}>
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="order-address">
                  <MapPin size={16} />
                  <span>{order.deliveryAddress.address}</span>
                </div>

                <div className="order-card-footer-admin">
                  <div className="order-amount-admin">
                    <span>Total</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="view-details-btn"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details - #{selectedOrder.orderNumber}</h2>
                <button onClick={() => setSelectedOrder(null)} className="close-btn">×</button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="detail-grid">
                    <div>
                      <strong>Name:</strong>
                      <span>{selectedOrder.customer?.name}</span>
                    </div>
                    <div>
                      <strong>Email:</strong>
                      <span>{selectedOrder.customer?.email}</span>
                    </div>
                    <div>
                      <strong>Mobile:</strong>
                      <span>{selectedOrder.customer?.mobile}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Delivery Address</h3>
                  <p>{selectedOrder.deliveryAddress.name}</p>
                  <p>{selectedOrder.deliveryAddress.mobile}</p>
                  <p>{selectedOrder.deliveryAddress.address}</p>
                  {selectedOrder.deliveryAddress.landmark && (
                    <p>Landmark: {selectedOrder.deliveryAddress.landmark}</p>
                  )}
                  <p>Pincode: {selectedOrder.deliveryAddress.pincode}</p>
                </div>

                <div className="detail-section">
                  <h3>Order Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item-detail">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                  <div className="order-total-detail">
                    <strong>Total Amount:</strong>
                    <strong>₹{selectedOrder.totalAmount}</strong>
                  </div>
                </div>

                {selectedOrder.specialInstructions && (
                  <div className="detail-section">
                    <h3>Special Instructions</h3>
                    <p>{selectedOrder.specialInstructions}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Payment</h3>
                  <p>Method: {selectedOrder.paymentMethod}</p>
                  <p>Status: {selectedOrder.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
