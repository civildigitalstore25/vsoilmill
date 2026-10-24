import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { ASSETS } from "@/constants/assets";
import { LAYOUT } from "@/constants/layout";
import { UI } from "@/constants/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description:
    "VS OilMill has been pressing pure oils with traditional Mara Chekku methods in Madurai, Tamil Nadu since 2020.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageContainer className="py-12">
      <div className={LAYOUT.narrow}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-sm border border-border">
            <Image
              src={ASSETS.LOGO}
              alt="VS OilMill Logo"
              width={96}
              height={96}
              unoptimized
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-display text-4xl text-dark">About VS OilMill</h1>
            <p className="mt-2 text-base text-muted">{UI.since}</p>
          </div>
        </div>
        <div className="mt-8 space-y-4 leading-relaxed text-dark/80">
        <p>
          Our wooden Chekku mill has been pressing oils since 2020. Every drop
          carries the wisdom of generations and the purity of nature.
        </p>
        <p>
          Unlike commercial oils extracted with chemical solvents and refined at
          high temperatures, our traditional Mara Chekku method preserves natural
          nutrients, antioxidants, and aroma.
        </p>
        <p>
          From seed selection to unfiltered bottling, we deliver pure oils and
          Uthukuli A2 ghee directly from our mill in Madurai to families across
          India.
        </p>
      </div>
      </div>
    </PageContainer>
  );
}
