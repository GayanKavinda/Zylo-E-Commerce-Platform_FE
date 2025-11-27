# 🏗️ State Management Architecture Diagram

## 📐 Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Components                         │ │
│  │  (Pages, UI Components, Forms, etc.)                       │ │
│  └───────────┬────────────────────────────────┬───────────────┘ │
│              │                                │                  │
│              ▼                                ▼                  │
│  ┌───────────────────────┐      ┌───────────────────────────┐  │
│  │   🔵 SERVER STATE     │      │   🟢 CLIENT STATE        │  │
│  │   (TanStack Query)    │      │   (Zustand)              │  │
│  ├───────────────────────┤      ├───────────────────────────┤  │
│  │ - Products            │      │ - Auth Token             │  │
│  │ - User Data           │      │ - Theme                  │  │
│  │ - Dashboard Stats     │      │ - Modals Open/Close      │  │
│  │ - Orders              │      │ - Sidebar State          │  │
│  │ - Checkout            │      │ - Search Filters         │  │
│  │                       │      │ - Shopping Cart (local)  │  │
│  └───────────┬───────────┘      └───────────────────────────┘  │
│              │                                                   │
│              ▼                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      Axios API Client                      │ │
│  │              (lib/api.ts with auth interceptor)            │ │
│  └───────────────────────────┬───────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────┘
                               │
                               ▼ HTTP Requests
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Laravel 11)                        │
├─────────────────────────────────────────────────────────────────┤
│  API Routes (routes/api.php)                                    │
│  Controllers (app/Http/Controllers/)                            │
│  Models (app/Models/)                                           │
│  Database (MySQL/PostgreSQL)                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔵 TanStack Query Flow

```
┌──────────────┐
│  Component   │
│  renders     │
└──────┬───────┘
       │
       │ calls useProducts()
       ▼
┌──────────────────────┐
│  TanStack Query      │
│  Check Cache         │
└──────┬───────────────┘
       │
       ├─── Cache Hit? ──────────────┐
       │                             │
       ▼ NO                          ▼ YES
┌──────────────────────┐    ┌────────────────┐
│  Fetch from API      │    │  Return Cached │
│  api.get('/products')│    │  Data          │
└──────┬───────────────┘    └────────┬───────┘
       │                             │
       ▼                             │
┌──────────────────────┐             │
│  Cache Response      │             │
└──────┬───────────────┘             │
       │                             │
       └──────────┬──────────────────┘
                  │
                  ▼
        ┌─────────────────┐
        │  Component      │
        │  Re-renders     │
        │  with data      │
        └─────────────────┘
```

---

## 🟢 Zustand Flow

```
┌──────────────┐
│  Component   │
│  renders     │
└──────┬───────┘
       │
       │ reads useAuthStore()
       ▼
┌──────────────────────┐
│  Zustand Store       │
│  (in memory +        │
│   localStorage)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Return State        │
│  - token             │
│  - user              │
│  - theme             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Component           │
│  renders with state  │
└──────────────────────┘

User Action (e.g., toggleTheme())
       │
       ▼
┌──────────────────────┐
│  Zustand Action      │
│  Updates State       │
└──────┬───────────────┘
       │
       ├─── Persist to localStorage
       │
       ▼
┌──────────────────────┐
│  All subscribers     │
│  re-render           │
└──────────────────────┘
```

---

## 🔄 Mutation Flow (Create/Update/Delete)

```
User clicks "Delete Product"
       │
       ▼
┌──────────────────────────┐
│  Component calls         │
│  deleteProduct.mutate()  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  TanStack Query          │
│  - Set isPending = true  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  API Request             │
│  api.delete('/products/1')│
└──────┬───────────────────┘
       │
       ▼ Success
┌──────────────────────────┐
│  onSuccess callback      │
│  - Invalidate cache      │
│  - Refetch products      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Component re-renders    │
│  with fresh data         │
│  - isPending = false     │
└──────────────────────────┘
```

---

## 📂 File Structure Map

```
frontend/
├── app/
│   ├── layout.tsx                    → QueryClientProvider wrapper
│   ├── page.tsx                      → useUser()
│   ├── login/page.tsx                → useLogin()
│   ├── register/page.tsx             → useRegister()
│   ├── dashboard/
│   │   ├── page.tsx                  → useUser() + useDashboardStats()
│   │   └── customer/page.tsx         → useProducts() + useCheckout()
│   └── admin/page.tsx                → useProducts() + useDeleteProduct()
│
├── components/
│   ├── ProtectedRoute.tsx            → useUser()
│   ├── Navbar.tsx                    → useAuthStore() + useLogout()
│   └── ProductCard.tsx               → useDeleteProduct()
│
├── lib/
│   ├── queryClient.ts                → TanStack Query config
│   ├── api.ts                        → Axios instance
│   ├── authStore.ts                  → 🟢 Zustand: token, user cache
│   ├── uiStore.ts                    → 🟢 Zustand: theme, modals
│   └── hooks/
│       ├── index.ts                  → Central exports
│       ├── useAuth.ts                → 🔵 Login, register, user
│       ├── useProducts.ts            → 🔵 CRUD products
│       ├── useDashboard.ts           → 🔵 Stats
│       └── useCheckout.ts            → 🔵 Stripe session
│
└── Documentation/
    ├── STATE_MANAGEMENT.md           → Complete guide
    ├── MIGRATION_GUIDE.md            → How to migrate
    ├── IMPLEMENTATION_SUMMARY.md     → What changed
    ├── IMPLEMENTATION_COMPLETE.md    → Success summary
    ├── README_STATE_MANAGEMENT.md    → Quick reference
    └── ARCHITECTURE_DIAGRAM.md       → This file
```

