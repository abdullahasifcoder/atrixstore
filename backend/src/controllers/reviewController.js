const db = require('../models');
const { asyncHandler } = require('../middleware/error');
const { Op } = require('sequelize');

// Get reviews for a product
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, sort = 'recent', rating } = req.query;

  const offset = (page - 1) * limit;

  let order = [['createdAt', 'DESC']];
  if (sort === 'helpful') order = [['helpfulCount', 'DESC']];
  if (sort === 'highest') order = [['rating', 'DESC']];
  if (sort === 'lowest') order = [['rating', 'ASC']];

  const where = { productId, isApproved: true };
  if (rating) where.rating = parseInt(rating);

  const { count, rows: reviews } = await db.Review.findAndCountAll({
    where,
    include: [{
      model: db.User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName']
    }],
    order,
    limit: parseInt(limit),
    offset
  });

  // Get rating distribution
  const ratingStats = await db.Review.findAll({
    where: { productId, isApproved: true },
    attributes: [
      'rating',
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
    ],
    group: ['rating'],
    raw: true
  });

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingStats.forEach(stat => {
    distribution[stat.rating] = parseInt(stat.count);
  });

  const totalReviews = Object.values(distribution).reduce((a, b) => a + b, 0);
  const avgRating = totalReviews > 0 
    ? Object.entries(distribution).reduce((sum, [r, c]) => sum + (parseInt(r) * c), 0) / totalReviews 
    : 0;

  res.json({
    success: true,
    reviews: reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      isVerifiedPurchase: r.isVerifiedPurchase,
      helpfulCount: r.helpfulCount,
      images: r.images,
      adminResponse: r.adminResponse,
      adminResponseAt: r.adminResponseAt,
      createdAt: r.createdAt,
      user: {
        name: `${r.user?.firstName || ''} ${r.user?.lastName?.charAt(0) || ''}.`,
      }
    })),
    stats: {
      total: totalReviews,
      average: avgRating.toFixed(1),
      distribution
    },
    pagination: {
      current: parseInt(page),
      total: Math.ceil(count / limit),
      hasMore: offset + reviews.length < count
    }
  });
});

// Check if user can review a product (must have purchased and received)
const canReviewProduct = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  // Check if user already reviewed this product
  const existingReview = await db.Review.findOne({
    where: { userId, productId }
  });

  if (existingReview) {
    return res.json({
      success: true,
      canReview: false,
      reason: 'already_reviewed',
      existingReview: {
        id: existingReview.id,
        rating: existingReview.rating,
        title: existingReview.title,
        comment: existingReview.comment
      }
    });
  }

  // Check if user has a delivered order containing this product
  const deliveredOrder = await db.Order.findOne({
    where: { 
      userId, 
      status: 'delivered',
      paymentStatus: 'paid'
    },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      where: { productId },
      required: true
    }]
  });

  res.json({
    success: true,
    canReview: !!deliveredOrder,
    isVerifiedPurchase: !!deliveredOrder,
    orderId: deliveredOrder?.id,
    reason: deliveredOrder ? null : 'not_purchased'
  });
});

// Create a review
const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, title, comment, images } = req.body;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  // Check if user already reviewed
  const existingReview = await db.Review.findOne({
    where: { userId, productId }
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product'
    });
  }

  // Check for verified purchase - MUST have a delivered order to review
  const deliveredOrder = await db.Order.findOne({
    where: { 
      userId, 
      status: 'delivered',
      paymentStatus: 'paid'
    },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      where: { productId },
      required: true
    }]
  });

  // Only allow reviews from customers who have received the product
  if (!deliveredOrder) {
    return res.status(403).json({
      success: false,
      message: 'You can only review products from orders that have been delivered'
    });
  }

  const review = await db.Review.create({
    userId,
    productId,
    orderId: deliveredOrder.id,
    rating,
    title: title || null,
    comment: comment || null,
    isVerifiedPurchase: true, // Always true since we require delivered order
    images: images || []
  });

  // Update product average rating
  const stats = await db.Review.findAll({
    where: { productId, isApproved: true },
    attributes: [
      [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'avgRating'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'reviewCount']
    ],
    raw: true
  });

  await db.Product.update(
    { 
      rating: parseFloat(stats[0].avgRating || 0).toFixed(2),
      reviewCount: parseInt(stats[0].reviewCount || 0)
    },
    { where: { id: productId } }
  );

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    review: {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerifiedPurchase: review.isVerifiedPurchase
    }
  });
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await db.Review.findOne({
    where: { id: reviewId, userId }
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found or you do not have permission to edit it'
    });
  }

  await review.update({
    rating: rating || review.rating,
    title: title !== undefined ? title : review.title,
    comment: comment !== undefined ? comment : review.comment
  });

  // Update product average rating
  const stats = await db.Review.findAll({
    where: { productId: review.productId, isApproved: true },
    attributes: [
      [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'avgRating'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'reviewCount']
    ],
    raw: true
  });

  await db.Product.update(
    { 
      rating: parseFloat(stats[0].avgRating || 0).toFixed(2),
      reviewCount: parseInt(stats[0].reviewCount || 0)
    },
    { where: { id: review.productId } }
  );

  res.json({
    success: true,
    message: 'Review updated successfully',
    review
  });
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;

  const review = await db.Review.findOne({
    where: { id: reviewId, userId }
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found or you do not have permission to delete it'
    });
  }

  const productId = review.productId;
  await review.destroy();

  // Update product average rating
  const stats = await db.Review.findAll({
    where: { productId, isApproved: true },
    attributes: [
      [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'avgRating'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'reviewCount']
    ],
    raw: true
  });

  await db.Product.update(
    { 
      rating: parseFloat(stats[0].avgRating || 0).toFixed(2),
      reviewCount: parseInt(stats[0].reviewCount || 0)
    },
    { where: { id: productId } }
  );

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// Mark review as helpful
const markHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await db.Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  await review.increment('helpfulCount');

  res.json({
    success: true,
    helpfulCount: review.helpfulCount + 1
  });
});

