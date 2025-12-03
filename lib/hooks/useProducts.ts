// lib/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  stock: number;
  description?: string;
  category?: string;
  images?: string[];
  sku?: string;
  is_active?: boolean;
  views?: number;
  owner_id?: number;
  owner?: {
    id: number;
    name: string;
  };
  average_rating?: number;
  reviews_count?: number;
}

interface PaginatedProductsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface CreateProductData {
  name: string;
  price: number;
  discount_price?: number;
  stock: number;
  description?: string;
  category?: string;
  images?: string[];
  sku?: string;
  is_active?: boolean;
}

interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}

interface ProductFilters {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  in_stock_only?: boolean;
  sort_by?: 'price' | 'name' | 'popularity' | 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// ✅ Fetch all products with filters
export const useProducts = (filters?: ProductFilters) => {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      
      const { data } = await api.get<PaginatedProductsResponse>(`/products?${params.toString()}`);
      return data.data || [];
    },
  });
};

// ✅ Fetch paginated products
export const useProductsPaginated = (filters?: ProductFilters) => {
  return useQuery<PaginatedProductsResponse>({
    queryKey: ['products', 'paginated', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      
      const { data } = await api.get<PaginatedProductsResponse>(`/products?${params.toString()}`);
      return data;
    },
  });
};

// ✅ Fetch single product
export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    },
    enabled: !!id,
  });
};

// ✅ Fetch featured products
export const useFeaturedProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured');
      return data.products || [];
    },
  });
};

// ✅ Fetch product categories
export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/products/categories');
      return data.categories || [];
    },
  });
};

// ✅ Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: CreateProductData) => {
      const { data } = await api.post('/admin/products', productData);
      return data.product;
    },
    onSuccess: () => {
      // Invalidate and refetch products after creation
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// ✅ Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...productData }: UpdateProductData) => {
      const { data } = await api.put(`/admin/products/${id}`, productData);
      return data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// ✅ Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/products/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};