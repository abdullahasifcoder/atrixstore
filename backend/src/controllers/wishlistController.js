const db = require('../models');
const { asyncHandler } = require('../middleware/error');

// Get user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlistItems = await db.Wishlist.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product',
      where: { isActive: true },
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }]
    }],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    wishlist: wishlistItems
  });
});

// Add product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Check if product exists
  const product = await db.Product.findOne({
    where: { id: productId, isActive: true }
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if already in wishlist
  const existing = await db.Wishlist.findOne({
    where: {
      userId: req.user.id,
      productId
    }
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Product already in wishlist'
    });
  }

  // Add to wishlist
  const wishlistItem = await db.Wishlist.create({
    userId: req.user.id,
    productId
  });

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    wishlistItem
  });
});

// Remove product from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const deleted = await db.Wishlist.destroy({
    where: {
      userId: req.user.id,
      productId
    }
  });

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Product not found in wishlist'
    });
  }

  res.json({
    success: true,
    message: 'Product removed from wishlist'
  });
});

// Toggle wishlist (add if not exists, remove if exists)
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Check if product exists
  const product = await db.Product.findOne({
    where: { id: productId, isActive: true }
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if already in wishlist
  const existing = await db.Wishlist.findOne({
    where: {
      userId: req.user.id,
      productId
    }
  });

  if (existing) {
    // Remove from wishlist
    await existing.destroy();
    return res.json({
      success: true,
      action: 'removed',
      message: 'Product removed from wishlist'
    });
  }

  // Add to wishlist
  await db.Wishlist.create({
    userId: req.user.id,
    productId
  });

  res.json({
    success: true,
    action: 'added',
    message: 'Product added to wishlist'
  });
});

// Check if product is in wishlist
const checkWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const exists = await db.Wishlist.findOne({
    where: {
      userId: req.user.id,
      productId
    }
  });

  res.json({
    success: true,
    inWishlist: !!exists
  });
});

// Get wishlist count
const getWishlistCount = asyncHandler(async (req, res) => {
  const count = await db.Wishlist.count({
    where: { userId: req.user.id }
  });

  res.json({
    success: true,
    count
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  checkWishlist,
  getWishlistCount
};
