// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';

import useAuthStore from "@/lib/authStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null; // Don't show loading spinner, just render nothing briefly
  }

  // If no user/token after mount, the ProtectedRoute will handle redirect
  if (!user && !token) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">


      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
