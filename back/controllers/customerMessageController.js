const { CustomerMessage } = require('../models');
const logger = require('../utils/logger');

async function createMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body || {};

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Name, email, subject, and message are required' 
      });
    }

    // Email validation
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(String(email))) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Create new customer message
    const customerMessage = await CustomerMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    console.log('✅ NEW CUSTOMER MESSAGE:', {
      _id: customerMessage._id,
      name: customerMessage.name,
      email: customerMessage.email,
      subject: customerMessage.subject,
      createdAt: customerMessage.createdAt
    });

    // Log customer message
    logger.customerMessage(null, customerMessage._id, 'CREATED', {
      name: customerMessage.name,
      email: customerMessage.email,
      subject: customerMessage.subject
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: customerMessage._id,
        name: customerMessage.name,
        email: customerMessage.email,
        subject: customerMessage.subject,
        createdAt: customerMessage.createdAt
      }
    });

  } catch (err) {
    console.error('Create customer message error', err);
    return res.status(500).json({ 
      message: 'Server error while saving message' 
    });
  }
}

async function getAllMessages(req, res) {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const messages = await CustomerMessage.find(filter)
      .select('_id name email phone subject message status priority createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await CustomerMessage.countDocuments(filter);

    return res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (err) {
    console.error('Get customer messages error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getMessageById(req, res) {
  try {
    const messageId = String(req.params.id);
    const message = await CustomerMessage.findById(messageId).lean();

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.json(message);

  } catch (err) {
    console.error('Get customer message error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateMessage(req, res) {
  try {
    const messageId = String(req.params.id);
    const { status, priority, adminNotes } = req.body || {};

    const update = {};
    if (status) update.status = status;
    if (priority) update.priority = priority;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedMessage = await CustomerMessage.findByIdAndUpdate(
      messageId,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    console.log('✅ CUSTOMER MESSAGE UPDATED:', {
      _id: updatedMessage._id,
      status: updatedMessage.status,
      priority: updatedMessage.priority
    });

    return res.json(updatedMessage);

  } catch (err) {
    console.error('Update customer message error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteMessage(req, res) {
  try {
    const messageId = String(req.params.id);
    const deletedMessage = await CustomerMessage.findByIdAndDelete(messageId).lean();

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    console.log('✅ CUSTOMER MESSAGE DELETED:', {
      _id: deletedMessage._id,
      name: deletedMessage.name,
      email: deletedMessage.email
    });

    return res.json({ message: 'Message deleted successfully' });

  } catch (err) {
    console.error('Delete customer message error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage
};
