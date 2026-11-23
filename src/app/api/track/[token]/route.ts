import { NextResponse } from "next/server";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { connectDb } from "@/lib/db/mongoose";
import { shortManualId } from "@/lib/manual-shipments/token";
import { ST_COURIER_NAME } from "@/lib/shipping/st-courier";
import { getStCourierTrackingCached } from "@/lib/shipping/sync-tracking";
import { ManualShipmentModel } from "@/models/ManualShipment";
import { ManualShipmentStatus } from "@/types/manual-shipment";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Props) {
  try {
    const { token } = await params;
    const clean = token?.trim();
    if (!clean || clean.length < 12) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.trackMissing },
        { status: 404 },
      );
    }

    await connectDb();
    const shipment = await ManualShipmentModel.findOne({
      publicTrackToken: clean,
    }).lean();
    if (!shipment || Array.isArray(shipment)) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.trackMissing },
        { status: 404 },
      );
    }

    const id = String(shipment._id);
    if (!shipment.trackingNumber) {
      return NextResponse.json(
        {
          data: {
            shortId: shortManualId(id),
            customerName: shipment.customer?.name,
            trackingNumber: null,
            courier: shipment.courier || ST_COURIER_NAME,
            pending: true,
            message: MANUAL_SHIPMENT_COPY.notShipped,
          },
        },
        { status: 200 },
      );
    }

    const result = await getStCourierTrackingCached(shipment.trackingNumber);
    if (!result) {
      return NextResponse.json(
        { error: "Couldn't load live status right now" },
        { status: 502 },
      );
    }

    if (result.data.delivered && shipment.status !== ManualShipmentStatus.DELIVERED) {
      await ManualShipmentModel.findByIdAndUpdate(id, {
        status: ManualShipmentStatus.DELIVERED,
      }).catch(() => undefined);
    }

    return NextResponse.json({
      data: {
        shortId: shortManualId(id),
        customerName: shipment.customer?.name,
        trackingNumber: shipment.trackingNumber,
        courier: shipment.courier || ST_COURIER_NAME,
        pending: false,
        status: result.data.status,
        delivered: result.data.delivered,
        summary: result.data.summary,
        events: result.data.events,
        fetchedAt: result.fetchedAt.toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
