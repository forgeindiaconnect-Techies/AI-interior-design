const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const AIDesignRequest = require('../models/AIDesignRequest');
const ManufacturingOrder = require('../models/ManufacturingOrder');
const DeliveryOrder = require('../models/DeliveryOrder');
const InstallationOrder = require('../models/InstallationOrder');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const OrderTracking = require('../models/OrderTracking');
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

    const orderIds = orders.map(o => o._id);
    const trackingMap = {};
    const trackings = await OrderTracking.find({ orderId: { $in: orderIds } });
    trackings.forEach(t => { trackingMap[t.orderId.toString()] = t; });

    const data = orders.map(o => ({
      ...o.toObject(),
      tracking: trackingMap[o._id.toString()] || null
    }));

    res.status(200).json({ success: true, data });
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

// @desc    Accept Quotation & Pay — creates Order, Payment, and OrderTracking
// @route   POST /api/orders/accept-and-pay
// @access  Private
exports.createPaymentAndOrder = async (req, res) => {
  try {
    const { quotationId, paymentMethod, shippingAddress } = req.body;
    if (!quotationId || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'quotationId and paymentMethod are required' });
    }

    let quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      quotation = await Quotation.findOne({ designRequestId: quotationId });
    }

    let vendor, amount, designType, designRequestId;

    if (quotation) {
      if (quotation.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Quotation is not pending approval' });
      }
      quotation.status = 'approved';
      await quotation.save();
      vendor = await Vendor.findById(quotation.vendorId);
      amount = quotation.budgetAmount;
      designType = quotation.designType;
      designRequestId = quotation.designRequestId;
    } else {
      // No Quotation doc found — look up design request directly
      let designReq = await ManualDesignRequest.findById(quotationId);
      if (!designReq) {
        designReq = await AIDesignRequest.findById(quotationId);
      }
      if (!designReq) {
        return res.status(404).json({ success: false, message: 'Request not found. Please ensure a quotation has been sent by the vendor.' });
      }
      vendor = await Vendor.findById(designReq.assignedVendorId);
      amount = Number(designReq.quotationAmount) || 0;
      designType = designReq.requestType === 'AI Generated' ? 'ai' : 'manual';
      designRequestId = designReq._id;
    }

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const order = await Order.create({
      userId: req.user.id,
      vendorId: vendor._id,
      orderType: 'custom_design',
      referenceId: designRequestId,
      totalAmount: amount,
      shippingAddress: shippingAddress || 'Address on file',
      orderStatus: 'Awaiting Vendor Verification',
      paymentStatus: 'paid'
    });

    // Create a Quotation if one didn't exist
    if (!quotation) {
      quotation = await Quotation.create({
        vendorId: vendor._id,
        userId: req.user.id,
        designType,
        designRequestId,
        budgetAmount: amount,
        materialsBreakdown: '',
        estimatedTime: '',
        status: 'approved'
      });
    }

    const txnId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

    const payment = await Payment.create({
      orderId: order._id,
      userId: req.user.id,
      amount,
      paymentMethod,
      transactionId: txnId,
      status: 'success'
    });

    const user = await User.findById(req.user.id).select('name');

    const tracking = await OrderTracking.create({
      orderId: order._id,
      userId: req.user.id,
      vendorId: vendor._id,
      customerName: user ? user.name : 'Customer',
      vendorName: vendor.companyName || 'Vendor',
      amount,
      paymentMethod,
      transactionId: txnId,
      paymentDate: new Date(),
      paymentStatus: 'Completed',
      orderStatus: 'Awaiting Vendor Verification',
      stages: [
        { status: 'Awaiting Vendor Verification', timestamp: new Date(), updatedBy: 'user' }
      ]
    });

    const shortId = order._id.toString().slice(-6);
    await Notification.create({
      userId: req.user.id,
      message: `Payment successful for Order #${shortId}! Awaiting vendor verification.`,
      type: 'success'
    });
    await Notification.create({
      userId: vendor.userId,
      message: `Payment received for Order #${shortId}. Amount: ₹${quotation.budgetAmount}. Method: ${paymentMethod}. TXN: ${txnId}. Please verify payment.`,
      type: 'info'
    });
    await Notification.create({
      isAdmin: true,
      message: `Payment completed for Order #${shortId}. Amount: ₹${quotation.budgetAmount}. Commission: ₹${(quotation.budgetAmount * 0.15).toFixed(2)}`,
      type: 'info'
    });

    res.status(201).json({
      success: true,
      data: { order, payment, tracking }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update unified order tracking — pushes stage, updates Order + OrderTracking
// @route   POST /api/orders/tracking/:orderId/update
// @access  Private (vendor, admin)
exports.updateOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, progressImage, deliveryDetails, installationDetails, note } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (status) {
      order.orderStatus = status;
      await order.save();
    }

    let tracking = await OrderTracking.findOne({ orderId });
    if (!tracking) {
      const user = await User.findById(order.userId).select('name');
      const vendor = await Vendor.findById(order.vendorId).select('companyName');
      tracking = new OrderTracking({
        orderId,
        userId: order.userId,
        vendorId: order.vendorId,
        customerName: user?.name || 'Customer',
        vendorName: vendor?.companyName || 'Vendor',
        amount: order.totalAmount || order.quotationAmount || 0,
        paymentMethod: 'UPI',
        transactionId: 'TXN' + Date.now(),
        orderStatus: status || order.orderStatus,
        stages: []
      });
    }

    const role = req.user.role === 'vendor' ? 'vendor' : req.user.role === 'admin' ? 'admin' : 'system';

    if (status) {
      tracking.stages.push({ status, timestamp: new Date(), updatedBy: role, note: note || '' });
      tracking.orderStatus = status;
    }

    if (progressImage) {
      tracking.progressImages.push(progressImage);
    }

    if (deliveryDetails) {
      tracking.deliveryDetails = { ...tracking.deliveryDetails, ...deliveryDetails };
    }

    if (installationDetails) {
      tracking.installationDetails = { ...tracking.installationDetails, ...installationDetails };
    }

    if (req.body.expectedDeliveryDate) {
      tracking.expectedDeliveryDate = req.body.expectedDeliveryDate;
    }

    await tracking.save();

    const shortId = order._id.toString().slice(-6);
    await Notification.create({
      userId: order.userId,
      message: `Order #${shortId} updated: ${status || 'details changed'}`,
      type: 'info'
    });
    await Notification.create({
      isAdmin: true,
      message: `Order #${shortId} tracking updated to: ${status || 'details changed'}`,
      type: 'info'
    });

    res.status(200).json({ success: true, data: { order, tracking } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unified order tracking — returns Order + OrderTracking together
// @route   GET /api/orders/tracking/:orderId
// @access  Private
exports.getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone')
      .populate('vendorId', 'companyName');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const tracking = await OrderTracking.findOne({ orderId });
    if (!tracking) return res.status(404).json({ success: false, message: 'Order tracking not found' });

    res.status(200).json({
      success: true,
      data: {
        order,
        tracking,
        stages: tracking.stages,
        progressImages: tracking.progressImages
      }
    });
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

    let finalUserId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(finalUserId)) {
      finalUserId = new mongoose.Types.ObjectId('65c2b18a7c6b4b1c92949765');
    }

    let finalVendorId = vendorId;
    if (!mongoose.Types.ObjectId.isValid(finalVendorId)) {
      finalVendorId = new mongoose.Types.ObjectId('65c2b18a7c6b4b1c92949765');
    }

    const reviewData = { userId: finalUserId, vendorId: finalVendorId, rating, comment };
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      reviewData.productId = productId;
    }

    const review = await Review.create(reviewData);
    
    try {
      const vendor = await Vendor.findById(finalVendorId);
      
      let productName = "a product";
      if (reviewData.productId) {
        const Product = require('../models/Product');
        const product = await Product.findById(reviewData.productId);
        if (product) productName = product.title;
      }

      if (vendor) {
        await Notification.create({ userId: vendor.userId, message: `New ${rating}-star review received for ${productName}!`, type: 'info' });
      }
      
      const adminMessage = `New Product Review: Customer reviewed ${productName} (Vendor: ${vendor?.companyName || 'Vendor'}) with ${rating} stars: "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`;
      await Notification.create({ isAdmin: true, message: adminMessage, type: 'info' });
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

// @desc    Get user's reviews
// @route   GET /api/orders/reviews/user
// @access  Private
exports.getUserReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    const reviews = await Review.find({ userId: req.user.id }).populate('vendorId', 'companyName').sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
