// lib/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  owner_id?: number;
}

interface ProductsResponse {
  products: Product[];
}

interface CreateProductData {
  name: string;
  price: number;
  stock: number;
  description?: string;
}

interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}

// ✅ Fetch all products
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get<ProductsResponse>('/products');
      return data.products;
    },
  });
};

// ✅ Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: CreateProductData) => {
      const { data } = await api.post('/products', productData);
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
      const { data } = await api.put(`/products/${id}`, productData);
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
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};