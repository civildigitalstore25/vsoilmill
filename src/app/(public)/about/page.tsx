import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { SocialLinks } from "@/components/common/SocialLinks";
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
        <h1 className="font-display text-4xl text-dark">About VS OilMill</h1>
        <p className="mt-4 text-lg text-muted">{UI.since}</p>
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

        <div className="mt-12 rounded-2xl border border-border bg-stone-50/80 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-dark sm:text-2xl">
            See Our Mill in Action
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
            Watch real video footage of our Mara Chekku wooden pressing, see our farm seed lots,
            and follow daily updates from founder Sarathkumar on YouTube, Instagram, and Facebook:
          </p>
          <div className="mt-5">
            <SocialLinks variant="pill" className="gap-2.5" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
