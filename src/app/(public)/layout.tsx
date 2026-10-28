import { Suspense } from "react";
import { AttributionCapture } from "@/components/features/attribution/AttributionCapture";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { getCategories } from "@/lib/products/queries";
import type { Category } from "@/types/product";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <>
      <Suspense fallback={null}>
        <AttributionCapture />
      </Suspense>
      <Header categories={categories} />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}
