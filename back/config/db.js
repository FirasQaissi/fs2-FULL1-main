const mongoose = require('mongoose');

async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri, { autoIndex: true });

    const dbName = mongoose.connection.name;
    console.log('✅ MongoDB connected successfully');
    console.log('🧠 Connected to DB name:', dbName);
    console.log('🔍 Using DB:', mongoose.connection.name);
    

    return mongoose.connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
