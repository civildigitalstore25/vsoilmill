import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { USER_ROLES } from "@/constants/auth";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { CategoryModel } from "@/models/Category";
import { slugify } from "@/lib/utils/format";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  badge: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    await connectDb();
    const categories = await CategoryModel.find().sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ data: JSON.parse(JSON.stringify(categories)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDb();
    const category = await CategoryModel.create({
      ...parsed.data,
      slug: parsed.data.slug || slugify(parsed.data.name),
    });

    revalidatePath("/", "layout");
    revalidatePath("/shop");
    return NextResponse.json({ data: JSON.parse(JSON.stringify(category)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Create failed" },
      { status: 500 },
    );
  }
}
