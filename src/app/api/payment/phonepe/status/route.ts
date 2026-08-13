import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { getPhonePeStatus } from "@/lib/payment/phonepe";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const merchantOrderId = body.merchantOrderId as string | undefined;
    if (!merchantOrderId) {
      return NextResponse.json(
        { error: "merchantOrderId required" },
        { status: 400 },
      );
    }

    await connectDb();
    const order = await OrderModel.findOne({ phonepeMerchantOrderId: merchantOrderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!process.env.PHONEPE_CLIENT_ID) {
      return NextResponse.json({
        data: { paymentStatus: order.paymentStatus, demoMode: true },
      });
    }

    const status = await getPhonePeStatus(merchantOrderId);
    if (status.success) {
      order.paymentStatus = PaymentStatus.PAID;
      order.status = "CONFIRMED";
      await order.save();
    } else if (status.state === "FAILED") {
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();
    }

    return NextResponse.json({
      data: {
        paymentStatus: order.paymentStatus,
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
