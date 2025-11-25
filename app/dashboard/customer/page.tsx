// app/dashboard/customer/page.tsx
'use client';

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const CustomerProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products || []);
        console.log("[CustomerProducts] Loaded:", res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <Card key={p.id} className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{p.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-xl font-semibold">${p.price}</p>

            <Badge variant={p.stock > 0 ? "secondary" : "destructive"}>
              {p.stock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={p.stock === 0}
                onClick={() => alert(`Added ${p.name} to wishlist`)}
              >
                Wishlist
              </Button>

              <Button
                size="sm"
                disabled={p.stock === 0}
                onClick={() => alert(`Proceed to payment for ${p.name}`)}
              >
                Buy Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function ProtectedCustomer() {
  return (
    <ProtectedRoute roles={["customer"]}>
      <CustomerProductsPage />
    </ProtectedRoute>
  );
}
