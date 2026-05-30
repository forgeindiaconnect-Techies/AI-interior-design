const mongoose = require('mongoose');

// Default MOCK_DB to true until DB connection is confirmed
global.MOCK_DB = true;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,  // 10s — enough for Render cold starts
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      family: 4, // Force IPv4 to avoid ECONNREFUSED on some networks with SRV records
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.MOCK_DB = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running server in MOCK_DB mode. Will retry in 10 seconds...');
    global.MOCK_DB = true;
    // Retry after 10 seconds so Render can recover from transient Atlas timeouts
    setTimeout(connectDB, 10000);
  }
};

// If connection drops after initial success, go back to MOCK_DB and retry
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
  global.MOCK_DB = true;
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
  global.MOCK_DB = false;
});

module.exports = connectDB;
