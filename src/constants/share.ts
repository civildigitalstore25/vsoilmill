import { SITE_NAME } from "@/constants/seo";

export const PRODUCT_SHARE = {
  label: "Share",
  shareProduct: "Share product",
  whatsapp: "Share on WhatsApp",
  facebook: "Share on Facebook",
  x: "Share on X",
  email: "Share via email",
  copied: "Product link copied",
  shared: "Thanks for sharing",
  failed: "Unable to share this product",
  previewLength: 120,
} as const;

export const SHARE_ENDPOINTS = {
  whatsapp: "https://api.whatsapp.com/send?text=",
  facebook: "https://www.facebook.com/sharer/sharer.php?u=",
  x: "https://twitter.com/intent/tweet",
} as const;

export function productShareMessage(name: string): string {
  return `Check out ${name} from ${SITE_NAME}.`;
}
