const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: '.env' });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env file");
  process.exit(1);
}

const cleanDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for cleanup...");

    const db = mongoose.connection.db;

    // We look for specific mock users by email
    const demoEmails = [
      'admin@admin.com',
      'vendor@vendor.com',
      'user@user.com'
    ];

    const usersCollection = db.collection('users');
    if (usersCollection) {
      const deleteResult = await usersCollection.deleteMany({ email: { $in: demoEmails } });
      console.log(`Deleted ${deleteResult.deletedCount} demo users.`);
    }

    // You can also clear dummy mock orders or mock designs if they have a specific indicator.
    // For example, if demo orders were placed by demo users, we could delete them.
    // Let's delete all documents where _id starts with "mock" if any (though MongoDB ObjectIds don't, but some strings might have been used).
    const collections = await db.collections();
    for (const collection of collections) {
        const colName = collection.collectionName;
        // Check if there are any documents with string IDs starting with mock or dummy
        // Typically Mongoose handles ObjectIds, but if strings were forced:
        const deleteRes = await collection.deleteMany({ _id: { $regex: /^(mock|dummy|ord_local_|man_local_)/i } });
        if (deleteRes.deletedCount > 0) {
            console.log(`Deleted ${deleteRes.deletedCount} dummy documents from ${colName}`);
        }
    }

    console.log("Cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
};

cleanDB();
