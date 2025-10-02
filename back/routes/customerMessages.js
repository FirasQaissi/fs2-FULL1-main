const express = require('express');
const { 
  createMessage, 
  getAllMessages, 
  getMessageById, 
  updateMessage, 
  deleteMessage 
} = require('../controllers/customerMessageController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public route - anyone can send a message
router.post('/', createMessage);

// Protected routes - only authenticated users can access
router.get('/', authMiddleware, getAllMessages);
router.get('/:id', authMiddleware, getMessageById);
router.put('/:id', authMiddleware, updateMessage);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
