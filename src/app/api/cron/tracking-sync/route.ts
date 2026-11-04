import { NextResponse } from "next/server";
import { syncShippedOrders } from "@/lib/shipping/sync-tracking";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await syncShippedOrders();
    return NextResponse.json({ data: summary });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tracking sync failed" },
      { status: 500 },
    );
  }
}