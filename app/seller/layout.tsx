'use client';

import React from 'react';
import Link from 'next/link';
import SellerSidebar from '@/components/SellerSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import useAuthStore from '@/lib/authStore';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    // Only check after initial load is complete
    if (!isLoading) {
      setIsChecking(false);
      
      if (!user || !token) {
        console.log('❌ No user or token, redirecting to login');
        router.push('/login');
      } else if (user.role !== 'seller') {
        console.log('❌ User is not a seller, redirecting to dashboard');
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, token, router]);

  // Show loading only on initial mount or when explicitly loading
  if (isLoading || (isChecking && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller portal...</p>
        </div>
      </div>
    );
  }

  // Don't render if no valid seller user
  if (!user || user.role !== 'seller') {
    return null;
  }

  return (
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
  );
}
