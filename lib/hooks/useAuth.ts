// lib/hooks/useAuth.ts
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import useAuthStore from '@/lib/authStore';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  password_confirmation?: string;
  role?: 'customer' | 'seller';
}

interface AuthResponse {
  user: User;
  token: string;
}

// ✅ Fetch current user (server state)
export const useUser = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await api.get<{ user: User }>('/user');
      return data.user;
    },
    enabled: !!token && typeof window !== 'undefined', // Only fetch if token exists and we're on client
    staleTime: 1000 * 60 * 10, // 10 minutes - keep user data fresh
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    retry: false, // Don't retry failed requests
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};

// ✅ Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>('/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(['user', 'me'], data.user);
    },
  });
};

// ✅ Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await api.post<AuthResponse>('/register', userData);
      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(['user', 'me'], data.user);
    },
  });
};

// ✅ Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post('/logout');
      } catch (error) {
        // Even if logout API call fails, we should still clear local state
        console.warn('Logout API call failed, but clearing local state anyway:', error);
      }
    },
    onSuccess: () => {
      // Clear all cached data first
      queryClient.clear();
      // Remove all queries from cache
      queryClient.removeQueries();
      // Then logout (which clears the store and persisted storage)
      logout();
    },
    onError: () => {
      // Even on error, clear everything locally
      queryClient.clear();
      queryClient.removeQueries();
      logout();
    },
  });
};

// ✅ Composed auth helper for client components
export const useAuth = () => {
  const token = useAuthStore((state) => state.token);
  const cachedUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const { data, isLoading, error, isFetching } = useUser();

  // Prefer server data over cached data, but use cached while loading
  // Only use cached user if we have a token (otherwise it's stale from logout)
  const user = token ? (data ?? cachedUser) : null;

  useEffect(() => {
    // Only sync user data if we have a token
    if (token && data && data !== cachedUser) {
      setUser(data);
    } else if (!token) {
      // Clear user from store if no token
      setUser(null);
    }
  }, [data, cachedUser, setUser, token]);

  // Handle 401 errors - clear auth state
  // Only logout if we had a token but API says it's invalid
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401 && token) {
      console.warn('🔒 Unauthorized - token is invalid, clearing auth state');
      console.warn('🔍 Error details:', {
        errorMessage: (error as any)?.message,
        errorResponse: (error as any)?.response,
        stack: new Error().stack // Show which component triggered this
      });
      setUser(null);
      logout();
    }
  }, [error, setUser, logout, token]);

  // Log auth state for debugging
  useEffect(() => {
    console.log('🔐 Auth State:', {
      hasToken: !!token,
      hasCachedUser: !!cachedUser,
      hasUser: !!user,
      userRole: user?.role,
      isLoading,
      isFetching,
      error: error ? 'YES' : 'NO'
    });
  }, [token, cachedUser, user, isLoading, isFetching, error]);

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading: isLoading && !cachedUser, // Only show loading if no cached data
    error,
    logout,
  };
};
