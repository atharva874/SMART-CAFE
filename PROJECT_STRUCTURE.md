# Project Structure

Complete directory structure and file organization of the Cafe Food Ordering System.

```
cafe-ordering-system/
│
├── backend/                          # Node.js/Express Backend
│   ├── middleware/                   # Custom middleware
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   ├── models/                       # MongoDB/Mongoose models
│   │   ├── User.js                  # User schema (customers & admins)
│   │   ├── Category.js              # Food category schema
│   │   ├── Food.js                  # Food item schema
│   │   └── Order.js                 # Order schema
│   │
│   ├── routes/                       # API route handlers
│   │   ├── auth.js                  # Authentication routes
│   │   ├── categories.js            # Category CRUD routes
│   │   ├── foods.js                 # Food item CRUD routes
│   │   ├── orders.js                # Order management routes
│   │   ├── customers.js             # Customer management routes
│   │   └── admin.js                 # Admin-specific routes
│   │
│   ├── uploads/                      # File upload directory
│   │   └── .gitkeep                 # Keep directory in git
│   │
│   ├── .env                          # Environment variables (not in git)
│   ├── .gitignore                    # Git ignore rules
│   ├── package.json                  # Backend dependencies
│   ├── seedData.js                   # Database seeding script
│   └── server.js                     # Express app entry point
│
├── frontend/                         # React Frontend
│   ├── public/                       # Static public files
│   │   └── index.html               # HTML template
│   │
│   ├── src/                          # React source code
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.js            # Customer navigation bar
│   │   │   ├── Navbar.css           # Navbar styles
│   │   │   ├── AdminNavbar.js       # Admin navigation bar
│   │   │   ├── AdminNavbar.css      # Admin navbar styles
│   │   │   ├── ProtectedRoute.js    # Customer route guard
│   │   │   └── AdminRoute.js        # Admin route guard
│   │   │
│   │   ├── context/                  # React Context providers
│   │   │   ├── AuthContext.js       # Authentication state
│   │   │   ├── CartContext.js       # Shopping cart state
│   │   │   └── SocketContext.js     # Socket.io connection
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── customer/            # Customer-facing pages
│   │   │   │   ├── Login.js         # Customer login
│   │   │   │   ├── Register.js      # Customer registration
│   │   │   │   ├── Auth.css         # Auth pages styles
│   │   │   │   ├── Home.js          # Home page
│   │   │   │   ├── Home.css         # Home page styles
│   │   │   │   ├── Menu.js          # Menu browsing
│   │   │   │   ├── Menu.css         # Menu styles
│   │   │   │   ├── Cart.js          # Shopping cart
│   │   │   │   ├── Cart.css         # Cart styles
│   │   │   │   ├── Checkout.js      # Checkout page
│   │   │   │   ├── Checkout.css     # Checkout styles
│   │   │   │   ├── OrderTracking.js # Order tracking
│   │   │   │   ├── OrderTracking.css # Tracking styles
│   │   │   │   ├── OrderHistory.js  # Order history
│   │   │   │   └── OrderHistory.css # History styles
│   │   │   │
│   │   │   └── admin/               # Admin panel pages
│   │   │       ├── AdminLogin.js    # Admin login
│   │   │       ├── Dashboard.js     # Admin dashboard
│   │   │       ├── Dashboard.css    # Dashboard styles
│   │   │       ├── OrderManagement.js # Order management
│   │   │       ├── OrderManagement.css # Order styles
│   │   │       ├── MenuManagement.js # Menu CRUD
│   │   │       ├── MenuManagement.css # Menu admin styles
│   │   │       ├── CustomerManagement.js # Customer list
│   │   │       └── CustomerManagement.css # Customer styles
│   │   │
│   │   ├── App.js                    # Main app component
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── .gitignore                    # Git ignore rules
│   └── package.json                  # Frontend dependencies
│
├── README.md                         # Main documentation
├── QUICK_START.md                    # Quick start guide
└── PROJECT_STRUCTURE.md              # This file

```

