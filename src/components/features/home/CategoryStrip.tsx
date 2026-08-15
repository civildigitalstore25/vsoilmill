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
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Shop by Category
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-dark md:text-4xl">
          Everything Pure, Nothing Else
        </h2>
      </FadeIn>
      <Stagger
        className="mt-8 grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        delay={0.1}
      >
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
              <ScaleOnHover>
                <Link
                  href={ROUTES.CATEGORY(category.slug)}
                  className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Category Image Header - Full Screen Width & Balanced Height */}
                  <div className="relative aspect-[4/3] sm:aspect-square md:aspect-[4/3] h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-cream-dark/20">
                    {category.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-amber-600/95 text-white backdrop-blur-md font-semibold text-xs px-3 py-1 shadow-md">
                          {category.badge}
                        </Badge>
                      </div>
                    )}
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-108 w-full"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Category Details */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 bg-card">
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-dark transition-colors group-hover:text-primary">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-primary transition-all group-hover:translate-x-1">
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
    </section>
  );
}
