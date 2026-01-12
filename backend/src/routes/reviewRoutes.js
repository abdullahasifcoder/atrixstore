const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);
router.post('/:reviewId/helpful', reviewController.markHelpful);

// Protected routes (require authentication)
router.get('/can-review/:productId', authenticateUser, reviewController.canReviewProduct);
router.post('/', authenticateUser, reviewController.createReview);
router.put('/:reviewId', authenticateUser, reviewController.updateReview);
router.delete('/:reviewId', authenticateUser, reviewController.deleteReview);
router.get('/my-reviews', authenticateUser, reviewController.getUserReviews);
router.get('/pending', authenticateUser, reviewController.getPendingReviews);

module.exports = router;
