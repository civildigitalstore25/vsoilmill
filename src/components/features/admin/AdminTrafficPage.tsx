import {
  IndianRupee,
  MousePointerClick,
  Percent,
  ShoppingBag,
} from "lucide-react";
import { AdminTrafficRecent } from "@/components/features/admin/AdminTrafficRecent";
import { AdminTrafficTables } from "@/components/features/admin/AdminTrafficTables";
import { AdminPageHeader, AdminStatCard } from "@/components/features/admin/AdminUi";
import { ADMIN_TRAFFIC_COPY } from "@/constants/admin-traffic";
import { getTrafficActivity } from "@/lib/attribution/activity";
import { formatConversionRate } from "@/lib/attribution/labels";
import { getTrafficReport } from "@/lib/attribution/report";
import { formatInr } from "@/lib/utils/format";

export async function AdminTrafficPage() {
  const [report, activity] = await Promise.all([
    getTrafficReport(),
    getTrafficActivity(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_TRAFFIC_COPY.title}
        description={ADMIN_TRAFFIC_COPY.description}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label={ADMIN_TRAFFIC_COPY.visitsLabel}
          value={String(report.summary.visits)}
          hint={ADMIN_TRAFFIC_COPY.visitsHint}
          tone="primary"
          icon={<MousePointerClick className="h-5 w-5" />}
        />
        <AdminStatCard
          label={ADMIN_TRAFFIC_COPY.ordersLabel}
          value={String(report.summary.orders)}
          hint={ADMIN_TRAFFIC_COPY.ordersHint}
          tone="accent"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <AdminStatCard
          label={ADMIN_TRAFFIC_COPY.revenueLabel}
          value={formatInr(report.summary.revenue)}
          hint={ADMIN_TRAFFIC_COPY.revenueHint}
          tone="dark"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <AdminStatCard
          label={ADMIN_TRAFFIC_COPY.conversionLabel}
          value={formatConversionRate(report.summary.visits, report.summary.orders)}
          hint={ADMIN_TRAFFIC_COPY.conversionHint}
          tone="muted"
          icon={<Percent className="h-5 w-5" />}
        />
      </div>

      <AdminTrafficTables sources={report.sources} campaigns={report.campaigns} />
      <AdminTrafficRecent visits={activity.visits} orders={activity.recentOrders} />
    </div>
  );
}
