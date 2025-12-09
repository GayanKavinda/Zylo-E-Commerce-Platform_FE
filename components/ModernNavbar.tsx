'use client';

import React, { useState } from 'react';
import useAuthStore from '@/lib/authStore';
import useCartStore from '@/lib/cartStore';
import { useLogout } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Home, 
  Package, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  User,
  Store,
  Settings,
  ChevronDown,
  ShoppingBag,
  BarChart3,
} from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export default function ModernNavbar() {
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/login');
    } catch (error) {
      router.push('/login');
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">ShopHub</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  // Role-based navigation links
  const getNavLinks = () => {
    if (!user) return [];
    
    const role = user.role.toLowerCase();
    
    // Common links for all users
    const commonLinks = [
      { href: '/', label: 'Home', icon: Home },
      { href: '/products', label: 'Products', icon: Package },
    ];

    // Role-specific links
    if (role === 'superadmin' || role === 'admin') {
      return [
        ...commonLinks,
        { href: '/admin', label: 'Admin Panel', icon: Settings },
        { href: '/admin/users', label: 'Users', icon: User },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      ];
    } else if (role === 'seller') {
      return [
        ...commonLinks,
        { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/seller/products', label: 'My Products', icon: Package },
        { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
      ];
    } else {
      // Customer
      return [
        ...commonLinks,
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/orders', label: 'My Orders', icon: ShoppingBag },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-sm">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 5).map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Cart Button */}
                <Link href="/cart" className="hidden sm:block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-[10px] border-2 border-white dark:border-gray-900">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Theme Toggle */}
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>

                {/* User Menu - Desktop */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="hidden xl:block text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            <Badge variant="secondary" className="w-fit mt-1 capitalize text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/orders')}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-8">
                      {/* User Info */}
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-indigo-100 dark:border-indigo-900">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                          <Badge variant="secondary" className="capitalize text-xs mt-1">
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                          <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-950" size="lg">
                              <link.icon className="h-5 w-5 mr-3" />
                              {link.label}
                            </Button>
                          </Link>
                        ))}
                        
                        <div className="border-t dark:border-gray-700 my-2"></div>
                        
                        <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start relative hover:bg-indigo-50 dark:hover:bg-indigo-950" size="lg">
                            <ShoppingCart className="h-5 w-5 mr-3" />
                            Cart
                            {getTotalItems() > 0 && (
                              <Badge className="ml-auto bg-indigo-600">
                                {getTotalItems()}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                        <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-950" size="lg">
                            <User className="h-5 w-5 mr-3" />
                            My Profile
                          </Button>
                        </Link>
                        <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-950" size="lg">
                            <ShoppingBag className="h-5 w-5 mr-3" />
                            My Orders
                          </Button>
                        </Link>
                        <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-950" size="lg">
                            <Settings className="h-5 w-5 mr-3" />
                            Settings
                          </Button>
                        </Link>
                      </nav>

                      {/* Theme Toggle Mobile */}
                      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium">Dark Mode</span>
                        <ThemeToggle />
                      </div>

                      {/* Logout */}
                      <Button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        variant="destructive"
                        className="w-full"
                        size="lg"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
