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

// OAuth error handler
router.get('/error', (req, res) => {
  res.status(401).send(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: "OAUTH_ERROR", error: "Authentication failed" }, "*");
            window.close();
          } else {
            window.location.href = '${process.env.FRONTEND_URL || 'https://smartgate-frontend.vercel.app'}/login?error=oauth_failed';
          }
        </script>
      </body>
    </html>
  `);
});

// OAuth configuration test endpoint
router.get('/config', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // BACKEND (Render)
  const backendUrl = process.env.BACKEND_URL || (isProduction
    ? 'https://smartgate-backend.onrender.com'
    : 'http://localhost:4000');

  // FRONTEND (Vercel)
  const frontendUrl = process.env.FRONTEND_URL || (isProduction
    ? 'https://smartgate-frontend.vercel.app'
    : 'http://localhost:5173');

  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${backendUrl}/api/auth/google/callback`;

  res.json({
    environment: process.env.NODE_ENV || 'development',
    backendUrl,
    callbackUrl,
    hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    frontendUrl
  });
});


/// 2. OAuth routes
// Google OAuth - only if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: true
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/auth/error',
      session: true
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


