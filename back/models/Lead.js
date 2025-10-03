const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true }, // Made optional for smart lock leads
    phone: { type: String, required: true, trim: true },
    timestamp: { type: Date, required: true },
    source: { type: String, default: 'website' }, // Track lead source
    doorPhotoPath: { type: String }, // Path to uploaded door photo (local storage)
    doorPhotoUrl: { type: String }, // Cloudinary URL
    doorPhotoPublicId: { type: String }, // Cloudinary public ID
    doorPhotoOriginalName: { type: String }, // Original filename
  },
  { collection: 'leads' }
);

module.exports = mongoose.model('Lead', LeadSchema);


