import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { normalizeConsignment, ST_COURIER_NAME } from "@/lib/shipping/st-courier";
import { getStCourierTrackingCached } from "@/lib/shipping/sync-tracking";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const awb = normalizeConsignment(new URL(request.url).searchParams.get("awb") ?? "");
  if (!awb) {
    return NextResponse.json(
      { error: "Consignment number must be exactly 11 digits" },
      { status: 400 },
    );
  }

  try {
    const result = await getStCourierTrackingCached(awb);
    if (!result) {
      return NextResponse.json(
        { error: "Couldn't load live status right now" },
        { status: 502 },
      );
    }
    return NextResponse.json({
      data: {
        trackingNumber: awb,
        courier: ST_COURIER_NAME,
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