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

import { ArrowRight, Sparkles } from "lucide-react";

export function CombosSection({ combos }: { combos: ComboOffer[] }) {
  if (!combos.length) return null;
  return (
    <section className="border-b border-border/70 bg-gradient-to-b from-cream/90 via-cream/40 to-background py-8 lg:py-12">
      <PageContainer>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Special Value Bundles</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-dark sm:text-3xl lg:text-4xl">
              {CATALOG_COPY.homeCombos}
            </h2>
            <p className="mt-1 max-w-xl text-xs text-muted sm:text-sm">
              Curated pure cold pressed oil bundles and special combo offers crafted for traditional cooking.
            </p>
          </div>
          <Button variant="outline" asChild className="gap-1.5 border-primary/30 hover:border-primary">
            <Link href={ROUTES.COMBOS}>
              <span>View all combos</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
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
