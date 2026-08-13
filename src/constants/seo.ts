export const SITE_NAME = "VS OilMill";
export const SITE_TAGLINE = "Pure, Unrefined Wooden-Pressed Oils From Our Mill";
export const SITE_DESCRIPTION =
  "Cold-pressed in our traditional Mara Chekku mill — no heat, no chemicals, no compromise. Pure oils and A2 ghee delivered fresh across India.";

export const SEO_DEFAULTS = {
  titleTemplate: `%s | ${SITE_NAME}`,
  defaultTitle: `${SITE_NAME} – ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  locale: "en_IN",
  type: "website" as const,
  twitterCard: "summary_large_image" as const,
};

export const FREE_SHIPPING_THRESHOLD = 999;
export const GST_RATE = 0.05;
export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";
