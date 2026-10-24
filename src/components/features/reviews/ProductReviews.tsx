"use client";

import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
              "h-4 w-4",
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
    const res = await fetch(API_ENDPOINTS.REVIEWS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, authorName, rating, body }),
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
    <section className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-dark lg:text-2xl">
          {CATALOG_COPY.reviewTitle}
        </h2>
        {reviews.length > 0 ? (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="font-bold text-dark">{average.toFixed(1)}</span>
            <span className="text-sm text-muted">
              {CATALOG_COPY.reviewFrom} {reviews.length} {CATALOG_COPY.detailReviews}
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted">{CATALOG_COPY.reviewEmpty}</p>
        )}
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-2 lg:col-span-2">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-cream/30 px-4 py-8 text-center">
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted/50" />
              <p className="text-sm text-muted">{CATALOG_COPY.reviewEmpty}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reviews.map((review) => (
                <article key={review._id} className="py-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-dark">
                      {review.authorName.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-dark">{review.authorName}</p>
                      <div className="mt-1">
                        <Stars value={review.rating} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{review.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <form
          onSubmit={submit}
          className="h-fit space-y-4 rounded-2xl border border-border/60 bg-cream/40 p-4 lg:sticky lg:top-24 lg:p-6"
        >
          <h3 className="font-display text-lg font-bold text-dark">{CATALOG_COPY.reviewWrite}</h3>
          <div>
            <Label htmlFor="authorName">{CATALOG_COPY.reviewName}</Label>
            <Input id="authorName" className="mt-1.5" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
          </div>
          <div>
            <Label>{CATALOG_COPY.reviewRating}</Label>
            <div className="mt-1.5">
              <Stars value={rating} onChange={setRating} />
            </div>
          </div>
          <div>
            <Label htmlFor="body">{CATALOG_COPY.reviewBody}</Label>
            <Textarea id="body" className="mt-1.5" value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
          <Button type="submit" disabled={rating < 1} className="w-full">
            {CATALOG_COPY.reviewSubmit}
          </Button>
        </form>
      </div>
    </section>
  );
}
