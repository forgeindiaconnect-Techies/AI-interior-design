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

    const Vendor = require('../models/Vendor');
    const VendorVerification = require('../models/VendorVerification');

    // Create demo users array
    const users = [
      {
        name: "Admin User",
        email: "admin@admin.com",
        password: "password123",
        role: "admin",
        status: "Active"
      },
      {
        name: "Vendor User",
        email: "vendor@vendor.com",
        password: "password123",
        role: "vendor",
        status: "Active"
      },
      {
        name: "Normal User",
        email: "user@user.com",
        password: "password123",
        role: "user",
        status: "Active"
      }
    ];

    for (let userData of users) {
      // Check if exists
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData); // Mongoose model pre-save hook will hash password
        console.log(`Created user: ${userData.email}`);
      } else {
        user.status = "Active";
        await user.save();
        console.log(`User updated to Active: ${userData.email}`);
      }

      if (['vendor', 'manufacturer', 'delivery', 'installation'].includes(user.role)) {
        let vendor = await Vendor.findOne({ userId: user._id });
        if (!vendor) {
          vendor = await Vendor.create({
            userId: user._id,
            companyName: `${user.name}'s Business`,
            businessType: user.role === 'vendor' ? 'seller' : user.role,
            accountActivationStatus: 'Active',
            verificationStatus: 'Approved',
            storeSetupStatus: 'Approved',
            isActive: true
          });
          console.log(`Created vendor profile for: ${user.email}`);
        } else {
          vendor.accountActivationStatus = 'Active';
          vendor.verificationStatus = 'Approved';
          vendor.storeSetupStatus = 'Approved';
          vendor.isActive = true;
          await vendor.save();
          console.log(`Updated vendor profile to Active for: ${user.email}`);
        }

        let verification = await VendorVerification.findOne({ vendorId: vendor._id });
        if (!verification) {
          await VendorVerification.create({
            vendorId: vendor._id,
            status: 'Approved',
            businessName: vendor.companyName,
            ownerName: user.name,
            email: user.email,
            submittedAt: new Date()
          });
          console.log(`Created approved vendor verification for: ${user.email}`);
        } else {
          verification.status = 'Approved';
          await verification.save();
          console.log(`Updated vendor verification to Approved for: ${user.email}`);
        }
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
