import type { Metadata } from "next";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProducts } from "@/lib/products/queries";
import type { Product } from "@/types/product";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop All Oils & Ghee",
  description:
    "Browse wooden-pressed oils, Uthukuli ghee, and herbal oils from VS OilMill. Pure Mara Chekku products delivered across India.",
  path: "/shop",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">Shop</h1>
      <p className="mt-2 text-muted">
        Pure oils and ghee from our mill — choose your size and order online.
      </p>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
