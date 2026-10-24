import Link from "next/link";
import { ComboCard } from "@/components/features/catalog/ComboCard";
import { ProductCard } from "@/components/shared/ProductCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { CATALOG_COPY } from "@/constants/catalog";
import { LAYOUT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import type { ComboOffer } from "@/types/combo";
import type { Product } from "@/types/product";

export function OffersSection({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="py-12">
      <PageContainer>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-dark">{CATALOG_COPY.homeOffers}</h2>
          <Button variant="outline" asChild><Link href={ROUTES.OFFERS}>View all</Link></Button>
        </div>
        <div className={LAYOUT.productGrid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

export function CombosSection({ combos }: { combos: ComboOffer[] }) {
  if (!combos.length) return null;
  return (
    <section className="py-12">
      <PageContainer>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-dark">{CATALOG_COPY.homeCombos}</h2>
          <Button variant="outline" asChild><Link href={ROUTES.COMBOS}>View all</Link></Button>
        </div>
        <div className={LAYOUT.productGrid}>
          {combos.map((combo) => (
            <ComboCard key={combo._id} combo={combo} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
