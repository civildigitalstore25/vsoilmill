"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";
import type { Order } from "@/types/order";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

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

  if (orders.length === 0) {
    return <p className="text-muted">No orders yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium text-dark">{order._id}</p>
                <Link
                  href={ROUTES.ADMIN.ORDER_DETAIL(order._id)}
                  className="text-sm text-primary underline"
                >
                  View details
                </Link>
              </div>
              <p className="mt-1 text-sm text-muted">
                {order.shippingAddress.fullName} · {order.shippingAddress.phone}
              </p>
              <p className="mt-1 text-sm text-muted">
                {order.items.length} item(s) · {order.shippingAddress.city}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {formatInr(order.pricing.total)} · Payment {order.paymentStatus}{" "}
                · {order.status}
              </p>
            </div>
            <div className="flex max-w-md flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={order.status === status ? "default" : "outline"}
                  onClick={() => updateStatus(order._id, status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
