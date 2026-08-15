import Link from "next/link";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { FadeIn } from "@/components/shared/motion";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/product";

export function BestSellersSection({ products }: { products: Product[] }) {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
      <FadeIn className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Best Sellers
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-dark md:text-4xl">
            Our Most Loved Products
          </h2>
        </div>
        <Link
          href={ROUTES.SHOP}
          className="text-sm font-semibold text-primary transition-colors hover:underline"
        >
          View All Products →
        </Link>
      </FadeIn>
      <ProductGrid products={products} />
    </section>
  );
}
