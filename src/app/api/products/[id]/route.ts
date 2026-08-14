import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { ProductModel } from "@/models/Product";
import { slugify } from "@/lib/utils/format";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await connectDb();
    const product = await ProductModel.findById(id).populate("categoryId").lean();
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: JSON.parse(JSON.stringify(product)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    await connectDb();

    if (body.name && !body.slug) {
      body.slug = slugify(body.name);
    }

    const product = await ProductModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const productObj = product as { slug?: string };

    // Revalidate public page caches
    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/bestsellers");
    if (productObj.slug) {
      revalidatePath(`/products/${productObj.slug}`);
    }

    return NextResponse.json({ data: JSON.parse(JSON.stringify(product)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDb();
    const deletedProduct = (await ProductModel.findByIdAndDelete(id)) as { slug?: string } | null;

    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/bestsellers");
    if (deletedProduct?.slug) {
      revalidatePath(`/products/${deletedProduct.slug}`);
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}
