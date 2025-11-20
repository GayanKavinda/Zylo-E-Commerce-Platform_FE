//app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Product {
  id: number;
  name: string;
  price: number;
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Products</h1>

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-2 rounded">
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function ProtectedAdmin() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminPage />
    </ProtectedRoute>
  );
}
