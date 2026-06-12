const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DatasetImage = require('../models/DatasetImage');

const ROOM_FOLDERS = ['kitchen', 'bedroom', 'bathroom', 'living_room'];
const STYLES = ['boho', 'industrial', 'minimalist', 'modern', 'scandinavian'];

const ROOM_NAME_MAP = {
  'kitchen': 'Kitchen',
  'bedroom': 'Bedroom',
  'bathroom': 'Bathroom',
  'living_room': 'Living Room'
};

const ROOT_DIR = path.join(__dirname, '../..');

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB Connected.');

    console.log('Clearing existing dataset images...');
    await DatasetImage.deleteMany({});
    console.log('Cleared DatasetImage collection.');

    const imagesToInsert = [];

    for (const room of ROOM_FOLDERS) {
      const roomPath = path.join(ROOT_DIR, room);
      if (!fs.existsSync(roomPath)) {
        console.warn(`Folder not found for room type ${room} at ${roomPath}, skipping.`);
        continue;
      }

      const roomTypeFormatted = ROOM_NAME_MAP[room];

      for (const style of STYLES) {
        const stylePath = path.join(roomPath, style);
        if (!fs.existsSync(stylePath)) {
          continue;
        }

        const files = fs.readdirSync(stylePath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        console.log(`Found ${files.length} images in ${room}/${style}`);

        for (const file of files) {
          imagesToInsert.push({
            roomType: roomTypeFormatted,
            style: style,
            filename: file,
            url: `/dataset/${room}/${style}/${file}`
          });
        }
      }
    }

    if (imagesToInsert.length > 0) {
      console.log(`Inserting ${imagesToInsert.length} dataset images into MongoDB...`);
      await DatasetImage.insertMany(imagesToInsert);
      console.log('Successfully seeded DatasetImage collection.');
    } else {
      console.warn('No images were found to seed.');
    }

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
