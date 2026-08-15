"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScaleOnHover } from "@/components/shared/motion";
import { ROUTES } from "@/constants/routes";
import { ASSETS } from "@/constants/assets";
import { useCartStore } from "@/hooks/useCartStore";
import { cn } from "@/lib/utils/cn";
import { formatInr } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/image";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex] ?? product.variants[0];
  const initialImage = getProductImageUrl(product);
  const [imgSrc, setImgSrc] = useState(initialImage);

  useEffect(() => {
    setImgSrc(getProductImageUrl(product));
  }, [product]);

  const discount =
    variant && variant.originalPrice > variant.price
      ? Math.round(
          ((variant.originalPrice - variant.price) / variant.originalPrice) *
            100,
        )
      : 0;

  function handleAdd() {
    if (!variant) return;
    addItem({
      productId: product._id,
      variantId: String(variant._id),
      slug: product.slug,
      name: product.name,
      variantLabel: variant.label,
      image: imgSrc,
      price: variant.price,
      originalPrice: variant.originalPrice,
      stock: variant.stock,
    });
    toast.success("Added to cart");
  }

  return (
    <ScaleOnHover>
      <article className="group flex flex-col">
        <Link
          href={ROUTES.PRODUCT(product.slug)}
          className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-cream-dark"
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            unoptimized
            onError={() => setImgSrc(ASSETS.PLACEHOLDER_PRODUCT)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {discount > 0 ? (
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
              -{discount}% OFF
            </Badge>
          ) : null}
          {product.isBestSeller ? (
            <Badge className="absolute right-3 top-3">Best Seller</Badge>
          ) : null}
        </Link>

        <Link href={ROUTES.PRODUCT(product.slug)}>
          <h3 className="font-display text-lg text-dark">{product.name}</h3>
        </Link>
        {product.shortDescription ? (
          <p className="mt-1 text-sm text-muted">{product.shortDescription}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((v, index) => (
            <button
              key={v.sku}
              type="button"
              onClick={() => setVariantIndex(index)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition-colors",
                index === variantIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-dark hover:border-primary/50",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        {variant ? (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-dark">
              {formatInr(variant.price)}
            </span>
            {variant.originalPrice > variant.price ? (
              <span className="text-sm text-muted line-through">
                {formatInr(variant.originalPrice)}
              </span>
            ) : null}
          </div>
        ) : null}

        <Button className="mt-4 w-full" onClick={handleAdd} disabled={!variant}>
          Add to Cart
        </Button>
      </article>
    </ScaleOnHover>
  );
}
