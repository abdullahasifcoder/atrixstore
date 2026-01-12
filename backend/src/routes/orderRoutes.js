const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');
const { idValidation, orderStatusValidation } = require('../utils/validators');

router.post('/webhook', orderController.stripeWebhook);

if (process.env.NODE_ENV === 'development') {
  router.post('/test-create', async (req, res) => {
    try {
      const db = require('../models');
      const userId = req.body.userId || 1;

      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const products = await db.Product.findAll({ limit: 2 });

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
      });

      for (const product of products) {
        await db.OrderItem.create({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productImage: product.imageUrl,
          price: product.price,
          quantity: 1
        });
      }

      res.json({ success: true, order, message: 'Test order created' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

router.get('/', authenticateUser, orderController.getOrders);
router.get('/:id', authenticateUser, idValidation, orderController.getOrderById);
router.post('/checkout', authenticateUser, orderController.createCheckoutSession);

router.get('/admin/all', authenticateAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', authenticateAdmin, idValidation, orderStatusValidation, orderController.updateOrderStatus);

module.exports = router;
