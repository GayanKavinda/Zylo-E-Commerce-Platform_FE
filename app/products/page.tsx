// app/products/page.tsx

'use client';

import React, { useState } from 'react';
import { useProducts, type Product } from '@/lib/hooks';
import Navbar from '@/components/layout/Navbar';
import { useAddToCart } from '@/lib/hooks/useCart';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X,
  Package,
  Filter,
  Sparkles,
  Heart,
  ShoppingBag,
  Star,
  Eye,
  ChevronRight,
  Layers,
  Grid2X2,
  LayoutList,
  ArrowUpDown,
  Tag,
  Boxes,
  BadgePercent,
  Flame,
  Plus,
} from 'lucide-react';

const toPriceNumber = (value: number | string | undefined | null) =>
  Number.parseFloat(String(value ?? 0));

// Helper function to get proper image URL
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '/placeholder.png';
  return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
};

// Clean Modern Product Card Component
const ProductCard = ({ 
  product, 
  onBuy, 
  onQuickView,
  index 
}: { 
  product: Product; 
  onBuy: (product: Product) => void;
  onQuickView: (product: Product) => void;
  index: number;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const basePrice = toPriceNumber(product.price);
  const discountedPrice = product.discount_price !== undefined ? toPriceNumber(product.discount_price) : null;
  const hasDiscount = discountedPrice !== null && basePrice > 0 && discountedPrice < basePrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - discountedPrice / basePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      {/* Outer Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
        
        {/* Inner Image Card */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 rounded-2xl overflow-hidden mb-4">
          {/* Image */}
          <div className="aspect-square overflow-hidden">
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.png';
              }}
            />
          </div>
          
          {/* Quick View Button - Centered on Image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuickView(product)}
              className="px-5 py-2.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full font-semibold text-sm shadow-lg hover:bg-white transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          {/* Top Row: Category & Stock Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold rounded-full truncate">
              {product.category || 'General'}
            </span>
            
            {/* Stock Status Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              product.stock > 10 
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' 
                : product.stock > 0 
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-gray-400'
              }`} />
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Sold Out'}
            </div>
          </div>

          {/* Name */}
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1.5 line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-600'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">(128)</span>
          </div>

          {/* Price Row with Discount */}
          <div className="flex items-center gap-3 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${discountedPrice?.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${basePrice.toFixed(2)}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full">
                  <Flame className="w-3 h-3" />
                  {discountPercent}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${basePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onBuy(product)}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </motion.button>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isLiked 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Chip Component
const FilterChip = ({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
    }`}
  >
    {label}
  </motion.button>
);

export default function ProductsPage() {
  const router = useRouter();
  const { data: productsData, isLoading, error } = useProducts();
  const addToCartMutation = useAddToCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const products = Array.isArray(productsData?.data) ? productsData.data : 
                  Array.isArray(productsData) ? productsData : [];

  const categories = React.useMemo(() => {
    if (!products) return [];
    const cats = Array.from(new Set(products.map((p: Product) => p.category).filter(Boolean)));
    return ['all', ...cats];
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      const price = toPriceNumber(product.discount_price ?? product.price);
      let matchesPrice = true;
      if (priceRange === 'under-50') matchesPrice = price < 50;
      else if (priceRange === '50-100') matchesPrice = price >= 50 && price <= 100;
      else if (priceRange === '100-200') matchesPrice = price > 100 && price <= 200;
      else if (priceRange === 'over-200') matchesPrice = price > 200;

      let matchesStock = true;
      if (stockFilter === 'in-stock') matchesStock = product.stock > 0;
      else if (stockFilter === 'low-stock') matchesStock = product.stock > 0 && product.stock <= 10;
      else if (stockFilter === 'out-of-stock') matchesStock = product.stock === 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    filtered.sort((a: Product, b: Product) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      else if (sortBy === 'price-low') return toPriceNumber(a.discount_price ?? a.price) - toPriceNumber(b.discount_price ?? b.price);
      else if (sortBy === 'price-high') return toPriceNumber(b.discount_price ?? b.price) - toPriceNumber(a.discount_price ?? a.price);
      else if (sortBy === 'newest') return b.id - a.id;
      return 0;
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, sortBy, priceRange, stockFilter]);

  const handleBuy = (product: Product) => {
    addToCartMutation.mutate(
      { product_id: product.id, quantity: 1 },
      { onSuccess: () => {} }
    );
  };

  const activeFiltersCount = 
    (categoryFilter !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (stockFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter('all');
    setPriceRange('all');
    setStockFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-indigo-600/10" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Discover Amazing Products
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Collection</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our curated selection of premium products designed to elevate your everyday experience.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search & Controls Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-20 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-violet-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3.5 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-violet-500 cursor-pointer font-medium text-gray-900 dark:text-white"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600 dark:text-violet-400' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid2X2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('large')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'large' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600 dark:text-violet-400' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-violet-600 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Categories */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-violet-600" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categories</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <FilterChip
                          key={cat}
                          label={cat === 'all' ? 'All Categories' : cat}
                          isActive={categoryFilter === cat}
                          onClick={() => setCategoryFilter(cat)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price & Stock Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Range */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-violet-600" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Price Range</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'all', label: 'All Prices' },
                          { value: 'under-50', label: 'Under $50' },
                          { value: '50-100', label: '$50 - $100' },
                          { value: '100-200', label: '$100 - $200' },
                          { value: 'over-200', label: 'Over $200' },
                        ].map((range) => (
                          <FilterChip
                            key={range.value}
                            label={range.label}
                            isActive={priceRange === range.value}
                            onClick={() => setPriceRange(range.value)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Boxes className="w-4 h-4 text-violet-600" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Availability</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'all', label: 'All Items' },
                          { value: 'in-stock', label: 'In Stock' },
                          { value: 'low-stock', label: 'Low Stock' },
                          { value: 'out-of-stock', label: 'Out of Stock' },
                        ].map((stock) => (
                          <FilterChip
                            key={stock.value}
                            label={stock.label}
                            isActive={stockFilter === stock.value}
                            onClick={() => setStockFilter(stock.value)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end"
                    >
                      <button
                        onClick={clearFilters}
                        className="text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Clear all filters
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{products?.length || 0}</span> products
          </p>
          
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>
              <div className="flex gap-2 flex-wrap">
                {categoryFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium">
                    {categoryFilter}
                    <button onClick={() => setCategoryFilter('all')} className="hover:text-violet-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium">
                    {priceRange}
                    <button onClick={() => setPriceRange('all')} className="hover:text-violet-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {stockFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium">
                    {stockFilter}
                    <button onClick={() => setStockFilter('all')} className="hover:text-violet-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-violet-200 dark:border-violet-900 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-6 font-medium">Loading amazing products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-3xl border border-red-200 dark:border-red-900">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 dark:text-red-400 mb-6">We couldn&apos;t load the products. Please try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search query.
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            layout
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {filteredProducts.map((product: Product, index: number) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={handleBuy}
                onQuickView={setQuickViewProduct}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Image Section */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square">
                    <img
                      src={getImageUrl(quickViewProduct.images?.[0])}
                      alt={quickViewProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-8 flex flex-col">
                  {/* Category & Stock */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold rounded-full">
                      {quickViewProduct.category || 'General'}
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      quickViewProduct.stock > 10 
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' 
                        : quickViewProduct.stock > 0 
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        quickViewProduct.stock > 10 ? 'bg-emerald-500' : quickViewProduct.stock > 0 ? 'bg-amber-500' : 'bg-gray-400'
                      }`} />
                      {quickViewProduct.stock > 10 ? 'In Stock' : quickViewProduct.stock > 0 ? `${quickViewProduct.stock} left` : 'Sold Out'}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {quickViewProduct.name}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                    {quickViewProduct.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(128 reviews)</span>
                  </div>

                  {/* Price */}
                  {(() => {
                    const basePrice = toPriceNumber(quickViewProduct.price);
                    const discountPrice = quickViewProduct.discount_price !== undefined
                      ? toPriceNumber(quickViewProduct.discount_price)
                      : null;
                    const hasDiscount = discountPrice !== null && discountPrice < basePrice;
                    const savings = hasDiscount
                      ? Math.round((1 - discountPrice / basePrice) * 100)
                      : 0;

                    return (
                      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                        {hasDiscount ? (
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              ${discountPrice.toFixed(2)}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              ${basePrice.toFixed(2)}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full">
                              <Flame className="w-3.5 h-3.5" />
                              Save {savings}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${basePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleBuy(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      disabled={quickViewProduct.stock === 0}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/products/${quickViewProduct.id}`)}
                      className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}