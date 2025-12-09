'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { useCart, useRemoveFromCart, useUpdateCartItem } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateCart = useUpdateCartItem();
  const router = useRouter();

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCart.mutate({ id: itemId, quantity: newQuantity });
  };

  const handleRemove = (itemId: number) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart.mutate(itemId);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container-responsive py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container-responsive py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Shopping Cart</h1>

        {!cart || cart.cart_items.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8 sm:p-12 text-center">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started!</p>
              <Button onClick={() => router.push('/products')} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.cart_items.map((item) => (
                <Card key={item.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.category}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                          ${item.product.discount_price || item.product.price}
                        </p>
                      </div>

                      {/* Quantity Controls & Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-2">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">${item.subtotal.toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({cart.items_count} items)</span>
                    <span className="font-semibold dark:text-white">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-semibold dark:text-white">$10.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                    <span className="font-semibold dark:text-white">${(cart.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        ${(cart.total + 10 + cart.total * 0.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-base sm:text-lg py-5 sm:py-6"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/products')}
                    className="w-full dark:border-gray-600 dark:text-gray-300"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
