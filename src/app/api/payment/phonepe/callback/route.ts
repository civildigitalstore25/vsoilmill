import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const merchantOrderId =
      body?.data?.merchantTransactionId ??
      body?.merchantTransactionId ??
      body?.merchantOrderId;

    if (!merchantOrderId) {
      return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
    }

    await connectDb();
    const order = await OrderModel.findOne({
      phonepeMerchantOrderId: merchantOrderId,
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const code = body?.code ?? body?.data?.state;
    const success =
      body?.success === true ||
      code === "PAYMENT_SUCCESS" ||
      code === "COMPLETED" ||
      code === "SUCCESS";

    if (success) {
      order.paymentStatus = PaymentStatus.PAID;
      order.status = "CONFIRMED";
      order.phonepeTransactionId =
        body?.data?.transactionId ?? body?.transactionId;
      await order.save();
    } else {
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Callback failed" },
      { status: 500 },
    );
  }
}
