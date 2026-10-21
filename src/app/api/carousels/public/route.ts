import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { CarouselModel } from "@/models/Carousel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();
    const slides = await CarouselModel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .select("imageUrl navigationLink headline subheadline buttonText altText sortOrder isActive")
      .lean();

    return NextResponse.json(
      { data: JSON.parse(JSON.stringify(slides)) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch public carousels" },
      { status: 500 },
    );
  }
}
