// app/admin/settings/page.tsx
'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">System settings will be implemented in the next sprint.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ProtectedSettings() {
  return (
    <ProtectedRoute roles={["superadmin", "admin"]}>
      <SettingsPage />
    </ProtectedRoute>
  );
}
