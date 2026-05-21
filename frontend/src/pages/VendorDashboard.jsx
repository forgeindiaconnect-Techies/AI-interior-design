import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Store, Hammer, Truck, CheckCircle, PlusCircle, DollarSign, UploadCloud, 
  Send, RefreshCw, Eye, ArrowRight, ClipboardList, Package, MessageSquare, 
  Star, Briefcase, ShieldCheck, Bell, ShoppingCart, FileText, Activity,
  Search, Filter, Calendar, MapPin, Phone, Mail, Check, X, Download, AlertTriangle, ChevronRight
} from 'lucide-react';

const VendorDashboard = ({ activeTab = 'overview', setActiveTab }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  // Vendor/Seller State
  const [products, setProducts] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [customRequestFilter, setCustomRequestFilter] = useState('All');
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

  // Ready-made Orders Workflow States
  const [readyMadeOrders, setReadyMadeOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All');
  const [orderCategoryFilter, setOrderCategoryFilter] = useState('All');
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
  const [inventoryProducts, setInventoryProducts] = useState(() => {
    return JSON.parse(localStorage.getItem('mockProducts') || '[]').map(p => ({
      ...p,
      stock: p.stock ?? Math.floor(Math.random() * 30) + 2,
      lowStockThreshold: p.lowStockThreshold ?? 5
    }));
  });
  const [invSearch, setInvSearch] = useState('');
  const [invFilter, setInvFilter] = useState('All');

  const [payoutHistory, setPayoutHistory] = useState(() =>
    JSON.parse(localStorage.getItem('mockPayoutHistory') || '[]')
  );
  const [reqAmount, setReqAmount] = useState('');
  const [reqMethod, setReqMethod] = useState('Bank Transfer');
  const [reqAccount, setReqAccount] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      // 1. Get or seed Vendor Profile & Stats
      let localProfile = JSON.parse(localStorage.getItem('mockProfile') || 'null');
      if (!localProfile) {
        localProfile = {
          _id: 'mock_vendor_id_123',
          companyName: 'Artisan Workshop Ltd',
          ownerName: 'Marcus Vance',
          email: 'vendor@example.com',
          phone: '+1 (555) 321-7654',
          gstNumber: 'GSTIN29AAACA1234A1Z',
          panNumber: 'ABCDE1234F',
          address: '45 Artisan Way, Sector 5, Bangalore'
        };
        localStorage.setItem('mockProfile', JSON.stringify(localProfile));
      }
      setProfile(localProfile);

      // Seed stats if missing
      let localStats = JSON.parse(localStorage.getItem('mockStats') || 'null');
      if (!localStats) {
        localStats = { totalOrders: 15, revenue: 24500 };
        localStorage.setItem('mockStats', JSON.stringify(localStats));
      }
      setStats(localStats);

      // 2. Verification Submission status lookup
      let verificationSubmissions = JSON.parse(localStorage.getItem('mockVerificationSubmissions') || '[]');
      let currentVerification = verificationSubmissions.find(k => k.email === (user?.email || 'vendor@example.com'));
      if (!currentVerification) {
        currentVerification = { status: 'Not Submitted' };
      }
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

      // 3. Store Setup Lookup
      let storeSetupSubmissions = JSON.parse(localStorage.getItem('mockStoreSetupSubmissions') || '[]');
      let currentStoreSetup = storeSetupSubmissions.find(d => d.email === (user?.email || 'vendor@example.com'));
      if (!currentStoreSetup) {
        currentStoreSetup = { status: 'Not Submitted' };
      }
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

      // 4. Products list
      let localProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      if (localProducts.length === 0) {
        localProducts = [
          { 
            _id: 'prod_1', 
            title: 'Velvet Lounge Chair', 
            category: 'Living Room', 
            price: 450, 
            images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'], 
            description: 'Luxurious velvet chair crafted with solid oak frames and high-density premium foam padding.',
            material: 'Velvet / Oak Wood',
            size: '32×32×30',
            stockStatus: 'In Stock',
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' }
          },
          { 
            _id: 'prod_2', 
            title: 'Modern Oak Dining Table', 
            category: 'Dining Room', 
            price: 1200, 
            images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500'], 
            description: 'Solid oak dining table for 6 with matte oil finish.',
            material: 'Solid Oak Wood',
            size: '72×36×30',
            stockStatus: 'In Stock',
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' }
          }
        ];
        localStorage.setItem('mockProducts', JSON.stringify(localProducts));
      }
      setProducts(localProducts);

      // 5. Custom Requests
      let localManualRequests = JSON.parse(localStorage.getItem('mockManualRequests') || '[]');
      setCustomRequests(localManualRequests);

      // 6. Orders (Manufacturing and Delivery)
      let localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      
      // Let's filter or seed ready-made marketplace orders specifically for this vendor
      let vendorId = localProfile?._id || 'mock_vendor_id_123';
      let mktOrders = localOrders.filter(o => o.orderType === 'Marketplace Product' && (o.vendorId?._id === vendorId || o.vendorId === vendorId));
      
      if (mktOrders.length === 0) {
        const seededMarketplaceOrders = [
          {
            _id: 'ord_p_101',
            orderType: 'Marketplace Product',
            userId: { _id: 'u_1', name: 'John Doe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567' },
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 450,
            paymentStatus: 'paid',
            orderStatus: 'Pending Confirmation',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
            shippingAddress: '123 Oak Avenue, Seattle, WA, 98101',
            productDetails: {
              _id: 'prod_1',
              title: 'Velvet Lounge Chair',
              price: 450,
              images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'],
              quantity: 1,
              category: 'Living Room'
            },
            trackingId: '',
            hasReturnRequest: false,
            returnStatus: ''
          },
          {
            _id: 'ord_p_102',
            orderType: 'Marketplace Product',
            userId: { _id: 'u_2', name: 'Alice Smith', email: 'alice.s@example.com', phone: '+1 (555) 987-6543' },
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: { _id: 'del_mock_1', companyName: 'Swift Logistics Solutions' },
            installationPartnerId: null,
            totalAmount: 900,
            paymentStatus: 'paid',
            orderStatus: 'Pending Dispatch',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 5).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
            shippingAddress: '456 Pine Boulevard, San Francisco, CA, 94102',
            productDetails: {
              _id: 'prod_1',
              title: 'Velvet Lounge Chair',
              price: 450,
              images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'],
              quantity: 2,
              category: 'Living Room'
            },
            trackingId: '',
            hasReturnRequest: false,
            returnStatus: ''
          },
          {
            _id: 'ord_p_103',
            orderType: 'Marketplace Product',
            userId: { _id: 'u_3', name: 'Robert Johnson', email: 'robert.j@example.com', phone: '+1 (555) 456-7890' },
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: { _id: 'del_mock_2', companyName: 'Artisan Cargo' },
            installationPartnerId: null,
            totalAmount: 1200,
            paymentStatus: 'paid',
            orderStatus: 'Dispatched',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
            shippingAddress: '789 Maple Drive, Chicago, IL, 60611',
            productDetails: {
              _id: 'prod_2',
              title: 'Modern Oak Dining Table',
              price: 1200,
              images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500'],
              quantity: 1,
              category: 'Dining Room'
            },
            trackingId: 'TRK-ARTISAN-77283',
            hasReturnRequest: false,
            returnStatus: ''
          },
          {
            _id: 'ord_p_104',
            orderType: 'Marketplace Product',
            userId: { _id: 'u_4', name: 'Emily Davis', email: 'emily.d@example.com', phone: '+1 (555) 789-0123' },
            vendorId: { _id: 'mock_vendor_id_123', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: { _id: 'del_mock_3', companyName: 'QuickShip Express' },
            installationPartnerId: null,
            totalAmount: 450,
            paymentStatus: 'paid',
            orderStatus: 'Delivered',
            expectedDeliveryDate: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(), // 8 days ago
            shippingAddress: '321 Elm Street, Boston, MA, 02110',
            productDetails: {
              _id: 'prod_1',
              title: 'Velvet Lounge Chair',
              price: 450,
              images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'],
              quantity: 1,
              category: 'Living Room'
            },
            trackingId: 'TRK-QSHIP-10492',
            hasReturnRequest: true,
            returnReason: 'Wrong color shade, requested replacement or refund.',
            returnStatus: 'Pending Review'
          }
        ];
        
        localOrders = [...seededMarketplaceOrders, ...localOrders];
        localStorage.setItem('mockOrders', JSON.stringify(localOrders));
        mktOrders = seededMarketplaceOrders;
      }
      setReadyMadeOrders(mktOrders);
      
      const mfgOrders = localOrders
        .filter(o => o.orderStatus === 'Quotation Accepted' || o.orderStatus === 'Manufacturer Assigned' || o.orderStatus === 'Production Started' || o.orderStatus === 'Manufacturing Completed' || o.orderStatus === 'Under Quality Review')
        .map(o => ({
          _id: o._id,
          orderId: o._id,
          designDetails: o.orderType + ' - Order ' + o._id.substring(o._id.length - 4),
          measurements: o.designRequestId ? 'Standard dimensions / Custom details on request' : 'Standard Product Size',
          materials: 'Wood, Premium Fabrics',
          budget: o.totalAmount,
          status: o.orderStatus === 'Quotation Accepted' || o.orderStatus === 'Manufacturer Assigned' ? 'Production Started' : o.orderStatus,
          progressImages: o.progressImages || []
        }));
      setManufacturingOrders(mfgOrders);
 
      const delOrders = localOrders
        .filter(o => o.orderStatus === 'Delivery Assigned' || o.orderStatus === 'Picked Up' || o.orderStatus === 'Shipped' || o.orderStatus === 'Delivered')
        .map(o => ({
          _id: o._id,
          orderId: o._id,
          shippingAddress: o.shippingAddress || '742 Evergreen Terrace, Springfield',
          status: o.orderStatus === 'Delivery Assigned' ? 'Picked Up' : o.orderStatus,
          trackingNotes: o.trackingNotes || 'Dispatched from central hub'
        }));
      setDeliveryOrders(delOrders);

    } catch (error) {
      console.error('Error fetching vendor data', error);
    }
  };

  // Ready-made Orders Action Handlers
  const triggerNotification = (recipient, message, type = 'info') => {
    const notifObj = {
      _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    if (recipient === 'vendor') {
      const existing = JSON.parse(localStorage.getItem('mockVendorNotifications') || '[]');
      localStorage.setItem('mockVendorNotifications', JSON.stringify([notifObj, ...existing]));
    } else if (recipient === 'admin') {
      const existing = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
      localStorage.setItem('mockAdminNotifications', JSON.stringify([notifObj, ...existing]));
    } else if (recipient === 'user') {
      const existing = JSON.parse(localStorage.getItem('mockUserNotifications') || '[]');
      localStorage.setItem('mockUserNotifications', JSON.stringify([notifObj, ...existing]));
    } else if (recipient === 'delivery') {
      const existing = JSON.parse(localStorage.getItem('mockDeliveryNotifications') || '[]');
      localStorage.setItem('mockDeliveryNotifications', JSON.stringify([notifObj, ...existing]));
    }
  };

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const currentVendorId = profile?._id || 'mock_vendor_id_123';
    
    const updated = localOrders.map(o => {
      if (o._id === orderId) {
        let updatedOrder = { ...o, orderStatus: newStatus };
        
        // Notification Triggers based on transition
        if (newStatus === 'Processing') {
          triggerNotification('user', `Vendor accepted your order #${orderId.slice(-6)}. It is now being processed.`, 'success');
        } else if (newStatus === 'Pending Dispatch') {
          triggerNotification('user', `Your order #${orderId.slice(-6)} has been packed and is ready for dispatch.`, 'info');
        } else if (newStatus === 'Dispatched') {
          triggerNotification('user', `Your order #${orderId.slice(-6)} has been dispatched.`, 'info');
          triggerNotification('admin', `Vendor dispatched order #${orderId.slice(-6)}`, 'info');
        } else if (newStatus === 'Out For Delivery') {
          triggerNotification('user', `Your order #${orderId.slice(-6)} is out for delivery!`, 'success');
        } else if (newStatus === 'Delivered') {
          triggerNotification('user', `Your order #${orderId.slice(-6)} has been successfully delivered.`, 'success');
          triggerNotification('admin', `Order #${orderId.slice(-6)} has been delivered.`, 'success');
        } else if (newStatus === 'Completed') {
          triggerNotification('user', `Thank you! Order #${orderId.slice(-6)} has been marked as Completed.`, 'success');
          triggerNotification('admin', `Order #${orderId.slice(-6)} completed. Workflow closed.`, 'success');
        } else if (newStatus === 'Cancelled') {
          triggerNotification('user', `Order #${orderId.slice(-6)} has been cancelled.`, 'error');
          triggerNotification('admin', `Order #${orderId.slice(-6)} was cancelled.`, 'error');
        }
        
        return updatedOrder;
      }
      return o;
    });
    
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setReadyMadeOrders(updated.filter(o => o.orderType === 'Marketplace Product' && (o.vendorId?._id === currentVendorId || o.vendorId === currentVendorId)));
    
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
    }
  };

  const handleDispatchOrder = (orderId, partner, trackingId, installationReq) => {
    if (!partner) {
      alert('Please select a delivery partner.');
      return;
    }
    if (!trackingId.trim()) {
      alert('Please enter a tracking ID.');
      return;
    }
    
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const currentVendorId = profile?._id || 'mock_vendor_id_123';
    
    const updated = localOrders.map(o => {
      if (o._id === orderId) {
        triggerNotification('user', `Your order #${orderId.slice(-6)} has been dispatched via ${partner}. Tracking ID: ${trackingId}`, 'info');
        triggerNotification('admin', `Vendor dispatched order #${orderId.slice(-6)} via ${partner}`, 'info');
        triggerNotification('delivery', `New delivery assigned: order #${orderId.slice(-6)}`, 'warning');
        
        return {
          ...o,
          orderStatus: 'Dispatched',
          deliveryPartnerId: { _id: 'del_mock_' + Date.now(), companyName: partner },
          trackingId: trackingId,
          installationRequired: installationReq
        };
      }
      return o;
    });
    
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setReadyMadeOrders(updated.filter(o => o.orderType === 'Marketplace Product' && (o.vendorId?._id === currentVendorId || o.vendorId === currentVendorId)));
    
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({
        ...prev,
        orderStatus: 'Dispatched',
        deliveryPartnerId: { companyName: partner },
        trackingId: trackingId,
        installationRequired: installationReq
      }));
    }
    alert('✅ Order marked as Dispatched. Delivery partner assigned.');
  };

  const handleApproveReturn = (orderId) => {
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const currentVendorId = profile?._id || 'mock_vendor_id_123';
    
    const updated = localOrders.map(o => {
      if (o._id === orderId) {
        triggerNotification('user', `Your return request for order #${orderId.slice(-6)} has been approved. Refund initiated.`, 'success');
        triggerNotification('admin', `Return approved by vendor for order #${orderId.slice(-6)}`, 'success');
        return { ...o, orderStatus: 'Cancelled', returnStatus: 'Approved', hasReturnRequest: false };
      }
      return o;
    });
    
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setReadyMadeOrders(updated.filter(o => o.orderType === 'Marketplace Product' && (o.vendorId?._id === currentVendorId || o.vendorId === currentVendorId)));
    
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, orderStatus: 'Cancelled', returnStatus: 'Approved', hasReturnRequest: false }));
    }
    alert('Return request approved. Status set to Cancelled.');
  };

  const handleRejectReturn = (orderId) => {
    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const currentVendorId = profile?._id || 'mock_vendor_id_123';
    
    const updated = localOrders.map(o => {
      if (o._id === orderId) {
        triggerNotification('user', `Your return request for order #${orderId.slice(-6)} has been declined.`, 'warning');
        triggerNotification('admin', `Return rejected by vendor for order #${orderId.slice(-6)}`, 'warning');
        return { ...o, returnStatus: 'Rejected', hasReturnRequest: false };
      }
      return o;
    });
    
    localStorage.setItem('mockOrders', JSON.stringify(updated));
    setReadyMadeOrders(updated.filter(o => o.orderType === 'Marketplace Product' && (o.vendorId?._id === currentVendorId || o.vendorId === currentVendorId)));
    
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, returnStatus: 'Rejected', hasReturnRequest: false }));
    }
    alert('Return request declined.');
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
      const chats = JSON.parse(localStorage.getItem(`mockChat_${selectedOrder._id}`) || '[]');
      if (chats.length === 0) {
        const initial = [
          { sender: 'customer', text: `Hi! I placed this order. Could you please make sure it's packed securely?`, time: new Date(selectedOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
        ];
        localStorage.setItem(`mockChat_${selectedOrder._id}`, JSON.stringify(initial));
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

  // Live-refresh ready-made marketplace orders whenever vendor switches to the orders tab
  useEffect(() => {
    if (activeTab === 'orders') {
      const freshOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const mktOrders = freshOrders.filter(o => o.orderType === 'Marketplace Product');
      if (mktOrders.length > 0) {
        setReadyMadeOrders(mktOrders);
      }
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
    localStorage.setItem(`mockChat_${selectedOrder._id}`, JSON.stringify(updated));
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
      // Reload current chats to prevent overwrite
      const current = JSON.parse(localStorage.getItem(`mockChat_${selectedOrder._id}`) || '[]');
      const updatedWithReply = [...current, reply];
      setChatMessages(updatedWithReply);
      localStorage.setItem(`mockChat_${selectedOrder._id}`, JSON.stringify(updatedWithReply));
      
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
      _id: 'prod_' + Date.now(),
      title: newTitle, 
      description: newDesc, 
      price: Number(newPrice), 
      category: newCategory, 
      material: newMaterial || 'Oak Wood', 
      size: newSize || '32x32x30', 
      images: [newImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'],
      stockStatus: 'In Stock',
      vendorId: { _id: 'mock_vendor_id_123', companyName: profile?.companyName || 'Artisan Partner' }
    };
    
    const localProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
    const updatedProducts = [payload, ...localProducts];
    setProducts(updatedProducts);
    localStorage.setItem('mockProducts', JSON.stringify(updatedProducts));
    
    alert('✅ Product listed successfully! It is now live in the Marketplace.');
    setNewTitle(''); setNewDesc(''); setNewPrice(''); setNewMaterial(''); setNewSize(''); setNewImage('');
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
    const updatedTitle = prompt('Enter new title:', p.title);
    if (!updatedTitle) return;
    const updatedPrice = prompt('Enter new price ($):', p.price);
    if (!updatedPrice) return;
    
    const updatedProducts = products.map(item => item._id === p._id ? { ...item, title: updatedTitle, price: Number(updatedPrice) } : item);
    setProducts(updatedProducts);
    localStorage.setItem('mockProducts', JSON.stringify(updatedProducts));
    
    alert('✅ Product updated successfully!');
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const updatedProducts = products.filter(item => item._id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('mockProducts', JSON.stringify(updatedProducts));
    
    alert('✅ Product deleted successfully!');
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
    const quotationFields = { 
      quotationAmount: quoteAmount, 
      quotationMaterials: quoteMaterials, 
      quotationTime: quoteTime 
    };
    
    setCustomRequests(customRequests.map(r => r._id === req._id ? { ...r, status: 'Quotation Sent', ...quotationFields } : r));
    updateRequestStatusInStorage(req._id, 'Quotation Sent', quotationFields);

    // Send customer notification
    const localUserNotifs = JSON.parse(localStorage.getItem('mockUserNotifications') || '[]');
    localStorage.setItem('mockUserNotifications', JSON.stringify([{
      _id: `notif_${Date.now()}`,
      message: `Vendor has sent a quotation of $${quoteAmount} for your ${req.roomType} request.`,
      type: 'success',
      createdAt: new Date().toISOString()
    }, ...localUserNotifs]));

    alert('✅ Quotation sent to customer successfully! User has been notified.');
    setSelectedRequestId(null); setQuoteAmount(''); setQuoteMaterials(''); setQuoteTime('');
  };

  const handleAcceptRequest = async (id) => {
    setCustomRequests(customRequests.map(r => r._id === id ? { ...r, status: 'Vendor Review' } : r));
    updateRequestStatusInStorage(id, 'Vendor Review');
    alert('✅ Design request accepted successfully! The user has been notified.');
  };

  const handleRejectRequest = async (id) => {
    if (!confirm('Are you sure you want to reject this design request?')) return;
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
    const updatedStatus = mfgStatus[id] || 'Production Started';
    const newProgressImage = progressImg[id] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60';

    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const updatedOrders = localOrders.map(o => {
      if (o._id === id) {
        const currentImages = o.progressImages || [];
        return {
          ...o,
          orderStatus: updatedStatus,
          progressImages: [...currentImages, newProgressImage]
        };
      }
      return o;
    });
    localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));

    setManufacturingOrders(manufacturingOrders.map(o => {
      if (o._id === id) {
        return {
          ...o,
          status: updatedStatus,
          progressImages: [...o.progressImages, newProgressImage]
        };
      }
      return o;
    }));

    alert('Manufacturing stage updated successfully!');
  };

  // Delivery Actions
  const handleDelUpdate = async (id) => {
    const updatedStatus = delStatus[id] || 'Shipped';
    const updatedNote = trackingNote[id] || 'In transit';

    const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const updatedOrders = localOrders.map(o => {
      if (o._id === id) {
        return {
          ...o,
          orderStatus: updatedStatus,
          trackingNotes: updatedNote
        };
      }
      return o;
    });
    localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));

    setDeliveryOrders(deliveryOrders.map(o => {
      if (o._id === id) {
        return {
          ...o,
          status: updatedStatus,
          trackingNotes: updatedNote
        };
      }
      return o;
    }));

    alert('Delivery status updated successfully!');
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

  // Verification and Store Setup Handlers
  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    const payload = {
      _id: 'ver_' + Date.now(),
      businessName: verifyBusinessName,
      ownerName: verifyOwnerName,
      phone: verifyPhone,
      email: user?.email || verifyEmail || 'vendor@example.com',
      gstNumber: verifyGst,
      panNumber: verifyPan,
      idProofUrl: verifyIdProof || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600',
      addressProofUrl: verifyAddressProof || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };

    const localVerification = JSON.parse(localStorage.getItem('mockVerificationSubmissions') || '[]');
    const filteredVerification = localVerification.filter(k => k.email !== payload.email);
    localStorage.setItem('mockVerificationSubmissions', JSON.stringify([payload, ...filteredVerification]));

    setVerificationDetails(payload);
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

    const localStoreSetup = JSON.parse(localStorage.getItem('mockStoreSetupSubmissions') || '[]');
    const filteredStoreSetup = localStoreSetup.filter(d => d.email !== payload.email);
    localStorage.setItem('mockStoreSetupSubmissions', JSON.stringify([payload, ...filteredStoreSetup]));

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
                          <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-3">Workflow Actions</h4>
                          <div className="flex flex-wrap gap-3">
                            {status === 'Pending Confirmation' && (
                              <>
                                <button 
                                  onClick={() => handleOrderStatusUpdate(o._id, 'Processing')}
                                  className="flex-1 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                  <Check className="w-4 h-4" /> Accept Order
                                </button>
                                <button 
                                  onClick={() => handleOrderStatusUpdate(o._id, 'Cancelled')}
                                  className="py-3 px-6 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs transition-all"
                                >
                                  Reject / Decline
                                </button>
                              </>
                            )}
                            
                            {status === 'Processing' && (
                              <button 
                                onClick={() => handleOrderStatusUpdate(o._id, 'Pending Dispatch')}
                                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                              >
                                Pack Product & Mark Ready for Dispatch
                              </button>
                            )}

                            {status === 'Dispatched' && (
                              <button 
                                onClick={() => handleOrderStatusUpdate(o._id, 'Out For Delivery')}
                                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <Truck className="w-4 h-4" /> Ship Out For Delivery
                              </button>
                            )}

                            {status === 'Out For Delivery' && (
                              <button 
                                onClick={() => handleOrderStatusUpdate(o._id, 'Delivered')}
                                className="flex-1 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <Check className="w-4 h-4" /> Mark Order Delivered
                              </button>
                            )}

                            {status === 'Delivered' && (
                              <button 
                                onClick={() => handleOrderStatusUpdate(o._id, 'Completed')}
                                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <Check className="w-4 h-4" /> Mark Workflow Completed
                              </button>
                            )}

                            <button 
                              onClick={() => handleDownloadInvoice(o)}
                              className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
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
            <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Custom Design Requests</h2>
            <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-4 py-1.5 rounded-full text-xs font-bold">
              {customRequests.length} {customRequests.length === 1 ? 'Request' : 'Requests'}
            </span>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 pb-2">
            {['All', 'Manual Design', 'Interior Designer Help', 'Own Materials'].map((filt) => (
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
                  if (customRequestFilter === 'All') return true;
                  if (customRequestFilter === 'Manual Design') {
                    return req.requestType === 'Manual Design' || (!req.requestType && req.roomType !== 'Interior Design' && req.style !== 'Consultation' && req.style !== 'AI Generated');
                  }
                  if (customRequestFilter === 'Interior Designer Help') {
                    return req.requestType === 'Interior Designer Help' || (req.roomType === 'Interior Design' && req.style === 'Consultation');
                  }
                  if (customRequestFilter === 'Own Materials') {
                    return req.ownMaterialsAvailable === 'Yes';
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

                  return (
                    <div key={req._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 hover:shadow-md transition-all">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="bg-[#1F2937] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{req.roomType}</span>
                            <span className="text-xs font-bold text-gray-400">ID: {req._id}</span>
                            
                            {/* Request Type Badge */}
                            {(() => {
                              const reqType = req.requestType || 
                                ((req.roomType === 'Interior Design' && req.style === 'Consultation') ? 'Interior Designer Help' : 'Manual Design');
                              const badgeColor = reqType === 'Interior Designer Help' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-amber-50 text-amber-700 border-amber-200';
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
              verificationDetails?.status === 'Submitted' ? 'bg-[#E9C46A]/10 text-[#8B5E3C]' : 'bg-gray-100 text-gray-500'
            }`}>
              Verification Status: {verificationDetails?.status || 'Not Submitted'}
            </div>
          </div>

          {verificationDetails?.adminRemarks && (
            <div className="p-4 bg-gray-50 border-l-4 border-[#E76F51] rounded-r-xl">
              <p className="text-xs font-bold text-gray-700">Admin Remarks:</p>
              <p className="text-xs text-gray-600 mt-1">{verificationDetails.adminRemarks}</p>
            </div>
          )}

          {(!verificationDetails || verificationDetails.status === 'Not Submitted' || verificationDetails.status === 'Rejected') ? (
            <form onSubmit={handleSubmitVerification} className="space-y-6">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Business & Owner Details</h3>
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
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Aadhaar / ID Proof Image URL</label>
                  <input type="text" required value={verifyIdProof} onChange={(e) => setVerifyIdProof(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Address Proof Image URL</label>
                  <input type="text" required value={verifyAddressProof} onChange={(e) => setVerifyAddressProof(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" />
                </div>
              </div>

              <button type="submit" className="px-8 py-4 bg-[#2A9D8F] text-white rounded-xl font-bold hover:bg-[#2A9D8F]/90 transition-all shadow-md mt-4">Submit Business Verification</button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Business Name</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{verificationDetails.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Owner Name</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{verificationDetails.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">GSTIN Number</p>
                  <p className="text-sm font-bold text-gray-800 mt-1 uppercase">{verificationDetails.gstNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">PAN Number</p>
                  <p className="text-sm font-bold text-gray-800 mt-1 uppercase">{verificationDetails.panNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500">Aadhaar / ID Proof</p>
                  <img src={verificationDetails.idProofUrl} alt="ID Proof" className="w-full h-40 object-cover rounded-xl border border-gray-100" />
                </div>
                <div className="border border-gray-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500">Address Proof</p>
                  <img src={verificationDetails.addressProofUrl} alt="Address Proof" className="w-full h-40 object-cover rounded-xl border border-gray-100" />
                </div>
              </div>
            </div>
          )}
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

      {/* TAB: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (() => {
        const updateStock = (id, delta) => {
          setInventoryProducts(prev => {
            const updated = prev.map(p => p._id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p);
            localStorage.setItem('mockProducts', JSON.stringify(updated));
            return updated;
          });
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
          localStorage.setItem('mockPayoutHistory', JSON.stringify(updated));
          setReqAmount(''); setReqAccount(''); setReqNote('');
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
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

    </div>
  );
};

export default VendorDashboard;
