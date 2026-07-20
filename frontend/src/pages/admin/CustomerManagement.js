import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { Search, User, Mail, Phone, ShoppingBag } from 'lucide-react';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.mobile.includes(searchQuery)
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="loading-container">Loading customers...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      
      <div className="customer-management-container">
        <div className="customer-management-header">
          <h1>Customer Management</h1>
          <p>View and manage registered customers</p>
        </div>

        {/* Search */}
        <div className="search-bar-admin">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search customers by name, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Customers Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="no-customers">
            <p>No customers found</p>
          </div>
        ) : (
          <div className="customers-grid">
            {filteredCustomers.map(customer => (
              <div key={customer._id} className="customer-card">
                <div className="customer-avatar">
                  <User size={32} />
                </div>
                
                <div className="customer-info-card">
                  <h3>{customer.name}</h3>
                  
                  <div className="customer-detail-item">
                    <Mail size={16} />
                    <span>{customer.email}</span>
                  </div>
                  
                  <div className="customer-detail-item">
                    <Phone size={16} />
                    <span>{customer.mobile}</span>
                  </div>
                  
                  <div className="customer-stats">
                    <div className="stat-item">
                      <ShoppingBag size={18} />
                      <span>Member since</span>
                      <strong>{formatDate(customer.createdAt)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
