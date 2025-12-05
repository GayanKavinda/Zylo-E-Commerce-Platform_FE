// app/dashboard/customer/page.tsx
'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCreateCheckoutSession } from "@/lib/hooks/useCheckout";

const CustomerProductsPage = () => {
  // ✅ Using TanStack Query for server state
  const { data: productsData, isLoading, error } = useProducts();
  const createCheckoutSession = useCreateCheckoutSession();

  const products = productsData?.data || [];

  const handleBuyNow = async (productId: number, productName: string) => {
    try {
      const { id } = await createCheckoutSession.mutateAsync({
        product_id: productId,
        quantity: 1,
      });
      alert(`Checkout session created for ${productName}. Session ID: ${id}`);
      // TODO: Redirect to Stripe checkout
    } catch (err) {
      alert('Failed to create checkout session');
      console.error(err);
    }
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

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
                disabled={p.stock === 0 || createCheckoutSession.isPending}
                onClick={() => handleBuyNow(p.id, p.name)}
              >
                {createCheckoutSession.isPending ? 'Processing...' : 'Buy Now'}
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
