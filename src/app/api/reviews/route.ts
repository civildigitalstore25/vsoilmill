import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db/mongoose";
import { ReviewModel } from "@/models/Review";
import { ProductModel } from "@/models/Product";

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
    await connectDb();
    const review = await ReviewModel.create({
      ...parsed.data,
      isApproved: false,
      isVerified: false,
    });

    const stats = await ReviewModel.aggregate([
      {
        $match: {
          productId: review.productId,
          isApproved: true,
        },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (stats[0]) {
      await ProductModel.findByIdAndUpdate(parsed.data.productId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount,
      });
    }

    return NextResponse.json({ data: JSON.parse(JSON.stringify(review)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
