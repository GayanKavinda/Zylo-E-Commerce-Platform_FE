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
  ChevronLeft,
  Minus,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const toPriceNumber = (value: number | string | undefined | null) =>
  Number.parseFloat(String(value ?? 0));

// Stunning Modern Product Card with Advanced Effects
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
  const [isHovered, setIsHovered] = useState(false);
  const basePrice = toPriceNumber(product.price);
  const discountedPrice = product.discount_price !== undefined ? toPriceNumber(product.discount_price) : null;
  const hasDiscount = discountedPrice !== null && basePrice > 0 && discountedPrice < basePrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - discountedPrice / basePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.05,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-[28px] opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700" />
      
      {/* Main Card Container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col">
        
        {/* Floating Badges Container */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between">
          {/* Discount Badge */}
          {hasDiscount && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.05 + 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl blur-md opacity-60 animate-pulse" />
              <div className="relative px-3 py-1.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-white animate-bounce" />
                  <span className="text-white font-black text-xs tracking-tight">{discountPercent}% OFF</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`ml-auto p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 shadow-lg ${
              isLiked 
                ? 'bg-rose-500 text-white shadow-rose-500/50' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Image Container with Parallax Effect */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-800">
          <motion.div 
            className="aspect-square"
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img
              src={product.images && Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0].trim() ? `http://localhost:8000${product.images[0]}` : '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load for product:', product.name, 'Images array:', product.images, 'First image:', product.images?.[0]);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </motion.div>

          {/* Animated Gradient Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          />

          {/* Quick Actions - Slide Up on Hover */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 100, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bottom-4 left-4 right-4 flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuickView(product)}
              className="flex-1 px-4 py-2.5 bg-white/95 backdrop-blur-md text-gray-900 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBuy(product)}
              disabled={product.stock === 0}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Stock Indicator - Bottom Right Corner */}
          <div className="absolute bottom-3 right-3">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg backdrop-blur-xl text-xs font-bold shadow-lg ${
                product.stock > 10 
                  ? 'bg-emerald-500/90 text-white' 
                  : product.stock > 0 
                    ? 'bg-amber-500/90 text-white' 
                    : 'bg-gray-900/90 text-gray-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                product.stock > 10 ? 'bg-white' : product.stock > 0 ? 'bg-white' : 'bg-gray-400'
              }`} />
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out'}
            </motion.div>
          </div>
        </div>

        {/* Content Section with Slide Animation */}
        <motion.div 
          className="p-5 flex flex-col flex-1"
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Tag */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-1.5 self-start px-3 py-1 mb-3 bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full"
          >
            <Sparkles className="w-3 h-3 text-violet-600 dark:text-violet-400" />
            <span className="text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wide">
              {product.category || 'General'}
            </span>
          </motion.div>

          {/* Product Name with Gradient on Hover */}
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 transition-all duration-300">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          {/* Rating with Animation */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Star 
                    className={`w-4 h-4 ${
                      i < 4 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`} 
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">4.0 (128)</span>
          </div>

          {/* Price Section with Animated Border */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-indigo-200 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <motion.span 
                    className="text-3xl font-black text-gray-900 dark:text-white"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    ${(hasDiscount ? discountedPrice : basePrice)?.toFixed(2)}
                  </motion.span>
                  {hasDiscount && (
                    <span className="text-base text-gray-400 line-through font-medium">
                      ${basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="flex flex-col items-end">
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                      Save ${(basePrice - discountedPrice!).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button with Ripple Effect */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onBuy(product)}
            disabled={product.stock === 0}
            className="relative w-full py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn transition-all duration-300"
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
              }}
            />
            
            <span className="relative flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </motion.button>
        </motion.div>
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

// Quick View Modal Component
const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const basePrice = toPriceNumber(product.price);
  const discountedPrice = product.discount_price !== undefined ? toPriceNumber(product.discount_price) : null;
  const hasDiscount = discountedPrice !== null && basePrice > 0 && discountedPrice < basePrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - discountedPrice / basePrice) * 100)
    : 0;

  const images = product.images?.length ? product.images : ['/placeholder.png'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                {/* Main Image */}
                <div className="aspect-square">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow-lg">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-white" />
                      <span className="text-white font-bold text-sm">{discountPercent}% OFF</span>
                    </div>
                  </div>
                )}

                {/* Thumbnail Navigation */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-violet-500 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="p-8 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
                {/* Category */}
                <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 mb-4 bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full">
                  <Sparkles className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                  <span className="text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wide">
                    {product.category || 'General'}
                  </span>
                </div>

                {/* Product Name */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">4.0 (128 reviews)</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">
                          ${(hasDiscount ? discountedPrice : basePrice)?.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-lg text-gray-400 line-through">
                            ${basePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    {hasDiscount && (
                      <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          Save ${(basePrice - discountedPrice!).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-3 h-3 rounded-full ${
                    product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <span className={`font-medium ${
                    product.stock > 10 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : product.stock > 0 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.stock > 10 
                      ? 'In Stock' 
                      : product.stock > 0 
                        ? `Only ${product.stock} left` 
                        : 'Out of Stock'}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-rose-300 dark:hover:border-rose-600 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-rose-500" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading Skeleton Component
const ProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
    <div className="p-5 space-y-4">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
      <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
    </div>
  </div>
);

export default function ProductsPage() {
  const router = useRouter();
  const { data: productsData, isLoading, error, refetch } = useProducts();
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
    const cats = Array.from(new Set(products.map((p: Product) => p.category).filter(Boolean))) as string[];
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

  const handleBuy = (product: Product, quantity: number = 1) => {
    addToCartMutation.mutate(
      { product_id: product.id, quantity },
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

                  {/* Clear Filters Button */}
                  {activeFiltersCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
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

        {/* Results Count & Active Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Showing <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
            </span>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">|</span>
                <span className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Failed to load products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
              We encountered an error while fetching the products. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
              {searchQuery 
                ? `No products match "${searchQuery}". Try a different search term.`
                : 'No products match your current filters. Try adjusting your criteria.'}
            </p>
            {(searchQuery || activeFiltersCount > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product: Product, index: number) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={(p) => handleBuy(p)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More / Pagination Placeholder */}
        {!isLoading && filteredProducts.length > 0 && filteredProducts.length >= 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <button className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 transition-all shadow-lg hover:shadow-xl">
              Load More Products
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(product, quantity) => handleBuy(product, quantity)}
      />

      {/* Toast for Add to Cart Success */}
      <AnimatePresence>
        {addToCartMutation.isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="font-semibold">Added to cart successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adding to Cart Loading Indicator */}
      <AnimatePresence>
        {addToCartMutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
              <span className="font-semibold text-gray-900 dark:text-white">Adding to cart...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}