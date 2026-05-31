const Vendor = require('../models/Vendor');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const ManufacturingOrder = require('../models/ManufacturingOrder');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const { mockManualDesigns } = require('./designController');
const VendorVerification = require('../models/VendorVerification');

// In-memory mock states for Demo Mode
let mockVerification = {};
let mockStoreSetup = {};

const findOrCreateVendorHelper = async (userId) => {
  let vendor = await Vendor.findOne({ userId });
  if (!vendor && mongoose.Types.ObjectId.isValid(userId)) {
    const User = require('../models/User');
    const dbUser = await User.findById(userId);
    vendor = await Vendor.create({
      userId: userId,
      companyName: dbUser?.name ? `${dbUser.name}'s Store` : 'My Store',
      businessType: 'seller',
      isVerified: false,
      accountActivationStatus: 'Pending Verification',
      verificationStatus: 'Pending',
      storeSetupStatus: 'Pending',
      isActive: false,
    });
  }
  return vendor;
};

// @desc    Get vendor profile & stats
// @route   GET /api/vendor/profile
// @access  Private (Vendor)
exports.getVendorProfile = async (req, res) => {
  try {
    if (String(req.user.id).startsWith('mock_')) {
      return res.status(200).json({ 
        success: true, 
        data: {
          vendor: {
            _id: '65c2b18a7c6b4b1c92949765',
            userId: req.user.id,
            companyName: 'Artisan Workshop Demo',
            businessType: req.user.role === 'admin' ? 'seller' : (req.user.role || 'seller'),
            rating: 4.8,
            reviewsCount: 24,
            isVerified: true,
            accountActivationStatus: 'Active',
            verificationStatus: 'Approved',
            storeSetupStatus: 'Approved',
            isActive: true,
            createdAt: new Date()
          },
          stats: {
            totalOrders: 14, totalQuotations: 8,
            revenue: 28500
          }
        } 
      });
    }

    let vendor = await findOrCreateVendorHelper(req.user.id);



    const orders = await Order.find({ vendorId: vendor._id });
    const quotations = await Quotation.find({ vendorId: vendor._id });

    res.status(200).json({ 
      success: true, 
      data: {
        vendor,
        stats: {
          totalOrders: orders.length, totalQuotations: quotations.length,
          revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0)
        }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get custom design requests assigned to vendor
// @route   GET /api/vendor/requests
// @access  Private (Vendor)
exports.getCustomRequests = async (req, res) => {
  try {
    const requests = await ManualDesignRequest.find({}).populate('userId', 'name email phone').sort('-createdAt').lean();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send budget quotation to user
// @route   POST /api/vendor/quotations
// @access  Private (Vendor)
exports.sendQuotation = async (req, res) => {
  try {
    const { userId, designType, designRequestId, budgetAmount, materialsBreakdown, estimatedTime } = req.body;
    if (String(req.user.id).startsWith('mock_')) return res.status(201).json({ success: true, data: { status: 'pending' } });
    const vendor = await findOrCreateVendorHelper(req.user.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });

    const quotation = await Quotation.create({ vendorId: vendor._id, userId, designType, designRequestId, budgetAmount, materialsBreakdown, estimatedTime, status: 'pending' });
    if (designType === 'manual') await ManualDesignRequest.findByIdAndUpdate(designRequestId, { status: 'Quotation Sent' });

    await Notification.create({ userId, message: `Vendor ${vendor.companyName} shared a budget quotation.` });
    await Notification.create({ isAdmin: true, message: `Quotation sent to user by vendor.` });

    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suggest another vendor
// @route   POST /api/vendor/suggest-vendor
// @access  Private (Vendor)
exports.suggestVendor = async (req, res) => {
  try {


    const { requestId, suggestedVendorId, note } = req.body;
    const suggestedVendor = await Vendor.findById(suggestedVendorId);
    const request = await ManualDesignRequest.findById(requestId);
    if (!suggestedVendor || !request) return res.status(404).json({ success: false, message: 'Vendor or Request not found' });

    request.assignedVendorId = suggestedVendorId;
    await request.save();
    await Notification.create({ userId: request.userId, message: `Your design request was forwarded.` });
    res.status(200).json({ success: true, message: 'Forwarded to suggested vendor successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forward custom order to manufacturer
// @route   POST /api/vendor/forward-manufacturer
// @access  Private (Vendor)
exports.forwardToManufacturer = async (req, res) => {
  try {


    const { orderId, manufacturerId, designDetails, measurements, materials, budget } = req.body;
    const manufacturingOrder = await ManufacturingOrder.create({ orderId, manufacturerId, designDetails, measurements, materials, budget, status: 'Pending' });

    const order = await Order.findById(orderId);
    if (order) {
      order.manufacturerId = manufacturerId;
      order.orderStatus = 'Manufacturing';
      await order.save();
      await Notification.create({ userId: order.userId, message: 'Manufacturing started for your order.' });
    }

    await Notification.create({ isAdmin: true, message: `Manufacturer assigned for order ${orderId}.` });
    res.status(201).json({ success: true, data: manufacturingOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept design request
// @route   POST /api/vendor/requests/:id/accept
// @access  Private (Vendor)
exports.acceptRequest = async (req, res) => {
  try {


    const request = await ManualDesignRequest.findByIdAndUpdate(req.params.id, { status: 'Vendor Review' }, { returnDocument: 'after' });
    if (request) {
      await Notification.create({ userId: request.userId, message: `Vendor accepted your design request and is reviewing it.` });
    }
    res.status(200).json({ success: true, message: 'Request accepted successfully', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject design request
// @route   POST /api/vendor/requests/:id/reject
// @access  Private (Vendor)
exports.rejectRequest = async (req, res) => {
  try {


    const request = await ManualDesignRequest.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { returnDocument: 'after' });
    if (request) {
      await Notification.create({ userId: request.userId, message: `Vendor rejected your design request.` });
    }
    res.status(200).json({ success: true, message: 'Request rejected', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Business Verification details
// @route   POST /api/vendor/verification
// @access  Private (Vendor)
exports.submitVerification = async (req, res) => {
  try {
    if (String(req.user.id).startsWith('mock_')) return res.status(201).json({ success: true, message: 'Mock verification submitted', data: { status: 'Under Review' } });
    const vendor = await findOrCreateVendorHelper(req.user.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    let verification = await VendorVerification.findOne({ vendorId: vendor._id });

    if (verification && (verification.status === 'Approved' || verification.status === 'Under Review')) {
      return res.status(409).json({ success: false, message: 'Verification already ' + verification.status.toLowerCase() + '. Cannot resubmit.' });
    }

    const fields = {
      businessName: req.body.businessName,
      ownerName: req.body.ownerName,
      phone: req.body.phone,
      email: req.body.email,
      gstNumber: req.body.gstNumber,
      panNumber: req.body.panNumber,
      businessAddress: req.body.businessAddress,
      idProofUrl: req.body.idProofUrl,
      addressProofUrl: req.body.addressProofUrl,
      gstCertificateUrl: req.body.gstCertificateUrl,
      businessLicenseUrl: req.body.businessLicenseUrl,
      bankDetails: req.body.bankDetails,
      status: 'Pending',
      adminRemarks: '',
      submittedAt: new Date(),
      updatedAt: new Date()
    };

    if (verification) {
      Object.assign(verification, fields);
      await verification.save();
    } else {
      verification = await VendorVerification.create({ vendorId: vendor._id, ...fields });
    }

    vendor.verificationStatus = 'Submitted';
    vendor.accountActivationStatus = 'Verification Submitted';
    await vendor.save();

    await Notification.create({ isAdmin: true, message: `Vendor submitted business verification details.` });

    res.status(201).json({ success: true, message: 'Verification details submitted successfully', data: verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Business Verification status
// @route   GET /api/vendor/verification
// @access  Private (Vendor)
exports.getVerificationStatus = async (req, res) => {
  try {
    if (String(req.user.id).startsWith('mock_')) return res.status(200).json({ success: true, data: { status: 'Not Submitted' } });
    const vendor = await findOrCreateVendorHelper(req.user.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const verification = await VendorVerification.findOne({ vendorId: vendor._id });
    res.status(200).json({ success: true, data: verification || { status: 'Not Submitted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Store/Profile Setup details
// @route   POST /api/vendor/store-setup
// @access  Private (Vendor)
exports.submitStoreSetup = async (req, res) => {
  try {
    const { description, specialization, monthlyCapacity, serviceAreas } = req.body;
    if (String(req.user.id).startsWith('mock_')) return res.status(201).json({ success: true, message: 'Mock store setup submitted', data: { storeSetupStatus: 'Submitted' } });
    const vendor = await findOrCreateVendorHelper(req.user.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    vendor.description = description || vendor.description;
    vendor.specialization = specialization || vendor.specialization;
    vendor.monthlyCapacity = monthlyCapacity || vendor.monthlyCapacity;
    vendor.serviceAreas = serviceAreas || vendor.serviceAreas;
    vendor.storeSetupStatus = 'Submitted';
    vendor.accountActivationStatus = 'Under Review';
    await vendor.save();

    await Notification.create({ isAdmin: true, message: `Vendor ${vendor.companyName} submitted store setup details for approval.` });

    res.status(201).json({ success: true, message: 'Store Setup details submitted successfully', data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Store/Profile Setup status
// @route   GET /api/vendor/store-setup
// @access  Private (Vendor)
exports.getStoreSetupStatus = async (req, res) => {
  try {
    if (String(req.user.id).startsWith('mock_')) return res.status(200).json({ success: true, data: { status: 'Pending', description: '', specialization: 'Woodworks', monthlyCapacity: 50, serviceAreas: [] } });
    const vendor = await findOrCreateVendorHelper(req.user.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    res.status(200).json({ 
      success: true, 
      data: { 
        status: vendor.storeSetupStatus || 'Pending', 
        description: vendor.description, 
        specialization: vendor.specialization, 
        monthlyCapacity: vendor.monthlyCapacity, 
        serviceAreas: vendor.serviceAreas 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get all orders for a vendor
// @route   GET /api/vendor/orders
// @access  Private (Vendor)
exports.getVendorOrders = async (req, res) => {
  try {
    if (String(req.user.id).startsWith('mock_')) return res.status(200).json({ success: true, count: 0, data: [] });
    const vendor = await findOrCreateVendorHelper(req.user.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const standardOrders = await Order.find({ vendorId: vendor._id }).populate('userId', 'name email phone').sort('-createdAt');
    
    res.status(200).json({ success: true, count: standardOrders.length, data: standardOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get vendor reviews
// @route   GET /api/vendor/reviews
// @access  Private (Vendor)
exports.getVendorReviews = async (req, res) => {
  try {
    const Review = require('../models/Review');

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      // Return all reviews so vendor dashboard always shows data
      const allReviews = await Review.find().populate('userId', 'name email').populate('vendorId', 'companyName').sort('-createdAt');
      return res.status(200).json({ success: true, count: allReviews.length, data: allReviews });
    }

    const vendor = await findOrCreateVendorHelper(req.user.id);

    let reviews;
    if (!vendor) {
      // No vendor profile yet — return all platform reviews so dashboard isn't empty
      reviews = await Review.find().populate('userId', 'name email').populate('vendorId', 'companyName').populate('productId', 'title images').sort('-createdAt');
    } else {
      // Return only this vendor's reviews
      reviews = await Review.find({ vendorId: vendor._id }).populate('userId', 'name email').populate('vendorId', 'companyName').populate('productId', 'title images').sort('-createdAt');
      
      // Demo fallback: if the vendor has no reviews, return all reviews so the dashboard isn't completely empty during testing
      if (reviews.length === 0) {
        reviews = await Review.find().populate('userId', 'name email').populate('vendorId', 'companyName').populate('productId', 'title images').sort('-createdAt');
      }
    }

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Update order status
// @route   PUT /api/vendor/orders/:id/status
// @access  Private (Vendor)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Notifications logic is simplified here; full logic can be enhanced if needed
    await Notification.create({ userId: order.userId, message: `Your order #${order._id.toString().slice(-6)} status updated to ${status}.` });
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Dispatch order
// @route   PUT /api/vendor/orders/:id/dispatch
// @access  Private (Vendor)
exports.dispatchOrder = async (req, res) => {
  try {
    const { deliveryPartner, trackingId, installationRequired } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { 
      orderStatus: 'Dispatched',
      trackingId,
      installationRequired
    }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    await Notification.create({ userId: order.userId, message: `Your order #${order._id.toString().slice(-6)} has been dispatched.` });
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve return
// @route   PUT /api/vendor/orders/:id/return
// @access  Private (Vendor)
exports.approveReturn = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { 
      orderStatus: 'Cancelled',
      returnStatus: 'Approved',
      hasReturnRequest: false
    }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    await Notification.create({ userId: order.userId, message: `Your return request for order #${order._id.toString().slice(-6)} has been approved.` });
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
