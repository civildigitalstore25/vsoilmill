import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { CouponModel } from "@/models/Coupon";
import { NextResponse } from "next/server";
import { z } from "zod";

const couponSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .transform((val) => val.trim().toUpperCase()),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional().default(""),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).default("PERCENTAGE"),
  discountValue: z.number().min(0, "Discount value must be 0 or higher"),
  validFrom: z.string().min(1, "Valid from date is required"),
  validTo: z.string().min(1, "Valid to date is required"),
  usageLimit: z.number().int().min(0).default(0),
  applicableProducts: z.array(z.string()).default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    await connectDb();
    const coupons = await CouponModel.find()
      .populate("applicableProducts", "name images categoryId")
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();
    const total = coupons.length;
    const active = coupons.filter(
      (c) => c.status === "ACTIVE" && new Date(c.validTo) >= now,
    ).length;
    const expired = coupons.filter((c) => new Date(c.validTo) < now).length;
    const totalRedemptions = coupons.reduce(
      (sum, c) => sum + (c.timesUsed || 0),
      0,
    );

    return NextResponse.json({
      data: JSON.parse(JSON.stringify(coupons)),
      stats: {
        total,
        active,
        expired,
        totalRedemptions,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch coupons" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const body = await request.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid coupon data" },
        { status: 400 },
      );
    }

    await connectDb();
    const existing = await CouponModel.findOne({ code: parsed.data.code });
    if (existing) {
      return NextResponse.json(
        { error: "A coupon with this code already exists" },
        { status: 400 },
      );
    }

    const created = await CouponModel.create({
      code: parsed.data.code,
      name: parsed.data.name,
      description: parsed.data.description,
      discountType: parsed.data.discountType,
      discountValue: parsed.data.discountValue,
      validFrom: new Date(parsed.data.validFrom),
      validTo: new Date(parsed.data.validTo),
      usageLimit: parsed.data.usageLimit,
      timesUsed: 0,
      applicableProducts: parsed.data.applicableProducts,
      status: parsed.data.status,
    });

    const populated = await CouponModel.findById(created._id)
      .populate("applicableProducts", "name images categoryId")
      .lean();

    return NextResponse.json({ data: JSON.parse(JSON.stringify(populated)) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create coupon" },
      { status: 500 },
    );
  }
}
