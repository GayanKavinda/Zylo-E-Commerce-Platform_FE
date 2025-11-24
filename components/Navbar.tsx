//app/components/Navbar.tsx

'use client';

import React from 'react';
import useAuthStore from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  if (!user) return null;

  console.log('[Navbar] Current user:', user);

  return (
    <header className="flex justify-between items-center bg-gray-800 text-white px-6 py-3">
      <h1 className="font-bold text-lg">Welcome, {user.name}</h1>
      <div className="flex items-center gap-4">
        <span className="capitalize">{user.role}</span>
        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
