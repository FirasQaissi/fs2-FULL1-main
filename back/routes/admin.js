const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { 
  listUsers, 
  deleteUser, 
  updateUser, 
  promoteToBusinessAccount, 
  assignTempAdminPrivileges,
  createUser
} = require('../controllers/adminController');
const { getDashboardStats } = require('../controllers/dashboardController');

// All routes under /api/admin require auth + admin
router.use(authMiddleware, requireAdmin);

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Users management
router.get('/users', listUsers);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/promote-business', promoteToBusinessAccount);
router.patch('/users/:id/temp-admin', assignTempAdminPrivileges);

module.exports = router;


