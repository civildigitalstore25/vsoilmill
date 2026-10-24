import { ProductCard } from "@/components/shared/ProductCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { CATALOG_COPY } from "@/constants/catalog";
import { LAYOUT } from "@/constants/layout";
import { getLiveOffers } from "@/lib/catalog/highlights";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const products = await getLiveOffers();
  return (
    <PageContainer className="py-12">
      <h1 className="font-display text-4xl text-dark">{CATALOG_COPY.offersTitle}</h1>
      {products.length ? (
        <div className={`mt-8 ${LAYOUT.productGrid}`}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-muted">{CATALOG_COPY.offersEmpty}</p>
      )}
    </PageContainer>
  );
}
