"use client";

import { Copy, ExternalLink, MessageCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
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
  showDelete = true,
  redirectAfterDelete = false,
  className,
}: {
  id: string;
  token: string;
  customerName: string;
  phone: string;
  editHref?: string;
  showEdit?: boolean;
  showDelete?: boolean;
  redirectAfterDelete?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
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

  async function deleteOrder() {
    if (!confirm(MANUAL_SHIPMENT_COPY.confirmDelete)) return;
    setDeleting(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_MANUAL_SHIPMENT(id), {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || MANUAL_SHIPMENT_COPY.deleteFailed);
      }
      toast.success(MANUAL_SHIPMENT_COPY.deleted);
      if (redirectAfterDelete) {
        router.push(ROUTES.ADMIN.MANUAL_ORDERS);
      }
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : MANUAL_SHIPMENT_COPY.deleteFailed,
      );
    } finally {
      setDeleting(false);
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
      {showDelete ? (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className={iconBtn}
          disabled={deleting}
          onClick={deleteOrder}
          title={MANUAL_SHIPMENT_COPY.deleteOrder}
          aria-label={MANUAL_SHIPMENT_COPY.deleteOrder}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
