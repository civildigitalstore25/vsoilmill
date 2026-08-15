"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/product";

interface CategoryHeroProps {
  category: Category;
  allCategories: Category[];
}

export function CategoryHero({ category, allCategories }: CategoryHeroProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-dark font-semibold">{category.name}</span>
      </nav>

      {/* Category Navigation Menu Bar */}
      {allCategories.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 py-1">
          {allCategories.map((c) => {
            const isActive = c.slug.toLowerCase() === category.slug.toLowerCase();
            return (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all border shadow-2xs",
                  isActive
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/20 scale-102 font-bold"
                    : "border-border/80 bg-card text-dark hover:border-primary/50 hover:bg-cream-dark/50",
                )}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
