import { COUPONS, COUPON_ERRORS } from "@/constants/coupons";
import { connectDb } from "@/lib/db/mongoose";
import { CouponModel } from "@/models/Coupon";

export function normalizeCouponCode(code: string | undefined): string | undefined {
  const trimmed = code?.trim().toUpperCase();
  return trimmed || undefined;
}

export type CouponLineItem = {
  productId: string;
  variantId?: string;
  price: number;
  quantity: number;
};

export type ValidatedCouponResult = {
  discount: number;
  code?: string;
  name?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  error?: string;
  couponDoc?: { _id?: unknown; [key: string]: unknown } | null;
};

/**
 * Validates a coupon against the database (or fallback static list),
 * checks date validity, usage limits, and product eligibility, and computes discount.
 */
export async function validateAndCalculateCouponDiscount({
  code,
  items,
  subtotal,
}: {
  code: string | undefined;
  items?: CouponLineItem[];
  subtotal: number;
}): Promise<ValidatedCouponResult> {
  const normalized = normalizeCouponCode(code);
  if (!normalized) {
    return { discount: 0 };
  }

  await connectDb();
  const dbCoupon = await CouponModel.findOne({ code: normalized });

  if (dbCoupon) {
    if (dbCoupon.status !== "ACTIVE") {
      return { discount: 0, error: "This coupon is currently inactive" };
    }

    const now = new Date();
    if (new Date(dbCoupon.validFrom) > now) {
      return { discount: 0, error: "This coupon is not active yet" };
    }
    if (new Date(dbCoupon.validTo) < now) {
      return { discount: 0, error: "This coupon has expired" };
    }

    if (dbCoupon.usageLimit > 0 && dbCoupon.timesUsed >= dbCoupon.usageLimit) {
      return { discount: 0, error: "This coupon has reached its maximum usage limit" };
    }

    // Determine eligible subtotal based on applicable products
    let eligibleSubtotal = subtotal;
    const applicable = dbCoupon.applicableProducts?.map((id: unknown) => String(id)) ?? [];

    if (applicable.length > 0) {
      if (!items || items.length === 0) {
        return { discount: 0, error: "Cart items required to validate product-specific coupon" };
      }
      const eligibleItems = items.filter((item) =>
        applicable.includes(String(item.productId)),
      );
      if (eligibleItems.length === 0) {
        return {
          discount: 0,
          error: "This coupon is not applicable to any products in your cart",
        };
      }
      eligibleSubtotal = eligibleItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    }

    const discount =
      dbCoupon.discountType === "PERCENTAGE"
        ? Math.round(eligibleSubtotal * (dbCoupon.discountValue / 100))
        : Math.min(dbCoupon.discountValue, eligibleSubtotal);

    return {
      discount,
      code: dbCoupon.code,
      name: dbCoupon.name,
      discountType: dbCoupon.discountType,
      discountValue: dbCoupon.discountValue,
      couponDoc: dbCoupon,
    };
  }

  // Fallback to static coupons (e.g., PURE10)
  const staticCoupon = COUPONS.find((c) => c.code.toUpperCase() === normalized);
  if (staticCoupon) {
    return {
      discount: Math.round(subtotal * (staticCoupon.percentOff / 100)),
      code: staticCoupon.code,
      name: staticCoupon.label,
      discountType: "PERCENTAGE",
      discountValue: staticCoupon.percentOff,
    };
  }

  return { discount: 0, error: COUPON_ERRORS.INVALID };
}

/**
 * Synchronous version for legacy/test callers
 */
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
