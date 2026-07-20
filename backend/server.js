const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('Admin joined room');
  });
  
  socket.on('join-customer', (userId) => {
    socket.join(`customer-${userId}`);
    console.log(`Customer ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Import Routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const foodRoutes = require('./routes/foods');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customers');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Cafe Ordering System API is running' });
});

// Automatic Order Status Update - runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const Order = require('./models/Order');
    const orders = await Order.find({ 
      status: { $nin: ['Delivered', 'Cancelled'] } 
    });

    const now = new Date();
    
    for (const order of orders) {
      const orderTime = new Date(order.createdAt);
      const minutesElapsed = Math.floor((now - orderTime) / (1000 * 60));
      
      let newStatus = order.status;
      
      if (minutesElapsed >= 15 && order.status !== 'Order Reached') {
        newStatus = 'Order Reached';
      } else if (minutesElapsed >= 10 && order.status !== 'Ready for Delivery' && order.status !== 'Order Reached') {
        newStatus = 'Ready for Delivery';
      } else if (minutesElapsed >= 5 && order.status !== 'Preparing' && order.status !== 'Ready for Delivery' && order.status !== 'Order Reached') {
        newStatus = 'Preparing';
      }
      
      if (newStatus !== order.status) {
        order.status = newStatus;
        await order.save();
        
        // Emit real-time update
        io.to(`customer-${order.customer}`).emit('order-status-update', {
          orderId: order._id,
          status: newStatus
        });
        
        io.to('admin-room').emit('order-status-update', {
          orderId: order._id,
          status: newStatus
        });
        
        console.log(`Order ${order._id} status updated to: ${newStatus}`);
      }
    }
  } catch (error) {
    console.error('Error in auto status update:', error);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
