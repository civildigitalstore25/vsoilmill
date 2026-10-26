import { connectDb } from "@/lib/db/mongoose";
import { ProductModel } from "@/models/Product";
import { CategoryModel } from "@/models/Category";
import type { Product, Category } from "@/types/product";

function serializeProduct(doc: Record<string, unknown>): Product {
  return JSON.parse(JSON.stringify(doc)) as Product;
}

export async function getProducts(filters?: {
  bestSeller?: boolean;
  newArrival?: boolean;
  categorySlug?: string;
  activeOnly?: boolean;
}): Promise<Product[]> {
  await connectDb();
  const query: Record<string, unknown> = {};
  if (filters?.activeOnly !== false) query.isActive = true;
  if (filters?.bestSeller) query.isBestSeller = true;
  if (filters?.newArrival) query.isNewArrival = true;

  if (filters?.categorySlug) {
    const cleanSlug = decodeURIComponent(filters.categorySlug).trim().toLowerCase();
    const categories = await CategoryModel.find({ isActive: true }).lean();
    const normTarget = cleanSlug.replace(/[^a-z0-9]/g, "");

    const category = categories.find((c) => {
      const cClean = c.slug.trim().toLowerCase();
      if (cClean === cleanSlug) return true;
      const cNorm = cClean.replace(/[^a-z0-9]/g, "");
      return cNorm === normTarget || (cNorm.length > 3 && normTarget.length > 3 && (cNorm.includes(normTarget) || normTarget.includes(cNorm)));
    });

    if (!category) return [];
    query.categoryId = { $in: [category._id, String(category._id)] };
  }

  const products = await ProductModel.find(query)
    .populate("categoryId")
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p) => serializeProduct(p as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connectDb();
  const cleanSlug = decodeURIComponent(slug).trim();
  const slugRegex = new RegExp(`^${cleanSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  const product = await ProductModel.findOne({ slug: slugRegex, isActive: true })
    .populate("categoryId")
    .lean();
  if (product) return serializeProduct(product as Record<string, unknown>);

  // Smart fallback: If exact slug is not found, find matching active product by slug keywords or substring
  const activeProducts = await ProductModel.find({ isActive: true })
    .populate("categoryId")
    .lean();

  const targetLower = cleanSlug.toLowerCase();
  const targetTokens = targetLower.split(/[-_\s]+/).filter((t) => t.length > 2);

  // 1. Direct contains check: target contains product slug or vice versa
  let matched = activeProducts.find((p) => {
    const pSlug = (p.slug || "").toLowerCase();
    return pSlug && (targetLower.includes(pSlug) || pSlug.includes(targetLower));
  });

  // 2. Token match: matching key word tokens (e.g. "groundnut", "sesame", "coconut", "ghee", "castor", "neem", "mahua", "pongam", "sugar", "honey")
  if (!matched && targetTokens.length > 0) {
    matched = activeProducts.find((p) => {
      const pSlug = (p.slug || "").toLowerCase();
      const pName = (p.name || "").toLowerCase();
      return targetTokens.some((token) => pSlug.includes(token) || pName.includes(token));
    });
  }

  if (matched) {
    return serializeProduct(matched as Record<string, unknown>);
  }

  return null;
}

export async function getCategories(activeOnly = true): Promise<Category[]> {
  await connectDb();
  const query = activeOnly ? { isActive: true } : {};
  const categories = await CategoryModel.find(query)
    .sort({ sortOrder: 1 })
    .lean();
  return JSON.parse(JSON.stringify(categories)) as Category[];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  await connectDb();
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  const categories = await CategoryModel.find({ isActive: true }).lean();
  const normTarget = cleanSlug.replace(/[^a-z0-9]/g, "");

  const category = categories.find((c) => {
    const cClean = c.slug.trim().toLowerCase();
    if (cClean === cleanSlug) return true;
    const cNorm = cClean.replace(/[^a-z0-9]/g, "");
    return cNorm === normTarget || (cNorm.length > 3 && normTarget.length > 3 && (cNorm.includes(normTarget) || normTarget.includes(cNorm)));
  });

  if (!category) return null;
  return JSON.parse(JSON.stringify(category)) as Category;
}
