const { User } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { hashPassword, comparePassword } = require('../utils/hash');
const logger = require('../utils/winstonLogger');
const emailService = require('../utils/emailService');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

// Helper function to get frontend URL based on environment
function getFrontendUrl() {
  const isProduction = process.env.NODE_ENV === 'production';
  return process.env.FRONTEND_URL || (isProduction
    ? 'https://smartgate-kohl.vercel.app'
    : 'http://localhost:5173');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[!@%$#^&*\-_]).{8,}$/;
const ISRAELI_PHONE_REGEX = /^05[0-9]{8}$/;


async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!EMAIL_REGEX.test(String(email))) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).lean();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await comparePassword(String(password), user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update user login status
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      isOnline: true
    });

    // Log user login
    logger.userLogin(user._id, user.email, req.ip);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '60m' });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: !!user.isAdmin,
      isBusiness: !!user.isBusiness,
      isUser: user.isUser !== false,
    };

    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, phone, isBusiness } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
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
    const created = await User.create({ name, email: normalizedEmail, phone: normalizedPhone, passwordHash, isBusiness: !!isBusiness });
    console.log('✅ USER CREATED:', {
      _id: created._id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      isAdmin: created.isAdmin,
      isBusiness: created.isBusiness
    });
    
    // Log user registration
    logger.userRegister(created._id, created.email);
    
    const token = jwt.sign({ userId: created._id }, JWT_SECRET, { expiresIn: '10m' });
    return res.status(201).json({ user: { _id: created._id, name: created.name, email: created.email, phone: created.phone, isAdmin: !!created.isAdmin, isBusiness: !!created.isBusiness, isUser: created.isUser !== false }, token });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json({ user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: !!user.isAdmin, isBusiness: !!user.isBusiness, isUser: user.isUser !== false } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function logout(req, res) {
  try {
    // If user is authenticated, mark them as offline
    if (req.user && req.user.id) {
      await User.findByIdAndUpdate(req.user.id, {
        isOnline: false
      });
      
      // Log user logout
      const user = await User.findById(req.user.id).select('email').lean();
      if (user) {
        logger.userLogout(req.user.id, user.email);
      }
    }
    // For stateless JWT, logout is handled client-side by discarding the token
    return res.json({ ok: true });
  } catch (error) {
    // Don't fail logout if we can't update status
    return res.json({ ok: true });
  }
}

// Issue a new short-lived token by decoding the provided (possibly expired) token
async function refresh(req, res) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(400).json({ message: 'Missing token' });
    }

    // Decode without verifying expiration
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Ensure user still exists
    const user = await User.findById(decoded.userId).select('_id').lean();
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Optionally, you could enforce a grace period here
    const newToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '60m' });
    return res.json({ token: newToken });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function verifyPassword(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).lean();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await comparePassword(String(password), user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Password verification error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body || {};
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!EMAIL_REGEX.test(String(email))) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).lean();
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);
      
      // Log password reset request
      logger.securityEvent('PASSWORD_RESET_REQUESTED', user._id, {
        email: user.email,
        ip: req.ip
      });

      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      
      // Clear the reset token if email failed
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

      return res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again later.' 
      });
    }

  } catch (err) {
    console.error('Forgot password error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body || {};
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (!PASSWORD_REGEX.test(String(newPassword))) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters and include a special character' 
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: String(token),
      resetPasswordExpires: { $gt: new Date() }
    }).lean();

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(String(newPassword));

    // Update user password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    // Log password reset completion
    logger.securityEvent('PASSWORD_RESET_COMPLETED', user._id, {
      email: user.email,
      ip: req.ip
    });

    return res.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });

  } catch (err) {
    console.error('Reset password error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  login,
  register,
  me,
  logout,
  verifyPassword,
  forgotPassword,
  resetPassword,
  refresh,
};

