"use client";

import { Sparkles, Star, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FILTER_ALL, HOME_COPY } from "@/constants/home";
import { matchesProductCategory } from "@/lib/products/match-category";
import { cn } from "@/lib/utils/cn";
import type { ShowcaseFilterBarProps, ShowcaseTab } from "@/types/home";

const TAB_STYLES: Record<
  ShowcaseTab,
  { active: string; idle: string; badgeActive: string; badgeIdle: string }
> = {
  all: {
    active: "border-primary bg-primary text-white shadow-md shadow-primary/20",
    idle: "border-border/80 bg-card text-dark hover:border-primary/50 hover:bg-cream/50",
    badgeActive: "bg-white/20 text-white",
    badgeIdle: "bg-primary/10 text-primary",
  },
  bestsellers: {
    active: "border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-600/20",
    idle: "border-border/80 bg-card text-dark hover:border-amber-500 hover:bg-cream/50",
    badgeActive: "bg-white/20 text-white",
    badgeIdle: "bg-amber-600/10 text-amber-700",
  },
  newarrivals: {
    active:
      "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
    idle: "border-border/80 bg-card text-dark hover:border-emerald-500 hover:bg-cream/50",
    badgeActive: "bg-white/20 text-white",
    badgeIdle: "bg-emerald-600/10 text-emerald-700",
  },
};

export function ShowcaseFilterBar({
  products,
  categories,
  activeTab,
  selectedCategorySlug,
  onTabSelect,
  onCategorySelect,
}: ShowcaseFilterBarProps) {
  const bestSellerCount = products.filter((p) => p.isBestSeller).length;
  const newArrivalCount = products.filter((p) => p.isNewArrival).length;

  const tabs: { id: ShowcaseTab; label: string; count: number; icon: typeof ShoppingBag }[] =
    [
      { id: "all", label: HOME_COPY.allProducts, count: products.length, icon: ShoppingBag },
      { id: "bestsellers", label: HOME_COPY.bestSellers, count: bestSellerCount, icon: Star },
      { id: "newarrivals", label: HOME_COPY.newArrivals, count: newArrivalCount, icon: Sparkles },
    ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const styles = TAB_STYLES[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabSelect(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold shadow-2xs transition-all duration-200",
                isActive ? styles.active : styles.idle,
              )}
            >
              <Icon className={cn("h-4 w-4", tab.id === "bestsellers" && "fill-current")} />
              <span>{tab.label}</span>
              {(tab.id === "all" || tab.count > 0) && (
                <Badge
                  className={cn(
                    "ml-1 px-1.5 text-[11px]",
                    isActive ? styles.badgeActive : styles.badgeIdle,
                  )}
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {categories.length > 0 ? (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onCategorySelect(FILTER_ALL)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all",
              selectedCategorySlug === FILTER_ALL
                ? "border-primary bg-primary/10 font-bold text-primary shadow-xs"
                : "border-border/60 bg-card/80 text-muted hover:border-border hover:text-dark",
            )}
          >
            <span>{HOME_COPY.allCategories}</span>
            <span className="text-[10px] opacity-75">({products.length})</span>
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) =>
              matchesProductCategory(p, cat.slug, categories),
            ).length;
            const isSelected =
              selectedCategorySlug.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => onCategorySelect(cat.slug)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 font-bold text-primary shadow-xs"
                    : "border-border/60 bg-card/80 text-muted hover:border-border hover:text-dark",
                )}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-medium",
                    isSelected
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/15 text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
