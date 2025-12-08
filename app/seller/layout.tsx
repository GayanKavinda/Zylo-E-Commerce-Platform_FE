'use client';

import React from 'react';
import Link from 'next/link';
import SellerSidebar from '@/components/SellerSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import useAuthStore from '@/lib/authStore';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute roles={['seller']}>
      <div className="min-h-screen bg-gray-50 flex">
        <SellerSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-gray-900">Welcome back, {user?.name || 'Seller'}</h1>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  View Store
                </Link>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to logout?')) {
                      useAuthStore.getState().logout();
                      router.push('/login');
                    }
                  }}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
