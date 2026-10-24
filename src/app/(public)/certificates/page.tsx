import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CertificatesPageClient } from "@/components/features/certificates/CertificatesPageClient";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/constants/routes";
import { SITE_NAME } from "@/constants/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Certificates & Quality Standards",
  description:
    "Explore applicable food safety licenses, business registrations, product testing reports, and quality documentation for our edible oils.",
  path: "/certificates",
  keywords: [
    "VS OilMill certificates",
    "edible oil food safety",
    "cold pressed oil lab test",
    "Mara Chekku oil quality standards",
    "FSSAI license edible oil Madurai",
    "COA certificate of analysis edible oil",
    "pure wood pressed oil Tamil Nadu",
  ],
});

export default function CertificatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Certificates & Quality Standards",
        item: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${ROUTES.CERTIFICATES}`,
      },
    ],
  };

  return (
    <div className="py-8 sm:py-12 md:py-16">
      {/* Breadcrumb JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageContainer>
        {/* Accessible Breadcrumbs Navigation */}
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
            Certificates & Quality Standards
          </span>
        </nav>

        {/* Main Certificates Client Experience */}
        <CertificatesPageClient />
      </PageContainer>
    </div>
  );
}
