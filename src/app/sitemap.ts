import type { MetadataRoute } from "next";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { CategoryModel } from "@/models/Category";
import { ProductModel } from "@/models/Product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    ROUTES.HOME,
    ROUTES.SHOP,
    ROUTES.BESTSELLERS,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.FAQS,
    ROUTES.PRIVACY,
    ROUTES.TERMS,
    ROUTES.SHIPPING,
    ROUTES.REFUND,
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === ROUTES.HOME ? 1 : 0.7,
  }));

  try {
    await connectDb();
    const [products, categories] = await Promise.all([
      ProductModel.find({ isActive: true }).select("slug updatedAt").lean(),
      CategoryModel.find({ isActive: true }).select("slug updatedAt").lean(),
    ]);

    const productRoutes = products.map((product) => ({
      url: `${siteUrl}${ROUTES.PRODUCT(product.slug)}`,
      lastModified: product.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    const categoryRoutes = categories.map((category) => ({
      url: `${siteUrl}${ROUTES.CATEGORY(category.slug)}`,
      lastModified: category.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
