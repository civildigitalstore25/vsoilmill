"use client";

import Link from "next/link";
import { Package, ShoppingBag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/features/orders/OrderCard";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
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
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
        <div className="flex flex-col items-center gap-3 text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card py-16 px-4 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 font-display text-xl text-dark font-semibold">No orders yet</h3>
        <p className="mt-1 text-sm text-muted max-w-sm mx-auto">
          You haven&apos;t placed any orders with VS OilMill yet. Explore our cold-pressed oils and ghee today!
        </p>
        <Button className="mt-6 gap-2" asChild>
          <Link href={ROUTES.SHOP}>
            <ShoppingBag className="h-4 w-4" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl text-dark">Order History</h2>
          <p className="text-sm text-muted mt-0.5">
            Viewing {orders.length} order{orders.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
