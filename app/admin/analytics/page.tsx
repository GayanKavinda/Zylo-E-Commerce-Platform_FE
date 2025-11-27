// app/admin/analytics/page.tsx
'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analytics dashboard will be implemented in the next sprint.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ProtectedAnalytics() {
  return (
    <ProtectedRoute roles={["superadmin", "admin"]}>
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
