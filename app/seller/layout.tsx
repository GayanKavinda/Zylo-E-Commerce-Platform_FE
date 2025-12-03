'use client';

import React from 'react';
import ProfessionalNavbar from '@/components/ProfessionalNavbar';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'seller') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'seller') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {/* Seller Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Seller Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/seller/guide" className="hover:text-indigo-600">Seller Guide</a></li>
                <li><a href="/seller/policies" className="hover:text-indigo-600">Policies</a></li>
                <li><a href="/seller/fees" className="hover:text-indigo-600">Fee Structure</a></li>
                <li><a href="/seller/support" className="hover:text-indigo-600">Seller Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Tools & Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/seller/analytics" className="hover:text-indigo-600">Analytics Dashboard</a></li>
                <li><a href="/seller/promotions" className="hover:text-indigo-600">Promotions</a></li>
                <li><a href="/seller/advertising" className="hover:text-indigo-600">Advertising</a></li>
                <li><a href="/seller/api" className="hover:text-indigo-600">Developer API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">Our seller support team is here to help you succeed.</p>
              <a href="/seller/contact" className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Contact Support</a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 ShopHub Seller Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
