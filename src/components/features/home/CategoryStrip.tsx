import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  ScaleOnHover,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { ROUTES } from "@/constants/routes";
import type { Category } from "@/types/product";

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "15-kg-tins": "/images/categories/15kg-tins.svg",
  "5-litre-cans": "/images/categories/5l-cans.svg",
  "1-litre-bottles": "/images/categories/1l-bottles.svg",
  "uthukuli-ghee": "/images/categories/uthukuli-ghee.svg",
  "herbal-oils": "/images/categories/herbal-oils.svg",
};

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Shop by Category
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-dark md:text-4xl">
          Everything Pure, Nothing Else
        </h2>
      </FadeIn>
      <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5" delay={0.1}>
        {categories.map((category) => {
          const imageUrl =
            category.image ||
            DEFAULT_CATEGORY_IMAGES[category.slug] ||
            "/images/product-placeholder.svg";

          return (
            <StaggerItem key={category._id}>
              <ScaleOnHover>
                <Link
                  href={ROUTES.CATEGORY(category.slug)}
                  className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Category Image Header */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-100/20 to-amber-500/5 p-4">
                    {category.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-amber-600/90 text-white backdrop-blur-md font-medium text-[11px] px-2.5 py-0.5 shadow-sm">
                          {category.badge}
                        </Badge>
                      </div>
                    )}
                    <div className="relative h-full w-full transform transition-transform duration-500 group-hover:scale-105">
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      />
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="flex flex-1 flex-col justify-between p-4 bg-card">
                    <div>
                      <h3 className="font-display text-base font-bold text-dark transition-colors group-hover:text-primary">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex items-center text-xs font-semibold text-primary opacity-90 transition-all group-hover:translate-x-1">
                      <span>Explore Collection</span>
                      <svg
                        className="ml-1 h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </ScaleOnHover>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
