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
    const category = (await CategoryModel.findOne({
      slug: filters.categorySlug,
      isActive: true,
    }).lean()) as { _id: unknown } | null;
    if (!category) return [];
    query.categoryId = category._id;
  }

  const products = await ProductModel.find(query)
    .populate("categoryId")
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p) => serializeProduct(p as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connectDb();
  const product = await ProductModel.findOne({ slug, isActive: true })
    .populate("categoryId")
    .lean();
  if (!product) return null;
  return serializeProduct(product as Record<string, unknown>);
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
  const category = await CategoryModel.findOne({ slug, isActive: true }).lean();
  if (!category) return null;
  return JSON.parse(JSON.stringify(category)) as Category;
}
