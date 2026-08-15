import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/features/products/ProductDetailClient";
import { ProductReviews } from "@/components/features/reviews/ProductReviews";
import {
  buildProductJsonLd,
  buildProductMetadata,
} from "@/lib/seo/metadata";
import { getProductBySlug, getProducts } from "@/lib/products/queries";
import type { Category } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return {};
    return buildProductMetadata(product);
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getProductBySlug(slug);
  } catch {
    product = null;
  }

  if (!product) notFound();

  const category =
    typeof product.categoryId === "object"
      ? (product.categoryId as Category)
      : undefined;
  const jsonLd = buildProductJsonLd(product, category?.name);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
      <ProductReviews productId={product._id} />
    </div>
  );
}
