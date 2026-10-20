import { NextResponse } from "next/server";
import { z } from "zod";
import { PAYMENT_ERRORS } from "@/constants/payment";
import { connectDb } from "@/lib/db/mongoose";
import { auth } from "@/lib/auth/auth";
import { createPhonePePayment } from "@/lib/payment/phonepe";
import { resolveSiteUrl } from "@/lib/payment/site-url";
import { OrderModel } from "@/models/Order";

const schema = z.object({
  orderId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: PAYMENT_ERRORS.CREDENTIALS_MISSING },
        { status: 503 },
      );
    }

    await connectDb();
    const order = await OrderModel.findById(parsed.data.orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (String(order.userId) !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const siteUrl = resolveSiteUrl(request);
    const merchantOrderId = `VS-${String(order._id).slice(-10)}-${Date.now().toString().slice(-6)}`;
    order.phonepeMerchantOrderId = merchantOrderId;
    await order.save();

    const result = await createPhonePePayment({
      merchantOrderId,
      amountInPaise: Math.round(order.pricing.total * 100),
      redirectUrl: `${siteUrl}/orders/${order._id}/confirmation`,
    });

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error || PAYMENT_ERRORS.INIT_FAILED },
        { status: 502 },
      );
    }

    if (result.phonepeOrderId) {
      order.phonepeTransactionId = result.phonepeOrderId;
      await order.save();
    }

    return NextResponse.json({
      data: { redirectUrl: result.redirectUrl, merchantOrderId },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 },
    );
  }
}
