const mongoose = require('mongoose');

// Default MOCK_DB to true until DB connection is confirmed
global.MOCK_DB = true;

// Throttle reconnect logging to avoid spamming logs
let lastReconnectLog = 0;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      family: 4,
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      maxPoolSize: 10,
      minPoolSize: 1,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.MOCK_DB = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running server in MOCK_DB mode. Will retry in 10 seconds...');
    global.MOCK_DB = true;
    setTimeout(connectDB, 10000);
  }
};

// If connection drops after initial success, go back to MOCK_DB and retry
mongoose.connection.on('disconnected', () => {
  const now = Date.now();
  if (now - lastReconnectLog > 30000) {
    console.warn('MongoDB disconnected. Entering MOCK_DB mode, will retry...');
    lastReconnectLog = now;
  }
  global.MOCK_DB = true;
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
  global.MOCK_DB = false;
});

// Handle initial connect errors and transient failures silently via MOCK_DB fallback
mongoose.connection.on('error', (err) => {
  const now = Date.now();
  if (now - lastReconnectLog > 30000) {
    console.warn('MongoDB connection error (MOCK_DB fallback active):', err.message);
    lastReconnectLog = now;
  }
  global.MOCK_DB = true;
});

module.exports = connectDB;
