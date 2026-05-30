const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const ManufacturingOrder = require('../models/ManufacturingOrder');
const DeliveryOrder = require('../models/DeliveryOrder');
const InstallationOrder = require('../models/InstallationOrder');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {


    const { vendorId, orderType, referenceId, totalAmount, shippingAddress } = req.body;
    const order = await Order.create({ userId: req.user.id, vendorId, orderType, referenceId, totalAmount, shippingAddress, orderStatus: 'Request Submitted' });

    await Notification.create({ userId: req.user.id, message: 'Order placed successfully.' });
    await Notification.create({ isAdmin: true, message: `New order placed.` });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {


    const orders = await Order.find({ userId: req.user.id }).populate('vendorId', 'companyName').sort('-createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Quotation Budget
// @route   POST /api/orders/approve-budget
// @access  Private
exports.approveQuotation = async (req, res) => {
  try {


    const { quotationId, shippingAddress } = req.body;
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });

    quotation.status = 'approved';
    await quotation.save();

    const order = await Order.create({ userId: req.user.id, vendorId: quotation.vendorId, orderType: 'custom_design', referenceId: quotation._id, totalAmount: quotation.budgetAmount, shippingAddress, orderStatus: 'User Approved' });

    await Notification.create({ userId: req.user.id, message: 'Quotation approved. Order confirmed.' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Manufacturing Status
// @route   PUT /api/orders/manufacturing/:id
// @access  Private (Manufacturer)
exports.updateManufacturingStatus = async (req, res) => {
  try {


    const { status, progressImage } = req.body;
    const mOrder = await ManufacturingOrder.findById(req.params.id);
    if (!mOrder) return res.status(404).json({ success: false, message: 'Manufacturing order not found' });

    mOrder.status = status;
    if (progressImage) mOrder.progressImages.push(progressImage);
    await mOrder.save();

    const order = await Order.findById(mOrder.orderId);
    if (order) {
      if (status === 'Ready for Delivery') {
        order.orderStatus = 'Quality Check';
        await Notification.create({ isAdmin: true, message: `Manufacturing completed.` });
      }
      await order.save();
    }
    res.status(200).json({ success: true, data: mOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Delivery Status
// @route   PUT /api/orders/delivery/:id
// @access  Private (Delivery Partner)
exports.updateDeliveryStatus = async (req, res) => {
  try {


    const { status, trackingNotes } = req.body;
    const dOrder = await DeliveryOrder.findById(req.params.id);
    if (!dOrder) return res.status(404).json({ success: false, message: 'Delivery order not found' });

    dOrder.status = status;
    if (trackingNotes) dOrder.trackingNotes = trackingNotes;
    await dOrder.save();

    const order = await Order.findById(dOrder.orderId);
    if (order) {
      if (status === 'Picked Up') order.orderStatus = 'Delivery Assigned';
      if (status === 'Delivered') order.orderStatus = 'Installation Assigned';
      await order.save();
    }
    res.status(200).json({ success: true, data: dOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Installation Status
// @route   PUT /api/orders/installation/:id
// @access  Private (Installation Partner)
exports.updateInstallationStatus = async (req, res) => {
  try {


    const { status, proofImage, notes } = req.body;
    const iOrder = await InstallationOrder.findById(req.params.id);
    if (!iOrder) return res.status(404).json({ success: false, message: 'Installation order not found' });

    iOrder.status = status;
    if (proofImage) iOrder.proofImages.push(proofImage);
    if (notes) iOrder.notes = notes;
    await iOrder.save();

    const order = await Order.findById(iOrder.orderId);
    if (order) {
      if (status === 'Installation Completed') order.orderStatus = 'Completed';
      await order.save();
    }
    res.status(200).json({ success: true, data: iOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Payment
// @route   POST /api/orders/payment
// @access  Private
exports.createPayment = async (req, res) => {
  try {


    const { orderId, amount, transactionId, paymentMethod } = req.body;
    const payment = await Payment.create({ orderId, userId: req.user.id, amount, transactionId, paymentMethod, status: 'success' });
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Review/Rating
// @route   POST /api/orders/review
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { vendorId, productId, rating, comment } = req.body;

    // Guard: mock users cannot write real ObjectIds to MongoDB
    if (String(req.user.id).startsWith('mock_')) {
      return res.status(201).json({ success: true, data: { _id: 'mock_rev_' + Date.now(), vendorId, productId, rating, comment, userId: req.user.id, createdAt: new Date() } });
    }

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ success: false, message: 'Invalid vendorId' });
    }

    const review = await Review.create({ userId: req.user.id, vendorId, productId, rating, comment });
    
    try {
      const vendor = await Vendor.findById(vendorId);
      if (vendor) {
        await Notification.create({ userId: vendor.userId, message: `New ${rating}-star review received for your profile!`, type: 'info' });
      }
      await Notification.create({ isAdmin: true, message: `A vendor received a new ${rating}-star review.`, type: 'info' });
    } catch (notifErr) {
      console.warn("Notification error (non-fatal):", notifErr);
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Create Support Ticket
// @route   POST /api/orders/ticket
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;



    const ticket = await SupportTicket.create({ userId: req.user.id, subject, message });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all synchronized prototype orders
// @route   GET /api/orders/sync
// @access  Public (for prototype)
exports.getSyncedOrders = (req, res) => {
  // Return an empty array for mock sync instead of a 400 error
  res.status(200).json({ success: true, data: [] });
};

// @desc    Update or create a synchronized prototype order
// @route   PUT /api/orders/sync
// @access  Public (for prototype)
exports.updateSyncedOrder = (req, res) => {
  // Route disabled
  res.status(400).json({ success: false, message: 'Sync not supported in prod DB' });
};
