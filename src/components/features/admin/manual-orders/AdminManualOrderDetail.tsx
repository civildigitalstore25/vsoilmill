"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { ManualOrderShareActions } from "@/components/features/admin/manual-orders/ManualOrderShareActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { shortManualId } from "@/lib/manual-shipments/token";
import { formatInr, formatInrDateTime } from "@/lib/utils/format";
import type { ManualShipment } from "@/types/manual-shipment";

export function AdminManualOrderDetail({
  shipment,
}: {
  shipment: ManualShipment;
}) {
  const router = useRouter();
  const [awb, setAwb] = useState(shipment.trackingNumber ?? "");
  const [busy, setBusy] = useState(false);

  async function saveAwb() {
    setBusy(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_MANUAL_SHIPMENT(shipment._id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber: awb.trim() }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || MANUAL_SHIPMENT_COPY.updateFailed);
      }
      toast.success(MANUAL_SHIPMENT_COPY.updated);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : MANUAL_SHIPMENT_COPY.updateFailed,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={`${MANUAL_SHIPMENT_COPY.detailTitle} #${shortManualId(shipment._id)}`}
        description={formatInrDateTime(shipment.createdAt)}
        actions={
          <Button variant="outline" asChild>
            <Link href={ROUTES.ADMIN.MANUAL_ORDERS}>Back</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="space-y-4 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Customer</p>
            <p className="mt-1 font-semibold text-dark">{shipment.customer.name}</p>
            <p className="text-sm text-muted">{shipment.customer.phone}</p>
            {shipment.customer.email ? (
              <p className="text-sm text-muted">{shipment.customer.email}</p>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {MANUAL_SHIPMENT_COPY.items}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-dark">
              {shipment.items.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  {item.name}
                  {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity} —{" "}
                  {formatInr(item.price * item.quantity)}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-bold text-dark">
              {MANUAL_SHIPMENT_COPY.total}: {formatInr(shipment.pricing.total)}
            </p>
          </div>
          <p className="text-xs font-semibold uppercase text-muted">Status: {shipment.status}</p>
        </AdminCard>

        <AdminCard className="space-y-4 p-6">
          <div>
            <Label htmlFor="detail-awb">{MANUAL_SHIPMENT_COPY.awb}</Label>
            <Input
              id="detail-awb"
              className="mt-1.5 font-mono"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="58240292331"
            />
            <p className="mt-1 text-xs text-muted">{MANUAL_SHIPMENT_COPY.awbHint}</p>
            <Button className="mt-3" type="button" disabled={busy} onClick={saveAwb}>
              {MANUAL_SHIPMENT_COPY.saveAwb}
            </Button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {MANUAL_SHIPMENT_COPY.publicLink}
            </p>
            <p className="mt-1 break-all font-mono text-xs text-muted">
              {ROUTES.PUBLIC_TRACK(shipment.publicTrackToken)}
            </p>
            <div className="mt-3">
              <ManualOrderShareActions
                id={shipment._id}
                token={shipment.publicTrackToken}
                customerName={shipment.customer.name}
                phone={shipment.customer.phone}
              />
            </div>
          </div>

          {shipment.trackingNumber ? (
            <Button variant="outline" asChild>
              <Link href={ROUTES.PUBLIC_TRACK(shipment.publicTrackToken)} target="_blank">
                Open public track page
              </Link>
            </Button>
          ) : null}
        </AdminCard>
      </div>
    </div>
  );
}
