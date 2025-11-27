# Migration Guide: useEffect → TanStack Query

## Quick Reference

### ❌ Old Pattern (Before)
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get('/endpoint');
      setData(res.data);
    } catch (err) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### ✅ New Pattern (After)
```typescript
import { useQuery } from '@tanstack/react-query';

const { data = [], isLoading, error } = useQuery({
  queryKey: ['endpoint'],
  queryFn: async () => {
    const { data } = await api.get('/endpoint');
    return data;
  },
});
```

---

## Step-by-Step Migration

### 1. **Identify Server State**
Look for `useEffect` hooks that fetch data from APIs.

### 2. **Create a Custom Hook**
Move the API call to `lib/hooks/`:

```typescript
// lib/hooks/useMyData.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      const { data } = await api.get('/my-endpoint');
      return data;
    },
  });
};
```

### 3. **Replace in Component**
```typescript
// Before
const [myData, setMyData] = useState([]);
useEffect(() => { /* ... */ }, []);

// After
import { useMyData } from '@/lib/hooks/useMyData';
const { data: myData = [] } = useMyData();
```

---

## Common Patterns

### **Fetch on Mount**
```typescript
// ❌ Before
useEffect(() => {
  fetchData();
}, []);

// ✅ After
const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });
```

### **Create/Update/Delete**
```typescript
// ❌ Before
const handleCreate = async () => {
  await api.post('/items', newItem);
  fetchItems(); // Manually refetch
};

// ✅ After
const createItem = useMutation({
  mutationFn: (newItem) => api.post('/items', newItem),
  onSuccess: () => {
    queryClient.invalidateQueries(['items']); // Auto refetch
  },
});
await createItem.mutateAsync(newItem);
```

### **Conditional Fetching**
```typescript
// ❌ Before
useEffect(() => {
  if (id) fetchData(id);
}, [id]);

// ✅ After
const { data } = useQuery({
  queryKey: ['data', id],
  queryFn: () => fetchData(id),
  enabled: !!id, // Only fetch if id exists
});
```

---

## Migration Checklist

For each component:

- [ ] Find all `useEffect` hooks that call APIs
- [ ] Create corresponding React Query hooks
- [ ] Remove `useState` for loading/error/data
- [ ] Replace `useEffect` with `useQuery` or `useMutation`
- [ ] Update loading/error checks
- [ ] Test the component

---

## Benefits After Migration

✅ **Automatic Caching** - Same data requests reuse cache  
✅ **Background Updates** - Stale data refetches automatically  
✅ **Request Deduplication** - Multiple calls → single request  
✅ **Built-in States** - `isLoading`, `error`, `isFetching`  
✅ **DevTools** - Visual debugging of all queries  
✅ **Less Code** - No manual state management  

---

## Troubleshooting

### Issue: "Module not found: Can't resolve '@/lib/hooks/...'"
**Solution:** Make sure you created the hook file in `frontend/lib/hooks/`

### Issue: "queryClient is not defined"
**Solution:** Import from the hook, not directly

### Issue: "Data is undefined"
**Solution:** Use default values: `const { data = [] } = useQuery(...)`

### Issue: "Query doesn't refetch after mutation"
**Solution:** Add `queryClient.invalidateQueries(['key'])` in `onSuccess`

---

## Need Help?

See `STATE_MANAGEMENT.md` for full documentation.
