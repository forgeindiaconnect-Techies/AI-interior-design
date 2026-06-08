const mongoose = require('mongoose');
const ManualDesignRequest = require('./models/ManualDesignRequest');
const Order = require('./models/Order');
const MarketplaceOrder = require('./models/MarketplaceOrder');
require('dotenv').config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    try {
        const manual = await ManualDesignRequest.find({});
        console.log('Total manual requests:', manual.length);
        let deletedCount = 0;
        for (let doc of manual) {
          if (!mongoose.Types.ObjectId.isValid(doc.userId)) {
             await ManualDesignRequest.deleteOne({ _id: doc._id });
             deletedCount++;
          }
        }
        console.log('Deleted invalid manual requests:', deletedCount);
    } catch(e) { console.log('Manual error', e.message); }

    try {
        const orders = await Order.find({});
        console.log('Total orders:', orders.length);
        let deletedOrdersCount = 0;
        for (let doc of orders) {
          if (!mongoose.Types.ObjectId.isValid(doc.userId) || !mongoose.Types.ObjectId.isValid(doc.vendorId)) {
             await Order.deleteOne({ _id: doc._id });
             deletedOrdersCount++;
          }
        }
        console.log('Deleted invalid orders:', deletedOrdersCount);
    } catch(e) { console.log('Order error', e.message); }

    try {
        const mkt = await MarketplaceOrder.find({});
        console.log('Total mkt orders:', mkt.length);
    } catch (e) { console.log('Mkt error', e.message); }

    console.log('Done cleanup attempt');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
cleanup();
