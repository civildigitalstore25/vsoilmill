import { AdminReviewsClient } from "@/components/features/admin/AdminReviewsClient";
import { connectDb } from "@/lib/db/mongoose";
import { ReviewModel } from "@/models/Review";

export default async function AdminReviewsPage() {
  await connectDb();
  const reviews = JSON.parse(
    JSON.stringify(await ReviewModel.find().sort({ createdAt: -1 }).lean()),
  );

  return <AdminReviewsClient reviews={reviews} />;
}
