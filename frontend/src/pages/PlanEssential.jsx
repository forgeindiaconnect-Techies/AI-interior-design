import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Sparkles, Wand2, ShoppingBag, Star } from 'lucide-react';

const PlanEssential = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#F8F5F0] to-[#EDE8DF] py-20 px-6 border-b border-[#D4A373]/30">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:underline mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-xs font-bold uppercase tracking-wider">Free Plan</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-5xl font-extrabold text-[#1F2937] mb-4">Essential AI</h1>
          <p className="text-[#6B7280] text-xl mb-8">Perfect for homeowners looking to visualize and redesign a single room using the power of AI — completely free.</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="font-['Playfair_Display'] font-extrabold text-7xl text-[#8B5E3C]">₹0</span>
            <span className="text-[#6B7280] text-lg">/ Free Trial · No credit card required</span>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            Get Started Free — No Card Needed
          </button>
        </div>
      </div>

      {/* What's Included */}
      <div className="max-w-4xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Included */}
        <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm p-8 space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">What's Included</h2>
          <ul className="space-y-4 text-sm text-[#6B7280]">
            {[
              '3 AI Room Redesign Generations',
              'Basic Material Palette Selection',
              'Marketplace Browse & Access',
              'Standard Support Response (48h)',
              'Design Download & Share (JPEG)',
              'Mobile-Optimized Dashboard',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Included */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-gray-400">Not Available in Free Plan</h2>
          <ul className="space-y-4 text-sm text-gray-300">
            {[
              'Custom Manufacturer Bidding',
              'Dedicated Interior Designer',
              '1-on-1 Design Consultation',
              'Priority White-Glove Delivery',
              'Unlimited AI Generations',
              'Vendor Order Management',
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-gray-200 flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* How it works */}
        <div className="md:col-span-2 bg-[#2F3E46] text-white rounded-3xl p-10 space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl">How the Free Plan Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            {[
              { icon: <Wand2 className="w-6 h-6" />, step: '01', title: 'Upload Your Room', desc: 'Take a photo of your existing room and upload it to our AI design engine.' },
              { icon: <Sparkles className="w-6 h-6" />, step: '02', title: 'AI Generates Designs', desc: 'Our AI creates up to 3 stunning redesigns based on your style preferences and room dimensions.' },
              { icon: <ShoppingBag className="w-6 h-6" />, step: '03', title: 'Browse the Marketplace', desc: 'Explore our curated marketplace to find the products featured in your AI design.' },
            ].map((s) => (
              <div key={s.step} className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/20 border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373]">
                  {s.icon}
                </div>
                <p className="text-[#D4A373] text-[10px] font-bold uppercase tracking-widest">Step {s.step}</p>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade nudge */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] mb-1">Need more power?</h3>
            <p className="text-sm text-[#6B7280]">Upgrade to Premium Artisan at ₹149/project for unlimited AI generations, custom manufacturing, and a dedicated designer.</p>
          </div>
          <Link to="/plans/premium" className="flex-shrink-0 px-8 py-4 bg-[#D4A373] hover:bg-[#D4A373]/90 text-[#2F3E46] rounded-full font-bold shadow-md transition-all whitespace-nowrap">
            View Premium Plan →
          </Link>
        </div>

        {/* Testimonials */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">What Free Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: 'Priya M.', role: 'Homeowner, Bangalore', text: 'The free plan blew me away — 3 designs were more than enough to redesign my entire living room layout. Incredible tool!', rating: 5 },
              { name: 'James R.', role: 'Student, New York', text: 'As a student on a budget, the free plan gave me professional-looking designs I could share with my landlord. Zero cost, maximum value.', rating: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-[#F8F5F0] p-6 rounded-3xl border border-[#D4A373]/20 space-y-3">
                <div className="flex items-center gap-1 text-[#E9C46A]">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#E9C46A]" />)}
                </div>
                <p className="text-sm text-[#1F2937] italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-sm text-[#1F2937]">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="md:col-span-2 text-center py-8 space-y-4">
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">Ready to transform your space?</h2>
          <p className="text-[#6B7280]">Create your free account in under 2 minutes. No credit card required.</p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            Start Free Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanEssential;
