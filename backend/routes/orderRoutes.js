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
  createReview,
  createTicket
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/user', getUserOrders);
router.post('/approve-budget', approveQuotation);

router.put('/manufacturing/:id', authorize('vendor', 'manufacturer', 'admin', 'user'), updateManufacturingStatus);
router.put('/delivery/:id', authorize('vendor', 'delivery', 'admin', 'user'), updateDeliveryStatus);
router.put('/installation/:id', authorize('vendor', 'installation', 'admin', 'user'), updateInstallationStatus);

router.post('/payment', createPayment);
router.post('/review', createReview);
router.post('/ticket', createTicket);

module.exports = router;
