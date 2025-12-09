// app/admin/layout.tsx
'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={['admin', 'superadmin']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="container-responsive py-6 sm:py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
