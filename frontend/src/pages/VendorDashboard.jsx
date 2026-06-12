import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import axios from 'axios';
import { 
  Store, Hammer, Truck, CheckCircle, PlusCircle, DollarSign, UploadCloud, 
  Send, RefreshCw, Eye, ArrowRight, ClipboardList, Package, MessageSquare, 
  Star, Briefcase, ShieldCheck, Bell, ShoppingCart, FileText, Activity,
  Search, Filter, Calendar, MapPin, Phone, Mail, Check, X, Download, AlertTriangle, ChevronRight, Bot, AlertCircle, HelpCircle, XCircle, CreditCard, Trash2
} from 'lucide-react';
import AiFallbackImage from '../components/AiFallbackImage';

const VendorDashboard = ({ 
  activeTab = 'overview', 
  setActiveTab,
  notifications = [],
  onNotifClick,
  onMarkAllRead,
  searchQuery = '',
  highlightRequestId = null
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  // Vendor/Seller State
  const [products, setProducts] = useState([]);
  const filteredProducts = products.filter(p => 
    !searchQuery || 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.material?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [customRequests, setCustomRequests] = useState([]);
  const [customRequestFilter, setCustomRequestFilter] = useState('All');
  const [aiDesignOrders, setAiDesignOrders] = useState([]);
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
  const [quoteUPI, setQuoteUPI] = useState('');
  const [quoteQR, setQuoteQR] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [viewDetailsId, setViewDetailsId] = useState(null);

  // Payment Method State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [quoteBankHolder, setQuoteBankHolder] = useState('');
  const [quoteBankAccount, setQuoteBankAccount] = useState('');
  const [quoteBankIFSC, setQuoteBankIFSC] = useState('');
  const [quoteBankName, setQuoteBankName] = useState('');
  const [quotePaymentGateway, setQuotePaymentGateway] = useState('');
  const [quoteCashOnVisit, setQuoteCashOnVisit] = useState(false);

  // Suggest Vendor State
  const [suggestedVendorId, setSuggestedVendorId] = useState('');
  const [suggestNote, setSuggestNote] = useState('');
  
  // Real-time backend sync trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('mockOrdersUpdated', handler);
    return () => window.removeEventListener('mockOrdersUpdated', handler);
  }, []);

  // Manufacturer State
  const [manufacturingOrders, setManufacturingOrders] = useState([]);
  const [mfgStatus, setMfgStatus] = useState({});
  const [progressImg, setProgressImg] = useState({});
  const [pendingVerificationOrders, setPendingVerificationOrders] = useState([]);
  const [verificationProcessing, setVerificationProcessing] = useState({});
  const [trackingProcessing, setTrackingProcessing] = useState({});

  // Delivery State
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [delStatus, setDelStatus] = useState({});
  const [trackingNote, setTrackingNote] = useState({});
  const [delPartner, setDelPartner] = useState({});
  const [delContact, setDelContact] = useState({});
  const [delTrackingId, setDelTrackingId] = useState({});
  const [installPartner, setInstallPartner] = useState({});
  const [installDate, setInstallDate] = useState({});
  const [installTechName, setInstallTechName] = useState({});
  const [installTechContact, setInstallTechContact] = useState({});
  const [installAddress, setInstallAddress] = useState({});
  const [installExpectedCompletion, setInstallExpectedCompletion] = useState({});
  const [installStatus, setInstallStatus] = useState({});
  const [installTime, setInstallTime] = useState({});
  const [installNotes, setInstallNotes] = useState({});
  const [expectedDelDate, setExpectedDelDate] = useState({});
  const [isPayoutRequested, setIsPayoutRequested] = useState(false);

  // Ready-made Orders Workflow States
  const [readyMadeOrders, setReadyMadeOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All');
  const [orderCategoryFilter, setOrderCategoryFilter] = useState('All');
  
  // Sync global search query to local search states
  useEffect(() => {
    setOrderSearch(searchQuery);
    setInvSearch(searchQuery);
  }, [searchQuery]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [assignPartnerId, setAssignPartnerId] = useState('');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [installationRequiredInput, setInstallationRequiredInput] = useState(false);

  // Verification and Store Setup States
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [storeSetupDetails, setStoreSetupDetails] = useState(null);

  // Business Verification form states
  const [verifyBusinessName, setVerifyBusinessName] = useState('');
  const [verifyOwnerName, setVerifyOwnerName] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyGst, setVerifyGst] = useState('');
  const [verifyPan, setVerifyPan] = useState('');
  const [verifyIdProof, setVerifyIdProof] = useState('');
  const [verifyAddressProof, setVerifyAddressProof] = useState('');
  const [verifyBusinessAddress, setVerifyBusinessAddress] = useState('');
  const [verifyGstCertificate, setVerifyGstCertificate] = useState('');
  const [verifyBusinessLicense, setVerifyBusinessLicense] = useState('');

  // Store Setup Form States
  const [storeBrandName, setStoreBrandName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeSupportEmail, setStoreSupportEmail] = useState('');
  const [storeSupportPhone, setStoreSupportPhone] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeBankAcc, setStoreBankAcc] = useState('');
  const [storeIfsc, setStoreIfsc] = useState('');
  const [storeBankName, setStoreBankName] = useState('');

  // Lifted Inventory & Payout States
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [invSearch, setInvSearch] = useState('');
  const [invFilter, setInvFilter] = useState('All');

  // Edit Product Modal State
  const [editProduct, setEditProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('Living Room');
  const [editMaterial, setEditMaterial] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editStock, setEditStock] = useState(10);

  const [payoutHistory, setPayoutHistory] = useState([]);
  const [reqAmount, setReqAmount] = useState('');
  const [reqMethod, setReqMethod] = useState('Bank Transfer');
  const [reqAccount, setReqAccount] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [submitted, setSubmitted] = useState(false);


  const [directMessages, setDirectMessages] = useState([]);
  const [vendorMsgInput, setVendorMsgInput] = useState('');
  const [selectedUserMsg, setSelectedUserMsg] = useState('');

  // Help Center Live Chat States
  const [helpMessages, setHelpMessages] = useState([]);
  const [helpInput, setHelpInput] = useState('');
  const [selectedHelpUser, setSelectedHelpUser] = useState('');

  // Store Reviews
  const [vendorReviews, setVendorReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    if (activeTab === 'reviews') {
      const fetchVendorReviews = async () => {
        setReviewsLoading(true);
        setReviewsError(null);
        try {
          const res = await axios.get('/vendor/reviews');
          if (res.data && res.data.success) {
            setVendorReviews(res.data.data);
          }
        } catch (err) {
          console.warn('Failed to load vendor reviews:', err);
          setReviewsError('Failed to load reviews. Please try again.');
        } finally {
          setReviewsLoading(false);
        }
      };
      fetchVendorReviews();
    }
  }, [activeTab]);

  const chatEndRef = useRef(null);

  const loadMessages = () => {
    const msgs = [];
    setDirectMessages(msgs);
    
    // Auto-select first user if none selected
    if (msgs.length > 0 && !selectedUserMsg) {
      const uniqueUsers = Array.from(new Set(msgs.map(m => m.userName)));
      if (uniqueUsers.length > 0) {
        setSelectedUserMsg(uniqueUsers[0]);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      loadMessages();
      window.addEventListener('mockChatUpdated', loadMessages);
      const interval = setInterval(loadMessages, 2500);
      return () => {
        window.removeEventListener('mockChatUpdated', loadMessages);
        clearInterval(interval);
      };
    }
  }, [activeTab, selectedUserMsg]);

  useEffect(() => {
    if (activeTab === 'messages' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [directMessages, activeTab, selectedUserMsg]);

  useEffect(() => {
    if (activeTab === 'support') {
      const loadHelpMessages = async () => {
        try {
          const res = await axios.get('/chat/sync');
          if (res.data && res.data.success) {
            const msgs = res.data.data;
            setHelpMessages(msgs);
            
            // Auto-select first customer support chat if none is selected
            if (msgs.length > 0 && !selectedHelpUser) {
              const uniqueUsers = Array.from(new Set(msgs.map(m => m.userName)));
              if (uniqueUsers.length > 0) {
                setSelectedHelpUser(uniqueUsers[0]);
              }
            }
          }
        } catch (err) {
          console.warn('Failed to load chat messages:', err);
        }
      };
      loadHelpMessages();
      const interval = setInterval(loadHelpMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedHelpUser]);

  const handleSendVendorDirectMessage = (e) => {
    e.preventDefault();
    if (!vendorMsgInput.trim() || !selectedUserMsg) return;

    // Find the roomId from existing msgs
    const customerMsgs = directMessages.filter(m => m.userName === selectedUserMsg);
    const roomId = customerMsgs.length > 0 ? customerMsgs[0].roomId : 'unknown_room';
    const userEmail = customerMsgs.length > 0 ? customerMsgs[0].userEmail : 'user@example.com';

    const newMsg = {
      _id: 'dm_' + Date.now(),
      roomId: roomId,
      userName: selectedUserMsg,
      userEmail: userEmail,
      senderRole: 'vendor',
      senderName: profile?.companyName || 'Vendor',
      message: vendorMsgInput,
      createdAt: new Date().toISOString()
    };

    const existing = [];
    const updated = [...existing, newMsg];
    
    setDirectMessages(updated);
    setVendorMsgInput('');

    // Trigger notification to user
    const notifObj = {
      _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message: `New message from ${profile?.companyName || 'Vendor'}: "${vendorMsgInput.substring(0, 30)}..."`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    };
    const uNotifs = [];
    

    // Trigger notification to admin
    const aNotifObj = {
      _id: `anotif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message: `Vendor reply from ${profile?.companyName || 'Vendor'} to ${selectedUserMsg}: "${vendorMsgInput.substring(0, 30)}..."`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    };
    const aNotifs = [];
    
  };

  const handleSendVendorHelpMessage = async (e) => {
    e.preventDefault();
    if (!helpInput.trim() || !selectedHelpUser) return;

    const companyName = profile?.companyName || 'Artisan Workshop Ltd';

    // Find the user's email to respond to the correct thread
    const userMsg = helpMessages.find(m => m.userName === selectedHelpUser);
    const userEmail = userMsg ? userMsg.userEmail : 'user@example.com';

    const newMsg = {
      _id: 'hm_' + Date.now(),
      userName: selectedHelpUser,
      userEmail: userEmail,
      senderRole: 'vendor',
      senderName: companyName,
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

    // Trigger notification to user
    const notifObj = {
      _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message: `[Help Center] Support reply from ${companyName}: "${helpInput.substring(0, 30)}..."`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    };
    const uNotifs = [];
    
  };

  const fetchPartnerData = async () => {
    const vendorId = user?._id;

    const results = await Promise.allSettled([
      axios.get('/vendor/profile'),
      axios.get('/vendor/verification'),
      axios.get('/vendor/store-setup'),
      axios.get('/vendor/requests'),
      axios.get('/vendor/orders'),
      vendorId ? axios.get('/products?vendorId=' + vendorId) : Promise.resolve(null),
    ]);

    const [profileRes, verifRes, storeRes, reqRes, ordersRes, prodRes] = results;

    if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
      setProfile(profileRes.value.data.data.vendor);
      setStats(profileRes.value.data.data.stats);
    }

    if (verifRes.status === 'fulfilled' && verifRes.value.data.success) {
      const currentVerification = verifRes.value.data.data;
      setVerificationDetails(currentVerification);
      if (currentVerification && currentVerification.status !== 'Not Submitted') {
        setVerifyBusinessName(currentVerification.businessName || '');
        setVerifyOwnerName(currentVerification.ownerName || '');
        setVerifyPhone(currentVerification.phone || '');
        setVerifyEmail(currentVerification.email || '');
        setVerifyGst(currentVerification.gstNumber || '');
        setVerifyPan(currentVerification.panNumber || '');
        setVerifyIdProof(currentVerification.idProofUrl || '');
        setVerifyAddressProof(currentVerification.addressProofUrl || '');
      }
    }

    if (storeRes.status === 'fulfilled' && storeRes.value.data.success) {
      const currentStoreSetup = storeRes.value.data.data;
      setStoreSetupDetails(currentStoreSetup);
      if (currentStoreSetup && currentStoreSetup.status !== 'Not Submitted') {
        setStoreBrandName(currentStoreSetup.brandName || '');
        setStoreDescription(currentStoreSetup.description || '');
        setStoreSupportEmail(currentStoreSetup.supportEmail || '');
        setStoreSupportPhone(currentStoreSetup.supportPhone || '');
        setStoreAddress(currentStoreSetup.address || '');
        setStoreBankAcc(currentStoreSetup.bankDetails?.accountNumber || '');
        setStoreIfsc(currentStoreSetup.bankDetails?.ifscCode || '');
        setStoreBankName(currentStoreSetup.bankDetails?.bankName || '');
      }
    }

    if (reqRes.status === 'fulfilled' && reqRes.value.data.success) {
      setCustomRequests(reqRes.value.data.data);
    } else {
      setCustomRequests([]);
    }

    if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
      const localOrders = ordersRes.value.data.data;
      let mktOrders = localOrders.filter(o => o.orderType === 'Marketplace Product');
      setReadyMadeOrders(mktOrders);
      
      const mfgOrders = localOrders
        .filter(o => o.orderStatus === 'Production Started' || o.orderStatus === 'Manufacturing' || o.orderStatus === 'Ready for Delivery')
        .map(o => ({
          _id: o._id,
          orderId: o._id,
          designDetails: o.orderType === 'AI Design' && o.aiDesignData?.roomType
            ? 'AI Design - ' + o.aiDesignData.roomType
            : o.orderType + ' - Order ' + o._id.substring(o._id.length - 4),
          measurements: o.orderType === 'AI Design' && o.aiDesignData?.measurements
            ? o.aiDesignData.measurements
            : o.designRequestId ? 'Standard dimensions / Custom details on request' : 'Standard Product Size',
          materials: o.quotationMaterials || (o.orderType === 'AI Design' && o.aiDesignData?.materials?.join(', ')) || 'Wood, Premium Fabrics',
          budget: o.quotationAmount || o.totalAmount,
          status: o.orderStatus,
          progressImages: o.progressImages || []
        }));
      setManufacturingOrders(mfgOrders);

      const pendingOrders = localOrders.filter(o => o.orderStatus === 'Awaiting Vendor Verification');
      setPendingVerificationOrders(pendingOrders);

      const deliveryTrackingStatuses = ['Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed', 'Completed'];
      const delOrders = localOrders
        .filter(o => deliveryTrackingStatuses.includes(o.orderStatus))
        .map(o => ({
          _id: o._id,
          orderId: o._id,
          shippingAddress: o.shippingAddress || '742 Evergreen Terrace, Springfield',
          status: o.orderStatus,
          trackingNotes: o.trackingNotes || 'Dispatched from central hub',
          userId: o.userId,
          customerName: o.customerName,
          designDetails: o.designDetails
        }));
      setDeliveryOrders(delOrders);
      
      const aiOrders = localOrders.filter(o => o.orderType === 'AI Design');
      setAiDesignOrders(aiOrders);
    }

    if (prodRes.status === 'fulfilled' && prodRes.value?.data?.success) {
      setProducts(prodRes.value.data.data);
    }
  };

  useEffect(() => {
    fetchPartnerData();

    const handleSync = () => {
      fetchPartnerData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // Scroll to and highlight the request from notification
  useEffect(() => {
    if (customRequests.length > 0 && highlightRequestId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`request-${highlightRequestId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        localStorage.removeItem('highlightRequestId');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [customRequests, highlightRequestId]);

  // Ready-made Orders Action Handlers
  const triggerNotification = (recipient, message, type = 'info') => {
    // API based notifications should ideally be triggered by the backend controllers during the update process.
    // The UI can rely on the backend to create them, so we no longer manually manipulate localStorage here.
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/vendor/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
        }
        await fetchPartnerData(); // Refresh the list from the backend
      }
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Error updating order status.');
    }
  };

  const handleDispatchOrder = async (orderId, partner, trackingId, installationReq) => {
    if (!partner || !trackingId.trim()) {
      alert('Please select a delivery partner and enter a tracking ID.');
      return;
    }
    
    try {
      const res = await axios.put(`/vendor/orders/${orderId}/dispatch`, { 
        deliveryPartner: partner, 
        trackingId, 
        installationRequired: installationReq 
      });
      
      if (res.data.success) {
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({
            ...prev,
            orderStatus: 'Dispatched',
            deliveryPartnerId: { companyName: partner },
            trackingId,
            installationRequired: installationReq
          }));
        }
        await fetchPartnerData();
        alert('✅ Order marked as Dispatched. Delivery partner assigned.');
      }
    } catch (err) {
      console.error('Failed to dispatch order', err);
      alert('Error dispatching order.');
    }
  };

  const handleApproveReturn = async (orderId) => {
    try {
      const res = await axios.put(`/vendor/orders/${orderId}/return`);
      if (res.data.success) {
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, orderStatus: 'Cancelled', returnStatus: 'Approved', hasReturnRequest: false }));
        }
        await fetchPartnerData();
        alert('Return request approved. Status set to Cancelled.');
      }
    } catch (err) {
      console.error('Failed to approve return', err);
      alert('Error approving return.');
    }
  };

  const handleRejectReturn = (orderId) => {
    const localOrders = [];
    const currentVendorId = profile?._id;
    
    const updated = localOrders.map(o => {
      if (o._id === orderId) {
        triggerNotification('user', `Your return request for order #${orderId.slice(-6)} has been declined.`, 'warning');
        triggerNotification('admin', `Return rejected by vendor for order #${orderId.slice(-6)}`, 'warning');
        return { ...o, returnStatus: 'Rejected', hasReturnRequest: false };
      }
      return o;
    });
    
    
    setReadyMadeOrders(updated.filter(o => o.orderType === 'Marketplace Product' && (o.vendorId?._id === currentVendorId || o.vendorId === currentVendorId)));
    
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, returnStatus: 'Rejected', hasReturnRequest: false }));
    }
    alert('Return request declined.');
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    try {
      const res = await axios.delete(`/vendor/orders/${orderId}`);
      if (res.data.success) {
        showToast('success', 'Order deleted successfully');
        setReadyMadeOrders(prev => prev.filter(o => o._id !== orderId));
      } else {
        showToast('error', res.data.message || 'Failed to delete order');
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error deleting order');
    }
  };

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow popups to view the invoice.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1F2937; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px; }
            .invoice-title { font-size: 28px; font-weight: 800; color: #8B5E3C; margin: 0; }
            .details { margin: 30px 0; display: flex; justify-content: space-between; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; font-size: 14px; }
            .table th { background-color: #F9FAFB; font-weight: 700; color: #4B5563; }
            .total { text-align: right; font-size: 20px; font-weight: 800; margin-top: 30px; color: #8B5E3C; }
            .footer { margin-top: 60px; font-size: 12px; color: #9CA3AF; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: auto;">
            <div class="header">
              <div>
                <h1 class="invoice-title">ArtisanStudio Marketplace</h1>
                <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Order ID: ${order._id}</p>
                <p style="margin: 2px 0 0 0; color: #6B7280; font-size: 14px;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div style="text-align: right;">
                <h3 style="margin: 0; color: #1F2937;">${order.vendorId?.companyName || 'Artisan Workshop'}</h3>
                <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">vendor@example.com</p>
              </div>
            </div>
            
            <div class="details">
              <div>
                <strong style="color: #4B5563; font-size: 12px; text-transform: uppercase;">Billed To:</strong>
                <p style="margin: 5px 0 0 0; font-weight: 600;">${order.userId?.name || 'Customer'}</p>
                <p style="margin: 2px 0 0 0; color: #4B5563;">${order.userId?.email || 'user@example.com'}</p>
                <p style="margin: 2px 0 0 0; color: #4B5563;">${order.userId?.phone || ''}</p>
              </div>
              <div style="text-align: right;">
                <strong style="color: #4B5563; font-size: 12px; text-transform: uppercase;">Shipping Address:</strong>
                <p style="margin: 5px 0 0 0; white-space: pre-line;">${order.shippingAddress || '123 Customer St'}</p>
              </div>
            </div>
            
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="width: 100px;">Quantity</th>
                  <th style="width: 120px;">Unit Price</th>
                  <th style="width: 120px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 600; color: #1F2937;">${order.productDetails?.title}</td>
                  <td>${order.productDetails?.quantity || 1}</td>
                  <td>$${order.productDetails?.price}</td>
                  <td style="text-align: right; font-weight: 600;">$${order.totalAmount}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="total">
              Total Amount Paid: $${order.totalAmount}
            </div>
            
            <div class="footer">
              Thank you for supporting independent artisans and craftsmen! <br/>
              © ${new Date().getFullYear()} ArtisanStudio Marketplace. All rights reserved.
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (selectedOrder) {
      // Replaced mock chat fetch
      const chats = [];
      if (chats.length === 0) {
        const initial = [
          { sender: 'customer', text: `Hi! I placed this order. Could you please make sure it's packed securely?`, time: new Date(selectedOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
        ];
        setChatMessages(initial);
      } else {
        setChatMessages(chats);
      }
      
      // Initialize inputs inside the details panel
      setAssignPartnerId(selectedOrder.deliveryPartnerId?.companyName || '');
      setTrackingIdInput(selectedOrder.trackingId || '');
      setInstallationRequiredInput(selectedOrder.installationRequired || false);
    }
  }, [selectedOrder]);

  // Live-refresh ready-made marketplace orders, custom requests and manufacturing orders whenever vendor switches tabs
  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'custom_requests' || activeTab === 'manufacturing') {
      fetchPartnerData();
    }
  }, [activeTab]);

  const handleSendChatMessage = () => {
    if (!chatMessageInput.trim() || !selectedOrder) return;
    const newMessage = {
      sender: 'vendor',
      text: chatMessageInput,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    const updated = [...chatMessages, newMessage];
    setChatMessages(updated);
    
    setChatMessageInput('');
    
    // Trigger notification to user
    triggerNotification('user', `New message from Vendor for order #${selectedOrder._id.slice(-6)}`, 'info');
    
    // Simulate customer auto-reply after 1.5 seconds
    setTimeout(() => {
      const reply = {
        sender: 'customer',
        text: `Thanks for the update! Appreciate the quick response.`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      const current = chatMessages;
      const updatedWithReply = [...current, reply];
      setChatMessages(updatedWithReply);
      
      
      // Notify vendor
      triggerNotification('vendor', `New message from Customer for order #${selectedOrder._id.slice(-6)}`, 'info');
    }, 1500);
  };

  const getFilteredOrders = () => {
    return readyMadeOrders.filter(o => {
      // 1. Search Query
      const matchSearch = o._id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.productDetails?.title?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.userId?.name?.toLowerCase().includes(orderSearch.toLowerCase());
                          
      // 2. Status Filter
      const matchStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
      
      // 3. Category Filter
      const matchCategory = orderCategoryFilter === 'All' || o.productDetails?.category === orderCategoryFilter;
      
      // 4. Date Filter
      let matchDate = true;
      if (orderDateFilter !== 'All') {
        const orderTime = new Date(o.createdAt).getTime();
        const now = Date.now();
        if (orderDateFilter === 'Today') {
          const startOfToday = new Date().setHours(0,0,0,0);
          matchDate = orderTime >= startOfToday;
        } else if (orderDateFilter === 'Last 7 Days') {
          const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
          matchDate = orderTime >= sevenDaysAgo;
        } else if (orderDateFilter === 'Last 30 Days') {
          const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
          matchDate = orderTime >= thirtyDaysAgo;
        }
      }
      
      return matchSearch && matchStatus && matchCategory && matchDate;
    });
  };

  // Vendor Actions
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const payload = {
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      category: newCategory,
      material: newMaterial || 'Oak Wood',
      size: newSize || '32x32x30',
      images: [
        newImage ||
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'
      ],
      stock: 10,
      approvalStatus: 'Approved'
    };

    try {
      const res = await axios.post('/products', payload);
      if (res.data?.success) {
        // Keep inventory tab in sync (this is UI-only).
        setInventoryProducts(prev => [
          { _id: res.data.data._id, ...payload, lowStockThreshold: 5 },
          ...prev
        ]);
        await fetchPartnerData(); // Refresh products so it appears on User Dashboard too.
        showToast('✅ Product listed successfully. Now live in Marketplace!', 'success');
        // Switch to inventory tab showing the newly added product
        if (setActiveTab) setActiveTab('inventory');
      } else {
        showToast(res.data?.message || 'Failed to list product.', 'error');
      }
    } catch (err) {
      console.error('Failed to create product', err);
      showToast(err.response?.data?.message || 'Failed to list product.', 'error');
    }

    setNewTitle('');
    setNewDesc('');
    setNewPrice('');
    setNewMaterial('');
    setNewSize('');
    setNewImage('');
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = async (p) => {
    setEditProduct(p);
    setEditTitle(p.title || '');
    setEditPrice(p.price?.toString() || '');
    setEditDesc(p.description || '');
    setEditCategory(p.category || 'Living Room');
    setEditMaterial(p.material || '');
    setEditSize(p.size || '');
    setEditImage(p.images?.[0] || '');
    setEditStock(p.stock ?? 10);
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    const payload = {
      title: editTitle,
      price: Number(editPrice),
      description: editDesc,
      category: editCategory,
      material: editMaterial || 'Oak Wood',
      size: editSize || '32x32x30',
      stock: editStock,
      images: [editImage || editProduct.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60']
    };
    try {
      const res = await axios.put(`/products/${editProduct._id}`, payload);
      if (res.data?.success) {
        const updated = res.data.data;
        setProducts(prev => prev.map(item => item._id === editProduct._id ? updated : item));
        setInventoryProducts(prev => prev.map(item => item._id === editProduct._id ? { ...updated, lowStockThreshold: item.lowStockThreshold || 5 } : item));
        await fetchPartnerData();
        showToast('✅ Product updated successfully!', 'success');
      } else {
        showToast(res.data?.message || 'Failed to update product.', 'error');
      }
    } catch (err) {
      console.error('Failed to update product', err);
      showToast(err.response?.data?.message || 'Failed to update product.', 'error');
    }
    setEditProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    try {
      const res = await axios.delete(`/products/${id}`);
      if (res.data?.success) {
        setProducts(prev => prev.filter(item => item._id !== id));
        setInventoryProducts(prev => prev.filter(item => item._id !== id));
        await fetchPartnerData();
        showToast('🗑️ Product deleted successfully!', 'success');
      } else {
        showToast(res.data?.message || 'Failed to delete product.', 'error');
      }
    } catch (err) {
      console.error('Failed to delete product', err);
      showToast(err.response?.data?.message || 'Failed to delete product.', 'error');
    }
  };

  const handleViewInMarketplace = (id) => {
    alert(`Redirecting to User Dashboard -> Marketplace Product #${id}...`);
    window.location.href = `/marketplace/product/${id}`;
  };

  // Helper: update a request's status in localStorage so it persists across refreshes
  const updateRequestStatusInStorage = (id, newStatus, extraFields = {}) => {
    try {
      const stored = [];
      const hasManual = stored.some(r => r._id === id);
      if (hasManual) {
        const updated = stored.map(r => r._id === id ? { ...r, status: newStatus, ...extraFields } : r);
        
      }

      const storedDesigner = [];
      const hasDesigner = storedDesigner.some(r => r._id === id);
      if (hasDesigner) {
        const updated = storedDesigner.map(r => r._id === id ? { ...r, status: newStatus, ...extraFields } : r);
        
      }
    } catch (err) {
      console.error('Failed to update localStorage status', err);
    }
  };

  const handleSendQuotation = async (e, req) => {
    e.preventDefault();
    try {
      const res = await axios.post('/vendor/quotations', {
         userId: req.userId._id || req.userId,
         designType: 'manual',
         designRequestId: req._id,
         budgetAmount: quoteAmount,
         materialsBreakdown: quoteMaterials,
         estimatedTime: quoteTime
      });
      if (res.data.success) {
         setCustomRequests(customRequests.map(r => r._id === req._id ? { ...r, status: 'Quotation Sent', quotationAmount: quoteAmount } : r));
         alert('Quotation sent to customer successfully! User has been notified.');
         setSelectedRequestId(null); setQuoteAmount(''); setQuoteMaterials(''); setQuoteTime(''); setQuoteUPI(''); setQuoteQR(''); resetPaymentFields();
      }
    } catch (err) {
      console.error(err);
      alert('Error sending quotation.');
    }
  };

  const resetPaymentFields = () => {
    setSelectedPaymentMethod('upi');
    setQuoteBankHolder(''); setQuoteBankAccount(''); setQuoteBankIFSC(''); setQuoteBankName('');
    setQuotePaymentGateway(''); setQuoteCashOnVisit(false);
  };

  const handleAcceptRequest = async (id) => {
    try {
      const res = await axios.post(`/vendor/requests/${id}/accept`);
      if (res.data.success) {
         setCustomRequests(customRequests.map(r => r._id === id ? { ...r, status: 'Accepted' } : r));
         alert('✅ Design request accepted successfully! The user has been notified.');
      }
    } catch(err) {
      console.error(err);
      alert('Error accepting request.');
    }
  };

  const handleRejectRequest = async (id) => {
    if (!confirm('Are you sure you want to reject this design request?')) return;
    try {
      const res = await axios.post(`/vendor/requests/${id}/reject`);
      if (res.data.success) {
         setCustomRequests(customRequests.map(r => r._id === id ? { ...r, status: 'Rejected' } : r));
         alert('❌ Design request rejected. The user has been notified.');
      }
    } catch(err) {
      console.error(err);
      alert('Error rejecting request.');
    }
  };

  const handleSendAiOrderQuotation = async (e, order) => {
    e.preventDefault();
    const localOrders = [];
    const updated = localOrders.map(o =>
      o._id === order._id
        ? { ...o, orderStatus: 'quotation_sent', quotationAmount: quoteAmount, quotationMaterials: quoteMaterials, quotationTime: quoteTime, quotationUPI: quoteUPI, quotationQR: quoteQR, quotationPaymentMethod: selectedPaymentMethod, quotationBankHolder: quoteBankHolder, quotationBankAccount: quoteBankAccount, quotationBankIFSC: quoteBankIFSC, quotationBankName: quoteBankName, quotationPaymentGateway: quotePaymentGateway, quotationCashOnVisit: quoteCashOnVisit }
        : o
    );
    
    setAiDesignOrders(updated.filter(o => o.orderType === 'AI Design' && (o.vendorId?._id === (profile?._id) || o.vendorId === (profile?._id))));

    const localUserNotifs = [];
    

    alert('Quotation sent to customer for AI Design order!');
    setSelectedRequestId(null); setQuoteAmount(''); setQuoteMaterials(''); setQuoteTime(''); setQuoteUPI(''); setQuoteQR(''); resetPaymentFields();
  };

  const handleAcceptAiOrder = async (orderId) => {
    const localOrders = [];
    const updated = localOrders.map(o =>
      o._id === orderId ? { ...o, orderStatus: 'Accepted' } : o
    );
    
    const vendorId = profile?._id;
    setAiDesignOrders(
      updated.filter(o =>
        o.orderType === 'AI Design' &&
        (o.vendorId?._id === vendorId || o.vendorId === vendorId)
      )
    );
    const localUserNotifs = [];
    
    alert('✅ AI Design request accepted! You can now review details and send a quotation.');
  };

  const handleRejectAiOrder = async (orderId) => {
    if (!confirm('Are you sure you want to reject this AI Design request?')) return;
    const localOrders = [];
    const updated = localOrders.map(o =>
      o._id === orderId ? { ...o, orderStatus: 'Rejected' } : o
    );
    
    const vendorId = profile?._id;
    setAiDesignOrders(
      updated.filter(o =>
        o.orderType === 'AI Design' &&
        (o.vendorId?._id === vendorId || o.vendorId === vendorId)
      )
    );

    const localAdminNotifs = [];
    

    alert('❌ AI Design request rejected.');
  };

  const handleContactCustomer = (req) => {
    const email = req.userId?.email || 'customer@example.com';
    const phone = req.userId?.phone || '+1 (555) 234-5678';
    const name = req.userId?.name || 'Customer';
    alert(`📞 Contacting ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n\nOpening your default email client...`);
    window.location.href = `mailto:${email}?subject=Regarding your Custom Design Request #${req._id}&body=Hello ${name}, we are reviewing your interior design request...`;
  };

  const handleDownloadAiReport = (req) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow popups to view the report.');
      return;
    }
    const furniture = req.requirements?.match(/Furniture \(([^)]+)\)/)?.[1] || req.materials || 'Custom furniture set';
    const materials = req.requirements?.match(/Materials \(([^)]+)\)/)?.[1] || req.materialDetails || 'Premium materials';
    const budget = req.budget || '₹3,000 - ₹5,000';
    printWindow.document.write(`
      <html>
        <head>
          <title>AI Design Report - ${req._id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1F2937; max-width: 900px; margin: auto; }
            .header { border-bottom: 3px solid #8B5E3C; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #8B5E3C; margin: 0; font-size: 28px; }
            .section { margin: 25px 0; padding: 20px; background: #F8F5F0; border-radius: 12px; border: 1px solid #D4A373; }
            .section h2 { color: #8B5E3C; font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .label { color: #6B7280; font-size: 11px; text-transform: uppercase; font-weight: 700; }
            .value { font-size: 14px; font-weight: 600; margin-top: 2px; }
            .images { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; }
            .images img { width: 200px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #D4A373; }
            .footer { margin-top: 40px; text-align: center; color: #9CA3AF; font-size: 11px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AI Generated Design Report</h1>
            <p style="color: #6B7280; margin: 5px 0 0 0;">Request ID: ${req._id} • Generated by AI Interior Studio</p>
          </div>
          <div class="section">
            <h2>Request Overview</h2>
            <div class="grid">
              <div><div class="label">Room Type</div><div class="value">${req.roomType || 'Living Room'}</div></div>
              <div><div class="label">Status</div><div class="value">${req.status}</div></div>
              <div><div class="label">Customer</div><div class="value">${req.userId?.name || 'Customer'}</div></div>
              <div><div class="label">Budget</div><div class="value">${budget}</div></div>
              <div><div class="label">Timeline</div><div class="value">${req.timeline || 'Flexible'}</div></div>
              <div><div class="label">Style</div><div class="value">${req.style || 'AI Generated'}</div></div>
            </div>
          </div>
          <div class="section">
            <h2>AI Recommendations</h2>
            <div class="grid">
              <div><div class="label">Furniture</div><div class="value">${furniture}</div></div>
              <div><div class="label">Materials</div><div class="value">${materials}</div></div>
            </div>
          </div>
          ${req.referenceImages?.length > 0 ? `
          <div class="section">
            <h2>Reference Images</h2>
            <div class="images">
              ${req.referenceImages.map(img => `<img src="${img}" alt="Reference" />`).join('')}
            </div>
          </div>` : ''}
          <div class="footer">
            Generated on ${new Date().toLocaleString()} • AI Interior Platform
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSuggestVendor = async (e, reqId) => {
    e.preventDefault();
    alert('Suggested alternative vendor successfully!');
    setSuggestedVendorId(''); setSuggestNote('');
  };

  const handleForwardMfg = async (orderId) => {
    alert('Order forwarded to manufacturer successfully!');
  };

  const handleProgressImageUpload = (e, orderId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProgressImg(prev => ({ ...prev, [orderId]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Unified Tracking Update — calls backend POST /api/orders/tracking/:orderId/update
  const handleTrackingUpdate = async (id, status, extra) => {
    setTrackingProcessing(prev => ({ ...prev, [id]: true }));
    try {
      const payload = { status };
      if (extra?.progressImage) payload.progressImage = extra.progressImage;
      if (extra?.deliveryDetails) payload.deliveryDetails = extra.deliveryDetails;
      if (extra?.installationDetails) payload.installationDetails = extra.installationDetails;
      if (extra?.expectedDeliveryDate) payload.expectedDeliveryDate = extra.expectedDeliveryDate;
      if (extra?.note) payload.note = extra.note;

      await axios.post(`/orders/tracking/${id}/update`, payload);

      // Optimistic local updates
      setManufacturingOrders(prev => prev.map(o =>
        o._id === id ? { ...o, status } : o
      ));
      setDeliveryOrders(prev => prev.map(o =>
        o._id === id ? { ...o, status, ...(extra?.deliveryDetails && { deliveryDetails: extra.deliveryDetails }) } : o
      ));

      await fetchPartnerData();
      if (status === 'Installation Completed') {
        showToast('Installation completed! Order is now marked as Completed. Review & Rating enabled.');
      } else {
        showToast(`Stage updated to "${status}"`);
      }
    } catch (err) {
      console.error('Tracking update failed:', err);
      showToast(err.response?.data?.message || 'Tracking update failed. Please try again.');
    } finally {
      setTrackingProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  // Save Delivery Details without changing stage
  const handleDeliveryDetailsSave = async (id) => {
    setTrackingProcessing(prev => ({ ...prev, [id]: true }));
    try {
      const payload = {
        deliveryDetails: {
          partner: delPartner[id] || '',
          contact: delContact[id] || '',
          trackingId: delTrackingId[id] || '',
          notes: trackingNote[id] || ''
        },
        note: 'Delivery details updated'
      };

      await axios.post(`/orders/tracking/${id}/update`, payload);

      setDeliveryOrders(prev => prev.map(o =>
        o._id === id ? { ...o, deliveryDetails: payload.deliveryDetails } : o
      ));

      await fetchPartnerData();
      showToast('Delivery details saved successfully!');
    } catch (err) {
      console.error('Delivery details save failed:', err);
      showToast(err.response?.data?.message || 'Failed to save delivery details.');
    } finally {
      setTrackingProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  // Payment Verification Actions
  const handleVerifyPayment = async (orderId) => {
    try {
      const res = await axios.post(`/vendor/verify-payment/${orderId}`);
      if (res.data && res.data.success) {
        setPendingVerificationOrders(prev => prev.filter(o => o._id !== orderId));
        await fetchPartnerData();
        showToast('Payment verified! Order moved to production.');
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      showToast(err.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  const handleRejectPayment = async (orderId) => {
    if (!confirm('Reject this payment? The order will be flagged for admin review.')) return;
    const localOrders = [];
    const updatedOrders = localOrders.map(o =>
      o._id === orderId ? { ...o, orderStatus: 'Payment Rejected' } : o
    );
    
    setPendingVerificationOrders(prev => prev.filter(o => o._id !== orderId));

    // Notify user
    const localUserNotifs = [];
    

    // Notify admin
    const localAdminNotifs = [];
    

    showToast('Payment rejected. Admin has been notified.');
  };

  // Delivery Actions (delegated to handleTrackingUpdate)

  // Payout Actions
  const handleRequestPayout = () => {
    if (isPayoutRequested) {
      alert('⚠️ A payout request is already pending processing.');
      return;
    }
    setIsPayoutRequested(true);

    // Persist to localStorage for admin to read
    const amount = stats?.revenue || 24500;
    const payoutEntry = { id: Date.now(), date: new Date().toLocaleString(), amount, method: 'Bank Transfer', account: 'Registered Account', status: 'Processing', vendorName: profile?.companyName || 'Vendor', vendorEmail: user?.email || '' };
    const vendorPayouts = JSON.parse(localStorage.getItem('mockVendorPayouts') || '[]');
    vendorPayouts.push(payoutEntry);
    localStorage.setItem('mockVendorPayouts', JSON.stringify(vendorPayouts));

    // Send notification to admin
    const notifObj = {
      _id: `pnotif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message: `💰 Instant payout requested by ${profile?.companyName || 'Vendor'}: ₹${amount.toLocaleString()}`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    };
    const adminNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
    localStorage.setItem('mockAdminNotifications', JSON.stringify([notifObj, ...adminNotifs]));

    alert('✅ Instant payout requested successfully! Your funds (₹' + amount.toLocaleString() + ') are being transferred to your registered bank account.');
  };

  // Verification and Store Setup Handlers
  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    const isUpdate = verificationDetails && (verificationDetails.status === 'Submitted' || verificationDetails.status === 'Approved');
    const payload = {
      _id: isUpdate ? verificationDetails._id : 'ver_' + Date.now(),
      vendorId: { _id: user?._id || user?.id, companyName: user?.companyName || verifyBusinessName || 'Vendor' },
      businessName: verifyBusinessName,
      ownerName: verifyOwnerName,
      phone: verifyPhone,
      email: user?.email || verifyEmail || 'vendor@example.com',
      gstNumber: verifyGst,
      panNumber: verifyPan,
      businessAddress: verifyBusinessAddress,
      idProofUrl: verifyIdProof || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600',
      addressProofUrl: verifyAddressProof || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
      gstCertificateUrl: verifyGstCertificate || '',
      businessLicenseUrl: verifyBusinessLicense || '',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        bankName: ''
      },
      status: 'Submitted',
      adminRemarks: '',
      submittedAt: new Date().toISOString()
    };

    const localVerification = [];
    const filteredVerification = localVerification.filter(k => k.email !== payload.email);
    

    setVerificationDetails(payload);

    // Reset form fields so vendor can submit for another business
    setVerifyBusinessName('');
    setVerifyOwnerName('');
    setVerifyPhone('');
    setVerifyEmail('');
    setVerifyGst('');
    setVerifyPan('');
    setVerifyIdProof('');
    setVerifyAddressProof('');
    setVerifyBusinessAddress('');
    setVerifyGstCertificate('');
    setVerifyBusinessLicense('');

    alert('✅ Business verification details submitted successfully for review.');
  };

  const handleSubmitStoreSetup = async (e) => {
    e.preventDefault();
    const payload = {
      _id: 'store_' + Date.now(),
      email: user?.email || 'vendor@example.com',
      brandName: storeBrandName,
      description: storeDescription,
      supportEmail: storeSupportEmail,
      supportPhone: storeSupportPhone,
      address: storeAddress,
      bankDetails: {
        accountNumber: storeBankAcc,
        ifscCode: storeIfsc,
        bankName: storeBankName
      },
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };

    const localStoreSetup = [];
    const filteredStoreSetup = localStoreSetup.filter(d => d.email !== payload.email);
    

    setStoreSetupDetails(payload);
    alert('✅ Store profile & settlement setup submitted successfully.');
  };

  return (
    <div className="space-y-10">

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
          { icon: '💰', label: 'Quotation Accepted', name: 'Customer approved ₹4,850 bid', time: new Date(Date.now() - 3600000 * 24).toISOString(), color: 'bg-teal-50 text-teal-600' },
        ].slice(0, 4);

        const kpiCards = [
          { label: 'Total Orders', value: stats?.totalOrders || 15, trend: '+3', trendUp: true, sub: 'this month', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600', tab: 'orders' },
          { label: 'New Requests', value: newRequestsCount, trend: 'Action needed', trendUp: false, sub: 'awaiting quote', icon: <FileText className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600', tab: 'custom_requests' },
          { label: 'Active Bids', value: activeBidsCount, trend: 'In progress', trendUp: true, sub: 'under review', icon: <Send className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600', tab: 'quotations' },
          { label: 'Total Earnings', value: `₹${(stats?.revenue || 24500).toLocaleString()}`, trend: '+15%', trendUp: true, sub: 'revenue growth', icon: <DollarSign className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600', tab: 'earnings' },
        ];

        return (
          <div className="space-y-8 animate-fadeIn">


            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#2A9D8F] via-[#21867a] to-[#1d7369] rounded-3xl p-8 text-white shadow-xl">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Vendor & Partner Portal</p>
                  <h1 className="font-['Playfair_Display'] font-extrabold text-3xl md:text-4xl">Welcome back, {profile?.companyName || 'Partner'}! {verificationDetails?.status === 'Approved' && <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Verified</span>} 👋</h1>
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
            
            {/* Quick Actions Grid (Premium Redesign) */}
            <div className="space-y-4">
              <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Add Product Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('products')}
                >
                  <div className="w-12 h-12 bg-[#2A9D8F]/10 rounded-2xl flex items-center justify-center text-[#2A9D8F] group-hover:scale-110 transition-transform">
                    <PlusCircle size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-[#2A9D8F] transition-colors">Add Product</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">List a new ready-made furniture piece live in the Marketplace.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Add Listing</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* View New Orders Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('orders')}
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-blue-600 transition-colors">View New Orders</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Check ready-made products purchased by users that need confirmation.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Open Orders</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Update Delivery Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('logistics')}
                >
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Truck size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-purple-600 transition-colors">Update Delivery</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Track ready-made dispatch details and schedule installations.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Go to Logistics</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Reply to Quotations Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('quotations')}
                >
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <Send size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-amber-600 transition-colors">Reply to Quotations</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Submit price bids and materials estimates on design requests.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">View Quotations</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

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
            
            {user?.status !== 'Approved' && user?.status !== 'Active' ? (
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-amber-800 text-center">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Access Restricted</h3>
                <p className="text-sm">Your account is awaiting admin approval. You cannot add products until your vendor registration is approved.</p>
              </div>
            ) : (
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
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Product Image</label>
                <label className="border-2 border-dashed border-[#D4A373]/50 rounded-2xl p-4 text-center hover:border-[#2A9D8F] transition-all bg-[#F8F5F0]/50 block group cursor-pointer relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProductImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                  />
                  {newImage && newImage.startsWith('data:image') ? (
                    <div className="space-y-2 pointer-events-none">
                      <img src={newImage} alt="Product Preview" className="w-full h-32 object-cover rounded-xl shadow-inner mx-auto" />
                      <p className="text-xs text-[#2A9D8F] font-bold">Click or drag to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4 pointer-events-none">
                      <UploadCloud className="w-8 h-8 text-[#2A9D8F] mx-auto group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-[#1F2937]">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
              <div><label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Description</label><textarea rows={3} required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Premium artisan crafted..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" /></div>
              <button type="submit" className="w-full py-4 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold shadow-md transition-all">List Product</button>
            </form>
            )}
          </div>

          {/* Listed Products */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Your Listed Products</h2>
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center space-y-4">
                <Package className="w-16 h-16 text-gray-300 mx-auto" />
                <p className="text-[#1F2937] font-bold text-xl">No products added yet.</p>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">Use the form on the left to add your first ready-made product to the marketplace.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProducts.map(p => (
                  <div key={p._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:shadow-lg transition-all">
                    <div className="flex gap-6 items-start sm:items-center w-full sm:w-auto flex-1">
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'} alt={p.title} className="w-28 h-28 object-cover rounded-2xl shadow-sm flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">{p.title}</h4>
                          <span className="bg-[#00A86B]/10 text-[#00A86B] px-3 py-1 rounded-full text-xs font-bold">
                            {(p.stock ?? 10) === 0
                              ? 'Out of Stock'
                              : (p.stock ?? 10) <= 5
                                ? 'Low Stock'
                                : 'In Stock'}
                          </span>
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
                    {(user?.status === 'Approved' || user?.status === 'Active') && (
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
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditProduct(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D4A373]/30" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Edit Product</h3>
              <button onClick={() => setEditProduct(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEditProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Title</label>
                <input required value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Product title" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Price ($)</label>
                <input required type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="0.00" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Description</label>
                <textarea rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Product description..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Category</label>
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm">
                    {['Living Room', 'Bedroom', 'Dining Room', 'Lighting', 'Decor', 'Outdoor'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Material</label>
                  <input value={editMaterial} onChange={e => setEditMaterial(e.target.value)} placeholder="Oak Wood" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Size</label>
                  <input value={editSize} onChange={e => setEditSize(e.target.value)} placeholder="32x32x30" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Stock</label>
                  <input type="number" min="0" value={editStock} onChange={e => setEditStock(Number(e.target.value))} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Image URL</label>
                <input value={editImage} onChange={e => setEditImage(e.target.value)} placeholder="https://..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-4 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold shadow-md transition-all">Save Changes</button>
                <button type="button" onClick={() => setEditProduct(null)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: READY-MADE ORDERS */}
      {activeTab === 'orders' && (() => {
        const filtered = getFilteredOrders();
        
        // Dynamic KPIs
        const totalCount = readyMadeOrders.length;
        const pendingDispatch = readyMadeOrders.filter(o => o.orderStatus === 'Pending Dispatch').length;
        const delivered = readyMadeOrders.filter(o => o.orderStatus === 'Delivered').length;
        const cancelled = readyMadeOrders.filter(o => o.orderStatus === 'Cancelled').length;
        const activeDeliveries = readyMadeOrders.filter(o => ['Dispatched', 'Out For Delivery'].includes(o.orderStatus)).length;
        
        // Revenue this month (exclude cancelled)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = readyMadeOrders
          .filter(o => {
            const date = new Date(o.createdAt);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear && o.orderStatus !== 'Cancelled';
          })
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Get unique categories for filter
        const categories = ['All', ...new Set(readyMadeOrders.map(o => o.productDetails?.category).filter(Boolean))];

        const getStatusBadgeClass = (status) => {
          switch (status) {
            case 'Pending Confirmation':
              return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Processing':
              return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Pending Dispatch':
              return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Dispatched':
              return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'Out For Delivery':
              return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Delivered':
              return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Completed':
              return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'Cancelled':
              return 'bg-red-50 text-red-700 border-red-200';
            default:
              return 'bg-gray-50 text-gray-700 border-gray-200';
          }
        };

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Analytics Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                <h3 className="font-['Playfair_Display'] font-extrabold text-2xl text-[#1F2937] mt-2">{totalCount}</h3>
                <p className="text-[9px] text-gray-400 mt-1">all time customer orders</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending Dispatch</span>
                <h3 className="font-['Playfair_Display'] font-extrabold text-2xl text-purple-700 mt-2">{pendingDispatch}</h3>
                <p className="text-[9px] text-purple-400 mt-1">packed & ready in warehouse</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Deliveries</span>
                <h3 className="font-['Playfair_Display'] font-extrabold text-2xl text-indigo-700 mt-2">{activeDeliveries}</h3>
                <p className="text-[9px] text-indigo-400 mt-1">in transit / out for delivery</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivered Orders</span>
                <h3 className="font-['Playfair_Display'] font-extrabold text-2xl text-emerald-700 mt-2">{delivered}</h3>
                <p className="text-[9px] text-emerald-400 mt-1">successfully handed over</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cancelled Orders</span>
                <h3 className="font-['Playfair_Display'] font-extrabold text-2xl text-red-700 mt-2">{cancelled}</h3>
                <p className="text-[9px] text-red-400 mt-1">cancelled or refunded</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Monthly Revenue</span>
                <h3 className="font-['Playfair_Display'] font-extrabold text-2xl text-amber-700 mt-2">${monthlyRevenue.toLocaleString()}</h3>
                <p className="text-[9px] text-amber-500 mt-1">earnings this month</p>
              </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <h3 className="font-['Playfair_Display'] font-bold text-lg text-[#1F2937]">Order Filters</h3>
                <button 
                  onClick={() => {
                    setOrderSearch('');
                    setOrderStatusFilter('All');
                    setOrderDateFilter('All');
                    setOrderCategoryFilter('All');
                  }}
                  className="text-xs font-bold text-[#8B5E3C] hover:underline"
                >
                  Reset Filters
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search ID, product, buyer..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2A9D8F]"
                  />
                </div>
                {/* Status */}
                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2A9D8F]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending Confirmation">Pending Confirmation</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending Dispatch">Pending Dispatch</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                {/* Date */}
                <div>
                  <select
                    value={orderDateFilter}
                    onChange={(e) => setOrderDateFilter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2A9D8F]"
                  >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                </div>
                {/* Category */}
                <div>
                  <select
                    value={orderCategoryFilter}
                    onChange={(e) => setOrderCategoryFilter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2A9D8F]"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-16 text-center text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-bold">No orders match the filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <th className="p-5">Order Details</th>
                        <th className="p-5">Customer Info</th>
                        <th className="p-5">Billing</th>
                        <th className="p-5">Timeline Status</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-100">
                      {filtered.map(order => (
                        <tr key={order._id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <img 
                                src={order.productDetails?.images?.[0] || order.productDetails?.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'} 
                                alt={order.productDetails?.title} 
                                className="w-12 h-12 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-gray-800 hover:text-[#8B5E3C] transition-colors block cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                  #{order._id.slice(-6).toUpperCase()}
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium block max-w-[150px] truncate">
                                  {order.productDetails?.title}
                                </span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mt-0.5">
                                  Qty: {order.productDetails?.quantity || 1}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="font-bold text-gray-700">{order.userId?.name || 'Customer Demo'}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{order.userId?.phone || '+91 99999 88888'}</p>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="font-extrabold text-gray-800">${order.totalAmount}</p>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                                {order.paymentStatus || 'Paid'}
                              </span>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1.5">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                              <p className="text-[9px] text-gray-400 font-medium">
                                Date: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 bg-[#F8F5F0] hover:bg-[#8B5E3C]/10 text-[#8B5E3C] font-bold rounded-lg border border-[#8B5E3C]/20 transition-all"
                              >
                                Manage
                              </button>
                              <button 
                                onClick={() => handleDownloadInvoice(order)}
                                className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition-all"
                                title="Download Invoice"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteOrder(order._id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-red-600 hover:text-red-700 transition-all"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Detail Modal / Slide-over Draw */}
            {selectedOrder && (() => {
              const o = selectedOrder;
              const status = o.orderStatus;
              
              // Define 7-step timeline status indices
              const stages = [
                'Pending Confirmation',
                'Processing',
                'Pending Dispatch',
                'Dispatched',
                'Out For Delivery',
                'Delivered',
                'Completed'
              ];
              const currentIndex = stages.indexOf(status);

              return (
                <div className="fixed inset-0 z-50 bg-[#1F2937]/50 backdrop-blur-sm flex justify-end animate-fadeIn">
                  <div className="w-full max-w-4xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col p-8 border-l border-gray-100 animate-slideLeft">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
                      <div>
                        <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Ready-Made Workflow</span>
                        <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-1">Manage Order #{o._id.slice(-6).toUpperCase()}</h2>
                        <p className="text-[10px] text-gray-500 font-medium">Placed on: {new Date(o.createdAt).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(null)}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                      {/* Left Column: Details & Actions */}
                      <div className="lg:col-span-7 space-y-6">
                        {/* Return Request Banner */}
                        {o.hasReturnRequest && (
                          <div className="bg-red-50 border border-red-200 p-5 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                              <AlertTriangle className="w-5 h-5 text-red-600" /> Return Request Pending Review
                            </div>
                            <p className="text-xs text-red-600 leading-relaxed font-medium">
                              <strong>Reason:</strong> "{o.returnReason || 'No reason provided.'}"
                            </p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleApproveReturn(o._id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                              >
                                Approve & Issue Refund
                              </button>
                              <button 
                                onClick={() => handleRejectReturn(o._id)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all"
                              >
                                Decline Request
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Product Detail Card */}
                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex gap-4">
                          <img 
                            src={o.productDetails?.images?.[0] || o.productDetails?.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'} 
                            alt={o.productDetails?.title} 
                            className="w-20 h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <h4 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">{o.productDetails?.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold">
                              <span>Price: ${o.productDetails?.price}</span>
                              <span>•</span>
                              <span>Qty: {o.productDetails?.quantity || 1}</span>
                            </div>
                            <p className="text-sm font-extrabold text-[#2A9D8F] pt-1">Total Paid: ${o.totalAmount}</p>
                          </div>
                        </div>

                        {/* Customer & Shipping info */}
                        <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
                          <h4 className="font-bold text-xs text-[#1F2937] uppercase tracking-wider border-b border-gray-100 pb-2">Customer & Shipping Details</h4>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-gray-400 block mb-0.5">Name</span>
                              <strong className="text-gray-700 font-bold">{o.userId?.name || 'Customer Demo'}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 block mb-0.5">Phone Number</span>
                              <strong className="text-gray-700 font-bold">{o.userId?.phone || '+91 99999 88888'}</strong>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-400 block mb-0.5">Email</span>
                              <strong className="text-gray-700 font-bold block truncate">{o.userId?.email || 'user@example.com'}</strong>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-400 block mb-0.5">Shipping Address</span>
                              <p className="text-gray-600 leading-normal bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 font-medium">
                                {o.shippingAddress || '123 Default User St'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dispatch Management Panel */}
                        {status === 'Processing' && (
                          <div className="bg-[#F8F5F0] p-5 rounded-2xl border border-[#D4A373]/30 space-y-4">
                            <h4 className="font-bold text-xs text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5">
                              <Truck className="w-4 h-4" /> Logistics Dispatch Panel
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Assign Delivery Partner</label>
                                <select 
                                  value={assignPartnerId}
                                  onChange={(e) => setAssignPartnerId(e.target.value)}
                                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2A9D8F]"
                                >
                                  <option value="">Select a company...</option>
                                  <option value="Delhivery Logistics">Delhivery Logistics</option>
                                  <option value="BlueDart Air Express">BlueDart Air Express</option>
                                  <option value="Artisan Cargo Express">Artisan Cargo Express</option>
                                  <option value="Local Courier Partner">Local Courier Partner</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tracking ID / Waybill</label>
                                <input 
                                  type="text" 
                                  value={trackingIdInput}
                                  onChange={(e) => setTrackingIdInput(e.target.value)}
                                  placeholder="e.g. TRK-9876543-IND"
                                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2A9D8F] uppercase"
                                />
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <input 
                                  type="checkbox" 
                                  id="installationRequired"
                                  checked={installationRequiredInput}
                                  onChange={(e) => setInstallationRequiredInput(e.target.checked)}
                                  className="rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                                />
                                <label htmlFor="installationRequired" className="text-xs font-bold text-gray-600 cursor-pointer">
                                  Platform Installation Assistance Needed?
                                </label>
                              </div>
                              <button 
                                onClick={() => handleDispatchOrder(o._id, assignPartnerId, trackingIdInput, installationRequiredInput)}
                                className="w-full py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/95 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2"
                              >
                                Handover to Courier & Dispatch
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Status Transition buttons */}
                        <div className="border-t border-gray-100 pt-6">
                          <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-3">Update Order Status</h4>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <select 
                                value={status}
                                onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                                className="flex-1 p-3 rounded-xl border border-gray-200 text-sm font-medium bg-white focus:outline-none focus:border-[#2A9D8F]"
                              >
                                {stages.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                            
                            <button 
                              onClick={() => handleDownloadInvoice(o)}
                              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                            >
                              <Download className="w-4 h-4" /> Print Invoice
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Status Timeline & Chat */}
                      <div className="lg:col-span-5 flex flex-col space-y-6">
                        {/* Live Workflow Timeline */}
                        <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
                          <h4 className="font-bold text-xs text-[#1F2937] uppercase tracking-wider border-b border-gray-100 pb-2">Live Order Timeline</h4>
                          
                          <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {stages.map((stageName, idx) => {
                              const isCompleted = idx <= currentIndex;
                              const isCurrent = idx === currentIndex;
                              
                              return (
                                <div key={stageName} className="relative flex items-start gap-3 text-xs">
                                  {/* Dot */}
                                  <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 bg-white transition-all ${
                                    isCurrent ? 'border-orange-500 scale-125 bg-orange-500' :
                                    isCompleted ? 'border-[#2A9D8F] bg-[#2A9D8F]' : 'border-gray-300'
                                  }`}></div>
                                  <div>
                                    <p className={`font-bold ${isCurrent ? 'text-orange-600' : (isCompleted ? 'text-gray-800' : 'text-gray-400')}`}>
                                      {stageName}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                      {isCurrent ? 'Active Stage' : (isCompleted ? 'Stage completed' : 'Awaiting previous step')}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Customer Chat Simulation */}
                        <div className="border border-gray-100 rounded-2xl p-5 flex flex-col h-[320px] bg-gray-50/50">
                          <h4 className="font-bold text-xs text-[#1F2937] uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-gray-400" /> Buyer Chat Console
                          </h4>
                          
                          {/* Messages */}
                          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                            {chatMessages.map((msg, index) => {
                              const isMe = msg.sender === 'vendor';
                              return (
                                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                                    isMe 
                                      ? 'bg-[#1F2937] text-white rounded-tr-none' 
                                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                  }`}>
                                    <p className="leading-relaxed font-medium">{msg.text}</p>
                                    <span className={`text-[8px] block text-right mt-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>{msg.time}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Message input */}
                          <div className="flex gap-2 pt-2 border-t border-gray-200">
                            <input 
                              type="text" 
                              value={chatMessageInput}
                              onChange={(e) => setChatMessageInput(e.target.value)}
                              onKeyDown={(e) => { if(e.key === 'Enter') handleSendChatMessage(); }}
                              placeholder="Type a message..."
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2A9D8F]"
                            />
                            <button 
                              onClick={handleSendChatMessage}
                              className="px-4 bg-[#1F2937] hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                            >
                              Send
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* TAB 4: CUSTOM DESIGN REQUESTS */}
      {activeTab === 'custom_requests' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Custom Orders</h2>
            <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-4 py-1.5 rounded-full text-xs font-bold">
              {customRequests.length} {customRequests.length === 1 ? 'Request' : 'Requests'}
            </span>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 pb-2">
            {['All', 'AI Generated', 'Manual Design', 'Interior Designer Help', 'Own Materials'].map((filt) => (
              <button
                key={filt}
                onClick={() => setCustomRequestFilter(filt)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  customRequestFilter === filt
                    ? 'bg-[#1F2937] border-[#1F2937] text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {filt}
              </button>
            ))}
          </div>

          {customRequests.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center space-y-4">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto" />
              <p className="text-[#1F2937] font-bold text-xl">No custom design requests available.</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">New manual design requests submitted by users will automatically appear here for your review and quotation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {(() => {
                const filtered = customRequests.filter(req => {
                  const isVisible = req.status !== 'Rejected' && req.status !== 'pending';
                  if (!isVisible) return false;

                  const matchesSearch = !searchQuery || 
                    req.roomType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    req.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    req.requirements?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    req.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
                  if (!matchesSearch) return false;
                  if (customRequestFilter === 'All') return true;
                  if (customRequestFilter === 'AI Generated') {
                    return req.requestType === 'AI Generated' || (req.style && req.style.includes('AI Generated')) || (req._id && req._id.startsWith('man_from_ai'));
                  }
                  if (customRequestFilter === 'Manual Design') {
                    return req.requestType === 'Manual Design' && req.ownMaterialsAvailable !== 'Yes';
                  }
                  if (customRequestFilter === 'Own Materials') {
                    return req.requestType === 'Manual Design' && req.ownMaterialsAvailable === 'Yes';
                  }
                  if (customRequestFilter === 'Interior Designer Help') {
                    return req.requestType === 'Interior Designer Help';
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white p-16 rounded-3xl border border-[#D4A373]/30 text-center text-gray-400 font-medium">
                      No requests match the selected filter.
                    </div>
                  );
                }

                return filtered.map((req) => {
                  const isDetailsOpen = viewDetailsId === req._id;
                  const isQuoteOpen = selectedRequestId === req._id;
                  const statusColor = 
                    req.status === 'Accepted' || req.status === 'Vendor Review' ? 'bg-[#00A86B]/10 text-[#00A86B]' :
                    req.status === 'Quotation Sent' || req.status === 'budget_shared' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
                    req.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-[#E9C46A]/20 text-[#8B5E3C]';

                  const isHighlighted = highlightRequestId === req._id;
                  return (
                    <div
                      key={req._id}
                      id={`request-${req._id}`}
                      className={`bg-white p-8 rounded-3xl shadow-sm border space-y-6 hover:shadow-md transition-all ${
                        isHighlighted ? 'border-[#2A9D8F] ring-2 ring-[#2A9D8F]/30 animate-pulse' : 'border-[#D4A373]/30'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="bg-[#1F2937] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{req.roomType}</span>
                            <span className="text-xs font-bold text-gray-400">ID: {req._id}</span>
                            
                            {/* Request Type Badge */}
                            {(() => {
                              const reqType = req.ownMaterialsAvailable === 'Yes' && req.requestType === 'Manual Design'
                                ? 'Own Materials'
                                : req.requestType || 'Manual Design';
                              const badgeColor = 
                                reqType === 'Interior Designer Help' 
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                                  : reqType === 'AI Generated'
                                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                                    : reqType === 'Own Materials'
                                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200';
                              return (
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${badgeColor}`}>
                                  Request Type: {reqType}
                                </span>
                              );
                            })()}

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

                    {req.requestType === 'AI Generated' ? (
                      <div className="bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4A373]/30 flex flex-col sm:flex-row gap-6 mt-4">
                        <div className="flex gap-3 shrink-0">
                          <div className="relative">
                            <a href={req.generatedImage || req.referenceImages?.[0]} target="_blank" rel="noreferrer">
                              <AiFallbackImage src={req.generatedImage || req.referenceImages?.[0]} roomType={req.roomType} alt="AI Generated" className="w-32 sm:w-40 h-32 object-cover rounded-2xl shadow-sm border border-[#2A9D8F]/30" />
                            </a>
                            <span className="absolute bottom-2 left-2 bg-[#2A9D8F]/90 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">AI Generated</span>
                            {req.versionNumber > 1 && (
                              <span className="absolute top-2 right-2 bg-[#8B5E3C]/90 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">V{req.versionNumber}</span>
                            )}
                          </div>
                          {req.originalImage && (
                            <div className="relative">
                              <a href={req.originalImage} target="_blank" rel="noreferrer">
                                <img src={req.originalImage} alt="Original" className="w-32 sm:w-40 h-32 object-cover rounded-2xl shadow-sm border border-gray-200 opacity-80 hover:opacity-100 transition-opacity" />
                              </a>
                              <span className="absolute bottom-2 left-2 bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">Original</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4 flex-1">
                          <h4 className="font-bold text-[#1F2937] text-lg border-b border-[#D4A373]/20 pb-2">AI Suggestions</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm text-[#6B7280]">
                            <div>
                              <strong className="text-[#1F2937] block mb-1">Furniture:</strong>
                              {req.aiSuggestion?.furniture?.join(', ') || req.requirements?.match(/Furniture \(([^)]+)\)/)?.[1] || 'Modern Furniture Set'}
                            </div>
                            <div>
                              <strong className="text-[#1F2937] block mb-1">Materials:</strong>
                              {req.aiSuggestion?.materials?.join(', ') || req.requirements?.match(/Materials \(([^)]+)\)/)?.[1] || 'Premium Materials'}
                            </div>
                          </div>
                          <div className="pt-2">
                            <span className="font-['Playfair_Display'] font-extrabold text-xl text-[#8B5E3C]">Est. Budget: {req.budget || '₹3,000'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
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
                          <div className="sm:col-span-2"><strong className="text-[#1F2937]">Design Requirements:</strong> {req.requirements || req.details || 'Standard'}</div>
                          
                          {req.ownMaterialsAvailable === 'Yes' && (
                            <>
                              <div className="sm:col-span-2"><strong className="text-[#1F2937]">Own Materials Details:</strong> {req.materialDetails}</div>
                              <div><strong className="text-[#1F2937]">Material Quantity:</strong> {req.materialQuantity}</div>
                              <div><strong className="text-[#1F2937]">Pickup Required:</strong> {req.materialPickupNeeded}</div>
                              {req.materialPickupNeeded === 'Yes' && (
                                <div className="sm:col-span-2"><strong className="text-[#1F2937]">Pickup Address:</strong> {req.pickupAddress}</div>
                              )}
                            </>
                          )}
                          
                          {req.needDesignerHelp === 'Yes' && (
                            <div className="sm:col-span-2"><strong className="text-[#1F2937]">Designer Help:</strong> Customer requested interior designer consultation.</div>
                          )}
                          
                          {(req.serviceAddress) && (
                            <div className="sm:col-span-2"><strong className="text-[#1F2937]">Service Address:</strong> {req.serviceAddress || 'Default'}</div>
                          )}
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
                          <button type="button" onClick={() => { setSelectedRequestId(null); resetPaymentFields(); }} className="py-3.5 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-sm transition-all">Cancel</button>
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
                        {req.requestType === 'AI Generated' && (
                          <button onClick={() => handleDownloadAiReport(req)} className="flex-1 sm:flex-none px-4 py-2.5 bg-[#E9C46A] hover:bg-[#E9C46A]/80 text-[#1F2937] rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5">
                            <Download className="w-4 h-4" /> Download Report
                          </button>
                        )}
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
              });
              })()} 
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
                  <td className="p-4 font-bold text-[#2A9D8F]">₹4,850.00</td>
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

          {/* Pending Payment Verification Section */}
          {pendingVerificationOrders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1F2937]">Payment Verification</h3>
                  <p className="text-xs text-gray-500">{pendingVerificationOrders.length} order{pendingVerificationOrders.length > 1 ? 's' : ''} awaiting verification</p>
                </div>
              </div>
              {pendingVerificationOrders.map((pv) => {
                const tr = pv.tracking;
                return (
                <div key={pv._id} className="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-l-amber-400 border border-[#D4A373]/30 space-y-6">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Pending Verification</span>
                      <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-1">
                        {pv.orderType === 'AI Design' && pv.aiDesignData?.roomType
                          ? pv.aiDesignData.roomType + ' — ' + (pv.aiDesignData?.style || 'Modern')
                          : (pv.orderType || 'Custom Order') + ' — Order ' + pv._id.slice(-6)}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">Order ID: #{pv._id.slice(-6)}</p>
                      {tr && <p className="text-xs text-gray-400 mt-1">Customer: {tr.customerName}</p>}
                    </div>
                    <span className="text-[#2A9D8F] font-extrabold text-2xl">${pv.quotationAmount || pv.totalAmount || '0'}</span>
                  </div>
                  <div className="bg-[#F8F5F0] p-5 rounded-2xl border border-[#D4A373]/20 space-y-3 text-sm">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Transaction Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Amount Paid</span><p className="font-bold text-[#1F2937]">${tr?.amount || pv.quotationAmount || pv.totalAmount || '0'}</p></div>
                      <div><span className="text-gray-500">Payment Method</span><p className="font-bold text-[#1F2937]">{tr?.paymentMethod || pv.quotationPaymentMethod || 'UPI'}</p></div>
                      <div><span className="text-gray-500">Customer</span><p className="font-bold text-[#1F2937]">{tr?.customerName || pv.userId?.name || 'Customer'}</p></div>
                      <div><span className="text-gray-500">Date</span><p className="font-bold text-[#1F2937]">{tr?.paymentDate ? new Date(tr.paymentDate).toLocaleDateString() : new Date(pv.createdAt).toLocaleDateString()}</p></div>
                    </div>
                    {tr && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2 border-t border-[#D4A373]/20">
                        <div><span className="text-gray-500">Transaction ID</span><p className="font-bold text-[#1F2937] text-xs break-all">{tr.transactionId}</p></div>
                        <div><span className="text-gray-500">Payment Status</span><p className="font-bold text-emerald-600">{tr.paymentStatus}</p></div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVerifyPayment(pv._id)}
                      disabled={verificationProcessing[pv._id]}
                      className="flex-1 py-3.5 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {verificationProcessing[pv._id] ? <>Processing...</> : <><ShieldCheck className="w-5 h-5" /> Verify Payment</>}
                    </button>
                    <button
                      onClick={() => handleRejectPayment(pv._id)}
                      disabled={verificationProcessing[pv._id]}
                      className="py-3.5 px-6 bg-red-50 hover:bg-red-100 disabled:bg-gray-50 text-red-600 rounded-xl font-bold text-xs shadow-sm transition-all border border-red-200 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          )}

          {manufacturingOrders.filter(m => !searchQuery || m.designDetails?.toLowerCase().includes(searchQuery.toLowerCase()) || m.status?.toLowerCase().includes(searchQuery.toLowerCase())).map((mfg) => (
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
                    <option value="Production Started">Production Started</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Ready for Delivery">Ready for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Installation Scheduled">Installation Scheduled</option>
                    <option value="Installation Completed">Installation Completed</option>
                  </select>
                  <div className="flex flex-col gap-2 justify-center">
                    <input type="file" accept="image/*" onChange={(e) => handleProgressImageUpload(e, mfg._id)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 cursor-pointer border border-gray-200 rounded-xl p-1" />
                    {progressImg[mfg._id] && progressImg[mfg._id].startsWith('data:image') && <span className="text-[10px] font-bold text-emerald-600">✓ Image ready to upload</span>}
                  </div>
                  <button onClick={() => handleTrackingUpdate(mfg._id, mfgStatus[mfg._id] || mfg.status, { progressImage: progressImg[mfg._id], note: `Manufacturing stage: ${mfgStatus[mfg._id] || mfg.status}` })} disabled={trackingProcessing[mfg._id]} className={`${trackingProcessing[mfg._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2A9D8F] hover:bg-[#2A9D8F]/90'} text-white rounded-xl font-bold text-sm shadow-md`}>{trackingProcessing[mfg._id] ? 'Processing...' : 'Update Stage & Upload Photo'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: DELIVERY & INSTALLATION */}
      {activeTab === 'logistics' && (
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Delivery & Installation Timeline</h2>
          {deliveryOrders.filter(d => !searchQuery || d.shippingAddress?.toLowerCase().includes(searchQuery.toLowerCase()) || d.status?.toLowerCase().includes(searchQuery.toLowerCase()) || d.trackingId?.toLowerCase().includes(searchQuery.toLowerCase())).map((del) => {
            const trackingStages = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'];
            const currentIdx = trackingStages.indexOf(del.status);
            return (
            <div key={del._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <span className="bg-[#E9C46A]/20 text-[#E9C46A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Order Timeline</span>
                  <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] mt-1">{del.designDetails || 'Custom Order'} — Destination: {del.shippingAddress || 'N/A'}</h3>
                  <p className="text-xs text-gray-400 mt-1">Order #{del._id?.slice(-6)} • Customer: {del.userId?.name || del.customerName || 'N/A'}</p>
                </div>
                <span className="bg-[#E76F51] text-white px-4 py-1.5 rounded-full text-xs font-bold">{del.status}</span>
              </div>

              {/* 7-Stage Timeline */}
              <div className="bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4A373]/20">
                <div className="grid grid-cols-8 gap-2">
                  {trackingStages.map((stage, idx) => {
                    const isActive = idx === currentIdx;
                    const isPast = idx < currentIdx;
                    return (
                      <div key={stage} className={`text-center p-2 rounded-xl ${isActive ? 'bg-[#2A9D8F] text-white scale-105 shadow-md' : isPast ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-gray-400 border border-gray-200'}`}>
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs mb-1 ${isActive ? 'bg-white text-[#2A9D8F]' : isPast ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {isPast ? '✓' : idx + 1}
                        </div>
                        <p className="text-[10px] font-bold leading-tight">{stage}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stage Update Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                {/* Left: Stage Progress */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider">Update Stage</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <select value={delStatus[del._id] || del.status} onChange={(e) => setDelStatus({ ...delStatus, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A9D8F]">
                      {trackingStages.slice(2).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input type="text" placeholder="Note (optional)" value={trackingNote[del._id] || ''} onChange={(e) => setTrackingNote({ ...trackingNote, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="file" accept="image/*" onChange={(e) => handleProgressImageUpload(e, del._id)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 cursor-pointer border border-gray-200 rounded-xl p-1" />
                    <input type="date" value={expectedDelDate[del._id] || ''} onChange={(e) => setExpectedDelDate({ ...expectedDelDate, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <button onClick={() => handleTrackingUpdate(del._id, delStatus[del._id] || del.status, { note: trackingNote[del._id], progressImage: progressImg[del._id], expectedDeliveryDate: expectedDelDate[del._id] || undefined })} disabled={trackingProcessing[del._id]} className={`w-full py-3 ${trackingProcessing[del._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2A9D8F] hover:bg-[#2A9D8F]/90'} text-white rounded-xl font-bold text-sm shadow-md`}>{trackingProcessing[del._id] ? 'Processing...' : 'Update Stage'}</button>
                  </div>
                </div>

                {/* Right: Delivery & Installation Details */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider">Delivery Details</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <input type="text" placeholder="Delivery Person Name" value={delPartner[del._id] || ''} onChange={(e) => setDelPartner({ ...delPartner, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="text" placeholder="Contact Number" value={delContact[del._id] || ''} onChange={(e) => setDelContact({ ...delContact, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="text" placeholder="Tracking ID / Info" value={delTrackingId[del._id] || ''} onChange={(e) => setDelTrackingId({ ...delTrackingId, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <button onClick={() => handleDeliveryDetailsSave(del._id)} disabled={trackingProcessing[del._id]} className={`w-full py-3 ${trackingProcessing[del._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B5E3C] hover:bg-[#8B5E3C]/90'} text-white rounded-xl font-bold text-sm shadow-md`}>{trackingProcessing[del._id] ? 'Processing...' : 'Save Delivery Details'}</button>
                  </div>

                  <h4 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider pt-2">Installation Management</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="date" placeholder="Installation Date" value={installDate[del._id] || ''} onChange={(e) => setInstallDate({ ...installDate, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="time" placeholder="Installation Time" value={installTime[del._id] || ''} onChange={(e) => setInstallTime({ ...installTime, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="text" placeholder="Installation Partner" value={installPartner[del._id] || ''} onChange={(e) => setInstallPartner({ ...installPartner, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="text" placeholder="Technician Name" value={installTechName[del._id] || ''} onChange={(e) => setInstallTechName({ ...installTechName, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="text" placeholder="Technician Contact Number" value={installTechContact[del._id] || ''} onChange={(e) => setInstallTechContact({ ...installTechContact, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="text" placeholder="Installation Address" value={installAddress[del._id] || ''} onChange={(e) => setInstallAddress({ ...installAddress, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <input type="date" placeholder="Expected Completion Date" value={installExpectedCompletion[del._id] || ''} onChange={(e) => setInstallExpectedCompletion({ ...installExpectedCompletion, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                    <select value={installStatus[del._id] || ''} onChange={(e) => setInstallStatus({ ...installStatus, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A9D8F]">
                      <option value="">Select Status</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <textarea placeholder="Installation Notes" value={installNotes[del._id] || ''} onChange={(e) => setInstallNotes({ ...installNotes, [del._id]: e.target.value })} className="p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] sm:col-span-2" rows={2}></textarea>
                    <button onClick={() => {
                      const installPayload = {
                        partner: installPartner[del._id] || '',
                        scheduledDate: installDate[del._id] || undefined,
                        installationDate: installDate[del._id] || undefined,
                        installationTime: installTime[del._id] || '',
                        technicianName: installTechName[del._id] || '',
                        technicianContact: installTechContact[del._id] || '',
                        installationAddress: installAddress[del._id] || '',
                        expectedCompletionDate: installExpectedCompletion[del._id] || undefined,
                        installationStatus: installStatus[del._id] || '',
                        notes: installNotes[del._id] || ''
                      };
                      const selInstallSt = installStatus[del._id];
                      let targetStatus = del.status;
                      if (selInstallSt === 'Scheduled') targetStatus = 'Installation Scheduled';
                      else if (selInstallSt === 'In Progress') targetStatus = 'Installation In Progress';
                      else if (selInstallSt === 'Completed') targetStatus = 'Installation Completed';
                      handleTrackingUpdate(del._id, targetStatus, { installationDetails: installPayload, note: `Installation: ${selInstallSt || 'details saved'}` });
                    }} disabled={trackingProcessing[del._id]} className={`sm:col-span-2 py-3 ${trackingProcessing[del._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E76F51] hover:bg-[#E76F51]/90'} text-white rounded-xl font-bold text-sm shadow-md`}>{trackingProcessing[del._id] ? 'Processing...' : 'Save Installation Details'}</button>
                  </div>
                </div>
              </div>
            </div>
          );
          })}
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

      {/* TAB 10: REVIEWS */}
      {activeTab === 'reviews' && (() => {
        const avgRating = vendorReviews.length > 0 
          ? (vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length).toFixed(1) 
          : '0.0';
          
        const ratingCounts = {5:0, 4:0, 3:0, 2:0, 1:0};
        vendorReviews.forEach(r => { if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++; });
        const getPct = (count) => vendorReviews.length > 0 ? `${(count / vendorReviews.length) * 100}%` : '0%';

        return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Customer Reviews</h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">{vendorReviews.length} Total</span>
          </div>

          {reviewsLoading ? (
            <div className="text-center p-12 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#D4A373] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-medium">Loading reviews from database...</p>
            </div>
          ) : reviewsError ? (
            <div className="text-center p-12 border border-dashed border-red-200 rounded-2xl bg-red-50/30">
              <p className="text-sm font-bold text-red-500">⚠ Connection Error</p>
              <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">{reviewsError}</p>
              <p className="text-xs text-gray-400 mt-1">Make sure the backend server is running and you are logged in.</p>
            </div>
          ) : vendorReviews.length === 0 ? (
            <div className="text-center p-12 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
               No reviews found in the database yet.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/50">
                <div className="text-center md:px-8 md:border-r border-gray-200 flex flex-col justify-center items-center">
                  <h3 className="font-extrabold text-5xl text-[#1F2937]">{avgRating}</h3>
                  <div className="flex items-center gap-1 text-[#E9C46A] mt-2 justify-center">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.round(Number(avgRating)) ? 'fill-current' : 'text-gray-300'}`}/>)}
                  </div>
                  <p className="text-sm font-bold text-gray-500 mt-2">{vendorReviews.length} Reviews</p>
                </div>
                
                <div className="flex-1 md:px-8 md:border-r border-gray-200 flex flex-col justify-center">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-3 text-sm text-gray-600 mb-2 last:mb-0">
                      <span className="w-12 flex items-center justify-end gap-1 font-bold">{star} <Star className="w-3 h-3 text-[#E9C46A] fill-current" /></span>
                      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-[#E9C46A] rounded-full transition-all duration-1000 ease-out" style={{ width: getPct(ratingCounts[star]) }}></div>
                      </div>
                      <span className="w-8 text-xs font-bold text-gray-400 text-right">{ratingCounts[star]}</span>
                    </div>
                  ))}
                </div>

                <div className="flex-[1.5] md:pl-4">
                  <h4 className="font-bold text-[#1F2937] mb-4 border-b border-gray-200 pb-2">Recent Feedback</h4>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {vendorReviews.map(review => (
                      <div key={review._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1 text-[#E9C46A]">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-current' : 'text-gray-200'}`}/>)}
                            <span className="text-xs font-bold text-gray-600 ml-1">{review.rating}/5</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="italic text-gray-600 text-sm leading-relaxed mt-2">"{review.comment}"</p>
                        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] text-xs font-bold">
                              {review.userId?.name?.charAt(0) || 'C'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#8B5E3C]">{review.userId?.name || 'Customer'}</p>
                              {review.userId?.email && <p className="text-[10px] text-gray-400">{review.userId.email}</p>}
                            </div>
                          </div>
                          {review.productId && review.productId.title ? (
                            <div className="flex items-center gap-2 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                              {review.productId.images && review.productId.images[0] && (
                                <img src={review.productId.images[0]} alt={review.productId.title} className="w-8 h-8 object-cover rounded-md" />
                              )}
                              <span className="text-xs font-semibold text-gray-700">Product: {review.productId.title}</span>
                            </div>
                          ) : review.vendorId?.companyName ? (
                            <span className="text-[10px] bg-[#8B5E3C]/5 text-[#8B5E3C] px-2 py-0.5 rounded-full font-bold border border-[#8B5E3C]/10">
                              → {review.vendorId.companyName}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}

      {/* TAB: HELP CENTER LIVE CHAT */}
      {activeTab === 'support' && (() => {
        const supportMsgs = helpMessages;
        const companyName = profile?.companyName || 'Artisan Workshop Ltd';
        
        // Find all unique users who messaged help desk
        const uniqueUsers = Array.from(new Set(supportMsgs.map(m => m.userName))).map(name => {
          const userMsgs = supportMsgs.filter(m => m.userName === name);
          const lastMsg = userMsgs[userMsgs.length - 1];
          return {
            name,
            lastMessage: lastMsg ? lastMsg.message : '',
            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
          };
        });

        const activeUserHelpMsgs = supportMsgs.filter(m => m.userName === selectedHelpUser);

        return (
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex h-[600px] animate-fade-in text-left">
            {/* Left Panel: Customer Conversations list */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
              <div className="p-5 border-b border-gray-100 bg-white">
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">User Support Chats</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Live support channel</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {uniqueUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-medium">
                    No support chats found.
                  </div>
                ) : (
                  uniqueUsers.map(u => (
                    <button
                      key={u.name}
                      onClick={() => setSelectedHelpUser(u.name)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3.5 border ${
                        selectedHelpUser === u.name 
                          ? 'bg-[#E76F51]/10 border-[#E76F51]/20 shadow-sm' 
                          : 'hover:bg-white border-transparent hover:shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#E76F51]/10 text-[#E76F51] flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-xs text-[#1F2937] truncate">{u.name}</h4>
                          <span className="text-[9px] text-gray-400 font-bold">{u.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mt-1 leading-normal">{u.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Conversation history & response */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedHelpUser ? (
                <>
                  {/* Chat header */}
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1F2937]">User Thread: {selectedHelpUser}</h3>
                      <p className="text-[10px] text-[#E76F51] font-bold uppercase tracking-wider mt-0.5">Assigned to: Vendor & Admin</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-lg font-bold">Support Room</span>
                    </div>
                  </div>

                  {/* Chat message content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20">
                    {activeUserHelpMsgs.map((msg) => {
                      const isMe = msg.senderRole === 'vendor' && msg.senderName === companyName;
                      let bubbleStyle, align, senderLabel, timeColor;

                      if (isMe) {
                        bubbleStyle = 'bg-[#E76F51] text-white rounded-tr-none';
                        align = 'justify-end';
                        senderLabel = 'You (Vendor)';
                        timeColor = 'text-white/70';
                      } else if (msg.senderRole === 'vendor') {
                        bubbleStyle = 'bg-white text-gray-800 border border-gray-100 rounded-tl-none';
                        align = 'justify-start';
                        senderLabel = `Vendor (${msg.senderName})`;
                        timeColor = 'text-gray-400';
                      } else if (msg.senderRole === 'admin') {
                        bubbleStyle = 'bg-amber-500 text-white rounded-tl-none border border-amber-600';
                        align = 'justify-start';
                        senderLabel = 'Admin';
                        timeColor = 'text-white/70';
                      } else {
                        bubbleStyle = 'bg-white text-gray-800 border border-gray-100 rounded-tl-none';
                        align = 'justify-start';
                        senderLabel = msg.senderName || msg.userName || 'Customer';
                        timeColor = 'text-gray-400';
                      }

                      return (
                        <div key={msg._id} className={`flex ${align}`}>
                          <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${bubbleStyle}`}>
                            <p>{msg.message}</p>
                            <span className={`block text-[8px] mt-1.5 text-right ${timeColor}`}>
                              {senderLabel} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleSendVendorHelpMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                    <input
                      type="text"
                      value={helpInput}
                      onChange={(e) => setHelpInput(e.target.value)}
                      placeholder={`Type a support response to ${selectedHelpUser}...`}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F51] text-xs"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      Send Support Response
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-full bg-[#E76F51]/5 flex items-center justify-center text-[#E76F51] mb-4">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1F2937]">Select a support chat</h4>
                  <p className="text-xs text-gray-400 max-w-[240px] mt-1.5 leading-relaxed">Choose a customer help chat from the list to view history and troubleshoot.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Company Name</label>
                <input type="text" defaultValue={user?.companyName || profile?.companyName} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" defaultValue={user?.name} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" defaultValue={user?.email} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" defaultValue={user?.phone} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Address</label>
              <textarea rows={2} defaultValue={user?.address} disabled className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed resize-none" />
            </div>
            
            {/* VENDOR REGISTRATION STATUS */}
            <div className={`p-5 rounded-2xl border ${user?.status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : user?.status === 'Rejected' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              <div className="flex items-center gap-3 mb-2">
                {user?.status === 'Approved' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : user?.status === 'Rejected' ? <XCircle className="w-5 h-5 text-red-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
                <h3 className="font-bold text-lg">Registration Status: {user?.status === 'Active' ? 'Approved' : user?.status || 'Pending'}</h3>
              </div>
              <p className="text-sm opacity-80">
                {user?.status === 'Approved' || user?.status === 'Active' ? 'Your vendor account has been approved. You have full access to marketplace features.' :
                 user?.status === 'Rejected' ? `Your registration was rejected. Reason: ${user?.rejectedReason || 'Please contact support.'}` :
                 'Your account is awaiting admin approval. Some features will remain locked until your registration is approved.'}
              </p>
            </div>
            <button type="submit" className="py-4 px-8 bg-[#1F2937] hover:bg-black text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Save Changes</button>
          </form>
        </div>
      )}

      {/* TAB 12: BUSINESS VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#2A9D8F]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Business Verification</h2>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-xs ${
              verificationDetails?.status === 'Approved' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
              verificationDetails?.status === 'Rejected' ? 'bg-[#E76F51]/10 text-[#E76F51]' :
              verificationDetails?.status === 'Under Review' ? 'bg-blue-50 text-blue-600' :
              verificationDetails?.status === 'Submitted' || verificationDetails?.status === 'Pending' ? 'bg-[#E9C46A]/10 text-[#8B5E3C]' : 'bg-gray-100 text-gray-500'
            }`}>
              Verification Status: {verificationDetails?.status || 'Not Submitted'}
            </div>
          </div>

          {/* Approval/Rejection Banner */}
          {verificationDetails?.status === 'Approved' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 text-base">🎉 Business Verification Approved!</h3>
                <p className="text-sm text-emerald-700 mt-1">Your business has been verified by our admin team. Your store is now live and ready to accept orders.</p>
                {verificationDetails.adminRemarks && (
                  <p className="text-xs text-emerald-600 mt-2 font-medium">Admin Note: {verificationDetails.adminRemarks}</p>
                )}
              </div>
            </div>
          )}

          {verificationDetails?.status === 'Rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                <X className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-base">❌ Verification Rejected</h3>
                <p className="text-sm text-red-700 mt-1">Your verification was rejected. Please review the admin remarks below, correct the issues and resubmit.</p>
                {verificationDetails.adminRemarks && (
                  <p className="text-xs text-red-600 mt-2 font-medium bg-red-100 p-2 rounded-lg">Reason: {verificationDetails.adminRemarks}</p>
                )}
              </div>
            </div>
          )}

          {(verificationDetails?.status === 'Submitted' || verificationDetails?.status === 'Pending') && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 text-base">Pending Review</h3>
                <p className="text-sm text-amber-700 mt-1">Your verification documents have been submitted and are pending review. You'll be notified once a decision is made.</p>
              </div>
            </div>
          )}

          {verificationDetails?.status === 'Under Review' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-base">Under Review</h3>
                <p className="text-sm text-blue-700 mt-1">Your verification is currently being reviewed by our admin team. This usually takes 1-2 business days.</p>
              </div>
            </div>
          )}          {/* Always show the form so vendor can fill manually anytime */}
          <form onSubmit={handleSubmitVerification} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Business & Owner Details</h3>
              {verificationDetails && verificationDetails.status === 'Rejected' && (
                <span className="text-[10px] text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">Please fix the issues and resubmit</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Registered Business Name</label>
                <input type="text" required value={verifyBusinessName} onChange={(e) => setVerifyBusinessName(e.target.value)} placeholder="Artisan Corp" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Owner's Full Name</label>
                <input type="text" required value={verifyOwnerName} onChange={(e) => setVerifyOwnerName(e.target.value)} placeholder="John Doe" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Business Address</label>
              <textarea rows={3} value={verifyBusinessAddress} onChange={(e) => setVerifyBusinessAddress(e.target.value)} placeholder="Enter your registered business address..." className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Phone Number</label>
                <input type="tel" required value={verifyPhone} onChange={(e) => setVerifyPhone(e.target.value)} placeholder="+91 9876543210" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Business Email</label>
                <input type="email" required value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} placeholder="vendor@example.com" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
              </div>
            </div>

            <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 pt-4">Tax & Document Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">GSTIN Number</label>
                <input type="text" required value={verifyGst} onChange={(e) => setVerifyGst(e.target.value)} placeholder="22AAAAA0000A1Z0" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">PAN Number</label>
                <input type="text" required value={verifyPan} onChange={(e) => setVerifyPan(e.target.value)} placeholder="ABCDE1234F" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] uppercase" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Aadhaar / ID Proof Image</label>
                <input type="file" accept="image/*" required={!verifyIdProof} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setVerifyIdProof(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 cursor-pointer" />
                {verifyIdProof && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ ID Proof ready</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Address Proof Image</label>
                <input type="file" accept="image/*" required={!verifyAddressProof} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setVerifyAddressProof(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 cursor-pointer" />
                {verifyAddressProof && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Address Proof ready</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">GST Certificate Upload</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setVerifyGstCertificate(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 cursor-pointer" />
                {verifyGstCertificate && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ GST Certificate ready</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Business License Upload</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setVerifyBusinessLicense(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 cursor-pointer" />
                {verifyBusinessLicense && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Business License ready</p>}
              </div>
            </div>

            <button type="submit" disabled={verificationDetails?.status === 'Under Review'} className={`px-8 py-4 rounded-xl font-bold shadow-md mt-4 transition-all ${verificationDetails?.status === 'Under Review' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#2A9D8F] text-white hover:bg-[#2A9D8F]/90'}`}>
              {verificationDetails?.status === 'Under Review' ? 'Verification Under Review' : verificationDetails?.status === 'Approved' ? 'Update & Resubmit Verification' : verificationDetails?.status === 'Rejected' ? 'Resubmit Verification' : 'Submit Business Verification'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 13: STORE SETUP */}
      {activeTab === 'store_setup' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#2A9D8F]" />
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Store & Profile Setup</h2>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-xs ${
              storeSetupDetails?.status === 'Submitted' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
              storeSetupDetails?.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
            }`}>
              Setup Status: {storeSetupDetails?.status || 'Not Submitted'}
            </div>
          </div>

          {(!storeSetupDetails || storeSetupDetails.status === 'Not Submitted') ? (
            <form onSubmit={handleSubmitStoreSetup} className="space-y-6">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Store Profile Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Brand / Store Display Name</label>
                  <input type="text" required value={storeBrandName} onChange={(e) => setStoreBrandName(e.target.value)} placeholder="Artisan Workshop" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Store Support Email</label>
                  <input type="email" required value={storeSupportEmail} onChange={(e) => setStoreSupportEmail(e.target.value)} placeholder="support@artisanworkshop.com" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Store Support Phone</label>
                  <input type="tel" required value={storeSupportPhone} onChange={(e) => setStoreSupportPhone(e.target.value)} placeholder="+91 9999988888" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Business Address / Warehouse Location</label>
                  <input type="text" required value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} placeholder="45 Artisan Way, Sector 5, Bangalore" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Store Bio / Brand Description</label>
                <textarea required value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} placeholder="Tell customers about your craftsmanship, materials, and design philosophy..." rows={4} className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]"></textarea>
              </div>

              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 pt-4">Linked Settlement Account (For Customer Payouts)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Account Number</label>
                  <input type="text" required value={storeBankAcc} onChange={(e) => setStoreBankAcc(e.target.value)} placeholder="987654321098" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">IFSC Code</label>
                  <input type="text" required value={storeIfsc} onChange={(e) => setStoreIfsc(e.target.value)} placeholder="HDFC0000123" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F] uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Bank Name</label>
                  <input type="text" required value={storeBankName} onChange={(e) => setStoreBankName(e.target.value)} placeholder="HDFC Bank" className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <button type="submit" className="px-8 py-4 bg-[#2A9D8F] text-white rounded-xl font-bold hover:bg-[#2A9D8F]/90 transition-all shadow-md mt-4">Save Store & Profile Settings</button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Store Name</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{storeSetupDetails.brandName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Support Email</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{storeSetupDetails.supportEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Support Phone</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{storeSetupDetails.supportPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{storeSetupDetails.address}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Brand Description</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{storeSetupDetails.description}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Settlements & Payout Destination Account</p>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="text-sm font-bold text-gray-800">{storeSetupDetails.bankDetails?.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IFSC Code</p>
                    <p className="text-sm font-bold text-gray-800 uppercase">{storeSetupDetails.bankDetails?.ifscCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="text-sm font-bold text-gray-800">{storeSetupDetails.bankDetails?.bankName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 14: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] flex items-center gap-3">
              <Bell className="w-6 h-6 text-[#2A9D8F]" /> Partner Notifications
            </h2>
            {notifications.length > 0 && (
              <button onClick={onMarkAllRead} className="text-sm font-bold text-[#2A9D8F] hover:underline">
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
                        ? 'bg-[#2A9D8F]/5 border-[#2A9D8F]/20' 
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      {isUnread ? (
                        <div className="w-2 h-2 bg-[#2A9D8F] rounded-full mt-1.5"></div>
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
                      {(notif.message.toLowerCase().includes('request') || notif.message.toLowerCase().includes('custom')) && (
                        <button 
                          onClick={() => { if (setActiveTab) setActiveTab('custom_requests'); }} 
                          className="mt-2 text-xs font-bold text-[#2A9D8F] hover:underline block"
                        >
                          View Request
                        </button>
                      )}
                      {notif.message.toLowerCase().includes('order') && !notif.message.toLowerCase().includes('request') && (
                        <button 
                          onClick={() => { if (setActiveTab) setActiveTab('orders'); }} 
                          className="mt-2 text-xs font-bold text-[#2A9D8F] hover:underline block"
                        >
                          View Order
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

      {/* TAB: CUSTOMER MESSAGES */}
      {activeTab === 'messages' && (() => {
        const currentVendorName = profile?.companyName || 'Artisan Workshop Ltd';
        const vendorMsgs = directMessages.filter(m => !m.vendorName || m.vendorName === currentVendorName);
        
        // Find all unique users who messaged this specific vendor
        const uniqueUsers = Array.from(new Set(vendorMsgs.map(m => m.userName))).map(name => {
          const userMsgs = vendorMsgs.filter(m => m.userName === name);
          const lastMsg = userMsgs[userMsgs.length - 1];
          return {
            name,
            lastMessage: lastMsg ? lastMsg.message : '',
            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            vendorName: currentVendorName
          };
        });

        // Get the active vendor context for the selected customer's thread
        const selectedUserMsgs = vendorMsgs.filter(m => m.userName === selectedUserMsg);
        const activeVendorContext = currentVendorName;

        return (
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex h-[600px] animate-fade-in">
            {/* Left Panel: Customer Conversations list */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
              <div className="p-5 border-b border-gray-100 bg-white">
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Vendor Chat</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Direct inquiries & feedback</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {uniqueUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-medium">
                    No customer chats found yet.
                  </div>
                ) : (
                  uniqueUsers.map(u => (
                    <button
                      key={u.name}
                      onClick={() => setSelectedUserMsg(u.name)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3.5 border ${
                        selectedUserMsg === u.name 
                          ? 'bg-[#2A9D8F]/10 border-[#2A9D8F]/20 shadow-sm' 
                          : 'hover:bg-white border-transparent hover:shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-xs text-[#1F2937] truncate">{u.name}</h4>
                          <span className="text-[9px] text-gray-400 font-bold">{u.time}</span>
                        </div>
                        <p className="text-[10px] text-[#2A9D8F] font-semibold truncate mt-1">To: {u.vendorName}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5 leading-normal">{u.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Conversation history & response */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedUserMsg ? (
                <>
                  {/* Chat header */}
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1F2937]">Vendor Chat: {selectedUserMsg}</h3>
                      <p className="text-[10px] text-[#2A9D8F] font-bold uppercase tracking-wider mt-0.5">Thread with: {activeVendorContext}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg font-bold">Live Synced</span>
                    </div>
                  </div>

                  {/* Chat message content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20">
                    {selectedUserMsgs.map((msg) => {
                      const isVendor = msg.senderRole === 'vendor';
                      const isAdmin = msg.senderRole === 'admin';
                      let bubbleStyle, align, senderLabel, timeColor;

                      if (isVendor) {
                        bubbleStyle = 'bg-[#8B5E3C] text-white rounded-tr-none';
                        align = 'justify-end';
                        senderLabel = 'You';
                        timeColor = 'text-white/70';
                      } else if (isAdmin) {
                        bubbleStyle = 'bg-[#1D3557] text-white rounded-tl-none border border-[#1D3557]';
                        align = 'justify-start';
                        senderLabel = 'Admin Support';
                        timeColor = 'text-white/70';
                      } else {
                        bubbleStyle = 'bg-white text-gray-800 border border-[#E76F51]/30 rounded-tl-none';
                        align = 'justify-start';
                        senderLabel = msg.userName || 'Customer';
                        timeColor = 'text-gray-400';
                      }

                      return (
                        <div key={msg._id} className={`flex ${align}`}>
                          <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${bubbleStyle}`}>
                            <p>{msg.message}</p>
                            <span className={`block text-[9px] mt-1.5 ${isVendor ? 'text-right' : 'text-left'} ${timeColor}`}>
                              {senderLabel} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleSendVendorDirectMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                    <input
                      type="text"
                      value={vendorMsgInput}
                      onChange={(e) => setVendorMsgInput(e.target.value)}
                      placeholder={`Type a response as ${activeVendorContext}...`}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-xs"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      Reply
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-full bg-[#2A9D8F]/5 flex items-center justify-center text-[#2A9D8F] mb-4">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1F2937]">Select a conversation</h4>
                  <p className="text-xs text-gray-400 max-w-[240px] mt-1.5 leading-relaxed">Choose a customer chat from the list to view history and answer direct inquiries.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (() => {
        const updateStock = async (id, delta) => {
          const target = inventoryProducts.find(p => p._id === id);
          if (!target) return;
          const newStock = Math.max(0, (target.stock || 0) + delta);
          setInventoryProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
          try {
            await axios.put(`/products/${id}`, { stock: newStock });
          } catch (err) {
            console.error('Failed to sync stock to backend', err);
            showToast('Stock updated locally but failed to sync to server.', 'warning');
          }
        };

        const filtered = inventoryProducts.filter(p => {
          const matchSearch = p.title?.toLowerCase().includes(invSearch.toLowerCase());
          const status = (p.stock || 0) === 0 ? 'Out of Stock' : (p.stock || 0) <= (p.lowStockThreshold || 5) ? 'Low Stock' : 'In Stock';
          const matchFilter = invFilter === 'All' || status === invFilter;
          return matchSearch && matchFilter;
        });

        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Inventory Control</h2>
                <p className="text-xs text-gray-500 mt-1">Monitor stock levels and adjust quantities for your listed products.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                  {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(f => (
                    <button key={f} onClick={() => setInvFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${invFilter === f ? 'bg-white text-[#2A9D8F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >{f}</button>
                  ))}
                </div>
              </div>
            </div>

            {user?.status !== 'Approved' && user?.status !== 'Active' ? (
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-amber-800 text-center max-w-2xl mx-auto mt-10">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Access Restricted</h3>
                <p className="text-sm">Your account is awaiting admin approval. You cannot manage inventory until your vendor registration is approved.</p>
              </div>
            ) : (
            <>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-5">
              {[
                { label: 'Total Products', value: inventoryProducts.length, color: 'text-[#2A9D8F]', bg: 'bg-[#2A9D8F]/10' },
                { label: 'Low Stock Items', value: inventoryProducts.filter(p => (p.stock||0) > 0 && (p.stock||0) <= (p.lowStockThreshold||5)).length, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Out of Stock', value: inventoryProducts.filter(p => (p.stock||0) === 0).length, color: 'text-red-500', bg: 'bg-red-50' },
              ].map(s => (
                <div key={s.label} className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}>
                    <Package className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={invSearch} onChange={e => setInvSearch(e.target.value)}
                placeholder="Search products by name..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F5F0] border-b border-gray-100">
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Level</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="p-12 text-center text-gray-400 text-sm">No products found.</td></tr>
                  ) : filtered.map(p => {
                    const stock = p.stock || 0;
                    const threshold = p.lowStockThreshold || 5;
                    const status = stock === 0 ? 'Out of Stock' : stock <= threshold ? 'Low Stock' : 'In Stock';
                    const statusStyle = status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-red-50 text-red-600 border-red-200';
                    return (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-all">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-10 h-10 object-cover rounded-xl border border-gray-100" />}
                            <p className="font-bold text-sm text-[#1F2937]">{p.title}</p>
                          </div>
                        </td>
                        <td className="p-5"><span className="text-xs font-bold text-gray-500">{p.category}</span></td>
                        <td className="p-5"><span className="font-bold text-[#2A9D8F]">₹{p.price?.toLocaleString()}</span></td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${status === 'In Stock' ? 'bg-emerald-500' : status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(100, (stock / 30) * 100)}%` }} />
                            </div>
                            <span className="font-bold text-sm text-gray-700">{stock} units</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex px-2.5 py-1 text-[10px] font-extrabold border rounded-full uppercase tracking-wider ${statusStyle}`}>{status}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => updateStock(p._id, -1)} className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold flex items-center justify-center transition-all border border-red-100">−</button>
                            <span className="font-bold text-sm w-8 text-center">{stock}</span>
                            <button onClick={() => updateStock(p._id, 1)} className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center transition-all border border-emerald-100">+</button>
                            <button onClick={() => updateStock(p._id, 10)} className="px-3 h-8 rounded-xl bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#2A9D8F] text-[10px] font-bold transition-all">+10</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </>
            )}
          </div>
        );
      })()}

      {/* TAB: PAYOUTS */}
      {activeTab === 'payouts' && (() => {
        const totalEarnings = (stats?.revenue || 24500);
        const cleared = Math.round(totalEarnings * 0.72);
        const pending = Math.round(totalEarnings * 0.18);
        const processing = Math.round(totalEarnings * 0.10);

        const handlePayoutRequest = (e) => {
          e.preventDefault();
          const newPayout = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            amount: Number(reqAmount),
            method: reqMethod,
            account: reqAccount,
            note: reqNote,
            status: 'Processing'
          };
          const updated = [newPayout, ...payoutHistory];
          setPayoutHistory(updated);
          
          setReqAmount(''); setReqAccount(''); setReqNote('');
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);

          // Persist to localStorage for admin to read
          const vendorPayouts = JSON.parse(localStorage.getItem('mockVendorPayouts') || '[]');
          vendorPayouts.push({ ...newPayout, vendorName: profile?.companyName || 'Vendor', vendorEmail: user?.email || '' });
          localStorage.setItem('mockVendorPayouts', JSON.stringify(vendorPayouts));

          // Send notification to admin
          const notifObj = {
            _id: `pnotif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            message: `💰 New payout request from ${profile?.companyName || 'Vendor'}: ₹${Number(reqAmount).toLocaleString()} via ${reqMethod}`,
            type: 'info',
            createdAt: new Date().toISOString(),
            read: false
          };
          const adminNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
          localStorage.setItem('mockAdminNotifications', JSON.stringify([notifObj, ...adminNotifs]));
        };

        return (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Payout Management</h2>
              <p className="text-xs text-gray-500 mt-1">Request payouts, track disbursements, and view your earnings history.</p>
            </div>

            {/* Wallet Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: 'Cleared Balance', value: `₹${cleared.toLocaleString()}`, sub: 'Available to withdraw', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { label: 'Pending Clearance', value: `₹${pending.toLocaleString()}`, sub: 'Awaiting settlement', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                { label: 'Lifetime Payouts', value: `₹${totalEarnings.toLocaleString()}`, sub: 'Total disbursed', color: 'text-[#2A9D8F]', bg: 'bg-[#2A9D8F]/10', border: 'border-[#2A9D8F]/20' },
              ].map(s => (
                <div key={s.label} className={`bg-white p-6 rounded-3xl border ${s.border} shadow-sm`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                  <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Request Payout Form */}
              <div className="bg-white p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-[#2A9D8F]/10 rounded-xl"><DollarSign className="w-5 h-5 text-[#2A9D8F]" /></div>
                  <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Request Payout</h3>
                </div>
                {submitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Payout request submitted! Processing within 2–3 business days.
                  </div>
                )}
                <form onSubmit={handlePayoutRequest} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Amount (₹) *</label>
                    <input type="number" required min={100} max={cleared} value={reqAmount} onChange={e => setReqAmount(e.target.value)}
                      placeholder={`Max ₹${cleared.toLocaleString()}`} className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Payout Method *</label>
                    <select value={reqMethod} onChange={e => setReqMethod(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm bg-white">
                      <option>Bank Transfer</option>
                      <option>UPI</option>
                      <option>Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Account / UPI ID *</label>
                    <input type="text" required value={reqAccount} onChange={e => setReqAccount(e.target.value)}
                      placeholder="Bank account no. or UPI ID" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Note (optional)</label>
                    <textarea rows={2} value={reqNote} onChange={e => setReqNote(e.target.value)}
                      placeholder="Reference note for this payout..." className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2A9D8F] text-sm" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                    Submit Payout Request
                  </button>
                </form>
              </div>

              {/* Transaction History */}
              <div className="bg-white p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-gray-100 rounded-xl"><Activity className="w-5 h-5 text-gray-600" /></div>
                  <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Transaction History</h3>
                </div>
                {payoutHistory.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <DollarSign className="w-12 h-12 text-gray-200 mx-auto" />
                    <p className="text-sm font-medium text-gray-400">No payout requests yet.</p>
                    <p className="text-xs text-gray-300">Submit a request on the left to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {payoutHistory.map(p => {
                      const statusStyle = p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : p.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';
                      return (
                        <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-sm text-[#1F2937]">₹{p.amount?.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{p.method} · {p.account}</p>
                            <p className="text-[10px] text-gray-300 mt-0.5">{p.date}</p>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold border rounded-full uppercase tracking-wider ${statusStyle}`}>{p.status}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ACCOUNT INFORMATION TAB */}
      {activeTab === 'account' && (
        <div className="max-w-4xl space-y-8 animate-fadeIn">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2A9D8F] text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Account Information</h2>
              <p className="text-gray-500 text-sm">Your vendor account details and registration status.</p>
            </div>
          </div>

          {!profile ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 animate-spin text-[#2A9D8F]" />
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2A9D8F] to-[#21867a] text-white flex items-center justify-center font-bold text-3xl shadow-lg shrink-0">
                    {(profile.companyName || user?.companyName || 'V').charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-[#1F2937]">{profile.companyName || user?.companyName || 'Your Store'}</h3>
                    <p className="text-gray-500 mt-1">{profile.description || 'Furniture & Interior Vendor'}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        profile.isActive ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'bg-[#E76F51]/10 text-[#E76F51]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${profile.isActive ? 'bg-[#2A9D8F]' : 'bg-[#E76F51]'}`} />
                        {profile.isActive ? 'Active' : 'Suspended'}
                      </span>
                      {(profile.verificationStatus === 'Approved' || profile.isVerified) && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-5">
                  <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3">Business Information</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Name</p>
                      <p className="font-semibold text-[#1F2937] mt-0.5">{profile.companyName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Owner Name</p>
                      <p className="font-semibold text-[#1F2937] mt-0.5">{profile.name || user?.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</p>
                      <p className="font-semibold text-[#1F2937] mt-0.5 capitalize">{profile.businessType || profile.category || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Since</p>
                      <p className="font-semibold text-[#1F2937] mt-0.5">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-5">
                  <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="font-semibold text-[#1F2937] mt-0.5">{profile.email || user?.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="font-semibold text-[#1F2937] mt-0.5">{profile.phone || user?.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                        <p className="font-semibold text-[#1F2937] mt-0.5">{profile.address || user?.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Status */}
              <div className={`p-6 rounded-3xl border ${
                user?.status === 'Approved' || user?.status === 'Active' ? 'bg-emerald-50 border-emerald-200' :
                user?.status === 'Rejected' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {user?.status === 'Approved' || user?.status === 'Active' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                   user?.status === 'Rejected' ? <XCircle className="w-5 h-5 text-red-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
                  <h3 className="font-bold text-lg">Registration Status: {user?.status === 'Active' ? 'Approved' : user?.status || 'Pending'}</h3>
                </div>
                <p className="text-sm opacity-80">
                  {user?.status === 'Approved' || user?.status === 'Active'
                    ? 'Your vendor account has been approved. You have full access to marketplace features.'
                    : user?.status === 'Rejected'
                    ? `Your registration was rejected. Reason: ${user?.rejectedReason || 'Please contact support.'}`
                    : 'Your account is awaiting admin approval. Some features will remain locked until your registration is approved.'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default VendorDashboard;
