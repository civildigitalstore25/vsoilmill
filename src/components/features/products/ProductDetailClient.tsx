"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/constants/assets";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/useCartStore";
import { cn } from "@/lib/utils/cn";
import { formatInr } from "@/lib/utils/format";
import {
  buildProductWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";
import type { Product } from "@/types/product";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const variant = product.variants[variantIndex];
  const image = product.images[0] ?? ASSETS.PLACEHOLDER_PRODUCT;

  const discount = useMemo(() => {
    if (!variant || variant.originalPrice <= variant.price) return 0;
    return Math.round(
      ((variant.originalPrice - variant.price) / variant.originalPrice) * 100,
    );
  }, [variant]);

  function addToCart() {
    if (!variant) return;
    addItem({
      productId: product._id,
      variantId: String(variant._id),
      slug: product.slug,
      name: product.name,
      variantLabel: variant.label,
      image,
      price: variant.price,
      originalPrice: variant.originalPrice,
      stock: variant.stock,
      quantity,
    });
    toast.success("Added to cart");
  }

  function buyNow() {
    addToCart();
    router.push(ROUTES.CHECKOUT);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-cream-dark">
        <Image src={image} alt={product.name} fill className="object-cover" priority />
      </div>

      <div>
        {discount > 0 ? (
          <Badge className="mb-3 bg-primary text-primary-foreground">
            -{discount}% OFF
          </Badge>
        ) : null}
        <h1 className="font-display text-3xl text-dark md:text-4xl">
          {product.name}
        </h1>
        {product.shortDescription ? (
          <p className="mt-2 text-muted">{product.shortDescription}</p>
        ) : null}

        {variant ? (
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-dark">
              {formatInr(variant.price)}
            </span>
            {variant.originalPrice > variant.price ? (
              <span className="text-lg text-muted line-through">
                {formatInr(variant.originalPrice)}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-dark">Select size</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v, index) => (
              <button
                key={v.sku}
                type="button"
                onClick={() => {
                  setVariantIndex(index);
                  setQuantity(1);
                }}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  index === variantIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <p className="text-sm font-medium">Quantity</p>
          <div className="flex items-center rounded-md border border-border">
            <button
              type="button"
              className="px-3 py-2"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              type="button"
              className="px-3 py-2"
              onClick={() =>
                setQuantity((q) =>
                  Math.min(variant?.stock ?? 1, q + 1),
                )
              }
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="flex-1" onClick={addToCart}>
            Add to Cart
          </Button>
          <Button size="lg" variant="accent" className="flex-1" onClick={buyNow}>
            Buy Now
          </Button>
        </div>

        {variant ? (
          <Button size="lg" variant="whatsapp" className="mt-3 w-full" asChild>
            <a
              href={buildWhatsAppUrl(
                buildProductWhatsAppMessage(
                  product.name,
                  variant.label,
                  variant.price,
                  quantity,
                ),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CHECKOUT_COPY.WHATSAPP_CTA}
            </a>
          </Button>
        ) : null}

        <div
          className="prose prose-sm mt-10 max-w-none text-dark/80"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
