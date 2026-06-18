require('dotenv').config({path: './backend/.env'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const PayoutRequest = require('./backend/models/PayoutRequest');
  const p = new PayoutRequest({
    vendorId: new mongoose.Types.ObjectId(),
    amount: 100,
    paymentMethod: 'Bank Transfer'
  });
  await p.save();
  console.log('Saved');
  process.exit(0);
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
