const fs = require('fs');

const filePath = 'frontend/src/pages/VendorDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Inject state variables and fetch function for Payouts
if (!content.includes('const [payoutsList, setPayoutsList]')) {
  const stateInjection = `  const [isPayoutRequested, setIsPayoutRequested] = useState(false);
  // --- Payout Management States ---
  const [payoutsList, setPayoutsList] = useState([]);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutBankName, setPayoutBankName] = useState('');
  const [payoutAccNo, setPayoutAccNo] = useState('');
  const [payoutIfsc, setPayoutIfsc] = useState('');
  const [payoutHolder, setPayoutHolder] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'payouts') {
      fetchPayouts();
    }
  }, [activeTab]);

  const fetchPayouts = async () => {
    try {
      const res = await axios.get('/api/vendor/payout', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      if (res.data.success) setPayoutsList(res.data.data);
    } catch (err) {
      console.error('Error fetching payouts', err);
    }
  };

  const handleManualPayoutSubmit = async (e) => {
    e.preventDefault();
    setPayoutLoading(true);
    try {
      const res = await axios.post('/api/vendor/payout', {
        amount: Number(payoutAmount),
        bankName: payoutBankName,
        accountNumber: payoutAccNo,
        ifscCode: payoutIfsc,
        accountHolderName: payoutHolder
      }, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      if (res.data.success) {
        alert('Payout request submitted successfully!');
        setPayoutAmount('');
        setPayoutBankName('');
        setPayoutAccNo('');
        setPayoutIfsc('');
        setPayoutHolder('');
        fetchPayouts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting payout request');
    } finally {
      setPayoutLoading(false);
    }
  };
`;
  content = content.replace(/  const \[isPayoutRequested, setIsPayoutRequested\] = useState\(false\);/, stateInjection);
}

// 2. Inject Payouts Tab UI
if (!content.includes('activeTab === \'payouts\' && (')) {
  const payoutsTabUI = `
      {/* TAB 8.5: PAYOUTS (MANUAL REQUEST) */}
      {activeTab === 'payouts' && (
        <div className="space-y-8 animate-fadeIn">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Payout Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Request Payout Form */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 md:col-span-1 h-fit">
              <h3 className="font-bold text-lg text-[#1F2937] mb-4 border-b pb-2">Request Payout</h3>
              <form onSubmit={handleManualPayoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Amount ($)</label>
                  <input type="number" required min="1" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" placeholder="e.g. 500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Bank Name</label>
                  <input type="text" required value={payoutBankName} onChange={(e) => setPayoutBankName(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" placeholder="Bank Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Account Number</label>
                  <input type="text" required value={payoutAccNo} onChange={(e) => setPayoutAccNo(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" placeholder="Account Number" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Routing / IFSC Code</label>
                  <input type="text" required value={payoutIfsc} onChange={(e) => setPayoutIfsc(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" placeholder="Routing Code" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Account Holder Name</label>
                  <input type="text" required value={payoutHolder} onChange={(e) => setPayoutHolder(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A9D8F]" placeholder="Full Name on Account" />
                </div>
                <button type="submit" disabled={payoutLoading} className={\`w-full py-3.5 mt-2 rounded-xl font-bold text-white shadow-md transition-all \${payoutLoading ? 'bg-gray-400' : 'bg-[#2A9D8F] hover:bg-[#2A9D8F]/90'}\`}>
                  {payoutLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>

            {/* Payout History Table */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 md:col-span-2">
              <h3 className="font-bold text-lg text-[#1F2937] mb-4 border-b pb-2">Payout History</h3>
              {payoutsList.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No payout requests found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="p-4 rounded-tl-xl">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Bank</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 rounded-tr-xl">Admin Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {payoutsList.map(req => (
                        <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 font-bold text-[#1F2937]">\${req.amount}</td>
                          <td className="p-4 text-gray-600">{req.bankDetails?.bankName}<br/><span className="text-[10px] text-gray-400">*{req.bankDetails?.accountNumber?.slice(-4)}</span></td>
                          <td className="p-4">
                            <span className={\`px-3 py-1 rounded-full text-xs font-bold \${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}\`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-gray-500 max-w-[200px] truncate">{req.adminRemarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;
  content = content.replace(/\{\/\* TAB 10: REVIEWS \*\/\}/, payoutsTabUI + '\n      {/* TAB 10: REVIEWS */}');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('VendorDashboard payouts injected.');
