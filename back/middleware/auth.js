const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_change_me');
    // Attach minimal user info including roles to the request
    const user = await User.findById(payload.userId)
      .select('_id isAdmin isBusiness isUser email name')
      .lean();
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = { id: String(user._id), isAdmin: !!user.isAdmin, isBusiness: !!user.isBusiness, isUser: !!user.isUser };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireRoles(...allowed) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const has = allowed.some((role) => {
      if (role === 'admin') return req.user.isAdmin;
      if (role === 'business') return req.user.isBusiness;
      if (role === 'user') return req.user.isUser;
      return false;
    });
    if (!has) return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
}

const requireAdmin = requireRoles('admin');

module.exports = { authMiddleware, requireRoles, requireAdmin };


