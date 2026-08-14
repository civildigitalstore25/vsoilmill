"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminOrderFieldSelect } from "@/components/features/admin/AdminOrderFieldSelect";
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

  async function patchOrder(body: { status?: string; paymentStatus?: string }) {
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

  return (
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
  );
}
