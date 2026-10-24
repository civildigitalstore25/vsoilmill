import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComboDetailClient } from "@/components/features/catalog/ComboDetailClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { getComboBySlug } from "@/lib/catalog/get-combo";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { stripHtml } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getComboBySlug(slug);
  if (!detail) return {};
  return buildPageMetadata({
    title: stripHtml(detail.combo.name),
    description: stripHtml(detail.combo.description ?? "") || stripHtml(detail.combo.name),
    path: `/combos/${slug}`,
  });
}

export default async function ComboDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getComboBySlug(slug);
  if (!detail) notFound();
  return (
    <PageContainer className="py-12">
      <ComboDetailClient
        combo={detail.combo}
        lines={detail.lines}
        separateTotal={detail.separateTotal}
      />
    </PageContainer>
  );
}
