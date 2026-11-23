"use client";

import { Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MANUAL_SHIPMENT_COPY, manualTrackShareMessage } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { shortManualId } from "@/lib/manual-shipments/token";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

function trackUrl(token: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "");
  return `${base.replace(/\/$/, "")}${ROUTES.PUBLIC_TRACK(token)}`;
}

export function ManualOrderShareActions({
  id,
  token,
  customerName,
  phone,
}: {
  id: string;
  token: string;
  customerName: string;
  phone: string;
}) {
  const url = trackUrl(token);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(MANUAL_SHIPMENT_COPY.linkCopied);
    } catch {
      toast.error(MANUAL_SHIPMENT_COPY.updateFailed);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={copyLink}>
        <Copy className="h-3.5 w-3.5" />
        {MANUAL_SHIPMENT_COPY.copyLink}
      </Button>
      <Button type="button" variant="whatsapp" size="sm" className="gap-1.5" asChild>
        <a
          href={buildWhatsAppUrl(
            manualTrackShareMessage(customerName, url, shortManualId(id)),
            phone,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {MANUAL_SHIPMENT_COPY.shareWhatsApp}
        </a>
      </Button>
    </div>
  );
}
