const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { 
  getProfile, 
  updateProfile, 
  changePassword 
} = require('../controllers/userController');

// All routes under /api/user require auth
router.use(authMiddleware);

// User profile management
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/change-password', changePassword);

module.exports = router;
