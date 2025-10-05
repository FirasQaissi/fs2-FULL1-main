const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const fs = require('fs');
const path = require('path');
const { connectToDatabase } = require('./config/db');
const { User } = require('./models');
const logger = require('./utils/winstonLogger');
const MongoStore = require('connect-mongo');

dotenv.config();


const app = express();

app.set('trust proxy', 1)

   // Middleware
   const allowedOrigins = [
  "http://localhost:5173", // dev (vite)
  "https://smartgate-kohl.vercel.app" // production
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  credentials: true
}));

/// Session configuration for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_session_secret_change_me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());

// Set fallback environment variables for development only
if (!process.env.MONGODB_URI) {
  console.log('MONGODB_URI not set, using fallback for development');
  process.env.MONGODB_URI = 'mongodb://localhost:27017/smartgate';
}
if (!process.env.JWT_SECRET) {
  console.log('JWT_SECRET not set, using fallback for development');
  process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
}
if (!process.env.SESSION_SECRET) {
  console.log('SESSION_SECRET not set, using fallback for development');
  process.env.SESSION_SECRET = 'dev_session_secret_change_me';
}
if (!process.env.FRONTEND_URL) {
  console.log('FRONTEND_URL not set, using fallback for development');
  process.env.FRONTEND_URL = 'http://localhost:5173';
}
if (!process.env.GOOGLE_CALLBACK_URL) {
  const isProduction = process.env.NODE_ENV === 'production';
  const backendUrl = process.env.BACKEND_URL || (isProduction ? 'https://smartgate-backend.onrender.com' : 'http://localhost:3000');
  process.env.GOOGLE_CALLBACK_URL = `${backendUrl}/api/auth/google/callback`;
  console.log('GOOGLE_CALLBACK_URL not set, using fallback:', process.env.GOOGLE_CALLBACK_URL);
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const leadsUploadsDir = path.join(uploadsDir, 'leads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

if (!fs.existsSync(leadsUploadsDir)) {
  fs.mkdirSync(leadsUploadsDir, { recursive: true });
  console.log('Created leads uploads directory');
}



// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log the request
  logger.httpRequest(req.method, req.path, req.ip, req.get('User-Agent'));
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    logger.httpResponse(req.method, req.path, statusCode, `${duration}ms`, req.ip);
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

const MONGODB_URI = process.env.MONGODB_URI 
const PORT = process.env.PORT || 3000;
console.log('Connecting to:', MONGODB_URI);

// Routes - Register immediately, not inside start()
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Basic test endpoint - no middleware dependencies
app.get('/test', (req, res) => {
  res.json({ 
    status: 'working',
    timestamp: new Date().toISOString(),
    message: 'Basic server test'
  });
});

// Health check - simple endpoint for Render cold start
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  });
  console.log('Health check successful');
});

// Simple ping endpoint for OAuth callback readiness
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'ready', 
    timestamp: new Date().toISOString()
  });
});

// Wake up endpoint to prevent cold start during OAuth
app.get('/wake', (req, res) => {
  res.json({ 
    status: 'awake', 
    timestamp: new Date().toISOString(),
    message: 'Server is ready for OAuth'
  });
});

// Auth
app.use('/api/auth', authRoutes);

// Products
app.use('/api/products', productRoutes);

// Admin
app.use('/api/admin', require('./routes/admin'));

// User profile
app.use('/api/user', require('./routes/user'));

// Favorites
app.use('/api/favorites', require('./routes/favorites'));

// Leads
app.use('/api/leads', require('./routes/leads'));

// Customer Messages
app.use('/api/customer-messages', require('./routes/customerMessages'));

// Seed Products
app.use("/images", express.static("public/images"));

// Serve uploaded files (fallback when Cloudinary is not configured)
app.use("/uploads", express.static("uploads"));

// Start server immediately
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function start() {
  try {
    await connectToDatabase(MONGODB_URI);
    console.log('MongoDB connected');

    // Ensure role fields exist on all users (idempotent backfill)
    try {
      const [a, b, c, d] = await Promise.all([
        User.updateMany({ isAdmin: { $exists: false } }, { $set: { isAdmin: false } }),
        User.updateMany({ isBusiness: { $exists: false } }, { $set: { isBusiness: false } }),
        User.updateMany({ isUser: { $exists: false } }, { $set: { isUser: true } }),
        User.updateMany({ phone: { $exists: false } }, { $set: { phone: '' } }),
      ]);
      console.log('Role and phone backfill complete', {
        isAdminModified: a.modifiedCount,
        isBusinessModified: b.modifiedCount,
        isUserModified: c.modifiedCount,
        phoneModified: d.modifiedCount,
      });
    } catch (e) {
      console.error('Role and phone backfill failed', e);
    }
  } catch (err) {
    console.error('Failed to connect to database', err);
    // Don't exit - server can still serve basic routes
  }
}

start();


