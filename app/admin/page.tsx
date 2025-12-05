// app/admin/page.tsx
'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/lib/hooks/useDashboard";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { useProducts } from "@/lib/hooks/useProducts";
import { Users, Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminDashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useAdminUsers();
  const { data: productsResponse, isLoading: productsLoading } = useProducts();
  
  // Extract products array from paginated response
  const products = productsResponse?.data || [];

  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: "+12% from last month",
      trend: "up",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Products",
      value: productsResponse?.total || products.length,
      icon: Package,
      description: "+8% from last month",
      trend: "up",
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      description: "+23% from last month",
      trend: "up",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Revenue",
      value: "$12,540",
      icon: TrendingUp,
      description: "+15% from last month",
      trend: "up",
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  if (usersLoading || productsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (usersError) {
    console.error("Users error:", usersError);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">Track your e-commerce performance</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Gradient Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-xl shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Users</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {users.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="divide-y">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={user.role === 'superadmin' ? 'destructive' : user.role === 'admin' ? 'default' : 'secondary'}
                        className="capitalize text-xs"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Products</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {products.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {products.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No products found</p>
              </div>
            ) : (
              <div className="divide-y">
                {products.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">Stock: {product.stock} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${product.price}</p>
                        <Badge 
                          variant={product.stock > 10 ? 'secondary' : product.stock > 0 ? 'default' : 'destructive'}
                          className="text-xs mt-1"
                        >
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function ProtectedAdmin() {
  return (
    <ProtectedRoute roles={["superadmin", "admin"]}>
      <AdminDashboardPage />
    </ProtectedRoute>
  );
}
