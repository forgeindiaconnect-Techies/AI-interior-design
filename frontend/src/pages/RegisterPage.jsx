import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, CheckCircle, ShieldCheck, Armchair, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setModalInfo({
        show: true,
        title: 'Missing Information',
        message: 'Please complete all required fields.',
        type: 'error'
      });
      return;
    }

    setError('');
    setLoading(true);

    const userData = {
      name, email, password, role: 'user', phone
    };

    const res = await register(userData);
    setLoading(false);

    if (res.success) {
      setModalInfo({
        show: true,
        title: 'Registration Successful',
        message: 'Your account has been created successfully. You can now log in and start using the platform.',
        type: 'success'
      });
    } else {
      let errorMsg = res.message || 'Something went wrong. Please try again later.';
      if (errorMsg.toLowerCase().includes('already exists')) {
        errorMsg = 'An account with this email already exists.';
      }
      setModalInfo({
        show: true,
        title: 'Registration Failed',
        message: errorMsg,
        type: 'error'
      });
    }
  };

  const handleModalClose = () => {
    if (modalInfo.type === 'success') {
      navigate('/login');
    } else {
      setModalInfo({ ...modalInfo, show: false });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-6">
          <div className="w-12 h-12 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <div className="relative flex items-center justify-center">
              <Armchair className="w-7 h-7" />
              <Sparkles className="w-1/2 h-1/2 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <span className="font-['Playfair_Display'] font-bold text-3xl tracking-wide text-[#1F2937]">
            Artisan<span className="text-[#8B5E3C]">Studio</span>
          </span>
        </Link>
        <h2 className="font-['Playfair_Display'] text-4xl font-extrabold text-[#1F2937]">
          Create Your Account
        </h2>
        <p className="mt-2 text-sm text-[#6B7280]">
          Join the elite AI interior design marketplace
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

      {modalInfo.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-scaleIn text-center border border-gray-100">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${modalInfo.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {modalInfo.type === 'success' ? <CheckCircle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2 font-['Playfair_Display']">
              {modalInfo.title}
            </h3>
            <p className="text-[#6B7280] mb-8 text-sm leading-relaxed">
              {modalInfo.message}
            </p>
            <button
              onClick={handleModalClose}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all ${
                modalInfo.type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
                  : 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
