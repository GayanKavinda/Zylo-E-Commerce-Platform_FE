'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Package,
  LayoutDashboard,
  Settings,
  LogOut,
  Heart,
  Bell,
} from 'lucide-react';
import { APP_CONFIG, ROUTES, NAV_ITEMS, USER_ROLES } from '@/lib/constants';
import { useCart } from '@/lib/hooks';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const authState = useAuth();
  const authData = { user: authState.user };
  const user = authData?.user;
  const { data: cartData } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only show cart count if user is logged in
  const cartItemsCount = user ? (cartData?.items_count || 0) : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getNavItemsForRole = () => {
    if (!user) return NAV_ITEMS.PUBLIC;
    
    switch (user.role) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.SUPERADMIN:
        return NAV_ITEMS.ADMIN;
      case USER_ROLES.SELLER:
        return NAV_ITEMS.SELLER;
      case USER_ROLES.CUSTOMER:
        return NAV_ITEMS.CUSTOMER;
      default:
        return NAV_ITEMS.PUBLIC;
    }
  };

  const roleNavItems = getNavItemsForRole();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href={ROUTES.PRODUCTS} className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
                  M
                </div>
                <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                  {APP_CONFIG.NAME}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href={ROUTES.PRODUCTS} className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
                M
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                {APP_CONFIG.NAME}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href={ROUTES.PRODUCTS}>
                <Button
                  variant={pathname === ROUTES.PRODUCTS ? 'secondary' : 'ghost'}
                  size="sm"
                  className="text-sm"
                >
                  Products
                </Button>
              </Link>
              <Link href={`${ROUTES.PRODUCTS}?view=categories`}>
                <Button variant="ghost" size="sm" className="text-sm">
                  Categories
                </Button>
              </Link>
              <Link href={`${ROUTES.PRODUCTS}?discount=25`}>
                <Button variant="ghost" size="sm" className="text-sm">
                  Deals
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`${ROUTES.PRODUCTS}?search=${e.currentTarget.value}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Search Products</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push(`${ROUTES.PRODUCTS}?search=${e.currentTarget.value}`);
                      }
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Cart */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push(ROUTES.CART)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <Badge variant="outline" className="w-fit text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {roleNavItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => router.push(item.href)}
                    >
                      {item.label === 'Dashboard' && <LayoutDashboard className="mr-2 h-4 w-4" />}
                      {item.label === 'My Orders' && <Package className="mr-2 h-4 w-4" />}
                      {item.label === 'My Profile' && <User className="mr-2 h-4 w-4" />}
                      {item.label === 'Products' && <Package className="mr-2 h-4 w-4" />}
                      {item.label === 'Orders' && <Package className="mr-2 h-4 w-4" />}
                      {item.label === 'My Products' && <Package className="mr-2 h-4 w-4" />}
                      {item.label === 'Analytics' && <LayoutDashboard className="mr-2 h-4 w-4" />}
                      {item.label === 'Users' && <User className="mr-2 h-4 w-4" />}
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(ROUTES.LOGIN)}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(ROUTES.REGISTER)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-3">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push(ROUTES.PRODUCTS);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Products
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push(`${ROUTES.PRODUCTS}?view=categories`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Categories
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push(`${ROUTES.PRODUCTS}?discount=25`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Deals
                  </Button>
                  
                  {user && (
                    <>
                      <hr className="my-2" />
                      {roleNavItems.map((item) => (
                        <Button
                          key={item.href}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            router.push(item.href);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
