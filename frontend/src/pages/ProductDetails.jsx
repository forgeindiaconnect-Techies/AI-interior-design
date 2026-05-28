import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Truck, ShieldCheck, Hammer, Heart, ShoppingCart, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { useToast } from '../components/Toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const { showToast } = useToast();

  const colors = ['#1F2937', '#8B5E3C', '#D4A373', '#F8F5F0'];

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    const localProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
    const localProduct = localProducts.find(p => p._id === id);
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      console.error('Error fetching product', error);
      // Fallback mock data
      setProduct({
        _id: id,
        title: 'Velvet Emerald Sofa',
        price: 1299,
        category: 'Living Room',
        material: 'Premium Velvet & Teak Wood',
        size: '84"W x 36"D x 34"H',
        description: 'Experience unparalleled luxury with this handcrafted velvet sofa. Featuring deep tufting, high-density foam cushions, and a solid teak wood frame for lasting durability. Perfect for modern and contemporary living spaces.',
        rating: 4.8,
        reviewsCount: 124,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=80'
        ],
        vendorId: { companyName: 'Artisan Workshop', rating: 4.9, description: 'Master craftsmen with 20 years of experience in luxury furniture.' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('/cart', { productId: id, quantity: 1 });
    } catch (error) {
      // ignore
    }
    const localCart = JSON.parse(localStorage.getItem('mockCart') || '[]');
    const existingItem = localCart.find(item => item.productId === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      localCart.push({ productId: id, quantity: 1 });
    }
    localStorage.setItem('mockCart', JSON.stringify(localCart));
    window.dispatchEvent(new Event('cartUpdated'));
    showToast('🛒 Product added to your cart!');
    localStorage.setItem('activeDashboardTab', 'cart');
    navigate('/dashboard/user');
  };

  const handleSaveItem = async () => {
    try {
      await axios.post('/wishlist/toggle', { productId: id });
      alert('Product saved to wishlist!');
    } catch (error) {
      alert('Product saved (Demo Mode)');
    }
  };

  if (loading || !product) {
    return <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center font-bold text-xl text-[#8B5E3C]">Loading Product Details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-8">
          <button onClick={() => navigate('/marketplace')} className="hover:text-[#8B5E3C] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Marketplace
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-[#8B5E3C] cursor-pointer">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1F2937] truncate w-32 md:w-auto">{product.title}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#D4A373]/30 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 p-6 md:p-10 flex flex-col gap-4">
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gray-100">
              <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover transition-opacity duration-500" />
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-[#8B5E3C] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 p-6 md:p-10 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col">
            <div className="mb-6">
              <span className="bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
              <h1 className="font-['Playfair_Display'] font-extrabold text-3xl md:text-5xl text-[#1F2937] mt-4 leading-tight">{product.title}</h1>
              
              <div className="flex items-center gap-6 mt-4 border-b border-gray-100 pb-6">
                <span className="font-['Playfair_Display'] font-extrabold text-4xl text-[#2A9D8F]">${product.price}</span>
                <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                  <div className="flex items-center gap-1 text-[#E9C46A]">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-lg font-bold text-[#1F2937]">{product.rating}</span>
                  </div>
                  <span className="text-sm font-medium text-[#6B7280] underline cursor-pointer">({product.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-[#6B7280] leading-relaxed mb-8">{product.description}</p>

            <div className="space-y-6 mb-10">
              {/* Color Variants */}
              <div>
                <h4 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider mb-3">Select Color</h4>
                <div className="flex gap-3">
                  {colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSelectedColor(idx);
                        if (product.images && product.images.length > idx) {
                          setActiveImage(idx);
                        } else if (product.images) {
                          setActiveImage(idx % product.images.length);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === idx ? 'ring-2 ring-offset-2 ring-[#8B5E3C]' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === idx && <Check className={`w-5 h-5 drop-shadow-md ${color === '#F8F5F0' ? 'text-gray-800' : 'text-white'}`} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs Box */}
              <div className="bg-[#F8F5F0] rounded-2xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Material</span>
                  <p className="font-bold text-[#1F2937] mt-1">{product.material || 'Wood / Fabric'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Dimensions</span>
                  <p className="font-bold text-[#1F2937] mt-1">{product.size || 'Standard Size'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button onClick={handleAddToCart} className="flex-1 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={handleSaveItem} className="w-14 h-14 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl flex items-center justify-center transition-all">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Logistics Info */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#2A9D8F]" />
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">Free Delivery</p>
                  <p className="text-xs text-[#6B7280]">3-5 Business Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hammer className="w-6 h-6 text-[#8B5E3C]" />
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">Installation</p>
                  <p className="text-xs text-[#6B7280]">Available at checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#E9C46A]" />
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">Verified Vendor</p>
                  <p className="text-xs text-[#6B7280] truncate w-24">{product.vendorId?.companyName}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
