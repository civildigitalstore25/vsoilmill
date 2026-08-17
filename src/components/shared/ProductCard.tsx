"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScaleOnHover } from "@/components/shared/motion";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { PRODUCT_COPY } from "@/constants/home";
import { ROUTES } from "@/constants/routes";
import { ASSETS } from "@/constants/assets";
import { LAYOUT } from "@/constants/layout";
import { useCartStore } from "@/hooks/useCartStore";
import { cn } from "@/lib/utils/cn";
import { formatInr } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/image";
import type { ProductCardProps } from "@/types/product";

export function ProductCard({ product }: ProductCardProps) {
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
          ((variant.originalPrice - variant.price) / variant.originalPrice) * 100,
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
    <ScaleOnHover className="h-full w-full">
      <article className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-2.5 shadow-sm">
        <Link
          href={ROUTES.PRODUCT(product.slug)}
          className="relative mb-2.5 aspect-square shrink-0 overflow-hidden rounded-lg bg-cream-dark"
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
            <Badge className="absolute left-2 top-2 bg-primary px-1.5 py-0 text-[10px] text-primary-foreground">
              -{discount}
              {PRODUCT_COPY.offSuffix}
            </Badge>
          ) : null}
          {product.isBestSeller ? (
            <Badge className="absolute right-2 top-2 px-1.5 py-0 text-[10px]">
              {PRODUCT_COPY.bestSeller}
            </Badge>
          ) : null}
        </Link>

        <Link href={ROUTES.PRODUCT(product.slug)}>
          <h3
            className={cn(
              LAYOUT.productTitle,
              "font-display text-sm text-dark sm:text-base",
            )}
          >
            {product.name}
          </h3>
        </Link>
        <p className={cn(LAYOUT.productDesc, "mt-0.5 text-xs text-muted")}>
          {product.shortDescription || "\u00a0"}
        </p>

        <div className={cn(LAYOUT.productVariants, "mt-2 flex flex-wrap gap-1.5")}>
          {product.variants.map((v, index) => (
            <button
              key={v.sku}
              type="button"
              onClick={() => setVariantIndex(index)}
              className={cn(
                "h-6 rounded-md border px-2 text-[10px] leading-none transition-colors",
                index === variantIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-dark hover:border-primary/50",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className={cn(LAYOUT.productPrice, "mt-2 flex items-baseline gap-1.5")}>
          {variant ? (
            <>
              <span className="text-sm font-semibold text-dark sm:text-base">
                {formatInr(variant.price)}
              </span>
              {variant.originalPrice > variant.price ? (
                <span className="text-xs text-muted line-through">
                  {formatInr(variant.originalPrice)}
                </span>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="mt-auto pt-3">
          <Button
            size="sm"
            className="w-full"
            onClick={handleAdd}
            disabled={!variant}
          >
            {CHECKOUT_COPY.ADD_TO_CART}
          </Button>
        </div>
      </article>
    </ScaleOnHover>
  );
}
