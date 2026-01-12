const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');
const { authenticateAdmin } = require('../middleware/auth');
const { loginValidation, productValidation, categoryValidation, idValidation, orderStatusValidation } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimit');

router.post('/auth/login', authLimiter, loginValidation, adminController.adminLogin);

router.post('/auth/logout', authenticateAdmin, adminController.adminLogout);
router.get('/auth/me', authenticateAdmin, adminController.getAdminProfile);
router.get('/dashboard/stats', authenticateAdmin, adminController.getDashboardStats);

router.get('/products', authenticateAdmin, productController.getProducts);
router.get('/products/:id', authenticateAdmin, idValidation, productController.getProductById);
router.post('/products', authenticateAdmin, productValidation, productController.createProduct);
router.put('/products/:id', authenticateAdmin, idValidation, productValidation, productController.updateProduct);
router.delete('/products/:id', authenticateAdmin, idValidation, productController.deleteProduct);

router.get('/categories', authenticateAdmin, categoryController.getCategories);
router.get('/categories/:id', authenticateAdmin, idValidation, categoryController.getCategoryById);
router.post('/categories', authenticateAdmin, categoryValidation, categoryController.createCategory);
router.put('/categories/:id', authenticateAdmin, idValidation, categoryValidation, categoryController.updateCategory);
router.delete('/categories/:id', authenticateAdmin, idValidation, categoryController.deleteCategory);

router.get('/orders', authenticateAdmin, orderController.getAllOrders);
router.get('/orders/:id', authenticateAdmin, idValidation, orderController.getOrderById);
router.put('/orders/:id/status', authenticateAdmin, idValidation, orderStatusValidation, orderController.updateOrderStatus);

// Reviews management
router.get('/reviews', authenticateAdmin, reviewController.adminGetReviews);
router.put('/reviews/:reviewId', authenticateAdmin, reviewController.adminUpdateReview);
router.delete('/reviews/:reviewId', authenticateAdmin, reviewController.adminDeleteReview);

module.exports = router;
