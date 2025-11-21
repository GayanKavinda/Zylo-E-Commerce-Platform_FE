"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/lib/authStore";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Users, Package, Star } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
    const loadUser = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data.user);
      } catch {
        // Ignore errors - user remains null
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setUser]);

  if (!mounted || loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  // Not logged in view
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md w-full p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please log in to access your dashboard.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged in view
  const role = user.role;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Hello {user.name}
      </h1>
      <p className="text-muted-foreground mb-8">
        You are logged in as {role}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Panel for Super Admin */}
        {(role === "super_admin") && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Manage all system users and roles.
                </p>
                <Button asChild>
                  <Link href="/admin/users">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Access global configuration settings.
                </p>
                <Button asChild>
                  <Link href="/admin/settings">
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Panel for Admin */}
        {(role === "admin") && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Add, edit and manage products.
                </p>
                <Button asChild>
                  <Link href="/admin">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Products
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  View customer records.
                </p>
                <Button asChild>
                  <Link href="/dashboard/customer">
                    <Users className="w-4 h-4 mr-2" />
                    View Customers
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Panel for Seller */}
        {(role === "seller") && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>My Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Manage your own products and orders.
                </p>
                <Button asChild>
                  <Link href="/seller/products">
                    <Package className="w-4 h-4 mr-2" />
                    My Products
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ratings and Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Check feedback for your products.
                </p>
                <Button asChild>
                  <Link href="/seller/reviews">
                    <Star className="w-4 h-4 mr-2" />
                    View Reviews
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Panel for Customer */}
        {(role === "customer") && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>View Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Browse items and add to wishlist or cart.
                </p>
                <Button asChild>
                  <Link href="/products">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Products
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Items you have saved for later.
                </p>
                <Button asChild>
                  <Link href="/wishlist">
                    <Star className="w-4 h-4 mr-2" />
                    Wishlist
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

      </div>
    </div>
  );
}
