"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { AdminCard, AdminPageHeader, AdminStatusPill } from "@/components/features/admin/AdminUi";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_REVIEWS_COPY } from "@/constants/admin";
import { ADMIN_LIST } from "@/constants/admin-list";
import { API_ENDPOINTS } from "@/constants/api";
import { useAdminList } from "@/hooks/useAdminList";
import { truncate } from "@/lib/utils/format";
import type { Review } from "@/types/review";

export function AdminReviewsClient({ reviews }: { reviews: Review[] }) {
  const [items, setItems] = useState(reviews);
  const list = useAdminList(
    items,
    (review) => `${review.authorName} ${review.body} ${review.rating}`,
    [
      {
        id: "status",
        label: ADMIN_LIST.reviewStatus,
        allLabel: ADMIN_LIST.all,
        options: [
          { value: "approved", label: ADMIN_LIST.approved },
          { value: "pending", label: ADMIN_LIST.pending },
        ],
        match: (review, value) => (value === "approved" ? review.isApproved : !review.isApproved),
      },
    ],
  );

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
    setItems((current) => current.filter((review) => review._id !== id));
    toast.success(ADMIN_REVIEWS_COPY.deleted);
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
    setItems((current) =>
      current.map((review) => (review._id === id ? { ...review, isApproved } : review)),
    );
    toast.success(isApproved ? ADMIN_REVIEWS_COPY.approved : ADMIN_REVIEWS_COPY.hidden);
  }

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_REVIEWS_COPY.title}
        description={ADMIN_REVIEWS_COPY.description}
      />
      {items.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {ADMIN_REVIEWS_COPY.empty}
        </AdminCard>
      ) : (
        <>
        <AdminListControls list={list} />
        {list.noMatches ? (
          <AdminCard className="px-6 py-16 text-center text-sm text-muted">{ADMIN_LIST.empty}</AdminCard>
        ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-cream/70">
                <tr className="text-xs uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-4 font-semibold">{ADMIN_REVIEWS_COPY.tableReviewer}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_REVIEWS_COPY.tableRating}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_REVIEWS_COPY.tableReview}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_REVIEWS_COPY.tableStatus}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_REVIEWS_COPY.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {list.pageItems.map((review) => (
                  <tr key={review._id} className="border-b border-border/70 transition hover:bg-cream/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={review.authorName} />
                        <p className="font-medium text-dark">{review.authorName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-dark">
                      {review.rating}/{ADMIN_REVIEWS_COPY.ratingMax}
                    </td>
                    <td className="max-w-xs px-5 py-4 text-muted">{truncate(review.body, 80)}</td>
                    <td className="px-5 py-4">
                      <AdminStatusPill
                        active={review.isApproved}
                        label={review.isApproved ? ADMIN_REVIEWS_COPY.approved : ADMIN_REVIEWS_COPY.pending}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setApproved(review._id, true)}>
                          {ADMIN_REVIEWS_COPY.approve}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setApproved(review._id, false)}>
                          {ADMIN_REVIEWS_COPY.hide}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => removeReview(review._id)}>
                          {ADMIN_ACTIONS.delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
        )}
        <AdminListPagination list={list} />
        </>
      )}
    </div>
  );
}
