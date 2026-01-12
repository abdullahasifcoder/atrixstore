const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../middleware/auth');
const { cartItemValidation, idValidation } = require('../utils/validators');
const { body } = require('express-validator');

const updateCartValidation = [
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

router.get('/', authenticateUser, cartController.getCart);
router.post('/', authenticateUser, cartItemValidation, cartController.addToCart);
router.put('/:id', authenticateUser, idValidation, updateCartValidation, cartController.updateCartItem);
router.delete('/:id', authenticateUser, idValidation, cartController.removeFromCart);
router.delete('/', authenticateUser, cartController.clearCart);

module.exports = router;
