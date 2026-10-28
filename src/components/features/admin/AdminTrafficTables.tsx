import { AdminCard } from "@/components/features/admin/AdminUi";
import { ADMIN_DASHBOARD_COPY } from "@/constants/admin";
import { ADMIN_TRAFFIC_COPY } from "@/constants/admin-traffic";
import { ATTRIBUTION_COPY } from "@/constants/attribution";
import { formatConversionRate } from "@/lib/attribution/labels";
import { formatInr, formatInrDateTime } from "@/lib/utils/format";
import type { TrafficCampaignRow, TrafficSourceRow } from "@/types/attribution";

function Headers({ labels }: { labels: readonly string[] }) {
  return (
    <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
      <tr>
        {labels.map((label) => (
          <th key={label} className="px-3 py-3 font-semibold">
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function AdminTrafficTables({
  sources,
  campaigns,
}: {
  sources: TrafficSourceRow[];
  campaigns: TrafficCampaignRow[];
}) {
  return (
    <div className="space-y-6">
      <AdminCard className="overflow-hidden p-6">
        <h2 className="font-display text-xl text-dark">{ADMIN_TRAFFIC_COPY.sourcesTitle}</h2>
        <p className="text-sm text-muted">{ADMIN_TRAFFIC_COPY.sourcesHint}</p>
        {sources.length === 0 ? (
          <p className="mt-5 rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
            {ADMIN_TRAFFIC_COPY.empty}
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <Headers
                labels={[
                  ADMIN_DASHBOARD_COPY.tableSource,
                  ADMIN_DASHBOARD_COPY.tableVisits,
                  ADMIN_DASHBOARD_COPY.tableOrders,
                  ADMIN_TRAFFIC_COPY.tablePaid,
                  ADMIN_TRAFFIC_COPY.tableConversion,
                  ADMIN_DASHBOARD_COPY.tableRevenue,
                ]}
              />
              <tbody>
                {sources.map((row) => (
                  <tr key={row.source} className="border-b border-border/70 last:border-0">
                    <td className="px-3 py-3 font-medium text-dark">{row.label}</td>
                    <td className="px-3 py-3 text-muted">{row.visits}</td>
                    <td className="px-3 py-3 text-muted">{row.orders}</td>
                    <td className="px-3 py-3 text-muted">{row.paidOrders}</td>
                    <td className="px-3 py-3 text-muted">
                      {formatConversionRate(row.visits, row.orders)}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-dark">
                      {formatInr(row.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminCard className="overflow-hidden p-6">
        <h2 className="font-display text-xl text-dark">{ADMIN_TRAFFIC_COPY.campaignsTitle}</h2>
        <p className="text-sm text-muted">{ADMIN_TRAFFIC_COPY.campaignsHint}</p>
        {campaigns.length === 0 ? (
          <p className="mt-5 rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
            {ADMIN_TRAFFIC_COPY.empty}
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <Headers
                labels={[
                  ADMIN_DASHBOARD_COPY.tableSource,
                  ADMIN_DASHBOARD_COPY.tableMedium,
                  ADMIN_DASHBOARD_COPY.tableCampaign,
                  ADMIN_DASHBOARD_COPY.tableContent,
                  ADMIN_TRAFFIC_COPY.tableTerm,
                  ADMIN_TRAFFIC_COPY.tableLanding,
                  ADMIN_DASHBOARD_COPY.tableVisits,
                  ADMIN_DASHBOARD_COPY.tableOrders,
                  ADMIN_TRAFFIC_COPY.tablePaid,
                  ADMIN_TRAFFIC_COPY.tableConversion,
                  ADMIN_DASHBOARD_COPY.tableRevenue,
                  ADMIN_TRAFFIC_COPY.tableLast,
                ]}
              />
              <tbody>
                {campaigns.map((row) => (
                  <tr
                    key={`${row.source}-${row.medium}-${row.campaign}-${row.content}-${row.term}-${row.landingPath}`}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-dark">{row.sourceLabel}</td>
                    <td className="px-3 py-3 text-muted">{row.medium}</td>
                    <td className="px-3 py-3 text-muted">{row.campaign}</td>
                    <td className="px-3 py-3 text-muted">{row.content}</td>
                    <td className="px-3 py-3 text-muted">{row.term}</td>
                    <td className="px-3 py-3 text-xs text-muted">{row.landingPath}</td>
                    <td className="px-3 py-3 text-muted">{row.visits}</td>
                    <td className="px-3 py-3 text-muted">{row.orders}</td>
                    <td className="px-3 py-3 text-muted">{row.paidOrders}</td>
                    <td className="px-3 py-3 text-muted">
                      {formatConversionRate(row.visits, row.orders)}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-dark">
                      {formatInr(row.revenue)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted">
                      {row.lastActivityAt
                        ? formatInrDateTime(row.lastActivityAt)
                        : ATTRIBUTION_COPY.empty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
