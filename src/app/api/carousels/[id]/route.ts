import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { USER_ROLES } from "@/constants/auth";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { CarouselModel } from "@/models/Carousel";
import { carouselSchema } from "@/lib/carousels/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid slide ID" }, { status: 400 });
    }

    await connectDb();
    const slide = await CarouselModel.findById(id).lean();
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ data: JSON.parse(JSON.stringify(slide)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch slide" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid slide ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = carouselSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDb();
    const slide = await CarouselModel.findByIdAndUpdate(
      id,
      parsed.data,
      { new: true, runValidators: true },
    ).lean();

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/carousels");

    return NextResponse.json({ data: JSON.parse(JSON.stringify(slide)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid slide ID" }, { status: 400 });
    }

    await connectDb();
    const deleted = await CarouselModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/carousels");

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}
