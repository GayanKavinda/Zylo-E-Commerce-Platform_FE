// lib/hooks/useCheckout.ts
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface CheckoutSessionData {
  product_id: number;
  quantity: number;
  success_url?: string;
  cancel_url?: string;
}

interface CheckoutSessionResponse {
  id: string;
}

// ✅ Create checkout session
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async (sessionData: CheckoutSessionData) => {
      const { data } = await api.post<CheckoutSessionResponse>('/create-checkout-session', sessionData);
      return data;
    },
  });
};
