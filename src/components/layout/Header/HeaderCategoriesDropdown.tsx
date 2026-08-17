"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Droplet, Sparkles, Flame, Sprout, Gift, ShieldCheck } from "lucide-react";

export const CATEGORIES_NAV = [
  {
    name: "Wood Pressed Oils",
    slug: "wood-pressed-oils",
    tagline: "Pure • Traditional • Healthy",
    icon: Droplet,
    color: "text-amber-600 bg-amber-50",
  },
  {
    name: "Pure Cow Ghee",
    slug: "pure-cow-ghee",
    tagline: "Traditional Taste & Quality",
    icon: Sparkles,
    color: "text-yellow-600 bg-yellow-50",
  },
  {
    name: "Traditional Oils",
    slug: "traditional-oils",
    tagline: "Deepam • Mahua • Pongam",
    icon: Flame,
    color: "text-orange-600 bg-orange-50",
  },
  {
    name: "Oil Cakes",
    slug: "oil-cakes",
    tagline: "Groundnut • Coconut • Sesame",
    icon: Sprout,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    name: "Combo Offers",
    slug: "combo-offers",
    tagline: "Value Packs & Special Deals",
    icon: Gift,
    color: "text-rose-600 bg-rose-50",
  },
  {
    name: "Home Cleaning",
    slug: "home-cleaning",
    tagline: "Complete Home Care",
    icon: ShieldCheck,
    color: "text-sky-600 bg-sky-50",
  },
] as const;

export function HeaderCategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-medium text-dark/80 transition-colors hover:text-primary py-2"
        aria-expanded={open}
      >
        <span>Categories</span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-2xl border border-border/80 bg-card p-3 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-2 px-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            Shop By Category
          </div>

          <div className="grid gap-1">
            {CATEGORIES_NAV.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-cream-dark/60"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.color} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-dark group-hover:text-primary transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-muted truncate">
                      {cat.tagline}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 border-t border-border pt-2 text-center">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All Products &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
