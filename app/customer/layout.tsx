'use client';

import React from 'react';
import ProfessionalNavbar from '@/components/ProfessionalNavbar';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'customer') {
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

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">About ShopHub</h3>
              <p className="text-sm text-gray-600">Your trusted online shopping destination with quality products and excellent service.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/help" className="hover:text-indigo-600">Help Center</a></li>
                <li><a href="/returns" className="hover:text-indigo-600">Returns</a></li>
                <li><a href="/shipping" className="hover:text-indigo-600">Shipping Info</a></li>
                <li><a href="/contact" className="hover:text-indigo-600">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/products" className="hover:text-indigo-600">Shop All</a></li>
                <li><a href="/deals" className="hover:text-indigo-600">Deals</a></li>
                <li><a href="/new-arrivals" className="hover:text-indigo-600">New Arrivals</a></li>
                <li><a href="/gift-cards" className="hover:text-indigo-600">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Connect With Us</h3>
              <p className="text-sm text-gray-600 mb-4">Subscribe to get special offers and updates.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
