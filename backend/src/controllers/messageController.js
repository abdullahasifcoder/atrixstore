const db = require('../models');
const { asyncHandler } = require('../middleware/error');
const { Op } = require('sequelize');

/**
 * Get all messages for the authenticated user
 */
const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const offset = (page - 1) * limit;

  const where = { userId };
  if (unreadOnly === 'true') {
    where.isRead = false;
  }

  const { count, rows: messages } = await db.Message.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset,
  });

  res.json({
    success: true,
    messages: messages.map(m => ({
      id: m.id,
      type: m.type,
      title: m.title,
      content: m.content,
      isRead: m.isRead,
      metadata: m.metadata,
      actionUrl: m.actionUrl,
      createdAt: m.createdAt,
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit),
    },
  });
});

/**
 * Get unread message count
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const count = await db.Message.count({
    where: { userId, isRead: false },
  });

  res.json({
    success: true,
    count,
  });
});

/**
 * Mark a message as read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { messageId } = req.params;

  const message = await db.Message.findOne({
    where: { id: messageId, userId },
  });

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found',
    });
  }

  await message.update({ isRead: true });

  res.json({
    success: true,
    message: 'Message marked as read',
  });
});

/**
 * Mark all messages as read
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await db.Message.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );

  res.json({
    success: true,
    message: 'All messages marked as read',
  });
});

/**
 * Delete a message
 */
const deleteMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { messageId } = req.params;

  const message = await db.Message.findOne({
    where: { id: messageId, userId },
  });

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found',
    });
  }

  await message.destroy();

  res.json({
    success: true,
    message: 'Message deleted',
  });
});

/**
 * Create a notification message for a user
 * This is a helper function used internally by other controllers
 */
const createNotification = async (userId, type, title, content, metadata = {}, actionUrl = null) => {
  try {
    const message = await db.Message.create({
      userId,
      type,
      title,
      content,
      metadata,
      actionUrl,
      isRead: false,
    });
    return message;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Create order delivered notification with review reminder
 */
const createDeliveryNotification = async (order) => {
  try {
    // Get order items for product names
    const orderWithItems = await db.Order.findByPk(order.id, {
      include: [{
        model: db.OrderItem,
        as: 'orderItems',
        include: [{
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name', 'slug'],
        }],
      }],
    });

    if (!orderWithItems) return null;

    const productNames = orderWithItems.orderItems
      .map(item => item.product?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');

    const moreCount = orderWithItems.orderItems.length - 3;
    const productSummary = moreCount > 0 
      ? `${productNames} and ${moreCount} more` 
      : productNames;

    // Create delivery notification
    const deliveryMessage = await createNotification(
      order.userId,
      'order_delivered',
      '🎉 Your order has been delivered!',
      `Great news! Your order #${order.orderNumber} containing ${productSummary} has been successfully delivered. We hope you love your purchase!`,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        products: orderWithItems.orderItems.map(item => ({
          id: item.product?.id,
          name: item.product?.name,
          slug: item.product?.slug,
        })),
      },
      `/orders`
    );

    // Create review reminder notification
    const reviewMessage = await createNotification(
      order.userId,
      'review_reminder',
      '⭐ Share your feedback!',
      `How was your experience with your recent purchase? Your review helps other shoppers and helps us improve. Take a moment to rate and review your items from order #${order.orderNumber}.`,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        products: orderWithItems.orderItems.map(item => ({
          id: item.product?.id,
          name: item.product?.name,
          slug: item.product?.slug,
        })),
      },
      `/orders`
    );

    return { deliveryMessage, reviewMessage };
  } catch (error) {
    console.error('Error creating delivery notifications:', error);
    return null;
  }
};

/**
 * Create welcome notification for new users
 */
const createWelcomeNotification = async (userId, firstName) => {
  return createNotification(
    userId,
    'welcome',
    `Welcome to ATRIX, ${firstName}! 🎊`,
    `Thank you for joining ATRIX! We're excited to have you. Browse our collections, discover amazing deals, and enjoy a seamless shopping experience. Happy shopping!`,
    {},
    '/shop'
  );
};

/**
 * Create order confirmation notification
 */
const createOrderConfirmation = async (order) => {
  return createNotification(
    order.userId,
    'order_confirmed',
    '✅ Order Confirmed!',
    `Thank you for your order! Your order #${order.orderNumber} has been confirmed and is being processed. We'll notify you once it ships.`,
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
    },
    `/orders`
  );
};

/**
 * Create order shipped notification
 */
const createShippingNotification = async (order) => {
  return createNotification(
    order.userId,
    'order_shipped',
    '📦 Your order is on its way!',
    `Exciting news! Your order #${order.orderNumber} has been shipped and is on its way to you. Track your package to see its progress.`,
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
    `/orders`
  );
};

module.exports = {
  getMessages,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteMessage,
  createNotification,
  createDeliveryNotification,
  createWelcomeNotification,
  createOrderConfirmation,
  createShippingNotification,
};
