const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (authentication + admin role required)
router.post('/', authMiddleware, requireAdmin, createProduct);
router.put('/:id', authMiddleware, requireAdmin, updateProduct);
router.delete('/:id', authMiddleware, requireAdmin, deleteProduct);

module.exports = router;
