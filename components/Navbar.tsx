//app/components/Navbar.tsx

'use client';

import React from 'react';
import useAuthStore from '@/lib/authStore';
import useCartStore from '@/lib/cartStore';
import { useLogout } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Home, Package, LayoutDashboard, LogOut } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

// Re-export ModernNavbar as default
import ModernNavbar from './ModernNavbar';
export default ModernNavbar;

function OldNavbar() {
  const [mounted, setMounted] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/login');
    } catch (error) {
      // Even if logout fails, redirect to login
      router.push('/login');
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // To avoid hydration mismatch, we can render a placeholder or null on the server.
    // A simple header with the brand and theme toggle can be a good placeholder.
    return (
      <header className="bg-purple-600 text-white shadow-lg sticky top-0 z-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link href="/">
              <h1 className="font-bold text-xl hover:text-purple-200 dark:hover:text-white transition-colors cursor-pointer">
                🛍️ ShopHub
              </h1>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-purple-600 text-white shadow-lg sticky top-0 z-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Left: Brand & Welcome */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="font-bold text-xl hover:text-purple-200 dark:hover:text-white transition-colors cursor-pointer">
                🛍️ ShopHub
              </h1>
            </Link>
            {user && (
              <span className="hidden md:block text-sm text-purple-100 dark:text-gray-300">
                Welcome, <span className="font-semibold">{user.name}</span>
              </span>
            )}
          </div>

          {/* Right: Navigation & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700">
                    <Home className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Home</span>
                  </Button>
                </Link>

                <Link href="/products">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700">
                    <Package className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Products</span>
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700">
                    <LayoutDashboard className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Button>
                </Link>

                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700">
                    <ShoppingCart className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Cart</span>
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-white/30 dark:border-gray-600">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize dark:bg-gray-700 dark:text-gray-200">
                    {user.role}
                  </Badge>
                </div>
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile user info */}
        {user && (
          <div className="md:hidden pb-2 text-sm text-purple-100 border-t border-white/20 pt-2 dark:text-gray-300 dark:border-gray-700">
            <span className="font-semibold">{user.name}</span> • <span className="capitalize">{user.role}</span>
          </div>
        )}
      </div>
    </header>
  );
}
