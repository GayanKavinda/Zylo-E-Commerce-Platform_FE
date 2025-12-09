'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useProduct, useAddToCart } from '@/lib/hooks';
import useAuthStore from '@/lib/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, Star, Package, Truck, Shield, ArrowLeft, 
  Plus, Minus, Heart, Store 
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  // Use Zustand store directly to avoid triggering automatic user fetch
  const user = useAuthStore((state) => state.user);
  const { data: product, isLoading, error } = useProduct(productId);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Helper function to get proper image URL
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return '/placeholder-product.png';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    addToCart.mutate(
      { product_id: productId, quantity },
      {
        onSuccess: () => {
          alert(`Added ${quantity} item(s) to cart!`);
          setQuantity(1);
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || 'Failed to add to cart');
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    addToCart.mutate(
      { product_id: productId, quantity },
      {
        onSuccess: () => {
          router.push('/checkout');
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || 'Failed to proceed to checkout');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button className="btn-primary">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const effectivePrice = product.discount_price || product.price;
  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => getImageUrl(img))
    : ['/placeholder-product.png'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                  }}
                />
              </div>
            </Card>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden ${
                      selectedImage === idx ? 'border-indigo-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  {product.category && (
                    <Badge className="bg-indigo-100 text-indigo-800">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                  <Heart className="h-6 w-6" />
                </Button>
              </div>

              {product.owner && (
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <Store className="h-4 w-4 mr-1" />
                  <span>Sold by: <strong>{product.owner.name}</strong></span>
                </div>
              )}
            </div>

            {/* Rating */}
            {product.average_rating !== undefined && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.average_rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.average_rating?.toFixed(1)} ({product.reviews_count || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${effectivePrice.toFixed(2)}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                  ✓ In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 text-sm px-3 py-1">
                  ✗ Out of Stock
                </Badge>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || addToCart.isPending}
                className="w-full h-12 btn-primary text-lg"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCart.isPending}
                variant="outline"
                className="w-full h-12 text-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <Truck className="h-6 w-6 mx-auto text-indigo-600" />
                    <p className="text-xs text-gray-600">Free Shipping</p>
                  </div>
                  <div className="space-y-2">
                    <Shield className="h-6 w-6 mx-auto text-indigo-600" />
                    <p className="text-xs text-gray-600">Secure Payment</p>
                  </div>
                  <div className="space-y-2">
                    <Package className="h-6 w-6 mx-auto text-indigo-600" />
                    <p className="text-xs text-gray-600">Easy Returns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description || 'No description available for this product.'}
            </p>
            
            {product.sku && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>SKU:</strong> {product.sku}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Free standard shipping on all orders. Express shipping available at checkout.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Return Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                30-day return policy. Items must be unused and in original packaging.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Warranty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                1-year manufacturer warranty included with every purchase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
