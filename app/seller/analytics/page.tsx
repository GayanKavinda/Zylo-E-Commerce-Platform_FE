'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, TrendingUp, Package, ShoppingBag, 
  Calendar, ArrowUpRight, ArrowDownRight, Users,
  BarChart3, PieChart, Activity, Download
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface AnalyticsData {
  revenue_timeline: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  product_performance: Array<{
    id: number;
    name: string;
    price: number;
    order_items_count: number;
    order_items_sum_subtotal: number;
  }>;
  category_breakdown: Array<{
    category: string;
    count: number;
    total_stock: number;
  }>;
}

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState(30);

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['seller-analytics', period],
    queryFn: async () => {
      const { data } = await api.get(`/seller/analytics?period=${period}`);
      return data;
    },
  });

  // Calculate totals
  const totalRevenue = analytics?.revenue_timeline?.reduce(
    (sum, item) => sum + parseFloat(item.revenue.toString()), 0
  ) || 0;

  const totalOrders = analytics?.revenue_timeline?.reduce(
    (sum, item) => sum + item.orders, 0
  ) || 0;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate growth (compare first half vs second half)
  const halfPoint = Math.floor((analytics?.revenue_timeline?.length || 0) / 2);
  const firstHalfRevenue = analytics?.revenue_timeline
    ?.slice(0, halfPoint)
    .reduce((sum, item) => sum + parseFloat(item.revenue.toString()), 0) || 0;
  const secondHalfRevenue = analytics?.revenue_timeline
    ?.slice(halfPoint)
    .reduce((sum, item) => sum + parseFloat(item.revenue.toString()), 0) || 0;

  const growthRate = firstHalfRevenue > 0 
    ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-2">Track your store's performance and growth</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>Last Year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="flex items-center mt-2">
              {growthRate >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(growthRate).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <ShoppingBag className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
            <p className="text-sm text-gray-500 mt-2">
              in the last {period} days
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${averageOrderValue.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              per order
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Products Sold</p>
              <Package className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {analytics?.product_performance?.reduce((sum, p) => sum + p.order_items_count, 0) || 0}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              total units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            Revenue Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics?.revenue_timeline && analytics.revenue_timeline.length > 0 ? (
            <div className="space-y-2">
              {/* Simple bar chart */}
              <div className="grid grid-cols-7 gap-2">
                {analytics.revenue_timeline.slice(-7).map((item, index) => {
                  const maxRevenue = Math.max(...analytics.revenue_timeline.map(i => parseFloat(i.revenue.toString())));
                  const height = maxRevenue > 0 ? (parseFloat(item.revenue.toString()) / maxRevenue) * 200 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-t-lg flex items-end justify-center" style={{ height: '200px' }}>
                        <div 
                          className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-700 hover:to-indigo-500"
                          style={{ height: `${height}px` }}
                          title={`$${parseFloat(item.revenue.toString()).toFixed(2)}`}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xs font-medium text-gray-900">
                          ${parseFloat(item.revenue.toString()).toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Full table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.revenue_timeline.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {item.orders}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ${parseFloat(item.revenue.toString()).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          ${item.orders > 0 ? (parseFloat(item.revenue.toString()) / item.orders).toFixed(2) : '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No revenue data for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Performance & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.product_performance && analytics.product_performance.length > 0 ? (
              <div className="space-y-3">
                {analytics.product_performance.slice(0, 10).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-indigo-100 text-indigo-600'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.order_items_count} sold • ${product.price}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(product.order_items_sum_subtotal || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>No product sales yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.category_breakdown && analytics.category_breakdown.length > 0 ? (
              <div className="space-y-4">
                {analytics.category_breakdown.map((category, index) => {
                  const totalProducts = analytics.category_breakdown.reduce((sum, c) => sum + c.count, 0);
                  const percentage = totalProducts > 0 ? (category.count / totalProducts) * 100 : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{category.category}</p>
                          <p className="text-sm text-gray-500">{category.count} products</p>
                        </div>
                        <span className="text-sm font-semibold text-indigo-600">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Stock: {category.total_stock} units
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>No category data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-900">
            <Activity className="h-5 w-5 mr-2" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {growthRate > 10 && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Strong Growth</p>
                  <p className="text-sm text-gray-600">
                    Your revenue is growing at {growthRate.toFixed(1)}%! Keep up the great work.
                  </p>
                </div>
              </div>
            )}
            
            {averageOrderValue > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Average Order Value</p>
                  <p className="text-sm text-gray-600">
                    Your average order value is ${averageOrderValue.toFixed(2)}. 
                    {averageOrderValue < 50 ? ' Consider bundling products to increase this.' : ' Great performance!'}
                  </p>
                </div>
              </div>
            )}
            
            {analytics?.product_performance && analytics.product_performance.length > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Best Seller</p>
                  <p className="text-sm text-gray-600">
                    {analytics.product_performance[0].name} is your top performer. Consider stocking similar items.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
