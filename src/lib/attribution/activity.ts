import { ADMIN_TRAFFIC_COPY } from "@/constants/admin-traffic";
import { ATTRIBUTION_COPY, ATTRIBUTION_LIMITS } from "@/constants/attribution";
import { formatAttributionLine, formatSourceLabel } from "@/lib/attribution/labels";
import { connectDb } from "@/lib/db/mongoose";
import { MarketingVisitModel } from "@/models/MarketingVisit";
import { OrderModel } from "@/models/Order";
import type { CampaignAttribution, TrafficOrderRow, TrafficVisitRow } from "@/types/attribution";

function display(value?: string): string {
  return value || ATTRIBUTION_COPY.empty;
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

export async function getTrafficActivity(): Promise<{
  visits: TrafficVisitRow[];
  recentOrders: TrafficOrderRow[];
}> {
  await connectDb();
  const [visits, orders] = await Promise.all([
    MarketingVisitModel.find()
      .sort({ createdAt: -1 })
      .limit(ATTRIBUTION_LIMITS.recentItems)
      .lean(),
    OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(ATTRIBUTION_LIMITS.recentItems)
      .lean(),
  ]);

  return {
    visits: visits.map((visit) => ({
      id: String(visit._id),
      source: String(visit.source ?? ""),
      sourceLabel: formatSourceLabel(visit.source),
      medium: display(visit.medium),
      campaign: display(visit.campaign),
      content: display(visit.content),
      term: display(visit.term),
      landingPath: display(visit.landingPath),
      createdAt: toIso(visit.createdAt),
    })),
    recentOrders: orders.map((order) => {
      const attribution = order.attribution as CampaignAttribution | undefined;
      return {
        id: String(order._id),
        customer: order.shippingAddress?.fullName || ADMIN_TRAFFIC_COPY.customerFallback,
        sourceLabel: formatSourceLabel(attribution?.source),
        attributionLine: formatAttributionLine(attribution),
        total: Number(order.pricing?.total) || 0,
        paymentStatus: String(order.paymentStatus ?? ""),
        createdAt: toIso(order.createdAt),
      };
    }),
  };
}
