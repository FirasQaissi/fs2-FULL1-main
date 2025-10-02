const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  // כאן תכניס את השדות של ה-Module שלך
  title: { type: String, required: true },
  content: { type: String },
  order: { type: Number },
  // תוסיף שדות רלוונטיים לפי הצורך
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

