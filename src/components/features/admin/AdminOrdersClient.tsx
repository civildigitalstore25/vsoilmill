"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
import { formatInr } from "@/lib/utils/format";
import type { Order } from "@/types/order";

export function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    const res = await fetch(API_ENDPOINTS.ADMIN_ORDERS, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Order updated");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{order._id}</p>
              <p className="text-sm text-muted">
                {order.shippingAddress.fullName} · {order.shippingAddress.phone}
              </p>
              <p className="mt-1 text-sm">
                {formatInr(order.pricing.total)} · {order.paymentStatus} ·{" "}
                {order.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
                (status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(order._id, status)}
                  >
                    {status}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
