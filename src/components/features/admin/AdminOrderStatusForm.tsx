"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminOrderFieldSelect } from "@/components/features/admin/AdminOrderFieldSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ACTIONS, ADMIN_ORDERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { OrderStatus, PaymentStatus } from "@/types/order";

const STATUS_OPTIONS = Object.values(OrderStatus);
const PAYMENT_OPTIONS = Object.values(PaymentStatus);

export function AdminOrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
  trackingNumber = "",
  courier = "",
}: {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus?: string;
  trackingNumber?: string;
  courier?: string;
}) {
  const router = useRouter();
  const [tracking, setTracking] = useState(trackingNumber);
  const [courierName, setCourierName] = useState(courier);
  const [busy, setBusy] = useState(false);

  async function patchOrder(body: Record<string, string>) {
    const res = await fetch(API_ENDPOINTS.ADMIN_ORDERS, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, ...body }),
    });
    if (!res.ok) {
      toast.error(ADMIN_ACTIONS.updateFailed);
      return;
    }
    toast.success(ADMIN_ORDERS_COPY.updated);
    router.refresh();
  }

  async function refund() {
    if (!confirm(ADMIN_ORDERS_COPY.refundConfirm)) return;
    setBusy(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ORDER_REFUND(orderId), {
        method: "POST",
      });
      if (!res.ok) {
        toast.error(ADMIN_ORDERS_COPY.refundFailed);
        return;
      }
      toast.success(ADMIN_ORDERS_COPY.refunded);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminOrderFieldSelect
          label={ADMIN_ORDERS_COPY.statusLabel}
          value={currentStatus}
          options={STATUS_OPTIONS}
          onChange={(status) => patchOrder({ status })}
        />
        {currentPaymentStatus ? (
          <AdminOrderFieldSelect
            label={ADMIN_ORDERS_COPY.paymentLabel}
            value={currentPaymentStatus}
            options={PAYMENT_OPTIONS}
            onChange={(paymentStatus) => patchOrder({ paymentStatus })}
          />
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="courier">{ADMIN_ORDERS_COPY.courierLabel}</Label>
          <Input
            id="courier"
            className="mt-1.5"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tracking">{ADMIN_ORDERS_COPY.trackingLabel}</Label>
          <Input
            id="tracking"
            className="mt-1.5"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() =>
            patchOrder({
              courier: courierName,
              trackingNumber: tracking,
            })
          }
        >
          {ADMIN_ORDERS_COPY.saveTracking}
        </Button>
        <Button type="button" variant="destructive" disabled={busy} onClick={refund}>
          {ADMIN_ORDERS_COPY.refundButton}
        </Button>
      </div>
    </div>
  );
}
