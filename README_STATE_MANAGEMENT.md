# 🎯 State Management Implementation

## Overview

This project now uses a **best-practice state management architecture** that separates:

- **🔵 Server State** (data from Laravel API) → **TanStack Query**
- **🟢 Client State** (UI state, local data) → **Zustand**

---

## 📁 Project Structure

```
frontend/
├── lib/
│   ├── queryClient.ts          # TanStack Query configuration
│   ├── authStore.ts            # Zustand: Auth token & user cache
│   ├── uiStore.ts              # Zustand: UI state (theme, modals, etc.)
│   ├── api.ts                  # Axios instance with auth interceptor
│   └── hooks/
│       ├── index.ts            # Central export for all hooks
│       ├── useAuth.ts          # Auth queries & mutations
│       ├── useProducts.ts      # Product queries & mutations
│       ├── useDashboard.ts     # Dashboard stats query
│       └── useCheckout.ts      # Checkout mutation
├── app/
│   ├── layout.tsx              # QueryClientProvider wrapper
│   ├── login/page.tsx          # ✅ Uses useLogin()
│   ├── register/page.tsx       # ✅ Uses useRegister()
│   ├── dashboard/page.tsx      # ✅ Uses useUser() + useDashboardStats()
│   ├── admin/page.tsx          # ✅ Uses useProducts() + useDeleteProduct()
│   └── dashboard/customer/page.tsx  # ✅ Uses useProducts() + useCheckout()
└── STATE_MANAGEMENT.md         # Full documentation
```

---

## 🚀 Quick Start

### **1. Fetch Data (Query)**
```typescript
import { useProducts } from '@/lib/hooks/useProducts';

const { data: products = [], isLoading, error } = useProducts();

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>;
```

### **2. Mutate Data (Create/Update/Delete)**
```typescript
import { useCreateProduct, useDeleteProduct } from '@/lib/hooks/useProducts';

const createProduct = useCreateProduct();
const deleteProduct = useDeleteProduct();

// Create
await createProduct.mutateAsync({
  name: 'New Product',
  price: 99.99,
  stock: 10,
});

// Delete
await deleteProduct.mutateAsync(productId);
```

### **3. Authentication**
```typescript
import { useLogin, useUser, useLogout } from '@/lib/hooks/useAuth';

// Login
const loginMutation = useLogin();
await loginMutation.mutateAsync({ email, password });

// Get current user
const { data: user } = useUser();

// Logout
const logoutMutation = useLogout();
await logoutMutation.mutateAsync();
```

### **4. UI State (Client-only)**
```typescript
import useUIStore from '@/lib/uiStore';

// Theme
const theme = useUIStore((state) => state.theme);
const toggleTheme = useUIStore((state) => state.toggleTheme);

// Modals
const isCartOpen = useUIStore((state) => state.isCartOpen);
const setCartOpen = useUIStore((state) => state.setCartOpen);

setCartOpen(true); // Open cart
toggleTheme(); // Switch dark/light
```

---

## ✅ What's Implemented

### **TanStack Query Hooks**
- ✅ `useUser()` - Fetch current user
- ✅ `useLogin()` - Login mutation
- ✅ `useRegister()` - Register mutation
- ✅ `useLogout()` - Logout mutation
- ✅ `useProducts()` - Fetch all products
- ✅ `useCreateProduct()` - Create product
- ✅ `useUpdateProduct()` - Update product
- ✅ `useDeleteProduct()` - Delete product
- ✅ `useDashboardStats()` - Fetch dashboard stats
- ✅ `useCreateCheckoutSession()` - Create Stripe session

### **Zustand Stores**
- ✅ `useAuthStore` - Token & user cache
- ✅ `useUIStore` - Theme, modals, filters, sidebar

