import { Types } from "mongoose";
import { ProductModel } from "@/models/Product";
import { ReviewModel } from "@/models/Review";

export async function recalculateProductReviewStats(
  productId: string | Types.ObjectId,
): Promise<void> {
  const id =
    typeof productId === "string" ? new Types.ObjectId(productId) : productId;

  const stats = await ReviewModel.aggregate([
    { $match: { productId: id, isApproved: true } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats[0]
    ? Math.round(stats[0].averageRating * 10) / 10
    : 0;
  const reviewCount = stats[0]?.reviewCount ?? 0;

  await ProductModel.findByIdAndUpdate(id, { averageRating, reviewCount });
}
