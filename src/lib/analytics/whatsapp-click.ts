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

function safeSessionKey(): string | undefined {
  try {
    return getOrCreateSessionKey();
  } catch {
    return undefined;
  }
}

function safeAttribution(): WhatsAppClickInput["attribution"] {
  try {
    return readStoredAttribution() ?? undefined;
  } catch {
    return undefined;
  }
}

export function trackWhatsAppClick(input: TrackWhatsAppClickInput): void {
  if (typeof window === "undefined") return;
  if (!input.items.length) return;

  const payload: WhatsAppClickInput = {
    context: input.context,
    pagePath: input.pagePath || window.location.pathname,
    items: input.items,
    estimatedTotal: input.estimatedTotal,
    sessionKey: safeSessionKey(),
    attribution: safeAttribution(),
  };

  const body = JSON.stringify(payload);
  const url = API_ENDPOINTS.ANALYTICS_WHATSAPP_CLICKS;

  // sendBeacon survives WhatsApp app-switch better than a normal fetch.
  try {
    if (typeof navigator.sendBeacon === "function") {
      const queued = navigator.sendBeacon(
        url,
        new Blob([body], { type: "application/json" }),
      );
      if (queued) return;
    }
  } catch {
    // fall through to fetch
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
