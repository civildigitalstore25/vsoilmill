import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Film } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { FaqsClient } from "@/components/features/faqs/FaqsClient";
import { FAQS } from "@/constants/faqs";
import { ROUTES } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQs & Video Explanations — Wooden Pressed Oils & Ghee",
  description:
    "Get clear video answers and detailed explanations about VS OilMill Mara Chekku oil extraction, affordable mill pricing, pure taste, shipping, and quality certifications.",
  path: "/faqs",
  keywords: [
    "VS OilMill FAQs",
    "wooden pressed oil questions",
    "why Mara Chekku oil is special",
    "cold pressed oil price explanation",
    "Mara Chekku oil taste",
    "Uthukuli cow ghee bilona FAQs",
    "edible oil shipping across India",
  ],
});

export default function FaqsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Schema.org FAQPage & Breadcrumb JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQs & Video Explanations",
            item: `${siteUrl}${ROUTES.FAQS}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="py-8 sm:py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageContainer>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex items-center gap-1.5 text-xs text-muted"
        >
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <span className="font-medium text-dark" aria-current="page">
            Frequently Asked Questions
          </span>
        </nav>

        {/* Header Section */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Film className="h-3.5 w-3.5" />
            <span>Answers with Video Explanations & Mill Tours</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-dark leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed">
            Everything you need to know about our traditional Mara Chekku cold-pressing, honest mill pricing, taste benefits, and pan-India express doorstep delivery.
          </p>
        </div>

        {/* Interactive FAQ Client */}
        <div className="max-w-4xl">
          <FaqsClient />
        </div>
      </PageContainer>
    </div>
  );
}
