/**
 * Database Setup Utility for NEON PostgreSQL
 * Run this script to verify connection and seed initial data
 */
require('dotenv').config();
const { sequelize, testConnection } = require('../config/database');
const db = require('../models');

const HIGH_QUALITY_IMAGES = {
  // Electronics - Laptops
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80'
  ],
  // Smartphones
  smartphones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    'https://images.unsplash.com/photo-1592286927505-86c27a4cc53a?w=800&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80'
  ],
  // Men's Clothing
  mensClothing: [
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
    'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80'
  ],
  // Women's Clothing
  womensClothing: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
  ],
  // Home & Living
  homeLiving: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80'
  ],
  // Books
  books: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
  ],
  // Sports & Outdoors
  sports: [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
    'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
  ],
  // Toys & Games
  toys: [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
    'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80'
  ],
  // Categories
  categories: {
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    mensClothing: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
    womensClothing: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    homeLiving: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    toys: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80'
  }
};

async function verifyDatabase() {
  console.log('🔍 Verifying NEON PostgreSQL database...\n');
  
  try {
    await testConnection();
    
    // Check all tables
    const tables = ['users', 'admins', 'categories', 'products', 'orders', 'order_items', 'cart_items'];
    
    console.log('\n📊 Table Status:');
    for (const table of tables) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM "${table}"`);
        console.log(`   ✅ ${table}: ${result[0].count} records`);
      } catch (error) {
        console.log(`   ❌ ${table}: Table does not exist`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    return false;
  }
}

async function updateProductImages() {
  console.log('\n🖼️  Updating product images with high-quality URLs...\n');
  
  try {
    const products = await db.Product.findAll();
    
    for (const product of products) {
      let newImageUrl;
      const categoryId = product.categoryId;
      
      // Assign images based on category
      if (categoryId === 2) { // Laptops
        newImageUrl = HIGH_QUALITY_IMAGES.laptops[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.laptops.length)];
      } else if (categoryId === 3) { // Smartphones
        newImageUrl = HIGH_QUALITY_IMAGES.smartphones[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.smartphones.length)];
      } else if (categoryId === 5) { // Men's Clothing
        newImageUrl = HIGH_QUALITY_IMAGES.mensClothing[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.mensClothing.length)];
      } else if (categoryId === 6) { // Women's Clothing
        newImageUrl = HIGH_QUALITY_IMAGES.womensClothing[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.womensClothing.length)];
      } else if (categoryId === 7) { // Home & Living
        newImageUrl = HIGH_QUALITY_IMAGES.homeLiving[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.homeLiving.length)];
      } else if (categoryId === 8) { // Books
        newImageUrl = HIGH_QUALITY_IMAGES.books[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.books.length)];
      } else if (categoryId === 9) { // Sports
        newImageUrl = HIGH_QUALITY_IMAGES.sports[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.sports.length)];
      } else if (categoryId === 10) { // Toys
        newImageUrl = HIGH_QUALITY_IMAGES.toys[Math.floor(Math.random() * HIGH_QUALITY_IMAGES.toys.length)];
      } else {
        newImageUrl = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80';
      }
      
      await product.update({ 
        imageUrl: newImageUrl,
        images: [newImageUrl]
      });
      console.log(`   ✅ Updated: ${product.name}`);
    }
    
    console.log('\n✅ All product images updated successfully!');
  } catch (error) {
    console.error('❌ Error updating images:', error.message);
  }
}

async function updateCategoryImages() {
  console.log('\n📁 Updating category images...\n');
  
  try {
    const categoryImageMap = {
      1: HIGH_QUALITY_IMAGES.categories.electronics,
      2: HIGH_QUALITY_IMAGES.categories.laptops,
      3: HIGH_QUALITY_IMAGES.categories.smartphones,
      4: HIGH_QUALITY_IMAGES.categories.fashion,
      5: HIGH_QUALITY_IMAGES.categories.mensClothing,
      6: HIGH_QUALITY_IMAGES.categories.womensClothing,
      7: HIGH_QUALITY_IMAGES.categories.homeLiving,
      8: HIGH_QUALITY_IMAGES.categories.books,
      9: HIGH_QUALITY_IMAGES.categories.sports,
      10: HIGH_QUALITY_IMAGES.categories.toys
    };
    
    for (const [id, imageUrl] of Object.entries(categoryImageMap)) {
      await db.Category.update({ image: imageUrl }, { where: { id: parseInt(id) } });
      console.log(`   ✅ Updated category ${id}`);
    }
    
    console.log('\n✅ All category images updated successfully!');
  } catch (error) {
    console.error('❌ Error updating category images:', error.message);
  }
}

async function createSampleOrders() {
  console.log('\n📦 Creating sample orders for analytics...\n');
  
  try {
    const users = await db.User.findAll({ limit: 3 });
    const products = await db.Product.findAll({ limit: 10 });
    
    if (users.length === 0 || products.length === 0) {
      console.log('   ⚠️ Need users and products first');
      return;
    }
    
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const paymentStatuses = ['paid', 'pending'];
    
    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const orderProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
      
      let subtotal = 0;
      orderProducts.forEach(p => {
        subtotal += parseFloat(p.price);
      });
      
      const tax = subtotal * 0.1;
      const shippingCost = subtotal > 100 ? 0 : 10;
      const total = subtotal + tax + shippingCost;
      
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 60));
      
      const order = await db.Order.create({
        userId: user.id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        paymentMethod: 'stripe',
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        total: total.toFixed(2),
        shippingAddress: '123 Sample Street',
        shippingCity: 'Sample City',
        shippingState: 'CA',
        shippingPostalCode: '90210',
        shippingCountry: 'USA',
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        createdAt: createdAt,
        updatedAt: createdAt
      });
      
      // Create order items
      for (const product of orderProducts) {
        await db.OrderItem.create({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productImage: product.imageUrl,
          price: product.price,
          quantity: Math.floor(Math.random() * 2) + 1
        });
      }
      
      console.log(`   ✅ Created order ${order.orderNumber}`);
    }
    
    console.log('\n✅ Sample orders created successfully!');
  } catch (error) {
    console.error('❌ Error creating orders:', error.message);
  }
}

async function run() {
  console.log('═══════════════════════════════════════════════════');
  console.log('    NEON PostgreSQL Database Setup Utility');
  console.log('═══════════════════════════════════════════════════\n');
  
  const isConnected = await verifyDatabase();
  
  if (isConnected) {
    const args = process.argv.slice(2);
    
    if (args.includes('--update-images')) {
      await updateProductImages();
      await updateCategoryImages();
    }
    
    if (args.includes('--create-orders')) {
      await createSampleOrders();
    }
    
    if (args.length === 0) {
      console.log('\n💡 Available commands:');
      console.log('   node src/utils/db-setup.js --update-images  # Update all product/category images');
      console.log('   node src/utils/db-setup.js --create-orders  # Create sample orders for analytics');
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════\n');
  process.exit(0);
}

run();
