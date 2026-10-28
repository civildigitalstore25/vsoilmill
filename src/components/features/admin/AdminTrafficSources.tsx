import Link from "next/link";
import { AdminCard } from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_DASHBOARD_COPY } from "@/constants/admin";
import { getTrafficReport } from "@/lib/attribution/report";
import { formatConversionRate } from "@/lib/attribution/labels";
import { formatInr } from "@/lib/utils/format";
import { ROUTES } from "@/constants/routes";

export async function AdminTrafficSources() {
  const report = await getTrafficReport();

  return (
    <AdminCard className="mt-8 p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-dark">
            {ADMIN_DASHBOARD_COPY.trafficTitle}
          </h2>
          <p className="text-sm text-muted">{ADMIN_DASHBOARD_COPY.trafficHint}</p>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={ROUTES.ADMIN.TRAFFIC}>{ADMIN_DASHBOARD_COPY.viewTraffic}</Link>
        </Button>
      </div>
      {report.sources.length === 0 ? (
        <p className="rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
          {ADMIN_DASHBOARD_COPY.trafficEmpty}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="py-3 font-semibold">{ADMIN_DASHBOARD_COPY.tableSource}</th>
                <th className="py-3 font-semibold">{ADMIN_DASHBOARD_COPY.tableVisits}</th>
                <th className="py-3 font-semibold">{ADMIN_DASHBOARD_COPY.tableOrders}</th>
                <th className="py-3 text-right font-semibold">
                  {ADMIN_DASHBOARD_COPY.tableRevenue}
                </th>
              </tr>
            </thead>
            <tbody>
              {report.sources.map((row) => (
                <tr key={row.source} className="border-b border-border/70 last:border-0">
                  <td className="py-3 font-medium text-dark">{row.label}</td>
                  <td className="py-3 text-muted">{row.visits}</td>
                  <td className="py-3 text-muted">
                    {row.orders}
                    <span className="ml-2 text-xs">
                      {formatConversionRate(row.visits, row.orders)}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-dark">
                    {formatInr(row.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminCard>
  );
}
