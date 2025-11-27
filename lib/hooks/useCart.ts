// lib/hooks/useCart.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface CreateOrderData {
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  total: number;
  shipping_address: {
    address: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const { data } = await api.post('/orders', orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
