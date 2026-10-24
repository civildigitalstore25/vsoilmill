import type { OrderPricing } from "@/types/order";

export type PricingOptions = {
  /** Kept for older callers. GST is included in the product price. */
  taxableSubtotal?: number;
  waiveShipping?: boolean;
};

/** Product prices already include 5% GST. Shipping is free on every order. */
export function calculatePricing(
  subtotal: number,
  discount = 0,
  _options: PricingOptions = {},
): OrderPricing {
  const net = Math.max(subtotal - discount, 0);
  return { subtotal, shipping: 0, tax: 0, discount, total: net };
}

export function pricingFlagsFromLines(
  _lines: Array<{ price: number; quantity: number; gstExempt?: boolean }>,
): { taxableSubtotal: number; waiveShipping: boolean } {
  return { taxableSubtotal: 0, waiveShipping: true };
}
