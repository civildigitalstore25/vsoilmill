import { BestSellersSection } from "@/components/features/home/BestSellersSection";
import { CategoryStrip } from "@/components/features/home/CategoryStrip";
import { HomeHero } from "@/components/features/home/HomeHero";
import { ProcessSection } from "@/components/features/home/ProcessSection";
import { PromoBanner } from "@/components/features/home/PromoBanner";
import { TestimonialsSection } from "@/components/features/home/TestimonialsSection";
import { TrustStrip } from "@/components/features/home/TrustStrip";
import { WhyUsSection } from "@/components/features/home/WhyUsSection";
import { getCategories, getProducts } from "@/lib/products/queries";
import type { Category, Product } from "@/types/product";

export default async function HomePage() {
  let categories: Category[] = [];
  let bestsellers: Product[] = [];

  try {
    [categories, bestsellers] = await Promise.all([
      getCategories(),
      getProducts({ bestSeller: true }),
    ]);
  } catch {
    categories = [];
    bestsellers = [];
  }

  return (
    <>
      <HomeHero />
      <TrustStrip />
      <CategoryStrip categories={categories} />
      <BestSellersSection products={bestsellers.slice(0, 8)} />
      <ProcessSection />
      <TestimonialsSection />
      <WhyUsSection />
      <PromoBanner />
    </>
  );
}
