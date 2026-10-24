"use client";

import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { ProductReviews } from "@/components/features/reviews/ProductReviews";
import { API_ENDPOINTS } from "@/constants/api";
import { CATALOG_COPY } from "@/constants/catalog";
import type { Review } from "@/types/review";

const triggerClass =
  "inline-flex h-8 items-center justify-center gap-1 rounded-full px-4 text-xs font-medium text-muted transition-all data-[state=active]:bg-accent data-[state=active]:font-semibold data-[state=active]:text-dark data-[state=active]:shadow-sm sm:px-5 sm:text-sm";

export function ProductDetailTabs({
  description,
  productId,
}: {
  description: string;
  productId?: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!productId) return;
    fetch(`${API_ENDPOINTS.REVIEWS}?productId=${productId}`)
      .then((response) => response.json())
      .then((json) => setReviews(json.data ?? []))
      .catch(() => setReviews([]));
  }, [productId]);

  return (
    <Tabs.Root defaultValue="description" className="mt-8 lg:mt-12">
      <Tabs.List className="inline-flex h-10 w-fit gap-1 rounded-full border border-border bg-cream p-1">
        <Tabs.Trigger value="description" className={triggerClass}>
          {CATALOG_COPY.detailDescription}
        </Tabs.Trigger>
        {productId ? (
          <Tabs.Trigger value="reviews" className={triggerClass}>
            {CATALOG_COPY.detailReviews}
            {reviews.length > 0 ? (
              <span className="ml-1 hidden rounded-full bg-dark/10 px-1.5 py-0.5 text-[10px] font-bold leading-none text-dark sm:inline">
                {reviews.length}
              </span>
            ) : null}
          </Tabs.Trigger>
        ) : null}
      </Tabs.List>

      <Tabs.Content value="description" className="mt-4 focus-visible:outline-none lg:mt-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:p-6">
          <div
            className="prose prose-sm max-w-none text-xs text-muted sm:text-sm prose-headings:font-semibold prose-headings:text-dark prose-p:my-1 prose-p:leading-relaxed prose-strong:text-dark prose-img:my-3 prose-img:h-auto prose-img:w-full prose-img:rounded-xl [&_iframe]:my-3 [&_iframe]:h-[185px] [&_iframe]:w-full [&_iframe]:max-w-lg [&_iframe]:rounded-xl sm:[&_iframe]:h-[260px]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </Tabs.Content>

      {productId ? (
        <Tabs.Content value="reviews" className="mt-4 focus-visible:outline-none lg:mt-5">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:p-6">
            <ProductReviews productId={productId} reviews={reviews} />
          </div>
        </Tabs.Content>
      ) : null}
    </Tabs.Root>
  );
}
