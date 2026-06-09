const AIDesignRequest = require('../models/AIDesignRequest');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const InteriorDesignerRequest = require('../models/InteriorDesignerRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');
const Replicate = require('replicate');
const axios = require('axios');
const https = require('https');

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

    const roomData = {
      'Living Room': {
        palette: ['#D4A373', '#2A9D8F', '#F8F5F0', '#1F2937'],
        furniture: ['Sofas', 'TV unit', 'Coffee table', 'Lighting', 'Wall decor'],
        materials: ['Solid Teak Wood', 'Brushed Brass', 'Linen Upholstery'],
        budget: 4500,
        detectedItems: ['Sofa', 'Coffee Table', 'Floor Lamp', 'Window'],
        analysis: 'Moderate natural light from side window, soft shadows in corners.',
        recs: ['Contrast slate grey elements with warm teak wood accents.', 'Introduce warm brass wall sconces to elevate low-light areas.']
      },
      'Bedroom': {
        palette: ['#8B5E3C', '#E9C46A', '#F8F5F0', '#6B7280'],
        furniture: ['Bed', 'Wardrobe', 'Side tables', 'Lighting', 'Curtains'],
        materials: ['Walnut Wood', 'Ivory Linen', 'Charcoal accents'],
        budget: 3500,
        detectedItems: ['Bed Frame', 'Nightstand', 'Wardrobe', 'Pillow'],
        analysis: 'Soft diffused warm lighting, minimal natural glare.',
        recs: ['Introduce a platform bed with floating nightstands to save floor space.', 'Add dimmable warm ambient lamps for a relaxed atmosphere.']
      },
      'Kitchen': {
        palette: ['#2F3E46', '#8B5E3C', '#F8F5F0', '#D4A373'],
        furniture: ['Modular kitchen', 'Cabinets', 'Countertops', 'Appliances'],
        materials: ['White Quartz', 'Brushed Brass', 'Matte Navy Wood'],
        budget: 8500,
        detectedItems: ['Cabinet', 'Countertop', 'Sink', 'Refrigerator'],
        analysis: 'Bright task lighting, overhead fluorescent glare.',
        recs: ['Add a marble waterfall kitchen island to bridge workspace gap.', 'Install under-cabinet LED warm strip lights for functional elegance.']
      },
      'Dining Room': {
        palette: ['#E76F51', '#264653', '#E9C46A', '#FFFFFF'],
        furniture: ['Dining table', 'Chairs', 'Lighting', 'Storage'],
        materials: ['Reclaimed Wood', 'Iron', 'Linen'],
        budget: 4200,
        detectedItems: ['Dining Table', 'Chairs', 'Lighting'],
        analysis: 'Centralized overhead lighting, balanced space around table.',
        recs: ['Use a statement chandelier above the dining table.', 'Include a built-in buffet for additional storage.']
      },
      'Bathroom': {
        palette: ['#2A9D8F', '#2F3E46', '#FFFFFF', '#D4A373'],
        furniture: ['Vanity', 'Tiles', 'Mirror', 'Lighting'],
        materials: ['Ceramic Tiles', 'Slate Gray Marble', 'Chrome Fixtures'],
        budget: 3000,
        detectedItems: ['Vanity', 'Mirror', 'Shower Glass', 'Toilet'],
        analysis: 'Cool LED lighting, high reflective sheen.',
        recs: ['Introduce a floating oak vanity to increase visual space.', 'Choose matte black plumbing fixtures for modern contrast.']
      },
      'Office Room': {
        palette: ['#1F2937', '#F8F5F0', '#4B5563', '#9CA3AF'],
        furniture: ['Workstation', 'Office chair', 'Shelves', 'Lighting'],
        materials: ['Oak Wood', 'Metal Framework', 'Leather'],
        budget: 2500,
        detectedItems: ['Work Desk', 'Office Chair', 'Bookshelf'],
        analysis: 'Focused task lighting with reduced glare.',
        recs: ['Add ergonomic seating for prolonged work hours.', 'Incorporate floating shelves for organized storage.']
      },
      'Kids Room': {
        palette: ['#FCA5A5', '#FCD34D', '#93C5FD', '#FFFFFF'],
        furniture: ['Kids furniture', 'Play area', 'Storage', 'Colorful design'],
        materials: ['Pine Wood', 'Cotton', 'Laminate'],
        budget: 3200,
        detectedItems: ['Single Bed', 'Toy bins', 'Play area'],
        analysis: 'Bright, colorful natural lighting with fun accents.',
        recs: ['Use low-height accessible storage bins.', 'Incorporate a soft rug for the play area.']
      },
      'Balcony': {
        palette: ['#10B981', '#F8F5F0', '#8B5E3C', '#D1D5DB'],
        furniture: ['Outdoor seating', 'Plants', 'Lighting', 'Decor'],
        materials: ['Rattan', 'Teak Wood', 'Ceramic'],
        budget: 1500,
        detectedItems: ['Patio chairs', 'Plant pots', 'Railing'],
        analysis: 'Abundant natural light, open-air environment.',
        recs: ['Add weather-resistant rattan furniture.', 'Introduce vertical planters to maximize green space.']
      },
      'Pooja Room': {
        palette: ['#F59E0B', '#8B5E3C', '#FFFFFF', '#EF4444'],
        furniture: ['Mandir', 'Traditional decor', 'Lighting', 'Storage'],
        materials: ['Teak Wood', 'Brass', 'Marble'],
        budget: 2000,
        detectedItems: ['Mandir structure', 'Floor mats', 'Idols'],
        analysis: 'Warm, spiritual lighting with incense smoke handling.',
        recs: ['Install carved wooden doors with bells.', 'Use warm brass lamps for a divine ambiance.']
      },
      'Commercial Space': {
        palette: ['#1F2937', '#374151', '#9CA3AF', '#F3F4F6'],
        furniture: ['Professional interior', 'Reception', 'Work areas', 'Commercial furniture'],
        materials: ['Concrete', 'Glass', 'Steel'],
        budget: 12000,
        detectedItems: ['Reception desk', 'Lobby seating', 'Workstations'],
        analysis: 'Professional, uniform lighting across large areas.',
        recs: ['Create an inviting reception area with acoustic panels.', 'Use modular workstations for flexibility.']
      }
    };

    const mockFallbackImages = {
      'Living Room': [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28ce8f52859?w=800&q=80'
      ],
      'Bedroom': [
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
        'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'
      ],
      'Kitchen': [
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
        'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80',
        'https://images.unsplash.com/photo-1556156653-e5a7c69cc263?w=800&q=80'
      ],
      'Dining Room': [
        'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800&q=80',
        'https://images.unsplash.com/photo-1595514535316-836798bd1a1e?w=800&q=80',
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80'
      ],
      'Bathroom': [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80'
      ],
      'Office Room': [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'
      ],
      'Kids Room': [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80'
      ],
      'Balcony': [
        'https://images.unsplash.com/photo-1590005354167-6da97ce2311c?w=800&q=80',
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
      ],
      'Pooja Room': [
        '/pooja_room.png'
      ],
      'Commercial Space': [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80'
      ]
    };

    const currentRoom = roomData[roomType] || roomData['Living Room'];

    const getFallbackImage = (type) => {
      const options = mockFallbackImages[type] || mockFallbackImages['Living Room'];
      return options[Math.floor(Math.random() * options.length)];
    };

    let finalGeneratedImage = generatedImage || getFallbackImage(roomType);

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

    // Fallback to Pollinations AI (Free Text-to-Image API) since Hugging Face dropped the free instruct-pix2pix model
    // Using random clear pictures if finalGeneratedImage is from the fallback list
    if (finalGeneratedImage === generatedImage || mockFallbackImages[roomType]?.includes(finalGeneratedImage) || mockFallbackImages['Living Room']?.includes(finalGeneratedImage)) {
      console.log(`Generating unique AI design for ${roomType} using Pollinations AI...`);
      try {
        const seed = Math.floor(Math.random() * 1000000);
        const prompt = encodeURIComponent(`A highly detailed, modern, photorealistic interior design of a ${roomType}, architectural digest, beautiful lighting, 8k resolution`);
        
        // Pollinations AI returns a direct image buffer
        const response = await axios.get(`https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&seed=${seed}&nologo=true`, {
          responseType: 'arraybuffer'
        });

        const generatedImageBase64 = Buffer.from(response.data, 'binary').toString('base64');
        finalGeneratedImage = `data:image/jpeg;base64,${generatedImageBase64}`;
        console.log("Successfully generated AI image from Pollinations AI.");
      } catch (err) {
        console.warn("Pollinations AI Generation Error:", err.message, "- Falling back to intelligent local mocks.");
        
        // Final ultimate fallback if even Pollinations AI fails (e.g. 402 Payment Required)
        finalGeneratedImage = getFallbackImage(roomType);
        console.log("Successfully served room-specific fallback image to bypass API paywalls.");
      }
    }

    const finalAiSuggestion = aiSuggestion || {
      furniture: currentRoom.furniture,
      materials: currentRoom.materials,
      colorPalette: currentRoom.palette,
      budgetEstimate: Math.floor(Math.random() * 1000) + currentRoom.budget
    };

    const finalAnalysis = analysis || {
      detectedRoomType: roomType,
      detectedItems: currentRoom.detectedItems,
      lightingAnalysis: currentRoom.analysis,
      colorProfile: currentRoom.palette,
      spaceUtilization: 'Optimized space flow based on modern design principles.',
      recommendations: currentRoom.recs
    };

    const aiDesign = await AIDesignRequest.create({
      userId: req.user.id,
      roomType: roomType || 'Living Room',
      originalImage,
      generatedImage: finalGeneratedImage,
      aiSuggestion: finalAiSuggestion,
      analysis: finalAnalysis,
      status: 'generated'
    });

    await Notification.create({ userId: req.user.id, message: `Your ${roomType || 'Living Room'} AI design has been generated successfully.` });
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
    console.error('getUserAIDesigns error:', error);
    if (error.name === 'CastError' || error.message.includes('Cast to ObjectId failed')) {
      try {
        await mongoose.connection.db.collection('aidesignrequests').deleteMany({ userId: { $type: "string" } });
        return res.status(200).json({ success: true, data: [], message: 'Recovered from database error' });
      } catch (retryErr) {
        return res.status(200).json({ success: true, data: [] });
      }
    }
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
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
    console.error('getUserManualDesigns error:', error);
    if (error.name === 'CastError' || error.message.includes('Cast to ObjectId failed')) {
      try {
        await mongoose.connection.db.collection('manualdesignrequests').deleteMany({ userId: { $type: "string" } });
        await mongoose.connection.db.collection('manualdesignrequests').deleteMany({ assignedVendorId: { $type: "string" } });
        const designs = await ManualDesignRequest.find({ userId: req.user.id }).populate('assignedVendorId').populate('assignedDesignerId').sort('-createdAt').lean();
        return res.status(200).json({ success: true, data: designs });
      } catch (retryErr) {
        return res.status(200).json({ success: true, data: [], message: 'Recovered from invalid data' });
      }
    }
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
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
