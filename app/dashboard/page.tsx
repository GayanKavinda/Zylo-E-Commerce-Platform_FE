//app/dashboard/page.tsx

'use client';

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import useAuthStore from "@/lib/authStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Stats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loadUser = useAuthStore((state) => state.loadUser);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch if we have a token
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await loadUser();
        // Fetch some stats
        const statsRes = await api.get("/dashboard/stats");
        setStats(statsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loadUser, token]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  console.log("[Dashboard] User:", user);
  console.log("[Dashboard] Stats:", stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.totalCustomers}</span>
          <Badge variant="secondary" className="ml-2">{user.role}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.totalProducts}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.totalOrders}</span>
          <Button className="ml-4" size="sm" onClick={() => alert("View Orders")}>
            View Orders
          </Button>
        </CardContent>
      </Card>
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
