//app/components/ProductCard.tsx

'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type ProductCardProps = {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onBuy?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onAddToWishlist,
  onBuy,
}: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-4">
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">${product.price}</p>
        <Badge className="mt-2">{product.stock > 0 ? 'In stock' : 'Out of stock'}</Badge>
      </div>

      <div className="flex items-center gap-2">
        {onAddToWishlist && (
          <Button size="sm" variant="outline" onClick={() => onAddToWishlist(product)}>
            Wishlist
          </Button>
        )}

        {onBuy && (
          <Button size="sm" onClick={() => onBuy(product)} disabled={product.stock === 0}>
            Buy
          </Button>
        )}

        {onEdit && <Button size="sm" variant="outline" onClick={() => onEdit(product)}>Edit</Button>}
        {onDelete && <Button size="sm" variant="destructive" onClick={() => onDelete(product)}>Delete</Button>}
      </div>
    </div>
  );
}
