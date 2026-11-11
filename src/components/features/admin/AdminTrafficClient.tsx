"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import {
  CheckCircle2,
  IndianRupee,
  MessageCircle,
  MousePointerClick,
  Percent,
  ShoppingBag,
  Users,
} from "lucide-react";
import { AdminTrafficRecent } from "@/components/features/admin/AdminTrafficRecent";
import { AdminTrafficTables } from "@/components/features/admin/AdminTrafficTables";
import { AdminWhatsAppLeads } from "@/components/features/admin/AdminWhatsAppLeads";
import { AdminStatCard } from "@/components/features/admin/AdminUi";
import {
  ADMIN_TRAFFIC_COPY,
  ADMIN_TRAFFIC_TABS,
} from "@/constants/admin-traffic";
import { ROUTES } from "@/constants/routes";
import { formatConversionRate } from "@/lib/attribution/labels";
import { formatInr } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type {
  TrafficCampaignRow,
  TrafficOrderRow,
  TrafficSourceRow,
  TrafficSummary,
  TrafficVisitRow,
} from "@/types/attribution";
import type {
  WhatsAppLeadRow,
  WhatsAppLeadSummary,
  WhatsAppProductStat,
} from "@/types/whatsapp-lead";

const TAB_TRIGGER =
  "inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-muted transition-all data-[state=active]:bg-primary data-[state=active]:font-semibold data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm";

type TrafficTab =
  (typeof ADMIN_TRAFFIC_TABS)[keyof typeof ADMIN_TRAFFIC_TABS];

export function AdminTrafficClient({
  summary,
  sources,
  campaigns,
  visits,
  orders,
  whatsappSummary,
  whatsappLeads,
  whatsappProducts,
}: {
  summary: TrafficSummary;
  sources: TrafficSourceRow[];
  campaigns: TrafficCampaignRow[];
  visits: TrafficVisitRow[];
  orders: TrafficOrderRow[];
  whatsappSummary: WhatsAppLeadSummary;
  whatsappLeads: WhatsAppLeadRow[];
  whatsappProducts: WhatsAppProductStat[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TrafficTab>(ADMIN_TRAFFIC_TABS.campaigns);

  useEffect(() => {
    const value = searchParams.get("tab");
    if (
      value === ADMIN_TRAFFIC_TABS.campaigns ||
      value === ADMIN_TRAFFIC_TABS.whatsapp
    ) {
      setTab(value);
    }
  }, [searchParams]);

  function onTabChange(value: string) {
    const next =
      value === ADMIN_TRAFFIC_TABS.whatsapp
        ? ADMIN_TRAFFIC_TABS.whatsapp
        : ADMIN_TRAFFIC_TABS.campaigns;
    setTab(next);
    router.push(`${ROUTES.ADMIN.TRAFFIC}?tab=${next}`, { scroll: false });
  }

  return (
    <Tabs.Root value={tab} onValueChange={onTabChange} className="mt-2">
      <Tabs.List className="mb-6 inline-flex h-11 w-full max-w-md gap-1 rounded-full border border-border bg-cream p-1 sm:w-fit">
        <Tabs.Trigger
          value={ADMIN_TRAFFIC_TABS.campaigns}
          className={cn(TAB_TRIGGER, "flex-1 sm:flex-none")}
        >
          <MousePointerClick className="h-4 w-4" />
          {ADMIN_TRAFFIC_COPY.tabCampaigns}
        </Tabs.Trigger>
        <Tabs.Trigger
          value={ADMIN_TRAFFIC_TABS.whatsapp}
          className={cn(TAB_TRIGGER, "flex-1 sm:flex-none")}
        >
          <MessageCircle className="h-4 w-4" />
          {ADMIN_TRAFFIC_COPY.tabWhatsapp}
          {whatsappSummary.open > 0 ? (
            <span className="rounded-full bg-accent/80 px-1.5 py-0.5 text-[10px] font-bold leading-none text-dark">
              {whatsappSummary.open}
            </span>
          ) : null}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        value={ADMIN_TRAFFIC_TABS.campaigns}
        className="focus-visible:outline-none"
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label={ADMIN_TRAFFIC_COPY.visitsLabel}
            value={String(summary.visits)}
            hint={ADMIN_TRAFFIC_COPY.visitsHint}
            tone="primary"
            icon={<MousePointerClick className="h-5 w-5" />}
          />
          <AdminStatCard
            label={ADMIN_TRAFFIC_COPY.ordersLabel}
            value={String(summary.orders)}
            hint={ADMIN_TRAFFIC_COPY.ordersHint}
            tone="accent"
            icon={<ShoppingBag className="h-5 w-5" />}
          />
          <AdminStatCard
            label={ADMIN_TRAFFIC_COPY.revenueLabel}
            value={formatInr(summary.revenue)}
            hint={ADMIN_TRAFFIC_COPY.revenueHint}
            tone="dark"
            icon={<IndianRupee className="h-5 w-5" />}
          />
          <AdminStatCard
            label={ADMIN_TRAFFIC_COPY.conversionLabel}
            value={formatConversionRate(summary.visits, summary.orders)}
            hint={ADMIN_TRAFFIC_COPY.conversionHint}
            tone="muted"
            icon={<Percent className="h-5 w-5" />}
          />
        </div>
        <AdminTrafficTables sources={sources} campaigns={campaigns} />
        <AdminTrafficRecent visits={visits} orders={orders} />
      </Tabs.Content>

      <Tabs.Content
        value={ADMIN_TRAFFIC_TABS.whatsapp}
        className="focus-visible:outline-none"
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminStatCard
            label={ADMIN_TRAFFIC_COPY.whatsappClicksLabel}
            value={String(whatsappSummary.clicks)}
            hint={ADMIN_TRAFFIC_COPY.whatsappClicksHint}
            tone="primary"
            icon={<MessageCircle className="h-5 w-5" />}
          />
          <AdminStatCard
            label={ADMIN_TRAFFIC_COPY.whatsappOpenLabel}
            value={String(whatsappSummary.open)}
            hint={ADMIN_TRAFFIC_COPY.whatsappOpenHint}
            tone="accent"
            icon={<Users className="h-5 w-5" />}
          />
          <AdminStatCard
            label={ADMIN_TRAFFIC_COPY.whatsappOrderedLabel}
            value={String(whatsappSummary.ordered)}
            hint={ADMIN_TRAFFIC_COPY.whatsappOrderedHint}
            tone="dark"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        </div>
        <AdminWhatsAppLeads
          leads={whatsappLeads}
          products={whatsappProducts}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}
