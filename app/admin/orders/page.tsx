// app/admin/orders/page.tsx
'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Order management will be implemented in the next sprint.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ProtectedOrders() {
  return (
    <ProtectedRoute roles={["superadmin", "admin"]}>
      <OrdersPage />
    </ProtectedRoute>
  );
}
