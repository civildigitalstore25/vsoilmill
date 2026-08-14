import { NextResponse } from "next/server";
import { AUTH_ERRORS } from "@/constants/auth";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    await connectDb();
    const order = await OrderModel.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json(
        { error: AUTH_ERRORS.notFound },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : AUTH_ERRORS.updateFailed,
      },
      { status: 500 },
    );
  }
}
