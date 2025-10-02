const { User } = require('../models');

async function addToFavorites(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: productId } },
      { new: true }
    ).select('favorites').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ favorites: user.favorites });
  } catch (err) {
    console.error('Add to favorites error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function removeFromFavorites(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: productId } },
      { new: true }
    ).select('favorites').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ favorites: user.favorites });
  } catch (err) {
    console.error('Remove from favorites error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getFavorites(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('favorites')
      .populate('favorites')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ favorites: user.favorites || [] });
  } catch (err) {
    console.error('Get favorites error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function isFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId).select('favorites').lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFav = user.favorites && user.favorites.includes(productId);
    return res.json({ isFavorite: isFav });
  } catch (err) {
    console.error('Check favorite error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isFavorite
};
