import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { ReviewModel } from "@/models/Review";

const schema = z.object({
  id: z.string(),
  isApproved: z.boolean(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDb();
    const review = await ReviewModel.findByIdAndUpdate(
      parsed.data.id,
      { isApproved: parsed.data.isApproved },
      { new: true },
    ).lean();
    return NextResponse.json({ data: JSON.parse(JSON.stringify(review)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
