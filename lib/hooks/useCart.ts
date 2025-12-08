// lib/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import useAuthStore from '@/lib/authStore';
import { Product } from './useProducts';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

interface CartResponse {
  cart_items: CartItem[];
  total: number;
  items_count: number;
}

interface AddToCartData {
  product_id: number;
  quantity: number;
}

interface UpdateCartData {
  quantity: number;
}

// ✅ Fetch cart
export const useCart = () => {
  const token = useAuthStore((state) => state.token);
  
  return useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get<CartResponse>('/cart');
      return data;
    },
    enabled: typeof window !== 'undefined' && !!token,
    retry: false,
  });
};

// ✅ Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartData: AddToCartData) => {
      const { data } = await api.post('/cart', cartData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ✅ Update cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const { data } = await api.put(`/cart/${id}`, { quantity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ✅ Remove from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cart/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ✅ Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete('/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
