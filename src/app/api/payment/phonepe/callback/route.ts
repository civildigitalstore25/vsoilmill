import { NextResponse } from "next/server";
import { PAYMENT_ERRORS } from "@/constants/payment";
import { connectDb } from "@/lib/db/mongoose";
import { markOrderPaid } from "@/lib/orders/mark-paid";
import { verifyPhonePeCallbackAuth } from "@/lib/payment/callback-auth";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";

type WebhookBody = {
  event?: string;
  payload?: {
    merchantOrderId?: string;
    originalMerchantOrderId?: string;
    orderId?: string;
    state?: string;
    paymentDetails?: Array<{ transactionId?: string }>;
  };
  // legacy / flexible shapes
  data?: {
    merchantTransactionId?: string;
    merchantOrderId?: string;
    state?: string;
    transactionId?: string;
  };
  merchantOrderId?: string;
  merchantTransactionId?: string;
  code?: string;
  success?: boolean;
};

function extractMerchantOrderId(body: WebhookBody): string | undefined {
  return (
    body.payload?.originalMerchantOrderId ??
    body.payload?.merchantOrderId ??
    body.data?.merchantOrderId ??
    body.data?.merchantTransactionId ??
    body.merchantOrderId ??
    body.merchantTransactionId
  );
}

function isSuccess(body: WebhookBody): boolean {
  const state = body.payload?.state ?? body.data?.state ?? body.code;
  return (
    body.event === "checkout.order.completed" ||
    body.event === "pg.order.completed" ||
    state === "COMPLETED" ||
    state === "PAYMENT_SUCCESS" ||
    state === "SUCCESS" ||
    body.success === true
  );
}

function isFailed(body: WebhookBody): boolean {
  const state = body.payload?.state ?? body.data?.state;
  return (
    body.event === "checkout.order.failed" ||
    body.event === "pg.order.failed" ||
    state === "FAILED"
  );
}

export async function POST(request: Request) {
  try {
    const authResult = verifyPhonePeCallbackAuth(request);
    if (!authResult.ok) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as WebhookBody;
    const merchantOrderId = extractMerchantOrderId(body);

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

    if (isSuccess(body)) {
      const transactionId =
        body.payload?.paymentDetails?.[0]?.transactionId ??
        body.payload?.orderId ??
        body.data?.transactionId;
      await markOrderPaid({
        orderId: String(order._id),
        transactionId: transactionId ?? undefined,
      });
    } else if (isFailed(body)) {
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
