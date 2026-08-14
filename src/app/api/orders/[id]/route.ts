import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";
import { USER_ROLES } from "@/constants/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDb();
    const order = await OrderModel.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = JSON.parse(JSON.stringify(order));
    if (
      data.userId !== session.user.id &&
      session.user.role !== USER_ROLES.ADMIN
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
