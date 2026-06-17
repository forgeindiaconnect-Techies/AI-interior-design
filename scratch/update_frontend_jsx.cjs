const fs = require('fs');

const targetFile = 'c:/Users/renug/OneDrive/Desktop/AI Interior Final Project/frontend/src/pages/AdminDashboard.jsx';
let c = fs.readFileSync(targetFile, 'utf8');

const targetRegex = /(<div>\s*<label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1\.5">Address<\/label>[\s\S]*?<\/div>)\s*(<div>\s*<label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1\.5">Status<\/label>)/;

const newFields = `
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-sm text-[#1F2937] mb-3">Additional Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Business Type</label>
              <select value={vendorForm.businessCategory} onChange={e => setVendorForm({...vendorForm, businessCategory: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all">
                <option value="">Select Category</option>
                <option value="Furniture">Furniture</option>
                <option value="Decor">Decor</option>
                <option value="Lighting">Lighting</option>
                <option value="Interior Design">Interior Design</option>
                <option value="Modular Kitchen">Modular Kitchen</option>
                <option value="Custom Furniture">Custom Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Years of Experience</label>
              <input type="number" value={vendorForm.yearsOfExperience} onChange={e => setVendorForm({...vendorForm, yearsOfExperience: e.target.value})} placeholder="e.g. 5" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Website URL</label>
              <input type="url" value={vendorForm.websiteUrl} onChange={e => setVendorForm({...vendorForm, websiteUrl: e.target.value})} placeholder="https://" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Instagram / Social Link</label>
              <input type="url" value={vendorForm.socialMediaUrl} onChange={e => setVendorForm({...vendorForm, socialMediaUrl: e.target.value})} placeholder="https://" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-sm text-[#1F2937] mb-3">Vendor Documents</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Business Registration Cert (PDF/JPG/PNG) <span className="text-red-400">*</span></label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, registrationCert: e.target.files[0]}})} className={\`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 transition-all \${vendorFormErrors.registrationCert ? 'border border-red-300 p-2 rounded-xl bg-red-50' : ''}\`} />
                {vendorFormErrors.registrationCert && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.registrationCert}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Government ID Proof (Aadhaar, PAN, etc.) <span className="text-red-400">*</span></label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, idProof: e.target.files[0]}})} className={\`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 transition-all \${vendorFormErrors.idProof ? 'border border-red-300 p-2 rounded-xl bg-red-50' : ''}\`} />
                {vendorFormErrors.idProof && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.idProof}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Vendor Profile Photo <span className="text-red-400">*</span></label>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, profilePhoto: e.target.files[0]}})} className={\`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 transition-all \${vendorFormErrors.profilePhoto ? 'border border-red-300 p-2 rounded-xl bg-red-50' : ''}\`} />
                {vendorFormErrors.profilePhoto && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.profilePhoto}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">GST Certificate (Optional)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, gstCert: e.target.files[0]}})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Company Logo (Optional)</label>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, companyLogo: e.target.files[0]}})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Bank Verification Document (Optional)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, bankVerification: e.target.files[0]}})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Portfolio Images (Optional, Multiple)</label>
              <input type="file" multiple accept=".jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, portfolioImages: e.target.files}})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
            </div>
          </div>
        </div>
`;

if (targetRegex.test(c)) {
  fs.writeFileSync(targetFile, c.replace(targetRegex, '$1' + newFields + '\n$2'));
  console.log('Frontend JSX replaced');
} else {
  console.log('Target not found via regex for JSX');
}
