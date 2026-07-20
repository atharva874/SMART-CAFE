# Premium Cafe Food Ordering System

A complete, production-ready full-stack food ordering system built with React, Node.js, Express, and MongoDB Atlas. Features real-time order tracking, admin dashboard, and multiple payment options.

## 🚀 Features

### Customer Panel
- ✅ User registration and authentication
- ✅ Browse menu with search and category filters
- ✅ Shopping cart with quantity management
- ✅ Checkout with delivery address collection
- ✅ Two payment methods: Cash on Delivery & Online Payment (QR Code)
- ✅ Real-time order tracking with automatic status updates
- ✅ Order history
- ✅ Live notifications for order status changes

### Admin Panel
- ✅ Secure admin authentication
- ✅ Dashboard with real-time statistics
- ✅ Order management with live order alerts
- ✅ Menu management (CRUD operations for food items)
- ✅ Customer management
- ✅ Real-time order notifications

### Technical Features
- ✅ Real-time updates using Socket.io
- ✅ Automatic order status progression (Confirmed → Preparing → Ready → Delivered)
- ✅ JWT-based authentication
- ✅ MongoDB Atlas cloud database
- ✅ Responsive design for all devices
- ✅ RESTful API architecture

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Socket.io Client
- React Toastify
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Bcrypt.js
- Node-Cron (for automatic status updates)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## 🔧 Installation

### 1. Clone the repository
```bash
cd cafe-ordering-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://Atharva:Atharva8704@cluster0.ukcswt1.mongodb.net/cafeOrderingSystem?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
# Or for production
npm start
```
Backend will run on http://localhost:5000

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

## 📝 Initial Setup

### Create Admin Account
To create an admin account, you can either:

1. **Option A**: Register a user through the customer registration, then manually update the role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@cafe.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Option B**: Use a database GUI like MongoDB Compass to create a user with `role: "admin"`

### Sample Admin Credentials (if you create manually):
- Email: admin@cafe.com
- Password: admin123
- Role: admin

### Add Sample Data

1. **Create Categories** (via Admin Panel):
   - Beverages
   - Main Course
   - Desserts
   - Snacks
   - Appetizers

2. **Add Food Items** (via Admin Panel):
   Use the Menu Management page to add food items with:
   - Name, description, price
   - Category assignment
   - Image URL (you can use placeholder images or real URLs)
   - Veg/Non-veg indicator
   - Availability status

## 📱 Usage

### Customer Flow
1. Register/Login at http://localhost:3000/register
2. Browse menu and add items to cart
3. Proceed to checkout and enter delivery address
4. Select payment method (COD or Online Payment)
5. Confirm order and track in real-time
6. View order history

### Admin Flow
1. Login at http://localhost:3000/admin/login
2. View dashboard statistics
3. Manage incoming orders
4. Add/Edit/Delete food items
5. View customer information
6. Receive real-time notifications for new orders

## 🔄 Order Status Flow

The system automatically updates order status every minute:
- **Order Confirmed** (0 min) - Initial state
- **Preparing** (5 min) - Order is being prepared
- **Ready for Delivery** (10 min) - Ready to be delivered
- **Order Reached** (15 min) - Out for delivery
- **Delivered** - Manually marked by admin

## 🔐 Security Features

- Passwords hashed using bcrypt
- JWT token-based authentication
- Protected routes for admin and customer areas
- Input validation on both frontend and backend
- CORS configured for security

## 🎨 UI/UX Features

- Modern, premium cafe-themed design
- Smooth animations and transitions
- Responsive design for mobile, tablet, and desktop
- Loading states and error handling
- Toast notifications for user feedback
- Real-time updates without page refresh

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login (customer/admin)
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Foods
- `GET /api/foods` - Get available foods
- `GET /api/foods/admin/all` - Get all foods (admin)
- `POST /api/foods` - Create food item (admin)
- `PUT /api/foods/:id` - Update food item (admin)
- `DELETE /api/foods/:id` - Delete food item (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get customer orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

### Customers
- `GET /api/customers` - Get all customers (admin)
- `GET /api/customers/:id` - Get customer details (admin)

## 🌐 WebSocket Events

- `new-order` - Emitted when customer places order
- `order-status-update` - Emitted when order status changes
- `order-confirmed` - Emitted after successful order placement
- `order-cancelled` - Emitted when order is cancelled

## 🐛 Troubleshooting

### Backend not connecting to MongoDB
- Verify MongoDB Atlas connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB cluster is running

### Frontend not connecting to backend
- Verify backend is running on port 5000
- Check proxy setting in `frontend/package.json`
- Clear browser cache and restart both servers

### Socket.io connection issues
- Ensure both frontend and backend are running
- Check CORS configuration in `backend/server.js`
- Verify Socket.io client version matches server version

## 📦 Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment variables
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Deploy to services like Heroku, Railway, or AWS

### Frontend
1. Update API base URL for production
2. Build the app: `npm run build`
3. Deploy to Vercel, Netlify, or similar services

### Database
- MongoDB Atlas is already cloud-based and production-ready
- Ensure proper indexes are set for performance
- Set up automated backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@premiumcafe.com

## 🙏 Acknowledgments

- Icons by Lucide React
- UI inspiration from modern food delivery apps
- MongoDB Atlas for database hosting

---

**Built with ❤️ for Premium Cafe**
