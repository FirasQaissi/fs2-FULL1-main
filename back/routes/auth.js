const express = require('express');
const passport = require('../config/passport');
const { login, register, me, logout, verifyPassword, forgotPassword, resetPassword, refresh, googleCallback } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authMiddleware, logout);
router.post('/verify-password', authMiddleware, verifyPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, me);
router.post('/refresh', refresh);

/// 2. OAuth routes
// Google OAuth - only if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/error',
      session: false
    }),
    googleCallback
  );
} else {
  // Fallback routes when OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables'
    });
  });

  router.get('/google/callback', (req, res) => {
    res.status(503).json({
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables'
    });
  });
}

module.exports = router;