---

## 🔑 Key Concepts Visualized

### **Before: Mixed State**
```
┌─────────────────────┐
│    Component        │
│                     │
│  ┌───────────────┐  │
│  │ useState      │  │  ❌ Manual management
│  │ useEffect     │  │  ❌ Boilerplate
│  │ api.get()     │  │  ❌ No caching
│  │ loading state │  │  ❌ Duplicate requests
│  │ error state   │  │  ❌ Complex logic
│  └───────────────┘  │
└─────────────────────┘
```

### **After: Separated State**
```
┌─────────────────────────────────────┐
│           Component                 │
│                                     │
│  ┌────────────────────────────────┐│
│  │ 🔵 Server State (TanStack)    ││  ✅ Automatic caching
│  │ const { data } = useProducts() ││  ✅ Auto refetch
│  └────────────────────────────────┘│  ✅ Loading states
│                                     │  ✅ No boilerplate
│  ┌────────────────────────────────┐│
│  │ 🟢 Client State (Zustand)     ││  ✅ Simple API
│  │ const theme = useUIStore()     ││  ✅ Persistent
│  └────────────────────────────────┘│  ✅ Type-safe
└─────────────────────────────────────┘
```

---

## 🎯 When to Use What?

```
┌──────────────────────────────────────┐
│ Question: Where does this data       │
│           come from?                 │
└──────────┬───────────────────────────┘
           │
           ├─── From API? ────────────────► 🔵 TanStack Query
           │                                  (useProducts, useUser, etc.)
           │
           └─── Local UI state? ─────────► 🟢 Zustand
                                             (theme, modals, sidebar, etc.)

┌──────────────────────────────────────┐
│ Question: Does this need to persist  │
│           across page refreshes?     │
└──────────┬───────────────────────────┘
           │
           ├─── Yes (token, theme) ───► 🟢 Zustand with persist()
           │
           └─── No (modal open) ──────► 🟢 Zustand without persist()
```

---

## 🚀 Request Flow Example

### **Scenario: User logs in and views products**

```
1. User enters credentials
   │
   ▼
2. Component calls useLogin().mutateAsync()
   │
   ▼
3. TanStack Query sends POST /login
   │
   ▼
4. Laravel returns { user, token }
   │
   ▼
5. TanStack Query onSuccess callback
   │
   ├─► setToken(token)        → Zustand authStore
   ├─► setUser(user)          → Zustand authStore
   └─► Cache user data        → TanStack Query
   │
   ▼
6. Redirect to /dashboard
   │
   ▼
7. Dashboard calls useProducts()
   │
   ▼
8. TanStack Query checks cache
   │
   ├─── Not cached? ──► Fetch from API
   │                    │
   │                    ▼
   │                    Cache response
   │                    │
   └────────────────────┘
   │
   ▼
9. Render products list
   │
   ▼
10. User clicks "Delete" on product
    │
    ▼
11. Component calls deleteProduct.mutateAsync(id)
    │
    ▼
12. TanStack Query sends DELETE /products/:id
    │
    ▼
13. onSuccess → invalidateQueries(['products'])
    │
    ▼
14. TanStack Query refetches products
    │
    ▼
15. Component re-renders with updated list
```

---

## 📊 Performance Benefits

### **Without TanStack Query**
```
Component A renders → API Call #1
Component B renders → API Call #2  (same endpoint!)
Component C renders → API Call #3  (same endpoint!)

❌ 3 requests for the same data
❌ Users see loading states 3 times
❌ Increased server load
```

### **With TanStack Query**
```
Component A renders → API Call #1 → Cache
Component B renders → Read from cache (instant!)
Component C renders → Read from cache (instant!)

✅ 1 request, shared across all components
✅ Instant responses for B and C
✅ Reduced server load
```

---

## 🎓 Summary

### **TanStack Query (Server State)**
- ✅ Manages data from your Laravel API
- ✅ Automatic caching and refetching
- ✅ Loading/error states built-in
- ✅ Request deduplication
- ✅ Background updates

### **Zustand (Client State)**
- ✅ Manages local UI state
- ✅ Simple API (no boilerplate)
- ✅ Persistent storage (localStorage)
- ✅ Type-safe with TypeScript
- ✅ Perfect for theme, modals, filters

### **Together They Provide**
- ✅ Clean separation of concerns
- ✅ Professional architecture
- ✅ Scalable and maintainable
- ✅ Great developer experience
- ✅ Excellent user experience

---

**🎉 Your e-commerce platform is now production-ready!**
