"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfferCountdown } from "@/components/features/catalog/OfferCountdown";
import { ScaleOnHover } from "@/components/shared/motion";
import { CATALOG_COPY } from "@/constants/catalog";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { PRODUCT_COPY } from "@/constants/home";
import { ROUTES } from "@/constants/routes";
import { ASSETS } from "@/constants/assets";
import { LAYOUT } from "@/constants/layout";
import { useCartStore } from "@/hooks/useCartStore";
import { cn } from "@/lib/utils/cn";
import { formatInr } from "@/lib/utils/format";
import {
  compareAtPrice,
  sellingPrice,
  variantDisplayImage,
  offerIsLive,
  variantIsAvailable,
} from "@/lib/products/commerce";
import { getProductImageUrl } from "@/lib/utils/image";
import type { ProductCardProps } from "@/types/product";

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex] ?? product.variants[0];
  const unitPrice = variant ? sellingPrice(product, variant) : 0;
  const strikePrice = variant ? compareAtPrice(product, variant) : 0;
  const available = variant ? variantIsAvailable(variant) : false;
  const displayImage = variant
    ? variantDisplayImage(product.images, variant, getProductImageUrl(product))
    : getProductImageUrl(product);
  const [imgSrc, setImgSrc] = useState(displayImage);

  useEffect(() => {
    setImgSrc(displayImage);
  }, [displayImage]);

  const discount =
    strikePrice > unitPrice
      ? Math.round(((strikePrice - unitPrice) / strikePrice) * 100)
      : 0;

  function handleAdd() {
    if (!variant || !available) {
      toast.error(CATALOG_COPY.outOfStock);
      return;
    }
    addItem({
      productId: product._id,
      variantId: String(variant._id),
      slug: product.slug,
      name: product.name,
      variantLabel: variant.label,
      image: imgSrc,
      price: unitPrice,
      originalPrice: strikePrice,
      stock: variant.stock,
      gstExempt: Boolean(product.gstExempt),
    });
    toast.success(CHECKOUT_COPY.ADDED_TO_CART);
  }

  return (
    <ScaleOnHover className="h-full w-full">
      <article className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-2 shadow-sm">
        <Link href={ROUTES.PRODUCT(product.slug)} className={LAYOUT.productMedia}>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            unoptimized
            onError={() => setImgSrc(ASSETS.PLACEHOLDER_PRODUCT)}
            className={LAYOUT.productImage}
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
                {formatInr(unitPrice)}
              </span>
              {strikePrice > unitPrice ? (
                <span className="text-xs text-muted line-through">
                  {formatInr(strikePrice)}
                </span>
              ) : null}
            </>
          ) : null}
        </div>
        {offerIsLive(product) && product.offerEndsAt ? (
          <OfferCountdown endsAt={product.offerEndsAt} compact />
        ) : null}

        <div className="mt-auto pt-2">
          <Button
            size="sm"
            className="w-full"
            onClick={handleAdd}
            disabled={!variant || !available}
          >
            {CHECKOUT_COPY.ADD_TO_CART}
          </Button>
        </div>
      </article>
    </ScaleOnHover>
  );
}
