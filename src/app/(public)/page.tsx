import { CategoryStrip } from "@/components/features/home/CategoryStrip";
import { HomeHeroCarousel } from "@/components/features/home/HomeHeroCarousel";
import { HomeProductShowcase } from "@/components/features/home/HomeProductShowcase";
import { ProcessSection } from "@/components/features/home/ProcessSection";
import { PromoBanner } from "@/components/features/home/PromoBanner";
import { TestimonialsSection } from "@/components/features/home/TestimonialsSection";
import { WhyUsSection } from "@/components/features/home/WhyUsSection";
import { getCategories, getProducts } from "@/lib/products/queries";
import { getActiveCarousels } from "@/lib/carousels/queries";
import type { Category, Product } from "@/types/product";
import type { CarouselSlide } from "@/types/carousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let categories: Category[] = [];
  let products: Product[] = [];
  let carousels: CarouselSlide[] = [];

  try {
    [categories, products, carousels] = await Promise.all([
      getCategories(),
      getProducts(),
      getActiveCarousels(),
    ]);
  } catch {
    categories = [];
    products = [];
    carousels = [];
  }

  return (
    <>
      <HomeHeroCarousel slides={carousels} />
      <CategoryStrip categories={categories} />
      <HomeProductShowcase products={products} categories={categories} />
      <ProcessSection />
      <TestimonialsSection />
      <WhyUsSection />
      <PromoBanner />
    </>
  );
}
