import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { auth } from "@/lib/auth/auth";
import { ReviewModel } from "@/models/Review";
import { OrderModel } from "@/models/Order";
import { recalculateProductReviewStats } from "@/lib/reviews/stats";
import { PaymentStatus } from "@/types/order";

const schema = z.object({
  productId: z.string(),
  authorName: z.string().min(2),
  rating: z.number().min(1).max(5),
  body: z.string().min(5),
});

export async function GET(request: Request) {
  try {
    const productId = new URL(request.url).searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }
    await connectDb();
    const reviews = await ReviewModel.find({
      productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data: JSON.parse(JSON.stringify(reviews)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const session = await auth();
    await connectDb();

    let isVerified = false;
    if (session?.user?.id) {
      const purchased = await OrderModel.exists({
        userId: session.user.id,
        paymentStatus: PaymentStatus.PAID,
        "items.productId": parsed.data.productId,
      });
      isVerified = Boolean(purchased);
    }

    const review = await ReviewModel.create({
      ...parsed.data,
      userId: session?.user?.id,
      isApproved: false,
      isVerified,
    });

    await recalculateProductReviewStats(parsed.data.productId);

    return NextResponse.json({ data: JSON.parse(JSON.stringify(review)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
