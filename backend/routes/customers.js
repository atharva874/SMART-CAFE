const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all customers (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'customer' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    const customers = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer details with order history (Admin only)
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const orders = await Order.find({ customer: req.params.id })
      .populate('items.food')
      .sort({ createdAt: -1 });
    
    const totalOrders = orders.length;
    const totalSpent = orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    res.json({ 
      customer, 
      orders,
      stats: {
        totalOrders,
        totalSpent
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add customer address
router.post('/address', verifyToken, async (req, res) => {
  try {
    const { name, mobile, address, landmark, pincode } = req.body;
    
    const user = await User.findById(req.userId);
    user.addresses.push({ name, mobile, address, landmark, pincode });
    await user.save();
    
    res.json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer addresses
router.get('/address/list', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('addresses');
    res.json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
