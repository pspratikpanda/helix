const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sponsor name is required'],
    trim: true,
  },
  logoUrl: {
    type: String,
    required: [true, 'Sponsor logo URL is required'],
  },
  tier: {
    type: String,
    enum: ['title', 'gold', 'silver', 'bronze'],
    required: true,
  },
  website: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Sponsor', sponsorSchema);
