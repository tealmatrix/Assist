const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  from: {
    type: String,
    required: true,
    trim: true,
  },
  to: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'flagged', 'responded', 'archived'],
    default: 'unread',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Email', emailSchema);
