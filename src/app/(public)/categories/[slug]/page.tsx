import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/features/products/ProductGrid";
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
  let products: Product[] = [];

  try {
    category = await getCategoryBySlug(slug);
    if (category) {
      products = await getProducts({ categorySlug: slug });
    }
  } catch {
    category = null;
  }

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">{category.name}</h1>
      {category.description ? (
        <p className="mt-2 text-muted">{category.description}</p>
      ) : null}
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
