import { GST_RATE } from "@/constants/seo";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/constants/shipping";
import type { OrderPricing } from "@/types/order";

export type PricingOptions = {
  /** Amount subject to GST (defaults to subtotal − discount). */
  taxableSubtotal?: number;
  /** Force free shipping (e.g. GST-exempt-only test cart). */
  waiveShipping?: boolean;
};

export function calculatePricing(
  subtotal: number,
  discount = 0,
  options: PricingOptions = {},
): OrderPricing {
  const net = Math.max(subtotal - discount, 0);

  const taxableBase =
    options.taxableSubtotal !== undefined
      ? Math.max(options.taxableSubtotal - discount, 0)
      : net;

  // GST-exempt-only carts (taxable 0) never pay shipping
  const exemptOnlyCart =
    options.taxableSubtotal !== undefined &&
    options.taxableSubtotal <= 0 &&
    subtotal > 0;
  const shipping =
    options.waiveShipping || exemptOnlyCart
      ? 0
      : net >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_FEE;

  const tax = Math.round(taxableBase * GST_RATE);
  const total = net + shipping + tax;

  return { subtotal, shipping, tax, discount, total };
}

/** Taxable amount and whether shipping should be waived for a line list. */
export function pricingFlagsFromLines(
  lines: Array<{ price: number; quantity: number; gstExempt?: boolean }>,
): { taxableSubtotal: number; waiveShipping: boolean } {
  let taxableSubtotal = 0;
  let allExempt = lines.length > 0;
  for (const line of lines) {
    const lineTotal = line.price * line.quantity;
    if (line.gstExempt) {
      continue;
    }
    allExempt = false;
    taxableSubtotal += lineTotal;
  }
  return {
    taxableSubtotal,
    // No GST + no shipping when every line is GST-exempt
    waiveShipping: allExempt,
  };
}
