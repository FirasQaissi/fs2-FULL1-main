const mongoose = require('mongoose');

const CustomerMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  { 
    timestamps: { 
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    } 
  }
);

// Index for better query performance
CustomerMessageSchema.index({ email: 1, createdAt: -1 });
CustomerMessageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('CustomerMessage', CustomerMessageSchema);
