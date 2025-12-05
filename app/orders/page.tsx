'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useOrders, useCancelOrder } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, Clock, Truck, CheckCircle, XCircle, 
  ChevronDown, ChevronUp, Eye 
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const { data: ordersData, isLoading, error } = useOrders();
  const cancelOrder = useCancelOrder();
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const toggleOrderExpansion = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleCancelOrder = (orderId: number) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder.mutate(orderId, {
        onSuccess: () => {
          alert('Order cancelled successfully');
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || 'Failed to cancel order');
        },
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
              <p className="text-gray-600">Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const orders = ordersData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          <Link href="/products">
            <Button className="btn-primary">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to place your first order!</p>
              <Link href="/products">
                <Button className="btn-primary">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${order.total_amount.toFixed(2)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge className={getPaymentStatusColor(order.payment_status)}>
                              {order.payment_status}
                            </Badge>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-6 w-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="p-6">
                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-3">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {item.product.images && item.product.images.length > 0 ? (
                                    <img
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <Package className="h-8 w-8 text-gray-300" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{item.product.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                  </p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {item.fulfillment_status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ${item.subtotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span className="font-medium">${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium">${order.shipping_fee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-indigo-600 text-lg">
                              ${order.total_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                      </div>

                      {/* Order Notes */}
                      {order.notes && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="flex-1"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancelOrder.isPending}
                            className="flex-1"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Order
                          </Button>
                        )}

                        {order.status === 'delivered' && (
                          <Button
                            variant="outline"
                            className="flex-1"
                          >
                            Buy Again
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination Info */}
        {ordersData && ordersData.total > ordersData.per_page && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {ordersData.data.length} of {ordersData.total} orders
          </div>
        )}
      </div>
    </div>
  );
}
