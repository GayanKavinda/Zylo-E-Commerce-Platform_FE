'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth, useOrders } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Package, Heart, MapPin, CreditCard, 
  Settings, ShoppingBag, Star, Edit2, Save,
  BarChart2, Gift, ClipboardList, ShoppingBasket, Bell
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

// Helper to convert price to number
const toPriceNumber = (value: number | string | undefined | null) =>
  Number.parseFloat(String(value ?? 0));

function CustomerDashboardPage() {
  const router = useRouter();
  const authState = useAuth();
  const user = authState?.user; // Access user directly from authState
  const { data: ordersData } = useOrders();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // Effect to update profileData when user data changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  if (!user) {
    // ProtectedRoute should handle redirection, but a fallback is good
    return null;
  }

  const orders = ordersData?.data || [];
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + toPriceNumber(order.total_amount), 0);
  // Dummy data for wishlist items as we removed the original ProductCard toast
  const wishlistItemsCount = 5; 
  const reviewsWritten = 0; // Placeholder

  const stats = [
    { 
      label: 'Total Orders', 
      value: totalOrders, 
      icon: ShoppingBag,
      color: 'text-indigo-600'
    },
    { 
      label: 'Total Spent', 
      value: `$${totalSpent.toFixed(2)}`, 
      icon: CreditCard,
      color: 'text-green-600'
    },
    { 
      label: 'Wishlist Items', 
      value: wishlistItemsCount, 
      icon: Heart,
      color: 'text-red-600'
    },
    { 
      label: 'Reviews Written', 
      value: reviewsWritten, 
      icon: Star,
      color: 'text-yellow-600'
    },
  ];

  const handleProfileSave = () => {
    // Implement profile update logic here
    console.log('Saving profile data:', profileData);
    setIsEditingProfile(false);
  };

  const recentOrders = orders.slice(0, 5); // Show up to 5 recent orders

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <User className="h-16 w-16" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
              <p className="text-white/90 text-lg">{user.email}</p>
              <Badge className="mt-2 bg-white/30 text-white font-semibold">
                {user.role === 'customer' ? 'Customer Account' : user.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-12 w-12 opacity-20 ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for Dashboard Sections */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{profileData.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{profileData.address || 'N/A'}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => router.push(ROUTES.PROFILE)}>
                    Manage Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-purple-600" />
                    Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Here you can see a summary of your recent activities, order trends, and product recommendations.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Order</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {totalOrders > 0 ? new Date(orders[0].created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Order Value</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {totalOrders > 0 ? `$${(totalSpent / totalOrders).toFixed(2)}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => router.push(ROUTES.PRODUCTS)}>
                    Explore Products
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-teal-600" />
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalOrders === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No orders yet</p>
                    <Button onClick={() => router.push(ROUTES.PRODUCTS)}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => router.push(`${ROUTES.ORDERS}/${order.id}`)} // Assuming an order detail page
                      >
                        <div className="flex items-center space-x-4">
                          <Package className="h-10 w-10 text-teal-600/70" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">#{order.order_number}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">${toPriceNumber(order.total_amount).toFixed(2)}</p>
                          <Badge className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(ROUTES.ORDERS)}
                    >
                      View All Orders
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  My Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Your wishlist is empty</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Save your favorite items to buy them later
                  </p>
                  <Button onClick={() => router.push(ROUTES.PRODUCTS)}>
                    Browse Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Password Change */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="w-full">Update Password</Button>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Preferences (simplified) */}
              <Card className="lg:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-600" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order Updates</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about your order status</p>
                    </div>
                    {/* Placeholder for a toggle switch, assuming one exists or can be added from shadcn/ui */}
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Promotional Emails</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive news about sales and offers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ProtectedCustomerDashboard() {
  return (
    <ProtectedRoute roles={["customer"]}>
      <CustomerDashboardPage />
    </ProtectedRoute>
  );
}