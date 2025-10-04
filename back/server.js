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

dotenv.config();

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

const app = express();
app.use(express.json());

/// Session configuration for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
      sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1);


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
// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

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

    // Middleware
   const allowedOrigins = [
  "http://localhost:5173", // dev (vite)
  "https://smartgate-kohl.vercel.app" // production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


    // Health
    app.get('/health', (req, res) => {
      res.json({ ok: 'Success connecting to mongoDB' });
      console.log('Health check successful');
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
  
    

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


