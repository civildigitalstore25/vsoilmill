"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  Truck,
} from "lucide-react";
import { AdminManualOrdersTable } from "@/components/features/admin/manual-orders/AdminManualOrdersTable";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/features/admin/AdminUi";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";
import {
  ManualShipmentStatus,
  type ManualShipmentListRow,
} from "@/types/manual-shipment";

export function AdminManualOrdersList({
  rows,
}: {
  rows: ManualShipmentListRow[];
}) {
  const stats = useMemo(() => {
    const revenue = rows.reduce((sum, row) => sum + row.total, 0);
    const shipped = rows.filter(
      (row) =>
        row.status === ManualShipmentStatus.SHIPPED ||
        Boolean(row.trackingNumber),
    ).length;
    const delivered = rows.filter(
      (row) => row.status === ManualShipmentStatus.DELIVERED,
    ).length;
    return { total: rows.length, shipped, delivered, revenue };
  }, [rows]);

  return (
    <div>
      <AdminPageHeader
        title={MANUAL_SHIPMENT_COPY.title}
        description={MANUAL_SHIPMENT_COPY.description}
        actions={
          <AdminAddButton
            label={MANUAL_SHIPMENT_COPY.createCta}
            href={ROUTES.ADMIN.MANUAL_ORDER_NEW}
          />
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label={MANUAL_SHIPMENT_COPY.statsTotal}
          value={String(stats.total)}
          hint={MANUAL_SHIPMENT_COPY.statsTotalHint}
          tone="primary"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <AdminStatCard
          label={MANUAL_SHIPMENT_COPY.statsShipped}
          value={String(stats.shipped)}
          hint={MANUAL_SHIPMENT_COPY.statsShippedHint}
          tone="accent"
          icon={<Truck className="h-5 w-5" />}
        />
        <AdminStatCard
          label={MANUAL_SHIPMENT_COPY.statsDelivered}
          value={String(stats.delivered)}
          hint={MANUAL_SHIPMENT_COPY.statsDeliveredHint}
          tone="dark"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <AdminStatCard
          label={MANUAL_SHIPMENT_COPY.statsRevenue}
          value={formatInr(stats.revenue)}
          hint={MANUAL_SHIPMENT_COPY.statsRevenueHint}
          tone="muted"
          icon={<IndianRupee className="h-5 w-5" />}
        />
      </div>

      {rows.length === 0 ? (
        <AdminCard className="p-8 text-center text-sm text-muted">
          {MANUAL_SHIPMENT_COPY.empty}
        </AdminCard>
      ) : (
        <AdminManualOrdersTable rows={rows} />
      )}
    </div>
  );
}
