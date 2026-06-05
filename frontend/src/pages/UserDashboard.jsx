import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Wand2, UploadCloud, CheckCircle, RefreshCw, XCircle, ShoppingBag, 
  HelpCircle, Hammer, DollarSign, Clock, Star, MessageSquare, AlertCircle, Eye, Check,
  LayoutDashboard, ShoppingCart, Truck, CreditCard, User as UserIcon, Bookmark, Bell, ArrowRight, ArrowLeft, Activity, Package, AlertTriangle, FileText, PlayCircle, Smartphone, Bot, Building2
} from 'lucide-react';
import { useToast } from '../components/Toast';
import Marketplace from './Marketplace';

import imgBalcony1 from '../assets/Balacony 1.png';
import imgBalcony2 from '../assets/Balacony 2.png';
import imgBalcony3 from '../assets/Balcony.png';
import imgBathroom1 from '../assets/Bathroom image.png';
import imgBathroom2 from '../assets/Bathroon image 1.png';
import imgBathroom3 from '../assets/Bathroom image 2.png';
import imgBedroom1 from '../assets/bedroom.png';
import imgBedroom2 from '../assets/Bedroom 1.png';
import imgBedroom3 from '../assets/Bedroom 2.png';
import imgCommercial1 from '../assets/Commercial image .png';
import imgDining1 from '../assets/dining room.png';
import imgDining2 from '../assets/Dining room 1.png';
import imgDining3 from '../assets/Dining room 2.png';
import imgKitchen1 from '../assets/Kitchen room.png';
import imgKitchen2 from '../assets/Kitchen room 1.png';
import imgKitchen3 from '../assets/Kitchen room 2.png';
import imgLiving1 from '../assets/living room .png';
import imgLiving2 from '../assets/Living room 1.png';
import imgLiving3 from '../assets/Living room 2.png';
import imgPooja1 from '../assets/Pooja room.png';
import imgPooja2 from '../assets/pooja room 1.png';
import imgPooja3 from '../assets/pooja room 2.png';
import imgKids1 from '../assets/kidsroom .png';
import imgOffice1 from '../assets/office room.png';
import imgOffice2 from '../assets/office room 1.png';
import imgOffice3 from '../assets/office room 2.png';

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
  const [profileData, setProfileData] = useState(() => {
    const saved = null;
    if (saved) return JSON.parse(saved);
    return { name: user?.name || '', phone: '', address: '' };
  });
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

  // AI Room Vision states for sequential analysis & WGAN generation
  const [aiAnalysisStep, setAiAnalysisStep] = useState('idle'); // 'idle', 'analyzing', 'generating', 'completed'
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState(0);
  const [aiAnalysisLogs, setAiAnalysisLogs] = useState([]);
  const [activeAnalysisResult, setActiveAnalysisResult] = useState(null);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState(null);
  const [showOriginalImage, setShowOriginalImage] = useState(false);

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
  const [trackingOrderId, setTrackingOrderId] = useState(localStorage.getItem('activeTrackingOrderId') || '');
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
  const aiQuotationOrders = useMemo(() => orders.filter(o => o.orderType === 'AI Design' && o.orderStatus === 'quotation_sent'), [orders]);

  // Tracking Data State (keyed by order _id, fetched from unified backend)
  const [trackingData, setTrackingData] = useState({});

  const fetchTrackingData = async (orderId) => {
    if (!orderId) return;
    // Skip mock/non-MongoDB order IDs — they only exist in frontend mock data
    if (String(orderId).startsWith('ord_') || String(orderId).startsWith('mock_') || String(orderId).startsWith('mkt_')) return;
    try {
      const res = await axios.get(`/orders/tracking/${orderId}`);
      if (res.data && res.data.success) {
        setTrackingData(prev => ({ ...prev, [orderId]: res.data.data }));
      }
    } catch (err) {
      // tracking endpoint may throw for orders without OrderTracking doc
    }
  };

  // Payment Records State
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const loadPayments = useCallback(async () => {
    setLoadingPayments(true);
    try {
      const res = await axios.get('/orders/payments');
      if (res.data && res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load payments', err);
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'payments') {
      loadPayments();
    }
  }, [activeTab, loadPayments]);

  // Ticket & Review State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTargetId, setReviewTargetId] = useState('');
  const [reviewProductId, setReviewProductId] = useState('');
  const [userReviews, setUserReviews] = useState([]);


  useEffect(() => {
    if (activeTab === 'reviews') {
      const loadUserReviews = async () => {
        try {
          const res = await axios.get('/orders/reviews/user');
          if (res.data && res.data.success) {
            setUserReviews(res.data.data);
          }
        } catch (err) {
          console.warn('Failed to load user reviews from DB', err);
        }
      };
      loadUserReviews();
    }
  }, [activeTab, user]);

  const [directMessages, setDirectMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [selectedVendorMsg, setSelectedVendorMsg] = useState('Artisan Workshop Ltd');

  // Help Center Live Chat States (Now Unified Shared Chat)
  const [helpMessages, setHelpMessages] = useState([]);
  const [helpInput, setHelpInput] = useState('');
  const chatEndRef = useRef(null);

  const loadHelpMessages = async () => {
    try {
      const res = await axios.get('/chat/sync');
      if (res.data && res.data.success) {
        setHelpMessages(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load chat messages:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'support') {
      loadHelpMessages();
      window.addEventListener('mockChatUpdated', loadHelpMessages);
      const interval = setInterval(loadHelpMessages, 2500);
      return () => {
        window.removeEventListener('mockChatUpdated', loadHelpMessages);
        clearInterval(interval);
      };
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'support' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [helpMessages, activeTab]);

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

    const existing = [];
    const updated = [...existing, newMsg];
    
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
    const vNotifs = [];
    
  };

  const handleSendHelpMessage = async (e) => {
    e.preventDefault();
    if (!helpInput.trim()) return;

    const email = user?.email || 'user@example.com';
    const name = user?.name || 'User Demo';

    const newMsg = {
      _id: 'hm_' + Date.now(),
      roomId: email,
      userName: name,
      userEmail: email,
      vendorName: 'Artisan Workshop Ltd',
      senderRole: 'user',
      senderName: name,
      message: helpInput,
      createdAt: new Date().toISOString()
    };

    const updated = [...helpMessages, newMsg];
    
    setHelpMessages(updated);
    setHelpInput('');

    try {
      await axios.put('/chat/sync', { chat: updated });
    } catch (err) {
      console.warn('Failed to sync chat messages:', err);
    }

    // Trigger notification to vendor
    const notifMsg = `[Help Center] New message from customer ${name}: "${helpInput.substring(0, 30)}..."`;
    const vNotifs = [];
    

    // Trigger notification to admin
    const aNotifs = [];
    
  };

  useEffect(() => {
    fetchUserData();

    const handleSync = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('mockOrdersUpdated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('mockOrdersUpdated', handleSync);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'tracking') {
      const ordersWithTracking = orders.filter(o => o.paymentStatus === 'paid' || o.orderType === 'Marketplace Product');
      ordersWithTracking.forEach(o => fetchTrackingData(o._id));
    }
  }, [activeTab, orders.length]);

  useEffect(() => {
    if (activeTab === 'quotations' || activeTab === 'manual') {
      // Re-fetch manual designs from the backend to get fresh quotation data
      const refreshManualDesigns = async () => {
        try {
          const res = await axios.get('/designs/manual');
          if (res.data && res.data.success && res.data.data.length > 0) {
            setManualDesigns(res.data.data);
          } else {
            // Fallback to mock data so dashboard is never empty for demo
            setManualDesigns([
              {
                _id: 'man_req_1',
                requestType: 'Manual Design',
                roomType: 'Living Room',
                style: 'Modern Minimalist',
                status: 'Quotation Sent',
                budget: 'Medium ($1000 - $3000)',
                size: '250 sqft',
                createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
                quotationAmount: '2800',
                quotationMaterials: 'Premium Teak Wood, Cotton Fabric, Brass Accents',
                quotationTime: '18 Days',
                assignedVendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' }
              },
              {
                _id: 'man_req_2',
                requestType: 'Interior Designer Help',
                roomType: 'Master Bedroom',
                style: 'Scandinavian',
                status: 'Approved',
                budget: 'High ($3000+)',
                size: '350 sqft',
                createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
                quotationAmount: '4500',
                quotationMaterials: 'Oak Wood, Linen, Matte Black Hardware',
                quotationTime: '25 Days',
                assignedDesignerId: { _id: 'designer_1', companyName: 'Elite Spaces Design' }
              }
            ]);
          }
        } catch (err) {
          console.warn('Failed to refresh manual designs:', err);
        }
      };
      refreshManualDesigns();
    }
    if (activeTab === 'manual') {
      setOwnMaterials('No');
    }
  }, [activeTab]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get('/cart');
      const cartData = res.data?.data;
      if (cartData && cartData.items) {
        setCartItems(cartData.items.filter(item => item.productId));
      }
    } catch (err) {
      console.warn('Failed to fetch cart from backend:', err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'cart') {
      fetchCart();
      const syncProducts = async () => {
        try {
          const res = await axios.get('/products');
          const serverProds = res.data?.data || [];
          setProducts(serverProds);
        } catch (err) {
          console.warn('Backend products fetch failed in activeTab cart useEffect:', err);
          setProducts([]);
        }
      };
      syncProducts();
    } else {
      setShowCheckoutSummary(false);
    }
  }, [activeTab, fetchCart]);

  useEffect(() => {
    const onCartUpdated = () => {
      if (activeTab === 'cart') fetchCart();
    };
    window.addEventListener('cartUpdated', onCartUpdated);
    return () => window.removeEventListener('cartUpdated', onCartUpdated);
  }, [activeTab, fetchCart]);

  const fetchUserData = async () => {
    try {
      // ── Synchronous seed: show mock data immediately ──
      const mockOrders = [
        { _id: 'ord_mock_mkt_1', orderType: 'Marketplace Product', userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' }, vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' }, totalAmount: 1299, paymentStatus: 'paid', orderStatus: 'Pending Confirmation', createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), shippingAddress: user?.address || '123 Default User St', productDetails: { _id: 'prod_1', title: 'Velvet Emerald Sofa', price: 1299, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'], quantity: 1 } },
        { _id: 'ord_mock_mkt_2', orderType: 'Marketplace Product', userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' }, vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' }, totalAmount: 449, paymentStatus: 'paid', orderStatus: 'Out For Delivery', createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), shippingAddress: user?.address || '123 Default User St', productDetails: { _id: 'prod_2', title: 'Minimalist Teak Coffee Table', price: 449, images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600'], quantity: 2 } },
      ];
      setOrders(mockOrders);

      const mockAi = [
        { _id: 'ai_1', roomType: 'Living Room', status: 'generated', createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), aiSuggestion: { furniture: ['Custom Teak Sofa', 'Minimalist Oak Coffee Table'], materials: ['Teak Wood', 'Linen'], colorPalette: ['Teak Warmth', 'Beige Linen'], budgetEstimate: 4200 }, generatedImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800' },
        { _id: 'ai_2', roomType: 'Bedroom', status: 'generated', createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), aiSuggestion: { furniture: ['Platform Bed', 'Wall-mounted Shelves'], materials: ['Oak Wood', 'Cotton'], colorPalette: ['Warm White', 'Natural Oak'], budgetEstimate: 3800 }, generatedImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800' },
      ];
      setAiDesigns(mockAi);

      const mockManual = [
        { _id: 'man_req_1', requestType: 'Manual Design', roomType: 'Living Room', style: 'Modern Minimalist', status: 'Quotation Sent', budget: 'Medium ($1000 - $3000)', size: '250 sqft', createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), quotationAmount: '2800', quotationMaterials: 'Premium Teak Wood, Cotton Fabric, Brass Accents', quotationTime: '18 Days', assignedVendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' } },
        { _id: 'man_req_2', requestType: 'Interior Designer Help', roomType: 'Master Bedroom', style: 'Scandinavian', status: 'Approved', budget: 'High ($3000+)', size: '350 sqft', createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), quotationAmount: '4500', quotationMaterials: 'Oak Wood, Linen, Matte Black Hardware', quotationTime: '25 Days', assignedDesignerId: { _id: 'designer_1', companyName: 'Elite Spaces Design' } }
      ];
      setManualDesigns(mockManual);

      const mockProducts = [
        { _id: 'prod_1', title: 'Velvet Emerald Sofa', price: 1299, category: 'Living Room', rating: 4.8, reviewsCount: 124, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'], vendorId: { companyName: 'Artisan Workshop' } },
        { _id: 'prod_2', title: 'Minimalist Teak Coffee Table', price: 449, category: 'Living Room', rating: 4.5, reviewsCount: 89, images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600'], vendorId: { companyName: 'Artisan Workshop' } },
        { _id: 'prod_3', title: 'Nordic Oak Dining Chair', price: 210, category: 'Dining Room', rating: 4.9, reviewsCount: 300, images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600'], vendorId: { companyName: 'Nordic Design Ltd' } },
        { _id: 'prod_4', title: 'Modern Brass Floor Lamp', price: 320, category: 'Lighting', rating: 4.7, reviewsCount: 156, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'], vendorId: { companyName: 'Nordic Design Ltd' } },
        { _id: 'prod_5', title: 'Luxury Marble Side Table', price: 580, category: 'Living Room', rating: 4.6, reviewsCount: 45, images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600'], vendorId: { companyName: 'Luxury Living Inc' } },
        { _id: 'prod_6', title: 'Ergonomic Lounge Chair', price: 890, category: 'Bedroom', rating: 4.9, reviewsCount: 412, images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'], vendorId: { companyName: 'Luxury Living Inc' } }
      ];
      setProducts(mockProducts);

      // ── Async: refresh from backend ──
      // 1. AI Designs
      try {
        const res = await axios.get('/designs/ai');
        if (res.data && res.data.success) {
          setAiDesigns(res.data.data);
        }
      } catch (err) {
        console.warn('Backend ai designs fetch failed:', err);
      }

      // 2. Manual Requests
      try {
        const res = await axios.get('/designs/manual');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setManualDesigns(res.data.data);
        }
      } catch (err) {
        console.warn('Backend manual designs fetch failed:', err);
      }

      // 3. Products
      try {
        const res = await axios.get('/products');
        const serverProds = res.data?.data || [];
        if (serverProds.length > 0) setProducts(serverProds);
      } catch (err) {
        console.warn('Backend products fetch failed in UserDashboard:', err);
      }

      // 4. Orders from backend (custom/design)
      try {
        const ordersRes = await axios.get('/orders/user');
        if (ordersRes.data && ordersRes.data.success) {
          const dbOrders = ordersRes.data.data;
          setOrders(prev => {
            const map = new Map();
            let localOrders = Array.isArray(prev) ? prev : [];
            dbOrders.forEach(o => map.set(o._id, o));
            localOrders.forEach(o => map.set(o._id, o));
            return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          });
        }
      } catch (err) {
        console.warn('Backend orders fetch failed in UserDashboard:', err);
      }

      // 5. Marketplace orders
      try {
        const mktRes = await axios.get('/marketplace-orders/myorders');
        if (mktRes.data?.success && mktRes.data.data) {
          const mktOrders = mktRes.data.data.map(o => ({
            _id: o._id,
            orderType: 'Marketplace Product',
            userId: o.userId,
            vendorId: o.items[0]?.vendorId || { companyName: 'Artisan Workshop' },
            totalAmount: o.totalAmount,
            paymentStatus: o.paymentStatus,
            orderStatus: o.orderStatus,
            shippingAddress: o.shippingAddress,
            createdAt: o.createdAt,
            productDetails: o.items[0]?.productId ? {
              _id: o.items[0].productId._id,
              title: o.items[0].productId.title,
              price: o.items[0].price,
              images: o.items[0].productId.images || [],
              quantity: o.items.reduce((sum, i) => sum + i.quantity, 0)
            } : { title: 'Marketplace Product', quantity: o.items.reduce((sum, i) => sum + i.quantity, 0) },
            items: o.items,
            subtotal: o.subtotal,
            tax: o.tax,
            shippingFee: o.shippingFee
          }));
          setOrders(prev => {
            const map = new Map();
            let localOrders = Array.from(prev || []);
            mktOrders.forEach(o => map.set(o._id, o));
            localOrders.forEach(o => map.set(o._id, o));
            return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          });
        }
      } catch (err) {
        console.warn('Backend marketplace orders fetch failed:', err);
      }

      // 6. User reviews
      try {
        const reviewsRes = await axios.get('/orders/reviews/user');
        if (reviewsRes.data && reviewsRes.data.success && reviewsRes.data.data.length > 0) {
          setUserReviews(reviewsRes.data.data);
        }
      } catch (err) {
        console.warn('Backend reviews fetch failed in UserDashboard:', err);
      }

      // 7. Cart
      try {
        const cartRes = await axios.get('/cart');
        const cartData = cartRes.data?.data;
        if (cartData && cartData.items) {
          setCartItems(cartData.items.filter(item => item.productId));
        }
      } catch (err) {
        console.warn('Failed to fetch cart in fetchUserData:', err);
      }
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
    setAiAnalysisStep('analyzing');
    setAiAnalysisProgress(0);
    setAiAnalysisLogs([]);
    setActiveAnalysisResult(null);

    const addLog = (msg) => {
      setAiAnalysisLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      addLog("Initializing Scene Analysis Engine...");
      addLog(`Target Room Space: ${roomType}`);
      await delay(700);
      setAiAnalysisProgress(15);
      addLog("Detecting spatial geometry: walls, floor boundaries, and ceilings...");
      await delay(800);
      setAiAnalysisProgress(30);
      addLog("Geometry Scan OK: 3D perspective grids aligned.");

      addLog("Analyzing lighting structure and color temperature...");
      await delay(600);
      setAiAnalysisProgress(45);
      addLog("Luminance Analysis: Natural ambient lighting detected from side opening.");
      addLog("Contrast index: High. Heavy shadows registered in corner pockets.");

      addLog("Scanning for existing items and clutter distribution...");
      await delay(900);
      setAiAnalysisProgress(60);

      const detectedItemsMap = {
        'Living Room': '1x Sectional Sofa, 1x Low Coffee Table, 1x Window Frame',
        'Bedroom': '1x Bed Platform, 2x Pillows, 1x Side Nightstand',
        'Kitchen': 'Cabinet arrays, 1x Sink Basin, 1x Marble Countertop',
        'Bathroom': '1x Vanity Sink, 1x Mirror, 1x Shower Enclosure',
        'Dining Room': '1x Table, 4x Dining Chairs, 1x Overhead Pendant',
        'Office Room': '1x Work Desk, 1x Chair, 1x Bookshelf',
        'Kids Room': '1x Single Bed, Toy bins, Play area',
        'Balcony': '2x Patio chairs, plant pots',
        'Pooja Room': '1x Mandir structure, floor mats',
        'Commercial Space': 'Reception desk, lobby seating'
      };

      const itemsText = detectedItemsMap[roomType] || 'Standard room layouts and openings';
      addLog(`Item Detection Result: Found ${itemsText}.`);
      addLog("Space Utilization: Clutter density 28% (low). Suitable for texturing.");

      setAiAnalysisStep('generating');
      addLog("Initializing Deep Generative Model (WGAN-GP)...");
      addLog("Setting latent vector configuration (z_dim=100)...");
      await delay(800);
      setAiAnalysisProgress(80);
      addLog("Synthesizing modern architectural texture coordinates...");
      await delay(800);
      setAiAnalysisProgress(100);
      addLog("Design rendering finished.");
      await delay(400);

            const roomImagePools = {
        'Living Room': [imgLiving1, imgLiving2, imgLiving3],
        'Bedroom': [imgBedroom1, imgBedroom2, imgBedroom3],
        'Kitchen': [imgKitchen1, imgKitchen2, imgKitchen3],
        'Dining Room': [imgDining1, imgDining2, imgDining3],
        'Bathroom': [imgBathroom1, imgBathroom2, imgBathroom3],
        'Office Room': [imgOffice1, imgOffice2, imgOffice3],
        'Kids Room': [imgKids1],
        'Balcony': [imgBalcony1, imgBalcony2, imgBalcony3],
        'Pooja Room': [imgPooja1, imgPooja2, imgPooja3],
        'Commercial Space': [imgCommercial1]
      };

const roomDesigns = {
        'Living Room': {
          generatedImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=60',
          furniture: ['Custom Teak Sofa', 'Minimalist Oak Coffee Table', 'Modern Brass Sconces'],
          materials: ['Teak Wood', 'Linen', 'Brass'],
          colorPalette: ['Teak Warmth', 'Beige Linen', 'Warm Brass Accent'],
          budgetEstimate: 4200
        },
        'Bedroom': {
          generatedImage: 'https://images.unsplash.com/photo-1522771730844-47fb5bd1ca08?w=800&auto=format&fit=crop&q=60',
          furniture: ['Platform Bed', 'Floating Nightstands', 'Minimalist Wardrobe'],
          materials: ['Walnut Wood', 'Matte Black Metal', 'Linen'],
          colorPalette: ['Walnut Brown', 'Charcoal', 'Ivory'],
          budgetEstimate: 6200
        },
        'Kitchen': {
          generatedImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60',
          furniture: ['Island Counter', 'Bar Stools', 'Pendant Lights'],
          materials: ['Marble', 'Oak Wood', 'Stainless Steel'],
          colorPalette: ['White', 'Navy Blue', 'Brass'],
          budgetEstimate: 8500
        },
        'Dining Room': {
          generatedImage: 'https://images.unsplash.com/photo-1617806118233-18e1c0945594?w=800&auto=format&fit=crop&q=60',
          furniture: ['Farmhouse Table', 'Dining Chairs', 'Chandelier'],
          materials: ['Reclaimed Wood', 'Linen', 'Iron'],
          colorPalette: ['Rustic Brown', 'Slate Gray', 'Cream'],
          budgetEstimate: 5100
        },
        'Bathroom': {
          generatedImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=60',
          furniture: ['Floating Vanity', 'Freestanding Tub', 'LED Mirror'],
          materials: ['Ceramic Tiles', 'Matte Black Fixtures', 'Glass'],
          colorPalette: ['White', 'Charcoal', 'Natural Wood'],
          budgetEstimate: 4000
        },
        'Office Room': {
          generatedImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=60',
          furniture: ['Ergonomic Desk', 'Office Chair', 'Bookshelf'],
          materials: ['Oak Wood', 'Metal', 'Leather'],
          colorPalette: ['Walnut', 'Black', 'White'],
          budgetEstimate: 3200
        },
        'Kids Room': {
          generatedImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60',
          furniture: ['Bunk Bed', 'Study Table', 'Toy Storage'],
          materials: ['Pine Wood', 'Cotton', 'Laminate'],
          colorPalette: ['Pastel Blue', 'Yellow', 'White'],
          budgetEstimate: 3800
        },
        'Balcony': {
          generatedImage: 'https://images.unsplash.com/photo-1550983196-8eb591a423ae?w=800&auto=format&fit=crop&q=60',
          furniture: ['Rattan Chairs', 'Small Coffee Table', 'Planters'],
          materials: ['Rattan', 'Teak Wood', 'Ceramic'],
          colorPalette: ['Natural Wood', 'Green', 'White'],
          budgetEstimate: 1500
        },
        'Pooja Room': {
          generatedImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60',
          furniture: ['Carved Mandir', 'Floor Seating', 'Brass Lamps'],
          materials: ['Teak Wood', 'Brass', 'Marble'],
          colorPalette: ['Saffron', 'Warm Wood', 'Gold'],
          budgetEstimate: 2500
        },
        'Commercial Space': {
          generatedImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60',
          furniture: ['Lounge Seating', 'Reception Desk', 'Track Lighting'],
          materials: ['Concrete', 'Glass', 'Steel'],
          colorPalette: ['Industrial Gray', 'Black', 'Accent Color'],
          budgetEstimate: 12000
        }
      };

      const selectedDesign = roomDesigns[roomType] || roomDesigns['Living Room'];
      const pool = roomImagePools[roomType] || roomImagePools['Living Room'];
      const randomGeneratedImage = pool[Math.floor(Math.random() * pool.length)];
      selectedDesign.generatedImage = randomGeneratedImage;

      let mockImg = originalImage;
      if (!mockImg) {
        let availablePool = pool.filter(img => img !== randomGeneratedImage);
        if (availablePool.length === 0) availablePool = pool;
        mockImg = availablePool[Math.floor(Math.random() * availablePool.length)];
      }

      const simulatedAnalyses = {
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
        'Bedroom': {
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
        'Kitchen': {
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
        'Bathroom': {
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
        },
        default: {
          detectedRoomType: roomType,
          detectedItems: ['Wall Outlines', 'Floor Plan', 'Primary Light Source'],
          lightingAnalysis: 'Standard room illumination, uniform shadow distribution.',
          colorProfile: ['Neutral White', 'Oak Wood', 'Beige'],
          spaceUtilization: 'Flexible footprint layout, ready for styling.',
          recommendations: [
            'Optimize furniture alignment to natural light entry.',
            'Utilize contrasting textures for flooring and wall surface.',
            'Introduce custom built-in furniture to maximize utility.'
          ]
        }
      };

      const finalAnalysis = simulatedAnalyses[roomType] || simulatedAnalyses.default;
      setActiveAnalysisResult(finalAnalysis);

      const payload = {
        roomType,
        originalImage: mockImg,
        generatedImage: selectedDesign.generatedImage,
        aiSuggestion: {
          furniture: selectedDesign.furniture,
          materials: selectedDesign.materials,
          colorPalette: selectedDesign.colorPalette,
          budgetEstimate: selectedDesign.budgetEstimate
        },
        analysis: finalAnalysis
      };

      const res = await axios.post('/designs/ai', payload);
      if (res.data.success) {
        setAiDesigns([res.data.data, ...aiDesigns]);
        showToast('AI Design & Image Analysis Generated Successfully!');
        setAiAnalysisStep('completed');
        setTimeout(() => {
          document.getElementById('ai-new-design-result')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error('Failed to generate AI design', err);
      alert('Error generating design. Please try again.');
      setAiAnalysisStep('idle');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAiStatus = async (id, status) => {
    try {
      const res = await axios.put(`/designs/ai/${id}`, { status });
      if (res.data.success) {
        const updatedDesign = res.data.data;
        setAiDesigns(aiDesigns.map(d => d._id === id ? updatedDesign : d));

        if (status === 'regenerated') {
          alert('✨ AI Design regenerated with new style! Check the new design above.');
        } else if (status === 'accepted') {
          const payload = {
            requestType: 'AI Generated',
            roomType: updatedDesign.roomType || 'Living Room',
            style: 'AI Generated (' + (updatedDesign.aiSuggestion?.colorPalette?.[0] || 'Modern') + ')',
            budget: '$' + (updatedDesign.aiSuggestion?.budgetEstimate || 3000),
            size: 'Standard',
            timeline: 'Flexible',
            ownMaterialsAvailable: 'No',
            requirements: 'AI Suggestions: Furniture (' + (updatedDesign.aiSuggestion?.furniture?.join(', ') || 'Standard') + '). Materials (' + (updatedDesign.aiSuggestion?.materials?.join(', ') || 'Standard') + ').',
            referenceImages: [updatedDesign.generatedImage],
            originalImage: updatedDesign.originalImage,
            generatedImage: updatedDesign.generatedImage,
            aiSuggestion: updatedDesign.aiSuggestion
          };
          
          const manualRes = await axios.post('/designs/manual', payload);
          if (manualRes.data.success) {
            setManualDesigns([manualRes.data.data, ...manualDesigns]);
            alert('✅ AI Design accepted! Order request has been forwarded to vendors.');
          } else {
            alert('Failed to forward request to vendors. Please try again.');
          }
        } else if (status === 'rejected') {
          alert('AI Design rejected. You can now submit a manual design request.');
          if (setActiveTab) setActiveTab('manual');
        }
      }
    } catch (err) {
      console.error('Failed to update AI design status', err);
      alert('Failed to update design status.');
    }
  };

  const handleDeleteDesign = async (id) => {
    if (!confirm('Delete this AI design?')) return;
    try {
      const res = await axios.delete(`/designs/ai/${id}`);
      if (res.data.success) {
        setAiDesigns(aiDesigns.filter(d => d._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete AI design', err);
      alert('Failed to delete AI design.');
    }
  };

  const handleToggleBookmark = async (id) => {
    const design = aiDesigns.find(d => d._id === id);
    if (!design) return;
    
    try {
      const res = await axios.put(`/designs/ai/${id}`, { isBookmarked: !design.isBookmarked });
      if (res.data.success) {
        setAiDesigns(aiDesigns.map(d => d._id === id ? res.data.data : d));
      }
    } catch (err) {
      console.error('Failed to bookmark AI design', err);
    }
  };

  const handleDownloadReceipt = (order) => {
    const receiptContent = `========================================
           ARTISAN STUDIO               
========================================
RECEIPT
Transaction ID : #${order._id.toUpperCase()}
Date           : ${new Date(order.createdAt).toLocaleDateString()}
Payment Method : Credit Card **1234
Status         : PAID
----------------------------------------
Order Type     : ${order.orderType || 'Product'}
Total Amount   : $${(order.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
========================================
Thank you for shopping with Artisan Studio!
`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${order._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProceedToExecution = (design) => {
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const newOrder = {
      _id: 'ord_ai_' + Date.now(),
      orderType: 'AI Design',
      orderStatus: 'quotation_pending',
      userId: { _id: user?._id || 'u_local', name: user?.name || 'Customer Demo', email: user?.email || 'user@example.com', phone: user?.phone || '' },
      vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
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
    
    setOrders(updatedOrders);
    localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event('mockOrdersUpdated'));
    
    axios.put(`/designs/ai/${design._id}`, { status: 'execution' })
      .then(res => {
        if(res.data.success) {
          setAiDesigns(aiDesigns.map(d => d._id === design._id ? res.data.data : d));
        }
      })
      .catch(err => console.error('Failed to update design execution status', err));
    
    const localVendorNotifs = JSON.parse(localStorage.getItem('mockVendorNotifications') || '[]');
    localVendorNotifs.unshift({
      _id: `notif_${Date.now()}`,
      message: `New AI Design Execution Request for ${design.roomType}`,
      type: 'order',
      createdAt: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('mockVendorNotifications', JSON.stringify(localVendorNotifs));
    
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

    try {
      const payload = {
        requestType: 'Manual Design',
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
      };

      const res = await axios.post('/designs/manual', payload);
      
      if (res.data.success) {
        setManualDesigns([res.data.data, ...manualDesigns]);

        if (needDesigner === 'Yes') {
          await axios.post('/designs/designer', {
            details: manualRequirements || '',
            budget: Number(String(manualBudget).replace(/[^0-9]/g, '')) || 0,
            roomType, style: manualStyle
          });
        }

        alert('✅ Manual Design Request Submitted Successfully! Vendors have been notified.');
        setManualMaterials(''); setManualRequirements(''); setReferenceImages([]);
        setOwnMaterials('No'); setMaterialDetails(''); setMaterialQuantity(''); setMaterialImages([]); setPickupAddress('');
        setPickupNeeded('No'); setTimeline('Flexible'); setNeedDesigner('No');
        setServiceAddress(''); setVendorPref('Any Vendor'); setQuotationType('Fixed Budget');
      }
    } catch (err) {
      console.error('Failed to submit manual design', err);
      alert('Error submitting request. Please try again.');
    } finally {
      setManualSubmitting(false);
    }
  };

  // Designer Request Actions
  const handleDesignerSubmit = async (e) => {
    e.preventDefault();
    const budgetNum = Number(designerBudget);
    
    try {
      const res = await axios.post('/designs/designer', {
        details: designerDetails,
        budget: budgetNum
      });
      
      if (res.data.success) {
        alert('✅ Interior Designer Request Submitted Successfully! Admin has been notified.');
        setDesignerDetails(''); setDesignerBudget('');
      }
    } catch (err) {
      console.error('Failed to submit designer request', err);
      alert('Error submitting request. Please try again.');
    }
  };

  // Marketplace Order Action
  const handleProductOrder = async (product) => {
    try {
      const payload = {
        orderItems: [{
          product: product._id,
          name: product.title,
          qty: 1,
          price: product.price,
          image: product.images[0]
        }],
        shippingAddress: {
          address: user?.address || '123 Default St',
          city: 'Metropolis',
          postalCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: product.price,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: product.price,
      };
      
      const res = await axios.post('/marketplace-orders', payload);
      
      if (res.data.success) {
        setOrders([res.data.data, ...orders]);
        alert('✅ Order placed successfully!');
        if (setActiveTab) setActiveTab('orders');
      }
    } catch (err) {
      console.error('Failed to submit product order', err);
      alert('Error placing order. Please try again.');
    }
  };

  const handleBudgetApproval = (quotationId) => {
    const req = manualDesigns.find(r => r._id === quotationId) || aiQuotationOrders.find(r => r._id === quotationId);
    if (req) setQuotationPayment(req);
  };

  // Process Quotation Payment via Backend API
  const handleQuotationPayment = async () => {
    if (!quotationPayment) return;
    setQuotationProcessing(true);

    const quotationId = quotationPayment._id;

    const methodMap = {
      'Google Pay': 'UPI',
      'PhonePe': 'UPI',
      'Paytm': 'UPI',
      'UPI': 'UPI',
      'Card': 'Credit Card',
      'NetBanking': 'Net Banking'
    };
    const paymentMethod = methodMap[quotationPaymentMethod] || 'UPI';

    try {
      const res = await axios.post('/orders/accept-and-pay', {
        quotationId,
        paymentMethod,
        shippingAddress: user?.address || 'Address on file'
      });

      if (res.data && res.data.success) {
        const { order, payment, tracking } = res.data.data;

        setOrders(prev => [{ ...order, tracking }, ...prev]);

        const requestObj = manualDesigns.find(r => r._id === quotationId) || aiQuotationOrders.find(r => r._id === quotationId);
        if (requestObj) {
          setManualDesigns(manualDesigns.map(r => r._id === quotationId ? { ...r, status: 'Approved' } : r));
        }

        showToast('Payment successful! Order has been created.');
        setQuotationPayment(null);
        if (setActiveTab) setActiveTab('orders');
      }
    } catch (err) {
      console.error('Payment failed:', err);
      showToast(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setQuotationProcessing(false);
    }
  };

  const handleBudgetRejection = async (quotationId) => {
    const requestObj = manualDesigns.find(r => r._id === quotationId) || aiQuotationOrders.find(r => r._id === quotationId);
    
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
    const localOrders = [];
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
    const localOrders = [];
    const updated = localOrders.map(o =>
      o._id === orderId
        ? { ...o, orderStatus: 'Accepted', paymentStatus: 'paid' }
        : o
    );
    
    setOrders(updated);

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
    const localTxns = [];
    

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
    const localOrders = [];
    const updated = localOrders.map(o =>
      o._id === orderId ? { ...o, orderStatus: 'Quotation Rejected' } : o
    );
    
    setOrders(updated);

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
    const localTickets = [];
    
    alert('Ticket Submitted Successfully!');
    setTicketSubject('');
    setTicketMessage('');
  };

  // Review Action
  const handlePublishReview = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        vendorId: '65c2b18a7c6b4b1c92949765', // Dummy vendor for general review
        rating: reviewRating,
        comment: reviewComment
      };

      const res = await axios.post('/orders/review', payload);
      
      if (res.data && res.data.success) {
        const createdReviewBackend = res.data.data;
        setUserReviews(prev => [createdReviewBackend, ...prev]);

        alert('✅ Review published successfully!');
        setReviewComment('');
      }
    } catch (err) {
      console.warn("Backend API publish review failed:", err);
      alert('Failed to publish review. Please ensure you are logged in with a real account.');
    }

    setReviewRating(5);
    setReviewTargetId('');
    setReviewProductId('');
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
        <div className="space-y-8">
          <style>{`
            @keyframes scan {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Phase 1: SCANNING OR GENERATING PROGRESS */}
          {(aiAnalysisStep === 'analyzing' || aiAnalysisStep === 'generating') && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <Wand2 className="w-6 h-6 text-[#8B5E3C] animate-spin" />
                  <div>
                    <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Artisan AI Room Vision</h2>
                    <p className="text-xs text-gray-400">Step {aiAnalysisStep === 'analyzing' ? '1: Image Scanning & Spatial Recognition' : '2: WGAN Texture Synthesis'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-[#8B5E3C]">{aiAnalysisProgress}%</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Progress</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#8B5E3C] h-2 rounded-full transition-all duration-500" style={{ width: `${aiAnalysisProgress}%` }}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Panel: Scanning View */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-inner border border-gray-100 aspect-video bg-gray-900 flex items-center justify-center">
                    <img 
                      src={originalImage || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60'} 
                      alt="Room scanning" 
                      className="w-full h-full object-cover opacity-70"
                    />
                    {/* Neon Scanline */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'linear-gradient(to right, transparent, #2A9D8F, #8B5E3C, #2A9D8F, transparent)',
                      boxShadow: '0 0 8px #2A9D8F, 0 0 16px #8B5E3C',
                      animation: 'scan 3s linear infinite',
                    }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                    <span className="absolute bottom-4 left-4 bg-red-600 text-white font-bold text-[10px] uppercase px-2.5 py-1.5 tracking-widest animate-pulse flex items-center gap-1.5 rounded-full shadow-md z-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Live Vision Scan
                    </span>
                  </div>

                  {/* Console log box */}
                  <div className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-xl h-44 overflow-y-auto border border-gray-800 shadow-inner flex flex-col justify-end">
                    <div className="overflow-y-auto space-y-1">
                      {aiAnalysisLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                          {log}
                        </div>
                      ))}
                      <div className="animate-pulse w-2 h-4 bg-emerald-400 inline-block align-middle ml-1"></div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Analysis Metadata */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Room Analysis Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${aiAnalysisProgress >= 15 ? 'bg-[#F8F5F0] border-[#D4A373]/30 scale-100 opacity-100' : 'bg-gray-50 border-gray-100 scale-95 opacity-50'}`}>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Detected Room Type</p>
                      <p className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937] mt-1">
                        {aiAnalysisProgress >= 15 ? roomType : 'Analyzing...'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${aiAnalysisProgress >= 15 ? 'bg-[#F8F5F0] border-[#D4A373]/30 scale-100 opacity-100' : 'bg-gray-50 border-gray-100 scale-95 opacity-50'}`}>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Size</p>
                      <p className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937] mt-1">
                        {aiAnalysisProgress >= 15 ? (roomType === 'Living Room' ? '180 sq ft' : roomType === 'Bedroom' ? '150 sq ft' : roomType === 'Kitchen' ? '120 sq ft' : 'Standard footprint') : 'Analyzing...'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${aiAnalysisProgress >= 45 ? 'bg-[#F8F5F0] border-[#D4A373]/30 scale-100 opacity-100' : 'bg-gray-50 border-gray-100 scale-95 opacity-50'}`}>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lighting Profile</p>
                      <p className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937] mt-1 truncate">
                        {aiAnalysisProgress >= 45 ? 'Ambient Natural' : 'Analyzing...'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${aiAnalysisProgress >= 60 ? 'bg-[#F8F5F0] border-[#D4A373]/30 scale-100 opacity-100' : 'bg-gray-50 border-gray-100 scale-95 opacity-50'}`}>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Detected Furniture</p>
                      <p className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937] mt-1 truncate">
                        {aiAnalysisProgress >= 60 ? (roomType === 'Living Room' ? 'Sofa, Table, Lamp' : roomType === 'Bedroom' ? 'Bed, Nightstand' : roomType === 'Kitchen' ? 'Cabinet, Counter' : 'Objects') : 'Scanning...'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-all duration-300 ${aiAnalysisProgress >= 60 ? 'bg-[#F8F5F0] border-[#D4A373]/30 scale-100 opacity-100' : 'bg-gray-50 border-gray-100 scale-95 opacity-50'}`}>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Space Utilization</p>
                    <p className="text-sm font-medium text-gray-700">
                      {aiAnalysisProgress >= 60 ? 'Low clutter level (28%). Balanced spatial flow suitable for new textures and architectural furniture updates.' : 'Awaiting visual diagnostic report...'}
                    </p>
                  </div>

                  {aiAnalysisStep === 'generating' && (
                    <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><Wand2 size={20}/></div>
                      <div>
                        <p className="text-xs font-bold text-purple-800">Synthesizing design via WGAN-GP...</p>
                        <p className="text-[10px] text-purple-600">Mapping modern apartment textures (nz=100 latent vector)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: GENERATION COMPLETED SHOWCASE */}
          {aiAnalysisStep === 'completed' && aiDesigns.length > 0 && (() => {
            const latestDesign = aiDesigns[0];
            return (
              <div id="ai-new-design-result" className="space-y-8 animate-fadeIn">
                <button 
                  onClick={() => {
                    setAiAnalysisStep('idle');
                    setOriginalImage('');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Start a New AI Design</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Image Viewer with Before/After Toggle */}
                  <div className="lg:col-span-6 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Before & After Comparison</h3>
                    <div className="relative rounded-2xl overflow-hidden shadow-inner border border-gray-100 aspect-[4/3] bg-gray-900 flex items-center justify-center">
                      <img 
                        src={showOriginalImage ? latestDesign.originalImage : latestDesign.generatedImage} 
                        alt={showOriginalImage ? "Original Room" : "AI Design Output"} 
                        className="w-full h-full object-cover transition-all duration-300"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      />
                      <span className="absolute top-4 left-4 bg-black/55 text-white text-xs px-3 py-1.5 rounded-full uppercase font-bold tracking-wider z-10 backdrop-blur-sm shadow-sm">
                        {showOriginalImage ? "Original View" : "AI Style Generated"}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowOriginalImage(true)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${showOriginalImage ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                      >
                        Show Original
                      </button>
                      <button 
                        onClick={() => setShowOriginalImage(false)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${!showOriginalImage ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                      >
                        Show AI Design
                      </button>
                    </div>
                  </div>

                  {/* Right Column: AI Room Analysis Blueprint & Recommendations */}
                  <div className="lg:col-span-6 space-y-8">
                    {/* Blueprint Card */}
                    {latestDesign.analysis && (
                      <div className="bg-[#F8F5F0] p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#D4A373]/20 pb-4">
                          <Eye className="w-5 h-5 text-[#8B5E3C]" />
                          <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Artisan AI Room Analysis Report</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400 block font-medium uppercase tracking-wider text-[10px]">Room Type DNA</span>
                            <span className="font-bold text-[#1F2937] text-sm">{latestDesign.analysis.detectedRoomType}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium uppercase tracking-wider text-[10px]">Estimated Footprint</span>
                            <span className="font-bold text-[#1F2937] text-sm">{roomType === 'Living Room' ? '180 sq ft' : roomType === 'Bedroom' ? '150 sq ft' : roomType === 'Kitchen' ? '120 sq ft' : 'Standard'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium uppercase tracking-wider text-[10px]">Lighting Grid</span>
                            <span className="font-bold text-[#1F2937] text-sm">{latestDesign.analysis.lightingAnalysis}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium uppercase tracking-wider text-[10px]">Space Flow Index</span>
                            <span className="font-bold text-[#1F2937] text-sm">{latestDesign.analysis.spaceUtilization}</span>
                          </div>
                        </div>

                        <div className="border-t border-[#D4A373]/20 pt-4">
                          <span className="text-gray-400 block font-medium uppercase tracking-wider text-[10px] mb-2">Dominant Colors Found</span>
                          <div className="flex gap-2">
                            {latestDesign.analysis.colorProfile?.map((color, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700">{color}</span>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-[#D4A373]/20 pt-4">
                          <span className="text-gray-400 block font-medium uppercase tracking-wider text-[10px] mb-2">Styling Directives (WGAN-GP)</span>
                          <ul className="text-xs text-gray-700 space-y-2 list-disc list-inside leading-relaxed">
                            {latestDesign.analysis.recommendations?.map((rec, i) => (
                              <li key={i}><span className="font-medium">{rec}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Suggestions Box */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                      <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Artisan Styling Recommendations</h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-xs text-[#6B7280]">
                          <div><strong className="text-[#1F2937] block mb-1">Recommended Furniture:</strong> {latestDesign.aiSuggestion?.furniture?.join(', ')}</div>
                          <div><strong className="text-[#1F2937] block mb-1">Proposed Materials:</strong> {latestDesign.aiSuggestion?.materials?.join(', ')}</div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Project Budget</span>
                            <p className="font-['Playfair_Display'] font-extrabold text-2xl text-[#8B5E3C] mt-1">${latestDesign.aiSuggestion?.budgetEstimate || '4,500'}</p>
                          </div>

                          <div className="flex gap-2">
                            {latestDesign.status !== 'accepted' && latestDesign.status !== 'execution' && (
                              <>
                                <button onClick={() => handleAiStatus(latestDesign._id, 'accepted')} className="p-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl shadow-sm flex items-center gap-1.5 font-bold text-xs" title="Accept & Order"><CheckCircle className="w-4 h-4" /> Accept Design</button>
                                <button onClick={() => handleAiStatus(latestDesign._id, 'regenerated')} className="p-3 bg-[#E9C46A] hover:bg-[#E9C46A]/90 text-[#1F2937] rounded-xl shadow-sm font-bold text-xs" title="Regenerate"><RefreshCw className="w-4 h-4" /></button>
                                <button onClick={() => handleAiStatus(latestDesign._id, 'rejected')} className="p-3 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl shadow-sm font-bold text-xs" title="Reject"><XCircle className="w-4 h-4" /></button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Phase 3: DEFAULT EDIT / IDLE STATE (Upload Box & History List Side by Side) */}
          {aiAnalysisStep === 'idle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Upload Box */}
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start animate-fadeIn">
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
                    <p className="text-xs text-[#6B7280] mt-2">Leave empty to use demo {roomType.toLowerCase()} photo</p>
                  </div>
                  <button type="submit" disabled={loadingAi} className="w-full flex items-center justify-center gap-2 py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                    <Wand2 className="w-5 h-5" />
                    <span>{loadingAi ? 'Analyzing & Styling...' : 'Generate AI Interior'}</span>
                  </button>
                </form>
              </div>

              {/* Generated Designs List */}
              <div id="ai-history-section" className="lg:col-span-7 space-y-6">
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
                        {design.originalImage && (
                          <div className="flex-1 w-full sm:w-auto relative group overflow-hidden rounded-2xl">
                            <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider z-10 backdrop-blur-sm">Original</span>
                            <img src={design.originalImage} alt="Original" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} className="w-full sm:w-48 h-36 sm:h-48 object-cover rounded-2xl shadow-inner border-2 border-dashed border-gray-200" />
                          </div>
                        )}
                        <div className="flex-1 w-full sm:w-auto relative group overflow-hidden rounded-2xl">
                          <span className="absolute top-2 left-2 bg-[#8B5E3C]/80 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider z-10 backdrop-blur-sm">Generated</span>
                          <img src={design.generatedImage} alt="AI Design" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} className="w-full sm:w-64 h-48 object-cover rounded-2xl shadow-inner border-2 border-transparent group-hover:border-[#8B5E3C] transition-all" />
                        </div>
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
                              {design.analysis && (
                                <button 
                                  onClick={() => setExpandedAnalysisId(expandedAnalysisId === design._id ? null : design._id)}
                                  className={`p-2 rounded-xl shadow-sm transition-all flex items-center gap-1 ${expandedAnalysisId === design._id ? 'bg-[#8B5E3C] text-white' : 'bg-gray-50 text-[#8B5E3C] hover:bg-gray-100'}`}
                                  title="View Image Analysis Report"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              {design.status !== 'accepted' && design.status !== 'execution' && (
                                <>
                                  <button onClick={() => handleAiStatus(design._id, 'accepted')} className="p-2 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl shadow-sm" title="Accept & Order"><CheckCircle className="w-4 h-4" /></button>
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

                      {/* Expandable Blueprint Analysis Report */}
                      {expandedAnalysisId === design._id && design.analysis && (
                        <div className="mt-4 p-6 bg-[#F8F5F0] rounded-2xl border border-[#D4A373]/30 grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideDown">
                          <div className="space-y-4">
                            <h4 className="font-['Playfair_Display'] font-bold text-base text-[#1F2937] border-b border-[#D4A373]/20 pb-2">🔍 AI Vision Diagnostics</h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-400 block font-medium uppercase tracking-wider text-[9px]">Room Type DNA</span>
                                <span className="font-bold text-[#1F2937]">{design.analysis.detectedRoomType || design.roomType}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block font-medium uppercase tracking-wider text-[9px]">Lighting Profile</span>
                                <span className="font-bold text-[#1F2937]">{design.analysis.lightingAnalysis || 'Ambient Natural'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block font-medium uppercase tracking-wider text-[9px]">Space Flow Index</span>
                                <span className="font-bold text-[#1F2937]">{design.analysis.spaceUtilization || 'Optimized'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block font-medium uppercase tracking-wider text-[9px]">Furniture Detected</span>
                                <span className="font-bold text-[#1F2937] truncate block">{design.analysis.detectedItems?.join(', ') || 'Sofa, Table'}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block font-medium uppercase tracking-wider text-[9px] mb-1.5">Dominant Colors Found</span>
                              <div className="flex gap-2">
                                {design.analysis.colorProfile?.map((c, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600">{c}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-['Playfair_Display'] font-bold text-base text-[#1F2937] border-b border-[#D4A373]/20 pb-2">💡 Styling Recommendations</h4>
                            <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside leading-relaxed">
                              {design.analysis.recommendations?.map((rec, i) => (
                                <li key={i}><span className="font-medium text-[#1F2937]">{rec}</span></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANUAL DESIGN */}
      {(activeTab === 'manual') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Hammer className="w-6 h-6 text-[#8B5E3C]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">
                Manual Design Request
              </h2>
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
          const prod = item.productId?._id ? item.productId : products.find(p => p._id === item.productId);
          if (!prod) return null;
          return { ...prod, quantity: item.quantity };
        }).filter(Boolean);

        const subtotal = resolvedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shipping = subtotal > 0 ? 50 : 0;
        const tax = Math.round(subtotal * 0.08);
        const total = subtotal + shipping + tax;

        const updateCartQuantity = async (productId, delta) => {
          const item = cartItems.find(i => (i.productId?._id || i.productId) === productId);
          if (!item) return;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return removeFromCart(productId);
          try {
            const res = await axios.put(`/cart/${productId}`, { quantity: newQty });
            if (res.data?.success) {
              setCartItems(res.data.data.items.filter(i => i.productId));
            }
          } catch (err) {
            console.warn('Failed to update cart quantity on backend:', err);
            showToast('Failed to update quantity.', 'error');
          }
          window.dispatchEvent(new Event('cartUpdated'));
        };

        const removeFromCart = async (productId) => {
          try {
            const res = await axios.delete(`/cart/${productId}`);
            if (res.data?.success) {
              setCartItems(res.data.data.items.filter(i => i.productId));
            } else {
              setCartItems(prev => prev.filter(i => (i.productId?._id || i.productId) !== productId));
            }
          } catch (err) {
            console.warn('Failed to remove item from cart on backend:', err);
            setCartItems(prev => prev.filter(i => (i.productId?._id || i.productId) !== productId));
          }
          window.dispatchEvent(new Event('cartUpdated'));
        };

        const handleCheckout = () => {
          if (resolvedItems.length === 0) {
            showToast('Your cart is empty!', 'warning');
            return;
          }
          setShowCheckoutSummary(true);
        };

        const handleConfirmPayment = async () => {
          const items = resolvedItems.map(item => ({
            productId: item._id,
            vendorId: item.vendorId?._id || item.vendorId,
            quantity: item.quantity,
            price: item.price
          }));
          const totalAmount = resolvedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

          try {
            const res = await axios.post('/marketplace-orders', {
              items,
              subtotal: totalAmount,
              tax: Math.round(totalAmount * 0.08),
              shippingFee: 50,
              totalAmount: totalAmount + Math.round(totalAmount * 0.08) + 50,
              shippingAddress: user?.address || 'Your Address'
            });

            if (res.data?.success) {
              // Clear local cart
              setCartItems([]);
              window.dispatchEvent(new Event('cartUpdated'));
              setShowCheckoutSummary(false);
              // Save the newly created order ID to track it immediately!
              const newOrderId = res.data.data?._id;
              if (newOrderId) {
                localStorage.setItem('activeTrackingOrderId', newOrderId);
                setTrackingOrderId(newOrderId);
              }
              // Refresh orders and payments from backend
              await fetchUserData();
              await loadPayments();
              showToast('✅ Order placed successfully! Thank you for your purchase.', 'success');
              if (setActiveTab) setActiveTab('tracking');
            } else {
              showToast(res.data?.message || 'Failed to place order.', 'error');
            }
          } catch (err) {
            console.error('Failed to create order', err);
            showToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
          }
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

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-[#D4A373]/30 space-y-4 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-[#D4A373] mx-auto" />
              <p className="text-[#6B7280] font-medium">No orders yet.</p>
              <button onClick={() => setActiveTab && setActiveTab('cart')} className="px-5 py-2.5 bg-[#8B5E3C] text-white font-bold rounded-xl text-sm hover:bg-[#8B5E3C]/90 transition-all">Start Shopping</button>
            </div>
          ) : (
            <>
              {/* Marketplace Orders */}
              {(() => {
                const mktOrders = filteredOrders.filter(o => o.orderType === 'Marketplace Product');
                return mktOrders.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#8B5E3C]" /> Marketplace Product Orders
                    </h3>
                    {mktOrders.map((order) => {
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
                      const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'Paid';
                      return (
                        <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-all">
                          <div className="shrink-0">
                            <img
                              src={order.productDetails?.images?.[0] || (order.items?.[0]?.productId?.images?.[0]) || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=60'}
                              alt={order.productDetails?.title || order.items?.[0]?.productId?.title || 'Product'}
                              className="w-24 h-24 object-cover rounded-2xl shadow-sm bg-gray-100"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Marketplace Product</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge}`}>{order.orderStatus || 'Pending Confirmation'}</span>
                            </div>
                            <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] truncate">{order.productDetails?.title || order.items?.[0]?.productId?.title || `Order #${order._id?.slice(-6)}`}</h3>
                            <p className="text-xs text-[#6B7280] mt-0.5">Vendor: {order.vendorId?.companyName || order.items?.[0]?.vendorId?.companyName || 'Artisan Partner'} • Qty: {order.items?.reduce((s, i) => s + i.quantity, 0) || order.productDetails?.quantity || 1}</p>
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
                              <button onClick={() => { if(setActiveTab) setActiveTab('tracking'); }} className="bg-gray-100 hover:bg-gray-200 text-[#1F2937] px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                                <Truck className="w-4 h-4" /> Track Order
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null;
              })()}

              {/* Custom Design Orders */}
              {(() => {
                const designOrders = filteredOrders.filter(o => o.orderType !== 'Marketplace Product');
                return designOrders.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                      <Hammer className="w-4 h-4 text-[#2A9D8F]" /> Custom Design Orders
                    </h3>
                    {designOrders.map((order) => {
                const tracking = order.tracking;
                const stages = tracking?.stages || [];
                return (
                <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{order.orderType?.replace('_', ' ') || 'CUSTOM'}</span>
                      <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-2">Order #{order._id?.slice(-6) || '10293'}</h3>
                      <p className="text-xs text-[#6B7280] mt-1">Vendor: {order.vendorId?.companyName || 'Artisan Partner'} • Status: <span className="font-bold text-[#2A9D8F]">{order.orderStatus || 'In Progress'}</span></p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-['Playfair_Display'] font-extrabold text-3xl text-[#8B5E3C]">${order.totalAmount || '0'}</span>
                        <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider mt-1">Payment: <span className={order.paymentStatus === 'paid' ? 'text-[#2A9D8F]' : 'text-amber-600'}>{order.paymentStatus || 'pending'}</span></p>
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
                  {tracking && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-[#F8F5F0] p-3 rounded-xl border border-[#D4A373]/20">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Payment Method</span>
                          <p className="font-bold text-gray-700 mt-0.5">{tracking.paymentMethod}</p>
                        </div>
                        <div className="bg-[#F8F5F0] p-3 rounded-xl border border-[#D4A373]/20">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Transaction ID</span>
                          <p className="font-bold text-gray-700 mt-0.5 text-[11px]">{tracking.transactionId}</p>
                        </div>
                        <div className="bg-[#F8F5F0] p-3 rounded-xl border border-[#D4A373]/20">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Payment Date</span>
                          <p className="font-bold text-gray-700 mt-0.5">{new Date(tracking.paymentDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-[#F8F5F0] p-3 rounded-xl border border-[#D4A373]/20">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Status</span>
                          <p className="font-bold text-emerald-600 mt-0.5">{tracking.paymentStatus}</p>
                        </div>
                      </div>
                      {stages.length > 0 && (
                        <div className="mt-4">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Order Timeline</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {stages.map((stage, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-lg text-[11px] font-bold">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  {stage.status}
                                </div>
                                {i < stages.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          ) : null;
        })()}
            </>
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
                if (pm === 'upi') {
                  const upiId = aiQuotationPayment.quotationUPI || 'artisanworkshop@upi';
                  const qrUrl = aiQuotationPayment.quotationQR || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiId)}`;
                  return (
                    <div className="bg-[#F0FDF4] border border-emerald-200 rounded-2xl p-5 text-center space-y-4 animate-fadeIn">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Smartphone className="w-3.5 h-3.5" /> UPI Payment
                      </div>
                      <div className="flex justify-center">
                        <img src={qrUrl} alt="Scan to Pay QR Code" className="w-48 h-48 object-contain rounded-2xl border-2 border-emerald-200 bg-white p-2 shadow-sm" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AI+Interior+Demo+Payment" alt="Demo QR Code" className="w-48 h-48 object-contain rounded-2xl border-2 border-emerald-200 bg-white p-2 shadow-sm hidden" />
                      </div>
                      <div className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
                        <div className="text-left">
                          <p className="text-[10px] text-gray-500 font-bold uppercase">UPI ID</p>
                          <p className="font-bold text-gray-800 text-sm">{upiId}</p>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(upiId); showToast('UPI ID copied!'); }} className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[11px] font-bold transition-all">Copy</button>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Scan the QR code or enter the UPI ID to pay <strong>${aiQuotationPayment.quotationAmount}</strong>. Then click confirm below.</p>
                      <button onClick={handleConfirmAiQuotationPayment} disabled={aiQuotationProcessing} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        {aiQuotationProcessing ? <>Processing...</> : <><Smartphone className="w-5 h-5" /> I've Paid — Confirm Payment</>}
                      </button>
                    </div>
                  );
                }
                if (pm === 'bank') {
                  const bankHolder = aiQuotationPayment.quotationBankHolder || 'Artisan Workshop';
                  const bankAcc = aiQuotationPayment.quotationBankAccount || '09876543212345';
                  const bankIfsc = aiQuotationPayment.quotationBankIFSC || 'HDFC0001234';
                  const bankName = aiQuotationPayment.quotationBankName || 'HDFC Bank';
                  return (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-4 animate-fadeIn">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider mx-auto">
                        <Building2 className="w-3.5 h-3.5" /> Bank Transfer
                      </div>
                      <div className="bg-white rounded-xl p-4 space-y-3 border border-blue-100">
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Account Holder</span><span className="font-bold text-gray-800">{bankHolder}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Account Number</span><span className="font-bold text-gray-800">{bankAcc}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">IFSC Code</span><span className="font-bold text-gray-800">{bankIfsc}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Bank Name</span><span className="font-bold text-gray-800">{bankName}</span></div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Transfer <strong>${aiQuotationPayment.quotationAmount}</strong> to the account above, then click confirm.</p>
                      <button onClick={handleConfirmAiQuotationPayment} disabled={aiQuotationProcessing} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        {aiQuotationProcessing ? <>Processing...</> : <><Check className="w-5 h-5" /> I've Paid — Confirm Payment</>}
                      </button>
                    </div>
                  );
                }
                if (pm === 'card') {
                  const gateway = aiQuotationPayment.quotationPaymentGateway || 'Stripe';
                  return (
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
                      <CreditCard className="w-12 h-12 text-purple-500 mx-auto" />
                      <p className="font-bold text-[#1F2937] text-sm">Pay via {gateway}</p>
                      <p className="text-xs text-gray-500">You will be redirected to {gateway} to complete payment of <strong>${aiQuotationPayment.quotationAmount}</strong>.</p>
                      <button onClick={handleConfirmAiQuotationPayment} disabled={aiQuotationProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        {aiQuotationProcessing ? <>Processing...</> : <><CreditCard className="w-5 h-5" /> Pay ${aiQuotationPayment.quotationAmount}</>}
                      </button>
                    </div>
                  );
                }
                if (pm === 'cash') {
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
        const trackingId = trackingOrderId || localStorage.getItem('activeTrackingOrderId');
        const trackableOrders = orders.filter(o => o.paymentStatus === 'paid' || o.orderType === 'Marketplace Product');
        const activeOrder = orders.find(o => o._id === trackingId) || trackableOrders[0];
        const activeTracking = trackingData[activeOrder?._id] || {};
        const orderTracking = activeTracking.tracking || {};
        const trackingStages = orderTracking.stages || activeTracking.stages || [];

        if (!activeOrder) {
          return (
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center space-y-4">
              <Truck className="w-16 h-16 text-gray-300 mx-auto" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">No Active Deliveries</h2>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">You haven't ordered any marketplace products or custom designs yet, or don't have any active shipments.</p>
              <button onClick={() => { if(setActiveTab) setActiveTab('marketplace'); }} className="px-6 py-3 bg-[#8B5E3C] text-white rounded-xl font-bold text-xs shadow-md">Browse Marketplace</button>
            </div>
          );
        }

        const status = activeOrder.orderStatus || 'Pending';
        const expectedDate = orderTracking.expectedDeliveryDate ? new Date(orderTracking.expectedDeliveryDate).toLocaleDateString() : (activeOrder.expectedDeliveryDate ? new Date(activeOrder.expectedDeliveryDate).toLocaleDateString() : '7 Days from purchase');
        const progressImages = orderTracking.progressImages || activeTracking.progressImages || activeOrder.progressImages || [];
        const delDetails = orderTracking.deliveryDetails || {};
        const installDetails = orderTracking.installationDetails || {};
        
        // Dynamic status descriptions
        const getStatusMessage = () => {
          switch (status) {
            case 'Pending Confirmation':
              return { title: 'Pending Confirmation', desc: 'Your order is pending confirmation from the vendor.' };
            case 'Order Confirmed':
              return { title: 'Order Confirmed', desc: 'Your order has been confirmed and accepted by the vendor.' };
            case 'Processing':
              return { title: 'Processing', desc: 'Your order is being processed by the vendor.' };
            case 'Pending Dispatch':
              return { title: 'Pending Dispatch', desc: 'Your order is packed and awaiting courier pickup.' };
            case 'Dispatched':
              return { title: 'Dispatched', desc: 'Your order has been handed over to the courier partner.' };
            case 'Shipped':
              return { title: 'Shipped', desc: 'Your order has been shipped and is on its way.' };
            case 'Out for Delivery':
            case 'Out For Delivery':
              return { title: 'Out for Delivery', desc: 'Your order is out for delivery and will arrive soon.' };
            case 'Delivered':
              return { title: 'Delivered', desc: 'Your order has been successfully delivered. Installation can be scheduled.' };
            case 'Completed':
              return { title: 'Completed', desc: 'Your order is fully completed.' };
            case 'Installation Scheduled':
              return { title: 'Installation Scheduled', desc: 'An installation technician is scheduled to set up your design.' };
            case 'Installation In Progress':
              return { title: 'Installation In Progress', desc: 'Installation work is currently in progress.' };
            case 'Installation Completed':
              return { title: 'Installation Completed', desc: 'The order lifecycle is completed. We hope you enjoy your purchase!' };
            case 'Cancelled':
              return { title: 'Cancelled', desc: 'This order was cancelled.' };
            default:
              return { title: status, desc: 'Current order status is updated.' };
          }
        };

        const currentMsg = getStatusMessage();

        // Compute stages based on orderType
        let allStages = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'];
        if (activeOrder.orderType === 'Marketplace Product') {
          allStages = ['Pending Confirmation', 'Processing', 'Pending Dispatch', 'Dispatched', 'Out For Delivery', 'Delivered', 'Completed'];
        }

        const stagesList = trackingStages.length > 0
          ? allStages.map((s, i) => ({
              key: s,
              label: s,
              isDone: trackingStages.some(st => st.status === s) || allStages.indexOf(status) >= i,
              timestamp: trackingStages.find(st => st.status === s)?.timestamp || null
            }))
          : allStages.map(s => ({
              key: s,
              label: s,
              isDone: allStages.indexOf(s) <= allStages.indexOf(status),
              timestamp: null
            }));

        const handleReturnRequest = (e) => {
          e.preventDefault();
          const reason = e.target.reason.value;
          if (!reason.trim()) {
            alert('Please provide a return reason.');
            return;
          }
          
          const localOrders = [];
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
            
          };
          triggerNotif('vendor', `Customer requested a return for order #${activeOrder._id.slice(-6)}`);
          triggerNotif('admin', `Return request filed for order #${activeOrder._id.slice(-6)}`);
          
          alert('✅ Return request submitted successfully to the vendor.');
        };

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Switch Dropdown */}
            {trackableOrders.length > 1 && (
              <div className="bg-white p-4 rounded-2xl border border-[#D4A373]/30 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Track a different order:</span>
                <select 
                  value={activeOrder._id}
                  onChange={(e) => {
                    localStorage.setItem('activeTrackingOrderId', e.target.value);
                    setTrackingOrderId(e.target.value);
                  }}
                  className="text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none"
                >
                  {trackableOrders.map(o => (
                    <option key={o._id} value={o._id}>{o.productDetails?.title || (o.orderType === 'AI Design' ? `AI Design - ${o.aiDesignData?.roomType || 'Custom'}` : 'Custom Furniture Request')} (#{o._id.slice(-6)})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Live Order Tracking</h2>
                  <p className="text-xs text-gray-400 mt-1">Order #<strong>{activeOrder._id?.slice(-6)}</strong> • Product: <strong>{activeOrder.productDetails?.title || (activeOrder.orderType === 'AI Design' ? `AI Design - ${activeOrder.aiDesignData?.roomType || 'Custom'}` : 'Custom Furniture Request')}</strong> • Vendor: <strong>{activeOrder.vendorId?.companyName || activeTracking.tracking?.vendorName || 'N/A'}</strong></p>
                  <p className="text-xs text-gray-400 mt-0.5">Delivery Status: <strong className={status === 'Delivered' ? 'text-green-600' : 'text-[#E76F51]'}>{status}</strong> • Installation Status: <strong className={installDetails.installationStatus === 'Completed' ? 'text-green-600' : installDetails.installationStatus ? 'text-[#E76F51]' : 'text-gray-400'}>{installDetails.installationStatus || 'Not Scheduled'}</strong></p>
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
                <div className="grid grid-cols-1 md:grid-cols-8 gap-6 relative z-10">
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
                          {stage.timestamp ? (
                            <p className="text-[10px] text-gray-400 font-medium">
                              {new Date(stage.timestamp).toLocaleDateString() + ' ' + new Date(stage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-400 font-medium">
                              {isCurrent ? 'Current Stage' : (isPassed ? 'Completed' : 'Pending')}
                            </p>
                          )}
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

              {/* Progress Images */}
              {progressImages.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-[#D4A373]/30 mt-6 space-y-4">
                  <h4 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider">Manufacturing Progress Photos</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {progressImages.map((imgUrl, i) => (
                      <div key={i} className="flex-shrink-0 relative group">
                        <img src={imgUrl} alt={`Progress step ${i+1}`} className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Step {i+1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Details */}
              {delDetails.partner && (
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200 space-y-3">
                  <h4 className="font-bold text-sm text-blue-800 uppercase tracking-wider">Delivery Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Partner:</span><p className="font-bold text-[#1F2937]">{delDetails.partner}</p></div>
                    {delDetails.contact && <div><span className="text-gray-500">Contact:</span><p className="font-bold text-[#1F2937]">{delDetails.contact}</p></div>}
                    {delDetails.trackingId && <div><span className="text-gray-500">Tracking ID:</span><p className="font-bold text-[#1F2937]">{delDetails.trackingId}</p></div>}
                    {delDetails.notes && <div className="col-span-2"><span className="text-gray-500">Notes:</span><p className="text-[#1F2937]">{delDetails.notes}</p></div>}
                  </div>
                </div>
              )}

              {/* Installation Details */}
              {(installDetails.partner || installDetails.technicianName) && (
                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-200 space-y-3">
                  <h4 className="font-bold text-sm text-purple-800 uppercase tracking-wider">Installation Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {installDetails.technicianName && <div><span className="text-gray-500">Technician:</span><p className="font-bold text-[#1F2937]">{installDetails.technicianName}</p></div>}
                    {installDetails.technicianContact && <div><span className="text-gray-500">Contact:</span><p className="font-bold text-[#1F2937]">{installDetails.technicianContact}</p></div>}
                    {installDetails.partner && <div><span className="text-gray-500">Partner:</span><p className="font-bold text-[#1F2937]">{installDetails.partner}</p></div>}
                    {installDetails.scheduledDate && <div><span className="text-gray-500">Scheduled:</span><p className="font-bold text-[#1F2937]">{new Date(installDetails.scheduledDate).toLocaleDateString()}</p></div>}
                    {installDetails.installationDate && <div><span className="text-gray-500">Installation Date:</span><p className="font-bold text-[#1F2937]">{new Date(installDetails.installationDate).toLocaleDateString()}</p></div>}
                    {installDetails.installationTime && <div><span className="text-gray-500">Time:</span><p className="font-bold text-[#1F2937]">{installDetails.installationTime}</p></div>}
                    {installDetails.installationAddress && <div className="col-span-2"><span className="text-gray-500">Address:</span><p className="font-bold text-[#1F2937]">{installDetails.installationAddress}</p></div>}
                    {installDetails.installationStatus && <div><span className="text-gray-500">Status:</span><p className="font-bold text-purple-700">{installDetails.installationStatus}</p></div>}
                    {installDetails.expectedCompletionDate && <div><span className="text-gray-500">Expected Completion:</span><p className="font-bold text-[#1F2937]">{new Date(installDetails.expectedCompletionDate).toLocaleDateString()}</p></div>}
                    {installDetails.notes && <div className="col-span-2"><span className="text-gray-500">Notes:</span><p className="text-[#1F2937]">{installDetails.notes}</p></div>}
                  </div>
                </div>
              )}

              {/* Return Request panel */}
              {(status === 'Delivered' || status === 'Installation Completed') && !activeOrder.hasReturnRequest && (
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
          {loadingPayments ? (
            <div className="text-center py-8 text-gray-500 font-bold">Loading payment history...</div>
          ) : (
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
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">No payment history found.</td>
                  </tr>
                ) : (
                  payments.map(payment => (
                    <tr key={payment._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-[#1F2937] text-[11px]">{payment.transactionId}</td>
                      <td className="p-4 text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-[#8B5E3C]">${(payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> {payment.paymentMethod || 'Card'}</div>
                      </td>
                      <td className="p-4">
                        {payment.status === 'success' ? (
                          <span className="bg-[#00A86B]/10 text-[#00A86B] px-2 py-1 rounded-md text-xs font-bold">Paid</span>
                        ) : payment.status === 'pending' ? (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">Pending</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">Failed</span>
                        )}
                      </td>
                      <td className="p-4">
                        {payment.status === 'success' ? (
                          <button onClick={() => handleDownloadReceipt(payment)} className="text-[#8B5E3C] hover:underline font-bold text-xs">Download</button>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* TAB 10: USER SUPPORT CHAT */}
      {activeTab === 'support' && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden flex h-[600px] animate-fade-in">
          {/* Left panel: Help resources & FAQs */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-[#FDFBF7] p-6 space-y-6">
            <div>
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937]">User Chat</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">Direct Support Desk</p>
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
                  <h3 className="font-bold text-xs text-[#1F2937]">User Chat</h3>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">Online • Replies in minutes</p>
                </div>
              </div>
              <span className="text-[9px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded font-bold uppercase">Shared Chat</span>
            </div>

            {/* Support Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20">
              {(() => {
                const name = user?.name || 'User Demo';
                const email = user?.email || 'user@example.com';
                const filteredHelpMessages = helpMessages.filter(m => m.userName === name || m.userEmail === email);

                if (filteredHelpMessages.length === 0) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-xs text-gray-700 font-bold">No messages yet</p>
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] leading-relaxed">Ask a question below to start a live support conversation with our team.</p>
                    </div>
                  );
                }

                return filteredHelpMessages.map((msg) => {
                  const isUser = msg.senderRole === 'user';
                  const isAdmin = msg.senderRole === 'admin';
                  let bubbleStyle, align, senderLabel, timeColor;

                  if (isUser) {
                    bubbleStyle = 'bg-[#E76F51] text-white rounded-tr-none';
                    align = 'justify-end';
                    senderLabel = 'You';
                    timeColor = 'text-white/70';
                  } else if (isAdmin) {
                    bubbleStyle = 'bg-[#1D3557] text-white rounded-tl-none border border-[#1D3557]';
                    align = 'justify-start';
                    senderLabel = 'Admin Support';
                    timeColor = 'text-white/70';
                  } else {
                    bubbleStyle = 'bg-white text-gray-800 border border-[#8B5E3C]/30 rounded-tl-none';
                    align = 'justify-start';
                    senderLabel = `Vendor (${msg.senderName || 'Vendor'})`;
                    timeColor = 'text-gray-400';
                  }

                  return (
                    <div key={msg._id} className={`flex ${align}`}>
                      <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${bubbleStyle}`}>
                        <p>{msg.message}</p>
                        <span className={`block text-[9px] mt-1.5 ${isUser ? 'text-right' : 'text-left'} ${timeColor}`}>
                          {senderLabel} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Send Input */}
            <form onSubmit={handleSendHelpMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
              <input
                type="text"
                value={helpInput}
                onChange={(e) => setHelpInput(e.target.value)}
                placeholder="Type a message to Vendor & Admin..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F51] text-xs"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                Send Message
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
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Rating (1-5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className={`w-10 h-10 ${reviewRating >= star ? 'text-[#E9C46A] fill-[#E9C46A]' : 'text-gray-200'} transition-colors`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Review Comment</label>
              <textarea rows={3} required value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Absolutely loved the craftsmanship..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Publish Review</button>
          </form>

          {userReviews.length > 0 && (
            <div className="mt-10 pt-10 border-t border-gray-100 animate-fade-in">
              <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] mb-6">Your Published Reviews</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {userReviews.map(review => (
                  <div key={review._id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-1 text-[#E9C46A]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-5 h-5 ${review.rating >= star ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm font-bold text-[#1F2937] ml-2">{review.rating} Stars</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium bg-white px-2 py-1 rounded-md border border-gray-100">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="italic text-gray-700 text-sm mb-5 leading-relaxed">"{review.comment}"</p>
                    <p className="text-xs font-bold text-[#8B5E3C] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] text-sm">{review.userId?.name?.charAt(0) || 'C'}</div>
                      — Reviewed by {review.userId?.name || 'Customer'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              {(() => {
                const currentUserEmail = user?.email || 'user@example.com';
                const currentUserName = user?.name || 'User Demo';
                const chatMsgs = directMessages.filter(
                  m => m.vendorName === selectedVendorMsg && 
                  (m.userEmail === currentUserEmail || m.userName === currentUserName)
                );

                if (chatMsgs.length === 0) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-[#8B5E3C]/5 flex items-center justify-center text-[#8B5E3C] mb-3">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-xs text-[#1F2937]">Start a conversation</h4>
                      <p className="text-[10px] text-gray-400 max-w-[200px] mt-1">Send a message to inquire about design requests, custom pricing, or order adjustments.</p>
                    </div>
                  );
                }

                return chatMsgs.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isAdmin = msg.sender === 'admin';
                  let bubbleStyle, align, senderLabel, timeColor;

                  if (isUser) {
                    bubbleStyle = 'bg-[#8B5E3C] text-white rounded-tr-none';
                    align = 'justify-end';
                    senderLabel = 'You';
                    timeColor = 'text-white/70';
                  } else if (isAdmin) {
                    bubbleStyle = 'bg-amber-500 text-white rounded-tl-none border border-amber-600';
                    align = 'justify-start';
                    senderLabel = 'Admin';
                    timeColor = 'text-white/70';
                  } else {
                    bubbleStyle = 'bg-white text-gray-800 border border-gray-100 rounded-tl-none';
                    align = 'justify-start';
                    senderLabel = msg.vendorName || 'Vendor';
                    timeColor = 'text-gray-400';
                  }

                  return (
                    <div key={msg._id} className={`flex ${align}`}>
                      <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${bubbleStyle}`}>
                        <p>{msg.message}</p>
                        <span className={`block text-[9px] mt-1 text-right ${timeColor}`}>
                          {senderLabel} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
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
              {(profileData.name || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">My Profile</h2>
              <p className="text-gray-500 text-sm">Update your personal and shipping details.</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={(e) => { 
            e.preventDefault(); 
            
            showToast('Profile Updated Successfully!', 'success');
          }}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" defaultValue={user?.email} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Phone Number</label>
              <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Default Shipping Address</label>
              <textarea rows={3} value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} placeholder="123 Artisan Street, City, Country, ZIP" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-gray-50" />
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
