// app/products/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import AdvancedFilters from '@/components/AdvancedFilters';
import { useProducts, useCategories, useAddToCart, useAuth } from '@/lib/hooks';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart, TrendingUp, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

export default function ProductsPage() {
  const authState = useAuth();
  const user = authState.user;
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort_by: 'created_at' as const,
    sort_order: 'desc' as const,
  });

  const { data: productsData, isLoading, error } = useProducts(filters);
  const { data: categoriesData } = useCategories();
  const addToCart = useAddToCart();

  // Debug logging
  console.log('Products Data:', productsData);
  console.log('Loading:', isLoading);
  console.log('Error:', error);
  console.log('Categories Data:', categoriesData);

  const products = Array.isArray(productsData?.data) ? productsData.data : [];
  const categories = Array.isArray(categoriesData?.categories) ? categoriesData.categories : [];
  
  console.log('Processed products array:', products);
  console.log('Products length:', products.length);

  const handleAddToCart = (productId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    addToCart.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => {
          alert('Added to cart!');
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || 'Failed to add to cart');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 mb-2">Discover Products</h1>
          <p className="text-gray-600">
            Explore thousands of products from trusted sellers
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for products, brands, categories..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AdvancedFilters
              filters={filters}
              onFilterChange={setFilters}
              categories={categories}
            />
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {!isLoading && (
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Showing <strong>{products.length}</strong> products
                  </span>
                )}
              </div>
              <select
                value={filters.sort_by}
                onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as any })}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-base"
              >
                <option value="created_at">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 text-sm">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <p className="text-red-600">Error loading products. Please try again.</p>
                </CardContent>
              </Card>
            )}


            {/* Products Grid */}
            {!isLoading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {product.discount_price && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        SALE
                      </Badge>
                    )}

                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Product Info */}
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.category && (
                      <Badge variant="outline" className="w-fit text-xs mt-2">
                        {product.category}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="pb-3">
                    {/* Price */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.discount_price || product.price}
                      </span>
                      {product.discount_price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.average_rating !== undefined && (
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">
                          {product.average_rating.toFixed(1)} ({product.reviews_count})
                        </span>
                      </div>
                    )}

                    {/* Stock */}
                    <p className="text-sm text-gray-500 mt-2">
                      {product.stock > 0 ? (
                        <span className="text-green-600">In Stock ({product.stock})</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </p>
                  </CardContent>

                  {/* Actions */}
                  <CardFooter className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/products/${product.id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0 || addToCart.isPending}
                      className="flex-1 btn-primary"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </CardFooter>
                </Card>
                ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms</p>
                    <Button 
                      onClick={() => setFilters({ search: '', category: '', sort_by: 'created_at', sort_order: 'desc' })}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
