/** Numeric stock kept when a variant is marked available (toggle, not a qty field). */
export const VARIANT_AVAILABLE_STOCK = 999;

type VariantPrice = {
  price: number;
  originalPrice: number;
  offerPrice?: number | null;
  available?: boolean;
  stock?: number;
  image?: string;
  label?: string;
};

type OfferWindow = {
  offerEnabled?: boolean;
  offerStartsAt?: string | Date | null;
  offerEndsAt?: string | Date | null;
};

export function variantIsAvailable(variant: VariantPrice): boolean {
  if (typeof variant.available === "boolean") return variant.available;
  return (variant.stock ?? 0) > 0;
}

export function offerIsLive(product: OfferWindow, now = Date.now()): boolean {
  if (!product.offerEnabled || !product.offerStartsAt || !product.offerEndsAt) {
    return false;
  }
  const start = new Date(product.offerStartsAt).getTime();
  const end = new Date(product.offerEndsAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return now >= start && now <= end;
}

export function sellingPrice(product: OfferWindow, variant: VariantPrice): number {
  if (
    offerIsLive(product) &&
    typeof variant.offerPrice === "number" &&
    variant.offerPrice > 0
  ) {
    return variant.offerPrice;
  }
  return variant.price;
}

/** Price shown with a strikethrough next to the selling price. */
export function compareAtPrice(product: OfferWindow, variant: VariantPrice): number {
  const sell = sellingPrice(product, variant);
  if (offerIsLive(product) && sell < variant.price) return variant.price;
  return variant.originalPrice;
}

export function variantDisplayImage(
  productImages: string[] | undefined,
  variant?: { image?: string } | null,
  fallback = "",
): string {
  const variantImage = variant?.image?.trim();
  if (variantImage) return variantImage;
  const productImage = productImages?.find((img) => img?.trim());
  return productImage?.trim() || fallback;
}

export function toDatetimeLocalValue(value?: string | Date | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function comboIsLive(
  combo: {
    isActive?: boolean;
    startsAt?: string | Date | null;
    endsAt?: string | Date | null;
  },
  now = Date.now(),
): boolean {
  if (combo.isActive === false) return false;
  if (combo.startsAt && combo.endsAt) {
    const start = new Date(combo.startsAt).getTime();
    const end = new Date(combo.endsAt).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return false;
    return now >= start && now <= end;
  }
  return true;
}
