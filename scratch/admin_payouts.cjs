const fs = require('fs');

const filePath = 'frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('const [adminPayouts, setAdminPayouts]')) {
  const stateInjection = `
  // --- Admin Payout Management States ---
  const [adminPayouts, setAdminPayouts] = useState([]);
  const [payoutAdminRemarks, setPayoutAdminRemarks] = useState({});

  useEffect(() => {
    if (activeTab === 'payout_management') {
      fetchAdminPayouts();
    }
  }, [activeTab]);

  const fetchAdminPayouts = async () => {
    try {
      const res = await axios.get('/api/admin/payouts', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (res.data.success) {
        setAdminPayouts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin payouts', err);
    }
  };

  const handleUpdatePayoutStatus = async (id, status) => {
    if (!window.confirm(\`Are you sure you want to mark this payout request as \${status}?\`)) return;
    try {
      const remarks = payoutAdminRemarks[id] || '';
      const res = await axios.put(\`/api/admin/payouts/\${id}\`, { status, adminRemarks: remarks }, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (res.data.success) {
        alert(\`Payout \${status} successfully\`);
        fetchAdminPayouts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating payout status');
    }
  };
`;
  content = content.replace(/  const \[platformCommissionRate, setPlatformCommissionRate\] = useState\(5\);/, '  const [platformCommissionRate, setPlatformCommissionRate] = useState(5);\n' + stateInjection);
}

if (!content.includes('activeTab === \'payout_management\' && (')) {
  const payoutsTabUI = `
      {/* PAYOUT MANAGEMENT TAB */}
      {activeTab === 'payout_management' && (
        <div className="space-y-8 animate-fadeIn">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Payout Management</h2>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30">
            <h3 className="font-bold text-lg text-[#1F2937] mb-4 border-b pb-2">Vendor Payout Requests</h3>
            {adminPayouts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No payout requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 rounded-tl-xl">Date</th>
                      <th className="p-4">Vendor</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Bank Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {adminPayouts.map(req => (
                      <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <p className="font-bold text-[#1F2937]">{req.vendorId?.companyName || 'Unknown Vendor'}</p>
                          <p className="text-[10px] text-gray-400">{req.vendorId?.email}</p>
                        </td>
                        <td className="p-4 font-bold text-[#2A9D8F]">\${req.amount}</td>
                        <td className="p-4 text-xs text-gray-600">
                          <p><strong>Bank:</strong> {req.bankDetails?.bankName}</p>
                          <p><strong>A/C:</strong> {req.bankDetails?.accountNumber}</p>
                          <p><strong>IFSC:</strong> {req.bankDetails?.ifscCode}</p>
                          <p><strong>Name:</strong> {req.bankDetails?.accountHolderName}</p>
                        </td>
                        <td className="p-4">
                          <span className={\`px-3 py-1 rounded-full text-xs font-bold \${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}\`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {req.status === 'Pending' ? (
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                placeholder="Admin Remarks..." 
                                value={payoutAdminRemarks[req._id] || ''}
                                onChange={(e) => setPayoutAdminRemarks({...payoutAdminRemarks, [req._id]: e.target.value})}
                                className="w-full p-2 border border-gray-200 rounded-lg text-xs"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdatePayoutStatus(req._id, 'Approved')} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold text-xs">Approve</button>
                                <button onClick={() => handleUpdatePayoutStatus(req._id, 'Rejected')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded font-bold text-xs">Reject</button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">{req.adminRemarks || 'No remarks'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
`;
  content = content.replace(/\{\/\* MODAL 1: VIEW PROFILE \*\/\}/, payoutsTabUI + '\n      {/* MODAL 1: VIEW PROFILE */}');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminDashboard payouts injected.');
