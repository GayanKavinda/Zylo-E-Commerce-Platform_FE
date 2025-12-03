// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '@/components/ProfessionalNavbar';
import { useCart, useAuth, useCreateOrder } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Lock, ArrowLeft, CheckCircle, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/lib/hooks/useOrders';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: authData } = useAuth();
  const user = authData?.user;
  const createOrder = useCreateOrder();
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    notes: '',
    paymentMethod: 'card',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}`;
      
      const orderData = {
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        payment_method: formData.paymentMethod,
        notes: formData.notes || undefined,
      };

      const response = await createOrder.mutateAsync(orderData);
      setCompletedOrder(response.order);
      setOrderComplete(true);
    } catch (error: any) {
      console.error('Order failed:', error);
      alert(error.response?.data?.message || 'Order failed. Please try again.');
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.cart_items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalNavbar />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
              <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (orderComplete && completedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalNavbar />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Card className="border-2 border-green-200 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="mb-6 animate-bounce">
                  <CheckCircle className="h-24 w-24 mx-auto text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-4">Thank you for your purchase, {user?.name}!</p>
                <Badge className="mb-6 text-lg px-6 py-2 bg-indigo-600">
                  {completedOrder.order_number}
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${completedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${completedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">${completedOrder.shipping_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-indigo-600 text-lg">
                      ${completedOrder.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  📧 A confirmation email has been sent to <strong>{user?.email}</strong>
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  🚚 Your order will be shipped to: {completedOrder.shipping_address}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button variant="outline" className="px-6">Continue Shopping</Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6">
                    View Order History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = cart?.total || 0;
  const tax = subtotal * 0.1;
  const shipping = 10.00;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <Link href="/cart">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-green-600" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="text-indigo-600"
                      />
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span>Credit/Debit Card</span>
                    </Label>
                    <Label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="text-indigo-600"
                      />
                      <span>💳</span>
                      <span>PayPal</span>
                    </Label>
                    <Label className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="text-indigo-600"
                      />
                      <span>💵</span>
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for your order..."
                      rows={3}
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-900">
                      🔒 Your information is encrypted and secure. We never store payment details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart?.cart_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={createOrder.isPending}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 text-lg"
                    >
                      {createOrder.isPending ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
