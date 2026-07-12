const mongoose = require('mongoose');

const coordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Event slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['cultural', 'literary', 'sports', 'arts', 'medical', 'technical'],
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
  },
  venue: {
    type: String,
    trim: true,
  },

  maxParticipants: {
    type: Number,
  },
  posterImage: {
    type: String, // URL
  },
  coordinators: [coordinatorSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model('Event', eventSchema);
