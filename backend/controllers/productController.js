const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');



// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, vendorId } = req.query;

    // Try real DB first if connected
    if (!global.MOCK_DB && mongoose.connection.readyState === 1) {
      try {
        let query = { approvalStatus: 'Approved' };
        if (category && category !== 'All') query.category = category;
        if (vendorId) query.vendorId = vendorId;
        const products = await Product.find(query).populate('vendorId', 'companyName rating');
        return res.status(200).json({ success: true, count: products.length, data: products });
      } catch (dbErr) {
        console.warn('DB products query failed, falling back to mock:', dbErr.message);
      }
    }

    // Fallback mock data
    const mockProducts = [
      {
        _id: 'mock_1',
        title: 'Velvet Emerald Sofa',
        description: 'Luxurious velvet sofa with emerald green upholstery and solid wood frame.',
        price: 1299,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'],
        category: 'Living Room',
        material: 'Velvet',
        size: '84x35x35',
        stock: 10,
        rating: 4.8,
        reviewsCount: 124,
        approvalStatus: 'Approved',
        vendorId: { _id: 'mock_vendor_1', companyName: 'Artisan Workshop' },
        createdAt: new Date()
      },
      {
        _id: 'mock_2',
        title: 'Minimalist Teak Coffee Table',
        description: 'Clean lines and natural teak wood make this coffee table a timeless piece.',
        price: 449,
        images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600&auto=format&fit=crop&q=60'],
        category: 'Living Room',
        material: 'Teak Wood',
        size: '40x40x18',
        stock: 15,
        rating: 4.5,
        reviewsCount: 89,
        approvalStatus: 'Approved',
        vendorId: { _id: 'mock_vendor_1', companyName: 'Artisan Workshop' },
        createdAt: new Date()
      }
    ];

    let filtered = mockProducts;
    if (category && category !== 'All') {
      filtered = mockProducts.filter(p => p.category === category);
    }
    if (vendorId) {
      filtered = mockProducts.filter(p => p.vendorId._id === vendorId || p.vendorId === vendorId);
    }

    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    // Mock data fallback
    if (global.MOCK_DB || mongoose.connection.readyState !== 1) {
      const mockProducts = [
        {
          _id: 'mock_1',
          title: 'Velvet Emerald Sofa',
          description: 'Luxurious velvet sofa with emerald green upholstery and solid wood frame.',
          price: 1299,
          images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'],
          category: 'Living Room',
          material: 'Velvet',
          size: '84x35x35',
          stock: 10,
          rating: 4.8,
          reviewsCount: 124,
          approvalStatus: 'Approved',
          vendorId: { _id: 'mock_vendor_1', companyName: 'Artisan Workshop' },
          createdAt: new Date()
        },
        {
          _id: 'mock_2',
          title: 'Minimalist Teak Coffee Table',
          description: 'Clean lines and natural teak wood make this coffee table a timeless piece.',
          price: 449,
          images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600&auto=format&fit=crop&q=60'],
          category: 'Living Room',
          material: 'Teak Wood',
          size: '40x40x18',
          stock: 15,
          rating: 4.5,
          reviewsCount: 89,
          approvalStatus: 'Approved',
          vendorId: { _id: 'mock_vendor_1', companyName: 'Artisan Workshop' },
          createdAt: new Date()
        }
      ];
      
      const product = mockProducts.find(p => p._id === req.params.id || p._id.toString() === req.params.id);
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      // Populate vendorId for consistency
      const populatedProduct = { ...product };
      if (!populatedProduct.vendorId) {
        populatedProduct.vendorId = { _id: 'mock_vendor_1', companyName: 'Artisan Workshop' };
      }
      
      return res.status(200).json({ success: true, data: populatedProduct });
    }

    const product = await Product.findOne({ _id: req.params.id, approvalStatus: 'Approved' }).populate(
      'vendorId',
      'companyName rating description'
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor/Admin)
exports.createProduct = async (req, res) => {
  try {


    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only vendors can create products' });
    }

    req.body.vendorId = vendor ? vendor._id : req.body.vendorId;

    // Vendor-listed products should go live immediately.
    if (req.user.role === 'vendor' && !req.body.approvalStatus) {
      req.body.approvalStatus = 'Approved';
    }

    const product = await Product.create(req.body);

    // Notify admins about new product listing.
    const vendorForNotif = vendor || (await Vendor.findById(product.vendorId).select('companyName'));
    if (product.approvalStatus === 'Approved') {
      await Notification.create({
        isAdmin: true,
        message: `New ready-made product listed: ${product.title} by ${vendorForNotif?.companyName || 'Vendor'}.`,
        type: 'info'
      });
    }

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


    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (product.vendorId.toString() !== vendor?._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });

    // Notify admins about product update.
    const vendorForNotif = vendor || (await Vendor.findById(product.vendorId).select('companyName'));
    await Notification.create({
      isAdmin: true,
      message: `Product updated: ${product.title} by ${vendorForNotif?.companyName || 'Vendor'}.`,
      type: 'info'
    });

    // Low stock alert if applicable.
    const newStock = product.stock ?? 0;
    const threshold = product.lowStockThreshold ?? 5;
    if (newStock > 0 && newStock <= threshold) {
      await Notification.create({
        isAdmin: true,
        message: `Low stock alert: ${product.title} has only ${newStock} units remaining (threshold: ${threshold}).`,
        type: 'warning'
      });
    }

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


    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (product.vendorId.toString() !== vendor?._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    const vendorForNotif = vendor || (await Vendor.findById(product.vendorId).select('companyName'));
    const deletedTitle = product.title;

    await product.deleteOne();

    // Notify admins about product deletion.
    await Notification.create({
      isAdmin: true,
      message: `Product deleted: ${deletedTitle} by ${vendorForNotif?.companyName || 'Vendor'}.`,
      type: 'info'
    });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
