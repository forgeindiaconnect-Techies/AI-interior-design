const fs = require('fs');
const filePath = 'frontend/src/pages/VendorDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const newHandle = `        const handlePayoutRequest = async (e) => {
          e.preventDefault();
          try {
            const paymentDetails = reqMethod === 'UPI' ? { upiId: reqAccount } : { accountNumber: reqAccount };
            const res = await axios.post('/api/vendor/payout', {
              amount: Number(reqAmount),
              paymentMethod: reqMethod,
              paymentDetails
            }, { headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }});
            
            if (res.data.success) {
              setReqAmount(''); setReqAccount(''); setReqNote('');
              setSubmitted(true);
              setTimeout(() => setSubmitted(false), 3000);
              fetchPayouts(); // refresh list
            }
          } catch (err) {
            console.error('Error submitting payout', err);
            alert(err.response?.data?.message || 'Error submitting payout request');
          }
        };`;

const newHistoryMap = `                    {payoutsList.map(p => {
                      const statusStyle = p.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : p.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';
                      const accountStr = p.paymentDetails?.upiId || p.paymentDetails?.accountNumber || 'N/A';
                      return (
                        <div key={p._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-sm text-[#1F2937]">$\${p.amount?.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">\${p.paymentMethod} - \${accountStr}</p>
                            <p className="text-[10px] text-gray-300 mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                            {p.adminRemarks && <p className="text-[10px] text-red-500 mt-1 italic">Remarks: \${p.adminRemarks}</p>}
                          </div>
                          <span className={\`inline-flex px-2.5 py-1 text-[10px] font-bold border rounded-full uppercase tracking-wider w-fit \${statusStyle}\`}>{p.status}</span>
                        </div>
                      );
                    })}`;

content = content.replace(/const handlePayoutRequest = \(e\) => \{[\s\S]*?localStorage\.setItem\('mockVendorPayouts', JSON\.stringify\(vendorPayouts\)\);\s*\};/, newHandle);
content = content.replace(/\{payoutHistory\.map\(p => \{[\s\S]*?\}\)\}/, newHistoryMap);
content = content.replace(/\{payoutHistory\.length === 0 \? \(/g, '{payoutsList.length === 0 ? (');

content = content.replace('const [payoutHistory, setPayoutHistory] = useState([]);', '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('VendorDashboard payout updated');
