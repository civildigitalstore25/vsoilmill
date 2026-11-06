import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { AUTH_ERRORS } from "@/constants/auth";
import { requireAdmin } from "@/lib/auth/require-admin";
import { syncOrderTracking } from "@/lib/shipping/sync-tracking";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: AUTH_ERRORS.notFound }, { status: 404 });
    }
    const result = await syncOrderTracking(id);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Could not fetch status from ST Courier" },
        { status: 502 },
      );
    }
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : AUTH_ERRORS.updateFailed },
      { status: 500 },
    );
  }
}