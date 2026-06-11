import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ShoppingCart, Heart, Eye, ArrowRight, Truck, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../components/Toast';

const ITEMS_PER_PAGE = 8;

const ProductCard = React.memo(({ product, onAddToCart, onSaveItem, onNavigate }) => (
  <div
    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D4A373]/30 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
    onClick={() => onNavigate(product._id)}
  >
    <div className="relative h-64 overflow-hidden bg-[#F3F0EB]">
      <img
        src={product.images[0]}
        alt={product.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button onClick={(e) => onSaveItem(e, product._id)} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-all shadow-sm">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1F2937] shadow-sm">
          {product.category}
        </span>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F2937] line-clamp-1">{product.title}</h3>
          <p className="text-xs text-[#6B7280] font-medium mt-1">by {product.vendorId?.companyName || 'Artisan Workshop'}</p>
        </div>
        <span className="font-['Playfair_Display'] font-extrabold text-2xl text-[#8B5E3C] whitespace-nowrap">₹{product.price}</span>
      </div>

      <div className="flex items-center gap-4 mt-2 mb-4">
        <div className="flex items-center gap-1 text-[#E9C46A]">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold text-[#1F2937]">{product.rating || 4.8}</span>
          <span className="text-xs text-[#6B7280]">({product.reviewsCount || 0})</span>
        </div>
        <div className="flex items-center gap-1 text-[#2A9D8F]">
          <Truck className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">3-5 Days</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
        <button onClick={(e) => onAddToCart(e, product._id)} className="flex-1 bg-[#1F2937] hover:bg-black text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
        <button className="px-4 py-3 bg-[#F8F5F0] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white rounded-xl transition-colors shadow-inner flex items-center justify-center">
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
));

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D4A373]/30 flex flex-col h-full animate-pulse">
    <div className="relative h-64 bg-gray-200" />
    <div className="p-6 flex flex-col flex-grow space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="h-11 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

const Marketplace = ({ isEmbedded = false, onGoToCart }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, searchQuery]);

  const categories = ['All', 'Living Room', 'Bedroom', 'Dining Room', 'Lighting', 'Decor', 'Outdoor'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/products');
      const serverProds = res.data?.data || [];
      if (serverProds.length > 0) {
        const sorted = [...serverProds].sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });
        setProducts(sorted);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products', error);
      const fallback = [
        { _id: 'prod_1', title: 'Velvet Emerald Sofa', price: 1299, category: 'Living Room', rating: 4.8, reviewsCount: 124, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Artisan Workshop' } },
        { _id: 'prod_2', title: 'Minimalist Teak Coffee Table', price: 449, category: 'Living Room', rating: 4.5, reviewsCount: 89, images: ['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Artisan Workshop' } },
        { _id: 'prod_3', title: 'Nordic Oak Dining Chair', price: 210, category: 'Dining Room', rating: 4.9, reviewsCount: 300, images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Nordic Design Ltd' } },
        { _id: 'prod_4', title: 'Modern Brass Floor Lamp', price: 320, category: 'Lighting', rating: 4.7, reviewsCount: 156, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Nordic Design Ltd' } },
        { _id: 'prod_5', title: 'Luxury Marble Side Table', price: 580, category: 'Living Room', rating: 4.6, reviewsCount: 45, images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Luxury Living Inc' } },
        { _id: 'prod_6', title: 'Ergonomic Lounge Chair', price: 890, category: 'Bedroom', rating: 4.9, reviewsCount: 412, images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60'], vendorId: { companyName: 'Luxury Living Inc' } }
      ];
      setProducts(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = useCallback((e, productId) => {
    e.stopPropagation();
    axios.post('/cart', { productId, quantity: 1 }).catch(() => {});
    window.dispatchEvent(new Event('cartUpdated'));
    showToast('🛒 Product added to your cart!');
    if (onGoToCart) {
      onGoToCart();
    } else {
      localStorage.setItem('activeDashboardTab', 'cart');
      navigate('/dashboard/user');
    }
  }, [showToast, onGoToCart, navigate]);

  const handleSaveItem = useCallback(async (e, productId) => {
    e.stopPropagation();
    try {
      await axios.post('/wishlist/toggle', { productId });
      alert('Saved to wishlist!');
    } catch (error) {
      alert('Saved to wishlist (Demo mode)');
    }
  }, []);

  const handleNavigate = useCallback((id) => {
    navigate(`/marketplace/product/${id}`);
  }, [navigate]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [products, activeCategory, searchQuery]
  );

  const visibleProducts = useMemo(() =>
    filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleProducts.length < filteredProducts.length;

  const content = (
    <>
      {/* Marketplace Header */}
      {!isEmbedded && (
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="font-['Playfair_Display'] font-extrabold text-5xl text-[#1F2937]">Explore Marketplace</h1>
          <p className="text-[#6B7280] text-lg">Curated luxury furniture and decor directly from our verified artisans and premium manufacturers.</p>
        </div>
      )}

      {/* Embedded Header */}
      {isEmbedded && (
        <div className="flex justify-between items-end border-b border-gray-100 pb-6">
          <div>
            <h2 className="font-['Playfair_Display'] font-extrabold text-3xl text-[#1F2937]">Ready-Made Furniture Marketplace</h2>
            <p className="text-sm text-gray-500 mt-1">Discover and purchase premium furniture directly from verified vendors.</p>
          </div>
          {onGoToCart && (
            <button onClick={onGoToCart} className="flex items-center gap-2 bg-[#F8F5F0] hover:bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm text-[#1F2937] transition-all whitespace-nowrap">
              <ShoppingCart className="w-4 h-4" /> Go to Cart
            </button>
          )}
        </div>
      )}
      {/* Search & Filters */}
        <div className="bg-white p-4 rounded-full shadow-sm border border-[#D4A373]/30 flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for sofas, tables, lighting..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full focus:outline-none text-sm bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 px-2 overflow-x-auto w-full md:w-auto hide-scrollbar">
            {categories.slice(0,4).map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-[#8B5E3C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* AI Suggested Section (If user has AI design requests) */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[#E76F51] font-bold text-xs uppercase tracking-wider">Personalized</span>
                <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">AI Suggested For Your Room</h2>
              </div>
              <button className="text-[#8B5E3C] font-bold text-sm flex items-center gap-1 hover:underline">View All <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} onSaveItem={handleSaveItem} onNavigate={handleNavigate} />)}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="space-y-6 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <h2 className="font-['Playfair_Display'] font-bold text-3xl text-[#1F2937]">
              {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'Trending Collection' : `${activeCategory} Collection`}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : visibleProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleProducts.map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} onSaveItem={handleSaveItem} onNavigate={handleNavigate} />)}
              </div>
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button onClick={handleLoadMore} className="px-8 py-3 bg-white border-2 border-[#D4A373]/50 hover:border-[#8B5E3C] text-[#8B5E3C] rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
                    Show More <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-500 font-bold">No products found matching your search.</p>
            </div>
          )}
        </div>

    </>
  );

  if (isEmbedded) {
    return <div className="space-y-8">{content}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {content}
      </div>
    </div>
  );
};

export default Marketplace;
