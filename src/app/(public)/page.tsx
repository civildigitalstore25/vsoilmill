import { CategoryStrip } from "@/components/features/home/CategoryStrip";
import { HomeHero } from "@/components/features/home/HomeHero";
import { HomeProductShowcase } from "@/components/features/home/HomeProductShowcase";
import { ProcessSection } from "@/components/features/home/ProcessSection";
import { PromoBanner } from "@/components/features/home/PromoBanner";
import { TestimonialsSection } from "@/components/features/home/TestimonialsSection";
import { WhyUsSection } from "@/components/features/home/WhyUsSection";
import { getCategories, getProducts } from "@/lib/products/queries";
import type { Category, Product } from "@/types/product";

export default async function HomePage() {
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);
  } catch {
    categories = [];
    products = [];
  }

  return (
    <>
      <HomeHero />
      <CategoryStrip categories={categories} />
      <HomeProductShowcase products={products} categories={categories} />
      <ProcessSection />
      <TestimonialsSection />
      <WhyUsSection />
      <PromoBanner />
    </>
  );
}
