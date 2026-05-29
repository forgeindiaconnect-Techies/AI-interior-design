const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const AIDesignRequest = require('../models/AIDesignRequest');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const InteriorDesignerRequest = require('../models/InteriorDesignerRequest');
const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const ManufacturingOrder = require('../models/ManufacturingOrder');
const DeliveryOrder = require('../models/DeliveryOrder');
const InstallationOrder = require('../models/InstallationOrder');
const Payment = require('../models/Payment');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const AdminLog = require('../models/AdminLog');
const mongoose = require('mongoose');
const VendorVerification = require('../models/VendorVerification');
const MarketplaceOrder = require('../models/MarketplaceOrder');
const AdminPermission = require('../models/AdminPermission');
const { mockManualDesigns: controllerMockManualDesigns } = require('./designController');

// In-memory mock stores for Demo Mode admin view
let mockUsers = [
  { 
    _id: 'u_mock_1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '+91 98765 43210', 
    role: 'user', 
    createdAt: new Date(Date.now() - 3600000 * 24 * 40), // 40 days ago
    status: 'Active',
    suspensionReason: '',
    totalOrders: 4,
    totalSpending: 2450,
    address: '12, Mahatma Gandhi Road, Bangalore, India'
  },
  { 
    _id: 'u_mock_2', 
    name: 'Vendor Demo', 
    email: 'vendor@example.com', 
    phone: '+91 87654 32109', 
    role: 'vendor', 
    createdAt: new Date(Date.now() - 3600000 * 24 * 10), // 10 days ago
    status: 'Active',
    suspensionReason: '',
    totalOrders: 0,
    totalSpending: 0,
    address: '56, Industrial Area, Noida, India'
  },
  { 
    _id: 'u_mock_3', 
    name: 'Alice Smith', 
    email: 'alice@example.com', 
    phone: '+1 555-0144', 
    role: 'user', 
    createdAt: new Date(Date.now() - 3600000 * 24 * 5), // 5 days ago
    status: 'Suspended',
    suspensionReason: 'Suspicious spam order pattern detected',
    totalOrders: 2,
    totalSpending: 1200,
    address: '789 Designer Lane, New York, NY, USA'
  },
  { 
    _id: 'u_mock_4', 
    name: 'Bob Builder', 
    email: 'bob@example.com', 
    phone: '+1 555-0177', 
    role: 'manufacturer', 
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    status: 'Active',
    suspensionReason: '',
    totalOrders: 15,
    totalSpending: 24500,
    address: 'Manufacturing Hub, Detroit, MI, USA'
  },
  { 
    _id: 'u_mock_5', 
    name: 'Charlie Chaplin', 
    email: 'charlie@example.com', 
    phone: '+1 555-0188', 
    role: 'user', 
    createdAt: new Date(Date.now() - 3600000 * 24 * 1), // 1 day ago
    status: 'Blocked',
    suspensionReason: 'Terms of service violation',
    totalOrders: 1,
    totalSpending: 80,
    address: '456 Cinema Road, Los Angeles, CA, USA'
  }
];

let PLATFORM_COMMISSION_RATE = 15;
let mockTransactions = [
  {
    _id: 'txn_102938',
    orderId: 'ord_d_9182',
    userId: { name: 'Alice Smith', email: 'alice@example.com' },
    vendorId: { companyName: 'Artisan Workshop' },
    amount: 4500,
    commissionAmount: 675,
    netPayout: 3825,
    paymentMethod: 'Card',
    status: 'Paid',
    type: 'Customer Payment',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    _id: 'txn_384729',
    orderId: 'ord_m_2210',
    userId: { name: 'John Doe', email: 'john@example.com' },
    vendorId: { companyName: 'Artisan Workshop' },
    amount: 8500,
    commissionAmount: 1275,
    netPayout: 7225,
    paymentMethod: 'Card',
    status: 'Paid',
    type: 'Customer Payment',
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    _id: 'txn_582910',
    orderId: 'ord_p_1044',
    userId: { name: 'Charlie Chaplin', email: 'charlie@example.com' },
    vendorId: { companyName: 'Artisan Workshop' },
    amount: 1250,
    commissionAmount: 187.5,
    netPayout: 1062.5,
    paymentMethod: 'UPI',
    status: 'Pending',
    type: 'Vendor Payout',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    _id: 'txn_901823',
    orderId: 'ord_d_3320',
    userId: { name: 'John Doe', email: 'john@example.com' },
    vendorId: { companyName: 'Artisan Workshop' },
    amount: 6200,
    commissionAmount: 930,
    netPayout: 5270,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    type: 'Customer Payment',
    createdAt: new Date(Date.now() - 3600000 * 24 * 18).toISOString()
  },
  {
    _id: 'txn_449201',
    orderId: 'ord_p_5541',
    userId: { name: 'Alice Smith', email: 'alice@example.com' },
    vendorId: { companyName: 'Artisan Workshop' },
    amount: 350,
    commissionAmount: 52.5,
    netPayout: 297.5,
    paymentMethod: 'Card',
    status: 'Processing',
    type: 'Customer Payment',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
  }
];


let mockVendors = [
  {
    _id: 'mock_vendor_id_123',
    companyName: 'Artisan Workshop',
    businessType: 'vendor',
    description: 'Expert hand-crafted wooden furniture workshops.',
    rating: 4.8,
    reviewsCount: 34,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: true,
    serviceAreas: ['Bangalore', 'Noida', 'Mumbai'],
    specialization: 'Woodworks',
    monthlyCapacity: 40,
    workloadLevel: 'Medium',
    userId: { name: 'Rajesh Kumar', email: 'vendor@example.com', phone: '+91 98765 43210' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 30)
  },
  {
    _id: 'mfg_mock_1',
    companyName: 'Elite Woodworks',
    businessType: 'manufacturer',
    description: 'Industrial-grade modular kitchen and premium wardrobe manufacturer.',
    rating: 4.9,
    reviewsCount: 88,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: true,
    serviceAreas: ['Detroit', 'Chicago', 'New York'],
    specialization: 'Woodworks',
    monthlyCapacity: 120,
    workloadLevel: 'High',
    userId: { name: 'Frank Miller', email: 'mfg@example.com', phone: '+1 555-0199' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 25)
  },
  {
    _id: 'mfg_mock_2',
    companyName: 'Apex Metal Fabrications',
    businessType: 'manufacturer',
    description: 'Specialists in heavy-duty wrought iron frames, dining legs, and steel setups.',
    rating: 4.5,
    reviewsCount: 15,
    isVerified: true,
    verificationStatus: 'Submitted',
    storeSetupStatus: 'Pending',
    isActive: true,
    serviceAreas: ['Noida', 'Delhi NCR', 'Gurugram'],
    specialization: 'Metal Fabrications',
    monthlyCapacity: 50,
    workloadLevel: 'Low',
    userId: { name: 'Amit Sharma', email: 'apex@example.com', phone: '+91 88888 77777' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 12)
  },
  {
    _id: 'mfg_mock_3',
    companyName: 'Premium Upholstery Hub',
    businessType: 'manufacturer',
    description: 'Fine leather, luxury fabrics, and customized foam cushioning workshops.',
    rating: 4.2,
    reviewsCount: 29,
    isVerified: false,
    verificationStatus: 'Pending',
    storeSetupStatus: 'Pending',
    isActive: false,
    serviceAreas: ['Los Angeles', 'San Diego'],
    specialization: 'Upholstery',
    monthlyCapacity: 80,
    workloadLevel: 'Medium',
    userId: { name: 'Sarah Connor', email: 'sarah@upholster.com', phone: '+1 555-0211' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 8)
  },
  {
    _id: 'mfg_mock_4',
    companyName: 'Smart Modular Closets',
    businessType: 'manufacturer',
    description: 'State-of-the-art modular wardrobe boards, glass laminates, and organizers.',
    rating: 4.7,
    reviewsCount: 42,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: false,
    serviceAreas: ['Munich', 'Berlin'],
    specialization: 'Modular Cabinets',
    monthlyCapacity: 100,
    workloadLevel: 'Maxed Out',
    userId: { name: 'Hans Gruber', email: 'hans@modular.de', phone: '+49 89 123456' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 3)
  },
  {
    _id: 'del_mock_1',
    companyName: 'Swift Logistics Solutions',
    businessType: 'delivery',
    description: 'Fast, secure home deliveries with cargo vans and medium trucks.',
    rating: 4.9,
    reviewsCount: 156,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: true,
    serviceAreas: ['Bangalore', 'Mumbai'],
    vehicleType: 'Cargo Van',
    deliveryStatus: 'Idle',
    installationAvailable: false,
    userId: { name: 'Ravi Kumar', email: 'ravi@swiftlogistics.com', phone: '+91 99887 76655' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 45)
  },
  {
    _id: 'del_mock_2',
    companyName: 'Apex Delivery & Assembly',
    businessType: 'delivery',
    description: 'Integrated home delivery and premium furniture assembly services.',
    rating: 4.7,
    reviewsCount: 88,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: true,
    serviceAreas: ['Noida', 'Delhi NCR'],
    vehicleType: 'Mini Truck',
    deliveryStatus: 'On Trip',
    installationAvailable: true,
    userId: { name: 'Sanjay Sharma', email: 'sanjay@apexdelivery.com', phone: '+91 98989 89898' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 30)
  },
  {
    _id: 'del_mock_3',
    companyName: 'Express Furniture Movers',
    businessType: 'delivery',
    description: 'Two-wheeler and small vehicle delivery for light packages and accessories.',
    rating: 4.4,
    reviewsCount: 34,
    isVerified: true,
    verificationStatus: 'Submitted',
    storeSetupStatus: 'Pending',
    isActive: true,
    serviceAreas: ['Mumbai'],
    vehicleType: 'Two-Wheeler',
    deliveryStatus: 'Idle',
    installationAvailable: false,
    userId: { name: 'Karan Singh', email: 'karan@expressmovers.com', phone: '+91 91234 56789' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 15)
  },
  {
    _id: 'del_mock_4',
    companyName: 'Elite Installers & Movers',
    businessType: 'installation',
    description: 'Specialists in heavy custom wardrobe installations and modular kitchens.',
    rating: 4.8,
    reviewsCount: 72,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: false,
    serviceAreas: ['Detroit', 'Chicago'],
    vehicleType: 'Cargo Van',
    deliveryStatus: 'Idle',
    installationAvailable: true,
    userId: { name: 'David Miller', email: 'david@eliteinstallers.com', phone: '+1 555-0322' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 10)
  },
  {
    _id: 'designer_mock_1',
    companyName: 'Studio Oak Design',
    businessType: 'designer',
    description: 'High-end minimalist and Scandinavian residential interior architects.',
    rating: 4.9,
    reviewsCount: 45,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: true,
    serviceAreas: ['Bangalore', 'Mumbai', 'New York'],
    specialization: 'Woodworks',
    userId: { name: 'Sophia Loren', email: 'sophia@studiooak.com', phone: '+1 555-0344' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 60)
  },
  {
    _id: 'designer_mock_2',
    companyName: 'Aura Luxury Interiors',
    businessType: 'designer',
    description: 'Premium modern and art deco concept designers.',
    rating: 4.7,
    reviewsCount: 31,
    isVerified: true,
    verificationStatus: 'Approved',
    storeSetupStatus: 'Approved',
    isActive: true,
    serviceAreas: ['Noida', 'Delhi NCR', 'Los Angeles'],
    specialization: 'Modular Cabinets',
    userId: { name: 'Elena Rostova', email: 'elena@auradesigns.com', phone: '+1 555-0377' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 40)
  }
];

