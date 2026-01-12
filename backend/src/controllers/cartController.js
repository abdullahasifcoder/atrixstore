const db = require('../models');
const { asyncHandler } = require('../middleware/error');

const getCart = asyncHandler(async (req, res) => {
  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product',
      attributes: ['id', 'name', 'slug', 'price', 'stock', 'imageUrl', 'isActive'],
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    }],
    order: [['createdAt', 'DESC']]
  });

  let subtotal = 0;
  const items = cartItems.map(item => {
    const itemTotal = parseFloat(item.product.price) * item.quantity;
    subtotal += itemTotal;
    return {
      ...item.toJSON(),
      itemTotal: itemTotal.toFixed(2)
    };
  });

  res.json({
    success: true,
    cart: {
      items,
      subtotal: subtotal.toFixed(2),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await db.Product.findOne({
    where: { id: productId, isActive: true }
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found or unavailable'
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} items available in stock`
    });
  }

  let cartItem = await db.CartItem.findOne({
    where: { userId: req.user.id, productId }
  });

  if (cartItem) {

    const newQuantity = cartItem.quantity + quantity;

    if (product.stock < newQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    await cartItem.update({ quantity: newQuantity });
  } else {

    cartItem = await db.CartItem.create({
      userId: req.user.id,
      productId,
      quantity
    });
  }

  const updatedCartItem = await db.CartItem.findByPk(cartItem.id, {
    include: [{
      model: db.Product,
      as: 'product',
      attributes: ['id', 'name', 'price', 'imageUrl']
    }]
  });

  res.status(201).json({
    success: true,
    message: 'Product added to cart',
    cartItem: updatedCartItem
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cartItem = await db.CartItem.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product'
    }]
  });

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found'
    });
  }

  if (cartItem.product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${cartItem.product.stock} items available in stock`
    });
  }

  await cartItem.update({ quantity });

  res.json({
    success: true,
    message: 'Cart item updated',
    cartItem
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cartItem = await db.CartItem.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found'
    });
  }

  await cartItem.destroy();

  res.json({
    success: true,
    message: 'Item removed from cart'
  });
});

const clearCart = asyncHandler(async (req, res) => {
  await db.CartItem.destroy({
    where: { userId: req.user.id }
  });

  res.json({
    success: true,
    message: 'Cart cleared'
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
