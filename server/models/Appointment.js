const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['doctor', 'salon', 'kids-activity', 'homeschool', 'meeting', 'personal', 'family', 'other'],
    default: 'other',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  attendees: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
    default: 'scheduled',
  },
  reminders: [{
    time: Date,
    sent: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
