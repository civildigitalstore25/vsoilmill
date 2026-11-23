"use client";

import Link from "next/link";
import { AdminCard, AdminPageHeader, AdminAddButton } from "@/components/features/admin/AdminUi";
import { ManualOrderShareActions } from "@/components/features/admin/manual-orders/ManualOrderShareActions";
import { Button } from "@/components/ui/button";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { formatInr, formatInrDateTime } from "@/lib/utils/format";
import type { ManualShipmentListRow } from "@/types/manual-shipment";

export function AdminManualOrdersList({
  rows,
}: {
  rows: ManualShipmentListRow[];
}) {
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

      {rows.length === 0 ? (
        <AdminCard className="p-8 text-center text-sm text-muted">
          {MANUAL_SHIPMENT_COPY.empty}
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <AdminCard key={row.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-dark">{row.customerName}</p>
                    <span className="rounded-md bg-cream px-2 py-0.5 text-[11px] font-bold uppercase text-muted">
                      {row.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{row.phone}</p>
                  <p className="text-sm text-dark">{row.itemsSummary}</p>
                  <p className="text-xs text-muted">
                    {row.trackingNumber
                      ? `AWB ${row.trackingNumber}`
                      : "No AWB yet"}{" "}
                    · {formatInrDateTime(row.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                  <p className="text-base font-bold text-dark">
                    {formatInr(row.total)}
                  </p>
                  <ManualOrderShareActions
                    id={row.id}
                    token={row.publicTrackToken}
                    customerName={row.customerName}
                    phone={row.phone}
                  />
                  <Button size="sm" variant="outline" asChild>
                    <Link href={ROUTES.ADMIN.MANUAL_ORDER_DETAIL(row.id)}>
                      Open
                    </Link>
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
