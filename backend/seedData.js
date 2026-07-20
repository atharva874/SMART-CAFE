const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Food = require('./models/Food');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Food.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@cafe.com',
      password: 'admin123', // Will be hashed by pre-save hook
      mobile: '9876543210',
      role: 'admin'
    });
    console.log('👤 Admin user created - Email: admin@cafe.com, Password: admin123');

    // Create Sample Customer
    const customer = await User.create({
      name: 'John Doe',
      email: 'customer@example.com',
      password: 'customer123',
      mobile: '9876543211',
      role: 'customer'
    });
    console.log('👤 Sample customer created - Email: customer@example.com, Password: customer123');

    // Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Beverages',
        description: 'Hot and cold drinks',
        isActive: true
      },
      {
        name: 'Main Course',
        description: 'Delicious main dishes',
        isActive: true
      },
      {
        name: 'Desserts',
        description: 'Sweet treats',
        isActive: true
      },
      {
        name: 'Snacks',
        description: 'Quick bites',
        isActive: true
      },
      {
        name: 'Appetizers',
        description: 'Start your meal right',
        isActive: true
      }
    ]);
    console.log('📂 Categories created');

    // Create Food Items
    const foods = await Food.insertMany([
      // Beverages
      {
        name: 'Cappuccino',
        description: 'Rich espresso with steamed milk foam',
        price: 120,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        category: categories[0]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Cold Coffee',
        description: 'Refreshing iced coffee with milk',
        price: 150,
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
        category: categories[0]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Fresh Juice',
        description: 'Seasonal fresh fruit juice',
        price: 100,
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
        category: categories[0]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      
      // Main Course
      {
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese in rich tomato gravy',
        price: 280,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
        category: categories[1]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 20
      },
      {
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken',
        price: 320,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        category: categories[1]._id,
        isVeg: false,
        isAvailable: true,
        preparationTime: 25
      },
      {
        name: 'Veg Thali',
        description: 'Complete Indian meal with assorted dishes',
        price: 250,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: categories[1]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 20
      },
      
      // Desserts
      {
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 80,
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
        category: categories[2]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Ice Cream Sundae',
        description: 'Creamy ice cream with toppings',
        price: 120,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        category: categories[2]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      
      // Snacks
      {
        name: 'French Fries',
        description: 'Crispy golden potato fries',
        price: 100,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        category: categories[3]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'Veg Sandwich',
        description: 'Grilled sandwich with fresh vegetables',
        price: 120,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
        category: categories[3]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'Chicken Wings',
        description: 'Spicy crispy chicken wings',
        price: 220,
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
        category: categories[3]._id,
        isVeg: false,
        isAvailable: true,
        preparationTime: 15
      },
      
      // Appetizers
      {
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls',
        price: 140,
        image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400',
        category: categories[4]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 12
      },
      {
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese with spices',
        price: 200,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
        category: categories[4]._id,
        isVeg: true,
        isAvailable: true,
        preparationTime: 15
      },
      {
        name: 'Chicken Tikka',
        description: 'Marinated grilled chicken pieces',
        price: 240,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
        category: categories[4]._id,
        isVeg: false,
        isAvailable: true,
        preparationTime: 18
      }
    ]);
    console.log('🍽️  Food items created');

    console.log('\n✨ Database seeded successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('   Admin - Email: admin@cafe.com | Password: admin123');
    console.log('   Customer - Email: customer@example.com | Password: customer123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
