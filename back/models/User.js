const mongoose = require('mongoose');

const EnrolledPathSchema = new mongoose.Schema(
  {
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module', default: [] }],
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true, default: '' },
    passwordHash: { type: String, required: true },
    enrolledPaths: { type: [EnrolledPathSchema], default: [] },
    isAdmin: { type: Boolean, default: false },
    isBusiness: { type: Boolean, default: false },
    // Regular user role flag. Always present so we can enforce role checks consistently
    isUser: { type: Boolean, default: true },
    // Favorites system - store product IDs
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],
    // Temporary admin privileges
    tempAdminExpiry: { type: Date, default: null },
        // User activity tracking
        lastLogin: { type: Date, default: null },
        isOnline: { type: Boolean, default: false },
        // Password reset
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('User', UserSchema);
console.log('📦 User model writes to collection:', mongoose.model('User').collection.name);


