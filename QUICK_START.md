# Quick Start Guide

Get your Cafe Food Ordering System up and running in 5 minutes!

## 📦 Quick Installation

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🚀 Run the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

### Terminal 2 - Frontend Server
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

## 📊 Seed Database with Sample Data

In a new terminal:
```bash
cd backend
npm run seed
```

This will create:
- ✅ Admin account (admin@cafe.com / admin123)
- ✅ Sample customer (customer@example.com / customer123)
- ✅ 5 categories
- ✅ 14 food items

## 🎯 Test the Application

### Customer Side:
1. Open http://localhost:3000
2. Login with: customer@example.com / customer123
3. Browse menu, add items to cart
4. Complete checkout with any address
5. Track your order in real-time!

### Admin Side:
1. Open http://localhost:3000/admin/login
2. Login with: admin@cafe.com / admin123
3. View dashboard statistics
4. Manage orders, menu, and customers

## 🎉 You're All Set!

Your complete cafe ordering system is now running with:
- ✅ Real-time order notifications
- ✅ Automatic order status updates
- ✅ Payment options (COD & Online)
- ✅ Admin dashboard
- ✅ Customer order tracking

## 🔥 Quick Tips

### Stop Both Servers
Press `Ctrl + C` in both terminal windows

### Reset Database
```bash
cd backend
npm run seed
```

### View API Endpoints
Backend health check: http://localhost:5000

### Common Issues

**Port already in use?**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill port 3000 if needed
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Connection refused?**
- Ensure MongoDB Atlas URL is correct in `.env`
- Check your internet connection
- Verify IP is whitelisted in MongoDB Atlas

**Socket.io not working?**
- Restart both frontend and backend servers
- Clear browser cache
- Check browser console for errors

## 📱 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Customer App | http://localhost:3000 | customer@example.com / customer123 |
| Admin Panel | http://localhost:3000/admin/login | admin@cafe.com / admin123 |
| API Server | http://localhost:5000 | - |

## 🎨 Features to Try

1. **Customer Experience**
   - Add items to cart from different categories
   - Try the search functionality
   - Test COD and Online Payment options
   - Watch order status update automatically

2. **Admin Experience**
   - See real-time notifications when customer orders
   - View dashboard statistics
   - Add/edit food items
   - View customer information

## 🆘 Need Help?

- Check README.md for detailed documentation
- Verify all dependencies are installed
- Ensure both servers are running
- Check browser console for errors

Happy ordering! 🎉
