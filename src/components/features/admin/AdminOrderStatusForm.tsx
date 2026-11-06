"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminOrderFieldSelect } from "@/components/features/admin/AdminOrderFieldSelect";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_ORDERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { OrderStatus, PaymentStatus } from "@/types/order";

const STATUS_OPTIONS = Object.values(OrderStatus);
const PAYMENT_OPTIONS = Object.values(PaymentStatus);

export function AdminOrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus?: string;
}) {
  const router = useRouter();
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

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="destructive" disabled={busy} onClick={refund}>
          {ADMIN_ORDERS_COPY.refundButton}
        </Button>
      </div>
    </div>
  );
}
