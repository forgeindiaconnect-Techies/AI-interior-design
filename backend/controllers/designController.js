const AIDesignRequest = require('../models/AIDesignRequest');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const InteriorDesignerRequest = require('../models/InteriorDesignerRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');

let mockManualDesigns = [
  {
    _id: 'man_101',
    userId: { name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 (555) 234-5678' },
    roomType: 'Living Room',
    style: 'Modern Minimalist',
    budget: '₹50,000 - ₹1,00,000',
    size: '400 sq ft',
    materials: 'Solid Teak Wood, Italian Marble',
    requirements: 'Need custom L-shaped sectional sofa with built-in storage and matching marble coffee table.',
    referenceImages: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600'],
    timeline: 'Within 1 Month',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'man_102',
    userId: { name: 'Michael Chang', email: 'm.chang@example.com', phone: '+1 (555) 987-6543' },
    roomType: 'Bedroom',
    style: 'Nordic Scandinavian',
    budget: '₹1,00,000 - ₹2,50,000',
    size: '300 sq ft',
    materials: 'Oak Wood, Linen Upholstery',
    requirements: 'Custom king size bed frame with fluted headboard and two floating nightstands.',
    referenceImages: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'],
    timeline: 'Flexible',
    status: 'Vendor Review',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

exports.mockManualDesigns = mockManualDesigns;

// @desc    Upload room photo & generate AI Design
// @route   POST /api/designs/ai
// @access  Private
exports.createAIDesign = async (req, res) => {
  try {
    const { roomType, originalImage } = req.body;

    const mockGeneratedImages = {
      Kitchen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60',
      'Living Room': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
      Bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=60',
      Bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=60'
    };

    const mockPalettes = {
      Kitchen: ['#2F3E46', '#8B5E3C', '#F8F5F0', '#D4A373'],
      'Living Room': ['#D4A373', '#2A9D8F', '#F8F5F0', '#1F2937'],
      Bedroom: ['#8B5E3C', '#E9C46A', '#F8F5F0', '#6B7280'],
      Bathroom: ['#2A9D8F', '#2F3E46', '#FFFFFF', '#D4A373']
    };

    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const newAi = {
        _id: 'ai_' + Date.now(),
        userId: req.user.id,
        roomType: roomType || 'Living Room',
        originalImage,
        generatedImage: mockGeneratedImages[roomType] || mockGeneratedImages['Living Room'],
        aiSuggestion: {
          furniture: ['Luxury Velvet Sofa', 'Minimalist Coffee Table', 'Nordic Floor Lamp', 'Abstract Wall Art'],
          materials: ['Solid Teak Wood', 'Brushed Brass', 'Italian Marble', 'Linen Upholstery'],
          colorPalette: mockPalettes[roomType] || mockPalettes['Living Room'],
          budgetEstimate: Math.floor(Math.random() * 3000) + 2000
        },
        status: 'generated',
        createdAt: new Date().toISOString()
      };
      return res.status(201).json({ success: true, data: newAi });
    }

    const aiDesign = await AIDesignRequest.create({
      userId: req.user.id,
      roomType: roomType || 'Living Room',
      originalImage,
      generatedImage: mockGeneratedImages[roomType] || mockGeneratedImages['Living Room'],
      aiSuggestion: {
        furniture: ['Luxury Velvet Sofa', 'Minimalist Coffee Table', 'Nordic Floor Lamp', 'Abstract Wall Art'],
        materials: ['Solid Teak Wood', 'Brushed Brass', 'Italian Marble', 'Linen Upholstery'],
        colorPalette: mockPalettes[roomType] || mockPalettes['Living Room'],
        budgetEstimate: Math.floor(Math.random() * 3000) + 2000
      },
      status: 'generated'
    });

    await Notification.create({ userId: req.user.id, message: 'Photo uploaded successfully. AI design is ready!' });
    await Notification.create({ isAdmin: true, message: `New AI design generated for user ${req.user.name}` });

    res.status(201).json({ success: true, data: aiDesign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user AI designs
// @route   GET /api/designs/ai
// @access  Private
exports.getUserAIDesigns = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const mockDesigns = [
        {
          _id: 'ai_design_1',
          roomType: 'Living Room',
          originalImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
          generatedImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
          aiSuggestion: {
            furniture: ['Luxury Velvet Sofa', 'Minimalist Coffee Table', 'Nordic Floor Lamp'],
            materials: ['Solid Teak Wood', 'Brushed Brass', 'Italian Marble'],
            colorPalette: ['#D4A373', '#2A9D8F', '#F8F5F0', '#1F2937'],
            budgetEstimate: 2850
          },
          status: 'generated',
          createdAt: new Date().toISOString()
        }
      ];
      return res.status(200).json({ success: true, data: mockDesigns });
    }

    const designs = await AIDesignRequest.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: designs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update AI design status
// @route   PUT /api/designs/ai/:id
// @access  Private
exports.updateAIDesignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const updated = {
        _id: req.params.id,
        roomType: 'Living Room',
        generatedImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
        aiSuggestion: {
          furniture: ['Luxury Velvet Sofa', 'Minimalist Coffee Table', 'Nordic Floor Lamp', 'Premium Accent Chair'],
          materials: ['Solid Teak Wood', 'Brushed Brass', 'Italian Marble'],
          budgetEstimate: status === 'regenerated' ? 3200 : 2850
        },
        status: status === 'regenerated' ? 'generated' : status
      };
      return res.status(200).json({ success: true, data: updated });
    }

    let design = await AIDesignRequest.findById(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });

    if (status === 'regenerated') {
      design.aiSuggestion.budgetEstimate = Math.floor(Math.random() * 3000) + 2500;
      design.aiSuggestion.furniture.push('Premium Accent Chair');
      await design.save();
      return res.status(200).json({ success: true, data: design });
    }

    design.status = status;
    await design.save();

    if (status === 'accepted') {
      await Notification.create({ isAdmin: true, message: `User ${req.user.name} accepted AI design.` });
    }
    res.status(200).json({ success: true, data: design });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Manual Design Request
// @route   POST /api/designs/manual
// @access  Private
exports.createManualDesign = async (req, res) => {
  try {
    if (req.user?.id?.startsWith('mock_user_id') || global.MOCK_DB || mongoose.connection.readyState !== 1) {
      const newMan = { 
        _id: 'man_' + Date.now(), 
        userId: { name: req.user?.name || 'Customer Demo', email: req.user?.email || 'user@example.com', phone: '+1 (555) 019-2834' },
        ...req.body, 
        status: 'Submitted',
        createdAt: new Date().toISOString()
      };
      mockManualDesigns.unshift(newMan);
      return res.status(201).json({ success: true, data: newMan });
    }

    const manualDesign = await ManualDesignRequest.create({ userId: req.user.id, ...req.body, status: 'Submitted' });
    
    // Notify Admin
    await Notification.create({ isAdmin: true, message: `New manual design request submitted by ${req.user.name || 'User'}.` });
    
    // Notify Vendors
    const vendors = await User.find({ role: 'vendor' });
    const vendorNotifications = vendors.map(v => ({
      userId: v._id,
      message: `New manual design request received in your area.`
    }));
    if (vendorNotifications.length > 0) {
      await Notification.insertMany(vendorNotifications);
    }

    res.status(201).json({ success: true, data: manualDesign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user manual designs
// @route   GET /api/designs/manual
// @access  Private
exports.getUserManualDesigns = async (req, res) => {
  try {
    let designs = [];
    if (!req.user?.id?.startsWith('mock_user_id') && !global.MOCK_DB && mongoose.connection.readyState === 1) {
      try {
        designs = await ManualDesignRequest.find({ userId: req.user.id }).populate('assignedVendorId').sort('-createdAt').lean();
      } catch (err) {
        console.error('DB fetch failed in getUserManualDesigns:', err);
      }
    }

    const merged = [...mockManualDesigns];
    designs.forEach(d => {
      if (!merged.some(m => m._id.toString() === d._id.toString())) {
        merged.push(d);
      }
    });

    res.status(200).json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Interior Designer Request
// @route   POST /api/designs/designer
// @access  Private
exports.createDesignerRequest = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(201).json({ success: true, data: { _id: 'des_' + Date.now(), ...req.body } });
    }

    const request = await InteriorDesignerRequest.create({ userId: req.user.id, ...req.body });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