## 📁 Directory Descriptions

### Backend Structure

#### `/middleware`
Contains Express middleware functions:
- **auth.js**: JWT token verification, role-based access control

#### `/models`
Mongoose schemas defining MongoDB collections:
- **User.js**: User accounts (customers and admins), authentication
- **Category.js**: Food categories
- **Food.js**: Food items with pricing, images, availability
- **Order.js**: Customer orders with items, delivery details, status

#### `/routes`
Express route handlers for API endpoints:
- **auth.js**: Registration, login, profile management
- **categories.js**: Category CRUD operations
- **foods.js**: Food item CRUD operations
- **orders.js**: Order creation, tracking, cancellation
- **customers.js**: Customer information management
- **admin.js**: Dashboard stats, order management

### Frontend Structure

#### `/components`
Reusable React components:
- **Navbar components**: Navigation for customer and admin
- **Route guards**: Protected routes for authentication

#### `/context`
React Context API providers:
- **AuthContext**: User authentication state, login/logout
- **CartContext**: Shopping cart management
- **SocketContext**: Real-time Socket.io connection

#### `/pages/customer`
Customer-facing pages:
- Authentication (Login, Register)
- Shopping experience (Home, Menu, Cart)
- Order management (Checkout, Tracking, History)

#### `/pages/admin`
Admin panel pages:
- Authentication (AdminLogin)
- Management dashboards (Orders, Menu, Customers)
- Analytics (Dashboard with statistics)

## 🔧 Key Files

### Backend

**server.js**
- Express app configuration
- MongoDB connection
- Socket.io setup
- Route mounting
- Cron jobs for automatic order status updates

**seedData.js**
- Database initialization script
- Creates sample admin, customer, categories, and food items

**.env**
- Environment variables
- MongoDB connection string
- JWT secret
- Port configuration

### Frontend

**App.js**
- React Router setup
- Route definitions
- Context provider wrapping

**index.js**
- React app entry point
- Root component rendering

## 📦 Dependencies

### Backend Key Dependencies
- express: Web framework
- mongoose: MongoDB ODM
- socket.io: Real-time communication
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- node-cron: Scheduled tasks
- cors: Cross-origin resource sharing
- express-validator: Input validation

### Frontend Key Dependencies
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- socket.io-client: Real-time client
- react-toastify: Notifications
- lucide-react: Icon library

## 🎯 Design Patterns

### Backend
- **MVC Pattern**: Models, Routes (Controllers), Views (JSON responses)
- **Middleware Chain**: Authentication, validation, error handling
- **Repository Pattern**: Mongoose models as data repositories

### Frontend
- **Context API**: Global state management
- **Component Composition**: Reusable UI components
- **Protected Routes**: Route guards for authentication
- **Container/Presenter**: Smart and dumb components

## 🔐 Security Layers

1. **Authentication**: JWT tokens, password hashing
2. **Authorization**: Role-based access control (admin/customer)
3. **Validation**: Input validation on both frontend and backend
4. **CORS**: Configured for specific origins
5. **Environment Variables**: Sensitive data in .env files

## 🌐 Real-time Features

**Socket.io Events**:
- Customer → Admin: New order notifications
- System → Customer: Order status updates
- System → Admin: Order status changes
- Automatic reconnection handling

## 📊 Data Flow

**Customer Order Flow**:
```
Customer → Cart Context → Checkout → API → Database
↓
Socket.io → Admin Dashboard (Real-time notification)
↓
Cron Job → Auto Status Update → Socket.io → Customer (Real-time)
```

**Admin Management Flow**:
```
Admin → Form → API → Database → Socket.io → Customer (if applicable)
```

This structure ensures:
- ✅ Separation of concerns
- ✅ Maintainability
- ✅ Scalability
- ✅ Code reusability
- ✅ Clear responsibilities
