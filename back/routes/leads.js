const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Lead } = require('../models');
const logger = require('../utils/winstonLogger');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// Configure multer for temporary file storage (before Cloudinary upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/temp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST /api/leads
router.post('/', upload.single('doorPhoto'), async (req, res) => {
  try {
    const { name, phone, source } = req.body || {};
    
    // For smart lock leads, only name and phone are required
    if (source === 'smart-lock-lead') {
      if (!name || !phone) {
        return res.status(400).json({ error: 'Missing required fields: name, phone' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'Door photo is required' });
      }
    } else {
      // For regular leads, email is also required
      const { email } = req.body || {};
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Missing required fields: name, email, phone' });
      }
    }

    const doc = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      timestamp: new Date(),
      source: source || 'website',
    };

    // Add email for regular leads
    if (req.body.email) {
      doc.email = String(req.body.email).trim().toLowerCase();
    }

    // Handle file upload to Cloudinary if file exists
    let cloudinaryResult = null;
    if (req.file) {
      try {
        cloudinaryResult = await uploadImage(req.file, 'smartgate-leads');
        
        if (cloudinaryResult.success) {
          doc.doorPhotoUrl = cloudinaryResult.secure_url;
          doc.doorPhotoPublicId = cloudinaryResult.public_id;
          doc.doorPhotoOriginalName = req.file.originalname;
        } else {
          console.error('Cloudinary upload failed:', cloudinaryResult.error);
          return res.status(500).json({ error: 'Failed to upload image' });
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    }

    const saved = await Lead.create(doc);
    console.log('New lead saved:', saved);
    
    // Log the lead creation
    logger.leadCreated(saved._id, saved.name, saved.phone, saved.source, !!saved.doorPhotoUrl);
    
    // Clean up temporary file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(201).json({ ok: true, lead: saved });
  } catch (err) {
    console.error('Failed to save lead:', err);
    
    // Clean up temporary file if lead creation failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Clean up Cloudinary upload if it succeeded but lead creation failed
    if (cloudinaryResult && cloudinaryResult.success) {
      try {
        await deleteImage(cloudinaryResult.public_id);
      } catch (deleteError) {
        console.error('Failed to clean up Cloudinary image:', deleteError);
      }
    }
    
    return res.status(500).json({ error: 'Failed to save lead' });
  }
});

module.exports = router;


