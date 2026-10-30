import { FREE_SHIPPING_THRESHOLD } from "@/constants/seo";

export const SHIPPING_FEE = 99;

export const ESTIMATED_DELIVERY = {
  minDays: 3,
  maxDays: 5,
  daysText: "3 to 5 days",
  label: "Estimated Delivery: 3 to 5 Days",
  shortLabel: "3–5 Days Delivery",
  description: "Standard doorstep delivery across India in 3 to 5 days.",
} as const;

export { FREE_SHIPPING_THRESHOLD };
