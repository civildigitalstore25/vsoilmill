import React from "react";
import { CheckCircle2, Clock, AlertCircle, MinusCircle } from "lucide-react";
import type { CertificateStatus } from "@/types/certificate";
import { cn } from "@/lib/utils/cn";

interface CertificateStatusBadgeProps {
  status: CertificateStatus;
  className?: string;
  showIcon?: boolean;
}

export function CertificateStatusBadge({
  status,
  className,
  showIcon = true,
}: CertificateStatusBadgeProps) {
  switch (status) {
    case "verified":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800",
            className,
          )}
        >
          {showIcon && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
          <span>Verified Document</span>
        </span>
      );

    case "pending":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800",
            className,
          )}
        >
          {showIcon && <Clock className="h-3 w-3 text-amber-600" />}
          <span>Verification Pending</span>
        </span>
      );

    case "not_applicable":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600",
            className,
          )}
        >
          {showIcon && <MinusCircle className="h-3 w-3 text-stone-500" />}
          <span>Not Applicable</span>
        </span>
      );

    case "placeholder":
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/90 px-2.5 py-0.5 text-xs font-semibold text-amber-900",
            className,
          )}
        >
          {showIcon && <AlertCircle className="h-3 w-3 text-amber-700" />}
          <span>Sample Placeholder</span>
        </span>
      );
  }
}
