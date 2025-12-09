//app/dashboard/page.tsx

'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import useAuthStore from "@/lib/authStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/useAuth";
import { useDashboardStats } from "@/lib/hooks/useDashboard";
import { useEffect } from "react";
import { ShoppingBag, Package, TrendingUp, Users } from "lucide-react";

const DashboardPage = () => {
  // ✅ Client state from Zustand
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  
  // ✅ Server state from TanStack Query
  const { data: user, isLoading: userLoading } = useUser();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  // Sync user to Zustand for navbar/sidebar access
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (!token) return <p className="text-center p-8">Please login first</p>;
  if (userLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}! 👋</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Role</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2 capitalize">{user.role}</p>
                <Badge variant="secondary" className="mt-2 dark:bg-gray-700 dark:text-gray-300">Active</Badge>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalProducts ?? 0}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">In inventory</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalOrders ?? 0}</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs text-purple-600 dark:text-purple-400 mt-2"
                  onClick={() => alert("Orders coming soon!")}
                >
                  View all →
                </Button>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="border-b dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
          <CardTitle className="text-lg dark:text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 hover:border-purple-300 dark:hover:border-purple-700 dark:border-gray-600"
            >
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <span className="dark:text-gray-300">Browse Products</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-300 dark:hover:border-green-700 dark:border-gray-600"
            >
              <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="dark:text-gray-300">View Orders</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-950 hover:border-orange-300 dark:hover:border-orange-700 dark:border-gray-600 sm:col-span-2 lg:col-span-1"
            >
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <span className="dark:text-gray-300">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific content */}
      {(user.role === 'superadmin' || user.role === 'admin') && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Admin Access</h3>
            <p className="text-purple-100 mb-4 text-sm sm:text-base">You have full access to the admin panel</p>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/admin'}
              className="w-full sm:w-auto"
            >
              Go to Admin Panel →
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute roles={["superadmin", "admin", "seller", "customer"]}>
      <DashboardPage />
    </ProtectedRoute>
  );
}
