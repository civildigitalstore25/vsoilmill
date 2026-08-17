import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  ScaleOnHover,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { LAYOUT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/product";

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "wood-pressed-oils":
    "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
  "pure-cow-ghee":
    "https://ik.imagekit.io/mnm0iz0ng2/category/pure_ghee.png",
  "traditional-oils":
    "https://ik.imagekit.io/mnm0iz0ng2/category/traditional.jpg",
  "oil-cakes":
    "https://ik.imagekit.io/mnm0iz0ng2/category/cake.jpeg",
  "combo-offers":
    "https://ik.imagekit.io/mnm0iz0ng2/category/combo.jpg",
  "home-cleaning":
    "https://ik.imagekit.io/mnm0iz0ng2/category/clean_tool.png",
};

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className={LAYOUT.sectionY}>
      <PageContainer>
        <FadeIn>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Shop by Category
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-dark md:text-4xl">
            Everything Pure, Nothing Else
          </h2>
        </FadeIn>
        <Stagger className={cn("mt-8", LAYOUT.categoryGrid)} delay={0.1}>
          {categories.map((category) => {
            const isSvgImage = category.image?.endsWith(".svg");
            const isUnsplash = category.image?.includes("unsplash.com");
            const imageUrl =
              DEFAULT_CATEGORY_IMAGES[category.slug] ||
              (category.image && !isSvgImage && !isUnsplash
                ? category.image
                : DEFAULT_CATEGORY_IMAGES["wood-pressed-oils"]);

            return (
              <StaggerItem key={category._id}>
                <ScaleOnHover className="h-full w-full">
                  <Link
                    href={ROUTES.CATEGORY(category.slug)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-cream-dark">
                      {category.badge && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-amber-600/95 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md">
                            {category.badge}
                          </Badge>
                        </div>
                      )}
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      />
                    </div>

                    <div className="flex flex-1 flex-col bg-card p-4 sm:p-5">
                      <h3
                        className={cn(
                          LAYOUT.categoryTitle,
                          "font-display text-base font-bold text-dark transition-colors group-hover:text-primary sm:text-lg",
                        )}
                      >
                        {category.name}
                      </h3>
                      <p
                        className={cn(
                          LAYOUT.categoryDesc,
                          "mt-1 text-xs leading-relaxed text-muted",
                        )}
                      >
                        {category.description || "\u00a0"}
                      </p>
                      <div className="mt-auto flex items-center pt-4 text-xs font-bold text-primary transition-all group-hover:translate-x-1">
                        <span>Explore Collection</span>
                        <svg
                          className="ml-1.5 h-4 w-4"
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
      </PageContainer>
    </section>
  );
}
