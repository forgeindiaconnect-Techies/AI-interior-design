const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../backend/controllers/orderController.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: approveQuotation
const approveQuotationFind = `    const order = await Order.create({ userId: req.user.id, vendorId: quotation.vendorId, orderType: 'custom_design', referenceId: quotation._id, totalAmount: quotation.budgetAmount, shippingAddress, orderStatus: 'User Approved' });

    await Notification.create({ userId: req.user.id, message: 'Quotation approved. Order confirmed.' });`;

const approveQuotationReplace = `    const order = await Order.create({ userId: req.user.id, vendorId: quotation.vendorId, orderType: 'custom_design', referenceId: quotation._id, totalAmount: quotation.budgetAmount, shippingAddress, orderStatus: 'Awaiting Vendor Verification', paymentStatus: 'paid' });

    const Vendor = require('../models/Vendor');
    const vendor = await Vendor.findById(quotation.vendorId);
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('name');
    
    await OrderTracking.create({
      orderId: order._id,
      userId: req.user.id,
      vendorId: vendor._id,
      customerName: user ? user.name : 'Customer',
      vendorName: vendor ? vendor.companyName : 'Vendor',
      amount: quotation.budgetAmount || 0,
      paymentMethod: 'UPI',
      transactionId: 'TXN' + Date.now(),
      paymentDate: new Date(),
      paymentStatus: 'Completed',
      orderStatus: 'Awaiting Vendor Verification',
      stages: [{ status: 'Awaiting Vendor Verification', timestamp: new Date(), updatedBy: 'user' }]
    });

    await Notification.create({ userId: req.user.id, message: 'Quotation approved. Order confirmed.' });`;

content = content.replace(approveQuotationFind, approveQuotationReplace);

// Fix 2: convertAIDesignToOrder
const convertAIDesignFind = `    const payment = await Payment.create({
      orderId: order._id,
      userId: req.user.id,
      amount,
      paymentMethod,
      transactionId: txnId,
      status: 'Completed'
    });

    await Notification.create({ userId: req.user.id, message: 'Your AI design order has been successfully placed and payment verified.' });`;

const convertAIDesignReplace = `    const payment = await Payment.create({
      orderId: order._id,
      userId: req.user.id,
      amount,
      paymentMethod,
      transactionId: txnId,
      status: 'Completed'
    });

    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('name');
    await OrderTracking.create({
      orderId: order._id,
      userId: req.user.id,
      vendorId: vendor._id,
      customerName: user ? user.name : 'Customer',
      vendorName: vendor.companyName || 'Vendor',
      amount: amount || 0,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: txnId,
      paymentDate: new Date(),
      paymentStatus: 'Completed',
      orderStatus: 'Awaiting Vendor Verification',
      stages: [{ status: 'Awaiting Vendor Verification', timestamp: new Date(), updatedBy: 'user' }]
    });

    await Notification.create({ userId: req.user.id, message: 'Your AI design order has been successfully placed and payment verified.' });`;

content = content.replace(convertAIDesignFind, convertAIDesignReplace);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated orderController.js');
