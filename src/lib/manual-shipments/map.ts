import { ATTRIBUTION_COPY } from "@/constants/attribution";
import type {
  ManualShipmentItem,
  ManualShipmentListRow,
  ManualShipmentStatus,
} from "@/types/manual-shipment";

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

export function summarizeManualItems(items: ManualShipmentItem[]): string {
  if (!items.length) return ATTRIBUTION_COPY.empty;
  const first = items[0];
  const head = first.variantLabel
    ? `${first.name} (${first.variantLabel}) × ${first.quantity}`
    : `${first.name} × ${first.quantity}`;
  if (items.length === 1) return head;
  return `${head} +${items.length - 1} more`;
}

export function mapManualListRow(doc: {
  _id: unknown;
  customer?: { name?: string; phone?: string };
  items?: ManualShipmentItem[];
  pricing?: { total?: number };
  trackingNumber?: string;
  status?: string;
  publicTrackToken?: string;
  createdAt?: unknown;
}): ManualShipmentListRow {
  const items = (doc.items ?? []) as ManualShipmentItem[];
  return {
    id: String(doc._id),
    customerName: doc.customer?.name || "Customer",
    phone: doc.customer?.phone || "",
    itemsSummary: summarizeManualItems(items),
    total: Number(doc.pricing?.total) || 0,
    trackingNumber: doc.trackingNumber || undefined,
    status: (doc.status as ManualShipmentStatus) ?? ("CONFIRMED" as ManualShipmentStatus),
    publicTrackToken: String(doc.publicTrackToken ?? ""),
    createdAt: toIso(doc.createdAt),
  };
}
