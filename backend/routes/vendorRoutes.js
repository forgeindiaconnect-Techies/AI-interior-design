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
  submitStoreSetup
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('vendor', 'manufacturer', 'delivery', 'installation'));

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
router.get('/reviews', require('../controllers/vendorController').getVendorReviews);

module.exports = router;

