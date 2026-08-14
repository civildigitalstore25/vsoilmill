"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckoutButton } from "@/components/features/cart/CheckoutButton";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { useCartStore } from "@/hooks/useCartStore";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { formatInr } from "@/lib/utils/format";
import {
  buildCartWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const { requireLogin } = useRequireLogin();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-muted">{CHECKOUT_COPY.EMPTY_CART}</p>
            <p className="text-sm text-muted">
              Add pure oils & ghee to get started
            </p>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href={ROUTES.SHOP}>Shop Now</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3 border-b border-border pb-4"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-cream-dark">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">{item.name}</p>
                    <p className="text-xs text-muted">{item.variantLabel}</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatInr(item.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1,
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1,
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-destructive"
                        aria-label="Remove item"
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm font-semibold">
                <span>Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <CheckoutButton
                className="w-full"
                onBeforeNavigate={() => onOpenChange(false)}
              >
                {CHECKOUT_COPY.CHECKOUT}
              </CheckoutButton>
              <Button
                variant="whatsapp"
                className="w-full"
                onClick={() => {
                  if (!requireLogin()) return;
                  window.open(
                    buildWhatsAppUrl(buildCartWhatsAppMessage(items, subtotal)),
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                {CHECKOUT_COPY.WHATSAPP_CTA}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
