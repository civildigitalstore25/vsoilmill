import { PRODUCT_SHARE, SHARE_ENDPOINTS, productShareMessage } from "@/constants/share";
import { SITE_NAME } from "@/constants/seo";
import type { ProductShareLink } from "@/types/product";

export function productShareLinks(name: string, url: string): ProductShareLink[] {
  const message = productShareMessage(name);
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(message);

  return [
    {
      key: "whatsapp",
      label: PRODUCT_SHARE.whatsapp,
      href: `${SHARE_ENDPOINTS.whatsapp}${encodeURIComponent(`${message} ${url}`)}`,
    },
    {
      key: "facebook",
      label: PRODUCT_SHARE.facebook,
      href: `${SHARE_ENDPOINTS.facebook}${encodedUrl}`,
    },
    {
      key: "x",
      label: PRODUCT_SHARE.x,
      href: `${SHARE_ENDPOINTS.x}?text=${encodedMessage}&url=${encodedUrl}`,
    },
    {
      key: "email",
      label: PRODUCT_SHARE.email,
      href: `mailto:?subject=${encodeURIComponent(`${name} | ${SITE_NAME}`)}&body=${encodeURIComponent(`${message} ${url}`)}`,
    },
  ];
}
