const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/hash');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[!@%$#^&*\-_]).{8,}$/;

async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .select('_id name email phone isAdmin isBusiness isUser createdAt tempAdminExpiry')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if temp admin has expired
    if (user.tempAdminExpiry && user.tempAdminExpiry < new Date() && user.isAdmin) {
      await User.findByIdAndUpdate(userId, { 
        $set: { isAdmin: false },
        $unset: { tempAdminExpiry: 1 }
      });
      user.isAdmin = false;
      user.tempAdminExpiry = null;
    }

    return res.json({ user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: !!user.isAdmin, isBusiness: !!user.isBusiness, isUser: user.isUser !== false } });
  } catch (err) {
    console.error('Get profile error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body || {};
    
    const update = {};
    
    if (name && typeof name === 'string') {
      update.name = name.trim();
    }
    
    if (email && typeof email === 'string') {
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if email is already in use by another user
      const existing = await User.findOne({ 
        email: normalizedEmail,
        _id: { $ne: userId }
      }).lean();
      
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      
      update.email = normalizedEmail;
    }

    if (phone && typeof phone === 'string') {
      const ISRAELI_PHONE_REGEX = /^05[0-9]{8}$/;
      if (!ISRAELI_PHONE_REGEX.test(phone)) {
        return res.status(400).json({ message: 'Phone must be a valid Israeli mobile number (05XXXXXXXX)' });
      }
      update.phone = phone.trim();
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true }
    ).select('_id name email phone isAdmin isBusiness isUser createdAt tempAdminExpiry').lean();

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: updated });
  } catch (err) {
    console.error('Update profile error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body || {};
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (!PASSWORD_REGEX.test(String(newPassword))) {
      return res.status(400).json({ 
        message: 'New password must be at least 8 characters and include a special character' 
      });
    }

    const user = await User.findById(userId).select('passwordHash').lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCurrentPasswordValid = await comparePassword(String(currentPassword), user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const newPasswordHash = await hashPassword(String(newPassword));
    
    await User.findByIdAndUpdate(userId, { 
      $set: { passwordHash: newPasswordHash }
    });

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
