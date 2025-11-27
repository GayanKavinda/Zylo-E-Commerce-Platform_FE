// app/products/page.tsx
'use client';

import { useState } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useCartStore from '@/lib/cartStore';
import { Search, Filter, ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const { data: products = [], isLoading, error } = useProducts();
  const { addItem, getTotalItems } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesPrice = true;
    
    if (priceFilter === 'low') matchesPrice = product.price < 50;
    else if (priceFilter === 'mid') matchesPrice = product.price >= 50 && product.price < 200;
    else if (priceFilter === 'high') matchesPrice = product.price >= 200;
    
    return matchesSearch && matchesPrice;
  });

  const handleAddToCart = (product: any) => {
    addItem(product);
    // Optional: Show toast notification
    alert(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Catalog</h1>
            <p className="text-gray-600">Browse our collection of amazing products</p>
          </div>
          
          <Link href="/cart">
            <Button className="bg-purple-600 hover:bg-purple-700 relative">
              <ShoppingCart className="mr-2 h-5 w-5" />
              View Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-pink-500 hover:bg-pink-600 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={priceFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setPriceFilter('all')}
                  size="sm"
                  className={priceFilter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  All Prices
                </Button>
                <Button
                  variant={priceFilter === 'low' ? 'default' : 'outline'}
                  onClick={() => setPriceFilter('low')}
                  size="sm"
                  className={priceFilter === 'low' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Under $50
                </Button>
                <Button
                  variant={priceFilter === 'mid' ? 'default' : 'outline'}
                  onClick={() => setPriceFilter('mid')}
                  size="sm"
                  className={priceFilter === 'mid' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  $50 - $200
                </Button>
                <Button
                  variant={priceFilter === 'high' ? 'default' : 'outline'}
                  onClick={() => setPriceFilter('high')}
                  size="sm"
                  className={priceFilter === 'high' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  $200+
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={handleAddToCart}
              onAddToWishlist={(product) => alert(`Added ${product.name} to wishlist!`)}
            />
          ))}
        </div>
      )}

      {/* Product count */}
      <div className="mt-8 text-center text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
