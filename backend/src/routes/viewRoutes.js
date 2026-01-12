const express = require('express');
const router = express.Router();
const db = require('../models');
const { optionalAuth, authenticateUser } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const { hybridSearch } = require('../utils/hybridSearch');

router.get('/', optionalAuth, asyncHandler(async (req, res) => {

  const featuredProducts = await db.Product.findAll({
    where: { isActive: true, isFeatured: true },
    limit: 8,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['name', 'slug']
    }],
    order: [['salesCount', 'DESC']]
  });

  const categories = await db.Category.findAll({
    where: { isActive: true, parentId: null },
    order: [['sortOrder', 'ASC']],
    limit: 6
  });

  res.render('pages/home', {
    title: 'Home',
    user: req.user || null,
    featuredProducts,
    categories
  });
}));

router.get('/shop', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, categoryId, search, minPrice, maxPrice, sortBy = 'createdAt' } = req.query;

  // Use hybrid search for improved search results
  const searchResults = await hybridSearch(db, {
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortBy: sortBy === 'createdAt' ? 'createdAt' : (sortBy === 'salesCount' ? 'relevance' : sortBy),
    order: 'DESC',
    page,
    limit,
    includeInactive: false
  });

  const categories = await db.Category.findAll({
    where: { isActive: true },
    order: [['name', 'ASC']]
  });

  res.render('pages/shop', {
    title: 'Shop',
    user: req.user || null,
    products: searchResults.products,
    categories,
    pagination: searchResults.pagination,
    filters: { categoryId, search, minPrice, maxPrice, sortBy },
    searchInfo: searchResults.searchInfo
  });
}));

router.get('/product/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const product = await db.Product.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!product) {
    return res.status(404).render('pages/404', {
      title: 'Product Not Found',
      user: req.user || null
    });
  }

  await product.increment('viewCount');

  const relatedProducts = await db.Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [db.Sequelize.Op.ne]: product.id },
      isActive: true
    },
    order: [['salesCount', 'DESC']],
    limit: 4
  });

  res.render('pages/product-detail', {
    title: product.name,
    user: req.user || null,
    product,
    relatedProducts
  });
}));

router.get('/cart', authenticateUser, asyncHandler(async (req, res) => {
  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product',
      attributes: ['id', 'name', 'slug', 'price', 'stock', 'imageUrl']
    }]
  });

  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += parseFloat(item.product.price) * item.quantity;
  });

  res.render('pages/cart', {
    title: 'Shopping Cart',
    user: req.user,
    cartItems,
    subtotal: subtotal.toFixed(2)
  });
}));

router.get('/checkout', authenticateUser, asyncHandler(async (req, res) => {
  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{ model: db.Product, as: 'product' }]
  });

  if (cartItems.length === 0) {
    return res.redirect('/cart');
  }

  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += parseFloat(item.product.price) * item.quantity;
  });

  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  res.render('pages/checkout', {
    title: 'Checkout',
    user: req.user,
    cartItems,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2)
  });
}));

router.get('/orders', authenticateUser, asyncHandler(async (req, res) => {
  console.log(`\ud83d\udccb User ${req.user.id} viewing orders page`);

  const orders = await db.Order.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      include: [{ model: db.Product, as: 'product', attributes: ['id', 'name', 'slug', 'imageUrl'] }]
    }],
    order: [['createdAt', 'DESC']]
  });

  console.log(`✅ Rendering orders page with ${orders.length} orders for user ${req.user.id}`);

  res.render('pages/orders', {
    title: 'My Orders',
    user: req.user,
    orders
  });
}));

