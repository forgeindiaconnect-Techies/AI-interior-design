const AIDesignRequest = require('../models/AIDesignRequest');
const DatasetImage = require('../models/DatasetImage');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const InteriorDesignerRequest = require('../models/InteriorDesignerRequest');
const GenerationHistory = require('../models/GenerationHistory');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');
const Replicate = require('replicate');
const axios = require('axios');

const normalizeUrl = (url, req) => {
  if (!url) return url;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (url.includes('localhost:5000')) {
    return url.replace(/https?:\/\/localhost:5000/g, baseUrl);
  }
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  return url;
};

const normalizeDesign = (design, req) => {
  if (!design) return design;
  const doc = design.toObject ? design.toObject() : design;
  if (doc.generatedImage) {
    doc.generatedImage = normalizeUrl(doc.generatedImage, req);
  }
  if (doc.originalImage) {
    doc.originalImage = normalizeUrl(doc.originalImage, req);
  }
  if (doc.generations && Array.isArray(doc.generations)) {
    doc.generations = doc.generations.map(gen => {
      if (gen && typeof gen === 'object') {
        const genDoc = gen.toObject ? gen.toObject() : gen;
        if (genDoc.imageUrl) {
          genDoc.imageUrl = normalizeUrl(genDoc.imageUrl, req);
        }
        return genDoc;
      }
      return gen;
    });
  }
  return doc;
};

exports.normalizeUrl = normalizeUrl;
exports.normalizeDesign = normalizeDesign;

const mockFallbackImages = {
  'Living Room': [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28ce8f52859?w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55dd5802589?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
    'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&q=80',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80',
    'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&q=80',
    'https://images.unsplash.com/photo-1616593969747-4797dc75033e?w=800&q=80',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
  ],
  'Bedroom': [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    'https://images.unsplash.com/photo-1522771731535-62bbacf240b9?w=800&q=80',
    'https://images.unsplash.com/photo-1531835551805-16d8e487eb28?w=800&q=80',
    'https://images.unsplash.com/photo-1595514535133-c15112f453cb?w=800&q=80',
    'https://images.unsplash.com/photo-1585128719715-46776b56a0fb?w=800&q=80',
    'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&q=80',
    'https://images.unsplash.com/photo-1574871796859-99c687e6717a?w=800&q=80',
    'https://images.unsplash.com/photo-1617325247661-675ab0340793?w=800&q=80'
  ],
  'Kitchen': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80'
  ],
  'Dining Room': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=800&q=80',
    'https://images.unsplash.com/photo-1615529141018-b223d30906cb?w=800&q=80',
    'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1540932239986-30128078f3ea?w=800&q=80'
  ],
  'Bathroom': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&q=80',
    'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&q=80',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
    'https://images.unsplash.com/photo-1507652313519-cb08e3eb5a43?w=800&q=80',
    'https://images.unsplash.com/photo-1564540586847-f4e91458039e?w=800&q=80'
  ],
  'Office Room': [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=800&q=80'
  ],
  'Kids Room': [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&q=80',
    'https://images.unsplash.com/photo-1584347714856-d8f99e3065b2?w=800&q=80',
    'https://images.unsplash.com/photo-1582273010505-c1fcb2ce7fb7?w=800&q=80',
    'https://images.unsplash.com/photo-1603513364969-cfae7d4a2754?w=800&q=80',
    'https://images.unsplash.com/photo-1579222409749-983178df88cd?w=800&q=80'
  ],
  'Balcony': [
    'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=800&q=80',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80',
    'https://images.unsplash.com/photo-1580047648356-9a25b2a0c4f3?w=800&q=80',
    'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
  ],
  'Pooja Room': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28ce8f52859?w=800&q=80'
  ],
  'Commercial Space': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    'https://images.unsplash.com/photo-1582457635677-4b7ea2fb449d?w=800&q=80',
    'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800&q=80',
    'https://images.unsplash.com/photo-1582655299285-d62f4eabdd77?w=800&q=80'
  ]
};
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateImageWithAI, generateUniqueSeed, getVariationPrompt, saveGeneration, generateMultipleImages, generateOneImage, VARIATION_STYLES, FALLBACK_IMAGES } = require('./aiController');

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

