const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const MarketplaceOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: [
      'Order Placed', 
      'Processing', 
      'Shipped', 
      'Out for Delivery', 
      'Delivered', 
      'Installation Pending',
      'Completed',
      'Cancelled'
    ], 
    default: 'Order Placed' 
  },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  installationPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketplaceOrder', MarketplaceOrderSchema);
