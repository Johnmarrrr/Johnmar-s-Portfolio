const express = require('express');
const router = express.Router();
const { getMessages, createMessage, updateMessageStatus, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMessages)
  .post(createMessage);

router.route('/:id')
  .put(protect, updateMessageStatus)
  .delete(protect, deleteMessage);

module.exports = router;
