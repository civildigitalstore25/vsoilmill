import { describe, expect, it } from "vitest";
import { getCouponDiscount, previewCouponDiscount } from "@/lib/orders/coupons";
import { calculatePricing } from "@/lib/orders/pricing";
import { COUPONS } from "@/constants/coupons";

describe("coupons", () => {
  const sample = COUPONS[0];

  it("applies configured promo percent", () => {
    const result = getCouponDiscount(sample.code, 1000);
    expect(result.discount).toBe(
      Math.round(1000 * (sample.percentOff / 100)),
    );
    expect(result.code).toBe(sample.code);
  });

  it("rejects unknown codes", () => {
    const result = getCouponDiscount("NOPE", 1000);
    expect(result.discount).toBe(0);
    expect(result.error).toBeTruthy();
  });

  it("previews discount for checkout UI", () => {
    expect(previewCouponDiscount(sample.code.toLowerCase(), 500)).toBe(
      Math.round(500 * (sample.percentOff / 100)),
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

  it("skips GST and shipping for gst-exempt-only cart", () => {
    const pricing = calculatePricing(1, 0, {
      taxableSubtotal: 0,
      waiveShipping: true,
    });
    expect(pricing.tax).toBe(0);
    expect(pricing.shipping).toBe(0);
    expect(pricing.total).toBe(1);
  });
});
