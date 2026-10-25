"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";
import { toast } from "sonner";
import { AdminEditLink } from "@/components/features/products/AdminEditLink";
import { ProductShare } from "@/components/features/products/ProductShare";
import { ProductDetailTabs } from "@/components/features/products/ProductDetailTabs";
import { OfferCountdown } from "@/components/features/catalog/OfferCountdown";
import { ProductMediaGallery } from "@/components/features/products/ProductMediaGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/constants/assets";
import { CATALOG_COPY } from "@/constants/catalog";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/useCartStore";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { VARIANT_AVAILABLE_STOCK } from "@/lib/products/commerce";
import { formatInr, stripHtml } from "@/lib/utils/format";
import {
  buildProductWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";
import type { ComboLineDetail, ComboOffer } from "@/types/combo";

export function ComboDetailClient({
  combo,
  lines,
  separateTotal,
}: {
  combo: ComboOffer;
  lines: ComboLineDetail[];
  separateTotal: number;
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const buyNowItem = useCartStore((s) => s.buyNowItem);
  const { requireLogin } = useRequireLogin();
  const name = stripHtml(combo.name);
  const image = combo.images[0] || combo.videos?.[0] || ASSETS.PLACEHOLDER_PRODUCT;
  const worth = Math.max(separateTotal, combo.originalPrice);
  const save = worth > combo.price ? worth - combo.price : 0;
  const summary = lines
    .map((line) => `${line.name} ${line.label} × ${line.quantity}`.trim())
    .join(", ");

  function payload() {
    return {
      productId: combo._id,
      variantId: combo._id,
      slug: combo.slug,
      name,
      variantLabel: summary || CATALOG_COPY.comboChip,
      image,
      price: combo.price,
      originalPrice: worth,
      stock: VARIANT_AVAILABLE_STOCK,
      quantity: 1,
    };
  }

  function addToCart() {
    addItem(payload());
    toast.success(CHECKOUT_COPY.ADDED_TO_CART);
  }

  function buyNow() {
    if (!requireLogin()) return;
    buyNowItem(payload());
    toast.success(CHECKOUT_COPY.BUY_NOW_SUCCESS);
    router.push(ROUTES.CHECKOUT);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1.5 text-muted hover:text-dark"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <AdminEditLink href={ROUTES.ADMIN.COMBO_EDIT(combo._id)} />
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductMediaGallery image={image} images={combo.images} videos={combo.videos ?? []} alt={name} />
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">
              {CATALOG_COPY.comboChip}
            </Badge>
            {combo.videos && combo.videos.length > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                <Video className="h-3.5 w-3.5" />
                Video Available
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-3xl text-dark md:text-4xl">{name}</h1>
          {combo.endsAt ? <OfferCountdown endsAt={combo.endsAt} /> : null}
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-dark">{formatInr(combo.price)}</span>
            {worth > combo.price ? (
              <span className="text-lg text-muted line-through">{formatInr(worth)}</span>
            ) : null}
            {save > 0 ? (
              <Badge className="bg-primary/10 text-primary">
                {CATALOG_COPY.comboSave} {formatInr(save)}
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-muted">
            {CATALOG_COPY.comboYouPay}
            {worth > combo.price ? ` · ${CATALOG_COPY.comboSoldSeparately} ${formatInr(worth)}` : ""}
          </p>
          <div className="mt-8">
            <h2 className="font-display text-xl text-dark">{CATALOG_COPY.comboIncludes}</h2>
            <ul className="mt-3 space-y-3">
              {lines.map((line) => (
                <li key={line.key} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={line.image || ASSETS.PLACEHOLDER_PRODUCT}
                      alt={line.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-dark">{line.name}</p>
                    <p className="text-xs text-muted">
                      {line.label ? `${line.label} · ` : ""}× {line.quantity}
                    </p>
                  </div>
                  {line.unitPrice > 0 ? (
                    <p className="text-sm font-semibold text-dark">
                      {formatInr(line.unitPrice * line.quantity)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={addToCart}>
              {CHECKOUT_COPY.ADD_TO_CART}
            </Button>
            <Button size="lg" variant="accent" className="flex-1" onClick={buyNow}>
              {CHECKOUT_COPY.BUY_NOW}
            </Button>
          </div>
          <Button
            size="lg"
            variant="whatsapp"
            className="mt-3 w-full"
            onClick={() => {
              if (!requireLogin()) return;
              window.open(
                buildWhatsAppUrl(
                  buildProductWhatsAppMessage(name, summary || CATALOG_COPY.comboChip, combo.price, 1),
                ),
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            {CHECKOUT_COPY.WHATSAPP_CTA}
          </Button>
          <div className="mt-4">
            <ProductShare name={name} text={combo.description ?? name} />
          </div>
        </div>
      </div>
      {combo.description ? <ProductDetailTabs description={combo.description} /> : null}
    </div>
  );
}
