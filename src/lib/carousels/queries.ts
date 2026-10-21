import { connectDb } from "@/lib/db/mongoose";
import { CarouselModel } from "@/models/Carousel";
import type { CarouselSlide } from "@/types/carousel";

function serializeCarousel(doc: Record<string, unknown>): CarouselSlide {
  return JSON.parse(JSON.stringify(doc)) as CarouselSlide;
}

/**
 * Fetch active carousel slides for the public storefront.
 * Sorted by sortOrder ascending, then createdAt ascending.
 */
export async function getActiveCarousels(): Promise<CarouselSlide[]> {
  try {
    await connectDb();
    const slides = await CarouselModel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    return slides.map((s) => serializeCarousel(s as Record<string, unknown>));
  } catch (error) {
    console.error("Error fetching active carousels:", error);
    return [];
  }
}

/**
 * Fetch all carousel slides (active and inactive) for the admin console.
 * Sorted by sortOrder ascending, then createdAt ascending.
 */
export async function getAllCarousels(): Promise<CarouselSlide[]> {
  try {
    await connectDb();
    const slides = await CarouselModel.find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    return slides.map((s) => serializeCarousel(s as Record<string, unknown>));
  } catch (error) {
    console.error("Error fetching all carousels for admin:", error);
    return [];
  }
}

/**
 * Fetch a single carousel slide by ID.
 */
export async function getCarouselById(id: string): Promise<CarouselSlide | null> {
  try {
    await connectDb();
    const slide = await CarouselModel.findById(id).lean();
    if (!slide) return null;
    return serializeCarousel(slide as Record<string, unknown>);
  } catch (error) {
    console.error(`Error fetching carousel ${id}:`, error);
    return null;
  }
}
