'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/authStore';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loadUser = useAuthStore((state) => state.loadUser);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      // No token → straight to login
      if (!token) {
        router.replace('/login');
        return;
      }

      // If token exists but user not loaded → load user
      if (!user) {
        await loadUser();
      }

      setChecking(false);
    };

    verify();
    console.log("Current user =", user);
  }, [token, user, loadUser, router]);

  // While checking auth
  if (checking || !user) return <p>Loading...</p>;

  // Role protection
  if (roles && !roles.includes(user.role)) {
    router.replace('/dashboard');
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
