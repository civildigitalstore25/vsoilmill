import { ProductCard } from "@/components/shared/ProductCard";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { HOME_COPY } from "@/constants/home";
import { LAYOUT } from "@/constants/layout";
import type { ProductGridProps } from "@/types/product";

export function ProductGrid({ products, resetKey }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted">{HOME_COPY.noProductsTitle}</p>
    );
  }

  return (
    <Stagger
      key={resetKey ?? products.map((p) => p._id).join("-")}
      trigger="mount"
      className={LAYOUT.productGrid}
    >
      {products.map((product) => (
        <StaggerItem key={product._id} className="h-full">
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
