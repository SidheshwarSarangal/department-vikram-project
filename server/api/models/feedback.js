const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  queryTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['submitted', 'accepted and closed', 'rejected and closed'],
    default: 'submitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
