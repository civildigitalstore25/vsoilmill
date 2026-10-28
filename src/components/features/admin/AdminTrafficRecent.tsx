import Link from "next/link";
import { AdminCard } from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_TRAFFIC_COPY } from "@/constants/admin-traffic";
import { ROUTES } from "@/constants/routes";
import { formatInr, formatInrDateTime } from "@/lib/utils/format";
import type { TrafficOrderRow, TrafficVisitRow } from "@/types/attribution";

export function AdminTrafficRecent({
  visits,
  orders,
}: {
  visits: TrafficVisitRow[];
  orders: TrafficOrderRow[];
}) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <AdminCard className="overflow-hidden p-6">
        <h2 className="font-display text-xl text-dark">{ADMIN_TRAFFIC_COPY.recentVisitsTitle}</h2>
        <p className="text-sm text-muted">{ADMIN_TRAFFIC_COPY.recentVisitsHint}</p>
        {visits.length === 0 ? (
          <p className="mt-5 rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
            {ADMIN_TRAFFIC_COPY.empty}
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {visits.map((visit) => (
              <li key={visit.id} className="rounded-xl bg-cream/50 px-4 py-3 text-sm">
                <p className="font-medium text-dark">
                  {visit.sourceLabel}
                  <span className="ml-2 font-normal text-muted">
                    {visit.medium} · {visit.campaign} · {visit.content}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  {visit.landingPath} · {formatInrDateTime(visit.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <AdminCard className="overflow-hidden p-6">
        <h2 className="font-display text-xl text-dark">{ADMIN_TRAFFIC_COPY.recentOrdersTitle}</h2>
        <p className="text-sm text-muted">{ADMIN_TRAFFIC_COPY.recentOrdersHint}</p>
        {orders.length === 0 ? (
          <p className="mt-5 rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
            {ADMIN_TRAFFIC_COPY.empty}
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-cream/50 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-dark">{order.customer}</p>
                  <p className="mt-1 text-xs text-muted">
                    {order.attributionLine} · {order.paymentStatus} ·{" "}
                    {formatInrDateTime(order.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-semibold text-dark">{formatInr(order.total)}</span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={ROUTES.ADMIN.ORDER_DETAIL(order.id)}>
                      {ADMIN_TRAFFIC_COPY.viewOrder}
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
