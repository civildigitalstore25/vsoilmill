"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, Calendar, ChevronRight, CheckCircle2, Clock, Truck, AlertCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";
import type { Order } from "@/types/order";

export function OrderCard({ order }: { order: Order }) {
  const shortId = `VSO-${order._id.slice(-6).toUpperCase()}`;
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return {
          label: "Delivered",
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "SHIPPED":
        return {
          label: "Shipped",
          icon: Truck,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "PROCESSING":
      case "CONFIRMED":
        return {
          label: "Processing",
          icon: Clock,
          className: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          icon: AlertCircle,
          className: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          label: status || "Pending",
          icon: Clock,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  const isPaid = order.paymentStatus?.toUpperCase() === "PAID";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:shadow-md hover:border-primary/40">
      {/* Order Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-cream/40 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-dark text-base">
                Order #{shortId}
              </span>
              <span className="text-xs text-muted font-mono">({order._id})</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Placed on {formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusInfo.label}
          </span>

          {/* Payment Status Badge */}
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
              isPaid
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : "bg-amber-100 text-amber-800 border-amber-300"
            }`}
          >
            {isPaid ? "PAID" : "PAYMENT PENDING"}
          </span>
        </div>
      </div>

      {/* Product Items List inside Card */}
      <div className="divide-y divide-border/60 px-5 py-3">
        {order.items.map((item, idx) => {
          const itemImg = item.image || "/images/product-placeholder.svg";
          return (
            <div key={idx} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-4">
                {/* Product Thumbnail */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-cream-dark/50 p-1">
                  <Image
                    src={itemImg}
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                    unoptimized={itemImg.endsWith(".svg")}
                  />
                </div>

                {/* Product Details */}
                <div>
                  <h4 className="font-medium text-dark text-sm leading-snug hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    {item.variantLabel && (
                      <span className="rounded-md bg-cream px-2 py-0.5 font-medium text-dark/80">
                        {item.variantLabel}
                      </span>
                    )}
                    <span>
                      Qty: <strong className="text-dark">{item.quantity}</strong>
                    </span>
                    <span>×</span>
                    <span>{formatInr(item.price)}</span>
                  </div>
                </div>
              </div>

              {/* Item Total Price */}
              <div className="text-right">
                <span className="font-semibold text-dark text-sm">
                  {formatInr(item.price * item.quantity)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Card Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-cream/20 px-5 py-4">
        <div>
          <span className="text-xs text-muted">Total Amount</span>
          <p className="font-display text-lg font-bold text-dark">
            {formatInr(order.pricing?.total ?? 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-xl text-xs">
            <Link href={ROUTES.ORDER_DETAIL(order._id)}>
              View Details <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button size="sm" asChild className="gap-1.5 rounded-xl text-xs">
            <Link href={ROUTES.SHOP}>
              <ShoppingBag className="h-3.5 w-3.5" /> Reorder
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
