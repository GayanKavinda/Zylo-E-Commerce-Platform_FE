//app/components/Navbar.tsx

'use client';
import React from 'react';
import useAuthStore from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <span className="font-bold">My App</span>
      {user && (
        <div className="flex gap-4">
          <span>{user.name} ({user.role})</span>
          <button
            onClick={() => logout()}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}