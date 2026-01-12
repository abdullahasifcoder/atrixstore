'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {

      const existingOrders = await queryInterface.sequelize.query(
        `SELECT COUNT(*) as count FROM orders;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (existingOrders[0].count > 0) {
        console.log('Orders already exist, skipping order seeding');
        return;
      }

      const users = await queryInterface.sequelize.query(
        `SELECT id, email, "firstName", "lastName" FROM users LIMIT 3;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found, skipping order seeding');
        return;
      }

      const products = await queryInterface.sequelize.query(
        `SELECT id, name, price FROM products LIMIT 4;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (products.length === 0) {
        console.log('No products found, skipping order seeding');
        return;
      }

      console.log(`Found ${users.length} users and ${products.length} products for seeding orders`);

      const orders = [];
      const orderItems = [];
      const baseTimestamp = Date.now();

      users.forEach((user, userIndex) => {

        const numOrders = userIndex === 0 ? 3 : 2;

        for (let orderIndex = 0; orderIndex < numOrders; orderIndex++) {
          const orderId = 2000 + (userIndex * 10) + orderIndex; 
          const orderNumber = `ORD-${baseTimestamp + orderId}-${String(orderId).padStart(3, '0')}`;

          let subtotal = 0;
          const orderProducts = products.slice(0, Math.min(products.length, orderIndex + 2));

          orderProducts.forEach(product => {
            subtotal += parseFloat(product.price) * (orderIndex + 1);
          });

          const tax = Math.round(subtotal * 0.1 * 100) / 100; 
          const shippingCost = subtotal > 100 ? 0 : 10; 
          const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

          const statuses = ['delivered', 'processing', 'shipped', 'pending'];
          const status = statuses[orderIndex % statuses.length];

          const daysAgo = (userIndex + 1) * (orderIndex + 1) * 2;

          orders.push({
            id: orderId,
            orderNumber: orderNumber,
            userId: user.id,
            status: status,
            paymentStatus: status === 'pending' ? 'pending' : 'paid',
            paymentMethod: 'stripe',
            subtotal: subtotal,
            tax: tax,
            shippingCost: shippingCost,
            total: total,
            shippingAddress: `${123 + (userIndex * 100)} Main Street`,
            shippingCity: ['New York', 'Los Angeles', 'Chicago'][userIndex] || 'Boston',
            shippingState: ['NY', 'CA', 'IL'][userIndex] || 'MA',
            shippingPostalCode: `${10001 + userIndex}`,
            shippingCountry: 'USA',
            customerName: `${user.firstName} ${user.lastName}`,
            customerEmail: user.email,
            createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
          });

          orderProducts.forEach((product, productIndex) => {
            const quantity = Math.max(1, orderIndex + productIndex);
            const itemSubtotal = parseFloat(product.price) * quantity;

            orderItems.push({
              orderId: orderId,
              productId: product.id,
              productName: product.name,
              productSku: `SKU-${product.id}`,
              price: product.price,
              quantity: quantity,
              subtotal: itemSubtotal,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          });
        }
      });

      console.log(`Inserting ${orders.length} orders and ${orderItems.length} order items`);

      await queryInterface.bulkInsert('orders', orders);

      await queryInterface.bulkInsert('order_items', orderItems);

      console.log('Successfully seeded orders and order items');

    } catch (error) {
      console.error('Error seeding orders:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_items', {
      orderId: {
        [Sequelize.Op.gte]: 2000
      }
    });
    await queryInterface.bulkDelete('orders', {
      id: {
        [Sequelize.Op.gte]: 2000
      }
    });
  }
};
