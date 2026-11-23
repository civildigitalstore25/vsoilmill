"use client";

import { Copy, ExternalLink, MessageCircle, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  MANUAL_SHIPMENT_COPY,
  manualTrackShareMessage,
} from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { shortManualId } from "@/lib/manual-shipments/token";
import { cn } from "@/lib/utils/cn";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

function trackUrl(token: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "");
  return `${base.replace(/\/$/, "")}${ROUTES.PUBLIC_TRACK(token)}`;
}

const iconBtn =
  "h-9 w-9 rounded-xl p-0 inline-flex items-center justify-center";

export function ManualOrderShareActions({
  id,
  token,
  customerName,
  phone,
  editHref,
  showEdit = true,
  className,
}: {
  id: string;
  token: string;
  customerName: string;
  phone: string;
  editHref?: string;
  showEdit?: boolean;
  className?: string;
}) {
  const url = trackUrl(token);
  const detailHref = editHref ?? ROUTES.ADMIN.MANUAL_ORDER_DETAIL(id);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(MANUAL_SHIPMENT_COPY.linkCopied);
    } catch {
      toast.error(MANUAL_SHIPMENT_COPY.updateFailed);
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={iconBtn}
        onClick={copyLink}
        title={MANUAL_SHIPMENT_COPY.copyLink}
        aria-label={MANUAL_SHIPMENT_COPY.copyLink}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button type="button" variant="whatsapp" size="sm" className={iconBtn} asChild>
        <a
          href={buildWhatsAppUrl(
            manualTrackShareMessage(customerName, url, shortManualId(id)),
            phone,
          )}
          target="_blank"
          rel="noopener noreferrer"
          title={MANUAL_SHIPMENT_COPY.shareWhatsApp}
          aria-label={MANUAL_SHIPMENT_COPY.shareWhatsApp}
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </Button>
      {showEdit ? (
        <Button type="button" variant="outline" size="sm" className={iconBtn} asChild>
          <Link
            href={detailHref}
            title={MANUAL_SHIPMENT_COPY.editOrder}
            aria-label={MANUAL_SHIPMENT_COPY.editOrder}
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
      <Button type="button" variant="outline" size="sm" className={iconBtn} asChild>
        <Link
          href={ROUTES.PUBLIC_TRACK(token)}
          target="_blank"
          title={MANUAL_SHIPMENT_COPY.openDetails}
          aria-label={MANUAL_SHIPMENT_COPY.openDetails}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
