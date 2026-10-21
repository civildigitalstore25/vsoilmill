import { FREE_SHIPPING_THRESHOLD } from "@/constants/seo";

export const UI = {
  brand: "VS OilMill",
  phoneDisplay: "+91 84387 75451",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918438775451",
  address: "Vivekanandar Street, Thasildar Nagar, Vandiyur, Madurai 625020, India",
  email: "sarathkumar.agri001@gmail.com",
  mapUrl: "https://maps.app.goo.gl/nQ4P5mTEPaR3d3yh9",
  mapDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=9.9188687,78.1542067",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=9.9188687,78.1542067&hl=en&z=17&output=embed",
  workingHours: "Mon – Sun: 8:00 AM – 8:30 PM",
  announcement: `Free Express Shipping Across India on Orders Above ₹${FREE_SHIPPING_THRESHOLD}`,
  since: "Since 2020 · Madurai, Tamil Nadu",
  trustFamilies: "12,000+",
  trustYears: "38+",
  trustRating: "4.9",
  close: "Close",
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
