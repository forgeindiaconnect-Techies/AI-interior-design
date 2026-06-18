const fs = require('fs');
const filePath = 'frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

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

if (!content.includes('const [adminPayouts, setAdminPayouts]')) {
  content = content.replace(/  const \[loading, setLoading\] = useState\(true\);/, '  const [loading, setLoading] = useState(true);\n' + stateInjection);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('States injected.');
} else {
  console.log('States already present.');
}
