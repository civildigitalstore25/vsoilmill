"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/constants/api";
import type { Review } from "@/types/review";

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");

  useEffect(() => {
    fetch(`${API_ENDPOINTS.REVIEWS}?productId=${productId}`)
      .then((r) => r.json())
      .then((json) => setReviews(json.data ?? []))
      .catch(() => setReviews([]));
  }, [productId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(API_ENDPOINTS.REVIEWS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, authorName, rating, body }),
    });
    if (!res.ok) {
      toast.error("Could not submit review");
      return;
    }
    toast.success("Review submitted for approval");
    setAuthorName("");
    setBody("");
    setRating(5);
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="font-display text-2xl text-dark">Reviews</h2>
      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="font-medium">
                {review.authorName} · {review.rating}/5
              </p>
              <p className="mt-1 text-sm text-muted">{review.body}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="mt-8 max-w-lg space-y-3">
        <h3 className="font-display text-xl">Write a review</h3>
        <div>
          <Label htmlFor="authorName">Name</Label>
          <Input
            id="authorName"
            className="mt-1.5"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min={1}
            max={5}
            className="mt-1.5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="body">Review</Label>
          <Textarea
            id="body"
            className="mt-1.5"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Submit review</Button>
      </form>
    </section>
  );
}
