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
  getKYCStatus,
  submitKYC,
  getDepositStatus,
  paySecurityDeposit
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

// KYC routes
router.get('/kyc', getKYCStatus);
router.post('/kyc', submitKYC);

// Deposit routes
router.get('/deposit', getDepositStatus);
router.post('/deposit', paySecurityDeposit);

module.exports = router;
