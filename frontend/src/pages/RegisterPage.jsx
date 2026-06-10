import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, CheckCircle, ShieldCheck, Armchair, Sparkles, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '', type: 'success' });
  const { register, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/dashboard/admin', { replace: true });
      else if (['vendor', 'manufacturer', 'delivery', 'installation'].includes(user.role)) navigate('/dashboard/vendor', { replace: true });
      else navigate('/dashboard/user', { replace: true });
    }
  }, [user, navigate]);

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { strength: 25, label: 'Weak', color: '#EF4444' };
    if (score === 2) return { strength: 50, label: 'Fair', color: '#F97316' };
    if (score === 3) return { strength: 75, label: 'Good', color: '#EAB308' };
    return { strength: 100, label: 'Strong', color: '#22C55E' };
  };

  const pwStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setModalInfo({ show: true, title: 'Missing Information', message: 'Please complete all required fields.', type: 'error' });
      return;
    }
    setError('');
    setLoading(true);
    const res = await register({ name, email, password, role: 'user', phone });
    setLoading(false);
    if (res.success) {
      setModalInfo({ show: true, title: 'Welcome to ArtisanStudio!', message: 'Your account has been created successfully. You can now log in and start designing your dream space.', type: 'success' });
    } else {
      let errorMsg = res.message || 'Something went wrong. Please try again.';
      if (errorMsg.toLowerCase().includes('already exists')) errorMsg = 'An account with this email already exists.';
      setModalInfo({ show: true, title: 'Registration Failed', message: errorMsg, type: 'error' });
    }
  };

  const handleModalClose = () => {
    if (modalInfo.type === 'success') navigate('/login');
    else setModalInfo({ ...modalInfo, show: false });
  };

  const features = [
    'AI-powered room design generation',
    'Access to 500+ premium furniture styles',
    'Real-time collaboration with designers',
    'Instant budget estimation & planning',
  ];

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1F2937 0%, #374151 50%, #2d1f14 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4A373, transparent)' }} />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5E3C, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #D4A373, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #8B5E3C, #D4A373)' }}>
              <div className="relative flex items-center justify-center">
                <Armchair className="w-6 h-6 text-white" />
                <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse w-3 h-3" />
              </div>
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              Artisan<span style={{ color: '#D4A373' }}>Studio</span>
            </span>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(212, 163, 115, 0.15)', color: '#D4A373', border: '1px solid rgba(212, 163, 115, 0.3)' }}>
              ✦ Interior Design Platform
            </span>
            <h2 className="font-bold text-4xl xl:text-5xl leading-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Design Your<br />
              <span style={{ color: '#D4A373' }}>Dream Space</span><br />
              with AI
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
              Join thousands of homeowners transforming their interiors with the power of artificial intelligence.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(42, 157, 143, 0.2)', border: '1px solid rgba(42, 157, 143, 0.4)' }}>
                  <Check className="w-3 h-3" style={{ color: '#2A9D8F' }} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {['#8B5E3C', '#2A9D8F', '#E76F51', '#E9C46A', '#6366F1'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                  {['A', 'S', 'M', 'R', 'K'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold text-sm">12,000+ Happy Users</p>
              <p className="text-gray-400 text-xs">⭐⭐⭐⭐⭐ 4.9/5 rating</p>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
          <p className="text-gray-300 text-sm italic leading-relaxed">
            "ArtisanStudio helped me redesign my entire living room in just one afternoon. The AI suggestions were spot on!"
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #8B5E3C, #D4A373)' }}>P</div>
            <div>
              <p className="text-white text-xs font-bold">Priya Sharma</p>
              <p className="text-gray-500 text-xs">Interior Design Enthusiast</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 bg-[#F8F5F0] overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5E3C, #D4A373)' }}>
              <Armchair className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">Artisan<span style={{ color: '#8B5E3C' }}>Studio</span></span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:underline transition-all" style={{ color: '#8B5E3C' }}>
                Sign in here
              </Link>
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5">
            {error && (
              <div className="p-4 rounded-2xl text-sm font-semibold text-center" style={{ background: 'rgba(231, 111, 81, 0.08)', border: '1px solid rgba(231, 111, 81, 0.25)', color: '#E76F51' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name <span style={{ color: '#E76F51' }}>*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: name ? '#8B5E3C' : '#E5E7EB', boxShadow: name ? '0 0 0 3px rgba(139,94,60,0.08)' : 'none', background: '#FAFAFA' }}
                    onFocus={e => { e.target.style.borderColor = '#8B5E3C'; e.target.style.boxShadow = '0 0 0 3px rgba(139,94,60,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = name ? '#8B5E3C' : '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address <span style={{ color: '#E76F51' }}>*</span></label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: '#E5E7EB', background: '#FAFAFA' }}
                    onFocus={e => { e.target.style.borderColor = '#8B5E3C'; e.target.style.boxShadow = '0 0 0 3px rgba(139,94,60,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password <span style={{ color: '#E76F51' }}>*</span></label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: '#E5E7EB', background: '#FAFAFA' }}
                    onFocus={e => { e.target.style.borderColor = '#8B5E3C'; e.target.style.boxShadow = '0 0 0 3px rgba(139,94,60,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pwStrength.strength}%`, backgroundColor: pwStrength.color }} />
                    </div>
                    <p className="text-xs font-semibold" style={{ color: pwStrength.color }}>
                      Password strength: {pwStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number <span className="text-gray-400 font-normal normal-case">(Optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all focus:outline-none"
                    style={{ borderColor: '#E5E7EB', background: '#FAFAFA' }}
                    onFocus={e => { e.target.style.borderColor = '#8B5E3C'; e.target.style.boxShadow = '0 0 0 3px rgba(139,94,60,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-400 leading-relaxed">
                By creating an account, you agree to our{' '}
                <span className="font-bold cursor-pointer hover:underline" style={{ color: '#8B5E3C' }}>Terms of Service</span>{' '}
                and{' '}
                <span className="font-bold cursor-pointer hover:underline" style={{ color: '#8B5E3C' }}>Privacy Policy</span>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #8B5E3C 0%, #a0703f 100%)', boxShadow: loading ? 'none' : '0 8px 25px rgba(139,94,60,0.35)' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating your account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> SSL Secured</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Free Forever</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-green-500" /> Privacy First</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalInfo.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100 animate-fadeIn">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 ${modalInfo.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {modalInfo.type === 'success'
                ? <CheckCircle className="w-8 h-8 text-emerald-600" />
                : <ShieldCheck className="w-8 h-8 text-red-500" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{modalInfo.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{modalInfo.message}</p>
            <button
              onClick={handleModalClose}
              className="w-full py-3 px-6 rounded-2xl font-bold text-white transition-all"
              style={{ background: modalInfo.type === 'success' ? 'linear-gradient(135deg, #059669, #10B981)' : 'linear-gradient(135deg, #DC2626, #EF4444)' }}
            >
              {modalInfo.type === 'success' ? 'Go to Login →' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
