import type { Metadata } from "next";
import { SEO_DEFAULTS, SITE_NAME } from "@/constants/seo";
import { stripHtml, truncate } from "@/lib/utils/format";
import type { Product } from "@/types/product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function buildPageMetadata(input: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const description = input.description ?? SEO_DEFAULTS.description;
  const url = input.path ? `${siteUrl}${input.path}` : siteUrl;
  const image = input.image ?? `${siteUrl}/images/og-default.jpg`;

  return {
    title: input.title,
    description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SEO_DEFAULTS.locale,
      type: SEO_DEFAULTS.type,
      images: [{ url: image }],
    },
    twitter: {
      card: SEO_DEFAULTS.twitterCard,
      title: input.title,
      description,
      images: [image],
    },
  };
}

export function buildProductMetadata(product: Product): Metadata {
  const title =
    product.seo?.metaTitle ?? `${product.name} | ${SITE_NAME}`;
  const description =
    product.seo?.metaDescription ??
    truncate(
      product.shortDescription ?? stripHtml(product.description),
      160,
    );
  const image =
    product.seo?.ogImage ?? product.images[0] ?? `${siteUrl}/images/og-default.jpg`;
  const canonical =
    product.seo?.canonicalUrl ?? `${siteUrl}/products/${product.slug}`;

  return {
    title,
    description,
    keywords: product.seo?.metaKeywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildProductJsonLd(product: Product, categoryName?: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const variant = product.variants[0];
  const url = `${site}/products/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? stripHtml(product.description),
    image: product.images,
    sku: variant?.sku,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: variant
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: variant.price,
          availability:
            variant.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url,
        }
      : undefined,
    aggregateRating:
      product.reviewCount && product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site },
        ...(categoryName
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: categoryName,
                item: `${site}/shop`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: categoryName ? 3 : 2,
          name: product.name,
          item: url,
        },
      ],
    },
  };
}
