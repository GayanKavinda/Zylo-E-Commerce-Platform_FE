# State Management Architecture

This project follows a **clear separation** between **Server State** and **Client/UI State**.

---

## 🔵 Server State (TanStack Query)

**Use for:** Data fetched from the Laravel backend (products, users, orders, etc.)

### Location: `lib/hooks/`

### Available Hooks:

#### **Authentication** (`lib/hooks/useAuth.ts`)
```typescript
import { useUser, useLogin, useRegister, useLogout } from '@/lib/hooks/useAuth';

// Fetch current user
const { data: user, isLoading, error } = useUser();

// Login mutation
const loginMutation = useLogin();
await loginMutation.mutateAsync({ email, password });

// Register mutation
const registerMutation = useRegister();
await registerMutation.mutateAsync({ name, email, password });

// Logout mutation
const logoutMutation = useLogout();
await logoutMutation.mutateAsync();
```

#### **Products** (`lib/hooks/useProducts.ts`)
```typescript
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '@/lib/hooks/useProducts';

// Fetch all products
const { data: products = [], isLoading, error } = useProducts();

// Create product
const createProduct = useCreateProduct();
await createProduct.mutateAsync({ name, price, stock, description });

// Update product
const updateProduct = useUpdateProduct();
await updateProduct.mutateAsync({ id, name, price });

// Delete product
const deleteProduct = useDeleteProduct();
await deleteProduct.mutateAsync(productId);
```

#### **Dashboard Stats** (`lib/hooks/useDashboard.ts`)
```typescript
import { useDashboardStats } from '@/lib/hooks/useDashboard';

const { data: stats, isLoading } = useDashboardStats();
// stats = { totalCustomers, totalProducts, totalOrders }
```

#### **Checkout** (`lib/hooks/useCheckout.ts`)
```typescript
import { useCreateCheckoutSession } from '@/lib/hooks/useCheckout';

const createSession = useCreateCheckoutSession();
const { id } = await createSession.mutateAsync({
  product_id: 1,
  quantity: 2,
  success_url: '/success',
  cancel_url: '/cancel',
});
```

---

## 🟢 Client/UI State (Zustand)

**Use for:** Local UI state (modals, theme, sidebar, filters, etc.)

### Location: `lib/authStore.ts` & `lib/uiStore.ts`

### **Auth Store** (`lib/authStore.ts`)
```typescript
import useAuthStore from '@/lib/authStore';

const token = useAuthStore((state) => state.token);
const user = useAuthStore((state) => state.user);
const setToken = useAuthStore((state) => state.setToken);
const setUser = useAuthStore((state) => state.setUser);
const logout = useAuthStore((state) => state.logout);

// Usage
setToken('your-token-here');
setUser({ id: 1, name: 'John', email: 'john@example.com', role: 'customer' });
logout();
```

### **UI Store** (`lib/uiStore.ts`)
```typescript
import useUIStore from '@/lib/uiStore';

// Theme
const theme = useUIStore((state) => state.theme);
const setTheme = useUIStore((state) => state.setTheme);
const toggleTheme = useUIStore((state) => state.toggleTheme);

// Modals
const isProductModalOpen = useUIStore((state) => state.isProductModalOpen);
const setProductModalOpen = useUIStore((state) => state.setProductModalOpen);
const isCartOpen = useUIStore((state) => state.isCartOpen);
const setCartOpen = useUIStore((state) => state.setCartOpen);

// Filters
const productFilter = useUIStore((state) => state.productFilter);
const setProductFilter = useUIStore((state) => state.setProductFilter);

// Sidebar
const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
const toggleSidebar = useUIStore((state) => state.toggleSidebar);
```

---

## 📋 When to Use Which?

| **Use Case** | **Use** | **Example** |
|-------------|---------|-------------|
| Fetching products from API | **TanStack Query** | `useProducts()` |
| Creating/updating/deleting data | **TanStack Query** | `useCreateProduct()` |
| User authentication data | **TanStack Query** | `useUser()` |
| Auth token (localStorage) | **Zustand** | `useAuthStore()` |
| Opening/closing modals | **Zustand** | `useUIStore()` |
| Theme toggle | **Zustand** | `useUIStore()` |
| Filter settings | **Zustand** | `useUIStore()` |
| Shopping cart items (local) | **Zustand** | (to be created) |

---

## ✅ Best Practices

### **TanStack Query (Server State)**
- ✅ **Automatic caching** - Data is cached and reused
- ✅ **Automatic refetching** - Stale data is refetched
- ✅ **Loading/error states** - Built-in `isLoading`, `error`
- ✅ **Optimistic updates** - Update UI before server responds
- ✅ **Request deduplication** - Multiple components can use same query

### **Zustand (Client State)**
- ✅ **Simple API** - Easy to read and write
- ✅ **Persistent storage** - Survives page refreshes
- ✅ **No boilerplate** - No actions, reducers, etc.
- ✅ **TypeScript support** - Full type safety
- ✅ **Dev tools** - Redux DevTools compatible

---

## 🚫 Anti-Patterns (DON'T DO THIS)

❌ **DON'T** use `useEffect` to fetch data:
```typescript
// ❌ BAD
useEffect(() => {
  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data.products);
  };
  fetchProducts();
}, []);
```

✅ **DO** use TanStack Query:
```typescript
// ✅ GOOD
const { data: products = [] } = useProducts();
```

---

❌ **DON'T** store server data in Zustand:
```typescript
// ❌ BAD
const products = useProductStore((state) => state.products);
```

✅ **DO** use TanStack Query for server data:
```typescript
// ✅ GOOD
const { data: products = [] } = useProducts();
```

---

❌ **DON'T** store UI state in TanStack Query:
```typescript
// ❌ BAD
const { data: isModalOpen } = useQuery(['modal'], () => true);
```

✅ **DO** use Zustand for UI state:
```typescript
// ✅ GOOD
const isModalOpen = useUIStore((state) => state.isProductModalOpen);
```

---

## 🔧 Configuration

### TanStack Query Config (`lib/queryClient.ts`)
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### React Query DevTools
Available in development at the bottom-right corner of the screen. Press the TanStack Query icon to inspect:
- Active queries
- Query cache
- Mutations
- Refetch behavior

---

## 📚 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [When to use which?](https://tkdodo.eu/blog/practical-react-query)
