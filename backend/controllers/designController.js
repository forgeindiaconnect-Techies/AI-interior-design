const AIDesignRequest = require('../models/AIDesignRequest');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const InteriorDesignerRequest = require('../models/InteriorDesignerRequest');
const GenerationHistory = require('../models/GenerationHistory');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');
const Replicate = require('replicate');
const axios = require('axios');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateImageWithAI, generateUniqueSeed, getVariationPrompt, saveGeneration, VARIATION_STYLES } = require('./aiController');

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
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
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

    const currentRoom = roomData[roomType] || roomData['Living Room'];

    const getFallbackImage = (type) => {
      const options = mockFallbackImages[type] || mockFallbackImages['Living Room'];
      return options[Math.floor(Math.random() * options.length)];
    };

    let finalGeneratedImage = generatedImage || getFallbackImage(roomType);

    let geminiAnalysis = null;
    if (process.env.GEMINI_API_KEY && originalImage) {
      try {
        console.log(`Analyzing ${roomType} using Gemini Vision...`);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const base64Data = originalImage.split(',')[1];
        const mimeType = originalImage.match(/data:([^;]+);/)[1];
        
        const prompt = `Analyze this empty room image.
Detect: Room type, Empty walls, Available floor space, Corners, Windows, Doors, Existing furniture.
Provide a structured JSON response EXACTLY matching this format (no markdown blocks, just raw JSON):
{
  "roomType": "${roomType}",
  "detectedElements": {
    "windows": ["string"],
    "doors": ["string"],
    "existingObjects": ["string"],
    "emptyAreas": ["string"]
  },
  "recommendedFurniturePlacement": [
    { "location": "string", "items": ["string"] }
  ]
}`;
        
        const result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Data, mimeType } }
        ]);
        
        const responseText = result.response.text();
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        geminiAnalysis = JSON.parse(jsonStr);
        console.log("Successfully generated Gemini Room Analysis.");
      } catch (err) {
        console.error("Gemini Vision Error:", err.message);
      }
    }

    // Generate AI image with seed-based variation system
    let generationSeed = null;
    let generationPrompt = null;
    if (originalImage) {
      try {
        generationSeed = generateUniqueSeed([]);
        const variationPrompt = getVariationPrompt(roomType, generationSeed);
        const result = await generateImageWithAI({
          image: originalImage,
          roomType: roomType || 'Living Room',
          seed: generationSeed,
          variationPrompt
        });
        finalGeneratedImage = result.imageUrl;
        generationPrompt = result.prompt;
      } catch (err) {
        console.warn('AI Generation failed, using fallback:', err.message);
        finalGeneratedImage = getFallbackImage(roomType);
      }
    } else {
      finalGeneratedImage = generatedImage || getFallbackImage(roomType);
    }

    const finalAiSuggestion = aiSuggestion || {
      furniture: currentRoom.furniture,
      materials: currentRoom.materials,
      colorPalette: currentRoom.palette,
      budgetEstimate: Math.floor(Math.random() * 1000) + currentRoom.budget
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
      detectedElements: geminiAnalysis?.detectedElements || {
        windows: currentRoom.spatialFeatures?.windows || [],
        doors: currentRoom.spatialFeatures?.doors || [],
        existingObjects: currentRoom.detectedItems || [],
        emptyAreas: currentRoom.spatialFeatures?.walls || []
      },
      recommendedFurniturePlacement: geminiAnalysis?.recommendedFurniturePlacement || 
        (currentRoom.furnitureLayout || []).map(f => ({ location: f.position, items: [f.item] })),
      detectedItems: currentRoom.detectedItems,
      lightingAnalysis: currentRoom.analysis,
      colorProfile: currentRoom.palette,
      spaceUtilization: 'Optimized space flow based on modern design principles.',
      recommendations: currentRoom.recs,
      spatialFeatures: currentRoom.spatialFeatures || {},
      furnitureLayout: currentRoom.furnitureLayout || [],
      designPlan: designPlan
    };

    const aiDesign = await AIDesignRequest.create({
      userId: req.user.id,
      roomType: roomType || 'Living Room',
      originalImage,
      generatedImage: finalGeneratedImage,
      aiSuggestion: finalAiSuggestion,
      analysis: finalAnalysis,
      status: 'generated',
      versionNumber: 1,
      seeds: generationSeed ? [generationSeed] : [],
      generations: []
    });

    if (generationSeed && generationPrompt) {
      const designStyle = generationSeed !== null
        ? VARIATION_STYLES[generationSeed % VARIATION_STYLES.length]
        : 'Modern';
      const genHistory = await saveGeneration({
        userId: req.user.id,
        projectId: aiDesign._id,
        uploadedImage: originalImage,
        generatedImage: finalGeneratedImage,
        roomType: roomType || 'Living Room',
        designStyle,
        promptUsed: generationPrompt,
        seed: generationSeed,
        versionNumber: 1
      });
      aiDesign.generations.push(genHistory._id);
      aiDesign.seeds.push(generationSeed);
      await aiDesign.save();
    }

    await Notification.create({ userId: req.user.id, message: `Your ${roomType || 'Living Room'} AI design has been generated successfully.` });
    await Notification.create({ isAdmin: true, message: `New AI design generated for user ${req.user.name}` });

    // Populate generations for the response
    await aiDesign.populate('generations');

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


    const designs = await AIDesignRequest.find({ userId: req.user.id }).populate('generations').sort('-createdAt');
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
      try {
        const newVersion = (design.versionNumber || 1) + 1;
        const newSeed = generateUniqueSeed(design.seeds || []);
        const variationPrompt = getVariationPrompt(design.roomType, newSeed);
        const result = await generateImageWithAI({
          image: design.originalImage,
          roomType: design.roomType || 'Living Room',
          seed: newSeed,
          variationPrompt
        });

        const newDesignStyle = VARIATION_STYLES[newSeed % VARIATION_STYLES.length];

        const genHistory = await saveGeneration({
          userId: design.userId,
          projectId: design._id,
          uploadedImage: design.originalImage,
          generatedImage: result.imageUrl,
          roomType: design.roomType,
          designStyle: newDesignStyle,
          promptUsed: result.prompt,
          seed: newSeed,
          versionNumber: newVersion
        });

        design.generatedImage = result.imageUrl;
        design.versionNumber = newVersion;
        design.seeds.push(newSeed);
        design.generations.push(genHistory._id);
        const newBudget = Math.floor(Math.random() * 1000) + 3000;
        if (design.aiSuggestion) {
          design.aiSuggestion.budgetEstimate = newBudget;
        }
        await design.save();

        await design.populate('generations');

        return res.status(200).json({ success: true, data: design });
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

// @desc    Get all generations for an AI design
// @route   GET /api/designs/ai/:id/generations
// @access  Private
exports.getAIDesignGenerations = async (req, res) => {
  try {
    const design = await AIDesignRequest.findById(req.params.id).populate('generations');
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    if (design.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: design.generations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
