import { FREE_SHIPPING_THRESHOLD } from "@/constants/seo";

export const UI = {
  brand: "VS OilMill",
  phoneDisplay: "+91 84387 75451",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918438775451",
  address:
    "VS Oil Mill & Store, 2/34 B, Main Road, S.v.mangalam, Nearby Police Station, Singampunari (t.k), Sivagangai - 630501",
  announcement: `Free Express Shipping Across India on Orders Above ₹${FREE_SHIPPING_THRESHOLD}`,
  since: "Since 1985 · Sivagangai, Tamil Nadu",
  trustFamilies: "12,000+",
  trustYears: "38+",
  trustRating: "4.9",
  promoCode: "PURE10",
  promoPercent: 10,
} as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Bestsellers", href: "/bestsellers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
] as const;

export const FOOTER_POLICY_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Return & Refund", href: "/refund" },
  { label: "Terms of Service", href: "/terms" },
] as const;
