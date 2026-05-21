import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Palette, UserPlus, CheckCircle, ArrowRight, ShieldCheck, FileText, CreditCard } from 'lucide-react';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'user';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('seller');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredRole, setRegisteredRole] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('role')) {
      setRole(searchParams.get('role'));
      if (searchParams.get('role') !== 'user' && searchParams.get('role') !== 'vendor') {
        setBusinessType(searchParams.get('role'));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let finalRole = 'user';
    if (role !== 'user') {
      if (businessType === 'seller') finalRole = 'vendor';
      else finalRole = businessType;
    }

    const userData = {
      name, email, password, role: finalRole, phone, address, companyName, businessType
    };

    const res = await register(userData);
    if (res.success) {
      if (finalRole === 'user' || finalRole === 'admin') {
        navigate(finalRole === 'admin' ? '/dashboard/admin' : '/dashboard/user', { state: { showSuccessPopup: true } });
      } else {
        setRegisteredRole(finalRole);
        setIsRegistered(true);
      }
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="font-['Playfair_Display'] text-4xl font-extrabold text-[#1F2937]">Account Created Successfully!</h2>
          <p className="mt-3 text-lg text-[#6B7280]">Welcome to ArtisanStudio, {name}. Let's get your business online.</p>
          
          <div className="mt-10 bg-white p-8 rounded-3xl shadow-xl border border-[#D4A373]/30 text-left">
            <h3 className="font-bold text-xl text-[#1F2937] mb-6 border-b border-gray-100 pb-4">Your Onboarding Roadmap</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><CheckCircle size={20}/></div>
                <div>
                  <h4 className="font-bold text-[#1F2937]">Step 1: Account Registration</h4>
                  <p className="text-sm text-gray-500">Your partner account has been successfully created.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-[-16px] before:bottom-[-16px] before:w-[2px] before:bg-gray-100 before:-z-10">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#8B5E3C] text-[#8B5E3C] flex items-center justify-center shrink-0"><FileText size={20}/></div>
                <div>
                  <h4 className="font-bold text-[#1F2937]">Step 2: Submit KYC Documents</h4>
                  <p className="text-sm text-gray-500">Verify your business identity via the dashboard to unlock platform features.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-[-16px] before:bottom-[-16px] before:w-[2px] before:bg-gray-100 before:-z-10">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shrink-0"><CreditCard size={20}/></div>
                <div>
                  <h4 className="font-bold text-gray-400">Step 3: Security Deposit (If Applicable)</h4>
                  <p className="text-sm text-gray-400">Complete the refundable security deposit to accept high-value orders.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-[-16px] before:bottom-[-16px] before:w-[2px] before:bg-gray-100 before:-z-10">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shrink-0"><ShieldCheck size={20}/></div>
                <div>
                  <h4 className="font-bold text-gray-400">Step 4: Admin Approval</h4>
                  <p className="text-sm text-gray-400">Our team will review your application. You will be notified once live.</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/dashboard/vendor')} className="w-full mt-10 flex items-center justify-center gap-2 py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md transition-all group">
              Proceed to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-6">
          <div className="w-12 h-12 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Palette className="w-7 h-7" />
          </div>
          <span className="font-['Playfair_Display'] font-bold text-3xl tracking-wide text-[#1F2937]">
            Artisan<span className="text-[#8B5E3C]">Studio</span>
          </span>
        </Link>
        <h2 className="font-['Playfair_Display'] text-4xl font-extrabold text-[#1F2937]">
          Create Your Account
        </h2>
        <p className="mt-2 text-sm text-[#6B7280]">
          Join the elite AI interior design and partner marketplace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-[#D4A373]/30 sm:px-10">
          {error && (
            <div className="mb-6 p-4 bg-[#E76F51]/10 border border-[#E76F51]/30 text-[#E76F51] rounded-2xl text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2 text-center">
                Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-4 bg-[#F8F5F0] p-1.5 rounded-2xl border border-[#D4A373]/30">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${role === 'user' ? 'bg-[#8B5E3C] text-white shadow-md' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
                >
                  Customer / Homeowner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${role !== 'user' ? 'bg-[#8B5E3C] text-white shadow-md' : 'text-[#6B7280] hover:text-[#1F2937]'}`}
                >
                  Business / Partner
                </button>
              </div>
            </div>

            {role !== 'user' && (
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">
                  Partner Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm bg-white"
                >
                  <option value="seller">Furniture Vendor / Seller</option>
                  <option value="manufacturer">Custom Furniture Manufacturer</option>
                  <option value="delivery">Delivery & Logistics Partner</option>
                  <option value="installation">Installation Expert</option>
                  <option value="designer">Interior Designer</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>
            </div>

            {role !== 'user' && (
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Company / Business Name</label>
                <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Artisan Furniture Ltd" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Luxury Ave, Suite 400, NY" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm" />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#8B5E3C] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
