"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Order } from "@/types/order";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

function paymentTone(status: string) {
  if (status === "PAID") return "bg-primary/10 text-primary";
  if (status === "FAILED") return "bg-destructive/10 text-destructive";
  return "bg-cream-dark text-muted";
}

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
    <div>
      <AdminPageHeader
        title="Orders"
        description="Track payments, update fulfillment, and open order details."
      />

      {orders.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          No orders yet.
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <AdminCard key={order._id} className="p-5 md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-dark">
                      {order.shippingAddress.fullName}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        paymentTone(order.paymentStatus),
                      )}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {order.shippingAddress.phone} · {order.shippingAddress.city}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {order.items.length} item(s) · {order.status}
                  </p>
                  <p className="mt-3 font-display text-2xl text-dark">
                    {formatInr(order.pricing.total)}
                  </p>
                  <Link
                    href={ROUTES.ADMIN.ORDER_DETAIL(order._id)}
                    className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    View full details →
                  </Link>
                </div>
                <div className="flex max-w-xl flex-wrap gap-2">
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
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
