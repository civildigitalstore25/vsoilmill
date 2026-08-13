"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";
import type { Order } from "@/types/order";

export function OrderHistoryList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.ORDERS)
      .then((res) => res.json())
      .then((json) => setOrders(json.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="py-12 text-center text-muted">Loading orders…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-16 text-center">
        <Package className="mx-auto h-10 w-10 text-muted" />
        <p className="mt-4 text-muted">No orders yet</p>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.SHOP}>Shop products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-dark">Order history</h2>
      {orders.map((order) => (
        <Link
          key={order._id}
          href={ROUTES.ORDER_DETAIL(order._id)}
          className="block rounded-xl border border-border bg-card p-5 transition hover:border-primary"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted">Order ID</p>
              <p className="font-medium text-dark">{order._id}</p>
              <p className="mt-2 text-sm text-muted">
                {order.items.length} item(s) · {order.status} ·{" "}
                {order.paymentStatus}
              </p>
            </div>
            <p className="font-semibold text-dark">
              {formatInr(order.pricing.total)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
