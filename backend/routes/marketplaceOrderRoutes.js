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

// Debug route
router.route('/test-error').get(async (req, res) => {
  try {
    const MarketplaceOrder = require('../models/MarketplaceOrder');
    // Also try to require Product and Vendor explicitly as the controller does
    require('../models/Product');
    require('../models/Vendor');
    require('../models/User');
    
    const orders = await MarketplaceOrder.find({})
      .populate('items.productId')
      .populate('items.vendorId', 'companyName')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

router.use(protect);
router.route('/').post(createOrder);
router.route('/myorders').get(getMyOrders);
router.route('/vendor').get(authorize('vendor', 'delivery', 'installation'), getVendorOrders);
router.route('/all').get(authorize('admin'), getAllOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(authorize('vendor', 'delivery', 'installation', 'admin'), updateOrderStatus);

module.exports = router;
