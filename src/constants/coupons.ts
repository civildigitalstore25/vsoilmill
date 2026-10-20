export type CouponDefinition = {
  code: string;
  percentOff: number;
  label: string;
};

/**
 * Server-validated promo codes only.
 * Do not surface these as checkout defaults/placeholders.
 */
export const COUPONS: readonly CouponDefinition[] = [
  {
    code: "PURE10",
    percentOff: 10,
    label: "10% off",
  },
] as const;

export const COUPON_ERRORS = {
  INVALID: "Invalid or expired coupon code",
} as const;
