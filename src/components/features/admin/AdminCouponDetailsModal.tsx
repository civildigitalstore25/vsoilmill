"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  X,
  Copy,
  Check,
  Calendar,
  Percent,
  Layers,
  Edit2,
  Trash2,
  Ticket,
  Package,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { formatInr } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { ASSETS } from "@/constants/assets";
import type { Coupon } from "@/types/coupon";

interface ProductOption {
  _id: string;
  name: string;
  categoryId: string;
  images?: string[];
}

interface CategoryOption {
  _id: string;
  name: string;
}

interface AdminCouponDetailsModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  categories: CategoryOption[];
  products: ProductOption[];
}

export function AdminCouponDetailsModal({
  coupon,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  categories,
  products,
}: AdminCouponDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !coupon) return null;

  function handleCopy() {
    if (!coupon) return;
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(`Copied "${coupon.code}" to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  }

  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validTo = new Date(coupon.validTo);
  const isExpired = validTo < now;
  const isUpcoming = validFrom > now;
  const isActive = coupon.status === "ACTIVE" && !isExpired && !isUpcoming;

  // Resolve applicable product objects
  const applicableIds = (coupon.applicableProducts || []).map((p: any) =>
    typeof p === "string" ? p : p._id,
  );
  const matchedProducts = products.filter((p) => applicableIds.includes(p._id));

  // Usage percentage
  const usagePercent =
    coupon.usageLimit > 0
      ? Math.min(Math.round(((coupon.timesUsed || 0) / coupon.usageLimit) * 100), 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer on Right Side */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden text-[#1e293b]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Ticket className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-[#0f2a4a]">
                  Coupon Details
                </h2>
                <p className="text-xs text-muted">Complete promotion summary & rules</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-cream hover:bg-cream-dark p-2 text-dark transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm">
            {/* Hero Card with Code & Copy Button */}
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-cream via-white to-primary/5 p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Coupon Code
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-2xl font-extrabold tracking-wider text-dark bg-white px-3 py-1 rounded-xl border border-border shadow-2xs">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-dark shadow-2xs hover:bg-cream transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-muted" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-1">
                    Status
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                      isExpired
                        ? "bg-red-100 text-red-700"
                        : isUpcoming
                        ? "bg-amber-100 text-amber-800"
                        : coupon.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isExpired
                          ? "bg-red-500"
                          : isUpcoming
                          ? "bg-amber-500"
                          : coupon.status === "ACTIVE"
                          ? "bg-emerald-500"
                          : "bg-slate-500",
                      )}
                    />
                    {isExpired
                      ? "Expired"
                      : isUpcoming
                      ? "Upcoming"
                      : coupon.status === "ACTIVE"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Discount Highlight */}
              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">Discount Value</p>
                  <p className="text-xl font-extrabold text-primary">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}% OFF`
                      : `${formatInr(coupon.discountValue)} FLAT OFF`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Discount Type</p>
                  <p className="text-sm font-semibold text-dark capitalize">
                    {coupon.discountType.toLowerCase()} Discount
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted">
                Campaign Information
              </h3>
              <div className="rounded-xl border border-border/80 bg-cream/30 p-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs text-muted block">Coupon Name</span>
                  <span className="font-semibold text-dark">{coupon.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Description</span>
                  <span className="text-dark">
                    {coupon.description || "No description provided."}
                  </span>
                </div>
              </div>
            </div>

            {/* Validity Schedule */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted">
                Validity & Schedule
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/80 bg-cream/30 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Valid From</span>
                  </div>
                  <p className="font-semibold text-dark text-xs sm:text-sm">
                    {validFrom.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-cream/30 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Valid To</span>
                  </div>
                  <p
                    className={cn(
                      "font-semibold text-xs sm:text-sm",
                      isExpired ? "text-red-600" : "text-dark",
                    )}
                  >
                    {validTo.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage & Redemptions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted">
                  Usage & Redemptions
                </h3>
                <span className="text-xs font-semibold text-dark">
                  {coupon.timesUsed || 0}{" "}
                  {coupon.usageLimit > 0 ? `/ ${coupon.usageLimit} uses` : "uses (Unlimited)"}
                </span>
              </div>
              <div className="rounded-xl border border-border/80 bg-cream/30 p-4 space-y-3">
                {coupon.usageLimit > 0 ? (
                  <>
                    <div className="h-2 w-full rounded-full bg-cream-dark overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          usagePercent >= 100
                            ? "bg-red-500"
                            : usagePercent > 75
                            ? "bg-amber-500"
                            : "bg-primary",
                        )}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{usagePercent}% capacity reached</span>
                      <span>
                        {Math.max(coupon.usageLimit - (coupon.timesUsed || 0), 0)} uses remaining
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-muted">
                    This coupon has no usage limits and can be redeemed unlimited times until its expiry date.
                  </p>
                )}
              </div>
            </div>

            {/* Applicable Products */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted">
                Applicable Products
              </h3>
              {applicableIds.length === 0 ? (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">Site-wide Coupon</p>
                    <p className="text-xs text-emerald-700">
                      Applies automatically to all products and collections across the entire store.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border/80 bg-cream/30 divide-y divide-border/60 max-h-48 overflow-y-auto">
                  {matchedProducts.map((p) => {
                    const cat = categories.find((c) => String(c._id) === String(p.categoryId));
                    return (
                      <div key={p._id} className="flex items-center gap-3 p-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                          <Image
                            src={p.images?.[0] || ASSETS.PLACEHOLDER_PRODUCT}
                            alt={p.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-dark truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-muted truncate">
                            {cat?.name || "General"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted">
              <span>
                Created: {new Date(coupon.createdAt).toLocaleDateString("en-IN")}
              </span>
              <span>
                Updated: {new Date(coupon.updatedAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border/80 px-6 py-4 bg-white flex items-center justify-between sticky bottom-0 z-10 shadow-lg">
            <button
              type="button"
              onClick={() => {
                onDelete(coupon._id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border bg-white text-xs font-semibold text-dark hover:bg-cream transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(coupon);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
