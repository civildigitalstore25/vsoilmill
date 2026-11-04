import Link from "next/link";
import { AdminTrackAnyConsignment } from "@/components/features/admin/AdminTrackAnyConsignment";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { ShipmentTrackingView } from "@/components/features/shipping/ShipmentTrackingView";
import { Button } from "@/components/ui/button";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
import { normalizeConsignment } from "@/lib/shipping/st-courier";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ awb?: string | string[] }> };

export default async function AdminTrackingPage({ searchParams }: Props) {
  const { awb: rawAwb } = await searchParams;
  const awb = normalizeConsignment(Array.isArray(rawAwb) ? rawAwb[0] : rawAwb);

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_ORDERS_COPY.trackingPageTitle}
        description={ADMIN_ORDERS_COPY.trackingPageDescription}
        actions={
          <Button variant="outline" asChild>
            <Link href={ROUTES.ADMIN.ORDERS}>{ADMIN_ORDERS_COPY.backToOrders}</Link>
          </Button>
        }
      />
      <div className="mb-6">
        <AdminTrackAnyConsignment key={awb ?? "empty"} initialValue={awb ?? ""} />
      </div>
      {awb ? (
        <ShipmentTrackingView
          key={awb}
          endpoint={API_ENDPOINTS.ADMIN_TRACKING(awb)}
          trackingNumber={awb}
        />
      ) : (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {rawAwb ? ADMIN_ORDERS_COPY.trackingInvalid : ADMIN_ORDERS_COPY.trackingPageEmpty}
        </AdminCard>
      )}
    </div>
  );
}