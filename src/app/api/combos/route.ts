import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { slugify, stripHtml } from "@/lib/utils/format";
import { ComboModel } from "@/models/Combo";

const itemSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive(),
  productName: z.string().optional(),
  variantLabel: z.string().optional(),
  isCustom: z.boolean().optional(),
  customPrice: z.number().optional(),
  customImage: z.string().optional(),
});

const comboSchema = z.object({
  name: z.string().refine((value) => stripHtml(value).length >= 2, "Name is required"),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  price: z.number().positive(),
  originalPrice: z.number().nonnegative(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  items: z
    .array(itemSchema)
    .min(1)
    .refine((items) =>
      items.every((item) =>
        item.isCustom
          ? Boolean(item.productName && stripHtml(item.productName).length >= 2)
          : Boolean(item.productId && item.variantId),
      ),
    ),
});

export async function GET() {
  await connectDb();
  const combos = await ComboModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: JSON.parse(JSON.stringify(combos)) });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  const parsed = comboSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid combo" }, { status: 400 });
  }
  await connectDb();
  const combo = await ComboModel.create({
    ...parsed.data,
    slug: slugify(stripHtml(parsed.data.name)),
    startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined,
    endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
  });
  return NextResponse.json({ data: JSON.parse(JSON.stringify(combo)) });
}
