const express = require('express');
const router = express.Router();
const { 
  getVendorProfile, 
  getCustomRequests, 
  sendQuotation, 
  suggestVendor, 
  forwardToManufacturer,
  acceptRequest,
  rejectRequest,
  getVerificationStatus,
  submitVerification,
  getStoreSetupStatus,
  submitStoreSetup,
  updateOrderStatus,
  dispatchOrder,
  approveReturn,
  verifyPayment,
  deleteVendorOrder
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('vendor', 'manufacturer', 'delivery', 'installation', 'admin'));

router.get('/profile', getVendorProfile);
router.get('/requests', getCustomRequests);
router.post('/requests/:id/accept', acceptRequest);
router.post('/requests/:id/reject', rejectRequest);
router.post('/quotations', sendQuotation);
router.post('/suggest-vendor', suggestVendor);
router.post('/forward-manufacturer', forwardToManufacturer);

// Verification routes
router.get('/verification', getVerificationStatus);
router.post('/verification', submitVerification);

// Store Setup routes
router.get('/store-setup', getStoreSetupStatus);
router.post('/store-setup', submitStoreSetup);

// Vendor Orders route
router.get('/orders', require('../controllers/vendorController').getVendorOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteVendorOrder);
router.put('/orders/:id/dispatch', dispatchOrder);
router.put('/orders/:id/return', approveReturn);
router.post('/verify-payment/:orderId', verifyPayment);

router.get('/reviews', require('../controllers/vendorController').getVendorReviews);

// Payout routes
router.post('/payout', require('../controllers/vendorController').createPayoutRequest);
router.get('/payout', require('../controllers/vendorController').getVendorPayouts);

module.exports = router;
