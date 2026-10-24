"use client";

import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/constants/api";
import { CATALOG_COPY } from "@/constants/catalog";
import { cn } from "@/lib/utils/cn";
import type { Review } from "@/types/review";

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (next: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className="disabled:cursor-default"
          aria-label={`${star}`}
        >
          <Star
            className={cn(
              "h-5 w-5",
              star <= value ? "fill-accent text-accent" : "text-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (rating < 1) return;
    const reviewBody = body.trim();
    if (reviewBody.length < 2) {
      toast.error(CATALOG_COPY.reviewTooShort);
      return;
    }
    const res = await fetch(API_ENDPOINTS.REVIEWS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, authorName: authorName.trim(), rating, body: reviewBody }),
    });
    if (!res.ok) {
      toast.error(CATALOG_COPY.reviewFailed);
      return;
    }
    toast.success(CATALOG_COPY.reviewThanks);
    setAuthorName("");
    setBody("");
    setRating(0);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-cream/50 px-4 py-4 sm:px-5">
        <div>
          <p className="font-display text-3xl leading-none text-dark">
            {reviews.length ? average.toFixed(1) : "0.0"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {CATALOG_COPY.reviewFrom} {reviews.length} {CATALOG_COPY.detailReviews}
          </p>
        </div>
        <Stars value={Math.round(average)} />
        <h2 className="font-display text-xl text-dark sm:ml-auto">{CATALOG_COPY.reviewTitle}</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-cream/30 px-4 py-10 text-center">
              <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted" />
              <p className="text-sm text-muted">{CATALOG_COPY.reviewEmpty}</p>
            </div>
          ) : (
            reviews.map((review) => <ReviewCard key={review._id} review={review} />)
          )}
        </div>
        <form
          onSubmit={submit}
          className="h-fit space-y-4 rounded-2xl border border-border bg-cream/40 p-4 lg:sticky lg:top-24 lg:p-5"
        >
          <h3 className="font-display text-lg text-dark">{CATALOG_COPY.reviewWrite}</h3>
          <div>
            <Label htmlFor="authorName">{CATALOG_COPY.reviewName}</Label>
            <Input id="authorName" className="mt-1.5 bg-card" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
          </div>
          <div>
            <Label>{CATALOG_COPY.reviewRating}</Label>
            <div className="mt-1.5">
              <Stars value={rating} onChange={setRating} />
            </div>
          </div>
          <div>
            <Label htmlFor="body">{CATALOG_COPY.reviewBody}</Label>
            <Textarea id="body" className="mt-1.5 bg-card" value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
          <Button type="submit" disabled={rating < 1} className="w-full">
            {CATALOG_COPY.reviewSubmit}
          </Button>
        </form>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const posted = new Date(review.createdAt);
  const dateLabel = Number.isNaN(posted.getTime())
    ? ""
    : posted.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {review.authorName.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-dark">{review.authorName}</p>
            {dateLabel ? <span className="text-xs text-muted">{dateLabel}</span> : null}
            {review.isVerified ? <Badge>{CATALOG_COPY.reviewVerified}</Badge> : null}
          </div>
          <div className="mt-1.5">
            <Stars value={review.rating} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-dark">{review.body}</p>
        </div>
      </div>
    </article>
  );
}
