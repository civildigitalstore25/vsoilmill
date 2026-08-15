"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Category } from "@/types/product";

interface CategoryHeroProps {
  category: Category;
  allCategories: Category[];
}

export function CategoryHero({ category, allCategories }: CategoryHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-cream via-amber-50/40 to-cream-dark/50 p-6 md:p-10 shadow-sm">
      {/* Background Decorative Accent */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

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

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-4">
          {category.badge && (
            <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold px-3 py-1 text-xs">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 inline text-amber-600" />
              {category.badge}
            </Badge>
          )}

          <h1 className="font-display text-3xl md:text-5xl font-bold text-dark leading-tight">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-base text-muted md:text-lg max-w-xl leading-relaxed">
              {category.description}
            </p>
          )}

          {/* Trust Highlights */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-dark/80">
            <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border shadow-xs">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>100% Pure & Unrefined</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border shadow-xs">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Traditional Mara Chekku</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border shadow-xs">
              <Truck className="h-4 w-4 text-primary" />
              <span>Fast Shipping Across India</span>
            </div>
          </div>
        </div>

        {/* Right Hero Image Card */}
        {category.image && (
          <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        )}
      </div>

      {/* Category Chips Bar for quick switching */}
      {allCategories.length > 0 && (
        <div className="mt-8 border-t border-border/60 pt-6">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Explore Other Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => {
              const isActive = c.slug === category.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm scale-105"
                      : "bg-card border border-border text-dark hover:border-primary/50 hover:bg-cream-dark/50"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
