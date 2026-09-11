import { NextResponse } from "next/server";
import { PAYMENT_ERRORS } from "@/constants/payment";
import { connectDb } from "@/lib/db/mongoose";
import { markOrderPaid } from "@/lib/orders/mark-paid";
import { verifyPhonePeCallbackAuth } from "@/lib/payment/callback-auth";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";

export async function POST(request: Request) {
  try {
    const authResult = verifyPhonePeCallbackAuth(request);
    if (!authResult.ok) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 },
      );
    }

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
      await markOrderPaid({
        orderId: String(order._id),
        transactionId:
          body?.data?.transactionId ?? body?.transactionId ?? undefined,
      });
    } else {
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED,
      },
      { status: 500 },
    );
  }
}
