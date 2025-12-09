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
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MobileSellerMenuProps {
  stats?: {
    pending_orders: number;
    low_stock: number;
    total_products: number;
    total_revenue: number;
  };
}

export default function MobileSellerMenu({ stats }: MobileSellerMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-around p-2">
        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-150 relative',
                isActive
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
              {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                <Badge className={cn(
                  "absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-[10px]",
                  item.alert 
                    ? "bg-red-600 dark:bg-red-500" 
                    : "bg-gray-500 dark:bg-gray-600"
                )}>
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
        
        {/* More Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex flex-col items-center gap-1 px-3 py-2">
              <Menu className="h-5 w-5" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>Seller Menu</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 mt-6 pb-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border transition-all',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                      <Badge className={cn(
                        "text-xs",
                        item.alert 
                          ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      )}>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
