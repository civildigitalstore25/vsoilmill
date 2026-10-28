import { ATTRIBUTION_LIMITS } from "@/constants/attribution";
import { connectDb } from "@/lib/db/mongoose";
import { normalizeAttribution } from "@/lib/attribution/parse";
import { validateAndCalculateCouponDiscount } from "@/lib/orders/coupons";
import { resolveOrderItemsFromCatalog } from "@/lib/orders/inventory";
import {
  calculatePricing,
  pricingFlagsFromLines,
} from "@/lib/orders/pricing";
import { saveCheckoutAddressForUser } from "@/lib/user/save-checkout-address";
import { OrderModel } from "@/models/Order";
import { CouponModel } from "@/models/Coupon";
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
  attribution: z
    .object({
      source: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      medium: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      campaign: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      content: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      term: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      landingPath: z.string().max(ATTRIBUTION_LIMITS.pathMaxLength).optional(),
    })
    .optional(),
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
    const coupon = await validateAndCalculateCouponDiscount({
      code: parsed.data.couponCode,
      items: resolved.items.map((line) => ({
        productId: String(line.productId),
        variantId: String(line.variantId),
        price: line.price,
        quantity: line.quantity,
      })),
      subtotal,
    });
    if (coupon.error) {
      return NextResponse.json({ error: coupon.error }, { status: 400 });
    }
    const flags = pricingFlagsFromLines(resolved.items);
    const pricing = calculatePricing(subtotal, coupon.discount, flags);

    const shippingAddress = {
      ...parsed.data.shippingAddress,
      email: parsed.data.shippingAddress.email || undefined,
      country: parsed.data.shippingAddress.country || "India",
    };

    const attribution = normalizeAttribution(parsed.data.attribution);

    const order = await OrderModel.create({
      userId: session.user.id,
      items: resolved.items.map((line) => {
        const { sku, gstExempt, ...item } = line;
        void sku;
        void gstExempt;
        return item;
      }),
      shippingAddress,
      pricing,
      couponCode: coupon.code,
      ...(attribution ? { attribution } : {}),
      status: "PENDING",
      paymentStatus: "PENDING",
      stockDecremented: false,
    });

    if (coupon.couponDoc?._id) {
      await CouponModel.findByIdAndUpdate(coupon.couponDoc._id, {
        $inc: { timesUsed: 1 },
      }).catch(() => undefined);
    }

    await saveCheckoutAddressForUser(session.user.id, shippingAddress).catch(
      () => undefined,
    );

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
