import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Wand2, UploadCloud, CheckCircle, RefreshCw, XCircle, ShoppingBag, 
  HelpCircle, Hammer, DollarSign, Clock, Star, MessageSquare, AlertCircle, Eye,
  LayoutDashboard, ShoppingCart, Truck, CreditCard, User as UserIcon, Bookmark, Bell, ArrowRight, Activity, Package
} from 'lucide-react';
import Marketplace from './Marketplace';

const UserDashboard = ({ activeTab = 'overview', setActiveTab }) => {
  const { user } = useAuth();

  // AI Studio State
  const [roomType, setRoomType] = useState('Living Room');
  const [originalImage, setOriginalImage] = useState('');
  const [aiDesigns, setAiDesigns] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  // Manual Design State
  const [manualStyle, setManualStyle] = useState('Modern');
  const [manualBudget, setManualBudget] = useState('Below ₹50,000');
  const [manualSize, setManualSize] = useState('Medium');
  const [manualMaterials, setManualMaterials] = useState('');
  const [manualRequirements, setManualRequirements] = useState('');
  const [manualDesigns, setManualDesigns] = useState([]);
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
  const [pendingPaid, setPendingPaid] = useState(false);

  // Ticket & Review State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTargetId, setReviewTargetId] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [aiRes, manRes, prodRes, ordRes] = await Promise.all([
        axios.get('/designs/ai').catch(() => ({ data: { data: [] } })),
        axios.get('/designs/manual').catch(() => ({ data: { data: [] } })),
        axios.get('/products').catch(() => ({ data: { data: [] } })),
        axios.get('/orders/user').catch(() => ({ data: { data: [] } }))
      ]);

      const localManualRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
      const backendManualReqs = manRes.data?.data || [];
      const mergedManualReqs = [...localManualRequests];
      backendManualReqs.forEach(br => {
        if (!mergedManualReqs.find(lr => lr._id === br._id)) mergedManualReqs.push(br);
      });

      setAiDesigns(aiRes.data?.data || []);
      setManualDesigns(mergedManualReqs);
      setProducts(prodRes.data?.data || [
        { _id: 'prod_1', title: 'Velvet Lounge Chair', category: 'Living Room', price: 450, images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'], description: 'Luxurious velvet chair.' },
        { _id: 'prod_2', title: 'Modern Oak Dining Table', category: 'Dining Room', price: 1200, images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500'], description: 'Solid oak dining table for 6.' }
      ]);
      setOrders(ordRes.data?.data || []);
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
    try {
      const mockImg = originalImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60';
      const res = await axios.post('/designs/ai', { roomType, originalImage: mockImg });
      setAiDesigns([res.data.data, ...aiDesigns]);
      alert('AI Design Generated Successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error generating AI design');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAiStatus = async (id, status) => {
    try {
      const res = await axios.put(`/designs/ai/${id}`, { status });
      setAiDesigns(aiDesigns.map(d => d._id === id ? res.data.data : d));
      if (status === 'accepted') alert('AI Design accepted! Order request sent.');
      if (status === 'rejected') {
        alert('AI Design rejected. You can now submit a manual design request.');
        if (setActiveTab) setActiveTab('manual');
      }
    } catch (error) {
      alert('Error updating AI design status');
    }
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

    const payload = {
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
      serviceAddress, vendorPreference: vendorPref, quotationType
    };

    // Helper to persist to localStorage and notify vendor/admin dashboards
    const persistToLocalStorage = (requestObj) => {
      try {
        const localRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
        // Avoid duplicates
        if (!localRequests.find(r => r._id === requestObj._id)) {
          localStorage.setItem('mockManualRequests', JSON.stringify([requestObj, ...localRequests]));
        }
        const localVendorNotifs = JSON.parse(localStorage.getItem('mockVendorNotifications') || '[]');
        localStorage.setItem('mockVendorNotifications', JSON.stringify([{
          _id: `notif_${Date.now()}`,
          message: `New custom design request from ${requestObj.userId?.name || 'Customer'}.`,
          type: 'info',
          createdAt: new Date().toISOString()
        }, ...localVendorNotifs]));
        const localAdminNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
        localStorage.setItem('mockAdminNotifications', JSON.stringify([{
          _id: `notif_admin_${Date.now()}`,
          message: `New Manual Design Request ID: ${requestObj._id} requires review.`,
          type: 'warning',
          createdAt: new Date().toISOString()
        }, ...localAdminNotifs]));
      } catch (err) {
        console.error('LocalStorage write failed', err);
      }
    };

    try {
      const res = await axios.post('/designs/manual', payload);
      const newRequest = res.data.data;
      setManualDesigns([newRequest, ...manualDesigns]);
      // Always persist so vendor/admin can see it across sessions
      persistToLocalStorage(newRequest);
    } catch (error) {
      // Backend failed (offline / 401 in demo mode) — create a client-side fallback request
      const fallbackRequest = {
        _id: 'man_local_' + Date.now(),
        userId: { name: user?.name || 'Customer', email: user?.email || 'user@example.com', phone: '' },
        ...payload,
        style: payload.style,
        status: 'Submitted',
        createdAt: new Date().toISOString()
      };
      setManualDesigns([fallbackRequest, ...manualDesigns]);
      persistToLocalStorage(fallbackRequest);
    }

    // Reset form regardless of success/failure
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
    try {
      await axios.post('/designs/designer', { details: designerDetails, budget: Number(designerBudget) });
      alert('Interior Designer Request Submitted Successfully!');
      setDesignerDetails(''); setDesignerBudget('');
    } catch (error) {
      alert('Error requesting designer');
    }
  };

  // Marketplace Order Action
  const handleProductOrder = async (product) => {
    try {
      const res = await axios.post('/orders', {
        vendorId: product.vendorId?._id || product.vendorId || 'mock_vendor',
        orderType: 'product',
        referenceId: product._id,
        totalAmount: product.price,
        shippingAddress: user.address || '123 Default User St'
      });
      setOrders([res.data.data, ...orders]);
      alert('Added to Cart! (Mock Order Placed)');
      if (setActiveTab) setActiveTab('cart');
    } catch (error) {
      alert('Error placing order');
    }
  };

  // Budget Approval Action
  const handleBudgetApproval = async (quotationId) => {
    try {
      const res = await axios.post('/orders/approve-budget', {
        quotationId, shippingAddress: user.address || '123 Default User St'
      });
      setOrders([res.data.data, ...orders]);
      alert('Quotation approved! Order confirmed and moved to manufacturing.');
      if (setActiveTab) setActiveTab('orders');
    } catch (error) {
      alert('Error approving budget');
    }
  };

  // Support Ticket Action
  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      const res = await axios.post('/orders/ticket', {
        subject: ticketSubject,
        message: ticketMessage
      });
      if (res.data?.success) {
        alert('Ticket Submitted Successfully!');
        setTicketSubject('');
        setTicketMessage('');
      } else {
        alert(res.data?.message || 'Failed to submit ticket.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting ticket. Please try again.');
    }
  };

  // Review Action
  const handlePublishReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/orders/review', {
        vendorId: 'mock_vendor_id_123',
        productId: 'prod_1',
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.data?.success) {
        alert('Review published successfully!');
        setReviewComment('');
      } else {
        alert('Failed to publish review.');
      }
    } catch (err) {
      alert('Error publishing review.');
    }
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

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-[#F8F5F0] to-white p-6 rounded-3xl border border-[#D4A373]/30 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group" onClick={() => setActiveTab && setActiveTab('marketplace')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform text-[#8B5E3C]"><ShoppingBag size={24}/></div>
                  <div>
                    <h4 className="font-bold text-[#1F2937]">Explore Marketplace</h4>
                    <p className="text-xs text-gray-500">Discover curated furniture pieces</p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-[#8B5E3C] transition-colors"/>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-3xl border border-gray-200 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group" onClick={() => setActiveTab && setActiveTab('manual_request')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform text-[#2A9D8F]"><Hammer size={24}/></div>
                  <div>
                    <h4 className="font-bold text-[#1F2937]">Custom Design Request</h4>
                    <p className="text-xs text-gray-500">Get quotes from artisan partners</p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-[#2A9D8F] transition-colors"/>
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
              aiDesigns.map((design) => (
                <div key={design._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img src={design.generatedImage} alt="AI Design" className="w-full sm:w-64 h-48 object-cover rounded-2xl shadow-inner" />
                    <div className="space-y-4 flex-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{design.roomType}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${design.status === 'accepted' ? 'bg-[#2A9D8F] text-white' : design.status === 'rejected' ? 'bg-[#E76F51] text-white' : 'bg-[#E9C46A] text-[#1F2937]'}`}>
                          {design.status.toUpperCase()}
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
                          {design.status !== 'accepted' && (
                            <>
                              <button onClick={() => handleAiStatus(design._id, 'accepted')} className="p-2 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl shadow-sm" title="Accept & Order"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleAiStatus(design._id, 'regenerated')} className="p-2 bg-[#E9C46A] hover:bg-[#E9C46A]/90 text-[#1F2937] rounded-xl shadow-sm" title="Regenerate"><RefreshCw className="w-4 h-4" /></button>
                              <button onClick={() => handleAiStatus(design._id, 'rejected')} className="p-2 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl shadow-sm" title="Reject & Manual Design"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
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
            {manualDesigns.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 space-y-4">
                <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider">Your Submitted Requests</h3>
                {manualDesigns.slice(0,3).map((d, i) => (
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
        <Marketplace isEmbedded={true} onGoToCart={() => setActiveTab && setActiveTab('cart')} />
      )}

      {/* TAB 6: MY CART */}
      {activeTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] border-b border-gray-100 pb-4">Shopping Cart</h2>
            <div className="space-y-4">
              {/* Mock Cart Item */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl">
                <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=150" alt="Item" className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F2937]">Velvet Lounge Chair</h4>
                  <p className="text-xs text-gray-500">Vendor: Artisan Furniture Co.</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-extrabold text-[#8B5E3C]">$450.00</span>
                    <div className="flex items-center gap-2 text-sm font-bold border border-gray-200 rounded-lg px-2 py-1">
                      <button className="text-gray-400 hover:text-black">-</button>
                      <span>1</span>
                      <button className="text-gray-400 hover:text-black">+</button>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-red-400 hover:text-red-600 transition-colors"><XCircle className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start">
            <h3 className="font-bold text-lg text-[#1F2937]">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-[#1F2937]">$450.00</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-[#1F2937]">$50.00</span></div>
              <div className="flex justify-between"><span>Tax (8%)</span><span className="font-bold text-[#1F2937]">$36.00</span></div>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-[#8B5E3C]">
              <span>Total</span>
              <span>$536.00</span>
            </div>
            <button onClick={() => { alert('Proceeding to checkout...'); if(setActiveTab) setActiveTab('payments'); }} className="w-full py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Your Orders</h2>
          
          {/* Quotations Approval Box */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#E9C46A]"></div>
            <h3 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider mb-2">Pending Vendor Quotations (Action Required)</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#F8F5F0] rounded-2xl border border-[#D4A373]/30">
              <div className="space-y-2">
                <span className="bg-[#D4A373]/20 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold">Manual Design Quotation</span>
                <h4 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Custom Living Room Set</h4>
                <p className="text-xs text-[#6B7280]">Materials: Solid Teak Wood, Premium Linen • Est. Time: 3 Weeks</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-['Playfair_Display'] font-extrabold text-3xl text-[#8B5E3C]">$4,850</span>
                <button onClick={() => handleBudgetApproval('mock_quotation_id')} className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Approve Budget</button>
              </div>
            </div>
          </div>

          {/* Active Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-[#D4A373]/30 space-y-4 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-[#D4A373] mx-auto" />
              <p className="text-[#6B7280] font-medium">No active orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{order.orderType?.replace('_', ' ') || 'PRODUCT'}</span>
                  <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-2">Order #{order._id?.slice(-6) || '10293'}</h3>
                  <p className="text-xs text-[#6B7280] mt-1">Vendor: {order.vendorId?.companyName || 'Artisan Partner'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-['Playfair_Display'] font-extrabold text-3xl text-[#8B5E3C]">${order.totalAmount || '0'}</span>
                    <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider mt-1">Status: <span className="text-[#2A9D8F]">{order.paymentStatus || 'pending'}</span></p>
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
            ))
          )}
        </div>
      )}

      {/* TAB 8: ORDER TRACKING */}
      {activeTab === 'tracking' && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Live Order Tracking</h2>
                <p className="text-sm text-gray-500 mt-1">Order #ORD-882910 • Placed on Oct 12, 2026</p>
              </div>
              <div className="px-4 py-2 bg-[#00A86B]/10 text-[#00A86B] font-bold rounded-lg text-sm border border-[#00A86B]/20">
                Estimated Delivery: Oct 20, 2026
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="relative py-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full hidden md:block"></div>
              <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-[#8B5E3C] -translate-y-1/2 rounded-full hidden md:block transition-all"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center shadow-md ring-4 ring-white"><CheckCircle className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm text-[#1F2937]">Order Confirmed</p>
                    <p className="text-xs text-gray-500 mt-1">Oct 12, 10:00 AM</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center shadow-md ring-4 ring-white"><Hammer className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm text-[#1F2937]">Manufacturing</p>
                    <p className="text-xs text-gray-500 mt-1">Oct 14, 2:30 PM</p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-white text-gray-400 border-2 border-gray-300 flex items-center justify-center shadow-sm ring-4 ring-white"><Truck className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm text-gray-400">Shipped</p>
                    <p className="text-xs text-gray-400 mt-1">Pending</p>
                  </div>
                </div>
                {/* Step 4 */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-white text-gray-400 border-2 border-gray-300 flex items-center justify-center shadow-sm ring-4 ring-white"><Star className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-sm text-gray-400">Delivered</p>
                    <p className="text-xs text-gray-400 mt-1">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F5F0] p-6 rounded-2xl flex items-center gap-4">
              <Truck className="w-8 h-8 text-[#8B5E3C]" />
              <div>
                <h4 className="font-bold text-[#1F2937]">Current Status: Vendor has started crafting your furniture.</h4>
                <p className="text-sm text-gray-500">The manufacturing process typically takes 3-5 business days. You will be notified when it ships.</p>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* TAB 10: REVIEWS & SUPPORT */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <AlertCircle className="w-6 h-6 text-[#E76F51]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Raise Support Ticket</h2>
            </div>
            <form onSubmit={handleRaiseTicket} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Subject</label>
                <input type="text" required value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="Issue with delivery schedule..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Message</label>
                <textarea rows={4} required value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} placeholder="Please explain your issue in detail..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>
              <button type="submit" className="w-full py-4 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Submit Support Ticket</button>
            </form>
          </div>
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start">
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
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Saved Designs & Inspirations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mock Saved Item */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D4A373]/20 group relative">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500" alt="Saved" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-700"><Bookmark className="w-5 h-5 fill-current" /></button>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-bold text-lg">Boho Living Room</p>
                <p className="text-xs opacity-80">AI Generated</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D4A373]/20 group relative">
              <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500" alt="Saved" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-700"><Bookmark className="w-5 h-5 fill-current" /></button>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-bold text-lg">Velvet Lounge Chair</p>
                <p className="text-xs opacity-80">Marketplace Product</p>
              </div>
            </div>
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
            <button className="text-sm font-bold text-[#8B5E3C] hover:underline">Mark all as read</button>
          </div>
          <div className="space-y-4">
            {/* Unread Notification */}
            <div className="flex gap-4 p-4 bg-[#E76F51]/5 rounded-2xl border border-[#E76F51]/20">
              <div className="mt-1"><div className="w-2 h-2 bg-[#E76F51] rounded-full"></div></div>
              <div>
                <p className="font-bold text-[#1F2937] text-sm">Vendor has sent a quotation for your manual design.</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                <button onClick={() => { if(setActiveTab) setActiveTab('orders'); }} className="mt-2 text-xs font-bold text-[#8B5E3C] hover:underline">Review Quotation</button>
              </div>
            </div>
            {/* Read Notification */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="mt-1"><CheckCircle className="w-4 h-4 text-gray-400" /></div>
              <div>
                <p className="font-bold text-gray-600 text-sm">Your AI Design generation is complete.</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
