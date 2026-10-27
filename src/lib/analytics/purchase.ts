import { ANALYTICS } from "@/constants/analytics";
import type { PurchaseTracking } from "@/types/analytics";

const trackedOrders = new Set<string>();

type GtagCommand = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagCommand;
  }
}

function queueGtag(eventName: string, params: Record<string, unknown>): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js reads the Arguments object, not a plain array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
  window.gtag("event", eventName, params);
}

export function trackPurchase(purchase: PurchaseTracking): void {
  if (typeof window === "undefined") return;
  if (!Number.isFinite(purchase.value)) return;

  const orderId = purchase.orderId.trim();
  if (!orderId || trackedOrders.has(orderId)) return;

  const storageKey = `${ANALYTICS.PURCHASE_STORAGE_PREFIX}${orderId}`;
  try {
    if (sessionStorage.getItem(storageKey) === "1") {
      trackedOrders.add(orderId);
      return;
    }
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // Private browsing can block storage. The in-memory set still blocks a second send.
  }

  trackedOrders.add(orderId);
  queueGtag(ANALYTICS.PURCHASE_EVENT, {
    transaction_id: orderId,
    value: purchase.value,
    currency: ANALYTICS.CURRENCY,
    items: purchase.items.map((item) => ({
      item_id: item.itemId,
      item_name: item.itemName,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}
