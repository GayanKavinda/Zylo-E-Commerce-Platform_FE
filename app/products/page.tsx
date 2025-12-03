// app/products/page.tsx
'use client';

import { useState } from 'react';
import ProfessionalNavbar from '@/components/ProfessionalNavbar';
import AdvancedFilters from '@/components/AdvancedFilters';
import { useProducts, useCategories, useAddToCart } from '@/lib/hooks';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Search, Heart } from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { data: authData } = useAuth();
  const user = authData?.user;
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

  const products = productsData?.data || [];
  const categories = categoriesData?.categories || [];

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
      <ProfessionalNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Discover Amazing Products</h1>
          <p className="text-white/90">Shop from thousands of quality products at great prices</p>
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
              <div className="text-gray-600">
                {!isLoading && `Showing ${products.length} products`}
              </div>
              <select
                value={filters.sort_by}
                onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">Error loading products. Please try again.</p>
              </div>
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
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
