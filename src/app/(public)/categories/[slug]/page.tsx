import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { CategoryHero } from "@/components/features/categories/CategoryHero";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/products/queries";
import type { Category, Product } from "@/types/product";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return {};
    return buildPageMetadata({
      title: category.name,
      description:
        category.description ??
        `Shop ${category.name} from VS OilMill — pure wooden-pressed oils and ghee.`,
      path: `/categories/${slug}`,
    });
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  let category: Category | null = null;
  let allCategories: Category[] = [];
  let products: Product[] = [];

  try {
    const [fetchedCategory, fetchedCategories] = await Promise.all([
      getCategoryBySlug(slug),
      getCategories(),
    ]);

    category = fetchedCategory;
    allCategories = fetchedCategories;

    if (category) {
      products = await getProducts({ categorySlug: slug });
    }
  } catch {
    category = null;
  }

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      <CategoryHero category={category} allCategories={allCategories} />

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-display text-2xl font-bold text-dark">
            Products in {category.name}
          </h2>
          <span className="text-xs font-semibold text-muted bg-cream-dark px-3 py-1 rounded-full">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
