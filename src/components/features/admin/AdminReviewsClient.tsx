"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
import type { Review } from "@/types/review";

export function AdminReviewsClient({ reviews }: { reviews: Review[] }) {
  const router = useRouter();

  async function setApproved(id: string, isApproved: boolean) {
    const res = await fetch(API_ENDPOINTS.ADMIN_REVIEWS, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success(isApproved ? "Approved" : "Hidden");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {review.authorName} · {review.rating}/5
              </p>
              <p className="mt-1 text-sm text-muted">{review.body}</p>
              <p className="mt-2 text-xs text-muted">
                {review.isApproved ? "Approved" : "Pending"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setApproved(review._id, true)}>
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setApproved(review._id, false)}
              >
                Hide
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
