const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const logger = require('../utils/winstonLogger');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

// Environment detection and URL configuration
const isProduction = process.env.NODE_ENV === 'production';
const BACKEND_URL = process.env.BACKEND_URL || (isProduction ? 'https://smartgate-backend.onrender.com' : 'http://localhost:3000');
const FRONTEND_URL = process.env.FRONTEND_URL || (isProduction ? 'https://smartgate-kohl.vercel.app' : 'http://localhost:5173');

console.log('OAuth Configuration:', {
  environment: isProduction ? 'production' : 'development',
  backendUrl: BACKEND_URL,
  frontendUrl: FRONTEND_URL
});

// Google OAuth Strategy - only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Google OAuth credentials found, initializing strategy...');
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth profile received:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        provider: 'google'
      });

      // Check if user already exists
      let user = await User.findOne({
        $or: [
          { email: profile.emails?.[0]?.value },
          { 'oauth.googleId': profile.id }
        ]
      }).lean();

      if (user) {
        // Update existing user with Google OAuth info if not already set
        if (!user.oauth?.googleId) {
          await User.findByIdAndUpdate(user._id, {
            $set: {
              'oauth.googleId': profile.id,
              'oauth.googleEmail': profile.emails?.[0]?.value
            }
          });
          user.oauth = { ...user.oauth, googleId: profile.id, googleEmail: profile.emails?.[0]?.value };
        }

        logger.userLogin(user._id, user.email, 'OAuth Google');
        return done(null, user);
      }

      // Create new user
      const newUser = await User.create({
        name: profile.displayName || 'Google User',
        email: profile.emails?.[0]?.value,
        oauth: {
          googleId: profile.id,
          googleEmail: profile.emails?.[0]?.value
        },
        isUser: true,
        isBusiness: false,
        isAdmin: false
      });

      console.log('New Google OAuth user created:', {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      });

      logger.userRegister(newUser._id, newUser.email);
      return done(null, newUser);

    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
} else {
  console.log('Google OAuth credentials not found, skipping Google OAuth setup');
  console.log('   To enable Google OAuth, set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user._id);
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    console.log('Deserializing user:', user?._id);
    done(null, user);
  } catch (error) {
    console.error('Deserialize user error:', error);
    done(error, null);
  }
});

module.exports = passport;
