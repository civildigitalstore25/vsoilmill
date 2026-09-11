import { UI } from "@/constants/ui";

export type CouponDefinition = {
  code: string;
  percentOff: number;
  label: string;
};

/** Server-validated promo codes. Extend here or later move to admin/DB. */
export const COUPONS: readonly CouponDefinition[] = [
  {
    code: UI.promoCode,
    percentOff: UI.promoPercent,
    label: `${UI.promoPercent}% off`,
  },
] as const;

export const COUPON_ERRORS = {
  INVALID: "Invalid or expired coupon code",
} as const;
