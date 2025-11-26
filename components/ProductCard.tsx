//app/components/ProductCard.tsx

'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Edit, Trash2, Sparkles } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type ProductCardProps = {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onBuy?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onAddToWishlist,
  onBuy,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const calculateIconPosition = (index: number, total: number) => {
    if (!isHovered) return { x: 0, y: 0 };
    
    const angle = (index / total) * Math.PI * 2;
    const distance = 30;
    const centerX = mousePosition.x;
    const centerY = mousePosition.y;
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:shadow-2xl overflow-hidden"
    >
      {/* Glassmorphism background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-2xl"></div>
      
      {/* Animated gradient on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.2), transparent 50%)`,
        }}
      ></div>

      {/* Sparkle effect */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
      </div>

      <div className="relative flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-2xl font-semibold text-purple-300 mt-2 group-hover:text-pink-300 transition-colors duration-300">
            ${product.price}
          </p>
          <Badge 
            className={`mt-3 ${
              product.stock > 0 
                ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                : 'bg-red-500/20 text-red-300 border-red-400/30'
            } backdrop-blur-sm`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
        </div>

        <div className="relative flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {onAddToWishlist && (
            <div
              className="relative transition-all duration-300"
              style={{
                transform: isHovered 
                  ? `translate(${calculateIconPosition(0, 4).x}px, ${calculateIconPosition(0, 4).y}px)` 
                  : 'translate(0, 0)',
              }}
            >
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAddToWishlist(product)}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-purple-500/30 hover:border-purple-400 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Heart size={16} className="mr-1" />
                Wishlist
              </Button>
            </div>
          )}

          {onBuy && (
            <div
              className="relative transition-all duration-300"
              style={{
                transform: isHovered 
                  ? `translate(${calculateIconPosition(1, 4).x}px, ${calculateIconPosition(1, 4).y}px)` 
                  : 'translate(0, 0)',
              }}
            >
              <Button 
                size="sm" 
                onClick={() => onBuy(product)} 
                disabled={product.stock === 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} className="mr-1" />
                Buy
              </Button>
            </div>
          )}

          {onEdit && (
            <div
              className="relative transition-all duration-300"
              style={{
                transform: isHovered 
                  ? `translate(${calculateIconPosition(2, 4).x}px, ${calculateIconPosition(2, 4).y}px)` 
                  : 'translate(0, 0)',
              }}
            >
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onEdit(product)}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-blue-500/30 hover:border-blue-400 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
            </div>
          )}

          {onDelete && (
            <div
              className="relative transition-all duration-300"
              style={{
                transform: isHovered 
                  ? `translate(${calculateIconPosition(3, 4).x}px, ${calculateIconPosition(3, 4).y}px)` 
                  : 'translate(0, 0)',
              }}
            >
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onDelete(product)}
                className="bg-red-500/20 backdrop-blur-sm border-red-400/30 text-red-300 hover:bg-red-500/40 hover:border-red-400 hover:text-white hover:scale-110 transition-all duration-300"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
