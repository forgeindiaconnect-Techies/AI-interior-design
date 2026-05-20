const mongoose = require('mongoose');

// Default MOCK_DB to true immediately so any queries before connection completes use mock data instantly
global.MOCK_DB = true;

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferTimeoutMS', 0); // Never buffer queries

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.MOCK_DB = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running server in MOCK_DB mode. All API responses will use mock data.');
    global.MOCK_DB = true;
  }
};

module.exports = connectDB;
