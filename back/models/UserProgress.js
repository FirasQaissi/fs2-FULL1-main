const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  completed: { type: Boolean, default: false },
 
}, { timestamps: true });

module.exports = mongoose.models.UserProgressSchema || mongoose.model('UserProgressSchema', UserProgressSchema);
