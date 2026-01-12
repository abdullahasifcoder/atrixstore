require('dotenv').config();
const db = require('../models');

async function createTestOrder() {
  console.log('\n🧪 Testing Order Creation...\n');

  try {

    const user = await db.User.findOne();
    if (!user) {
      console.error('❌ No users found in database. Please seed users first.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

    const products = await db.Product.findAll({ limit: 2 });
    if (products.length === 0) {
      console.error('❌ No products found in database. Please seed products first.');
      process.exit(1);
    }

    console.log(`✅ Found ${products.length} products`);

    const transaction = await db.sequelize.transaction();

    try {
      const order = await db.Order.create({
        userId: user.id,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'test',
        subtotal: 100.00,
        tax: 10.00,
        shippingCost: 5.00,
        total: 115.00,
        shippingAddress: '123 Test Street',
        shippingCity: 'Test City',
        shippingState: 'TS',
        shippingPostalCode: '12345',
        shippingCountry: 'USA',
        customerName: user.firstName + ' ' + user.lastName,
        customerEmail: user.email,
        customerPhone: user.phone || '123-456-7890'
      }, { transaction });

      console.log(`✅ Order created: #${order.orderNumber} (ID: ${order.id})`);

      for (const product of products) {
        await db.OrderItem.create({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productImage: product.imageUrl,
          price: product.price,
          quantity: 1
        }, { transaction });

        console.log(`   ✅ Added item: ${product.name}`);
      }

      await transaction.commit();

      console.log('\n✅ Test order created successfully!');
      console.log(`\nOrder Details:`);
      console.log(`  Order Number: ${order.orderNumber}`);
      console.log(`  Order ID: ${order.id}`);
      console.log(`  Customer: ${order.customerName}`);
      console.log(`  Total: $${order.total}`);
      console.log(`  Status: ${order.status}`);
      console.log(`\nYou can now check:`);
      console.log(`  - Customer orders page: http://localhost:3000/orders`);
      console.log(`  - Admin dashboard: http://localhost:5174`);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('\n❌ Error creating test order:');
    console.error(error);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

createTestOrder();
