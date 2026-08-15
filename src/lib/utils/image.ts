import { ASSETS } from "@/constants/assets";

export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "wood-pressed-oils":
    "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
  "pure-cow-ghee":
    "https://ik.imagekit.io/mnm0iz0ng2/category/pure_ghee.png",
  "traditional-oils":
    "https://ik.imagekit.io/mnm0iz0ng2/category/traditional.jpg",
  "oil-cakes":
    "https://ik.imagekit.io/mnm0iz0ng2/category/cake.jpeg",
  "combo-offers":
    "https://ik.imagekit.io/mnm0iz0ng2/category/combo.jpg",
  "home-cleaning":
    "https://ik.imagekit.io/mnm0iz0ng2/category/clean_tool.png",
};

export function cleanImageUrl(url?: string | null): string {
  if (!url) return "";
  return url.trim().replace(/^['"]|['"]$/g, "");
}

export function getProductImageUrl(
  product?: {
    images?: string[];
    categoryId?: string | { _id?: string; slug?: string; image?: string } | null;
  } | null,
  categoryFallback?: { slug?: string; image?: string } | null,
): string {
  if (!product) return ASSETS.PLACEHOLDER_PRODUCT;

  // 1. Check if product has explicit images array with a valid non-placeholder image
  if (Array.isArray(product.images) && product.images.length > 0) {
    const validImage = product.images.find((img) => {
      const cleaned = cleanImageUrl(img);
      return (
        cleaned.length > 0 &&
        cleaned !== ASSETS.PLACEHOLDER_PRODUCT &&
        cleaned !== "/images/product-placeholder.svg"
      );
    });

    if (validImage) {
      return cleanImageUrl(validImage);
    }
  }

  // 2. Check if product.categoryId is an object with image or slug
  if (
    product.categoryId &&
    typeof product.categoryId === "object" &&
    product.categoryId !== null
  ) {
    const cat = product.categoryId as { slug?: string; image?: string };
    if (cat.image && cleanImageUrl(cat.image) && !cat.image.endsWith(".svg")) {
      return cleanImageUrl(cat.image);
    }
    if (cat.slug && DEFAULT_CATEGORY_IMAGES[cat.slug]) {
      return DEFAULT_CATEGORY_IMAGES[cat.slug];
    }
  }

  // 3. Check explicit category fallback
  if (categoryFallback) {
    if (
      categoryFallback.image &&
      cleanImageUrl(categoryFallback.image) &&
      !categoryFallback.image.endsWith(".svg")
    ) {
      return cleanImageUrl(categoryFallback.image);
    }
    if (categoryFallback.slug && DEFAULT_CATEGORY_IMAGES[categoryFallback.slug]) {
      return DEFAULT_CATEGORY_IMAGES[categoryFallback.slug];
    }
  }

  // 4. Return placeholder if no image found
  return ASSETS.PLACEHOLDER_PRODUCT;
}
