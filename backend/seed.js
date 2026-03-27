require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopease';

const users = [
  { name: 'Admin User', email: 'admin@shopease.com', password: 'admin123', role: 'admin' },
  { name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'user' }
];

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound. Perfect for work and travel.',
    price: 249.99,
    originalPrice: 349.99,
    category: 'Electronics',
    brand: 'SoundPro',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    stock: 45,
    featured: true,
    tags: ['headphones', 'wireless', 'noise-cancelling']
  },
  {
    name: 'Slim Leather Laptop Bag',
    description: 'Genuine leather laptop bag that fits up to 15-inch laptops. Multiple compartments, water-resistant, and stylish for professionals.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Fashion',
    brand: 'LeatherCraft',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    stock: 30,
    featured: true,
    tags: ['bag', 'leather', 'laptop']
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, 7-day battery, and 50+ workout modes.',
    price: 199.99,
    category: 'Electronics',
    brand: 'FitTech',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    stock: 60,
    featured: true,
    tags: ['watch', 'fitness', 'smartwatch']
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic chair with lumbar support, adjustable armrests, breathable mesh back, and 5-year warranty.',
    price: 349.99,
    originalPrice: 499.99,
    category: 'Home & Garden',
    brand: 'ComfortPlus',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    stock: 15,
    featured: true,
    tags: ['chair', 'office', 'ergonomic']
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Vacuum-insulated 32oz stainless steel bottle keeps drinks cold 24hrs and hot 12hrs. BPA-free and leak-proof.',
    price: 34.99,
    category: 'Sports',
    brand: 'HydroLife',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'],
    stock: 100,
    featured: false,
    tags: ['bottle', 'hydration', 'sports']
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Full-size mechanical keyboard with Cherry MX switches, RGB backlighting, anti-ghosting, and aluminum frame.',
    price: 129.99,
    category: 'Electronics',
    brand: 'GameGear',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'],
    stock: 40,
    featured: true,
    tags: ['keyboard', 'gaming', 'mechanical']
  },
  {
    name: 'Premium Yoga Mat',
    description: 'Non-slip 6mm thick yoga mat with alignment lines, carrying strap, and eco-friendly materials. Perfect for all skill levels.',
    price: 59.99,
    category: 'Sports',
    brand: 'ZenFlow',
    images: ['https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400'],
    stock: 75,
    featured: false,
    tags: ['yoga', 'fitness', 'mat']
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'LED desk lamp with 5 color modes, 7 brightness levels, USB charging port, and flexible arm. Eye-care technology.',
    price: 49.99,
    originalPrice: 69.99,
    category: 'Home & Garden',
    brand: 'LumiSpace',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'],
    stock: 55,
    featured: false,
    tags: ['lamp', 'desk', 'LED']
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }
    console.log(`Created ${users.length} users`);
    console.log('  Admin: admin@shopease.com / admin123');
    console.log('  User:  john@example.com / user123');

    // Create products
    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
