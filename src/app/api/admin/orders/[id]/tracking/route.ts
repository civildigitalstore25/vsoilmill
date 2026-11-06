import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { AUTH_ERRORS } from "@/constants/auth";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { normalizeConsignment, ST_COURIER_NAME } from "@/lib/shipping/st-courier";
import { OrderModel } from "@/models/Order";
import { OrderStatus, PaymentStatus } from "@/types/order";

type Params = { params: Promise<{ id: string }> };

const PRE_SHIPPED_STATUSES: string[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
];

function trackingPayload(order: {
  _id: unknown;
  status?: string;
  trackingNumber?: string | null;
  courier?: string | null;
  trackingStatus?: string | null;
  trackingLastCheckedAt?: Date | null;
  shippedAt?: Date | null;
}) {
  return {
    id: String(order._id),
    status: order.status,
    trackingNumber: order.trackingNumber ?? null,
    courier: order.courier ?? null,
    trackingStatus: order.trackingStatus ?? null,
    trackingLastCheckedAt: order.trackingLastCheckedAt ?? null,
    shippedAt: order.shippedAt ?? null,
  };
}

function errorResponse(error: unknown) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : AUTH_ERRORS.updateFailed },
    { status: 500 },
  );
}

export async function GET(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: AUTH_ERRORS.notFound }, { status: 404 });
    }
    await connectDb();
    const order = await OrderModel.findById(id).lean<Parameters<typeof trackingPayload>[0]>();
    if (!order) {
      return NextResponse.json({ error: AUTH_ERRORS.notFound }, { status: 404 });
    }
    return NextResponse.json({ data: trackingPayload(order) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: AUTH_ERRORS.notFound }, { status: 404 });
    }
    const body = (await request.json().catch(() => ({}))) as { trackingNumber?: unknown };
    const trackingNumber = normalizeConsignment(body.trackingNumber);
    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Consignment number must be exactly 11 digits" },
        { status: 400 },
      );
    }

    await connectDb();
    const order = await OrderModel.findById(id);
    if (!order) {
      return NextResponse.json({ error: AUTH_ERRORS.notFound }, { status: 404 });
    }
    if (order.paymentStatus !== PaymentStatus.PAID) {
      return NextResponse.json(
        { error: "Tracking can be added only for paid orders" },
        { status: 400 },
      );
    }

    const duplicate = await OrderModel.exists({
      trackingNumber,
      _id: { $ne: order._id },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "This consignment number is already used on another order" },
        { status: 409 },
      );
    }

    const changed = order.trackingNumber !== trackingNumber;
    order.trackingNumber = trackingNumber;
    order.courier = ST_COURIER_NAME;
    if (changed) {
      order.trackingStatus = undefined;
      order.trackingLastCheckedAt = undefined;
    }
    order.trackingUpdatedAt = new Date();
    if (PRE_SHIPPED_STATUSES.includes(order.status)) {
      order.status = OrderStatus.SHIPPED;
      order.shippedAt = new Date();
    }
    await order.save();

    return NextResponse.json({ data: trackingPayload(order.toObject()) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: AUTH_ERRORS.notFound }, { status: 404 });
    }
    await connectDb();
    const order = await OrderModel.findByIdAndUpdate(
      id,
      {
        $unset: {
          trackingNumber: 1,
          courier: 1,
          trackingStatus: 1,
          trackingLastCheckedAt: 1,
        },
        $set: { trackingUpdatedAt: new Date() },
      },
      { new: true },
    ).lean<Parameters<typeof trackingPayload>[0]>();
    if (!order) {
      return NextResponse.json({ error: AUTH_ERRORS.notFound }, { status: 404 });
    }
    return NextResponse.json({ data: trackingPayload(order) });
  } catch (error) {
    return errorResponse(error);
  }
}