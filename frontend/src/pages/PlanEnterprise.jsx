import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Building2, Users, Layers, Shield, Phone, Mail, MapPin, Send, Star } from 'lucide-react';

const PlanEnterprise = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', teamSize: '', projectType: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to mockContactMessages and notify admin
    const newMsg = {
      _id: `enterprise_${Date.now()}`,
      name: `${form.name} (${form.company})`,
      email: form.email,
      message: `ENTERPRISE ENQUIRY — Team: ${form.teamSize}, Project: ${form.projectType}. Details: ${form.details}`,
      status: 'open',
      tag: 'enterprise',
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('mockContactMessages') || '[]');
    localStorage.setItem('mockContactMessages', JSON.stringify([newMsg, ...existing]));

    const adminNotifs = JSON.parse(localStorage.getItem('mockAdminNotifications') || '[]');
    const notif = {
      _id: `notif_ent_${Date.now()}`,
      message: `🏢 New Enterprise enquiry from ${form.name} at ${form.company} (${form.email}) — ${form.projectType}`,
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false,
    };
    localStorage.setItem('mockAdminNotifications', JSON.stringify([notif, ...adminNotifs]));

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1F2937] via-[#2F3E46] to-[#3D5A80] py-20 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #D4A373 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-[#D4A373] hover:underline text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-white/10 border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">Enterprise Plan</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-5xl font-extrabold">
              Enterprise <span className="text-[#D4A373]">/ Commercial</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">Purpose-built for hotels, offices, property developers, and large-scale commercial interior projects. Dedicated account management, bulk AI mapping, and wholesale vendor pricing.</p>
            <div className="flex items-baseline gap-2">
              <span className="font-['Playfair_Display'] font-extrabold text-6xl">₹499</span>
              <span className="text-gray-400 text-base">/ month · Custom enterprise pricing available</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-[#D4A373]">Trusted By Large-Scale Teams</p>
            {[
              { name: 'Grand Meridian Hotels', type: 'Hospitality Group', rooms: '12 Properties' },
              { name: 'NeoSpace Developers', type: 'Real Estate', rooms: '240 Units' },
              { name: 'Skyline Corporate Interiors', type: 'Commercial Design Firm', rooms: '30+ Office Projects' },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373] font-bold text-sm flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.type} · {c.rooms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features + Form */}
      <div className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Features */}
        <div className="space-y-8">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Enterprise-Grade Capabilities</h2>
          <div className="space-y-4">
            {[
              { icon: <Layers className="w-5 h-5" />, title: 'Bulk AI Spatial Mapping', desc: 'Process entire floors, properties, or hotel rooms simultaneously with batch AI design generation.' },
              { icon: <Users className="w-5 h-5" />, title: 'Dedicated Account Manager', desc: 'A single point of contact manages your entire ArtisanStudio relationship, from design to delivery.' },
              { icon: <Building2 className="w-5 h-5" />, title: 'Wholesale Vendor Pricing', desc: 'Unlock negotiated bulk pricing across our entire manufacturer and vendor network.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Full Installation Team Dispatch', desc: 'Nationwide installation teams fully coordinated and managed by ArtisanStudio operations.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Custom SLA Agreements', desc: 'Bespoke service-level agreements guaranteeing response times, quality standards, and delivery schedules.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Multi-Location Project Management', desc: 'Manage all your sites, rooms, and orders from one centralized enterprise dashboard.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Priority 24/7 Support', desc: 'Dedicated support line with guaranteed 1-hour response time around the clock.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'White-Label Design Reports', desc: 'Branded PDF design reports and material specs perfect for client or investor presentations.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 bg-white rounded-2xl border border-[#D4A373]/20 p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#1F2937]/5 text-[#1F2937] flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1F2937]">{f.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-[#F8F5F0] p-6 rounded-3xl border border-[#D4A373]/20 space-y-3">
            <div className="flex items-center gap-1 text-[#E9C46A]">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#E9C46A]" />)}
            </div>
            <p className="text-sm text-[#1F2937] italic">"ArtisanStudio's Enterprise plan transformed how we redesign our hotel properties. The dedicated manager handles everything — bulk AI room designs, manufacturer coordination, and installation scheduling. ROI was visible within 3 months."</p>
            <div>
              <p className="font-bold text-sm text-[#1F2937]">Aditya Menon</p>
              <p className="text-xs text-[#6B7280]">COO, Grand Meridian Hotels</p>
            </div>
          </div>
        </div>

        {/* Contact / Sales Form */}
        <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-xl overflow-hidden sticky top-8 self-start">
          <div className="bg-[#1F2937] p-6 text-white">
            <h2 className="font-['Playfair_Display'] font-bold text-xl">Contact Our Enterprise Sales Team</h2>
            <p className="text-gray-400 text-xs mt-1">We'll reach out within 2 business hours with a custom proposal tailored to your needs.</p>
          </div>
          <div className="p-8">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#2A9D8F]/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-[#2A9D8F]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937]">Enquiry Received!</h3>
                <p className="text-sm text-[#6B7280]">Our enterprise sales team will contact you at <strong className="text-[#8B5E3C]">{form.email}</strong> within 2 business hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ company: '', name: '', email: '', phone: '', teamSize: '', projectType: '', details: '' }); }}
                  className="mt-2 px-6 py-3 bg-[#1F2937] text-white rounded-xl font-bold text-sm transition-all hover:bg-[#2F3E46]"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1F2937] uppercase tracking-wider mb-1.5">Company Name *</label>
                    <input required type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Meridian Hotels Ltd." className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#1F2937] uppercase tracking-wider mb-1.5">Your Name *</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#1F2937] uppercase tracking-wider mb-1.5">Business Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" className="w-full pl-10 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#1F2937] uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full pl-10 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1F2937] uppercase tracking-wider mb-1.5">Team / Property Size</label>
                    <select value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C] bg-white">
                      <option value="">Select size...</option>
                      <option>1–10 Rooms / Units</option>
                      <option>10–50 Rooms / Units</option>
                      <option>50–200 Rooms / Units</option>
                      <option>200+ Rooms / Units</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#1F2937] uppercase tracking-wider mb-1.5">Project Type</label>
                    <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C] bg-white">
                      <option value="">Select type...</option>
                      <option>Hotel / Hospitality</option>
                      <option>Office / Corporate</option>
                      <option>Real Estate / Residential</option>
                      <option>Retail / Commercial</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#1F2937] uppercase tracking-wider mb-1.5">Project Details</label>
                  <textarea required rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Tell us about your project — scope, timeline, and any specific requirements..." className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#8B5E3C] resize-none" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#1F2937] hover:bg-[#2F3E46] text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Contact Enterprise Sales Team
                </button>
                <p className="text-[10px] text-gray-400 text-center">We respond within 2 business hours. No spam, ever.</p>
              </form>
            )}

            {/* Direct contacts */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Or Reach Us Directly</p>
              <a href="mailto:enterprise@artisanstudio.com" className="flex items-center gap-3 text-sm text-[#8B5E3C] hover:underline">
                <Mail className="w-4 h-4" /> enterprise@artisanstudio.com
              </a>
              <a href="tel:+918012345678" className="flex items-center gap-3 text-sm text-[#8B5E3C] hover:underline">
                <Phone className="w-4 h-4" /> +91 80 1234 5678
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4" /> Koramangala, Bangalore — HQ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanEnterprise;
