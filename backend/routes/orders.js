const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/auth');

// Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, deliveryAddress, specialInstructions, paymentMethod, subtotal, deliveryCharge, totalAmount } = req.body;
    
    // Generate unique order number
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const orderNumber = `ORD${timestamp}${randomNum}`;
    
    const order = new Order({
      orderNumber,
      customer: req.userId,
      items,
      deliveryAddress,
      specialInstructions,
      paymentMethod,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentStatus: paymentMethod === 'Online Payment' ? 'Paid' : 'Pending'
    });
    
    await order.save();
    await order.populate('customer', 'name email mobile');
    await order.populate('items.food');
    
    // Emit real-time notification to admin
    const io = req.app.get('io');
    io.to('admin-room').emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      totalAmount: order.totalAmount,
      items: order.items.length
    });
    
    // Emit confirmation to customer
    io.to(`customer-${req.userId}`).emit('order-confirmed', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      estimatedDeliveryTime: order.estimatedDeliveryTime
    });
    
    res.status(201).json({ 
      message: 'Order placed successfully', 
      order 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get customer's orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId })
      .populate('items.food')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email mobile')
      .populate('items.food');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.customer._id.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order (Customer)
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.customer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (order.status !== 'Order Confirmed') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    
    order.status = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || 'Cancelled by customer';
    await order.save();
    
    // Emit notification
    const io = req.app.get('io');
    io.to('admin-room').emit('order-cancelled', {
      orderId: order._id,
      orderNumber: order.orderNumber
    });
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
