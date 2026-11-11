import { ATTRIBUTION_COPY } from "@/constants/attribution";
import { WHATSAPP_LEAD_LIMITS } from "@/constants/whatsapp-leads";
import { formatAttributionLine } from "@/lib/attribution/labels";
import { connectDb } from "@/lib/db/mongoose";
import { WhatsAppClickModel } from "@/models/WhatsAppClick";
import type { CampaignAttribution } from "@/types/attribution";
import {
  WhatsAppLeadContext,
  WhatsAppLeadStatus,
  type WhatsAppLeadItem,
  type WhatsAppLeadRow,
  type WhatsAppLeadSummary,
  type WhatsAppProductStat,
} from "@/types/whatsapp-lead";

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function productKey(item: WhatsAppLeadItem): string {
  return (item.productId || item.name).trim();
}

function summarizeItems(items: WhatsAppLeadItem[]): string {
  if (!items.length) return ATTRIBUTION_COPY.empty;
  const first = items[0];
  const head = first.variantLabel
    ? `${first.name} (${first.variantLabel}) × ${first.quantity}`
    : `${first.name} × ${first.quantity}`;
  if (items.length === 1) return head;
  return `${head} +${items.length - 1} more`;
}

export async function getWhatsAppLeadSummary(): Promise<WhatsAppLeadSummary> {
  await connectDb();
  const [clicks, open, ordered] = await Promise.all([
    WhatsAppClickModel.countDocuments(),
    WhatsAppClickModel.countDocuments({
      status: {
        $in: [WhatsAppLeadStatus.NEW, WhatsAppLeadStatus.CONTACTED],
      },
    }),
    WhatsAppClickModel.countDocuments({ status: WhatsAppLeadStatus.ORDERED }),
  ]);
  return { clicks, open, ordered };
}

export async function getWhatsAppProductStats(): Promise<WhatsAppProductStat[]> {
  await connectDb();
  const rows = await WhatsAppClickModel.aggregate<{
    _id: string;
    name: string;
    clicks: number;
    ordered: number;
    open: number;
    lastClickAt: Date;
  }>([
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          $ifNull: ["$items.productId", "$items.name"],
        },
        name: { $first: "$items.name" },
        clicks: { $sum: 1 },
        ordered: {
          $sum: {
            $cond: [{ $eq: ["$status", WhatsAppLeadStatus.ORDERED] }, 1, 0],
          },
        },
        open: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$status",
                  [WhatsAppLeadStatus.NEW, WhatsAppLeadStatus.CONTACTED],
                ],
              },
              1,
              0,
            ],
          },
        },
        lastClickAt: { $max: "$createdAt" },
      },
    },
    { $sort: { clicks: -1, lastClickAt: -1 } },
    { $limit: WHATSAPP_LEAD_LIMITS.topProducts },
  ]);

  return rows.map((row) => ({
    key: String(row._id),
    name: row.name || String(row._id),
    clicks: row.clicks,
    ordered: row.ordered,
    open: row.open,
    lastClickAt: toIso(row.lastClickAt),
  }));
}

export async function getRecentWhatsAppLeads(): Promise<WhatsAppLeadRow[]> {
  await connectDb();
  const leads = await WhatsAppClickModel.find()
    .sort({ createdAt: -1 })
    .limit(WHATSAPP_LEAD_LIMITS.recentItems)
    .lean();

  return leads.map((lead) => {
    const attribution = lead.attribution as CampaignAttribution | undefined;
    const items = (lead.items ?? []) as WhatsAppLeadItem[];
    return {
      id: String(lead._id),
      status: (lead.status as WhatsAppLeadStatus) ?? WhatsAppLeadStatus.NEW,
      context:
        (lead.context as WhatsAppLeadContext) ?? WhatsAppLeadContext.PRODUCT,
      pagePath: String(lead.pagePath ?? ATTRIBUTION_COPY.empty),
      itemsSummary: summarizeItems(items),
      productKeys: [
        ...new Set(items.map(productKey).filter(Boolean)),
      ],
      estimatedTotal: Number(lead.estimatedTotal) || 0,
      customer: lead.userName || WHATSAPP_LEAD_LIMITS.guestLabel,
      userEmail: lead.userEmail || undefined,
      attributionLine: formatAttributionLine(attribution),
      createdAt: toIso(lead.createdAt),
    };
  });
}
