import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Sparkles, Wand2, Hammer, Truck, UserCheck, Star, Zap } from 'lucide-react';

const PlanPremium = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2F3E46] via-[#263238] to-[#1F2937] py-20 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #D4A373 1px, transparent 1px), radial-gradient(circle at 80% 20%, #D4A373 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4A373] hover:underline mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-[#D4A373] text-[#2F3E46] rounded-full text-xs font-bold uppercase tracking-wider">⭐ Most Popular</span>
            <span className="px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">Premium Plan</span>
          </div>
          <h1 className="font-['Playfair_Display'] text-5xl font-extrabold text-white mb-2">Premium <span className="text-[#D4A373]">Artisan</span></h1>
          <p className="text-gray-300 text-xl mb-8">Complete end-to-end interior design execution with unlimited AI generations, custom manufacturing partnerships, and a dedicated 1-on-1 designer.</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="font-['Playfair_Display'] font-extrabold text-7xl text-white">$149</span>
            <span className="text-gray-400 text-lg">/ project · Per room transformation</span>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-[#D4A373] hover:bg-[#D4A373]/90 text-[#2F3E46] px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            Choose Premium — Start Your Project
          </button>
          <p className="text-gray-500 text-xs mt-3">One-time per project. No subscription required.</p>
        </div>
      </div>

      {/* What's Included */}
      <div className="max-w-5xl mx-auto py-16 px-6 space-y-12">
        <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm p-10 space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Everything in Premium Artisan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-[#6B7280]">
            {[
              { title: 'Unlimited AI Room Generations', desc: 'Regenerate as many times as you want until the design is perfect.' },
              { title: 'Custom Manufacturer Bidding', desc: 'Multiple verified manufacturers compete to give you the best price.' },
              { title: 'Priority White-Glove Delivery', desc: 'Dedicated logistics team with tracked, insured, doorstep delivery.' },
              { title: '1-on-1 Interior Designer Consultation', desc: 'Book a personal session with a certified ArtisanStudio designer.' },
              { title: 'Full Installation Team Dispatch', desc: 'Expert installation crew handles complete on-site assembly & fitting.' },
              { title: 'HD Design Export & Mood Boards', desc: 'Download full-resolution design previews and material mood boards.' },
              { title: 'Premium Material Palette', desc: 'Access luxury materials — marble, solid oak, velvet, and bespoke finishes.' },
              { title: 'Priority Support (4h Response)', desc: 'Dedicated support agent responds within 4 hours, any day.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 p-4 bg-[#F8F5F0] rounded-2xl border border-[#D4A373]/10">
                <CheckCircle className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1F2937]">{f.title}</p>
                  <p className="text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* End-to-End Process */}
        <div className="space-y-6">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Your Complete Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: <Wand2 className="w-6 h-6" />, step: '01', title: 'AI Design', desc: 'Upload room photos and receive unlimited AI redesigns until your vision is captured.', color: 'bg-[#8B5E3C]' },
              { icon: <UserCheck className="w-6 h-6" />, step: '02', title: 'Designer Call', desc: '1-on-1 with a certified ArtisanStudio designer to finalize specifications.', color: 'bg-[#D4A373] text-[#2F3E46]' },
              { icon: <Hammer className="w-6 h-6" />, step: '03', title: 'Manufacturing', desc: 'Matched with verified craftsmen. Track production milestones in real-time.', color: 'bg-[#2F3E46]' },
              { icon: <Truck className="w-6 h-6" />, step: '04', title: 'Delivery', desc: 'Insured, priority-tracked white-glove delivery to your doorstep.', color: 'bg-[#2A9D8F]' },
              { icon: <Zap className="w-6 h-6" />, step: '05', title: 'Installation', desc: 'Expert crew installs and fits everything exactly to design specifications.', color: 'bg-[#E76F51]' },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-[#D4A373]/30 shadow-sm p-6 space-y-3 text-center">
                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-white mx-auto`}>
                  {s.icon}
                </div>
                <p className="text-[#8B5E3C] text-[10px] font-bold uppercase tracking-widest">Step {s.step}</p>
                <h3 className="font-bold text-sm text-[#1F2937]">{s.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compare plans */}
        <div className="bg-white rounded-3xl border border-[#D4A373]/30 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Premium vs Essential</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Feature</th>
                <th className="text-center p-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Essential (Free)</th>
                <th className="text-center p-5 text-[#D4A373] font-bold uppercase text-[10px] tracking-wider bg-[#2F3E46]/5">Premium ($149)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'AI Room Generations', essential: '3', premium: 'Unlimited' },
                { feature: 'Material Palette', essential: 'Basic', premium: 'Premium + Luxury' },
                { feature: 'Interior Designer Consultation', essential: '—', premium: '1-on-1 Dedicated' },
                { feature: 'Custom Manufacturer Bidding', essential: '—', premium: '✓ Included' },
                { feature: 'White-Glove Delivery', essential: '—', premium: 'Priority Track' },
                { feature: 'Installation Team', essential: '—', premium: '✓ Full Dispatch' },
                { feature: 'Support Response Time', essential: '48 hours', premium: '4 hours' },
                { feature: 'HD Design Export', essential: '—', premium: '✓ Full Resolution' },
              ].map((row, idx) => (
                <tr key={row.feature} className={`border-b border-gray-50 ${idx % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="p-4 pl-8 font-medium text-gray-700">{row.feature}</td>
                  <td className="p-4 text-center text-gray-400">{row.essential}</td>
                  <td className="p-4 text-center font-bold text-[#2F3E46] bg-[#2F3E46]/5">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Testimonials */}
        <div className="space-y-4">
          <h2 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Premium Customer Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: 'Elena Rostova', role: 'Homeowner, New York', text: 'Uploading a photo of my outdated kitchen and seeing the AI redesign was mind-blowing. The Premium plan connected me to an amazing manufacturer — the custom cabinets are absolutely stunning.', rating: 5 },
              { name: 'Marcus Vance', role: 'Vance Premium Workshop (Vendor)', text: 'The Premium plan clients come with precise specs. As a manufacturer, this completely streamlined our bidding process. Quality projects, quality clients.', rating: 5 },
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
        <div className="bg-[#2F3E46] text-white rounded-3xl p-12 text-center space-y-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4A373 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10 space-y-5">
            <h2 className="font-['Playfair_Display'] font-bold text-3xl">Begin Your Premium Project Today</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">Create your free ArtisanStudio account and upgrade to Premium when you're ready to start your transformation.</p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-[#D4A373] hover:bg-[#D4A373]/90 text-[#2F3E46] px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Get Started — $149 per Project
            </button>
            <p className="text-gray-500 text-xs">No recurring subscription. One-time per room transformation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPremium;
