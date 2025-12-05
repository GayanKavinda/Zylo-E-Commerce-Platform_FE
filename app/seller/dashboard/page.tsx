'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown,
  Clock, CheckCircle, Truck, Plus, ArrowUpRight, ArrowRight,
  AlertCircle, PackageCheck, FileText, BarChart2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/lib/hooks';

interface DashboardStats {
  products: {
    total: number;
    active: number;
    out_of_stock: number;
  };
  sales: {
    total_revenue: number;
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    shipped_orders: number;
  };
  recent_sales: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  top_products: Array<{
    id: number;
    name: string;
    price: number;
    order_items_count: number;
  }>;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['seller-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/seller/dashboard');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const monthlyRevenue = Number(stats?.recent_sales?.reduce((sum, s) => sum + parseFloat(s.revenue.toString()), 0) || 0);
  const monthlyOrders = Number(stats?.recent_sales?.reduce((sum, s) => sum + s.count, 0) || 0);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Overview of your store performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/seller/products/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(stats?.sales.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +${monthlyRevenue.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sales.total_orders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.sales.pending_orders || 0} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.products.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.products.active || 0} active listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.sales.total_orders && stats?.products.total 
                ? ((stats.sales.total_orders / stats.products.total) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Orders per product
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Orders Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-medium">Orders Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => router.push('/seller/orders?status=pending')}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Pending</p>
                    <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6">
                    {stats?.sales.pending_orders || 0}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => router.push('/seller/orders?status=processing')}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <PackageCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Processing</p>
                    <p className="text-xs text-muted-foreground">Being prepared</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6">
                    {stats?.sales.processing_orders || 0}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => router.push('/seller/orders?status=shipped')}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                    <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Shipped</p>
                    <p className="text-xs text-muted-foreground">Out for delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-6">
                    {stats?.sales.shipped_orders || 0}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Recent Sales</CardTitle>
            <Link href="/seller/analytics">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                View all
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recent_sales && stats.recent_sales.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_sales.slice(0, 5).map((sale) => (
                  <div key={sale.date} className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">
                        {new Date(sale.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.count} {sale.count === 1 ? 'order' : 'orders'}
                      </p>
                    </div>
                    <div className="font-semibold">
                      ${Number(parseFloat(sale.revenue.toString()) || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <BarChart2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No sales yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Products */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-medium">Top Products</CardTitle>
              <CardDescription className="text-xs">Best selling items this month</CardDescription>
            </div>
            <Link href="/seller/products">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                View all
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.top_products && stats.top_products.length > 0 ? (
              <div className="space-y-3">
                {stats.top_products.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${product.price}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-auto shrink-0">
                      {product.order_items_count} sold
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No sales data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/seller/products/new" className="block">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/seller/orders" className="block">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <Link href="/seller/products" className="block">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/seller/analytics" className="block">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats?.products.out_of_stock > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/10 dark:border-orange-900">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-400">
                Low Stock Alert
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-xs text-orange-800 dark:text-orange-300 mb-3">
              {stats.products.out_of_stock} product{stats.products.out_of_stock !== 1 ? 's' : ''} out of stock
            </p>
            <Link href="/seller/products">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Manage Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}