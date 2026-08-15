import { ProductCard } from "@/components/shared/ProductCard";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import type { Product } from "@/types/product";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted">No products found.</p>
    );
  }

  return (
    <Stagger className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <StaggerItem key={product._id}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
