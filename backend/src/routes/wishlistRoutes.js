const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticateUser } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateUser);

// Get user's wishlist
router.get('/', wishlistController.getWishlist);

// Get wishlist count
router.get('/count', wishlistController.getWishlistCount);

// Check if product is in wishlist
router.get('/check/:productId', wishlistController.checkWishlist);

// Toggle wishlist (add/remove)
router.post('/toggle', wishlistController.toggleWishlist);

// Add to wishlist
router.post('/', wishlistController.addToWishlist);

// Remove from wishlist
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
