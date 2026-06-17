const fs = require('fs');

const targetFile = 'c:/Users/renug/OneDrive/Desktop/AI Interior Final Project/frontend/src/pages/AdminDashboard.jsx';
let c = fs.readFileSync(targetFile, 'utf8');

const startIndex = c.indexOf('const ViewVendorModal = ({ selectedVendor, onClose }) => (');
const endIndex = c.indexOf('const DeleteConfirmModal = ({ deleteConfirmVendor, onCancel, onConfirm }) => (');

if (startIndex !== -1 && endIndex !== -1) {
  const oldModal = c.substring(startIndex, endIndex);

  const newModal = `const ViewVendorModal = ({ selectedVendor, onClose, onApprove, onReject }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto my-8" onClick={e => e.stopPropagation()}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Store className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Vendor Details</h3>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      {selectedVendor && (
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#2A9D8F] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {(selectedVendor.companyName || selectedVendor.userId?.name || selectedVendor.name || 'V').charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#1F2937]">{selectedVendor.companyName || selectedVendor.userId?.name || selectedVendor.name}</h4>
              <p className="text-sm text-gray-500">{selectedVendor.userId?.email || selectedVendor.email} · {selectedVendor.userId?.phone || selectedVendor.phone || 'No contact'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
              <p className="font-semibold text-[#1F2937]">{selectedVendor.businessCategory || selectedVendor.category || 'General'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Business Type</p>
              <p className="font-semibold text-[#1F2937] capitalize">{selectedVendor.businessType || 'vendor'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</p>
              <p className="font-semibold text-[#1F2937] capitalize">{selectedVendor.yearsOfExperience ? \`\${selectedVendor.yearsOfExperience} Years\` : 'N/A'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Links</p>
              <div className="flex gap-2">
                {selectedVendor.websiteUrl && <a href={selectedVendor.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Website</a>}
                {selectedVendor.socialMediaUrl && <a href={selectedVendor.socialMediaUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Social</a>}
                {!selectedVendor.websiteUrl && !selectedVendor.socialMediaUrl && <span className="font-semibold text-[#1F2937]">N/A</span>}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 col-span-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
              <p className="font-semibold text-[#1F2937]">{selectedVendor.address || 'Not provided'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <span className={\`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold \${selectedVendor.isActive ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'bg-[#E76F51]/10 text-[#E76F51]'}\`}>
                {selectedVendor.isActive ? 'Active' : 'Suspended'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Doc Status</p>
              <span className={\`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold \${selectedVendor.documentVerificationStatus === 'Approved' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : selectedVendor.documentVerificationStatus === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}\`}>
                {selectedVendor.documentVerificationStatus || 'Pending Verification'}
              </span>
            </div>
          </div>

          {selectedVendor.documents && Object.keys(selectedVendor.documents).length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-sm text-[#1F2937] mb-3">Uploaded Documents</h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedVendor.documents.registrationCert && (
                  <a href={\`http://localhost:5000\${selectedVendor.documents.registrationCert}\`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">Registration Cert</span>
                  </a>
                )}
                {selectedVendor.documents.idProof && (
                  <a href={\`http://localhost:5000\${selectedVendor.documents.idProof}\`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">ID Proof</span>
                  </a>
                )}
                {selectedVendor.documents.profilePhoto && (
                  <a href={\`http://localhost:5000\${selectedVendor.documents.profilePhoto}\`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">Profile Photo</span>
                  </a>
                )}
                {selectedVendor.documents.gstCert && (
                  <a href={\`http://localhost:5000\${selectedVendor.documents.gstCert}\`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">GST Cert</span>
                  </a>
                )}
                {selectedVendor.documents.companyLogo && (
                  <a href={\`http://localhost:5000\${selectedVendor.documents.companyLogo}\`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">Company Logo</span>
                  </a>
                )}
                {selectedVendor.documents.bankVerification && (
                  <a href={\`http://localhost:5000\${selectedVendor.documents.bankVerification}\`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">Bank Verification</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-100 sticky bottom-0 bg-white z-10">
            <div className="flex gap-2">
              <button onClick={onApprove} className="px-5 py-2.5 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-all shadow-sm">Approve Docs</button>
              <button onClick={onReject} className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-sm">Reject Docs</button>
            </div>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

`;

  c = c.replace(oldModal, newModal);
  
  // Replace the call
  const callRegex = /<ViewVendorModal\s*selectedVendor=\{selectedVendor\}\s*onClose=\{\(\) => \{ setShowViewVendorModal\(false\); setSelectedVendor\(null\); \}\}\s*\/>/g;
  
  const newCall = `<ViewVendorModal
              selectedVendor={selectedVendor}
              onClose={() => { setShowViewVendorModal(false); setSelectedVendor(null); }}
              onApprove={async () => {
                try {
                  await axios.put(\`/admin/vendors/\${selectedVendor._id}/approve\`);
                  alert('Vendor approved successfully');
                  fetchVendors(false);
                  setShowViewVendorModal(false);
                } catch(e) { alert(e?.response?.data?.message || 'Error'); }
              }}
              onReject={async () => {
                try {
                  await axios.put(\`/admin/vendors/\${selectedVendor._id}/reject\`);
                  alert('Vendor rejected successfully');
                  fetchVendors(false);
                  setShowViewVendorModal(false);
                } catch(e) { alert(e?.response?.data?.message || 'Error'); }
              }}
            />`;

  if (callRegex.test(c)) {
    c = c.replace(callRegex, newCall);
    fs.writeFileSync(targetFile, c);
    console.log('ViewVendorModal replaced successfully by index');
  } else {
    console.log('Call regex not found');
  }

} else {
  console.log('Index not found', startIndex, endIndex);
}
