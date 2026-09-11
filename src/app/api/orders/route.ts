import { connectDb } from "@/lib/db/mongoose";
import { getCouponDiscount } from "@/lib/orders/coupons";
import { resolveOrderItemsFromCatalog } from "@/lib/orders/inventory";
import { calculatePricing } from "@/lib/orders/pricing";
import { OrderModel } from "@/models/Order";
import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional().or(z.literal("")),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
    country: z.string().default("India"),
  }),
  couponCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const resolved = await resolveOrderItemsFromCatalog(parsed.data.items);
    if ("error" in resolved) {
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }

    const subtotal = resolved.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const coupon = getCouponDiscount(parsed.data.couponCode, subtotal);
    if (coupon.error) {
      return NextResponse.json({ error: coupon.error }, { status: 400 });
    }
    const pricing = calculatePricing(subtotal, coupon.discount);

    const order = await OrderModel.create({
      userId: session.user.id,
      items: resolved.items.map(({ sku: _sku, ...item }) => item),
      shippingAddress: {
        ...parsed.data.shippingAddress,
        email: parsed.data.shippingAddress.email || undefined,
      },
      pricing,
      couponCode: coupon.code,
      status: "PENDING",
      paymentStatus: "PENDING",
      stockDecremented: false,
    });

    return NextResponse.json({ data: JSON.parse(JSON.stringify(order)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDb();
    const orders = await OrderModel.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data: JSON.parse(JSON.stringify(orders)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
