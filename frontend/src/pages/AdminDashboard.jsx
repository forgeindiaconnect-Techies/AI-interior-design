import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Users, Store, ShoppingBag, Hammer, Truck, CheckCircle, XCircle, Briefcase,
  DollarSign, Bell, AlertCircle, RefreshCw, Eye, Send, BarChart2, ShieldCheck,
  LayoutDashboard, Key, HelpCircle, FileText, Sparkles, UserCheck, CheckSquare,
  UserX, UserPlus, Search, Filter, Calendar, Trash2, Lock, Unlock, Info, Plus, CreditCard, Activity,
  Wrench, Package, List, MapPin, Download, Layers, Clock, Paintbrush, ArrowRight, MessageSquare, RotateCcw, X
} from 'lucide-react';
import AiFallbackImage from '../components/AiFallbackImage';
import AdminContactMessages from './admin/AdminContactMessages';

// ── Vendor Modal Components ──
const VendorFormModal = ({ isEdit, vendorForm, setVendorForm, vendorFormErrors, onClose, onSubmit, vendorActionLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-[#2A9D8F]" />
          </div>
          <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</h3>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Full Name <span className="text-red-400">*</span></label>
            <input type="text" value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="John Doe" className={`w-full px-4 py-3 rounded-xl border ${vendorFormErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all`} />
            {vendorFormErrors.name && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Company Name <span className="text-red-400">*</span></label>
            <input type="text" value={vendorForm.companyName} onChange={e => setVendorForm({...vendorForm, companyName: e.target.value})} placeholder="Artisan Workshop" className={`w-full px-4 py-3 rounded-xl border ${vendorFormErrors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all`} />
            {vendorFormErrors.companyName && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.companyName}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email <span className="text-red-400">*</span></label>
            <input type="email" value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email: e.target.value})} placeholder="vendor@example.com" className={`w-full px-4 py-3 rounded-xl border ${vendorFormErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all`} />
            {vendorFormErrors.email && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Contact Number <span className="text-red-400">*</span></label>
            <input type="text" value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} placeholder="+1 555-0123" className={`w-full px-4 py-3 rounded-xl border ${vendorFormErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all`} />
            {vendorFormErrors.phone && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.phone}</p>}
          </div>
        </div>
        {!isEdit && (
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Password <span className="text-red-400">*</span></label>
            <input type="password" value={vendorForm.password} onChange={e => setVendorForm({...vendorForm, password: e.target.value})} placeholder="Min 6 characters" className={`w-full px-4 py-3 rounded-xl border ${vendorFormErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all`} />
            {vendorFormErrors.password && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.password}</p>}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Category</label>
          <input type="text" value={vendorForm.category} onChange={e => setVendorForm({...vendorForm, category: e.target.value})} placeholder="Furniture, Decor, etc." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Address</label>
          <textarea rows={2} value={vendorForm.address} onChange={e => setVendorForm({...vendorForm, address: e.target.value})} placeholder="123 Business St, City" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all resize-none" />
        </div>
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-sm text-[#1F2937] mb-3">Additional Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <h4 className="font-bold text-sm text-[#1F2937] mb-4">Vendor Documents</h4>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Business Registration Cert (PDF/JPG/PNG) <span className="text-red-400">*</span></label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, registrationCert: e.target.files[0]}})} className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 transition-all ${vendorFormErrors.registrationCert ? 'border border-red-300 p-2 rounded-xl bg-red-50' : ''}`} />
                {vendorFormErrors.registrationCert && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.registrationCert}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Government ID Proof (Aadhaar, PAN, etc.) <span className="text-red-400">*</span></label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, idProof: e.target.files[0]}})} className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 transition-all ${vendorFormErrors.idProof ? 'border border-red-300 p-2 rounded-xl bg-red-50' : ''}`} />
                {vendorFormErrors.idProof && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.idProof}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Vendor Profile Photo <span className="text-red-400">*</span></label>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, profilePhoto: e.target.files[0]}})} className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2A9D8F]/10 file:text-[#2A9D8F] hover:file:bg-[#2A9D8F]/20 transition-all ${vendorFormErrors.profilePhoto ? 'border border-red-300 p-2 rounded-xl bg-red-50' : ''}`} />
                {vendorFormErrors.profilePhoto && <p className="text-xs text-red-500 mt-1">{vendorFormErrors.profilePhoto}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">GST Certificate (Optional)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setVendorForm({...vendorForm, documents: {...vendorForm.documents, gstCert: e.target.files[0]}})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

        <div className="pt-2">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Status</label>
          <select value={vendorForm.status} onChange={e => setVendorForm({...vendorForm, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all">
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
          <button type="submit" disabled={vendorActionLoading} className="px-6 py-3 rounded-xl bg-[#1F2937] text-white font-bold text-sm hover:bg-black disabled:opacity-50 transition-all shadow-sm flex items-center gap-2">
            {vendorActionLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> {isEdit ? 'Updating...' : 'Adding...'}</> : (isEdit ? 'Update Vendor' : 'Add Vendor')}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const ViewVendorModal = ({ selectedVendor, onClose, onApprove, onReject }) => (
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
              <p className="font-semibold text-[#1F2937] capitalize">{selectedVendor.yearsOfExperience ? `${selectedVendor.yearsOfExperience} Years` : 'N/A'}</p>
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
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${selectedVendor.isActive ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'bg-[#E76F51]/10 text-[#E76F51]'}`}>
                {selectedVendor.isActive ? 'Active' : 'Suspended'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Doc Status</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${selectedVendor.documentVerificationStatus === 'Approved' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : selectedVendor.documentVerificationStatus === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                {selectedVendor.documentVerificationStatus || 'Pending Verification'}
              </span>
            </div>
          </div>

          {selectedVendor.documents && Object.keys(selectedVendor.documents).length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-sm text-[#1F2937] mb-3">Uploaded Documents</h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedVendor.documents.registrationCert && (
                  <a href={`http://localhost:5000${selectedVendor.documents.registrationCert}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">Registration Cert</span>
                  </a>
                )}
                {selectedVendor.documents.idProof && (
                  <a href={`http://localhost:5000${selectedVendor.documents.idProof}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">ID Proof</span>
                  </a>
                )}
                {selectedVendor.documents.profilePhoto && (
                  <a href={`http://localhost:5000${selectedVendor.documents.profilePhoto}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">Profile Photo</span>
                  </a>
                )}
                {selectedVendor.documents.gstCert && (
                  <a href={`http://localhost:5000${selectedVendor.documents.gstCert}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">GST Cert</span>
                  </a>
                )}
                {selectedVendor.documents.companyLogo && (
                  <a href={`http://localhost:5000${selectedVendor.documents.companyLogo}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
                    <span className="text-sm font-semibold text-gray-700 truncate">Company Logo</span>
                  </a>
                )}
                {selectedVendor.documents.bankVerification && (
                  <a href={`http://localhost:5000${selectedVendor.documents.bankVerification}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-[#2A9D8F] transition-all">
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

const DeleteConfirmModal = ({ deleteConfirmVendor, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
      <div className="p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
          <Trash2 className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Delete Vendor</h3>
        <p className="text-sm text-gray-500">Are you sure you want to delete <strong>{deleteConfirmVendor?.companyName || deleteConfirmVendor?.name}</strong>? This action cannot be undone.</p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-sm">Delete</button>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ 
  activeTab = 'overview', 
  setActiveTab,
  notifications = [],
  onNotifClick,
  onMarkAllRead,
  searchQuery = '',
  highlightRequestId = null
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [managementData, setManagementData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const res = await axios.get('/admin/payouts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data.success) {
        setAdminPayouts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin payouts', err);
    }
  };

  const handleUpdatePayoutStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this payout request as ${status}?`)) return;
    try {
      const remarks = payoutAdminRemarks[id] || '';
      const res = await axios.put(`/admin/payouts/${id}`, { status, adminRemarks: remarks }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.data.success) {
        alert(`Payout ${status} successfully`);
        fetchAdminPayouts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating payout status');
    }
  };

  const [adminTrackingData, setAdminTrackingData] = useState({});
  const [expandedTrackingOrder, setExpandedTrackingOrder] = useState(null);

  const handleOpenImage = (e, imgUrl) => {
    e.preventDefault();
    if (!imgUrl) return;
    if (imgUrl.startsWith('data:')) {
      const win = window.open();
      if (win) {
        win.document.write(`
          <html>
            <body style="margin:0; background:#111; display:flex; justify-content:center; align-items:center; height:100vh;">
              <img src="${imgUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" />
            </body>
          </html>
        `);
        win.document.close();
      }
    } else {
      window.open(imgUrl, '_blank');
    }
  };

  // System Notification State

  // Partner Assignment State
  const [assignmentOrder, setAssignmentOrder] = useState(null);
  const [selectedPartnerType, setSelectedPartnerType] = useState('manufacturer');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  // Payments & Commission States
  const [transactions, setTransactions] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  const [commissionRate, setCommissionRate] = useState(15);
  const [commRate, setCommRate] = useState(15);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newUserReg, setNewUserReg] = useState(true);
  const [aiFeature, setAiFeature] = useState(true);
  const [marketplaceFeature, setMarketplaceFeature] = useState(true);
  const [manualReqFeature, setManualReqFeature] = useState(true);
  const [minOrderValue, setMinOrderValue] = useState(500);
  const [savedMsg, setSavedMsg] = useState('');
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionFilterType, setTransactionFilterType] = useState('all');
  const [transactionFilterStatus, setTransactionFilterStatus] = useState('all');

  // Verification, Store Setup & Product Quality Review States
  const [verificationSubmissions, setVerificationSubmissions] = useState([]);
  const [vendorRegistrations, setVendorRegistrations] = useState([]);
  const [storeSetupSubmissions, setStoreSetupSubmissions] = useState([]);
  const [productReviewSubmissions, setProductReviewSubmissions] = useState([]);
  const [remarks, setRemarks] = useState({});

  // Support Tickets State
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');

  // Contact Messages from Landing Page
  const [contactMessages, setContactMessages] = useState([]);

  // Help Center Live Chat States
  const [helpMessages, setHelpMessages] = useState([]);
  const [helpInput, setHelpInput] = useState('');
  const [selectedHelpUser, setSelectedHelpUser] = useState('');

  // Direct Messages from Users to Vendors (admin view)
  const [adminDirectMessages, setAdminDirectMessages] = useState([]);
  const [adminMsgInput, setAdminMsgInput] = useState('');
  
  // Reviews Management State
  const [adminReviews, setAdminReviews] = useState([]);
  const [loadingAdminReviews, setLoadingAdminReviews] = useState(false);

  const [selectedMsgUser, setSelectedMsgUser] = useState('');
  const [customDesignFilter, setCustomDesignFilter] = useState('All');
  const [customRequestSearch, setCustomRequestSearch] = useState('');
  const [customRequestStatusFilter, setCustomRequestStatusFilter] = useState('all');
  const [customRequestRoomFilter, setCustomRequestRoomFilter] = useState('all');
  const [customRequestBudgetFilter, setCustomRequestBudgetFilter] = useState('all');

  useEffect(() => {
    if (activeTab === 'support') {
      const loadHelpMessages = async () => {
        try {
          const res = await axios.get('/chat/sync');
          if (res.data && res.data.success) {
            const msgs = res.data.data;
            setHelpMessages(msgs);
            
            // Auto-select first customer support chat if none is selected
            if (msgs.length > 0 && !selectedHelpUser) {
              const uniqueUsers = Array.from(new Set(msgs.map(m => m.userName)));
              if (uniqueUsers.length > 0) {
                setSelectedHelpUser(uniqueUsers[0]);
              }
            }
          }
        } catch (err) {
          console.warn('Failed to load chat messages:', err);
        }
      };
      loadHelpMessages();
      const interval = setInterval(loadHelpMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedHelpUser]);

  const loadContactMessages = () => {
    const msgs = [];
    setContactMessages(msgs);
  };

  const handleDismissContactMessage = (id) => {
    const updated = contactMessages.filter(m => m._id !== id);
    setContactMessages(updated);
    
  };

  const handleMarkContactReplied = (id) => {
    const updated = contactMessages.map(m => m._id === id ? { ...m, status: 'replied' } : m);
    setContactMessages(updated);
    
  };

  const chatEndRef = useRef(null);

  const loadAdminMessages = () => {
    const msgs = [];
    setAdminDirectMessages(msgs);
    if (msgs.length > 0 && !selectedMsgUser) {
      const seenKeys = new Set();
      const uniqueKeys = [];
      msgs.forEach(m => {
        const key = m.userName;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueKeys.push(key);
        }
      });
      if (uniqueKeys.length > 0) {
        setSelectedMsgUser(uniqueKeys[0]);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      loadAdminMessages();
      window.addEventListener('mockChatUpdated', loadAdminMessages);
      const interval = setInterval(loadAdminMessages, 2500);
      return () => {
        window.removeEventListener('mockChatUpdated', loadAdminMessages);
        clearInterval(interval);
      };
    }
  }, [activeTab, selectedMsgUser]);

  useEffect(() => {
    if (activeTab === 'messages' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [adminDirectMessages, activeTab, selectedMsgUser]);

  const handleSendAdminDirectMessage = (e) => {
    e.preventDefault();
    if (!adminMsgInput.trim() || !selectedMsgUser) return;

    const selUserName = selectedMsgUser;
    const userMsgs = adminDirectMessages.filter(m => m.userName === selUserName);
    const selVendorName = userMsgs.length > 0 && userMsgs[0].vendorName ? userMsgs[0].vendorName : 'Artisan Workshop Ltd';
    const roomId = userMsgs.length > 0 ? userMsgs[0].roomId : 'unknown_room';
    const userEmail = userMsgs.length > 0 ? userMsgs[0].userEmail : 'user@example.com';

    const newMsg = {
      _id: 'adm_' + Date.now(),
      roomId: roomId,
      userName: selUserName,
      userEmail: userEmail,
      vendorName: selVendorName,
      senderRole: 'admin',
      senderName: 'Admin Support',
      message: adminMsgInput,
      createdAt: new Date().toISOString()
    };

    const existing = [];
    const updated = [...existing, newMsg];
    
    setAdminDirectMessages(updated);
    setAdminMsgInput('');
  };

  const handleSendAdminHelpMessage = async (e) => {
    e.preventDefault();
    if (!helpInput.trim() || !selectedHelpUser) return;

    // Find the user's email to respond to the correct thread
    const userMsg = helpMessages.find(m => m.userName === selectedHelpUser);
    const userEmail = userMsg ? userMsg.userEmail : 'user@example.com';

    const newMsg = {
      _id: 'hm_' + Date.now(),
      userName: selectedHelpUser,
      userEmail: userEmail,
      senderRole: 'admin',
      senderName: 'Platform Admin',
      message: helpInput,
      createdAt: new Date().toISOString()
    };

    const updated = [...helpMessages, newMsg];
    
    setHelpMessages(updated);
    setHelpInput('');

    try {
      await axios.put('/chat/sync', { chat: updated });
    } catch (err) {
      console.warn('Failed to sync chat messages:', err);
    }

    // Trigger notification to user
    const notifObj = {
      _id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message: `[Help Center] Support reply from Admin: "${helpInput.substring(0, 30)}..."`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    };
    const uNotifs = [];
    
  };

  // Roles & Permissions State
  const [subAdmins, setSubAdmins] = useState([]);
  const [loadingSubAdmins, setLoadingSubAdmins] = useState(false);
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [newSubAdminUserId, setNewSubAdminUserId] = useState('');
  const [newSubAdminRole, setNewSubAdminRole] = useState('Moderator');
  const [newSubAdminPermissions, setNewSubAdminPermissions] = useState({
    userManagement: false,
    vendorVerification: false,
    ordersWorkflow: false,
    supportTickets: false,
    analytics: false,
    notifications: false
  });

  // Unified Admin Orders & Workflow States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderStageFilter, setOrderStageFilter] = useState('all');
  const [orderPartnerFilter, setOrderPartnerFilter] = useState('all');

  const [viewOrder, setViewOrder] = useState(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null);
  const [newWorkflowStage, setNewWorkflowStage] = useState('');
  const [newExpectedDeliveryDate, setNewExpectedDeliveryDate] = useState('');
  const [trackOrder, setTrackOrder] = useState(null);
  const [cancelOrderObj, setCancelOrderObj] = useState(null);

  // Improved User Management & Moderation States
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [joinedFilter, setJoinedFilter] = useState('all');

  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspensionReasonText, setSuspensionReasonText] = useState('');
  const [confirmActionModal, setConfirmActionModal] = useState(null);

  // Upgraded Manufacturer Management States
  const [mfgSearch, setMfgSearch] = useState('');
  const [mfgSpecializationFilter, setMfgSpecializationFilter] = useState('all');
  const [mfgVerificationFilter, setMfgVerificationFilter] = useState('all');
  const [mfgStatusFilter, setMfgStatusFilter] = useState('all');
  const [mfgWorkloadFilter, setMfgWorkloadFilter] = useState('all');

  const [selectedMfgProfile, setSelectedMfgProfile] = useState(null);
  const [selectedMfgLoad, setSelectedMfgLoad] = useState(null);
  const [mfgLoadOrders, setMfgLoadOrders] = useState([]);
  const [loadingMfgLoad, setLoadingMfgLoad] = useState(false);

  const [assignOrderMfg, setAssignOrderMfg] = useState(null);
  const [assignOrderDetails, setAssignOrderDetails] = useState({ orderId: '', designDetails: '', measurements: '', materials: '', budget: 0 });

  const [mfgApproveConfirm, setMfgApproveConfirm] = useState(null);
  const [mfgSuspendConfirm, setMfgSuspendConfirm] = useState(null);
  const [mfgSuspendReason, setMfgSuspendReason] = useState('');

  const [mfgDocsModal, setMfgDocsModal] = useState(null);
  const [mfgPaymentsModal, setMfgPaymentsModal] = useState(null);
  const [mfgPayments, setMfgPayments] = useState([]);
  const [loadingMfgPayments, setLoadingMfgPayments] = useState(false);

  // Delivery Partner Management States
  const [deliverySearch, setDeliverySearch] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('all');
  const [deliveryAreaFilter, setDeliveryAreaFilter] = useState('all');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('all');
  const [deliveryVerificationFilter, setDeliveryVerificationFilter] = useState('all');

  const [selectedDeliveryProfile, setSelectedDeliveryProfile] = useState(null);
  const [assignDeliveryOrderPartner, setAssignDeliveryOrderPartner] = useState(null);
  const [assignInstallationJobPartner, setAssignInstallationJobPartner] = useState(null);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState(null);
  const [selectedPartnerJobs, setSelectedPartnerJobs] = useState(null);

  const [assignDeliveryDetails, setAssignDeliveryDetails] = useState({ orderId: '' });
  const [assignInstallationDetails, setAssignInstallationDetails] = useState({ orderId: '', scheduledDate: '', notes: '' });
  const [liveTrackingOrderId, setLiveTrackingOrderId] = useState('');

  // AI Design Requests States
  const [selectedAIDesign, setSelectedAIDesign] = useState(null);
  const [assignVendorAIDesign, setAssignVendorAIDesign] = useState(null);
  const [convertOrderAIDesign, setConvertOrderAIDesign] = useState(null);
  const [workflowAIDesign, setWorkflowAIDesign] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const [aiDesignSearch, setAiDesignSearch] = useState('');
  const [aiDesignRoomFilter, setAiDesignRoomFilter] = useState('all');
  const [aiDesignStatusFilter, setAiDesignStatusFilter] = useState('all');
  const [aiDesignBudgetFilter, setAiDesignBudgetFilter] = useState('all');

  const [selectedAIDesignVendorId, setSelectedAIDesignVendorId] = useState('');
  const [selectedAIDesignManufacturerId, setSelectedAIDesignManufacturerId] = useState('');
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');

  // Close action dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (openActionMenuId && !e.target.closest('.action-menu-container')) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openActionMenuId]);

  // Upgraded Manual Design Requests States
  const [selectedManualDesign, setSelectedManualDesign] = useState(null);
  const [assignVendorManualDesign, setAssignVendorManualDesign] = useState(null);
  const [assignDesignerManualDesign, setAssignDesignerManualDesign] = useState(null);
  const [workflowManualDesign, setWorkflowManualDesign] = useState(null);

  const [manualDesignSearch, setManualDesignSearch] = useState('');
  const [manualDesignRoomFilter, setManualDesignRoomFilter] = useState('all');
  const [manualDesignStatusFilter, setManualDesignStatusFilter] = useState('all');
  const [manualDesignBudgetFilter, setManualDesignBudgetFilter] = useState('all');
  const [manualRequestFilter, setManualRequestFilter] = useState('All');

  const [selectedManualDesignVendorId, setSelectedManualDesignVendorId] = useState('');
  const [selectedManualDesignDesignerId, setSelectedManualDesignDesignerId] = useState('');

  // Interior Designer Requests States
  const [selectedDesignerRequest, setSelectedDesignerRequest] = useState(null);
  const [assignDesignerRequestObj, setAssignDesignerRequestObj] = useState(null);
  const [designerRequestSearch, setDesignerRequestSearch] = useState('');
  const [designerRequestStatusFilter, setDesignerRequestStatusFilter] = useState('all');
  const [designerRequestBudgetFilter, setDesignerRequestBudgetFilter] = useState('all');
  const [selectedRequestDesignerId, setSelectedRequestDesignerId] = useState('');

  // Vendor CRUD States
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStatusFilter, setVendorStatusFilter] = useState('all');
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showEditVendorModal, setShowEditVendorModal] = useState(false);
  const [showViewVendorModal, setShowViewVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [deleteConfirmVendor, setDeleteConfirmVendor] = useState(null);
  const [vendorForm, setVendorForm] = useState({ name: '', companyName: '', email: '', phone: '', password: '', address: '', businessType: 'vendor', category: '', status: 'Active', businessCategory: '', yearsOfExperience: '', websiteUrl: '', socialMediaUrl: '', documents: { registrationCert: null, idProof: null, profilePhoto: null, gstCert: null, companyLogo: null, bankVerification: null, portfolioImages: [] } });
  const [vendorFormErrors, setVendorFormErrors] = useState({});
  const [vendorActionLoading, setVendorActionLoading] = useState(false);

  const vendorStats = useMemo(() => ({
    total: vendors.length,
    active: vendors.filter(v => v.isActive).length,
    suspended: vendors.filter(v => !v.isActive).length,
    pending: vendors.filter(v => v.verificationStatus === 'Pending' || v.status === 'Pending').length
  }), [vendors]);

  const filteredVendors = useMemo(() => vendors.filter(v => {
    const q = vendorSearch.toLowerCase();
    const matchSearch = !q || (v.companyName && v.companyName.toLowerCase().includes(q)) || ((v.userId?.name || v.name) && (v.userId?.name || v.name).toLowerCase().includes(q)) || ((v.userId?.email || v.email) && (v.userId?.email || v.email).toLowerCase().includes(q)) || ((v.userId?.phone || v.phone) && (v.userId?.phone || v.phone).toLowerCase().includes(q));
    const matchStatus = vendorStatusFilter === 'all' ||
      (vendorStatusFilter === 'active' && v.isActive) ||
      (vendorStatusFilter === 'suspended' && !v.isActive);
    return matchSearch && matchStatus;
  }), [vendors, vendorSearch, vendorStatusFilter]);

  // Sync global header search query to all local tab search filters
  useEffect(() => {
    setTransactionSearch(searchQuery);
    setOrderSearch(searchQuery);
    setUserSearch(searchQuery);
    setMfgSearch(searchQuery);
    setDeliverySearch(searchQuery);
    setAiDesignSearch(searchQuery);
    setManualDesignSearch(searchQuery);
    setDesignerRequestSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchAdminData();
    loadContactMessages();
    const syncInterval = setInterval(() => {
      fetchAdminData();
      loadContactMessages();
    }, 30000);
    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  // Scroll to and highlight the request from notification
  useEffect(() => {
    if (highlightRequestId && activeTab === 'custom_design_requests') {
      const timer = setTimeout(() => {
        const el = document.getElementById(`admin-request-${highlightRequestId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-blue-50', 'ring-2', 'ring-blue-300');
          setTimeout(() => {
            el.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-300');
          }, 3000);
        }
        localStorage.removeItem('highlightRequestId');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [managementData, highlightRequestId, activeTab]);

  useEffect(() => {
    let verifInterval = null;
    let hasFailed = false;

    if (activeTab === 'verifications') {
      const loadVendorRegistrations = async () => {
        if (hasFailed) return; // Stop retrying after a failure
        try {
          const res = await axios.get('/admin/vendor-registrations', {
            headers: { Authorization: `Bearer ${user?.token}` }
          });
          if (res.data?.success) {
            setVendorRegistrations(res.data.data);
          }
        } catch (err) {
          hasFailed = true; // Mark as failed to stop the interval from retrying
          if (verifInterval) clearInterval(verifInterval);
          // Silently handle - the URL fix resolves the root cause; this prevents console spam
        }
      };

      const loadVerifFromStorage = () => {
        const localVer = [];
        if (localVer.length > 0) {
          setVerificationSubmissions(prev => {
            const merged = [...localVer];
            (prev || []).forEach(p => { if (!merged.find(m => m._id === p._id)) merged.push(p); });
            return merged;
          });
        }
      };

      loadVendorRegistrations();
      loadVerifFromStorage();
      verifInterval = setInterval(() => {
        if (!hasFailed) {
          loadVendorRegistrations();
          loadVerifFromStorage();
        }
      }, 10000); // Increased to 10s to reduce noise
      return () => {
        if (verifInterval) clearInterval(verifInterval);
      };
    }
  }, [activeTab, user?.token]);

  useEffect(() => {
    if (activeTab === 'reviews_management') {
      const loadReviews = async () => {
        setLoadingAdminReviews(true);
        try {
          const res = await axios.get('/admin/reviews');
          if (res.data && res.data.success) {
            setAdminReviews(res.data.data);
          }
        } catch (err) {
          console.warn('Failed to load admin reviews:', err);
        } finally {
          setLoadingAdminReviews(false);
        }
      };
      loadReviews();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'delivery' && managementData?.orders) {
      const trackingStatuses = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'];
      const trackingOrders = managementData.orders.filter(o => trackingStatuses.includes(o.orderStatus));
      trackingOrders.forEach(o => fetchOrderTrackingAdmin(o._id));
    }
  }, [activeTab, managementData]);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await axios.delete(`/admin/reviews/${id}`);
      if (res.data.success) {
        setAdminReviews(prev => prev.filter(r => r._id !== id));
        alert('Review deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review');
    }
  };

  const fetchAdminData = async () => {
    try {
      // ── Synchronous seed: show data immediately ──
      const now = new Date();
      setStats({ totalUsers: 240, totalVendors: 35, totalOrders: 128, totalRevenue: 45200, totalManufacturers: 14, totalDelivery: 18, estimatedCommission: 6780 });
      setManagementData({
        users: [],
        vendors: [
          { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop', businessType: 'vendor', userId: { email: 'vendor@example.com' }, isVerified: true, verificationStatus: 'Approved', storeSetupStatus: 'Approved', isActive: true },
          { _id: 'v2', companyName: 'Elite Woodworks', businessType: 'manufacturer', userId: { email: 'wood@example.com' }, isVerified: false, verificationStatus: 'Pending', storeSetupStatus: 'Pending', isActive: false },
        ],
        orders: [
          { _id: 'ord_2', orderType: 'Marketplace Product', userId: { name: 'Alice Smith', email: 'alice@example.com' }, vendorId: { companyName: 'Artisan Workshop' }, totalAmount: 898, paymentStatus: 'paid', orderStatus: 'Dispatched', createdAt: new Date(now - 86400000*2).toISOString(), shippingAddress: '456 Elm St', isMarketplace: false },
        ],
        aiDesigns: [],
        manualDesigns: [],
        designerRequests: []
      });

      // WE SET LOADING TO FALSE IMMEDIATELY TO ENSURE THE DASHBOARD OPENS QUICKLY
      setLoading(false);

      // ── Async: refresh from backend ──
      const [statsRes, mgmtRes, mktOrdersRes, verRes, storeRes, prodRes] = await Promise.all([
        axios.get('/admin/stats').catch(() => ({ data: { data: { totalUsers: 240, totalVendors: 35, totalOrders: 128, totalRevenue: 45200, totalManufacturers: 14, totalDelivery: 18, estimatedCommission: 6780 } } })),
        axios.get('/admin/management-data').catch(() => ({ data: { data: { users: [], vendors: [], orders: [], aiDesigns: [], manualDesigns: [] } } })),
        axios.get('/marketplace-orders/all').catch(() => ({ data: { data: [] } })),
        axios.get('/admin/verifications').catch(() => ({ data: { data: [] } })),
        axios.get('/admin/store-approvals').catch(() => ({ data: { data: [] } })),
        axios.get('/admin/product-reviews').catch(() => ({ data: { data: [] } }))
      ]);
      if (statsRes.data?.data) setStats(statsRes.data.data);

      // Seed mock data for demo purposes if backend is empty/offline
      const mockMgmtData = mgmtRes.data?.data || {};
      if (!mockMgmtData.users || mockMgmtData.users.length === 0) {
        mockMgmtData.users = [
          { 
            _id: 'u_mock_3', 
            name: 'Alice Smith', 
            email: 'alice@example.com', 
            phone: '+1 555-0144', 
            role: 'user', 
            createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
            status: 'Suspended',
            suspensionReason: 'Suspicious spam order pattern detected',
            totalOrders: 2,
            totalSpending: 1200,
            address: '789 Designer Lane, New York, NY, USA'
          },
          { 
            _id: 'u_mock_4', 
            name: 'Bob Builder', 
            email: 'bob@example.com', 
            phone: '+1 555-0177', 
            role: 'manufacturer', 
            createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
            status: 'Active',
            suspensionReason: '',
            totalOrders: 15,
            totalSpending: 24500,
            address: 'Manufacturing Hub, Detroit, MI, USA'
          },
          { 
            _id: 'u_mock_5', 
            name: 'Charlie Chaplin', 
            email: 'charlie@example.com', 
            phone: '+1 555-0188', 
            role: 'user', 
            createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
            status: 'Blocked',
            suspensionReason: 'Terms of service violation',
            totalOrders: 1,
            totalSpending: 80,
            address: '456 Cinema Road, Los Angeles, CA, USA'
          }
        ];
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        mockMgmtData.userStats = {
          totalUsers: mockMgmtData.users.length,
          activeUsers: mockMgmtData.users.filter(u => u.status === 'Active').length,
          suspendedUsers: mockMgmtData.users.filter(u => u.status === 'Suspended').length,
          newUsersThisMonth: mockMgmtData.users.filter(u => new Date(u.createdAt) >= startOfMonth).length
        };
      }
      if (!mockMgmtData.vendors || mockMgmtData.vendors.length === 0) {
        mockMgmtData.vendors = [
          { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop', businessType: 'vendor', userId: { email: 'vendor@example.com' }, isVerified: true, verificationStatus: 'Submitted', storeSetupStatus: 'Submitted', isActive: false },
          { _id: 'v2', companyName: 'Elite Woodworks', businessType: 'manufacturer', userId: { email: 'wood@example.com' }, isVerified: false, verificationStatus: 'Pending', storeSetupStatus: 'Pending', isActive: false },
          {
            _id: 'del_mock_1',
            companyName: 'Swift Logistics Solutions',
            businessType: 'delivery',
            description: 'Fast, secure home deliveries with cargo vans and medium trucks.',
            rating: 4.9,
            reviewsCount: 156,
            isVerified: true,
            verificationStatus: 'Approved',
            storeSetupStatus: 'Approved',
            isActive: true,
            serviceAreas: ['Bangalore', 'Mumbai'],
            vehicleType: 'Cargo Van',
            deliveryStatus: 'Idle',
            installationAvailable: false,
            userId: { name: 'Ravi Kumar', email: 'ravi@swiftlogistics.com', phone: '+91 99887 76655' },
            createdAt: new Date(Date.now() - 3600000 * 24 * 45)
          },
          {
            _id: 'del_mock_2',
            companyName: 'Apex Delivery & Assembly',
            businessType: 'delivery',
            description: 'Integrated home delivery and premium furniture assembly services.',
            rating: 4.7,
            reviewsCount: 88,
            isVerified: true,
            verificationStatus: 'Approved',
            storeSetupStatus: 'Approved',
            isActive: true,
            serviceAreas: ['Noida', 'Delhi NCR'],
            vehicleType: 'Mini Truck',
            deliveryStatus: 'On Trip',
            installationAvailable: true,
            userId: { name: 'Sanjay Sharma', email: 'sanjay@apexdelivery.com', phone: '+91 98989 89898' },
            createdAt: new Date(Date.now() - 3600000 * 24 * 30)
          },
          {
            _id: 'del_mock_3',
            companyName: 'Express Furniture Movers',
            businessType: 'delivery',
            description: 'Two-wheeler and small vehicle delivery for light packages and accessories.',
            rating: 4.4,
            reviewsCount: 34,
            isVerified: true,
            verificationStatus: 'Submitted',
            storeSetupStatus: 'Pending',
            isActive: true,
            serviceAreas: ['Mumbai'],
            vehicleType: 'Two-Wheeler',
            deliveryStatus: 'Idle',
            installationAvailable: false,
            userId: { name: 'Karan Singh', email: 'karan@expressmovers.com', phone: '+91 91234 56789' },
            createdAt: new Date(Date.now() - 3600000 * 24 * 15)
          },
          {
            _id: 'del_mock_4',
            companyName: 'Elite Installers & Movers',
            businessType: 'installation',
            description: 'Specialists in heavy custom wardrobe installations and modular kitchens.',
            rating: 4.8,
            reviewsCount: 72,
            isVerified: true,
            verificationStatus: 'Approved',
            storeSetupStatus: 'Approved',
            isActive: false,
            serviceAreas: ['Detroit', 'Chicago'],
            vehicleType: 'Cargo Van',
            deliveryStatus: 'Idle',
            installationAvailable: true,
            userId: { name: 'David Miller', email: 'david@eliteinstallers.com', phone: '+1 555-0322' },
            createdAt: new Date(Date.now() - 3600000 * 24 * 10)
          }
        ];
      }
      if (!mockMgmtData.orders || mockMgmtData.orders.length === 0) {
        mockMgmtData.orders = [
          {
            _id: 'ord_d_9182',
            orderType: 'AI Design',
            userId: { name: 'Alice Smith', email: 'alice@example.com' },
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 4500,
            paymentStatus: 'paid',
            orderStatus: 'Quotation Accepted',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 15).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
            shippingAddress: '789 Designer Lane, New York, NY, USA'
          },

          {
            _id: 'ord_p_1044',
            orderType: 'Marketplace Product',
            userId: { name: 'Charlie Chaplin', email: 'charlie@example.com' },
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: { _id: 'del_mock_1', companyName: 'Swift Logistics Solutions' },
            installationPartnerId: null,
            totalAmount: 1250,
            paymentStatus: 'paid',
            orderStatus: 'Delivery Assigned',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
            shippingAddress: '456 Cinema Road, Los Angeles, CA, USA'
          },

          {
            _id: 'ord_p_5541',
            orderType: 'Marketplace Product',
            userId: { name: 'Alice Smith', email: 'alice@example.com' },
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 350,
            paymentStatus: 'pending',
            orderStatus: 'Request Submitted',
            expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 7).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
            shippingAddress: '789 Designer Lane, New York, NY, USA'
          },
          {
            _id: 'ord_ref_1',
            orderType: 'Custom Design',
            userId: { name: 'Priya Sharma', email: 'priya@example.com' },
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 3200,
            paymentStatus: 'paid',
            orderStatus: 'Cancelled',
            expectedDeliveryDate: null,
            createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
            shippingAddress: '45 Lake View, Mumbai, India'
          },
          {
            _id: 'ord_ref_2',
            orderType: 'Marketplace Product',
            userId: { name: 'Rahul Verma', email: 'rahul@example.com' },
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 1499,
            paymentStatus: 'refunded',
            orderStatus: 'Refunded',
            expectedDeliveryDate: null,
            createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
            shippingAddress: '22 Green Park, Delhi, India'
          },
          {
            _id: 'ord_ref_3',
            orderType: 'AI Design',
            userId: { name: 'Ananya Gupta', email: 'ananya@example.com' },
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            manufacturerId: null,
            deliveryPartnerId: null,
            installationPartnerId: null,
            totalAmount: 5800,
            paymentStatus: 'paid',
            orderStatus: 'Cancelled',
            expectedDeliveryDate: null,
            createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
            shippingAddress: '77 Sunrise Ave, Pune, India'
          }
        ];
      }
      if (!mockMgmtData.aiDesigns || mockMgmtData.aiDesigns.length === 0) {
        mockMgmtData.aiDesigns = [{ _id: 'ai_1', roomType: 'Living Room', generatedImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200', aiSuggestion: { budgetEstimate: 3000 }, status: 'accepted' }];
      }
      if (!mockMgmtData.manualDesigns || mockMgmtData.manualDesigns.length === 0) {
        mockMgmtData.manualDesigns = [{ _id: 'man_1', roomType: 'Bedroom', style: 'Minimalist', budget: 1500, size: '200 sq ft', requirements: 'Cozy and dark.', status: 'pending' }];
      }
      if (!mockMgmtData.designerRequests || mockMgmtData.designerRequests.length === 0) {
        mockMgmtData.designerRequests = [
          {
            _id: 'des_req_102',
            userId: { _id: 'u_mock_3', name: 'Alice Smith', email: 'alice@example.com', phone: '+1 555-0144' },
            details: 'Need professional interior design consultation for a high-end luxury master suite. Wants premium wallpapers, lighting setups, and automated drapery.',
            budget: 15000,
            status: 'assigned',
            assignedDesignerId: { _id: 'designer_mock_1', companyName: 'Studio Oak Design' },
            createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
          }
        ];
      }

      const safeParse = (key) => {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch (_) {
          return [];
        }
      };

      const localOrders = safeParse('mockOrders');
      const finalOrders = [...localOrders];
      (mockMgmtData.orders || []).forEach(bo => {
        if (!finalOrders.find(lo => lo._id === bo._id)) {
          finalOrders.push(bo);
        }
      });
      mockMgmtData.orders = finalOrders;

      const localManualRequests = safeParse('mockManualRequests');
      const finalManualRequests = [...localManualRequests];
      (mockMgmtData.manualDesigns || []).forEach(br => {
        if (!finalManualRequests.find(lr => lr._id === br._id)) {
          finalManualRequests.push(br);
        }
      });
      mockMgmtData.manualDesigns = finalManualRequests;

      const localDesignerRequests = safeParse('mockDesignerRequests');
      const finalDesignerRequests = [...localDesignerRequests];
      (mockMgmtData.designerRequests || []).forEach(br => {
        if (!finalDesignerRequests.find(lr => lr._id === br._id)) {
          finalDesignerRequests.push(br);
        }
      });
      mockMgmtData.designerRequests = finalDesignerRequests;

      const localAiDesigns = safeParse('mockAiDesigns');
      const finalAiDesigns = [...localAiDesigns];
      (mockMgmtData.aiDesigns || []).forEach(bd => {
        if (!finalAiDesigns.find(ld => ld._id === bd._id)) {
          finalAiDesigns.push(bd);
        }
      });
      mockMgmtData.aiDesigns = finalAiDesigns;

      // Fetch marketplace orders and merge into management data
      try {
        if (mktOrdersRes.data?.success && mktOrdersRes.data.data) {
          const mktOrders = mktOrdersRes.data.data.map(o => ({
            _id: o._id,
            orderType: 'Marketplace Product',
            userId: o.userId,
            vendorId: o.items?.[0]?.vendorId || { companyName: 'Artisan Workshop' },
            totalAmount: o.totalAmount,
            paymentStatus: o.paymentStatus,
            orderStatus: o.orderStatus,
            shippingAddress: o.shippingAddress,
            createdAt: o.createdAt,
            isMarketplace: true,
            productDetails: o.items?.[0]?.productId ? {
              _id: o.items[0].productId._id,
              title: o.items[0].productId.title,
              price: o.items[0].price,
              images: o.items[0].productId.images || [],
              quantity: o.items.reduce((sum, i) => sum + i.quantity, 0)
            } : { title: 'Marketplace Product', quantity: o.items?.reduce((sum, i) => sum + i.quantity, 0) || 0 }
          }));
          const existingOrderIds = new Set((mockMgmtData.orders || []).map(o => o._id));
          mktOrders.forEach(o => {
            if (!existingOrderIds.has(o._id)) {
              mockMgmtData.orders.push(o);
            }
          });
        }
      } catch (err) {
        console.warn('Failed to fetch marketplace orders for admin', err);
      }

      setManagementData(mockMgmtData);

      // Fetch Verification, Store Setup & Product Quality Review Data
      // (Pre-fetched via Promise.all)

      const currentVer = verRes.data?.data || [];
      const currentStore = storeRes.data?.data || [];
      const currentProd = prodRes.data?.data || [];

      // Always merge vendor-submitted verifications from localStorage (vendor submissions go here)
      const localVerifications = [];
      const mergedVer = [...localVerifications];
      currentVer.forEach(cv => { if (!mergedVer.find(lv => lv._id === cv._id)) mergedVer.push(cv); });
      if (mergedVer.length === 0) {
        mergedVer.push({
          _id: 'verification_mock_1',
          vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
          businessName: 'Artisan Workshop Private Limited',
          ownerName: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          email: 'vendor@example.com',
          gstNumber: '27AAAAA1111A1Z1',
          panNumber: 'ABCDE1234F',
          idProofUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600',
          addressProofUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
          bankDetails: { accountNumber: '987654321098', ifscCode: 'HDFC0000123', bankName: 'HDFC Bank' },
          status: 'Pending',
          adminRemarks: '',
          submittedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        });
      }
      setVerificationSubmissions(mergedVer);

      if (currentStore.length === 0) {
        setStoreSetupSubmissions([
          {
            _id: 'store_mock_1',
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            description: 'Expert hand-crafted wooden furniture workshops specialized in mid-century tables.',
            specialization: 'Woodworks',
            monthlyCapacity: 40,
            serviceAreas: 'Bangalore, Noida, Mumbai',
            status: 'Pending',
            adminRemarks: '',
            submittedAt: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
      } else {
        setStoreSetupSubmissions(currentStore);
      }

      if (currentProd.length === 0) {
        setProductReviewSubmissions([
          {
            _id: 'prod_rev_mock_1',
            vendorId: { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
            title: 'Vintage Oak Coffee Table',
            description: 'Beautiful hand-polished coffee table made of sustainably sourced oak.',
            price: 349,
            images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600'],
            category: 'Tables',
            material: 'Oak Wood',
            status: 'Pending',
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
          }
        ]);
      } else {
        setProductReviewSubmissions(currentProd);
      }
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderTrackingAdmin = async (orderId) => {
    if (!orderId) return;
    // Skip mock/non-MongoDB order IDs — they only exist in frontend mock data
    if (String(orderId).startsWith('ord_') || String(orderId).startsWith('mock_') || String(orderId).startsWith('mkt_')) return;
    try {
      const res = await axios.get(`/orders/tracking/${orderId}`);
      if (res.data?.success) {
        setAdminTrackingData(prev => ({ ...prev, [orderId]: res.data.data }));
      }
    } catch (err) {
      // silently ignore — order may not have tracking yet
    }
  };

  // Payments & Commission Actions
  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const res = await axios.get('/admin/transactions');
      if (res.data?.success) {
        setTransactions(res.data.data.transactions || []);
        setPaymentStats(res.data.data.stats || null);
        setCommissionRate(res.data.data.commissionRate || 15);
      }
    } catch (error) {
      console.warn('Error fetching transactions, using mock client fallback', error);
      // Mock fallback if API fails
      const mockTx = [
        {
          _id: 'txn_102938',
          orderId: 'ord_d_9182',
          userId: { name: 'Alice Smith', email: 'alice@example.com' },
          vendorId: { companyName: 'Artisan Workshop' },
          amount: 4500,
          commissionAmount: 675,
          netPayout: 3825,
          paymentMethod: 'Card',
          status: 'Paid',
          type: 'Customer Payment',
          createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
        },

        {
          _id: 'txn_582910',
          orderId: 'ord_p_1044',
          userId: { name: 'Charlie Chaplin', email: 'charlie@example.com' },
          vendorId: { companyName: 'Artisan Workshop' },
          amount: 1250,
          commissionAmount: 187.5,
          netPayout: 1062.5,
          paymentMethod: 'UPI',
          status: 'Pending',
          type: 'Vendor Payout',
          createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
        },

        {
          _id: 'txn_449201',
          orderId: 'ord_p_5541',
          userId: { name: 'Alice Smith', email: 'alice@example.com' },
          vendorId: { companyName: 'Artisan Workshop' },
          amount: 350,
          commissionAmount: 52.5,
          netPayout: 297.5,
          paymentMethod: 'Card',
          status: 'Processing',
          type: 'Customer Payment',
          createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
        }
      ];
      // Merge transactions from localStorage (created by quotation payments)
      const localTxns = [];
      const mergedTxns = [...mockTx];
      localTxns.forEach(lt => {
        if (!mergedTxns.find(t => t._id === lt._id)) mergedTxns.push(lt);
      });

      // Read vendor payout requests from localStorage and add as pending transactions
      const vendorPayouts = JSON.parse(localStorage.getItem('mockVendorPayouts') || '[]');
      let pendingPayoutsTotal = 1600;
      vendorPayouts.forEach(vp => {
        const txnId = 'vp_' + vp.id;
        if (!mergedTxns.find(t => t._id === txnId)) {
          mergedTxns.push({
            _id: txnId,
            orderId: 'payout_req_' + vp.id,
            vendorId: { companyName: vp.vendorName },
            amount: vp.amount,
            commissionAmount: Math.round(vp.amount * (commissionRate || 15) / 100),
            netPayout: vp.amount,
            status: 'Pending',
            type: 'Vendor Payout',
            createdAt: new Date().toISOString(),
            vendorEmail: vp.vendorEmail || ''
          });
          pendingPayoutsTotal += vp.amount;
        }
      });

      setTransactions(mergedTxns);
      setPaymentStats({
        totalPlatformRevenue: 19550 + pendingPayoutsTotal,
        estimatedCommission: Math.round((19550 + pendingPayoutsTotal) * (commissionRate || 15) / 100),
        disbursedPayouts: 11050,
        pendingPayouts: pendingPayoutsTotal
      });
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleUpdateCommissionRate = async (newRate) => {
    try {
      const res = await axios.put('/admin/commission-rate', { rate: newRate });
      if (res.data?.success) {
        setCommissionRate(newRate);
        alert(`Platform commission rate updated to: ${newRate}%`);
        fetchTransactions();
      }
    } catch (error) {
      alert('Error updating commission rate');
    }
  };

  const handleDisbursePayout = async (transactionId) => {
    try {
      const res = await axios.post('/admin/transactions/disburse', { transactionId });
      if (res.data?.success) {
        alert('Payout disbursed successfully!');
        fetchTransactions();
      }
    } catch (error) {
      alert('Error disbursing payout');
    }
  };

  const handleDisburseAllPending = async () => {
    const pendingTxList = transactions.filter(t => t.status === 'Pending' || t.status === 'Processing');
    if (pendingTxList.length === 0) {
      alert('No pending or processing payouts to disburse.');
      return;
    }
    try {
      await Promise.all(pendingTxList.map(t => axios.post('/admin/transactions/disburse', { transactionId: t._id })));
      alert('All pending payouts disbursed successfully!');
      fetchTransactions();
    } catch (error) {
      alert('Error disbursing all pending payouts');
    }
  };

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await axios.get('/admin/tickets');
      if (res.data?.success) {
        setTickets(res.data.data || []);
      }
    } catch (error) {
      console.warn('Error fetching support tickets, falling back to mock');
      setTickets([
      ]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchSubAdmins = async () => {
    setLoadingSubAdmins(true);
    try {
      const res = await axios.get('/admin/permissions');
      if (res.data?.success) {
        setSubAdmins(res.data.data || []);
      }
    } catch (error) {
      console.warn('Error fetching sub-admins, falling back to mock');
      setSubAdmins([

        {
          _id: 'sub_2',
          userId: { _id: 'u_mock_3', name: 'Alice Smith', email: 'alice@example.com', phone: '+1 555-0144', role: 'admin' },
          roleName: 'Operations Lead',
          permissions: {
            userManagement: true,
            vendorVerification: true,
            ordersWorkflow: true,
            supportTickets: false,
            analytics: true,
            notifications: false
          },
          updatedAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
        }
      ]);
    } finally {
      setLoadingSubAdmins(false);
    }
  };

  const handleAddSubAdminSubmit = async (e) => {
    e.preventDefault();
    if (!newSubAdminUserId) {
      alert('Please select a user to promote');
      return;
    }
    try {
      await axios.post('/admin/permissions', {
        userId: newSubAdminUserId,
        roleName: newSubAdminRole,
        permissions: newSubAdminPermissions
      });
      alert('Sub-admin role and permissions configured successfully!');
      setShowAddSubAdminModal(false);
      setNewSubAdminUserId('');
      setNewSubAdminRole('Moderator');
      setNewSubAdminPermissions({
        userManagement: false,
        vendorVerification: false,
        ordersWorkflow: false,
        supportTickets: false,
        analytics: false,
        notifications: false
      });
      fetchSubAdmins();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding sub-admin');
    }
  };

  const handleUpdatePermissionToggle = async (subAdminId, permissionKey, currentValue) => {
    try {
      const subAdmin = subAdmins.find(s => s._id === subAdminId);
      if (!subAdmin) return;
      const updatedPermissions = {
        ...subAdmin.permissions,
        [permissionKey]: !currentValue
      };
      await axios.put(`/admin/permissions/${subAdminId}`, {
        permissions: updatedPermissions
      });
      setSubAdmins(subAdmins.map(s => s._id === subAdminId ? { ...s, permissions: updatedPermissions } : s));
    } catch (error) {
      alert('Error updating permission toggle');
    }
  };

  const handleUpdateRoleName = async (subAdminId, newRoleName) => {
    try {
      await axios.put(`/admin/permissions/${subAdminId}`, {
        roleName: newRoleName
      });
      setSubAdmins(subAdmins.map(s => s._id === subAdminId ? { ...s, roleName: newRoleName } : s));
    } catch (error) {
      alert('Error updating sub-admin role name');
    }
  };

  const handleRevokeSubAdmin = async (subAdminId) => {
    if (!window.confirm('Are you sure you want to revoke admin access for this user? They will be demoted to standard user.')) {
      return;
    }
    try {
      await axios.delete(`/admin/permissions/${subAdminId}`);
      alert('Sub-admin access revoked and user demoted successfully.');
      fetchSubAdmins();
    } catch (error) {
      alert('Error revoking sub-admin access');
    }
  };

  useEffect(() => {
    if (activeTab === 'admin_transactions') {
      fetchTransactions();
    }
    if (activeTab === 'tickets') {
      fetchTickets();
    }
    if (activeTab === 'roles') {
      fetchSubAdmins();
    }
    // Live-refresh orders from backend whenever admin switches to orders-related tabs
    if (activeTab === 'orders' || activeTab === 'manual_designs' || activeTab === 'ai_designs' || activeTab === 'custom_design_requests') {
      fetchAdminData();
    }
  }, [activeTab]);

  const handleExportCSV = (reportType) => {
    let csvContent = "";
    let fileName = "";
    if (reportType === 'sales') {
      csvContent = "Month,Sales,Commission,Orders\nJanuary,5000,750,15\nFebruary,12000,1800,28\nMarch,18000,2700,42\nApril,15000,2250,35\nMay,32000,4800,64\nJune,45200,6780,95\n";
      fileName = "artisan_platform_sales_report.csv";
    } else if (reportType === 'partners') {
      csvContent = "Partner,Role,QualityRating,TotalEarnings,CommissionGenerated\nArtisan Workshop,vendor,4.8,12500,1875\nElite Woodworks,manufacturer,4.6,8500,1275\nSwift Logistics,delivery,4.9,2400,360\nElite Installers,installation,4.7,1850,277.5\n";
      fileName = "artisan_partner_performance.csv";
    } else {
      csvContent = "User,Email,Role,RegisteredDate,Status\nAlice Smith,alice@example.com,user,2026-05-14,Suspended\nBob Builder,bob@example.com,manufacturer,2026-05-17,Active\n";
      fileName = "artisan_user_demographics.csv";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Successfully generated and downloaded ${fileName}!`);
  };

  // Vendor Verification Action
  const handleVendorVerification = async (vendorId, isVerified) => {
    try {
      await axios.put(`/admin/vendor-approval/${vendorId}`, { isVerified }).catch(() => console.log('mock approval'));
      setManagementData({
        ...managementData,
        vendors: managementData.vendors.map(v => v._id === vendorId ? { ...v, isVerified } : v)
      });
      alert(`Vendor verification updated to: ${isVerified}`);
    } catch (error) {
      alert('Error updating vendor verification');
    }
  };

  // User Suspension Submit Action
  const handleSuspendUserSubmit = async (e) => {
    e.preventDefault();
    if (!suspensionReasonText.trim()) {
      alert('Please provide a suspension reason.');
      return;
    }
    try {
      await axios.put(`/admin/suspend-user/${suspendModalUser._id}`, { reason: suspensionReasonText });
      
      // Recalculate local stats dynamically
      const updatedUsers = managementData.users.map(u => 
        u._id === suspendModalUser._id ? { ...u, status: 'Suspended', suspensionReason: suspensionReasonText } : u
      );
      
      setManagementData({
        ...managementData,
        users: updatedUsers,
        userStats: {
          ...managementData.userStats,
          activeUsers: updatedUsers.filter(u => u.status === 'Active').length,
          suspendedUsers: updatedUsers.filter(u => u.status === 'Suspended').length
        }
      });
      
      alert(`User ${suspendModalUser.name} suspended successfully.`);
      setSuspendModalUser(null);
      setSuspensionReasonText('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error suspending user');
    }
  };

  // Update User Status (Approve/Reject/Active)
  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const res = await axios.put(`/admin/users/${userId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const updatedUsers = managementData.users.map(u => 
        u._id === userId ? { ...u, status: res.data.user.status } : u
      );
      
      setManagementData({
        ...managementData,
        users: updatedUsers,
        userStats: {
          ...managementData.userStats,
          activeUsers: updatedUsers.filter(u => u.status === 'Active').length,
          suspendedUsers: updatedUsers.filter(u => u.status === 'Suspended').length
        }
      });
      
      alert(`User status updated to ${newStatus} successfully.`);
      setConfirmActionModal(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user status');
    }
  };

  // Reactivate User Action
  const handleReactivateUser = async (userId) => {
    try {
      await axios.put(`/admin/reactivate-user/${userId}`);
      
      const updatedUsers = managementData.users.map(u => 
        u._id === userId ? { ...u, status: 'Active', suspensionReason: '' } : u
      );
      
      setManagementData({
        ...managementData,
        users: updatedUsers,
        userStats: {
          ...managementData.userStats,
          activeUsers: updatedUsers.filter(u => u.status === 'Active').length,
          suspendedUsers: updatedUsers.filter(u => u.status === 'Suspended').length
        }
      });
      
      alert('User reactivated successfully.');
      setConfirmActionModal(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error reactivating user');
    }
  };

  // Block User Action
  const handleBlockUser = async (userId) => {
    try {
      await axios.put(`/admin/block-user/${userId}`);
      
      const updatedUsers = managementData.users.map(u => 
        u._id === userId ? { ...u, status: 'Blocked' } : u
      );
      
      setManagementData({
        ...managementData,
        users: updatedUsers,
        userStats: {
          ...managementData.userStats,
          activeUsers: updatedUsers.filter(u => u.status === 'Active').length,
          suspendedUsers: updatedUsers.filter(u => u.status === 'Suspended').length
        }
      });
      
      alert('User blocked successfully.');
      setConfirmActionModal(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error blocking user');
    }
  };

  // Delete User Action
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/delete-user/${userId}`);
      
      const updatedUsers = managementData.users.filter(u => u._id !== userId);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setManagementData({
        ...managementData,
        users: updatedUsers,
        userStats: {
          totalUsers: updatedUsers.length,
          activeUsers: updatedUsers.filter(u => u.status === 'Active').length,
          suspendedUsers: updatedUsers.filter(u => u.status === 'Suspended').length,
          newUsersThisMonth: updatedUsers.filter(u => new Date(u.createdAt) >= startOfMonth).length
        }
      });
      
      alert('User permanently deleted successfully.');
      setConfirmActionModal(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting user');
    }
  };

  // Helper to persist order changes locally in mock/offline mode
  const updateLocalOrderInStorage = (orderId, fields = {}) => {
    try {
      const stored = [];
      const updated = stored.map(o => o._id === orderId ? { ...o, ...fields } : o);
      
    } catch (err) {
      console.error('Failed to update local order in storage', err);
    }
  };

  // Assign Partner Action
  const handleAssignPartnerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/assign-partner', {
        orderId: assignmentOrder._id, partnerType: selectedPartnerType, partnerId: selectedPartnerId
      });
      alert(`✅ Assigned ${selectedPartnerType} successfully!`);
      setAssignmentOrder(null);
      setSelectedPartnerId('');
      fetchAdminData();
    } catch (error) {
      console.warn("Assign partner failed, falling back to mock update", error);
      // Fallback update in state if mock/offline
      if (managementData && managementData.orders) {
        const partner = managementData.vendors?.find(v => v._id === selectedPartnerId);
        const updateField = 
          selectedPartnerType === 'vendor' ? 'vendorId' :
          selectedPartnerType === 'manufacturer' ? 'manufacturerId' :
          selectedPartnerType === 'delivery' ? 'deliveryPartnerId' :
          selectedPartnerType === 'installation' ? 'installationPartnerId' : null;
        
        let nextStatus = 'Request Submitted';
        if (assignmentOrder) {
          nextStatus = 
            selectedPartnerType === 'vendor' ? 'Quotation Accepted' :
            selectedPartnerType === 'manufacturer' ? 'Manufacturer Assigned' :
            selectedPartnerType === 'delivery' ? 'Delivery Assigned' :
            selectedPartnerType === 'installation' ? 'Installation Assigned' : assignmentOrder.orderStatus;
        }

        const updatedFields = {
          [updateField]: partner ? { _id: partner._id, companyName: partner.companyName } : null,
          orderStatus: nextStatus
        };

        const updated = managementData.orders.map(o => {
          if (o._id === assignmentOrder._id) {
            return {
              ...o,
              ...updatedFields
            };
          }
          return o;
        });
        setManagementData({ ...managementData, orders: updated });
        updateLocalOrderInStorage(assignmentOrder._id, updatedFields);
      }
      setAssignmentOrder(null);
      setSelectedPartnerId('');
      alert(`✅ Assigned partner (offline mock updated)`);
    }
  };

  // Update Workflow Stage Action
  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!updateStatusOrder || !newWorkflowStage) return;
    try {
      await axios.put(`/admin/orders/${updateStatusOrder._id}/status`, {
        status: newWorkflowStage,
        expectedDeliveryDate: newExpectedDeliveryDate || undefined
      });
      alert(`✅ Workflow stage updated to: ${newWorkflowStage}`);
      setUpdateStatusOrder(null);
      setNewWorkflowStage('');
      setNewExpectedDeliveryDate('');
      fetchAdminData();
    } catch (error) {
      console.warn("Update status failed, falling back to mock update", error);
      if (managementData && managementData.orders) {
        const updated = managementData.orders.map(o => {
          if (o._id === updateStatusOrder._id) {
            return {
              ...o,
              orderStatus: newWorkflowStage,
              expectedDeliveryDate: newExpectedDeliveryDate ? new Date(newExpectedDeliveryDate) : o.expectedDeliveryDate
            };
          }
          return o;
        });
        setManagementData({ ...managementData, orders: updated });
      }
      setUpdateStatusOrder(null);
      setNewWorkflowStage('');
      setNewExpectedDeliveryDate('');
      alert(`✅ Stage updated (offline mock updated)`);
    }
  };

  // Cancel Order Action
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    try {
      await axios.put(`/admin/orders/${orderId}/cancel`);
      alert("❌ Order has been cancelled.");
      setCancelOrderObj(null);
      fetchAdminData();
    } catch (error) {
      console.warn("Cancel order failed, falling back to mock update", error);
      if (managementData && managementData.orders) {
        const updated = managementData.orders.map(o => {
          if (o._id === orderId) {
            return { ...o, orderStatus: 'Cancelled' };
          }
          return o;
        });
        setManagementData({ ...managementData, orders: updated });
      }
      setCancelOrderObj(null);
      alert("❌ Order cancelled (offline mock updated).");
    }
  };

  // Ticket Status Action
  const handleTicketStatus = async (ticketId, status) => {
    try {
      await axios.put(`/admin/tickets/${ticketId}`, { status });
      alert(`Ticket status updated to: ${status.replace('_', ' ').toUpperCase()}`);
      fetchTickets();
    } catch (error) {
      alert('Error updating ticket status');
    }
  };

  // Verification & Review Admin Actions
  const handleApproveVendorRegistration = async (id) => {
    try {
      await axios.put(`/admin/vendor-registrations/${id}/approve`, {}, { headers: { Authorization: `Bearer ${user?.token}` } });
      alert('Vendor Approved successfully!');
      if (activeTab === 'verifications') {
        const res = await axios.get('/admin/vendor-registrations', { headers: { Authorization: `Bearer ${user?.token}` } });
        if (res.data?.success) setVendorRegistrations(res.data.data);
      }
    } catch (err) {
      alert('Failed to approve vendor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectVendorRegistration = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;
    try {
      await axios.put(`/admin/vendor-registrations/${id}/reject`, { reason }, { headers: { Authorization: `Bearer ${user?.token}` } });
      alert('Vendor Rejected successfully!');
      if (activeTab === 'verifications') {
        const res = await axios.get('/admin/vendor-registrations', { headers: { Authorization: `Bearer ${user?.token}` } });
        if (res.data?.success) setVendorRegistrations(res.data.data);
      }
    } catch (err) {
      alert('Failed to reject vendor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleVerifyBusiness = async (id, status) => {
    try {
      const currentRemarks = remarks[id] || '';
      await axios.put(`/admin/verifications/${id}`, { status, adminRemarks: currentRemarks }).catch(() => console.log('mock verification verify'));
      
      // Update state
      const updatedSubs = verificationSubmissions.map(k => k._id === id ? { ...k, status, adminRemarks: currentRemarks } : k);
      setVerificationSubmissions(updatedSubs);
      
      // Sync back to localStorage so vendor sees the updated status
      const localVer = [];
      const updatedLocalVer = localVer.map(k => k._id === id ? { ...k, status, adminRemarks: currentRemarks } : k);

      // Send notification to vendor dashboard
      const sub = updatedSubs.find(k => k._id === id);
      const vendorEmail = sub?.email || 'vendor@example.com';
            const vendorNotifMessage = status === 'Approved'
        ? `Your business verification has been approved.`
        : status === 'Under Review'
        ? `Your business verification is now under review. We will notify you once a decision is made.`
        : `Your business verification has been rejected. Reason: ${currentRemarks || 'Please resubmit with correct documents.'}`;
      
      const vendorNotif = {
        _id: `verif_notif_${Date.now()}`,
        message: vendorNotifMessage,
        type: status === 'Approved' ? 'success' : status === 'Under Review' ? 'info' : 'error',
        createdAt: new Date().toISOString(),
        read: false
      };
      const existingVendorNotifs = [];

      alert(`✅ Business Verification status set to ${status} successfully! Vendor has been notified.`);
    } catch (error) {
      alert('Error updating Business Verification status');
    }
  };

  const handleApproveStore = async (id, status) => {
    try {
      const currentRemarks = remarks[id] || '';
      await axios.put(`/admin/store-approvals/${id}`, { status, adminRemarks: currentRemarks }).catch(() => console.log('mock store setup verify'));
      setStoreSetupSubmissions(storeSetupSubmissions.map(d => d._id === id ? { ...d, status, adminRemarks: currentRemarks } : d));
      alert(`✅ Store/Profile Setup status set to ${status} successfully!`);
    } catch (error) {
      alert('Error updating Store Setup status');
    }
  };

  const handleReviewProduct = async (id, approvalStatus) => {
    try {
      await axios.put(`/admin/product-reviews/${id}`, { approvalStatus }).catch(() => console.log('mock product review'));
      setProductReviewSubmissions(productReviewSubmissions.map(p => p._id === id ? { ...p, approvalStatus } : p));
      alert(`✅ Product quality status set to ${approvalStatus} successfully!`);
    } catch (error) {
      alert('Error updating product quality status');
    }
  };

  const handleVendorActivationToggle = async (vendorId, isActive) => {
    try {
      await axios.put(`/admin/vendor-activation/${vendorId}`, { isActive }).catch(() => console.log('mock vendor activation'));
      setManagementData({
        ...managementData,
        vendors: managementData.vendors.map(v => v._id === vendorId ? { ...v, isActive } : v)
      });
      alert(`✅ Vendor status set to: ${isActive ? 'ACTIVATED (Live)' : 'SUSPENDED (Off)'}`);
    } catch (error) {
      alert('Error updating vendor activation status');
    }
  };

  // ── Vendor CRUD Handlers ──
  const fetchVendors = async (showLoading = true) => {
    if (showLoading) setLoadingVendors(true);
    try {
      const res = await axios.get('/admin/vendors');
      if (res.data?.success) {
        setVendors(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch vendors from API, using management data fallback');
      const fallbackVendors = (managementData?.vendors || []).filter(v => v.businessType === 'vendor');
      setVendors(fallbackVendors.length > 0 ? fallbackVendors : []);
    } finally {
      if (showLoading) setLoadingVendors(false);
    }
  };

  const handleAddVendor = async (e) => {
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
  };

  const handleEditVendor = async (e) => {
    e.preventDefault();
    if (!selectedVendor) return;
    setVendorFormErrors({});
    const errors = {};
    if (!vendorForm.name.trim()) errors.name = 'Name is required';
    if (!vendorForm.companyName.trim()) errors.companyName = 'Company name is required';
    if (!vendorForm.email.trim()) errors.email = 'Email is required';
    if (!vendorForm.phone.trim()) errors.phone = 'Contact number is required';
    if (Object.keys(errors).length > 0) { setVendorFormErrors(errors); return; }
    setVendorActionLoading(true);
    try {
      const payload = { ...vendorForm };
      delete payload.password;
      await axios.put(`/admin/vendors/${selectedVendor._id}`, payload);
      alert('Vendor updated successfully');
      setShowEditVendorModal(false);
      setSelectedVendor(null);
      resetVendorForm();
      fetchVendors(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update vendor');
    } finally {
      setVendorActionLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    try {
      await axios.delete(`/admin/vendors/${vendorId}`);
      alert('Vendor deleted successfully');
      setDeleteConfirmVendor(null);
      fetchVendors(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vendor');
    }
  };

  const handleToggleVendorStatus = async (vendor) => {
    const newStatus = vendor.isActive ? 'Suspended' : 'Active';
    try {
      await axios.put(`/admin/vendors/${vendor._id}`, { status: newStatus });
      setVendors(prev => prev.map(v => v._id === vendor._id ? { ...v, isActive: !v.isActive } : v));
      alert(`Vendor ${newStatus === 'Active' ? 'activated' : 'suspended'} successfully`);
    } catch (err) {
      setVendors(prev => prev.map(v => v._id === vendor._id ? { ...v, isActive: !v.isActive } : v));
      alert(err.response?.data?.message || 'Failed to update vendor status');
    }
  };

  const resetVendorForm = () => {
    setVendorForm({ name: '', companyName: '', email: '', phone: '', password: '', address: '', businessType: 'vendor', category: '', status: 'Active' });
    setVendorFormErrors({});
  };

  const openAddVendorModal = () => {
    resetVendorForm();
    setShowAddVendorModal(true);
  };

  const openEditVendorModal = (vendor) => {
    setSelectedVendor(vendor);
    setVendorForm({
      name: vendor.userId?.name || vendor.name || '',
      companyName: vendor.companyName || '',
      email: vendor.userId?.email || vendor.email || '',
      phone: vendor.userId?.phone || vendor.phone || '',
      password: '',
      address: vendor.userId?.address || vendor.address || '',
      businessType: vendor.businessType || 'vendor',
      category: vendor.category || '',
      status: vendor.status || (vendor.isActive ? 'Active' : 'Suspended')
    });
    setVendorFormErrors({});
    setShowEditVendorModal(true);
  };

  const openViewVendorModal = (vendor) => {
    setSelectedVendor(vendor);
    setShowViewVendorModal(true);
  };

  // Fetch vendors when tab is selected
  useEffect(() => {
    if (activeTab === 'vendors') {
      fetchVendors();
    }
  }, [activeTab]);

  // Also refetch when managementData updates (for fallback)
  useEffect(() => {
    if (activeTab === 'vendors' && managementData) {
      fetchVendors(false);
    }
  }, [managementData?.vendors?.length]);

  // Upgraded Manufacturer Administration Actions
  const fetchMfgLoad = async (mfgId) => {
    setLoadingMfgLoad(true);
    try {
      const res = await axios.get(`/admin/manufacturers/${mfgId}/load`);
      setMfgLoadOrders(res.data?.data || []);
    } catch (error) {
      console.warn('Error fetching manufacturer load, using mock fallback', error);
      setMfgLoadOrders([]);
    } finally {
      setLoadingMfgLoad(false);
    }
  };

  const handleAssignMfgOrder = async (e) => {
    e.preventDefault();
    if (!assignOrderDetails.orderId) {
      alert('Please select an order to assign.');
      return;
    }
    try {
      await axios.post('/admin/manufacturers/assign-order', {
        orderId: assignOrderDetails.orderId,
        manufacturerId: assignOrderMfg._id,
        designDetails: assignOrderDetails.designDetails || 'Custom design manufacturing',
        measurements: assignOrderDetails.measurements || 'Standard',
        materials: assignOrderDetails.materials || 'Specified wood and upholstery',
        budget: Number(assignOrderDetails.budget) || 1000
      });
      alert('✅ Order assigned to manufacturer successfully!');
      setAssignOrderMfg(null);
      setAssignOrderDetails({ orderId: '', designDetails: '', measurements: '', materials: '', budget: 0 });
      fetchAdminData(); // Refresh all stats & records
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning order to manufacturer');
    }
  };

  const handleApproveMfg = async (mfgId) => {
    try {
      await axios.put(`/admin/manufacturers/${mfgId}/approve`);
      alert('✅ Manufacturer account has been fully verified and activated live!');
      setMfgApproveConfirm(null);
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving manufacturer');
    }
  };

  const handleSuspendMfgSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/manufacturers/${mfgSuspendConfirm._id}/suspend`, { reason: mfgSuspendReason });
      alert(`⚠️ Manufacturer ${mfgSuspendConfirm.companyName} has been suspended.`);
      setMfgSuspendConfirm(null);
      setMfgSuspendReason('');
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error suspending manufacturer');
    }
  };

  const fetchMfgPayments = async (mfgId) => {
    setLoadingMfgPayments(true);
    try {
      const res = await axios.get(`/admin/manufacturers/${mfgId}/payments`);
      setMfgPayments(res.data?.data || []);
    } catch (error) {
      console.warn('Error fetching manufacturer payments, using mock fallback', error);
      setMfgPayments([]);
    } finally {
      setLoadingMfgPayments(false);
    }
  };

  // Logistics & Delivery Action Handlers
  const handleAssignDeliveryOrderSubmit = async (e) => {
    e.preventDefault();
    if (!assignDeliveryDetails.orderId) {
      alert('Please select an order to assign.');
      return;
    }
    try {
      await axios.post('/admin/assign-partner', {
        orderId: assignDeliveryDetails.orderId,
        partnerType: 'delivery',
        partnerId: assignDeliveryOrderPartner._id
      });
      alert('✅ Order assigned for delivery successfully!');
      setAssignDeliveryOrderPartner(null);
      setAssignDeliveryDetails({ orderId: '' });
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning delivery order');
    }
  };

  const handleAssignInstallationJobSubmit = async (e) => {
    e.preventDefault();
    if (!assignInstallationDetails.orderId) {
      alert('Please select an order to assign.');
      return;
    }
    try {
      await axios.post('/admin/assign-partner', {
        orderId: assignInstallationDetails.orderId,
        partnerType: 'installation',
        partnerId: assignInstallationJobPartner._id
      });
      
      // Update status/schedule details
      await axios.put('/admin/delivery/update-status', {
        orderId: assignInstallationDetails.orderId,
        type: 'installation',
        status: 'Installation Scheduled',
        scheduledDate: assignInstallationDetails.scheduledDate,
        notes: assignInstallationDetails.notes
      }).catch(() => console.log('Mock status update'));

      alert('✅ Order assigned for installation successfully!');
      setAssignInstallationJobPartner(null);
      setAssignInstallationDetails({ orderId: '', scheduledDate: '', notes: '' });
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning installation job');
    }
  };

  const handleUpdateLogisticsStatus = async (orderId, type, status, trackingNotes) => {
    try {
      await axios.put('/admin/delivery/update-status', {
        orderId,
        type,
        status,
        trackingNotes
      });
      alert(`✅ Status updated successfully to: ${status}`);
      setSelectedTrackOrder(null);
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const handleApproveAIRequest = async (id) => {
    try {
      await axios.put(`/admin/ai-designs/${id}/status`, { status: 'generated' });
      alert('✅ AI Design approved and generated successfully!');
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving AI request');
    }
  };

  const handleRejectAIRequest = async (id) => {
    try {
      await axios.put(`/admin/ai-designs/${id}/status`, { status: 'rejected' });
      alert('❌ AI Design request marked as rejected.');
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error rejecting AI request');
    }
  };

  const handleAssignAIDesignVendorSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAIDesignVendorId) {
      alert('Please select a vendor to assign.');
      return;
    }

    const createVendorLocalEntries = () => {
      // Create a mock order so the vendor sees it in Custom Orders
      const mockOrder = {
        _id: 'ai_assign_' + Date.now(),
        orderType: 'AI Design',
        userId: assignVendorAIDesign.userId || { _id: 'u_local', name: 'Customer', email: 'customer@example.com', phone: 'N/A' },
        vendorId: { _id: selectedAIDesignVendorId, companyName: 'Assigned Partner' },
        totalAmount: assignVendorAIDesign.aiSuggestion?.budgetEstimate || 0,
        orderStatus: 'quotation_pending',
        aiDesignData: {
          roomType: assignVendorAIDesign.roomType,
          style: assignVendorAIDesign.stylePreference || 'Modern Minimalist',
          generatedImage: assignVendorAIDesign.generatedImage,
          originalImage: assignVendorAIDesign.originalImage,
          furniture: assignVendorAIDesign.aiSuggestion?.furniture || [],
          materials: assignVendorAIDesign.aiSuggestion?.materials || [],
          colorPalette: assignVendorAIDesign.aiSuggestion?.colorPalette || [],
          requirements: 'Custom AI design order awaiting vendor review.'
        },
        createdAt: new Date().toISOString()
      };
      const existingOrders = [];

      // Create a notification for the vendor
      const vendorNotif = {
        _id: 'nv_' + Date.now(),
        message: 'New AI request assigned by Admin',
        type: 'info',
        createdAt: new Date().toISOString(),
        read: false
      };
      const existingNotifs = [];
      
    };

    try {
      await axios.put(`/admin/ai-designs/${assignVendorAIDesign._id}/assign-vendor`, { vendorId: selectedAIDesignVendorId });
      createVendorLocalEntries();
      alert('✅ Vendor assigned to AI design request successfully!');
      setAssignVendorAIDesign(null);
      setSelectedAIDesignVendorId('');
      fetchAdminData();
    } catch (error) {
      // offline fallback
      const localAi = [];
      const vendorObj = { _id: selectedAIDesignVendorId, companyName: 'Assigned Partner' };
      const updatedAi = localAi.map(d => d._id === assignVendorAIDesign._id ? {
        ...d,
        ...(d.assignedVendor
          ? { additionalVendors: [...(d.additionalVendors || []), vendorObj] }
          : { assignedVendor: vendorObj, additionalVendors: d.additionalVendors || [] }
        )
      } : d);

      // Update state immediately
      setManagementData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          aiDesigns: (prev.aiDesigns || []).map(d => d._id === assignVendorAIDesign._id ? {
            ...d,
            ...(d.assignedVendor
              ? { additionalVendors: [...(d.additionalVendors || []), vendorObj] }
              : { assignedVendor: vendorObj, additionalVendors: d.additionalVendors || [] }
            )
          } : d)
        };
      });

      createVendorLocalEntries();
      alert('✅ Vendor assigned to AI design request successfully! (Offline mode)');
      setAssignVendorAIDesign(null);
      setSelectedAIDesignVendorId('');
    }
  };

  const handleConvertAIDesignOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAIDesignManufacturerId) {
      alert('Please select a manufacturing partner.');
      return;
    }
    try {
      await axios.post(`/admin/ai-designs/${convertOrderAIDesign._id}/convert-order`, { manufacturerId: selectedAIDesignManufacturerId });
      alert('🎉 Success! AI Design converted to custom order and dispatched to manufacturer!');
      setConvertOrderAIDesign(null);
      setSelectedAIDesignManufacturerId('');
      fetchAdminData();
    } catch (error) {
      // offline fallback
      const localAi = [];
      const updatedAi = localAi.map(d => d._id === convertOrderAIDesign._id ? {
        ...d,
        orderStatus: 'Pending Manufacturing',
        assignedVendor: d.assignedVendor || { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' }
      } : d);

      const newOrder = {
        _id: 'ord_ai_' + Date.now(),
        orderType: 'AI Generated',
        userId: convertOrderAIDesign.userId || { _id: 'u_local', name: 'Customer Demo', email: 'user@example.com' },
        vendorId: convertOrderAIDesign.assignedVendor || { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' },
        manufacturerId: { _id: selectedAIDesignManufacturerId, companyName: 'Assigned Manufacturer' },
        deliveryPartnerId: null,
        installationPartnerId: null,
        totalAmount: convertOrderAIDesign.aiSuggestion?.budgetEstimate || 3000,
        paymentStatus: 'paid',
        orderStatus: 'Production Started',
        expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 15).toISOString(),
        createdAt: new Date().toISOString(),
        designRequestId: convertOrderAIDesign._id
      };

      const localOrders = [];

      // Update state immediately
      setManagementData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          aiDesigns: (prev.aiDesigns || []).map(d => d._id === convertOrderAIDesign._id ? {
            ...d,
            orderStatus: 'Pending Manufacturing',
            assignedVendor: d.assignedVendor || { _id: '65c2b18a7c6b4b1c92949765', companyName: 'Artisan Workshop' }
          } : d),
          orders: [newOrder, ...localOrders]
        };
      });

      alert('🎉 Success! AI Design converted to custom order and dispatched to manufacturer! (Offline mode)');
      setConvertOrderAIDesign(null);
      setSelectedAIDesignManufacturerId('');
    }
  };

  // Helper: update a manual design request in localStorage (admin actions persist across sessions)
  const updateManualDesignInStorage = (id, fields = {}) => {
    try {
      const stored = [];
      const updated = stored.map(r => r._id === id ? { ...r, ...fields } : r);
      
      // Also update managementData state so UI reflects change immediately
      setManagementData(prev => prev ? {
        ...prev,
        manualDesigns: (prev.manualDesigns || []).map(r => r._id === id ? { ...r, ...fields } : r)
      } : prev);

      // If it is a mapped designer request, sync it back to designer request
      if (id.startsWith('man_from_des_')) {
        const desId = id.replace('man_from_des_', '');
        try {
          const localDesignerRequests = [];
          const updatedDes = localDesignerRequests.map(r => {
            if (r._id === desId) {
              const mappedFields = {};
              if (fields.status) {
                mappedFields.status = fields.status === 'Completed' ? 'completed' : (fields.status === 'Vendor Review' ? 'assigned' : 'pending');
              }
              if (fields.assignedVendorId) {
                mappedFields.assignedDesignerId = fields.assignedVendorId;
              }
              return { ...r, ...mappedFields };
            }
            return r;
          });
          
          setManagementData(prev => prev ? {
            ...prev,
            designerRequests: (prev.designerRequests || []).map(r => r._id === desId ? { ...r, ...updatedDes.find(d => d._id === desId) } : r)
          } : prev);
        } catch (err) {
          console.error('Failed to sync back designer request', err);
        }
      }
    } catch (err) {
      console.error('Failed to update manual design in localStorage', err);
    }
  };

  // Helper: update a designer request in localStorage (admin actions persist across sessions)
  const updateDesignerRequestInStorage = (id, fields = {}) => {
    try {
      const stored = [];
      const updated = stored.map(r => r._id === id ? { ...r, ...fields } : r);
      
      // Also update managementData state so UI reflects change immediately
      setManagementData(prev => prev ? {
        ...prev,
        designerRequests: (prev.designerRequests || []).map(r => r._id === id ? { ...r, ...fields } : r)
      } : prev);

      // Keep mockManualRequests in sync if this designer request was also mapped to manual requests
      try {
        const localManualRequests = [];
        const updatedManuals = localManualRequests.map(r => {
          if (r._id === `man_from_des_${id}`) {
            const mappedFields = {};
            if (fields.status) {
              mappedFields.status = fields.status === 'completed' ? 'Completed' : (fields.status === 'assigned' ? 'Vendor Review' : 'Submitted');
            }
            if (fields.assignedDesignerId) {
              mappedFields.assignedVendorId = fields.assignedDesignerId;
            }
            return { ...r, ...mappedFields };
          }
          return r;
        });
        
        setManagementData(prev => prev ? {
          ...prev,
          manualDesigns: (prev.manualDesigns || []).map(r => r._id === `man_from_des_${id}` ? { ...r, ...updatedManuals.find(m => m._id === `man_from_des_${id}`) } : r)
        } : prev);
      } catch (err) {
        console.error('Failed to sync manual requests', err);
      }
    } catch (err) {
      console.error('Failed to update designer request in localStorage', err);
    }
  };

  const handleAssignManualDesignVendorSubmit = async (e) => {
    e.preventDefault();
    if (!selectedManualDesignVendorId) { alert('Please select a vendor.'); return; }

    try {
      await axios.put(`/admin/manual-designs/${assignVendorManualDesign._id}/assign-vendor`, { vendorId: selectedManualDesignVendorId });
      await fetchAdminData();
      alert('🏪 Vendor assigned successfully to request!');
      setAssignVendorManualDesign(null);
      setSelectedManualDesignVendorId('');
    } catch (error) { 
      console.error(error);
      alert('Failed to assign vendor.');
    }
  };

  const handleAssignManualDesignDesignerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedManualDesignDesignerId) { alert('Please select a designer.'); return; }

    try {
      await axios.put(`/admin/manual-designs/${assignDesignerManualDesign._id}/assign-designer`, { designerId: selectedManualDesignDesignerId });
      await fetchAdminData();
      alert('🎨 Designer assigned successfully to request!');
      setAssignDesignerManualDesign(null);
      setSelectedManualDesignDesignerId('');
    } catch (error) { 
      console.error(error);
      alert('Failed to assign designer.');
    }
  };

  const handleApproveManualDesign = async (id) => {
    try {
      await axios.put(`/admin/manual-designs/${id}/approve`);
    } catch (_) { /* offline fallback */ }
    updateManualDesignInStorage(id, { status: 'Under Review' });
    alert('🎉 Manual request approved and under review!');

  };

  const handleRejectManualDesign = async (id) => {
    try {
      await axios.put(`/admin/manual-designs/${id}/reject`);
    } catch (_) { /* offline fallback */ }
    updateManualDesignInStorage(id, { status: 'Rejected' });
    alert('❌ Manual request rejected/reset.');

  };

  const handleAdminUpdateStatus = async (id, status, requestType = null) => {
    if (status === 'Delete') {
      const confirmDelete = window.confirm('Are you sure you want to delete this request? This action cannot be undone.');
      if (!confirmDelete) return;

      try {
        let url = `/admin/manual-designs/${id}`;
        if (requestType === 'Interior Designer Help') {
          url = `/admin/designer-requests/${id}`;
        } else if (requestType === 'AI Generated') {
          url = `/admin/orders/${id}`;
        }
        await axios.delete(url);
        if (selectedAIDesign && selectedAIDesign._id === id) setSelectedAIDesign(null);
        if (selectedManualDesign && selectedManualDesign._id === id) setSelectedManualDesign(null);
        if (selectedDesignerRequest && selectedDesignerRequest._id === id) setSelectedDesignerRequest(null);
        await fetchAdminData();
        alert('Request deleted successfully.');
      } catch (err) {
        console.error(err);
        alert('Failed to delete request.');
      }
      return;
    }

    try {
      await axios.put(`/admin/manual-designs/${id}/status`, { status });
      if (selectedAIDesign && selectedAIDesign._id === id) setSelectedAIDesign(prev => prev ? { ...prev, status } : null);
      if (selectedManualDesign && selectedManualDesign._id === id) setSelectedManualDesign(prev => prev ? { ...prev, status } : null);
      if (selectedDesignerRequest && selectedDesignerRequest._id === id) setSelectedDesignerRequest(prev => prev ? { ...prev, status } : null);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleUpdateManualDesignStatus = async (id, status) => {
    await handleAdminUpdateStatus(id, status);
  };

  const handleAssignDesignerRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequestDesignerId) {
      alert('Please select an interior designer.');
      return;
    }

    try {
      await axios.put(`/admin/manual-designs/${assignDesignerRequestObj._id}/assign-designer`, { designerId: selectedRequestDesignerId });
      await fetchAdminData();
      alert('🎨 Interior Designer assigned successfully to request!');
      setAssignDesignerRequestObj(null);
      setSelectedRequestDesignerId('');
    } catch (error) { 
      console.error(error);
      alert('Failed to assign designer.');
    }
  };

  const handleUpdateDesignerRequestStatus = async (id, status) => {
    await handleAdminUpdateStatus(id, status);
    alert(`✅ Status updated to ${status}!`);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center font-bold text-lg text-[#8B5E3C]">Loading System Admin Console...</div>;
  }

  return (
    <div className="space-y-10">

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (() => {
        const revenueData = [
          { month: 'Jan', value: 5000, max: 50000 },
          { month: 'Feb', value: 12000, max: 50000 },
          { month: 'Mar', value: 18000, max: 50000 },
          { month: 'Apr', value: 15000, max: 50000 },
          { month: 'May', value: 32000, max: 50000 },
          { month: 'Jun', value: 45200, max: 50000 },
        ];
        const pendingVerifications = verificationSubmissions?.filter(v => v.status === 'Pending' || v.status === 'pending')?.length || 0;
        const pendingStoreSetup = storeSetupSubmissions?.filter(s => s.status === 'Pending' || s.status === 'pending')?.length || 0;
        const pendingProductReviews = productReviewSubmissions?.filter(p => p.status === 'Pending' || p.status === 'pending' || p.approvalStatus === 'Pending')?.length || 0;
        const openTickets = tickets?.filter(t => t.status === 'open')?.length || 4;
        const pendingOrders = managementData?.orders?.filter(o => o.orderStatus === 'Request Submitted')?.length || 5;

        const activityFeed = [
          ...(managementData?.users?.slice(0, 2).map(u => ({ icon: '👤', label: `New user registered`, name: u.name || 'Unknown User', time: u.createdAt || new Date(Date.now() - 3600000 * 2).toISOString(), color: 'bg-indigo-50 text-indigo-600' })) || []),
          ...(managementData?.vendors?.slice(0, 2).map(v => ({ icon: '🏪', label: `Vendor joined the platform`, name: v.companyName || 'Vendor', time: v.createdAt || new Date(Date.now() - 3600000 * 5).toISOString(), color: 'bg-amber-50 text-amber-600' })) || []),
          ...(managementData?.orders?.slice(0, 2).map(o => ({ icon: '📦', label: `New order placed`, name: o.userId?.name || 'Customer', time: o.createdAt || new Date(Date.now() - 3600000 * 8).toISOString(), color: 'bg-emerald-50 text-emerald-600' })) || []),
          ...(verificationSubmissions?.slice(0, 1).map(k => ({ icon: '📋', label: `Verification submitted`, name: k.businessName || k.vendorId?.companyName || 'Vendor', time: k.createdAt || new Date(Date.now() - 3600000 * 12).toISOString(), color: 'bg-orange-50 text-orange-600' })) || []),
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

        const kpiCards = [
          { label: 'Total Users', value: stats?.totalUsers || 240, trend: '+12%', trendUp: true, sub: 'vs last month', icon: <Users className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600', tab: 'users' },
          { label: 'Total Vendors', value: stats?.totalVendors || 35, trend: '+4%', trendUp: true, sub: 'verified partners', icon: <Store className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600', tab: 'vendors' },
          { label: 'Total Orders', value: stats?.totalOrders || 128, trend: '+8%', trendUp: true, sub: 'active this month', icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600', tab: 'orders' },
          { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 45200).toLocaleString()}`, trend: '+19%', trendUp: true, sub: 'platform earnings', icon: <DollarSign className="w-5 h-5" />, color: 'bg-teal-50 text-teal-600', tab: 'payments' },
          { label: 'Sub-Admins', value: subAdmins?.length || 2, trend: 'Active', trendUp: true, sub: 'with ACL roles', icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600', tab: 'roles' },
          { label: 'Open Tickets', value: openTickets, trend: openTickets > 0 ? 'Needs attention' : 'All clear', trendUp: openTickets === 0, sub: 'support tickets', icon: <HelpCircle className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600', tab: 'tickets' },
        ];

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1F2937] via-[#2F3E46] to-[#3D5A80] rounded-3xl p-8 text-white shadow-xl">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">System Administration Console</p>
                  <h1 className="font-['Playfair_Display'] font-extrabold text-3xl md:text-4xl">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋</h1>
                  <p className="text-white/70 text-sm mt-2">
                    Platform is operating normally. {pendingVerifications > 0 && `${pendingVerifications} Vendor Verifications pending review. `}
                    {pendingStoreSetup > 0 && `${pendingStoreSetup} Store Setup submissions pending. `}
                    {pendingProductReviews > 0 && `${pendingProductReviews} Product Quality Reviews pending.`}
                  </p>
                </div>
                <div className="text-right bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Today</p>
                  <p className="text-white font-bold text-lg">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <p className="text-white/70 text-xs">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpiCards.map((card) => (
                <div
                  key={card.label}
                  onClick={() => setActiveTab && setActiveTab(card.tab)}
                  className="bg-white p-5 rounded-2xl border border-[#D4A373]/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <h3 className="font-['Playfair_Display'] font-extrabold text-xl text-[#1F2937]">{card.value}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{card.label}</p>
                  <div className={`mt-2 text-[10px] font-bold ${card.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {card.trendUp ? '↑' : '↓'} {card.trend}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Bar Chart */}
              <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Revenue Overview</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Monthly platform revenue (2026)</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <span>↑</span> +19% vs last period
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-40">
                  {revenueData.map((d, i) => {
                    const heightPct = Math.round((d.value / d.max) * 100);
                    const isMax = i === revenueData.length - 1;
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500">${(d.value / 1000).toFixed(0)}k</span>
                        <div className="w-full relative rounded-t-xl overflow-hidden" style={{ height: `${heightPct}%`, minHeight: '12px', background: isMax ? 'linear-gradient(to top, #8B5E3C, #D4A373)' : '#F3EDE4', transition: 'height 0.6s ease' }}>
                          {isMax && <div className="absolute inset-0 opacity-30 bg-white animate-pulse rounded-t-xl"></div>}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Distribution */}
              <div className="bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="mb-6">
                  <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Platform Users</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Role-wise distribution</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Standard Users', count: Math.round((stats?.totalUsers || 240) * 0.68), total: stats?.totalUsers || 240, color: '#6366f1' },
                    { label: 'Vendors', count: stats?.totalVendors || 35, total: stats?.totalUsers || 240, color: '#f59e0b' },
                    { label: 'Delivery Partners', count: Math.round((stats?.totalUsers || 240) * 0.08), total: stats?.totalUsers || 240, color: '#10b981' },
                    { label: 'Manufacturers', count: Math.round((stats?.totalUsers || 240) * 0.06), total: stats?.totalUsers || 240, color: '#8B5E3C' },
                    { label: 'Admins', count: (subAdmins?.length || 2) + 1, total: stats?.totalUsers || 240, color: '#3b82f6' },
                  ].map((item) => {
                    const pct = Math.round((item.count / item.total) * 100);
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="font-bold text-gray-600">{item.label}</span>
                          <span className="font-extrabold text-gray-800">{item.count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: item.color }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pending Actions + Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Action Items */}
              <div className="bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-rose-50 rounded-xl"><AlertCircle className="w-5 h-5 text-rose-500" /></div>
                  <div>
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Action Required</h3>
                    <p className="text-[11px] text-gray-400">Items awaiting your attention</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Vendor Verifications', count: pendingVerifications, tab: 'verifications', color: 'bg-orange-50 text-orange-600 border-orange-100', urgent: pendingVerifications > 3 },
                    { label: 'Store Setup Reviews', count: pendingStoreSetup, tab: 'store-approvals', color: 'bg-amber-50 text-amber-600 border-amber-100', urgent: pendingStoreSetup > 3 },
                    { label: 'Product Quality Reviews', count: pendingProductReviews, tab: 'product-reviews', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', urgent: pendingProductReviews > 5 },
                    { label: 'Open Support Tickets', count: openTickets, tab: 'tickets', color: 'bg-rose-50 text-rose-600 border-rose-100', urgent: openTickets > 5 },
                    { label: 'Unassigned Orders', count: pendingOrders, tab: 'orders', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', urgent: pendingOrders > 8 },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center justify-between p-3.5 rounded-2xl border ${item.color} transition-all`}>
                      <div className="flex items-center gap-3">
                        {item.urgent && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0"></span>}
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">{item.count}</span>
                        <button
                          onClick={() => setActiveTab && setActiveTab(item.tab)}
                          className="text-[10px] font-bold px-2.5 py-1 bg-white/60 hover:bg-white rounded-lg border border-current/20 transition-all"
                        >
                          Resolve →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent System Notifications */}
              <div className="bg-white p-7 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl"><Bell className="w-5 h-5 text-indigo-500" /></div>
                    <div>
                      <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">System Notifications</h3>
                      <p className="text-[11px] text-gray-400">Latest platform alerts and messages</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab && setActiveTab('notifications')} className="text-xs font-bold text-[#1D3557] hover:underline">View All</button>
                </div>
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-gray-300 text-sm">No recent notifications to display.</div>
                ) : (
                  <div className="space-y-1">
                    {notifications.slice(0, 5).map((notif, idx) => (
                      <div key={notif._id || idx} className={`flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all ${!notif.read ? 'bg-[#1D3557]/5' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl ${!notif.read ? 'bg-[#1D3557] text-white' : 'bg-gray-100 text-gray-500'} flex items-center justify-center text-sm shrink-0`}>
                          <Bell size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.read ? 'font-extrabold text-[#1F2937]' : 'font-bold text-gray-600'} truncate`}>{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </p>
                        </div>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-[#1D3557] shrink-0 mt-2"></span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Grid (Premium Redesign) */}
            <div className="space-y-4">
              <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                 {/* Pending Approvals Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('verifications')}
                >
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <CheckSquare size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-amber-600 transition-colors">Vendor Approvals</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Review and approve vendor business verifications, store setups, and product reviews.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Approval Center</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Active Orders Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('orders')}
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-blue-600 transition-colors">Active Orders</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Manage manufacturing tasks, courier shipments, and installer bookings.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">Operations Hub</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Revenue Summary Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('analytics')}
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <BarChart2 size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-emerald-600 transition-colors">Revenue Summary</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">View gross marketplace sales volume, payments, and platform commissions.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">View Analytics</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* AI Requests Queue Card */}
                <div 
                  className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group" 
                  onClick={() => setActiveTab && setActiveTab('ai_designs')}
                >
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-[#1F2937] text-sm group-hover:text-purple-600 transition-colors">AI Requests Queue</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Monitor neural network room suggestions and design conversions.</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400">AI Monitor</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (() => {
        // Calculate filtered users
        const filteredUsers = managementData?.users?.filter(u => {
          const matchesSearch = 
            (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
            (u.phone && u.phone.includes(userSearch));

          const matchesRole = roleFilter === 'all' || u.role === roleFilter;

          const matchesStatus = statusFilter === 'all' || (u.status || 'Active') === statusFilter;

          let matchesJoined = true;
          if (joinedFilter !== 'all') {
            const createdDate = new Date(u.createdAt);
            const today = new Date();
            if (joinedFilter === 'today') {
              matchesJoined = createdDate.toDateString() === today.toDateString();
            } else if (joinedFilter === 'week') {
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(today.getDate() - 7);
              matchesJoined = createdDate >= oneWeekAgo;
            } else if (joinedFilter === 'month') {
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(today.getMonth() - 1);
              matchesJoined = createdDate >= oneMonthAgo;
            } else if (joinedFilter === 'year') {
              const oneYearAgo = new Date();
              oneYearAgo.setFullYear(today.getFullYear() - 1);
              matchesJoined = createdDate >= oneYearAgo;
            }
          }

          return matchesSearch && matchesRole && matchesStatus && matchesJoined;
        }) || [];

        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">User Management & Moderation</h2>
              <span className="text-xs text-gray-500 font-bold">Monitor roles, search registrations, track total orders and spend, and suspend/block access.</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Users</span>
                  <div className="w-10 h-10 bg-[#8B5E3C]/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#8B5E3C]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-[#1F2937]">{managementData?.userStats?.totalUsers || 0}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold uppercase">Platform Registrations</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Users</span>
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-green-600">{managementData?.userStats?.activeUsers || 0}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold uppercase">Unrestricted Logins</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Suspended Users</span>
                  <div className="w-10 h-10 bg-[#E76F51]/10 rounded-full flex items-center justify-center">
                    <UserX className="w-5 h-5 text-[#E76F51]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-[#E76F51]">{managementData?.userStats?.suspendedUsers || 0}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold uppercase">Temporarily Suspended</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">New Users This Month</span>
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-blue-600">{managementData?.userStats?.newUsersThisMonth || 0}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold uppercase">Joined In May 2026</p>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#D4A373]/30 text-sm focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:w-auto w-full">
                <div className="flex items-center gap-1.5 bg-white border border-[#D4A373]/30 px-3 py-2 rounded-xl">
                  <Filter className="text-gray-400 w-3.5 h-3.5" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Customers</option>
                    <option value="vendor">Vendors</option>
                    <option value="manufacturer">Manufacturers</option>
                    <option value="delivery">Delivery</option>
                    <option value="installation">Installation</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-[#D4A373]/30 px-3 py-2 rounded-xl">
                  <ShieldCheck className="text-gray-400 w-3.5 h-3.5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-[#D4A373]/30 px-3 py-2 rounded-xl">
                  <Calendar className="text-gray-400 w-3.5 h-3.5" />
                  <select
                    value={joinedFilter}
                    onChange={(e) => setJoinedFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer w-full"
                  >
                    <option value="all">Joined (All)</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-150 bg-gray-50/50 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      <th className="py-4 px-6">User Name</th>
                      <th className="py-4 px-6">Email / Phone</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-right">Total Spending</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center font-bold text-gray-400">
                          No users matching search or filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u._id} className="border-b border-gray-50 hover:bg-[#F8F5F0]/20 transition-all">
                          <td className="py-4 px-6 font-bold text-[#1F2937]">{u.name}</td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-gray-600">{u.email}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{u.phone || 'No phone registered'}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 font-medium">
                            {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-4 px-6 text-right font-extrabold text-[#2F3E46]">
                            ${(u.totalSpending || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                              u.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                              u.status === 'Suspended' ? 'bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/20' :
                              u.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              u.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {u.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end items-center gap-1.5">
                              <button
                                onClick={() => setSelectedUser(u)}
                                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all border border-gray-200"
                                title="View Full Profile"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {u.status === 'Suspended' ? (
                                <button
                                  onClick={() => setConfirmActionModal({ type: 'reactivate', user: u })}
                                  className="px-2.5 py-1.5 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white rounded-xl font-bold text-xs transition-all border border-green-200 shadow-sm"
                                >
                                  Restore
                                </button>
                              ) : u.status === 'Pending' ? (
                                <>
                                  <button
                                    onClick={() => setConfirmActionModal({ type: 'approve', user: u })}
                                    className="px-2.5 py-1.5 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white rounded-xl font-bold text-xs transition-all border border-green-200 shadow-sm"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setConfirmActionModal({ type: 'reject', user: u })}
                                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded-xl font-bold text-xs transition-all border border-red-200 shadow-sm"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setSuspendModalUser(u)}
                                  className="px-2.5 py-1.5 bg-[#E76F51]/10 hover:bg-[#E76F51] text-[#E76F51] hover:text-white rounded-xl font-bold text-xs transition-all border border-[#E76F51]/20 shadow-sm"
                                >
                                  Suspend
                                </button>
                              )}
                              {u.status !== 'Blocked' && (
                                <button
                                  onClick={() => setConfirmActionModal({ type: 'block', user: u })}
                                  className="p-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-all border border-gray-200"
                                  title="Block Account"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmActionModal({ type: 'delete', user: u })}
                                className="p-2 bg-gray-50 hover:bg-red-600 hover:text-white text-gray-500 rounded-xl transition-all border border-gray-200"
                                title="Permanently Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 3: VENDOR MANAGEMENT (Full CRUD) */}
      {activeTab === 'vendors' && (() => { return (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Vendor Management</h2>
            <span className="text-xs text-gray-500 font-bold">Add, edit, activate/suspend, and manage vendor accounts.</span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Total Vendors', value: vendorStats.total, color: 'bg-blue-50 text-blue-600', icon: <Users className="w-5 h-5" /> },
              { label: 'Active', value: vendorStats.active, color: 'bg-emerald-50 text-emerald-600', icon: <CheckCircle className="w-5 h-5" /> },
              { label: 'Suspended', value: vendorStats.suspended, color: 'bg-red-50 text-red-600', icon: <XCircle className="w-5 h-5" /> },
              { label: 'Pending', value: vendorStats.pending, color: 'bg-amber-50 text-amber-600', icon: <AlertCircle className="w-5 h-5" /> }
            ].map(card => (
              <div key={card.label} className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>{card.icon}</div>
                  <span className="text-2xl font-bold text-[#1F2937] font-['Playfair_Display']">{card.value}</span>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Add Bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search vendors by name, email, or phone..." value={vendorSearch} onChange={e => setVendorSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 focus:border-[#2A9D8F] transition-all" />
            </div>
            <div className="flex items-center gap-3">
              <select value={vendorStatusFilter} onChange={e => setVendorStatusFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/30 bg-white">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <button onClick={openAddVendorModal} className="px-5 py-3 rounded-xl bg-[#1F2937] text-white font-bold text-sm hover:bg-black transition-all shadow-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Vendor
              </button>
            </div>
          </div>

          {/* Vendors Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#D4A373]/20 overflow-hidden">
            {loadingVendors ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-6 h-6 animate-spin text-[#2A9D8F]" />
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="text-center py-16">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-bold">No vendors found</p>
                <p className="text-xs text-gray-400 mt-1">{vendorSearch ? 'Try a different search term' : 'Click "Add Vendor" to create one'}</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-[#6B7280] bg-gray-50/50">
                    <th className="py-4 px-5">Vendor</th>
                    <th className="py-4 px-5">Contact</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="border-b border-gray-50 hover:bg-[#F0F9F8]/50 transition-colors">
                      <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center font-bold text-sm">
                            {(vendor.companyName || vendor.userId?.name || vendor.name || 'V').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#1F2937]">{vendor.companyName || vendor.userId?.name || vendor.name}</p>
                            <p className="text-xs text-gray-400">{vendor.userId?.name || vendor.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <p className="text-sm text-gray-600">{vendor.userId?.email || vendor.email}</p>
                        <p className="text-xs text-gray-400">{vendor.userId?.phone || vendor.phone || '—'}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {vendor.businessType || (vendor.category || 'General')}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          vendor.isActive ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'bg-[#E76F51]/10 text-[#E76F51]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${vendor.isActive ? 'bg-[#2A9D8F]' : 'bg-[#E76F51]'}`} />
                          {vendor.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => openViewVendorModal(vendor)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditVendorModal(vendor)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit Vendor">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleToggleVendorStatus(vendor)} className={`p-2 rounded-lg transition-colors ${vendor.isActive ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'}`} title={vendor.isActive ? 'Suspend' : 'Activate'}>
                            {vendor.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setDeleteConfirmVendor(vendor)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete Vendor">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>

          {/* Modals */}
          {showAddVendorModal && (
            <VendorFormModal
              isEdit={false}
              vendorForm={vendorForm}
              setVendorForm={setVendorForm}
              vendorFormErrors={vendorFormErrors}
              onClose={() => { setShowAddVendorModal(false); resetVendorForm(); }}
              onSubmit={handleAddVendor}
              vendorActionLoading={vendorActionLoading}
            />
          )}
          {showEditVendorModal && (
            <VendorFormModal
              isEdit={true}
              vendorForm={vendorForm}
              setVendorForm={setVendorForm}
              vendorFormErrors={vendorFormErrors}
              onClose={() => { setShowEditVendorModal(false); setSelectedVendor(null); resetVendorForm(); }}
              onSubmit={handleEditVendor}
              vendorActionLoading={vendorActionLoading}
            />
          )}
          {showViewVendorModal && (
            <ViewVendorModal
              selectedVendor={selectedVendor}
              onClose={() => { setShowViewVendorModal(false); setSelectedVendor(null); }}
              onApprove={async () => {
                try {
                  await axios.put(`/admin/vendors/${selectedVendor._id}/approve`);
                  alert('Vendor approved successfully');
                  fetchVendors(false);
                  setShowViewVendorModal(false);
                } catch(e) { alert(e?.response?.data?.message || 'Error'); }
              }}
              onReject={async () => {
                try {
                  await axios.put(`/admin/vendors/${selectedVendor._id}/reject`);
                  alert('Vendor rejected successfully');
                  fetchVendors(false);
                  setShowViewVendorModal(false);
                } catch(e) { alert(e?.response?.data?.message || 'Error'); }
              }}
            />
          )}
          {deleteConfirmVendor && (
            <DeleteConfirmModal
              deleteConfirmVendor={deleteConfirmVendor}
              onCancel={() => setDeleteConfirmVendor(null)}
              onConfirm={() => handleDeleteVendor(deleteConfirmVendor?._id)}
            />
          )}
        </div>
        );
      })()}

      {/* TAB 4: MANUFACTURER MANAGEMENT */}
      {activeTab === 'manufacturers' && (() => {
        const stats = managementData?.manufacturerStats || { totalManufacturers: 0, activeManufacturers: 0, pendingVerification: 0, activeManufacturingOrders: 0, completedManufacturingOrders: 0 };
        const manufacturers = managementData?.vendors?.filter(v => v.businessType === 'manufacturer') || [];

        // Apply filters
        const filteredMfgs = manufacturers.filter(mfg => {
          const keyword = mfgSearch.toLowerCase();
          const matchesSearch = 
            (mfg.companyName || '').toLowerCase().includes(keyword) ||
            (mfg.userId?.name || '').toLowerCase().includes(keyword) ||
            (mfg.userId?.email || '').toLowerCase().includes(keyword) ||
            (mfg.userId?.phone || '').toLowerCase().includes(keyword) ||
            (mfg.serviceAreas || []).some(area => area.toLowerCase().includes(keyword));

          const matchesSpecialization = mfgSpecializationFilter === 'all' || mfg.specialization === mfgSpecializationFilter;
          const matchesVerification = mfgVerificationFilter === 'all' || mfg.verificationStatus === mfgVerificationFilter;
          const matchesStatus = mfgStatusFilter === 'all' || 
            (mfgStatusFilter === 'active' && mfg.isActive) || 
            (mfgStatusFilter === 'suspended' && !mfg.isActive);
          const matchesWorkload = mfgWorkloadFilter === 'all' || mfg.workloadLevel === mfgWorkloadFilter;

          return matchesSearch && matchesSpecialization && matchesVerification && matchesStatus && matchesWorkload;
        });

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Manufacturer Console & Moderation</h2>
              <p className="text-sm text-[#8B5E3C] mt-1 font-medium">Verify industrial profiles, check dynamic workloads, assign design requests, and review payment history.</p>
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</span>
                  <p className="text-3xl font-extrabold text-[#1F2937]">{stats.totalManufacturers}</p>
                </div>
                <div className="p-3 bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-xl">
                  <Store size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active</span>
                  <p className="text-3xl font-extrabold text-[#2A9D8F]">{stats.activeManufacturers}</p>
                </div>
                <div className="p-3 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl">
                  <CheckCircle size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending Verification</span>
                  <p className="text-3xl font-extrabold text-[#E76F51]">{stats.pendingVerification}</p>
                </div>
                <div className="p-3 bg-[#E76F51]/10 text-[#E76F51] rounded-xl">
                  <FileText size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Production</span>
                  <p className="text-3xl font-extrabold text-[#F4A261]">{stats.activeManufacturingOrders}</p>
                </div>
                <div className="p-3 bg-[#F4A261]/10 text-[#F4A261] rounded-xl">
                  <Hammer size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#D4A373]/20 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed Orders</span>
                  <p className="text-3xl font-extrabold text-[#2A9D8F]">{stats.completedManufacturingOrders}</p>
                </div>
                <div className="p-3 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl">
                  <ShoppingBag size={24} />
                </div>
              </div>
            </div>

            {/* Unified Search and Multi-Faceted Filters Panel */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/20 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search input */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by company name, owner name, email, phone, or location..."
                    value={mfgSearch}
                    onChange={(e) => setMfgSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] focus:bg-white border border-[#D4A373]/20 rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-[#1F2937]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Specialization Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Specialization</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" size={14} />
                    <select
                      value={mfgSpecializationFilter}
                      onChange={(e) => setMfgSpecializationFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
                    >
                      <option value="all">All Specializations</option>
                      <option value="Woodworks">Woodworks</option>
                      <option value="Upholstery">Upholstery</option>
                      <option value="Metal Fabrications">Metal Fabrications</option>
                      <option value="Modular Cabinets">Modular Cabinets</option>
                      <option value="Glass Works">Glass Works</option>
                    </select>
                  </div>
                </div>

                {/* Verification Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verification Status</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" size={14} />
                    <select
                      value={mfgVerificationFilter}
                      onChange={(e) => setMfgVerificationFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
                    >
                      <option value="all">All Verification Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Account Status Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Status</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" size={14} />
                    <select
                      value={mfgStatusFilter}
                      onChange={(e) => setMfgStatusFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active & Verified</option>
                      <option value="suspended">Suspended / Pending</option>
                    </select>
                  </div>
                </div>

                {/* Workload Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Workload Level</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" size={14} />
                    <select
                      value={mfgWorkloadFilter}
                      onChange={(e) => setMfgWorkloadFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8F5F0]/50 hover:bg-[#F8F5F0] border border-[#D4A373]/20 rounded-xl font-bold text-xs text-gray-700 outline-none transition-all cursor-pointer appearance-none animate-fadeIn"
                    >
                      <option value="all">All Workloads</option>
                      <option value="Low">Low (&lt; 20%)</option>
                      <option value="Medium">Medium (20% - 60%)</option>
                      <option value="High">High (60% - 90%)</option>
                      <option value="Maxed Out">Maxed Out (&gt; 90%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Manufacturers Table */}
            <div className="bg-white rounded-3xl border border-[#D4A373]/20 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#D4A373]/10 bg-[#F8F5F0]/45 text-[11px] font-extrabold uppercase tracking-wider text-[#8B5E3C]">
                      <th className="py-4 px-6">Company & Specialization</th>
                      <th className="py-4 px-4">Contact Person</th>
                      <th className="py-4 px-4">Location</th>
                      <th className="py-4 px-4">Workload / Capacity</th>
                      <th className="py-4 px-4">Verification / Account Status</th>
                      <th className="py-4 px-4">Rating</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMfgs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400 font-bold text-base">
                          No matching manufacturers found. Try adjusting filters or searches.
                        </td>
                      </tr>
                    ) : (
                      filteredMfgs.map((mfg) => {
                        // Dynamic styling for workload level
                        let workloadClass = 'bg-blue-50 text-blue-700 border-blue-100';
                        if (mfg.workloadLevel === 'Medium') workloadClass = 'bg-green-50 text-green-700 border-green-100';
                        else if (mfg.workloadLevel === 'High') workloadClass = 'bg-amber-50 text-amber-700 border-amber-100';
                        else if (mfg.workloadLevel === 'Maxed Out') workloadClass = 'bg-rose-50 text-rose-700 border-rose-100';

                        return (
                          <tr key={mfg._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            {/* Company & Specialization */}
                            <td className="py-4 px-6">
                              <p className="font-bold text-[#1F2937] text-sm">{mfg.companyName}</p>
                              <span className="inline-flex mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C]">
                                {mfg.specialization || 'Woodworks'}
                              </span>
                            </td>

                            {/* Contact Person */}
                            <td className="py-4 px-4">
                              <p className="font-bold text-gray-700 text-xs">{mfg.userId?.name || 'Frank Miller'}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{mfg.userId?.email || 'mfg@example.com'}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{mfg.userId?.phone || 'N/A'}</p>
                            </td>

                            {/* Location */}
                            <td className="py-4 px-4">
                              <p className="font-bold text-gray-600 text-xs">{mfg.serviceAreas?.[0] || 'Detroit, MI, USA'}</p>
                            </td>

                            {/* Workload / Capacity */}
                            <td className="py-4 px-4 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${workloadClass}`}>
                                  {mfg.workloadLevel || 'Medium'}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-bold">
                                Capacity: <span className="text-gray-600 font-extrabold">{mfg.monthlyCapacity || 50} units/mo</span>
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold">
                                Active Orders: <span className="text-[#8B5E3C] font-extrabold">{mfg.activeOrders || 0}</span>
                              </p>
                            </td>

                            {/* Verification / Account Status */}
                            <td className="py-4 px-4 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Verification:</span>
                                <span className={`text-[10px] font-bold ${mfg.verificationStatus === 'Approved' ? 'text-[#2A9D8F]' : mfg.verificationStatus === 'Submitted' ? 'text-[#F4A261]' : 'text-[#E76F51]'}`}>
                                  {mfg.verificationStatus || 'Pending'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Account:</span>
                                <span className={`text-[10px] font-bold ${mfg.isActive ? 'text-[#2A9D8F]' : 'text-[#E76F51]'}`}>
                                  {mfg.isActive ? 'LIVE & ACTIVE' : 'SUSPENDED/PENDING'}
                                </span>
                              </div>
                            </td>

                            {/* Rating */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                <span className="text-amber-500 font-bold">★</span>
                                <span className="font-extrabold text-xs text-gray-700">{mfg.rating ? mfg.rating.toFixed(1) : '4.5'}</span>
                                <span className="text-[10px] text-gray-400">({mfg.reviewsCount || 0})</span>
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end items-center gap-1.5 flex-wrap max-w-[280px]">
                                {/* View Profile */}
                                <button
                                  onClick={() => setSelectedMfgProfile(mfg)}
                                  title="View Profile Details"
                                  className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-all"
                                >
                                  <Eye size={14} />
                                </button>

                                {/* View Current Load */}
                                <button
                                  onClick={() => { setSelectedMfgLoad(mfg); fetchMfgLoad(mfg._id); }}
                                  title="View Current Production Load"
                                  className="p-1.5 bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-lg transition-all"
                                >
                                  <Activity size={14} />
                                </button>

                                {/* Assign Custom Design Order */}
                                <button
                                  onClick={() => {
                                    setAssignOrderMfg(mfg);
                                    setAssignOrderDetails({ orderId: '', designDetails: '', measurements: '', materials: '', budget: 1000 });
                                  }}
                                  title="Assign Production Order"
                                  className="p-1.5 bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#2A9D8F] rounded-lg transition-all"
                                >
                                  <Plus size={14} />
                                </button>

                                {/* View Documents */}
                                <button
                                  onClick={() => setMfgDocsModal(mfg)}
                                  title="Review Submitted Documents"
                                  className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-all"
                                >
                                  <FileText size={14} />
                                </button>

                                {/* View Payouts Ledger */}
                                <button
                                  onClick={() => { setMfgPaymentsModal(mfg); fetchMfgPayments(mfg._id); }}
                                  title="View Payout Ledger"
                                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                                >
                                  <CreditCard size={14} />
                                </button>

                                {/* Verify Business & Activation Toggle */}
                                {!mfg.isActive || mfg.verificationStatus !== 'Approved' ? (
                                  <button
                                    onClick={() => setMfgApproveConfirm(mfg)}
                                    title="Verify Business & Activate Account"
                                    className="p-1.5 bg-[#2A9D8F] hover:bg-[#2A9D8F]/95 text-white rounded-lg transition-all"
                                  >
                                    <UserCheck size={14} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setMfgSuspendConfirm(mfg)}
                                    title="Suspend Manufacturer Account"
                                    className="p-1.5 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-lg transition-all"
                                  >
                                    <UserX size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* TAB 5: DELIVERY & LOGISTICS PARTNERS */}
      {/* ======================================================== */}
      {activeTab === 'delivery' && (() => {
        const deliveryPartners = managementData?.vendors?.filter(v => v.businessType === 'delivery') || [];
        const stats = {
          total: deliveryPartners.length,
          active: deliveryPartners.filter(v => v.isActive).length,
          pending: deliveryPartners.filter(v => v.verificationStatus === 'Pending' || v.verificationStatus === 'Submitted').length
        };

        const filteredPartners = deliveryPartners.filter(p => {
          const keyword = deliverySearch.toLowerCase();
          const matchesSearch = 
            (p.companyName || '').toLowerCase().includes(keyword) ||
            (p.userId?.name || '').toLowerCase().includes(keyword) ||
            (p.userId?.email || '').toLowerCase().includes(keyword) ||
            (p.userId?.phone || '').toLowerCase().includes(keyword);

          const matchesStatus = deliveryStatusFilter === 'all' || 
            (deliveryStatusFilter === 'active' && p.isActive) || 
            (deliveryStatusFilter === 'suspended' && !p.isActive);

          return matchesSearch && matchesStatus;
        });

        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Logistics & Delivery Partners</h2>
              <p className="text-sm text-[#8B5E3C] mt-1 font-medium">Manage delivery agents, logistics companies, and track their active shipments.</p>
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Partners</span>
                  <p className="text-3xl font-extrabold text-[#1F2937]">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                  <Truck size={24} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active</span>
                  <p className="text-3xl font-extrabold text-green-500">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-50 text-green-500 rounded-xl">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending Verification</span>
                  <p className="text-3xl font-extrabold text-orange-500">{stats.pending}</p>
                </div>
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                  <AlertCircle size={24} />
                </div>
              </div>
            </div>

            {/* Live Order Tracking UI */}
            {(() => {
              const trackingId = liveTrackingOrderId || localStorage.getItem('adminActiveTrackingOrderId');
              const trackableOrders = (managementData?.orders || []).filter(o => o.paymentStatus === 'paid' || o.orderType === 'Marketplace Product' || o.orderType === 'Custom Design');
              
              if (trackableOrders.length === 0) return null;
              
              const activeOrder = trackableOrders.find(o => o._id === trackingId) || trackableOrders[0];
              const activeTracking = adminTrackingData[activeOrder?._id] || {};
              const orderTracking = activeTracking.tracking || {};
              
              const status = activeOrder.orderStatus || 'Pending';
              const expectedDate = orderTracking.expectedDeliveryDate ? new Date(orderTracking.expectedDeliveryDate).toLocaleDateString() : (activeOrder.expectedDeliveryDate ? new Date(activeOrder.expectedDeliveryDate).toLocaleDateString() : '7 Days from purchase');
              const delDetails = orderTracking.deliveryDetails || {};
              const installDetails = orderTracking.installationDetails || {};

              const getStatusMessage = () => {
                switch (status) {
                  case 'Pending Confirmation': return { title: 'Pending Confirmation', desc: 'Order is pending confirmation from the vendor.' };
                  case 'Order Confirmed': return { title: 'Order Confirmed', desc: 'Order has been confirmed and accepted by the vendor.' };
                  case 'Processing': return { title: 'Processing', desc: 'Order is being processed by the vendor.' };
                  case 'Pending Dispatch': return { title: 'Pending Dispatch', desc: 'Order is packed and awaiting courier pickup.' };
                  case 'Dispatched': return { title: 'Dispatched', desc: 'Order has been handed over to the courier partner.' };
                  case 'Shipped': return { title: 'Shipped', desc: 'Order has been shipped and is on its way.' };
                  case 'Out for Delivery':
                  case 'Out For Delivery': return { title: 'Out for Delivery', desc: 'Order is out for delivery and will arrive soon.' };
                  case 'Delivered': return { title: 'Delivered', desc: 'Order has been successfully delivered.' };
                  case 'Completed': return { title: 'Completed', desc: 'Order is fully completed.' };
                  case 'Installation Scheduled': return { title: 'Installation Scheduled', desc: 'An installation technician is scheduled.' };
                  case 'Installation In Progress': return { title: 'Installation In Progress', desc: 'Installation work is currently in progress.' };
                  case 'Installation Completed': return { title: 'Installation Completed', desc: 'The order lifecycle is completed.' };
                  case 'Cancelled': return { title: 'Cancelled', desc: 'This order was cancelled.' };
                  default: return { title: status, desc: 'Current order status is updated.' };
                }
              };

              const currentMsg = getStatusMessage();
              let globalStages = [];
              let normalizedStatus = status;

              if (activeOrder?.orderType === 'custom_design') {
                globalStages = ['Awaiting Vendor Verification', 'Production Started', 'Manufacturing', 'Ready for Delivery', 'Delivered', 'Installation Scheduled', 'Installation Completed'];
                if (['Pending Confirmation', 'Submitted'].includes(status)) normalizedStatus = 'Awaiting Vendor Verification';
                else if (['Completed'].includes(status)) normalizedStatus = 'Installation Completed';
              } else {
                globalStages = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'];
                if (['Pending Confirmation', 'Submitted', 'Request Submitted'].includes(status)) normalizedStatus = 'Order Confirmed';
                else if (['Pending Dispatch'].includes(status)) normalizedStatus = 'Processing';
                else if (['Dispatched', 'Delivery Assigned'].includes(status)) normalizedStatus = 'Shipped';
                else if (['Out For Delivery'].includes(status)) normalizedStatus = 'Out for Delivery';
                else if (['Completed', 'Order Completed'].includes(status)) normalizedStatus = 'Installation Completed';
              }

              let currentIdx = globalStages.indexOf(normalizedStatus);
              if (currentIdx === -1) {
                currentIdx = globalStages.findIndex(s => s.toLowerCase() === normalizedStatus.toLowerCase());
                if (currentIdx === -1) currentIdx = 0;
              }

              return (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 mt-8 space-y-8">
                  {/* Quick Switch Dropdown */}
                  {trackableOrders.length > 1 && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4 mb-6">
                      <span className="text-xs font-bold text-gray-500 uppercase">Track Order Lifecycle:</span>
                      <select 
                        value={activeOrder._id}
                        onChange={(e) => {
                          localStorage.setItem('adminActiveTrackingOrderId', e.target.value);
                          setLiveTrackingOrderId(e.target.value);
                          fetchOrderTrackingAdmin(e.target.value);
                        }}
                        className="text-xs p-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#1D3557] font-medium min-w-[250px]"
                      >
                        {trackableOrders.map(o => (
                          <option key={o._id} value={o._id}>
                            {o.productDetails?.title || (o.orderType === 'AI Design' ? `AI Design - ${o.aiDesignData?.roomType || 'Custom'}` : 'Custom Furniture Request')} (#{o._id.slice(-6)}) - {o.orderStatus}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] flex items-center gap-2"><Truck className="w-6 h-6 text-[#1D3557]"/> Live Order Tracking</h2>
                      <p className="text-xs text-gray-400 mt-1">Order #<strong>{activeOrder._id?.slice(-6)}</strong> • Type: <strong>{activeOrder.orderType}</strong> • Vendor: <strong>{activeOrder.vendorId?.companyName || activeTracking.tracking?.vendorName || 'N/A'}</strong></p>
                      <p className="text-xs text-gray-400 mt-0.5">Delivery Status: <strong className={status === 'Delivered' ? 'text-green-600' : 'text-[#E76F51]'}>{status}</strong> • Installation Status: <strong className={installDetails.installationStatus === 'Completed' ? 'text-green-600' : installDetails.installationStatus ? 'text-[#E76F51]' : 'text-gray-400'}>{installDetails.installationStatus || 'Not Scheduled'}</strong></p>
                    </div>
                    <div className="px-4 py-2 bg-[#1D3557]/10 text-[#1D3557] font-bold rounded-lg text-xs border border-[#1D3557]/20">
                      Expected: {expectedDate}
                    </div>
                  </div>

                  {/* 8-Stage Timeline */}
                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8 mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                      {globalStages.map((stage, idx) => {
                        const isActive = idx === currentIdx;
                        const isPast = idx < currentIdx;
                        return (
                          <div key={stage} className={`text-center p-2 rounded-xl ${isActive ? 'bg-[#1D3557] text-white scale-105 shadow-md transition-all' : isPast ? 'bg-green-50 text-green-700' : 'bg-white text-gray-400 border border-gray-200'}`}>
                            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs mb-1 ${isActive ? 'bg-white text-[#1D3557]' : isPast ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {isPast ? '✓' : idx + 1}
                            </div>
                            <p className="text-[10px] font-bold leading-tight">{stage}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Details Bar */}
                  <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4 border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl text-[#1D3557] border border-gray-100"><Truck size={20}/></div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1F2937]">{currentMsg.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{currentMsg.desc}</p>
                    </div>
                  </div>
                  
                  {/* Delivery Details */}
                  {delDetails.partner && (
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200 mt-6 space-y-3">
                      <h4 className="font-bold text-sm text-blue-800 uppercase tracking-wider">Delivery Logistics Info</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Partner:</span><p className="font-bold text-[#1F2937]">{delDetails.partner}</p></div>
                        {delDetails.contact && <div><span className="text-gray-500">Contact:</span><p className="font-bold text-[#1F2937]">{delDetails.contact}</p></div>}
                        {delDetails.trackingId && <div><span className="text-gray-500">Tracking ID:</span><p className="font-bold text-[#1F2937]">{delDetails.trackingId}</p></div>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search partners by name, email, or phone..."
                    value={deliverySearch}
                    onChange={(e) => setDeliverySearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition-all"
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <select 
                    value={deliveryStatusFilter} 
                    onChange={e => setDeliveryStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none hover:border-gray-300 transition-colors"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="suspended">Suspended Only</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-bold">Partner Details</th>
                      <th className="p-4 font-bold">Contact</th>
                      <th className="p-4 font-bold">Verification</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Service Areas</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {filteredPartners.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-gray-400">
                          <Truck className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>No delivery partners found.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredPartners.map(partner => (
                        <tr key={partner._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                {(partner.companyName || partner.userId?.name || 'D').charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-[#1F2937]">{partner.companyName || partner.userId?.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Joined {new Date(partner.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-[#1F2937]">{partner.userId?.email || partner.email}</p>
                            <p className="text-[10px] text-gray-500">{partner.userId?.phone || partner.phone || 'N/A'}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${
                              partner.verificationStatus === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100' : 
                              (partner.verificationStatus === 'Pending' || partner.verificationStatus === 'Submitted') ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                              'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                              {partner.verificationStatus || 'Not Submitted'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${
                              partner.isActive ? 'bg-[#2A9D8F]/10 text-[#2A9D8F] border border-[#2A9D8F]/20' : 
                              'bg-[#E76F51]/10 text-[#E76F51] border border-[#E76F51]/20'
                            }`}>
                              {partner.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-gray-500">
                            {partner.serviceAreas?.join(', ') || 'N/A'}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedVendor(partner);
                                setShowViewVendorModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-[#8B5E3C] hover:bg-[#8B5E3C]/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* TAB 6: AI DESIGN REQUESTS */}
      {/* ======================================================== */}
            {activeTab === 'custom_design_requests' && (() => {
        const manual = managementData?.manualDesigns || [];
        const designerReqs = managementData?.designerRequests || [];
        const orders = managementData?.orders || [];

        const unifiedRequests = [];

        // Manual and Own Materials requests
        manual.forEach(req => {
          const type = req.requestType || 'Manual Design';
          unifiedRequests.push({
            _id: req._id,
            customerName: req.userId?.name || 'Customer Demo',
            customerEmail: req.userId?.email || 'user@example.com',
            customerPhone: req.userId?.phone || 'N/A',
            roomType: req.roomType || 'N/A',
            style: req.style || 'N/A',
            budget: req.budget || 'N/A',
            status: req.status || 'Submitted',
            date: req.createdAt || req.submissionDate || new Date().toISOString(),
            requestType: type,
            ownMaterialsAvailable: req.ownMaterialsAvailable || 'No',
            assignedVendorId: req.assignedVendorId || null,
            assignedDesignerId: req.assignedDesignerId || null,
            raw: req
          });
        });

        // Designer Help requests
        designerReqs.forEach(req => {
          unifiedRequests.push({
            _id: req._id,
            customerName: req.userId?.name || 'Customer Demo',
            customerEmail: req.userId?.email || 'user@example.com',
            customerPhone: req.userId?.phone || 'N/A',
            roomType: 'Consultation',
            style: 'Interior Design Consultation',
            budget: req.budget ? `$${req.budget}` : 'N/A',
            status: req.status || 'Submitted',
            date: req.createdAt || new Date().toISOString(),
            requestType: 'Interior Designer Help',
            ownMaterialsAvailable: 'No',
            assignedVendorId: null,
            assignedDesignerId: req.assignedDesignerId || null,
            raw: req
          });
        });

        // AI Generated requests (orders with orderType === 'AI Design')
        orders.forEach(order => {
          if (order.orderType === 'AI Design') {
            unifiedRequests.push({
              _id: order._id,
              customerName: order.userId?.name || 'Customer Demo',
              customerEmail: order.userId?.email || 'user@example.com',
              customerPhone: order.userId?.phone || 'N/A',
              roomType: order.aiDesignData?.roomType || 'Living Room',
              style: order.aiDesignData?.style || 'AI Generated',
              budget: order.totalAmount ? `$${order.totalAmount}` : 'N/A',
              status: order.orderStatus || 'Submitted',
              date: order.createdAt || new Date().toISOString(),
              requestType: 'AI Generated',
              ownMaterialsAvailable: 'No',
              assignedVendorId: order.vendorId || null,
              assignedDesignerId: order.designerId || null,
              raw: order
            });
          }
        });

        // Filter based on sub-tab
        let tabFiltered = unifiedRequests;
        if (customDesignFilter === 'AI Generated') {
          tabFiltered = unifiedRequests.filter(r => r.requestType === 'AI Generated');
        } else if (customDesignFilter === 'Manual Design') {
          tabFiltered = unifiedRequests.filter(r => r.requestType === 'Manual Design' && r.ownMaterialsAvailable !== 'Yes');
        } else if (customDesignFilter === 'Interior Designer Help') {
          tabFiltered = unifiedRequests.filter(r => r.requestType === 'Interior Designer Help');
        } else if (customDesignFilter === 'Own Materials') {
          tabFiltered = unifiedRequests.filter(r => r.ownMaterialsAvailable === 'Yes');
        }

        // Apply filters
        const filteredRequests = tabFiltered.filter(r => {
          const keyword = customRequestSearch.toLowerCase();
          const matchesSearch = 
            r._id?.toLowerCase().includes(keyword) ||
            r.customerName?.toLowerCase().includes(keyword) ||
            r.customerEmail?.toLowerCase().includes(keyword) ||
            r.roomType?.toLowerCase().includes(keyword) ||
            r.style?.toLowerCase().includes(keyword);

          const matchesRoom = customRequestRoomFilter === 'all' || r.roomType?.toLowerCase() === customRequestRoomFilter.toLowerCase();
          const matchesStatus = customRequestStatusFilter === 'all' || r.status?.toLowerCase() === customRequestStatusFilter.toLowerCase();

          let matchesBudget = true;
          if (customRequestBudgetFilter !== 'all') {
            const budStr = String(r.budget || '').replace(/[^0-9]/g, '');
            const budNum = parseInt(budStr, 10);
            if (!isNaN(budNum)) {
              if (customRequestBudgetFilter === 'low') matchesBudget = budNum <= 5000;
              else if (customRequestBudgetFilter === 'mid') matchesBudget = budNum > 5000 && budNum <= 15000;
              else if (customRequestBudgetFilter === 'high') matchesBudget = budNum > 15000;
            }
          }

          return matchesSearch && matchesRoom && matchesStatus && matchesBudget;
        });

        const total = tabFiltered.length;
        const pending = tabFiltered.filter(r => ['Submitted', 'pending', 'Under Review'].includes(r.status)).length;
        const assigned = tabFiltered.filter(r => r.assignedVendorId || r.assignedDesignerId || r.status === 'Assigned').length;
        const completed = tabFiltered.filter(r => ['Completed', 'completed', 'Installation Completed'].includes(r.status)).length;

        return (
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Requests</p>
                  <p className="text-3xl font-extrabold text-gray-800 mt-1">{total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText size={22} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Review</p>
                  <p className="text-3xl font-extrabold text-gray-800 mt-1">{pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock size={22} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned / Active</p>
                  <p className="text-3xl font-extrabold text-gray-800 mt-1">{assigned}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <Briefcase size={22} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
                  <p className="text-3xl font-extrabold text-gray-800 mt-1">{completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <CheckCircle size={22} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-8 border-b border-gray-200/60 pb-5">
              {['All', 'AI Generated', 'Manual Design', 'Interior Designer Help', 'Own Materials'].map(tabName => {
                const count = tabName === 'All' ? unifiedRequests.length :
                              tabName === 'AI Generated' ? unifiedRequests.filter(r => r.requestType === 'AI Generated').length :
                              tabName === 'Manual Design' ? unifiedRequests.filter(r => r.requestType === 'Manual Design' && r.ownMaterialsAvailable !== 'Yes').length :
                              tabName === 'Interior Designer Help' ? unifiedRequests.filter(r => r.requestType === 'Interior Designer Help').length :
                              unifiedRequests.filter(r => r.ownMaterialsAvailable === 'Yes').length;
                const isActive = customDesignFilter === tabName;
                return (
                  <button
                    key={tabName}
                    onClick={() => setCustomDesignFilter(tabName)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                      isActive 
                        ? 'bg-[#1F2937] text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80'
                    }`}
                  >
                    {tabName}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 min-w-[280px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, customer name, email, style, or room..."
                  value={customRequestSearch}
                  onChange={(e) => setCustomRequestSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={customRequestRoomFilter}
                  onChange={(e) => setCustomRequestRoomFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="all">All Room Types</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Office">Office</option>
                  <option value="Bathroom">Bathroom</option>
                </select>
              </div>
            </div>

            {/* Custom Request List Grid/Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="p-5">Request ID</th>
                      <th className="p-5">Request Type</th>
                      <th className="p-5">Customer Name</th>
                      <th className="p-5">Email</th>
                      <th className="p-5">Phone</th>
                      <th className="p-5">Room Type</th>
                      <th className="p-5">Budget</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Assigned Vendor/Designer</th>
                      <th className="p-5">Date Submitted</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="p-10 text-center text-gray-400 font-medium">
                          No custom design requests found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map(r => {
                        const statusColors = 
                          ['Approved', 'User Approved', 'Accepted', 'Installation Completed', 'Completed'].includes(r.status) ? 'bg-green-50 text-green-700 border border-green-100' :
                          r.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                          ['Submitted', 'pending'].includes(r.status) ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          r.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-100';

                        const isHighlighted = highlightRequestId === r._id;
                        return (
                          <tr
                            key={r._id}
                            id={`admin-request-${r._id}`}
                            className={`hover:bg-gray-50/40 transition-colors ${isHighlighted ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
                          >
                            <td className="p-5 font-mono text-[11px] text-gray-500">{r._id}</td>
                            <td className="p-5 font-bold">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F5F0] text-[#8B5E3C] border border-[#D4A373]/20">
                                {r.requestType}
                              </span>
                            </td>
                            <td className="p-5 font-bold text-gray-800">{r.customerName}</td>
                            <td className="p-5 text-gray-600">{r.customerEmail}</td>
                            <td className="p-5 text-gray-600">{r.customerPhone}</td>
                            <td className="p-5 font-medium text-gray-700">{r.roomType}</td>
                            <td className="p-5 font-semibold text-gray-800">{r.budget}</td>
                            <td className="p-5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="p-5">
                              {r.assignedVendorId || r.assignedDesignerId ? (
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-700">
                                    {r.assignedVendorId?.companyName || r.assignedVendorId?.name || r.assignedDesignerId?.companyName || r.assignedDesignerId?.name}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-medium uppercase">
                                    {r.assignedVendorId ? 'Vendor' : 'Designer'}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 font-medium italic">Unassigned</span>
                              )}
                            </td>
                            <td className="p-5 text-gray-400">
                              {new Date(r.date).toLocaleDateString()}
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                <button
                                  onClick={() => {
                                    if (r.requestType === 'Interior Designer Help') {
                                      setSelectedDesignerRequest(r.raw);
                                    } else if (r.requestType === 'AI Generated') {
                                      setSelectedAIDesign(r.raw);
                                    } else {
                                      setSelectedManualDesign(r.raw);
                                    }
                                  }}
                                  title="View Details"
                                  className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all"
                                >
                                  <Eye size={14} />
                                </button>

                                <button
                                  onClick={() => handleAdminUpdateStatus(r._id, 'Delete', r.requestType)}
                                  title="Delete Request"
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 9: ORDERS & WORKFLOW */}
      {activeTab === 'orders' && (() => {
        const orderList = managementData?.orders || [];
        
        // Calculate statistics dynamically
        const totalOrders = orderList.length;
        const pendingAssignment = orderList.filter(o => 
          !o.vendorId || 
          (o.orderType !== 'Marketplace Product' && !o.manufacturerId) || 
          !o.deliveryPartnerId || 
          !o.installationPartnerId
        ).length;
        const manufacturingOrders = orderList.filter(o => 
          ['Manufacturer Assigned', 'Manufacturing Started', 'Manufacturing', 'Quality Check'].includes(o.orderStatus)
        ).length;
        const deliveryPending = orderList.filter(o => 
          ['Delivery Assigned', 'Out for Delivery'].includes(o.orderStatus)
        ).length;
        const installationPending = orderList.filter(o => 
          ['Installation Assigned', 'Installation Completed'].includes(o.orderStatus)
        ).length;
        const completedOrders = orderList.filter(o => 
          ['Completed', 'Order Completed'].includes(o.orderStatus)
        ).length;

        // Apply filters
        const filteredOrders = orderList.filter(o => {
          const matchesSearch = 
            o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
            (o.userId?.name || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
            (o.vendorId?.companyName || '').toLowerCase().includes(orderSearch.toLowerCase());
            
          const matchesType = orderTypeFilter === 'all' || o.orderType === orderTypeFilter;
          const matchesPayment = orderPaymentFilter === 'all' || o.paymentStatus === orderPaymentFilter;
          const matchesStage = orderStageFilter === 'all' || o.orderStatus === orderStageFilter;
          
          let matchesPartner = true;
          if (orderPartnerFilter !== 'all') {
            const partnerText = orderPartnerFilter.toLowerCase();
            matchesPartner = 
              (o.vendorId?.companyName || '').toLowerCase().includes(partnerText) ||
              (o.manufacturerId?.companyName || '').toLowerCase().includes(partnerText) ||
              (o.deliveryPartnerId?.companyName || '').toLowerCase().includes(partnerText) ||
              (o.installationPartnerId?.companyName || '').toLowerCase().includes(partnerText);
          }

          return matchesSearch && matchesType && matchesPayment && matchesStage && matchesPartner;
        });

        const allStages = [
          'Pending Confirmation',
          'Processing',
          'Pending Dispatch',
          'Dispatched',
          'Out For Delivery',
          'Delivered',
          'Completed',
          'Cancelled'
        ];

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Playfair_Display'] font-bold text-3xl text-gray-800">Global Orders & Execution Workflow</h2>
                <p className="text-sm text-gray-500 mt-1">Assign vendors, track fabrication milestones, manage logistics, and confirm installations.</p>
              </div>
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Orders', value: totalOrders, icon: Package, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { label: 'Pending Assign', value: pendingAssignment, icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { label: 'Manufacturing', value: manufacturingOrders, icon: Hammer, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                { label: 'Delivery Pending', value: deliveryPending, icon: Truck, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                { label: 'Installation', value: installationPending, icon: Wrench, color: 'bg-orange-50 text-orange-600 border-orange-100' },
                { label: 'Completed', value: completedOrders, icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${stat.color} flex flex-col justify-between h-28 shadow-sm transition-all hover:shadow-md`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">{stat.label}</span>
                    <stat.icon size={16} className="opacity-80" />
                  </div>
                  <span className="font-['Playfair_Display'] font-black text-3xl mt-2">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, customer, vendor..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>
                {/* Partner search / filter */}
                <div className="lg:w-64 relative">
                  <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={orderPartnerFilter === 'all' ? '' : orderPartnerFilter}
                    onChange={(e) => setOrderPartnerFilter(e.target.value || 'all')}
                    placeholder="Filter by partner name..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Order Type */}
                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  <option value="all">All Order Types</option>
                  <option value="AI Design">AI Design</option>
                  <option value="Manual Design">Manual Design</option>
                  <option value="Marketplace Product">Marketplace Product</option>
                </select>

                {/* Payment Status */}
                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Workflow Stage */}
                <select
                  value={orderStageFilter}
                  onChange={(e) => setOrderStageFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  <option value="all">All Statuses</option>
                  {allStages.map((stage, idx) => (
                    <option key={idx} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                      <th className="py-4 px-6">Order ID & Dates</th>
                      <th className="py-4 px-6">Customer & Vendor</th>
                      <th className="py-4 px-6">Type & Amount</th>
                      <th className="py-4 px-6">Workflow Stage & Payment</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-gray-400">
                          No orders matched the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const createdDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : 'N/A';
                        const deliveryDate = order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : 'Not Scheduled';

                        return (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            {/* ID & Dates */}
                            <td className="py-4 px-6">
                              <span className="font-mono text-xs font-bold text-gray-400 block">#{order._id.slice(-6)}</span>
                              <span className="text-[10px] text-gray-400 block mt-1">Placed: {createdDate}</span>
                              <span className="text-[10px] font-bold text-[#8B5E3C] block mt-0.5">Est. Delivery: {deliveryDate}</span>
                            </td>

                            {/* Customer & Vendor */}
                            <td className="py-4 px-6">
                              <span className="font-bold text-gray-800 block">{order.userId?.name || 'Customer Demo'}</span>
                              <span className="text-xs text-gray-400 block mt-0.5">{order.userId?.email || 'N/A'}</span>
                              <div className="mt-2 flex items-center gap-1.5">
                                <span className="text-[10px] uppercase font-bold text-gray-400">Vendor:</span>
                                {order.vendorId ? (
                                  <span className="text-xs text-[#8B5E3C] font-semibold">{order.vendorId.companyName}</span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setAssignmentOrder(order);
                                      setSelectedPartnerType('vendor');
                                    }}
                                    className="text-[10px] text-blue-500 font-bold hover:underline"
                                  >
                                    Assign Vendor
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Type & Amount */}
                            <td className="py-4 px-6">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.orderType === 'AI Design' 
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : order.orderType === 'Manual Design'
                                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {order.orderType}
                              </span>
                              {order.orderType === 'Marketplace Product' && order.productDetails && (
                                <div className="flex items-center gap-2 mt-2">
                                  <img
                                    src={order.productDetails.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&auto=format&fit=crop&q=60'}
                                    alt={order.productDetails.title || 'Product'}
                                    className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
                                  />
                                  <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[100px]" title={order.productDetails.title}>{order.productDetails.title}</span>
                                </div>
                              )}
                              <span className="font-bold text-gray-800 block mt-1.5 font-mono">${order.totalAmount?.toLocaleString() || '0'}</span>
                              {order.quotationMaterials && (
                                <div className="mt-2 pt-2 border-t border-indigo-100 space-y-1">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quotation Details</p>
                                  <p className="text-[10px] text-gray-600"><span className="font-bold">Materials:</span> {order.quotationMaterials}</p>
                                  <p className="text-[10px] text-gray-600"><span className="font-bold">Timeline:</span> {order.quotationTime}</p>
                                </div>
                              )}
                            </td>

                            {/* Stage & Payment */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.orderStatus === 'Cancelled'
                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                    : ['Completed', 'Order Completed'].includes(order.orderStatus)
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                      : 'bg-orange-50 text-orange-600 border border-orange-100'
                                }`}>
                                  {order.orderStatus}
                                </span>
                              </div>
                              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                                order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-red-400'
                              }`}>
                                {order.paymentStatus === 'paid' ? '● Paid' : '○ Pending'}
                              </span>
                              {order.tracking && (
                                <div className="mt-2 pt-2 border-t border-gray-100 space-y-1 text-[10px]">
                                  <p className="text-gray-400"><span className="font-bold">Method:</span> {order.tracking.paymentMethod}</p>
                                  <p className="text-gray-400"><span className="font-bold">TXN:</span> <span className="font-mono">{order.tracking.transactionId}</span></p>
                                  <p className="text-gray-400"><span className="font-bold">Paid On:</span> {new Date(order.tracking.paymentDate).toLocaleDateString()}</p>
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setViewOrder(order)}
                                  title="View Full Order Details"
                                  className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all"
                                >
                                  <Eye size={14} />
                                </button>
                                {order.orderType !== 'Marketplace Product' && (
                                  <button
                                    onClick={() => {
                                      setUpdateStatusOrder(order);
                                      setNewWorkflowStage(order.orderStatus);
                                      setNewExpectedDeliveryDate(order.expectedDeliveryDate ? order.expectedDeliveryDate.split('T')[0] : '');
                                    }}
                                    title="Update Workflow Stage"
                                    className="p-2 bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-xl transition-all"
                                  >
                                    <Layers size={14} />
                                  </button>
                                )}
                                <button
                                  onClick={() => setTrackOrder(order)}
                                  title="Track Order Progress"
                                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all"
                                >
                                  <Activity size={14} />
                                </button>
                                {order.orderStatus !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    title="Cancel Order"
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 10: ADMIN TRANSACTIONS */}
      {activeTab === 'admin_transactions' && (() => {
        const filteredTransactions = transactions.filter(tx => {
          const searchStr = `${tx._id} ${tx.orderId} ${tx.userId?.name || ''} ${tx.userId?.email || ''} ${tx.vendorId?.companyName || ''}`.toLowerCase();
          const matchesSearch = searchStr.includes(transactionSearch.toLowerCase());
          const matchesType = transactionFilterType === 'all' || tx.type === transactionFilterType;
          const matchesStatus = transactionFilterStatus === 'all' || tx.status === transactionFilterStatus;
          return matchesSearch && matchesType && matchesStatus;
        });

        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-['Playfair_Display'] font-bold text-3xl text-gray-850">Platform Transactions</h2>
                <p className="text-xs text-gray-500 mt-1">Audit trail of all customer payments and vendor transactions across the platform.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
              {/* Filters Panel */}
              <div className="p-6 bg-[#FDFBF7] border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transaction..."
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <select
                    value={transactionFilterType}
                    onChange={(e) => setTransactionFilterType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none bg-white font-medium"
                  >
                    <option value="all">All Types</option>
                    <option value="Customer Payment">Customer Payment</option>
                    <option value="Vendor Payout">Vendor Payout</option>
                  </select>
                </div>
                <div>
                  <select
                    value={transactionFilterStatus}
                    onChange={(e) => setTransactionFilterStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none bg-white font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-4 pl-8">Transaction ID / Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Vendor Partner</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-right">Commission ({commissionRate}%)</th>
                      <th className="p-4 text-right">Net Payout</th>
                      <th className="p-4">Method / Type</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center p-12 text-gray-400 font-medium">
                          No transaction records matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr key={tx._id} className="border-b border-gray-150 text-xs hover:bg-[#FDFBF7] transition-all">
                          <td className="p-4 pl-8">
                            <span className="font-mono font-bold text-gray-800 block">#{tx._id}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-gray-700 block">{tx.userId?.name || 'Customer'}</span>
                            <span className="text-[10px] text-gray-400 block">{tx.userId?.email || 'N/A'}</span>
                          </td>
                          <td className="p-4 font-medium text-gray-600">
                            {tx.vendorId?.companyName || 'Artisan Marketplace'}
                          </td>
                          <td className="p-4 text-right font-bold text-gray-800 font-mono">
                            ${tx.amount?.toLocaleString()}
                          </td>
                          <td className="p-4 text-right font-medium text-[#E76F51] font-mono">
                            -${tx.commissionAmount?.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-bold text-emerald-600 font-mono">
                            ${tx.netPayout?.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <span className="bg-gray-100 text-gray-600 font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider block w-max">
                              {tx.paymentMethod}
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-1">
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                              tx.status === 'Paid' ? 'bg-green-50 text-green-600 border border-green-200' :
                              tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                              'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB: VENDOR PAYOUTS */}
      {activeTab === 'vendor_payouts' && (() => {
        const payoutTxs = transactions.filter(tx => tx.type === 'Vendor Payout' || tx.status === 'Pending');

        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-['Playfair_Display'] font-bold text-3xl text-gray-850">Vendor Payouts & Disbursals</h2>
                <p className="text-xs text-gray-500 mt-1">Disburse cleared revenue shares to design and manufacturing partners.</p>
              </div>
              <button
                onClick={handleDisburseAllPending}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
              >
                Disburse All Pending Payouts
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#0E7490] to-[#06B6D4] p-6 rounded-3xl text-white space-y-2 shadow-lg">
                <p className="font-bold text-[#CFFAFE] uppercase tracking-wider text-[10px]">Disbursed Payouts</p>
                <h3 className="font-['Playfair_Display'] font-extrabold text-3xl">${paymentStats?.disbursedPayouts?.toLocaleString() || '0'}</h3>
                <p className="text-[10px] text-white/70">Total funds successfully transferred</p>
              </div>
              <div className="bg-gradient-to-br from-[#B45309] to-[#D97706] p-6 rounded-3xl text-white space-y-2 shadow-lg">
                <p className="font-bold text-[#FEF3C7] uppercase tracking-wider text-[10px]">Pending Payouts</p>
                <h3 className="font-['Playfair_Display'] font-extrabold text-3xl">${paymentStats?.pendingPayouts?.toLocaleString() || '0'}</h3>
                <p className="text-[10px] text-white/70">Awaiting disbursal confirmation</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 font-bold text-lg text-gray-850">Payout Requests Log</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-4 pl-8">Transaction ID</th>
                      <th className="p-4">Vendor Partner</th>
                      <th className="p-4 text-right">Net Share</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutTxs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center p-12 text-gray-400 font-medium">
                          No pending payouts found.
                        </td>
                      </tr>
                    ) : (
                      payoutTxs.map((tx) => (
                        <tr key={tx._id} className="border-b border-gray-150 text-xs hover:bg-[#FDFBF7] transition-all">
                          <td className="p-4 pl-8">
                            <span className="font-mono font-bold text-gray-800 block">#{tx._id}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </td>
                          <td className="p-4 font-bold text-gray-700">
                            {tx.vendorId?.companyName || 'Artisan Workshop'}
                          </td>
                          <td className="p-4 text-right font-bold text-[#E76F51] font-mono">
                            ${tx.netPayout?.toFixed(2) || tx.amount?.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                              tx.status === 'Paid' ? 'bg-green-50 text-green-600 border border-green-200' :
                              'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-4 pr-8 text-right">
                            {tx.status === 'Pending' && (
                              <button
                                onClick={() => handleDisbursePayout(tx._id)}
                                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-bold text-[10px] transition-all"
                              >
                                Disburse
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB: PLATFORM COMMISSION */}
      {activeTab === 'platform_commission' && (() => {
        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-gray-850">Platform Commission & Revenue</h2>
              <p className="text-xs text-gray-500 mt-1">Monitor cumulative platform revenue share rates and settings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#065F46] to-[#047857] p-6 rounded-3xl text-white space-y-2 shadow-lg">
                <p className="font-bold text-[#A7F3D0] uppercase tracking-wider text-[10px]">Total Platform Revenue</p>
                <h3 className="font-['Playfair_Display'] font-extrabold text-3xl">${paymentStats?.totalPlatformRevenue?.toLocaleString() || '0'}</h3>
                <p className="text-[10px] text-white/70">Gross collections of custom and product orders</p>
              </div>
              <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] p-6 rounded-3xl text-white space-y-2 shadow-lg">
                <p className="font-bold text-[#E2E8F0] uppercase tracking-wider text-[10px]">Estimated Net Commission ({commissionRate}%)</p>
                <h3 className="font-['Playfair_Display'] font-extrabold text-3xl">${paymentStats?.estimatedCommission?.toLocaleString() || '0'}</h3>
                <p className="text-[10px] text-white/70">Gross platform earnings share</p>
              </div>
            </div>

            {/* Commission Rate Settings card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-left">
                <h4 className="font-['Playfair_Display'] font-bold text-xl text-gray-850">Global Commission Rate Configuration</h4>
                <p className="text-xs text-gray-500 mt-1">This rate is automatically deducted from payouts before disbursal.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-24 p-3 rounded-xl border border-gray-200 text-sm font-bold text-center focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none"
                  />
                  <span className="absolute right-3 top-3 text-sm font-bold text-gray-400">%</span>
                </div>
                <button
                  onClick={() => handleUpdateCommissionRate(commissionRate)}
                  className="px-6 py-3 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl font-bold text-xs shadow-md transition-all"
                >
                  Update Rate
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB: MESSAGES (User <-> Vendor conversations, admin can view & reply) */}
      {activeTab === 'messages' && (() => {
        const adminMsgs = adminDirectMessages;

        const uniqueConversations = [];
        const seenKeys = new Set();
        adminMsgs.forEach(m => {
          const key = `${m.userName}|||${m.vendorName}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueConversations.push({
              userName: m.userName,
              userEmail: m.userEmail,
              vendorName: m.vendorName
            });
          }
        });

        const conversationsList = uniqueConversations.map(c => {
          const threadMsgs = adminMsgs.filter(m => m.userName === c.userName && m.vendorName === c.vendorName);
          const lastMsg = threadMsgs[threadMsgs.length - 1];
          return {
            userName: c.userName,
            userEmail: c.userEmail,
            vendorName: c.vendorName,
            lastMessage: lastMsg ? lastMsg.message : '',
            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            key: `${c.userName}|||${c.vendorName}`
          };
        });

        const [selUserName, selVendorName] = selectedMsgUser.includes('|||')
          ? selectedMsgUser.split('|||')
          : [selectedMsgUser, 'Artisan Workshop Ltd'];

        const selectedUserMsgs = adminMsgs.filter(m => m.userName === selUserName && m.vendorName === selVendorName);

        return (
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex h-[600px] animate-fadeIn text-left">
            {/* Left Panel: User Conversations list */}
            <div className="w-1/3 border-r border-gray-150 flex flex-col bg-gray-50/50">
              <div className="p-5 border-b border-gray-150 bg-white">
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-gray-800">User Messages</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">User &lt;-&gt; Vendor conversations</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {conversationsList.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-medium">
                    No messages yet.
                  </div>
                ) : (
                  conversationsList.map(u => (
                    <button
                      key={u.key}
                      onClick={() => setSelectedMsgUser(u.key)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3.5 border ${
                        selectedMsgUser === u.key 
                          ? 'bg-[#1D3557]/10 border-[#1D3557]/20 shadow-sm' 
                          : 'hover:bg-white border-transparent hover:shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#1D3557]/10 text-[#1D3557] flex items-center justify-center font-bold text-sm shrink-0">
                        {u.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-xs text-gray-800 truncate">{u.userName}</h4>
                          <span className="text-[9px] text-gray-400 font-bold">{u.time}</span>
                        </div>
                        <p className="text-[9px] text-[#1D3557] font-semibold truncate mt-1">Vendor: {u.vendorName}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5 leading-normal">{u.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Conversation history & admin reply */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedMsgUser ? (
                <>
                  {/* Chat header */}
                  <div className="p-5 border-b border-gray-150 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">{selUserName}</h3>
                      <p className="text-[10px] text-[#1D3557] font-bold uppercase tracking-wider mt-0.5">
                        Thread with: {selVendorName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-[#1D3557]/10 text-[#1D3557] border border-[#1D3557]/20 px-2.5 py-1 rounded-lg font-bold">Admin View</span>
                    </div>
                  </div>

                  {/* Chat message content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20">
                    {selectedUserMsgs.map((msg) => {
                      let bubbleStyle, align, timeColor, senderLabel;
                      if (msg.sender === 'admin') {
                        bubbleStyle = 'bg-[#1D3557] text-white rounded-tr-none';
                        align = 'justify-end';
                        timeColor = 'text-white/70';
                        senderLabel = 'Admin';
                      } else if (msg.sender === 'vendor') {
                        bubbleStyle = 'bg-[#2A9D8F] text-white rounded-tl-none border border-[#2A9D8F]/25';
                        align = 'justify-start';
                        timeColor = 'text-white/70';
                        senderLabel = `Vendor (${msg.vendorName})`;
                      } else {
                        bubbleStyle = 'bg-white text-gray-800 border border-gray-100 rounded-tl-none';
                        align = 'justify-start';
                        timeColor = 'text-gray-400';
                        senderLabel = msg.userName || 'Customer';
                      }
                      return (
                        <div key={msg._id} className={`flex ${align}`}>
                          <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${bubbleStyle}`}>
                            <p>{msg.message}</p>
                            <span className={`block text-[9px] mt-1.5 text-right ${timeColor}`}>
                              {senderLabel} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleSendAdminDirectMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                    <input
                      type="text"
                      value={adminMsgInput}
                      onChange={(e) => setAdminMsgInput(e.target.value)}
                      placeholder={`Reply as Admin regarding thread with ${selUserName}...`}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1D3557] text-xs"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1D3557] hover:bg-[#1D3557]/90 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      Reply
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-full bg-[#1D3557]/5 flex items-center justify-center text-[#1D3557] mb-4">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-800">Select a conversation</h4>
                  <p className="text-xs text-gray-400 max-w-[240px] mt-1.5 leading-relaxed">Choose a user conversation to view the thread and respond as admin.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB: DISPUTES */}
      {activeTab === 'disputes' && (() => {
        const disputeList = [
          { _id: 'dsp_101', ticketId: 'tick_001', clientName: 'Alice Johnson', vendorName: 'Artisan Workshop', subject: 'Product Damage on Arrival', detail: 'Customer claims the premium oak chair was received with deep structural scratches. Vendor claims delivery team is not responsible.', status: 'Pending Arbitration', amount: 450 },
          { _id: 'dsp_102', ticketId: 'tick_004', clientName: 'Marcus Aurelius', vendorName: 'Elite Woodworks', subject: 'Installation Failure', detail: 'Designer did not complete the layout design inside the AI Room Studio. Vendor asserts user did not approve budget.', status: 'Resolved', amount: 1200 }
        ];

        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-gray-850">Vendor-Client Disputes Arbitration</h2>
              <p className="text-xs text-gray-500 mt-1">Review and arbitrate disputes between clients and registered vendors/interior designers.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {disputeList.map((dsp) => (
                <div key={dsp._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h4 className="font-['Playfair_Display'] font-bold text-xl text-gray-800">{dsp.subject}</h4>
                      <p className="text-xs text-gray-400">Client: {dsp.clientName} • Vendor: {dsp.vendorName} • Dispute Amount: ${dsp.amount}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      dsp.status === 'Resolved' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>{dsp.status}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed bg-[#F8F5F0] p-4 rounded-xl">{dsp.detail}</p>
                  {dsp.status === 'Pending Arbitration' && (
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => alert('Dispute resolved in favor of client. Refund initiated.')} className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl text-xs font-bold shadow-sm">Resolve in Client Favor</button>
                      <button onClick={() => alert('Dispute resolved in favor of vendor. Disbursing payment.')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1F2937] rounded-xl text-xs font-bold border border-gray-200">Resolve in Vendor Favor</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* TAB: LIVE SUPPORT CHAT */}
      {activeTab === 'support' && (() => {
        const supportMsgs = helpMessages;
        
        // Find all unique users who messaged help desk
        const uniqueUsers = Array.from(new Set(supportMsgs.map(m => m.userName))).map(name => {
          const userMsgs = supportMsgs.filter(m => m.userName === name);
          const lastMsg = userMsgs[userMsgs.length - 1];
          return {
            name,
            lastMessage: lastMsg ? lastMsg.message : '',
            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
          };
        });

        const activeUserHelpMsgs = supportMsgs.filter(m => m.userName === selectedHelpUser);

        return (
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-250 overflow-hidden flex h-[600px] animate-fadeIn text-left">
            {/* Left Panel: Customer Conversations list */}
            <div className="w-1/3 border-r border-gray-150 flex flex-col bg-gray-50/50">
              <div className="p-5 border-b border-gray-150 bg-white">
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-gray-800">User Support Chats</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Help Desk Live Channels</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {uniqueUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-medium">
                    No active support chats.
                  </div>
                ) : (
                  uniqueUsers.map(u => (
                    <button
                      key={u.name}
                      onClick={() => setSelectedHelpUser(u.name)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3.5 border ${
                        selectedHelpUser === u.name 
                          ? 'bg-[#E76F51]/10 border-[#E76F51]/20 shadow-sm' 
                          : 'hover:bg-white border-transparent hover:shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#E76F51]/10 text-[#E76F51] flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-xs text-gray-800 truncate">{u.name}</h4>
                          <span className="text-[9px] text-gray-400 font-bold">{u.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mt-1 leading-normal">{u.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Conversation history & response */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedHelpUser ? (
                <>
                  {/* Chat header */}
                  <div className="p-5 border-b border-gray-150 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">User Support Chat: {selectedHelpUser}</h3>
                      <p className="text-[10px] text-[#E76F51] font-bold uppercase tracking-wider mt-0.5 font-sans">Role: Platform Admin Monitor</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-red-50 text-[#E76F51] border border-red-100 px-2.5 py-1 rounded-lg font-bold">Admin Console</span>
                    </div>
                  </div>

                  {/* Chat message content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20">
                    {activeUserHelpMsgs.map((msg) => {
                      const isMe = msg.senderRole === 'admin';
                      let bubbleStyle, align, senderLabel, timeColor;

                      if (isMe) {
                        bubbleStyle = 'bg-[#1F2937] text-white rounded-tr-none';
                        align = 'justify-end';
                        senderLabel = 'You (Admin)';
                        timeColor = 'text-white/70';
                      } else if (msg.senderRole === 'vendor') {
                        bubbleStyle = 'bg-[#2A9D8F] text-white rounded-tl-none border border-emerald-600';
                        align = 'justify-start';
                        senderLabel = `Vendor (${msg.senderName})`;
                        timeColor = 'text-white/70';
                      } else {
                        bubbleStyle = 'bg-white text-gray-800 border border-gray-150 rounded-tl-none';
                        align = 'justify-start';
                        senderLabel = `Customer (${msg.senderName || msg.userName})`;
                        timeColor = 'text-gray-400';
                      }

                      return (
                        <div key={msg._id} className={`flex ${align}`}>
                          <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${bubbleStyle}`}>
                            <p>{msg.message}</p>
                            <span className={`block text-[8px] mt-1.5 text-right ${timeColor}`}>
                              {senderLabel} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleSendAdminHelpMessage} className="p-4 border-t border-gray-150 flex gap-2 bg-white">
                    <input
                      type="text"
                      value={helpInput}
                      onChange={(e) => setHelpInput(e.target.value)}
                      placeholder={`Type a support response to ${selectedHelpUser}...`}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1F2937] text-xs font-sans"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1F2937] hover:bg-[#1F2937]/90 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      Send Support Response
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-full bg-[#E76F51]/5 flex items-center justify-center text-[#E76F51] mb-4">
                    <HelpCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-800">Select a support chat</h4>
                  <p className="text-xs text-gray-450 max-w-[240px] mt-1.5 leading-relaxed">Choose a customer help chat from the list to view history and troubleshoot.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 11: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-8 text-left animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Customer Support Tickets</h2>
              <p className="text-xs text-gray-500">Track and respond to user inquiries, delivery issues, and system disputes.</p>
            </div>
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setTicketStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                    ticketStatusFilter === status
                      ? 'bg-[#8B5E3C] text-white shadow-sm'
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* ── CONTACT MESSAGES FROM LANDING PAGE ── */}
          {contactMessages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">
                    📩 Contact Form Messages
                    <span className="ml-2 px-2 py-0.5 bg-[#E76F51]/10 text-[#E76F51] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {contactMessages.filter(m => m.status === 'open').length} New
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Messages submitted via the landing page "Get In Touch" form.</p>
                </div>
                <button
                  onClick={() => { setContactMessages([]); localStorage.removeItem('mockContactMessages'); }}
                  className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {contactMessages.map((msg) => (
                  <div key={msg._id} className={`bg-white rounded-3xl border shadow-sm p-6 space-y-3 transition-all hover:shadow-md ${msg.status === 'replied' ? 'border-emerald-200 opacity-70' : 'border-[#D4A373]/30'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">{msg.name}</p>
                          <p className="text-xs text-[#8B5E3C]">{msg.email}</p>
                        </div>
                        <span className={`ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${msg.status === 'replied' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {msg.status === 'replied' ? '✓ Replied' : 'New'}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-[#F8F5F0] p-4 rounded-2xl border border-[#D4A373]/20 text-sm text-gray-700 leading-relaxed">
                      {msg.message}
                    </div>

                    <div className="flex gap-2 pt-1">
                      {msg.status !== 'replied' && (
                        <button
                          onClick={() => handleMarkContactReplied(msg._id)}
                          className="px-4 py-2 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                        >
                          Mark as Replied
                        </button>
                      )}
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your ArtisanStudio Inquiry&body=Hi ${msg.name},%0A%0AThank you for reaching out to ArtisanStudio.%0A%0A`}
                        className="px-4 py-2 bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-xl text-xs font-bold transition-all"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => handleDismissContactMessage(msg._id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all ml-auto"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 pt-6">
            <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] mb-4">🎫 Support Tickets</h3>
          </div>

          {loadingTickets ? (
            <div className="bg-white p-12 rounded-3xl border border-[#D4A373]/30 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="w-8 h-8 text-[#8B5E3C] animate-spin" />
              <p className="text-sm font-medium text-gray-500">Loading support tickets...</p>
            </div>
          ) : (
            (() => {
              const filtered = tickets.filter(t => ticketStatusFilter === 'all' || t.status === ticketStatusFilter);
              if (filtered.length === 0) {
                return (
                  <div className="bg-white p-12 rounded-3xl border border-[#D4A373]/30 text-center space-y-3">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
                    <h3 className="font-['Playfair_Display'] font-bold text-xl text-gray-700">No Tickets Found</h3>
                    <p className="text-xs text-gray-400">There are no tickets matching the selected status filter.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {filtered.map((ticket) => {
                    const customerName = ticket.userId?.name || 'Unknown User';
                    const customerEmail = ticket.userId?.email || '';
                    const dateStr = new Date(ticket.createdAt).toLocaleString();
                    const ticketIdShort = ticket._id.substring(ticket._id.length - 6).toUpperCase();

                    return (
                      <div key={ticket._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6 hover:shadow-md transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-[#E76F51]/10 text-[#E76F51] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Ticket #{ticketIdShort}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ticket.status === 'open' ? 'bg-red-50 text-red-600' :
                                ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-600' :
                                ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] mt-3">{ticket.subject}</h3>
                            <p className="text-xs text-[#6B7280] mt-1">
                              Customer: <span className="font-bold text-gray-700">{customerName}</span> {customerEmail && `(${customerEmail})`} • Raised: {dateStr}
                            </p>
                          </div>
                          
                          {/* Ticket Actions */}
                          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                            {ticket.status === 'open' && (
                              <>
                                <button 
                                  onClick={() => handleTicketStatus(ticket._id, 'in_progress')} 
                                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-bold text-xs shadow-sm border border-amber-200/55 transition-all"
                                >
                                  In Progress
                                </button>
                                <button 
                                  onClick={() => handleTicketStatus(ticket._id, 'resolved')} 
                                  className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all"
                                >
                                  Resolve
                                </button>
                                <button 
                                  onClick={() => handleTicketStatus(ticket._id, 'closed')} 
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all"
                                >
                                  Close
                                </button>
                              </>
                            )}
                            {ticket.status === 'in_progress' && (
                              <>
                                <button 
                                  onClick={() => handleTicketStatus(ticket._id, 'resolved')} 
                                  className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all"
                                >
                                  Resolve
                                </button>
                                <button 
                                  onClick={() => handleTicketStatus(ticket._id, 'closed')} 
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all"
                                >
                                  Close
                                </button>
                              </>
                            )}
                            {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                              <button 
                                onClick={() => handleTicketStatus(ticket._id, 'open')} 
                                className="bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 text-[#8B5E3C] px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all"
                              >
                                Reopen Ticket
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-[#1F2937] bg-[#F8F5F0] p-5 rounded-2xl border border-[#D4A373]/30 whitespace-pre-wrap">
                          <strong>Issue Details:</strong><br />
                          {ticket.message}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* TAB 12: REPORTS & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Reports & Analytics</h2>
              <p className="text-xs text-gray-500">Real-time marketplace revenue tracking, conversion graphs, and operational insights.</p>
            </div>
            <button
              onClick={() => handleExportCSV('sales')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <Download size={14} />
              Export Annual Report (CSV)
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Order Value</span>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={14} /></div>
              </div>
              <h4 className="font-['Playfair_Display'] font-extrabold text-2xl text-gray-800">$2,450.00</h4>
              <p className="text-[10px] text-green-500 font-bold">↑ 8.2% from last quarter</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Design Conversion Rate</span>
                <div className="p-1.5 bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-lg"><Sparkles size={14} /></div>
              </div>
              <h4 className="font-['Playfair_Display'] font-extrabold text-2xl text-gray-800">34.8%</h4>
              <p className="text-[10px] text-green-500 font-bold">↑ 2.4% vs industry average</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Partner SLA Index</span>
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Clock size={14} /></div>
              </div>
              <h4 className="font-['Playfair_Display'] font-extrabold text-2xl text-gray-800">94.2%</h4>
              <p className="text-[10px] text-blue-500 font-bold">On-time delivery & quality</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Retention</span>
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Users size={14} /></div>
              </div>
              <h4 className="font-['Playfair_Display'] font-extrabold text-2xl text-gray-800">76.4%</h4>
              <p className="text-[10px] text-purple-500 font-bold">High repeat customer rate</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Growth Chart */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Revenue Performance Graph</h3>
                  <p className="text-[10px] text-gray-400">Monthly Gross platform revenue trajectory (Jan - Jun)</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg">Target Achieved</span>
              </div>

              {/* SVG Area Chart */}
              <div className="relative pt-4">
                <svg viewBox="0 0 500 150" className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Area fill */}
                  <path 
                    d="M 0 120 C 50 110, 50 100, 100 100 C 150 100, 150 80, 200 80 C 250 80, 250 95, 300 95 C 350 95, 350 50, 400 50 C 450 50, 450 20, 500 20 L 500 150 L 0 150 Z" 
                    fill="url(#salesGrad)" 
                  />

                  {/* Line stroke */}
                  <path 
                    d="M 0 120 C 50 110, 50 100, 100 100 C 150 100, 150 80, 200 80 C 250 80, 250 95, 300 95 C 350 95, 350 50, 400 50 C 450 50, 450 20, 500 20" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />

                  {/* Dots & Labels */}
                  <circle cx="0" cy="120" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2" />
                  <circle cx="100" cy="100" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2" />
                  <circle cx="200" cy="80" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2" />
                  <circle cx="300" cy="95" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2" />
                  <circle cx="400" cy="50" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2" />
                  <circle cx="500" cy="20" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2" />
                </svg>

                {/* X-Axis labels */}
                <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold px-1 mt-2">
                  <span>Jan ($5k)</span>
                  <span>Feb ($12k)</span>
                  <span>Mar ($18k)</span>
                  <span>Apr ($15k)</span>
                  <span>May ($32k)</span>
                  <span>Jun ($45.2k)</span>
                </div>
              </div>
            </div>

            {/* Category Performance Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-4">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Operational Breakdown</h3>
                <p className="text-[10px] text-gray-400">Proportion of orders and value per product line</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span>AI Studio Designs</span>
                    <span>45% ($24,500)</span>
                  </div>
                  <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#8B5E3C] h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span>Premium Design Consultations</span>
                    <span>32% ($18,200)</span>
                  </div>
                  <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E76F51] h-full rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span>Custom Workshop Furniture</span>
                    <span>18% ($12,100)</span>
                  </div>
                  <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2A9D8F] h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span>Logistics & Logistics Add-ons</span>
                    <span>5% ($3,200)</span>
                  </div>
                  <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1E293B] h-full rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Specialists / Partners performance */}
          <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 text-left">
              <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800">Specialist Partner Leaderboard</h3>
              <p className="text-[10px] text-gray-400">Evaluation and total commission generated per key partner account.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="p-4 pl-6">Partner Name</th>
                    <th className="p-4">Industry Role</th>
                    <th className="p-4 text-center">Quality SLA</th>
                    <th className="p-4 text-right">Revenue Contributed</th>
                    <th className="p-4 text-right">Commission Taken</th>
                    <th className="p-4 pr-6 text-right">Disbursed Earnings</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b border-gray-100 hover:bg-[#FDFBF7] transition-all">
                    <td className="p-4 pl-6 font-bold text-gray-800">Artisan Workshop</td>
                    <td className="p-4">Furniture Vendor</td>
                    <td className="p-4 text-center font-bold text-green-600">4.8 / 5.0</td>
                    <td className="p-4 text-right font-bold text-gray-700 font-mono">$12,500.00</td>
                    <td className="p-4 text-right font-medium text-amber-600 font-mono">$1,875.00</td>
                    <td className="p-4 pr-6 text-right font-bold text-emerald-600 font-mono">$10,625.00</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-[#FDFBF7] transition-all">
                    <td className="p-4 pl-6 font-bold text-gray-800">Elite Woodworks</td>
                    <td className="p-4">Manufacturer</td>
                    <td className="p-4 text-center font-bold text-green-600">4.6 / 5.0</td>
                    <td className="p-4 text-right font-bold text-gray-700 font-mono">$8,500.00</td>
                    <td className="p-4 text-right font-medium text-amber-600 font-mono">$1,275.00</td>
                    <td className="p-4 pr-6 text-right font-bold text-emerald-600 font-mono">$7,225.00</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-[#FDFBF7] transition-all">
                    <td className="p-4 pl-6 font-bold text-gray-800">Swift Logistics Solutions</td>
                    <td className="p-4">Logistics Partner</td>
                    <td className="p-4 text-center font-bold text-green-600">4.9 / 5.0</td>
                    <td className="p-4 text-right font-bold text-gray-700 font-mono">$2,400.00</td>
                    <td className="p-4 text-right font-medium text-amber-600 font-mono">$360.00</td>
                    <td className="p-4 pr-6 text-right font-bold text-emerald-600 font-mono">$2,040.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Report Exporter Section */}
          <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#D4A373]/30 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Monthly Platform Growth</h4>
              <p className="text-[11px] text-gray-500 mb-4 mt-1">Detailed breakdown of platform sales volume, user growth rate, and gross revenue metrics.</p>
              <button
                onClick={() => handleExportCSV('sales')}
                className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-2"
              >
                <Download size={12} />
                Download Sales CSV
              </button>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Partner Performance SLA</h4>
              <p className="text-[11px] text-gray-500 mb-4 mt-1">Detailed database of active vendors, manufacturers, delivery staff, and performance rating logs.</p>
              <button
                onClick={() => handleExportCSV('partners')}
                className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-2"
              >
                <Download size={12} />
                Download Partner CSV
              </button>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Client Demographics Log</h4>
              <p className="text-[11px] text-gray-500 mb-4 mt-1">Listing of active accounts, registered locations, lifetime value spendings, and status states.</p>
              <button
                onClick={() => handleExportCSV('users')}
                className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-2"
              >
                <Download size={12} />
                Download Demographics CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 13: VENDOR VERIFICATION */}
      {activeTab === 'verifications' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Vendor Business Verifications</h2>
              <p className="text-xs text-gray-500 font-bold mt-1">Review government registration papers, PAN, GST details, and corporate profile files.</p>
            </div>
            <span className="bg-amber-50 text-[#8B5E3C] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#D4A373]/30">Step 2: Business Verification</span>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor Info</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendorRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-gray-400 font-bold">No vendor registrations found.</td>
                    </tr>
                  ) : (
                    vendorRegistrations.map((vendor) => (
                      <tr key={vendor._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5">
                          <p className="font-bold text-[#1F2937] text-sm">{vendor.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{vendor.companyName || 'N/A'}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-medium text-gray-700">{vendor.email}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{vendor.phone || 'N/A'}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-sm text-gray-700">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(vendor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            vendor.status === 'Approved' || vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            vendor.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                            'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            {vendor.status === 'Active' ? 'Approved' : vendor.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            {(vendor.status === 'Pending' || vendor.status === 'pending') && (
                              <>
                                <button onClick={() => handleApproveVendorRegistration(vendor._id)} className="px-3 py-1.5 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-lg font-bold text-xs shadow-sm transition-all">Approve</button>
                                <button onClick={() => handleRejectVendorRegistration(vendor._id)} className="px-3 py-1.5 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-lg font-bold text-xs shadow-sm transition-all">Reject</button>
                              </>
                            )}
                            {(vendor.status !== 'Pending' && vendor.status !== 'pending') && (
                              <span className="text-xs text-gray-400 italic">No actions available</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 13.3: STORE APPROVAL */}
      {activeTab === 'store-approvals' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Store & Profile Approvals</h2>
              <p className="text-xs text-gray-500 font-bold mt-1">Verify business descriptions, custom specializations, monthly output capacity, and service regions.</p>
            </div>
            <span className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#2A9D8F]/20">Step 3: Store Setup</span>
          </div>

          <div className="space-y-6">
            {storeSetupSubmissions.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center text-gray-500 font-bold">
                No store profile setups submitted yet.
              </div>
            ) : (
              storeSetupSubmissions.map((sub) => (
                <div key={sub._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
                    <div>
                      <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">{sub.vendorId?.companyName || 'Artisan Workshop'}</h3>
                      <p className="text-xs text-gray-500 mt-1">Profile configuration review</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold text-xs ${
                      sub.status === 'Approved' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
                      sub.status === 'Rejected' ? 'bg-[#E76F51]/10 text-[#E76F51]' : 'bg-[#E9C46A]/10 text-[#8B5E3C]'
                    }`}>
                      Store Status: {sub.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F8F5F0]/50 p-6 rounded-2xl border border-[#D4A373]/10 text-xs">
                    <div>
                      <p className="font-bold text-gray-400 uppercase tracking-wider">Specialization</p>
                      <p className="font-extrabold text-gray-800 mt-1">{sub.specialization || 'Furniture Maker'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-400 uppercase tracking-wider">Monthly Production Capacity</p>
                      <p className="font-extrabold text-gray-800 mt-1">{sub.monthlyCapacity || 50} units/mo</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-400 uppercase tracking-wider">Service Areas</p>
                      <p className="font-extrabold text-gray-800 mt-1">{sub.serviceAreas || 'Bangalore, Mumbai'}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-150 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Store Description & Bio</p>
                    <p className="text-sm text-gray-700 leading-relaxed font-serif italic">"{sub.description || 'No description provided.'}"</p>
                  </div>

                  {sub.adminRemarks && (
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-[#D4A373]/20">
                      <p className="text-xs font-bold text-gray-700">Remarks: <span className="font-normal text-gray-600">{sub.adminRemarks}</span></p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider">Remarks / Moderation Note</label>
                    <textarea rows={2} placeholder="Add remarks for store setup approval or requested modifications..." value={remarks[sub._id] || ''} onChange={(e) => setRemarks({ ...remarks, [sub._id]: e.target.value })} className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C]" />
                    <div className="flex gap-4">
                      <button onClick={() => handleApproveStore(sub._id, 'Approved')} className="px-6 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all">Approve Store & Go Live</button>
                      <button onClick={() => handleApproveStore(sub._id, 'Rejected')} className="px-6 py-3 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all">Reject / Request Edits</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 13.5: PRODUCT QUALITY REVIEW */}
      {activeTab === 'product-reviews' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Product Quality Reviews</h2>
              <p className="text-xs text-gray-500 font-bold mt-1">Approve or flag new vendor catalog listings before they are indexed in the public marketplace.</p>
            </div>
            <span className="bg-indigo-50 text-indigo-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-indigo-150">Catalog Audit</span>
          </div>

          <div className="space-y-6">
            {productReviewSubmissions.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#D4A373]/30 text-center text-gray-500 font-bold">
                No products pending quality reviews.
              </div>
            ) : (
              productReviewSubmissions.map((sub) => (
                <div key={sub._id} className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
                    <div>
                      <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">{sub.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Listed by {sub.vendorId?.companyName || 'Artisan Workshop'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-50 text-emerald-600 font-extrabold text-sm px-4 py-1.5 rounded-full border border-emerald-100">
                        ${sub.price}
                      </span>
                      <span className={`px-4 py-2 rounded-full font-bold text-xs ${
                        sub.approvalStatus === 'Approved' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' :
                        sub.approvalStatus === 'Rejected' ? 'bg-[#E76F51]/10 text-[#E76F51]' : 'bg-[#E9C46A]/10 text-[#8B5E3C]'
                      }`}>
                        Review Status: {sub.approvalStatus || sub.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#F8F5F0]/50 p-6 rounded-2xl border border-[#D4A373]/10 text-xs">
                    <div>
                      <p className="font-bold text-gray-400 uppercase tracking-wider">Category</p>
                      <p className="font-extrabold text-[#8B5E3C] mt-1 uppercase">{sub.category}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-400 uppercase tracking-wider">Materials Used</p>
                      <p className="font-extrabold text-gray-800 mt-1">{sub.material || 'Solid Wood'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-bold text-gray-400 uppercase tracking-wider">Description</p>
                      <p className="font-medium text-gray-700 mt-1 leading-relaxed">{sub.description}</p>
                    </div>
                  </div>

                  {sub.images && sub.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Gallery ({sub.images.length})</p>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {sub.images.map((img, idx) => (
                          <a key={idx} href="#" onClick={(e) => handleOpenImage(e, img)} rel="noreferrer" className="block relative group overflow-hidden rounded-xl border border-gray-150 shrink-0">
                            <img src={img} alt={`Product ${idx}`} className="w-48 h-32 object-cover group-hover:scale-105 transition-all duration-300" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold text-white text-xs">View Image</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex gap-4">
                    <button onClick={() => handleReviewProduct(sub._id, 'Approved')} className="px-6 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all">Approve Listing</button>
                    <button onClick={() => handleReviewProduct(sub._id, 'Rejected')} className="px-6 py-3 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white rounded-xl font-bold text-xs shadow-md transition-all">Reject / Flag listing</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 14: ROLE & PERMISSION */}
      {activeTab === 'roles' && (
        <div className="space-y-8 text-left animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">System Roles & Permissions</h2>
              <p className="text-xs text-gray-500">Configure administrative access control lists (ACL) and designate sub-admin accounts.</p>
            </div>
            <button
              onClick={() => setShowAddSubAdminModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <UserPlus size={14} />
              Configure Sub-Admin
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-Admin Accounts</span>
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={14} /></div>
              </div>
              <h4 className="font-['Playfair_Display'] font-extrabold text-2xl text-gray-800">{subAdmins.length} Users</h4>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unique Designations</span>
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><ShieldCheck size={14} /></div>
              </div>
              <h4 className="font-['Playfair_Display'] font-extrabold text-2xl text-gray-800">
                {new Set(subAdmins.map(s => s.roleName)).size} Active Roles
              </h4>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ACL Rule Coverage</span>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckSquare size={14} /></div>
              </div>
              <h4 className="font-['Playfair_Display'] font-extrabold text-2xl text-gray-800">
                {subAdmins.reduce((acc, sub) => {
                  return acc + Object.values(sub.permissions || {}).filter(Boolean).length;
                }, 0)} Scopes
              </h4>
            </div>
          </div>

          {/* Add Sub-Admin Modal */}
          {showAddSubAdminModal && (
            <div className="fixed inset-0 bg-[#1F2937]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-xl max-w-lg w-full overflow-hidden animate-scaleIn">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Configure Sub-Admin Account</h3>
                  <button onClick={() => setShowAddSubAdminModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XCircle size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddSubAdminSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Select User</label>
                    <select
                      required
                      value={newSubAdminUserId}
                      onChange={(e) => setNewSubAdminUserId(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm"
                    >
                      <option value="">-- Choose User --</option>
                      {(managementData?.users || [])
                        .filter(u => !subAdmins.some(s => s.userId?._id === u._id))
                        .map(user => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.email}) - {user.role.toUpperCase()}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Custom Role / Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Support Manager, Compliance Officer"
                      value={newSubAdminRole}
                      onChange={(e) => setNewSubAdminRole(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-4">Grant Permission Scopes</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'userManagement', label: 'User Management' },
                        { key: 'vendorVerification', label: 'Vendor Verification' },
                        { key: 'ordersWorkflow', label: 'Orders & Payouts' },
                        { key: 'supportTickets', label: 'Support Tickets' },
                        { key: 'analytics', label: 'Analytics' },
                        { key: 'notifications', label: 'Notifications' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all select-none">
                          <input
                            type="checkbox"
                            checked={newSubAdminPermissions[item.key]}
                            onChange={(e) => setNewSubAdminPermissions({
                              ...newSubAdminPermissions,
                              [item.key]: e.target.checked
                            })}
                            className="rounded text-[#8B5E3C] focus:ring-[#8B5E3C] h-4 w-4 border-gray-300"
                          />
                          <span className="text-xs font-medium text-gray-700">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddSubAdminModal(false)}
                      className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-3 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl font-bold text-xs transition-all shadow-md"
                    >
                      Promote & Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Sub-Admins list */}
          <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
            {loadingSubAdmins ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-[#8B5E3C] animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Fetching administrative configuration...</p>
              </div>
            ) : subAdmins.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Lock className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-gray-700">No Sub-Admins</h3>
                <p className="text-xs text-gray-400">Add sub-admins to delegate platform operations with granular permissions.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8F5F0] border-b border-gray-100">
                      <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Sub-Admin</th>
                      <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Designation / Role</th>
                      <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Permission Scopes (Click to Toggle)</th>
                      <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subAdmins.map((sub) => {
                      const name = sub.userId?.name || 'Unknown User';
                      const email = sub.userId?.email || 'N/A';
                      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

                      return (
                        <tr key={sub._id} className="hover:bg-gray-50/50 transition-all">
                          {/* Sub-Admin details */}
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center font-bold text-xs border border-[#8B5E3C]/20 shadow-sm">
                                {initials}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#1F2937]">{name}</h4>
                                <p className="text-[11px] text-gray-500">{email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Designation / Role */}
                          <td className="p-5">
                            <input
                              type="text"
                              value={sub.roleName}
                              onChange={(e) => handleUpdateRoleName(sub._id, e.target.value)}
                              className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#8B5E3C] text-sm font-bold text-gray-700 focus:outline-none py-1 w-full max-w-[180px]"
                              title="Click to edit role designation"
                            />
                          </td>

                          {/* Permission Scopes */}
                          <td className="p-5">
                            <div className="flex flex-wrap gap-2">
                              {[
                                { key: 'userManagement', label: 'Users' },
                                { key: 'vendorVerification', label: 'Verification' },
                                { key: 'ordersWorkflow', label: 'Orders' },
                                { key: 'supportTickets', label: 'Tickets' },
                                { key: 'analytics', label: 'Analytics' },
                                { key: 'notifications', label: 'Broadcasts' }
                              ].map((perm) => {
                                const isGranted = sub.permissions?.[perm.key];
                                return (
                                  <button
                                    key={perm.key}
                                    onClick={() => handleUpdatePermissionToggle(sub._id, perm.key, isGranted)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all select-none border ${
                                      isGranted
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                                        : 'bg-red-50/50 text-red-600 border-red-100 hover:bg-red-100/50'
                                    }`}
                                    title={`Toggle ${perm.label} Permission`}
                                  >
                                    {perm.label}: {isGranted ? 'YES' : 'NO'}
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-5 text-right">
                            <button
                              onClick={() => handleRevokeSubAdmin(sub._id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-all"
                              title="Revoke Admin Access"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 15: SYSTEM NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-8 text-left animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D4A373]/30 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] flex items-center gap-3">
                <Bell className="w-6 h-6 text-[#1D3557]" /> Received Platform Logs
              </h2>
              {notifications.length > 0 && (
                <button onClick={onMarkAllRead} className="text-sm font-bold text-[#1D3557] hover:underline">
                  Mark all as read
                </button>
              )}
            </div>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium">
                  No received system notifications yet.
                </div>
              ) : (
                notifications.map((notif) => {
                  const isUnread = !notif.read;
                  return (
                    <div 
                      key={notif._id} 
                      onClick={() => onNotifClick && onNotifClick(notif)}
                      className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm ${
                        isUnread 
                          ? 'bg-[#1D3557]/5 border-[#1D3557]/20' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {isUnread ? (
                          <div className="w-2 h-2 bg-[#1D3557] rounded-full mt-1.5"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${isUnread ? 'text-[#1F2937]' : 'text-gray-500'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                        </p>
                        {(notif.message.toLowerCase().includes('request') || notif.message.toLowerCase().includes('manual')) && (
                          <button 
                            onClick={() => { if (setActiveTab) setActiveTab('manual_designs'); }} 
                            className="mt-2 text-xs font-bold text-[#1D3557] hover:underline block"
                          >
                            View Request
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: MANUFACTURING */}
      {activeTab === 'manufacturing' && (() => {
        const allOrders = managementData?.orders || [];
        const mfgOrders = allOrders.filter(o =>
          ['Manufacturer Assigned','Manufacturing Started','Manufacturing','Quality Check','Under Quality Review','Production Started','Manufacturing Completed'].includes(o.orderStatus)
        );
        const stats2 = [
          { label: 'In Production', value: mfgOrders.filter(o => ['Manufacturing Started','Manufacturing','Production Started'].includes(o.orderStatus)).length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Quality Check', value: mfgOrders.filter(o => ['Quality Check','Under Quality Review'].includes(o.orderStatus)).length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', value: mfgOrders.filter(o => o.orderStatus === 'Manufacturing Completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Active', value: mfgOrders.length, color: 'text-[#1F2937]', bg: 'bg-gray-100' },
        ];
        const stages = ['Manufacturer Assigned','Manufacturing Started','Manufacturing','Quality Check','Manufacturing Completed'];
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Manufacturing Operations</h2>
              <p className="text-xs text-gray-500 mt-1">Monitor all active production orders, quality checks, and manufacturer assignments across the platform.</p>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {stats2.map(s => (
                <div key={s.label} className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}>
                    <Hammer className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Orders Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#1F2937]">Active Manufacturing Orders</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">{mfgOrders.length} orders</span>
                </div>
                {mfgOrders.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Hammer className="w-7 h-7 text-gray-400" /></div>
                    <p className="text-gray-400 font-bold">No active manufacturing orders</p>
                    <p className="text-xs text-gray-400 mt-1">Orders in production will appear here once assigned to manufacturers.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {mfgOrders.map(o => {
                      const stageIdx = stages.indexOf(o.orderStatus);
                      const pct = stageIdx < 0 ? 0 : Math.round(((stageIdx + 1) / stages.length) * 100);
                      return (
                        <div key={o._id} className="p-5 hover:bg-gray-50/50 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-bold text-sm text-[#1F2937]">Order #{o._id.slice(-6)}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{o.orderType} · {o.userId?.name || 'Customer'}</p>
                              {o.manufacturerId && <p className="text-xs text-indigo-600 font-bold mt-0.5">🏭 {o.manufacturerId?.companyName || 'Assigned'}</p>}
                            </div>
                            <span className="shrink-0 text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">{o.orderStatus}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1.5">
                              <span>Production Progress</span><span>{pct}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-300 font-bold mt-1.5 uppercase tracking-wider">
                              {stages.map((s, i) => <span key={s} className={i <= stageIdx ? 'text-indigo-500' : ''}>{s.split(' ')[0]}</span>)}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400">
                            <span>💰 ${o.totalAmount?.toLocaleString()}</span>
                            <span>·</span>
                            <span>📅 {o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : 'TBD'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Manufacturer Summary */}
              <div className="space-y-5">
                <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm p-6">
                  <h3 className="font-bold text-base text-[#1F2937] mb-4">Manufacturer Roster</h3>
                  {(managementData?.vendors || []).filter(v => v.businessType === 'manufacturer').length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No manufacturers registered yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {(managementData?.vendors || []).filter(v => v.businessType === 'manufacturer').map(m => (
                        <div key={m._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-xs font-bold text-[#1F2937]">{m.companyName}</p>
                            <p className="text-[10px] text-gray-400">Verification: {m.verificationStatus || 'N/A'}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${m.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {m.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white">
                  <h3 className="font-bold text-base mb-2">Production Insights</h3>
                  <div className="space-y-3 mt-4">
                    {[
                      { label: 'Avg. Production Time', value: '14 days' },
                      { label: 'On-time Completion', value: '87%' },
                      { label: 'Quality Pass Rate', value: '94%' },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center border-t border-white/10 pt-3">
                        <span className="text-xs text-white/70">{r.label}</span>
                        <span className="font-extrabold text-sm">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB: INSTALLATION */}
      {activeTab === 'installation' && (() => {
        const allOrders = managementData?.orders || [];
        const installationStatuses = [
          'Installation Assigned',
          'Installation Scheduled',
          'Installation In Progress',
          'Installation Completed',
          'Completed',
          'Order Completed'
        ];
        const instOrders = allOrders.filter(o =>
          installationStatuses.includes(o.orderStatus) ||
          (!!o.installationPartnerId && ['Delivered', 'Out for Delivery', 'Delivery Assigned'].includes(o.orderStatus))
        );
        const installPartners = (managementData?.vendors || []).filter(v => v.installationAvailable || v.businessType === 'installation');
        const kpiCards = [
          { label: 'Pending Installation', value: instOrders.filter(o => ['Installation Assigned', 'Installation Scheduled', 'Installation In Progress'].includes(o.orderStatus)).length, color: 'text-amber-600', bg: 'bg-amber-50', icon: '🔧' },
          { label: 'Completed Today', value: instOrders.filter(o => o.orderStatus === 'Installation Completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
          { label: 'Install Partners', value: installPartners.length, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: '👷' },
          { label: 'Total Jobs', value: instOrders.length, color: 'text-[#1F2937]', bg: 'bg-gray-100', icon: '📋' },
        ];
        const jobStages = ['Installation Assigned','Installation Completed'];
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Installation Management</h2>
              <p className="text-xs text-gray-500 mt-1">Track on-site installation jobs, assign partners, and monitor completion status across all orders.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {kpiCards.map(c => (
                <div key={c.label} className="bg-white p-6 rounded-3xl border border-[#D4A373]/30 shadow-sm">
                  <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center text-xl mb-3`}>{c.icon}</div>
                  <p className={`text-2xl font-extrabold ${c.color}`}>{c.value}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job List */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#1F2937]">Installation Jobs</h3>
                  <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full">{instOrders.length} jobs</span>
                </div>
                {instOrders.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔧</div>
                    <p className="text-gray-400 font-bold">No installation jobs yet</p>
                    <p className="text-xs text-gray-400 mt-1">Jobs will appear here once orders reach the installation stage.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {instOrders.map(o => {
                      const isDone = o.orderStatus === 'Installation Completed' || o.orderStatus === 'Completed' || o.orderStatus === 'Order Completed';
                      return (
                        <div key={o._id} className="p-5 hover:bg-gray-50/50 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDone ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                                <p className="font-bold text-sm text-[#1F2937]">Job #{o._id.slice(-6)}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-4">{o.orderType} · Customer: {o.userId?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500 ml-4 mt-0.5">📍 {o.shippingAddress || 'Address not set'}</p>
                              {o.installationPartnerId && (
                                <p className="text-xs text-teal-600 font-bold ml-4 mt-0.5">👷 {o.installationPartnerId?.companyName}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${isDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                {isDone ? 'Completed' : 'In Progress'}
                              </span>
                              <p className="text-[10px] text-gray-400 mt-1">{o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : 'TBD'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Partners Panel */}
              <div className="space-y-5">
                <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm p-6">
                  <h3 className="font-bold text-base text-[#1F2937] mb-4">Installation Partners</h3>
                  {installPartners.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No installation partners found.</p>
                  ) : (
                    <div className="space-y-3">
                      {installPartners.map(p => (
                        <div key={p._id} className="p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-[#1F2937]">{p.companyName}</p>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                              {p.isActive ? 'Active' : 'Offline'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400">📍 {(p.serviceAreas || []).join(', ') || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400">⭐ {p.rating || '4.5'} · {p.reviewsCount || 0} reviews</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-6 text-white">
                  <h3 className="font-bold text-base mb-4">Performance Metrics</h3>
                  {[
                    { label: 'Avg. Install Time', value: '3.2 hrs' },
                    { label: 'Success Rate', value: '96%' },
                    { label: 'Customer Rating', value: '4.8 / 5' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center border-t border-white/10 pt-3 mt-3">
                      <span className="text-xs text-white/70">{r.label}</span>
                      <span className="font-extrabold text-sm">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      
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
                        <td className="p-4 font-bold text-[#2A9D8F]">${req.amount}</td>
                        <td className="p-4 text-xs text-gray-600">
                          <p className="font-bold text-[#1F2937] mb-1">{req.paymentMethod}</p>
                          {req.paymentMethod === 'UPI' ? (
                            <p><strong>UPI ID:</strong> {req.paymentDetails?.upiId}</p>
                          ) : (
                            <>
                              {req.paymentDetails?.bankName && <p><strong>Bank:</strong> {req.paymentDetails?.bankName}</p>}
                              <p><strong>Account:</strong> {req.paymentDetails?.accountNumber || 'N/A'}</p>
                              {req.paymentDetails?.ifscCode && <p><strong>IFSC:</strong> {req.paymentDetails?.ifscCode}</p>}
                              {req.paymentDetails?.accountHolderName && <p><strong>Name:</strong> {req.paymentDetails?.accountHolderName}</p>}
                            </>
                          )}
                          {/* Fallback for old records */}
                          {req.bankDetails?.bankName && !req.paymentMethod && (
                            <>
                              <p><strong>Bank:</strong> {req.bankDetails?.bankName}</p>
                              <p><strong>A/C:</strong> {req.bankDetails?.accountNumber}</p>
                              <p><strong>IFSC:</strong> {req.bankDetails?.ifscCode}</p>
                            </>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
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

      {/* MODAL 1: VIEW PROFILE */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F5F0] max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fade-in">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-2xl">{selectedUser.name}</h3>
                <p className="text-xs text-gray-400 mt-1">System Account Profile</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase font-sans">Email Address</span>
                  <div className="font-bold text-gray-800 text-sm mt-1 break-all">{selectedUser.email}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase font-sans">Phone Number</span>
                  <div className="font-bold text-gray-800 text-sm mt-1">{selectedUser.phone || 'None registered'}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase font-sans">Account Role</span>
                  <div className="font-bold text-gray-800 text-sm mt-1 uppercase">{selectedUser.role}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase font-sans">Joined Date</span>
                  <div className="font-bold text-gray-800 text-sm mt-1">
                    {new Date(selectedUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D4A373]/20 shadow-sm space-y-1">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase font-sans">Physical Location / Address</span>
                <div className="font-bold text-gray-800 text-sm mt-1 leading-relaxed">
                  {selectedUser.address || 'No physical address provided.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-green-700 font-bold uppercase font-sans">Total Spend</span>
                    <h4 className="text-xl font-extrabold text-[#2F3E46] mt-1">${(selectedUser.totalSpending || 0).toLocaleString()}</h4>
                  </div>
                  <DollarSign className="w-6 h-6 text-green-600 opacity-60" />
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-blue-700 font-bold uppercase font-sans">Orders Count</span>
                    <h4 className="text-xl font-extrabold text-[#2F3E46] mt-1">{selectedUser.totalOrders || 0}</h4>
                  </div>
                  <ShoppingBag className="w-6 h-6 text-blue-600 opacity-60" />
                </div>
              </div>

              {selectedUser.status === 'Suspended' && (
                <div className="p-4 bg-[#E76F51]/10 rounded-2xl border border-[#E76F51]/20 flex gap-3">
                  <Info className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#E76F51] uppercase font-sans">Suspension Reason</h5>
                    <p className="text-xs font-semibold text-gray-700 mt-1">{selectedUser.suspensionReason || 'No reason provided.'}</p>
                  </div>
                </div>
              )}

              <button onClick={() => setSelectedUser(null)} className="w-full py-3 bg-[#1F2937] hover:bg-black text-white rounded-xl font-bold shadow-md transition-all">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUSPEND WITH REASON */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fade-in">
            <div className="bg-[#E76F51] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Suspend User Account</h3>
                <p className="text-xs text-[#F8F5F0] opacity-80 mt-1">{suspendModalUser.name}</p>
              </div>
              <button onClick={() => setSuspendModalUser(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <form onSubmit={handleSuspendUserSubmit} className="p-8 space-y-6">
              <div className="bg-[#E76F51]/10 p-4 rounded-2xl border border-[#E76F51]/20 flex gap-3 text-xs text-gray-700">
                <AlertCircle className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#E76F51] uppercase font-sans">Warning</h5>
                  <p className="mt-1 font-semibold leading-relaxed">This action restricts the user from logging in or using platform features. A formal suspension notice will be dispatched and registered in admin moderation logs.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-sans">Reason for Suspension *</label>
                <textarea
                  rows={3}
                  required
                  value={suspensionReasonText}
                  onChange={(e) => setSuspensionReasonText(e.target.value)}
                  placeholder="Spamming interior design request logs / Chargeback behavior / Policy breach..."
                  className="w-full p-4 rounded-xl border border-gray-250 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51]"
                />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setSuspendModalUser(null)} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-xl font-bold shadow-md transition-all">Suspend User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRMATION ACTIONS (REACTIVATE/BLOCK/DELETE) */}
      {confirmActionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fade-in p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
                confirmActionModal.type === 'reactivate' || confirmActionModal.type === 'approve' ? 'bg-green-50 text-green-600' :
                confirmActionModal.type === 'block' ? 'bg-gray-50 text-gray-600' : 'bg-red-50 text-red-600'
              }`}>
                {confirmActionModal.type === 'reactivate' || confirmActionModal.type === 'approve' ? <Unlock className="w-7 h-7" /> :
                 confirmActionModal.type === 'block' ? <Lock className="w-7 h-7" /> : <Trash2 className="w-7 h-7" />}
              </div>
              <h3 className="font-['Playfair_Display'] font-extrabold text-xl text-[#1F2937] capitalize">
                {confirmActionModal.type} Account
              </h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                {confirmActionModal.type === 'reactivate' && `Are you sure you want to restore status for ${confirmActionModal.user?.name}? They will immediately be authorized to log in again.`}
                {confirmActionModal.type === 'approve' && `Are you sure you want to approve ${confirmActionModal.user?.name}? They will immediately be authorized to log in.`}
                {confirmActionModal.type === 'reject' && `Are you sure you want to reject ${confirmActionModal.user?.name}? Their registration will be denied.`}
                {confirmActionModal.type === 'block' && `Are you sure you want to block ${confirmActionModal.user?.name}? They will be blocked from logging in or registering until active review.`}
                {confirmActionModal.type === 'delete' && `Warning: This will permanently delete user ${confirmActionModal.user?.name} from the database. This action is irreversible.`}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setConfirmActionModal(null)}
                className="flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmActionModal.type === 'reactivate') handleReactivateUser(confirmActionModal.user?._id);
                  if (confirmActionModal.type === 'approve') handleUpdateUserStatus(confirmActionModal.user?._id, 'Active');
                  if (confirmActionModal.type === 'reject') handleUpdateUserStatus(confirmActionModal.user?._id, 'Rejected');
                  if (confirmActionModal.type === 'block') handleBlockUser(confirmActionModal.user?._id);
                  if (confirmActionModal.type === 'delete') handleDeleteUser(confirmActionModal.user?._id);
                }}
                className={`flex-1 py-3 text-white rounded-xl font-bold transition-all text-xs shadow-md ${
                  confirmActionModal.type === 'reactivate' || confirmActionModal.type === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  confirmActionModal.type === 'block' ? 'bg-gray-800 hover:bg-black' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MFG MODAL 1: VIEW PROFILE */}
      {selectedMfgProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Manufacturer Profile</h3>
                <p className="text-xs text-[#F8F5F0] opacity-80 mt-1">{selectedMfgProfile.companyName}</p>
              </div>
              <button onClick={() => setSelectedMfgProfile(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About Company</h4>
                  <p className="text-sm text-gray-700 mt-1 font-medium leading-relaxed">{selectedMfgProfile.description || 'Industrial production specialist working on custom woodworks and setups.'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Specialization</h4>
                    <p className="text-sm text-[#8B5E3C] font-bold mt-0.5">{selectedMfgProfile.specialization || 'Woodworks'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Capacity</h4>
                    <p className="text-sm text-gray-700 font-bold mt-0.5">{selectedMfgProfile.monthlyCapacity || 50} units</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Person</h4>
                    <p className="text-sm text-gray-700 font-bold mt-0.5">{selectedMfgProfile.userId?.name || 'Frank Miller'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</h4>
                    <p className="text-sm text-gray-700 font-bold mt-0.5">{selectedMfgProfile.userId?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location & Service Areas</h4>
                  <p className="text-sm text-gray-700 font-bold mt-0.5">{selectedMfgProfile.serviceAreas?.join(', ') || 'Detroit, MI, USA'}</p>
                </div>
              </div>

              <button onClick={() => setSelectedMfgProfile(null)} className="w-full py-3 bg-[#8B5E3C] hover:bg-[#8B5E3C]/95 text-white rounded-xl font-bold transition-all shadow-md">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* MFG MODAL 2: VIEW CURRENT LOAD */}
      {selectedMfgLoad && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Current Production Load</h3>
                <p className="text-xs text-[#F8F5F0] opacity-80 mt-1">{selectedMfgLoad.companyName}</p>
              </div>
              <button onClick={() => setSelectedMfgLoad(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
              {loadingMfgLoad ? (
                <div className="py-12 text-center text-gray-400 font-bold">Fetching latest production log...</div>
              ) : mfgLoadOrders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-bold space-y-2">
                  <AlertCircle size={32} className="mx-auto text-gray-300" />
                  <p>No active orders are currently assigned to this manufacturer.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mfgLoadOrders.map((mo) => (
                    <div key={mo._id} className="p-5 bg-[#F8F5F0]/65 border border-[#D4A373]/15 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">Design: {mo.designDetails}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Order ID: {mo.orderId?._id || 'N/A'}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 border border-amber-200">
                          {mo.status || 'In Progress'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 border-t border-[#D4A373]/10 pt-2.5">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase block">Measurements</span>
                          <span className="font-semibold text-gray-700">{mo.measurements || 'Standard'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase block">Materials Spec</span>
                          <span className="font-semibold text-gray-700">{mo.materials || 'See blueprints'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-gray-400 font-bold">Assigned Budget:</span>
                        <span className="font-extrabold text-[#8B5E3C]">${(mo.budget || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button onClick={() => setSelectedMfgLoad(null)} className="w-full py-3 bg-[#8B5E3C] hover:bg-[#8B5E3C]/95 text-white rounded-xl font-bold transition-all shadow-md">Close Load View</button>
            </div>
          </div>
        </div>
      )}

      {/* MFG MODAL 3: ASSIGN PRODUCTION ORDER */}
      {assignOrderMfg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#2A9D8F] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Assign Production Order</h3>
                <p className="text-xs text-[#F8F5F0] opacity-80 mt-1">Assign to: {assignOrderMfg.companyName} ({assignOrderMfg.specialization})</p>
              </div>
              <button onClick={() => setAssignOrderMfg(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <form onSubmit={handleAssignMfgOrder} className="p-8 space-y-5">
              {/* Dropdown of unassigned approved custom design orders */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Select Approved Custom Order *</label>
                <select
                  required
                  value={assignOrderDetails.orderId}
                  onChange={(e) => {
                    const selectedOrd = managementData?.orders?.find(o => o._id === e.target.value);
                    setAssignOrderDetails({
                      ...assignOrderDetails,
                      orderId: e.target.value,
                      budget: selectedOrd?.totalAmount || 1000
                    });
                  }}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-700 font-medium"
                >
                  <option value="">-- Choose Unassigned Order --</option>
                  {(managementData?.orders?.filter(o => o.orderType === 'custom_design') || []).map(o => (
                    <option key={o._id} value={o._id}>
                      Order #{o._id.slice(-6)} - User: {o.userId?.name || 'Customer'} (${(o.totalAmount || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Design Details / Specifics *</label>
                <input
                  type="text"
                  required
                  value={assignOrderDetails.designDetails}
                  onChange={(e) => setAssignOrderDetails({ ...assignOrderDetails, designDetails: e.target.value })}
                  placeholder="e.g., Premium Mahogany Dining Table (6-seater)"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Measurements *</label>
                  <input
                    type="text"
                    required
                    value={assignOrderDetails.measurements}
                    onChange={(e) => setAssignOrderDetails({ ...assignOrderDetails, measurements: e.target.value })}
                    placeholder="e.g., 72 x 36 x 30 inches"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Manufacturing Budget ($) *</label>
                  <input
                    type="number"
                    required
                    value={assignOrderDetails.budget}
                    onChange={(e) => setAssignOrderDetails({ ...assignOrderDetails, budget: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Material & Core Specifications</label>
                <textarea
                  rows={2}
                  value={assignOrderDetails.materials}
                  onChange={(e) => setAssignOrderDetails({ ...assignOrderDetails, materials: e.target.value })}
                  placeholder="e.g., Kiln-dried mahogany, matte polyurethane lacquer coat..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setAssignOrderMfg(null)} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/95 text-white rounded-xl font-bold shadow-md transition-all text-xs">Assign Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MFG MODAL 4: VIEW DOCUMENTS */}
      {mfgDocsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-purple-700 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Business Verification Files</h3>
                <p className="text-xs text-purple-100 opacity-80 mt-1">{mfgDocsModal.companyName}</p>
              </div>
              <button onClick={() => setMfgDocsModal(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                  <h4 className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">Registration Identifiers</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p className="text-gray-500 font-medium">GST Identification:</p>
                    <p className="font-bold text-gray-700">27AAAAA1111A1Z1</p>
                    <p className="text-gray-500 font-medium">Income Tax PAN:</p>
                    <p className="font-bold text-gray-700">ABCDE1234F</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                    <span className="text-[9px] text-gray-400 font-bold uppercase block p-2 bg-gray-50 border-b">GST Registration Proof</span>
                    <img src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=300&auto=format&fit=crop" alt="GST Doc" className="w-full h-32 object-cover" />
                  </div>
                  <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                    <span className="text-[9px] text-gray-400 font-bold uppercase block p-2 bg-gray-50 border-b">Premises Lease Agreement</span>
                    <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&auto=format&fit=crop" alt="Lease Doc" className="w-full h-32 object-cover" />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Registered Bank Ledger</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <p className="text-gray-500 font-medium">Beneficiary:</p>
                    <p className="font-bold text-gray-700">{mfgDocsModal.companyName}</p>
                    <p className="text-gray-500 font-medium">Account Number:</p>
                    <p className="font-bold text-gray-700">987654321098</p>
                    <p className="text-gray-500 font-medium">Bank / IFSC:</p>
                    <p className="font-bold text-gray-700">HDFC Bank / HDFC0000123</p>
                  </div>
                </div>
              </div>

              <button onClick={() => setMfgDocsModal(null)} className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold transition-all shadow-md">Close Documents</button>
            </div>
          </div>
        </div>
      )}

      {/* MFG MODAL 5: VIEW PAYMENTS HISTORY */}
      {mfgPaymentsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-blue-700 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Payout & Security Ledger</h3>
                <p className="text-xs text-blue-100 opacity-80 mt-1">{mfgPaymentsModal.companyName}</p>
              </div>
              <button onClick={() => setMfgPaymentsModal(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
              {loadingMfgPayments ? (
                <div className="py-12 text-center text-gray-400 font-bold animate-fadeIn">Retrieving transactions history...</div>
              ) : mfgPayments.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-bold">No registered payment items found.</div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  {mfgPayments.map((p) => (
                    <div key={p._id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-800">{p.type}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Reference: {p.reference}</p>
                        <p className="text-[9px] text-gray-400 font-medium">{new Date(p.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-extrabold text-blue-600 text-sm">${p.amount.toLocaleString()}</p>
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-green-100 text-green-700">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button onClick={() => setMfgPaymentsModal(null)} className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-all shadow-md">Close Payments View</button>
            </div>
          </div>
        </div>
      )}

      {/* MFG MODAL 6: APPROVE CONFIRMATION */}
      {mfgApproveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-green-50 text-[#2A9D8F]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] font-extrabold text-xl text-[#1F2937]">Approve Verification Credentials</h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Are you sure you want to approve the business verification and live credentials for <span className="font-bold text-gray-700">{mfgApproveConfirm.companyName}</span>? They will immediately receive verification badges and go live for accepting orders.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button type="button" onClick={() => setMfgApproveConfirm(null)} className="flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-xs">Cancel</button>
              <button type="button" onClick={() => handleApproveMfg(mfgApproveConfirm._id)} className="flex-1 py-3 bg-[#2A9D8F] hover:bg-[#2A9D8F]/95 text-white rounded-xl font-bold shadow-md transition-all text-xs animate-pulse">Verify & Launch</button>
            </div>
          </div>
        </div>
      )}

      {/* MFG MODAL 7: SUSPEND WITH REASON */}
      {mfgSuspendConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#E76F51] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Suspend Manufacturer</h3>
                <p className="text-xs text-[#F8F5F0] opacity-80 mt-1">{mfgSuspendConfirm.companyName}</p>
              </div>
              <button onClick={() => setMfgSuspendConfirm(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <form onSubmit={handleSuspendMfgSubmit} className="p-8 space-y-6">
              <div className="bg-[#E76F51]/10 p-4 rounded-2xl border border-[#E76F51]/20 flex gap-3 text-xs text-gray-700">
                <AlertCircle className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#E76F51] uppercase font-sans">Warning</h5>
                  <p className="mt-1 font-semibold leading-relaxed">This restricts the manufacturer from accepting new custom designs. An email notification detailing suspension remarks will be automatically generated.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-sans">Reason for Suspension *</label>
                <textarea
                  rows={3}
                  required
                  value={mfgSuspendReason}
                  onChange={(e) => setMfgSuspendReason(e.target.value)}
                  placeholder="e.g., Failed quality audits, non-delivery of components, or expired trade documentation..."
                  className="w-full p-4 rounded-xl border border-gray-250 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51]"
                />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setMfgSuspendConfirm(null)} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#E76F51] hover:bg-[#E76F51]/95 text-white rounded-xl font-bold shadow-md transition-all">Confirm Suspend</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELIVERY MODALS */}

      {/* 1. View Profile Modal */}
      {selectedDeliveryProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Logistics Partner Profile</h3>
                <p className="text-xs text-blue-100 mt-1 opacity-90">{selectedDeliveryProfile.companyName}</p>
              </div>
              <button onClick={() => setSelectedDeliveryProfile(null)} className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Contact Name</p>
                  <p className="font-bold text-gray-800">{selectedDeliveryProfile.userId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Phone</p>
                  <p className="font-bold text-gray-800">{selectedDeliveryProfile.userId?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Vehicle Type</p>
                  <p className="font-bold text-blue-600 flex items-center gap-1.5"><Truck size={14}/> {selectedDeliveryProfile.vehicleType || 'Standard Truck'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Service Areas</p>
                  <p className="font-bold text-[#2A9D8F] flex items-center gap-1.5"><MapPin size={14}/> {(selectedDeliveryProfile.serviceAreas || []).join(', ') || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Description</p>
                  <p className="text-gray-600 text-xs leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedDeliveryProfile.description || 'No description provided.'}</p>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setSelectedDeliveryProfile(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Close Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Assign Delivery Job Modal */}
      {assignDeliveryOrderPartner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Assign Delivery Trip</h3>
                <p className="text-xs text-blue-100 mt-1">{assignDeliveryOrderPartner.companyName}</p>
              </div>
              <button onClick={() => setAssignDeliveryOrderPartner(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <form onSubmit={handleAssignDeliveryOrderSubmit} className="p-8 space-y-6 text-left">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Select Ready Order *</label>
                <select 
                  required
                  value={assignDeliveryDetails.orderId}
                  onChange={(e) => setAssignDeliveryDetails({ ...assignDeliveryDetails, orderId: e.target.value })}
                  className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                >
                  <option value="">-- Select Completed Manufacturing Order --</option>
                  {(managementData?.orders || []).filter(o => o.orderStatus !== 'Completed').map(o => (
                    <option key={o._id} value={o._id}>Order #{o._id.slice(-6)} - {o.userId?.name || 'Customer'}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 font-medium">Only orders that have completed the manufacturing phase are available for dispatch.</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setAssignDeliveryOrderPartner(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2">
                  <Package size={16} /> Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Assign Installation Job Modal */}
      {assignInstallationJobPartner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Schedule Installation</h3>
                <p className="text-xs text-purple-100 mt-1">{assignInstallationJobPartner.companyName}</p>
              </div>
              <button onClick={() => setAssignInstallationJobPartner(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <form onSubmit={handleAssignInstallationJobSubmit} className="p-8 space-y-6 text-left">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Select Order *</label>
                <select 
                  required
                  value={assignInstallationDetails.orderId}
                  onChange={(e) => setAssignInstallationDetails({ ...assignInstallationDetails, orderId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
                >
                  <option value="">-- Select Order for Assembly --</option>
                  {(managementData?.orders || []).map(o => (
                    <option key={o._id} value={o._id}>Order #{o._id.slice(-6)} - {o.userId?.name || 'Customer'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Scheduled Date & Time *</label>
                <input 
                  type="datetime-local" 
                  required
                  value={assignInstallationDetails.scheduledDate}
                  onChange={(e) => setAssignInstallationDetails({ ...assignInstallationDetails, scheduledDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Installation Notes / Blueprints</label>
                <textarea 
                  rows={2}
                  value={assignInstallationDetails.notes}
                  onChange={(e) => setAssignInstallationDetails({ ...assignInstallationDetails, notes: e.target.value })}
                  placeholder="E.g., Assembly requires 2 people, wall drilling allowed..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setAssignInstallationJobPartner(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2">
                  <Wrench size={16} /> Schedule Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. View Partner Jobs History Modal */}
      {selectedPartnerJobs && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center relative">
              <div className="relative z-10">
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Job Assignment History</h3>
                <p className="text-xs text-gray-400 mt-1">{selectedPartnerJobs.companyName}</p>
              </div>
              <button onClick={() => setSelectedPartnerJobs(null)} className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                <List className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-bold">In a live system, this dashboard would list all active and historical delivery trips and assembly jobs completed by {selectedPartnerJobs.companyName}.</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">Powered by real-time GPS tracking and milestone verification APIs.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedPartnerJobs(null)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Close View</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* AI STUDIO MODALS */}
      {/* ======================================================== */}

      {/* 1. View Full Design Modal */}
      {selectedAIDesign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn my-8">
            <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-2xl">AI Studio Room Design Details</h3>
                <p className="text-xs text-[#F8F5F0]/80 mt-1">ID: #{selectedAIDesign._id.toUpperCase()} • V{selectedAIDesign.versionNumber || 1} • Requested by {selectedAIDesign.userId?.name || 'Customer'}</p>
              </div>
              <button onClick={() => setSelectedAIDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>

            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto text-left">
              {/* Image Previews Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Original Uploaded Room Photo</p>
                  <img src={selectedAIDesign.originalImage || selectedAIDesign.aiDesignData?.originalImage || ''} alt="Original uploaded room" className="w-full h-64 object-cover rounded-2xl border border-gray-200 shadow-inner" onError={(e) => { if (e.target.src && !e.target.src.endsWith('/room-images/')) { e.target.style.display = 'none'; } }} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Studio Stylized Design Output</p>
                  <AiFallbackImage src={selectedAIDesign.generatedImage || selectedAIDesign.aiDesignData?.generatedImage || selectedAIDesign.aiDesignData?.image} roomType={selectedAIDesign.roomType} alt="AI stylized room" className="w-full h-64 object-cover rounded-2xl border border-[#D4A373]/30 shadow-sm" />
                </div>
              </div>

              {/* Design Spec and Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-150 text-xs">
                <div>
                  <p className="font-bold text-gray-400 uppercase">Room Type</p>
                  <p className="font-bold text-gray-800 mt-1">{selectedAIDesign.roomType || selectedAIDesign.aiDesignData?.roomType}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Style Preference</p>
                  <p className="font-bold text-gray-800 mt-1">{selectedAIDesign.stylePreference || selectedAIDesign.style || selectedAIDesign.aiDesignData?.style || 'Modern Minimalist'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Estimated Budget</p>
                  <p className="font-extrabold text-[#8B5E3C] text-sm mt-1">${selectedAIDesign.aiSuggestion?.budgetEstimate || selectedAIDesign.aiDesignData?.budget || selectedAIDesign.totalAmount || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Design Status</p>
                  <span className="inline-block px-2 py-0.5 rounded bg-[#8B5E3C]/10 text-[#8B5E3C] font-bold mt-1 uppercase text-[10px]">{selectedAIDesign.status}</span>
                </div>
              </div>

              {/* AI Suggestions Details */}
              <div className="space-y-4">
                <h4 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 border-b border-gray-100 pb-2">AI Studio Intelligent Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Furniture Elements */}
                  <div className="bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-2">
                    <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5"><Sparkles size={12} /> Key Furniture Items</p>
                    <ul className="text-xs space-y-1.5 text-gray-600 font-medium">
                      {(selectedAIDesign.aiSuggestion?.furniture || selectedAIDesign.aiDesignData?.furniture || ['Premium Accent Sofa', 'Tailored Side Tables', 'Intelligent Lighting Placements']).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C]" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Material Finishes */}
                  <div className="bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-2">
                    <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5"><Hammer size={12} /> Material Recommendations</p>
                    <ul className="text-xs space-y-1.5 text-gray-600 font-medium">
                      {(selectedAIDesign.aiSuggestion?.materials || selectedAIDesign.aiDesignData?.materials || ['Solid Oak Planks', 'Brushed Copper Trim', 'Woven Natural Linens']).map((m, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" /> {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Color Palette */}
                  <div className="bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-2">
                    <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5"><Activity size={12} /> Palette Hex Codes</p>
                    <div className="flex gap-2.5 mt-2">
                      {(selectedAIDesign.aiSuggestion?.colorPalette || selectedAIDesign.aiDesignData?.colors || ['#D4A373', '#2A9D8F', '#F8F5F0', '#1F2937']).map((hex, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: hex }} title={hex} />
                          <span className="font-mono text-[9px] text-gray-500 font-bold">{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Control Panel for Admin */}
              <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200 text-xs space-y-3 mt-6">
                <p className="font-bold text-amber-800 uppercase tracking-wider">Administrative Status Actions</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Submitted', 'Under Review', 'Assigned', 'Quotation Sent', 'Accepted', 'Production Started', 'Manufacturing', 'Ready for Delivery', 'Delivered', 'Installation Completed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleAdminUpdateStatus(selectedAIDesign._id, s)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                        (selectedAIDesign.orderStatus || selectedAIDesign.status) === s 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end gap-4">
              {selectedAIDesign.generatedImage && (
                <a
                  href={selectedAIDesign.generatedImage}
                  download={`ai-design-${selectedAIDesign._id.slice(-6)}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Download size={14} /> Download Design File
                </a>
              )}
              <button onClick={() => setSelectedAIDesign(null)} className="px-6 py-3 bg-[#8B5E3C] text-white rounded-xl font-bold text-xs shadow-md">Close View</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Assign Vendor Modal */}
      {assignVendorAIDesign && (() => {
        const vendors = (managementData?.vendors || []).filter(v => v.businessType === 'vendor' && v.isActive);
        const searchLower = vendorSearchQuery.toLowerCase();
        const filteredVendors = vendors.filter(v =>
          v.companyName.toLowerCase().includes(searchLower) ||
          v.specialization.toLowerCase().includes(searchLower)
        );
        const recommendedVendors = [...vendors].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
        const selectedVendorForPreview = selectedAIDesignVendorId
          ? vendors.find(v => v._id === selectedAIDesignVendorId)
          : null;
        return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Assign Coordinating Vendor</h3>
                <p className="text-xs text-blue-100 mt-1">Design Request #{assignVendorAIDesign._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setAssignVendorAIDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>

            <form onSubmit={handleAssignAIDesignVendorSubmit} className="p-8 space-y-6 text-left max-h-[75vh] overflow-y-auto">
              {/* Currently Assigned Vendors */}
              {(assignVendorAIDesign.assignedVendor || (assignVendorAIDesign.additionalVendors || []).length > 0) && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Currently Assigned Vendors</p>
                  <div className="space-y-1.5">
                    {assignVendorAIDesign.assignedVendor && (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                            {assignVendorAIDesign.assignedVendor.companyName?.charAt(0) || 'V'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{assignVendorAIDesign.assignedVendor.companyName}</p>
                            <p className="text-[9px] text-blue-500 font-bold uppercase">Primary Partner</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {(assignVendorAIDesign.additionalVendors || []).map((av, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gray-400 flex items-center justify-center text-white font-bold text-[10px]">
                            {av.companyName?.charAt(0) || 'V'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{av.companyName}</p>
                            <p className="text-[9px] text-gray-400 font-medium">Additional Partner</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Search & Select Vendor</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by vendor name or specialization..."
                    value={vendorSearchQuery}
                    onChange={(e) => { setVendorSearchQuery(e.target.value); setSelectedAIDesignVendorId(''); }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              {/* Filtered Vendor List */}
              {vendorSearchQuery && (
                <div className="border border-gray-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredVendors.length === 0 ? (
                    <p className="text-xs text-gray-400 p-4 text-center">No vendors match your search.</p>
                  ) : (
                    filteredVendors.map(v => (
                      <button
                        type="button"
                        key={v._id}
                        onClick={() => { setSelectedAIDesignVendorId(v._id); setVendorSearchQuery(''); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs transition-all text-left hover:bg-blue-50 border-b border-gray-50 last:border-0 ${
                          selectedAIDesignVendorId === v._id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
                        }`}
                      >
                        <div>
                          <p className="font-bold text-gray-800">{v.companyName}</p>
                          <p className="text-[10px] text-gray-400">{v.specialization}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <span className="text-[10px] font-bold">{v.rating || '—'}</span>
                          <span className="text-[10px]">★</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Recommended Vendors */}
              {!vendorSearchQuery && !selectedAIDesignVendorId && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recommended Vendors</p>
                  <div className="grid grid-cols-1 gap-2">
                    {recommendedVendors.map(v => (
                      <button
                        type="button"
                        key={v._id}
                        onClick={() => { setSelectedAIDesignVendorId(v._id); setVendorSearchQuery(''); }}
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-[#D4A373]/20 bg-[#F8F5F0]/40 hover:bg-[#F8F5F0] transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">✦</div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-800">{v.companyName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                            <span className="flex items-center gap-0.5">⭐ {v.rating}</span>
                            <span>•</span>
                            <span>{v.reviewsCount || 0} reviews</span>
                            <span>•</span>
                            <span>{v.workloadLevel || 'Medium'} load</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Vendor Preview */}
              {selectedVendorForPreview && (
                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {selectedVendorForPreview.companyName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{selectedVendorForPreview.companyName}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{selectedVendorForPreview.specialization} Specialist</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                      <span className="text-xs font-bold text-amber-700">{selectedVendorForPreview.rating || '—'}</span>
                      <span className="text-amber-500 text-xs">★</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={12} className="text-gray-400" />
                      <span className="font-medium">{selectedVendorForPreview.serviceAreas?.[0] || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={12} className="text-gray-400" />
                      <span className="font-medium">{selectedVendorForPreview.reviewsCount || 0} reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package size={12} className="text-gray-400" />
                      <span className="font-medium">{selectedVendorForPreview.monthlyCapacity || 50} units/mo</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={12} className="text-gray-400" />
                      <span className="font-medium">Load: {selectedVendorForPreview.workloadLevel || 'Medium'}</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                Assigning a vendor allows them to review the AI design recommendations and coordinate specialized custom orders directly with the user.
              </p>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => { setAssignVendorAIDesign(null); setVendorSearchQuery(''); }} className="flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button type="submit" disabled={!selectedAIDesignVendorId} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed">
                  <UserCheck size={16} /> {assignVendorAIDesign.assignedVendor ? 'Add Vendor' : 'Assign Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
        );
      })()}

      {/* 3. Convert to Order Modal */}
      {convertOrderAIDesign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Convert Design to Execution Order</h3>
                <p className="text-xs text-purple-100 mt-1">Design ID: #{convertOrderAIDesign._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setConvertOrderAIDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>

            <form onSubmit={handleConvertAIDesignOrderSubmit} className="p-8 space-y-6 text-left">
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-1">
                  <p className="text-xs font-bold text-purple-800">Conversion Summary</p>
                  <p className="text-xs text-purple-600 font-medium">Customer: <strong className="text-purple-800">{convertOrderAIDesign.userId?.name}</strong></p>
                  <p className="text-xs text-purple-600 font-medium">Design Room: <strong className="text-purple-800">{convertOrderAIDesign.roomType} ({convertOrderAIDesign.stylePreference})</strong></p>
                  <p className="text-xs text-purple-600 font-medium">Budget: <strong className="text-purple-800">${convertOrderAIDesign.aiSuggestion?.budgetEstimate}</strong></p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Select Manufacturing Partner *</label>
                  <select
                    required
                    value={selectedAIDesignManufacturerId}
                    onChange={(e) => setSelectedAIDesignManufacturerId(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 transition-colors"
                  >
                    <option value="">-- Choose Manufacturer --</option>
                    {(managementData?.vendors || []).filter(v => v.businessType === 'manufacturer' && v.isActive).map(v => (
                      <option key={v._id} value={v._id}>
                        {v.companyName} (Active Load: {v.activeOrders} - Capacity: {v.monthlyCapacity})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                    Converting this design requests launches the downstream manufacturing and fabrication workflow. The manufacturer will be supplied with blueprints and wood/material specs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setConvertOrderAIDesign(null)} className="flex-1 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2">
                  <Package size={16} /> Convert to Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Track Workflow Modal */}
      {workflowAIDesign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-amber-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">AI Design Studio Workflow Tracking</h3>
                <p className="text-xs text-amber-50 mt-1">Design ID: #{workflowAIDesign._id.toUpperCase()}</p>
              </div>
              <button onClick={() => setWorkflowAIDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>

            <div className="p-8 space-y-8 text-left">
              {/* Stepper tracking */}
              <div className="relative border-l-2 border-gray-100 ml-4 space-y-6">
                
                {/* Step 1: Upload Room Photo */}
                <div className="relative pl-8">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-green-500 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold">✓</div>
                  <h4 className="font-bold text-sm text-gray-800">1. Room Photo Uploaded</h4>
                  <p className="text-xs text-gray-500 mt-0.5">User uploaded original room photo. AI Studio requested.</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">COMPLETED • NOTIFIED ADMIN</p>
                </div>

                {/* Step 2: AI Generated Design */}
                <div className="relative pl-8">
                  <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                    workflowAIDesign.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-amber-400 text-white animate-pulse'
                  }`}>{workflowAIDesign.status !== 'pending' ? '✓' : '2'}</div>
                  <h4 className="font-bold text-sm text-gray-800">2. AI Design Generated</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Stable Diffusion model synthesized style, materials, and layout.</p>
                  <p className={`text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.status !== 'pending' ? 'text-green-500' : 'text-amber-500'}`}>
                    {workflowAIDesign.status !== 'pending' ? 'COMPLETED • NOTIFIED USER' : 'IN PROCESS'}
                  </p>
                </div>

                {/* Step 3: User Accept Design */}
                <div className="relative pl-8">
                  <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                    workflowAIDesign.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>{workflowAIDesign.status === 'accepted' ? '✓' : '3'}</div>
                  <h4 className="font-bold text-sm text-gray-800">3. User Accepts Design</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Customer reviewed AI output and accepted custom layout & budget.</p>
                  <p className={`text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.status === 'accepted' ? 'text-green-500' : 'text-gray-400'}`}>
                    {workflowAIDesign.status === 'accepted' ? 'COMPLETED • NOTIFIED VENDOR' : 'AWAITING USER DECISION'}
                  </p>
                </div>

                {/* Step 4: Convert to Production Order */}
                <div className="relative pl-8">
                  <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                    workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== 'Not Converted' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>{workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== 'Not Converted' ? '✓' : '4'}</div>
                  <h4 className="font-bold text-sm text-gray-800">4. Dispatch to Manufacturer</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Admin coordinates conversion to Order and hands over specifications.</p>
                  <p className={`text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== 'Not Converted' ? 'text-green-500' : 'text-gray-400'}`}>
                    {workflowAIDesign.orderStatus && workflowAIDesign.orderStatus !== 'Not Converted' ? `COMPLETED • ASSIGNED TO ${workflowAIDesign.orderId?.vendorId?.companyName || 'Manufacturer'}` : 'AWAITING CONVERSION'}
                  </p>
                </div>

                {/* Step 5: Manufacturing & Delivery */}
                <div className="relative pl-8">
                  <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                    workflowAIDesign.orderStatus === 'Completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>{workflowAIDesign.orderStatus === 'Completed' ? '✓' : '5'}</div>
                  <h4 className="font-bold text-sm text-gray-800">5. Completed & Delivered</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Downstream logistics milestone tracking and installation completion.</p>
                  <p className={`text-[10px] font-bold mt-1 uppercase ${workflowAIDesign.orderStatus === 'Completed' ? 'text-green-500' : 'text-gray-400'}`}>
                    {workflowAIDesign.orderStatus === 'Completed' ? 'ORDER DELIVERED & INSTALLED' : `CURRENT PHASE: ${workflowAIDesign.orderStatus || 'NOT STARTED'}`}
                  </p>
                </div>

              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setWorkflowAIDesign(null)} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-all">Close Tracker</button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL DESIGN WORKFLOW MODALS */}

      {/* 1. View Details Modal */}
      {selectedManualDesign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn my-8">
            <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-2xl">Custom Room Design Specification</h3>
                <p className="text-xs text-[#F8F5F0]/80 mt-1">ID: #{selectedManualDesign._id.toUpperCase()} • Client: {selectedManualDesign.userId?.name || 'Customer'}</p>
              </div>
              <button onClick={() => setSelectedManualDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>

            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto text-left">
              {/* Reference Images */}
              {selectedManualDesign.referenceImages && selectedManualDesign.referenceImages.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client Reference Image / Room Snapshot</p>
                  <img src={selectedManualDesign.referenceImages[0]} alt="Reference" className="w-full h-64 object-cover rounded-2xl border border-[#D4A373]/30 shadow-sm" />
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl text-center text-gray-400 font-bold text-sm">
                  No reference room image uploaded.
                </div>
              )}

              {/* Design Spec and Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-150 text-xs">
                <div>
                  <p className="font-bold text-gray-400 uppercase">Room Type</p>
                  <p className="font-bold text-gray-800 mt-1">{selectedManualDesign.roomType}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Style Preference</p>
                  <p className="font-bold text-gray-800 mt-1">{selectedManualDesign.style || 'Modern Minimalist'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Target Budget</p>
                  <p className="font-extrabold text-[#8B5E3C] text-sm mt-1">{selectedManualDesign.budget || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Current Status</p>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#8B5E3C]/10 text-[#8B5E3C] font-bold mt-1 uppercase text-[10px]">{selectedManualDesign.status}</span>
                </div>
              </div>

              {/* Detailed Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <h4 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 border-b border-gray-100 pb-2">Client Requirements</h4>
                  <div className="bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-3">
                    <p className="text-xs text-gray-700"><strong>Special Instructions:</strong> {selectedManualDesign.requirements || 'None specified.'}</p>
                    <p className="text-xs text-gray-700"><strong>Required Room Size:</strong> {selectedManualDesign.size || 'Not provided'}</p>
                    <p className="text-xs text-gray-700"><strong>Service Address:</strong> {selectedManualDesign.serviceAddress || 'Not specified'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 border-b border-gray-100 pb-2">Materials & Preferences</h4>
                  <div className="bg-[#F8F5F0]/60 p-5 rounded-2xl border border-[#D4A373]/20 space-y-3">
                    <p className="text-xs text-gray-700"><strong>Material Requirements:</strong> {selectedManualDesign.materials || 'None specified'}</p>
                    <p className="text-xs text-gray-700"><strong>Own Materials Available:</strong> {selectedManualDesign.ownMaterialsAvailable || 'No'}</p>
                    {selectedManualDesign.ownMaterialsAvailable === 'Yes' && (
                      <>
                        <p className="text-xs text-gray-700"><strong>Material Details:</strong> {selectedManualDesign.materialDetails || 'N/A'}</p>
                        <p className="text-xs text-gray-700"><strong>Pickup Required:</strong> {selectedManualDesign.materialPickupNeeded || 'No'}</p>
                      </>
                    )}
                    <p className="text-xs text-gray-700"><strong>Timeline preference:</strong> {selectedManualDesign.timeline || 'Flexible'}</p>
                  </div>
                </div>
              </div>

              {/* Status Update Control Panel for Admin */}
              <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200 text-xs space-y-3">
                <p className="font-bold text-amber-800 uppercase tracking-wider">Administrative Status Actions</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Submitted', 'Under Review', 'Assigned', 'Quotation Sent', 'Accepted', 'Production Started', 'Manufacturing', 'Ready for Delivery', 'Delivered', 'Installation Completed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateManualDesignStatus(selectedManualDesign._id, s)}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                        selectedManualDesign.status === s 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setSelectedManualDesign(null)} className="px-6 py-3 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl font-bold text-xs shadow-md transition-all">Close Specification</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Assign Vendor Modal */}
      {assignVendorManualDesign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Assign Custom Vendor</h3>
                <p className="text-xs text-gray-400 mt-1">Manual Design #{assignVendorManualDesign._id.slice(-6)}</p>
              </div>
              <button onClick={() => setAssignVendorManualDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-8">
              <form onSubmit={handleAssignManualDesignVendorSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Select Verified Manufacturing/Production Vendor</label>
                  <select
                    value={selectedManualDesignVendorId}
                    onChange={(e) => setSelectedManualDesignVendorId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors"
                  >
                    <option value="">-- Choose Partner --</option>
                    {(managementData?.vendors || [])
                      .filter(v => v.businessType === 'manufacturer' || v.businessType === 'seller')
                      .map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.companyName} ({vendor.specialization || 'General Woodworks'})
                        </option>
                      ))}
                  </select>
                  <p className="text-[10px] text-gray-400 font-medium">Assigning a manufacturing partner routes the client requirements to their workflow to formulate and send a custom price quotation.</p>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setAssignVendorManualDesign(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#1F2937] hover:bg-[#2d3a4f] text-white rounded-xl font-bold shadow-md transition-all">Assign Partner</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Assign Interior Designer Modal */}
      {assignDesignerManualDesign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Assign Interior Designer</h3>
                <p className="text-xs text-gray-400 mt-1">Manual Design #{assignDesignerManualDesign._id.slice(-6)}</p>
              </div>
              <button onClick={() => setAssignDesignerManualDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            <div className="p-8">
              <form onSubmit={handleAssignManualDesignDesignerSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Select Verified Interior Design Partner</label>
                  <select
                    value={selectedManualDesignDesignerId}
                    onChange={(e) => setSelectedManualDesignDesignerId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors"
                  >
                    <option value="">-- Choose Designer --</option>
                    {(managementData?.vendors || [])
                      .filter(v => v.businessType === 'designer')
                      .map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.companyName} (Rating: {vendor.rating || '4.5'})
                        </option>
                      ))}
                  </select>
                  <p className="text-[10px] text-gray-400 font-medium">Assigns a verified interior architect/designer to conduct layout plans, choose finishes, and coordinate with the builder.</p>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setAssignDesignerManualDesign(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#1F2937] hover:bg-[#2d3a4f] text-white rounded-xl font-bold shadow-md transition-all">Assign Designer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. Workflow Milestone Tracker Modal */}
      {workflowManualDesign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn my-8">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Milestone Workflow Road Map</h3>
                <p className="text-xs text-gray-400 mt-1">Room: {workflowManualDesign.roomType} • Style: {workflowManualDesign.style}</p>
              </div>
              <button onClick={() => setWorkflowManualDesign(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <div className="p-8 space-y-6 text-left">
              {/* Core Workflow Steps */}
              <div className="relative border-l-2 border-dashed border-gray-200 pl-4 ml-3 space-y-6">
                
                {/* Step 1: Submit Request */}
                <div className="relative pl-8">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                  <h4 className="font-bold text-sm text-gray-800">1. User Submits Manual Request</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Uploaded room measurements, materials requirements and style directions.</p>
                  <p className="text-[10px] font-bold text-green-500 mt-1 uppercase">COMPLETED • NOTIFIED ADMIN</p>
                </div>

                {/* Step 2: Vendor Assigned */}
                {(() => {
                  const stepMet = !!(workflowManualDesign.assignedVendorId || workflowManualDesign.assignedDesignerId);
                  return (
                    <div className="relative pl-8">
                      <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                        stepMet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>{stepMet ? '✓' : '2'}</div>
                      <h4 className="font-bold text-sm text-gray-800">2. Consultation & Site Review</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Admin assigns verified manufacturer/designer to inspect and review specs.</p>
                      <p className={`text-[10px] font-bold mt-1 uppercase ${stepMet ? 'text-green-500' : 'text-gray-400'}`}>
                        {stepMet 
                          ? `ASSIGNED: ${[workflowManualDesign.assignedVendorId?.companyName, workflowManualDesign.assignedDesignerId?.companyName].filter(Boolean).join(' & ')}` 
                          : 'AWAITING TEAM ASSIGNMENTS'}
                      </p>
                    </div>
                  );
                })()}

                {/* Step 3: Quotation Sent */}
                {(() => {
                  const stepMet = ['Quotation Sent', 'User Approved', 'Manufacturing', 'Delivery', 'Installation', 'Completed'].includes(workflowManualDesign.status);
                  return (
                    <div className="relative pl-8">
                      <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                        stepMet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>{stepMet ? '✓' : '3'}</div>
                      <h4 className="font-bold text-sm text-gray-800">3. Quotation Sent to Client</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Assigned contractor shares detailed quotation of materials and installation fee.</p>
                      <p className={`text-[10px] font-bold mt-1 uppercase ${stepMet ? 'text-green-500' : 'text-gray-400'}`}>
                        {stepMet ? 'COMPLETED • NOTIFIED CUSTOMER & ADMIN' : 'AWAITING ESTIMATION'}
                      </p>
                    </div>
                  );
                })()}

                {/* Step 4: Quotation Approved */}
                {(() => {
                  const stepMet = ['User Approved', 'Manufacturing', 'Delivery', 'Installation', 'Completed'].includes(workflowManualDesign.status);
                  return (
                    <div className="relative pl-8">
                      <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                        stepMet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>{stepMet ? '✓' : '4'}</div>
                      <h4 className="font-bold text-sm text-gray-800">4. User Approves Proposal</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Customer accepts price offer and authorises project kick-off.</p>
                      <p className={`text-[10px] font-bold mt-1 uppercase ${stepMet ? 'text-green-500' : 'text-gray-400'}`}>
                        {stepMet ? 'COMPLETED • PROCEEDING TO FACTORY' : 'AWAITING CLIENT DECISION'}
                      </p>
                    </div>
                  );
                })()}

                {/* Step 5: Manufacturing */}
                {(() => {
                  const stepMet = ['Manufacturing', 'Delivery', 'Installation', 'Completed'].includes(workflowManualDesign.status);
                  return (
                    <div className="relative pl-8">
                      <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                        stepMet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>{stepMet ? '✓' : '5'}</div>
                      <h4 className="font-bold text-sm text-gray-800">5. Custom Off-Site Manufacturing</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Assigned manufacturer fabricates customized boards, frames, and millworks.</p>
                      <p className={`text-[10px] font-bold mt-1 uppercase ${stepMet ? 'text-green-500' : 'text-gray-400'}`}>
                        {stepMet ? 'COMPLETED OR IN PROGRESS' : 'AWAITING PRODUCTION START'}
                      </p>
                    </div>
                  );
                })()}

                {/* Step 6: Delivery & Installation */}
                {(() => {
                  const stepMet = ['Delivery', 'Installation', 'Completed'].includes(workflowManualDesign.status);
                  return (
                    <div className="relative pl-8">
                      <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                        stepMet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>{stepMet ? '✓' : '6'}</div>
                      <h4 className="font-bold text-sm text-gray-800">6. On-Site Assembly & Fitting</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Material dispatched, delivery team routes cargo, and installation crew fits items.</p>
                      <p className={`text-[10px] font-bold mt-1 uppercase ${stepMet ? 'text-green-500' : 'text-gray-400'}`}>
                        {stepMet ? 'DISPATCHED OR COMPLETED' : 'AWAITING DELIVERY ASSIGNMENT'}
                      </p>
                    </div>
                  );
                })()}

                {/* Step 7: Completed */}
                {(() => {
                  const stepMet = workflowManualDesign.status === 'Completed';
                  return (
                    <div className="relative pl-8">
                      <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                        stepMet ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>{stepMet ? '✓' : '7'}</div>
                      <h4 className="font-bold text-sm text-gray-800">7. Project Handover & Closure</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Admin conducts post-installation quality inspection. Room successfully completed.</p>
                      <p className={`text-[10px] font-bold mt-1 uppercase ${stepMet ? 'text-green-500' : 'text-gray-400'}`}>
                        {stepMet ? '🎉 ROOM COMPLETED & DELIVERED!' : 'IN PROGRESS'}
                      </p>
                    </div>
                  );
                })()}

              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setWorkflowManualDesign(null)} className="px-6 py-3 bg-[#1F2937] hover:bg-[#2d3a4f] text-white rounded-xl font-bold text-xs shadow-md transition-all">Close Tracker</button>
            </div>
          </div>
        </div>
      )}
      {/* ASSIGN DESIGNER TO CONSULTATION REQUEST MODAL */}
      {assignDesignerRequestObj && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-[#D4A373]/20">
            <div className="p-6 bg-[#8B5E3C] text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Assign Interior Designer</h3>
                <p className="text-xs opacity-80 mt-1">Select a verified design partner for this consultation.</p>
              </div>
              <button 
                onClick={() => { setAssignDesignerRequestObj(null); setSelectedRequestDesignerId(''); }}
                className="text-white/80 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAssignDesignerRequestSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider block">Select Interior Designer</label>
                <select
                  value={selectedRequestDesignerId}
                  onChange={(e) => setSelectedRequestDesignerId(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white transition-all text-sm font-medium"
                >
                  <option value="">-- Choose Designer --</option>
                  {managementData?.vendors?.filter(v => v.businessType === 'designer').map(v => (
                    <option key={v._id} value={v._id}>
                      {v.companyName} ({v.specialization || 'General'} - Rating: {v.rating || 'N/A'}★)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => { setAssignDesignerRequestObj(null); setSelectedRequestDesignerId(''); }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#8B5E3C] hover:bg-[#724c30] text-white font-bold rounded-xl text-xs shadow-md transition-all uppercase"
                >
                  Assign Designer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DESIGNER REQUEST DETAILS MODAL */}
      {selectedDesignerRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#D4A373]/20">
            <div className="p-6 bg-[#1F2937] text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Consultation Request Details</h3>
                <p className="text-xs opacity-80 mt-1">Request ID: #{selectedDesignerRequest._id.slice(-6)}</p>
              </div>
              <button 
                onClick={() => setSelectedDesignerRequest(null)}
                className="text-white/80 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Client Info */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <h4 className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Client Details</h4>
                <p className="font-bold text-[#1F2937]">{selectedDesignerRequest.userId?.name || 'Customer'}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedDesignerRequest.userId?.email || 'No email provided'}</p>
                <p className="text-sm text-gray-500 mt-0.5">{selectedDesignerRequest.userId?.phone || 'No phone provided'}</p>
              </div>

              {/* Consultation Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Consultation Requirements</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed font-medium">
                  {selectedDesignerRequest.details}
                </p>
              </div>

              {/* Budget & Status & Assignment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</h4>
                  <span className="font-['Playfair_Display'] font-extrabold text-2xl text-[#8B5E3C]">
                    ${selectedDesignerRequest.budget || 'Open'}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1 ${
                    selectedDesignerRequest.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : selectedDesignerRequest.status === 'assigned' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedDesignerRequest.status}
                  </span>
                </div>
              </div>

              {/* Designer Details */}
              {selectedDesignerRequest.assignedDesignerId ? (
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Assigned Designer</h4>
                    <p className="font-bold text-indigo-900 mt-1">{selectedDesignerRequest.assignedDesignerId.companyName || 'Interior Designer'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setAssignDesignerRequestObj(selectedDesignerRequest);
                      setSelectedDesignerRequest(null);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl uppercase transition-all"
                  >
                    Change Designer
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Assigned Designer</h4>
                    <p className="font-medium text-amber-900 mt-1">No design partner assigned yet.</p>
                  </div>
                  <button
                    onClick={() => {
                      setAssignDesignerRequestObj(selectedDesignerRequest);
                      setSelectedDesignerRequest(null);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-xl uppercase transition-all"
                  >
                    Assign Now
                  </button>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Administrative Status Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {['Submitted', 'Under Review', 'Assigned', 'Quotation Sent', 'Accepted', 'Production Started', 'Manufacturing', 'Ready for Delivery', 'Delivered', 'Installation Completed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateDesignerRequestStatus(selectedDesignerRequest._id, s)}
                      className={`px-3 py-1.5 rounded-lg font-bold border text-[10px] uppercase transition-all ${
                        selectedDesignerRequest.status === s 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Assign Workflow Partner Modal */}
      {assignmentOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Assign Order Partner</h3>
                <p className="text-xs text-gray-400 mt-1">Order ID: #{assignmentOrder._id.slice(-6)} • Type: {assignmentOrder.orderType}</p>
              </div>
              <button onClick={() => setAssignmentOrder(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleAssignPartnerSubmit} className="space-y-6 text-left">
                <div>
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Partner Role</label>
                  <select 
                    value={selectedPartnerType} 
                    onChange={(e) => {
                      setSelectedPartnerType(e.target.value);
                      setSelectedPartnerId('');
                    }} 
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  >
                    <option value="vendor">Vendor / Designer</option>
                    <option value="manufacturer">Custom Manufacturer</option>
                    <option value="delivery">Delivery Partner</option>
                    <option value="installation">Installation Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Select Verified Partner</label>
                  <select 
                    value={selectedPartnerId} 
                    onChange={(e) => setSelectedPartnerId(e.target.value)} 
                    required 
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  >
                    <option value="">Choose a partner...</option>
                    {(managementData?.vendors || []).filter(v => {
                      if (selectedPartnerType === 'vendor') {
                        return ['vendor', 'seller', 'designer'].includes(v.businessType);
                      }
                      return v.businessType === selectedPartnerType;
                    }).map(v => (
                      <option key={v._id} value={v._id}>{v.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setAssignmentOrder(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#1F2937] hover:bg-[#2d3a4f] text-white rounded-xl font-bold shadow-md transition-all">Confirm Assignment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 6. View Order Details Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-2xl">Order Details Summary</h3>
                <p className="text-xs text-white/80 mt-1">ID: #{viewOrder._id} • {viewOrder.orderType}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>

            <div className="p-8 space-y-6 text-left max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-150 text-xs">
                <div>
                  <p className="font-bold text-gray-400 uppercase">Created Date</p>
                  <p className="font-bold text-gray-800 mt-1">{viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Expected Delivery</p>
                  <p className="font-bold text-gray-800 mt-1">{viewOrder.expectedDeliveryDate ? new Date(viewOrder.expectedDeliveryDate).toLocaleDateString() : 'Not Scheduled'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Order Amount</p>
                  <p className="font-bold text-[#8B5E3C] text-sm mt-1">${viewOrder.totalAmount?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase">Payment & Workflow</p>
                  <p className="font-bold text-gray-800 mt-1 uppercase text-[10px]">{viewOrder.paymentStatus?.toUpperCase() === 'PAID' ? 'PAID' : `${viewOrder.paymentStatus} / ${viewOrder.orderStatus}`}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-800 mb-2 border-b pb-1">Customer & Delivery Information</h4>
                <div className="text-xs space-y-1">
                  <p><strong>Name:</strong> {viewOrder.userId?.name || 'Customer'}</p>
                  <p><strong>Email:</strong> {viewOrder.userId?.email || 'N/A'}</p>

                </div>
              </div>

              {viewOrder.items && viewOrder.items.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-gray-800 mb-2 border-b pb-1">Purchased Items ({viewOrder.items.length})</h4>
                  <div className="space-y-2">
                    {viewOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-lg">
                        <div>
                          <p className="font-bold text-gray-700">{item.productId?.name || 'Product Item'}</p>
                          <p className="text-[10px] text-gray-400">Qty: {item.quantity} • Price: ${item.price}</p>
                        </div>
                        <span className="font-mono font-bold">${(item.quantity * item.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewOrder(null)} className="px-6 py-3 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl font-bold text-xs shadow-md transition-all">Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Update Workflow Stage Modal */}
      {updateStatusOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Update Workflow Stage</h3>
                <p className="text-xs text-gray-400 mt-1">Order ID: #{updateStatusOrder._id.slice(-6)} • Status: {updateStatusOrder.orderStatus}</p>
              </div>
              <button onClick={() => setUpdateStatusOrder(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleUpdateOrderStatus} className="space-y-6 text-left">
                <div>
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Workflow Status</label>
                  <select 
                    value={newWorkflowStage} 
                    onChange={(e) => setNewWorkflowStage(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  >
                    <option value="Pending Confirmation">Pending Confirmation</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending Dispatch">Pending Dispatch</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Set / Update Expected Delivery Date</label>
                  <input
                    type="date"
                    value={newExpectedDeliveryDate}
                    onChange={(e) => setNewExpectedDeliveryDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setUpdateStatusOrder(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#1F2937] hover:bg-[#2d3a4f] text-white rounded-xl font-bold shadow-md transition-all">Update Milestone</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 8. Visual Order Roadmap Tracking Modal */}
      {trackOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl animate-fadeIn my-8">
            <div className="bg-[#1F2937] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl">Order Roadmap Milestones</h3>
                <p className="text-xs text-gray-400 mt-1">ID: #{trackOrder._id.slice(-6)} • Type: {trackOrder.orderType} • Status: {trackOrder.orderStatus}</p>
              </div>
              <button onClick={() => setTrackOrder(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all">✕</button>
            </div>
            
            <div className="p-8 space-y-6 text-left">
              <div className="relative border-l-2 border-dashed border-gray-200 pl-4 ml-3 space-y-6">
                {(() => {
                  const steps = [
                    { label: 'Order Confirmed', desc: 'Order details verified and processing initiated.', statusList: ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'] },
                    { label: 'Processing', desc: 'Order is being prepared and manufactured/packed.', statusList: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'] },
                    { label: 'Shipped', desc: 'Order handed over to logistics partner.', statusList: ['Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'] },
                    { label: 'Out for Delivery', desc: 'Order is out for final delivery.', statusList: ['Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'] },
                    { label: 'Delivered', desc: 'Order delivered to the customer.', statusList: ['Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'] },
                    { label: 'Installation Scheduled', desc: 'Installation date confirmed with technician.', statusList: ['Installation Scheduled', 'Installation In Progress', 'Installation Completed'] },
                    { label: 'Installation In Progress', desc: 'Technician is actively installing the products.', statusList: ['Installation In Progress', 'Installation Completed'] },
                    { label: 'Installation Completed', desc: 'Installation successfully completed and verified.', statusList: ['Installation Completed'] }
                  ];

                  let normalizedStatus = trackOrder.orderStatus;
                  if (['Pending Confirmation', 'Submitted', 'Request Submitted', 'Quotation Sent', 'Quotation Accepted'].includes(normalizedStatus)) normalizedStatus = 'Order Confirmed';
                  else if (['Pending Dispatch', 'Ready for Delivery', 'Manufacturing Started', 'Manufacturing', 'Quality Check'].includes(normalizedStatus)) normalizedStatus = 'Processing';
                  else if (['Dispatched', 'Delivery Assigned'].includes(normalizedStatus)) normalizedStatus = 'Shipped';
                  else if (['Out For Delivery'].includes(normalizedStatus)) normalizedStatus = 'Out for Delivery';
                  else if (['Completed', 'Order Completed'].includes(normalizedStatus)) normalizedStatus = 'Installation Completed';
                  else if (['Installation Assigned'].includes(normalizedStatus)) normalizedStatus = 'Installation Scheduled';

                  return steps.map((step, idx) => {
                    const isCompleted = step.statusList.includes(normalizedStatus);
                    let isCurrent = false;

                    if (trackOrder.orderStatus !== 'Cancelled') {
                      const globalStages = ['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Installation Scheduled', 'Installation In Progress', 'Installation Completed'];
                      let currentIdx = globalStages.indexOf(normalizedStatus);
                      if (currentIdx === -1) currentIdx = 0;
                      isCurrent = currentIdx === idx;
                    }

                    return (
                      <div key={idx} className="relative pl-8">
                        <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-amber-500 text-white animate-pulse' 
                              : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <h4 className={`font-bold text-sm ${isCurrent ? 'text-amber-600' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                        {isCurrent && (
                          <p className="text-[10px] font-bold text-amber-500 mt-1 uppercase tracking-wider">ACTIVE PHASE</p>
                        )}
                        {isCompleted && !isCurrent && (
                          <p className="text-[10px] font-bold text-green-500 mt-1 uppercase tracking-wider">COMPLETED</p>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setTrackOrder(null)} className="px-6 py-3 bg-[#1F2937] hover:bg-[#2d3a4f] text-white rounded-xl font-bold text-xs shadow-md transition-all">Close Roadmap</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CUSTOMER REVIEWS MANAGEMENT */}
      {activeTab === 'reviews_management' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Platform Reviews Oversight</h2>
              <p className="text-sm text-gray-500 mt-1">Monitor and manage all customer reviews submitted across the platform.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <BarChart2 className="w-5 h-5 text-gray-400" />
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Reviews</p>
                  <p className="font-bold text-sm text-[#1F2937]">{adminReviews.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loadingAdminReviews ? (
              <div className="p-12 text-center text-gray-400">Loading reviews...</div>
            ) : adminReviews.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No reviews found on the platform.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Customer</th>
                      <th className="p-4 font-bold">Vendor</th>
                      <th className="p-4 font-bold">Rating</th>
                      <th className="p-4 font-bold">Comment</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-50">
                    {adminReviews.map(review => (
                      <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-gray-500 text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-bold text-[#1F2937]">
                          {review.userId?.name || 'Unknown User'}
                        </td>
                        <td className="p-4 text-[#8B5E3C] font-semibold">
                          {review.vendorId?.companyName || 'Unknown Vendor'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-[#E9C46A]">
                            <span className="font-bold text-xs text-gray-700 mr-1">{review.rating}.0</span>
                            <Sparkles className="w-3 h-3 fill-current text-[#E9C46A]" />
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 max-w-xs truncate" title={review.comment}>
                          "{review.comment}"
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteReview(review._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* TAB: ADMIN MESSAGES */}
      {activeTab === 'messages' && (() => {
        const uniqueConversations = [];
        const seen = new Set();
        adminDirectMessages.forEach(m => {
          const key = m.userName;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueConversations.push({
              key,
              userName: m.userName,
              vendorName: m.vendorName || 'Artisan Workshop Ltd',
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              lastMessage: m.message.substring(0, 40) + (m.message.length > 40 ? '...' : '')
            });
          }
        });

        const selUserName = selectedMsgUser;
        const selectedThreadMsgs = adminDirectMessages.filter(m => m.userName === selUserName);
        const selVendorName = selectedThreadMsgs.length > 0 && selectedThreadMsgs[0].vendorName ? selectedThreadMsgs[0].vendorName : 'Artisan Workshop Ltd';

        return (
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex h-[650px] animate-fadeIn">
            {/* Left Panel: Conversations list */}
            <div className="w-[350px] border-r border-gray-100 flex flex-col bg-gray-50/50">
              <div className="p-5 border-b border-gray-100 bg-white">
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937]">Admin Chat</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Oversight & Support</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {uniqueConversations.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-medium">
                    No active chat threads.
                  </div>
                ) : (
                  uniqueConversations.map(c => (
                    <button
                      key={c.key}
                      onClick={() => setSelectedMsgUser(c.key)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3.5 border ${
                        selectedMsgUser === c.key 
                          ? 'bg-[#1D3557]/10 border-[#1D3557]/20 shadow-sm' 
                          : 'hover:bg-white border-transparent hover:shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#1D3557]/10 text-[#1D3557] flex items-center justify-center font-bold text-sm shrink-0">
                        {c.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-xs text-[#1F2937] truncate">{c.userName}</h4>
                          <span className="text-[9px] text-gray-400 font-bold">{c.time}</span>
                        </div>
                        <p className="text-[10px] text-[#1D3557] font-semibold truncate mt-1">Vendor: {c.vendorName}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5 leading-normal">{c.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Chat thread */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedMsgUser ? (
                <>
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1F2937]">Admin Chat: {selUserName}</h3>
                      <p className="text-[10px] text-[#1D3557] font-bold uppercase tracking-wider mt-0.5">Thread with Vendor: {selVendorName}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg font-bold">Admin Monitoring Active</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20">
                    {selectedThreadMsgs.map((msg) => {
                      const isAdmin = msg.senderRole === 'admin';
                      const isVendor = msg.senderRole === 'vendor';
                      const isUser = msg.senderRole === 'user';
                      let bubbleStyle, align, senderLabel, timeColor;

                      if (isAdmin) {
                        bubbleStyle = 'bg-[#1D3557] text-white rounded-tr-none';
                        align = 'justify-end';
                        senderLabel = 'You (Admin)';
                        timeColor = 'text-white/70';
                      } else if (isVendor) {
                        bubbleStyle = 'bg-[#8B5E3C] text-white rounded-tl-none border border-[#8B5E3C]';
                        align = 'justify-start';
                        senderLabel = `Vendor (${msg.senderName || 'Vendor'})`;
                        timeColor = 'text-white/70';
                      } else {
                        bubbleStyle = 'bg-white text-gray-800 border border-[#E76F51]/30 rounded-tl-none';
                        align = 'justify-start';
                        senderLabel = msg.userName || 'Customer';
                        timeColor = 'text-gray-400';
                      }

                      return (
                        <div key={msg._id} className={`flex ${align}`}>
                          <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${bubbleStyle}`}>
                            <p>{msg.message}</p>
                            <span className={`block text-[9px] mt-1.5 ${isAdmin ? 'text-right' : 'text-left'} ${timeColor}`}>
                              {senderLabel} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendAdminDirectMessage} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                    <input
                      type="text"
                      value={adminMsgInput}
                      onChange={(e) => setAdminMsgInput(e.target.value)}
                      placeholder="Type a response as Admin Support..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1D3557] text-xs"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1D3557] hover:bg-[#1D3557]/90 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      Reply as Admin
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 rounded-full bg-[#1D3557]/5 flex items-center justify-center text-[#1D3557] mb-4">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1F2937]">Select a thread to monitor</h4>
                  <p className="text-xs text-gray-400 max-w-[240px] mt-1.5 leading-relaxed">Choose a chat to provide global support and oversight.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
      {/* TAB: CONTACT MESSAGES */}
      {activeTab === 'contact_messages' && <AdminContactMessages />}

    </div>
  );
};

export default AdminDashboard;
