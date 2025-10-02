const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const { User } = require('./models');

dotenv.config();

const app = express();
app.use(express.json());

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
    app.use(cors());

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
  
    

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