let mockManualDesigns = [
  {
    _id: 'man_101',
    userId: { name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 (555) 234-5678' },
    roomType: 'Living Room',
    style: 'Modern Minimalist',
    budget: '$5,000 - $8,000',
    size: '400 sq ft',
    materials: 'Solid Teak Wood, Italian Marble',
    requirements: 'Solid teak wood frame, white statuario marble top, warm brass accents.',
    referenceImages: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600'],
    ownMaterialsAvailable: 'No',
    materialDetails: '',
    pickupAddress: '',
    materialPickupNeeded: 'No',
    timeline: 'Within 1 Month',
    needDesignerHelp: 'Yes',
    serviceAddress: '12 Luxury Heights, New York, NY, USA',
    vendorPreference: 'Top Rated Vendor',
    quotationType: 'Fixed Budget',
    status: 'Submitted',
    assignedVendorId: null,
    assignedDesignerId: null,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'man_102',
    userId: { name: 'Michael Chang', email: 'm.chang@example.com', phone: '+1 (555) 987-6543' },
    roomType: 'Bedroom',
    style: 'Nordic Scandinavian',
    budget: '$3,000 - $5,000',
    size: '300 sq ft',
    materials: 'Oak Wood, Linen Upholstery',
    requirements: 'Custom king size bed frame with fluted headboard and matching nightstands.',
    referenceImages: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'],
    ownMaterialsAvailable: 'No',
    materialDetails: '',
    pickupAddress: '',
    materialPickupNeeded: 'No',
    timeline: 'Flexible',
    needDesignerHelp: 'No',
    serviceAddress: '45 Scandinavian Plaza, Chicago, IL, USA',
    vendorPreference: 'Any Vendor',
    quotationType: 'Open Bidding',
    status: 'Vendor Review',
    assignedVendorId: { _id: 'mfg_mock_1', companyName: 'Elite Woodworks' },
    assignedDesignerId: null,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'man_103',
    userId: { name: 'Sophia Smith', email: 'sophia@example.com', phone: '+1 (555) 345-6789' },
    roomType: 'Kitchen',
    style: 'Industrial Rustic',
    budget: '$10,000 - $15,000',
    size: '250 sq ft',
    materials: 'Brushed Steel, Distressed Pine',
    requirements: 'Custom island counter with concrete top and distressed pine stools.',
    referenceImages: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600'],
    ownMaterialsAvailable: 'Yes',
    materialDetails: 'Sourced historical pine barn wood planks.',
    pickupAddress: '88 Heritage Yard, Boston, MA, USA',
    materialPickupNeeded: 'Yes',
    timeline: 'Within 2 Months',
    needDesignerHelp: 'Yes',
    serviceAddress: '88 Heritage Yard, Boston, MA, USA',
    vendorPreference: 'Nearby Vendor',
    quotationType: 'Fixed Budget',
    status: 'Quotation Sent',
    assignedVendorId: { _id: 'mfg_mock_2', companyName: 'Apex Metal Fabrications' },
    assignedDesignerId: { _id: 'designer_mock_1', companyName: 'Studio Oak Design' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    _id: 'man_104',
    userId: { name: 'Emma Watson', email: 'emma@example.com', phone: '+1 (555) 456-7890' },
    roomType: 'Bathroom',
    style: 'Modern Minimalist',
    budget: '$2,000 - $4,000',
    size: '150 sq ft',
    materials: 'Quartz, Brass',
    requirements: 'Floating quartz double vanity with warm brass backlit mirrors.',
    referenceImages: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600'],
    ownMaterialsAvailable: 'No',
    materialDetails: '',
    pickupAddress: '',
    materialPickupNeeded: 'No',
    timeline: 'Within 2 Weeks',
    needDesignerHelp: 'Yes',
    serviceAddress: '789 Broadway, New York, NY, USA',
    vendorPreference: 'Top Rated Vendor',
    quotationType: 'Open Bidding',
    status: 'User Approved',
    assignedVendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
    assignedDesignerId: { _id: 'designer_mock_2', companyName: 'Aura Luxury Interiors' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    _id: 'man_105',
    userId: { name: 'Liam Neeson', email: 'liam@example.com', phone: '+1 (555) 567-8901' },
    roomType: 'Living Room',
    style: 'Mid-Century Modern',
    budget: '$8,000 - $12,000',
    size: '450 sq ft',
    materials: 'Walnut Wood, Leather Upholstery',
    requirements: 'Walnut sideboard and bespoke leather lounge chairs with tapered legs.',
    referenceImages: [],
    ownMaterialsAvailable: 'No',
    materialDetails: '',
    pickupAddress: '',
    materialPickupNeeded: 'No',
    timeline: 'Within 3 Months',
    needDesignerHelp: 'No',
    serviceAddress: '12 Hollywood Blvd, Los Angeles, CA, USA',
    vendorPreference: 'Top Rated Vendor',
    quotationType: 'Fixed Budget',
    status: 'Completed',
    assignedVendorId: { _id: 'mfg_mock_3', companyName: 'Premium Upholstery Hub' },
    assignedDesignerId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
  }
];

let mockManufacturingOrders = [
  {
    _id: 'mo_ord_1',
    orderId: { _id: 'ord_101', totalAmount: 1250, orderStatus: 'Manufacturing' },
    manufacturerId: 'mfg_mock_1',
    designDetails: 'Solid Oak Dining Table with raw lacquer styling',
    measurements: '72 x 36 x 30 inches',
    materials: 'A-grade Oak wood, natural polyurethane matte finish',
    budget: 1250,
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5)
  },
  {
    _id: 'mo_ord_2',
    orderId: { _id: 'ord_102', totalAmount: 4850, orderStatus: 'Manufacturing' },
    manufacturerId: 'mfg_mock_1',
    designDetails: 'Premium L-Shaped Tufted Chesterfield Sofa Set',
    measurements: '120 x 84 x 32 inches',
    materials: 'High-density memory foam, velvet upholstery, mahogany frame',
    budget: 4850,
    status: 'Production Started',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2)
  },
  {
    _id: 'mo_ord_3',
    orderId: { _id: 'ord_103', totalAmount: 850, orderStatus: 'Manufacturing' },
    manufacturerId: 'mfg_mock_2',
    designDetails: 'Wrought Iron Industrial Bookshelf Rack',
    measurements: '48 x 16 x 72 inches',
    materials: 'Cold-rolled carbon steel, black powder coating, pine wood inserts',
    budget: 850,
    status: 'Material Checking',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1)
  },
  {
    _id: 'mo_ord_4',
    orderId: { _id: 'ord_104', totalAmount: 2200, orderStatus: 'Ready for Delivery' },
    manufacturerId: 'mfg_mock_1',
    designDetails: 'Sleek Walnut Veneer Credenza TV Cabinet',
    measurements: '80 x 18 x 24 inches',
    materials: 'MDF board, natural walnut veneer laminate, gold-plated handles',
    budget: 2200,
    status: 'Ready for Delivery',
    createdAt: new Date(Date.now() - 3600000 * 24 * 10)
  }
];

