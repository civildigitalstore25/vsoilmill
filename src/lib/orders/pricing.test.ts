import { describe, expect, it } from "vitest";
import { getCouponDiscount, previewCouponDiscount } from "@/lib/orders/coupons";
import { calculatePricing } from "@/lib/orders/pricing";
import { UI } from "@/constants/ui";

describe("coupons", () => {
  it("applies configured promo percent", () => {
    const result = getCouponDiscount(UI.promoCode, 1000);
    expect(result.discount).toBe(Math.round(1000 * (UI.promoPercent / 100)));
    expect(result.code).toBe(UI.promoCode);
  });

  it("rejects unknown codes", () => {
    const result = getCouponDiscount("NOPE", 1000);
    expect(result.discount).toBe(0);
    expect(result.error).toBeTruthy();
  });

  it("previews discount for checkout UI", () => {
    expect(previewCouponDiscount(UI.promoCode.toLowerCase(), 500)).toBe(
      Math.round(500 * (UI.promoPercent / 100)),
    );
  });
});

describe("pricing", () => {
  it("adds shipping under free threshold", () => {
    const pricing = calculatePricing(100, 0);
    expect(pricing.shipping).toBeGreaterThan(0);
    expect(pricing.total).toBe(
      pricing.subtotal + pricing.shipping + pricing.tax - pricing.discount,
    );
  });
});
