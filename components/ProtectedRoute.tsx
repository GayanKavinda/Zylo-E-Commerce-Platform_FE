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
  if (checking || isLoading || !user) return <p>Loading...</p>;

  // Role protection
  if (roles && !roles.includes(user.role)) {
    router.replace('/dashboard');
    return <p>Redirecting...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
