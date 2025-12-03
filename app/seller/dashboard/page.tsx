'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function SellerDashboardPage() {
  // This will be connected to real API later
  const stats = {
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Active listings</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Pending fulfillment</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/seller/products/new" className="flex items-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow">
              <Package className="h-8 w-8 mr-3" />
              <div>
                <h3 className="font-semibold">Add Product</h3>
                <p className="text-sm text-white/80">List a new item</p>
              </div>
            </a>
            <a href="/seller/orders" className="flex items-center p-4 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-shadow">
              <ShoppingBag className="h-8 w-8 mr-3" />
              <div>
                <h3 className="font-semibold">View Orders</h3>
                <p className="text-sm text-white/80">Manage orders</p>
              </div>
            </a>
            <a href="/seller/analytics" className="flex items-center p-4 bg-gradient-to-br from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow">
              <TrendingUp className="h-8 w-8 mr-3" />
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-white/80">View insights</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="flex items-start space-x-3 pt-6">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Dashboard Coming Soon</h3>
            <p className="text-sm text-blue-700 mt-1">
              We're working on connecting this dashboard to real-time data. In the meantime, you can manage your products and orders from the navigation menu.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
