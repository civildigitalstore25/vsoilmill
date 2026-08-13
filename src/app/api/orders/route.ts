import { connectDb } from "@/lib/db/mongoose";
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
        name: z.string(),
        variantLabel: z.string(),
        image: z.string().optional(),
        price: z.number().positive(),
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
    const subtotal = parsed.data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discount =
      parsed.data.couponCode?.toUpperCase() === "PURE10"
        ? Math.round(subtotal * 0.1)
        : 0;
    const pricing = calculatePricing(subtotal, discount);

    await connectDb();
    const order = await OrderModel.create({
      userId: session?.user?.id,
      items: parsed.data.items,
      shippingAddress: {
        ...parsed.data.shippingAddress,
        email: parsed.data.shippingAddress.email || undefined,
      },
      pricing,
      couponCode: parsed.data.couponCode,
      status: "PENDING",
      paymentStatus: "PENDING",
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
