const { User } = require('../models');

async function listUsers(_req, res) {
  try {
    const users = await User.find()
      .select('_id name email phone isAdmin isBusiness isUser createdAt tempAdminExpiry lastLogin isOnline')
      .sort({ createdAt: -1 })
      .lean();
    
    // Check and clean up expired temp admin privileges
    const now = new Date();
    const updates = [];
    
    users.forEach(user => {
      if (user.tempAdminExpiry && user.tempAdminExpiry < now && user.isAdmin) {
        updates.push(
          User.findByIdAndUpdate(user._id, { 
            $set: { isAdmin: false },
            $unset: { tempAdminExpiry: 1 }
          })
        );
        user.isAdmin = false;
        user.tempAdminExpiry = null;
      }
    });
    
    if (updates.length > 0) {
      await Promise.all(updates);
    }
    
    return res.json(users);
  } catch (err) {
    console.error('List users error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const targetId = String(req.params.id);
    if (targetId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const deleted = await User.findByIdAndDelete(targetId).lean();
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateUser(req, res) {
  try {
    const targetId = String(req.params.id);
    const { name, email, phone, isAdmin, isBusiness, isUser } = req.body || {};

    console.log('📝 Update request received:', {
      targetId,
      name, email, phone, isAdmin, isBusiness, isUser,
      nameType: typeof name,
      emailType: typeof email,
      phoneType: typeof phone
    });

    if (targetId === req.user.id && isAdmin === false) {
      return res.status(400).json({ message: 'You cannot remove your own admin role' });
    }

    const update = {};
    
    // Validate and update name
    if (name !== undefined && name !== null) {
      const nameStr = String(name).trim();
      if (nameStr.length > 0) {
        update.name = nameStr;
      }
    }
    
    // Validate and update email
    if (email !== undefined && email !== null) {
      const emailStr = String(email).trim();
      if (emailStr.length > 0) {
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EMAIL_REGEX.test(emailStr)) {
          return res.status(400).json({ message: 'Invalid email format' });
        }
        
        const normalizedEmail = emailStr.toLowerCase();
        
        // Check if email is already in use by another user
        const existing = await User.findOne({ 
          email: normalizedEmail,
          _id: { $ne: targetId }
        }).lean();
        
        if (existing) {
          return res.status(409).json({ message: 'Email already in use' });
        }
        
        update.email = normalizedEmail;
      }
    }
    
    // Validate and update phone
    if (phone !== undefined && phone !== null) {
      const phoneStr = String(phone).trim();
      if (phoneStr.length > 0) {
        // Accept multiple Israeli phone formats
        const ISRAELI_PHONE_FORMATS = [
          /^05[0-9]{8}$/,        // 0501234567 (10 digits)
          /^05[0-9]-[0-9]{7}$/,  // 050-1234567 (with dash)
          /^05[0-9] [0-9]{7}$/,  // 050 1234567 (with space)
        ];
        
        const isValidPhone = ISRAELI_PHONE_FORMATS.some(regex => regex.test(phoneStr));
        
        if (!isValidPhone) {
          console.log('❌ Phone validation failed:', phoneStr);
          return res.status(400).json({ message: 'Phone must be a valid Israeli mobile number (format: 05XXXXXXXX)' });
        }
        
        // Normalize phone to standard format (remove spaces and dashes)
        const normalizedPhone = phoneStr.replace(/[\s-]/g, '');
        update.phone = normalizedPhone;
      } else {
        // Allow empty phone
        update.phone = '';
      }
    }
    
    // Update role flags
    if (typeof isAdmin === 'boolean') update.isAdmin = isAdmin;
    if (typeof isBusiness === 'boolean') update.isBusiness = isBusiness;
    if (typeof isUser === 'boolean') update.isUser = isUser;

    console.log('📝 Final update object:', update);

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updated = await User.findByIdAndUpdate(
      targetId,
      { $set: update },
      { new: true, runValidators: true, fields: '_id name email phone isAdmin isBusiness isUser createdAt tempAdminExpiry lastLogin isOnline' }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ USER UPDATED:', {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      isAdmin: updated.isAdmin,
      isBusiness: updated.isBusiness
    });
    console.log('Update payload was:', update);

    return res.json(updated);
  } catch (err) {
    console.error('Update user error', err);
    console.error('Request body:', req.body);
    console.error('Target ID:', req.params.id);
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
}

async function promoteToBusinessAccount(req, res) {
  try {
    const targetId = String(req.params.id);
    
    const updated = await User.findByIdAndUpdate(
      targetId,
      { $set: { isBusiness: true } },
      { new: true, runValidators: true, fields: '_id name email isAdmin isBusiness isUser createdAt tempAdminExpiry' }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updated);
  } catch (err) {
    console.error('Promote to business error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function assignTempAdminPrivileges(req, res) {
  try {
    const targetId = String(req.params.id);
    const { duration } = req.body || {};
    
    if (!duration || !['1day', '1week', '1month'].includes(duration)) {
      return res.status(400).json({ message: 'Invalid duration. Must be 1day, 1week, or 1month' });
    }

    const now = new Date();
    let expiry;
    
    switch (duration) {
      case '1day':
        expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case '1week':
        expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const updated = await User.findByIdAndUpdate(
      targetId,
      { 
        $set: { 
          isAdmin: true,
          tempAdminExpiry: expiry
        }
      },
      { new: true, runValidators: true, fields: '_id name email isAdmin isBusiness isUser createdAt tempAdminExpiry' }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updated);
  } catch (err) {
    console.error('Assign temp admin error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, phone, isAdmin, isBusiness, isUser } = req.body || {};
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const { hashPassword } = require('../utils/hash');
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX = /^(?=.*[!@%$#^&*\-_]).{8,}$/;
    const ISRAELI_PHONE_REGEX = /^05[0-9]{8}$/;

    if (!EMAIL_REGEX.test(String(email))) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!PASSWORD_REGEX.test(String(password))) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include a special character' });
    }
    if (phone && !ISRAELI_PHONE_REGEX.test(String(phone))) {
      return res.status(400).json({ message: 'Phone must be a valid Israeli mobile number (05XXXXXXXX)' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPhone = phone ? String(phone).trim() : '';
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await hashPassword(String(password));
    const created = await User.create({ 
      name, 
      email: normalizedEmail,
      phone: normalizedPhone, 
      passwordHash, 
      isAdmin: !!isAdmin,
      isBusiness: !!isBusiness,
      isUser: isUser !== false
    });

    console.log('✅ ADMIN CREATED USER:', {
      _id: created._id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      isAdmin: created.isAdmin,
      isBusiness: created.isBusiness
    });

    const user = await User.findById(created._id)
      .select('_id name email phone isAdmin isBusiness isUser createdAt tempAdminExpiry lastLogin isOnline')
      .lean();

    return res.status(201).json(user);
  } catch (err) {
    console.error('Create user error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { 
  listUsers, 
  deleteUser, 
  updateUser, 
  promoteToBusinessAccount, 
  assignTempAdminPrivileges,
  createUser
};


