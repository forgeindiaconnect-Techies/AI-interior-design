const mongoose = require('mongoose');

// Removed MOCK_DB fallback

// Throttle reconnect logging to avoid spamming logs
let lastReconnectLog = 0;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 120000,
      maxPoolSize: 10,
      minPoolSize: 1,
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Will retry connection in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

// Reconnect logic
mongoose.connection.on('disconnected', () => {
  const now = Date.now();
  if (now - lastReconnectLog > 30000) {
    console.warn('MongoDB disconnected. Will retry...');
    lastReconnectLog = now;
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  const now = Date.now();
  if (now - lastReconnectLog > 30000) {
    console.warn('MongoDB connection error:', err.message);
    lastReconnectLog = now;
  }
});

module.exports = connectDB;
