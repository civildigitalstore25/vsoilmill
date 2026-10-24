import { ComboCard } from "@/components/features/catalog/ComboCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { CATALOG_COPY } from "@/constants/catalog";
import { LAYOUT } from "@/constants/layout";
import { getLiveCombos } from "@/lib/catalog/highlights";

export const dynamic = "force-dynamic";

export default async function CombosPage() {
  const combos = await getLiveCombos();
  return (
    <PageContainer className="py-12">
      <h1 className="font-display text-4xl text-dark">{CATALOG_COPY.combosTitle}</h1>
      {combos.length ? (
        <div className={`mt-8 ${LAYOUT.productGrid}`}>
          {combos.map((combo) => (
            <ComboCard key={combo._id} combo={combo} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-muted">{CATALOG_COPY.combosEmpty}</p>
      )}
    </PageContainer>
  );
}
