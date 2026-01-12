require('dotenv').config();
const db = require('../models');

async function verifyDatabase() {
  console.log('\n🔍 Starting Database Verification...\n');

  try {

    console.log('1️⃣  Testing database connection...');
    await db.sequelize.authenticate();
    console.log('   ✅ Database connection successful\n');

    console.log('2️⃣  Checking database tables...');
    const tables = await db.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'",
      { type: db.Sequelize.QueryTypes.SELECT }
    );
    console.log(`   ✅ Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`      - ${t.table_name}`));
    console.log('');

    console.log('3️⃣  Counting records in main tables...');
    const userCount = await db.User.count();
    const productCount = await db.Product.count();
    const categoryCount = await db.Category.count();
    const orderCount = await db.Order.count();
    const orderItemCount = await db.OrderItem.count();
    const cartItemCount = await db.CartItem.count();

    console.log(`   Users: ${userCount}`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Orders: ${orderCount}`);
    console.log(`   Order Items: ${orderItemCount}`);
    console.log(`   Cart Items: ${cartItemCount}`);
    console.log('');

    console.log('4️⃣  Testing model associations...');

    const sampleOrder = await db.Order.findOne({
      include: [{ model: db.User, as: 'user' }]
    });
    if (sampleOrder) {
      console.log(`   ✅ Order -> User association working (Order #${sampleOrder.orderNumber})`);
    } else if (orderCount > 0) {
      console.log('   ⚠️  Orders exist but could not load with User association');
    } else {
      console.log('   ℹ️  No orders to test association');
    }

    const orderWithItems = await db.Order.findOne({
      include: [{ 
        model: db.OrderItem, 
        as: 'orderItems',
        include: [{ model: db.Product, as: 'product' }]
      }]
    });
    if (orderWithItems) {
      console.log(`   ✅ Order -> OrderItem -> Product association working`);
      console.log(`      Order has ${orderWithItems.orderItems.length} items`);
    } else if (orderCount > 0) {
      console.log('   ⚠️  Orders exist but could not load OrderItems');
    } else {
      console.log('   ℹ️  No orders to test association');
    }
    console.log('');

    if (orderCount > 0) {
      console.log('5️⃣  Recent Orders:');
      const recentOrders = await db.Order.findAll({
        include: [
          { model: db.User, as: 'user', attributes: ['id', 'email'] },
          { model: db.OrderItem, as: 'orderItems' }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      recentOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order #${order.orderNumber}`);
        console.log(`      User: ${order.user ? order.user.email : 'N/A'}`);
        console.log(`      Status: ${order.status} | Payment: ${order.paymentStatus}`);
        console.log(`      Total: $${order.total}`);
        console.log(`      Items: ${order.orderItems.length}`);
        console.log(`      Created: ${order.createdAt}`);
      });
    } else {
      console.log('5️⃣  No orders found in database');
    }
    console.log('');

    console.log('6️⃣  Checking for data integrity issues...');

    const ordersWithoutUsers = await db.Order.findAll({
      include: [{
        model: db.User,
        as: 'user',
        required: false
      }],
      where: {
        userId: {
          [db.Sequelize.Op.notIn]: db.sequelize.literal('(SELECT id FROM users)')
        }
      }
    });

    if (ordersWithoutUsers.length > 0) {
      console.log(`   ⚠️  Found ${ordersWithoutUsers.length} orders with invalid userId`);
    } else {
      console.log('   ✅ All orders have valid user references');
    }

    const itemsWithoutOrders = await db.OrderItem.count({
      where: {
        orderId: {
          [db.Sequelize.Op.notIn]: db.sequelize.literal('(SELECT id FROM orders)')
        }
      }
    });

    if (itemsWithoutOrders > 0) {
      console.log(`   ⚠️  Found ${itemsWithoutOrders} order items with invalid orderId`);
    } else {
      console.log('   ✅ All order items have valid order references');
    }
    console.log('');

    console.log('✅ Database verification complete!\n');

  } catch (error) {
    console.error('❌ Error during verification:');
    console.error(error);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

verifyDatabase();
