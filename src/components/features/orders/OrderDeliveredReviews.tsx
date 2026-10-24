"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/constants/api";
import { CATALOG_COPY } from "@/constants/catalog";
import { cn } from "@/lib/utils/cn";
import type { OrderReviewTarget } from "@/types/review";

function ReviewStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="disabled:cursor-default"
          aria-label={`${CATALOG_COPY.reviewRating} ${star}`}
        >
          <Star
            className={cn(
              "h-4 w-4",
              star <= value ? "fill-accent text-accent" : "text-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ItemReview({
  item,
  customerName,
  submitted,
  onSubmitted,
}: {
  item: OrderReviewTarget;
  customerName: string;
  submitted: boolean;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const reviewBody = body.trim();
    if (reviewBody.length < 2) {
      toast.error(CATALOG_COPY.reviewTooShort);
      return;
    }
    const res = await fetch(API_ENDPOINTS.REVIEWS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: item.productId,
        authorName: customerName.trim(),
        rating,
        body: reviewBody,
      }),
    });
    if (!res.ok) {
      toast.error(CATALOG_COPY.reviewFailed);
      return;
    }
    toast.success(CATALOG_COPY.reviewThanks);
    onSubmitted();
  }

  return (
    <div className="border-t border-border pt-4">
      <p className="font-semibold text-dark">{item.name}</p>
      {item.variantLabel ? (
        <p className="mt-0.5 text-xs text-muted">{item.variantLabel}</p>
      ) : null}
      {submitted ? (
        <p className="mt-2 text-sm text-primary">{CATALOG_COPY.reviewAlready}</p>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-3">
          <div>
            <Label>{CATALOG_COPY.reviewRating}</Label>
            <div className="mt-1.5">
              <ReviewStars value={rating} onChange={setRating} />
            </div>
          </div>
          <div>
            <Label htmlFor={`review-${item.productId}`}>{CATALOG_COPY.reviewBody}</Label>
            <Textarea
              id={`review-${item.productId}`}
              className="mt-1.5"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={rating < 1} size="sm">
            {CATALOG_COPY.reviewSubmit}
          </Button>
        </form>
      )}
    </div>
  );
}

export function OrderDeliveredReviews({
  customerName,
  items,
  reviewedIds,
}: {
  customerName: string;
  items: OrderReviewTarget[];
  reviewedIds: string[];
}) {
  const [done, setDone] = useState(reviewedIds);
  if (!items.length) return null;

  return (
    <section id={CATALOG_COPY.reviewAnchor} className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <h2 className="font-display text-xl text-dark">{CATALOG_COPY.reviewTitle}</h2>
      <p className="mt-1 text-sm text-muted">{CATALOG_COPY.reviewDeliveredHint}</p>
      {items.map((item) => (
        <ItemReview
          key={item.productId}
          item={item}
          customerName={customerName}
          submitted={done.includes(item.productId)}
          onSubmitted={() => setDone((current) => [...current, item.productId])}
        />
      ))}
    </section>
  );
}
