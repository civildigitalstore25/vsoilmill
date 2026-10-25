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
  follow: "Follow",
  social: {
    instagram: "https://www.instagram.com/vsoilmillstore/",
    facebook: "https://www.facebook.com/VSOilMillStore/",
    youtube: "https://youtube.com/@sarathkumar-pd7mj?si=l8KBMkxUho5xTxR_",
    whatsapp: "https://whatsapp.com/channel/0029VbCAzla3wtazyd5uvS1f",
  },
} as const;

export const SOCIAL_LINKS = [
  {
    id: "whatsapp",
    name: "WhatsApp Channel",
    label: "VS OilMill Channel",
    href: "https://whatsapp.com/channel/0029VbCAzla3wtazyd5uvS1f",
    handle: "vsoilmill",
    description: "Join our official WhatsApp Channel for daily cold-press updates, discounts & health tips.",
    color: "#25D366",
  },
  {
    id: "youtube",
    name: "YouTube",
    label: "@sarathkumar-pd7mj",
    href: "https://youtube.com/@sarathkumar-pd7mj?si=l8KBMkxUho5xTxR_",
    handle: "@sarathkumar-pd7mj",
    description: "Subscribe for traditional wooden-press videos & mill tours by founder Sarathkumar.",
    color: "#FF0000",
  },
  {
    id: "instagram",
    name: "Instagram",
    label: "@vsoilmillstore",
    href: "https://www.instagram.com/vsoilmillstore/",
    handle: "vsoilmillstore",
    description: "Watch our daily Mara Chekku oil extraction reels & customer stories.",
    color: "#E1306C",
  },
  {
    id: "facebook",
    name: "Facebook",
    label: "VSOilMillStore",
    href: "https://www.facebook.com/VSOilMillStore/",
    handle: "VSOilMillStore",
    description: "Follow our official community for fresh batches, updates & healthy tips.",
    color: "#1877F2",
  },
] as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Bestsellers", href: "/bestsellers" },
  { label: "About", href: "/about" },
  { label: "Certificates", href: "/certificates" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
] as const;

export const FOOTER_POLICY_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Return & Refund", href: "/refund" },
  { label: "Terms of Service", href: "/terms" },
] as const;
