// lib/hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Review {
  id: number;
  user: {
    id: number;
    name: string;
  };
  product_id: number;
  rating: number;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ReviewsResponse {
  data: Review[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface CreateReviewData {
  product_id: number;
  rating: number;
  comment?: string;
}

interface UpdateReviewData {
  rating: number;
  comment?: string;
}

// ✅ Fetch product reviews
export const useProductReviews = (productId: number) => {
  return useQuery<ReviewsResponse>({
    queryKey: ['reviews', 'product', productId],
    queryFn: async () => {
      const { data } = await api.get<ReviewsResponse>(`/products/${productId}/reviews`);
      return data;
    },
    enabled: !!productId,
  });
};

// ✅ Fetch user's reviews
export const useMyReviews = () => {
  return useQuery<ReviewsResponse>({
    queryKey: ['reviews', 'my'],
    queryFn: async () => {
      const { data } = await api.get<ReviewsResponse>('/my-reviews');
      return data;
    },
  });
};

// ✅ Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      const { data } = await api.post('/reviews', reviewData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.product_id] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.product_id] });
    },
  });
};

// ✅ Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...reviewData }: { id: number } & UpdateReviewData) => {
      const { data } = await api.put(`/reviews/${id}`, reviewData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// ✅ Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/reviews/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
