import { NextResponse } from "next/server";
import { PAYMENT_ERRORS } from "@/constants/payment";
import { connectDb } from "@/lib/db/mongoose";
import { auth } from "@/lib/auth/auth";
import { markOrderPaid } from "@/lib/orders/mark-paid";
import { getPhonePeStatus } from "@/lib/payment/phonepe";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";
import { USER_ROLES } from "@/constants/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: PAYMENT_ERRORS.STATUS_UNAUTHORIZED },
        { status: 401 },
      );
    }

    if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: PAYMENT_ERRORS.CREDENTIALS_MISSING },
        { status: 503 },
      );
    }

    const body = await request.json();
    const merchantOrderId = body.merchantOrderId as string | undefined;
    if (!merchantOrderId) {
      return NextResponse.json(
        { error: "merchantOrderId required" },
        { status: 400 },
      );
    }

    await connectDb();
    const order = await OrderModel.findOne({
      phonepeMerchantOrderId: merchantOrderId,
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner =
      String(order.userId) === session.user.id ||
      session.user.role === USER_ROLES.ADMIN;
    if (!isOwner) {
      return NextResponse.json(
        { error: PAYMENT_ERRORS.STATUS_FORBIDDEN },
        { status: 403 },
      );
    }

    const status = await getPhonePeStatus(merchantOrderId);
    if (status.success) {
      await markOrderPaid({ orderId: String(order._id) });
    } else if (status.state === "FAILED") {
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();
    }

    const refreshed = await OrderModel.findById(order._id).lean();
    return NextResponse.json({
      data: {
        paymentStatus:
          refreshed && !Array.isArray(refreshed)
            ? refreshed.paymentStatus
            : order.paymentStatus,
        state: status.state,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 },
    );
  }
}
