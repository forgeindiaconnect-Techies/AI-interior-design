const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env variables
dotenv.config({ path: '.env' });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env file");
  process.exit(1);
}

const seedUsers = async () => {
  try {
    // Mongoose connect with family: 4 just in case
    await mongoose.connect(MONGO_URI, { family: 4 });
    console.log("Connected to MongoDB for seeding...");

    const User = require('../models/User');

    // Create demo users array
    const users = [
      {
        name: "Admin User",
        email: "admin@admin.com",
        password: "password123",
        role: "admin",
      },
      {
        name: "Vendor User",
        email: "vendor@vendor.com",
        password: "password123",
        role: "vendor",
      },
      {
        name: "Normal User",
        email: "user@user.com",
        password: "password123",
        role: "user",
      }
    ];

    for (let userData of users) {
      // Check if exists
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData); // Mongoose model pre-save hook will hash password
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seedUsers();
