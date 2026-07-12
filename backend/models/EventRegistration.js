const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can only register once per event
eventRegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
