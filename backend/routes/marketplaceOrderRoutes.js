const router = require('express').Router();
const { createOrder, getMyOrders } = require('../controllers/marketplaceOrderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').post(createOrder);
router.route('/myorders').get(getMyOrders);

module.exports = router;
