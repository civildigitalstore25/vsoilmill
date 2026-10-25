"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminEditLink } from "@/components/features/products/AdminEditLink";
import { ProductDetailHeading } from "@/components/features/products/ProductDetailHeading";
import { OfferCountdown } from "@/components/features/catalog/OfferCountdown";
import { ProductMediaGallery } from "@/components/features/products/ProductMediaGallery";
import { ProductDetailTabs } from "@/components/features/products/ProductDetailTabs";
import { ProductPurchaseActions } from "@/components/features/products/ProductPurchaseActions";
import { QuantityStepper } from "@/components/features/products/QuantityStepper";
import { WhatsAppIcon } from "@/components/features/products/ProductShareIcons";
import { CATALOG_COPY } from "@/constants/catalog";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/useCartStore";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import {
  buildProductWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";
import {
  compareAtPrice,
  offerIsLive,
  sellingPrice,
  variantDisplayImage,
  variantIsAvailable,
} from "@/lib/products/commerce";
import { cn } from "@/lib/utils/cn";
import { formatInr } from "@/lib/utils/format";
import type { Product } from "@/types/product";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const buyNowItem = useCartStore((s) => s.buyNowItem);
  const { requireLogin } = useRequireLogin();
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const variant = product.variants[variantIndex];
  const unitPrice = variant ? sellingPrice(product, variant) : 0;
  const strikePrice = variant ? compareAtPrice(product, variant) : 0;
  const available = variant ? variantIsAvailable(variant) : false;
  const image = variantDisplayImage(product.images, variant);

  const discount = useMemo(() => {
    if (!variant || strikePrice <= unitPrice) return 0;
    return Math.round(((strikePrice - unitPrice) / strikePrice) * 100);
  }, [variant, strikePrice, unitPrice]);

  function buildCartPayload() {
    if (!variant) return null;
    return {
      productId: product._id,
      variantId: String(variant._id),
      slug: product.slug,
      name: product.name,
      variantLabel: variant.label,
      image,
      price: unitPrice,
      originalPrice: strikePrice,
      stock: available ? variant.stock : 0,
      quantity,
      gstExempt: Boolean(product.gstExempt),
    };
  }

  function addToCart() {
    if (!available) {
      toast.error(CATALOG_COPY.outOfStock);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    addItem(payload);
    toast.success(CHECKOUT_COPY.ADDED_TO_CART);
  }

  function buyNow() {
    if (!requireLogin()) return;
    if (!available) {
      toast.error(CATALOG_COPY.outOfStock);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    buyNowItem(payload);
    toast.success(CHECKOUT_COPY.BUY_NOW_SUCCESS);
    router.push(ROUTES.CHECKOUT);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 lg:mb-6">
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
        <AdminEditLink href={ROUTES.ADMIN.PRODUCT_EDIT(product._id)} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-10">
        <ProductMediaGallery
          image={image}
          images={product.images}
          videos={product.videos ?? []}
          alt={product.name}
        />

        <div>
        <ProductDetailHeading
          name={product.name}
          shortDescription={product.shortDescription}
          discount={discount}
        />

        <div className="mt-4 lg:mt-6">
          <p className="mb-2 text-base font-medium text-dark lg:text-lg">{CATALOG_COPY.selectSize}</p>
          <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-wrap">
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

        {variant ? (
          <div className="mt-4 flex items-end gap-3 lg:mt-6">
            <div>
              <p className="mb-1 text-base font-medium text-dark lg:text-lg">{CATALOG_COPY.priceLabel}</p>
              <div className="flex flex-wrap items-baseline gap-2 lg:gap-3">
                <span className="text-3xl font-semibold text-dark lg:text-4xl">
                  {formatInr(unitPrice)}
                </span>
                {strikePrice > unitPrice ? (
                  <span className="text-lg text-muted line-through">
                    {formatInr(strikePrice)}
                  </span>
                ) : null}
                {!available ? (
                  <Badge>{CATALOG_COPY.outOfStock}</Badge>
                ) : null}
              </div>
            </div>
            <div className="mb-0.5 lg:hidden">
              <QuantityStepper
                quantity={quantity}
                available={available}
                onQuantity={setQuantity}
                compact
              />
            </div>
          </div>
        ) : null}
        {offerIsLive(product) && product.offerEndsAt ? (
          <OfferCountdown endsAt={product.offerEndsAt} />
        ) : null}

        <ProductPurchaseActions
          available={available}
          quantity={quantity}
          onQuantity={setQuantity}
          onAdd={addToCart}
          onBuy={buyNow}
          productName={product.name}
          shareText={product.shortDescription || product.description}
          variantLabel={variant?.label}
          unitPrice={unitPrice}
        />
        </div>
      </div>
      <ProductDetailTabs description={product.description} productId={product._id} />

      {/* Floating WhatsApp chat icon button at bottom of product view */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={buildWhatsAppUrl(
            buildProductWhatsAppMessage(
              product.name,
              variant?.label ?? "",
              unitPrice,
              quantity,
            ),
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl hover:bg-[#1ebe57] hover:shadow-2xl transition-all hover:scale-105"
          aria-label="Chat with VS OilMill on WhatsApp"
        >
          <span className="flex h-6 w-6 items-center justify-center">
            <WhatsAppIcon className="h-5 w-5 text-white" />
          </span>
          <span className="text-sm font-bold hidden sm:inline">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}
