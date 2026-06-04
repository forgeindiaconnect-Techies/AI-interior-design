import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowLeft, Armchair, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registeredSuccess = location.state?.registeredSuccess || false;
  const isSessionExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/dashboard/admin');
      else if (['vendor', 'manufacturer', 'delivery', 'installation'].includes(res.user.role)) navigate('/dashboard/vendor');
      else navigate('/dashboard/user');
    } else {
      setError(res.message);
      setLoading(false);
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
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-[#6B7280]">
          Sign in to access your AI studio and partner dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-[#D4A373]/30 sm:px-10">
          {registeredSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-semibold text-center flex items-center justify-center gap-2">
              <span>✅</span>
              <span>Account created successfully! Please log in to continue.</span>
            </div>
          )}
          {isSessionExpired && !registeredSuccess && !error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl text-sm font-semibold text-center flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>Session expired or unauthorized. Please log in again.</span>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-[#E76F51]/10 border border-[#E76F51]/30 text-[#E76F51] rounded-2xl text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">
                Password
              </label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C] text-sm"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>



          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#8B5E3C] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