// Get user's reviews
const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const reviews = await db.Review.findAll({
    where: { userId },
    include: [{
      model: db.Product,
      as: 'product',
      attributes: ['id', 'name', 'slug', 'imageUrl']
    }],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    reviews
  });
});

// Get products awaiting review (delivered but not yet reviewed)
const getPendingReviews = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get all delivered orders with their items
  const deliveredOrders = await db.Order.findAll({
    where: { 
      userId, 
      status: 'delivered',
      paymentStatus: 'paid'
    },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      include: [{
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug', 'imageUrl']
      }]
    }],
    order: [['updatedAt', 'DESC']]
  });

  // Get user's existing reviews
  const existingReviews = await db.Review.findAll({
    where: { userId },
    attributes: ['productId'],
    raw: true
  });
  const reviewedProductIds = new Set(existingReviews.map(r => r.productId));

  // Find products that haven't been reviewed yet
  const pendingProducts = [];
  deliveredOrders.forEach(order => {
    order.orderItems.forEach(item => {
      if (!reviewedProductIds.has(item.productId) && item.product) {
        pendingProducts.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          deliveredAt: order.updatedAt,
          product: item.product
        });
      }
    });
  });

  // Remove duplicates (same product in multiple orders)
  const uniqueProducts = pendingProducts.filter((item, index, self) =>
    index === self.findIndex(t => t.product.id === item.product.id)
  );

  res.json({
    success: true,
    pendingReviews: uniqueProducts,
    count: uniqueProducts.length
  });
});

// ADMIN: Get all reviews with filters
const adminGetReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, approved, productId, rating } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (approved !== undefined) where.isApproved = approved === 'true';
  if (productId) where.productId = productId;
  if (rating) where.rating = parseInt(rating);

  const { count, rows: reviews } = await db.Review.findAndCountAll({
    where,
    include: [
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      },
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset
  });

  res.json({
    success: true,
    reviews,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(count / limit),
      count
    }
  });
});

// ADMIN: Approve/Reject review
const adminUpdateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { isApproved, adminResponse } = req.body;

  const review = await db.Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  const updates = {};
  if (isApproved !== undefined) updates.isApproved = isApproved;
  if (adminResponse !== undefined) {
    updates.adminResponse = adminResponse;
    updates.adminResponseAt = new Date();
  }

  await review.update(updates);

  // Update product average rating
  const stats = await db.Review.findAll({
    where: { productId: review.productId, isApproved: true },
    attributes: [
      [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'avgRating'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'reviewCount']
    ],
    raw: true
  });

  await db.Product.update(
    { 
      rating: parseFloat(stats[0].avgRating || 0).toFixed(2),
      reviewCount: parseInt(stats[0].reviewCount || 0)
    },
    { where: { id: review.productId } }
  );

  res.json({
    success: true,
    message: 'Review updated successfully',
    review
  });
});

// ADMIN: Delete review
const adminDeleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await db.Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  const productId = review.productId;
  await review.destroy();

  // Update product average rating
  const stats = await db.Review.findAll({
    where: { productId, isApproved: true },
    attributes: [
      [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'avgRating'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'reviewCount']
    ],
    raw: true
  });

  await db.Product.update(
    { 
      rating: parseFloat(stats[0].avgRating || 0).toFixed(2),
      reviewCount: parseInt(stats[0].reviewCount || 0)
    },
    { where: { id: productId } }
  );

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

module.exports = {
  getProductReviews,
  canReviewProduct,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getUserReviews,
  getPendingReviews,
  adminGetReviews,
  adminUpdateReview,
  adminDeleteReview
};
