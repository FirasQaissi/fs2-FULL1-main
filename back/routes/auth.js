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
  router.get('/google', (req, res, next) => {
    // ✅ Log the origin that initiated the OAuth flow
    const origin = req.get('referer') || req.get('origin') || FRONTEND_URL;
    console.log('🔵 OAuth initiated from origin:', origin);
    
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false
    })(req, res, next);
  });

  // 🔹 2. Callback - כאן מתקבל המשתמש
  router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/auth/error',
      session: false  // ✅ Use stateless JWT, not sessions
    }),
    async (req, res) => {
      try {
        // ✅ Determine the frontend origin from referer or use default
        let frontendOrigin = FRONTEND_URL;
        
        // Try to get origin from referer header (set by the popup opener)
        const referer = req.get('referer');
        if (referer) {
          try {
            const refererUrl = new URL(referer);
            // If referer is from Vercel, use it
            if (refererUrl.hostname.includes('vercel.app')) {
              frontendOrigin = refererUrl.origin;
              console.log('🔵 Using Vercel origin from referer:', frontendOrigin);
            }
          } catch (e) {
            console.log('Could not parse referer, using default');
          }
        }

        console.log('🔵 OAuth callback - will message origin:', frontendOrigin);

        const user = req.user;
        if (!user) {
          return res.send(`
            <html>
              <body>
                <script>
                  if (window.opener) {
                    window.opener.postMessage({ type: "OAUTH_ERROR", error: "Authentication failed" }, "${frontendOrigin}");
                    setTimeout(function() { window.close(); }, 100);
                  } else {
                    window.location.href = '${frontendOrigin}/login?error=no_user';
                  }
                </script>
              </body>
            </html>
          `);
        }

        // Update user login status
        await require('../models').User.findByIdAndUpdate(user._id, {
          lastLogin: new Date(),
          isOnline: true
        });

        // ✅ Create JWT with consistent payload (userId, not id)
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '10m' });

        const safeUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          isAdmin: !!user.isAdmin,
          isBusiness: !!user.isBusiness,
          isUser: user.isUser !== false,
        };

        // ✅ Send to frontend via window.opener.postMessage to the EXACT origin
        console.log('✅ Sending OAuth success to frontend popup at:', frontendOrigin);
        return res.send(`
          <html>
            <body>
              <h3 style="text-align:center; margin-top:50px;">✅ Login Successful!</h3>
              <p style="text-align:center;">Closing window...</p>
              <script>
                console.log('OAuth callback page loaded');
                console.log('window.opener exists:', !!window.opener);
                console.log('Target origin:', '${frontendOrigin}');
                
                if (window.opener) {
                  try {
                    console.log('Sending postMessage to opener...');
                    window.opener.postMessage({
                      type: 'OAUTH_SUCCESS',
                      token: '${token}',
                      user: ${JSON.stringify(safeUser)}
                    }, '${frontendOrigin}');
                    console.log('Message sent successfully');
                    setTimeout(function() { 
                      console.log('Closing popup...');
                      window.close(); 
                    }, 500);
                  } catch (e) {
                    console.error('Error sending message:', e);
                    window.location.href = '${frontendOrigin}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(safeUser))}';
                  }
                } else {
                  console.log('No window.opener, redirecting...');
                  window.location.href = '${frontendOrigin}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(safeUser))}';
                }
              </script>
            </body>
          </html>
        `);
      } catch (error) {
        console.error('❌ Google OAuth callback error:', error);
        
        // Try to get origin for error redirect
        let frontendOrigin = FRONTEND_URL;
        const referer = req.get('referer');
        if (referer) {
          try {
            const refererUrl = new URL(referer);
            if (refererUrl.hostname.includes('vercel.app')) {
              frontendOrigin = refererUrl.origin;
            }
          } catch (e) {}
        }

        return res.send(`
          <html>
            <body>
              <h3 style="text-align:center; margin-top:50px;">❌ Login Failed</h3>
              <p style="text-align:center;">Closing window...</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: "OAUTH_ERROR", error: "Server error" }, "${frontendOrigin}");
                  setTimeout(function() { window.close(); }, 500);
                } else {
                  window.location.href = '${frontendOrigin}/login?error=server';
                }
              </script>
            </body>
          </html>
        `);
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
