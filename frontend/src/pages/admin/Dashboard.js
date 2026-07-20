import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { TrendingUp, ShoppingBag, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    todayRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="loading-container">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of your cafe operations</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <ShoppingBag size={28} />
            </div>
            <div className="stat-content">
              <h3>Today's Orders</h3>
              <p className="stat-value">{stats.todayOrders}</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={28} />
            </div>
            <div className="stat-content">
              <h3>Pending Orders</h3>
              <p className="stat-value">{stats.pendingOrders}</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <TrendingUp size={28} />
            </div>
            <div className="stat-content">
              <h3>Active Orders</h3>
              <p className="stat-value">{stats.activeOrders}</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle size={28} />
            </div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p className="stat-value">{stats.completedOrders}</p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <XCircle size={28} />
            </div>
            <div className="stat-content">
              <h3>Cancelled</h3>
              <p className="stat-value">{stats.cancelledOrders}</p>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">
              <DollarSign size={28} />
            </div>
            <div className="stat-content">
              <h3>Today's Revenue</h3>
              <p className="stat-value">₹{stats.todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders-section">
          <h2>Recent Orders</h2>
          
          {stats.recentOrders.length === 0 ? (
            <div className="no-orders">No orders yet</div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <strong>{order.orderNumber}</strong>
                      </td>
                      <td>
                        <div className="customer-info">
                          <span>{order.customer?.name}</span>
                          <small>{order.customer?.mobile}</small>
                        </div>
                      </td>
                      <td>{order.items.length} items</td>
                      <td>
                        <strong>₹{order.totalAmount}</strong>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
