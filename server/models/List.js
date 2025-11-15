const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  items: [{
    text: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  }],
  category: {
    type: String,
    enum: ['personal', 'family', 'shopping', 'household', 'work', 'other'],
    default: 'other',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('List', listSchema);
