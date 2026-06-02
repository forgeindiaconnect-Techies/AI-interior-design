const router = require('express').Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/marketplaceOrderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').post(createOrder);
router.route('/myorders').get(getMyOrders);
router.route('/vendor').get(authorize('vendor', 'delivery', 'installation'), getVendorOrders);
router.route('/all').get(authorize('admin'), getAllOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(authorize('vendor', 'delivery', 'installation', 'admin'), updateOrderStatus);

module.exports = router;
