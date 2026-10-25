import { validateAndCalculateCouponDiscount } from "@/lib/orders/coupons";
import { NextResponse } from "next/server";
import { z } from "zod";

const validateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      }),
    )
    .optional(),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const result = await validateAndCalculateCouponDiscount({
      code: parsed.data.code,
      items: parsed.data.items,
      subtotal: parsed.data.subtotal,
    });

    if (result.error) {
      return NextResponse.json({
        valid: false,
        error: result.error,
      });
    }

    return NextResponse.json({
      valid: true,
      data: {
        code: result.code,
        name: result.name,
        discountType: result.discountType,
        discountValue: result.discountValue,
        discount: result.discount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : "Failed to validate coupon",
      },
      { status: 500 },
    );
  }
}
