import { COUPONS, COUPON_ERRORS } from "@/constants/coupons";

export function normalizeCouponCode(code: string | undefined): string | undefined {
  const trimmed = code?.trim().toUpperCase();
  return trimmed || undefined;
}

export function getCouponDiscount(
  code: string | undefined,
  subtotal: number,
): { discount: number; code?: string; error?: string } {
  const normalized = normalizeCouponCode(code);
  if (!normalized) {
    return { discount: 0 };
  }

  const coupon = COUPONS.find((c) => c.code.toUpperCase() === normalized);
  if (!coupon) {
    return { discount: 0, error: COUPON_ERRORS.INVALID };
  }

  return {
    discount: Math.round(subtotal * (coupon.percentOff / 100)),
    code: coupon.code,
  };
}

export function previewCouponDiscount(code: string | undefined, subtotal: number): number {
  return getCouponDiscount(code, subtotal).discount;
}
