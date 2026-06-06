const AIDesignRequest = require('../models/AIDesignRequest');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const InteriorDesignerRequest = require('../models/InteriorDesignerRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');
const Replicate = require('replicate');
const axios = require('axios');

let mockManualDesigns = [
  {
    _id: 'man_101',
    requestType: 'Manual Design',
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
    requestType: 'Manual Design',
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
    const { roomType, originalImage, generatedImage, aiSuggestion, analysis } = req.body;

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

    const mockAnalyses = {
      'Living Room': {
        detectedRoomType: 'Living Room',
        detectedItems: ['Sofa', 'Coffee Table', 'Floor Lamp', 'Window'],
        lightingAnalysis: 'Moderate natural light from side window, soft shadows in corners.',
        colorProfile: ['Warm Beige', 'Natural Oak', 'Charcoal Gray'],
        spaceUtilization: 'Low clutter, balanced spatial flow.',
        recommendations: [
          'Retain sofa footprint but replace fabric texture with premium linen.',
          'Contrast slate grey elements with warm teak wood accents.',
          'Introduce warm brass wall sconces to elevate low-light areas.'
        ]
      },
      Bedroom: {
        detectedRoomType: 'Bedroom',
        detectedItems: ['Bed Frame', 'Nightstand', 'Wardrobe', 'Pillow'],
        lightingAnalysis: 'Soft diffused warm lighting, minimal natural glare.',
        colorProfile: ['Walnut Brown', 'Ivory', 'Charcoal'],
        spaceUtilization: 'Compact layout, bedside area optimized.',
        recommendations: [
          'Introduce a platform bed with floating nightstands to save floor space.',
          'Utilize linen sheets and cotton covers for natural warmth.',
          'Add dimmable warm ambient lamps for a relaxed atmosphere.'
        ]
      },
      Kitchen: {
        detectedRoomType: 'Kitchen',
        detectedItems: ['Cabinet', 'Countertop', 'Sink', 'Refrigerator'],
        lightingAnalysis: 'Bright task lighting, overhead fluorescent glare.',
        colorProfile: ['Matte Navy', 'White Quartz', 'Brushed Brass'],
        spaceUtilization: 'L-shape workflow, under-utilized corner cabinet space.',
        recommendations: [
          'Add a marble waterfall kitchen island to bridge workspace gap.',
          'Swap cabinet handles for brushed brass fixtures.',
          'Install under-cabinet LED warm strip lights for functional elegance.'
        ]
      },
      Bathroom: {
        detectedRoomType: 'Bathroom',
        detectedItems: ['Vanity', 'Mirror', 'Shower Glass', 'Toilet'],
        lightingAnalysis: 'Cool LED lighting, high reflective sheen.',
        colorProfile: ['Ceramic White', 'Slate Gray', 'Chrome'],
        spaceUtilization: 'Standard footprint, vanity storage maximized.',
        recommendations: [
          'Introduce a floating oak vanity to increase visual space.',
          'Add an LED anti-fog back-lit circular mirror.',
          'Choose matte black plumbing fixtures for modern contrast.'
        ]
      }
    };

    let finalGeneratedImage = generatedImage || mockGeneratedImages[roomType] || mockGeneratedImages['Living Room'];

    if (process.env.REPLICATE_API_TOKEN && originalImage) {
      try {
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        });
        
        console.log(`Generating AI design for ${roomType} using Replicate...`);
        const output = await replicate.run(
          "jagilley/controlnet-hough:854e87270c1a024da3dbcd569aa1f807205a2786725227f272a806ea95d6771e",
          {
            input: {
              image: originalImage,
              prompt: `A beautiful interior design of a ${roomType}, photorealistic, 8k, modern interior design, high quality, highly detailed`,
              num_samples: "1",
              image_resolution: "512",
              a_prompt: "best quality, extremely detailed",
              n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"
            }
          }
        );
        
        // Output from jagilley/controlnet-hough is usually [annotated_image, generated_image]
        if (output && output.length > 0) {
          finalGeneratedImage = output.length > 1 ? output[1] : output[0];
          console.log("Successfully generated AI image from Replicate.");
        }
      } catch (err) {
        console.error("Replicate AI Generation Error:", err.message);
        // Fall back below if Replicate fails
      }
    }

    // Fallback to Hugging Face if Replicate wasn't used or failed
    if (finalGeneratedImage === (generatedImage || mockGeneratedImages[roomType] || mockGeneratedImages['Living Room']) && process.env.HF_API_TOKEN && originalImage) {
      console.log(`Generating AI design for ${roomType} using Hugging Face...`);
      try {
        const base64Data = originalImage.replace(/^data:image\/\w+;base64,/, "");
        
        const response = await axios({
          method: 'post',
          url: 'https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix',
          headers: {
            'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          data: {
            inputs: originalImage,
            parameters: {
              prompt: `A highly detailed, modern, photorealistic interior design of a ${roomType}`,
              num_inference_steps: 30,
              guidance_scale: 7.5
            }
          },
          responseType: 'arraybuffer'
        });

        // Convert returned binary image to base64
        const generatedImageBase64 = Buffer.from(response.data, 'binary').toString('base64');
        finalGeneratedImage = `data:image/jpeg;base64,${generatedImageBase64}`;
        console.log("Successfully generated AI image from Hugging Face.");
      } catch (err) {
        console.error("Hugging Face AI Generation Error:", err.message);
        // If everything fails, it will safely use the Unsplash mock placeholder
      }
    }

    const finalAiSuggestion = aiSuggestion || {
      furniture: ['Luxury Velvet Sofa', 'Minimalist Coffee Table', 'Nordic Floor Lamp', 'Abstract Wall Art'],
      materials: ['Solid Teak Wood', 'Brushed Brass', 'Italian Marble', 'Linen Upholstery'],
      colorPalette: mockPalettes[roomType] || mockPalettes['Living Room'],
      budgetEstimate: Math.floor(Math.random() * 3000) + 2000
    };

    const finalAnalysis = analysis || mockAnalyses[roomType] || mockAnalyses['Living Room'];

    const aiDesign = await AIDesignRequest.create({
      userId: req.user.id,
      roomType: roomType || 'Living Room',
      originalImage,
      generatedImage: finalGeneratedImage,
      aiSuggestion: finalAiSuggestion,
      analysis: finalAnalysis,
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
    const { status, isBookmarked } = req.body;


    let design = await AIDesignRequest.findById(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });

    if (status === 'regenerated') {
      design.aiSuggestion.budgetEstimate = Math.floor(Math.random() * 3000) + 2500;
      design.aiSuggestion.furniture.push('Premium Accent Chair');
      await design.save();
      return res.status(200).json({ success: true, data: design });
    }

    if (status !== undefined) design.status = status;
    if (isBookmarked !== undefined) design.isBookmarked = isBookmarked;
    await design.save();

    if (status === 'accepted') {
      await Notification.create({ isAdmin: true, message: `User ${req.user.name} accepted AI design.` });
    }
    res.status(200).json({ success: true, data: design });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete AI design
// @route   DELETE /api/designs/ai/:id
// @access  Private
exports.deleteAIDesign = async (req, res) => {
  try {
    const design = await AIDesignRequest.findByIdAndDelete(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Manual Design Request
// @route   POST /api/designs/manual
// @access  Private
exports.createManualDesign = async (req, res) => {
  try {
    const manualDesign = await ManualDesignRequest.create({ userId: req.user.id, requestType: req.body.requestType || 'Manual Design', ...req.body, status: 'Submitted' });
    
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
    const designs = await ManualDesignRequest.find({ userId: req.user.id }).populate('assignedVendorId').populate('assignedDesignerId').sort('-createdAt').lean();
    res.status(200).json({ success: true, data: designs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Interior Designer Request
// @route   POST /api/designs/designer
// @access  Private
exports.createDesignerRequest = async (req, res) => {
  try {


    const request = await InteriorDesignerRequest.create({ userId: req.user.id, ...req.body });

    // For non-mock database, let's ALSO create a ManualDesignRequest so it shows up in the Vendor Dashboard!
    await ManualDesignRequest.create({
      userId: req.user.id,
      requestType: 'Interior Designer Help',
      roomType: 'Interior Design',
      style: 'Consultation',
      budget: req.body.budget || 500,
      size: 'Full Space',
      timeline: 'Flexible',
      ownMaterialsAvailable: 'No',
      requirements: req.body.details || '',
      status: 'Submitted'
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
