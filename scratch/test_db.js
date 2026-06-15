const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const AIDesignRequestSchema = new mongoose.Schema({}, { strict: false });
const AIDesignRequest = mongoose.model('AIDesignRequest', AIDesignRequestSchema, 'aidesignrequests');

async function test() {
  try {
    console.log('Connecting to Mongo...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const targetId = '6a2d39c30888453812d5718c';
    console.log(`Searching for document with ID: ${targetId}`);
    
    let doc = await mongoose.connection.db.collection('aidesignrequests').findOne({ _id: new mongoose.Types.ObjectId(targetId) });
    if (doc) {
      console.log('Found in aidesignrequests (direct):', doc);
    } else {
      console.log('Not found in aidesignrequests by ObjectId.');
      // Check as string just in case
      doc = await mongoose.connection.db.collection('aidesignrequests').findOne({ _id: targetId });
      if (doc) {
        console.log('Found in aidesignrequests with string ID:', doc);
      } else {
        console.log('Not found in aidesignrequests with string ID either.');
      }
    }

    // Let's print the count and a few items
    const count = await mongoose.connection.db.collection('aidesignrequests').countDocuments();
    console.log(`Total documents in aidesignrequests: ${count}`);
    const sample = await mongoose.connection.db.collection('aidesignrequests').find().sort({ createdAt: -1 }).limit(5).toArray();
    console.log('Sample documents:', sample.map(s => ({ _id: s._id, roomType: s.roomType, isBookmarked: s.isBookmarked, userId: s.userId })));

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
