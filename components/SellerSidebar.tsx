'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3,
  Settings,
  Store,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface SellerStats {
  pending_orders: number;
  low_stock: number;
  total_products: number;
  total_revenue: number;
}

export default function SellerSidebar() {
  const pathname = usePathname();

  // Fetch quick stats for badges
  const { data: stats } = useQuery<SellerStats>({
    queryKey: ['seller-quick-stats'],
    queryFn: async () => {
      try {
        const [dashboardRes, alertsRes] = await Promise.all([
          api.get('/seller/dashboard'),
          api.get('/seller/inventory-alerts')
        ]);
        
        return {
          pending_orders: dashboardRes.data.sales?.pending_orders || 0,
          low_stock: alertsRes.data.low_stock?.length || 0,
          total_products: dashboardRes.data.products?.total || 0,
          total_revenue: dashboardRes.data.sales?.total_revenue || 0,
        };
      } catch (error) {
        return {
          pending_orders: 0,
          low_stock: 0,
          total_products: 0,
          total_revenue: 0,
        };
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const navigation = [
    {
      name: 'Dashboard',
      href: '/seller/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      href: '/seller/products',
      icon: Package,
      badge: stats?.total_products,
    },
    {
      name: 'Orders',
      href: '/seller/orders',
      icon: ShoppingBag,
      badge: stats?.pending_orders,
      alert: stats?.pending_orders && stats.pending_orders > 0,
    },
    {
      name: 'Analytics',
      href: '/seller/analytics',
      icon: BarChart3,
    },
    {
      name: 'Settings',
      href: '/seller/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0 overflow-y-auto hidden lg:block">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Seller Portal</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Manage your store</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${Number(stats.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {stats.low_stock > 0 && (
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 px-2 py-1.5 rounded-md">
                <AlertCircle className="h-3 w-3" />
                <span>{stats.low_stock} low stock items</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                )} />
                <span>{item.name}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-semibold rounded-full",
                  item.alert 
                    ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Grow your business</p>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">Access analytics and reports</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
