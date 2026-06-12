import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wand2, 
  ShoppingBag, 
  Hammer, 
  Store, 
  Truck, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Sparkles, 
  UploadCloud,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Image as ImageIcon,
  Loader,
  Camera,
  Activity,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import HeroVideoSimulation from '../components/HeroVideoSimulation';
import { useAuth } from '../context/AuthContext';
import { loadManifest, buildRoomImageUrl } from '../utils/roomImages';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // The user should stay on the landing page even if logged in,
  // they can navigate to their dashboard via the Navbar.

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // AI Room Designer State
  const [uploadedImage, setUploadedImage] = useState(null);
  const [aiState, setAiState] = useState('idle'); // idle, analyzing, generating, complete
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiResultImage, setAiResultImage] = useState(null);
  const fileInputRef = useRef(null);
  const analysisIntervalRef = useRef(null);
  const [activeDemoTab, setActiveDemoTab] = useState('split'); // split, original, ai

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAiAnalysis = () => {
    setAiState('analyzing');
    const steps = [
      'Scanning room dimensions and layout...',
      'Extracting existing furniture structures...',
      'Analyzing lighting conditions...',
      'Matching modern interior styles...',
      'Rendering luxury materials and textures...',
      'Finalizing high-resolution AI output...'
    ];
    
    let stepIndex = 0;
    setAnalysisStep(steps[0]);

    analysisIntervalRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setAnalysisStep(steps[stepIndex]);
      } else {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
        // Use room images as AI mock results
        loadManifest().then(() => {
          const picks = [
            { room: 'living_room', style: 'modern' },
            { room: 'bedroom', style: 'scandinavian' },
            { room: 'kitchen', style: 'modern' },
            { room: 'bathroom', style: 'minimalist' },
          ];
          const pick = picks[Math.floor(Math.random() * picks.length)];
          const url = buildRoomImageUrl(pick.room, pick.style, 0)
            || `/room-images/${pick.room}/${pick.style}/${pick.room}_${pick.style}_0.jpg`;
          setAiResultImage(url);
          setAiState('complete');
        });
      }
    }, 1500); // Takes about 9 seconds total
  };

  const resetAiDesigner = () => {
    setUploadedImage(null);
    setAiState('idle');
    setAiResultImage(null);
    setAnalysisStep('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUseDesign = () => {
    // Save flag to local storage so post-login they can be routed to AI Studio
    localStorage.setItem('pendingAiDesign', 'true');
    navigate('/register');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/contact', contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        const data = res.data?.data || [];
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching preview products', error);
        const fallback = [
          { _id: '1', title: 'Velvet Emerald Sofa', price: 1299, category: 'Living Room', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'] },
          { _id: '2', title: 'Minimalist Teak Coffee Table', price: 449, category: 'Living Room', images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600&auto=format&fit=crop&q=60'] },
          { _id: '3', title: 'Nordic Oak Dining Chair', price: 210, category: 'Dining Room', images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=60'] },
          { _id: '4', title: 'Modern Brass Floor Lamp', price: 320, category: 'Lighting', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60'] },
          { _id: '5', title: 'Luxury Marble Side Table', price: 580, category: 'Living Room', images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&auto=format&fit=crop&q=60'] },
          { _id: '6', title: 'Ergonomic Lounge Chair', price: 890, category: 'Bedroom', images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60'] },
        ];
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#F8F5F0] min-h-screen text-[#1F2937]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-6 border-b border-[#D4A373]/20 bg-gradient-to-b from-[#F8F5F0] via-[#F8F5F0]/80 to-[#D4A373]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 bg-[#8B5E3C]/10 border border-[#8B5E3C]/30 px-4 py-2 rounded-full text-[#8B5E3C] text-sm font-semibold shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen AI Interior Design & Marketplace</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-extrabold leading-tight text-[#1F2937]">
              Design Your Dream Space With <span className="text-[#8B5E3C]">AI Precision</span>
            </h1>
            <p className="text-lg lg:text-xl text-[#6B7280] leading-relaxed max-w-2xl">
              Experience the ultimate fusion of artificial intelligence interior styling, custom furniture manufacturing, and a premium curated marketplace. From concept to flawless installation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/register" 
                className="flex items-center justify-center gap-3 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                <Wand2 className="w-5 h-5" />
                <span>Start AI Design Free</span>
              </Link>
              <a 
                href="#marketplace" 
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#8B5E3C] border-2 border-[#8B5E3C] px-8 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#D4A373]/30">
              <div>
                <p className="font-['Playfair_Display'] text-3xl font-extrabold text-[#8B5E3C]">99.8%</p>
                <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mt-1">AI Accuracy</p>
              </div>
              <div>
                <p className="font-['Playfair_Display'] text-3xl font-extrabold text-[#8B5E3C]">5,000+</p>
                <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mt-1">Products Listed</p>
              </div>
              <div>
                <p className="font-['Playfair_Display'] text-3xl font-extrabold text-[#8B5E3C]">100%</p>
                <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mt-1">Managed Delivery</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5E3C]/20 to-[#D4A373]/30 rounded-3xl filter blur-2xl transform scale-105 -z-10" />
            <HeroVideoSimulation />
          </div>
        </div>
      </section>

      {/* 2. AI INTERIOR DESIGN EXPLANATION & UPLOAD CTA */}
      <section id="ai-design" className="py-24 px-6 bg-white border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#2F3E46]/10 text-[#2F3E46] px-4 py-2 rounded-full text-sm font-semibold">
              <Wand2 className="w-4 h-4 text-[#8B5E3C]" />
              <span>Smart AI Studio</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-tight">
              Instantly Reimagine Any Room With A Single Photo
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Our advanced generative AI engine analyzes your uploaded room photo, understands spatial dimensions, lighting, and existing structures, and generates breathtaking interior design layouts complete with color palettes, material recommendations, and budget estimates.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937] text-lg">Instant Spatial Analysis</h4>
                  <p className="text-[#6B7280] text-sm">Perfectly measures and suggests layouts tailored to your exact floor plan.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937] text-lg">Curated Material Matching</h4>
                  <p className="text-[#6B7280] text-sm">Matches wood, fabrics, and metals to achieve your desired aesthetic perfectly.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937] text-lg">Seamless Ordering</h4>
                  <p className="text-[#6B7280] text-sm">Accept the AI design to automatically place orders for ready-made or custom furniture.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI ROOM DESIGNER INTERACTIVE DEMO */}
          <div className="bg-[#F8F5F0] p-6 lg:p-10 rounded-3xl border-2 border-[#8B5E3C]/20 shadow-xl relative overflow-hidden group">
            {aiState === 'idle' && (
              <div className="text-center space-y-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A373]/5 to-[#8B5E3C]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {uploadedImage ? (
                  <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white group/img cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Change Photo">
                    <img src={uploadedImage} alt="Uploaded Room" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                       <span className="text-white text-xs font-bold flex items-center gap-1"><Camera className="w-4 h-4"/> Change</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-dashed border-[#8B5E3C]/50 text-[#8B5E3C] hover:bg-[#8B5E3C]/5 cursor-pointer hover:scale-105 transition-all"
                  >
                    <Camera className="w-10 h-10" />
                  </div>
                )}
                
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1F2937]">
                  {uploadedImage ? "Room Photo Ready!" : "Upload Your Room Photo"}
                </h3>
                <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
                  {uploadedImage ? "Click the button below to let our AI instantly style your room with luxury furniture and custom materials." : "Snap a picture of your kitchen, living room, or bedroom. Our AI will instantly style it with luxury furniture and custom materials."}
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {uploadedImage ? (
                  <button 
                    onClick={startAiAnalysis}
                    className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 z-10 relative"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Try AI Stylist Now</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 z-10 relative"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Select Room Photo</span>
                  </button>
                )}
                <p className="text-xs text-[#6B7280] pt-2">No credit card required • Free trial available</p>
              </div>
            )}

            {aiState === 'analyzing' && (
              <div className="text-center space-y-8 py-10">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 border-4 border-[#8B5E3C]/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#8B5E3C] rounded-full border-t-transparent animate-spin"></div>
                  <Wand2 className="w-8 h-8 text-[#8B5E3C] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937]">AI is Designing...</h3>
                  <p className="text-[#8B5E3C] font-semibold text-sm animate-pulse">{analysisStep}</p>
                </div>
                <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#8B5E3C] h-full rounded-full w-full animate-pulse transition-all duration-1000"></div>
                </div>
              </div>
            )}

            {aiState === 'complete' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937]">AI Redesign Complete</h3>
                  <button onClick={resetAiDesigner} className="text-sm text-gray-500 hover:text-[#8B5E3C] font-bold flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Start Over
                  </button>
                </div>

                {/* View Toggles */}
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 max-w-xs mx-auto mb-6">
                  <button onClick={() => setActiveDemoTab('original')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${activeDemoTab === 'original' ? 'bg-[#8B5E3C] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Original</button>
                  <button onClick={() => setActiveDemoTab('split')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${activeDemoTab === 'split' ? 'bg-[#8B5E3C] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Split View</button>
                  <button onClick={() => setActiveDemoTab('ai')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${activeDemoTab === 'ai' ? 'bg-[#8B5E3C] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>AI Result</button>
                </div>

                {/* Image Display */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-gray-100 h-64 lg:h-80 w-full flex items-center justify-center">
                  {activeDemoTab === 'original' && (
                    <img src={uploadedImage} alt="Original Room" className="w-full h-full object-cover" />
                  )}
                  {activeDemoTab === 'ai' && (
                    <img src={aiResultImage} alt="AI Redesign" className="w-full h-full object-cover animate-fadeIn" />
                  )}
                  {activeDemoTab === 'split' && (
                    <div className="absolute inset-0 flex w-full h-full">
                      <div className="w-1/2 h-full overflow-hidden border-r-2 border-white/50 relative group">
                        <img src={uploadedImage} alt="Original" className="w-[200%] h-full object-cover max-w-none origin-left" />
                        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">Before</span>
                      </div>
                      <div className="w-1/2 h-full overflow-hidden relative group">
                        <img src={aiResultImage} alt="AI" className="w-[200%] h-full object-cover max-w-none -ml-[100%] origin-left" />
                        <span className="absolute bottom-3 right-3 bg-[#8B5E3C]/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm shadow-md flex items-center gap-1"><Sparkles className="w-3 h-3"/> After</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Design Specs */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Detected Style</span>
                    <strong className="text-sm text-[#1F2937]">Modern Luxury (AI Suggestion)</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Est. Budget</span>
                    <strong className="text-sm text-[#2A9D8F]">₹3,200 - ₹4,500</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Generated Color Palette</span>
                    <div className="flex gap-2">
                      {['#F8F5F0', '#1F2937', '#8B5E3C', '#2A9D8F'].map((color, i) => (
                        <div key={i} className="w-6 h-6 rounded-full shadow-inner border border-gray-200" style={{ backgroundColor: color }} title={color} />
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleUseDesign}
                  className="w-full bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Request Quotes For This Design
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. MARKETPLACE PRODUCTS SECTION */}
      <section id="marketplace" className="py-24 px-6 bg-[#F8F5F0] border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[#8B5E3C]/10 text-[#8B5E3C] px-4 py-2 rounded-full text-sm font-semibold">
                <ShoppingBag className="w-4 h-4" />
                <span>Curated Excellence</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-extrabold text-[#1F2937]">
                Explore Premium Vendor Creations
              </h2>
              <p className="text-[#6B7280] text-lg">
                Discover ready-made luxury furniture crafted by top-tier global vendors and artisans. Verified stock, premium materials, and transparent pricing.
              </p>
            </div>
            <Link 
              to="/marketplace" 
              className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#8B5E3C]/80 font-bold text-lg group"
            >
              <span>View Full Marketplace</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all border border-[#D4A373]/20 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-[#2F3E46]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                    {product.category}
                  </span>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937] group-hover:text-[#8B5E3C] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm line-clamp-2">
                      {product.description || 'Premium artisan crafted furniture designed for modern luxury living spaces.'}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-['Playfair_Display'] font-extrabold text-2xl text-[#8B5E3C]">
                      ₹{product.price}
                    </span>
                    <button 
                      onClick={() => navigate('/login')}
                      className="bg-[#F8F5F0] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all border border-[#8B5E3C]/30 shadow-sm"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CUSTOM FURNITURE MANUFACTURING SECTION */}
      <section id="custom-manufacturing" className="py-24 px-6 bg-white border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A373]/20 to-[#8B5E3C]/20 rounded-3xl filter blur-2xl transform scale-105 -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80" 
              alt="Custom Furniture Workshop" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl border border-white/60"
            />
            <div className="absolute -bottom-8 -right-8 bg-[#8B5E3C] text-white p-8 rounded-3xl shadow-xl hidden md:block max-w-xs border border-white/20">
              <Hammer className="w-10 h-10 mb-4 text-[#D4A373]" />
              <h4 className="font-['Playfair_Display'] text-xl font-bold mb-2">Bespoke Craftsmanship</h4>
              <p className="text-sm text-gray-200 leading-relaxed">Built to your precise spatial measurements and material choices.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#D4A373]/20 text-[#8B5E3C] px-4 py-2 rounded-full text-sm font-semibold">
              <Hammer className="w-4 h-4" />
              <span>Made To Order</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-tight">
              Flawless Custom Furniture Manufacturing
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Can't find the perfect ready-made piece? Forward your AI design or custom specifications to our elite network of verified manufacturers. Receive transparent budget quotations and track your piece through every stage of production.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4A373]/30 shadow-sm space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#8B5E3C]" />
                <h4 className="font-bold text-[#1F2937] text-lg">Material Checking</h4>
                <p className="text-[#6B7280] text-sm">Rigorous quality verification of woods, metals, and fabrics before carving.</p>
              </div>
              <div className="bg-[#F8F5F0] p-6 rounded-2xl border border-[#D4A373]/30 shadow-sm space-y-2">
                <Clock className="w-8 h-8 text-[#8B5E3C]" />
                <h4 className="font-bold text-[#1F2937] text-lg">Live Progress Tracking</h4>
                <p className="text-[#6B7280] text-sm">Manufacturers upload real-time progress photos directly to your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VENDOR / SELLER & DELIVERY / INSTALLATION COMBINED NETWORK SECTION */}
      <section id="delivery-installation" className="py-24 px-6 bg-[#2F3E46] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#D4A373]/20 text-[#D4A373] px-4 py-2 rounded-full text-sm font-semibold border border-[#D4A373]/30">
              <Store className="w-4 h-4" />
              <span>End-to-End Partner Network</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-extrabold leading-tight">
              Empowering Vendors, Manufacturers & Installers
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our platform operates on a fully connected partner ecosystem. From top-tier furniture sellers to specialized local delivery and installation teams, every workflow is synchronized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md space-y-6 hover:bg-white/10 transition-all group">
              <div className="w-14 h-14 bg-[#8B5E3C] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#D4A373]">Vendor Portal</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                List products, manage inventory, receive custom design requests, suggest matching items, and send competitive budget quotations instantly.
              </p>
              <Link to="/register?role=vendor" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#D4A373] transition-colors pt-4">
                <span>Join as Vendor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md space-y-6 hover:bg-white/10 transition-all group">
              <div className="w-14 h-14 bg-[#D4A373] rounded-2xl flex items-center justify-center text-[#2F3E46] shadow-lg group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#D4A373]">Managed Delivery</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Dedicated delivery partners receive assigned orders, manage dispatch logistics, and update real-time transit status directly to the customer.
              </p>
              <Link to="/register?role=delivery" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#D4A373] transition-colors pt-4">
                <span>Join as Delivery Partner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md space-y-6 hover:bg-white/10 transition-all group">
              <div className="w-14 h-14 bg-[#2A9D8F] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Hammer className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#D4A373]">Expert Installation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Professional installation teams schedule visits, execute flawless white-glove setup, and upload photographic proof upon completion.
              </p>
              <Link to="/register?role=installation" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#D4A373] transition-colors pt-4">
                <span>Join as Installer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-extrabold text-[#1F2937]">
              Seamless 4-Step Workflow
            </h2>
            <p className="text-[#6B7280] text-lg">From concept imagination to white-glove living room reality.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="space-y-6 bg-[#F8F5F0] p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all">
              <span className="absolute top-6 right-6 font-['Playfair_Display'] font-extrabold text-4xl text-[#8B5E3C]/20 group-hover:text-[#8B5E3C]/40 transition-colors">01</span>
              <div className="w-14 h-14 bg-[#8B5E3C] rounded-2xl flex items-center justify-center text-white shadow-md">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Upload Photo</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">Submit a photo of your room or input your manual design ideas, budget, and sizing requirements.</p>
            </div>

            <div className="space-y-6 bg-[#F8F5F0] p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all">
              <span className="absolute top-6 right-6 font-['Playfair_Display'] font-extrabold text-4xl text-[#8B5E3C]/20 group-hover:text-[#8B5E3C]/40 transition-colors">02</span>
              <div className="w-14 h-14 bg-[#D4A373] rounded-2xl flex items-center justify-center text-[#2F3E46] shadow-md">
                <Wand2 className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">AI / Vendor Match</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">AI instantly generates visual layouts. Vendors review custom requests and share competitive budget quotations.</p>
            </div>

            <div className="space-y-6 bg-[#F8F5F0] p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all">
              <span className="absolute top-6 right-6 font-['Playfair_Display'] font-extrabold text-4xl text-[#8B5E3C]/20 group-hover:text-[#8B5E3C]/40 transition-colors">03</span>
              <div className="w-14 h-14 bg-[#2F3E46] rounded-2xl flex items-center justify-center text-white shadow-md">
                <Hammer className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Craft & Inspect</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">Approve the quotation to start custom manufacturing. Monitor stage-by-stage progress photos.</p>
            </div>

            <div className="space-y-6 bg-[#F8F5F0] p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all">
              <span className="absolute top-6 right-6 font-['Playfair_Display'] font-extrabold text-4xl text-[#8B5E3C]/20 group-hover:text-[#8B5E3C]/40 transition-colors">04</span>
              <div className="w-14 h-14 bg-[#2A9D8F] rounded-2xl flex items-center justify-center text-white shadow-md">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-['Playfair_Display'] font-bold text-2xl text-[#1F2937]">Deliver & Install</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">Dedicated logistics handle doorstep delivery while white-glove experts perform flawless final assembly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT US SECTION */}
      <section id="about-us" className="py-24 px-6 bg-[#F8F5F0] border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#8B5E3C]/10 text-[#8B5E3C] px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>About Us</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-extrabold text-[#1F2937]">
              Pioneering the Future of AI Interior Design
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              At ArtisanStudio, we believe that creating your dream space shouldn't require months of planning or exorbitant consulting fees. We are bridging the gap between cutting-edge artificial intelligence and master craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1F2937]">Our Mission</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Our mission is to democratize luxury interior design. By leveraging our proprietary generative AI models, we empower homeowners and designers to instantly visualize high-end spatial transformations from a single photograph.
              </p>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1F2937] pt-4">End-to-End Execution</h3>
              <p className="text-[#6B7280] leading-relaxed">
                We don't just stop at beautiful AI renders. We've built an exclusive network of verified furniture manufacturers, material suppliers, and white-glove installation teams. When our AI designs a piece of custom furniture for your space, our marketplace vendors turn it into reality with millimeter precision.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A373]/20 to-[#8B5E3C]/20 rounded-3xl filter blur-2xl transform scale-105 -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80" 
                alt="AI Design Studio Team" 
                className="w-full h-[400px] object-cover rounded-3xl shadow-2xl border border-white/60"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                <p className="font-['Playfair_Display'] font-bold text-xl text-[#8B5E3C]">"Transforming spaces at the speed of thought."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-24 px-6 bg-white border-b border-[#D4A373]/20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-extrabold text-[#1F2937]">
              Loved By Homeowners & Designers
            </h2>
            <p className="text-[#6B7280] text-lg">See how our AI platform transformed real spaces across the globe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8F5F0] p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#E9C46A]">
                  {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-[#E9C46A]" />))}
                </div>
                <p className="text-[#1F2937] italic leading-relaxed">
                  "Uploading a photo of my outdated kitchen and seeing the AI redesign was mind-blowing. We accepted the design, received a vendor quote the next day, and the custom cabinets are absolutely stunning."
                </p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-[#D4A373]/30">
                <div className="w-12 h-12 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white font-bold shadow-md">
                  EH
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937]">Elena Rostova</h4>
                  <p className="text-xs text-[#6B7280]">Homeowner, New York</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F5F0] p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#E9C46A]">
                  {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-[#E9C46A]" />))}
                </div>
                <p className="text-[#1F2937] italic leading-relaxed">
                  "As a custom furniture manufacturer, this platform has completely streamlined our sales funnel. We receive precise measurements and material specs, making bidding and production incredibly efficient."
                </p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-[#D4A373]/30">
                <div className="w-12 h-12 rounded-full bg-[#D4A373] flex items-center justify-center text-[#2F3E46] font-bold shadow-md">
                  MW
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937]">Marcus Vance</h4>
                  <p className="text-xs text-[#6B7280]">Vance Premium Workshop</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F5F0] p-8 rounded-3xl border border-[#D4A373]/30 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#E9C46A]">
                  {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-[#E9C46A]" />))}
                </div>
                <p className="text-[#1F2937] italic leading-relaxed">
                  "The white-glove installation tracking gave me complete peace of mind. The delivery team arrived on time, assembled our modular sofa flawlessly, and uploaded proof right to my dashboard."
                </p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-[#D4A373]/30">
                <div className="w-12 h-12 rounded-full bg-[#2A9D8F] flex items-center justify-center text-white font-bold shadow-md">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-[#1F2937]">Sarah Jenkins</h4>
                  <p className="text-xs text-[#6B7280]">Architect, San Francisco</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section className="py-24 px-6 bg-[#F8F5F0]">
        <div className="max-w-4xl mx-auto bg-white p-8 lg:p-16 rounded-3xl shadow-xl border border-[#D4A373]/30 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#8B5E3C]/10 text-[#8B5E3C] px-4 py-2 rounded-full text-sm font-semibold">
              <ThumbsUp className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl font-extrabold text-[#1F2937]">
              Have Questions? We're Here To Help
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Whether you are a homeowner looking for design advice or a manufacturer wanting to join our partner network, our support team is ready to assist.
            </p>
          </div>

          {contactSuccess ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-[#2A9D8F]/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#2A9D8F]" />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937]">Message Sent!</h3>
              <p className="text-[#6B7280] text-sm">Your message has been received. Our support team will get back to you shortly.</p>
              <button
                onClick={() => { setContactSuccess(false); setContactForm({ name: '', email: '', message: '' }); }}
                className="mt-2 px-6 py-3 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
