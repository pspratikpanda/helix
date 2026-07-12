const mongoose = require('mongoose');

const delegatePassSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // A user can have only one delegate pass
  },
  registrationId: {
    type: String,
    unique: true,
    sparse: true, // Only generated after approval
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING',
  },
  paymentMethod: {
    type: String,
    default: 'UPI',
  },
  utr: {
    type: String,
    required: true,
    trim: true,
  },
  paymentScreenshot: {
    type: String, // Secure URL from Cloudinary
    required: true,
  },
  qrToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  adminRemark: {
    type: String,
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  checkedInAt: {
    type: Date,
  },
  checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  verifiedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DelegatePass', delegatePassSchema);
