"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_REVIEWS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import type { Review } from "@/types/review";

export function AdminReviewsClient({ reviews }: { reviews: Review[] }) {
  const router = useRouter();

  async function removeReview(id: string) {
    if (!confirm(ADMIN_ACTIONS.confirmDelete)) return;
    const res = await fetch(API_ENDPOINTS.ADMIN_REVIEWS, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      toast.error(ADMIN_ACTIONS.deleteFailed);
      return;
    }
    toast.success(ADMIN_REVIEWS_COPY.deleted);
    router.refresh();
  }

  async function setApproved(id: string, isApproved: boolean) {
    const res = await fetch(API_ENDPOINTS.ADMIN_REVIEWS, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved }),
    });
    if (!res.ok) {
      toast.error(ADMIN_ACTIONS.updateFailed);
      return;
    }
    toast.success(isApproved ? ADMIN_REVIEWS_COPY.approve : ADMIN_REVIEWS_COPY.hide);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_REVIEWS_COPY.title}
        description={ADMIN_REVIEWS_COPY.description}
      />
      {reviews.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {ADMIN_REVIEWS_COPY.empty}
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <AdminCard key={review._id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-dark">{review.authorName}</p>
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                      {review.rating}/5
                    </span>
                    <span className="text-xs text-muted">
                      {review.isApproved
                        ? ADMIN_REVIEWS_COPY.approved
                        : ADMIN_REVIEWS_COPY.pending}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    {review.body}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setApproved(review._id, true)}>
                    {ADMIN_REVIEWS_COPY.approve}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setApproved(review._id, false)}
                  >
                    {ADMIN_REVIEWS_COPY.hide}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeReview(review._id)}
                  >
                    {ADMIN_ACTIONS.delete}
                  </Button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
