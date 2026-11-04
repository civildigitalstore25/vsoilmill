"use client";

import Link from "next/link";
import { ChevronRight, Copy, Truck } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { ST_COURIER_NAME } from "@/lib/shipping/st-courier";

export function OrderTrackingInfo({
  orderId,
  trackingNumber,
  trackingStatus,
  className = "",
}: {
  orderId: string;
  trackingNumber?: string;
  trackingStatus?: string;
  className?: string;
}) {
  if (!trackingNumber) return null;

  async function copy() {
    if (!trackingNumber) return;
    try {
      await navigator.clipboard.writeText(trackingNumber);
      toast.success("Consignment number copied");
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      <Truck className="h-4 w-4 text-primary" />
      <span className="font-medium text-dark">
        {ST_COURIER_NAME} &middot; <span className="font-mono">{trackingNumber}</span>
      </span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center text-muted hover:text-primary"
        aria-label="Copy consignment number"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
      <Link
        href={ROUTES.ORDER_TRACKING(orderId)}
        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
      >
        Track shipment <ChevronRight className="h-3.5 w-3.5" />
      </Link>
      {trackingStatus ? (
        <span className="text-xs text-muted">({trackingStatus})</span>
      ) : null}
    </div>
  );
}