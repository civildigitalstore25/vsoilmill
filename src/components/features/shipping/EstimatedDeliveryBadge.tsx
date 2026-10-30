"use client";

import { useEffect, useState } from "react";
import { Truck, Calendar, Sparkles } from "lucide-react";
import { getEstimatedDeliveryRange } from "@/lib/utils/delivery";
import { cn } from "@/lib/utils/cn";

export type EstimatedDeliveryBadgeProps = {
  baseDate?: Date | string | number | null;
  variant?: "product" | "order" | "card" | "checkout" | "cart" | "inline";
  className?: string;
  hideIcon?: boolean;
};

export function EstimatedDeliveryBadge({
  baseDate,
  variant = "product",
  className,
  hideIcon = false,
}: EstimatedDeliveryBadgeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const info = getEstimatedDeliveryRange(baseDate);

  // If baseDate is fixed (like order.createdAt), date range is deterministic
  // If baseDate is undefined (current time), wait for mount to prevent SSR hydration mismatch
  const showDateRange = Boolean(baseDate) || mounted;

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium text-primary",
          className,
        )}
      >
        {!hideIcon && <Truck className="h-3.5 w-3.5 shrink-0" />}
        <span>
          Est. Delivery: <strong>3 to 5 Days</strong>
          {showDateRange && ` (${info.formattedRange})`}
        </span>
      </span>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-900",
          className,
        )}
      >
        {!hideIcon && <Truck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
        <span>
          Est. Delivery: <strong className="font-semibold">3 to 5 Days</strong>
          {showDateRange && (
            <span className="text-emerald-700"> ({info.formattedRange})</span>
          )}
        </span>
      </div>
    );
  }

  if (variant === "cart") {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-dark",
          className,
        )}
      >
        {!hideIcon && <Truck className="h-4 w-4 shrink-0 text-primary" />}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-primary">
            Estimated Delivery: 3 to 5 Days
          </p>
          <p className="text-[11px] text-muted">
            Fast express courier dispatch across India
          </p>
        </div>
      </div>
    );
  }

  if (variant === "checkout") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-dark",
          className,
        )}
      >
        {!hideIcon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-dark">
              Estimated Delivery: 3 to 5 Days
            </span>
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
              Express
            </span>
          </div>
          <p className="mt-0.5 text-muted">
            {showDateRange ? (
              <>Arriving between <strong className="text-dark font-medium">{info.formattedRange}</strong></>
            ) : (
              "Fast doorstep delivery across India"
            )}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "order") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/5 via-cream/40 to-primary/5 p-5 shadow-xs",
          className,
        )}
      >
        <div className="flex items-start gap-3.5">
          {!hideIcon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <Truck className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-dark sm:text-lg">
                Estimated Delivery: 3 to 5 Days
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
                <Calendar className="h-3 w-3" />
                3–5 Days
              </span>
            </div>
            <p className="mt-1 text-sm text-dark/90">
              Expected arrival:{" "}
              <strong className="font-semibold text-primary">
                {info.formattedWithWeekday}
              </strong>
            </p>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              Your freshly pressed oils and ghee are securely packaged and dispatched via pan-India express courier with live tracking.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: "product" variant
  return (
    <div
      className={cn(
        "rounded-xl border border-primary/25 bg-primary/5 p-3.5 sm:p-4 transition-all hover:border-primary/40",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {!hideIcon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
            <Truck className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-dark">
              Estimated Delivery: 3 to 5 Days
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <Sparkles className="h-2.5 w-2.5" />
              Pan-India Express
            </span>
          </div>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            {showDateRange ? (
              <>
                Order today to receive by{" "}
                <strong className="text-dark font-semibold">
                  {info.formattedRange}
                </strong>
                .{" "}
              </>
            ) : null}
            Dispatched within 24–48 hours directly from our Madurai mill. Free shipping on all orders — no delivery cost.
          </p>
        </div>
      </div>
    </div>
  );
}

