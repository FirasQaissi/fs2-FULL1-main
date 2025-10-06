const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const {
  login,
  register,
  me,
  logout,
  verifyPassword,
  forgotPassword,
  resetPassword,
  refresh
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://smartgate-kohl.vercel.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://smartgate-backend.onrender.com';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

/* ===============================
   BASIC AUTH ROUTES
================================ */
router.post('/login', login);
router.post('/register', register);
router.post('/logout', authMiddleware, logout);
router.post('/verify-password', authMiddleware, verifyPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, me);
router.post('/refresh', refresh);

/* ===============================
   OAUTH ERROR HANDLER
================================ */
router.get('/error', (req, res) => {
  res.status(401).send(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: "OAUTH_ERROR", error: "Authentication failed" }, "*");
            window.close();
          } else {
            window.location.href = '${FRONTEND_URL}/login?error=oauth_failed';
          }
        </script>
      </body>
    </html>
  `);
});

/* ===============================
   DEBUG CONFIG ENDPOINT
================================ */
router.get('/config', (req, res) => {
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${BACKEND_URL}/api/auth/google/callback`;
  res.json({
    environment: process.env.NODE_ENV || 'development',
    backendUrl: BACKEND_URL,
    callbackUrl,
    hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    frontendUrl: FRONTEND_URL
  });
});

/* ===============================
   GOOGLE OAUTH ROUTES
================================ */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // 🔹 1. התחלת ההתחברות עם Google
  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: true
    })
  );

  // 🔹 2. Callback - כאן מתקבל המשתמש
  router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/auth/error',
      session: true
    }),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) {
          return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
        }

        // צור JWT עם תוקף 7 ימים
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        // הפנה חזרה לפרונט עם ה-token
        const redirectUrl = `${FRONTEND_URL}/auth/callback?token=${token}`;
        console.log('✅ Redirecting user to:', redirectUrl);

        return res.redirect(redirectUrl);
      } catch (error) {
        console.error('❌ Google OAuth callback error:', error);
        return res.redirect(`${FRONTEND_URL}/login?error=server`);
      }
    }
  );
} else {
  // במידה ואין OAuth מוגדר
  router.get('/google', (req, res) => {
    res.status(503).json({
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment'
    });
  });

  router.get('/google/callback', (req, res) => {
    res.status(503).json({
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment'
    });
  });
}

module.exports = router;
