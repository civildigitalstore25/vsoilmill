import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { slugify, stripHtml } from "@/lib/utils/format";
import { ComboModel } from "@/models/Combo";

const itemSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().positive().default(1),
  productName: z.string().optional(),
  variantLabel: z.string().optional(),
  isCustom: z.boolean().optional(),
  customPrice: z.coerce.number().optional(),
  customImage: z.string().optional(),
});

function parseSafeDate(value?: string | null): Date | undefined {
  if (!value || typeof value !== "string" || !value.trim()) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const comboSchema = z.object({
  name: z.string().refine((value) => stripHtml(value).length >= 2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  price: z.coerce.number().positive("Combo price must be greater than 0"),
  originalPrice: z.coerce.number().nonnegative("Original price must be 0 or more"),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  items: z
    .array(itemSchema)
    .min(1, "At least one item is required in the combo")
    .refine(
      (items) =>
        items.every((item) =>
          item.isCustom
            ? Boolean(item.productName && stripHtml(item.productName).length >= 2)
            : Boolean(
                (item.productId && item.variantId) ||
                (item.productName && stripHtml(item.productName).length >= 2),
              ),
        ),
      { message: "Each item must have a selected variant or a custom product name" },
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
  const body = await request.json();
  const parsed = comboSchema.safeParse(body);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message))
      .join(", ");
    return NextResponse.json({ error: errorDetails || "Invalid combo data" }, { status: 400 });
  }
  await connectDb();
  try {
    const rawSlug = slugify(stripHtml(parsed.data.name));
    const slug = rawSlug || `combo-${Date.now()}`;
    const combo = await ComboModel.create({
      ...parsed.data,
      slug,
      startsAt: parseSafeDate(parsed.data.startsAt),
      endsAt: parseSafeDate(parsed.data.endsAt),
    });
    return NextResponse.json({ data: JSON.parse(JSON.stringify(combo)) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save combo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

