const express = require('express');
// Fixing typo:
const router = require('express').Router();
const { getCart, addToCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getCart).post(addToCart).delete(clearCart);

module.exports = router;
