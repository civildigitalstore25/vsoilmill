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
  options: PricingOptions = {},
): OrderPricing {
  void options;
  const net = Math.max(subtotal - discount, 0);
  return { subtotal, shipping: 0, tax: 0, discount, total: net };
}

export function pricingFlagsFromLines(
  lines: Array<{ price: number; quantity: number; gstExempt?: boolean }>,
): { taxableSubtotal: number; waiveShipping: boolean } {
  void lines;
  return { taxableSubtotal: 0, waiveShipping: true };
}