let mockVerificationList = [
  {
    _id: 'verification_mock_1',
    vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
    businessName: 'Artisan Workshop Private Limited',
    ownerName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'vendor@example.com',
    gstNumber: '27AAAAA1111A1Z1',
    panNumber: 'ABCDE1234F',
    idProofUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600',
    addressProofUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
    bankDetails: { accountNumber: '987654321098', ifscCode: 'HDFC0000123', bankName: 'HDFC Bank' },
    status: 'Pending',
    adminRemarks: '',
    submittedAt: new Date(Date.now() - 3600000 * 2)
  }
];

let mockStoreSetupList = [
  {
    _id: 'store_mock_1',
    vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
    description: 'Expert hand-crafted wooden furniture workshops specialized in mid-century tables.',
    specialization: 'Woodworks',
    monthlyCapacity: 40,
    serviceAreas: 'Bangalore, Noida, Mumbai',
    status: 'Pending',
    adminRemarks: '',
    submittedAt: new Date(Date.now() - 3600000)
  }
];

let mockProductsForReview = [
  {
    _id: 'prod_rev_1',
    vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
    title: 'Vintage Oak Coffee Table',
    description: 'Beautiful hand-polished coffee table made of sustainably sourced oak.',
    price: 349,
    images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600'],
    category: 'Tables',
    material: 'Oak Wood',
    size: '120x60x45cm',
    stock: 5,
    approvalStatus: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: 'prod_rev_2',
    vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
    title: 'Minimalist Walnut Bookshelf',
    description: 'Multi-tiered storage rack for books and decor.',
    price: 599,
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600'],
    category: 'Shelves',
    material: 'Walnut Wood',
    size: '180x80x30cm',
    stock: 3,
    approvalStatus: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 10)
  }
];

let mockDeliveryOrders = [
  {
    _id: 'do_mock_1',
    orderId: 'ord_101',
    deliveryPartnerId: 'del_mock_2',
    shippingAddress: '12, Mahatma Gandhi Road, Bangalore, India',
    status: 'Out for Delivery',
    trackingNotes: 'Package loaded and out for delivery with Sanjay.',
    createdAt: new Date(Date.now() - 3600000 * 3)
  },
  {
    _id: 'do_mock_2',
    orderId: 'ord_102',
    deliveryPartnerId: 'del_mock_1',
    shippingAddress: '789 Designer Lane, New York, NY, USA',
    status: 'Delivered',
    trackingNotes: 'Sofa set delivered and signed by Alice Smith.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2)
  }
];

let mockInstallationOrders = [
  {
    _id: 'io_mock_1',
    orderId: 'ord_102',
    installationPartnerId: 'del_mock_2',
    scheduledDate: new Date(Date.now() + 3600000 * 24), // tomorrow
    status: 'Installation Scheduled',
    notes: 'Modular wardrobe assembly planned for tomorrow 10 AM.',
    proofImages: [],
    createdAt: new Date(Date.now() - 3600000 * 12)
  }
];

