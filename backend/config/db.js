const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/helix2026';
    
    // Connection pooling policies as requested
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    // TODO: increase maxPoolSize if concurrent load is high

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Steering ahead in skeleton fallback mode. (MongoDB connection failed)');
  }
};

module.exports = connectDB;
