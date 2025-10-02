const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { 
  addToFavorites, 
  removeFromFavorites, 
  getFavorites,
  isFavorite
} = require('../controllers/favoritesController');

// All routes under /api/favorites require auth
router.use(authMiddleware);

// Favorites management
router.get('/', getFavorites);
router.post('/', addToFavorites);
router.delete('/:productId', removeFromFavorites);
router.get('/:productId/check', isFavorite);

module.exports = router;
