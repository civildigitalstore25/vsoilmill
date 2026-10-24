import { NextResponse } from "next/server";
import { z } from "zod";
import { AUTH_ERRORS } from "@/constants/auth";
import { ASSETS } from "@/constants/assets";
import { DEFAULT_SHIPPING_COUNTRY } from "@/constants/checkout";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  calculatePricing,
  pricingFlagsFromLines,
} from "@/lib/orders/pricing";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { OrderStatus, PaymentStatus } from "@/types/order";

const statusEnum = z.nativeEnum(OrderStatus);
const paymentEnum = z.nativeEnum(PaymentStatus);

const patchSchema = z.object({
  id: z.string(),
  status: statusEnum.optional(),
  paymentStatus: paymentEnum.optional(),
  notes: z.string().optional(),
  trackingNumber: z.string().optional(),
  courier: z.string().optional(),
});

const createSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional().or(z.literal("")),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
    country: z.string().default(DEFAULT_SHIPPING_COUNTRY),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  status: statusEnum.optional(),
  paymentStatus: paymentEnum.optional(),
  notes: z.string().optional(),
});

type LeanProduct = {
  _id: { toString(): string };
  name: string;
  images?: string[];
  gstExempt?: boolean;
  variants: {
    _id: { toString(): string };
    label: string;
    price: number;
  }[];
};

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: AUTH_ERRORS.invalidInput },
        { status: 400 },
      );
    }

    await connectDb();
    const lineItems = [];
    for (const item of parsed.data.items) {
      const product = (await ProductModel.findById(
        item.productId,
      ).lean()) as LeanProduct | null;
      if (!product) {
        return NextResponse.json(
          { error: AUTH_ERRORS.invalidInput },
          { status: 400 },
        );
      }
      const variant = product.variants.find(
        (entry: LeanProduct["variants"][number]) =>
          String(entry._id) === item.variantId,
      );
      if (!variant) {
        return NextResponse.json(
          { error: AUTH_ERRORS.invalidInput },
          { status: 400 },
        );
      }
      lineItems.push({
        productId: product._id,
        variantId: String(variant._id),
        name: product.name,
        variantLabel: variant.label,
        image: product.images?.[0] ?? ASSETS.PLACEHOLDER_PRODUCT,
        price: variant.price,
        quantity: item.quantity,
        gstExempt: Boolean(product.gstExempt),
      });
    }

    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const flags = pricingFlagsFromLines(lineItems);
    const order = await OrderModel.create({
      items: lineItems.map((line) => {
        const { gstExempt, ...item } = line;
        void gstExempt;
        return item;
      }),
      shippingAddress: {
        ...parsed.data.shippingAddress,
        email: parsed.data.shippingAddress.email || undefined,
      },
      pricing: calculatePricing(subtotal, 0, flags),
      status: parsed.data.status ?? OrderStatus.PENDING,
      paymentStatus: parsed.data.paymentStatus ?? PaymentStatus.PENDING,
      notes: parsed.data.notes,
    });

    return NextResponse.json({ data: JSON.parse(JSON.stringify(order)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : AUTH_ERRORS.createFailed },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: AUTH_ERRORS.invalidInput },
        { status: 400 },
      );
    }
    const { id, ...updates } = parsed.data;
    await connectDb();

    if (updates.paymentStatus === PaymentStatus.PAID) {
      const { markOrderPaid } = await import("@/lib/orders/mark-paid");
      await markOrderPaid({ orderId: id });
      const { paymentStatus, ...rest } = updates;
      void paymentStatus;
      if (Object.keys(rest).length) {
        await OrderModel.findByIdAndUpdate(id, rest);
      }
      const order = await OrderModel.findById(id).lean();
      return NextResponse.json({ data: JSON.parse(JSON.stringify(order)) });
    }

    const previous = await OrderModel.findById(id).lean();
    const order = await OrderModel.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (
      order &&
      !Array.isArray(order) &&
      updates.status &&
      previous &&
      !Array.isArray(previous) &&
      previous.status !== updates.status
    ) {
      const { sendOrderStatusEmail } = await import("@/lib/email/send");
      void sendOrderStatusEmail(
        order as {
          _id: { toString(): string };
          shippingAddress?: {
            email?: string;
            fullName?: string;
          };
          pricing?: { total?: number };
          trackingNumber?: string;
          courier?: string;
        },
        updates.status,
      ).catch(() => undefined);
    }

    return NextResponse.json({ data: JSON.parse(JSON.stringify(order)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : AUTH_ERRORS.updateFailed },
      { status: 500 },
    );
  }
}
