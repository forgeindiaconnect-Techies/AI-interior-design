(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // frontend/src/pages/AdminDashboard.jsx
  var import_react = __toESM(__require("react"), 1);
  var import_AuthContext = __require("../context/AuthContext");
  var import_axios = __toESM(__require("axios"), 1);
  var import_lucide_react = __require("lucide-react");
  var AdminDashboard = ({ activeTab = "overview", setActiveTab }) => {
    const { user } = (0, import_AuthContext.useAuth)();
    const [stats, setStats] = (0, import_react.useState)(null);
    const [managementData, setManagementData] = (0, import_react.useState)(null);
    const [loading, setLoading] = (0, import_react.useState)(true);
    const [broadcastMessage, setBroadcastMessage] = (0, import_react.useState)("");
    const [targetUserId, setTargetUserId] = (0, import_react.useState)("");
    const [assignmentOrder, setAssignmentOrder] = (0, import_react.useState)(null);
    const [selectedPartnerType, setSelectedPartnerType] = (0, import_react.useState)("manufacturer");
    const [selectedPartnerId, setSelectedPartnerId] = (0, import_react.useState)("");
    const [kycSubmissions, setKycSubmissions] = (0, import_react.useState)([]);
    const [depositSubmissions, setDepositSubmissions] = (0, import_react.useState)([]);
    const [remarks, setRemarks] = (0, import_react.useState)({});
    const [userSearch, setUserSearch] = (0, import_react.useState)("");
    const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
    const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
    const [joinedFilter, setJoinedFilter] = (0, import_react.useState)("all");
    const [selectedUser, setSelectedUser] = (0, import_react.useState)(null);
    const [ordersModalUser, setOrdersModalUser] = (0, import_react.useState)(null);
    const [userOrders, setUserOrders] = (0, import_react.useState)([]);
    const [loadingOrders, setLoadingOrders] = (0, import_react.useState)(false);
    const [suspendModalUser, setSuspendModalUser] = (0, import_react.useState)(null);
    const [suspensionReasonText, setSuspensionReasonText] = (0, import_react.useState)("");
    const [confirmActionModal, setConfirmActionModal] = (0, import_react.useState)(null);
    const [mfgSearch, setMfgSearch] = (0, import_react.useState)("");
    const [mfgSpecializationFilter, setMfgSpecializationFilter] = (0, import_react.useState)("all");
    const [mfgKycFilter, setMfgKycFilter] = (0, import_react.useState)("all");
    const [mfgStatusFilter, setMfgStatusFilter] = (0, import_react.useState)("all");
    const [mfgWorkloadFilter, setMfgWorkloadFilter] = (0, import_react.useState)("all");
    const [selectedMfgProfile, setSelectedMfgProfile] = (0, import_react.useState)(null);
    const [selectedMfgLoad, setSelectedMfgLoad] = (0, import_react.useState)(null);
    const [mfgLoadOrders, setMfgLoadOrders] = (0, import_react.useState)([]);
    const [loadingMfgLoad, setLoadingMfgLoad] = (0, import_react.useState)(false);
    const [assignOrderMfg, setAssignOrderMfg] = (0, import_react.useState)(null);
    const [assignOrderDetails, setAssignOrderDetails] = (0, import_react.useState)({ orderId: "", designDetails: "", measurements: "", materials: "", budget: 0 });
    const [mfgApproveConfirm, setMfgApproveConfirm] = (0, import_react.useState)(null);
    const [mfgSuspendConfirm, setMfgSuspendConfirm] = (0, import_react.useState)(null);
    const [mfgSuspendReason, setMfgSuspendReason] = (0, import_react.useState)("");
    const [mfgDocsModal, setMfgDocsModal] = (0, import_react.useState)(null);
    const [mfgPaymentsModal, setMfgPaymentsModal] = (0, import_react.useState)(null);
    const [mfgPayments, setMfgPayments] = (0, import_react.useState)([]);
    const [loadingMfgPayments, setLoadingMfgPayments] = (0, import_react.useState)(false);
    const [deliverySearch, setDeliverySearch] = (0, import_react.useState)("");
    const [deliveryStatusFilter, setDeliveryStatusFilter] = (0, import_react.useState)("all");
    const [deliveryAreaFilter, setDeliveryAreaFilter] = (0, import_react.useState)("all");
    const [deliveryTypeFilter, setDeliveryTypeFilter] = (0, import_react.useState)("all");
    const [deliveryKycFilter, setDeliveryKycFilter] = (0, import_react.useState)("all");
    const [selectedDeliveryProfile, setSelectedDeliveryProfile] = (0, import_react.useState)(null);
    const [assignDeliveryOrderPartner, setAssignDeliveryOrderPartner] = (0, import_react.useState)(null);
    const [assignInstallationJobPartner, setAssignInstallationJobPartner] = (0, import_react.useState)(null);
    const [selectedTrackOrder, setSelectedTrackOrder] = (0, import_react.useState)(null);
    const [selectedPartnerJobs, setSelectedPartnerJobs] = (0, import_react.useState)(null);
    const [assignDeliveryDetails, setAssignDeliveryDetails] = (0, import_react.useState)({ orderId: "" });
    const [assignInstallationDetails, setAssignInstallationDetails] = (0, import_react.useState)({ orderId: "", scheduledDate: "", notes: "" });
    const [selectedAIDesign, setSelectedAIDesign] = (0, import_react.useState)(null);
    const [assignVendorAIDesign, setAssignVendorAIDesign] = (0, import_react.useState)(null);
    const [convertOrderAIDesign, setConvertOrderAIDesign] = (0, import_react.useState)(null);
    const [workflowAIDesign, setWorkflowAIDesign] = (0, import_react.useState)(null);
    const [aiDesignSearch, setAiDesignSearch] = (0, import_react.useState)("");
    const [aiDesignRoomFilter, setAiDesignRoomFilter] = (0, import_react.useState)("all");
    const [aiDesignStatusFilter, setAiDesignStatusFilter] = (0, import_react.useState)("all");
    const [aiDesignBudgetFilter, setAiDesignBudgetFilter] = (0, import_react.useState)("all");
    const [selectedAIDesignVendorId, setSelectedAIDesignVendorId] = (0, import_react.useState)("");
    const [selectedAIDesignManufacturerId, setSelectedAIDesignManufacturerId] = (0, import_react.useState)("");
    (0, import_react.useEffect)(() => {
      fetchAdminData();
    }, []);
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, mgmtRes] = await Promise.all([
          import_axios.default.get("/admin/stats").catch(() => ({ data: { data: { totalUsers: 240, totalVendors: 35, totalOrders: 128, totalRevenue: 45200, totalManufacturers: 14, totalDelivery: 18, estimatedCommission: 6780 } } })),
          import_axios.default.get("/admin/management-data").catch(() => ({ data: { data: { users: [], vendors: [], orders: [], aiDesigns: [], manualDesigns: [] } } }))
        ]);
        setStats(statsRes.data?.data || {});
        const mockMgmtData = mgmtRes.data?.data || {};
        if (!mockMgmtData.users || mockMgmtData.users.length === 0) {
          mockMgmtData.users = [
            {
              _id: "u_mock_1",
              name: "John Doe",
              email: "john@example.com",
              phone: "+91 98765 43210",
              role: "user",
              createdAt: new Date(Date.now() - 36e5 * 24 * 40).toISOString(),
              status: "Active",
              suspensionReason: "",
              totalOrders: 4,
              totalSpending: 2450,
              address: "12, Mahatma Gandhi Road, Bangalore, India"
            },
            {
              _id: "u_mock_2",
              name: "Vendor Demo",
              email: "vendor@example.com",
              phone: "+91 87654 32109",
              role: "vendor",
              createdAt: new Date(Date.now() - 36e5 * 24 * 10).toISOString(),
              status: "Active",
              suspensionReason: "",
              totalOrders: 0,
              totalSpending: 0,
              address: "56, Industrial Area, Noida, India"
            },
            {
              _id: "u_mock_3",
              name: "Alice Smith",
              email: "alice@example.com",
              phone: "+1 555-0144",
              role: "user",
              createdAt: new Date(Date.now() - 36e5 * 24 * 5).toISOString(),
              status: "Suspended",
              suspensionReason: "Suspicious spam order pattern detected",
              totalOrders: 2,
              totalSpending: 1200,
              address: "789 Designer Lane, New York, NY, USA"
            },
            {
              _id: "u_mock_4",
              name: "Bob Builder",
              email: "bob@example.com",
              phone: "+1 555-0177",
              role: "manufacturer",
              createdAt: new Date(Date.now() - 36e5 * 24 * 2).toISOString(),
              status: "Active",
              suspensionReason: "",
              totalOrders: 15,
              totalSpending: 24500,
              address: "Manufacturing Hub, Detroit, MI, USA"
            },
            {
              _id: "u_mock_5",
              name: "Charlie Chaplin",
              email: "charlie@example.com",
              phone: "+1 555-0188",
              role: "user",
              createdAt: new Date(Date.now() - 36e5 * 24 * 1).toISOString(),
              status: "Blocked",
              suspensionReason: "Terms of service violation",
              totalOrders: 1,
              totalSpending: 80,
              address: "456 Cinema Road, Los Angeles, CA, USA"
            }
          ];
          const now = /* @__PURE__ */ new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          mockMgmtData.userStats = {
            totalUsers: mockMgmtData.users.length,
            activeUsers: mockMgmtData.users.filter((u) => u.status === "Active").length,
            suspendedUsers: mockMgmtData.users.filter((u) => u.status === "Suspended").length,
            newUsersThisMonth: mockMgmtData.users.filter((u) => new Date(u.createdAt) >= startOfMonth).length
          };
        }
        if (!mockMgmtData.vendors || mockMgmtData.vendors.length === 0) {
          mockMgmtData.vendors = [
            { _id: "mock_vendor_id_123", companyName: "Artisan Workshop", businessType: "vendor", userId: { email: "vendor@example.com" }, isVerified: true, kycStatus: "Submitted", depositStatus: "Paid", isActive: false },
            { _id: "v2", companyName: "Elite Woodworks", businessType: "manufacturer", userId: { email: "wood@example.com" }, isVerified: false, kycStatus: "Pending", depositStatus: "Pending", isActive: false },
            {
              _id: "del_mock_1",
              companyName: "Swift Logistics Solutions",
              businessType: "delivery",
              description: "Fast, secure home deliveries with cargo vans and medium trucks.",
              rating: 4.9,
              reviewsCount: 156,
              isVerified: true,
              kycStatus: "Approved",
              depositStatus: "Verified",
              isActive: true,
              serviceAreas: ["Bangalore", "Mumbai"],
              vehicleType: "Cargo Van",
              deliveryStatus: "Idle",
              installationAvailable: false,
              userId: { name: "Ravi Kumar", email: "ravi@swiftlogistics.com", phone: "+91 99887 76655" },
              createdAt: new Date(Date.now() - 36e5 * 24 * 45)
            },
            {
              _id: "del_mock_2",
              companyName: "Apex Delivery & Assembly",
              businessType: "delivery",
              description: "Integrated home delivery and premium furniture assembly services.",
              rating: 4.7,
              reviewsCount: 88,
              isVerified: true,
              kycStatus: "Approved",
              depositStatus: "Verified",
              isActive: true,
              serviceAreas: ["Noida", "Delhi NCR"],
              vehicleType: "Mini Truck",
              deliveryStatus: "On Trip",
              installationAvailable: true,
              userId: { name: "Sanjay Sharma", email: "sanjay@apexdelivery.com", phone: "+91 98989 89898" },
              createdAt: new Date(Date.now() - 36e5 * 24 * 30)
            },
            {
              _id: "del_mock_3",
              companyName: "Express Furniture Movers",
              businessType: "delivery",
              description: "Two-wheeler and small vehicle delivery for light packages and accessories.",
              rating: 4.4,
              reviewsCount: 34,
              isVerified: true,
              kycStatus: "Submitted",
              depositStatus: "Pending",
              isActive: true,
              serviceAreas: ["Mumbai"],
              vehicleType: "Two-Wheeler",
              deliveryStatus: "Idle",
              installationAvailable: false,
              userId: { name: "Karan Singh", email: "karan@expressmovers.com", phone: "+91 91234 56789" },
              createdAt: new Date(Date.now() - 36e5 * 24 * 15)
            },
            {
              _id: "del_mock_4",
              companyName: "Elite Installers & Movers",
              businessType: "installation",
              description: "Specialists in heavy custom wardrobe installations and modular kitchens.",
              rating: 4.8,
              reviewsCount: 72,
              isVerified: true,
              kycStatus: "Approved",
              depositStatus: "Verified",
              isActive: false,
              serviceAreas: ["Detroit", "Chicago"],
              vehicleType: "Cargo Van",
              deliveryStatus: "Idle",
              installationAvailable: true,
              userId: { name: "David Miller", email: "david@eliteinstallers.com", phone: "+1 555-0322" },
              createdAt: new Date(Date.now() - 36e5 * 24 * 10)
            }
          ];
        }
        if (!mockMgmtData.orders || mockMgmtData.orders.length === 0) {
          mockMgmtData.orders = [{ _id: "ord_9182", orderType: "custom_design", userId: { name: "Alice" }, vendorId: { companyName: "Artisan Workshop" }, totalAmount: 4500, orderStatus: "Quotation Accepted" }];
        }
        if (!mockMgmtData.aiDesigns || mockMgmtData.aiDesigns.length === 0) {
          mockMgmtData.aiDesigns = [{ _id: "ai_1", roomType: "Living Room", generatedImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200", aiSuggestion: { budgetEstimate: 3e3 }, status: "accepted" }];
        }
        if (!mockMgmtData.manualDesigns || mockMgmtData.manualDesigns.length === 0) {
          mockMgmtData.manualDesigns = [{ _id: "man_1", roomType: "Bedroom", style: "Minimalist", budget: 1500, size: "200 sq ft", requirements: "Cozy and dark.", status: "pending" }];
        }
        setManagementData(mockMgmtData);
        const kycRes = await import_axios.default.get("/admin/kyc").catch(() => ({ data: { data: [] } }));
        const depRes = await import_axios.default.get("/admin/deposits").catch(() => ({ data: { data: [] } }));
        const currentKyc = kycRes.data?.data || [];
        const currentDep = depRes.data?.data || [];
        if (currentKyc.length === 0) {
          setKycSubmissions([
            {
              _id: "kyc_mock_1",
              vendorId: { _id: "mock_vendor_id_123", companyName: "Artisan Workshop" },
              businessName: "Artisan Workshop Private Limited",
              ownerName: "Rajesh Kumar",
              phone: "+91 98765 43210",
              email: "rajesh@artisanworkshop.com",
              gstNumber: "27AAAAA1111A1Z1",
              panNumber: "ABCDE1234F",
              idProofUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600",
              addressProofUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
              bankDetails: { accountNumber: "987654321098", ifscCode: "HDFC0000123", bankName: "HDFC Bank" },
              status: "Pending",
              adminRemarks: ""
            }
          ]);
        } else {
          setKycSubmissions(currentKyc);
        }
        if (currentDep.length === 0) {
          setDepositSubmissions([
            {
              _id: "dep_mock_1",
              vendorId: { _id: "mock_vendor_id_123", companyName: "Artisan Workshop" },
              amount: 25e3,
              paymentStatus: "Paid",
              transactionId: "TXN_98234710293",
              paymentDate: /* @__PURE__ */ new Date(),
              adminRemarks: ""
            }
          ]);
        } else {
          setDepositSubmissions(currentDep);
        }
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    const handleVendorVerification = async (vendorId, isVerified) => {
      try {
        await import_axios.default.put(`/admin/vendor-approval/${vendorId}`, { isVerified }).catch(() => console.log("mock approval"));
        setManagementData({
          ...managementData,
          vendors: managementData.vendors.map((v) => v._id === vendorId ? { ...v, isVerified } : v)
        });
        alert(`Vendor verification updated to: ${isVerified}`);
      } catch (error) {
        alert("Error updating vendor verification");
      }
    };
    const fetchUserOrders = async (userId) => {
      setLoadingOrders(true);
      try {
        const res = await import_axios.default.get(`/admin/users/${userId}/orders`);
        setUserOrders(res.data?.data || []);
      } catch (error) {
        console.warn("Error fetching orders, using mock fallback", error);
        setUserOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    const handleSuspendUserSubmit = async (e) => {
      e.preventDefault();
      if (!suspensionReasonText.trim()) {
        alert("Please provide a suspension reason.");
        return;
      }
      try {
        await import_axios.default.put(`/admin/suspend-user/${suspendModalUser._id}`, { reason: suspensionReasonText });
        const updatedUsers = managementData.users.map(
          (u) => u._id === suspendModalUser._id ? { ...u, status: "Suspended", suspensionReason: suspensionReasonText } : u
        );
        setManagementData({
          ...managementData,
          users: updatedUsers,
          userStats: {
            ...managementData.userStats,
            activeUsers: updatedUsers.filter((u) => u.status === "Active").length,
            suspendedUsers: updatedUsers.filter((u) => u.status === "Suspended").length
          }
        });
        alert(`User ${suspendModalUser.name} suspended successfully.`);
        setSuspendModalUser(null);
        setSuspensionReasonText("");
      } catch (error) {
        alert(error.response?.data?.message || "Error suspending user");
      }
    };
    const handleReactivateUser = async (userId) => {
      try {
        await import_axios.default.put(`/admin/reactivate-user/${userId}`);
        const updatedUsers = managementData.users.map(
          (u) => u._id === userId ? { ...u, status: "Active", suspensionReason: "" } : u
        );
        setManagementData({
          ...managementData,
          users: updatedUsers,
          userStats: {
            ...managementData.userStats,
            activeUsers: updatedUsers.filter((u) => u.status === "Active").length,
            suspendedUsers: updatedUsers.filter((u) => u.status === "Suspended").length
          }
        });
        alert("User reactivated successfully.");
        setConfirmActionModal(null);
      } catch (error) {
        alert(error.response?.data?.message || "Error reactivating user");
      }
    };
    const handleBlockUser = async (userId) => {
      try {
        await import_axios.default.put(`/admin/block-user/${userId}`);
        const updatedUsers = managementData.users.map(
          (u) => u._id === userId ? { ...u, status: "Blocked" } : u
        );
        setManagementData({
          ...managementData,
          users: updatedUsers,
          userStats: {
            ...managementData.userStats,
            activeUsers: updatedUsers.filter((u) => u.status === "Active").length,
            suspendedUsers: updatedUsers.filter((u) => u.status === "Suspended").length
          }
        });
        alert("User blocked successfully.");
        setConfirmActionModal(null);
      } catch (error) {
        alert(error.response?.data?.message || "Error blocking user");
      }
    };
    const handleDeleteUser = async (userId) => {
      try {
        await import_axios.default.delete(`/admin/delete-user/${userId}`);
        const updatedUsers = managementData.users.filter((u) => u._id !== userId);
        const now = /* @__PURE__ */ new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        setManagementData({
          ...managementData,
          users: updatedUsers,
          userStats: {
            totalUsers: updatedUsers.length,
            activeUsers: updatedUsers.filter((u) => u.status === "Active").length,
            suspendedUsers: updatedUsers.filter((u) => u.status === "Suspended").length,
            newUsersThisMonth: updatedUsers.filter((u) => new Date(u.createdAt) >= startOfMonth).length
          }
        });
        alert("User permanently deleted successfully.");
        setConfirmActionModal(null);
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting user");
      }
    };
    const handleAssignPartnerSubmit = async (e) => {
      e.preventDefault();
      try {
        await import_axios.default.post("/admin/assign-partner", {
          orderId: assignmentOrder._id,
          partnerType: selectedPartnerType,
          partnerId: selectedPartnerId
        }).catch(() => console.log("mock assign"));
        alert(`Assigned ${selectedPartnerType} successfully!`);
        setAssignmentOrder(null);
      } catch (error) {
        alert("Error assigning partner");
      }
    };
    const handleBroadcastSubmit = async (e) => {
      e.preventDefault();
      try {
        await import_axios.default.post("/admin/system-notification", { message: broadcastMessage, targetUserId: targetUserId || null }).catch(() => console.log("mock notify"));
        alert("System notification sent successfully!");
        setBroadcastMessage("");
        setTargetUserId("");
      } catch (error) {
        alert("Error sending notification");
      }
    };
    const handleTicketStatus = async (ticketId, status) => {
      try {
        await import_axios.default.put(`/admin/tickets/${ticketId}`, { status }).catch(() => console.log("mock ticket"));
        alert(`Ticket status updated to ${status}`);
      } catch (error) {
        alert("Error updating ticket");
      }
    };
    const handleVerifyKYC = async (id, status) => {
      try {
        const currentRemarks = remarks[id] || "";
        await import_axios.default.put(`/admin/kyc/${id}`, { status, adminRemarks: currentRemarks }).catch(() => console.log("mock kyc verify"));
        setKycSubmissions(kycSubmissions.map((k) => k._id === id ? { ...k, status, adminRemarks: currentRemarks } : k));
        alert(`\u2705 KYC Submission ${status} successfully!`);
      } catch (error) {
        alert("Error updating KYC Status");
      }
    };
    const handleVerifyDeposit = async (id, paymentStatus) => {
      try {
        const currentRemarks = remarks[id] || "";
        await import_axios.default.put(`/admin/deposits/${id}`, { paymentStatus, adminRemarks: currentRemarks }).catch(() => console.log("mock dep verify"));
        setDepositSubmissions(depositSubmissions.map((d) => d._id === id ? { ...d, paymentStatus, adminRemarks: currentRemarks } : d));
        alert(`\u2705 Security Deposit Verification status updated to: ${paymentStatus}!`);
      } catch (error) {
        alert("Error updating Security Deposit verification status");
      }
    };
    const handleVendorActivationToggle = async (vendorId, isActive) => {
      try {
        await import_axios.default.put(`/admin/vendor-activation/${vendorId}`, { isActive }).catch(() => console.log("mock vendor activation"));
        setManagementData({
          ...managementData,
          vendors: managementData.vendors.map((v) => v._id === vendorId ? { ...v, isActive } : v)
        });
        alert(`\u2705 Vendor status set to: ${isActive ? "ACTIVATED (Live)" : "SUSPENDED (Off)"}`);
      } catch (error) {
        alert("Error updating vendor activation status");
      }
    };
    const fetchMfgLoad = async (mfgId) => {
      setLoadingMfgLoad(true);
      try {
        const res = await import_axios.default.get(`/admin/manufacturers/${mfgId}/load`);
        setMfgLoadOrders(res.data?.data || []);
      } catch (error) {
        console.warn("Error fetching manufacturer load, using mock fallback", error);
        setMfgLoadOrders([]);
      } finally {
        setLoadingMfgLoad(false);
      }
    };
    const handleAssignMfgOrder = async (e) => {
      e.preventDefault();
      if (!assignOrderDetails.orderId) {
        alert("Please select an order to assign.");
        return;
      }
      try {
        await import_axios.default.post("/admin/manufacturers/assign-order", {
          orderId: assignOrderDetails.orderId,
          manufacturerId: assignOrderMfg._id,
          designDetails: assignOrderDetails.designDetails || "Custom design manufacturing",
          measurements: assignOrderDetails.measurements || "Standard",
          materials: assignOrderDetails.materials || "Specified wood and upholstery",
          budget: Number(assignOrderDetails.budget) || 1e3
        });
        alert("\u2705 Order assigned to manufacturer successfully!");
        setAssignOrderMfg(null);
        setAssignOrderDetails({ orderId: "", designDetails: "", measurements: "", materials: "", budget: 0 });
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error assigning order to manufacturer");
      }
    };
    const handleApproveMfg = async (mfgId) => {
      try {
        await import_axios.default.put(`/admin/manufacturers/${mfgId}/approve`);
        alert("\u2705 Manufacturer account has been fully verified and activated live!");
        setMfgApproveConfirm(null);
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error approving manufacturer");
      }
    };
    const handleSuspendMfgSubmit = async (e) => {
      e.preventDefault();
      try {
        await import_axios.default.put(`/admin/manufacturers/${mfgSuspendConfirm._id}/suspend`, { reason: mfgSuspendReason });
        alert(`\u26A0\uFE0F Manufacturer ${mfgSuspendConfirm.companyName} has been suspended.`);
        setMfgSuspendConfirm(null);
        setMfgSuspendReason("");
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error suspending manufacturer");
      }
    };
    const fetchMfgPayments = async (mfgId) => {
      setLoadingMfgPayments(true);
      try {
        const res = await import_axios.default.get(`/admin/manufacturers/${mfgId}/payments`);
        setMfgPayments(res.data?.data || []);
      } catch (error) {
        console.warn("Error fetching manufacturer payments, using mock fallback", error);
        setMfgPayments([]);
      } finally {
        setLoadingMfgPayments(false);
      }
    };
    const handleAssignDeliveryOrderSubmit = async (e) => {
      e.preventDefault();
      if (!assignDeliveryDetails.orderId) {
        alert("Please select an order to assign.");
        return;
      }
      try {
        await import_axios.default.post("/admin/assign-partner", {
          orderId: assignDeliveryDetails.orderId,
          partnerType: "delivery",
          partnerId: assignDeliveryOrderPartner._id
        });
        alert("\u2705 Order assigned for delivery successfully!");
        setAssignDeliveryOrderPartner(null);
        setAssignDeliveryDetails({ orderId: "" });
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error assigning delivery order");
      }
    };
    const handleAssignInstallationJobSubmit = async (e) => {
      e.preventDefault();
      if (!assignInstallationDetails.orderId) {
        alert("Please select an order to assign.");
        return;
      }
      try {
        await import_axios.default.post("/admin/assign-partner", {
          orderId: assignInstallationDetails.orderId,
          partnerType: "installation",
          partnerId: assignInstallationJobPartner._id
        });
        await import_axios.default.put("/admin/delivery/update-status", {
          orderId: assignInstallationDetails.orderId,
          type: "installation",
          status: "Installation Scheduled",
          scheduledDate: assignInstallationDetails.scheduledDate,
          notes: assignInstallationDetails.notes
        }).catch(() => console.log("Mock status update"));
        alert("\u2705 Order assigned for installation successfully!");
        setAssignInstallationJobPartner(null);
        setAssignInstallationDetails({ orderId: "", scheduledDate: "", notes: "" });
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error assigning installation job");
      }
    };
    const handleUpdateLogisticsStatus = async (orderId, type, status, trackingNotes) => {
      try {
        await import_axios.default.put("/admin/delivery/update-status", {
          orderId,
          type,
          status,
          trackingNotes
        });
        alert(`\u2705 Status updated successfully to: ${status}`);
        setSelectedTrackOrder(null);
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error updating status");
      }
    };
    const handleApproveAIRequest = async (id) => {
      try {
        await import_axios.default.put(`/admin/ai-designs/${id}/status`, { status: "generated" });
        alert("\u2705 AI Design approved and generated successfully!");
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error approving AI request");
      }
    };
    const handleRejectAIRequest = async (id) => {
      try {
        await import_axios.default.put(`/admin/ai-designs/${id}/status`, { status: "rejected" });
        alert("\u274C AI Design request marked as rejected.");
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error rejecting AI request");
      }
    };
    const handleAssignAIDesignVendorSubmit = async (e) => {
      e.preventDefault();
      if (!selectedAIDesignVendorId) {
        alert("Please select a vendor to assign.");
        return;
      }
      try {
        await import_axios.default.put(`/admin/ai-designs/${assignVendorAIDesign._id}/assign-vendor`, { vendorId: selectedAIDesignVendorId });
        alert("\u2705 Vendor assigned to AI design request successfully!");
        setAssignVendorAIDesign(null);
        setSelectedAIDesignVendorId("");
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error assigning vendor");
      }
    };
    const handleConvertAIDesignOrderSubmit = async (e) => {
      e.preventDefault();
      if (!selectedAIDesignManufacturerId) {
        alert("Please select a manufacturing partner.");
        return;
      }
      try {
        await import_axios.default.post(`/admin/ai-designs/${convertOrderAIDesign._id}/convert-order`, { manufacturerId: selectedAIDesignManufacturerId });
        alert("\u{1F389} Success! AI Design converted to custom order and dispatched to manufacturer!");
        setConvertOrderAIDesign(null);
        setSelectedAIDesignManufacturerId("");
        fetchAdminData();
      } catch (error) {
        alert(error.response?.data?.message || "Error converting AI request to order");
      }
    };
    if (loading) {
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "min-h-screen bg-[#F8F5F0] flex items-center justify-center font-bold text-lg text-[#8B5E3C]" }, "Loading System Admin Console...");
    }
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-10" }, activeTab === "overview" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-center items-center text-center hover:shadow-md transition-all cursor-pointer", onClick: () => setActiveTab && setActiveTab("users") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 bg-[#8B5E3C]/10 rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Users, { className: "w-6 h-6 text-[#8B5E3C]" })), /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-[#1F2937]" }, stats?.totalUsers || 240), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm font-medium text-gray-500 mt-1" }, "Total Users")), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-center items-center text-center hover:shadow-md transition-all cursor-pointer", onClick: () => setActiveTab && setActiveTab("vendors") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 bg-[#D4A373]/20 rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Store, { className: "w-6 h-6 text-[#8B5E3C]" })), /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-[#1F2937]" }, stats?.totalVendors || 35), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm font-medium text-gray-500 mt-1" }, "Total Vendors")), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-center items-center text-center hover:shadow-md transition-all cursor-pointer", onClick: () => setActiveTab && setActiveTab("orders") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 bg-[#2F3E46]/10 rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ShoppingBag, { className: "w-6 h-6 text-[#2F3E46]" })), /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-[#1F2937]" }, stats?.totalOrders || 128), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm font-medium text-gray-500 mt-1" }, "Total Orders")), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-center items-center text-center hover:shadow-md transition-all cursor-pointer", onClick: () => setActiveTab && setActiveTab("payments") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.DollarSign, { className: "w-6 h-6 text-[#2A9D8F]" })), /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-[#1F2937]" }, "$", stats?.totalRevenue?.toLocaleString() || "45,200"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm font-medium text-gray-500 mt-1" }, "Total Revenue"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col md:flex-row items-center justify-between gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-extrabold text-2xl text-[#1F2937]" }, "System Health & Approvals"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[#6B7280] text-sm mt-2 max-w-lg" }, "There are 3 pending KYC approvals for new vendors, and 5 unassigned manufacturing orders.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setActiveTab && setActiveTab("kyc"), className: "px-6 py-3 bg-[#E76F51] text-white rounded-xl font-bold hover:bg-[#E76F51]/90 transition-all shadow-sm" }, "Review KYC"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setActiveTab && setActiveTab("orders"), className: "px-6 py-3 bg-[#1F2937] text-white rounded-xl font-bold hover:bg-black transition-all shadow-md" }, "Assign Orders")))), activeTab === "users" && (() => {
      const filteredUsers = managementData?.users?.filter((u) => {
        const matchesSearch = u.name && u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.phone && u.phone.includes(userSearch);
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        const matchesStatus = statusFilter === "all" || (u.status || "Active") === statusFilter;
        let matchesJoined = true;
        if (joinedFilter !== "all") {
          const createdDate = new Date(u.createdAt);
          const today = /* @__PURE__ */ new Date();
          if (joinedFilter === "today") {
            matchesJoined = createdDate.toDateString() === today.toDateString();
          } else if (joinedFilter === "week") {
            const oneWeekAgo = /* @__PURE__ */ new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            matchesJoined = createdDate >= oneWeekAgo;
          } else if (joinedFilter === "month") {
            const oneMonthAgo = /* @__PURE__ */ new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);
            matchesJoined = createdDate >= oneMonthAgo;
          } else if (joinedFilter === "year") {
            const oneYearAgo = /* @__PURE__ */ new Date();
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            matchesJoined = createdDate >= oneYearAgo;
          }
        }
        return matchesSearch && matchesRole && matchesStatus && matchesJoined;
      }) || [];
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8 animate-fade-in" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center border-b border-gray-100 pb-4" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "User Management & Moderation"), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-500 font-bold" }, "Monitor roles, search registrations, track total orders and spend, and suspend/block access.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-gray-500" }, "Total Users"), /* @__PURE__ */ import_react.default.createElement("div", { className: "w-10 h-10 bg-[#8B5E3C]/10 rounded-full flex items-center justify-center" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Users, { className: "w-5 h-5 text-[#8B5E3C]" }))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-[#1F2937]" }, managementData?.userStats?.totalUsers || 0), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 mt-1 font-semibold uppercase" }, "Platform Registrations"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-gray-500" }, "Active Users"), /* @__PURE__ */ import_react.default.createElement("div", { className: "w-10 h-10 bg-green-50 rounded-full flex items-center justify-center" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserCheck, { className: "w-5 h-5 text-green-600" }))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-green-600" }, managementData?.userStats?.activeUsers || 0), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 mt-1 font-semibold uppercase" }, "Unrestricted Logins"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-gray-500" }, "Suspended Users"), /* @__PURE__ */ import_react.default.createElement("div", { className: "w-10 h-10 bg-[#E76F51]/10 rounded-full flex items-center justify-center" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserX, { className: "w-5 h-5 text-[#E76F51]" }))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-[#E76F51]" }, managementData?.userStats?.suspendedUsers || 0), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 mt-1 font-semibold uppercase" }, "Temporarily Suspended"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-gray-500" }, "New Users This Month"), /* @__PURE__ */ import_react.default.createElement("div", { className: "w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserPlus, { className: "w-5 h-5 text-blue-600" }))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "text-3xl font-extrabold text-blue-600" }, managementData?.userStats?.newUsersThisMonth || 0), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 mt-1 font-semibold uppercase" }, "Joined In May 2026")))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative flex-1 max-w-md" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Search, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search by name, email, or phone...",
          value: userSearch,
          onChange: (e) => setUserSearch(e.target.value),
          className: "w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#D4A373]/30 text-sm focus:outline-none focus:border-[#8B5E3C]"
        }
      )), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-3 gap-3 md:w-auto w-full" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5 bg-white border border-[#D4A373]/30 px-3 py-2 rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "text-gray-400 w-3.5 h-3.5" }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: roleFilter,
          onChange: (e) => setRoleFilter(e.target.value),
          className: "bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Roles"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "user" }, "Customers"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "vendor" }, "Vendors"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "manufacturer" }, "Manufacturers"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "delivery" }, "Delivery"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "installation" }, "Installation")
      )), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5 bg-white border border-[#D4A373]/30 px-3 py-2 rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ShieldCheck, { className: "text-gray-400 w-3.5 h-3.5" }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: statusFilter,
          onChange: (e) => setStatusFilter(e.target.value),
          className: "bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Statuses"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Active" }, "Active"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Suspended" }, "Suspended"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Blocked" }, "Blocked")
      )), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5 bg-white border border-[#D4A373]/30 px-3 py-2 rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Calendar, { className: "text-gray-400 w-3.5 h-3.5" }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: joinedFilter,
          onChange: (e) => setJoinedFilter(e.target.value),
          className: "bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer w-full"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "Joined (All)"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "today" }, "Today"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "week" }, "This Week"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "month" }, "This Month"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "year" }, "This Year")
      )))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react.default.createElement("table", { className: "w-full text-left border-collapse text-sm" }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { className: "border-b border-gray-150 bg-gray-50/50 text-xs font-extrabold uppercase tracking-wider text-gray-500" }, /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "User Name"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Email / Phone"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Role"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Joined Date"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6 text-center" }, "Orders"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6 text-right" }, "Total Spending"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6 text-center" }, "Status"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6 text-right" }, "Actions"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, filteredUsers.length === 0 ? /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", { colSpan: 8, className: "py-16 text-center font-bold text-gray-400" }, "No users matching search or filter criteria.")) : filteredUsers.map((u) => /* @__PURE__ */ import_react.default.createElement("tr", { key: u._id, className: "border-b border-gray-50 hover:bg-[#F8F5F0]/20 transition-all" }, /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 font-bold text-[#1F2937]" }, u.name), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "font-semibold text-gray-600" }, u.email), /* @__PURE__ */ import_react.default.createElement("div", { className: "text-xs text-gray-400 mt-0.5" }, u.phone || "No phone registered")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#8B5E3C]/10 text-[#8B5E3C] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider" }, u.role)), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 text-gray-500 font-medium" }, new Date(u.createdAt).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" })), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 text-center font-bold text-gray-700" }, u.totalOrders || 0), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 text-right font-extrabold text-[#2F3E46]" }, "$", (u.totalSpending || 0).toLocaleString()), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 text-center" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${u.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : u.status === "Suspended" ? "bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/20" : "bg-gray-100 text-gray-600 border-gray-200"}` }, u.status || "Active")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 text-right" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-end items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => setSelectedUser(u),
          className: "p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all border border-gray-200",
          title: "View Full Profile"
        },
        /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Eye, { className: "w-3.5 h-3.5" })
      ), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => {
            setOrdersModalUser(u);
            fetchUserOrders(u._id);
          },
          className: "px-2.5 py-1.5 bg-[#8B5E3C]/10 hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white rounded-xl font-bold text-xs transition-all border border-[#8B5E3C]/20 shadow-sm"
        },
        "Orders"
      ), u.status === "Suspended" ? /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => setConfirmActionModal({ type: "reactivate", user: u }),
          className: "px-2.5 py-1.5 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white rounded-xl font-bold text-xs transition-all border border-green-200 shadow-sm"
        },
        "Restore"
      ) : /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => setSuspendModalUser(u),
          className: "px-2.5 py-1.5 bg-[#E76F51]/10 hover:bg-[#E76F51] text-[#E76F51] hover:text-white rounded-xl font-bold text-xs transition-all border border-[#E76F51]/20 shadow-sm"
        },
        "Suspend"
      ), u.status !== "Blocked" && /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => setConfirmActionModal({ type: "block", user: u }),
          className: "p-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-all border border-gray-200",
          title: "Block Account"
        },
        /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Lock, { className: "w-3.5 h-3.5" })
      ), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => setConfirmActionModal({ type: "delete", user: u }),
          className: "p-2 bg-gray-50 hover:bg-red-600 hover:text-white text-gray-500 rounded-xl transition-all border border-gray-200",
          title: "Permanently Delete User"
        },
        /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Trash2, { className: "w-3.5 h-3.5" })
      ))))))))));
    })(), activeTab === "vendors" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center border-b border-gray-100 pb-4" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Partner & Vendor Management"), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-500 font-bold" }, "Manage system logins, KYC status, and live marketplace activation.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react.default.createElement("table", { className: "w-full text-left border-collapse text-sm" }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { className: "border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-[#6B7280]" }, /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Partner Name"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Role / Type"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "KYC & Deposit"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Platform Status"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4 text-right" }, "Activation Controls"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, managementData?.vendors?.map((vendor) => /* @__PURE__ */ import_react.default.createElement("tr", { key: vendor._id, className: "border-b border-gray-50 hover:bg-gray-50/50 transition-colors" }, /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-[#1F2937]" }, vendor.companyName), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400" }, vendor.userId?.email || "partner@example.com")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" }, vendor.businessType)), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4 space-y-1" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-bold uppercase" }, "KYC:"), /* @__PURE__ */ import_react.default.createElement("span", { className: `text-[10px] font-bold ${vendor.kycStatus === "Approved" || vendor.isVerified ? "text-[#2A9D8F]" : "text-[#E76F51]"}` }, vendor.kycStatus || (vendor.isVerified ? "Approved" : "Pending"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-bold uppercase" }, "Deposit:"), /* @__PURE__ */ import_react.default.createElement("span", { className: `text-[10px] font-bold ${vendor.depositStatus === "Verified" ? "text-[#2A9D8F]" : "text-[#E76F51]"}` }, vendor.depositStatus || "Pending"))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-3 py-1 rounded-full text-xs font-bold ${vendor.isActive ? "bg-[#2A9D8F]/10 text-[#2A9D8F]" : "bg-[#E76F51]/10 text-[#E76F51]"}` }, vendor.isActive ? "LIVE & ACTIVE" : "SUSPENDED/INACTIVE")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4 text-right" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-end gap-2" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => alert(`Reviewing KYC/Deposit details for ${vendor.companyName}...`), className: "px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs transition-all" }, "View Docs"), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        onClick: () => handleVendorActivationToggle(vendor._id, !vendor.isActive),
        className: `px-4 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm ${vendor.isActive ? "bg-[#E76F51] text-white hover:bg-[#E76F51]/90" : "bg-[#2A9D8F] text-white hover:bg-[#2A9D8F]/90"}`
      },
      vendor.isActive ? "Suspend Live" : "Activate Live"
    )))))))))), activeTab === "manufacturers" && (() => {
      const stats2 = managementData?.manufacturerStats || { totalManufacturers: 0, activeManufacturers: 0, pendingKyc: 0, activeManufacturingOrders: 0, completedManufacturingOrders: 0 };
      const manufacturers = managementData?.vendors?.filter((v) => v.businessType === "manufacturer") || [];
      const filteredMfgs = manufacturers.filter((mfg) => {
        const keyword = mfgSearch.toLowerCase();
        const matchesSearch = (mfg.companyName || "").toLowerCase().includes(keyword) || (mfg.userId?.name || "").toLowerCase().includes(keyword) || (mfg.userId?.email || "").toLowerCase().includes(keyword) || (mfg.userId?.phone || "").toLowerCase().includes(keyword) || (mfg.serviceAreas || []).some((area) => area.toLowerCase().includes(keyword));
        const matchesSpecialization = mfgSpecializationFilter === "all" || mfg.specialization === mfgSpecializationFilter;
        const matchesKyc = mfgKycFilter === "all" || mfg.kycStatus === mfgKycFilter;
        const matchesStatus = mfgStatusFilter === "all" || mfgStatusFilter === "active" && mfg.isActive || mfgStatusFilter === "suspended" && !mfg.isActive;
        const matchesWorkload = mfgWorkloadFilter === "all" || mfg.workloadLevel === mfgWorkloadFilter;
        return matchesSearch && matchesSpecialization && matchesKyc && matchesStatus && matchesWorkload;
      });
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8 animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Manufacturer Console & Moderation"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-[#8B5E3C] mt-1 font-medium" }, "Verify industrial profiles, check dynamic workloads, assign design requests, and review payment history.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Total"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#1F2937]" }, stats2.totalManufacturers)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Store, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Active"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#2A9D8F]" }, stats2.activeManufacturers)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.CheckCircle, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Pending KYC"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#E76F51]" }, stats2.pendingKyc)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#E76F51]/10 text-[#E76F51] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.FileText, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Active Production"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#F4A261]" }, stats2.activeManufacturingOrders)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#F4A261]/10 text-[#F4A261] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Hammer, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Completed Orders"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#2A9D8F]" }, stats2.completedManufacturingOrders)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ShoppingBag, { size: 24 })))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col md:flex-row gap-4 items-center" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative flex-1 w-full" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }), /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search by company name, owner name, email, phone, or location...",
          value: mfgSearch,
          onChange: (e) => setMfgSearch(e.target.value),
          className: "w-full pl-12 pr-4 py-3 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] focus:bg-white border border-[#D4A373]/20 rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-[#1F2937]"
        }
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Specialization"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: mfgSpecializationFilter,
          onChange: (e) => setMfgSpecializationFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Specializations"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Woodworks" }, "Woodworks"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Upholstery" }, "Upholstery"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Metal Fabrications" }, "Metal Fabrications"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Modular Cabinets" }, "Modular Cabinets"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Glass Works" }, "Glass Works")
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "KYC Status"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: mfgKycFilter,
          onChange: (e) => setMfgKycFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All KYC Statuses"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Pending" }, "Pending"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Submitted" }, "Submitted"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Approved" }, "Approved"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Rejected" }, "Rejected")
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Account Status"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: mfgStatusFilter,
          onChange: (e) => setMfgStatusFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Statuses"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "active" }, "Active & Verified"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "suspended" }, "Suspended / Pending")
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Workload Level"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: mfgWorkloadFilter,
          onChange: (e) => setMfgWorkloadFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Workloads"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Low" }, "Low (< 20%)"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Medium" }, "Medium (20% - 60%)"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "High" }, "High (60% - 90%)"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Maxed Out" }, "Maxed Out (> 90%)")
      ))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white rounded-3xl border border-[#D4A373]/20 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react.default.createElement("table", { className: "w-full text-left border-collapse text-sm" }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { className: "border-b border-[#D4A373]/10 bg-[#F8F5F0]/45 text-[11px] font-extrabold uppercase tracking-wider text-[#8B5E3C]" }, /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Company & Specialization"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Contact Person"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Location"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Workload / Capacity"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "KYC / Account Status"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Rating"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6 text-right" }, "Actions"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, filteredMfgs.length === 0 ? /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", { colSpan: 7, className: "py-12 text-center text-gray-400 font-bold text-base" }, "No matching manufacturers found. Try adjusting filters or searches.")) : filteredMfgs.map((mfg) => {
        let workloadClass = "bg-blue-50 text-blue-700 border-blue-100";
        if (mfg.workloadLevel === "Medium") workloadClass = "bg-green-50 text-green-700 border-green-100";
        else if (mfg.workloadLevel === "High") workloadClass = "bg-amber-50 text-amber-700 border-amber-100";
        else if (mfg.workloadLevel === "Maxed Out") workloadClass = "bg-rose-50 text-rose-700 border-rose-100";
        return /* @__PURE__ */ import_react.default.createElement("tr", { key: mfg._id, className: "border-b border-gray-100 hover:bg-gray-50/50 transition-colors" }, /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-[#1F2937] text-sm" }, mfg.companyName), /* @__PURE__ */ import_react.default.createElement("span", { className: "inline-flex mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C]" }, mfg.specialization || "Woodworks")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-700 text-xs" }, mfg.userId?.name || "Frank Miller"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium" }, mfg.userId?.email || "mfg@example.com"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium" }, mfg.userId?.phone || "N/A")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-600 text-xs" }, mfg.serviceAreas?.[0] || "Detroit, MI, USA")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4 space-y-1" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${workloadClass}` }, mfg.workloadLevel || "Medium")), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-bold" }, "Capacity: ", /* @__PURE__ */ import_react.default.createElement("span", { className: "text-gray-600 font-extrabold" }, mfg.monthlyCapacity || 50, " units/mo")), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-bold" }, "Active Orders: ", /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[#8B5E3C] font-extrabold" }, mfg.activeOrders || 0))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4 space-y-1" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-bold uppercase" }, "KYC:"), /* @__PURE__ */ import_react.default.createElement("span", { className: `text-[10px] font-bold ${mfg.kycStatus === "Approved" ? "text-[#2A9D8F]" : mfg.kycStatus === "Submitted" ? "text-[#F4A261]" : "text-[#E76F51]"}` }, mfg.kycStatus || "Pending")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-bold uppercase" }, "Account:"), /* @__PURE__ */ import_react.default.createElement("span", { className: `text-[10px] font-bold ${mfg.isActive ? "text-[#2A9D8F]" : "text-[#E76F51]"}` }, mfg.isActive ? "LIVE & ACTIVE" : "SUSPENDED/PENDING"))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-amber-500 font-bold" }, "\u2605"), /* @__PURE__ */ import_react.default.createElement("span", { className: "font-extrabold text-xs text-gray-700" }, mfg.rating ? mfg.rating.toFixed(1) : "4.5"), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400" }, "(", mfg.reviewsCount || 0, ")"))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 text-right" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-end items-center gap-1.5 flex-wrap max-w-[280px]" }, /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setSelectedMfgProfile(mfg),
            title: "View Profile Details",
            className: "p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Eye, { size: 14 })
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => {
              setSelectedMfgLoad(mfg);
              fetchMfgLoad(mfg._id);
            },
            title: "View Current Production Load",
            className: "p-1.5 bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-lg transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Activity, { size: 14 })
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => {
              setAssignOrderMfg(mfg);
              setAssignOrderDetails({ orderId: "", designDetails: "", measurements: "", materials: "", budget: 1e3 });
            },
            title: "Assign Production Order",
            className: "p-1.5 bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#2A9D8F] rounded-lg transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Plus, { size: 14 })
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setMfgDocsModal(mfg),
            title: "Review Submitted Documents",
            className: "p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.FileText, { size: 14 })
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => {
              setMfgPaymentsModal(mfg);
              fetchMfgPayments(mfg._id);
            },
            title: "View Payout Ledger",
            className: "p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.CreditCard, { size: 14 })
        ), !mfg.isActive || mfg.kycStatus !== "Approved" ? /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setMfgApproveConfirm(mfg),
            title: "Approve KYC & Activate Account",
            className: "p-1.5 bg-[#2A9D8F] hover:bg-[#2A9D8F]/95 text-white rounded-lg transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserCheck, { size: 14 })
        ) : /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setMfgSuspendConfirm(mfg),
            title: "Suspend Manufacturer Account",
            className: "p-1.5 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-lg transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserX, { size: 14 })
        ))));
      }))))));
    })(), activeTab === "delivery" && (() => {
      const stats2 = managementData?.deliveryStats || { totalPartners: 0, activePartners: 0, pendingDeliveries: 0, completedDeliveries: 0, pendingInstallation: 0 };
      const deliveryPartners = managementData?.vendors?.filter((v) => v.businessType === "delivery" || v.businessType === "installation") || [];
      const filteredDeliveryPartners = deliveryPartners.filter((partner) => {
        const keyword = deliverySearch.toLowerCase();
        const matchesSearch = (partner.companyName || "").toLowerCase().includes(keyword) || (partner.userId?.name || "").toLowerCase().includes(keyword) || (partner.userId?.email || "").toLowerCase().includes(keyword) || (partner.userId?.phone || "").toLowerCase().includes(keyword) || (partner.serviceAreas || []).some((area) => area.toLowerCase().includes(keyword));
        const matchesStatus = deliveryStatusFilter === "all" || deliveryStatusFilter === "active" && partner.isActive || deliveryStatusFilter === "suspended" && !partner.isActive;
        const matchesArea = deliveryAreaFilter === "all" || (partner.serviceAreas || []).includes(deliveryAreaFilter);
        const matchesType = deliveryTypeFilter === "all" || deliveryTypeFilter === "delivery" && partner.businessType === "delivery" || deliveryTypeFilter === "installation" && partner.businessType === "installation";
        const matchesKyc = deliveryKycFilter === "all" || partner.kycStatus === deliveryKycFilter;
        return matchesSearch && matchesStatus && matchesArea && matchesType && matchesKyc;
      });
      const allAreas = Array.from(new Set(deliveryPartners.flatMap((p) => p.serviceAreas || [])));
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8 animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center border-b border-gray-100 pb-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Delivery Partner Management"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 font-bold mt-1" }, "Manage logistics, track active transits, and assign installation jobs."))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Total Partners"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#1F2937]" }, stats2.totalPartners)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-gray-100 text-gray-600 rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Truck, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Active Partners"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#2A9D8F]" }, stats2.activePartners)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserCheck, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Pending Deliveries"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#F4A261]" }, stats2.pendingDeliveries)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#F4A261]/10 text-[#F4A261] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Package, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Installations Pending"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#E76F51]" }, stats2.pendingInstallation)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#E76F51]/10 text-[#E76F51] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Wrench, { size: 24 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Completed Orders"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-3xl font-extrabold text-[#8B5E3C]" }, stats2.completedDeliveries)), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-3 bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-xl" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.CheckCircle, { size: 24 })))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col md:flex-row gap-4 items-center" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative flex-1 w-full" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }), /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search logistics by name, phone, email, or zone...",
          value: deliverySearch,
          onChange: (e) => setDeliverySearch(e.target.value),
          className: "w-full pl-12 pr-4 py-3 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] focus:bg-white border border-[#D4A373]/20 rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-[#1F2937]"
        }
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Status Filter"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: deliveryStatusFilter,
          onChange: (e) => setDeliveryStatusFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all appearance-none"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Statuses"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "active" }, "Active"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "suspended" }, "Suspended / Inactive")
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Service Area"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: deliveryAreaFilter,
          onChange: (e) => setDeliveryAreaFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all appearance-none"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Areas"),
        allAreas.map((area) => /* @__PURE__ */ import_react.default.createElement("option", { key: area, value: area }, area))
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Service Type"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: deliveryTypeFilter,
          onChange: (e) => setDeliveryTypeFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all appearance-none"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Types"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "delivery" }, "Delivery Only"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "installation" }, "Installation")
      ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "KYC Status"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]", size: 14 }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: deliveryKycFilter,
          onChange: (e) => setDeliveryKycFilter(e.target.value),
          className: "w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all appearance-none"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All KYC Statuses"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Pending" }, "Pending"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Submitted" }, "Submitted"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Approved" }, "Approved"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Rejected" }, "Rejected")
      ))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white rounded-3xl border border-[#D4A373]/20 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react.default.createElement("table", { className: "w-full text-left border-collapse text-sm" }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { className: "border-b border-[#D4A373]/10 bg-[#F8F5F0]/45 text-[11px] font-extrabold uppercase tracking-wider text-[#8B5E3C]" }, /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Partner & Details"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Contact Info"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "Logistics Details"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4" }, "KYC & Account"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-4 text-center" }, "Rating"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6 text-right" }, "Actions"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, filteredDeliveryPartners.length === 0 ? /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", { colSpan: 6, className: "py-12 text-center text-gray-400 font-bold text-base" }, "No matching delivery partners found.")) : filteredDeliveryPartners.map((partner) => {
        let statusClass = "text-green-600 bg-green-50 border-green-100";
        if (partner.deliveryStatus === "On Trip") statusClass = "text-amber-600 bg-amber-50 border-amber-100";
        else if (!partner.isActive) statusClass = "text-gray-600 bg-gray-50 border-gray-100";
        return /* @__PURE__ */ import_react.default.createElement("tr", { key: partner._id, className: "border-b border-gray-100 hover:bg-gray-50/50 transition-colors" }, /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-[#1F2937] text-sm" }, partner.companyName), /* @__PURE__ */ import_react.default.createElement("span", { className: `inline-flex mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${partner.businessType === "delivery" ? "bg-blue-50 text-blue-700" : "bg-[#E76F51]/10 text-[#E76F51]"}` }, partner.businessType)), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-700 text-xs" }, partner.userId?.name || "Contact Name"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium" }, partner.userId?.email || "email@example.com"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium" }, partner.userId?.phone || "N/A")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4 space-y-1" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] font-bold text-gray-600 flex items-center gap-1" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Truck, { size: 12, className: "text-[#8B5E3C]" }), " ", partner.vehicleType || "Standard Truck"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] font-bold text-gray-600 flex items-center gap-1" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.MapPin, { size: 12, className: "text-[#2A9D8F]" }), " ", (partner.serviceAreas || []).join(", ") || "N/A"), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2 items-center mt-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase ${statusClass}` }, partner.deliveryStatus || "Idle"), partner.installationAvailable && /* @__PURE__ */ import_react.default.createElement("span", { className: "px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase bg-purple-50 text-purple-700 border-purple-100" }, "Installs"))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4 space-y-1" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-bold uppercase" }, "KYC:"), /* @__PURE__ */ import_react.default.createElement("span", { className: `text-[10px] font-bold ${partner.kycStatus === "Approved" ? "text-[#2A9D8F]" : partner.kycStatus === "Submitted" ? "text-[#F4A261]" : "text-[#E76F51]"}` }, partner.kycStatus || "Pending")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-bold uppercase" }, "Account:"), /* @__PURE__ */ import_react.default.createElement("span", { className: `text-[10px] font-bold ${partner.isActive ? "text-[#2A9D8F]" : "text-[#E76F51]"}` }, partner.isActive ? "ACTIVE" : "SUSPENDED"))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-4 text-center" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-center gap-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-amber-500 font-bold" }, "\u2605"), /* @__PURE__ */ import_react.default.createElement("span", { className: "font-extrabold text-xs text-gray-700" }, partner.rating ? partner.rating.toFixed(1) : "4.0")), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[9px] text-gray-400 font-medium block mt-0.5" }, "(", partner.reviewsCount || 0, " reviews)")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-4 px-6 text-right" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-end items-center gap-1.5 flex-wrap max-w-[250px]" }, /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setSelectedDeliveryProfile(partner),
            title: "View Partner Profile",
            className: "p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-all border border-gray-200"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Eye, { size: 14 })
        ), partner.businessType === "delivery" && /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setAssignDeliveryOrderPartner(partner),
            title: "Assign Delivery Job",
            className: "p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-blue-200"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Package, { size: 14 })
        ), (partner.installationAvailable || partner.businessType === "installation") && /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setAssignInstallationJobPartner(partner),
            title: "Assign Installation Job",
            className: "p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-all border border-purple-200"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Wrench, { size: 14 })
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setSelectedPartnerJobs(partner),
            title: "View Job History",
            className: "p-1.5 bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-lg transition-all border border-[#D4A373]/30"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.List, { size: 14 })
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => handleVendorActivationToggle(partner._id, !partner.isActive),
            title: partner.isActive ? "Suspend Partner" : "Activate Partner",
            className: `p-1.5 rounded-lg transition-all text-white shadow-sm ${partner.isActive ? "bg-[#E76F51] hover:bg-[#E76F51]/90" : "bg-[#2A9D8F] hover:bg-[#2A9D8F]/90"}`
          },
          partner.isActive ? /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserX, { size: 14 }) : /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserCheck, { size: 14 })
        ))));
      }))))));
    })(), activeTab === "ai_designs" && (() => {
      const aiDesigns = managementData?.aiDesigns || [];
      const totalRequests = aiDesigns.length;
      const pendingRequests = aiDesigns.filter((d) => d.status === "pending").length;
      const acceptedRequests = aiDesigns.filter((d) => d.status === "accepted").length;
      const rejectedRequests = aiDesigns.filter((d) => d.status === "rejected").length;
      const convertedOrdersCount = aiDesigns.filter((d) => d.orderStatus && d.orderStatus !== "Not Converted").length;
      const filteredAiDesigns = aiDesigns.filter((d) => {
        const keyword = aiDesignSearch.toLowerCase();
        const matchesSearch = (d._id || "").toLowerCase().includes(keyword) || (d.userId?.name || "").toLowerCase().includes(keyword) || (d.userId?.email || "").toLowerCase().includes(keyword) || (d.roomType || "").toLowerCase().includes(keyword) || (d.stylePreference || "").toLowerCase().includes(keyword);
        const matchesRoom = aiDesignRoomFilter === "all" || d.roomType === aiDesignRoomFilter;
        const matchesStatus = aiDesignStatusFilter === "all" || d.status === aiDesignStatusFilter;
        const matchesBudget = aiDesignBudgetFilter === "all" || (aiDesignBudgetFilter === "low" ? d.aiSuggestion?.budgetEstimate <= 3e3 : aiDesignBudgetFilter === "mid" ? d.aiSuggestion?.budgetEstimate > 3e3 && d.aiSuggestion?.budgetEstimate <= 5e3 : d.aiSuggestion?.budgetEstimate > 5e3);
        return matchesSearch && matchesRoom && matchesStatus && matchesBudget;
      });
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8 animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center border-b border-gray-100 pb-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "AI Studio Design Center"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-1" }, "Review, approve, assign vendors, and track standard execution workflow of AI-generated designs."))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm flex items-center gap-4 hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 rounded-2xl bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C]" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Sparkles, { size: 20 })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Total AI Requests"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-['Playfair_Display'] font-extrabold text-2xl text-[#1F2937]" }, totalRequests))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm flex items-center gap-4 hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.AlertCircle, { size: 20 })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Pending Requests"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-['Playfair_Display'] font-extrabold text-2xl text-[#1F2937]" }, pendingRequests))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm flex items-center gap-4 hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 rounded-2xl bg-[#2A9D8F]/10 flex items-center justify-center text-[#2A9D8F]" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.CheckCircle, { size: 20 })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Accepted Designs"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-['Playfair_Display'] font-extrabold text-2xl text-[#1F2937]" }, acceptedRequests))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm flex items-center gap-4 hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.XCircle, { size: 20 })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Rejected Designs"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-['Playfair_Display'] font-extrabold text-2xl text-[#1F2937]" }, rejectedRequests))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm flex items-center gap-4 hover:shadow-md transition-all" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ShoppingBag, { size: 20 })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase tracking-wider" }, "Converted Orders"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-['Playfair_Display'] font-extrabold text-2xl text-[#1F2937]" }, convertedOrdersCount)))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col md:flex-row gap-4 justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative w-full md:max-w-md" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Search, { className: "absolute left-4 top-3.5 text-gray-400 w-4 h-4" }), /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search by ID, customer name, room, or style...",
          value: aiDesignSearch,
          onChange: (e) => setAiDesignSearch(e.target.value),
          className: "w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-150 text-sm focus:outline-none focus:border-[#8B5E3C]"
        }
      )), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { className: "w-3.5 h-3.5 text-gray-400" }), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: aiDesignRoomFilter,
          onChange: (e) => setAiDesignRoomFilter(e.target.value),
          className: "text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-bold text-gray-600 focus:outline-none focus:border-[#8B5E3C]"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Rooms"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Living Room" }, "Living Room"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Kitchen" }, "Kitchen"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Bedroom" }, "Bedroom"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Bathroom" }, "Bathroom"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "Office" }, "Office")
      )), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: aiDesignStatusFilter,
          onChange: (e) => setAiDesignStatusFilter(e.target.value),
          className: "text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-bold text-gray-600 focus:outline-none focus:border-[#8B5E3C]"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Design Statuses"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "pending" }, "Pending"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "generated" }, "Generated"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "accepted" }, "Accepted"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "rejected" }, "Rejected")
      ), /* @__PURE__ */ import_react.default.createElement(
        "select",
        {
          value: aiDesignBudgetFilter,
          onChange: (e) => setAiDesignBudgetFilter(e.target.value),
          className: "text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-bold text-gray-600 focus:outline-none focus:border-[#8B5E3C]"
        },
        /* @__PURE__ */ import_react.default.createElement("option", { value: "all" }, "All Budgets"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "low" }, "Under $3,000"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "mid" }, "$3,000 - $5,000"),
        /* @__PURE__ */ import_react.default.createElement("option", { value: "high" }, "Above $5,000")
      )))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white rounded-3xl border border-[#D4A373]/20 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react.default.createElement("table", { className: "w-full text-left border-collapse text-sm" }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { className: "bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider" }, /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "ID & Date"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Customer"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Room & Style"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Original vs AI Design"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Budget"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Workflow Status"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6" }, "Assigned Vendor"), /* @__PURE__ */ import_react.default.createElement("th", { className: "py-4 px-6 text-right" }, "Actions"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, filteredAiDesigns.length === 0 ? /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", { colSpan: 8, className: "text-center py-16 text-gray-400 font-bold" }, "No matching AI Studio design requests found.")) : filteredAiDesigns.map((d) => {
        let statusColor = "bg-gray-100 text-gray-600 border-gray-200";
        if (d.status === "accepted") statusColor = "bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20";
        else if (d.status === "rejected") statusColor = "bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/20";
        else if (d.status === "generated") statusColor = "bg-blue-50 text-blue-600 border-blue-100";
        let orderStatusColor = "bg-gray-50 text-gray-400";
        if (d.orderStatus === "Pending Manufacturing") orderStatusColor = "bg-amber-50 text-amber-600 border border-amber-100";
        else if (d.orderStatus === "In Production") orderStatusColor = "bg-blue-50 text-blue-600 border border-blue-100";
        else if (d.orderStatus === "Dispatched") orderStatusColor = "bg-purple-50 text-purple-600 border border-purple-100";
        else if (d.orderStatus === "Completed") orderStatusColor = "bg-green-50 text-green-600 border border-green-100";
        return /* @__PURE__ */ import_react.default.createElement("tr", { key: d._id, className: "border-b border-gray-100 hover:bg-gray-50/50 transition-colors" }, /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "font-mono text-xs font-bold text-gray-800" }, "#", d._id.slice(-6).toUpperCase()), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium mt-1" }, d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "N/A")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800" }, d.userId?.name || "Customer"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400" }, d.userId?.email || "N/A")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#8B5E3C]/10 text-[#8B5E3C] px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider" }, d.roomType), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-600 mt-1.5" }, d.stylePreference || "Modern Minimalist")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative group" }, /* @__PURE__ */ import_react.default.createElement("img", { src: d.originalImage, alt: "Original", className: "w-12 h-12 object-cover rounded-xl border border-gray-200 shadow-inner group-hover:scale-105 transition-all" }), /* @__PURE__ */ import_react.default.createElement("span", { className: "absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 rounded-b-xl font-bold uppercase scale-0 group-hover:scale-100 transition-all" }, "Original")), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-gray-300" }, "\u2794"), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative group" }, /* @__PURE__ */ import_react.default.createElement("img", { src: d.generatedImage || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400", alt: "AI Studio Output", className: "w-12 h-12 object-cover rounded-xl border border-[#D4A373]/30 shadow-sm group-hover:scale-105 transition-all" }), /* @__PURE__ */ import_react.default.createElement("span", { className: "absolute bottom-0 inset-x-0 bg-[#8B5E3C]/80 text-[8px] text-white text-center py-0.5 rounded-b-xl font-bold uppercase scale-0 group-hover:scale-100 transition-all" }, "AI Studio")))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "font-extrabold text-gray-800" }, "$", d.aiSuggestion?.budgetEstimate || "N/A")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${statusColor}` }, d.status)), d.orderStatus && d.orderStatus !== "Not Converted" && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${orderStatusColor}` }, d.orderStatus))), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6" }, d.assignedVendor ? /* @__PURE__ */ import_react.default.createElement("div", { className: "text-xs" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800" }, d.assignedVendor.companyName), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400" }, "Assigned Partner")) : /* @__PURE__ */ import_react.default.createElement("span", { className: "text-xs text-gray-400 italic" }, "No Vendor Assigned")), /* @__PURE__ */ import_react.default.createElement("td", { className: "py-5 px-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-end items-center gap-1.5 flex-wrap max-w-[280px]" }, /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setSelectedAIDesign(d),
            title: "View Full Design Details",
            className: "p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Eye, { size: 14 })
        ), d.status === "pending" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => handleApproveAIRequest(d._id),
            title: "Approve & Generate AI Design",
            className: "p-2 bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#2A9D8F] rounded-xl transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.CheckCircle, { size: 14 })
        ), /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => handleRejectAIRequest(d._id),
            title: "Reject Design Request",
            className: "p-2 bg-[#E76F51]/10 hover:bg-[#E76F51]/20 text-[#E76F51] rounded-xl transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.XCircle, { size: 14 })
        )), d.status === "accepted" && !d.assignedVendor && /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setAssignVendorAIDesign(d),
            title: "Assign Partner Vendor",
            className: "p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserPlus, { size: 14 })
        ), d.status === "accepted" && d.orderStatus === "Not Converted" && /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setConvertOrderAIDesign(d),
            title: "Convert AI Design to Production Order",
            className: "p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ShoppingBag, { size: 14 })
        ), d.generatedImage && /* @__PURE__ */ import_react.default.createElement(
          "a",
          {
            href: d.generatedImage,
            download: `ai-studio-design-${d._id.slice(-6)}.jpg`,
            target: "_blank",
            rel: "noreferrer",
            title: "Download Generated Design",
            className: "p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Download, { size: 14 })
        ), d.orderStatus && d.orderStatus !== "Not Converted" && /* @__PURE__ */ import_react.default.createElement(
          "button",
          {
            onClick: () => setWorkflowAIDesign(d),
            title: "Track Workflow Milestones",
            className: "p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-all"
          },
          /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Activity, { size: 14 })
        ))));
      }))))));
    })(), activeTab === "manual_designs" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Manual Design Requests"), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6" }, managementData?.manualDesigns?.map((m) => /* @__PURE__ */ import_react.default.createElement("div", { key: m._id, className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center border-b border-gray-100 pb-4" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" }, m.roomType), /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#E9C46A] text-[#1F2937] px-3 py-1 rounded-full text-xs font-bold" }, m.status.toUpperCase())), /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-xl text-[#1F2937]" }, "Style: ", m.style), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-[#6B7280]" }, "Budget: $", m.budget, " \u2022 Size: ", m.size), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-[#1F2937] bg-[#F8F5F0] p-4 rounded-2xl border border-[#D4A373]/30" }, /* @__PURE__ */ import_react.default.createElement("strong", null, "Req:"), " ", m.requirements))))), activeTab === "designer_requests" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Interior Designer Requests"), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center p-12" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-bold" }, "List of users requesting premium interior designer consultations goes here."))), activeTab === "orders" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Global Order Tracking & Assignments"), managementData?.orders?.map((order) => /* @__PURE__ */ import_react.default.createElement("div", { key: order._id, className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-6" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" }, order.orderType.replace("_", " ")), /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] mt-2" }, "Order #", order._id.slice(-6)), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#6B7280] mt-1" }, "Customer: ", order.userId?.name || "Customer", " \u2022 Vendor: ", order.vendorId?.companyName || "Vendor")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "text-right" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "font-['Playfair_Display'] font-extrabold text-3xl text-[#8B5E3C]" }, "$", order.totalAmount), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#6B7280] font-bold uppercase tracking-wider mt-1" }, "Workflow Stage: ", /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[#2A9D8F]" }, order.orderStatus))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setAssignmentOrder(order), className: "bg-[#1F2937] hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all" }, "Assign Partner"))), assignmentOrder?._id === order._id && /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleAssignPartnerSubmit, className: "bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4A373]/30 space-y-4 shadow-inner" }, /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-sm text-[#1F2937]" }, "Assign Workflow Partner"), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2" }, "Partner Role"), /* @__PURE__ */ import_react.default.createElement("select", { value: selectedPartnerType, onChange: (e) => setSelectedPartnerType(e.target.value), className: "w-full p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#8B5E3C]" }, /* @__PURE__ */ import_react.default.createElement("option", { value: "manufacturer" }, "Custom Manufacturer"), /* @__PURE__ */ import_react.default.createElement("option", { value: "delivery" }, "Delivery Partner"), /* @__PURE__ */ import_react.default.createElement("option", { value: "installation" }, "Installation Expert"))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2" }, "Select Verified Partner"), /* @__PURE__ */ import_react.default.createElement("select", { value: selectedPartnerId, onChange: (e) => setSelectedPartnerId(e.target.value), required: true, className: "w-full p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#8B5E3C]" }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "Choose a partner..."), managementData?.vendors?.filter((v) => v.businessType === selectedPartnerType).map((v) => /* @__PURE__ */ import_react.default.createElement("option", { key: v._id, value: v._id }, v.companyName))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2 pt-2" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-[#8B5E3C] text-white rounded-xl font-bold text-sm shadow-md" }, "Confirm Assignment"), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setAssignmentOrder(null), className: "py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm" }, "Cancel")))))), activeTab === "payments" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#2A9D8F] p-8 rounded-3xl text-white space-y-2 shadow-lg" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-[#E9C46A] uppercase tracking-wider text-xs" }, "Total Platform Revenue"), /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-extrabold text-5xl" }, "$", stats?.totalRevenue?.toLocaleString() || "45,200")), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#1F2937] p-8 rounded-3xl text-white space-y-2 shadow-lg" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-[#E76F51] uppercase tracking-wider text-xs" }, "Platform Commission (15%)"), /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-extrabold text-5xl" }, "$", stats?.estimatedCommission?.toLocaleString() || "6,780"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center p-12" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-bold" }, "Payouts and transaction ledgers will be displayed here."))), activeTab === "tickets" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Customer Support Tickets"), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-start border-b border-gray-100 pb-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#E76F51]/10 text-[#E76F51] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" }, "Support Ticket"), /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl text-[#1F2937] mt-2" }, "Delivery Delay Inquiry"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#6B7280]" }, "Customer: John Doe \u2022 Status: OPEN")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => handleTicketStatus("mock_id", "in_progress"), className: "bg-[#E9C46A] text-[#1F2937] px-4 py-2 rounded-xl font-bold text-xs shadow-sm" }, "In Progress"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => handleTicketStatus("mock_id", "resolved"), className: "bg-[#2A9D8F] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm" }, "Resolve"))), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-[#1F2937] bg-[#F8F5F0] p-4 rounded-2xl border border-[#D4A373]/30" }, /* @__PURE__ */ import_react.default.createElement("strong", null, "Issue:"), " The assigned delivery partner hasn't updated tracking for 2 days."))), activeTab === "analytics" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Reports & Analytics"), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center p-24" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.BarChart2, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-bold" }, "Advanced charting and demographic data exports will be available here."))), activeTab === "kyc" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "KYC Document Approvals"), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-6" }, kycSubmissions.length === 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-12 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center text-gray-500 font-bold" }, "No KYC documents submitted yet.") : kycSubmissions.map((sub) => /* @__PURE__ */ import_react.default.createElement("div", { key: sub._id, className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl text-[#1F2937]" }, sub.businessName), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-1" }, "Submitted by ", sub.ownerName, " (", sub.email, ")")), /* @__PURE__ */ import_react.default.createElement("span", { className: `px-4 py-2 rounded-full font-bold text-xs ${sub.status === "Approved" ? "bg-[#2A9D8F]/10 text-[#2A9D8F]" : sub.status === "Rejected" ? "bg-[#E76F51]/10 text-[#E76F51]" : "bg-[#E9C46A]/10 text-[#8B5E3C]"}` }, "Status: ", sub.status)), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-xs" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "GSTIN Number"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 mt-1 uppercase" }, sub.gstNumber)), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "PAN Number"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 mt-1 uppercase" }, sub.panNumber)), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Phone Contact"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 mt-1" }, sub.phone))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "border border-gray-200 rounded-2xl p-4 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-500" }, "ID Proof Document"), /* @__PURE__ */ import_react.default.createElement("a", { href: sub.idProofUrl, target: "_blank", rel: "noreferrer", className: "block relative group overflow-hidden rounded-xl border border-gray-100" }, /* @__PURE__ */ import_react.default.createElement("img", { src: sub.idProofUrl, alt: "ID Proof", className: "w-full h-48 object-cover group-hover:scale-105 transition-all" }), /* @__PURE__ */ import_react.default.createElement("span", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold text-white text-xs" }, "View Original URL"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "border border-gray-200 rounded-2xl p-4 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-500" }, "Address Proof Document"), /* @__PURE__ */ import_react.default.createElement("a", { href: sub.addressProofUrl, target: "_blank", rel: "noreferrer", className: "block relative group overflow-hidden rounded-xl border border-gray-100" }, /* @__PURE__ */ import_react.default.createElement("img", { src: sub.addressProofUrl, alt: "Address Proof", className: "w-full h-48 object-cover group-hover:scale-105 transition-all" }), /* @__PURE__ */ import_react.default.createElement("span", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold text-white text-xs" }, "View Original URL")))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-gray-50 p-6 rounded-2xl border border-gray-100" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-400 uppercase mb-3" }, "Escrow Settlement Account Details"), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-3 gap-6 text-xs" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500" }, "Account Number"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800" }, sub.bankDetails?.accountNumber)), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500" }, "IFSC Routing Code"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 uppercase" }, sub.bankDetails?.ifscCode)), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500" }, "Bank Institution"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800" }, sub.bankDetails?.bankName)))), sub.adminRemarks && /* @__PURE__ */ import_react.default.createElement("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-200" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-700" }, "Existing Remarks: ", /* @__PURE__ */ import_react.default.createElement("span", { className: "font-normal text-gray-600" }, sub.adminRemarks))), /* @__PURE__ */ import_react.default.createElement("div", { className: "pt-4 border-t border-gray-100 space-y-4" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-[#1F2937] uppercase tracking-wider" }, "Evaluation Remarks / Feedback"), /* @__PURE__ */ import_react.default.createElement("textarea", { rows: 2, placeholder: "Enter remarks for the vendor regarding approval or rejection...", value: remarks[sub._id] || "", onChange: (e) => setRemarks({ ...remarks, [sub._id]: e.target.value }), className: "w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1F2937]" }), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => handleVerifyKYC(sub._id, "Approved"), className: "px-6 py-3 bg-[#2A9D8F] text-white rounded-xl font-bold text-xs shadow-md" }, "Approve KYC"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => handleVerifyKYC(sub._id, "Rejected"), className: "px-6 py-3 bg-[#E76F51] text-white rounded-xl font-bold text-xs shadow-md" }, "Reject KYC Docs"))))))), activeTab === "deposit" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "Platform Security Deposit Ledger"), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-6" }, depositSubmissions.length === 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-12 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center text-gray-500 font-bold" }, "No security deposit transactions submitted yet.") : depositSubmissions.map((sub) => /* @__PURE__ */ import_react.default.createElement("div", { key: sub._id, className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl text-[#1F2937]" }, sub.vendorId?.companyName || "Artisan Workshop"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-1" }, "Transaction Ref: **", sub.transactionId, "**")), /* @__PURE__ */ import_react.default.createElement("span", { className: `px-4 py-2 rounded-full font-bold text-xs ${sub.paymentStatus === "Verified" ? "bg-[#2A9D8F]/10 text-[#2A9D8F]" : sub.paymentStatus === "Failed" ? "bg-[#E76F51]/10 text-[#E76F51]" : "bg-[#E9C46A]/10 text-[#8B5E3C]"}` }, "Payment Status: ", sub.paymentStatus)), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-xs" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Paid Amount"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-extrabold text-lg text-gray-800 mt-1" }, "$", sub.amount?.toLocaleString() || "25,000")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Payment UTR ID"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 mt-1 break-all uppercase" }, sub.transactionId)), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Submission Date"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 mt-1" }, new Date(sub.paymentDate).toLocaleString()))), sub.adminRemarks && /* @__PURE__ */ import_react.default.createElement("div", { className: "p-4 bg-gray-50 rounded-xl border border-[#D4A373]/30" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-700" }, "Remarks: ", /* @__PURE__ */ import_react.default.createElement("span", { className: "font-normal text-gray-600" }, sub.adminRemarks))), /* @__PURE__ */ import_react.default.createElement("div", { className: "pt-4 border-t border-gray-100 space-y-4" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-[#1F2937] uppercase tracking-wider" }, "Verification Remarks"), /* @__PURE__ */ import_react.default.createElement("textarea", { rows: 2, placeholder: "Add remarks for transaction verification...", value: remarks[sub._id] || "", onChange: (e) => setRemarks({ ...remarks, [sub._id]: e.target.value }), className: "w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1F2937]" }), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => handleVerifyDeposit(sub._id, "Verified"), className: "px-6 py-3 bg-[#2A9D8F] text-white rounded-xl font-bold text-xs shadow-md" }, "Verify Payment"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => handleVerifyDeposit(sub._id, "Failed"), className: "px-6 py-3 bg-[#E76F51] text-white rounded-xl font-bold text-xs shadow-md" }, "Reject/Mark Failed"))))))), activeTab === "roles" && /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]" }, "System Roles & Permissions"), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center p-12" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-bold" }, "Manage sub-admin accounts and granular ACL permissions here."))), activeTab === "notifications" && /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 self-start" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-3 border-b border-gray-100 pb-4" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Bell, { className: "w-6 h-6 text-[#E76F51]" }), /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]" }, "Broadcast Notification")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleBroadcastSubmit, className: "space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2" }, "Message"), /* @__PURE__ */ import_react.default.createElement("textarea", { rows: 4, required: true, value: broadcastMessage, onChange: (e) => setBroadcastMessage(e.target.value), placeholder: "System maintenance notice...", className: "w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F51] text-sm" })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2" }, "Target User ID (Optional)"), /* @__PURE__ */ import_react.default.createElement("input", { type: "text", value: targetUserId, onChange: (e) => setTargetUserId(e.target.value), placeholder: "Leave empty for ALL users", className: "w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F51] text-sm" })), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "w-full py-4 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Send, { className: "w-5 h-5" }), " Send Broadcast"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] border-b border-gray-100 pb-4" }, "Recent Alerts"), /* @__PURE__ */ import_react.default.createElement("div", { className: "py-12 text-center text-gray-400" }, "No recent system alerts."))), selectedUser && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#F8F5F0] max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fade-in" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#1F2937] p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-2xl" }, selectedUser.name), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 mt-1" }, "System Account Profile")), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedUser(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-extrabold uppercase font-sans" }, "Email Address"), /* @__PURE__ */ import_react.default.createElement("div", { className: "font-bold text-gray-800 text-sm mt-1 break-all" }, selectedUser.email)), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-extrabold uppercase font-sans" }, "Phone Number"), /* @__PURE__ */ import_react.default.createElement("div", { className: "font-bold text-gray-800 text-sm mt-1" }, selectedUser.phone || "None registered")), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-extrabold uppercase font-sans" }, "Account Role"), /* @__PURE__ */ import_react.default.createElement("div", { className: "font-bold text-gray-800 text-sm mt-1 uppercase" }, selectedUser.role)), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-extrabold uppercase font-sans" }, "Joined Date"), /* @__PURE__ */ import_react.default.createElement("div", { className: "font-bold text-gray-800 text-sm mt-1" }, new Date(selectedUser.createdAt).toLocaleDateString(void 0, { year: "numeric", month: "long", day: "numeric" })))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm space-y-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-gray-400 font-extrabold uppercase font-sans" }, "Physical Location / Address"), /* @__PURE__ */ import_react.default.createElement("div", { className: "font-bold text-gray-800 text-sm mt-1 leading-relaxed" }, selectedUser.address || "No physical address provided.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-green-700 font-bold uppercase font-sans" }, "Total Spend"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xl font-extrabold text-[#2F3E46] mt-1" }, "$", (selectedUser.totalSpending || 0).toLocaleString())), /* @__PURE__ */ import_react.default.createElement(import_lucide_react.DollarSign, { className: "w-6 h-6 text-green-600 opacity-60" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[10px] text-blue-700 font-bold uppercase font-sans" }, "Orders Count"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xl font-extrabold text-[#2F3E46] mt-1" }, selectedUser.totalOrders || 0)), /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ShoppingBag, { className: "w-6 h-6 text-blue-600 opacity-60" }))), selectedUser.status === "Suspended" && /* @__PURE__ */ import_react.default.createElement("div", { className: "p-4 bg-[#E76F51]/10 rounded-2xl border border-[#E76F51]/20 flex gap-3" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Info, { className: "w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" }), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h5", { className: "text-xs font-bold text-[#E76F51] uppercase font-sans" }, "Suspension Reason"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-semibold text-gray-700 mt-1" }, selectedUser.suspensionReason || "No reason provided."))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedUser(null), className: "w-full py-3 bg-[#1F2937] hover:bg-black text-white rounded-xl font-bold shadow-md transition-all" }, "Close Profile")))), ordersModalUser && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#F8F5F0] max-w-2xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fade-in flex flex-col max-h-[85vh]" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#1F2937] p-6 text-white flex justify-between items-center flex-shrink-0" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-2xl" }, "Orders for ", ordersModalUser.name), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 mt-1" }, "Transaction History & Fulfillments")), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setOrdersModalUser(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 overflow-y-auto space-y-6 flex-1" }, loadingOrders ? /* @__PURE__ */ import_react.default.createElement("div", { className: "py-24 text-center font-bold text-gray-500 animate-pulse" }, "Loading orders list...") : userOrders.length === 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "py-24 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl bg-white p-8" }, "No design packages or marketplace orders registered for this user yet.") : /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-4" }, userOrders.map((ord) => /* @__PURE__ */ import_react.default.createElement("div", { key: ord._id, className: "bg-white p-5 rounded-2xl border border-gray-150 hover:shadow-sm transition-all space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-start" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${ord.orderType === "custom_design" ? "bg-[#8B5E3C]/10 text-[#8B5E3C]" : "bg-[#2A9D8F]/10 text-[#2A9D8F]"}` }, ord.orderType === "custom_design" ? "Room Design" : "Marketplace"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-gray-800 text-sm mt-1.5" }, ord.title), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 mt-0.5" }, "Reference ID: ", ord._id)), /* @__PURE__ */ import_react.default.createElement("div", { className: "text-right" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-sm font-extrabold text-[#2F3E46]" }, "$", ord.totalAmount?.toLocaleString()), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 mt-0.5" }, new Date(ord.createdAt).toLocaleDateString()))), ord.items && ord.items.length > 0 && /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5 text-xs text-gray-600" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[9px] text-gray-400 font-bold uppercase block mb-1" }, "Purchased Products"), ord.items.map((item, idx) => /* @__PURE__ */ import_react.default.createElement("div", { key: idx, className: "flex justify-between font-medium" }, /* @__PURE__ */ import_react.default.createElement("span", null, item.title, " (x", item.quantity, ")"), /* @__PURE__ */ import_react.default.createElement("span", { className: "font-semibold" }, "$", (item.price * item.quantity).toLocaleString())))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center text-xs border-t border-gray-100 pt-3" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-gray-500 font-medium" }, "Vendor: ", /* @__PURE__ */ import_react.default.createElement("span", { className: "font-bold text-gray-700" }, ord.vendorName || "Marketplace Warehouse")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${ord.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-[#E9C46A]/20 text-[#8B5E3C]"}` }, ord.paymentStatus), /* @__PURE__ */ import_react.default.createElement("span", { className: "bg-[#1F2937] text-white px-2 py-0.5 rounded text-[9px] font-extrabold uppercase" }, ord.orderStatus))))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-6 bg-white border-t border-gray-150 flex-shrink-0" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setOrdersModalUser(null), className: "w-full py-3 bg-[#1F2937] hover:bg-black text-white rounded-xl font-bold shadow-md transition-all" }, "Close History")))), suspendModalUser && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fade-in" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#E76F51] p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Suspend User Account"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#F8F5F0] opacity-80 mt-1" }, suspendModalUser.name)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSuspendModalUser(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleSuspendUserSubmit, className: "p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#E76F51]/10 p-4 rounded-2xl border border-[#E76F51]/20 flex gap-3 text-xs text-gray-700" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.AlertCircle, { className: "w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" }), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h5", { className: "font-bold text-[#E76F51] uppercase font-sans" }, "Warning"), /* @__PURE__ */ import_react.default.createElement("p", { className: "mt-1 font-semibold leading-relaxed" }, "This action restricts the user from logging in or using platform features. A formal suspension notice will be dispatched and registered in admin moderation logs."))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider font-sans" }, "Reason for Suspension *"), /* @__PURE__ */ import_react.default.createElement(
      "textarea",
      {
        rows: 3,
        required: true,
        value: suspensionReasonText,
        onChange: (e) => setSuspensionReasonText(e.target.value),
        placeholder: "Spamming interior design request logs / Chargeback behavior / Policy breach...",
        className: "w-full p-4 rounded-xl border border-gray-250 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51]"
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setSuspendModalUser(null), className: "flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-xl font-bold shadow-md transition-all" }, "Suspend User"))))), confirmActionModal && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-sm w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fade-in p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "text-center space-y-3" }, /* @__PURE__ */ import_react.default.createElement("div", { className: `w-14 h-14 rounded-full mx-auto flex items-center justify-center ${confirmActionModal.type === "reactivate" ? "bg-green-50 text-green-600" : confirmActionModal.type === "block" ? "bg-gray-50 text-gray-600" : "bg-red-50 text-red-600"}` }, confirmActionModal.type === "reactivate" ? /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Unlock, { className: "w-7 h-7" }) : confirmActionModal.type === "block" ? /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Lock, { className: "w-7 h-7" }) : /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Trash2, { className: "w-7 h-7" })), /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-extrabold text-xl text-[#1F2937] capitalize" }, confirmActionModal.type, " Account"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 font-semibold leading-relaxed" }, confirmActionModal.type === "reactivate" && `Are you sure you want to restore status for ${confirmActionModal.user?.name}? They will immediately be authorized to log in again.`, confirmActionModal.type === "block" && `Are you sure you want to block ${confirmActionModal.user?.name}? They will be blocked from logging in or registering until active review.`, confirmActionModal.type === "delete" && `Warning: This will permanently delete user ${confirmActionModal.user?.name} from the database. This action is irreversible.`)), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => setConfirmActionModal(null),
        className: "flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-xs"
      },
      "Cancel"
    ), /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          if (confirmActionModal.type === "reactivate") handleReactivateUser(confirmActionModal.user?._id);
          if (confirmActionModal.type === "block") handleBlockUser(confirmActionModal.user?._id);
          if (confirmActionModal.type === "delete") handleDeleteUser(confirmActionModal.user?._id);
        },
        className: `flex-1 py-3 text-white rounded-xl font-bold transition-all text-xs shadow-md ${confirmActionModal.type === "reactivate" ? "bg-green-600 hover:bg-green-700" : confirmActionModal.type === "block" ? "bg-gray-800 hover:bg-black" : "bg-red-600 hover:bg-red-700"}`
      },
      "Yes, Confirm"
    )))), selectedMfgProfile && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#8B5E3C] p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Manufacturer Profile"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#F8F5F0] opacity-80 mt-1" }, selectedMfgProfile.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedMfgProfile(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "About Company"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-gray-700 mt-1 font-medium leading-relaxed" }, selectedMfgProfile.description || "Industrial production specialist working on custom woodworks and setups.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Specialization"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-[#8B5E3C] font-bold mt-0.5" }, selectedMfgProfile.specialization || "Woodworks")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Monthly Capacity"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-gray-700 font-bold mt-0.5" }, selectedMfgProfile.monthlyCapacity || 50, " units"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-4 border-t border-gray-100 pt-4" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Contact Person"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-gray-700 font-bold mt-0.5" }, selectedMfgProfile.userId?.name || "Frank Miller")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Phone"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-gray-700 font-bold mt-0.5" }, selectedMfgProfile.userId?.phone || "N/A"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "border-t border-gray-100 pt-4" }, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider" }, "Location & Service Areas"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-gray-700 font-bold mt-0.5" }, selectedMfgProfile.serviceAreas?.join(", ") || "Detroit, MI, USA"))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedMfgProfile(null), className: "w-full py-3 bg-[#8B5E3C] hover:bg-[#8B5E3C]/95 text-white rounded-xl font-bold transition-all shadow-md" }, "Close Profile")))), selectedMfgLoad && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-2xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#8B5E3C] p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Current Production Load"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#F8F5F0] opacity-80 mt-1" }, selectedMfgLoad.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedMfgLoad(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 max-h-[60vh] overflow-y-auto space-y-6" }, loadingMfgLoad ? /* @__PURE__ */ import_react.default.createElement("div", { className: "py-12 text-center text-gray-400 font-bold" }, "Fetching latest production log...") : mfgLoadOrders.length === 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "py-12 text-center text-gray-400 font-bold space-y-2" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.AlertCircle, { size: 32, className: "mx-auto text-gray-300" }), /* @__PURE__ */ import_react.default.createElement("p", null, "No active orders are currently assigned to this manufacturer.")) : /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-4" }, mfgLoadOrders.map((mo) => /* @__PURE__ */ import_react.default.createElement("div", { key: mo._id, className: "p-5 bg-[#F8F5F0]/65 border border-[#D4A373]/15 rounded-2xl space-y-3" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-start" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-gray-800 text-sm" }, "Design: ", mo.designDetails), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-bold uppercase mt-0.5" }, "Order ID: ", mo.orderId?._id || "N/A")), /* @__PURE__ */ import_react.default.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 border border-amber-200" }, mo.status || "In Progress")), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-3 text-xs text-gray-600 border-t border-[#D4A373]/10 pt-2.5" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[9px] text-gray-400 font-bold uppercase block" }, "Measurements"), /* @__PURE__ */ import_react.default.createElement("span", { className: "font-semibold text-gray-700" }, mo.measurements || "Standard")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[9px] text-gray-400 font-bold uppercase block" }, "Materials Spec"), /* @__PURE__ */ import_react.default.createElement("span", { className: "font-semibold text-gray-700" }, mo.materials || "See blueprints"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-between items-center text-xs pt-1" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-gray-400 font-bold" }, "Assigned Budget:"), /* @__PURE__ */ import_react.default.createElement("span", { className: "font-extrabold text-[#8B5E3C]" }, "$", (mo.budget || 0).toLocaleString()))))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedMfgLoad(null), className: "w-full py-3 bg-[#8B5E3C] hover:bg-[#8B5E3C]/95 text-white rounded-xl font-bold transition-all shadow-md" }, "Close Load View")))), assignOrderMfg && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#2A9D8F] p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Assign Production Order"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#F8F5F0] opacity-80 mt-1" }, "Assign to: ", assignOrderMfg.companyName, " (", assignOrderMfg.specialization, ")")), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setAssignOrderMfg(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleAssignMfgOrder, className: "p-8 space-y-5" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Select Approved Custom Order *"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        required: true,
        value: assignOrderDetails.orderId,
        onChange: (e) => {
          const selectedOrd = managementData?.orders?.find((o) => o._id === e.target.value);
          setAssignOrderDetails({
            ...assignOrderDetails,
            orderId: e.target.value,
            budget: selectedOrd?.totalAmount || 1e3
          });
        },
        className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-700 font-medium"
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "-- Choose Unassigned Order --"),
      (managementData?.orders?.filter((o) => o.orderType === "custom_design") || []).map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o._id, value: o._id }, "Order #", o._id.slice(-6), " - User: ", o.userId?.name || "Customer", " ($", (o.totalAmount || 0).toLocaleString(), ")"))
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Design Details / Specifics *"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "text",
        required: true,
        value: assignOrderDetails.designDetails,
        onChange: (e) => setAssignOrderDetails({ ...assignOrderDetails, designDetails: e.target.value }),
        placeholder: "e.g., Premium Mahogany Dining Table (6-seater)",
        className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Measurements *"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "text",
        required: true,
        value: assignOrderDetails.measurements,
        onChange: (e) => setAssignOrderDetails({ ...assignOrderDetails, measurements: e.target.value }),
        placeholder: "e.g., 72 x 36 x 30 inches",
        className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Manufacturing Budget ($) *"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "number",
        required: true,
        value: assignOrderDetails.budget,
        onChange: (e) => setAssignOrderDetails({ ...assignOrderDetails, budget: e.target.value }),
        className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-700"
      }
    ))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Material & Core Specifications"), /* @__PURE__ */ import_react.default.createElement(
      "textarea",
      {
        rows: 2,
        value: assignOrderDetails.materials,
        onChange: (e) => setAssignOrderDetails({ ...assignOrderDetails, materials: e.target.value }),
        placeholder: "e.g., Kiln-dried mahogany, matte polyurethane lacquer coat...",
        className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs"
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4 pt-2" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setAssignOrderMfg(null), className: "flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all text-xs" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/95 text-white rounded-xl font-bold shadow-md transition-all text-xs" }, "Assign Order"))))), mfgDocsModal && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-purple-700 p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "KYC Verification Files"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-purple-100 opacity-80 mt-1" }, mfgDocsModal.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setMfgDocsModal(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-[10px] font-extrabold text-purple-700 uppercase tracking-wider" }, "Registration Identifiers"), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-2 text-xs" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-medium" }, "GST Identification:"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-700" }, "27AAAAA1111A1Z1"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-medium" }, "Income Tax PAN:"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-700" }, "ABCDE1234F"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "border border-gray-150 rounded-2xl overflow-hidden shadow-sm" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[9px] text-gray-400 font-bold uppercase block p-2 bg-gray-50 border-b" }, "GST Registration Proof"), /* @__PURE__ */ import_react.default.createElement("img", { src: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=300&auto=format&fit=crop", alt: "GST Doc", className: "w-full h-32 object-cover" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "border border-gray-150 rounded-2xl overflow-hidden shadow-sm" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "text-[9px] text-gray-400 font-bold uppercase block p-2 bg-gray-50 border-b" }, "Premises Lease Agreement"), /* @__PURE__ */ import_react.default.createElement("img", { src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&auto=format&fit=crop", alt: "Lease Doc", className: "w-full h-32 object-cover" }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("h4", { className: "text-[10px] font-extrabold text-gray-400 uppercase tracking-wider" }, "Registered Bank Ledger"), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-1 text-xs" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-medium" }, "Beneficiary:"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-700" }, mfgDocsModal.companyName), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-medium" }, "Account Number:"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-700" }, "987654321098"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-medium" }, "Bank / IFSC:"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-700" }, "HDFC Bank / HDFC0000123")))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setMfgDocsModal(null), className: "w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition-all shadow-md" }, "Close Documents")))), mfgPaymentsModal && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-blue-700 p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Payout & Security Ledger"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-blue-100 opacity-80 mt-1" }, mfgPaymentsModal.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setMfgPaymentsModal(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 max-h-[60vh] overflow-y-auto space-y-6" }, loadingMfgPayments ? /* @__PURE__ */ import_react.default.createElement("div", { className: "py-12 text-center text-gray-400 font-bold animate-fadeIn" }, "Retrieving transactions history...") : mfgPayments.length === 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "py-12 text-center text-gray-400 font-bold" }, "No registered payment items found.") : /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-4 animate-fadeIn" }, mfgPayments.map((p) => /* @__PURE__ */ import_react.default.createElement("div", { key: p._id, className: "p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800" }, p.type), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium mt-0.5" }, "Reference: ", p.reference), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[9px] text-gray-400 font-medium" }, new Date(p.date).toLocaleDateString(void 0, { dateStyle: "medium" }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "text-right space-y-1" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-extrabold text-blue-600 text-sm" }, "$", p.amount.toLocaleString()), /* @__PURE__ */ import_react.default.createElement("span", { className: "inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-green-100 text-green-700" }, p.status))))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setMfgPaymentsModal(null), className: "w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-all shadow-md" }, "Close Payments View")))), mfgApproveConfirm && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-sm w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "text-center space-y-3" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-green-50 text-[#2A9D8F]" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ShieldCheck, { className: "w-7 h-7" })), /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-extrabold text-xl text-[#1F2937]" }, "Approve KYC Credentials"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 font-semibold leading-relaxed" }, "Are you sure you want to approve the KYC and live credentials for ", /* @__PURE__ */ import_react.default.createElement("span", { className: "font-bold text-gray-700" }, mfgApproveConfirm.companyName), "? They will immediately receive verification badges and go live for accepting orders.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setMfgApproveConfirm(null), className: "flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-xs" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => handleApproveMfg(mfgApproveConfirm._id), className: "flex-1 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/95 text-white rounded-xl font-bold shadow-md transition-all text-xs animate-pulse" }, "Verify & Launch")))), mfgSuspendConfirm && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#E76F51] p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Suspend Manufacturer"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#F8F5F0] opacity-80 mt-1" }, mfgSuspendConfirm.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setMfgSuspendConfirm(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleSuspendMfgSubmit, className: "p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#E76F51]/10 p-4 rounded-2xl border border-[#E76F51]/20 flex gap-3 text-xs text-gray-700" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.AlertCircle, { className: "w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" }), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h5", { className: "font-bold text-[#E76F51] uppercase font-sans" }, "Warning"), /* @__PURE__ */ import_react.default.createElement("p", { className: "mt-1 font-semibold leading-relaxed" }, "This restricts the manufacturer from accepting new custom designs. An email notification detailing suspension remarks will be automatically generated."))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider font-sans" }, "Reason for Suspension *"), /* @__PURE__ */ import_react.default.createElement(
      "textarea",
      {
        rows: 3,
        required: true,
        value: mfgSuspendReason,
        onChange: (e) => setMfgSuspendReason(e.target.value),
        placeholder: "e.g., Failed quality audits, non-delivery of components, or expired trade documentation...",
        className: "w-full p-4 rounded-xl border border-gray-250 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51]"
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setMfgSuspendConfirm(null), className: "flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-xl font-bold shadow-md transition-all" }, "Confirm Suspend"))))), selectedDeliveryProfile && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-center relative overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative z-10" }, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Logistics Partner Profile"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-blue-100 mt-1 opacity-90" }, selectedDeliveryProfile.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedDeliveryProfile(null), className: "relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 gap-4 text-sm" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase mb-1" }, "Contact Name"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800" }, selectedDeliveryProfile.userId?.name || "N/A")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase mb-1" }, "Phone"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800" }, selectedDeliveryProfile.userId?.phone || "N/A")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase mb-1" }, "Vehicle Type"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-blue-600 flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Truck, { size: 14 }), " ", selectedDeliveryProfile.vehicleType || "Standard Truck")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase mb-1" }, "Service Areas"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-[#2A9D8F] flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.MapPin, { size: 14 }), " ", (selectedDeliveryProfile.serviceAreas || []).join(", ") || "N/A")), /* @__PURE__ */ import_react.default.createElement("div", { className: "col-span-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 font-bold uppercase mb-1" }, "Description"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-600 text-xs leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100" }, selectedDeliveryProfile.description || "No description provided."))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4 pt-2" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setSelectedDeliveryProfile(null), className: "flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all" }, "Close Profile"))))), assignDeliveryOrderPartner && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-blue-600 p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Assign Delivery Trip"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-blue-100 mt-1" }, assignDeliveryOrderPartner.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setAssignDeliveryOrderPartner(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleAssignDeliveryOrderSubmit, className: "p-8 space-y-6 text-left" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Select Ready Order *"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        required: true,
        value: assignDeliveryDetails.orderId,
        onChange: (e) => setAssignDeliveryDetails({ ...assignDeliveryDetails, orderId: e.target.value }),
        className: "w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-colors"
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "-- Select Completed Manufacturing Order --"),
      (managementData?.orders || []).filter((o) => o.orderStatus !== "Completed").map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o._id, value: o._id }, "Order #", o._id.slice(-6), " - ", o.userId?.name || "Customer"))
    ), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium" }, "Only orders that have completed the manufacturing phase are available for dispatch.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4 pt-4" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setAssignDeliveryOrderPartner(null), className: "flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Package, { size: 16 }), " Dispatch Order"))))), assignInstallationJobPartner && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-purple-600 p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Schedule Installation"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-purple-100 mt-1" }, assignInstallationJobPartner.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setAssignInstallationJobPartner(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleAssignInstallationJobSubmit, className: "p-8 space-y-6 text-left" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Select Order *"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        required: true,
        value: assignInstallationDetails.orderId,
        onChange: (e) => setAssignInstallationDetails({ ...assignInstallationDetails, orderId: e.target.value }),
        className: "w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "-- Select Order for Assembly --"),
      (managementData?.orders || []).map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o._id, value: o._id }, "Order #", o._id.slice(-6), " - ", o.userId?.name || "Customer"))
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Scheduled Date & Time *"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "datetime-local",
        required: true,
        value: assignInstallationDetails.scheduledDate,
        onChange: (e) => setAssignInstallationDetails({ ...assignInstallationDetails, scheduledDate: e.target.value }),
        className: "w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Installation Notes / Blueprints"), /* @__PURE__ */ import_react.default.createElement(
      "textarea",
      {
        rows: 2,
        value: assignInstallationDetails.notes,
        onChange: (e) => setAssignInstallationDetails({ ...assignInstallationDetails, notes: e.target.value }),
        placeholder: "E.g., Assembly requires 2 people, wall drilling allowed...",
        className: "w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4 pt-2" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setAssignInstallationJobPartner(null), className: "flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Wrench, { size: 16 }), " Schedule Job"))))), selectedPartnerJobs && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-2xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#1F2937] p-6 text-white flex justify-between items-center relative" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative z-10" }, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Job Assignment History"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 mt-1" }, selectedPartnerJobs.companyName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedPartnerJobs(null), className: "relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.List, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-gray-500 font-bold" }, "In a live system, this dashboard would list all active and historical delivery trips and assembly jobs completed by ", selectedPartnerJobs.companyName, "."), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-400 mt-2 font-medium" }, "Powered by real-time GPS tracking and milestone verification APIs.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "mt-6 flex justify-end" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedPartnerJobs(null), className: "px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all" }, "Close View"))))), selectedAIDesign && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-4xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn my-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#8B5E3C] p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-2xl" }, "AI Studio Room Design Details"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-[#F8F5F0]/80 mt-1" }, "ID: #", selectedAIDesign._id.toUpperCase(), " \u2022 Requested by ", selectedAIDesign.userId?.name || "Customer")), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedAIDesign(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 space-y-6 max-h-[75vh] overflow-y-auto text-left" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider" }, "Original Uploaded Room Photo"), /* @__PURE__ */ import_react.default.createElement("img", { src: selectedAIDesign.originalImage, alt: "Original uploaded room", className: "w-full h-64 object-cover rounded-2xl border border-gray-200 shadow-inner" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider" }, "AI Studio Stylized Design Output"), /* @__PURE__ */ import_react.default.createElement("img", { src: selectedAIDesign.generatedImage || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800", alt: "AI stylized room", className: "w-full h-64 object-cover rounded-2xl border border-[#D4A373]/30 shadow-sm" }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-150 text-xs" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Room Type"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 mt-1" }, selectedAIDesign.roomType)), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Style Preference"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-800 mt-1" }, selectedAIDesign.stylePreference || "Modern Minimalist")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Estimated Budget"), /* @__PURE__ */ import_react.default.createElement("p", { className: "font-extrabold text-[#8B5E3C] text-sm mt-1" }, "$", selectedAIDesign.aiSuggestion?.budgetEstimate || "N/A")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-bold text-gray-400 uppercase" }, "Design Status"), /* @__PURE__ */ import_react.default.createElement("span", { className: "inline-block px-2 py-0.5 rounded bg-[#8B5E3C]/10 text-[#8B5E3C] font-bold mt-1 uppercase text-[10px]" }, selectedAIDesign.status))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-['Playfair_Display'] font-bold text-lg text-gray-800 border-b border-gray-100 pb-2" }, "AI Studio Intelligent Recommendations"), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Sparkles, { size: 12 }), " Key Furniture Items"), /* @__PURE__ */ import_react.default.createElement("ul", { className: "text-xs space-y-1.5 text-gray-600 font-medium" }, (selectedAIDesign.aiSuggestion?.furniture || ["Premium Accent Sofa", "Tailored Side Tables", "Intelligent Lighting Placements"]).map((f, i) => /* @__PURE__ */ import_react.default.createElement("li", { key: i, className: "flex items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-[#8B5E3C]" }), " ", f)))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Hammer, { size: 12 }), " Material Recommendations"), /* @__PURE__ */ import_react.default.createElement("ul", { className: "text-xs space-y-1.5 text-gray-600 font-medium" }, (selectedAIDesign.aiSuggestion?.materials || ["Solid Oak Planks", "Brushed Copper Trim", "Woven Natural Linens"]).map((m, i) => /* @__PURE__ */ import_react.default.createElement("li", { key: i, className: "flex items-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" }), " ", m)))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-2" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Activity, { size: 12 }), " Palette Hex Codes"), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-2.5 mt-2" }, (selectedAIDesign.aiSuggestion?.colorPalette || ["#D4A373", "#2A9D8F", "#F8F5F0", "#1F2937"]).map((hex, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, className: "flex flex-col items-center gap-1" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "w-8 h-8 rounded-full border border-gray-200 shadow-sm", style: { backgroundColor: hex }, title: hex }), /* @__PURE__ */ import_react.default.createElement("span", { className: "font-mono text-[9px] text-gray-500 font-bold" }, hex)))))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-gray-50 p-6 border-t border-gray-100 flex justify-end gap-4" }, selectedAIDesign.generatedImage && /* @__PURE__ */ import_react.default.createElement(
      "a",
      {
        href: selectedAIDesign.generatedImage,
        download: `ai-design-${selectedAIDesign._id.slice(-6)}.jpg`,
        target: "_blank",
        rel: "noreferrer",
        className: "px-6 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
      },
      /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Download, { size: 14 }),
      " Download Design File"
    ), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setSelectedAIDesign(null), className: "px-6 py-3 bg-[#8B5E3C] text-white rounded-xl font-bold text-xs shadow-md" }, "Close View")))), assignVendorAIDesign && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-blue-600 p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Assign Coordinating Vendor"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-blue-100 mt-1" }, "Design Request #", assignVendorAIDesign._id.slice(-6).toUpperCase())), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setAssignVendorAIDesign(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleAssignAIDesignVendorSubmit, className: "p-8 space-y-6 text-left" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Select Available Vendor *"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        required: true,
        value: selectedAIDesignVendorId,
        onChange: (e) => setSelectedAIDesignVendorId(e.target.value),
        className: "w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-colors"
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "-- Choose Coordinating Vendor --"),
      (managementData?.vendors || []).filter((v) => v.businessType === "vendor" && v.isActive).map((v) => /* @__PURE__ */ import_react.default.createElement("option", { key: v._id, value: v._id }, v.companyName, " (", v.specialization, " - Rating: ", v.rating, "\u2605)"))
    ), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium leading-relaxed" }, "Assigning a vendor allows them to review the AI design recommendations and coordinate specialized custom orders directly with the user.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4 pt-2" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setAssignVendorAIDesign(null), className: "flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.UserCheck, { size: 16 }), " Assign Partner"))))), convertOrderAIDesign && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-purple-600 p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "Convert Design to Execution Order"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-purple-100 mt-1" }, "Design ID: #", convertOrderAIDesign._id.slice(-6).toUpperCase())), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setConvertOrderAIDesign(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: handleConvertAIDesignOrderSubmit, className: "p-8 space-y-6 text-left" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-1" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-bold text-purple-800" }, "Conversion Summary"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-purple-600 font-medium" }, "Customer: ", /* @__PURE__ */ import_react.default.createElement("strong", { className: "text-purple-800" }, convertOrderAIDesign.userId?.name)), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-purple-600 font-medium" }, "Design Room: ", /* @__PURE__ */ import_react.default.createElement("strong", { className: "text-purple-800" }, convertOrderAIDesign.roomType, " (", convertOrderAIDesign.stylePreference, ")")), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-purple-600 font-medium" }, "Budget: ", /* @__PURE__ */ import_react.default.createElement("strong", { className: "text-purple-800" }, "$", convertOrderAIDesign.aiSuggestion?.budgetEstimate))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "block text-xs font-bold text-gray-700 uppercase tracking-wider" }, "Select Manufacturing Partner *"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        required: true,
        value: selectedAIDesignManufacturerId,
        onChange: (e) => setSelectedAIDesignManufacturerId(e.target.value),
        className: "w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "-- Choose Manufacturer --"),
      (managementData?.vendors || []).filter((v) => v.businessType === "manufacturer" && v.isActive).map((v) => /* @__PURE__ */ import_react.default.createElement("option", { key: v._id, value: v._id }, v.companyName, " (Active Load: ", v.activeOrders, " - Capacity: ", v.monthlyCapacity, ")"))
    ), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-medium leading-relaxed" }, "Converting this design requests launches the downstream manufacturing and fabrication workflow. The manufacturer will be supplied with blueprints and wood/material specs."))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-4 pt-2" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: () => setConvertOrderAIDesign(null), className: "flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all" }, "Cancel"), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Package, { size: 16 }), " Convert to Order"))))), workflowAIDesign && /* @__PURE__ */ import_react.default.createElement("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-amber-500 p-6 text-white flex justify-between items-center" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", { className: "font-['Playfair_Display'] font-bold text-xl" }, "AI Design Studio Workflow Tracking"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-amber-50 mt-1" }, "Design ID: #", workflowAIDesign._id.toUpperCase())), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setWorkflowAIDesign(null), className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all" }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 space-y-8 text-left" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative border-l-2 border-gray-100 ml-4 space-y-6" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative pl-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-green-500 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold" }, "\u2713"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-sm text-gray-800" }, "1. Room Photo Uploaded"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-0.5" }, "User uploaded original room photo. AI Studio requested."), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[10px] text-gray-400 font-bold mt-1 uppercase" }, "COMPLETED \u2022 NOTIFIED ADMIN")), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative pl-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: `absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${workflowAIDesign.status !== "pending" ? "bg-green-500 text-white" : "bg-amber-400 text-white animate-pulse"}` }, workflowAIDesign.status !== "pending" ? "\u2713" : "2"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-sm text-gray-800" }, "2. AI Design Generated"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-0.5" }, "Stable Diffusion model synthesized style, materials, and layout."), /* @__PURE__ */ import_react.default.createElement("p", { className: `text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.status !== "pending" ? "text-green-500" : "text-amber-500"}` }, workflowAIDesign.status !== "pending" ? "COMPLETED \u2022 NOTIFIED USER" : "IN PROCESS")), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative pl-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: `absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${workflowAIDesign.status === "accepted" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}` }, workflowAIDesign.status === "accepted" ? "\u2713" : "3"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-sm text-gray-800" }, "3. User Accepts Design"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-0.5" }, "Customer reviewed AI output and accepted custom layout & budget."), /* @__PURE__ */ import_react.default.createElement("p", { className: `text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.status === "accepted" ? "text-green-500" : "text-gray-400"}` }, workflowAIDesign.status === "accepted" ? "COMPLETED \u2022 NOTIFIED VENDOR" : "AWAITING USER DECISION")), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative pl-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: `absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== "Not Converted" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}` }, workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== "Not Converted" ? "\u2713" : "4"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-sm text-gray-800" }, "4. Dispatch to Manufacturer"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-0.5" }, "Admin coordinates conversion to Order and hands over specifications."), /* @__PURE__ */ import_react.default.createElement("p", { className: `text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== "Not Converted" ? "text-green-500" : "text-gray-400"}` }, workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== "Not Converted" ? `COMPLETED \u2022 ASSIGNED TO ${workflowAIDesign.orderId?.vendorId?.companyName || "Manufacturer"}` : "AWAITING CONVERSION")), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative pl-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: `absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${workflowAIDesign.orderStatus === "Completed" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}` }, workflowAIDesign.orderStatus === "Completed" ? "\u2713" : "5"), /* @__PURE__ */ import_react.default.createElement("h4", { className: "font-bold text-sm text-gray-800" }, "5. Completed & Delivered"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-gray-500 mt-0.5" }, "Downstream logistics milestone tracking and installation completion."), /* @__PURE__ */ import_react.default.createElement("p", { className: `text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.orderStatus === "Completed" ? "text-green-500" : "text-gray-400"}` }, workflowAIDesign.orderStatus === "Completed" ? "ORDER DELIVERED & INSTALLED" : `CURRENT PHASE: ${workflowAIDesign.orderStatus || "NOT STARTED"}`)))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-gray-50 p-6 border-t border-gray-100 flex justify-end" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setWorkflowAIDesign(null), className: "px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-all" }, "Close Tracker")))));
  };
  var AdminDashboard_default = AdminDashboard;
})();
