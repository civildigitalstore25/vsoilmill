import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const user = await UserModel.findById(session.user.id)
      .select("-passwordHash")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: JSON.parse(JSON.stringify(user)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid profile data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDb();
    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      {
        name: parsed.data.name,
        phone: parsed.data.phone ?? "",
      },
      { new: true },
    )
      .select("-passwordHash")
      .lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 },
    );
  }
}
