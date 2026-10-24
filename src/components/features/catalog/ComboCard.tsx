"use client";

import { OfferCountdown } from "@/components/features/catalog/OfferCountdown";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScaleOnHover } from "@/components/shared/motion";
import { ASSETS } from "@/constants/assets";
import { CATALOG_COPY } from "@/constants/catalog";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { PRODUCT_COPY } from "@/constants/home";
import { LAYOUT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/useCartStore";
import { VARIANT_AVAILABLE_STOCK, comboIsLive } from "@/lib/products/commerce";
import { cn } from "@/lib/utils/cn";
import { formatInr, stripHtml, truncate } from "@/lib/utils/format";
import type { ComboOffer } from "@/types/combo";

export function ComboCard({ combo }: { combo: ComboOffer }) {
  const addItem = useCartStore((s) => s.addItem);
  const name = stripHtml(combo.name);
  const description = truncate(stripHtml(combo.description ?? ""), 80);
  const image = combo.images[0] || ASSETS.PLACEHOLDER_PRODUCT;
  const [imgSrc, setImgSrc] = useState(image);
  const discount =
    combo.originalPrice > combo.price
      ? Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100)
      : 0;

  function handleAdd() {
    const summary = combo.items
      .map((item) => `${item.productName ?? "Item"} ${item.variantLabel ?? ""}`.trim())
      .join(", ");
    addItem({
      productId: combo._id,
      variantId: combo._id,
      slug: combo.slug,
      name,
      variantLabel: summary || CATALOG_COPY.comboChip,
      image: imgSrc,
      price: combo.price,
      originalPrice: combo.originalPrice,
      stock: VARIANT_AVAILABLE_STOCK,
    });
    toast.success(CHECKOUT_COPY.ADDED_TO_CART);
  }

  return (
    <ScaleOnHover className="h-full w-full">
      <article className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-2 shadow-sm">
        <Link href={ROUTES.COMBO(combo.slug)} className={LAYOUT.productMedia}>
          <Image
            src={imgSrc}
            alt={name}
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
        </Link>
        <Link href={ROUTES.COMBO(combo.slug)}>
          <h3 className={cn(LAYOUT.productTitle, "font-display text-sm text-dark sm:text-base")}>
            {name}
          </h3>
        </Link>
        <p className={cn(LAYOUT.productDesc, "mt-0.5 text-xs text-muted")}>
          {description || "\u00a0"}
        </p>
        <div className={cn(LAYOUT.productVariants, "mt-2 flex flex-wrap gap-1.5")}>
          <span className="inline-flex h-6 items-center rounded-md border border-primary bg-primary px-2 text-[10px] leading-none text-primary-foreground">
            {CATALOG_COPY.comboChip}
          </span>
        </div>
        <div className={cn(LAYOUT.productPrice, "mt-2 flex items-baseline gap-1.5")}>
          <span className="text-sm font-semibold text-dark sm:text-base">
            {formatInr(combo.price)}
          </span>
          {combo.originalPrice > combo.price ? (
            <span className="text-xs text-muted line-through">
              {formatInr(combo.originalPrice)}
            </span>
          ) : null}
        </div>
        {combo.endsAt && comboIsLive(combo) ? (
          <OfferCountdown endsAt={combo.endsAt} compact />
        ) : null}
        <div className="mt-auto pt-2">
          <Button size="sm" className="w-full" onClick={handleAdd}>
            {CHECKOUT_COPY.ADD_TO_CART}
          </Button>
        </div>
      </article>
    </ScaleOnHover>
  );
}
