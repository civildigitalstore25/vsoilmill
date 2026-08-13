import Link from "next/link";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { FadeIn } from "@/components/shared/motion";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/product";

export function BestSellersSection({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <FadeIn className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Best Sellers
          </p>
          <h2 className="mt-2 font-display text-3xl text-dark md:text-4xl">
            Our Most Loved Products
          </h2>
        </div>
        <Link
          href={ROUTES.SHOP}
          className="text-sm font-medium text-primary transition-colors hover:underline"
        >
          View All Products →
        </Link>
      </FadeIn>
      <ProductGrid products={products} />
    </section>
  );
}
