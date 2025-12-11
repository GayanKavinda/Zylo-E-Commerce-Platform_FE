"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/lib/authStore";
import { useLogout } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  ChevronDown,
  X,
  TrendingUp,
  Tag,
  Grid3x3,
  Store,
  Users,
  BarChart3,
  ShoppingBag,
  MapPin,
  CreditCard,
  HelpCircle,
  Star,
  Wallet,
  UserCircle,
  Shield,
} from "lucide-react";
import { APP_CONFIG, ROUTES, NAV_ITEMS, USER_ROLES } from "@/lib/constants";
import { useCart } from "@/lib/hooks";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const { data: cartData } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const cartItemsCount = user ? cartData?.items_count || 0 : 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
      router.push(ROUTES.LOGIN);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`${ROUTES.PRODUCTS}?search=${searchValue}`);
      setSearchOpen(false);
      setSearchValue("");
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

  const quickLinks = [
    { label: "All Products", href: ROUTES.PRODUCTS, icon: Grid3x3 },
    {
      label: "Categories",
      href: `${ROUTES.PRODUCTS}?view=categories`,
      icon: Tag,
    },
    {
      label: "Best Deals",
      href: `${ROUTES.PRODUCTS}?discount=25`,
      icon: TrendingUp,
    },
  ];

  // Icon mapping for role-based items
  const getIconForLabel = (label: string) => {
    const map: Record<string, any> = {
      Dashboard: LayoutDashboard,
      "My Orders": ShoppingBag,
      Orders: ShoppingBag,
      "My Profile": UserCircle,
      Profile: UserCircle,
      Products: Package,
      "My Products": Store,
      Analytics: BarChart3,
      Users: Users,
      Wishlist: Heart,
      Addresses: MapPin,
      "Payment Methods": CreditCard,
    };
    return map[label] || Package;
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-center py-2 px-4 text-sm font-medium">
        <span className="hidden sm:inline">
          Free Shipping on Orders Over $50 |{" "}
        </span>
        Use Code: WELCOME10 for 10% Off
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full bg-white border-b transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo + Links */}
            <div className="flex items-center space-x-8">
              <Link
                href={ROUTES.PRODUCTS}
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-xl w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                    M
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {APP_CONFIG.NAME}
                  </div>
                  <div className="text-xs text-gray-500 -mt-1">
                    Premium Shopping
                  </div>
                </div>
              </Link>

              <div className="hidden lg:flex items-center space-x-1">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href}>
                      <button className="group relative px-4 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                            {link.label}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex items-center">
                  <Input
                    type="search"
                    placeholder="Search for products, brands, and more..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-5 pr-12 py-6 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {searchOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>

              {user && (
                <>
                  <button className="hidden sm:flex relative p-2 rounded-full hover:bg-gray-100 group">
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      0
                    </span>
                  </button>

                  <button
                    onClick={() => router.push(ROUTES.CART)}
                    className="relative p-2 rounded-full hover:bg-gray-100 group"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* USER DROPDOWN – Compact & Beautiful */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-all group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-semibold">
                          {user.name.split(" ")[0]}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {user.role}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-72 mt-2 p-3 rounded-2xl shadow-xl border border-gray-200 bg-white"
                  >
                    {/* Compact Header */}
                    <div className="flex items-center space-x-3 pb-3 border-b">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    {/* Role-based Links – Clean & Icon-only on left */}
                    <div className="py-2 space-y-1">
                      {roleNavItems.map((item) => {
                        const Icon = getIconForLabel(item.label);
                        return (
                          <DropdownMenuItem
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className="flex items-center space-x-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Icon className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-800">
                              {item.label}
                            </span>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>

                    <DropdownMenuSeparator className="my-2" />

                    {/* Quick Actions */}
                    <div className="space-y-1">
                      <DropdownMenuItem
                        onClick={() => router.push(ROUTES.PROFILE)}
                        className="flex items-center space-x-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Settings</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => router.push("/help")}
                        className="flex items-center space-x-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Help & Support</span>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-2" />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center space-x-3 rounded-xl px-3 py-2.5 hover:bg-red-50 text-red-600 cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Your existing guest buttons
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => router.push(ROUTES.LOGIN)}
                    className="hidden sm:flex rounded-full px-5 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" /> Login
                  </Button>
                  <Button
                    onClick={() => router.push(ROUTES.REGISTER)}
                    className="rounded-full px-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 rounded-full hover:bg-gray-100">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  {/* Mobile menu content - you can enhance this too if needed */}
                  <div className="h-full flex flex-col">
                    <SheetHeader className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <SheetTitle className="text-xl font-bold">
                        Menu
                      </SheetTitle>
                      {user && (
                        <div className="mt-4 flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <Badge className="mt-1 bg-white/20 text-white border-0 text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </SheetHeader>
                    {/* Add mobile items similar to desktop if desired */}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden border-t bg-gray-50 p-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoFocus
                className="w-full pl-5 pr-12 py-6 rounded-full border-2 border-gray-200 focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-full"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
