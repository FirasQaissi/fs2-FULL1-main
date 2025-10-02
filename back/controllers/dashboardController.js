const { User, Product } = require('../models');

async function getDashboardStats(req, res) {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total products count
    const totalProducts = await Product.countDocuments();
    
    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get admin users count
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    // Get business users count
    const businessUsers = await User.countDocuments({ isBusiness: true });
    
    // Generate random orders for today (5-15 as requested)
    const ordersToday = Math.floor(Math.random() * 11) + 5;
    
    const stats = {
      totalUsers,
      totalProducts,
      ordersToday,
      recentUsers,
      adminUsers,
      businessUsers,
    };
    
    return res.json(stats);
  } catch (err) {
    console.error('Dashboard stats error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getDashboardStats };
