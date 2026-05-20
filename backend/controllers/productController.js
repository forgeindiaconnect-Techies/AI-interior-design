const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');

let mockProducts = [
  { _id: 'prod_1', title: 'Velvet Emerald Sofa', price: 1299, category: 'Living Room', material: 'Velvet/Teak', size: '84x36', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'], vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' }, description: 'Premium luxury velvet sofa.', stockStatus: 'In Stock' },
  { _id: 'prod_2', title: 'Minimalist Teak Coffee Table', price: 449, category: 'Living Room', material: 'Teak Wood', size: '48x24', images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600&auto=format&fit=crop&q=60'], vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' }, description: 'Solid teak wood coffee table.', stockStatus: 'In Stock' },
  { _id: 'prod_3', title: 'Nordic Oak Dining Chair', price: 210, category: 'Dining Room', material: 'Oak Wood', size: '20x20', images: ['https://images.unsplash.com/photo-1503642551022-c011aafb3c88?w=600&auto=format&fit=crop&q=60'], vendorId: { _id: 'vendor_2', companyName: 'Nordic Design Ltd' }, description: 'Ergonomic oak dining chair.', stockStatus: 'In Stock' },
  { _id: 'prod_4', title: 'Modern Brass Floor Lamp', price: 320, category: 'Lighting', material: 'Brass', size: '60" high', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60'], vendorId: { _id: 'vendor_2', companyName: 'Nordic Design Ltd' }, description: 'Elegant brass floor lamp.', stockStatus: 'In Stock' },
  { _id: 'prod_5', title: 'Luxury Marble Side Table', price: 580, category: 'Living Room', material: 'Marble/Metal', size: '18x18', images: ['https://images.unsplash.com/photo-1630585304653-5355a297e61e?w=600&auto=format&fit=crop&q=60'], vendorId: { _id: 'vendor_3', companyName: 'Luxury Living Inc' }, description: 'Genuine Italian marble side table.', stockStatus: 'In Stock' },
  { _id: 'prod_6', title: 'Ergonomic Lounge Chair', price: 890, category: 'Bedroom', material: 'Leather/Walnut', size: '34x34', images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60'], vendorId: { _id: 'vendor_3', companyName: 'Luxury Living Inc' }, description: 'Premium leather lounge chair.', stockStatus: 'In Stock' }
];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const { vendorId, category } = req.query;
      let list = [...mockProducts];
      if (category && category !== 'All') list = list.filter(p => p.category === category);
      if (vendorId && vendorId !== 'mock') {
        list = list.filter(p => p.vendorId?._id === vendorId || p.vendorId === vendorId || p.vendorId?._id === 'mock_vendor_id_123');
      }
      return res.status(200).json({ success: true, count: list.length, data: list });
    }

    const { category, vendorId } = req.query;
    let query = {};
    if (category) query.category = category;
    if (vendorId) query.vendorId = vendorId;

    const products = await Product.find(query).populate('vendorId', 'companyName rating');
    
    // If database is connected but contains no products, fallback to mock products
    if (products.length === 0) {
      let list = [...mockProducts];
      if (category && category !== 'All') list = list.filter(p => p.category === category);
      if (vendorId && vendorId !== 'mock') {
        list = list.filter(p => p.vendorId?._id === vendorId || p.vendorId === vendorId || p.vendorId?._id === 'mock_vendor_id_123');
      }
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
    
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const p = mockProducts.find(x => x._id === req.params.id) || mockProducts[0];
      return res.status(200).json({ success: true, data: p });
    }

    // Try to find in database if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const product = await Product.findById(req.params.id).populate('vendorId', 'companyName rating description');
      if (product) {
        return res.status(200).json({ success: true, data: product });
      }
    }

    // If not found in database or not a valid ObjectId, fallback to mock products
    const p = mockProducts.find(x => x._id === req.params.id);
    if (p) {
      return res.status(200).json({ success: true, data: p });
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    // If database lookup throws an error (e.g. cast error), fallback to mock products as last resort
    const p = mockProducts.find(x => x._id === req.params.id);
    if (p) {
      return res.status(200).json({ success: true, data: p });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor/Admin)
exports.createProduct = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const newProd = {
        _id: 'prod_' + Date.now(),
        ...req.body,
        vendorId: { _id: req.body.vendorId || req.user?.id || 'mock_vendor_id_123', companyName: req.user?.name || 'Artisan Workshop' },
        stockStatus: req.body.stockStatus || 'In Stock'
      };
      mockProducts.unshift(newProd);
      return res.status(201).json({ success: true, data: newProd });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only vendors can create products' });
    }

    req.body.vendorId = vendor ? vendor._id : req.body.vendorId;
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor/Admin)
exports.updateProduct = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const idx = mockProducts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) {
        mockProducts[idx] = { ...mockProducts[idx], ...req.body };
      }
      return res.status(200).json({ success: true, data: mockProducts[idx] || { _id: req.params.id, ...req.body } });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (product.vendorId.toString() !== vendor?._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin)
exports.deleteProduct = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      mockProducts = mockProducts.filter(p => p._id !== req.params.id);
      return res.status(200).json({ success: true, data: {} });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (product.vendorId.toString() !== vendor?._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
