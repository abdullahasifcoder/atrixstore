const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateUser } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateUser);

// Get user's messages
router.get('/', messageController.getMessages);

// Get unread count
router.get('/unread-count', messageController.getUnreadCount);

// Mark all as read
router.put('/mark-all-read', messageController.markAllAsRead);

// Mark single message as read
router.put('/:messageId/read', messageController.markAsRead);

// Delete a message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
