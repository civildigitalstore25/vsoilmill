"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { FadeIn, ScaleOnHover } from "@/components/shared/motion";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { Category, Product } from "@/types/product";

type MainTab = "bestsellers" | "newarrivals" | "all";

export function HomeProductShowcase({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeTab, setActiveTab] = useState<MainTab>("all");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");

  const bestSellerCount = useMemo(
    () => products.filter((p) => p.isBestSeller).length,
    [products],
  );

  const newArrivalCount = useMemo(
    () => products.filter((p) => p.isNewArrival).length,
    [products],
  );

  // Filter products based on main tab and selected category sub-filter
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeTab === "bestsellers") {
      result = result.filter((p) => p.isBestSeller);
    } else if (activeTab === "newarrivals") {
      result = result.filter((p) => p.isNewArrival);
    }

    if (selectedCategorySlug !== "all") {
      result = result.filter((p) => {
        if (!p.categoryId) return false;
        if (typeof p.categoryId === "string") return p.categoryId === selectedCategorySlug;
        return p.categoryId.slug === selectedCategorySlug || p.categoryId._id === selectedCategorySlug;
      });
    }

    return result;
  }, [products, activeTab, selectedCategorySlug]);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16 bg-cream/20">
      <FadeIn className="text-center max-w-2xl mx-auto mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Authentic Mara Chekku Products
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-dark md:text-4xl">
          Explore Our Collection
        </h2>
        <p className="mt-2 text-sm text-muted">
          100% natural, traditionally cold-pressed oils & fresh mill essentials.
        </p>
      </FadeIn>

      {/* Main Navigation Menu Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab("all");
            setSelectedCategorySlug("all");
          }}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border shadow-2xs",
            activeTab === "all"
              ? "border-primary bg-primary text-white shadow-md shadow-primary/20 scale-102"
              : "border-border/80 bg-card text-dark hover:border-primary/50 hover:bg-cream/50",
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>All Products</span>
          <Badge
            className={cn(
              "ml-1 text-[11px] px-1.5 py-0.2",
              activeTab === "all"
                ? "bg-white/20 text-white"
                : "bg-primary/10 text-primary",
            )}
          >
            {products.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("bestsellers");
            setSelectedCategorySlug("all");
          }}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border shadow-2xs",
            activeTab === "bestsellers"
              ? "border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-102"
              : "border-border/80 bg-card text-dark hover:border-amber-500 hover:bg-cream/50",
          )}
        >
          <Star className="h-4 w-4 fill-current" />
          <span>Best Sellers</span>
          {bestSellerCount > 0 && (
            <Badge
              className={cn(
                "ml-1 text-[11px] px-1.5 py-0.2",
                activeTab === "bestsellers"
                  ? "bg-white/20 text-white"
                  : "bg-amber-600/10 text-amber-700",
              )}
            >
              {bestSellerCount}
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("newarrivals");
            setSelectedCategorySlug("all");
          }}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border shadow-2xs",
            activeTab === "newarrivals"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102"
              : "border-border/80 bg-card text-dark hover:border-emerald-500 hover:bg-cream/50",
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span>New Arrivals</span>
          {newArrivalCount > 0 && (
            <Badge
              className={cn(
                "ml-1 text-[11px] px-1.5 py-0.2",
                activeTab === "newarrivals"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-600/10 text-emerald-700",
              )}
            >
              {newArrivalCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Sub-Menu / Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8 px-2 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setSelectedCategorySlug("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              selectedCategorySlug === "all"
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border/60 bg-card/80 text-muted hover:text-dark hover:border-border",
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                selectedCategorySlug === cat.slug
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                  : "border-border/60 bg-card/80 text-muted hover:text-dark hover:border-border",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Product Display Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center max-w-md mx-auto my-8">
          <ShoppingBag className="h-10 w-10 text-muted mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-bold text-dark">No products found</h3>
          <p className="mt-1 text-xs text-muted">
            Try switching menu tabs or selecting a different category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setSelectedCategorySlug("all");
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* View All Store Products Link */}
      <div className="mt-10 text-center">
        <ScaleOnHover className="inline-block">
          <Link
            href={ROUTES.SHOP}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark text-cream font-semibold text-sm hover:bg-primary hover:text-white transition-all shadow-md"
          >
            <span>View Full Store Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScaleOnHover>
      </div>
    </section>
  );
}
