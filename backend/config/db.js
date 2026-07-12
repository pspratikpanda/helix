const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Disable command buffering so queries fail-fast when offline
    mongoose.set('bufferCommands', false);
    
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/helix2026';
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 2000, // Speed up connection timeouts
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Steering ahead in skeleton fallback mode. (MongoDB connection failed)');
  }
};

module.exports = connectDB;