router.get('/orders/success', authenticateUser, asyncHandler(async (req, res) => {
  const { session_id } = req.query;
  let order = null;

  if (session_id) {
    // First check if order already exists for this session
    order = await db.Order.findOne({
      where: { stripeSessionId: session_id },
      include: [{
        model: db.OrderItem,
        as: 'orderItems'
      }]
    });

    // If no order exists, verify the session and create the order
    if (!order) {
      try {
        const { stripe } = require('../config/stripe');
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
          const t = await db.sequelize.transaction();
          
          try {
            const userId = parseInt(session.metadata.userId);
            
            // Get cart items
            const cartItems = await db.CartItem.findAll({
              where: { userId },
              include: [{ model: db.Product, as: 'product' }],
              transaction: t
            });

            if (cartItems.length > 0) {
              // Create the order
              order = await db.Order.create({
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
                customerName: session.customer_details?.name || `${req.user.firstName} ${req.user.lastName}`,
                customerEmail: session.customer_details?.email || req.user.email,
                customerPhone: session.customer_details?.phone || req.user.phone
              }, { transaction: t });

              // Create order items
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

                // Update stock and sales
                await cartItem.product.decrement('stock', {
                  by: cartItem.quantity,
                  transaction: t
                });
                await cartItem.product.increment('salesCount', {
                  by: cartItem.quantity,
                  transaction: t
                });
              }

              // Clear cart
              await db.CartItem.destroy({
                where: { userId },
                transaction: t
              });

              await t.commit();
              console.log(`✅ Order ${order.orderNumber} created from success page for session ${session_id}`);
            } else {
              await t.rollback();
              // Cart already empty - order might have been created by webhook
              order = await db.Order.findOne({
                where: { stripeSessionId: session_id }
              });
            }
          } catch (error) {
            await t.rollback();
            console.error('Error creating order from success page:', error);
          }
        }
      } catch (error) {
        console.error('Error retrieving Stripe session:', error);
      }
    }
  }

  res.render('pages/order-success', {
    title: 'Order Successful',
    user: req.user,
    order
  });
}));

router.get('/login', asyncHandler(async (req, res) => {
  // Check if user has a valid token
  if (req.cookies.token) {
    try {
      const { verifyAccessToken } = require('../utils/jwt');
      const decoded = verifyAccessToken(req.cookies.token);
      const user = await db.User.findByPk(decoded.userId);
      
      if (user && user.isActive) {
        // Valid token, redirect to home
        return res.redirect('/');
      }
    } catch (error) {
      // Invalid or expired token, clear it
      res.clearCookie('token');
    }
  }
  
  res.render('pages/login', {
    title: 'Login',
    user: null
  });
}));

router.get('/register', asyncHandler(async (req, res) => {
  // Check if user has a valid token
  if (req.cookies.token) {
    try {
      const { verifyAccessToken } = require('../utils/jwt');
      const decoded = verifyAccessToken(req.cookies.token);
      const user = await db.User.findByPk(decoded.userId);
      
      if (user && user.isActive) {
        // Valid token, redirect to home
        return res.redirect('/');
      }
    } catch (error) {
      // Invalid or expired token, clear it
      res.clearCookie('token');
    }
  }
  
  res.render('pages/register', {
    title: 'Register',
    user: null
  });
}));

router.get('/profile', authenticateUser, (req, res) => {
  res.render('pages/profile', {
    title: 'My Profile',
    user: req.user
  });
});

router.get('/wishlist', authenticateUser, asyncHandler(async (req, res) => {
  const wishlistItems = await db.Wishlist.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product',
      where: { isActive: true },
      required: false,
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }]
    }],
    order: [['createdAt', 'DESC']]
  });

  // Filter out items where product is null (deleted products)
  const validItems = wishlistItems.filter(item => item.product);

  res.render('pages/wishlist', {
    title: 'My Wishlist',
    user: req.user,
    wishlistItems: validItems
  });
}));

// Messages/Notifications page
router.get('/messages', authenticateUser, asyncHandler(async (req, res) => {
  const { page = 1, filter = 'all' } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Build where clause based on filter
  const whereClause = { userId: req.user.id };
  
  if (filter === 'unread') {
    whereClause.isRead = false;
  } else if (filter === 'deliveries') {
    whereClause.type = { [db.Sequelize.Op.in]: ['order_delivered', 'order_shipped'] };
  } else if (filter === 'reviews') {
    whereClause.type = 'review_reminder';
  }

  const { count, rows: messages } = await db.Message.findAndCountAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  const totalPages = Math.ceil(count / limit);
  const unreadCount = await db.Message.count({
    where: { userId: req.user.id, isRead: false }
  });

  res.render('pages/messages', {
    title: 'My Messages',
    user: req.user,
    messages,
    unreadCount,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: count,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    filter
  });
}));

module.exports = router;
