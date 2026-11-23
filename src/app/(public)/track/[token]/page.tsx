import { notFound } from "next/navigation";
import { ShipmentTrackingView } from "@/components/features/shipping/ShipmentTrackingView";
import { PageContainer } from "@/components/layout/PageContainer";
import { API_ENDPOINTS } from "@/constants/api";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { connectDb } from "@/lib/db/mongoose";
import { shortManualId } from "@/lib/manual-shipments/token";
import { ManualShipmentModel } from "@/models/ManualShipment";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function PublicTrackPage({ params }: Props) {
  const { token } = await params;
  const clean = token?.trim();
  if (!clean || clean.length < 12) notFound();

  await connectDb();
  const shipment = await ManualShipmentModel.findOne({
    publicTrackToken: clean,
  })
    .select("customer.name trackingNumber")
    .lean<{
      _id: unknown;
      customer?: { name?: string };
      trackingNumber?: string;
    }>();

  if (!shipment) notFound();

  const id = String(shipment._id);
  const shortId = shortManualId(id);
  const customerName = shipment.customer?.name;

  return (
    <PageContainer className="py-10">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-3xl text-dark">
          {MANUAL_SHIPMENT_COPY.trackTitle} #{shortId}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {MANUAL_SHIPMENT_COPY.trackSubtitle}
          {customerName ? ` · ${customerName}` : ""}
        </p>
      </div>

      <div className="mt-8">
        {shipment.trackingNumber ? (
          <ShipmentTrackingView
            endpoint={API_ENDPOINTS.PUBLIC_TRACK(clean)}
            trackingNumber={shipment.trackingNumber}
            title={MANUAL_SHIPMENT_COPY.trackTitle}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-cream/40 px-6 py-12 text-center text-sm text-muted">
            {MANUAL_SHIPMENT_COPY.notShipped}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
