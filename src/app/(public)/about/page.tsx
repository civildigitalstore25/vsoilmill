import type { Metadata } from "next";
import { UI } from "@/constants/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description:
    "VS OilMill has been pressing pure oils with traditional Mara Chekku methods in Sivagangai, Tamil Nadu since 1985.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">About VS OilMill</h1>
      <p className="mt-4 text-lg text-muted">{UI.since}</p>
      <div className="mt-8 space-y-4 leading-relaxed text-dark/80">
        <p>
          Our wooden Chekku mill has been pressing oils since 1985. Every drop
          carries the wisdom of generations and the purity of nature.
        </p>
        <p>
          Unlike commercial oils extracted with chemical solvents and refined at
          high temperatures, our traditional Mara Chekku method preserves natural
          nutrients, antioxidants, and aroma.
        </p>
        <p>
          From seed selection to unfiltered bottling, we deliver pure oils and
          Uthukuli A2 ghee directly from our mill in Sivagangai to families across
          India.
        </p>
      </div>
    </div>
  );
}
