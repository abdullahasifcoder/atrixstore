const db = require('../models');
const { asyncHandler } = require('../middleware/error');
const { stripe, STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL } = require('../config/stripe');
const { Op } = require('sequelize');
const { 
  createDeliveryNotification, 
  createShippingNotification,
  createOrderConfirmation 
} = require('./messageController');

const getOrders = asyncHandler(async (req, res) => {
  console.log(`📝 Fetching orders for user ${req.user.id}`);

  const orders = await db.Order.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      include: [{
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug']
      }]
    }],
    order: [['createdAt', 'DESC']]
  });

  console.log(`✅ Found ${orders.length} orders for user ${req.user.id}`);

  res.json({
    success: true,
    orders
  });
});

const getOrderById = asyncHandler(async (req, res) => {

  const whereClause = { id: req.params.id };

  if (req.user && !req.admin) {
    whereClause.userId = req.user.id;
  }

  const order = await db.Order.findOne({
    where: whereClause,
    include: [
      {
        model: db.OrderItem,
        as: 'orderItems',
        include: [{
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'imageUrl']
        }]
      },
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    order
  });
});

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { shippingAddress, city, state, postalCode, country = 'USA' } = req.body;

  console.log(`💳 Creating checkout session for user ${req.user.id}`);

  if (!shippingAddress || !city || !state || !postalCode) {
    return res.status(400).json({
      success: false,
      message: 'Please provide complete shipping address'
    });
  }

  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product',
      where: { isActive: true }
    }]
  });

  console.log(`\ud83d\uded2 User ${req.user.id} has ${cartItems.length} items in cart`);

  if (cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Your cart is empty'
    });
  }

  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available.`
      });
    }
  }

  let subtotal = 0;
  const lineItems = [];

  for (const item of cartItems) {
    const itemTotal = parseFloat(item.product.price) * item.quantity;
    subtotal += itemTotal;

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.shortDescription || '',
          images: item.product.imageUrl ? [item.product.imageUrl] : []
        },
        unit_amount: Math.round(parseFloat(item.product.price) * 100) 
      },
      quantity: item.quantity
    });
  }

  const tax = subtotal * 0.1; 
  const shippingCost = subtotal > 100 ? 0 : 10; 
  const total = subtotal + tax + shippingCost;

  console.log(`\ud83d\udcb0 Checkout summary: Subtotal=$${subtotal.toFixed(2)}, Tax=$${tax.toFixed(2)}, Shipping=$${shippingCost.toFixed(2)}, Total=$${total.toFixed(2)}`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: STRIPE_CANCEL_URL,
    client_reference_id: req.user.id.toString(),
    customer_email: req.user.email,
    metadata: {
      userId: req.user.id.toString(),
      shippingAddress,
      city,
      state,
      postalCode,
      country,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      total: total.toFixed(2)
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'CA']
    }
  });

  console.log(`✅ Stripe session created: ${session.id}`);

  res.json({
    success: true,
    sessionId: session.id,
    url: session.url
  });
});

const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const { STRIPE_WEBHOOK_SECRET } = require('../config/stripe');

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📨 Received webhook event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`💳 Processing checkout session: ${session.id}`);

    const existingOrder = await db.Order.findOne({
      where: { stripeSessionId: session.id }
    });

    if (existingOrder) {
      console.log(`✅ Order already exists for session ${session.id}, skipping creation`);
      return res.json({ received: true });
    }

    const t = await db.sequelize.transaction();

    try {

      const userId = parseInt(session.metadata.userId);
      console.log(`👤 Creating order for user ${userId}`);

      const cartItems = await db.CartItem.findAll({
        where: { userId },
        include: [{ model: db.Product, as: 'product' }],
        transaction: t
      });

      console.log(`🛒 Found ${cartItems.length} cart items`);

      if (cartItems.length === 0) {
        console.log(`⚠️ Cart already empty for user ${userId}, session ${session.id}`);
        await t.rollback();
        return res.json({ received: true });
      }

      console.log(`📝 Creating order record...`);
      const order = await db.Order.create({
        userId,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        subtotal: parseFloat(session.metadata.subtotal),
        tax: parseFloat(session.metadata.tax),
        shippingCost: parseFloat(session.metadata.shippingCost),
        total: parseFloat(session.metadata.total),
        shippingAddress: session.metadata.shippingAddress,
        shippingCity: session.metadata.city,
        shippingState: session.metadata.state,
        shippingPostalCode: session.metadata.postalCode,
        shippingCountry: session.metadata.country,
        customerName: session.customer_details.name,
        customerEmail: session.customer_details.email,
        customerPhone: session.customer_details.phone
      }, { transaction: t });

      console.log(`✅ Order created with ID: ${order.id}, Order Number: ${order.orderNumber}`);

      console.log(`📦 Creating order items...`);
      for (const cartItem of cartItems) {
        await db.OrderItem.create({
          orderId: order.id,
          productId: cartItem.product.id,
          productName: cartItem.product.name,
          productSku: cartItem.product.sku,
          productImage: cartItem.product.imageUrl,
          price: cartItem.product.price,
          quantity: cartItem.quantity
        }, { transaction: t });

        console.log(`   - ${cartItem.product.name} x ${cartItem.quantity}`);

        await cartItem.product.decrement('stock', {
          by: cartItem.quantity,
          transaction: t
        });
        await cartItem.product.increment('salesCount', {
          by: cartItem.quantity,
          transaction: t
        });
      }

      console.log(`🧹 Clearing cart for user ${userId}`);
      await db.CartItem.destroy({
        where: { userId },
        transaction: t
      });

      await t.commit();

      console.log(`✅ Order ${order.orderNumber} created successfully for session ${session.id}`);
      console.log(`💰 Total: $${order.total}`);

      // Send order confirmation notification
      try {
        await createOrderConfirmation(order);
        console.log(`📧 Order confirmation notification sent for order ${order.orderNumber}`);
      } catch (notifyError) {
        console.error('Error sending order confirmation notification:', notifyError);
      }
    } catch (error) {
      await t.rollback();
      console.error('❌ ERROR creating order in webhook:');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Session metadata:', session.metadata);
      console.error('Session customer_details:', session.customer_details);

      return res.status(500).json({ 
        received: false, 
        error: error.message 
      });
    }
  }

  res.json({ received: true });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    search
  } = req.query;

  console.log(`📋 Admin fetching orders - page: ${page}, limit: ${limit}`);

  const offset = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search) {
    where[Op.or] = [
      { orderNumber: { [Op.iLike]: `%${search}%` } },
      { customerEmail: { [Op.iLike]: `%${search}%` } },
      { customerName: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows: orders } = await db.Order.findAndCountAll({
    where,
    include: [
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      },
      {
        model: db.OrderItem,
        as: 'orderItems',
        include: [{
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name']
        }]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });

  console.log(`✅ Admin found ${count} total orders, returning ${orders.length} orders`);

  res.json({
    success: true,
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;

  const order = await db.Order.findByPk(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const previousStatus = order.status;
  const updateData = { status };

  if (status === 'shipped') {
    updateData.shippedAt = new Date();
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
  } else if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  } else if (status === 'cancelled') {
    updateData.cancelledAt = new Date();
  }

  await order.update(updateData);

  // Send notifications based on status change
  try {
    if (status === 'shipped' && previousStatus !== 'shipped') {
      await createShippingNotification(order);
      console.log(`📦 Shipping notification sent for order ${order.orderNumber}`);
    } else if (status === 'delivered' && previousStatus !== 'delivered') {
      await createDeliveryNotification(order);
      console.log(`🎉 Delivery notification sent for order ${order.orderNumber}`);
    }
  } catch (notifyError) {
    console.error('Error sending notification:', notifyError);
    // Don't fail the request if notification fails
  }

  res.json({
    success: true,
    message: 'Order status updated',
    order
  });
});

module.exports = {
  getOrders,
  getOrderById,
  createCheckoutSession,
  stripeWebhook,
  getAllOrders,
  updateOrderStatus
};
