import { Types } from "mongoose";
import { ProductModel } from "@/models/Product";
import { ReviewModel } from "@/models/Review";
import type { OrderReviewTarget } from "@/types/review";

interface OrderReviewLine {
  productId?: string;
  name: string;
  variantLabel?: string;
}

export async function getDeliveredReviewTargets(
  userId: string,
  items: OrderReviewLine[],
): Promise<{ items: OrderReviewTarget[]; reviewedIds: string[] }> {
  const unique = new Map<string, OrderReviewTarget>();
  for (const item of items) {
    const productId = item.productId ? String(item.productId) : "";
    if (!productId || !Types.ObjectId.isValid(productId) || unique.has(productId)) continue;
    unique.set(productId, {
      productId,
      name: item.name,
      variantLabel: item.variantLabel ?? "",
    });
  }

  const ids = [...unique.keys()];
  if (!ids.length) return { items: [], reviewedIds: [] };

  const products = await ProductModel.find({ _id: { $in: ids } }).select("_id").lean();
  const valid = new Set(products.map((product) => String(product._id)));
  const reviewItems = ids.flatMap((id) => {
    const target = unique.get(id);
    return valid.has(id) && target ? [target] : [];
  });
  if (!reviewItems.length) return { items: [], reviewedIds: [] };

  const existing = await ReviewModel.find({
    userId,
    productId: { $in: reviewItems.map((item) => item.productId) },
  })
    .select("productId")
    .lean();

  return {
    items: reviewItems,
    reviewedIds: existing.map((review) => String(review.productId)),
  };
}
