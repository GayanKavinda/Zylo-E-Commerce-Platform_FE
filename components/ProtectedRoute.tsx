//app/components/ProtectedRoute.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/authStore';
import { ReactNode } from 'react';
import { useUser } from '@/lib/hooks/useAuth';

interface Props {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const cachedUser = useAuthStore((state) => state.user);
  
  // ✅ Use TanStack Query to fetch user data
  const { data: user, isLoading, error } = useUser();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // No token → redirect to login
    if (!token) {
      router.replace('/login');
      return;
    }

    // If user data loaded, sync to Zustand cache
    if (user) {
      setUser(user);
      setChecking(false);
    }

    // If error loading user (invalid token), redirect to login
    if (error) {
      router.replace('/login');
    }
  }, [token, user, error, router, setUser]);

  // While checking auth or loading user
  if (checking || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Role protection - don't redirect during render
  if (roles && !roles.includes(user.role)) {
    setTimeout(() => router.replace('/dashboard'), 0);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
