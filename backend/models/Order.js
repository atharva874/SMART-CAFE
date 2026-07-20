const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: false, // Will be auto-generated
    default: function() {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      return `ORD${timestamp}${randomNum}`;
    }
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: Number
  }],
  deliveryAddress: {
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    landmark: String,
    pincode: {
      type: String,
      required: true
    }
  },
  specialInstructions: String,
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Online Payment'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Order Confirmed', 'Preparing', 'Ready for Delivery', 'Order Reached', 'Delivered', 'Cancelled'],
    default: 'Order Confirmed'
  },
  estimatedDeliveryTime: {
    type: Date
  },
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  try {
    if (!this.orderNumber) {
      // Generate unique order number
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      this.orderNumber = `ORD${timestamp}${randomNum}`;
    }
    
    // Set estimated delivery time (15 minutes from order time)
    if (!this.estimatedDeliveryTime) {
      this.estimatedDeliveryTime = new Date(Date.now() + 15 * 60 * 1000);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Order', orderSchema);
