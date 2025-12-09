//app/components/ProductCard.tsx

'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  images?: string[];
  discount_price?: number;
  description?: string;
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
  // Fix: Only show discount if discount_price exists, is greater than 0, and less than price
  const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price : product.price;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:8000${product.images[0]}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="h-full w-full flex items-center justify-center"><svg class="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
              }
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white border-0">
            {Math.round(((product.price - product.discount_price!) / product.price) * 100)}% OFF
          </Badge>
        )}

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Quick Actions Overlay */}
        {onAddToWishlist && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
            onClick={() => onAddToWishlist(product)}
          >
            <Heart className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${displayPrice?.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {onBuy && (
            <Button 
              onClick={() => onBuy(product)} 
              disabled={product.stock === 0}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}

          {onEdit && (
            <Button 
              variant="outline" 
              onClick={() => onEdit(product)}
              size="sm"
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}

          {onDelete && (
            <Button 
              variant="destructive" 
              onClick={() => onDelete(product)}
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
