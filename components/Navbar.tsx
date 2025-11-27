//app/components/Navbar.tsx

'use client';

import React from 'react';
import useAuthStore from '@/lib/authStore';
import useCartStore from '@/lib/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Home, Package, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const router = useRouter();

  if (!user) return null;

  console.log('[Navbar] Current user:', user);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Left: Brand & Welcome */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="font-bold text-xl hover:text-purple-200 transition-colors cursor-pointer">
                🛍️ ShopHub
              </h1>
            </Link>
            <span className="hidden md:block text-sm text-purple-100">
              Welcome, <span className="font-semibold">{user.name}</span>
            </span>
          </div>

          {/* Right: Navigation & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Home className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Package className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Products</span>
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <LayoutDashboard className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
                <ShoppingCart className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Cart</span>
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-white/30">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">
                {user.role}
              </Badge>
            </div>

            <Button
              onClick={logout}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile user info */}
        <div className="md:hidden pb-2 text-sm text-purple-100 border-t border-white/20 pt-2">
          <span className="font-semibold">{user.name}</span> • <span className="capitalize">{user.role}</span>
        </div>
      </div>
    </header>
  );
}
