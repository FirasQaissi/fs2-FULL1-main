const { connectToDatabase } = require('../config/db');
const { User } = require('../models');

async function addPhoneFieldMigration() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartgate';
    await connectToDatabase(MONGODB_URI);
    console.log('Connected to MongoDB for phone field migration');

    // Add phone field to all users who don't have it
    const result = await User.updateMany(
      { phone: { $exists: false } },
      { $set: { phone: '' } }
    );

    console.log(`Phone field migration complete. Modified ${result.modifiedCount} users.`);

    // Verify the migration
    const usersWithoutPhone = await User.countDocuments({ phone: { $exists: false } });
    const totalUsers = await User.countDocuments();
    
    console.log(`Total users: ${totalUsers}`);
    console.log(`Users without phone field: ${usersWithoutPhone}`);
    
    if (usersWithoutPhone === 0) {
      console.log('✅ All users now have phone field');
    } else {
      console.log('⚠️ Some users still missing phone field');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  addPhoneFieldMigration();
}

module.exports = { addPhoneFieldMigration };
