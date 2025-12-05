'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Package, TrendingDown, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  images: string;
  sku: string;
}

interface InventoryAlerts {
  low_stock: Product[];
  out_of_stock: Product[];
}

export default function InventoryAlertsPage() {
  const { data: alerts, isLoading } = useQuery<InventoryAlerts>({
    queryKey: ['seller-inventory-alerts'],
    queryFn: async () => {
      const { data } = await api.get('/seller/inventory-alerts?threshold=10');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory alerts...</p>
        </div>
      </div>
    );
  }

  const getImages = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-3 rounded-xl">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Alerts</h1>
            <p className="text-gray-600">Products requiring attention</p>
          </div>
        </div>
        <Link href="/seller/products">
          <Button variant="outline">
            View All Products
          </Button>
        </Link>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {alerts?.out_of_stock?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Products need restocking</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
            <TrendingDown className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {alerts?.low_stock?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Products running low</p>
          </CardContent>
        </Card>
      </div>

      {/* Out of Stock Products */}
      {alerts?.out_of_stock && alerts.out_of_stock.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Out of Stock Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.out_of_stock.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getImages(product.images)[0] && (
                      <img
                        src={getImages(product.images)[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className="bg-red-600 text-white">
                        Out of Stock
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Stock: 0</p>
                    </div>
                    <Link href={`/seller/products/${product.id}/edit`}>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Restock Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Products */}
      {alerts?.low_stock && alerts.low_stock.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-600">
              <TrendingDown className="h-5 w-5 mr-2" />
              Low Stock Products (10 or less)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.low_stock.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getImages(product.images)[0] && (
                      <img
                        src={getImages(product.images)[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className="bg-yellow-600 text-white">
                        Low Stock
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Stock: {product.stock} units
                      </p>
                    </div>
                    <Link href={`/seller/products/${product.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Update Stock
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Alerts */}
      {(!alerts?.out_of_stock || alerts.out_of_stock.length === 0) &&
       (!alerts?.low_stock || alerts.low_stock.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Good!</h3>
            <p className="text-gray-600">
              Your inventory is well stocked. No alerts at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
