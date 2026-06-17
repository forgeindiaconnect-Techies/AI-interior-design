const fs = require('fs');

const targetFile = 'c:/Users/renug/OneDrive/Desktop/AI Interior Final Project/frontend/src/pages/AdminDashboard.jsx';
let c = fs.readFileSync(targetFile, 'utf8');

c = c.replace(/const \[vendorForm, setVendorForm\] = useState\(\{[^}]+\}\);/, `const [vendorForm, setVendorForm] = useState({ name: '', companyName: '', email: '', phone: '', password: '', address: '', businessType: 'vendor', category: '', status: 'Active', businessCategory: '', yearsOfExperience: '', websiteUrl: '', socialMediaUrl: '', documents: { registrationCert: null, idProof: null, profilePhoto: null, gstCert: null, companyLogo: null, bankVerification: null, portfolioImages: [] } });`);

c = c.replace(/const resetVendorForm = \(\) => \{[^}]+\};/, `const resetVendorForm = () => { setVendorForm({ name: '', companyName: '', email: '', phone: '', password: '', address: '', businessType: 'vendor', category: '', status: 'Active', businessCategory: '', yearsOfExperience: '', websiteUrl: '', socialMediaUrl: '', documents: { registrationCert: null, idProof: null, profilePhoto: null, gstCert: null, companyLogo: null, bankVerification: null, portfolioImages: [] } }); setVendorFormErrors({}); };`);

const handleAddVendorRegex = /const handleAddVendor = async \(e\) => \{[\s\S]*?setVendorActionLoading\(false\);\s*\}\s*\};/;

const newHandleAddVendor = `const handleAddVendor = async (e) => {
    e.preventDefault();
    setVendorFormErrors({});
    const errors = {};
    if (!vendorForm.name.trim()) errors.name = 'Name is required';
    if (!vendorForm.companyName.trim()) errors.companyName = 'Company name is required';
    if (!vendorForm.email.trim()) errors.email = 'Email is required';
    if (!vendorForm.password) errors.password = 'Password is required';
    if (!vendorForm.phone.trim()) errors.phone = 'Contact number is required';
    if (!vendorForm.documents.registrationCert) errors.registrationCert = 'Registration Certificate is required';
    if (!vendorForm.documents.idProof) errors.idProof = 'ID Proof is required';
    if (!vendorForm.documents.profilePhoto) errors.profilePhoto = 'Profile Photo is required';

    if (Object.keys(errors).length > 0) { setVendorFormErrors(errors); return; }
    setVendorActionLoading(true);
    try {
      const formData = new FormData();
      ['name', 'companyName', 'email', 'phone', 'password', 'address', 'category', 'status', 'businessCategory', 'yearsOfExperience', 'websiteUrl', 'socialMediaUrl'].forEach(key => {
        if (vendorForm[key]) formData.append(key, vendorForm[key]);
      });
      
      if (vendorForm.documents.registrationCert) formData.append('registrationCert', vendorForm.documents.registrationCert);
      if (vendorForm.documents.idProof) formData.append('idProof', vendorForm.documents.idProof);
      if (vendorForm.documents.profilePhoto) formData.append('profilePhoto', vendorForm.documents.profilePhoto);
      if (vendorForm.documents.gstCert) formData.append('gstCert', vendorForm.documents.gstCert);
      if (vendorForm.documents.companyLogo) formData.append('companyLogo', vendorForm.documents.companyLogo);
      if (vendorForm.documents.bankVerification) formData.append('bankVerification', vendorForm.documents.bankVerification);
      
      if (vendorForm.documents.portfolioImages && vendorForm.documents.portfolioImages.length > 0) {
        Array.from(vendorForm.documents.portfolioImages).forEach(file => {
          formData.append('portfolioImages', file);
        });
      }

      await axios.post('/admin/vendors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Vendor added successfully');
      setShowAddVendorModal(false);
      resetVendorForm();
      fetchVendors(false);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add vendor');
    } finally {
      setVendorActionLoading(false);
    }
  };`;

c = c.replace(handleAddVendorRegex, newHandleAddVendor);

fs.writeFileSync(targetFile, c);
console.log('Frontend logic replaced');
