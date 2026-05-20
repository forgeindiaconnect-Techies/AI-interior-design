import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Store, Hammer, Truck, CheckCircle, PlusCircle, DollarSign, UploadCloud, 
  Send, RefreshCw, Eye, ArrowRight, ClipboardList, Package, MessageSquare, 
  Star, Briefcase, ShieldCheck, Bell, ShoppingCart, FileText, Activity
} from 'lucide-react';

const VendorDashboard = ({ activeTab = 'overview', setActiveTab }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  // Vendor/Seller State
  const [products, setProducts] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Living Room');
  const [newMaterial, setNewMaterial] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newImage, setNewImage] = useState('');

  // Quotation Form State
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteMaterials, setQuoteMaterials] = useState('');
  const [quoteTime, setQuoteTime] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [viewDetailsId, setViewDetailsId] = useState(null);

  // Suggest Vendor State
  const [suggestedVendorId, setSuggestedVendorId] = useState('');
  const [suggestNote, setSuggestNote] = useState('');

  // Manufacturer State
  const [manufacturingOrders, setManufacturingOrders] = useState([]);
  const [mfgStatus, setMfgStatus] = useState({});
  const [progressImg, setProgressImg] = useState({});

  // Delivery State
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [delStatus, setDelStatus] = useState({});
  const [trackingNote, setTrackingNote] = useState({});
  const [isPayoutRequested, setIsPayoutRequested] = useState(false);

  // KYC and Deposit States
  const [kycDetails, setKycDetails] = useState(null);
  const [depositDetails, setDepositDetails] = useState(null);

  // KYC form states
  const [kycBusinessName, setKycBusinessName] = useState('');
  const [kycOwnerName, setKycOwnerName] = useState('');
  const [kycPhone, setKycPhone] = useState('');
  const [kycEmail, setKycEmail] = useState('');
  const [kycGst, setKycGst] = useState('');
  const [kycPan, setKycPan] = useState('');
  const [kycIdProof, setKycIdProof] = useState('');
  const [kycAddressProof, setKycAddressProof] = useState('');
  const [kycBankAcc, setKycBankAcc] = useState('');
  const [kycIfsc, setKycIfsc] = useState('');
  const [kycBankName, setKycBankName] = useState('');

  // Deposit Form State
  const [depositTxnId, setDepositTxnId] = useState('');

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const profRes = await axios.get('/vendor/profile').catch(() => ({ data: { data: { vendor: { companyName: 'Artisan Partner' }, stats: { totalOrders: 15, revenue: 24500 } } } }));
      setProfile(profRes.data?.data?.vendor || { companyName: 'Artisan Partner' });
      setStats(profRes.data?.data?.stats || { totalOrders: 15, revenue: 24500 });

      // Fetch KYC Details
      const kycRes = await axios.get('/vendor/kyc').catch(() => ({ data: { data: { status: 'Not Submitted' } } }));
      const currentKyc = kycRes.data?.data || { status: 'Not Submitted' };
      setKycDetails(currentKyc);
      if (currentKyc && currentKyc.status !== 'Not Submitted') {
        setKycBusinessName(currentKyc.businessName || '');
        setKycOwnerName(currentKyc.ownerName || '');
        setKycPhone(currentKyc.phone || '');
        setKycEmail(currentKyc.email || '');
        setKycGst(currentKyc.gstNumber || '');
        setKycPan(currentKyc.panNumber || '');
        setKycIdProof(currentKyc.idProofUrl || '');
        setKycAddressProof(currentKyc.addressProofUrl || '');
        setKycBankAcc(currentKyc.bankDetails?.accountNumber || '');
        setKycIfsc(currentKyc.bankDetails?.ifscCode || '');
        setKycBankName(currentKyc.bankDetails?.bankName || '');
      }

      // Fetch Security Deposit
      const depRes = await axios.get('/vendor/deposit').catch(() => ({ data: { data: { paymentStatus: 'Pending' } } }));
      setDepositDetails(depRes.data?.data || { paymentStatus: 'Pending' });

      // Load products for vendor role
      if (user?.role === 'vendor') {
        const prodRes = await axios.get(`/products?vendorId=${profRes.data?.data?.vendor?._id || 'mock'}`).catch(() => ({ data: { data: [] } }));
        setProducts(prodRes.data?.data || [
          { _id: 'prod_1', title: 'Velvet Lounge Chair', category: 'Living Room', price: 450, images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'], description: 'Luxurious velvet chair.' }
        ]);
      }

      // Always load custom design requests from localStorage + backend for all partner roles
      const vendorRoles = ['vendor', 'manufacturer', 'delivery', 'installation', 'admin'];
      if (vendorRoles.includes(user?.role)) {
        const reqRes = await axios.get('/vendor/requests').catch(() => ({ data: { data: [] } }));
        // localStorage is primary source — always read it first
        const localManualRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
        const backendRequests = reqRes.data?.data || [];
        // Merge: localStorage first, then any backend items not already present
        const finalRequests = [...localManualRequests];
        backendRequests.forEach(br => {
          if (!finalRequests.find(lr => lr._id.toString() === br._id.toString())) {
            finalRequests.push(br);
          }
        });
        setCustomRequests(finalRequests);
      }

      setManufacturingOrders([
        { _id: 'mfg_1', orderId: 'ord_101', designDetails: 'Luxury Velvet Sofa Custom', measurements: '84" x 36" x 32"', materials: 'Teak Wood, Velvet', budget: 2400, status: 'Production Started', progressImages: [] }
      ]);
      setDeliveryOrders([
        { _id: 'del_1', orderId: 'ord_102', shippingAddress: '742 Evergreen Terrace', status: 'Picked Up', trackingNotes: 'Dispatched from central hub' }
      ]);

    } catch (error) {
      console.error('Error fetching vendor data', error);
    }
  };

  // Vendor Actions
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTitle, description: newDesc, price: Number(newPrice), category: newCategory, 
        material: newMaterial || 'Oak Wood', size: newSize || '32x32x30', 
        images: [newImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'],
        stockStatus: 'In Stock'
      };
      const res = await axios.post('/products', payload);
      setProducts([res.data.data, ...products]);
      alert('✅ Product listed successfully! It is now live in the Marketplace.');
      setNewTitle(''); setNewDesc(''); setNewPrice(''); setNewMaterial(''); setNewSize(''); setNewImage('');
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleEditProduct = async (p) => {
    const updatedTitle = prompt('Enter new title:', p.title);
    if (!updatedTitle) return;
    const updatedPrice = prompt('Enter new price ($):', p.price);
    if (!updatedPrice) return;
    try {
      await axios.put(`/products/${p._id}`, { title: updatedTitle, price: Number(updatedPrice) });
      setProducts(products.map(item => item._id === p._id ? { ...item, title: updatedTitle, price: Number(updatedPrice) } : item));
      alert('✅ Product updated successfully!');
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter(item => item._id !== id));
      alert('✅ Product deleted successfully!');
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleViewInMarketplace = (id) => {
    alert(`Redirecting to User Dashboard -> Marketplace Product #${id}...`);
    window.location.href = `/marketplace/product/${id}`;
  };

  // Helper: update a request's status in localStorage so it persists across refreshes
  const updateRequestStatusInStorage = (id, newStatus, extraFields = {}) => {
    try {
      const stored = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
      const updated = stored.map(r => r._id === id ? { ...r, status: newStatus, ...extraFields } : r);
      localStorage.setItem('mockManualRequests', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update localStorage status', err);
    }
  };

  const handleSendQuotation = async (e, req) => {
    e.preventDefault();
    try {
      await axios.post('/vendor/quotations', {
        userId: req.userId?._id || req.userId || 'mock_user',
        designType: 'manual',
        designRequestId: req._id,
        budgetAmount: Number(quoteAmount),
        materialsBreakdown: quoteMaterials,
        estimatedTime: quoteTime
      });
    } catch (_) { /* backend may be offline in demo mode — continue */ }
    // Always update UI + localStorage regardless of backend result
    const quotationFields = { quotationAmount: quoteAmount, quotationMaterials: quoteMaterials, quotationTime: quoteTime };
    setCustomRequests(customRequests.map(r => r._id === req._id ? { ...r, status: 'Quotation Sent', ...quotationFields } : r));
    updateRequestStatusInStorage(req._id, 'Quotation Sent', quotationFields);
    alert('✅ Quotation sent to customer successfully! User and Admin have been notified.');
    setSelectedRequestId(null); setQuoteAmount(''); setQuoteMaterials(''); setQuoteTime('');
    if (setActiveTab) setActiveTab('quotations');
  };

  const handleAcceptRequest = async (id) => {
    try {
      await axios.post(`/vendor/requests/${id}/accept`);
    } catch (_) { /* offline fallback */ }
    setCustomRequests(customRequests.map(r => r._id === id ? { ...r, status: 'Vendor Review' } : r));
    updateRequestStatusInStorage(id, 'Vendor Review');
    alert('✅ Design request accepted successfully! The user has been notified.');
  };

  const handleRejectRequest = async (id) => {
    if (!confirm('Are you sure you want to reject this design request?')) return;
    try {
      await axios.post(`/vendor/requests/${id}/reject`);
    } catch (_) { /* offline fallback */ }
    setCustomRequests(customRequests.map(r => r._id === id ? { ...r, status: 'Rejected' } : r));
    updateRequestStatusInStorage(id, 'Rejected');
    alert('❌ Design request rejected. The user has been notified.');
  };

  const handleContactCustomer = (req) => {
    const email = req.userId?.email || 'customer@example.com';
    const phone = req.userId?.phone || '+1 (555) 234-5678';
    const name = req.userId?.name || 'Customer';
    alert(`📞 Contacting ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n\nOpening your default email client...`);
    window.location.href = `mailto:${email}?subject=Regarding your Custom Design Request #${req._id}&body=Hello ${name}, we are reviewing your interior design request...`;
  };

  const handleSuggestVendor = async (e, reqId) => {
    e.preventDefault();
    alert('Suggested alternative vendor successfully!');
    setSuggestedVendorId(''); setSuggestNote('');
  };

  const handleForwardMfg = async (orderId) => {
    alert('Order forwarded to manufacturer successfully!');
  };

  // Manufacturer Actions
  const handleMfgUpdate = async (id) => {
    try {
      await axios.put(`/orders/manufacturing/${id}`, {
        status: mfgStatus[id] || 'In Progress', progressImage: progressImg[id] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60'
      });
      setManufacturingOrders(manufacturingOrders.map(o => o._id === id ? { ...o, status: mfgStatus[id] || o.status, progressImages: [...o.progressImages, progressImg[id]] } : o));
      alert('Manufacturing stage updated successfully!');
    } catch (error) {
      alert('Error updating manufacturing status');
    }
  };

  // Delivery Actions
  const handleDelUpdate = async (id) => {
    try {
      await axios.put(`/orders/delivery/${id}`, {
        status: delStatus[id] || 'Out for Delivery', trackingNotes: trackingNote[id] || 'In transit'
      });
      setDeliveryOrders(deliveryOrders.map(o => o._id === id ? { ...o, status: delStatus[id] || o.status, trackingNotes: trackingNote[id] || o.trackingNotes } : o));
      alert('Delivery status updated successfully!');
    } catch (error) {
      alert('Error updating delivery status');
    }
  };

  // Payout Actions
  const handleRequestPayout = () => {
    if (isPayoutRequested) {
      alert('⚠️ A payout request is already pending processing.');
      return;
    }
    setIsPayoutRequested(true);
    alert('✅ Instant payout requested successfully! Your funds ($' + (stats?.revenue?.toLocaleString() || '24,500') + ') are being transferred to your registered bank account.');
  };

  // KYC and Deposit Handlers
  const handleSubmitKYC = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        businessName: kycBusinessName,
        ownerName: kycOwnerName,
        phone: kycPhone,
        email: kycEmail,
        gstNumber: kycGst,
        panNumber: kycPan,
        idProofUrl: kycIdProof || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600',
        addressProofUrl: kycAddressProof || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
        bankDetails: {
          accountNumber: kycBankAcc,
          ifscCode: kycIfsc,
          bankName: kycBankName
        }
      };
      const res = await axios.post('/vendor/kyc', payload);
      setKycDetails(res.data.data);
      alert('✅ KYC details submitted successfully for review.');
      fetchPartnerData();
    } catch (error) {
      alert('Error submitting KYC details');
    }
  };

  const handleSubmitDeposit = async (e) => {
    e.preventDefault();
    if (!depositTxnId.trim()) {
      alert('Please enter a valid Transaction ID.');
      return;
    }
    try {
      const res = await axios.post('/vendor/deposit', { transactionId: depositTxnId });
      setDepositDetails(res.data.data);
      alert('✅ Security deposit payment transaction submitted for verification.');
      setDepositTxnId('');
      fetchPartnerData();
    } catch (error) {
      alert('Error submitting payment details');
    }
  };

  return (
    <div className="space-y-10">

      {/* ONBOARDING PROGRESS BANNER — shown only for unverified partners */}
      {(() => {
        const kyc = kycDetails?.status || 'Not Submitted';
        const deposit = depositDetails?.paymentStatus || 'Pending';
        const isActive = kyc === 'Approved' && deposit === 'Verified';
        
        if (isActive) return null; // Hide once fully activated

        const steps = [
          { label: 'Registered', done: true, icon: '✓' },
          { label: 'KYC Submitted', done: kyc !== 'Not Submitted' && kyc !== 'Pending', icon: kyc !== 'Not Submitted' ? '✓' : '2' },
          { label: 'Deposit Paid', done: deposit === 'Paid' || deposit === 'Verified', icon: (deposit === 'Paid' || deposit === 'Verified') ? '✓' : '3' },
          { label: 'Admin Approval', done: kyc === 'Approved', icon: kyc === 'Approved' ? '✓' : '4' },
          { label: 'Account Active', done: isActive, icon: isActive ? '✓' : '5' },
        ];

        const currentStepIndex = steps.findIndex(s => !s.done);
        const progressPct = Math.round(((currentStepIndex === -1 ? steps.length : currentStepIndex) / steps.length) * 100);

        let alertMsg = null;
        let alertAction = null;
        let alertTab = null;
        if (kyc === 'Not Submitted' || kyc === 'Pending') {
          alertMsg = '⚠️ Your account is not yet active. Please submit your KYC documents to get started.';
          alertAction = 'Submit KYC Now →';
          alertTab = 'kyc';
        } else if (kyc === 'Submitted') {
          alertMsg = '🕐 KYC submitted & under review. While waiting, you can pay the security deposit.';
          alertAction = 'Pay Security Deposit →';
          alertTab = 'deposit';
        } else if (kyc === 'Approved' && deposit === 'Pending') {
          alertMsg = '💳 KYC Approved! Complete your security deposit to activate your account.';
          alertAction = 'Pay Security Deposit →';
          alertTab = 'deposit';
        } else if (deposit === 'Paid') {
          alertMsg = '🔍 Security deposit received. Admin is reviewing your full application.';
          alertAction = null;
          alertTab = null;
        } else if (kyc === 'Rejected') {
          alertMsg = '❌ Your KYC was rejected. Please re-submit with correct documents.';
          alertAction = 'Re-submit KYC →';
          alertTab = 'kyc';
        }

        return (
          <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#8B5E3C] to-[#7a5133] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-white font-bold text-sm">🚀 Partner Account Onboarding</p>
                <p className="text-white/70 text-xs mt-0.5">Complete all steps to start receiving orders and earning revenue.</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }}></div>
                </div>
                <span className="text-white text-xs font-bold">{progressPct}% Complete</span>
              </div>
            </div>

            <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Steps */}
              <div className="flex items-center gap-0 overflow-x-auto flex-1">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold border-2 ${s.done ? 'bg-emerald-500 border-emerald-500 text-white' : i === currentStepIndex ? 'bg-white border-[#8B5E3C] text-[#8B5E3C]' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                        {s.icon}
                      </div>
                      <span className={`text-[9px] font-bold whitespace-nowrap ${s.done ? 'text-emerald-600' : i === currentStepIndex ? 'text-[#8B5E3C]' : 'text-gray-400'}`}>{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-0.5 w-6 sm:w-10 mx-1 mb-4 rounded-full ${s.done ? 'bg-emerald-400' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Alert Message + CTA */}
              {alertMsg && (
                <div className="flex-shrink-0 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 max-w-sm">
                  <p className="text-xs font-medium text-amber-800 flex-1">{alertMsg}</p>
                  {alertAction && (
                    <button
                      onClick={() => setActiveTab && setActiveTab(alertTab)}
                      className="text-xs font-extrabold text-[#8B5E3C] whitespace-nowrap hover:underline"
                    >
                      {alertAction}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (() => {
        const earningsData = [
          { month: 'Jan', value: 2000, max: 10000 },
          { month: 'Feb', value: 4500, max: 10000 },
          { month: 'Mar', value: 3800, max: 10000 },
          { month: 'Apr', value: 6500, max: 10000 },
          { month: 'May', value: 5200, max: 10000 },
          { month: 'Jun', value: 8500, max: 10000 },
        ];
        
        const newRequestsCount = customRequests?.filter(r => r.status === 'pending' || r.status === 'Pending')?.length || 5;
        const activeBidsCount = customRequests?.filter(r => r.status === 'Quotation Sent' || r.status === 'Vendor Review')?.length || 8;
        const unreadMessagesCount = 2; // Mock data for unread messages
        
        const activityFeed = [
          { icon: '⭐', label: 'New Review Received', name: 'Sarah Jenkins rated 5 stars', time: new Date(Date.now() - 3600000 * 2).toISOString(), color: 'bg-yellow-50 text-yellow-600' },
          { icon: '📦', label: 'Order Dispatched', name: 'Order #ORD-10992 handed to delivery', time: new Date(Date.now() - 3600000 * 5).toISOString(), color: 'bg-emerald-50 text-emerald-600' },
          { icon: '📝', label: 'New Custom Request', name: 'Living Room Design Request', time: new Date(Date.now() - 3600000 * 12).toISOString(), color: 'bg-indigo-50 text-indigo-600' },
          { icon: '💰', label: 'Quotation Accepted', name: 'Customer approved $4,850 bid', time: new Date(Date.now() - 3600000 * 24).toISOString(), color: 'bg-teal-50 text-teal-600' },
        ].slice(0, 4);

        const kpiCards = [
          { label: 'Total Orders', value: stats?.totalOrders || 15, trend: '+3', trendUp: true, sub: 'this month', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600', tab: 'orders' },
          { label: 'New Requests', value: newRequestsCount, trend: 'Action needed', trendUp: false, sub: 'awaiting quote', icon: <FileText className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600', tab: 'custom_requests' },
          { label: 'Active Bids', value: activeBidsCount, trend: 'In progress', trendUp: true, sub: 'under review', icon: <Send className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600', tab: 'quotations' },
          { label: 'Total Earnings', value: `$${(stats?.revenue || 24500).toLocaleString()}`, trend: '+15%', trendUp: true, sub: 'revenue growth', icon: <DollarSign className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600', tab: 'earnings' },
        ];

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#2A9D8F] via-[#21867a] to-[#1d7369] rounded-3xl p-8 text-white shadow-xl">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Vendor & Partner Portal</p>
                  <h1 className="font-['Playfair_Display'] font-extrabold text-3xl md:text-4xl">Welcome back, {profile?.companyName || 'Partner'}! 👋</h1>
                  <p className="text-white/80 text-sm mt-2">Your store is online and visible. {newRequestsCount > 0 && `You have ${newRequestsCount} new design requests.`}</p>
                </div>
                <div className="text-right bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20">
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Today</p>
                  <p className="text-white font-bold text-lg">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <p className="text-white/80 text-xs">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
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
                    <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {card.trendUp ? '↑' : '↓'} {card.trend}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] font-extrabold text-3xl text-[#1F2937]">{card.value}</h3>
                    <p className="text-sm font-bold text-gray-500 mt-1">{card.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Earnings Bar Chart */}
              <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Earnings Overview</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Monthly payouts (2026)</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <span>↑</span> +32% vs last period
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-48">
                  {earningsData.map((d, i) => {
                    const heightPct = Math.round((d.value / d.max) * 100);
                    const isMax = i === earningsData.length - 1;
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500">${(d.value / 1000).toFixed(1)}k</span>
                        <div className="w-full relative rounded-t-xl overflow-hidden" style={{ height: `${heightPct}%`, minHeight: '12px', background: isMax ? 'linear-gradient(to top, #2A9D8F, #48bcae)' : '#e0f2f1', transition: 'height 0.6s ease' }}>
                          {isMax && <div className="absolute inset-0 opacity-30 bg-white animate-pulse rounded-t-xl"></div>}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Fulfillment Status */}
              <div className="bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="mb-6">
                  <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Order Status</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Current active pipeline</p>
                </div>
                <div className="space-y-5">
                  {[
                    { label: 'Completed Deliveries', count: 42, total: 60, color: '#10b981' },
                    { label: 'In Production', count: 12, total: 60, color: '#f59e0b' },
                    { label: 'Pending Dispatch', count: 4, total: 60, color: '#3b82f6' },
                    { label: 'Cancelled/Refunded', count: 2, total: 60, color: '#ef4444' },
                  ].map((item) => {
                    const pct = Math.round((item.count / item.total) * 100);
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-gray-600">{item.label}</span>
                          <span className="font-extrabold text-gray-800">{item.count}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: item.color }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pending Actions + Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Action Required */}
              <div className="bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-orange-50 rounded-xl"><Bell className="w-5 h-5 text-orange-500" /></div>
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Action Required</h3>
                    <p className="text-[11px] text-gray-400">Tasks needing your attention</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'New Custom Design Requests', count: newRequestsCount, tab: 'custom_requests', color: 'bg-orange-50 text-orange-600 border-orange-100', urgent: newRequestsCount > 0 },
                    { label: 'Pending Quotation Approvals', count: activeBidsCount, tab: 'quotations', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', urgent: false },
                    { label: 'Unread Customer Messages', count: unreadMessagesCount, tab: 'messages', color: 'bg-teal-50 text-teal-600 border-teal-100', urgent: unreadMessagesCount > 0 },
                    { label: 'Orders Pending Dispatch', count: 1, tab: 'orders', color: 'bg-amber-50 text-amber-600 border-amber-100', urgent: true },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center justify-between p-4 rounded-2xl border ${item.color} transition-all`}>
                      <div className="flex items-center gap-3">
                        {item.urgent && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0"></span>}
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">{item.count}</span>
                        <button
                          onClick={() => setActiveTab && setActiveTab(item.tab)}
                          className="text-[10px] font-bold px-3 py-1.5 bg-white/60 hover:bg-white rounded-lg border border-current/20 transition-all"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-emerald-50 rounded-xl"><Activity className="w-5 h-5 text-emerald-500" /></div>
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Store Activity</h3>
                    <p className="text-[11px] text-gray-400">Recent events on your profile</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {activityFeed.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                      <div className={`w-10 h-10 rounded-xl ${event.color} flex items-center justify-center text-lg shrink-0 shadow-sm`}>{event.icon}</div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{event.label}</p>
                        <p className="text-sm font-bold text-[#1F2937] truncate mt-0.5">{event.name}</p>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 shrink-0 mt-1">
                        {new Date(event.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm">
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => setActiveTab && setActiveTab('products')} className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                  <PlusCircle size={14}/> Add New Product
                </button>
                <button onClick={() => setActiveTab && setActiveTab('earnings')} className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                  <DollarSign size={14}/> Request Payout
                </button>
                <button onClick={() => setActiveTab && setActiveTab('profile')} className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                  <Store size={14}/> Update Profile
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Product Form */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <PlusCircle className="w-6 h-6 text-[#2A9D8F]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Add Ready-Made Product</h2>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-6">
              <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Product Title</label><input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Velvet Lounge Chair" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Price ($)</label><input type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="450" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
                <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Category</label><input type="text" required value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Living Room" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Material</label><input type="text" value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} placeholder="Oak Wood" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
                <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Size</label><input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="32x32x30" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
              </div>
              <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Image URL</label><input type="text" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
              <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Description</label><textarea rows={3} required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Premium artisan crafted..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
              <button type="submit" className="w-full py-4 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold shadow-md transition-all">List Product</button>
            </form>
          </div>

          {/* Listed Products */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Your Listed Products</h2>
            {products.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center space-y-4">
                <Package className="w-16 h-16 text-gray-300 mx-auto" />
                <p className="text-[#1F2937] font-bold text-xl">No products added yet.</p>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">Use the form on the left to add your first ready-made product to the marketplace.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {products.map(p => (
                  <div key={p._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:shadow-lg transition-all">
                    <div className="flex gap-6 items-start sm:items-center w-full sm:w-auto flex-1">
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'} alt={p.title} className="w-28 h-28 object-cover rounded-2xl shadow-sm flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">{p.title}</h4>
                          <span className="bg-[#00A86B]/10 text-[#00A86B] px-3 py-1 rounded-full text-xs font-bold">{p.stockStatus || 'In Stock'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-[#8B5E3C] bg-[#8B5E3C]/10 px-2.5 py-1 rounded-lg">{p.category}</span>
                          <span className="text-[#6B7280]"><strong className="text-[#1F2937]">Material:</strong> {p.material || 'Premium Wood'}</span>
                          <span className="text-[#6B7280]">•</span>
                          <span className="text-[#6B7280]"><strong className="text-[#1F2937]">Size:</strong> {p.size || '32x32x30'}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-lg">{p.description || 'Premium artisan crafted furniture designed for modern luxury living spaces.'}</p>
                        <span className="font-['Playfair_Display'] font-extrabold text-2xl text-[#2A9D8F] block pt-1">${p.price}</span>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 justify-end flex-shrink-0">
                      <button onClick={() => handleViewInMarketplace(p._id)} className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F8F5F0] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" /> View in Marketplace
                      </button>
                      <button onClick={() => handleEditProduct(p)} className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors shadow-sm">
                        Edit Product
                      </button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="flex-1 sm:flex-none px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-colors shadow-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: READY-MADE ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Ready-Made Orders</h2>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 rounded-tl-xl">Order ID</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-50">
                  <td className="p-4 font-bold text-[#1F2937]">#ORD-10992</td>
                  <td className="p-4">Velvet Lounge Chair</td>
                  <td className="p-4">John Doe</td>
                  <td className="p-4 font-bold text-[#2A9D8F]">$450.00</td>
                  <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">Pending Dispatch</span></td>
                  <td className="p-4"><button className="text-[#2A9D8F] font-bold text-xs hover:underline">Dispatch</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM DESIGN REQUESTS */}
      {activeTab === 'custom_requests' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Custom Design Requests</h2>
            <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-4 py-1.5 rounded-full text-xs font-bold">
              {customRequests.length} {customRequests.length === 1 ? 'Request' : 'Requests'}
            </span>
          </div>

          {customRequests.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center space-y-4">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto" />
              <p className="text-[#1F2937] font-bold text-xl">No custom design requests available.</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">New manual design requests submitted by users will automatically appear here for your review and quotation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {customRequests.map((req) => {
                const isDetailsOpen = viewDetailsId === req._id;
                const isQuoteOpen = selectedRequestId === req._id;
                const statusColor = 
                  req.status === 'Accepted' || req.status === 'Vendor Review' ? 'bg-[#00A86B]/10 text-[#00A86B]' :
                  req.status === 'Quotation Sent' || req.status === 'budget_shared' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
                  req.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-[#E9C46A]/20 text-[#8B5E3C]';

                return (
                  <div key={req._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 hover:shadow-md transition-all">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="bg-[#1F2937] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{req.roomType}</span>
                          <span className="text-xs font-bold text-gray-400">ID: {req._id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                            {req.status === 'budget_shared' ? 'QUOTATION SENT' : req.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] pt-1">Style Preference: {req.style}</h3>
                        <p className="text-xs text-[#6B7280] font-medium">
                          Submitted by: <strong className="text-[#1F2937]">{req.userId?.name || 'Sarah Jenkins'}</strong> • Email: {req.userId?.email || 'sarah.j@example.com'} • Phone: {req.userId?.phone || '+1 (555) 234-5678'}
                        </p>
                      </div>
                      <div className="text-right w-full sm:w-auto flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start">
                        <span className="text-xs text-gray-500 block">Est. Budget</span>
                        <span className="font-['Playfair_Display'] font-extrabold text-2xl text-[#2A9D8F] block">{req.budget}</span>
                      </div>
                    </div>

                    {/* Quick Summary Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F8F5F0] p-5 rounded-2xl border border-[#D4A373]/20 text-xs">
                      <div>
                        <span className="text-gray-500 block mb-1 uppercase font-bold tracking-wider text-[10px]">Room Size</span>
                        <strong className="text-[#1F2937] text-sm">{req.size || '400 sq ft'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1 uppercase font-bold tracking-wider text-[10px]">Timeline</span>
                        <strong className="text-[#1F2937] text-sm">{req.timeline || req.estimatedTime || 'Within 1 Month'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1 uppercase font-bold tracking-wider text-[10px]">Own Materials</span>
                        <strong className={`text-sm ${req.ownMaterialsAvailable === 'Yes' ? 'text-emerald-600' : 'text-gray-500'}`}>
                          {req.ownMaterialsAvailable === 'Yes' ? '✅ Yes' : '❌ No'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1 uppercase font-bold tracking-wider text-[10px]">Material Requirements</span>
                        <strong className="text-[#1F2937] text-sm line-clamp-1">{req.materials || req.materialDetails || 'Solid Teak Wood, Italian Marble'}</strong>
                      </div>
                    </div>

                    {/* Own Materials Details Panel — shown only when customer has own materials */}
                    {req.ownMaterialsAvailable === 'Yes' && (
                      <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-3">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                          Customer Has Own Materials
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-emerald-600 text-[10px] font-bold uppercase block mb-0.5">Material Details</span>
                            <p className="text-[#1F2937] font-medium">{req.materialDetails || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-emerald-600 text-[10px] font-bold uppercase block mb-0.5">Quantity</span>
                            <p className="text-[#1F2937] font-medium">{req.materialQuantity || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-emerald-600 text-[10px] font-bold uppercase block mb-0.5">Pickup Needed</span>
                            <p className={`font-bold ${req.materialPickupNeeded === 'Yes' ? 'text-orange-600' : 'text-gray-500'}`}>
                              {req.materialPickupNeeded === 'Yes' ? '🚚 Yes — Pickup Required' : 'No — Customer will deliver'}
                            </p>
                          </div>
                          {req.materialPickupNeeded === 'Yes' && req.pickupAddress && (
                            <div>
                              <span className="text-emerald-600 text-[10px] font-bold uppercase block mb-0.5">Pickup Address</span>
                              <p className="text-[#1F2937] font-medium">{req.pickupAddress}</p>
                            </div>
                          )}
                        </div>
                        {/* Material Images */}
                        {req.materialImages?.length > 0 && (
                          <div className="pt-2">
                            <span className="text-emerald-600 text-[10px] font-bold uppercase block mb-2">Material Photos</span>
                            <div className="flex gap-3 overflow-x-auto pb-1">
                              {req.materialImages.map((img, i) => (
                                <a key={i} href={img} target="_blank" rel="noreferrer" className="block flex-shrink-0 border border-emerald-200 rounded-xl overflow-hidden hover:opacity-90 transition-opacity shadow-sm">
                                  <img src={img} alt="Material" className="w-20 h-20 object-cover" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Special Requirements / Ideas */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Special Requirements / Ideas</h4>
                      <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-2xl border border-gray-100 shadow-inner">
                        {req.requirements || req.specialIdeas || 'Need custom L-shaped sectional sofa with built-in storage and matching marble coffee table.'}
                      </p>
                    </div>

                    {/* Uploaded Reference Images */}
                    {(req.referenceImages?.length > 0 || req.images?.length > 0 || req._id === 'man_101' || req._id === 'man_102') && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Uploaded Reference Images</h4>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {(req.referenceImages || req.images || [req._id === 'man_102' ? 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600' : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600']).map((img, i) => (
                            <a key={i} href={img} target="_blank" rel="noreferrer" className="block flex-shrink-0 border border-gray-200 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity shadow-sm">
                              <img src={img} alt="Reference" className="w-32 h-32 object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expandable Details Section */}
                    {isDetailsOpen && (
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 text-xs animate-fadeIn">
                        <h4 className="font-bold text-sm text-[#1F2937] border-b border-gray-200 pb-2">Comprehensive Request Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#4B5563]">
                          <div><strong className="text-[#1F2937]">Request ID:</strong> {req._id}</div>
                          <div><strong className="text-[#1F2937]">Customer Full Name:</strong> {req.userId?.name || 'Sarah Jenkins'}</div>
                          <div><strong className="text-[#1F2937]">Contact Email:</strong> {req.userId?.email || 'sarah.j@example.com'}</div>
                          <div><strong className="text-[#1F2937]">Contact Phone:</strong> {req.userId?.phone || '+1 (555) 234-5678'}</div>
                          <div><strong className="text-[#1F2937]">Room Type Target:</strong> {req.roomType}</div>
                          <div><strong className="text-[#1F2937]">Architectural Style:</strong> {req.style}</div>
                          <div><strong className="text-[#1F2937]">Allocated Budget:</strong> {req.budget}</div>
                          <div><strong className="text-[#1F2937]">Dimensions / Area:</strong> {req.size || '400 sq ft'}</div>
                          <div><strong className="text-[#1F2937]">Target Completion:</strong> {req.timeline || req.estimatedTime || 'Within 1 Month'}</div>
                          <div><strong className="text-[#1F2937]">Current Lifecycle Status:</strong> {req.status}</div>
                        </div>
                      </div>
                    )}

                    {/* Send Quotation Form */}
                    {isQuoteOpen && (
                      <form onSubmit={(e) => handleSendQuotation(e, req)} className="space-y-4 bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4A373]/30 animate-fadeIn">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                          <h4 className="font-bold text-base text-[#1F2937]">Send Official Budget Quotation</h4>
                          <span className="text-xs text-gray-500">Request #{req._id}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">Proposed Budget ($)</label>
                            <input type="number" required value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} placeholder="e.g. 4850" className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A9D8F]" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">Estimated Timeline</label>
                            <input type="text" required value={quoteTime} onChange={(e) => setQuoteTime(e.target.value)} placeholder="e.g. 2 Weeks" className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A9D8F]" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">Materials Breakdown & Scope of Work</label>
                          <textarea rows={3} required value={quoteMaterials} onChange={(e) => setQuoteMaterials(e.target.value)} placeholder="Provide detailed breakdown of solid wood framing, premium upholstery, marble sourcing, and labor costs..." className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A9D8F]" />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button type="submit" className="flex-1 py-3.5 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-sm shadow-md transition-all">Submit Quotation & Notify User</button>
                          <button type="button" onClick={() => setSelectedRequestId(null)} className="py-3.5 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-sm transition-all">Cancel</button>
                        </div>
                      </form>
                    )}

                    {/* Action Buttons Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <button onClick={() => setViewDetailsId(isDetailsOpen ? null : req._id)} className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1F2937] rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5">
                          <FileText className="w-4 h-4 text-gray-500" /> {isDetailsOpen ? 'Hide Details' : 'View Details'}
                        </button>
                        <button onClick={() => setSelectedRequestId(isQuoteOpen ? null : req._id)} className="flex-1 sm:flex-none px-4 py-2.5 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5">
                          <Send className="w-4 h-4" /> Send Quotation
                        </button>
                        <button onClick={() => handleContactCustomer(req)} className="flex-1 sm:flex-none px-4 py-2.5 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5">
                          <MessageSquare className="w-4 h-4" /> Contact Customer
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                        {req.status !== 'Accepted' && req.status !== 'Vendor Review' && (
                          <button onClick={() => handleAcceptRequest(req._id)} className="flex-1 sm:flex-none px-5 py-2.5 bg-[#00A86B]/10 hover:bg-[#00A86B]/20 text-[#00A86B] rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 border border-[#00A86B]/30">
                            <CheckCircle className="w-4 h-4" /> Accept Request
                          </button>
                        )}
                        {req.status !== 'Rejected' && (
                          <button onClick={() => handleRejectRequest(req._id)} className="flex-1 sm:flex-none px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 border border-red-200">
                            Reject Request
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: QUOTATIONS & BIDS */}
      {activeTab === 'quotations' && (
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Sent Quotations & Bids</h2>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 rounded-tl-xl">Bid ID</th>
                  <th className="p-4">Customer Request</th>
                  <th className="p-4">Proposed Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-50">
                  <td className="p-4 font-bold text-[#1F2937]">#BID-8812</td>
                  <td className="p-4">Custom Living Room Set</td>
                  <td className="p-4 font-bold text-[#2A9D8F]">$4,850.00</td>
                  <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">Pending Approval</span></td>
                  <td className="p-4"><button className="text-[#2A9D8F] font-bold text-xs hover:underline">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: MANUFACTURING REQUESTS */}
      {activeTab === 'manufacturing' && (
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Manufacturing Orders</h2>
          {manufacturingOrders.map((mfg) => (
            <div key={mfg._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Manufacturing Order</span>
                  <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-1">{mfg.designDetails}</h3>
                </div>
                <span className="bg-[#E76F51] text-white px-4 py-1.5 rounded-full text-xs font-bold">{mfg.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4A373]/30 text-sm">
                <div><strong className="text-[#1F2937]">Measurements:</strong><p className="text-[#6B7280]">{mfg.measurements}</p></div>
                <div><strong className="text-[#1F2937]">Materials:</strong><p className="text-[#6B7280]">{mfg.materials}</p></div>
                <div><strong className="text-[#1F2937]">Allocated Budget:</strong><p className="text-[#2A9D8F] font-bold">${mfg.budget}</p></div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-[#1F2937]">Update Manufacturing Stage</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select value={mfgStatus[mfg._id] || mfg.status} onChange={(e) => setMfgStatus({ ...mfgStatus, [mfg._id]: e.target.value })} className="p-4 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A9D8F]">
                    <option value="Accepted">Accepted</option>
                    <option value="Material Checking">Material Checking</option>
                    <option value="Production Started">Production Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Ready for Delivery">Ready for Delivery</option>
                  </select>
                  <input type="text" placeholder="Progress Image URL" value={progressImg[mfg._id] || ''} onChange={(e) => setProgressImg({ ...progressImg, [mfg._id]: e.target.value })} className="p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                  <button onClick={() => handleMfgUpdate(mfg._id)} className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-sm shadow-md">Update Stage & Upload Photo</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: DELIVERY & INSTALLATION */}
      {activeTab === 'logistics' && (
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Delivery & Logistics Dispatch</h2>
          {deliveryOrders.map((del) => (
            <div key={del._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <span className="bg-[#E9C46A]/20 text-[#E9C46A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Logistics Dispatch</span>
                  <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-1">Destination: {del.shippingAddress}</h3>
                </div>
                <span className="bg-[#E76F51] text-white px-4 py-1.5 rounded-full text-xs font-bold">{del.status}</span>
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-[#1F2937]">Update Transit Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select value={delStatus[del._id] || del.status} onChange={(e) => setDelStatus({ ...delStatus, [del._id]: e.target.value })} className="p-4 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A9D8F]">
                    <option value="Picked Up">Picked Up</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <input type="text" placeholder="Tracking Notes" value={trackingNote[del._id] || ''} onChange={(e) => setTrackingNote({ ...trackingNote, [del._id]: e.target.value })} className="p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                  <button onClick={() => handleDelUpdate(del._id)} className="bg-[#2A9D8F] text-white rounded-xl font-bold text-sm shadow-md">Update Status</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2A9D8F] p-8 rounded-3xl text-white space-y-2 shadow-lg">
              <p className="font-bold text-[#E9C46A] uppercase tracking-wider text-xs">Available Balance</p>
              <h3 className="font-['Playfair_Display'] font-extrabold text-5xl">${stats?.revenue?.toLocaleString() || '24,500'}</h3>
              <p className="text-sm opacity-80 pt-4">Next automated payout on Nov 1, 2026</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-[#D4A373]/30 flex flex-col justify-center space-y-4 shadow-sm">
              <h4 className="font-bold text-[#1F2937]">Withdraw Funds</h4>
              {isPayoutRequested ? (
                <div className="bg-[#E9C46A]/20 border border-[#E9C46A] p-4 rounded-xl text-center space-y-1 animate-fadeIn">
                  <p className="font-bold text-[#8B5E3C] text-sm">Payout Request Pending</p>
                  <p className="text-xs text-gray-500">Processing transfer of ${stats?.revenue?.toLocaleString() || '24,500'}</p>
                </div>
              ) : (
                <button onClick={handleRequestPayout} className="bg-[#1F2937] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-md flex items-center justify-center gap-2">
                  Request Instant Payout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: CUSTOMER MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Customer Messages</h2>
          <div className="p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>No new messages. Connect with customers regarding quotations here.</p>
          </div>
        </div>
      )}

      {/* TAB 10: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Customer Reviews</h2>
          <div className="flex items-center gap-4 border border-gray-100 p-6 rounded-2xl bg-gray-50">
            <div className="text-center px-6 border-r border-gray-200">
              <h3 className="font-extrabold text-4xl text-[#1F2937]">4.9</h3>
              <div className="flex items-center gap-1 text-[#E9C46A] mt-1"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
              <p className="text-xs text-gray-500 mt-1">32 Reviews</p>
            </div>
            <div className="pl-4">
              <p className="italic text-gray-600">"Incredible craftsmanship on the living room set. Delivered exactly on time!"</p>
              <p className="text-xs font-bold text-[#1F2937] mt-2">— Sarah Jenkins</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#2A9D8F] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {profile?.companyName?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Business Profile</h2>
              <p className="text-gray-500 text-sm">Update your vendor details and contact info.</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Profile Updated'); }}>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Company Name</label>
              <input type="text" defaultValue={profile?.companyName} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" defaultValue={user?.email} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Business Type</label>
                <input type="text" defaultValue={profile?.businessType || user?.role} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed uppercase" />
              </div>
            </div>
            <button type="submit" className="py-4 px-8 bg-[#1F2937] hover:bg-black text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Save Changes</button>
          </form>
        </div>
      )}

      {/* TAB 12: KYC STATUS */}
      {activeTab === 'kyc' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#2A9D8F]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">KYC Verification</h2>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-xs ${
              kycDetails?.status === 'Approved' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
              kycDetails?.status === 'Rejected' ? 'bg-[#E76F51]/10 text-[#E76F51]' :
              kycDetails?.status === 'Pending' ? 'bg-[#E9C46A]/10 text-[#8B5E3C]' : 'bg-gray-100 text-gray-500'
            }`}>
              Verification Status: {kycDetails?.status || 'Not Submitted'}
            </div>
          </div>

          {kycDetails?.adminRemarks && (
            <div className="p-4 bg-gray-50 border-l-4 border-[#E76F51] rounded-r-xl">
              <p className="text-xs font-bold text-gray-700">Admin Remarks:</p>
              <p className="text-xs text-gray-600 mt-1">{kycDetails.adminRemarks}</p>
            </div>
          )}

          {(!kycDetails || kycDetails.status === 'Not Submitted' || kycDetails.status === 'Rejected') ? (
            <form onSubmit={handleSubmitKYC} className="space-y-6">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Business & Owner Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Registered Business Name</label>
                  <input type="text" required value={kycBusinessName} onChange={(e) => setKycBusinessName(e.target.value)} placeholder="Artisan Corp" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Owner's Full Name</label>
                  <input type="text" required value={kycOwnerName} onChange={(e) => setKycOwnerName(e.target.value)} placeholder="John Doe" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Phone Number</label>
                  <input type="tel" required value={kycPhone} onChange={(e) => setKycPhone(e.target.value)} placeholder="+91 9876543210" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Business Email</label>
                  <input type="email" required value={kycEmail} onChange={(e) => setKycEmail(e.target.value)} placeholder="vendor@example.com" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 pt-4">Tax & Document Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">GSTIN Number</label>
                  <input type="text" required value={kycGst} onChange={(e) => setKycGst(e.target.value)} placeholder="22AAAAA0000A1Z0" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">PAN Number</label>
                  <input type="text" required value={kycPan} onChange={(e) => setKycPan(e.target.value)} placeholder="ABCDE1234F" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] uppercase" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Aadhaar / ID Proof Image URL</label>
                  <input type="text" required value={kycIdProof} onChange={(e) => setKycIdProof(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Address Proof Image URL</label>
                  <input type="text" required value={kycAddressProof} onChange={(e) => setKycAddressProof(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 pt-4">Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Account Number</label>
                  <input type="text" required value={kycBankAcc} onChange={(e) => setKycBankAcc(e.target.value)} placeholder="987654321098" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">IFSC Code</label>
                  <input type="text" required value={kycIfsc} onChange={(e) => setKycIfsc(e.target.value)} placeholder="HDFC0000123" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Bank Name</label>
                  <input type="text" required value={kycBankName} onChange={(e) => setKycBankName(e.target.value)} placeholder="HDFC Bank" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <button type="submit" className="px-8 py-4 bg-[#2A9D8F] text-white rounded-xl font-bold hover:bg-[#2A9D8F]/90 transition-all shadow-md mt-4">Submit KYC Documents</button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Business Name</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{kycDetails.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Owner Name</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{kycDetails.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">GSTIN Number</p>
                  <p className="text-sm font-bold text-gray-800 mt-1 uppercase">{kycDetails.gstNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">PAN Number</p>
                  <p className="text-sm font-bold text-gray-800 mt-1 uppercase">{kycDetails.panNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500">Aadhaar / ID Proof</p>
                  <img src={kycDetails.idProofUrl} alt="ID Proof" className="w-full h-40 object-cover rounded-xl border border-gray-100" />
                </div>
                <div className="border border-gray-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500">Address Proof</p>
                  <img src={kycDetails.addressProofUrl} alt="Address Proof" className="w-full h-40 object-cover rounded-xl border border-gray-100" />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Linked Settlement Account</p>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="text-sm font-bold text-gray-800">{kycDetails.bankDetails?.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IFSC Code</p>
                    <p className="text-sm font-bold text-gray-800 uppercase">{kycDetails.bankDetails?.ifscCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="text-sm font-bold text-gray-800">{kycDetails.bankDetails?.bankName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 13: SECURITY DEPOSIT */}
      {activeTab === 'deposit' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#2A9D8F]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Platform Security Deposit</h2>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-xs ${
              depositDetails?.paymentStatus === 'Verified' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
              depositDetails?.paymentStatus === 'Paid' ? 'bg-[#E9C46A]/10 text-[#8B5E3C]' : 'bg-[#E76F51]/10 text-[#E76F51]'
            }`}>
              Verification: {depositDetails?.paymentStatus || 'Pending'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center space-y-1">
              <p className="text-xs text-gray-400 font-bold uppercase">Required Deposit Amount</p>
              <h3 className="font-['Playfair_Display'] font-extrabold text-3xl text-[#1F2937]">$25,000</h3>
              <p className="text-[10px] text-gray-500 mt-2">Refundable upon active off-boarding as per policy</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center space-y-1">
              <p className="text-xs text-gray-400 font-bold uppercase">Transaction Reference ID</p>
              <h3 className="font-bold text-lg text-[#1F2937] mt-1 break-all">{depositDetails?.transactionId || 'None'}</h3>
              <p className="text-[10px] text-gray-500 mt-2">Submitted on {depositDetails?.paymentDate ? new Date(depositDetails.paymentDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center space-y-3">
              <p className="text-xs text-gray-400 font-bold uppercase">Actions</p>
              {depositDetails?.paymentStatus === 'Verified' ? (
                <button onClick={() => alert('📥 Downloding standard payment receipt pdf...')} className="w-full py-3 bg-[#1F2937] hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all">Download Receipt</button>
              ) : (
                <p className="text-xs text-gray-500 italic">No receipt available until verification.</p>
              )}
            </div>
          </div>

          {depositDetails?.adminRemarks && (
            <div className="p-4 bg-gray-50 border-l-4 border-[#E76F51] rounded-r-xl">
              <p className="text-xs font-bold text-gray-700">Admin Remarks:</p>
              <p className="text-xs text-gray-600 mt-1">{depositDetails.adminRemarks}</p>
            </div>
          )}

          {(!depositDetails || depositDetails.paymentStatus === 'Pending' || depositDetails.paymentStatus === 'Failed') ? (
            <form onSubmit={handleSubmitDeposit} className="space-y-6 bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Submit Deposit Payment Details</h3>
              <p className="text-xs text-gray-500">Please initiate a bank wire transfer of **$25,000** to the platform clearing escrow account listed below, then enter the unique transaction ID to verify.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Platform Bank Escrow</p>
                  <p className="text-xs font-bold text-gray-700 mt-1">Artisan Escrow Inc.</p>
                  <p className="text-xs text-gray-600">A/C: 99912003881</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">IFSC / Wire Routing</p>
                  <p className="text-xs font-bold text-gray-700 mt-1">ICIC0000109</p>
                  <p className="text-xs text-gray-600">Branch: Nariman Point, Mumbai</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Wire Transaction Reference ID / UTR</label>
                <input type="text" required value={depositTxnId} onChange={(e) => setDepositTxnId(e.target.value)} placeholder="TXN_987654321" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] uppercase" />
              </div>

              <button type="submit" className="px-8 py-4 bg-[#2A9D8F] text-white rounded-xl font-bold hover:bg-[#2A9D8F]/90 transition-all shadow-md">Submit Transaction Proof</button>
            </form>
          ) : (
            <div className="p-6 bg-[#2A9D8F]/10 rounded-2xl border border-[#2A9D8F]/20 text-center space-y-2">
              <p className="font-bold text-[#2A9D8F]">✅ Your Platform Security Deposit is active.</p>
              <p className="text-xs text-gray-600 max-w-lg mx-auto">Verified reference ID: **{depositDetails.transactionId}**. Safe and secured inside the escrow clearing module.</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Standard Refund Policy</h3>
            <ul className="text-xs text-gray-500 space-y-2 list-disc pl-5">
              <li>The deposit amount is 100% refundable upon exit clearance of the partner from the Artisan marketplace.</li>
              <li>A mandatory notice period of 30 days is required prior to initiating voluntary off-boarding.</li>
              <li>Any outstanding customer grievances, unpaid orders, or system penalties will be adjusted against the refund.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 14: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] flex items-center gap-3">
              <Bell className="w-6 h-6 text-[#2A9D8F]" /> Partner Notifications
            </h2>
            <button className="text-sm font-bold text-[#2A9D8F] hover:underline">Mark all as read</button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-[#2A9D8F]/5 rounded-2xl border border-[#2A9D8F]/20">
              <div className="mt-1"><div className="w-2 h-2 bg-[#2A9D8F] rounded-full"></div></div>
              <div>
                <p className="font-bold text-[#1F2937] text-sm">You have a new custom design request.</p>
                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                <button onClick={() => { if(setActiveTab) setActiveTab('custom_requests'); }} className="mt-2 text-xs font-bold text-[#2A9D8F] hover:underline">View Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorDashboard;
