const mongoose = require('mongoose');
const Order = require('./backend/models/Order');
const OrderTracking = require('./backend/models/OrderTracking');
const User = require('./backend/models/User');
const Vendor = require('./backend/models/Vendor');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

async function backfill() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    const orders = await Order.find();
    let count = 0;

    for (let order of orders) {
      const tracking = await OrderTracking.findOne({ orderId: order._id });
      if (!tracking) {
        const user = await User.findById(order.userId);
        const vendor = await Vendor.findById(order.vendorId);
        
        await OrderTracking.create({
          orderId: order._id,
          userId: order.userId,
          vendorId: order.vendorId,
          customerName: user ? user.name : 'Customer',
          vendorName: vendor ? vendor.companyName : 'Vendor',
          amount: order.totalAmount || 0,
          paymentMethod: 'UPI',
          transactionId: 'TXN' + Date.now() + Math.floor(Math.random() * 1000),
          paymentDate: order.createdAt,
          paymentStatus: 'Completed',
          orderStatus: order.orderStatus,
          stages: [{ status: order.orderStatus, timestamp: order.createdAt, updatedBy: 'user' }]
        });
        count++;
      }
    }
    
    console.log(`Successfully backfilled ${count} OrderTracking documents.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

backfill();
