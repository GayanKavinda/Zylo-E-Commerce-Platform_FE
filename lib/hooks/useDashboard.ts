// lib/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

// ✅ Fetch dashboard stats
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/dashboard/stats');
      return data;
    },
  });
};
