const fs = require('fs');

const filePath = 'C:/Users/renug/OneDrive/Desktop/AI Interior Final Project/frontend/src/pages/VendorDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `  const fetchPartnerData = async () => {
    try {
      // 1. Get Vendor Profile & Stats
      const profileRes = await axios.get('/vendor/profile');
      if (profileRes.data.success) {
        setProfile(profileRes.data.data.vendor);
        setStats(profileRes.data.data.stats);
      }

      // 2. Verification Submission status lookup
      const verifRes = await axios.get('/vendor/verification');
      if (verifRes.data.success) {
        const currentVerification = verifRes.data.data;
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

      // 3. Store Setup Lookup
      const storeRes = await axios.get('/vendor/store-setup');
      if (storeRes.data.success) {
        const currentStoreSetup = storeRes.data.data;
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

      // 4. Products list
      const vendorId = profileRes.data?.data?.vendor?._id;
      if (vendorId) {
        const productsRes = await axios.get('/products?vendorId=' + vendorId);
        if (productsRes.data.success) {
          setProducts(productsRes.data.data);
        }
      }

      // 5. Custom Requests
      const reqRes = await axios.get('/vendor/requests');
      if (reqRes.data.success) {
        setCustomRequests(reqRes.data.data);
      }

      // 6. Orders (Manufacturing and Delivery)
      const ordersRes = await axios.get('/vendor/orders');
      if (ordersRes.data.success) {
        const localOrders = ordersRes.data.data;
        
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

        const pendingOrders = localOrders.filter(o => o.orderStatus === 'Paid - Awaiting Verification');
        setPendingVerificationOrders(pendingOrders);

        const delOrders = localOrders
          .filter(o => o.orderStatus === 'Ready for Delivery' || o.orderStatus === 'Delivered' || o.orderStatus === 'Installation Scheduled' || o.orderStatus === 'Installation Completed')
          .map(o => ({
            _id: o._id,
            orderId: o._id,
            shippingAddress: o.shippingAddress || '742 Evergreen Terrace, Springfield',
            status: o.orderStatus,
            trackingNotes: o.trackingNotes || 'Dispatched from central hub'
          }));
        setDeliveryOrders(delOrders);
      }

    } catch (error) {
      console.error('Error fetching vendor data', error);
    }
  };
`;

const startIndex = content.indexOf('const fetchPartnerData = async () => {');
const endIndexStr = "  // Ready-made Orders Action Handlers";
const endIndex = content.indexOf(endIndexStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Replaced fetchPartnerData successfully.');
} else {
  console.log('Could not find fetchPartnerData or endIndexStr.');
}
