const express = require('express');
const router = express.Router();
const { 
  getStats, 
  verifyVendor, 
  suspendUser, 
  assignPartner, 
  sendSystemNotification, 
  getTickets, 
  updateTicketStatus,
  getManagementData,
  getAllKYC,
  updateKYCStatus,
  getAllDeposits,
  verifyDepositStatus,
  updateVendorActivation,
  reactivateUser,
  blockUser,
  deleteUser,
  getUserOrders,
  getManufacturerLoad,
  assignManufacturerOrder,
  approveManufacturer,
  suspendManufacturer,
  getManufacturerPayments,
  updateDeliveryStatus,
  assignAIDesignVendor,
  convertToAIDesignOrder,
  updateAIDesignAdminStatus,
  assignManualDesignVendor,
  assignManualDesignDesigner,
  updateManualDesignStatus,
  approveManualDesign,
  rejectManualDesign,
  assignDesignerRequest,
  updateDesignerRequestStatus,
  updateOrderStatus,
  cancelOrder,
  getTransactions,
  updateCommissionRate,
  disbursePayout,
  getSubAdmins,
  addSubAdmin,
  updateSubAdminPermissions,
  deleteSubAdmin
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/management-data', getManagementData);
router.put('/vendor-approval/:id', verifyVendor);
router.put('/suspend-user/:id', suspendUser);
router.put('/reactivate-user/:id', reactivateUser);
router.put('/block-user/:id', blockUser);
router.delete('/delete-user/:id', deleteUser);
router.get('/users/:id/orders', getUserOrders);
router.post('/assign-partner', assignPartner);
router.post('/system-notification', sendSystemNotification);
router.get('/tickets', getTickets);
router.put('/tickets/:id', updateTicketStatus);

// Order Management Routes
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/cancel', cancelOrder);

// Manufacturer Administration Routes
router.get('/manufacturers/:id/load', getManufacturerLoad);
router.post('/manufacturers/assign-order', assignManufacturerOrder);
router.put('/manufacturers/:id/approve', approveManufacturer);
router.put('/manufacturers/:id/suspend', suspendManufacturer);
router.get('/manufacturers/:id/payments', getManufacturerPayments);

// KYC Approval Routes
router.get('/kyc', getAllKYC);
router.put('/kyc/:id', updateKYCStatus);

// Security Deposit Routes
router.get('/deposits', getAllDeposits);
router.put('/deposits/:id', verifyDepositStatus);

// Vendor Activation Control Route
router.put('/vendor-activation/:id', updateVendorActivation);

// Logistics & Delivery Status Route
router.put('/delivery/update-status', updateDeliveryStatus);

// AI Studio Design Routes
router.put('/ai-designs/:id/assign-vendor', assignAIDesignVendor);
router.post('/ai-designs/:id/convert-order', convertToAIDesignOrder);
router.put('/ai-designs/:id/status', updateAIDesignAdminStatus);

// Manual Design Request Routes
router.put('/manual-designs/:id/assign-vendor', assignManualDesignVendor);
router.put('/manual-designs/:id/assign-designer', assignManualDesignDesigner);
router.put('/manual-designs/:id/status', updateManualDesignStatus);
router.put('/manual-designs/:id/approve', approveManualDesign);
router.put('/manual-designs/:id/reject', rejectManualDesign);

// Interior Designer Request Routes
router.put('/designer-requests/:id/assign', assignDesignerRequest);
router.put('/designer-requests/:id/status', updateDesignerRequestStatus);

// Payments & Commission Routes
router.get('/transactions', getTransactions);
router.put('/commission-rate', updateCommissionRate);
router.post('/transactions/disburse', disbursePayout);

// Roles & Permissions Scope Control Routes
router.get('/permissions', getSubAdmins);
router.post('/permissions', addSubAdmin);
router.put('/permissions/:id', updateSubAdminPermissions);
router.delete('/permissions/:id', deleteSubAdmin);

module.exports = router;
