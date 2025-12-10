// lib/hooks/useIsHydrated.ts
import { useState, useEffect } from 'react';
import useAuthStore from '@/lib/authStore';

export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // A client-only hook, so we can safely check for window
    if (typeof window === 'undefined') {
      return;
    }

    // Check if hydration is already done
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    return () => {
      unsubFinish();
    };
  }, []);

  return isHydrated;
}
