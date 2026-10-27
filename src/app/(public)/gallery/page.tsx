import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Film } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { GalleryClient } from "@/components/features/gallery/GalleryClient";
import { ROUTES } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProducts } from "@/lib/products/queries";
import { getLiveCombos } from "@/lib/catalog/highlights";
import { getActiveCarousels } from "@/lib/carousels/queries";
import { buildDynamicGalleryImages } from "@/lib/gallery/build-gallery";
import { GALLERY_VIDEOS } from "@/constants/gallery";
import type { Product } from "@/types/product";
import type { ComboOffer } from "@/types/combo";
import type { CarouselSlide } from "@/types/carousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = buildPageMetadata({
  title: "Visual Gallery — Live Mill Videos, Oil Extraction & Packaging",
  description:
    "Explore VS OilMill's live Mara Chekku machine running, authentic groundnut and coconut cold press extraction, customer order packaging dispatches, and product showcases in Madurai, Tamil Nadu.",
  path: "/gallery",
  keywords: [
    "VS OilMill gallery",
    "wooden pressed oil machine running video",
    "Mara Chekku oil extraction video",
    "cold pressed groundnut oil extraction",
    "pure coconut oil machine pressing",
    "customer packaging dispatch video",
    "pure cold pressed oil photos",
    "Uthukuli cow ghee images",
    "traditional oil mill Madurai Tamil Nadu",
    "VS OilMill banners and offers",
  ],
});

export default async function GalleryPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let products: Product[] = [];
  let combos: ComboOffer[] = [];
  let carousels: CarouselSlide[] = [];

  try {
    [products, combos, carousels] = await Promise.all([
      getProducts({ activeOnly: true }),
      getLiveCombos(),
      getActiveCarousels(),
    ]);
  } catch {
    products = [];
    combos = [];
    carousels = [];
  }

  // Build gallery items only from available products (active with stock) and live combos
  const galleryImages = buildDynamicGalleryImages(products, combos, carousels);

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
            name: "Visual Gallery",
            item: `${siteUrl}${ROUTES.GALLERY}`,
          },
        ],
      },
      {
        "@type": "ImageGallery",
        name: "VS OilMill Visual Gallery",
        description:
          "Live Mara Chekku oil extraction videos, customer packaging & dispatch footage, and pure cold-pressed oils.",
        url: `${siteUrl}${ROUTES.GALLERY}`,
      },
      ...GALLERY_VIDEOS.map((v) => ({
        "@type": "VideoObject",
        name: v.title,
        description: v.description,
        thumbnailUrl: v.youtubeId
          ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`
          : `${siteUrl}/images/logo.png`,
        uploadDate: v.date ? "2026-10-26T00:00:00+05:30" : "2026-10-15T00:00:00+05:30",
        contentUrl: v.videoUrl,
        embedUrl: v.youtubeId
          ? `https://www.youtube.com/embed/${v.youtubeId}`
          : v.videoUrl,
      })),
    ],
  };

  return (
    <div className="py-8 sm:py-12 md:py-16">
      {/* Schema.org Structured Data */}
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
            Visual Gallery
          </span>
        </nav>

        {/* Hero Section */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Film className="h-3.5 w-3.5" />
            <span>Live Extraction Videos, Customer Packaging & Product Gallery</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-dark leading-tight">
            VS OilMill Visual Gallery
          </h1>

          <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed">
            Take a visual tour inside our traditional Mara Chekku oil mill in Madurai. Watch live footage of our oil machines running and pure oil extraction, view our safe customer packaging dispatch logs, and browse our cold-pressed oils and pure Uthukuli cow ghee.
          </p>
        </div>

        {/* Gallery Client Component with Dynamic Available Items */}
        <GalleryClient initialImages={galleryImages} />
      </PageContainer>
    </div>
  );
}
