import type { Metadata } from "next";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { PageContainer } from "@/components/layout/PageContainer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProducts } from "@/lib/products/queries";
import type { Product } from "@/types/product";

export const metadata: Metadata = buildPageMetadata({
  title: "Bestsellers",
  description:
    "Shop VS OilMill bestsellers — wooden-pressed sesame, groundnut, coconut oils and Uthukuli ghee loved by 12,000+ families.",
  path: "/bestsellers",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BestsellersPage() {
  let products: Product[] = [];
  try {
    products = await getProducts({ bestSeller: true });
  } catch {
    products = [];
  }

  return (
    <PageContainer className="py-12">
      <h1 className="font-display text-4xl text-dark">Bestsellers</h1>
      <p className="mt-2 text-muted">Our most loved products.</p>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </PageContainer>
  );
}
