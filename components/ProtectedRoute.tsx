//app/components/ProtectedRoute.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/authStore';
import { ReactNode } from 'react';
import { useUser } from '@/lib/hooks/useAuth';
import { useIsHydrated } from '@/lib/hooks/useIsHydrated';

interface Props {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const cachedUser = useAuthStore((state) => state.user);
  const isHydrated = useIsHydrated();

  // ✅ Use TanStack Query to fetch user data
  const { data: user, isLoading, error } = useUser();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait until the store is hydrated
    if (!isHydrated) {
      return;
    }

    console.log('🛡️ ProtectedRoute Check:', {
      hasToken: !!token,
      hasCachedUser: !!cachedUser,
      hasUser: !!user,
      hasError: !!error,
      errorStatus: (error as any)?.response?.status,
    });

    // No token → redirect to login
    if (!token) {
      console.warn('❌ No token found - redirecting to login');
      router.replace('/login');
      return;
    }

    // If we have cached user from localStorage, use it immediately
    if (cachedUser && !user && !error) {
      console.log('✅ Using cached user from localStorage');
      setChecking(false);
      return;
    }

    // If user data loaded from API, sync to Zustand cache
    if (user) {
      console.log('✅ User data loaded from API');
      setUser(user);
      setChecking(false);
    }

    // Only redirect on error if it's actually a 401 (invalid token)
    if (error && (error as any)?.response?.status === 401) {
      console.warn('🔒 Invalid token detected in ProtectedRoute - 401 error');
      router.replace('/login');
    }
  }, [token, user, cachedUser, error, router, setUser, isHydrated]);

  // Use cached user while loading fresh data
  const currentUser = user || cachedUser;

  // While waiting for hydration, checking auth, or loading user
  if (!isHydrated || checking || (isLoading && !cachedUser) || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Role protection - don't redirect during render
  if (roles && !roles.includes(currentUser.role)) {
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