let mockAIDesigns = [
  {
    _id: 'ai_mock_101',
    userId: { _id: 'u_mock_1', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210' },
    roomType: 'Living Room',
    stylePreference: 'Modern Minimalist',
    originalImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=60',
    generatedImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
    aiSuggestion: {
      furniture: ['Luxury Velvet Sofa', 'Minimalist Coffee Table', 'Nordic Floor Lamp', 'Abstract Wall Art'],
      materials: ['Solid Teak Wood', 'Brushed Brass', 'Italian Marble', 'Linen Upholstery'],
      colorPalette: ['#D4A373', '#2A9D8F', '#F8F5F0', '#1F2937'],
      budgetEstimate: 2850
    },
    status: 'accepted',
    assignedVendor: null,
    additionalVendors: [],
    orderStatus: 'Not Converted',
    orderId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    _id: 'ai_mock_102',
    userId: { _id: 'u_mock_3', name: 'Alice Smith', email: 'alice@example.com', phone: '+1 555-0144' },
    roomType: 'Kitchen',
    stylePreference: 'Scandinavian Sleek',
    originalImage: 'https://images.unsplash.com/photo-1556909212-d5b604d7c525?w=600&auto=format&fit=crop&q=60',
    generatedImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60',
    aiSuggestion: {
      furniture: ['Integrated Oak Cabinets', 'Quartz Waterfall Island Bar', 'High-back Leather Stools'],
      materials: ['Natural White Oak', 'Engineered Quartz', 'Stainless Steel', 'Premium Leather'],
      colorPalette: ['#2F3E46', '#8B5E3C', '#F8F5F0', '#FFFFFF'],
      budgetEstimate: 5400
    },
    status: 'accepted',
    assignedVendor: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
    additionalVendors: [{ _id: 'v2', companyName: 'Elite Woodworks' }],
    orderStatus: 'Pending Manufacturing',
    orderId: { _id: 'ord_102', orderStatus: 'Manufacturing', totalAmount: 5400 },
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    _id: 'ai_mock_103',
    userId: { _id: 'u_mock_5', name: 'Charlie Chaplin', email: 'charlie@example.com', phone: '+1 555-0188' },
    roomType: 'Bedroom',
    stylePreference: 'Bohemian Cozy',
    originalImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60',
    generatedImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=60',
    aiSuggestion: {
      furniture: ['Rattan Bed Frame', 'Macrame Hanging Chair', 'Woven Seagrass Wardrobe'],
      materials: ['Eco-friendly Rattan', 'Woven Seagrass', 'Linen', 'Reclaimed Pine'],
      colorPalette: ['#8B5E3C', '#E9C46A', '#F8F5F0', '#E76F51'],
      budgetEstimate: 1950
    },
    status: 'generated',
    assignedVendor: null,
    additionalVendors: [],
    orderStatus: 'Not Converted',
    orderId: null,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: 'ai_mock_104',
    userId: { _id: 'u_mock_1', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210' },
    roomType: 'Bathroom',
    stylePreference: 'Modern Spa',
    originalImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=60',
    generatedImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=60',
    aiSuggestion: {
      furniture: ['Floating Teak Vanity', 'Backlit Round Mirror', 'Freestanding Stone Tub'],
      materials: ['Burmese Teak', 'Terrazzo Stone', 'Copper Fixtures'],
      colorPalette: ['#2A9D8F', '#2F3E46', '#FFFFFF', '#D4A373'],
      budgetEstimate: 4200
    },
    status: 'pending',
    assignedVendor: null,
    additionalVendors: [],
    orderStatus: 'Not Converted',
    orderId: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

let mockDesignerRequests = [
  {
    _id: 'des_req_101',
    userId: { _id: 'u_mock_1', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210' },
    details: 'Looking for a complete premium redesign of our 3BHK apartment in Scandinavian style. High priority on space optimization and modular walk-in wardrobes.',
    budget: 8000,
    status: 'pending',
    assignedDesignerId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    _id: 'des_req_102',
    userId: { _id: 'u_mock_3', name: 'Alice Smith', email: 'alice@example.com', phone: '+1 555-0144' },
    details: 'Need professional interior design consultation for a high-end luxury master suite. Wants premium wallpapers, lighting setups, and automated drapery.',
    budget: 15000,
    status: 'assigned',
    assignedDesignerId: { _id: 'designer_mock_1', companyName: 'Studio Oak Design' },
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
  }
];

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {


    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendors = await Vendor.countDocuments({ businessType: 'seller' });
    const totalManufacturers = await Vendor.countDocuments({ businessType: 'manufacturer' });
    const totalDelivery = await Vendor.countDocuments({ businessType: 'delivery' });
    const totalInstallation = await Vendor.countDocuments({ businessType: 'installation' });
    const totalOrders = await Order.countDocuments();
    
    const payments = await Payment.find({ status: 'success' });
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    const estimatedCommission = totalRevenue * 0.15;

    res.status(200).json({ success: true, data: { totalUsers, totalVendors, totalManufacturers, totalDelivery, totalInstallation, totalOrders, totalRevenue, estimatedCommission } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject Vendor
// @route   PUT /api/admin/vendor-approval/:id
// @access  Private (Admin)
exports.verifyVendor = async (req, res) => {
  try {


    const { isVerified } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });
    await AdminLog.create({ adminId: req.user.id, action: `Updated verification of vendor` });
    await Notification.create({ userId: vendor.userId, message: `Your verification status updated.` });
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend user
// @route   PUT /api/admin/suspend-user/:id
// @access  Private (Admin)
exports.suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;



    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = 'Suspended';
    user.suspensionReason = reason || 'Terms of Service violation';
    await user.save();

    // Create admin log
    await AdminLog.create({ 
      adminId: req.user.id, 
      action: `Suspended user ${user.name}`, 
      details: `Reason: ${reason || 'No reason specified'}` 
    });

    // Notify user
    await Notification.create({ 
      userId: user._id, 
      message: `Your account has been suspended by an administrator. Reason: ${reason || 'Terms of Service violation'}`,
      type: 'alert'
    });

    res.status(200).json({ success: true, message: 'User suspended successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reactivate user
// @route   PUT /api/admin/reactivate-user/:id
// @access  Private (Admin)
exports.reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;



    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = 'Active';
    user.suspensionReason = '';
    await user.save();

    // Create admin log
    await AdminLog.create({ 
      adminId: req.user.id, 
      action: `Reactivated user ${user.name}`,
      details: 'Account status restored to Active.'
    });

    // Notify user
    await Notification.create({ 
      userId: user._id, 
      message: 'Your account has been successfully reactivated. Welcome back!',
      type: 'info'
    });

    res.status(200).json({ success: true, message: 'User reactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block user
// @route   PUT /api/admin/block-user/:id
// @access  Private (Admin)
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;



    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = 'Blocked';
    user.suspensionReason = '';
    await user.save();

    // Create admin log
    await AdminLog.create({ 
      adminId: req.user.id, 
      action: `Blocked user ${user.name}`,
      details: 'Account status set to Blocked.'
    });

    res.status(200).json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/delete-user/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;



    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const userName = user.name;
    await User.findByIdAndDelete(id);

    // Create admin log
    await AdminLog.create({ 
      adminId: req.user.id, 
      action: `Permanently deleted user ${userName}`,
      details: 'Account permanently deleted from system.'
    });

    res.status(200).json({ success: true, message: 'User permanently deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/admin/users/:id/orders
// @access  Private (Admin)
exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;



    const customOrders = await Order.find({ userId: id })
      .populate('vendorId', 'companyName')
      .sort('-createdAt');

    const marketplaceOrders = await MarketplaceOrder.find({ userId: id })
      .populate('items.productId', 'title price')
      .sort('-createdAt');

    // Map to standard format
    const standardCustomOrders = customOrders.map(o => ({
      _id: o._id,
      orderType: 'custom_design',
      title: `${o.orderType === 'custom_design' ? 'Custom Room Design' : 'Product Purchase'}`,
      vendorName: o.vendorId ? o.vendorId.companyName : 'Unknown Vendor',
      totalAmount: o.totalAmount,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt
    }));

    const standardMarketplaceOrders = marketplaceOrders.map(mo => ({
      _id: mo._id,
      orderType: 'marketplace',
      title: mo.items.map(item => item.productId ? item.productId.title : 'Marketplace Item').join(', '),
      items: mo.items.map(item => ({
        title: item.productId ? item.productId.title : 'Marketplace Item',
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: mo.totalAmount,
      paymentStatus: mo.paymentStatus,
      orderStatus: mo.orderStatus,
      createdAt: mo.createdAt
    }));

    const allOrders = [...standardCustomOrders, ...standardMarketplaceOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ success: true, data: allOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign Partner
// @route   POST /api/admin/assign-partner
// @access  Private (Admin)
exports.assignPartner = async (req, res) => {
  try {


    const { orderId, partnerType, partnerId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) {
      order = await MarketplaceOrder.findById(orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const partner = await Vendor.findById(partnerId);

    if (partnerType === 'vendor' && order.constructor.modelName === 'Order') {
      order.vendorId = partnerId;
      order.orderStatus = 'Quotation Accepted';
      if (partner) {
        await Notification.create({ userId: partner.userId, message: `You have been assigned as the vendor for Custom Order #${order._id.toString().slice(-6)}.` });
      }
    } else if (partnerType === 'manufacturer' && order.constructor.modelName === 'Order') {
      order.manufacturerId = partnerId;
      order.orderStatus = 'Manufacturer Assigned';
      if (partner) {
        await Notification.create({ userId: partner.userId, message: `You have been assigned as the manufacturer for Order #${order._id.toString().slice(-6)}.` });
      }
      await ManufacturingOrder.create({ orderId, manufacturerId: partnerId, designDetails: 'Assigned Custom Manufacturing', measurements: 'Standard', materials: 'Specified', budget: order.totalAmount, status: 'Accepted' });
    } else if (partnerType === 'delivery') {
      order.deliveryPartnerId = partnerId;
      order.orderStatus = 'Delivery Assigned';
      if (partner) {
        await Notification.create({ userId: partner.userId, message: `You have been assigned as the delivery partner for Order #${order._id.toString().slice(-6)}.` });
      }
      await DeliveryOrder.create({ orderId, deliveryPartnerId: partnerId, shippingAddress: order.shippingAddress, status: 'Assigned' });
    } else if (partnerType === 'installation') {
      order.installationPartnerId = partnerId;
      order.orderStatus = 'Installation Assigned';
      if (partner) {
        await Notification.create({ userId: partner.userId, message: `You have been assigned as the installation partner for Order #${order._id.toString().slice(-6)}.` });
      }
      await InstallationOrder.create({ orderId, installationPartnerId: partnerId, status: 'Assigned' });
    }

    await order.save();
    await AdminLog.create({ adminId: req.user.id, action: `Assigned ${partnerType} to order #${order._id.toString().slice(-6)}` });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Order Status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, expectedDeliveryDate } = req.body;
    const { id } = req.params;



    let order = await Order.findById(id);
    let isMarketplace = false;
    
    if (!order) {
      order = await MarketplaceOrder.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      isMarketplace = true;
    }

    order.orderStatus = status;
    if (expectedDeliveryDate) {
      order.expectedDeliveryDate = expectedDeliveryDate;
    }
    await order.save();

    // Notifications logic
    await Notification.create({
      userId: order.userId,
      message: `Your order #${order._id.toString().slice(-6)} workflow stage updated to: ${status}.`
    });

    if (isMarketplace) {
      if (status === 'Completed' || status === 'Delivered') {
        await Notification.create({ isAdmin: true, message: `Marketplace Order #${order._id.toString().slice(-6)} has been completed.` });
        for (let item of order.items) {
          const v = await Vendor.findById(item.vendorId);
          if (v) {
            await Notification.create({ userId: v.userId, message: `Order #${order._id.toString().slice(-6)} containing your product has been completed.` });
          }
        }
      }
    } else {
      const partners = [];
      if (order.vendorId) partners.push({ id: order.vendorId, role: 'vendor' });
      if (order.manufacturerId) partners.push({ id: order.manufacturerId, role: 'manufacturer' });
      if (order.deliveryPartnerId) partners.push({ id: order.deliveryPartnerId, role: 'delivery partner' });
      if (order.installationPartnerId) partners.push({ id: order.installationPartnerId, role: 'installation partner' });

      for (let p of partners) {
        const partnerObj = await Vendor.findById(p.id);
        if (partnerObj) {
          await Notification.create({
            userId: partnerObj.userId,
            message: `Order #${order._id.toString().slice(-6)} status has been updated to: ${status}.`
          });
        }
      }

      if (status === 'Order Completed' || status === 'Completed') {
        await Notification.create({
          isAdmin: true,
          message: `Order #${order._id.toString().slice(-6)} has been completed.`
        });
      }
    }

    await AdminLog.create({ adminId: req.user.id, action: `Updated order #${order._id.toString().slice(-6)} status to ${status}` });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel Order
// @route   PUT /api/admin/orders/:id/cancel
// @access  Private (Admin)
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;



    let order = await Order.findById(id);
    let isMarketplace = false;
    if (!order) {
      order = await MarketplaceOrder.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      isMarketplace = true;
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    await Notification.create({
      userId: order.userId,
      message: `Your order #${order._id.toString().slice(-6)} has been cancelled.`,
      type: 'alert'
    });

    if (!isMarketplace && order.vendorId) {
      const v = await Vendor.findById(order.vendorId);
      if (v) await Notification.create({ userId: v.userId, message: `Order #${order._id.toString().slice(-6)} has been cancelled.` });
    }

    await AdminLog.create({ adminId: req.user.id, action: `Cancelled order #${order._id.toString().slice(-6)}` });

    res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send system notification
// @route   POST /api/admin/system-notification
// @access  Private (Admin)
exports.sendSystemNotification = async (req, res) => {
  try {


    const { message, targetUserId } = req.body;
    if (targetUserId) {
      await Notification.create({ userId: targetUserId, message, type: 'system' });
    } else {
      const users = await User.find({});
      for (let u of users) await Notification.create({ userId: u._id, message, type: 'system' });
    }
    await AdminLog.create({ adminId: req.user.id, action: `Sent broadcast` });
    res.status(200).json({ success: true, message: 'System notification sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get support tickets
// @route   GET /api/admin/tickets
// @access  Private (Admin)
exports.getTickets = async (req, res) => {
  try {


    const tickets = await SupportTicket.find({}).populate('userId', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update support ticket status
// @route   PUT /api/admin/tickets/:id
// @access  Private (Admin)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;



    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get management data
// @route   GET /api/admin/management-data
// @access  Private (Admin)
exports.getManagementData = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const calculateWorkload = (activeCount, capacity = 50) => {
      const pct = (activeCount / capacity) * 100;
      if (pct < 20) return 'Low';
      if (pct <= 60) return 'Medium';
      if (pct <= 90) return 'High';
      return 'Maxed Out';
    };



    const rawUsers = await User.find({}).select('-password').sort('-createdAt');
    const vendors = await Vendor.find({}).populate('userId', 'name email phone').sort('-createdAt');
    const products = await Product.find({}).populate('vendorId', 'companyName').sort('-createdAt');
    const aiDesigns = await AIDesignRequest.find({})
      .populate('userId', 'name email')
      .populate('assignedVendor')
      .populate('additionalVendors')
      .populate('orderId')
      .sort('-createdAt');
    const dbManualDesigns = await ManualDesignRequest.find({})
      .populate('userId', 'name email')
      .populate('assignedVendorId', 'companyName')
      .populate('assignedDesignerId', 'companyName')
      .sort('-createdAt')
      .lean();

    const manualDesigns = [...controllerMockManualDesigns];
    dbManualDesigns.forEach(d => {
      if (!manualDesigns.some(m => m._id.toString() === d._id.toString())) {
        manualDesigns.push(d);
      }
    });
    const designerRequests = await InteriorDesignerRequest.find({}).populate('userId', 'name email').sort('-createdAt');
    
    // Fetch Quotations to determine custom design types
    const quotations = await Quotation.find({});
    const quotationMap = {};
    quotations.forEach(q => {
      quotationMap[q._id.toString()] = q.designType; // 'ai' or 'manual'
    });

    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('vendorId', 'companyName')
      .populate('manufacturerId', 'companyName')
      .populate('deliveryPartnerId', 'companyName')
      .populate('installationPartnerId', 'companyName')
      .sort('-createdAt');
      
    const marketplaceOrders = await MarketplaceOrder.find({})
      .populate('userId', 'name email')
      .populate('deliveryPartnerId', 'companyName')
      .populate('installationPartnerId', 'companyName')
      .populate('items.vendorId', 'companyName')
      .sort('-createdAt');

    const manufacturingOrders = await ManufacturingOrder.find({});

    // Unify Orders
    const unifiedOrders = [];
    orders.forEach(o => {
      let orderTypeLabel = 'Custom Design';
      if (o.orderType === 'product') {
        orderTypeLabel = 'Marketplace Product';
      } else if (o.referenceId && quotationMap[o.referenceId.toString()]) {
        orderTypeLabel = quotationMap[o.referenceId.toString()] === 'ai' ? 'AI Design' : 'Manual Design';
      }

      unifiedOrders.push({
        _id: o._id,
        userId: o.userId,
        vendorId: o.vendorId,
        manufacturerId: o.manufacturerId,
        deliveryPartnerId: o.deliveryPartnerId,
        installationPartnerId: o.installationPartnerId,
        orderType: orderTypeLabel,
        totalAmount: o.totalAmount,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        expectedDeliveryDate: o.expectedDeliveryDate,
        createdAt: o.createdAt,
        shippingAddress: o.shippingAddress,
        isMarketplace: false
      });
    });

    marketplaceOrders.forEach(mo => {
      // Pick first vendor from items if available
      const primaryVendor = mo.items && mo.items.length > 0 ? mo.items[0].vendorId : null;
      unifiedOrders.push({
        _id: mo._id,
        userId: mo.userId,
        vendorId: primaryVendor,
        manufacturerId: null, // Marketplace products are pre-manufactured
        deliveryPartnerId: mo.deliveryPartnerId,
        installationPartnerId: mo.installationPartnerId,
        orderType: 'Marketplace Product',
        totalAmount: mo.totalAmount,
        paymentStatus: mo.paymentStatus,
        orderStatus: mo.orderStatus,
        expectedDeliveryDate: mo.expectedDeliveryDate || new Date(new Date(mo.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000),
        createdAt: mo.createdAt,
        shippingAddress: mo.shippingAddress,
        isMarketplace: true,
        items: mo.items
      });
    });
    
    unifiedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Decorate raw users with aggregate order count and spend
    const decoratedUsers = rawUsers.map(u => {
      const userOrders = orders.filter(o => o.userId && o.userId._id.toString() === u._id.toString());
      const userMarketplaceOrders = marketplaceOrders.filter(mo => mo.userId && mo.userId.toString() === u._id.toString());
      
      const totalOrdersCount = userOrders.length + userMarketplaceOrders.length;

      const customSpending = userOrders
        .filter(o => o.paymentStatus === 'paid' || o.orderStatus === 'Completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const marketplaceSpending = userMarketplaceOrders
        .filter(mo => mo.paymentStatus === 'paid' || mo.orderStatus === 'Completed' || mo.orderStatus === 'Delivered')
        .reduce((sum, mo) => sum + (mo.totalAmount || 0), 0);

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        role: u.role,
        status: u.status || 'Active',
        suspensionReason: u.suspensionReason || '',
        createdAt: u.createdAt,
        address: u.address || '',
        totalOrders: totalOrdersCount,
        totalSpending: customSpending + marketplaceSpending
      };
    });

    // Decorate vendors (manufacturers specifically) with workload and active order counts
    const decoratedVendors = vendors.map(v => {
      if (v.businessType === 'manufacturer') {
        const activeOrdersCount = manufacturingOrders.filter(mo => mo.manufacturerId && mo.manufacturerId.toString() === v._id.toString() && mo.status !== 'Ready for Delivery').length;
        return {
          ...v.toObject(),
          activeOrders: activeOrdersCount,
          workloadLevel: calculateWorkload(activeOrdersCount, v.monthlyCapacity || 50)
        };
      }
      return v;
    });

    const totalUsers = decoratedUsers.length;
    const activeUsers = decoratedUsers.filter(u => u.status === 'Active').length;
    const suspendedUsers = decoratedUsers.filter(u => u.status === 'Suspended').length;
    const newUsersThisMonth = decoratedUsers.filter(u => new Date(u.createdAt) >= startOfMonth).length;

    // Manufacturer stats
    const dbManufacturers = vendors.filter(v => v.businessType === 'manufacturer');
    const totalManufacturers = dbManufacturers.length;
    const activeManufacturers = dbManufacturers.filter(v => v.isActive).length;
    const pendingVerification = dbManufacturers.filter(v => v.verificationStatus === 'Pending' || v.verificationStatus === 'Submitted').length;
    const activeMfgOrders = manufacturingOrders.filter(mo => mo.status !== 'Ready for Delivery').length;
    const completedMfgOrders = manufacturingOrders.filter(mo => mo.status === 'Ready for Delivery').length;

    // Delivery stats and records
    let dbDeliveryOrders = [];
    let dbInstallationOrders = [];
    try {
      dbDeliveryOrders = await DeliveryOrder.find({}).populate('deliveryPartnerId').sort('-createdAt');
      dbInstallationOrders = await InstallationOrder.find({}).populate('installationPartnerId').sort('-createdAt');
    } catch (e) {
      console.warn("Logistics tables not fully setup, returning empty logs.", e);
    }

    const dbDeliveryPartners = vendors.filter(v => v.businessType === 'delivery' || v.businessType === 'installation');
    const totalDeliveryPartnersCount = dbDeliveryPartners.length;
    const activeDeliveryPartnersCount = dbDeliveryPartners.filter(v => v.isActive).length;
    const dbPendingDeliveries = dbDeliveryOrders.filter(d => d.status !== 'Delivered').length;
    const dbCompletedDeliveries = dbDeliveryOrders.filter(d => d.status === 'Delivered').length;
    const dbPendingInstallationCount = dbInstallationOrders.filter(i => i.status !== 'Installation Completed').length;

    res.status(200).json({ 
      success: true, 
      data: { 
        users: decoratedUsers, 
        userStats: {
          totalUsers,
          activeUsers,
          suspendedUsers,
          newUsersThisMonth
        },
        vendors: decoratedVendors, 
        manufacturerStats: {
          totalManufacturers,
          activeManufacturers,
          pendingVerification,
          activeManufacturingOrders: activeMfgOrders,
          completedManufacturingOrders: completedMfgOrders
        },
        deliveryOrders: dbDeliveryOrders,
        installationOrders: dbInstallationOrders,
        deliveryStats: {
          totalPartners: totalDeliveryPartnersCount,
          activePartners: activeDeliveryPartnersCount,
          pendingDeliveries: dbPendingDeliveries,
          completedDeliveries: dbCompletedDeliveries,
          pendingInstallation: dbPendingInstallationCount
        },
        products, 
        aiDesigns, 
        manualDesigns, 
        designerRequests, 
        orders: unifiedOrders 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all vendor Business Verification documents
// @route   GET /api/admin/verifications
// @access  Private (Admin)
exports.getAllVerifications = async (req, res) => {
  try {


    const verificationList = await VendorVerification.find({}).populate('vendorId', 'companyName').sort('-submittedAt');
    res.status(200).json({ success: true, data: verificationList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject Business Verification
// @route   PUT /api/admin/verifications/:id
// @access  Private (Admin)
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;



    const verification = await VendorVerification.findByIdAndUpdate(req.params.id, { status, adminRemarks, updatedAt: new Date() }, { new: true });
    if (!verification) return res.status(404).json({ success: false, message: 'Verification record not found' });

    const vendor = await Vendor.findByIdAndUpdate(verification.vendorId, { verificationStatus: status }, { new: true });
    if (vendor) {
      if (status === 'Approved') {
        vendor.accountActivationStatus = 'Store Setup Pending';
        vendor.isVerified = true;
        vendor.verificationStatus = 'Approved';
        await Notification.create({ userId: vendor.userId, message: 'Your business verification has been approved.' });
      } else if (status === 'Under Review') {
        vendor.accountActivationStatus = 'Under Review';
        vendor.verificationStatus = 'Under Review';
        await Notification.create({ userId: vendor.userId, message: 'Your business verification is now under review. We will notify you once a decision is made.' });
      } else if (status === 'Rejected') {
        vendor.accountActivationStatus = 'Rejected';
        vendor.verificationStatus = 'Rejected';
        await Notification.create({ userId: vendor.userId, message: 'Your business verification has been rejected. Reason: ' + (adminRemarks || 'Please resubmit with correct documents.') });
      }
      await vendor.save();
    }

    await AdminLog.create({ adminId: req.user.id, action: 'Updated business verification status to ' + status + ' for vendor ' + (vendor?.companyName || 'Unknown') });

    res.status(200).json({ success: true, data: verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete manual design
// @route   DELETE /api/admin/manual-designs/:id
// @access  Private (Admin)
exports.deleteManualDesign = async (req, res) => {
  try {
    const deleted = await ManualDesignRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const idx = controllerMockManualDesigns.findIndex(m => m._id === req.params.id);
      if (idx !== -1) controllerMockManualDesigns.splice(idx, 1);
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete designer request
// @route   DELETE /api/admin/designer-requests/:id
// @access  Private (Admin)
exports.deleteDesignerRequest = async (req, res) => {
  try {
    await InteriorDesignerRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    let deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) deleted = await MarketplaceOrder.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllStoreApprovals = async (req, res) => {
  try {


    const storeApprovals = await Vendor.find({ storeSetupStatus: 'Submitted' }).select('companyName description specialization monthlyCapacity serviceAreas storeSetupStatus');
    res.status(200).json({ success: true, data: storeApprovals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject Store Setup
// @route   PUT /api/admin/store-approvals/:id
// @access  Private (Admin)
exports.updateStoreApprovalStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;



    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { storeSetupStatus: status }, { new: true });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor record not found' });

    if (status === 'Approved') {
      vendor.accountActivationStatus = 'Active';
      vendor.isActive = true;
      vendor.isVerified = true;
    } else {
      vendor.accountActivationStatus = 'Rejected';
      vendor.isActive = false;
    }
    await vendor.save();

    await Notification.create({ userId: vendor.userId, message: `Your Store/Profile Setup verification has been marked as ${status.toUpperCase()}. Remarks: ${adminRemarks}` });

    await AdminLog.create({ adminId: req.user.id, action: `Verified store setup status to ${status} for vendor ${vendor.companyName}` });

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products pending quality review
// @route   GET /api/admin/product-reviews
// @access  Private (Admin)
exports.getAllPendingProducts = async (req, res) => {
  try {


    const products = await Product.find({ approvalStatus: 'Pending' }).populate('vendorId', 'companyName');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject Product Quality
// @route   PUT /api/admin/product-reviews/:id
// @access  Private (Admin)
exports.updateProductReviewStatus = async (req, res) => {
  try {
    const { approvalStatus } = req.body;



    const product = await Product.findByIdAndUpdate(req.params.id, { approvalStatus }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Vendor Active Status
// @route   PUT /api/admin/vendor-activation/:id
// @access  Private (Admin)
exports.updateVendorActivation = async (req, res) => {
  try {
    const { isActive } = req.body;



    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    await Notification.create({ userId: vendor.userId, message: `Your partner account activation status is now: ${isActive ? 'ACTIVATED (Live)' : 'SUSPENDED'}.` });
    await AdminLog.create({ adminId: req.user.id, action: `Updated activation of vendor ${vendor.companyName} to ${isActive}` });

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Manufacturer Production Load
// @route   GET /api/admin/manufacturers/:id/load
// @access  Private (Admin)
exports.getManufacturerLoad = async (req, res) => {
  try {
    const { id } = req.params;



    const load = await ManufacturingOrder.find({ manufacturerId: id })
      .populate('orderId')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: load });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign Manufacturing Order to Manufacturer
// @route   POST /api/admin/manufacturers/assign-order
// @access  Private (Admin)
exports.assignManufacturerOrder = async (req, res) => {
  try {
    const { orderId, manufacturerId, designDetails, measurements, materials, budget } = req.body;



    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.manufacturerId = manufacturerId;
    order.orderStatus = 'Manufacturing';
    await order.save();

    const mfgOrder = await ManufacturingOrder.create({
      orderId,
      manufacturerId,
      designDetails,
      measurements,
      materials,
      budget,
      status: 'Accepted'
    });

    const vendor = await Vendor.findById(manufacturerId);
    if (vendor) {
      await Notification.create({
        userId: vendor.userId,
        message: `New manufacturing order assigned: Order ID ${orderId}. Design Details: ${designDetails}`,
        type: 'info'
      });
      await AdminLog.create({
        adminId: req.user.id,
        action: `Assigned manufacturing order ${orderId} to ${vendor.companyName}`
      });
    }

    res.status(200).json({ success: true, message: 'Manufacturing Order assigned successfully', data: mfgOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Manufacturer Verification & Store Setup
// @route   PUT /api/admin/manufacturers/:id/approve
// @access  Private (Admin)
exports.approveManufacturer = async (req, res) => {
  try {
    const { id } = req.params;



    const vendor = await Vendor.findByIdAndUpdate(id, {
      verificationStatus: 'Approved',
      isVerified: true,
      isActive: true,
      storeSetupStatus: 'Approved',
      accountActivationStatus: 'Active'
    }, { new: true });

    if (!vendor) return res.status(404).json({ success: false, message: 'Manufacturer not found' });

    // Also update associated Verification
    await VendorVerification.findOneAndUpdate({ vendorId: id }, { status: 'Approved', adminRemarks: 'Approved by Administrator' });

    await Notification.create({
      userId: vendor.userId,
      message: 'Congratulations! Your manufacturer account has been fully verified and is now live.',
      type: 'info'
    });

    await AdminLog.create({
      adminId: req.user.id,
      action: `Approved Manufacturer ${vendor.companyName}`,
      details: 'Business verification and store setup details successfully approved.'
    });

    res.status(200).json({ success: true, message: 'Manufacturer approved successfully', data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend Manufacturer
// @route   PUT /api/admin/manufacturers/:id/suspend
// @access  Private (Admin)
exports.suspendManufacturer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;



    const vendor = await Vendor.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!vendor) return res.status(404).json({ success: false, message: 'Manufacturer not found' });

    await Notification.create({
      userId: vendor.userId,
      message: `Your manufacturer account has been suspended by an administrator. Reason: ${reason || 'Compliance violation'}`,
      type: 'alert'
    });

    await AdminLog.create({
      adminId: req.user.id,
      action: `Suspended Manufacturer ${vendor.companyName}`,
      details: `Suspended status. Reason: ${reason || 'No reason provided'}`
    });

    res.status(200).json({ success: true, message: 'Manufacturer suspended successfully', data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Manufacturer Payment History
// @route   GET /api/admin/manufacturers/:id/payments
// @access  Private (Admin)
exports.getManufacturerPayments = async (req, res) => {
  try {
    const { id } = req.params;



    const orderPayments = await Payment.find({ vendorId: id });

    const standardPayouts = orderPayments.map(p => ({
      _id: p._id,
      type: 'Order Payout',
      amount: p.amount,
      status: p.status === 'success' ? 'Settled' : p.status,
      reference: p.transactionId || 'N/A',
      date: p.createdAt
    }));

    const allPayments = [...standardPayouts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({ success: true, data: allPayments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Delivery/Installation Status
// @route   PUT /api/admin/delivery/update-status
// @access  Private (Admin)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, type, status, trackingNotes, scheduledDate, notes } = req.body;



    if (type === 'delivery') {
      let dOrd = await DeliveryOrder.findOne({ orderId });
      if (!dOrd) {
        // Fallback check by direct ID
        dOrd = await DeliveryOrder.findById(orderId);
      }
      if (!dOrd) return res.status(404).json({ success: false, message: 'Delivery record not found' });

      dOrd.status = status;
      if (trackingNotes) dOrd.trackingNotes = trackingNotes;
      await dOrd.save();

      // Update parent order status
      if (status === 'Delivered') {
        await Order.findByIdAndUpdate(dOrd.orderId, { orderStatus: 'Completed' });
      } else {
        await Order.findByIdAndUpdate(dOrd.orderId, { orderStatus: 'Delivery Assigned' });
      }
    } else if (type === 'installation') {
      let iOrd = await InstallationOrder.findOne({ orderId });
      if (!iOrd) {
        iOrd = await InstallationOrder.findById(orderId);
      }
      if (!iOrd) return res.status(404).json({ success: false, message: 'Installation record not found' });

      iOrd.status = status;
      if (notes) iOrd.notes = notes;
      if (scheduledDate) iOrd.scheduledDate = scheduledDate;
      await iOrd.save();

      if (status === 'Installation Completed') {
        await Order.findByIdAndUpdate(iOrd.orderId, { orderStatus: 'Completed' });
      } else {
        await Order.findByIdAndUpdate(iOrd.orderId, { orderStatus: 'Installation Assigned' });
      }
    }

    res.status(200).json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign vendor to AI Design request
// @route   PUT /api/admin/ai-designs/:id/assign-vendor
// @access  Private (Admin)
exports.assignAIDesignVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId } = req.body;



    const design = await AIDesignRequest.findById(id);
    if (!design) return res.status(404).json({ success: false, message: 'AI Design request not found' });

    if (!design.assignedVendor) {
      design.assignedVendor = vendorId;
    } else {
      design.additionalVendors = design.additionalVendors || [];
      design.additionalVendors.push(vendorId);
    }
    await design.save();

    // Create notifications
    const vendor = await Vendor.findById(vendorId).populate('userId');
    if (vendor && vendor.userId) {
      await Notification.create({
        userId: vendor.userId._id,
        message: 'New AI request assigned by Admin',
        type: 'info'
      });
    }

    res.status(200).json({ success: true, message: 'Vendor assigned successfully', data: design });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Convert AI Design request to a full Order
// @route   POST /api/admin/ai-designs/:id/convert-order
// @access  Private (Admin)
exports.convertToAIDesignOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { manufacturerId } = req.body; // Vendor ID of the manufacturer



    const design = await AIDesignRequest.findById(id).populate('userId');
    if (!design) return res.status(404).json({ success: false, message: 'AI Design request not found' });

    // Create a new Order in DB
    const newOrder = await Order.create({
      userId: design.userId._id,
      vendorId: design.assignedVendor || manufacturerId,
      orderType: 'custom_design',
      totalAmount: design.aiSuggestion?.budgetEstimate || 3000,
      orderStatus: 'Manufacturing',
      paymentStatus: 'paid',
      shippingAddress: design.userId.address || 'User Address On File'
    });

    // Create a Manufacturing Order
    await ManufacturingOrder.create({
      orderId: newOrder._id,
      manufacturerId: manufacturerId,
      designDetails: `AI Studio Design - ${design.roomType} (${design.stylePreference})`,
      measurements: 'Room space tailored',
      materials: design.aiSuggestion?.materials?.join(', ') || 'Standard AI Choice',
      budget: newOrder.totalAmount,
      status: 'Accepted'
    });

    design.orderId = newOrder._id;
    design.orderStatus = 'Pending Manufacturing';
    await design.save();

    // Create notifications
    // Notify User
    await Notification.create({
      userId: design.userId._id,
      message: `Your AI Design for ${design.roomType} has been converted into a production order!`,
      type: 'info'
    });

    // Notify Manufacturer
    const mfg = await Vendor.findById(manufacturerId).populate('userId');
    if (mfg && mfg.userId) {
      await Notification.create({
        userId: mfg.userId._id,
        message: `New AI-generated manufacturing order assigned to you! Budget: $${newOrder.totalAmount}`,
        type: 'info'
      });
    }

    res.status(200).json({ success: true, message: 'AI Design converted to order successfully', data: design });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject AI Design Request
// @route   PUT /api/admin/ai-designs/:id/status
// @access  Private (Admin)
exports.updateAIDesignAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'generated', 'rejected', etc.



    const design = await AIDesignRequest.findById(id);
    if (!design) return res.status(404).json({ success: false, message: 'AI Design request not found' });

    design.status = status;
    await design.save();

    // Create notifications
    await Notification.create({
      userId: design.userId,
      message: status === 'generated' 
        ? `Your AI studio room request has been processed and approved!` 
        : `Your AI studio room request could not be processed.`,
      type: status === 'generated' ? 'info' : 'alert'
    });

    res.status(200).json({ success: true, message: `Status updated to ${status} successfully`, data: design });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign Vendor to Manual Design Request
// @route   PUT /api/admin/manual-designs/:id/assign-vendor
// @access  Private (Admin)
exports.assignManualDesignVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId } = req.body;



    const design = await ManualDesignRequest.findById(id);
    if (!design) return res.status(404).json({ success: false, message: 'Manual Design request not found' });

    design.assignedVendorId = vendorId;
    design.status = 'Vendor Review';
    await design.save();

    // Populate for response
    const updated = await ManualDesignRequest.findById(id)
      .populate('userId', 'name email')
      .populate('assignedVendorId', 'companyName')
      .populate('assignedDesignerId', 'companyName');

    // Notify assigned vendor
    const vendor = await Vendor.findById(vendorId).populate('userId');
    if (vendor && vendor.userId) {
      await Notification.create({
        userId: vendor.userId._id,
        message: `New manual design request assigned to you: Room - ${design.roomType}, Style - ${design.style}`,
        type: 'info'
      });
    }

    res.status(200).json({ success: true, message: 'Vendor assigned successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign Designer to Manual Design Request
// @route   PUT /api/admin/manual-designs/:id/assign-designer
// @access  Private (Admin)
exports.assignManualDesignDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const { designerId } = req.body;



    const design = await ManualDesignRequest.findById(id);
    if (!design) return res.status(404).json({ success: false, message: 'Manual Design request not found' });

    design.assignedDesignerId = designerId;
    design.status = 'Vendor Review';
    await design.save();

    // Populate for response
    const updated = await ManualDesignRequest.findById(id)
      .populate('userId', 'name email')
      .populate('assignedVendorId', 'companyName')
      .populate('assignedDesignerId', 'companyName');

    // Notify assigned designer
    const designer = await Vendor.findById(designerId).populate('userId');
    if (designer && designer.userId) {
      await Notification.create({
        userId: designer.userId._id,
        message: `New interior designer consultation request assigned to you: Room - ${design.roomType}, Style - ${design.style}`,
        type: 'info'
      });
    }

    res.status(200).json({ success: true, message: 'Interior Designer assigned successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Manual Design Status
// @route   PUT /api/admin/manual-designs/:id/status
// @access  Private (Admin)
exports.updateManualDesignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;



    const design = await ManualDesignRequest.findById(id);
    if (!design) return res.status(404).json({ success: false, message: 'Manual Design request not found' });

    design.status = status;
    await design.save();

    const updated = await ManualDesignRequest.findById(id)
      .populate('userId', 'name email')
      .populate('assignedVendorId', 'companyName')
      .populate('assignedDesignerId', 'companyName');

    // Notify User
    await Notification.create({
      userId: design.userId,
      message: `Your manual interior design request status has been updated to: ${status}`,
      type: 'info'
    });

    res.status(200).json({ success: true, message: `Status updated to ${status} successfully`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Manual Design Request
// @route   PUT /api/admin/manual-designs/:id/approve
// @access  Private (Admin)
exports.approveManualDesign = async (req, res) => {
  try {
    const { id } = req.params;



    const design = await ManualDesignRequest.findById(id);
    if (!design) return res.status(404).json({ success: false, message: 'Manual Design request not found' });

    design.status = 'User Approved';
    await design.save();

    const updated = await ManualDesignRequest.findById(id)
      .populate('userId', 'name email')
      .populate('assignedVendorId', 'companyName')
      .populate('assignedDesignerId', 'companyName');

    // Notify User
    await Notification.create({
      userId: design.userId,
      message: `🎉 Congratulations! Your custom design quotation has been approved. Manufacturing phase will commence shortly.`,
      type: 'info'
    });

    // Notify Vendor
    if (design.assignedVendorId) {
      const vendor = await Vendor.findById(design.assignedVendorId).populate('userId');
      if (vendor && vendor.userId) {
        await Notification.create({
          userId: vendor.userId._id,
          message: `User has approved the quotation for custom room design request ${design._id}. Please start manufacturing.`,
          type: 'info'
        });
      }
    }

    res.status(200).json({ success: true, message: 'Manual request approved successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Manual Design Request
// @route   PUT /api/admin/manual-designs/:id/reject
// @access  Private (Admin)
exports.rejectManualDesign = async (req, res) => {
  try {
    const { id } = req.params;



    const design = await ManualDesignRequest.findById(id);
    if (!design) return res.status(404).json({ success: false, message: 'Manual Design request not found' });

    design.status = 'Submitted'; // Reset to submitted or rejected
    await design.save();

    const updated = await ManualDesignRequest.findById(id)
      .populate('userId', 'name email')
      .populate('assignedVendorId', 'companyName')
      .populate('assignedDesignerId', 'companyName');

    // Notify User
    await Notification.create({
      userId: design.userId,
      message: `Your quotation for manual design request ${design._id} could not be approved. Request reset to Submitted.`,
      type: 'alert'
    });

    res.status(200).json({ success: true, message: 'Manual request rejected/reset successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign Designer to Interior Designer Request
// @route   PUT /api/admin/designer-requests/:id/assign
// @access  Private (Admin)
exports.assignDesignerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { designerId } = req.body;



    const request = await InteriorDesignerRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: 'Designer request not found' });

    request.assignedDesignerId = designerId;
    request.status = 'assigned';
    await request.save();

    const updated = await InteriorDesignerRequest.findById(id)
      .populate('userId', 'name email')
      .populate('assignedDesignerId', 'companyName');

    // Notify assigned designer
    const designer = await Vendor.findById(designerId).populate('userId');
    if (designer && designer.userId) {
      await Notification.create({
        userId: designer.userId._id,
        message: `New premium interior designer consultation request assigned to you: Request #${id.slice(-6)}`,
        type: 'info'
      });
    }

    res.status(200).json({ success: true, message: 'Designer assigned successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Interior Designer Request Status
// @route   PUT /api/admin/designer-requests/:id/status
// @access  Private (Admin)
exports.updateDesignerRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;



    const request = await InteriorDesignerRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: 'Designer request not found' });

    request.status = status;
    await request.save();

    const updated = await InteriorDesignerRequest.findById(id)
      .populate('userId', 'name email')
      .populate('assignedDesignerId', 'companyName');

    // Notify User
    await Notification.create({
      userId: request.userId,
      message: `Your premium interior designer consultation request status has been updated to: ${status}`,
      type: 'info'
    });

    res.status(200).json({ success: true, message: `Status updated to ${status} successfully`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all transactions & platform commission data
// @route   GET /api/admin/transactions
// @access  Private (Admin)
exports.getTransactions = async (req, res) => {
  try {


    // Database mode
    // Query all Payments
    const payments = await Payment.find({})
      .populate('userId', 'name email')
      .populate({
        path: 'orderId',
        populate: {
          path: 'vendorId',
          select: 'companyName'
        }
      })
      .sort('-createdAt');

    // Convert payments to unified transactions list
    const transactionsList = payments.map(p => {
      const comm = p.amount * (PLATFORM_COMMISSION_RATE / 100);
      return {
        _id: p.transactionId || p._id,
        orderId: p.orderId?._id || p.orderId,
        userId: p.userId || { name: 'Customer' },
        vendorId: p.orderId?.vendorId || { companyName: 'N/A' },
        amount: p.amount,
        commissionAmount: comm,
        netPayout: p.amount - comm,
        paymentMethod: p.paymentMethod || 'Card',
        status: p.status === 'success' ? 'Paid' : p.status === 'failed' ? 'Failed' : 'Pending',
        type: 'Customer Payment',
        createdAt: p.createdAt
      };
    });

    // Calculate database stats
    const totalPlatformRevenue = payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);

    const estimatedCommission = totalPlatformRevenue * (PLATFORM_COMMISSION_RATE / 100);

    // Dynamic database calculation for disbursed/pending
    const disbursedPayouts = transactionsList
      .filter(t => t.status === 'Paid' && t.type === 'Vendor Payout')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingPayouts = transactionsList
      .filter(t => t.status === 'Pending')
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        transactions: transactionsList,
        commissionRate: PLATFORM_COMMISSION_RATE,
        stats: {
          totalPlatformRevenue,
          estimatedCommission,
          disbursedPayouts,
          pendingPayouts
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update platform commission rate
// @route   PUT /api/admin/commission-rate
// @access  Private (Admin)
exports.updateCommissionRate = async (req, res) => {
  try {
    const { rate } = req.body;
    if (rate === undefined || isNaN(rate) || rate < 0 || rate > 100) {
      return res.status(400).json({ success: false, message: 'Please provide a valid rate between 0 and 100' });
    }
    
    PLATFORM_COMMISSION_RATE = Number(rate);
    res.status(200).json({ success: true, message: `Platform commission rate updated to ${rate}%`, commissionRate: PLATFORM_COMMISSION_RATE });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Disburse vendor payout
// @route   POST /api/admin/transactions/disburse
// @access  Private (Admin)
exports.disbursePayout = async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }



    // In DB mode, update status in Payments
    const pay = await Payment.findOne({ transactionId });
    if (!pay) {
      // Create a mock payout entry if not found or update existing Payment
      const p = await Payment.findById(transactionId);
      if (!p) return res.status(404).json({ success: false, message: 'Transaction payment record not found' });
      p.status = 'success';
      await p.save();
      return res.status(200).json({ success: true, message: 'Payout disbursed successfully', data: p });
    }

    pay.status = 'success';
    await pay.save();

    res.status(200).json({ success: true, message: 'Payout disbursed successfully', data: pay });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all sub-admins and their permissions
// @route   GET /api/admin/permissions
// @access  Private (Admin)
exports.getSubAdmins = async (req, res) => {
  try {


    const subAdmins = await AdminPermission.find({}).populate('userId', 'name email phone role');
    res.status(200).json({ success: true, data: subAdmins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new sub-admin role & permissions
// @route   POST /api/admin/permissions
// @access  Private (Admin)
exports.addSubAdmin = async (req, res) => {
  try {
    const { userId, roleName, permissions } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }



    // DB Mode: Promote user to admin role, then save permissions
    const userObj = await User.findById(userId);
    if (!userObj) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    userObj.role = 'admin';
    await userObj.save();

    const subAdmin = await AdminPermission.create({
      userId,
      roleName: roleName || 'Moderator',
      permissions
    });

    const populated = await subAdmin.populate('userId', 'name email phone role');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update sub-admin permissions
// @route   PUT /api/admin/permissions/:id
// @access  Private (Admin)
exports.updateSubAdminPermissions = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;



    const subAdmin = await AdminPermission.findByIdAndUpdate(
      req.params.id,
      { roleName, permissions, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'name email phone role');

    if (!subAdmin) {
      return res.status(404).json({ success: false, message: 'Sub-admin not found' });
    }

    res.status(200).json({ success: true, data: subAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Revoke sub-admin permission record & demote user to 'user' role
// @route   DELETE /api/admin/permissions/:id
// @access  Private (Admin)
exports.deleteSubAdmin = async (req, res) => {
  try {


    const subAdmin = await AdminPermission.findById(req.params.id);
    if (!subAdmin) {
      return res.status(404).json({ success: false, message: 'Sub-admin not found' });
    }

    // Demote user to standard 'user' role
    const userObj = await User.findById(subAdmin.userId);
    if (userObj) {
      userObj.role = 'user';
      await userObj.save();
    }

    await AdminPermission.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Sub-admin permissions revoked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

