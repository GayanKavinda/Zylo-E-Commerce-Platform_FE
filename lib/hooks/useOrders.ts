// lib/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from './useProducts';

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  fulfillment_status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  shipping_address: string;
  billing_address?: string;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

interface OrdersResponse {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface CreateOrderData {
  shipping_address: string;
  billing_address?: string;
  payment_method: string;
  notes?: string;
}

// ✅ Fetch user orders
export const useOrders = () => {
  return useQuery<OrdersResponse>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<OrdersResponse>('/orders');
      return data;
    },
  });
};

// ✅ Fetch single order
export const useOrder = (id: number) => {
  return useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// ✅ Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const { data } = await api.post('/orders', orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ✅ Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/orders/${id}/cancel`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
