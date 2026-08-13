import { FREE_SHIPPING_THRESHOLD, GST_RATE } from "@/constants/seo";
import type { OrderPricing } from "@/types/order";

export function calculatePricing(
  subtotal: number,
  discount = 0,
): OrderPricing {
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const taxable = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxable * GST_RATE);
  const total = taxable + shipping + tax;

  return { subtotal, shipping, tax, discount, total };
}
