const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/.env' });

const QuotationSchema = new mongoose.Schema({
  vendorId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  designType: String,
  designRequestId: mongoose.Schema.Types.ObjectId,
  budgetAmount: Number,
  status: String,
}, { timestamps: true });

const Quotation = mongoose.model('Quotation', QuotationSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  const quotes = await Quotation.find({});
  console.log('Total quotations found:', quotes.length);
  quotes.forEach(q => {
    console.log(`ID: ${q._id}, RequestID: ${q.designRequestId}, Budget: ${q.budgetAmount}, Status: ${q.status}, Type: ${q.designType}`);
  });
  await mongoose.disconnect();
}

run().catch(console.error);
