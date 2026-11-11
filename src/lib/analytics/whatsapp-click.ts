import { API_ENDPOINTS } from "@/constants/api";
import {
  getOrCreateSessionKey,
  readStoredAttribution,
} from "@/lib/attribution/storage";
import type {
  WhatsAppClickInput,
  WhatsAppLeadContext,
  WhatsAppLeadItem,
} from "@/types/whatsapp-lead";

export type TrackWhatsAppClickInput = {
  context: WhatsAppLeadContext;
  pagePath?: string;
  items: WhatsAppLeadItem[];
  estimatedTotal: number;
};

export function trackWhatsAppClick(input: TrackWhatsAppClickInput): void {
  if (typeof window === "undefined") return;
  if (!input.items.length) return;

  const payload: WhatsAppClickInput = {
    context: input.context,
    pagePath: input.pagePath || window.location.pathname,
    items: input.items,
    estimatedTotal: input.estimatedTotal,
    sessionKey: getOrCreateSessionKey(),
    attribution: readStoredAttribution() ?? undefined,
  };

  void fetch(API_ENDPOINTS.ANALYTICS_WHATSAPP_CLICKS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
