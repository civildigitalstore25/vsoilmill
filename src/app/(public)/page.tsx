import { CombosSection, OffersSection } from "@/components/features/home/CatalogHighlightSection";
import { CategoryStrip } from "@/components/features/home/CategoryStrip";
import { HomeHeroCarousel } from "@/components/features/home/HomeHeroCarousel";
import { HomeProductShowcase } from "@/components/features/home/HomeProductShowcase";
import { ProcessSection } from "@/components/features/home/ProcessSection";
import { PromoBanner } from "@/components/features/home/PromoBanner";
import { TestimonialsSection } from "@/components/features/home/TestimonialsSection";
import { WhyUsSection } from "@/components/features/home/WhyUsSection";
import { getLiveCombos, getLiveOffers } from "@/lib/catalog/highlights";
import { getCategories, getProducts } from "@/lib/products/queries";
import { getActiveCarousels } from "@/lib/carousels/queries";
import type { ComboOffer } from "@/types/combo";
import type { Category, Product } from "@/types/product";
import type { CarouselSlide } from "@/types/carousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let categories: Category[] = [];
  let products: Product[] = [];
  let carousels: CarouselSlide[] = [];
  let offers: Product[] = [];
  let combos: ComboOffer[] = [];

  try {
    [categories, products, carousels, offers, combos] = await Promise.all([
      getCategories(),
      getProducts(),
      getActiveCarousels(),
      getLiveOffers(),
      getLiveCombos(),
    ]);
  } catch {
    categories = [];
    products = [];
    carousels = [];
    offers = [];
    combos = [];
  }

  return (
    <>
      <HomeHeroCarousel slides={carousels} />
      <CombosSection combos={combos} />
      <CategoryStrip categories={categories} />
      <HomeProductShowcase products={products} categories={categories} />
      <OffersSection products={offers} />
      <ProcessSection />
      <TestimonialsSection />
      <WhyUsSection />
      <PromoBanner />
    </>
  );
}
