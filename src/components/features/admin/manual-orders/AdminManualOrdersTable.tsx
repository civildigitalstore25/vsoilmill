"use client";

import { ManualOrderShareActions } from "@/components/features/admin/manual-orders/ManualOrderShareActions";
import { AdminCard } from "@/components/features/admin/AdminUi";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { shortManualId } from "@/lib/manual-shipments/token";
import { manualShipmentStatusStyle } from "@/lib/manual-shipments/status-styles";
import { formatInr } from "@/lib/utils/format";
import type { ManualShipmentListRow } from "@/types/manual-shipment";

const HEADERS = [
  MANUAL_SHIPMENT_COPY.tableCustomer,
  MANUAL_SHIPMENT_COPY.tableDate,
  MANUAL_SHIPMENT_COPY.tableItems,
  MANUAL_SHIPMENT_COPY.tableTotal,
  MANUAL_SHIPMENT_COPY.tableStatus,
  MANUAL_SHIPMENT_COPY.tableAwb,
  MANUAL_SHIPMENT_COPY.tableActions,
] as const;

function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminManualOrdersTable({
  rows,
}: {
  rows: ManualShipmentListRow[];
}) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border bg-cream/70">
            <tr className="text-xs uppercase tracking-[0.12em] text-muted">
              {HEADERS.map((header) => (
                <th key={header} className="px-5 py-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const statusInfo = manualShipmentStatusStyle(row.status);
              const StatusIcon = statusInfo.icon;
              const shortId = shortManualId(row.id);

              return (
                <tr
                  key={row.id}
                  className="border-b border-border/70 align-middle transition hover:bg-cream/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={row.customerName} />
                      <div>
                        <p className="font-medium text-dark">{row.customerName}</p>
                        <p className="mt-1 text-xs text-muted">{row.phone}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted">
                          #{shortId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted">
                    {formatOrderDate(row.createdAt)}
                  </td>
                  <td className="max-w-[220px] px-5 py-4 text-muted">
                    <p className="truncate" title={row.itemsSummary}>
                      {row.itemsSummary}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-dark">
                    {formatInr(row.total)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {row.trackingNumber ? (
                      <span className="font-mono text-xs text-dark">
                        {row.trackingNumber}
                      </span>
                    ) : (
                      <span className="text-xs text-muted">
                        {MANUAL_SHIPMENT_COPY.noAwb}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <ManualOrderShareActions
                      id={row.id}
                      token={row.publicTrackToken}
                      customerName={row.customerName}
                      phone={row.phone}
                      editHref={ROUTES.ADMIN.MANUAL_ORDER_DETAIL(row.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
