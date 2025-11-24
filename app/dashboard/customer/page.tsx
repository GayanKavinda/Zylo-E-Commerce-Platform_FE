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
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products);
        console.log("[CustomerProducts] Products:", res.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {products.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle>{p.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-lg font-medium">${p.price}</p>
              <Badge variant={p.stock > 0 ? "secondary" : "destructive"}>
                {p.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={p.stock === 0}
                onClick={() => alert(`Added ${p.name} to wishlist`)}
              >
                Add to Wishlist
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

export default function ProtectedCustomerProducts() {
  return (
    <ProtectedRoute roles={["customer"]}>
      <CustomerProductsPage />
    </ProtectedRoute>
  );
}
