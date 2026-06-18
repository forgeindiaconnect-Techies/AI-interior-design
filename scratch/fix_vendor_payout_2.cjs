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

// Replace from `const handlePayoutRequest = (e) => {` all the way down to the first `return (`
content = content.replace(/const handlePayoutRequest = \(e\) => \{[\s\S]*?\};\s*return \(/, newHandle + '\n\n        return (');

fs.writeFileSync(filePath, content, 'utf8');
console.log('VendorDashboard handlePayoutRequest updated correctly');
