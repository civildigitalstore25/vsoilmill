import { Suspense } from "react";
import { AdminTrafficClient } from "@/components/features/admin/AdminTrafficClient";
import { AdminPageHeader } from "@/components/features/admin/AdminUi";
import { ADMIN_TRAFFIC_COPY } from "@/constants/admin-traffic";
import { getTrafficActivity } from "@/lib/attribution/activity";
import { getTrafficReport } from "@/lib/attribution/report";
import {
  getRecentWhatsAppLeads,
  getWhatsAppLeadSummary,
  getWhatsAppProductStats,
} from "@/lib/whatsapp-leads/queries";

export async function AdminTrafficPage() {
  const [report, activity, whatsappSummary, whatsappLeads, whatsappProducts] =
    await Promise.all([
      getTrafficReport(),
      getTrafficActivity(),
      getWhatsAppLeadSummary(),
      getRecentWhatsAppLeads(),
      getWhatsAppProductStats(),
    ]);

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_TRAFFIC_COPY.title}
        description={ADMIN_TRAFFIC_COPY.description}
      />
      <Suspense fallback={null}>
        <AdminTrafficClient
          summary={report.summary}
          sources={report.sources}
          campaigns={report.campaigns}
          visits={activity.visits}
          orders={activity.recentOrders}
          whatsappSummary={whatsappSummary}
          whatsappLeads={whatsappLeads}
          whatsappProducts={whatsappProducts}
        />
      </Suspense>
    </div>
  );
}
