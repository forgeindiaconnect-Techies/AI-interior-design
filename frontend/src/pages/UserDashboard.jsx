import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Wand2, UploadCloud, CheckCircle, RefreshCw, XCircle, ShoppingBag, 
  HelpCircle, Hammer, DollarSign, Clock, Star, MessageSquare, AlertCircle, Eye, Check,
  LayoutDashboard, ShoppingCart, Truck, CreditCard, User as UserIcon, Bookmark, Bell, ArrowRight, Activity, Package, AlertTriangle, FileText, PlayCircle, Smartphone, Bot, Building2
} from 'lucide-react';
import { useToast } from '../components/Toast';
import Marketplace from './Marketplace';

const UserDashboard = ({ 
  activeTab = 'overview', 
  setActiveTab,
  notifications = [],
  onNotifClick,
  onMarkAllRead,
  searchQuery = ''
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.showSuccessPopup) {
      setShowSuccessPopup(true);
      // Clear location state to prevent popup from showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // AI Studio State
  const [roomType, setRoomType] = useState('Living Room');
  const [originalImage, setOriginalImage] = useState('');
  const [aiDesigns, setAiDesigns] = useState([]);
  const filteredAiDesigns = aiDesigns.filter(d => 
    !searchQuery || 
    d.roomType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.aiSuggestion?.furniture?.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const savedDesigns = filteredAiDesigns.filter(d => d.isBookmarked || d.status === 'accepted' || d.status === 'execution');
  const [loadingAi, setLoadingAi] = useState(false);

  // Manual Design State
  const [manualStyle, setManualStyle] = useState('Modern');
  const [manualBudget, setManualBudget] = useState('Below ₹50,000');
  const [manualSize, setManualSize] = useState('Medium');
  const [manualMaterials, setManualMaterials] = useState('');
  const [manualRequirements, setManualRequirements] = useState('');
  const [manualDesigns, setManualDesigns] = useState([]);
  const filteredManualDesigns = manualDesigns.filter(d => 
    !searchQuery || 
    d.roomType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.requirements?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // --- New fields ---
  const [referenceImages, setReferenceImages] = useState([]);
  const [ownMaterials, setOwnMaterials] = useState('No');
  const [materialDetails, setMaterialDetails] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialImages, setMaterialImages] = useState([]);
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupNeeded, setPickupNeeded] = useState('No');
  const [timeline, setTimeline] = useState('Flexible');
  const [needDesigner, setNeedDesigner] = useState('No');
  const [serviceAddress, setServiceAddress] = useState('');
  const [vendorPref, setVendorPref] = useState('Any Vendor');
  const [quotationType, setQuotationType] = useState('Fixed Budget');
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // Marketplace State
  const [products, setProducts] = useState([]);

  // Designer Request State
  const [designerDetails, setDesignerDetails] = useState('');
  const [designerBudget, setDesignerBudget] = useState('');

  // Orders & Quotations State
  const [orders, setOrders] = useState([]);
  const filteredOrders = orders.filter(o => 
    !searchQuery || 
    o._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shippingAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.vendorId?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.productDetails?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [pendingPaid, setPendingPaid] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckoutSummary, setShowCheckoutSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Google Pay');
  const [viewingQuotation, setViewingQuotation] = useState(null);
  const [quotationPayment, setQuotationPayment] = useState(null);
  const [quotationPaymentMethod, setQuotationPaymentMethod] = useState('Google Pay');
  const [quotationProcessing, setQuotationProcessing] = useState(false);
  const [aiQuotationPayment, setAiQuotationPayment] = useState(null);
  const [aiQuotationProcessing, setAiQuotationProcessing] = useState(false);
  const [aiQuotationOrders, setAiQuotationOrders] = useState([]);

  // Ticket & Review State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTargetId, setReviewTargetId] = useState('');


  const [directMessages, setDirectMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [selectedVendorMsg, setSelectedVendorMsg] = useState('Artisan Workshop Ltd');

  // Help Center Live Chat States
  const [helpMessages, setHelpMessages] = useState([]);
  const [helpInput, setHelpInput] = useState('');

  useEffect(() => {
    if (activeTab === 'messages') {
      const loadMessages = () => {
        const msgs = JSON.parse(localStorage.getItem('mockDirectMessages') || '[]');
        setDirectMessages(msgs);
      };
      loadMessages();
      const interval = setInterval(loadMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'support') {
      const loadHelpMessages = () => {
        const msgs = JSON.parse(localStorage.getItem('mockHelpCenterMessages') || '[]');
        setHelpMessages(msgs);
      };
      loadHelpMessages();
      const interval = setInterval(loadHelpMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleSendDirectMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const newMsg = {
      _id: 'dm_' + Date.now(),
      sender: 'user',
      userName: user?.name || 'User Demo',
      userEmail: user?.email || 'user@example.com',
      vendorName: selectedVendorMsg,
      message: msgInput,
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('mockDirectMessages') || '[]');
    const updated = [...existing, newMsg];
    localStorage.setItem('mockDirectMessages', JSON.stringify(updated));
    setDirectMessages(updated);
    setMsgInput('');

    // Trigger notification to vendor
    const notifObj = {
      _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message: `New direct message from ${user?.name || 'User Demo'}: "${msgInput.substring(0, 35)}..."`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    };
    const vNotifs = JSON.parse(localStorage.getItem('mockVendorNotifications') || '[]');
    localStorage.setItem('mockVendorNotifications', JSON.stringify([notifObj, ...vNotifs]));
  };

  const handleSendHelpMessage = (e) => {
    e.preventDefault();
    if (!helpInput.trim()) return;

    const email = user?.email || 'user@example.com';
    const name = user?.name || 'User Demo';

    const newMsg = {
      _id: 'hm_' + Date.now(),
      userName: name,
      userEmail: email,
      sender: 'user',
      senderName: name,
      message: helpInput,
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('mockHelpCenterMessages') || '[]');
    const updated = [...existing, newMsg];
    localStorage.setItem('mockHelpCenterMessages', JSON.stringify(updated));
    setHelpMessages(updated);
    setHelpInput('');

    // Trigger notification to vendor
    const notifMsg = `[Help Center] New message from customer ${name}: "${helpInput.substring(0, 30)}..."`;
    const vNotifs = JSON.parse(localStorage.getItem('mockVendorNotifications') || '[]');
    localStorage.setItem('mockVendorNotifications', JSON.stringify([{
      _id: `notif_${Date.now()}_v`,
      message: notifMsg,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    }, ...vNotifs]));

    // Trigger notification to admin
    const aNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
    localStorage.setItem('mockAdminNotifications', JSON.stringify([{
      _id: `notif_${Date.now()}_a`,
      message: notifMsg,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    }, ...aNotifs]));
  };

  useEffect(() => {
    fetchUserData();

    const handleSync = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    const interval = setInterval(fetchUserData, 3000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'quotations' || activeTab === 'manual') {
      const localManual = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
      setManualDesigns(localManual);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'cart') {
      const localCart = JSON.parse(localStorage.getItem('mockCart') || '[]');
      setCartItems(localCart);
      
      const syncProducts = async () => {
        let localProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
        try {
          const res = await axios.get('/products');
          if (res.data && res.data.data && res.data.data.length > 0) {
            const serverProds = res.data.data;
            const mergedMap = new Map();
            serverProds.forEach(p => mergedMap.set(p._id, p));
            localProducts.forEach(p => mergedMap.set(p._id, p));
            const sorted = Array.from(mergedMap.values()).sort((a, b) => b._id.localeCompare(a._id));
            setProducts(sorted);
            localStorage.setItem('mockProducts', JSON.stringify(sorted));
          } else {
            setProducts(localProducts);
          }
        } catch (err) {
          console.warn('Backend products fetch failed in activeTab cart useEffect:', err);
          setProducts(localProducts);
        }
      };
      syncProducts();
    } else {
      setShowCheckoutSummary(false);
    }
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      // 1. AI Designs
      let localAi = JSON.parse(localStorage.getItem('mockAiDesigns') || 'null');
      if (!localAi) {
        localAi = [
          { 
            _id: 'ai_1', 
            roomType: 'Living Room', 
            generatedImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', 
            aiSuggestion: { 
              furniture: ['Modern Sofa', 'Glass Coffee Table', 'Minimalist TV Stand'],
              materials: ['Oak Wood', 'Beige Linen', 'Brushed Brass'],
              colorPalette: ['Beige', 'Warm Oak', 'Emerald green accents'],
              budgetEstimate: 3500 
            }, 
            status: 'accepted',
            createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
          }
        ];
        localStorage.setItem('mockAiDesigns', JSON.stringify(localAi));
      }

      // 2. Manual Requests
      let localManual = JSON.parse(localStorage.getItem('mockManualRequests') || 'null');
      if (!localManual) {
        localManual = [
          {
            _id: 'man_1',
      requestType: needDesigner === 'Yes' ? 'INTERIOR_DESIGN' : 'Manual Design',
            userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: '+91 98765 43210' },
            roomType: 'Bedroom',
            style: 'Minimalist',
            budget: '₹50,000 - ₹1,00,000',
            size: 'Medium',
            requirements: 'Cozy and dark theme with hidden lighting.',
            materials: 'Oak wood paneling, beige linen fabrics',
            timeline: 'Within 1 Month',
            ownMaterialsAvailable: 'No',
            status: 'Submitted',
            assignedVendorId: { _id: 'mock_vendor_id_123', name: 'Artisan Workshop' },
            createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
          },
          {
            _id: 'man_2',
            requestType: 'Interior Designer Help',
            userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: '+91 98765 43210' },
            roomType: 'Living Room',
            style: 'Modern',
            budget: 'Above ₹3,0,000',
            size: 'Large',
            requirements: 'Open layout consultation for family room.',
            materials: 'Marble flooring, brass accents',
            timeline: 'Flexible',
            ownMaterialsAvailable: 'Yes',
            materialDetails: 'Teak wood panels and white marble tiles',
            materialQuantity: '40 sq ft teak, 120 sq ft marble',
            materialPickupNeeded: 'Yes',
            pickupAddress: 'Block 4B, Sector 62, Noida',
            status: 'Submitted',
            assignedVendorId: { _id: 'mock_vendor_id_123', name: 'Artisan Workshop' },
            createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
          }
        ];
        localStorage.setItem('mockManualRequests', JSON.stringify(localManual));
      }

      // 3. Products
      let localProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      if (localProducts.length === 0) {
        localProducts = [
          { _id: 'prod_1', title: 'Velvet Emerald Sofa', price: 1299, category: 'Living Room', rating: 4.8, reviewsCount: 124, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Artisan Workshop' } },
          { _id: 'prod_2', title: 'Minimalist Teak Coffee Table', price: 449, category: 'Living Room', rating: 4.5, reviewsCount: 89, images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Artisan Workshop' } },
          { _id: 'prod_3', title: 'Nordic Oak Dining Chair', price: 210, category: 'Dining Room', rating: 4.9, reviewsCount: 300, images: ['https://images.unsplash.com/photo-1503642551022-c011aafb3c88?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Nordic Design Ltd' } },
          { _id: 'prod_4', title: 'Modern Brass Floor Lamp', price: 320, category: 'Lighting', rating: 4.7, reviewsCount: 156, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Nordic Design Ltd' } },
          { _id: 'prod_5', title: 'Luxury Marble Side Table', price: 580, category: 'Living Room', rating: 4.6, reviewsCount: 45, images: ['https://images.unsplash.com/photo-1630585304653-5355a297e61e?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Luxury Living Inc' } },
          { _id: 'prod_6', title: 'Ergonomic Lounge Chair', price: 890, category: 'Bedroom', rating: 4.9, reviewsCount: 412, images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Luxury Living Inc' } }
        ];
        localStorage.setItem('mockProducts', JSON.stringify(localProducts));
      }

      try {
        const res = await axios.get('/products');
        if (res.data && res.data.data && res.data.data.length > 0) {
          const serverProds = res.data.data;
          const mergedMap = new Map();
          serverProds.forEach(p => mergedMap.set(p._id, p));
          localProducts.forEach(p => mergedMap.set(p._id, p));
          localProducts = Array.from(mergedMap.values()).sort((a, b) => b._id.localeCompare(a._id));
          localStorage.setItem('mockProducts', JSON.stringify(localProducts));
        }
      } catch (err) {
        console.warn('Backend products fetch failed in UserDashboard:', err);
      }

      // 4. Orders
      let localOrders = JSON.parse(localStorage.getItem('mockOrders') || 'null');
      if (!localOrders) {
        localOrders = [
          {
            _id: 'ord_d_9182',
            orderType: 'AI Design',
            userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 4500,
            paymentStatus: 'paid',
            orderStatus: 'Quotation Accepted',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 15).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
            shippingAddress: '789 Designer Lane, New York, NY, USA'
          },
          {
            _id: 'ord_m_2210',
            orderType: 'Manual Design',
            userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: { _id: 'v2', companyName: 'Elite Woodworks' },
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 8500,
            paymentStatus: 'paid',
            orderStatus: 'Manufacturer Assigned',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 20).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
            shippingAddress: '12, Mahatma Gandhi Road, Bangalore, India'
          },
          {
            _id: 'ord_p_1044',
            orderType: 'Marketplace Product',
            userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: { _id: 'del_mock_1', companyName: 'Swift Logistics Solutions' },
            installationPartnerId: null,
            totalAmount: 1250,
            paymentStatus: 'paid',
            orderStatus: 'Delivery Assigned',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
            shippingAddress: '456 Cinema Road, Los Angeles, CA, USA'
          }
        ];
        localStorage.setItem('mockOrders', JSON.stringify(localOrders));
      }

      const localCart = JSON.parse(localStorage.getItem('mockCart') || '[]');

      setAiDesigns(localAi);
      setManualDesigns(localManual);
      setProducts(localProducts);
      setOrders(localOrders);
      setCartItems(localCart);

      const aiQuoteOrders = localOrders.filter(o => o.orderType === 'AI Design' && o.orderStatus === 'quotation_sent');
      setAiQuotationOrders(aiQuoteOrders);
    } catch (error) {
      console.error('Error fetching user dashboard data', error);
    }
  };

  // AI Studio Actions
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    setLoadingAi(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockImg = originalImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60';
    const newDesign = {
      _id: 'ai_' + Date.now(),
      userId: user?._id || 'u_local',
      roomType,
      originalImage: mockImg,
      generatedImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800',
      aiSuggestion: {
        furniture: ['Custom Teak Sofa', 'Minimalist Oak Coffee Table', 'Modern Brass Sconces'],
        materials: ['Teak Wood', 'Linen', 'Brass'],
        colorPalette: ['Teak Warmth', 'Beige Linen', 'Warm Brass Accent'],
        budgetEstimate: 4200
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const localAi = JSON.parse(localStorage.getItem('mockAiDesigns') || '[]');
    const updated = [newDesign, ...localAi];
    localStorage.setItem('mockAiDesigns', JSON.stringify(updated));
    setAiDesigns(updated);
    setLoadingAi(false);
    alert('AI Design Generated Successfully!');
  };

  const handleAiStatus = async (id, status) => {
    const localAi = JSON.parse(localStorage.getItem('mockAiDesigns') || '[]');
    const updated = localAi.map(d => d._id === id ? { ...d, status } : d);
    localStorage.setItem('mockAiDesigns', JSON.stringify(updated));
    setAiDesigns(updated);
    
    const updatedDesign = updated.find(d => d._id === id);

    if (status === 'regenerated') {
      const regenerateVariants = [
        {
          generatedImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
          aiSuggestion: {
            furniture: ['Sectional Velvet Sofa', 'Hexagonal Side Table', 'Arc Floor Lamp'],
            materials: ['Velvet Upholstery', 'Gold Metal', 'Glass'],
            colorPalette: ['Navy Blue', 'Gold', 'Cream White'],
            budgetEstimate: 5800
          }
        },
        {
          generatedImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
          aiSuggestion: {
            furniture: ['Platform Bed', 'Floating Nightstands', 'Minimalist Wardrobe'],
            materials: ['Walnut Wood', 'Matte Black Metal', 'Linen'],
            colorPalette: ['Walnut Brown', 'Charcoal', 'Ivory'],
            budgetEstimate: 6200
          }
        },
        {
          generatedImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          aiSuggestion: {
            furniture: ['Open Shelving Unit', 'Farmhouse Table', 'Pendant Lights'],
            materials: ['Reclaimed Wood', 'Wrought Iron', 'Ceramic'],
            colorPalette: ['Rustic Brown', 'Slate Gray', 'Sage Green'],
            budgetEstimate: 4900
          }
        }
      ];
      const variantIndex = localAi.filter(d => d._id.startsWith('ai_reg_')).length % regenerateVariants.length;
      const variant = regenerateVariants[variantIndex];
      const regeneratedDesign = {
        _id: 'ai_reg_' + Date.now(),
        userId: user?._id || 'u_local',
        roomType: updatedDesign?.roomType || 'Living Room',
        originalImage: updatedDesign?.originalImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
        generatedImage: variant.generatedImage,
        aiSuggestion: variant.aiSuggestion,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const withRegen = [regeneratedDesign, ...localAi];
      localStorage.setItem('mockAiDesigns', JSON.stringify(withRegen));
      setAiDesigns(withRegen);
      alert('✨ AI Design regenerated with new style! Check the new design above.');
    }

    if (status === 'accepted') {
      try {
        const localRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
        const aiCustomRequest = {
          _id: 'man_from_ai_' + updatedDesign._id,
          requestType: 'AI Generated',
          userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
          roomType: updatedDesign.roomType || 'Living Room',
          style: 'AI Generated (' + (updatedDesign.aiSuggestion?.colorPalette?.[0] || 'Modern') + ')',
          budget: '$' + (updatedDesign.aiSuggestion?.budgetEstimate || 3000),
          size: 'Standard',
          timeline: 'Flexible',
          ownMaterialsAvailable: 'No',
          materialDetails: '',
          materialQuantity: '',
          materialPickupNeeded: 'No',
          pickupAddress: '',
          materialImages: [],
          requirements: 'AI Suggestions: Furniture (' + (updatedDesign.aiSuggestion?.furniture?.join(', ') || 'Standard') + '). Materials (' + (updatedDesign.aiSuggestion?.materials?.join(', ') || 'Standard') + ').',
          referenceImages: [updatedDesign.generatedImage],
          status: 'Submitted',
          assignedVendorId: { _id: 'mock_vendor_id_123', name: 'Artisan Workshop' },
          createdAt: new Date().toISOString()
        };
        if (!localRequests.find(r => r._id === aiCustomRequest._id)) {
          const updatedManuals = [aiCustomRequest, ...localRequests];
          localStorage.setItem('mockManualRequests', JSON.stringify(updatedManuals));
          setManualDesigns(updatedManuals);
        }
        
        const localAdminNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
        localStorage.setItem('mockAdminNotifications', JSON.stringify([{
          _id: `notif_admin_${Date.now()}`,
          message: `New AI Design Order Request requires vendor assignment.`,
          type: 'warning',
          createdAt: new Date().toISOString()
        }, ...localAdminNotifs]));
      } catch (err) {
        console.error('Failed to forward AI request to vendor', err);
      }
      alert('✅ AI Design accepted! Order request has been forwarded to vendors.');
    }
    
    if (status === 'rejected') {
      alert('AI Design rejected. You can now submit a manual design request.');
      if (setActiveTab) setActiveTab('manual');
    }
  };

  const handleDeleteDesign = (id) => {
    if (!confirm('Delete this AI design?')) return;
    const localAi = JSON.parse(localStorage.getItem('mockAiDesigns') || '[]');
    const filtered = localAi.filter(d => d._id !== id);
    localStorage.setItem('mockAiDesigns', JSON.stringify(filtered));
    setAiDesigns(filtered);
  };

  const handleToggleBookmark = (id) => {
    const localAi = JSON.parse(localStorage.getItem('mockAiDesigns') || '[]');
    const updated = localAi.map(d => d._id === id ? { ...d, isBookmarked: !d.isBookmarked } : d);
    localStorage.setItem('mockAiDesigns', JSON.stringify(updated));
    setAiDesigns(updated);
  };

  const handleProceedToExecution = (design) => {
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const newOrder = {
      _id: 'ord_ai_' + Date.now(),
      orderType: 'AI Design',
      orderStatus: 'quotation_pending',
      userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
      vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
      totalAmount: design.aiSuggestion?.budgetEstimate || 0,
      paymentStatus: 'pending',
      aiDesignData: {
        roomType: design.roomType,
        originalImage: design.originalImage,
        generatedImage: design.generatedImage,
        style: 'AI Generated (' + (design.aiSuggestion?.colorPalette?.[0] || 'Modern') + ')',
        furniture: design.aiSuggestion?.furniture || [],
        materials: design.aiSuggestion?.materials || [],
        colorPalette: design.aiSuggestion?.colorPalette || [],
        budgetEstimate: design.aiSuggestion?.budgetEstimate || 0,
        requirements: 'AI Suggestions: Furniture (' + (design.aiSuggestion?.furniture?.join(', ') || 'Standard') + '). Materials (' + (design.aiSuggestion?.materials?.join(', ') || 'Standard') + ').'
      },
      createdAt: new Date().toISOString()
    };
    const updatedOrders = [newOrder, ...localOrders];
    localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    const localAi = JSON.parse(localStorage.getItem('mockAiDesigns') || '[]');
    const updatedAi = localAi.map(d => d._id === design._id ? { ...d, status: 'execution' } : d);
    localStorage.setItem('mockAiDesigns', JSON.stringify(updatedAi));
    setAiDesigns(updatedAi);
    const localVendorNotifs = JSON.parse(localStorage.getItem('mockVendorNotifications') || '[]');
    localStorage.setItem('mockVendorNotifications', JSON.stringify([{
      _id: 'notif_v_' + Date.now(),
      message: 'New AI Design order requires your quotation.',
      type: 'info',
      createdAt: new Date().toISOString()
    }, ...localVendorNotifs]));
    alert('AI Design sent to execution! Vendor will review and provide a quotation shortly.');
  };

  // Manual Design Actions
  const handleRefImgUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const fallbackRequest = {
      _id: 'man_local_' + Date.now(),
      requestType: 'Manual Design',
      userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
      roomType, style: manualStyle, budget: manualBudget, size: manualSize,
      materials: manualMaterials, requirements: manualRequirements,
      referenceImages,
      ownMaterialsAvailable: ownMaterials,
      materialDetails: ownMaterials === 'Yes' ? materialDetails : '',
      materialQuantity: ownMaterials === 'Yes' ? materialQuantity : '',
      materialImages: ownMaterials === 'Yes' ? materialImages : [],
      pickupAddress: ownMaterials === 'Yes' ? pickupAddress : '',
      materialPickupNeeded: ownMaterials === 'Yes' ? pickupNeeded : 'No',
      timeline, needDesignerHelp: needDesigner,
      serviceAddress, vendorPreference: vendorPref, quotationType,
      status: 'Submitted',
      assignedVendorId: { _id: 'mock_vendor_id_123', name: 'Artisan Workshop' },
      createdAt: new Date().toISOString()
    };

    const localRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
    const updated = [fallbackRequest, ...localRequests];
    localStorage.setItem('mockManualRequests', JSON.stringify(updated));
    setManualDesigns(updated);

    if (needDesigner === 'Yes') {
      const localDesReqs = JSON.parse(localStorage.getItem('mockDesignerRequests') || '[]');
      const desEntry = {
        _id: 'des_from_manual_' + Date.now(),
        userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
        details: manualRequirements || '',
        budget: Number(String(manualBudget).replace(/[^0-9]/g, '')) || 0,
        status: 'pending',
        assignedDesignerId: null,
        roomType, style: manualStyle,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('mockDesignerRequests', JSON.stringify([desEntry, ...localDesReqs]));
    }

    const localVendorNotifs = JSON.parse(localStorage.getItem('mockVendorNotifications') || '[]');
    localStorage.setItem('mockVendorNotifications', JSON.stringify([{
      _id: `notif_${Date.now()}`,
      message: `New custom design request from ${fallbackRequest.userId?.name || 'Customer'}.`,
      type: 'info',
      createdAt: new Date().toISOString()
    }, ...localVendorNotifs]));

    const localAdminNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
    localStorage.setItem('mockAdminNotifications', JSON.stringify([{
      _id: `notif_admin_${Date.now()}`,
      message: `New Manual Design Request ID: ${fallbackRequest._id} requires review.`,
      type: 'warning',
      createdAt: new Date().toISOString()
    }, ...localAdminNotifs]));

    alert('✅ Manual Design Request Submitted Successfully! Vendors have been notified.');
    setManualMaterials(''); setManualRequirements(''); setReferenceImages([]);
    setOwnMaterials('No'); setMaterialDetails(''); setMaterialQuantity(''); setMaterialImages([]); setPickupAddress('');
    setPickupNeeded('No'); setTimeline('Flexible'); setNeedDesigner('No');
    setServiceAddress(''); setVendorPref('Any Vendor'); setQuotationType('Fixed Budget');
    setManualSubmitting(false);
  };

  // Designer Request Actions
  const handleDesignerSubmit = async (e) => {
    e.preventDefault();
    const budgetNum = Number(designerBudget);
    const fallbackRequest = {
      _id: 'des_req_local_' + Date.now(),
      userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
      details: designerDetails,
      budget: budgetNum,
      status: 'pending',
      assignedDesignerId: null,
      createdAt: new Date().toISOString()
    };

    const localRequests = JSON.parse(localStorage.getItem('mockDesignerRequests') || '[]');
    const updatedDesigner = [fallbackRequest, ...localRequests];
    localStorage.setItem('mockDesignerRequests', JSON.stringify(updatedDesigner));

    const localManualRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
    const manualRequestFromDesigner = {
      _id: 'man_from_des_' + fallbackRequest._id,
      requestType: 'Interior Designer Help',
      userId: fallbackRequest.userId,
      roomType: 'Interior Design',
      style: 'Consultation',
      budget: fallbackRequest.budget ? `₹${fallbackRequest.budget}` : '500',
      size: 'Full Space',
      timeline: 'Flexible',
      ownMaterialsAvailable: 'No',
      materialDetails: '',
      materialQuantity: '',
      materialPickupNeeded: 'No',
      pickupAddress: '',
      materialImages: [],
      requirements: fallbackRequest.details || '',
      referenceImages: [],
      status: 'Pending',
      assignedVendorId: { _id: 'mock_vendor_id_123', name: 'Artisan Workshop' },
      createdAt: fallbackRequest.createdAt
    };
    localStorage.setItem('mockManualRequests', JSON.stringify([manualRequestFromDesigner, ...localManualRequests]));
    setManualDesigns([manualRequestFromDesigner, ...manualDesigns]);

    const localAdminNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
    localStorage.setItem('mockAdminNotifications', JSON.stringify([{
      _id: `notif_admin_${Date.now()}`,
      message: `New Interior Designer Request ID: ${fallbackRequest._id} requires review.`,
      type: 'warning',
      createdAt: new Date().toISOString()
    }, ...localAdminNotifs]));

    alert('✅ Interior Designer Request Submitted Successfully! Admin has been notified.');
    setDesignerDetails(''); setDesignerBudget('');
  };

  // Marketplace Order Action
  const handleProductOrder = async (product) => {
    const newOrder = {
      _id: 'ord_p_' + Date.now(),
      orderType: 'Marketplace Product',
      userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
      vendorId: product.vendorId || { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
      manufacturerId: null,
      deliveryPartnerId: null,
      installationPartnerId: null,
      totalAmount: product.price,
      paymentStatus: 'paid',
      orderStatus: 'Pending Confirmation',
      expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
      createdAt: new Date().toISOString(),
      shippingAddress: user?.address || '123 Default User St',
      productDetails: {
        _id: product._id,
        title: product.title,
        price: product.price,
        images: product.images
      }
    };
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const updated = [newOrder, ...localOrders];
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setOrders(updated);

    // Trigger Notifications
    const triggerNotif = (recipient, message) => {
      const notifObj = {
        _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        message,
        type: 'success',
        createdAt: new Date().toISOString(),
        read: false
      };
      const key = recipient === 'vendor' ? 'mockVendorNotifications' : 'mockAdminNotifications';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([notifObj, ...existing]));
    };
    triggerNotif('vendor', `New marketplace order received for $${product.price}`);
    triggerNotif('admin', `New marketplace purchase placed: Order #${newOrder._id.slice(-6)}`);

    alert('✅ Order placed successfully! (Mock Order Placed)');
    if (setActiveTab) setActiveTab('orders');
  };

  // Open Quotation Payment Modal
  const handleBudgetApproval = (quotationId) => {
    const localRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
    const req = localRequests.find(r => r._id === quotationId);
    if (req) setQuotationPayment(req);
  };

  // Process Quotation Payment
  const handleQuotationPayment = async () => {
    if (!quotationPayment) return;
    setQuotationProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const quotationId = quotationPayment._id;
    const localRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
    const reqIndex = localRequests.findIndex(r => r._id === quotationId);
    let requestObj = null;
    if (reqIndex !== -1) {
      localRequests[reqIndex].status = 'Approved';
      localStorage.setItem('mockManualRequests', JSON.stringify(localRequests));
      requestObj = localRequests[reqIndex];
    }

    const orderAmount = requestObj ? Number(requestObj.quotationAmount || 3500) : 4500;

    const newOrder = {
      _id: 'ord_q_' + Date.now(),
      orderType: requestObj?.requestType || 'Manual Design',
      userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
      vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
      manufacturerId: null,
      deliveryPartnerId: null,
      installationPartnerId: null,
      totalAmount: orderAmount,
      paymentStatus: 'paid',
      orderStatus: 'Paid - Awaiting Verification',
      expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 15).toISOString(),
      createdAt: new Date().toISOString(),
      shippingAddress: user?.address || '789 Designer Lane, New York, NY, USA',
      designRequestId: quotationId,
      quotationAmount: requestObj?.quotationAmount || orderAmount,
      quotationMaterials: requestObj?.quotationMaterials || '',
      quotationTime: requestObj?.quotationTime || ''
    };

    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const updated = [newOrder, ...localOrders];
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setOrders(updated);

    if (requestObj) {
      setManualDesigns(manualDesigns.map(r => r._id === quotationId ? { ...r, status: 'Approved' } : r));
    }

    // Create transaction record for admin
    const newTransaction = {
      _id: 'txn_q_' + Date.now(),
      orderId: newOrder._id,
      userId: { name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com' },
      vendorId: { companyName: 'Artisan Workshop' },
      amount: orderAmount,
      commissionAmount: Math.round(orderAmount * 0.15 * 100) / 100,
      netPayout: Math.round(orderAmount * 0.85 * 100) / 100,
      paymentMethod: quotationPaymentMethod,
      status: 'Paid',
      type: 'Customer Payment',
      createdAt: new Date().toISOString()
    };
    const localTxns = JSON.parse(localStorage.getItem('mockAdminTransactions') || '[]');
    localStorage.setItem('mockAdminTransactions', JSON.stringify([newTransaction, ...localTxns]));

    // Notifications
    const triggerNotif = (recipient, message, type = 'success') => {
      const notifObj = {
        _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        message,
        type,
        createdAt: new Date().toISOString(),
        read: false
      };
      const key = recipient === 'vendor' ? 'mockVendorNotifications' : recipient === 'admin' ? 'mockAdminNotifications' : 'mockUserNotifications';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([notifObj, ...existing]));
    };

    const shortOrderId = newOrder._id.slice(-6);
    const payMethod = (quotationPaymentMethod || 'Paytm UPI').toUpperCase().includes('UPI') ? 'Paytm UPI' : (quotationPaymentMethod || 'Paytm UPI');
    const txnId = 'PTM' + Math.floor(10000000 + Math.random() * 90000000);
    const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedDate = new Date().toLocaleDateString('en-GB', optionsDate);
    const formattedTime = new Date().toLocaleTimeString('en-US', optionsTime);
    const paidOnStr = `${formattedDate} | ${formattedTime}`;

    const vendorMsg = `Payment received successfully\n\nOrder ID: #${shortOrderId}\nCustomer: ${user?.name || 'Customer'}\nAmount Paid: ₹${orderAmount.toLocaleString('en-IN')}\nPayment Method: ${payMethod}\nTransaction ID: ${txnId}\nPaid On: ${paidOnStr}\n\nPlease verify the payment and start production.`;

    triggerNotif('user', 'Payment success! Awaiting vendor verification. Your order will enter production once confirmed.', 'success');
    triggerNotif('vendor', vendorMsg, 'info');
    triggerNotif('admin', `Payment success for order: #${shortOrderId}.`, 'success');

    setQuotationProcessing(false);
    setQuotationPayment(null);
    showToast('Payment successful! Order has been created.');
    if (setActiveTab) setActiveTab('orders');
  };

  const handleBudgetRejection = async (quotationId) => {
    const localRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
    const reqIndex = localRequests.findIndex(r => r._id === quotationId);
    let requestObj = null;
    if (reqIndex !== -1) {
      localRequests[reqIndex].status = 'Quotation Rejected';
      localStorage.setItem('mockManualRequests', JSON.stringify(localRequests));
      requestObj = localRequests[reqIndex];
    }
    
    if (requestObj) {
      setManualDesigns(manualDesigns.map(r => r._id === quotationId ? { ...r, status: 'Quotation Rejected' } : r));
    }

    const triggerNotif = (recipient, message, type = 'warning') => {
      const notifObj = {
        _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        message,
        type,
        createdAt: new Date().toISOString(),
        read: false
      };
      const key = recipient === 'vendor' ? 'mockVendorNotifications' : recipient === 'admin' ? 'mockAdminNotifications' : 'mockUserNotifications';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([notifObj, ...existing]));
    };

    triggerNotif('vendor', `Quotation rejected by customer for room design request: ${requestObj?.roomType || 'Custom Room'}.`, 'warning');
    
    alert('Quotation rejected successfully.');
  };

  // ── AI Design Quotation Actions ──

  const handleAcceptAiQuotation = (orderId) => {
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const order = localOrders.find(o => o._id === orderId);
    if (order) {
      setAiQuotationPayment(order);
      const pm = order.quotationPaymentMethod || 'upi';
      const methodLabel = pm === 'upi' ? 'UPI' : pm === 'bank' ? 'NetBanking' : pm === 'card' ? 'Card' : 'UPI';
      setQuotationPaymentMethod(methodLabel);
    }
  };

  const handleConfirmAiQuotationPayment = async () => {
    if (!aiQuotationPayment) return;
    setAiQuotationProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const orderId = aiQuotationPayment._id;
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const updated = localOrders.map(o =>
      o._id === orderId
        ? { ...o, orderStatus: 'Paid - Awaiting Verification', paymentStatus: 'paid' }
        : o
    );
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setOrders(updated);

    const updatedAiQuote = updated.filter(o => o.orderType === 'AI Design' && o.orderStatus === 'quotation_sent');
    setAiQuotationOrders(updatedAiQuote);

    const orderAmount = aiQuotationPayment.quotationAmount || aiQuotationPayment.totalAmount || 0;

    const newTransaction = {
      _id: 'txn_ai_' + Date.now(),
      orderId: orderId,
      userId: { name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com' },
      vendorId: { companyName: aiQuotationPayment.vendorId?.companyName || 'Artisan Workshop' },
      amount: orderAmount,
      commissionAmount: Math.round(orderAmount * 0.15 * 100) / 100,
      netPayout: Math.round(orderAmount * 0.85 * 100) / 100,
      paymentMethod: quotationPaymentMethod,
      status: 'Paid',
      type: 'Customer Payment',
      createdAt: new Date().toISOString()
    };
    const localTxns = JSON.parse(localStorage.getItem('mockAdminTransactions') || '[]');
    localStorage.setItem('mockAdminTransactions', JSON.stringify([newTransaction, ...localTxns]));

    const triggerNotif = (recipient, message, type = 'success') => {
      const notifObj = {
        _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        message,
        type,
        createdAt: new Date().toISOString(),
        read: false
      };
      const key = recipient === 'vendor' ? 'mockVendorNotifications' : recipient === 'admin' ? 'mockAdminNotifications' : 'mockUserNotifications';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([notifObj, ...existing]));
    };

    const shortOrderId = orderId.slice(-6);
    const payMethod = (quotationPaymentMethod || 'Paytm UPI').toUpperCase().includes('UPI') ? 'Paytm UPI' : (quotationPaymentMethod || 'Paytm UPI');
    const txnId = 'PTM' + Math.floor(10000000 + Math.random() * 90000000);
    const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedDate = new Date().toLocaleDateString('en-GB', optionsDate);
    const formattedTime = new Date().toLocaleTimeString('en-US', optionsTime);
    const paidOnStr = `${formattedDate} | ${formattedTime}`;

    const vendorMsg = `Payment received successfully\n\nOrder ID: #${shortOrderId}\nCustomer: ${user?.name || 'Customer'}\nAmount Paid: ₹${orderAmount.toLocaleString('en-IN')}\nPayment Method: ${payMethod}\nTransaction ID: ${txnId}\nPaid On: ${paidOnStr}\n\nPlease verify the payment and start production.`;

    triggerNotif('vendor', vendorMsg, 'info');
    triggerNotif('admin', `Payment success for AI Design order: #${shortOrderId}.`, 'success');
    triggerNotif('user', 'Payment success! Awaiting vendor verification. Your order will enter production once confirmed.', 'success');

    setAiQuotationProcessing(false);
    setAiQuotationPayment(null);
    showToast('Payment successful! AI Design order confirmed.');
    if (setActiveTab) setActiveTab('orders');
  };

  const handleRejectAiQuotation = async (orderId) => {
    if (!confirm('Are you sure you want to reject this AI Design quotation?')) return;
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const updated = localOrders.map(o =>
      o._id === orderId ? { ...o, orderStatus: 'Quotation Rejected' } : o
    );
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setOrders(updated);

    const updatedAiQuote = updated.filter(o => o.orderType === 'AI Design' && o.orderStatus === 'quotation_sent');
    setAiQuotationOrders(updatedAiQuote);

    const triggerNotif = (recipient, message, type = 'warning') => {
      const notifObj = {
        _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        message,
        type,
        createdAt: new Date().toISOString(),
        read: false
      };
      const key = recipient === 'vendor' ? 'mockVendorNotifications' : recipient === 'admin' ? 'mockAdminNotifications' : 'mockUserNotifications';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([notifObj, ...existing]));
    };

    triggerNotif('vendor', 'Your quotation has been rejected by the customer.', 'warning');

    alert('AI Design quotation rejected.');
  };

  // Support Ticket Action
  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    const newTicket = {
      _id: 'ticket_' + Date.now(),
      subject: ticketSubject,
      message: ticketMessage,
      status: 'open',
      userId: { name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com' },
      createdAt: new Date().toISOString()
    };
    const localTickets = JSON.parse(localStorage.getItem('mockTickets') || '[]');
    localStorage.setItem('mockTickets', JSON.stringify([newTicket, ...localTickets]));
    alert('Ticket Submitted Successfully!');
    setTicketSubject('');
    setTicketMessage('');
  };

  // Review Action
  const handlePublishReview = async (e) => {
    e.preventDefault();
    const newReview = {
      _id: 'review_' + Date.now(),
      vendorId: 'mock_vendor_id_123',
      productId: 'prod_1',
      rating: reviewRating,
      comment: reviewComment,
      userId: { name: user?.name || 'Customer Demo' },
      createdAt: new Date().toISOString()
    };
    const localReviews = JSON.parse(localStorage.getItem('mockReviews') || '[]');
    localStorage.setItem('mockReviews', JSON.stringify([newReview, ...localReviews]));
    alert('Review published successfully!');
    setReviewComment('');
  };


  return (
    <div className="space-y-10">
      
      {/* Dynamic Content Based on Active Tab */}
      
      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (() => {
        const kpiCards = [
          { label: 'AI Designs', value: aiDesigns?.length || 5, trend: '2 new', trendUp: true, icon: <Wand2 className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600', tab: 'ai_studio' },
          { label: 'Active Orders', value: orders?.length || 2, trend: 'On track', trendUp: true, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600', tab: 'orders' },
          { label: 'Saved Items', value: 12, trend: 'From marketplace', trendUp: true, icon: <Bookmark className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600', tab: 'saved' },
          { label: 'In Transit', value: 1, trend: 'Arriving soon', trendUp: true, icon: <Truck className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600', tab: 'tracking' },
        ];

        const activityFeed = [
          { icon: '🎨', label: 'Design Ready', name: 'AI generated 3 concepts for Living Room', time: '2 hours ago', color: 'bg-purple-50 text-purple-600' },
          { icon: '📦', label: 'Order Dispatched', name: 'Velvet Lounge Chair is on the way', time: 'Yesterday', color: 'bg-emerald-50 text-emerald-600' },
          { icon: '💬', label: 'Vendor Message', name: 'Artisan Partner replied to your quote', time: '2 days ago', color: 'bg-blue-50 text-blue-600' },
        ];

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Premium Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#8B5E3C] via-[#7a5133] to-[#5c3d26] rounded-3xl p-8 text-white shadow-xl">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Customer Studio</p>
                  <h1 className="font-['Playfair_Display'] font-extrabold text-3xl md:text-4xl">Welcome back, {user?.name || 'Designer'}! ✨</h1>
                  <p className="text-white/80 text-sm mt-2 max-w-xl">Ready to transform your space? Your recent AI designs are ready to view, and your custom sofa order is currently in production.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab && setActiveTab('ai_studio')} className="px-5 py-3 bg-white text-[#8B5E3C] rounded-xl font-bold shadow-md hover:bg-gray-50 transition-all flex items-center gap-2 text-sm">
                    <Wand2 size={16}/> Start AI Design
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((card) => (
                <div
                  key={card.label}
                  onClick={() => setActiveTab && setActiveTab(card.tab)}
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {card.icon}
                    </div>
                    <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${card.color.replace('text-', 'bg-').replace('50', '100')} bg-opacity-50`}>
                      {card.trend}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] font-extrabold text-3xl text-[#1F2937]">{card.value}</h3>
                    <p className="text-sm font-bold text-gray-500 mt-1">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Project Tracker */}
              <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Active Custom Project</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Living Room Sectional Sofa</p>
                  </div>
                  <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full text-xs font-bold uppercase">In Production</span>
                </div>
                
                <div className="relative pt-4 pb-2">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-[#2A9D8F] -translate-y-1/2 rounded-full"></div>
                  
                  <div className="relative flex justify-between">
                    {[
                      { step: 'Requested', done: true },
                      { step: 'Quoted', done: true },
                      { step: 'Manufacturing', done: true, current: true },
                      { step: 'Quality Check', done: false },
                      { step: 'Delivery', done: false }
                    ].map((s, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 border-4 border-white shadow-sm ${s.done ? 'bg-[#2A9D8F] text-white' : 'bg-gray-100 text-gray-400'} ${s.current ? 'ring-4 ring-[#2A9D8F]/20' : ''}`}>
                          {s.done ? '✓' : i + 1}
                        </div>
                        <span className={`text-[10px] font-bold ${s.current ? 'text-[#2A9D8F]' : 'text-gray-500'}`}>{s.step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 bg-[#F8F5F0] p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4A373]/20 flex items-center justify-center"><Hammer className="w-5 h-5 text-[#8B5E3C]"/></div>
                    <div>
                      <p className="text-xs font-bold text-[#1F2937]">Currently crafting the wooden frame</p>
                      <p className="text-[10px] text-gray-500">Expected completion: Next Week</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab && setActiveTab('tracking')} className="text-xs font-bold text-[#2A9D8F] hover:underline">Track Order →</button>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-blue-50 rounded-xl"><Activity className="w-5 h-5 text-blue-500" /></div>
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Recent Updates</h3>
                    <p className="text-[11px] text-gray-400">Activity on your account</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {activityFeed.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all">
                      <div className={`w-10 h-10 rounded-xl ${event.color} flex items-center justify-center text-lg shrink-0 shadow-sm`}>{event.icon}</div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{event.label}</p>
                        <p className="text-sm font-bold text-[#1F2937] truncate mt-0.5">{event.name}</p>
                        <span className="text-[10px] font-medium text-gray-400 mt-1 block">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab && setActiveTab('notifications')} className="w-full mt-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
                  View All Notifications
                </button>
              </div>
            </div>

            {/* Quick Actions Grid (Premium Redesign) */}
            <div className="space-y-4">
              <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Upload Room Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('ai_studio')}
                >
                  <div className="w-12 h-12 bg-[#8B5E3C]/10 rounded-2xl flex items-center justify-center text-[#8B5E3C] group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-[#8B5E3C] transition-colors">Upload Room</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Upload a snapshot of your room and get it analyzed instantly.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Launch Studio</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Generate AI Design Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('ai_studio')}
                >
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Wand2 size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-purple-600 transition-colors">Generate AI Design</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Let our AI render beautiful, personalized styles automatically.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Transform Space</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Browse Marketplace Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('marketplace')}
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#2A9D8F] group-hover:scale-110 transition-transform">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-[#2A9D8F] transition-colors">Browse Marketplace</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Shop high-end custom furniture crafted by top-tier artisans.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Explore Catalog</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Track Orders Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('tracking')}
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Truck size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-blue-600 transition-colors">Track Orders</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Get real-time tracking from workshop production to your door.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Check Status</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        );
      })()}

      {/* TAB 2: AI STUDIO */}
      {activeTab === 'ai_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Box */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Wand2 className="w-6 h-6 text-[#8B5E3C]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">New AI Design</h2>
            </div>
            <form onSubmit={handleAiSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Select Room Type</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Office Room">Office Room</option>
                  <option value="Kids Room">Kids Room</option>
                  <option value="Balcony">Balcony</option>
                  <option value="Pooja Room">Pooja Room</option>
                  <option value="Commercial Space">Commercial Space</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Upload Room Photo</label>
                <label className="border-2 border-dashed border-[#D4A373]/50 rounded-2xl p-6 text-center hover:border-[#8B5E3C] transition-all bg-[#F8F5F0]/50 block group cursor-pointer relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                  />
                  {originalImage && originalImage.startsWith('data:image') ? (
                    <div className="space-y-2 pointer-events-none">
                      <img src={originalImage} alt="Room Preview" className="w-full h-32 object-cover rounded-xl shadow-inner" />
                      <p className="text-xs text-[#8B5E3C] font-bold">Click or drag to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4 pointer-events-none">
                      <UploadCloud className="w-10 h-10 text-[#8B5E3C] mx-auto group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-[#1F2937]">Click to upload or drag & drop</p>
                      <p className="text-xs text-[#6B7280]">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                </label>
                <p className="text-xs text-[#6B7280] mt-2">Leave empty to use demo living room photo</p>
              </div>
              <button type="submit" disabled={loadingAi} className="w-full flex items-center justify-center gap-2 py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                <Wand2 className="w-5 h-5" />
                <span>{loadingAi ? 'Analyzing & Styling...' : 'Generate AI Interior'}</span>
              </button>
            </form>
          </div>

          {/* Generated Designs List */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Your AI Design History</h2>
            {aiDesigns.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-[#D4A373]/30 space-y-4 shadow-sm">
                <UploadCloud className="w-12 h-12 text-[#D4A373] mx-auto" />
                <p className="text-[#6B7280] font-medium">No AI designs generated yet. Use the studio panel to start styling!</p>
              </div>
            ) : (
              filteredAiDesigns.map((design) => (
                <div key={design._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img src={design.generatedImage} alt="AI Design" className="w-full sm:w-64 h-48 object-cover rounded-2xl shadow-inner" />
                    <div className="space-y-4 flex-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{design.roomType}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${design.status === 'accepted' || design.status === 'execution' ? 'bg-[#2A9D8F] text-white' : design.status === 'rejected' ? 'bg-[#E76F51] text-white' : 'bg-[#E9C46A] text-[#1F2937]'}`}>
                          {design.status === 'execution' ? 'SENT TO EXECUTION' : design.status.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1F2937] text-lg mb-2">AI Suggestions</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
                          <div><strong className="text-[#1F2937]">Furniture:</strong> {design.aiSuggestion?.furniture?.join(', ') || 'Modern Sofa, Coffee Table'}</div>
                          <div><strong className="text-[#1F2937]">Materials:</strong> {design.aiSuggestion?.materials?.join(', ') || 'Leather, Oak Wood'}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="font-['Playfair_Display'] font-extrabold text-xl text-[#8B5E3C]">Est. Budget: ${design.aiSuggestion?.budgetEstimate || '4,500'}</span>
                        <div className="flex items-center gap-2">
                          {design.status !== 'accepted' && design.status !== 'execution' && (
                            <>
                              <button onClick={() => handleAiStatus(design._id, 'accepted')} className="p-2 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl shadow-sm" title="Accept & Order"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleProceedToExecution(design)} className="p-2 bg-[#1F2937] hover:bg-black text-white rounded-xl shadow-sm" title="Proceed to Execution"><PlayCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleAiStatus(design._id, 'regenerated')} className="p-2 bg-[#E9C46A] hover:bg-[#E9C46A]/90 text-[#1F2937] rounded-xl shadow-sm" title="Regenerate"><RefreshCw className="w-4 h-4" /></button>
                              <button onClick={() => handleAiStatus(design._id, 'rejected')} className="p-2 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl shadow-sm" title="Reject & Manual Design"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
                          <button onClick={() => handleToggleBookmark(design._id)} className={`p-2 rounded-xl shadow-sm transition-all ${design.isBookmarked ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`} title={design.isBookmarked ? 'Unsave' : 'Save Design'}>
                            <Bookmark className={`w-4 h-4 ${design.isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                          <button onClick={() => handleDeleteDesign(design._id)} className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-all" title="Delete">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL DESIGN */}
      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Hammer className="w-6 h-6 text-[#8B5E3C]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Manual Design Request</h2>
            </div>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              {/* Row 1: Room Type + Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Room Type</label>
                  <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Office Room">Office Room</option>
                    <option value="Kids Room">Kids Room</option>
                    <option value="Balcony">Balcony</option>
                    <option value="Pooja Room">Pooja Room</option>
                    <option value="Commercial Space">Commercial Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Design Style</label>
                  <select value={manualStyle} onChange={(e) => setManualStyle(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                    <option value="Modern">Modern</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Scandinavian">Scandinavian</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Budget + Room Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Budget Range</label>
                  <select value={manualBudget} onChange={(e) => setManualBudget(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                    <option value="Below ₹50,000">Below ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                    <option value="Above ₹3,00,000">Above ₹3,00,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Room Size</label>
                  <select value={manualSize} onChange={(e) => setManualSize(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>

              {/* Reference Images */}
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Upload Reference Images (Optional)</label>
                <label className="border-2 border-dashed border-[#D4A373]/50 rounded-2xl p-5 text-center hover:border-[#8B5E3C] transition-all bg-[#F8F5F0]/50 block group cursor-pointer relative overflow-hidden">
                  <input type="file" accept="image/*" multiple onChange={handleRefImgUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" />
                  {referenceImages.length > 0 ? (
                    <div className="pointer-events-none">
                      <div className="flex gap-3 flex-wrap justify-center">
                        {referenceImages.map((img, i) => <img key={i} src={img} alt="ref" className="w-20 h-20 object-cover rounded-lg shadow" />)}
                      </div>
                      <p className="text-xs text-[#8B5E3C] font-bold mt-2">Click to add more images</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-3 pointer-events-none">
                      <UploadCloud className="w-8 h-8 text-[#8B5E3C] mx-auto group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-[#1F2937]">Click to upload inspiration images</p>
                      <p className="text-xs text-[#6B7280]">PNG, JPG, WEBP — Multiple files allowed</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Own Materials */}
              <div className="bg-[#F8F5F0] p-5 rounded-2xl border border-[#D4A373]/30 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Own Materials Available?</label>
                    <div className="flex gap-3">
                      {['Yes','No'].map(opt => (
                        <button key={opt} type="button" onClick={() => setOwnMaterials(opt)}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${ ownMaterials === opt ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#8B5E3C]'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  {ownMaterials === 'Yes' && (
                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Material Pickup Needed?</label>
                      <div className="flex gap-3">
                        {['Yes','No'].map(opt => (
                          <button key={opt} type="button" onClick={() => setPickupNeeded(opt)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${ pickupNeeded === opt ? 'bg-[#2A9D8F] border-[#2A9D8F] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#2A9D8F]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {ownMaterials === 'Yes' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Available Material Details</label>
                        <input type="text" value={materialDetails} onChange={(e) => setMaterialDetails(e.target.value)} placeholder="e.g. Italian Marble tiles, Teak wood planks" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Material Quantity</label>
                        <input type="text" value={materialQuantity} onChange={(e) => setMaterialQuantity(e.target.value)} placeholder="e.g. 30 boxes, 50 sq ft planks" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white" />
                      </div>
                    </div>
                    {/* Material Photos Upload */}
                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Upload Material Photos</label>
                      <label className="border-2 border-dashed border-[#D4A373]/50 rounded-2xl p-4 text-center hover:border-[#8B5E3C] transition-all bg-white/80 block group cursor-pointer relative overflow-hidden">
                        <input type="file" accept="image/*" multiple onChange={(e) => {
                          const files = Array.from(e.target.files);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = () => setMaterialImages(prev => [...prev, reader.result]);
                            reader.readAsDataURL(file);
                          });
                        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" />
                        {materialImages.length > 0 ? (
                          <div className="pointer-events-none">
                            <div className="flex gap-3 flex-wrap justify-center">
                              {materialImages.map((img, i) => <img key={i} src={img} alt="material" className="w-16 h-16 object-cover rounded-lg shadow" />)}
                            </div>
                            <p className="text-xs text-[#8B5E3C] font-bold mt-2">Click to add more photos</p>
                          </div>
                        ) : (
                          <div className="space-y-1 py-2 pointer-events-none">
                            <UploadCloud className="w-6 h-6 text-[#8B5E3C] mx-auto" />
                            <p className="text-sm font-bold text-[#1F2937]">Upload photos of your materials</p>
                            <p className="text-xs text-[#6B7280]">PNG, JPG — Multiple files allowed</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {pickupNeeded === 'Yes' && (
                      <div>
                        <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Pickup Address</label>
                        <input type="text" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Full pickup address with landmark" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Dynamic Material Requirements + Special Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">{ownMaterials === 'Yes' ? 'My Available Materials Details' : 'Preferred Material Requirements'}</label>
                  <textarea rows={3} value={manualMaterials} onChange={(e) => setManualMaterials(e.target.value)} placeholder={ownMaterials === 'Yes' ? 'Describe the materials you already have...' : 'e.g. teak wood, marble countertop, matte finish, premium handles'} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Special Requirements / Ideas</label>
                  <textarea rows={3} value={manualRequirements} onChange={(e) => setManualRequirements(e.target.value)} placeholder="e.g. Need L-shaped sofa, hidden storage under stairs..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
                </div>
              </div>

              {/* Timeline + Designer Help */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Preferred Completion Timeline</label>
                  <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                    <option value="Flexible">Flexible</option>
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="1–3 Months">1–3 Months</option>
                    <option value="3–6 Months">3–6 Months</option>
                    <option value="Above 6 Months">Above 6 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Need Interior Designer Help?</label>
                  <div className="flex gap-3 mt-1">
                    {['Yes','No'].map(opt => (
                      <button key={opt} type="button" onClick={() => setNeedDesigner(opt)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${ needDesigner === opt ? 'bg-[#1F2937] border-[#1F2937] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#1F2937]'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Address */}
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Location / Service Address <span className="text-red-500">*</span></label>
                <textarea required rows={2} value={serviceAddress} onChange={(e) => setServiceAddress(e.target.value)} placeholder="Full address where the interior work should be done..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>

              {/* Vendor Preference + Quotation Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Vendor Preference</label>
                  <select value={vendorPref} onChange={(e) => setVendorPref(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                    <option value="Any Vendor">Any Vendor</option>
                    <option value="Nearby Vendor">Nearby Vendor</option>
                    <option value="Top Rated Vendor">Top Rated Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Quotation Type</label>
                  <select value={quotationType} onChange={(e) => setQuotationType(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                    <option value="Fixed Budget">Fixed Budget</option>
                    <option value="Open Bidding">Open Bidding</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={manualSubmitting} className="w-full py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {manualSubmitting ? <><RefreshCw className="w-5 h-5 animate-spin" /> Submitting...</> : <><Hammer className="w-5 h-5" /> Submit Manual Request to Vendors</>}
              </button>
            </form>
          </div>
          <div className="lg:col-span-4 space-y-6">
            {/* How it Works */}
            <div className="bg-[#2A9D8F]/10 p-6 rounded-3xl border border-[#2A9D8F]/20 space-y-3">
              <h3 className="font-bold text-[#2A9D8F] text-sm uppercase tracking-wider">How Manual Requests Work</h3>
              <ul className="text-sm text-gray-700 space-y-3">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2A9D8F] mt-0.5 shrink-0" /> Submit your precise requirements.</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2A9D8F] mt-0.5 shrink-0" /> Verified vendors review your request within 24–48 hrs.</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2A9D8F] mt-0.5 shrink-0" /> Review vendor quotations and approve your preferred bid.</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#2A9D8F] mt-0.5 shrink-0" /> Manufacturing, Delivery & Installation tracked live.</li>
              </ul>
            </div>

            {/* Status Flow */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 space-y-3">
              <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider mb-4">Order Status Flow</h3>
              {[
                { label: 'Submitted', color: 'bg-[#6B7280]' },
                { label: 'Vendor Review', color: 'bg-[#E9C46A]' },
                { label: 'Quotation Sent', color: 'bg-[#E76F51]' },
                { label: 'User Approved', color: 'bg-[#2A9D8F]' },
                { label: 'Manufacturing', color: 'bg-[#8B5E3C]' },
                { label: 'Delivery', color: 'bg-[#264653]' },
                { label: 'Installation', color: 'bg-[#1F2937]' },
                { label: 'Completed', color: 'bg-[#00A86B]' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${step.color}`}></div>
                  <span className="text-xs font-semibold text-gray-600">{step.label}</span>
                  {i < 7 && <div className="ml-auto w-4 border-t-2 border-dashed border-gray-200"></div>}
                </div>
              ))}
            </div>

            {/* Submitted Requests */}
            {filteredManualDesigns.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 space-y-4">
                <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider">Your Submitted Requests</h3>
                {filteredManualDesigns.slice(0, 3).map((d, i) => (
                  <div key={d._id || i} className="flex items-start justify-between gap-3 p-4 bg-[#F8F5F0] rounded-xl">
                    <div>
                      <p className="font-bold text-[#1F2937] text-sm">{d.roomType} — {d.style}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{d.budget} • {d.size}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 rounded-lg text-xs font-bold ${ d.status === 'Completed' ? 'bg-[#00A86B]/15 text-[#00A86B]' : d.status === 'Submitted' ? 'bg-[#E9C46A]/20 text-[#8B5E3C]' : 'bg-[#2A9D8F]/10 text-[#2A9D8F]' }`}>{d.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: INTERIOR DESIGNER HELP */}
      {activeTab === 'designer' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <HelpCircle className="w-6 h-6 text-[#1F2937]" />
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Request Interior Designer</h2>
          </div>
          <p className="text-gray-500 text-sm">Not sure where to start? Hire a professional interior designer to conceptualize your space before passing it to our manufacturing vendors.</p>
          <form onSubmit={handleDesignerSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Project Details & Help Needed</label>
              <textarea rows={6} required value={designerDetails} onChange={(e) => setDesignerDetails(e.target.value)} placeholder="Need expert designer to consult on color schemes and custom layout for a 500 sq ft apartment..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1F2937] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Designer Consultation Budget ($)</label>
              <input type="number" required value={designerBudget} onChange={(e) => setDesignerBudget(e.target.value)} placeholder="500" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1F2937] text-sm" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#1F2937] hover:bg-[#1F2937]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Request Designer Assignment</button>
          </form>
        </div>
      )}

      {/* TAB 5: MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <Marketplace isEmbedded={true} onGoToCart={() => setActiveTab && setActiveTab('cart')} searchQuery={searchQuery} />
      )}

      {/* TAB 6: MY CART */}
      {activeTab === 'cart' && (() => {
        const resolvedItems = cartItems.map(item => {
          const prod = products.find(p => p._id === item.productId);
          return prod ? { ...prod, quantity: item.quantity } : null;
        }).filter(Boolean);

        const subtotal = resolvedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shipping = subtotal > 0 ? 50 : 0;
        const tax = Math.round(subtotal * 0.08);
        const total = subtotal + shipping + tax;

        const updateCartQuantity = (productId, delta) => {
          const updated = cartItems.map(item => {
            if (item.productId === productId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          }).filter(Boolean);
          setCartItems(updated);
          localStorage.setItem('mockCart', JSON.stringify(updated));
          window.dispatchEvent(new Event('cartUpdated'));
        };

        const removeFromCart = (productId) => {
          const updated = cartItems.filter(item => item.productId !== productId);
          setCartItems(updated);
          localStorage.setItem('mockCart', JSON.stringify(updated));
          window.dispatchEvent(new Event('cartUpdated'));
        };

        const handleCheckout = () => {
          if (resolvedItems.length === 0) {
            showToast('Your cart is empty!', 'warning');
            return;
          }
          setShowCheckoutSummary(true);
        };

        const handleConfirmPayment = () => {
          // Create mock orders for each vendor's products in the cart
          const newOrders = resolvedItems.map(item => ({
            _id: 'ord_p_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            orderType: 'Marketplace Product',
            userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
            vendorId: item.vendorId || { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: item.price * item.quantity,
            paymentStatus: 'paid',
            orderStatus: 'Pending Confirmation',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
            createdAt: new Date().toISOString(),
            shippingAddress: user?.address || '123 Default User St',
            productDetails: {
              _id: item._id,
              title: item.title,
              price: item.price,
              images: item.images,
              quantity: item.quantity
            }
          }));

          const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          const updatedOrders = [...newOrders, ...localOrders];
          localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
          setOrders(updatedOrders);

          // Trigger Notifications for Vendor & Admin
          const triggerNotif = (recipient, message) => {
            const notifObj = {
              _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              message,
              type: 'success',
              createdAt: new Date().toISOString(),
              read: false
            };
            const key = recipient === 'vendor' ? 'mockVendorNotifications' : 'mockAdminNotifications';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            localStorage.setItem(key, JSON.stringify([notifObj, ...existing]));
          };

          newOrders.forEach(order => {
            triggerNotif('vendor', `New marketplace order received for $${order.totalAmount}`);
            triggerNotif('admin', `New marketplace purchase placed: Order #${order._id.slice(-6)}`);
          });

          // Clear cart
          setCartItems([]);
          localStorage.setItem('mockCart', JSON.stringify([]));
          window.dispatchEvent(new Event('cartUpdated'));
          setShowCheckoutSummary(false);

          showToast('✅ Order placed successfully! Thank you for your purchase.');
          if (setActiveTab) setActiveTab('orders');
        };

        if (showCheckoutSummary) {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] border-b border-gray-100 pb-4">Order Summary</h2>
                <div className="space-y-4">
                  {resolvedItems.map(item => (
                    <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-[#F8F5F0]/50">
                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'} alt={item.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1F2937] truncate">{item.title}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price}</p>
                      </div>
                      <span className="font-bold text-[#8B5E3C]">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowCheckoutSummary(false)} className="text-[#8B5E3C] font-bold text-sm flex items-center gap-1.5 hover:underline transition-all">
                  Back to Cart
                </button>
              </div>
              <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start">
                <h3 className="font-bold text-lg text-[#1F2937]">Payment</h3>
                <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-[#1F2937]">${subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-[#1F2937]">${shipping}</span></div>
                  <div className="flex justify-between"><span>Tax (8%)</span><span className="font-bold text-[#1F2937]">${tax}</span></div>
                </div>
                {/* Payment Method Selector */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider">Select Payment Method</label>
                  <div className="relative">
                    <select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-[#F8F5F0] border border-gray-200 rounded-xl py-3 px-4 pr-10 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 appearance-none transition-all cursor-pointer"
                    >
                      <option value="Google Pay">Google Pay (GPay)</option>
                      <option value="PhonePe">PhonePe</option>
                      <option value="Paytm">Paytm</option>
                      <option value="UPI">UPI ID / QR Code</option>
                      <option value="Card">Credit / Debit Card</option>
                      <option value="NetBanking">Net Banking</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Conditional Payment Fields */}
                {['Google Pay', 'PhonePe', 'Paytm'].includes(paymentMethod) && (
                  <div className="space-y-2 animate-fadeIn bg-[#F8F5F0]/50 p-4 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider">UPI Mobile Number</label>
                    <input 
                      type="tel" 
                      placeholder="Enter 10-digit mobile number" 
                      maxLength="10"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#8B5E3C] transition-all"
                    />
                    <p className="text-[10px] text-gray-400">A payment request will be sent to this number.</p>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="space-y-2 animate-fadeIn bg-[#F8F5F0]/50 p-4 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider">UPI ID (VPA)</label>
                    <input 
                      type="text" 
                      placeholder="username@bank" 
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#8B5E3C] transition-all"
                    />
                    <p className="text-[10px] text-gray-400">Example: mobile@okaxis, name@okicici</p>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-3 animate-fadeIn bg-[#F8F5F0]/50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#8B5E3C] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="XXXX XXXX XXXX XXXX" 
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#8B5E3C] transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#8B5E3C] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">CVV</label>
                        <input 
                          type="password" 
                          placeholder="XXX" 
                          maxLength="3"
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#8B5E3C] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NetBanking' && (
                  <div className="space-y-2 animate-fadeIn bg-[#F8F5F0]/50 p-4 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider">Select Bank</label>
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#8B5E3C] transition-all cursor-pointer"
                    >
                      <option>HDFC Bank</option>
                      <option>SBI (State Bank of India)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-between text-lg font-extrabold text-[#8B5E3C] pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <button onClick={handleConfirmPayment} className="w-full py-4 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Pay Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] border-b border-gray-100 pb-4">Shopping Cart</h2>
              <div className="space-y-4">
                {resolvedItems.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <ShoppingCart className="w-12 h-12 text-[#D4A373] mx-auto" />
                    <p className="text-gray-500 font-bold">Your shopping cart is empty.</p>
                    <button onClick={() => setActiveTab && setActiveTab('marketplace')} className="px-5 py-2.5 bg-[#8B5E3C] text-white font-bold rounded-xl text-sm hover:bg-[#8B5E3C]/90 transition-all">Continue Shopping</button>
                  </div>
                ) : (
                  <>
                    {resolvedItems.map(item => (
                      <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 rounded-2xl">
                        <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'} alt={item.title} className="w-20 h-20 object-cover rounded-xl shrink-0 bg-gray-50" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1F2937] truncate">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Vendor: {item.vendorId?.companyName || 'Artisan Workshop'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="font-extrabold text-[#8B5E3C]">${item.price}</span>
                            <div className="flex items-center gap-2 text-sm font-bold border border-gray-200 rounded-lg px-2 py-1 bg-white">
                              <button onClick={() => updateCartQuantity(item._id, -1)} className="text-gray-400 hover:text-[#8B5E3C] px-1">-</button>
                              <span className="w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(item._id, 1)} className="text-gray-400 hover:text-[#8B5E3C] px-1">+</button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} className="self-end sm:self-center p-2 text-red-400 hover:text-red-600 transition-colors"><XCircle className="w-5 h-5" /></button>
                      </div>
                    ))}
                    <div className="pt-2">
                      <button onClick={() => setActiveTab && setActiveTab('marketplace')} className="text-[#8B5E3C] font-bold text-sm flex items-center gap-1.5 hover:underline transition-all">
                        Continue Shopping
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start">
              <h3 className="font-bold text-lg text-[#1F2937]">Order Summary</h3>
              <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-[#1F2937]">${subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-[#1F2937]">${shipping}</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span className="font-bold text-[#1F2937]">${tax}</span></div>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-[#8B5E3C]">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              {resolvedItems.length > 0 && (
                <button onClick={handleCheckout} className="w-full py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 7: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Your Orders</h2>

          {/* Marketplace Orders — with product thumbnail, name and status badge */}
          {filteredOrders.filter(o => o.orderType === 'Marketplace Product').length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8B5E3C]" /> Marketplace Product Orders
              </h3>
              {filteredOrders.filter(o => o.orderType === 'Marketplace Product').map((order) => {
                const statusColors = {
                  'Pending Confirmation': 'bg-amber-50 text-amber-700 border-amber-200',
                  'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
                  'Pending Dispatch': 'bg-purple-50 text-purple-700 border-purple-200',
                  'Dispatched': 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  'Out For Delivery': 'bg-orange-50 text-orange-700 border-orange-200',
                  'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'Completed': 'bg-teal-50 text-teal-700 border-teal-200',
                  'Cancelled': 'bg-red-50 text-red-700 border-red-200',
                };
                const statusBadge = statusColors[order.orderStatus] || 'bg-gray-50 text-gray-700 border-gray-200';
                const isPaid = order.paymentStatus === 'paid';
                return (
                  <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-all">
                    <div className="shrink-0">
                      <img
                        src={order.productDetails?.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=60'}
                        alt={order.productDetails?.title || 'Product'}
                        className="w-24 h-24 object-cover rounded-2xl shadow-sm bg-gray-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Marketplace Product</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge}`}>{order.orderStatus || 'Pending Confirmation'}</span>
                      </div>
                      <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] truncate">{order.productDetails?.title || `Order #${order._id?.slice(-6)}`}</h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">Vendor: {order.vendorId?.companyName || 'Artisan Partner'} • Qty: {order.productDetails?.quantity || 1}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-['Playfair_Display'] font-extrabold text-2xl text-[#8B5E3C]">${order.totalAmount || '0'}</span>
                        <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider mt-0.5">
                          Payment: <span className={isPaid ? 'text-[#2A9D8F]' : 'text-amber-600'}>{order.paymentStatus || 'pending'}</span>
                        </p>
                      </div>
                      {!isPaid ? (
                        <button onClick={() => { if(setActiveTab) setActiveTab('payments'); }} className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">Pay Now</button>
                      ) : (
                        <button
                          onClick={() => {
                            localStorage.setItem('activeTrackingOrderId', order._id);
                            if(setActiveTab) setActiveTab('tracking');
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-[#1F2937] px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                        >
                          <Truck className="w-4 h-4" /> Track Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Custom Design Orders */}
          {filteredOrders.filter(o => o.orderType !== 'Marketplace Product').length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                <Hammer className="w-4 h-4 text-[#2A9D8F]" /> Custom Design Orders
              </h3>
              {filteredOrders.filter(o => o.orderType !== 'Marketplace Product').map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-all">
                  <div>
                    <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{order.orderType?.replace('_', ' ') || 'CUSTOM'}</span>
                    <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-2">Order #{order._id?.slice(-6) || '10293'}</h3>
                    <p className="text-xs text-[#6B7280] mt-1">Vendor: {order.vendorId?.companyName || 'Artisan Partner'} • Status: <span className="font-bold text-[#2A9D8F]">{order.orderStatus || 'In Progress'}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-['Playfair_Display'] font-extrabold text-3xl text-[#8B5E3C]">${order.totalAmount || '0'}</span>
                      <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider mt-1">Payment: <span className="text-[#2A9D8F]">{order.paymentStatus || 'pending'}</span></p>
                    </div>
                    {(!order.paymentStatus || order.paymentStatus === 'pending') ? (
                      <button onClick={() => { if(setActiveTab) setActiveTab('payments'); }} className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Pay Now</button>
                    ) : (
                      <button onClick={() => { if(setActiveTab) setActiveTab('tracking'); }} className="bg-gray-100 hover:bg-gray-200 text-[#1F2937] px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Track Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {orders.length === 0 && (
            <div className="bg-white p-12 rounded-3xl text-center border border-[#D4A373]/30 space-y-4 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-[#D4A373] mx-auto" />
              <p className="text-[#6B7280] font-medium">No active orders found.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB: QUOTATIONS WORKFLOW */}
      {activeTab === 'quotations' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Vendor & Designer Quotations</h2>
              <p className="text-xs text-gray-500 mt-1 font-semibold">Review custom quotes, materials, and delivery timelines sent by our registered professionals.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {manualDesigns.filter(d => ['Quotation Sent', 'Approved', 'Quotation Accepted', 'Quotation Rejected'].includes(d.status)).length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-[#D4A373]/30 text-center space-y-4">
                <FileText className="w-16 h-16 text-[#D4A373]/40 mx-auto" />
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">No Quotations Yet</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">When vendors or designers submit quotations for your custom projects, they will show up here for your approval.</p>
                <button onClick={() => setActiveTab('manual')} className="px-6 py-3 bg-[#8B5E3C] text-white rounded-xl font-bold text-xs shadow-md">Create Custom Request</button>
              </div>
            ) : (
              filteredManualDesigns.filter(d => ['Quotation Sent', 'Approved', 'Quotation Accepted', 'Quotation Rejected'].includes(d.status)).map((req) => {
                const statusColors = {
                  'Quotation Sent': 'bg-amber-50 text-amber-700 border-amber-200',
                  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'Quotation Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'Quotation Rejected': 'bg-red-50 text-red-700 border-red-200'
                };
                const badgeClass = statusColors[req.status] || 'bg-gray-50 text-gray-700 border-gray-200';
                
                return (
                  <div key={req._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 hover:shadow-md transition-all space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{req.requestType || 'Manual Design'}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>{req.status}</span>
                        </div>
                        <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">{req.roomType} — {req.style}</h3>
                        <p className="text-xs text-gray-400">Request ID: #{req._id.slice(-6)} • Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-['Playfair_Display'] font-extrabold text-3xl text-[#8B5E3C] block">${req.quotationAmount || '0'}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Budget Proposal</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4A373]/20">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Proposed Materials</span>
                        <p className="font-bold text-gray-700">{req.quotationMaterials || req.materials || 'Standard Premium Wood & Fabric'}</p>
                      </div>
                      <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4A373]/20">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Time to Complete</span>
                        <p className="font-bold text-gray-700">{req.quotationTime || req.timeline || '14-21 Days'}</p>
                      </div>
                      <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4A373]/20">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Assigned Vendor / Partner</span>
                        <p className="font-bold text-gray-700">{req.assignedVendorId?.companyName || req.assignedDesignerId?.companyName || 'Artisan Workshop'}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
                      <button onClick={() => setViewingQuotation(req)} className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> View Full Specifications
                      </button>
                      
                      {req.status === 'Quotation Sent' && (
                        <div className="flex gap-3">
                          <button onClick={() => handleBudgetRejection(req._id)} className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs shadow-sm transition-all border border-red-200">
                            Reject Quote
                          </button>
                          <button onClick={() => handleBudgetApproval(req._id)} className="px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Accept & Pay
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* ── AI Design Quotations ── */}
          {aiQuotationOrders.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#2A9D8F]/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#2A9D8F]" />
                </div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">AI Design Quotations</h3>
              </div>
              {aiQuotationOrders.map((order) => (
                <div key={order._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 hover:shadow-md transition-all space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-4">
                      {order.aiDesignData?.generatedImage && (
                        <img src={order.aiDesignData.generatedImage} alt="AI Design" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">AI Generated</span>
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">QUOTATION SENT</span>
                        </div>
                        <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">{order.aiDesignData?.roomType || 'AI Design'} — {order.aiDesignData?.style || 'Modern'}</h3>
                        <p className="text-xs text-gray-400">Order ID: #{order._id?.slice(-6)} • Vendor: {order.vendorId?.companyName || 'Artisan Workshop'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-['Playfair_Display'] font-extrabold text-3xl text-[#8B5E3C] block">${order.quotationAmount || '0'}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quoted Amount</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4A373]/20">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Proposed Materials</span>
                      <p className="font-bold text-gray-700">{order.quotationMaterials || order.aiDesignData?.materials?.join(', ') || 'Standard Premium Wood & Fabric'}</p>
                    </div>
                    <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4A373]/20">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Time to Complete</span>
                      <p className="font-bold text-gray-700">{order.quotationTime || '14-21 Days'}</p>
                    </div>
                    <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4A373]/20">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Assigned Vendor</span>
                      <p className="font-bold text-gray-700">{order.vendorId?.companyName || 'Artisan Workshop'}</p>
                    </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.quotationUPI && <span className="px-2.5 py-1 bg-[#F0FDF4] text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200 flex items-center gap-1"><Smartphone className="w-3 h-3" /> UPI</span>}
                      {order.quotationBankAccount && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-200 flex items-center gap-1"><Building2 className="w-3 h-3" /> Bank Transfer</span>}
                      {order.quotationPaymentGateway && <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold border border-purple-200 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Card / Gateway</span>}
                      {order.quotationCashOnVisit && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-200 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Cash on Visit</span>}
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
                      <button onClick={() => setViewingQuotation({
                        _id: order._id,
                        roomType: order.aiDesignData?.roomType || 'AI Design',
                        style: order.aiDesignData?.style || 'Modern',
                        budget: order.totalAmount || 'N/A',
                        quotationAmount: order.quotationAmount,
                        quotationMaterials: order.quotationMaterials,
                        quotationTime: order.quotationTime,
                        requirements: order.aiDesignData?.requirements || 'AI generated design',
                        materials: order.quotationMaterials || order.aiDesignData?.materials?.join(', '),
                        timeline: order.quotationTime,
                        assignedVendorId: order.vendorId,
                        status: 'Quotation Sent',
                        requestType: 'AI Generated'
                      })} className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> View Full Specifications
                      </button>

                    <div className="flex gap-3">
                      <button onClick={() => handleRejectAiQuotation(order._id)} className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs shadow-sm transition-all border border-red-200">
                        Reject Quote
                      </button>
                      <button onClick={() => handleAcceptAiQuotation(order._id)} className="px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Accept & Pay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quotation Specification Detail Modal */}
      {viewingQuotation && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A373]">Specification Sheet</span>
                <h3 className="font-['Playfair_Display'] font-bold text-2xl mt-0.5">{viewingQuotation.roomType} — {viewingQuotation.style}</h3>
              </div>
              <button onClick={() => setViewingQuotation(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-8 space-y-6 text-left max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <strong className="text-gray-400 font-bold uppercase block">Original Budget</strong>
                  <p className="font-bold text-[#1F2937] text-sm mt-0.5">{viewingQuotation.budget}</p>
                </div>
                <div>
                  <strong className="text-gray-400 font-bold uppercase block">Quoted Price</strong>
                  <p className="font-bold text-[#8B5E3C] text-lg mt-0.5">${viewingQuotation.quotationAmount}</p>
                </div>
                <div>
                  <strong className="text-gray-400 font-bold uppercase block">Estimated Delivery</strong>
                  <p className="font-bold text-[#1F2937] text-sm mt-0.5">{viewingQuotation.quotationTime || viewingQuotation.timeline}</p>
                </div>
                <div>
                  <strong className="text-gray-400 font-bold uppercase block">Materials Assigned</strong>
                  <p className="font-bold text-[#1F2937] text-sm mt-0.5">{viewingQuotation.quotationMaterials || viewingQuotation.materials}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                <strong className="text-gray-400 font-bold uppercase block">Client Requirements & Notes</strong>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">{viewingQuotation.requirements || 'No special requirements provided.'}</p>
              </div>

              {viewingQuotation.quotationNotes && (
                <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                  <strong className="text-gray-400 font-bold uppercase block">Vendor Explanation</strong>
                  <p className="text-gray-600 bg-amber-50/40 p-4 rounded-xl border border-amber-100/50 leading-relaxed">{viewingQuotation.quotationNotes}</p>
                </div>
              )}

              {viewingQuotation.status === 'Quotation Sent' && (
                <div className="flex gap-4 pt-4 border-t border-gray-150">
                  <button onClick={() => { handleBudgetRejection(viewingQuotation._id); setViewingQuotation(null); }} className="flex-1 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs shadow-sm transition-all border border-red-200">Reject Quotation</button>
                  <button onClick={() => { handleBudgetApproval(viewingQuotation._id); setViewingQuotation(null); }} className="flex-1 py-3.5 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> Accept & Confirm Pay</button>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Quotation Payment Modal */}
      {quotationPayment && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A373]">Payment</span>
                <h3 className="font-['Playfair_Display'] font-bold text-2xl mt-0.5">{quotationPayment.roomType} — {quotationPayment.style}</h3>
              </div>
              <button onClick={() => setQuotationPayment(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-6 space-y-6 text-left">
              <div className="bg-[#F8F5F0] p-4 rounded-2xl space-y-2 border border-[#D4A373]/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Quotation Amount</span>
                  <span className="font-extrabold text-[#8B5E3C] text-lg">${quotationPayment.quotationAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Materials</span>
                  <span className="font-bold text-gray-700">{quotationPayment.quotationMaterials}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Timeline</span>
                  <span className="font-bold text-gray-700">{quotationPayment.quotationTime}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider">Select Payment Method</label>
                <select
                  value={quotationPaymentMethod}
                  onChange={(e) => setQuotationPaymentMethod(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 transition-all cursor-pointer"
                >
                  <option value="Google Pay">Google Pay (GPay)</option>
                  <option value="PhonePe">PhonePe</option>
                  <option value="Paytm">Paytm</option>
                  <option value="UPI">UPI ID / QR Code</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="NetBanking">Net Banking</option>
                </select>
              </div>

              {/* QR / Scan Section — shown only for UPI-based methods */}
              {['Google Pay', 'PhonePe', 'Paytm', 'UPI'].includes(quotationPaymentMethod) && (
                <div className="bg-[#F0FDF4] border border-emerald-200 rounded-2xl p-5 text-center space-y-4 animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Smartphone className="w-3.5 h-3.5" /> Scan with {quotationPaymentMethod}
                  </div>

                  {/* QR Code Image */}
                  <div className="flex justify-center">
                    {quotationPayment.quotationQR || quotationPayment.quotationUPI ? (
                      <img
                        src={quotationPayment.quotationQR || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(quotationPayment.quotationUPI)}`}
                        alt="Scan to Pay QR Code"
                        className="w-48 h-48 object-contain rounded-2xl border-2 border-emerald-200 bg-white p-2 shadow-sm"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                      />
                    ) : (
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AI+Interior+Demo+Payment"
                        alt="Demo QR Code"
                        className="w-48 h-48 object-contain rounded-2xl border-2 border-emerald-200 bg-white p-2 shadow-sm"
                      />
                    )}
                  </div>

                  {/* UPI ID */}
                  {quotationPayment.quotationUPI ? (
                    <div className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="text-left">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">UPI ID</p>
                        <p className="font-bold text-gray-800 text-sm">{quotationPayment.quotationUPI}</p>
                      </div>
                      <button
                        onClick={() => { navigator.clipboard.writeText(quotationPayment.quotationUPI); showToast('UPI ID copied!'); }}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[11px] font-bold transition-all"
                      >
                        Copy
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Vendor did not provide a UPI ID for scan & pay.</p>
                  )}

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Open <strong>{quotationPaymentMethod}</strong> on your phone, scan the QR code above or enter the UPI ID to pay <strong>${quotationPayment.quotationAmount}</strong>. Then click confirm below.
                  </p>
                </div>
              )}

              {/* Action Button */}
              {['Google Pay', 'PhonePe', 'Paytm', 'UPI'].includes(quotationPaymentMethod) ? (
                <button
                  onClick={handleQuotationPayment}
                  disabled={quotationProcessing}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {quotationProcessing ? (
                    <>Processing...</>
                  ) : (
                    <><Smartphone className="w-5 h-5" /> I've Paid — Confirm Payment</>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleQuotationPayment}
                  disabled={quotationProcessing}
                  className="w-full py-4 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {quotationProcessing ? (
                    <>Processing...</>
                  ) : (
                    <><Check className="w-5 h-5" /> Pay ${quotationPayment.quotationAmount}</>
                  )}
                </button>
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* ── AI Design Quotation Payment Modal ── */}
      {aiQuotationPayment && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#2A9D8F] p-6 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A373]">Payment</span>
                <h3 className="font-['Playfair_Display'] font-bold text-2xl mt-0.5">{aiQuotationPayment.aiDesignData?.roomType || 'AI Design'} — {aiQuotationPayment.aiDesignData?.style || 'Modern'}</h3>
              </div>
              <button onClick={() => setAiQuotationPayment(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-6 space-y-6 text-left">
              <div className="bg-[#F8F5F0] p-4 rounded-2xl space-y-2 border border-[#D4A373]/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Quotation Amount</span>
                  <span className="font-extrabold text-[#2A9D8F] text-lg">${aiQuotationPayment.quotationAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Materials</span>
                  <span className="font-bold text-gray-700">{aiQuotationPayment.quotationMaterials}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Timeline</span>
                  <span className="font-bold text-gray-700">{aiQuotationPayment.quotationTime}</span>
                </div>
              </div>

              {/* Payment Method — based on what vendor provided */}
              {(() => {
                const pm = aiQuotationPayment.quotationPaymentMethod || 'upi';
                if (pm === 'upi' && aiQuotationPayment.quotationUPI) {
                  return (
                    <div className="bg-[#F0FDF4] border border-emerald-200 rounded-2xl p-5 text-center space-y-4 animate-fadeIn">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Smartphone className="w-3.5 h-3.5" /> UPI Payment
                      </div>
                      <div className="flex justify-center">
                        {aiQuotationPayment.quotationQR || aiQuotationPayment.quotationUPI ? (
                          <img src={aiQuotationPayment.quotationQR || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(aiQuotationPayment.quotationUPI)}`} alt="Scan to Pay QR Code" className="w-48 h-48 object-contain rounded-2xl border-2 border-emerald-200 bg-white p-2 shadow-sm" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                        ) : (
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AI+Interior+Demo+Payment" alt="Demo QR Code" className="w-48 h-48 object-contain rounded-2xl border-2 border-emerald-200 bg-white p-2 shadow-sm" />
                        )}
                      </div>
                      {aiQuotationPayment.quotationUPI && (
                        <div className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
                          <div className="text-left">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">UPI ID</p>
                            <p className="font-bold text-gray-800 text-sm">{aiQuotationPayment.quotationUPI}</p>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(aiQuotationPayment.quotationUPI); showToast('UPI ID copied!'); }} className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[11px] font-bold transition-all">Copy</button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 leading-relaxed">Scan the QR code or enter the UPI ID to pay <strong>${aiQuotationPayment.quotationAmount}</strong>. Then click confirm below.</p>
                      <button onClick={handleConfirmAiQuotationPayment} disabled={aiQuotationProcessing} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        {aiQuotationProcessing ? <>Processing...</> : <><Smartphone className="w-5 h-5" /> I've Paid — Confirm Payment</>}
                      </button>
                    </div>
                  );
                }
                if (pm === 'bank' && aiQuotationPayment.quotationBankAccount) {
                  return (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-4 animate-fadeIn">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider mx-auto">
                        <Building2 className="w-3.5 h-3.5" /> Bank Transfer
                      </div>
                      <div className="bg-white rounded-xl p-4 space-y-3 border border-blue-100">
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Account Holder</span><span className="font-bold text-gray-800">{aiQuotationPayment.quotationBankHolder}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Account Number</span><span className="font-bold text-gray-800">{aiQuotationPayment.quotationBankAccount}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">IFSC Code</span><span className="font-bold text-gray-800">{aiQuotationPayment.quotationBankIFSC}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Bank Name</span><span className="font-bold text-gray-800">{aiQuotationPayment.quotationBankName}</span></div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Transfer <strong>${aiQuotationPayment.quotationAmount}</strong> to the account above, then click confirm.</p>
                      <button onClick={handleConfirmAiQuotationPayment} disabled={aiQuotationProcessing} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        {aiQuotationProcessing ? <>Processing...</> : <><Check className="w-5 h-5" /> I've Paid — Confirm Payment</>}
                      </button>
                    </div>
                  );
                }
                if (pm === 'card' && aiQuotationPayment.quotationPaymentGateway) {
                  return (
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
                      <CreditCard className="w-12 h-12 text-purple-500 mx-auto" />
                      <p className="font-bold text-[#1F2937] text-sm">Pay via {aiQuotationPayment.quotationPaymentGateway}</p>
                      <p className="text-xs text-gray-500">You will be redirected to {aiQuotationPayment.quotationPaymentGateway} to complete payment of <strong>${aiQuotationPayment.quotationAmount}</strong>.</p>
                      <button onClick={handleConfirmAiQuotationPayment} disabled={aiQuotationProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        {aiQuotationProcessing ? <>Processing...</> : <><CreditCard className="w-5 h-5" /> Pay ${aiQuotationPayment.quotationAmount}</>}
                      </button>
                    </div>
                  );
                }
                if (pm === 'cash' && aiQuotationPayment.quotationCashOnVisit) {
                  return (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
                      <DollarSign className="w-12 h-12 text-amber-500 mx-auto" />
                      <p className="font-bold text-[#1F2937] text-sm">Cash on Visit</p>
                      <p className="text-xs text-gray-500">Pay <strong>${aiQuotationPayment.quotationAmount}</strong> in cash when the vendor visits your site.</p>
                      <button onClick={handleConfirmAiQuotationPayment} disabled={aiQuotationProcessing} className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        {aiQuotationProcessing ? <>Processing...</> : <><Check className="w-5 h-5" /> Confirm Cash Payment</>}
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* TAB 8: ORDER TRACKING */}
      {activeTab === 'tracking' && (() => {
        const trackingId = localStorage.getItem('activeTrackingOrderId');
        const marketplaceOrders = orders.filter(o => o.orderType === 'Marketplace Product');
        const activeOrder = orders.find(o => o._id === trackingId) || marketplaceOrders[0];

        if (!activeOrder) {
          return (
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center space-y-4">
              <Truck className="w-16 h-16 text-gray-300 mx-auto" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">No Active Deliveries</h2>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">You haven't ordered any marketplace products yet or don't have any active shipments.</p>
              <button onClick={() => { if(setActiveTab) setActiveTab('marketplace'); }} className="px-6 py-3 bg-[#8B5E3C] text-white rounded-xl font-bold text-xs shadow-md">Browse Marketplace</button>
            </div>
          );
        }

        const status = activeOrder.orderStatus || 'Pending';
        const expectedDate = activeOrder.expectedDeliveryDate ? new Date(activeOrder.expectedDeliveryDate).toLocaleDateString() : '7 Days from purchase';
        
        // Dynamic status descriptions
        const getStatusMessage = () => {
          switch (status) {
            case 'Pending':
            case 'Pending Confirmation':
              return { title: 'Pending Confirmation', desc: 'The order is awaiting vendor confirmation.' };
            case 'Processing':
              return { title: 'Processing Order', desc: 'Your order has been confirmed by the vendor and is currently in production/packaging.' };
            case 'Manufacturing':
            case 'In Production':
              return { title: 'Manufacturing Progressing', desc: 'The vendor has started production of your custom design.' };
            case 'Ready for Delivery':
              return { title: 'Ready for Delivery', desc: 'Your custom design is manufactured and ready for delivery dispatch.' };
            case 'Delivered':
              return { title: 'Delivered', desc: 'Your order has been successfully delivered. Please confirm receipt and request installation if needed.' };
            case 'Installation Scheduled':
              return { title: 'Installation Scheduled', desc: 'An installation technician is scheduled to set up your design.' };
            case 'Completed':
              return { title: 'Completed', desc: 'The order lifecycle is completed. We hope you enjoy your purchase!' };
            case 'Cancelled':
              return { title: 'Cancelled', desc: 'This order was cancelled.' };
            default:
              return { title: status, desc: 'Current order status is updated.' };
          }
        };

        const currentMsg = getStatusMessage();

        // Exactly 7 Stages requested: Pending, Processing, Manufacturing, Ready for Delivery, Delivered, Installation Scheduled, Completed
        const stagesList = [
          { key: 'Pending', label: 'Pending', isDone: true },
          { key: 'Processing', label: 'Processing', isDone: ['Processing', 'In Progress', 'Manufacturing', 'In Production', 'Ready for Delivery', 'Dispatched', 'Out For Delivery', 'Delivered', 'Installation Scheduled', 'Completed'].includes(status) },
          { key: 'Manufacturing', label: 'Manufacturing', isDone: ['Manufacturing', 'In Production', 'Ready for Delivery', 'Dispatched', 'Out For Delivery', 'Delivered', 'Installation Scheduled', 'Completed'].includes(status) },
          { key: 'Ready for Delivery', label: 'Ready for Delivery', isDone: ['Ready for Delivery', 'Dispatched', 'Out For Delivery', 'Delivered', 'Installation Scheduled', 'Completed'].includes(status) },
          { key: 'Delivered', label: 'Delivered', isDone: ['Delivered', 'Installation Scheduled', 'Completed'].includes(status) },
          { key: 'Installation Scheduled', label: 'Installation Scheduled', isDone: ['Installation Scheduled', 'Completed'].includes(status) },
          { key: 'Completed', label: 'Completed', isDone: status === 'Completed' }
        ];

        const handleReturnRequest = (e) => {
          e.preventDefault();
          const reason = e.target.reason.value;
          if (!reason.trim()) {
            alert('Please provide a return reason.');
            return;
          }
          
          const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          const updated = localOrders.map(o => {
            if (o._id === activeOrder._id) {
              return {
                ...o,
                hasReturnRequest: true,
                returnReason: reason,
                returnStatus: 'Pending Review'
              };
            }
            return o;
          });
          
          localStorage.setItem('mockOrders', JSON.stringify(updated));
          setOrders(updated);

          // Notifications
          const triggerNotif = (recipient, message) => {
            const notifObj = {
              _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              message,
              type: 'warning',
              createdAt: new Date().toISOString(),
              read: false
            };
            const key = recipient === 'vendor' ? 'mockVendorNotifications' : 'mockAdminNotifications';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            localStorage.setItem(key, JSON.stringify([notifObj, ...existing]));
          };
          triggerNotif('vendor', `Customer requested a return for order #${activeOrder._id.slice(-6)}`);
          triggerNotif('admin', `Return request filed for order #${activeOrder._id.slice(-6)}`);
          
          alert('✅ Return request submitted successfully to the vendor.');
        };

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Switch Dropdown */}
            {marketplaceOrders.length > 1 && (
              <div className="bg-white p-4 rounded-2xl border border-[#D4A373]/30 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Track a different order:</span>
                <select 
                  value={activeOrder._id}
                  onChange={(e) => {
                    localStorage.setItem('activeTrackingOrderId', e.target.value);
                    // Force state update by reloading activeOrder
                    setOrders(JSON.parse(localStorage.getItem('mockOrders') || '[]'));
                  }}
                  className="text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none"
                >
                  {marketplaceOrders.map(o => (
                    <option key={o._id} value={o._id}>{o.productDetails?.title} (#{o._id.slice(-6)})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Live Order Tracking</h2>
                  <p className="text-xs text-gray-400 mt-1">Product: <strong>{activeOrder.productDetails?.title}</strong> • Order #{activeOrder._id?.slice(-6)} • Date: {new Date(activeOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="px-4 py-2 bg-[#00A86B]/10 text-[#00A86B] font-bold rounded-lg text-xs border border-[#00A86B]/20">
                  Expected: {expectedDate}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="relative py-6">
                {/* Horizontal Progress Line for MD and larger */}
                <div className="absolute top-[28px] left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden md:block"></div>
                <div 
                  className="absolute top-[28px] left-0 h-1 bg-[#2A9D8F] -translate-y-1/2 rounded-full hidden md:block transition-all duration-500"
                  style={{
                    width: `${(stagesList.filter(s => s.isDone).length - 1) / (stagesList.length - 1) * 100}%`
                  }}
                ></div>

                {/* Timeline Nodes */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-6 relative z-10">
                  {stagesList.map((stage, index) => {
                    const isPassed = stage.isDone;
                    const isCurrent = (index === stagesList.filter(s => s.isDone).length - 1) || (index === 0 && !stagesList[1].isDone);
                    
                    return (
                      <div key={stage.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 ring-4 ring-white ${
                            isPassed 
                              ? 'bg-[#2A9D8F] text-white' 
                              : 'bg-white text-gray-400 border-2 border-gray-200'
                          } ${isCurrent ? 'scale-110 ring-emerald-200' : ''}`}
                        >
                          {isPassed ? '✓' : index + 1}
                        </div>
                        <div className="text-left md:text-center">
                          <p className={`font-bold text-xs ${isPassed ? 'text-[#1F2937]' : 'text-gray-400'}`}>
                            {stage.label}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {isCurrent ? 'Current Stage' : (isPassed ? 'Completed' : 'Pending')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Details Bar */}
              <div className="bg-[#F8F5F0] p-6 rounded-2xl flex items-center gap-4 border border-[#D4A373]/10">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">🚚</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1F2937]">{currentMsg.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{currentMsg.desc}</p>
                </div>
              </div>

              {/* Return Request panel */}
              {(status === 'Delivered' || status === 'Completed') && !activeOrder.hasReturnRequest && (
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 mt-6 space-y-4">
                  <h3 className="font-['Playfair_Display'] font-bold text-lg text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Request a Return or Refund
                  </h3>
                  <p className="text-xs text-red-600">If you are unsatisfied with your product, you can request a return. The vendor will review your request.</p>
                  <form onSubmit={handleReturnRequest} className="space-y-4">
                    <textarea name="reason" placeholder="Explain the reason for return/refund (e.g., damaged product, wrong shade...)" rows={3} required className="w-full p-4 rounded-xl border border-red-200 focus:outline-none focus:border-red-500 text-sm bg-white" />
                    <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-all">Submit Return Request</button>
                  </form>
                </div>
              )}

              {activeOrder.hasReturnRequest && (
                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200 mt-6">
                  <h3 className="font-['Playfair_Display'] font-bold text-lg text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" /> Return Request Filed
                  </h3>
                  <p className="text-xs text-orange-600 mt-1">Status: <strong>{activeOrder.returnStatus || 'Pending Review'}</strong></p>
                  <p className="text-xs text-gray-500 mt-2"><strong>Reason:</strong> {activeOrder.returnReason}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 9: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] border-b border-gray-100 pb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 rounded-tl-xl">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-xl">Receipt</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-[#1F2937]">#TXN-99281</td>
                  <td className="p-4 text-gray-500">Oct 12, 2026</td>
                  <td className="p-4 font-bold text-[#8B5E3C]">$450.00</td>
                  <td className="p-4"><div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> Card **1234</div></td>
                  <td className="p-4"><span className="bg-[#00A86B]/10 text-[#00A86B] px-2 py-1 rounded-md text-xs font-bold">Paid</span></td>
                  <td className="p-4"><button onClick={() => alert('📥 Downloading Receipt #TXN-99281 (PDF)...')} className="text-[#8B5E3C] hover:underline font-bold text-xs">Download</button></td>
                </tr>
                {/* Mock Pending Payment */}
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-[#1F2937]">#TXN-99282</td>
                  <td className="p-4 text-gray-500">Oct 14, 2026</td>
                  <td className="p-4 font-bold text-[#8B5E3C]">$4,850.00</td>
                  <td className="p-4">{pendingPaid ? <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> Card **5678</div> : '-'}</td>
                  <td className="p-4">
                    {pendingPaid ? (
                      <span className="bg-[#00A86B]/10 text-[#00A86B] px-2 py-1 rounded-md text-xs font-bold">Paid</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">Pending</span>
                    )}
                  </td>
                  <td className="p-4">
                    {pendingPaid ? (
                      <button onClick={() => alert('📥 Downloading Receipt #TXN-99282 (PDF)...')} className="text-[#8B5E3C] hover:underline font-bold text-xs">Download</button>
                    ) : (
                      <button onClick={() => { alert('💳 Processing Payment of $4,850.00...'); setPendingPaid(true); alert('✅ Payment Successful! Receipt generated.'); }} className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all">Pay Now</button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 10: HELP CENTER (SUPPORT) */}
      {activeTab === 'support' && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden flex h-[600px] animate-fade-in">
          {/* Left panel: Help resources & FAQs */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-[#FDFBF7] p-6 space-y-6">
            <div>
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937]">Help Center</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">24/7 Support Desk</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frequently Asked Questions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-[#D4A373]/20 shadow-xs">
                  <p className="font-bold text-[10px] text-gray-800">How to request custom design?</p>
                  <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">Go to "Manual Design Request" tab and fill out room requirements and files.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D4A373]/20 shadow-xs">
                  <p className="font-bold text-[10px] text-gray-800">How does payment work?</p>
                  <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">We support standard methods. You can pay via credit card under "Design Quotations".</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D4A373]/20 shadow-xs">
                  <p className="font-bold text-[10px] text-gray-800">Who manufactures the furniture?</p>
                  <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">Our registered artisan vendor workshops build and ship designs directly.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto bg-[#E76F51]/5 border border-[#E76F51]/10 p-4 rounded-2xl">
              <p className="text-[10px] text-[#E76F51] font-bold">Need urgent help?</p>
              <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">Send a live message on the right. Both Admin and Vendor support agents are active.</p>
            </div>
          </div>

          {/* Right panel: Live Support Chat conversation */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E76F51]/15 text-[#E76F51] flex items-center justify-center font-bold">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#1F2937]">ArtisanStudio Support</h3>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">Online • Replies in minutes</p>
                </div>
              </div>
              <span className="text-[9px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded font-bold uppercase">Shared Chat</span>
            </div>

            {/* Support Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20">
              {helpMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-700 font-bold">No messages yet</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] leading-relaxed">Ask a question below to start a live support conversation with our team.</p>
                </div>
              ) : (
                helpMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  let senderBadge = '';
                  if (msg.sender === 'admin') senderBadge = 'Admin';
                  if (msg.sender === 'vendor') senderBadge = 'Vendor';
                  
                  return (
                    <div key={msg._id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isUser 
                          ? 'bg-[#E76F51] text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        {!isUser && (
                          <span className="block text-[8px] font-bold uppercase tracking-wider text-[#E76F51] mb-1">
                            Support ({senderBadge})
                          </span>
                        )}
                        <p>{msg.message}</p>
                        <span className={`block text-[8px] mt-1.5 text-right ${isUser ? 'text-white/60' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Send Input */}
            <form onSubmit={handleSendHelpMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
              <input
                type="text"
                value={helpInput}
                onChange={(e) => setHelpInput(e.target.value)}
                placeholder="Describe your issue or ask support..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F51] text-xs"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                Send Help Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW TAB: SUBMIT REVIEW */}
      {activeTab === 'reviews' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Star className="w-6 h-6 text-[#E9C46A] fill-[#E9C46A]" />
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Submit Review</h2>
          </div>
          <form onSubmit={handlePublishReview} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Select Product / Service</label>
              <select className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white">
                <option>Velvet Lounge Chair (Delivered)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Rating (1-5 Stars)</label>
              <input type="number" min={1} max={5} required value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Review Comment</label>
              <textarea rows={3} required value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Absolutely loved the craftsmanship..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Publish Review</button>
          </form>
        </div>
      )}

      {/* TAB: DIRECT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden flex h-[600px]">
          {/* Left panel: Vendor list */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-[#FDFBF7]">
            <div className="p-4 border-b border-gray-100 bg-white">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937]">Conversations</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Chat with store artisans</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {[
                { name: 'Artisan Workshop Ltd', desc: 'Main Workshop & Furniture Design', status: 'Online' },
                { name: 'Nordic Design Ltd', desc: 'Scandinavian furniture specialists', status: 'Offline' },
                { name: 'Luxury Living Inc', desc: 'Premium marble & custom fittings', status: 'Online' }
              ].map(vendor => (
                <button
                  key={vendor.name}
                  onClick={() => setSelectedVendorMsg(vendor.name)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 ${
                    selectedVendorMsg === vendor.name 
                      ? 'bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 shadow-sm' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center font-bold text-sm shrink-0">
                    {vendor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-xs text-[#1F2937] truncate">{vendor.name}</h4>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${vendor.status === 'Online' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{vendor.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: Chat messages */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Active chat header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#1F2937]">{selectedVendorMsg}</h3>
                <p className="text-[10px] text-emerald-600 font-medium">Active Session</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold">Direct Support</span>
              </div>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFAF7]/30">
              {directMessages.filter(m => m.vendorName === selectedVendorMsg).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-[#8B5E3C]/5 flex items-center justify-center text-[#8B5E3C] mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-[#1F2937]">Start a conversation</h4>
                  <p className="text-[10px] text-gray-400 max-w-[200px] mt-1">Send a message to inquire about design requests, custom pricing, or order adjustments.</p>
                </div>
              ) : (
                directMessages.filter(m => m.vendorName === selectedVendorMsg).map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg._id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isUser 
                          ? 'bg-[#8B5E3C] text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        <p>{msg.message}</p>
                        <span className={`block text-[9px] mt-1 text-right ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendDirectMessage} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder={`Type a message to ${selectedVendorMsg}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 11: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {(user?.name || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">My Profile</h2>
              <p className="text-gray-500 text-sm">Update your personal and shipping details.</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Profile Updated'); }}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" defaultValue={user?.name} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" defaultValue={user?.email} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Default Shipping Address</label>
              <textarea rows={3} placeholder="123 Artisan Street, City, Country, ZIP" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-gray-50" />
            </div>
            <button type="submit" className="py-4 px-8 bg-[#1F2937] hover:bg-black text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Save Changes</button>
          </form>
        </div>
      )}

      {/* TAB 12: SAVED DESIGNS */}
      {activeTab === 'saved' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Saved Designs & Inspirations</h2>
            <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-4 py-1.5 rounded-full text-xs font-bold">
              {savedDesigns.length} Saved
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedDesigns.length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-400 font-medium">
                No saved designs yet. Click the bookmark icon on any AI design to save it here.
              </div>
            ) : (
              savedDesigns.map(design => (
                <div key={design._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D4A373]/20 group relative">
                  <img src={design.generatedImage || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500"} alt="Saved" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button onClick={() => handleToggleBookmark(design._id)} className="p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-700 transition-all" title="Unsave">
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    <button onClick={() => handleDeleteDesign(design._id)} className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-all" title="Delete">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <p className="font-bold text-lg">{design.roomType || 'Living Room'}</p>
                    <p className="text-xs opacity-80">${design.aiSuggestion?.budgetEstimate || '4,500'}</p>
                  </div>
                  {design.status !== 'accepted' && design.status !== 'execution' && (
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                      <button onClick={() => handleAiStatus(design._id, 'accepted')} className="flex-1 py-2 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Accept & Order
                      </button>
                      <button onClick={() => handleProceedToExecution(design)} className="flex-1 py-2 bg-[#1F2937] hover:bg-black text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5" /> Execute
                      </button>
                    </div>
                  )}
                  {design.status === 'accepted' && (
                    <div className="p-3 bg-white border-t border-gray-100">
                      <span className="block text-center text-xs font-bold text-[#2A9D8F]">✓ Accepted & Sent to Vendor</span>
                    </div>
                  )}
                  {design.status === 'execution' && (
                    <div className="p-3 bg-white border-t border-gray-100">
                      <span className="block text-center text-xs font-bold text-[#2A9D8F]">✓ Sent for Execution</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 13: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] flex items-center gap-3">
              <Bell className="w-6 h-6 text-[#E76F51]" /> Notifications
            </h2>
            {notifications.length > 0 && (
              <button onClick={onMarkAllRead} className="text-sm font-bold text-[#8B5E3C] hover:underline">
                Mark all as read
              </button>
            )}
          </div>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => {
                const isUnread = !notif.read;
                return (
                  <div 
                    key={notif._id} 
                    onClick={() => onNotifClick && onNotifClick(notif)}
                    className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm ${
                      isUnread 
                        ? 'bg-[#E76F51]/5 border-[#E76F51]/20' 
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      {isUnread ? (
                        <div className="w-2 h-2 bg-[#E76F51] rounded-full mt-1.5"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${isUnread ? 'text-[#1F2937]' : 'text-gray-500'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                      </p>
                      {(notif.message.toLowerCase().includes('quotation') || notif.message.toLowerCase().includes('quote')) && (
                        <button 
                          onClick={() => { if (setActiveTab) setActiveTab('orders'); }} 
                          className="mt-2 text-xs font-bold text-[#8B5E3C] hover:underline block"
                        >
                          Review Quotation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Account Creation Success Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out forwards;
            }
            .animate-scaleIn {
              animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-[#D4A373]/30 shadow-2xl text-center animate-scaleIn">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h3 className="font-['Playfair_Display'] text-3xl font-extrabold text-[#1F2937] mb-3">
              Account Created!
            </h3>
            
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Your account has been created successfully. Welcome to ArtisanStudio! Start exploring our AI room studio and artisan marketplace to transform your home.
            </p>
            
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;