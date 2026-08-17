export const LAYOUT = {
  container: "page-container",
  narrow: "mx-auto w-full max-w-3xl",
  sectionY: "py-12 md:py-16",
  heroMin: "min-h-[72vh] md:min-h-[78vh]",
  heroImage: "object-cover object-[70%_center]",
  heroOverlay: "bg-gradient-to-r from-cream/90 via-cream/45 to-cream/10",
  productGrid:
    "grid w-full grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  categoryGrid:
    "grid w-full grid-cols-2 items-stretch gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-5",
  productTitle: "line-clamp-2 min-h-10 leading-snug sm:min-h-12",
  productDesc: "line-clamp-1 min-h-4",
  productVariants: "min-h-7",
  productPrice: "min-h-6",
  categoryTitle: "line-clamp-2 min-h-12",
  categoryDesc: "line-clamp-2 min-h-8",
} as const;
