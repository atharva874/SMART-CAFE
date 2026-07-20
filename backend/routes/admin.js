const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Food = require('../models/Food');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get dashboard statistics
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.find({ 
      createdAt: { $gte: today },
      status: { $ne: 'Cancelled' }
    });
    
    const pendingOrders = await Order.countDocuments({ 
      status: 'Order Confirmed'
    });
    
    const activeOrders = await Order.countDocuments({ 
      status: { $in: ['Preparing', 'Ready for Delivery', 'Order Reached'] }
    });
    
    const completedOrders = await Order.countDocuments({ 
      status: 'Delivered',
      createdAt: { $gte: today }
    });
    
    const cancelledOrders = await Order.countDocuments({ 
      status: 'Cancelled',
      createdAt: { $gte: today }
    });
    
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const recentOrders = await Order.find()
      .populate('customer', 'name email mobile')
      .populate('items.food')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      todayOrders: todayOrders.length,
      pendingOrders,
      activeOrders,
      completedOrders,
      cancelledOrders,
      todayRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, date, search } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }
    
    const orders = await Order.find(query)
      .populate('customer', 'name email mobile')
      .populate('items.food')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name email mobile').populate('items.food');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      await order.save();
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`customer-${order.customer._id}`).emit('order-status-update', {
      orderId: order._id,
      status: order.status
    });
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics
router.get('/statistics', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalFoodItems = await Food.countDocuments();
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      totalOrders,
      totalCustomers,
      totalFoodItems,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
