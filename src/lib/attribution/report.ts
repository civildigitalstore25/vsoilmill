import { ATTRIBUTION_COPY, ATTRIBUTION_SOURCE } from "@/constants/attribution";
import { formatSourceLabel } from "@/lib/attribution/labels";
import { connectDb } from "@/lib/db/mongoose";
import { MarketingVisitModel } from "@/models/MarketingVisit";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";
import type {
  TrafficCampaignRow,
  TrafficReport,
  TrafficSourceRow,
} from "@/types/attribution";

type GroupId = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landingPath: string;
};

type CountAgg = { _id: GroupId; count: number; lastAt?: Date };
type OrderAgg = {
  _id: GroupId;
  orders: number;
  paidOrders: number;
  revenue: number;
  lastAt?: Date;
};

const visitGroupId = {
  source: { $ifNull: ["$source", ATTRIBUTION_SOURCE.direct] },
  medium: { $ifNull: ["$medium", ""] },
  campaign: { $ifNull: ["$campaign", ""] },
  content: { $ifNull: ["$content", ""] },
  term: { $ifNull: ["$term", ""] },
  landingPath: { $ifNull: ["$landingPath", ""] },
};

const orderGroupId = {
  source: { $ifNull: ["$attribution.source", ATTRIBUTION_SOURCE.direct] },
  medium: { $ifNull: ["$attribution.medium", ""] },
  campaign: { $ifNull: ["$attribution.campaign", ""] },
  content: { $ifNull: ["$attribution.content", ""] },
  term: { $ifNull: ["$attribution.term", ""] },
  landingPath: { $ifNull: ["$attribution.landingPath", ""] },
};

function groupKey(id: GroupId): string {
  return [id.source, id.medium, id.campaign, id.content, id.term, id.landingPath].join("|");
}

function display(value: string): string {
  return value || ATTRIBUTION_COPY.empty;
}

function later(left?: string, right?: Date): string | undefined {
  const rightIso = right ? new Date(right).toISOString() : undefined;
  if (!left) return rightIso;
  if (!rightIso) return left;
  return left > rightIso ? left : rightIso;
}

function emptyRow(id: GroupId): TrafficCampaignRow {
  return {
    source: id.source || ATTRIBUTION_SOURCE.direct,
    sourceLabel: formatSourceLabel(id.source),
    medium: display(id.medium),
    campaign: display(id.campaign),
    content: display(id.content),
    term: display(id.term),
    landingPath: display(id.landingPath),
    visits: 0,
    orders: 0,
    paidOrders: 0,
    revenue: 0,
  };
}

function sortRows<T extends { revenue: number; orders: number; visits: number }>(
  rows: T[],
): T[] {
  return [...rows].sort(
    (a, b) => b.revenue - a.revenue || b.orders - a.orders || b.visits - a.visits,
  );
}

export async function getTrafficReport(): Promise<TrafficReport> {
  await connectDb();
  const [visitGroups, orderGroups] = await Promise.all([
    MarketingVisitModel.aggregate<CountAgg>([
      { $group: { _id: visitGroupId, count: { $sum: 1 }, lastAt: { $max: "$createdAt" } } },
    ]),
    OrderModel.aggregate<OrderAgg>([
      {
        $group: {
          _id: orderGroupId,
          orders: { $sum: 1 },
          paidOrders: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", PaymentStatus.PAID] }, 1, 0] },
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", PaymentStatus.PAID] },
                { $ifNull: ["$pricing.total", 0] },
                0,
              ],
            },
          },
          lastAt: { $max: "$createdAt" },
        },
      },
    ]),
  ]);

  const campaigns = new Map<string, TrafficCampaignRow>();
  for (const group of visitGroups) {
    const row = emptyRow(group._id);
    row.visits = group.count;
    row.lastActivityAt = later(row.lastActivityAt, group.lastAt);
    campaigns.set(groupKey(group._id), row);
  }
  for (const group of orderGroups) {
    const key = groupKey(group._id);
    const row = campaigns.get(key) ?? emptyRow(group._id);
    row.orders = group.orders;
    row.paidOrders = group.paidOrders;
    row.revenue = group.revenue;
    row.lastActivityAt = later(row.lastActivityAt, group.lastAt);
    campaigns.set(key, row);
  }

  const sourceMap = new Map<string, TrafficSourceRow>();
  for (const row of campaigns.values()) {
    const current = sourceMap.get(row.source) ?? {
      source: row.source,
      label: row.sourceLabel,
      visits: 0,
      orders: 0,
      paidOrders: 0,
      revenue: 0,
    };
    current.visits += row.visits;
    current.orders += row.orders;
    current.paidOrders += row.paidOrders;
    current.revenue += row.revenue;
    sourceMap.set(row.source, current);
  }

  const campaignRows = sortRows([...campaigns.values()]);
  const attributed = campaignRows.filter((row) => row.source !== ATTRIBUTION_SOURCE.direct);

  return {
    summary: {
      visits: attributed.reduce((sum, row) => sum + row.visits, 0),
      orders: attributed.reduce((sum, row) => sum + row.orders, 0),
      paidOrders: attributed.reduce((sum, row) => sum + row.paidOrders, 0),
      revenue: attributed.reduce((sum, row) => sum + row.revenue, 0),
    },
    sources: sortRows([...sourceMap.values()]),
    campaigns: campaignRows,
  };
}
