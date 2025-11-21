//app/components/Navbar.tsx

'use client';
import React from 'react';
import useAuthStore from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  if (!user) return null; // Hide Navbar if not logged in

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <span className="font-bold">My App</span>
      <div className="flex gap-4">
        <span>{user.name} ({user.role})</span>
        <div className="flex gap-2">
          {user.role === "admin" && (
            <button onClick={() => router.push("/admin")} className="bg-blue-600 px-3 py-1 rounded">
              Admin Products
            </button>
          )}
          {(user.role === "customer" || user.role === "seller") && (
            <button onClick={() => router.push("/dashboard/customer")} className="bg-green-600 px-3 py-1 rounded">
              Customer Module
            </button>
          )}
        </div>
        <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
}