const fallbackDesignerData = {
  'Living Room': {
    detectedElements: {
      windows: ["Large picture window on north wall", "Small window near entryway"],
      doors: ["Main entryway door", "Archway to dining area"],
      existingObjects: ["Unfinished walls", "Bare concrete subfloor"],
      emptyAreas: ["Center floor area", "East main accent wall", "South wall corner"]
    },
    designerReport: {
      styleRationale: "A refined modern aesthetic combining soft neutral tones, natural wood grains, and brass accents to make the spacious living room feel warm, inviting, and architecturally complete.",
      lightingAnalysis: "Ample natural light from the north picture window. Suggest adding layered artificial lighting including an elegant central brass chandelier and a warm dimmable floor lamp in the reading corner.",
      materialPalette: [
        { name: "Textured Bouclé Fabric", rationale: "For the primary sofa, providing tactile depth and soft comfort." },
        { name: "Matte White Oak", rationale: "For the coffee table and console to introduce organic, light-toned wood elements." },
        { name: "Brushed Brass", rationale: "For lighting fixtures and decor accents to add subtle modern luxury." }
      ],
      colorPalette: [
        { hex: "#F4F1EA", name: "Warm Alabaster", use: "Main walls and ceiling" },
        { hex: "#D4C5B9", name: "Soft Taupe", use: "Area rug and accent textiles" },
        { hex: "#4A5343", name: "Olive Leaf", use: "Accent pillows and botanical decor" }
      ],
      executionChecklist: [
        "Prep walls by patching and painting with a flat warm alabaster paint.",
        "Lay down the large textured area rug to define the main seating zone.",
        "Deliver and position the custom white oak media console along the east wall.",
        "Assemble and arrange the modular bouclé sofa, centering it with the rug.",
        "Install the central brushed brass chandelier and wire dimmable switches."
      ]
    },
    interactiveDesignZones: [
      {
        id: "zone_1",
        name: "Primary Seating Anchor",
        item: "Modular Bouclé Sofa & Oak Coffee Table",
        description: "Center the main seating group with the picture window. Use a low-profile coffee table to keep sightlines open and flow uninterrupted.",
        boundingBox: [0.45, 0.15, 0.85, 0.85],
        suggestedMarketplaceItems: ["sofa", "coffee table", "rug"]
      },
      {
        id: "zone_2",
        name: "Entertainment & Media Wall",
        item: "White Oak Media Console",
        description: "Install a floating white oak console along the east accent wall. Keep the design minimalist to complement the room's geometry.",
        boundingBox: [0.35, 0.65, 0.75, 0.95],
        suggestedMarketplaceItems: ["cabinet", "bookshelf", "tv console"]
      },
      {
        id: "zone_3",
        name: "Reading & Accent Corner",
        item: "Lounge Chair & Brass Floor Lamp",
        description: "Place a comfortable accent chair angled towards the room, flanked by a sleek floor lamp to create a cozy secondary zone.",
        boundingBox: [0.3, 0.05, 0.7, 0.3],
        suggestedMarketplaceItems: ["chair", "lamp", "side table"]
      }
    ]
  },
  'Bedroom': {
    detectedElements: {
      windows: ["Double casement windows on west wall"],
      doors: ["Bedroom entrance door", "En-suite bathroom door"],
      existingObjects: ["Bare concrete floor", "Plain drywall back wall"],
      emptyAreas: ["Center back wall", "Left bedside wall", "Right bedside wall"]
    },
    designerReport: {
      styleRationale: "A serene Scandinavian sanctuary focusing on minimalist lines, plush textiles, and walnut wood accents to cultivate a deeply relaxing sleeping environment.",
      lightingAnalysis: "Soft afternoon sunlight from west windows. Layered ambient lighting via bedside sconces and an architectural paper pendant lamp is recommended.",
      materialPalette: [
        { name: "American Walnut Wood", rationale: "For bed frame and floating nightstands to anchor the layout with rich tones." },
        { name: "Washed French Linen", rationale: "For bedding and curtains to introduce organic, relaxed textures." },
        { name: "Woven Wool", rationale: "For a plush underfoot experience next to the bed." }
      ],
      colorPalette: [
        { hex: "#ECEBE4", name: "Chalk Gray", use: "Main bedroom walls" },
        { hex: "#8B7D71", name: "Walnut Brown", use: "Bed frame and main furniture" },
        { hex: "#A2B5CD", name: "Muted Slate Blue", use: "Linen sheets and cushions" }
      ],
      executionChecklist: [
        "Paint the room with two coats of chalk gray breathable matte paint.",
        "Install the custom walnut bed frame centered against the back wall.",
        "Mount the floating walnut nightstands at mattress level on both sides.",
        "Install soft warm-toned bedside pendant lamps or wall sconces.",
        "Drape the washed french linen bedding and lay down the bedside wool rug."
      ]
    },
    interactiveDesignZones: [
      {
        id: "zone_1",
        name: "Sleeping Anchor Zone",
        item: "Walnut Platform Bed Frame",
        description: "Center the queen platform bed frame against the main drywall back wall to anchor the room's layout symmetrically.",
        boundingBox: [0.38, 0.22, 0.82, 0.78],
        suggestedMarketplaceItems: ["bed", "bedsheet", "pillow"]
      },
      {
        id: "zone_2",
        name: "Left Nightstand & Sconce",
        item: "Floating Walnut Bedside Table",
        description: "Install a space-saving floating nightstand to keep the floor clear. Add a dimmable warm-toned wall sconce above.",
        boundingBox: [0.48, 0.05, 0.72, 0.2],
        suggestedMarketplaceItems: ["side table", "lamp"]
      },
      {
        id: "zone_3",
        name: "Right Nightstand & Sconce",
        item: "Floating Walnut Bedside Table",
        description: "Install matching floating nightstand on the right side of the bed to maintain architectural balance and symmetry.",
        boundingBox: [0.48, 0.8, 0.72, 0.95],
        suggestedMarketplaceItems: ["side table", "lamp"]
      }
    ]
  },
  'Kitchen': {
    detectedElements: {
      windows: ["Small window over the sink area"],
      doors: ["Pantry door", "Access way to dining room"],
      existingObjects: ["Rough plumbing outlets", "Exposed concrete back wall"],
      emptyAreas: ["Back cabinet wall", "Center floor", "Sink plumbing area"]
    },
    designerReport: {
      styleRationale: "An ultra-modern culinary space utilizing high-gloss panels, quartz countertops, and clean integrated appliances for professional utility and style.",
      lightingAnalysis: "Direct workspace illumination via under-cabinet LED strips and pendant lights above the central island.",
      materialPalette: [
        { name: "Polished Calacatta Quartz", rationale: "For counter surface and full-height backsplash to offer luxurious, durable utility." },
        { name: "Matte Charcoal Lacquer", rationale: "For main cabinetry to create a sleek, sophisticated visual contrast." },
        { name: "Brushed Nickel", rationale: "For handles, faucets, and fixture details to add clean metallic accents." }
      ],
      colorPalette: [
        { hex: "#FFFFFF", name: "Pure Quartz White", use: "Countertops and backsplash" },
        { hex: "#2C3539", name: "Charcoal Black", use: "Lower and upper cabinets" },
        { hex: "#DCDCDC", name: "Glistening Silver", use: "Fittings and light fixtures" }
      ],
      executionChecklist: [
        "Fit custom lower and upper matte charcoal cabinets along the main wall.",
        "Install plumbing fixtures and mount the quartz countertop with under-mount sink.",
        "Adhere the matching quartz slab backsplash from counter to upper cabinets.",
        "Fit high-efficiency LED strip lights beneath the upper cabinet run.",
        "Connect and align built-in stainless steel oven and refrigerator."
      ]
    },
    interactiveDesignZones: [
      {
        id: "zone_1",
        name: "Main Cabinetry & Prep Counter",
        item: "Matte Charcoal Cabinets & Quartz Countertop",
        description: "Install full-run lower cabinets and quartz worktops along the main wall, optimizing workspace and storage.",
        boundingBox: [0.4, 0.1, 0.9, 0.9],
        suggestedMarketplaceItems: ["cabinet", "chair", "table"]
      },
      {
        id: "zone_2",
        name: "Sink & Faucet Hub",
        item: "Under-mount Stainless Steel Sink & Brushed Nickel Faucet",
        description: "Position the sink centered with the window. Install a premium pull-out spray faucet for maximum culinary versatility.",
        boundingBox: [0.5, 0.4, 0.78, 0.65],
        suggestedMarketplaceItems: ["chair", "cabinet"]
      }
    ]
  },
  'Bathroom': {
    detectedElements: {
      windows: ["Frosted privacy window on the rear wall"],
      doors: ["Bathroom entrance door"],
      existingObjects: ["Exposed pipe work", "Rough screed floor"],
      emptyAreas: ["Vanity wall area", "Shower corner", "Toilet installation spot"]
    },
    designerReport: {
      styleRationale: "A spa-like bathroom layout prioritizing wet-dry zoning, clean porcelain fixtures, and calm wood tones for a serene routine.",
      lightingAnalysis: "Diffused light from the frosted window. Suggest back-lit LED mirror for functional grooming lighting.",
      materialPalette: [
        { name: "Terrazzo Tiles", rationale: "For walls and floor to establish a playful, durable moisture-resistant background." },
        { name: "Teak Wood Veneer", rationale: "For the vanity cabinet to introduce a warm, moisture-resilient organic texture." },
        { name: "Matte Black Metal", rationale: "For plumbing fittings to anchor the design with bold contrast details." }
      ],
      colorPalette: [
        { hex: "#EAE6DF", name: "Warm Terrazzo Gray", use: "Wall and floor tiles" },
        { hex: "#C29B70", name: "Warm Teak", use: "Vanity cabinet and shelving" },
        { hex: "#121212", name: "Matte Black", use: "Faucets, shower frame, and hardware" }
      ],
      executionChecklist: [
        "Waterproof the entire room and lay terrazzo tiles on floors and walls.",
        "Install the custom teak floating vanity and connect basin plumbing.",
        "Mount the circular back-lit LED smart mirror directly above the vanity.",
        "Fit the matte black shower frame, mixer faucet, and rain shower head.",
        "Mount black towel rails and install the high-efficiency smart toilet."
      ]
    },
    interactiveDesignZones: [
      {
        id: "zone_1",
        name: "Grooming Vanity Zone",
        item: "Teak Floating Vanity & LED Mirror",
        description: "Mount a floating teak vanity with ceramic basin. Add a smart LED vanity mirror with anti-fog functionality above.",
        boundingBox: [0.3, 0.2, 0.8, 0.55],
        suggestedMarketplaceItems: ["mirror", "cabinet"]
      },
      {
        id: "zone_2",
        name: "Shower & Wet Area",
        item: "Frameless Glass Shower & Rain Shower Head",
        description: "Enclose the corner shower area with frameless glass panels to maintain visual transparency. Install black matte shower fittings.",
        boundingBox: [0.25, 0.6, 0.85, 0.95],
        suggestedMarketplaceItems: ["chair", "cabinet"]
      }
    ]
  }
};

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
        recs: ['Contrast slate grey elements with warm teak wood accents.', 'Introduce warm brass wall sconces to elevate low-light areas.'],
        spatialFeatures: { walls: ['Left wall (3.6m)', 'Right wall (3.6m)', 'Front wall (4.2m)', 'Back wall (4.2m)'], windows: ['1 large window on right wall'], doors: ['1 entry door on back wall'], corners: ['4 accessible corners'], floorSpace: '15.1 sq m open floor area' },
        furnitureLayout: [
          { item: 'L-shaped Sofa', position: 'Left wall', reason: 'Maximizes seating against the longest uninterrupted wall, faces the entertainment zone' },
          { item: 'TV Unit', position: 'Front wall (opposite sofa)', reason: 'Optimal 2.5m viewing distance from the sofa for comfortable viewing' },
          { item: 'Coffee Table', position: 'Center (between sofa and TV)', reason: 'Creates a functional focal point within arm reach of all seating' },
          { item: 'Floor Lamp', position: 'Right corner (near window)', reason: 'Supplements natural light from the window during evenings' },
          { item: 'Indoor Plant', position: 'Near window (right wall)', reason: 'Receives maximum natural sunlight for healthy growth' },
          { item: 'Wall Art / Gallery', position: 'Above sofa (left wall)', reason: 'Creates visual interest at eye level from the main seating area' },
          { item: 'Accent Chair', position: 'Right side, angled toward sofa', reason: 'Creates conversational seating arrangement' },
          { item: 'Side Table', position: 'Adjacent to accent chair', reason: 'Functional surface for drinks and lamps' }
        ]
      },
      'Bedroom': {
        palette: ['#8B5E3C', '#E9C46A', '#F8F5F0', '#6B7280'],
        furniture: ['Bed', 'Wardrobe', 'Side tables', 'Lighting', 'Curtains'],
        materials: ['Walnut Wood', 'Ivory Linen', 'Charcoal accents'],
        budget: 3500,
        detectedItems: ['Bed Frame', 'Nightstand', 'Wardrobe', 'Pillow'],
        analysis: 'Soft diffused warm lighting, minimal natural glare.',
        recs: ['Introduce a platform bed with floating nightstands to save floor space.', 'Add dimmable warm ambient lamps for a relaxed atmosphere.'],
        spatialFeatures: { walls: ['Left wall (3.2m)', 'Right wall (3.2m)', 'Front wall (3.8m)', 'Back wall (3.8m)'], windows: ['1 window on front wall'], doors: ['1 entry door on left wall'], corners: ['4 corners, 2 usable'], floorSpace: '12.2 sq m usable floor area' },
        furnitureLayout: [
          { item: 'King/Queen Bed', position: 'Center of back wall', reason: 'Symmetrical placement creates balance; headboard anchors the room' },
          { item: 'Nightstand (Left)', position: 'Left side of bed', reason: 'Easy access to alarm, phone, and reading lamp' },
          { item: 'Nightstand (Right)', position: 'Right side of bed', reason: 'Symmetrical pairing enhances visual harmony' },
          { item: 'Wardrobe', position: 'Right wall', reason: 'Keeps dressing area separate from sleeping zone' },
          { item: 'Dressing Table', position: 'Front wall (near window)', reason: 'Natural light ideal for grooming' },
          { item: 'Floor Lamp', position: 'Corner near bed (left)', reason: 'Ambient reading light without harsh overhead glare' },
          { item: 'Wall-mounted Shelves', position: 'Above bed (back wall)', reason: 'Decorative storage without consuming floor space' }
        ]
      },
      'Kitchen': {
        palette: ['#2F3E46', '#8B5E3C', '#F8F5F0', '#D4A373'],
        furniture: ['Modular kitchen', 'Cabinets', 'Countertops', 'Appliances'],
        materials: ['White Quartz', 'Brushed Brass', 'Matte Navy Wood'],
        budget: 8500,
        detectedItems: ['Cabinet', 'Countertop', 'Sink', 'Refrigerator'],
        analysis: 'Bright task lighting, overhead fluorescent glare.',
        recs: ['Add a marble waterfall kitchen island to bridge workspace gap.', 'Install under-cabinet LED warm strip lights for functional elegance.'],
        spatialFeatures: { walls: ['Left wall (2.8m)', 'Right wall (2.8m)', 'Front wall (3.4m)', 'Back wall (3.4m)'], windows: ['1 window above sink area'], doors: ['1 entry from dining area'], corners: ['L-shaped counter corner'], floorSpace: '9.5 sq m total, 5.2 sq m walkway' },
        furnitureLayout: [
          { item: 'L-shaped Counter', position: 'Left wall + back wall', reason: 'Maximizes workspace following the kitchen work triangle' },
          { item: 'Sink', position: 'Back wall (under window)', reason: 'Natural light for washing; ventilation for steam' },
          { item: 'Refrigerator', position: 'Right wall (near entry)', reason: 'Accessible without entering the cooking zone' },
          { item: 'Overhead Cabinets', position: 'Above counters (left + back wall)', reason: 'Vertical storage keeps counters clear' },
          { item: 'Kitchen Island / Prep Table', position: 'Center', reason: 'Additional prep surface and casual dining spot' },
          { item: 'Microwave / Oven Stack', position: 'Right wall (tall unit)', reason: 'Ergonomic height placement, away from wet zone' }
        ]
      },
      'Dining Room': {
        palette: ['#E76F51', '#264653', '#E9C46A', '#FFFFFF'],
        furniture: ['Dining table', 'Chairs', 'Lighting', 'Storage'],
        materials: ['Reclaimed Wood', 'Iron', 'Linen'],
        budget: 4200,
        detectedItems: ['Dining Table', 'Chairs', 'Lighting'],
        analysis: 'Centralized overhead lighting, balanced space around table.',
        recs: ['Use a statement chandelier above the dining table.', 'Include a built-in buffet for additional storage.'],
        spatialFeatures: { walls: ['Left wall (3.0m)', 'Right wall (3.0m)', 'Front wall (3.6m)', 'Back wall (3.6m)'], windows: ['1 window on front wall'], doors: ['1 archway to kitchen'], corners: ['4 corners'], floorSpace: '10.8 sq m, 60% occupied by dining set' },
        furnitureLayout: [
          { item: '6-seater Dining Table', position: 'Center of room', reason: 'Equal circulation space on all sides for comfortable movement' },
          { item: 'Statement Chandelier', position: 'Ceiling, directly above table', reason: 'Focal lighting creates intimate dining atmosphere' },
          { item: 'Buffet / Sideboard', position: 'Back wall', reason: 'Serves as serving station and tableware storage' },
          { item: 'Wall Art / Mirror', position: 'Front wall (facing table)', reason: 'Reflects light and visually expands the space' },
          { item: 'Indoor Plant', position: 'Corner near window', reason: 'Adds organic warmth to the dining atmosphere' }
        ]
      },
      'Bathroom': {
        palette: ['#2A9D8F', '#2F3E46', '#FFFFFF', '#D4A373'],
        furniture: ['Vanity', 'Tiles', 'Mirror', 'Lighting'],
        materials: ['Ceramic Tiles', 'Slate Gray Marble', 'Chrome Fixtures'],
        budget: 3000,
        detectedItems: ['Vanity', 'Mirror', 'Shower Glass', 'Toilet'],
        analysis: 'Cool LED lighting, high reflective sheen.',
        recs: ['Introduce a floating oak vanity to increase visual space.', 'Choose matte black plumbing fixtures for modern contrast.'],
        spatialFeatures: { walls: ['Left wall (2.0m)', 'Right wall (2.0m)', 'Front wall (2.5m)', 'Back wall (2.5m)'], windows: ['1 frosted window on right wall'], doors: ['1 entry door on front wall'], corners: ['Shower corner, vanity corner'], floorSpace: '5.0 sq m, waterproof tiled floor' },
        furnitureLayout: [
          { item: 'Floating Vanity + Mirror', position: 'Left wall', reason: 'Eye-level mirror with under-vanity storage saves space' },
          { item: 'Walk-in Shower', position: 'Back-right corner', reason: 'Enclosed wet zone away from the entrance' },
          { item: 'Toilet', position: 'Right wall (near window)', reason: 'Ventilation from the frosted window' },
          { item: 'Towel Rack / Heated Rail', position: 'Near shower (back wall)', reason: 'Immediate access after bathing' },
          { item: 'Storage Cabinet', position: 'Above toilet (wall-mounted)', reason: 'Utilizes vertical dead space' }
        ]
      },
      'Office Room': {
        palette: ['#1F2937', '#F8F5F0', '#4B5563', '#9CA3AF'],
        furniture: ['Workstation', 'Office chair', 'Shelves', 'Lighting'],
        materials: ['Oak Wood', 'Metal Framework', 'Leather'],
        budget: 2500,
        detectedItems: ['Work Desk', 'Office Chair', 'Bookshelf'],
        analysis: 'Focused task lighting with reduced glare.',
        recs: ['Add ergonomic seating for prolonged work hours.', 'Incorporate floating shelves for organized storage.'],
        spatialFeatures: { walls: ['Left wall (3.0m)', 'Right wall (3.0m)', 'Front wall (3.5m)', 'Back wall (3.5m)'], windows: ['1 window on front wall'], doors: ['1 entry door on left wall'], corners: ['3 usable corners'], floorSpace: '10.5 sq m, 40% open movement area' },
        furnitureLayout: [
          { item: 'L-shaped Work Desk', position: 'Front wall (facing window)', reason: 'Natural light reduces eye strain during work hours' },
          { item: 'Ergonomic Chair', position: 'At desk, facing window', reason: 'Proper lumbar support for extended work sessions' },
          { item: 'Bookshelf / Storage Unit', position: 'Right wall', reason: 'Within arm reach for reference materials' },
          { item: 'Filing Cabinet', position: 'Under desk (right side)', reason: 'Hidden storage for documents' },
          { item: 'Task Lamp', position: 'Desk corner (left)', reason: 'Directed light for focused tasks without screen glare' },
          { item: 'Whiteboard / Pinboard', position: 'Back wall', reason: 'Visual planning area visible from desk' }
        ]
      },
      'Kids Room': {
        palette: ['#FCA5A5', '#FCD34D', '#93C5FD', '#FFFFFF'],
        furniture: ['Kids furniture', 'Play area', 'Storage', 'Colorful design'],
        materials: ['Pine Wood', 'Cotton', 'Laminate'],
        budget: 3200,
        detectedItems: ['Single Bed', 'Toy bins', 'Play area'],
        analysis: 'Bright, colorful natural lighting with fun accents.',
        recs: ['Use low-height accessible storage bins.', 'Incorporate a soft rug for the play area.'],
        spatialFeatures: { walls: ['Left wall (3.0m)', 'Right wall (3.0m)', 'Front wall (3.5m)', 'Back wall (3.5m)'], windows: ['1 window on front wall (child-safe lock)'], doors: ['1 entry door on left wall'], corners: ['4 corners, all child-proofed'], floorSpace: '10.5 sq m, 50% play zone' },
        furnitureLayout: [
          { item: 'Single Bed / Bunk Bed', position: 'Back wall (corner)', reason: 'Frees up maximum floor space for play activities' },
          { item: 'Study Desk', position: 'Front wall (near window)', reason: 'Natural light for homework and crafts' },
          { item: 'Toy Storage Bins', position: 'Right wall (low shelves)', reason: 'Child-accessible height encourages independent tidying' },
          { item: 'Play Area Rug', position: 'Center floor', reason: 'Soft, safe surface for floor activities' },
          { item: 'Wall Decals / Art', position: 'Left wall + above bed', reason: 'Stimulating visuals at child eye level' },
          { item: 'Wardrobe', position: 'Left wall (near door)', reason: 'Easy access for daily outfit selection' }
        ]
      },
      'Balcony': {
        palette: ['#10B981', '#F8F5F0', '#8B5E3C', '#D1D5DB'],
        furniture: ['Outdoor seating', 'Plants', 'Lighting', 'Decor'],
        materials: ['Rattan', 'Teak Wood', 'Ceramic'],
        budget: 1500,
        detectedItems: ['Patio chairs', 'Plant pots', 'Railing'],
        analysis: 'Abundant natural light, open-air environment.',
        recs: ['Add weather-resistant rattan furniture.', 'Introduce vertical planters to maximize green space.'],
        spatialFeatures: { walls: ['Back wall (2.0m)', 'Left railing (3.0m)', 'Right railing (3.0m)'], windows: ['Open air — no windows'], doors: ['1 sliding door to living room'], corners: ['2 corners (left-back, right-back)'], floorSpace: '6.0 sq m outdoor area' },
        furnitureLayout: [
          { item: '2-seater Bistro Set', position: 'Center-right', reason: 'Cozy seating with garden view and morning sunlight' },
          { item: 'Vertical Planter Wall', position: 'Back wall', reason: 'Maximizes greenery without consuming floor space' },
          { item: 'Hanging Planters', position: 'Ceiling hooks along railing', reason: 'Cascading greenery creates natural privacy screen' },
          { item: 'String Lights', position: 'Along railing + ceiling edge', reason: 'Warm ambient lighting for evening relaxation' },
          { item: 'Small Side Table', position: 'Next to seating', reason: 'Functional surface for beverages and books' }
        ]
      },
      'Pooja Room': {
        palette: ['#F59E0B', '#8B5E3C', '#FFFFFF', '#EF4444'],
        furniture: ['Mandir', 'Traditional decor', 'Lighting', 'Storage'],
        materials: ['Teak Wood', 'Brass', 'Marble'],
        budget: 2000,
        detectedItems: ['Mandir structure', 'Floor mats', 'Idols'],
        analysis: 'Warm, spiritual lighting with incense smoke handling.',
        recs: ['Install carved wooden doors with bells.', 'Use warm brass lamps for a divine ambiance.'],
        spatialFeatures: { walls: ['Left wall (1.8m)', 'Right wall (1.8m)', 'Front wall (2.0m)', 'Back wall (2.0m)'], windows: ['1 small ventilation window'], doors: ['1 carved wooden door'], corners: ['Back corners for storage'], floorSpace: '3.6 sq m, dedicated sacred space' },
        furnitureLayout: [
          { item: 'Wooden Mandir / Temple', position: 'Center of back wall (elevated)', reason: 'Sacred focal point at eye level during prayer' },
          { item: 'Prayer Mat Area', position: 'Floor in front of mandir', reason: 'Comfortable seating for prayer and meditation' },
          { item: 'Brass Diya Stand', position: 'Both sides of mandir', reason: 'Traditional symmetrical lighting arrangement' },
          { item: 'Incense Holder', position: 'Front shelf of mandir', reason: 'Ventilated position for smoke dispersal' },
          { item: 'Storage Drawer', position: 'Below mandir (base unit)', reason: 'Keeps puja essentials organized and accessible' }
        ]
      },
      'Commercial Space': {
        palette: ['#1F2937', '#374151', '#9CA3AF', '#F3F4F6'],
        furniture: ['Professional interior', 'Reception', 'Work areas', 'Commercial furniture'],
        materials: ['Concrete', 'Glass', 'Steel'],
        budget: 12000,
        detectedItems: ['Reception desk', 'Lobby seating', 'Workstations'],
        analysis: 'Professional, uniform lighting across large areas.',
        recs: ['Create an inviting reception area with acoustic panels.', 'Use modular workstations for flexibility.'],
        spatialFeatures: { walls: ['Multiple walls (open plan)', 'Glass partitions'], windows: ['Floor-to-ceiling windows (front facade)'], doors: ['Main entry + emergency exits'], corners: ['Column zones for partitioning'], floorSpace: '50+ sq m open plan area' },
        furnitureLayout: [
          { item: 'Reception Desk', position: 'Front-center (facing entry)', reason: 'First point of contact for visitors' },
          { item: 'Waiting Lounge', position: 'Left of reception', reason: 'Comfortable holding area with visual separation' },
          { item: 'Workstation Cluster', position: 'Center-back (open plan)', reason: 'Collaborative layout maximizes team interaction' },
          { item: 'Conference Table', position: 'Right side (glass-enclosed)', reason: 'Private meeting space with sound isolation' },
          { item: 'Break Area / Pantry', position: 'Back-right corner', reason: 'Away from client-facing zones to reduce distraction' },
          { item: 'Storage / Filing Wall', position: 'Back wall', reason: 'Centralized document access for all workstations' }
        ]
      }
    };



    const currentRoom = roomData[roomType] || roomData['Living Room'];

    const getFallbackImage = (type) => {
      const options = mockFallbackImages[type] || mockFallbackImages['Living Room'];
      return options[Math.floor(Math.random() * options.length)];
    };

    let finalGeneratedImage = generatedImage || getFallbackImage(roomType);

    let geminiAnalysis = null;
    if (process.env.GEMINI_API_KEY && originalImage) {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      // Helper function to call Gemini with retries and different models
      const callGeminiWithRetry = async (prompt, inlineData) => {
        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];
        let lastError = null;
        for (const modelName of modelsToTry) {
          let attempts = 2; // Try up to 2 times for each model
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              console.log(`Attempt ${attempt} calling ${modelName}...`);
              const model = genAI.getGenerativeModel({ model: modelName });
              const result = await model.generateContent([prompt, inlineData]);
              const text = result.response.text();
              console.log(`Successfully received response from ${modelName}`);
              return text;
            } catch (err) {
              lastError = err;
              console.warn(`Error on ${modelName} (attempt ${attempt}): ${err.message}`);
              if (attempt < attempts) {
                console.log("Waiting 3 seconds before retry...");
                await new Promise(resolve => setTimeout(resolve, 3000));
              }
            }
          }
        }
        throw lastError || new Error("Failed after retries");
      };

      try {
        console.log(`Analyzing ${roomType} using resilient Gemini Vision API...`);
        const base64Data = originalImage.split(',')[1];
        const mimeType = originalImage.match(/data:([^;]+);/)[1];
        const inlineData = { inlineData: { data: base64Data, mimeType } };
        
        const prompt = `You are a Senior Interior Designer. Analyze this room image and design a complete interior redesign. 
You must NOT generate a new image; instead, analyze the existing room structure and propose specific, context-aware design additions (furniture placement, wall decor, lighting, color swatches) that overlay onto the original image.

Provide a structured JSON response (return only valid JSON, no markdown wrap, no other text):
{
  "roomType": "${roomType}",
  "designerReport": {
    "styleRationale": "A professional designer description of the chosen style concept and layout choice.",
    "lightingAnalysis": "Analysis of the natural and artificial lighting.",
    "materialPalette": [
      { "name": "Solid Walnut Wood", "rationale": "For bed frame and side tables to add grounding warmth." }
    ],
    "colorPalette": [
      { "hex": "#8B5E3C", "name": "Walnut Brown", "use": "Main furniture and accents" }
    ],
    "executionChecklist": [
      "Step 1: Clear the back wall and prepare for bed frame alignment."
    ]
  },
  "detectedElements": {
    "windows": ["string"],
    "doors": ["string"],
    "existingObjects": ["string"],
    "emptyAreas": ["string"]
  },
  "recommendedFurniturePlacement": [
    { "location": "string", "items": ["string"] }
  ],
  "interactiveDesignZones": [
    {
      "id": "zone_1",
      "name": "Primary Bed Zone",
      "item": "King size platform bed with custom headboard",
      "description": "Center the bed against the back wall to anchor the room symmetrically. Use soft linen bedding for texture.",
      "boundingBox": [0.4, 0.2, 0.8, 0.7],
      "suggestedMarketplaceItems": ["bed", "pillow", "bedsheet"]
    }
  ],
  "imageGenerationPrompt": "A highly detailed, professional photorealistic Stable Diffusion prompt that describes the redesigned room, matching the original room geometry and elements (window/door positions) but incorporating the new styling."
}

Note: "boundingBox" must be an array of 4 floating point numbers [ymin, xmin, ymax, xmax] between 0.0 and 1.0 representing the normalized coordinates on the image where this design element should be overlaid (e.g. [0.4, 0.2, 0.8, 0.7]). Be precise with the coordinates so they map to the correct walls/floor areas in the photo!`;

        const responseText = await callGeminiWithRetry(prompt, inlineData);
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        geminiAnalysis = JSON.parse(jsonStr);
        console.log("Successfully parsed Gemini Room Analysis response.");
      } catch (err) {
        console.error("Gemini Vision failed completely, falling back to deterministic designer engine:", err.message);
      }
    }

    finalGeneratedImage = generatedImage;
    const datasetRooms = ['Bathroom', 'Bedroom', 'Kitchen', 'Living Room'];

    if (!originalImage && datasetRooms.includes(roomType)) {
      try {
        const randomImage = await DatasetImage.aggregate([
          { $match: { roomType } },
          { $sample: { size: 1 } }
        ]);
        if (randomImage && randomImage.length > 0) {
          finalGeneratedImage = randomImage[0].url;
        }
      } catch (err) {
        console.error('Error fetching dataset image:', err);
      }
    }

    let initialVariations = [];
    if (!finalGeneratedImage) {
      if (originalImage) {
        try {
          initialVariations = await generateMultipleImages({
            image: originalImage,
            roomType: roomType || 'Living Room',
            count: 5,
            existingSeeds: [],
            variationPromptOverride: geminiAnalysis?.imageGenerationPrompt || null
          });
          finalGeneratedImage = initialVariations[0].imageUrl;
        } catch (err) {
          console.warn('AI Generation failed, using fallback:', err.message);
          finalGeneratedImage = getFallbackImage(roomType);
        }
      } else {
        finalGeneratedImage = getFallbackImage(roomType);
      }
    }

    const savedOriginalImage = originalImage || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60';

    const fallbackData = fallbackDesignerData[roomType] || fallbackDesignerData['Living Room'];

    const finalAiSuggestion = aiSuggestion || {
      furniture: geminiAnalysis?.interactiveDesignZones?.map(z => z.item) || fallbackData.interactiveDesignZones.map(z => z.item) || currentRoom.furniture,
      materials: geminiAnalysis?.designerReport?.materialPalette?.map(m => m.name) || fallbackData.designerReport.materialPalette.map(m => m.name) || currentRoom.materials,
      colorPalette: geminiAnalysis?.designerReport?.colorPalette?.map(c => c.name) || fallbackData.designerReport.colorPalette.map(c => c.name) || currentRoom.palette,
      budgetEstimate: geminiAnalysis?.designerReport?.budgetEstimate || Math.floor(Math.random() * 1000) + currentRoom.budget
    };

    // Build the structured design plan from spatial analysis
    const designPlan = {
      roomType: roomType,
      spatialFeatures: currentRoom.spatialFeatures || {},
      suggestedLayout: (currentRoom.furnitureLayout || []).map(f => ({
        furniture: f.item,
        position: f.position,
        reason: f.reason
      }))
    };

    const finalAnalysis = analysis || {
      detectedRoomType: geminiAnalysis?.roomType || roomType,
      detectedElements: geminiAnalysis?.detectedElements || fallbackData.detectedElements,
      recommendedFurniturePlacement: geminiAnalysis?.recommendedFurniturePlacement || 
        (currentRoom.furnitureLayout || []).map(f => ({ location: f.position, items: [f.item] })),
      detectedItems: currentRoom.detectedItems,
      lightingAnalysis: geminiAnalysis?.designerReport?.lightingAnalysis || fallbackData.designerReport.lightingAnalysis || currentRoom.analysis,
      colorProfile: geminiAnalysis?.designerReport?.colorPalette?.map(c => c.name) || fallbackData.designerReport.colorPalette.map(c => c.name) || currentRoom.palette,
      spaceUtilization: 'Optimized space flow based on modern design principles.',
      recommendations: currentRoom.recs,
      spatialFeatures: currentRoom.spatialFeatures || {},
      furnitureLayout: currentRoom.furnitureLayout || [],
      designPlan: designPlan,
      designerReport: geminiAnalysis?.designerReport || fallbackData.designerReport,
      interactiveDesignZones: geminiAnalysis?.interactiveDesignZones || fallbackData.interactiveDesignZones
    };

    const aiDesign = await AIDesignRequest.create({
      userId: req.user.id,
      roomType: roomType || 'Living Room',
      originalImage: savedOriginalImage,
      generatedImage: finalGeneratedImage,
      aiSuggestion: finalAiSuggestion,
      analysis: finalAnalysis,
      status: 'generated',
      versionNumber: 1,
      seeds: [],
      generations: []
    });

    if (initialVariations.length > 0) {
      for (const v of initialVariations) {
        const genHistory = await saveGeneration({
          userId: req.user.id,
          projectId: aiDesign._id,
          uploadedImage: originalImage,
          generatedImage: v.imageUrl,
          roomType: roomType || 'Living Room',
          designStyle: VARIATION_STYLES[v.seed % VARIATION_STYLES.length],
          promptUsed: v.prompt,
          seed: v.seed,
          versionNumber: 1
        });
        aiDesign.generations.push(genHistory._id);
        aiDesign.seeds.push(v.seed);
      }
      await aiDesign.save();
    }

    await Notification.create({ userId: req.user.id, message: `Your ${roomType || 'Living Room'} AI design has been generated successfully.` });
    await Notification.create({ isAdmin: true, message: `New AI design generated for user ${req.user.name}` });

    // Populate generations for the response
    await aiDesign.populate('generations');

    res.status(201).json({ success: true, data: normalizeDesign(aiDesign, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user AI designs
// @route   GET /api/designs/ai
// @access  Private
exports.getUserAIDesigns = async (req, res) => {
  try {


    const designs = await AIDesignRequest.find({ userId: req.user.id }).populate('generations').sort('-createdAt');
    const normalizedDesigns = designs.map(d => normalizeDesign(d, req));
    res.status(200).json({ success: true, data: normalizedDesigns });
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid design ID format' });
    }

    const { status, isBookmarked } = req.body;


    let design = await AIDesignRequest.findById(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });

    if (status === 'regenerated') {
      try {
        const roomType = design.roomType || 'Living Room';
        const currentImage = design.generatedImage;
        let nextImage = null;

        const datasetRooms = ['Bathroom', 'Bedroom', 'Kitchen', 'Living Room'];
        if (datasetRooms.includes(roomType)) {
          // Fetch a random image from DatasetImage for this roomType, excluding currentImage
          const currentUrlPath = currentImage && currentImage.includes('/dataset/') ? currentImage.substring(currentImage.indexOf('/dataset/')) : null;
          
          let query = { roomType };
          if (currentUrlPath) {
            query.url = { $ne: currentUrlPath };
          }
          
          const images = await DatasetImage.find(query);
          if (images.length > 0) {
            const randomPick = images[Math.floor(Math.random() * images.length)];
            nextImage = randomPick.url;
          }
        }

        if (!nextImage) {
          // Fallback to Unsplash
          const options = (mockFallbackImages[roomType] || mockFallbackImages['Living Room']).filter(url => url !== currentImage);
          nextImage = options[Math.floor(Math.random() * options.length)] || currentImage;
        }

        design.generatedImage = nextImage;
        design.versionNumber = (design.versionNumber || 1) + 1;
        
        // Randomize the budget slightly for variety
        if (design.aiSuggestion) {
          design.aiSuggestion.budgetEstimate = Math.floor(Math.random() * 1000) + 3000;
        }
        
        await design.save();
        await design.populate('generations');

        return res.status(200).json({ success: true, data: normalizeDesign(design, req) });
      } catch (err) {
        console.error('Regeneration failed:', err.message);
        return res.status(500).json({ success: false, message: 'Regeneration failed: ' + err.message });
      }
    }

    if (status !== undefined) design.status = status;
    if (isBookmarked !== undefined) design.isBookmarked = isBookmarked;
    await design.save();

    if (status === 'accepted') {
      await Notification.create({ isAdmin: true, message: `User ${req.user.name} accepted AI design.` });
    }
    res.status(200).json({ success: true, data: normalizeDesign(design, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete AI design
// @route   DELETE /api/designs/ai/:id
// @access  Private
exports.deleteAIDesign = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid design ID format' });
    }
    await AIDesignRequest.findByIdAndDelete(req.params.id);
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
    
    const detailInfo = {
      roomType: manualDesign.roomType,
      style: manualDesign.style,
      budget: manualDesign.budget,
      status: manualDesign.status
    };

    // Notify Admin
    await Notification.create({
      isAdmin: true,
      title: 'New Manual Design Request',
      message: `New manual design request submitted by ${req.user.name || 'User'}.\nRoom: ${manualDesign.roomType} | Style: ${manualDesign.style} | Budget: ${manualDesign.budget}`,
      relatedId: manualDesign._id,
      relatedModel: 'ManualDesignRequest',
      details: detailInfo
    });
    
    // Notify Vendors
    const vendors = await User.find({ role: 'vendor' });
    const vendorNotifications = vendors.map(v => ({
      userId: v._id,
      title: 'New Custom Order Available',
      message: `New manual design request received.\nRoom: ${manualDesign.roomType} | Style: ${manualDesign.style} | Budget: ${manualDesign.budget}`,
      relatedId: manualDesign._id,
      relatedModel: 'ManualDesignRequest',
      details: detailInfo
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

// @desc    Get all generations for an AI design
// @route   GET /api/designs/ai/:id/generations
// @access  Private
exports.getAIDesignGenerations = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid design ID format' });
    }
    const design = await AIDesignRequest.findById(req.params.id).populate('generations');
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    if (design.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const normalizedGenerations = design.generations.map(gen => {
      const genDoc = gen.toObject ? gen.toObject() : gen;
      if (genDoc.imageUrl) {
        genDoc.imageUrl = normalizeUrl(genDoc.imageUrl, req);
      }
      return genDoc;
    });
    res.status(200).json({ success: true, data: normalizedGenerations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
