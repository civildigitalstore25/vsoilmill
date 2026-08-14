import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { ProductModel } from "@/models/Product";
import { slugify } from "@/lib/utils/format";
import { z } from "zod";
import { USER_ROLES } from "@/constants/auth";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(2),
  shortDescription: z.string().optional(),
  images: z.array(z.string()).default([]),
  categoryId: z.string(),
  variants: z
    .array(
      z.object({
        label: z.string(),
        sku: z.string(),
        originalPrice: z.number(),
        price: z.number(),
        stock: z.number(),
        weightGrams: z.number().optional(),
      }),
    )
    .min(1),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
      canonicalUrl: z.string().optional(),
    })
    .optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
    return null;
  }
  return session;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    await connectDb();
    const query: Record<string, unknown> = {};
    if (searchParams.get("active") !== "false") query.isActive = true;
    if (searchParams.get("bestSeller") === "true") query.isBestSeller = true;
    const products = await ProductModel.find(query)
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data: JSON.parse(JSON.stringify(products)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDb();
    const product = await ProductModel.create({
      ...parsed.data,
      slug: parsed.data.slug || slugify(parsed.data.name),
    });
    return NextResponse.json({ data: JSON.parse(JSON.stringify(product)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Create failed" },
      { status: 500 },
    );
  }
}
