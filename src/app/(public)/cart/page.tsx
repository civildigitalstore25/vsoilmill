"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.SHOP}>Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">Cart</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-md bg-cream-dark">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted">{item.variantLabel}</p>
              <p className="mt-1 font-semibold">{formatInr(item.price)}</p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  className="h-9 w-16 rounded-md border border-border px-2"
                  onChange={(e) =>
                    updateQuantity(
                      item.productId,
                      item.variantId,
                      Number(e.target.value),
                    )
                  }
                />
                <button
                  type="button"
                  className="text-sm text-destructive"
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <p className="text-lg font-semibold">Subtotal: {formatInr(subtotal)}</p>
        <Button asChild>
          <Link href={ROUTES.CHECKOUT}>Proceed to checkout</Link>
        </Button>
      </div>
    </div>
  );
}