### **Pages Updated**
- ✅ `app/login/page.tsx`
- ✅ `app/register/page.tsx`
- ✅ `app/page.tsx`
- ✅ `app/dashboard/page.tsx`
- ✅ `app/admin/page.tsx`
- ✅ `app/dashboard/customer/page.tsx`

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `STATE_MANAGEMENT.md` | Complete guide: when to use Query vs Zustand |
| `IMPLEMENTATION_SUMMARY.md` | What was changed and why |
| `MIGRATION_GUIDE.md` | How to migrate useEffect → TanStack Query |
| `README_STATE_MANAGEMENT.md` | This file (quick reference) |

---

## 🎓 Key Concepts

### **Server State vs Client State**

| Server State | Client State |
|--------------|--------------|
| Products from API | Theme (dark/light) |
| User data from API | Modal open/close |
| Orders from API | Sidebar collapsed |
| Dashboard stats | Search filters |
| **Use TanStack Query** | **Use Zustand** |

### **Why This Matters**

**Before:**
```typescript
// ❌ Mixed concerns, manual state management
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (err) {
      setError('Failed');
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);
```

**After:**
```typescript
// ✅ Clean, automatic caching, no boilerplate
const { data: products = [], isLoading, error } = useProducts();
```

---

## 🔍 Debugging

### **React Query DevTools**
1. Run the app: `npm run dev`
2. Look for the **TanStack Query** icon in the bottom-right
3. Click to see:
   - All active queries
   - Cached data
   - Query states (loading, error, success)
   - Refetch triggers

### **Check Network Tab**
- Open DevTools → Network
- Navigate around the app
- Notice: Same requests are **cached**, not refetched unnecessarily

---

## 🎯 Best Practices

### ✅ DO
- Use TanStack Query for **all API calls**
- Use Zustand for **UI state only**
- Provide **default values**: `const { data = [] } = useQuery(...)`
- Handle **loading and error states**
- Invalidate queries after mutations

### ❌ DON'T
- Don't use `useEffect` to fetch data
- Don't store server data in Zustand
- Don't store UI state in TanStack Query
- Don't forget to handle loading states
- Don't make raw `api.get/post` calls in components

---

## 🚀 Next Steps

### **Recommended Enhancements**

1. **Add Shopping Cart Store**
```typescript
// lib/cartStore.ts
export const useCartStore = create((set) => ({
  items: [],
  addItem: (product) => set((state) => ({ items: [...state.items, product] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
}));
```

2. **Add Optimistic Updates**
```typescript
const deleteProduct = useMutation({
  mutationFn: (id) => api.delete(`/products/${id}`),
  onMutate: async (id) => {
    await queryClient.cancelQueries(['products']);
    const previous = queryClient.getQueryData(['products']);
    queryClient.setQueryData(['products'], (old) => old.filter(p => p.id !== id));
    return { previous };
  },
  onError: (err, id, context) => {
    queryClient.setQueryData(['products'], context.previous);
  },
});
```

3. **Add Pagination**
```typescript
export const useProducts = (page = 1) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const { data } = await api.get(`/products?page=${page}`);
      return data;
    },
  });
};
```

4. **Add Prefetching**
```typescript
const queryClient = useQueryClient();
queryClient.prefetchQuery(['products'], fetchProducts);
```

---

## 📞 Support

- **Full Documentation:** See `STATE_MANAGEMENT.md`
- **Migration Help:** See `MIGRATION_GUIDE.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`

---

## 🎉 Summary

**You now have:**
- ✅ Professional state management architecture
- ✅ Automatic caching and background updates
- ✅ Clean separation of concerns
- ✅ Type-safe hooks with TypeScript
- ✅ DevTools for debugging
- ✅ Less boilerplate code
- ✅ Better performance
- ✅ Better developer experience

**No more:**
- ❌ `useEffect` for data fetching
- ❌ Manual loading/error state management
- ❌ Duplicate API requests
- ❌ Stale data issues
- ❌ Complex state synchronization

---

**Happy coding! 🚀**
