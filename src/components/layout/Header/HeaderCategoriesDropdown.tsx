"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Droplet,
  Sparkles,
  Flame,
  Sprout,
  Gift,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { stripHtml } from "@/lib/utils/format";
import type { Category } from "@/types/product";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "wood-pressed-oils": Droplet,
  "pure-cow-ghee": Sparkles,
  "traditional-oils": Flame,
  "oil-cakes": Sprout,
  "combo-offers": Gift,
  "home-cleaning": ShieldCheck,
};

export function HeaderCategoriesDropdown({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-2xl border border-border/80 bg-card p-3 shadow-xl backdrop-blur-md">
          <div className="mb-2 px-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            Shop By Category
          </div>

          <div className="grid gap-1">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Tag;
              return (
                <Link
                  key={cat._id}
                  href={ROUTES.CATEGORY(cat.slug)}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-cream-dark/60"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-dark transition-colors group-hover:text-primary">
                      {cat.name}
                    </div>
                    <div className="truncate text-[11px] text-muted">
                      {stripHtml(cat.description || "") || cat.badge || "Shop this collection"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 border-t border-border pt-2 text-center">
            <Link
              href={ROUTES.SHOP}
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
