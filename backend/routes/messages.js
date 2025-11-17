const express = require('express');
const router = express.Router();
const {
  getMessages,
  getConversations,
  createMessage,
  markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/', protect, getMessages);
router.post('/', protect, createMessage);
router.put('/:id/read', protect, markAsRead);

module.exports = router;

