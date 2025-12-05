// lib/hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'seller' | 'customer';
  spatie_roles?: string[];
  created_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

// Get all users
export const useAdminUsers = () => {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
  });
};

// Get single user
export const useAdminUser = (id: number) => {
  return useQuery<AdminUser>({
    queryKey: ['admin', 'users', id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create user
export const useAdminCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data } = await api.post('/admin/users', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Update user
export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: UpdateUserData }) => {
      const { data } = await api.put(`/admin/users/${id}`, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Delete user
export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/admin/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Change user role
export const useAdminChangeUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const { data } = await api.post(`/admin/users/${id}/change-role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Get available roles
export const useAdminRoles = () => {
  return useQuery<Record<string, string>>({
    queryKey: ['admin', 'roles'],
    queryFn: async () => {
      const { data } = await api.get('/admin/roles');
      return data;
    },
  });
};
