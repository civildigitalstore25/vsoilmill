import type { Product } from "@/types/product";
import type { ComboOffer } from "@/types/combo";
import type { CarouselSlide } from "@/types/carousel";
import type { GalleryImage } from "@/constants/gallery";
import { GALLERY_IMAGES } from "@/constants/gallery";
import { stripHtml } from "@/lib/utils/format";
import { variantIsAvailable } from "@/lib/products/commerce";

/**
 * Builds gallery media items from active database entities.
 * Ensures that only available products (active with in-stock variants) and active combos are shown,
 * and every product/combo links directly to its live detail page to prevent 404 errors.
 */
export function buildDynamicGalleryImages(
  products: Product[],
  combos: ComboOffer[],
  carousels: CarouselSlide[]
): GalleryImage[] {
  // If no DB products available, return verified GALLERY_IMAGES
  if (!products.length && !combos.length) {
    return GALLERY_IMAGES;
  }

  const items: GalleryImage[] = [];

  // 1. Add Active Banners
  if (carousels.length > 0) {
    carousels.forEach((c, idx) => {
      items.push({
        id: `banner-${c._id || idx}`,
        title: c.headline || "VS OilMill Mara Chekku Oils",
        description: c.subheadline || "Direct farm cold pressed oils from Madurai.",
        imageUrl: c.imageUrl,
        category: "banners",
        tag: "Mill Banner",
        badge: "Signature Collection",
        aspectRatio: "landscape",
        link: c.navigationLink || "/shop",
      });
    });
  } else {
    items.push(...GALLERY_IMAGES.filter((img) => img.category === "banners"));
  }

  // 2. Add Available Products (ONLY active products with available variants)
  const availableProducts = products.filter((p) =>
    p.isActive && p.variants?.some((v) => variantIsAvailable(v))
  );

  for (const product of availableProducts) {
    const isWoodPressed =
      product.slug === "groundnut-oil" ||
      product.slug === "sesame-oil" ||
      product.slug === "coconut-oil" ||
      (typeof product.categoryId === "object" && product.categoryId?.slug === "wood-pressed-oils");

    const categoryType: "products" | "traditional" = isWoodPressed ? "products" : "traditional";
    const tag =
      typeof product.categoryId === "object" && product.categoryId?.name
        ? product.categoryId.name
        : isWoodPressed
        ? "Wood Pressed Oil"
        : "Traditional Purity";
    const badge = product.isBestSeller ? "Bestseller" : isWoodPressed ? "Mara Chekku" : "100% Pure";
    const cleanDesc =
      product.shortDescription ||
      stripHtml(product.description || "").slice(0, 110) ||
      "Pure traditional cold-pressed Mara Chekku oil from VS OilMill.";

    const validImages = (product.images || []).filter((img) => img?.trim());
    if (validImages.length === 0) continue;

    validImages.forEach((imageUrl, imgIdx) => {
      const matchedVariant = product.variants?.find((v) => v.image === imageUrl);
      const titleSuffix = matchedVariant
        ? ` — ${matchedVariant.label}`
        : validImages.length > 1
        ? ` (Packaging ${imgIdx + 1})`
        : "";

      items.push({
        id: `prod-${product.slug}-${imgIdx}`,
        title: `${product.name}${titleSuffix}`,
        description: cleanDesc,
        imageUrl,
        category: categoryType,
        tag,
        badge,
        aspectRatio: "square",
        link: `/products/${product.slug}`,
      });
    });
  }

  // 3. Add Available Combos
  for (const combo of combos) {
    if (!combo.isActive) continue;
    const cleanName = stripHtml(combo.name);
    const cleanDesc =
      stripHtml(combo.description || "").slice(0, 110) ||
      "Special value cold pressed oil combo offer.";
    const validImages = (combo.images || []).filter((img) => img?.trim());

    if (validImages.length > 0) {
      validImages.forEach((imageUrl, imgIdx) => {
        items.push({
          id: `combo-${combo.slug}-${imgIdx}`,
          title: cleanName,
          description: cleanDesc,
          imageUrl,
          category: "combos",
          tag: "Combo Savings",
          badge: "Special Deal",
          aspectRatio: "portrait",
          link: `/combos/${combo.slug}`,
        });
      });
    }
  }

  // 4. Heritage Mill photo
  const heritageExpeller = GALLERY_IMAGES.find((img) => img.id === "trad-wooden-expeller");
  if (heritageExpeller && !items.some((i) => i.id === "trad-wooden-expeller")) {
    items.push(heritageExpeller);
  }

  return items;
}
