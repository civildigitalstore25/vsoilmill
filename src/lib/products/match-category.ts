import { FILTER_ALL } from "@/constants/home";
import type { Category, Product } from "@/types/product";

function normalize(value: string): string {
  return decodeURIComponent(value).trim().toLowerCase();
}

function idEquals(id1: unknown, id2: unknown): boolean {
  if (id1 == null || id2 == null) return false;
  return String(id1).trim().toLowerCase() === String(id2).trim().toLowerCase();
}

function slugEquals(s1?: string, s2?: string): boolean {
  if (!s1 || !s2) return false;
  return normalize(s1) === normalize(s2);
}

function getProductCategory(product: Product): { id: unknown; slug?: string } {
  if (typeof product.categoryId === "object" && product.categoryId !== null) {
    return { id: product.categoryId._id, slug: product.categoryId.slug };
  }
  if (typeof product.categoryId === "string") {
    return { id: product.categoryId };
  }
  return { id: null };
}

export function matchesProductCategory(
  product: Product,
  targetSlug: string,
  categories: Category[],
): boolean {
  if (!targetSlug || targetSlug === FILTER_ALL) return true;
  if (!product?.categoryId) return false;

  const target = normalize(targetSlug);
  const targetCat = categories.find(
    (c) => slugEquals(c.slug, target) || idEquals(c._id, targetSlug),
  );
  const { id: productCatId, slug: productCatSlug } = getProductCategory(product);

  if (
    productCatSlug &&
    (slugEquals(productCatSlug, targetCat?.slug) || slugEquals(productCatSlug, target))
  ) {
    return true;
  }

  if (
    productCatId &&
    (idEquals(productCatId, targetCat?._id) || idEquals(productCatId, targetSlug))
  ) {
    return true;
  }

  if (!productCatId) return false;

  const matched = categories.find(
    (c) => idEquals(c._id, productCatId) || slugEquals(c.slug, String(productCatId)),
  );

  return Boolean(
    matched &&
      (slugEquals(matched.slug, targetCat?.slug ?? target) ||
        idEquals(matched._id, targetCat?._id)),
  );
}
