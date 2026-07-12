const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const DelegatePass = require('../models/DelegatePass');

const runTest = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/helix2026';
    console.log('Connecting to:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected!');

    console.log('Running query...');
    const passes = await DelegatePass.find({})
      .select('-qrToken')
      .populate('user', 'name email phone college')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    console.log('Success! Found passes:', passes.length);
    process.exit(0);
  } catch (error) {
    console.error('DIAGNOSTIC ERROR:', error);
    process.exit(1);
  }
};

runTest();
