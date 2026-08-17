"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { ShowcaseFilterBar } from "@/components/features/home/ShowcaseFilterBar";
import { FadeIn, ScaleOnHover } from "@/components/shared/motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { FILTER_ALL, HOME_COPY } from "@/constants/home";
import { LAYOUT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { matchesProductCategory } from "@/lib/products/match-category";
import { cn } from "@/lib/utils/cn";
import type { HomeProductShowcaseProps, ShowcaseTab } from "@/types/home";

export function HomeProductShowcase({
  products = [],
  categories = [],
}: HomeProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>(FILTER_ALL);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(FILTER_ALL);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeTab === "bestsellers") {
      result = result.filter((p) => p.isBestSeller);
    } else if (activeTab === "newarrivals") {
      result = result.filter((p) => p.isNewArrival);
    }

    if (selectedCategorySlug !== FILTER_ALL) {
      result = result.filter((p) =>
        matchesProductCategory(p, selectedCategorySlug, categories),
      );
    }

    return result;
  }, [products, activeTab, selectedCategorySlug, categories]);

  function handleCategorySelect(slug: string) {
    setSelectedCategorySlug(slug);
    setActiveTab(FILTER_ALL);
  }

  function handleTabSelect(tab: ShowcaseTab) {
    setActiveTab(tab);
    setSelectedCategorySlug(FILTER_ALL);
  }

  function resetFilters() {
    setActiveTab(FILTER_ALL);
    setSelectedCategorySlug(FILTER_ALL);
  }

  return (
    <section className={cn(LAYOUT.sectionY, "bg-cream/20")}>
      <PageContainer>
        <FadeIn className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {HOME_COPY.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-dark md:text-4xl">
            {HOME_COPY.collectionTitle}
          </h2>
          <p className="mt-2 text-sm text-muted">{HOME_COPY.collectionSubtitle}</p>
        </FadeIn>

        <ShowcaseFilterBar
          products={products}
          categories={categories}
          activeTab={activeTab}
          selectedCategorySlug={selectedCategorySlug}
          onTabSelect={handleTabSelect}
          onCategorySelect={handleCategorySelect}
        />

        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            resetKey={`${activeTab}-${selectedCategorySlug}`}
          />
        ) : (
          <div className="mx-auto my-8 max-w-md rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted opacity-50" />
            <h3 className="font-display text-lg font-bold text-dark">
              {HOME_COPY.noProductsTitle}
            </h3>
            <p className="mt-1 text-xs text-muted">{HOME_COPY.noProductsBody}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-lg border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/5"
            >
              {HOME_COPY.resetFilters}
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <ScaleOnHover className="inline-block">
            <Link
              href={ROUTES.SHOP}
              className="inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-semibold text-cream shadow-md transition-all hover:bg-primary hover:text-white"
            >
              <span>{HOME_COPY.viewCatalog}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScaleOnHover>
        </div>
      </PageContainer>
    </section>
  );
}
