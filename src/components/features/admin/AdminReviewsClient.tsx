"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
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
    <div>
      <AdminPageHeader
        title="Reviews"
        description="Approve customer feedback before it appears on product pages."
      />
      {reviews.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          No reviews yet.
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
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    {review.body}
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
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
