const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getUserOrders, 
  approveQuotation, 
  updateManufacturingStatus, 
  updateDeliveryStatus, 
  updateInstallationStatus,
  createPayment,
  createPaymentAndOrder,
  updateOrderTracking,
  getOrderTracking,
  createReview,
  getUserReviews,
  createTicket,
  getSyncedOrders,
  updateSyncedOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Prototype Sync Routes
router.get('/sync', getSyncedOrders);
router.put('/sync', updateSyncedOrder);

router.use(protect);

router.post('/', createOrder);
router.get('/user', getUserOrders);
router.post('/approve-budget', approveQuotation);

router.put('/manufacturing/:id', authorize('vendor', 'manufacturer', 'admin', 'user'), updateManufacturingStatus);
router.put('/delivery/:id', authorize('vendor', 'delivery', 'admin', 'user'), updateDeliveryStatus);
router.put('/installation/:id', authorize('vendor', 'installation', 'admin', 'user'), updateInstallationStatus);

router.post('/payment', createPayment);
router.post('/accept-and-pay', createPaymentAndOrder);
router.post('/tracking/:orderId/update', authorize('vendor', 'admin'), updateOrderTracking);
router.get('/tracking/:orderId', getOrderTracking);
router.post('/review', createReview);
router.get('/reviews/user', getUserReviews);
router.post('/ticket', createTicket);

module.exports = router;
