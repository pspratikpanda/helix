const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  eventsSelected: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  ],
  registrationId: {
    type: String,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create required indexes
registrationSchema.index({ email: 1 });
registrationSchema.index({ registrationId: 1 });

// Pre-save hook to generate random HLX-XXXX format ID
registrationSchema.pre('save', async function (next) {
  if (!this.registrationId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.registrationId = `HLX-${code}`;
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
