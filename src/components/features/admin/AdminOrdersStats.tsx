"use client";

import { IndianRupee, ShoppingBag, Wallet } from "lucide-react";
import { useMemo } from "react";
import { AdminStatCard } from "@/components/features/admin/AdminUi";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import { formatInr } from "@/lib/utils/format";
import { PaymentStatus, type Order } from "@/types/order";

export function AdminOrdersStats({ orders }: { orders: Order[] }) {
  const stats = useMemo(() => {
    const paid = orders.filter(
      (order) => order.paymentStatus === PaymentStatus.PAID,
    );
    const revenue = paid.reduce(
      (sum, order) => sum + (order.pricing?.total ?? 0),
      0,
    );
    const avg = paid.length > 0 ? revenue / paid.length : 0;
    return {
      total: orders.length,
      paid: paid.length,
      revenue,
      avg,
    };
  }, [orders]);

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label={ADMIN_ORDERS_COPY.statsTotal}
        value={String(stats.total)}
        hint={ADMIN_ORDERS_COPY.statsTotalHint}
        tone="primary"
        icon={<ShoppingBag className="h-5 w-5" />}
      />
      <AdminStatCard
        label={ADMIN_ORDERS_COPY.statsPaid}
        value={String(stats.paid)}
        hint={ADMIN_ORDERS_COPY.statsPaidHint}
        tone="accent"
        icon={<Wallet className="h-5 w-5" />}
      />
      <AdminStatCard
        label={ADMIN_ORDERS_COPY.statsRevenue}
        value={formatInr(stats.revenue)}
        hint={ADMIN_ORDERS_COPY.statsRevenueHint}
        tone="dark"
        icon={<IndianRupee className="h-5 w-5" />}
      />
      <AdminStatCard
        label={ADMIN_ORDERS_COPY.statsAvg}
        value={formatInr(stats.avg)}
        hint={ADMIN_ORDERS_COPY.statsAvgHint}
        tone="muted"
        icon={<IndianRupee className="h-5 w-5" />}
      />
    </div>
  );
}
