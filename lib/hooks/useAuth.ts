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
    enabled: !!token, // Only fetch if token exists
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
      await api.post('/logout');
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data
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
  const { data, isLoading, error } = useUser();

  const user = data ?? cachedUser;

  useEffect(() => {
    if (data && data !== cachedUser) {
      setUser(data);
    }
  }, [data, cachedUser, setUser]);

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    error,
    logout,
  };
};
