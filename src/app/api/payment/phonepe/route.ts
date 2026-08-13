import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { createPhonePePayment } from "@/lib/payment/phonepe";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";

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

    await connectDb();
    const order = await OrderModel.findById(parsed.data.orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const merchantOrderId = `VS${String(order._id).slice(-10)}${Date.now().toString().slice(-4)}`;
    order.phonepeMerchantOrderId = merchantOrderId;
    await order.save();

    const result = await createPhonePePayment({
      merchantOrderId,
      amountInPaise: Math.round(order.pricing.total * 100),
      redirectUrl: `${siteUrl}/orders/${order._id}/confirmation`,
      callbackUrl: `${siteUrl}/api/payment/phonepe/callback`,
    });

    if ("error" in result) {
      // Demo/dev fallback when credentials missing
      if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET) {
        order.paymentStatus = PaymentStatus.PAID;
        order.status = "CONFIRMED";
        await order.save();
        return NextResponse.json({
          data: {
            demoMode: true,
            orderId: order._id,
            message: result.error,
          },
        });
      }
      return NextResponse.json({ error: result.error }, { status: 502 });
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
