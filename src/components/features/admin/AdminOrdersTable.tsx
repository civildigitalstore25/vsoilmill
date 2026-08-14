"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminOrderFieldSelect } from "@/components/features/admin/AdminOrderFieldSelect";
import { AdminCard } from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_ORDERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";
import { OrderStatus, PaymentStatus, type Order } from "@/types/order";

const STATUS_OPTIONS = Object.values(OrderStatus);
const PAYMENT_OPTIONS = Object.values(PaymentStatus);

const HEADERS = [
  ADMIN_ORDERS_COPY.tableCustomer,
  ADMIN_ORDERS_COPY.tableDate,
  ADMIN_ORDERS_COPY.tableItems,
  ADMIN_ORDERS_COPY.tableTotal,
  ADMIN_ORDERS_COPY.tableStatus,
  ADMIN_ORDERS_COPY.tablePayment,
  ADMIN_ORDERS_COPY.tableActions,
] as const;

function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function patchOrder(
    id: string,
    body: { status?: string; paymentStatus?: string },
  ) {
    const res = await fetch(API_ENDPOINTS.ADMIN_ORDERS, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    if (!res.ok) {
      toast.error(ADMIN_ACTIONS.updateFailed);
      return;
    }
    toast.success(ADMIN_ORDERS_COPY.updated);
    router.refresh();
  }

  async function removeOrder(id: string) {
    if (!confirm(ADMIN_ACTIONS.confirmDelete)) return;
    const res = await fetch(API_ENDPOINTS.ADMIN_ORDER(id), { method: "DELETE" });
    if (!res.ok) {
      toast.error(ADMIN_ACTIONS.deleteFailed);
      return;
    }
    toast.success(ADMIN_ORDERS_COPY.deleted);
    router.refresh();
  }

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
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-border/70 align-middle transition hover:bg-cream/40"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-dark">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {order.shippingAddress.phone} · {order.shippingAddress.city}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-muted">
                  {formatOrderDate(order.createdAt)}
                </td>
                <td className="px-5 py-4 text-muted">
                  {order.items.length} {ADMIN_ORDERS_COPY.itemsSuffix}
                </td>
                <td className="px-5 py-4 font-semibold text-dark">
                  {formatInr(order.pricing.total)}
                </td>
                <td className="px-5 py-4">
                  <AdminOrderFieldSelect
                    label={ADMIN_ORDERS_COPY.statusLabel}
                    value={order.status}
                    options={STATUS_OPTIONS}
                    showLabel={false}
                    onChange={(status) => patchOrder(order._id, { status })}
                  />
                </td>
                <td className="px-5 py-4">
                  <AdminOrderFieldSelect
                    label={ADMIN_ORDERS_COPY.paymentLabel}
                    value={order.paymentStatus}
                    options={PAYMENT_OPTIONS}
                    showLabel={false}
                    onChange={(paymentStatus) =>
                      patchOrder(order._id, { paymentStatus })
                    }
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={ROUTES.ADMIN.ORDER_DETAIL(order._id)}>
                        {ADMIN_ORDERS_COPY.view}
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeOrder(order._id)}
                    >
                      {ADMIN_ACTIONS.delete}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
